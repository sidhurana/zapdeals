# auth.py
import firebase_admin
from firebase_admin import auth, credentials

# Initialize Firebase Admin SDK
cred = credentials.Certificate("path/to/your/firebase-adminsdk.json")  # Download this from Firebase Console
firebase_admin.initialize_app(cred)

def verify_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print("Token verification failed:", e)
        return None

