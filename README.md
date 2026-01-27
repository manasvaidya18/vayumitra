# 🌬️ VayuMitra - Air Quality Monitoring Platform

**VayuMitra** (Sanskrit: वायुमित्र, meaning "Friend of Air") is a comprehensive air quality monitoring and prediction platform designed for both citizens and policymakers in India.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Features

### For Citizens
- **Real-time AQI Dashboard** - Live air quality data from CPCB official sources
- **Clean Air Score** - Weekly trend analysis with 7-day historical data
- **Health Risk Calculator** - Personalized risk assessment based on age and medical conditions
- **Best Time Predictor** - Hourly AQI forecast to plan outdoor activities
- **Shock Predictor** - Pollution spike alerts and predictions
- **Tree Impact Calculator** - Calculate environmental benefits of tree plantation
- **Wildlife Impact Tracker** - Monitor pollution effects on local species
- **AI Chatbot (Air Buddy)** - Get instant answers about air quality and health

### For Policymakers
- **Interactive Heatmap** - Station-wise AQI visualization across Delhi
- **Pollution Hotspots** - Identify and track high-pollution zones
- **Forecast & Warnings** - 72-hour AQI predictions using ML models
- **Policy Simulator** - Predict impact of policy interventions
- **Health Impact Analysis** - Track pollution-related health metrics
- **Traffic & Emissions** - Correlate traffic patterns with pollution levels
- **Reports & Exports** - Generate comprehensive analytical reports

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT-based with OAuth2
- **ML Models**: XGBoost for forecasting
- **Data Sources**: CPCB OGD, OpenWeatherMap, OpenAQ

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16 or higher
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vayumitra.git
cd vayumitra
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy the example file and edit with your API keys
copy .env.example .env
# Edit .env file with your actual API keys
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd vayumitra-final

# Install dependencies
npm install
```

## 🔑 API Keys Configuration

Create a `.env` file in the `backend` directory with the following keys:

```env
# Required: CPCB API Key (Get from https://data.gov.in/)
CPCB_API_KEY=your_cpcb_api_key_here

# Optional: Weather data
OPENWEATHERMAP_API_KEY=your_openweathermap_key_here

# Optional: Historical backup
OPENAQ_API_KEY=your_openaq_key_here

# Optional: AI Chatbot
NUGEN_API_KEY=your_nugen_key_here
# OR
OPENAI_API_KEY=your_openai_key_here

# JWT Secret (generate a random secure string)
SECRET_KEY=your_secret_key_here
```

### How to Get API Keys

1. **CPCB API Key** (Required):
   - Visit [data.gov.in](https://data.gov.in/)
   - Register for an account
   - Request API access
   - Use Resource ID: `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`

2. **OpenWeatherMap** (Optional):
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate API key from dashboard

3. **Nugen AI** (Optional - for chatbot):
   - Visit [Nugen.in](https://nugen.in/)
   - Create account and get API key

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
uvicorn main:app --reload
```

Backend will run on: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Start Frontend Server

Open a new terminal:

```bash
cd vayumitra-final
npm start
```

Frontend will run on: `http://localhost:3000`

### Default Login Credentials

Create an account using the signup page, or use these test credentials:
- **Citizen**: Register through the app
- **Policymaker**: Register through the app (select role during signup)

## 📁 Project Structure

```
vayumitra/
├── backend/
│   ├── ml_engine/           # ML models and data processing
│   │   ├── api_client.py    # Multi-source API integration
│   │   ├── forecast_3day.py # 72-hour AQI forecasting
│   │   ├── heatmap_prediction.py
│   │   └── models/          # Trained ML models
│   ├── routes/              # API endpoints
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── auth_utils.py        # JWT authentication
│   └── requirements.txt
│
└── vayumitra-final/
    ├── src/
    │   ├── api/             # API service layer
    │   ├── auth/            # Authentication components
    │   ├── citizen/         # Citizen dashboard & features
    │   └── policymaker/     # Policymaker analytics
    ├── public/
    └── package.json
```

## 🧪 ML Models

The platform uses XGBoost-based models for:
- **3-Day Forecasting**: Predicts AQI for next 72 hours using historical patterns
- **Heatmap Prediction**: Station-wise AQI predictions for geographic visualization
- **Weather Integration**: Combines meteorological data for improved accuracy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- CPCB (Central Pollution Control Board) for official air quality data
- OpenWeatherMap for weather data API
- OpenAQ for historical data backup
- All contributors and testers

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for cleaner air in India**
