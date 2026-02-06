# Unified Social Insights

## 📱 What Does This Application Do?

**Unified Social Insights** is a comprehensive social media analytics and AI-powered insights platform designed to help individuals, creators, businesses, and agencies make data-driven decisions about their social media presence.

### Core Functionality:

1. **Multi-Platform Social Media Integration**: Connect and manage multiple social media accounts from a unified dashboard
2. **Real-Time Analytics Dashboard**: Track followers, engagement, reach, impressions, and post performance across all connected platforms
3. **AI-Powered Insights**: Leverage advanced AI models (OpenAI GPT, Google Gemini, Anthropic Claude) to generate actionable recommendations, trend analysis, and content optimization suggestions
4. **Automated Reporting**: Generate and export comprehensive reports with customizable branding
5. **Account Management**: Securely connect, sync, and manage social media accounts with OAuth 2.0 authentication
6. **Performance Tracking**: Monitor growth metrics, engagement rates, and content performance over time

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1 with TypeScript
- **Routing**: React Router DOM v7
- **UI Components**: 
  - Headless UI & Hero Icons
  - Lucide React icons
  - Framer Motion for animations
- **Charts & Visualizations**: 
  - Chart.js v4.5
  - Recharts v3.1
  - React-ChartJS-2
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: Context API (AuthContext, ThemeContext)
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js with Express.js v4.18
- **Language**: JavaScript (CommonJS)
- **Database**: PostgreSQL 14 (via node-postgres/pg)
- **Caching**: Redis 7
- **Authentication**: 
  - Passport.js with strategies:
    - passport-local
    - passport-google-oauth20
    - passport-facebook
  - JWT (jsonwebtoken)
  - bcrypt/bcryptjs for password hashing
- **Security**: 
  - Helmet.js
  - express-rate-limit
  - express-validator
  - CORS
- **Background Jobs**: node-cron for scheduled tasks
- **API Communication**: Axios for external API calls

### AI Engine
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn with async support
- **AI Providers**:
  - OpenAI (GPT models)
  - Google Gemini
  - Anthropic Claude
  - DeepSeek (additional provider)
- **Data Processing**:
  - NumPy, Pandas, SciPy
  - scikit-learn for ML
  - PyTorch & Transformers
- **NLP**: NLTK, TextBlob, spaCy, sentence-transformers
- **Database**: 
  - PostgreSQL (via psycopg2-binary, SQLAlchemy, asyncpg)
  - Alembic for migrations
- **Caching**: Redis (redis, aioredis)
- **Task Queue**: Celery
- **Monitoring**: Sentry, Prometheus, structlog

### Database & Infrastructure
- **Primary Database**: PostgreSQL 14
- **Cache**: Redis 7
- **Containerization**: Docker Compose
- **Deployment**: Serverless-ready (serverless-http)

---

## 🔗 Social Platform Integrations

Currently integrated platforms:

### ✅ Fully Supported
1. **Instagram** 
   - Business/Creator accounts via Facebook Graph API v19.0
   - Metrics: followers, following, media count, post insights
   - OAuth 2.0 authentication
   
2. **Facebook**
   - Pages and personal profiles
   - Via Facebook Graph API
   - OAuth 2.0 with passport-facebook

### 🔄 Planned/In Development
Based on the codebase structure, the platform is designed to support:
- Twitter/X (infrastructure ready)
- LinkedIn (infrastructure ready)
- TikTok (infrastructure ready)

The application architecture supports adding additional platforms through the social accounts management system.

---

## 📊 Insights & Analytics Provided

### 1. **Real-Time Metrics**
- Follower counts and growth trends
- Engagement rates (likes, comments, shares)
- Reach and impressions
- Media/post counts
- Account-level statistics

### 2. **AI-Generated Insights** (Powered by OpenAI, Gemini, Anthropic)
- **Engagement Analysis**: Deep dive into what content resonates with your audience
- **Content Recommendations**: AI suggestions for optimal posting times and content types
- **Trend Detection**: Identify emerging patterns in your social media performance
- **Anomaly Detection**: Get alerts when engagement drops or spikes unexpectedly
- **Growth Strategies**: Personalized recommendations to increase followers and engagement
- **Confidence Scoring**: AI-generated confidence scores for insights reliability
- **Performance Summaries**: Natural language summaries of account performance

