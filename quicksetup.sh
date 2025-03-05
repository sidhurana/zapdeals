# 1️⃣ Install system dependencies
sudo apt update && sudo apt install -y python3-pip nodejs npm

# 2️⃣ Clone repo
git clone https://github.com/YOUR_GITHUB/slickdeals-clone.git
cd slickdeals-clone

# 3️⃣ Setup backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &  # Run in background

# 4️⃣ Setup frontend
cd ../frontend
npm install
npm start

