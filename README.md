# Pupper Dog Adoption App

A modern, AI-powered dog adoption platform specifically designed for Labrador Retrievers, built with AWS serverless architecture and React. The application provides shelters with tools to list dogs for adoption while offering users an intuitive Tinder-like swiping interface to discover their perfect companion.

## 🏗️ Architecture Overview

The Pupper App follows a serverless architecture pattern with the following components:

- **Frontend**: React 19 with TypeScript, Material-UI, and Vite
- **API**: AWS API Gateway with REST endpoints
- **Compute**: AWS Lambda (Python 3.9) with centralized business logic
- **Database**: Amazon DynamoDB (dogs and user interactions tables)
- **Storage**: Amazon S3 for multi-resolution image storage
- **Authentication**: Amazon Cognito User Pools
- **AI Services**: Amazon Rekognition for dog verification, Amazon Bedrock for image generation
- **Infrastructure**: AWS CDK for Infrastructure as Code

## ✨ Key Features

### Core Functionality
- **Tinder-Style Swiping**: Intuitive left/right swipe interface for browsing dogs
- **User Authentication**: Secure login system with Amazon Cognito
- **Favorites Management**: Track and revisit liked dogs
- **Comprehensive Dog Profiles**: Detailed information including shelter data, physical characteristics, and adoption history

### AI-Powered Features
- **Automatic Dog Verification**: Amazon Rekognition validates that uploaded photos contain Labrador Retrievers
- **AI Image Generation**: Amazon Bedrock Nova Canvas generates dog photos from text descriptions
- **Multi-Resolution Processing**: Automatic generation of original, standard (400x400), and thumbnail (50x50) images using PIL

### Admin Features
- **Dog Management**: Add, update, and manage dog listings
- **Interaction Tracking**: Monitor user engagement and preferences
- **Health Monitoring**: Built-in health check endpoints

## 📁 Project Structure

```
pupper-app/
├── backend/                    # Backend infrastructure and Lambda code
│   ├── backend/
│   │   ├── lambda.py          # Main Lambda function handler
│   │   ├── dynamodb.py        # DynamoDB table creation and management
│   │   ├── s3.py              # S3 bucket configuration
│   │   └── api.py             # API Gateway configuration
│   ├── tests/                 # Backend unit tests
│   ├── pyproject.toml         # Python dependencies
│   └── README.md
├── cdk-workshop/              # CDK deployment infrastructure
│   ├── cdk_workshop/
│   │   └── cdk_workshop_stack.py  # Main CDK stack definition
│   ├── layers/                # Lambda layers (Pillow)
│   ├── tests/                 # Infrastructure tests
│   ├── pyproject.toml         # CDK dependencies
│   └── app.py                 # CDK app entry point
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript type definitions
│   │   └── App.tsx            # Main application component
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│   └── README.md
├── .github/workflows/         # CI/CD pipeline
│   └── deploy.yml             # GitHub Actions deployment
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **AWS CLI** configured with appropriate permissions
- **Node.js** 18+ and npm
- **Python** 3.9+
- **AWS CDK** CLI installed globally

### 1. Clone and Setup

```bash
git clone <repository-url>
cd pupper-app
```

### 2. Backend Deployment

```bash
# Install backend dependencies
cd backend
pip install -e .

# Deploy infrastructure
cd ../cdk-workshop
pip install -e .
cdk bootstrap  # First time only
cdk deploy
```

**Note the API Gateway URL from the deployment outputs - you'll need this for the frontend.**

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment configuration
echo "VITE_API_URL=<your-api-gateway-url>" > .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -e .

# Run tests
pytest

# Update Lambda function (after deployment)
cd backend
zip -r function.zip lambda.py
aws lambda update-function-code --function-name <function-name> --zip-file fileb://function.zip
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Infrastructure Updates

```bash
cd cdk-workshop

# View changes
cdk diff

# Deploy changes
cdk deploy

