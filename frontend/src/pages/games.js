@app.get("/api/deals")
async def get_ebay_deals(token: dict = Depends(verify_token)):
    # Step 1: Get access token
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

    # Step 2: Fetch deals with fieldgroups=FULL
    #url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=video%20Headphones&limit=50&fieldgroups=FULL"
    url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=headphones&limit=50&fieldgroups=FULL"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch eBay deals")

    return response.json().get("itemSummaries", [])
