import os
import json
import logging
from typing import Any, Dict, List, Optional
import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import settings

logger = logging.getLogger("caresync.firebase")

_firebase_app = None
_firestore_db = None
_is_mock_mode = False


class MockDocumentReference:
    def __init__(self, collection_data: dict, doc_id: str):
        self._data = collection_data
        self.id = doc_id

    def get(self):
        class Snap:
            def __init__(self, data, doc_id):
                self._data = data
                self.id = doc_id
                self.exists = data is not None

            def to_dict(self):
                return self._data.copy() if self._data else {}

        return Snap(self._data.get(self.id), self.id)

    def set(self, data: dict, merge: bool = False):
        if merge and self.id in self._data:
            self._data[self.id].update(data)
        else:
            self._data[self.id] = data.copy()

    def update(self, data: dict):
        if self.id in self._data:
            self._data[self.id].update(data)
        else:
            self._data[self.id] = data.copy()

    def delete(self):
        self._data.pop(self.id, None)


class MockCollectionReference:
    def __init__(self, collection_data: dict):
        self._data = collection_data

    def document(self, doc_id: str) -> MockDocumentReference:
        return MockDocumentReference(self._data, doc_id)

    def stream(self):
        docs = []
        for doc_id, data in list(self._data.items()):
            class Snap:
                def __init__(self, d, i):
                    self._d = d
                    self.id = i
                    self.exists = True

                def to_dict(self):
                    return self._d.copy()

            docs.append(Snap(data, doc_id))
        return docs


class MockFirestoreClient:
    """In-memory Firestore client used when serviceAccountKey.json is not yet provided."""
    def __init__(self):
        self._store: Dict[str, Dict[str, dict]] = {
            "hospitals": {},
            "complaints": {},
            "announcements": {},
            "staff": {},
            "activity_logs": {},
            "district_capacities": {},
        }
        logger.info("Initialized in-memory Firestore client (Mock Mode).")

    def collection(self, name: str) -> MockCollectionReference:
        if name not in self._store:
            self._store[name] = {}
        return MockCollectionReference(self._store[name])


def initialize_firebase():
    global _firebase_app, _firestore_db, _is_mock_mode

    if _firebase_app is not None:
        return

    creds_path = settings.FIREBASE_CREDENTIALS_PATH

    # Check if a real service account file is present
    if os.path.exists(creds_path):
        try:
            cred = credentials.Certificate(creds_path)
            _firebase_app = firebase_admin.initialize_app(cred, {
                'projectId': settings.FIREBASE_PROJECT_ID,
                'storageBucket': settings.FIREBASE_STORAGE_BUCKET
            })
            _firestore_db = firestore.client()
            _is_mock_mode = False
            logger.info("Connected to Live Firebase project: %s", settings.FIREBASE_PROJECT_ID)
            return
        except Exception as e:
            logger.warning("Failed to initialize Firebase with %s: %s", creds_path, e)

    # Check if default Google Application Credentials exist
    if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        try:
            _firebase_app = firebase_admin.initialize_app()
            _firestore_db = firestore.client()
            _is_mock_mode = False
            logger.info("Connected to Firebase via GOOGLE_APPLICATION_CREDENTIALS")
            return
        except Exception as e:
            logger.warning("Default Google credentials failed: %s", e)

    # Fallback for development without serviceAccountKey
    if settings.USE_MOCK_FIREBASE_IF_NO_CREDS:
        logger.warning(
            "Service account key not found at '%s'. Running in local development mode with in-memory Firestore.",
            creds_path
        )
        _is_mock_mode = True
        _firestore_db = MockFirestoreClient()
    else:
        raise RuntimeError(f"Firebase credentials required at '{creds_path}'")


def get_db():
    if _firestore_db is None:
        initialize_firebase()
    return _firestore_db


def is_mock_mode() -> bool:
    return _is_mock_mode