# Destroy stack (careful!)
cdk destroy
```

## 📡 API Endpoints

### Dog Management
- `GET /dogs` - List all dogs with pagination
- `GET /dogs/{id}` - Get specific dog details
- `POST /dogs` - Create new dog listing (requires image upload)

### User Interactions
- `POST /interactions` - Record user interaction (LIKE/DISLIKE)
- `GET /likes` - Get all dogs liked by current user

### AI Features
- `POST /generate-preview` - Generate dog image from text description

### System
- `GET /health` - Health check endpoint

## 🗄️ Database Schema

### Dogs Table (`pupper-dogs`)
```json
{
  "id": "string (partition key)",
  "name": "string",
  "species": "string",
  "shelter": "string",
  "city": "string",
  "state": "string",
  "description": "string",
  "birthday": "string",
  "weightInPounds": "number",
  "color": "string",
  "photo": "string (S3 URL)",
  "originalPhoto": "string (S3 URL)",
  "thumbnailPhoto": "string (S3 URL)",
  "shelterEntryDate": "string"
}
```

### Interactions Table (`pupper-interactions`)
```json
{
  "userId": "string (partition key)",
  "dogId": "string (sort key)",
  "interaction": "LIKE | DISLIKE",
  "timestamp": "string"
}
```

## 🔐 Environment Variables

### Backend (Lambda)
- `BUCKET_NAME` - S3 bucket for dog photos
- `TABLE_NAME` - DynamoDB dogs table name
- `INTERACTIONS_TABLE` - DynamoDB interactions table name
- `REGION` - AWS region

### Frontend
- `VITE_API_URL` - API Gateway base URL

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
cd cdk-workshop
pytest tests/ -v
```

## 🚀 Deployment

### Automated Deployment (GitHub Actions)

The project includes a CI/CD pipeline that automatically:
1. Runs backend tests on pull requests
2. Deploys to AWS on pushes to `main` branch

Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Manual Deployment

```bash
# Deploy backend infrastructure
cd cdk-workshop
cdk deploy

# Build and deploy frontend (if using S3 + CloudFront)
cd ../frontend
npm run build
aws s3 sync dist/ s3://your-frontend-bucket/
```

## 💰 Cost Optimization

The application is designed with cost optimization in mind:

- **DynamoDB**: Pay-per-request pricing for variable workloads
- **Lambda**: 512MB memory allocation with 30-second timeout
- **S3**: Lifecycle policies for older images
- **API Gateway**: Caching enabled to reduce Lambda invocations
- **CloudWatch**: Configured log retention periods

See `cdk-workshop/cost_optimization.md` for detailed strategies.

## 🔒 Security Features

- **Authentication**: AWS Cognito User Pools with JWT tokens
- **Authorization**: Lambda function validates user tokens
- **CORS**: Properly configured for cross-origin requests
- **Input Validation**: Comprehensive validation for all API inputs
- **Image Processing**: Secure image handling with PIL
- **AI Verification**: Rekognition ensures only appropriate images

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI** for component library
- **Vite** for build tooling
- **AWS Amplify** for authentication
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **AWS Lambda** (Python 3.9)
- **AWS API Gateway** (REST API)
- **Amazon DynamoDB** (NoSQL database)
- **Amazon S3** (object storage)
- **Amazon Cognito** (authentication)
- **Amazon Rekognition** (image analysis)
- **Amazon Bedrock** (AI image generation)
- **PIL (Pillow)** for image processing

### Infrastructure
- **AWS CDK** (Python)
- **GitHub Actions** for CI/CD
- **AWS CloudWatch** for monitoring
- **AWS X-Ray** for tracing

## 📈 Monitoring and Observability

- **CloudWatch Logs**: Centralized logging for Lambda functions
- **CloudWatch Metrics**: Custom metrics for API performance
- **X-Ray Tracing**: Distributed tracing for request flows
- **Health Checks**: Built-in health monitoring endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Lambda timeout errors**: Increase timeout in CDK stack or optimize image processing
**CORS errors**: Verify API Gateway CORS configuration
**Authentication failures**: Check Cognito User Pool configuration
**Image upload failures**: Verify S3 bucket permissions and Lambda IAM roles

### Getting Help

1. Check the logs in CloudWatch
2. Verify environment variables are set correctly
3. Ensure AWS credentials have proper permissions
4. Review the API documentation in `backend/API.md`

## 🔮 Future Enhancements

- **Mobile App**: React Native implementation
- **Advanced Matching**: ML-based compatibility scoring
- **Real-time Chat**: WebSocket integration for shelter communication
- **Geolocation**: Location-based dog discovery
- **Push Notifications**: User engagement features
- **Admin Dashboard**: Comprehensive shelter management interface