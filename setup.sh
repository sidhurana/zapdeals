#!/bin/bash

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install required system packages
sudo apt-get install -y \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    redis-server \
    postgresql \
    postgresql-contrib \
    nginx \
    git \
    curl \
    wget \
    build-essential \
    libpq-dev

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
nvm install 20
nvm use 20

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Install Strapi
mkdir -p cms
cd cms
npx create-strapi-app@latest . --quickstart

# Create necessary directories
mkdir -p logs
mkdir -p data

# Set up PostgreSQL
sudo -u postgres psql -c "CREATE USER zapdeals WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "CREATE DATABASE zapdeals_db;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE zapdeals_db TO zapdeals;"

# Create .env file for backend
cat > backend/.env << EOL
DATABASE_URL=postgresql://zapdeals:your-password@localhost:5432/zapdeals_db
REDIS_URL=redis://localhost:6379/0
FIREBASE_CREDENTIALS_PATH=../credentials.json
EOL

# Create .env file for Strapi
cat > cms/.env << EOL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=zapdeals
DATABASE_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
API_TOKEN_SALT=your-api-token-salt
EOL

# Set up Nginx configuration
sudo tee /etc/nginx/sites-available/zapdeals << EOL
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /admin {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable Nginx configuration
sudo ln -s /etc/nginx/sites-available/zapdeals /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Create systemd service files
sudo tee /etc/systemd/system/zapdeals-backend.service << EOL
[Unit]
Description=ZapDeals Backend Service
After=network.target

[Service]
User=$USER
WorkingDirectory=$(pwd)
Environment="PATH=$(pwd)/venv/bin"
ExecStart=$(pwd)/venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOL

sudo tee /etc/systemd/system/zapdeals-frontend.service << EOL
[Unit]
Description=ZapDeals Frontend Service
After=network.target

[Service]
User=$USER
WorkingDirectory=$(pwd)
Environment="PATH=$(pwd)/venv/bin"
ExecStart=npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOL

sudo tee /etc/systemd/system/zapdeals-strapi.service << EOL
[Unit]
Description=ZapDeals Strapi Service
After=network.target

[Service]
User=$USER
WorkingDirectory=$(pwd)/cms
Environment="PATH=$(pwd)/venv/bin"
ExecStart=npm run develop
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable zapdeals-backend
sudo systemctl enable zapdeals-frontend
sudo systemctl enable zapdeals-strapi
sudo systemctl start zapdeals-backend
sudo systemctl start zapdeals-frontend
sudo systemctl start zapdeals-strapi

echo "Setup completed! Please update the .env files with your actual credentials and secrets." 