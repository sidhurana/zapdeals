# main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
import requests

# Initialize Firebase Admin SDK
cred = credentials.Certificate("../credentials.json")  # Update the path if needed
initialize_app(cred)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Use HTTPBearer to handle optional token authentication
auth_scheme = HTTPBearer(auto_error=False)  # `auto_error=False` makes token optional

# 🔹 Function to verify Firebase token (optional authentication)
async def verify_token(token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    if token:  # Only verify if token exists
        try:
            decoded_token = auth.verify_id_token(token.credentials)  # Extract Bearer token
            return decoded_token
        except Exception as e:
            raise HTTPException(status_code=401, detail="Unauthorized")
    return None  # No token means no authentication, but still allow request

# 🔹 Route to fetch deals from CheapShark (open to all users)
@app.get("/api/deals")
async def get_deals(token: dict = Depends(verify_token)):  # Token is now optional
    response = requests.get("https://www.cheapshark.com/api/1.0/deals")
    data = response.json()
    return data  # Return all deals, even if no login

# Add other routes as necessary

