#!/bin/bash

echo "🚀 Deploying CRM Backend to Render.com..."

# Create a new directory for Render deployment
mkdir -p render-deploy
cd render-deploy

# Copy backend files
cp -r ../backend/* .

# Create Render configuration
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
    healthCheckPath: /health
EOF

# Create a simple README for deployment
cat > README.md << EOF
# CRM Backend

This is the backend API for the CRM application.

## Deployment

This service is deployed on Render.com.

## API Endpoints

- \`GET /health\` - Health check
- \`GET /api/me\` - Get current user
- \`POST /api/login\` - Login
- \`POST /api/register\` - Register
- \`POST /api/logout\` - Logout
- \`GET /api/customers\` - Get customers
- \`POST /api/customers\` - Create customer
- \`GET /api/deals\` - Get deals
- \`POST /api/deals\` - Create deal

## Environment Variables

- \`NODE_ENV\` - Set to 'production'
EOF

# Initialize git repository
git init
git add .
git commit -m "Initial Render deployment"

echo "✅ Render deployment files created!"
echo "📁 Files are in: render-deploy/"
echo ""
echo "🌐 To deploy to Render.com:"
echo "1. Go to https://render.com"
echo "2. Create a new Web Service"
echo "3. Connect to this repository"
echo "4. Set build command: npm install"
echo "5. Set start command: npm start"
echo "6. Set health check path: /health"
echo ""
echo "🔗 Your backend will be available at: https://your-service-name.onrender.com" 