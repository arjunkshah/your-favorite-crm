#!/bin/bash

echo "🚀 Deploying CRM Backend to Render.com..."

# Create a new directory for backend deployment
mkdir -p backend-deploy
cd backend-deploy

# Copy backend files
cp -r ../backend/* .

# Create a simple deployment configuration
cat > render.yaml << EOF
services:
  - type: web
    name: crm-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
EOF

# Initialize git repository for deployment
git init
git add .
git commit -m "Initial backend deployment"

echo "✅ Backend deployment files created!"
echo "📁 Backend files are in: backend-deploy/"
echo ""
echo "🌐 To deploy to Render.com:"
echo "1. Go to https://render.com"
echo "2. Connect your GitHub repository"
echo "3. Create a new Web Service"
echo "4. Point to the backend/ directory"
echo "5. Set build command: npm install"
echo "6. Set start command: npm start"
echo ""
echo "🔗 Your backend will be available at: https://your-backend-name.onrender.com" 