### 3. **Performance Tracking**
- Post-level analytics
- Time-series data for growth tracking
- Comparative analysis across platforms
- Best/worst performing content identification

### 4. **Automated Processing**
- Background jobs for periodic insight fetching and processing (configurable intervals)
- Automatic token refresh for social media accounts
- Real-time sync status tracking

### 5. **Reporting Features**
- Exportable reports (planned)
- White-label branding options (planned)
- PDF generation capabilities (planned)

---

## 👥 Current User Base

**Status**: Pre-launch / Early Development Phase

The application appears to be in active development with:
- Landing page with waitlist functionality
- User authentication system (register/login) implemented
- Multi-tier pricing model defined (Free, Pro, Business, Agency)
- No production user statistics available yet

### Pricing Tiers (Planned)
1. **Free Tier**: Basic stats and insights
2. **Pro Tier**: Advanced AI insights and analytics
3. **Business Tier**: Multiple accounts, team collaboration
4. **Agency Tier**: Multi-client management, white-label reports

---

## ⚠️ What's NOT Working / Incomplete Features

### 🔧 Known Limitations & Incomplete Features:

1. **Limited Platform Support**
   - Only Instagram and Facebook are fully implemented
   - Twitter/X, LinkedIn, TikTok integrations are not yet active
   - Backend routes exist but lack full implementation

2. **AI Engine Integration**
   - AI engine service requires configuration (API keys for OpenAI, Gemini, Anthropic)
   - Health check system indicates potential connectivity issues
   - Sync status shows "error" state handling suggesting integration challenges

3. **Authentication & Account Management**
   - OAuth flows partially implemented
   - Token refresh jobs exist but may need testing
   - Some social account sync operations show error handling without full recovery

4. **Missing Infrastructure**
   - No `.env` configuration files committed (need to be created)
   - Database migrations may need to be run
   - Redis and PostgreSQL need to be configured via docker-compose

5. **Incomplete Features**
   - Onboarding flow (commented out in routing)
   - Advanced reporting and PDF exports
   - White-label branding
   - Team collaboration features
   - Multi-client management for agencies
   - Payment integration for pricing tiers

6. **Testing & Quality**
   - Limited test coverage visible
   - No CI/CD pipelines configured
   - Development vs production environment separation needs work

7. **Documentation**
   - Missing setup instructions
   - No API documentation
   - Configuration guide needed
   - Deployment documentation absent

### 🚀 Quick Setup Requirements (For Development):

```bash
# 1. Start PostgreSQL and Redis
docker-compose up -d

# 2. Backend Setup
cd backend
npm install
# Create .env file with:
# - DATABASE_URL
# - JWT_SECRET
# - FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# - AI_ENGINE_URL
npm run dev

# 3. Frontend Setup
cd frontend
npm install
npm start

# 4. AI Engine Setup
cd ai-engine
pip install -r requirements.txt
# Create .env with:
# - OPENAI_API_KEY
# - GEMINI_API_KEY
# - ANTHROPIC_API_KEY
# - DATABASE_URL
uvicorn app.main:app --reload
```

---

## 📈 Project Status

**Current Phase**: Active Development (MVP)

**Completed**:
- ✅ Core authentication system
- ✅ Database schema and models
- ✅ Instagram & Facebook integration
- ✅ AI engine architecture
- ✅ Frontend dashboard UI
- ✅ Basic analytics display

**In Progress**:
- 🔄 Full AI insights processing pipeline
- 🔄 Multi-platform expansion
- 🔄 Production deployment configuration

**Planned**:
- 📋 Additional social platforms
- 📋 Advanced reporting & exports
- 📋 Team collaboration features
- 📋 Payment integration
- 📋 Mobile app

---

## 🤝 Contributing

This project is actively being developed. Contributions, issues, and feature requests are welcome.

## 📄 License

See LICENSE file for details.
