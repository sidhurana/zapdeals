from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
import requests
import base64

cred = credentials.Certificate("../credentials.json")
initialize_app(cred)

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_scheme = HTTPBearer(auto_error=False)

async def verify_token(token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    if token:
        try:
            decoded_token = auth.verify_id_token(token.credentials)
            return decoded_token
        except Exception:
            raise HTTPException(status_code=401, detail="Unauthorized")
    return None

# Replace these with your actual keys
EBAY_CLIENT_ID = "Sudhirku-znapdeal-PRD-8b01dac8a-afac2203"
EBAY_CLIENT_SECRET = "PRD-b01dac8a84df-99b6-426c-b536-f521"

@app.get("/api/deals")
async def get_ebay_deals(token: dict = Depends(verify_token)):
    auth_str = f"{EBAY_CLIENT_ID}:{EBAY_CLIENT_SECRET}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()
    token_headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    token_data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope"
    }
    token_response = requests.post("https://api.ebay.com/identity/v1/oauth2/token", headers=token_headers, data=token_data)
    if token_response.status_code != 200:
        raise HTTPException(status_code=token_response.status_code, detail="Failed to obtain eBay access token")

    access_token = token_response.json().get("access_token")

    #url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=electronics&limit=20"
    #url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=deal&limit=50&filter=price:[10..100],conditionIds:{1000}"
    url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=smartphone%20Featured&limit=50&filter=price:[10..100],conditionIds:{1000}"


    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch eBay deals")

    items = response.json().get("itemSummaries", [])
    formatted = [
        {
            "title": item.get("title"),
            "price": f"{item['price']['value']} {item['price']['currency']}",
            "image": item.get("image", {}).get("imageUrl"),
            "url": item.get("itemWebUrl")
        }
        for item in items
    ]
    return formatted

