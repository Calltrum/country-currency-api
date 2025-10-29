# Country Currency & Exchange API 🌍💱

A RESTful API that fetches country data from external sources, calculates estimated GDP, stores data in MySQL, and provides CRUD operations with filtering and image generation capabilities.

## 🚀 Live Demo

**Production URL:** `https://your-app-name.up.railway.app`

**GitHub Repository:** `https://github.com/yourusername/country-currency-api`

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Author](#author)

---

## ✨ Features

- 🌐 **Fetch Country Data**: Retrieves data from REST Countries API
- 💱 **Exchange Rates**: Fetches real-time exchange rates
- 📊 **GDP Estimation**: Calculates estimated GDP for each country
- 🗄️ **MySQL Database**: Persistent data storage with caching
- 🔍 **Advanced Filtering**: Filter by region, currency, sort by GDP
- 🖼️ **Image Generation**: Auto-generates summary images with top countries
- 🔄 **Smart Refresh**: Updates existing data, inserts new countries
- ⚡ **Error Handling**: Comprehensive error responses with appropriate status codes

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MySQL
- **Image Generation**: node-canvas
- **HTTP Client**: axios
- **Environment Management**: dotenv

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

Verify installations:
```bash
node --version
npm --version
mysql --version
git --version
```

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/country-currency-api.git
cd country-currency-api
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web framework
- `mysql2` - MySQL client
- `axios` - HTTP client for external APIs
- `dotenv` - Environment variable management
- `cors` - Cross-Origin Resource Sharing
- `canvas` - Image generation
- `nodemon` - Development auto-restart (dev dependency)

### 3. Create Environment File

Create a `.env` file in the root directory:
```bash
touch .env  # Mac/Linux
type nul > .env  # Windows
```

Add the following content:
```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=country_api
DB_CONNECTION_LIMIT=10
```

---

## 🗄️ Database Setup

### 1. Start MySQL Server

**Mac/Linux:**
```bash
sudo systemctl start mysql
# OR
brew services start mysql
```

**Windows:**
- Open "Services" app
- Find "MySQL" service
- Click "Start"

### 2. Login to MySQL
```bash
mysql -u root -p
```

Enter your MySQL root password.

### 3. Create Database and Table

Copy and paste the following SQL commands:
```sql
-- Create database
CREATE DATABASE country_api;
USE country_api;

-- Create countries table
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  capital VARCHAR(255),
  region VARCHAR(100),
  population BIGINT NOT NULL,
  currency_code VARCHAR(10),
  exchange_rate DECIMAL(15, 6),
  estimated_gdp DECIMAL(20, 2),
  flag_url TEXT,
  last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_region (region),
  INDEX idx_currency (currency_code)
);

-- Verify table creation
DESCRIBE countries;

-- Exit MySQL
EXIT;
```

---

## 🚀 Running Locally

### Development Mode (with auto-restart)
```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically restart when you save changes.

### Production Mode
```bash
npm start
```

### Verify Server is Running

Open your browser and navigate to:
```
http://localhost:3000
```

You should see:
```json
{
  "message": "Country Currency & Exchange API",
  "endpoints": {
    "refresh": "POST /countries/refresh",
    "get_all": "GET /countries",
    "get_one": "GET /countries/:name",
    "delete": "DELETE /countries/:name",
    "status": "GET /status",
    "image": "GET /countries/image"
  }
}
```

---

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:3000`
- **Production**: `https://your-app-name.up.railway.app`

---

### 1. Refresh Countries Data

Fetches data from external APIs, processes it, and stores in database.

**Endpoint:** `POST /countries/refresh`

**Request:**
```bash
POST /countries/refresh
```

**Success Response (200 OK):**
```json
{
  "message": "Countries refreshed successfully",
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00.000Z"
}
```

**Error Responses:**

- **503 Service Unavailable** - External API failed:
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from REST Countries API"
}
```

- **500 Internal Server Error**:
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

**What it does:**
1. Fetches all countries from REST Countries API
2. Fetches exchange rates from Exchange Rate API
3. Calculates estimated GDP for each country
4. Stores or updates data in MySQL
5. Generates summary image with top 5 countries

**Currency Handling:**
- If country has multiple currencies: stores only first one
- If no currency: sets `currency_code`, `exchange_rate`, and `estimated_gdp` to null
- If currency not in exchange rates: sets `exchange_rate` and `estimated_gdp` to null

**Update Logic:**
- Existing countries (matched by name, case-insensitive): updates all fields
- New countries: inserts new records
- Fresh random GDP multiplier (1000-2000) generated for each country on every refresh

---

### 2. Get All Countries

Retrieves all countries from database with optional filtering and sorting.

**Endpoint:** `GET /countries`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `region` | string | Filter by region | `Africa`, `Europe`, `Asia` |
| `currency` | string | Filter by currency code | `NGN`, `USD`, `GBP` |
| `sort` | string | Sort order | `gdp_desc`, `gdp_asc` |

**Examples:**
```bash
# Get all countries
GET /countries

# Get all African countries
GET /countries?region=Africa

# Get all countries using Nigerian Naira
GET /countries?currency=NGN

# Get all countries sorted by GDP (highest first)
GET /countries?sort=gdp_desc

# Combine filters
GET /countries?region=Africa&sort=gdp_desc
```

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  },
  {
    "id": 2,
    "name": "Ghana",
    "capital": "Accra",
    "region": "Africa",
    "population": 31072940,
    "currency_code": "GHS",
    "exchange_rate": 15.34,
    "estimated_gdp": 3029834520.6,
    "flag_url": "https://flagcdn.com/gh.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  }
]
```

**Error Response:**

- **500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

### 3. Get Specific Country

Retrieves a single country by name.

**Endpoint:** `GET /countries/:name`

**Example:**
```bash
GET /countries/Nigeria
GET /countries/United States
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}
```

**Error Responses:**

- **404 Not Found**:
```json
{
  "error": "Country not found"
}
```

- **500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

### 4. Delete Country

Removes a country from the database.

**Endpoint:** `DELETE /countries/:name`

**Example:**
```bash
DELETE /countries/Nigeria
```

**Success Response (204 No Content):**

Empty response body with status code 204.

**Error Responses:**

- **404 Not Found**:
```json
{
  "error": "Country not found"
}
```

- **500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

### 5. Get API Status

Returns total number of countries and last refresh timestamp.

**Endpoint:** `GET /status`

**Example:**
```bash
GET /status
```

**Success Response (200 OK):**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00.000Z"
}
```

**Error Response:**

- **500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

### 6. Get Summary Image

Serves the auto-generated summary image showing top countries by GDP.

**Endpoint:** `GET /countries/image`

**Example:**
```bash
GET /countries/image
```

**Success Response (200 OK):**

Returns PNG image file.

**Image Contains:**
- Total number of countries
- Top 5 countries by estimated GDP
- Last refresh timestamp

**Error Responses:**

- **404 Not Found** - Image hasn't been generated yet:
```json
{
  "error": "Summary image not found"
}
```

**Note:** Image is generated automatically when `/countries/refresh` is called.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_USER` | MySQL username | `root` | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | `country_api` | Yes |
| `DB_CONNECTION_LIMIT` | Max connections | `10` | No |

**Example `.env` file:**
```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=country_api
DB_CONNECTION_LIMIT=10
```

**For production (Railway):**
```env
# Railway auto-provides DATABASE_URL
DATABASE_URL=mysql://user:pass@host:port/database
```

---

## 🧪 Testing

### Using Postman

#### Test 1: Refresh Countries
```
Method: POST
URL: http://localhost:3000/countries/refresh
Expected: 200 status with success message
Time: ~10-15 seconds (fetching external APIs)
```

#### Test 2: Get All Countries
```
Method: GET
URL: http://localhost:3000/countries
Expected: 200 status with array of countries
```

#### Test 3: Filter by Region
```
Method: GET
URL: http://localhost:3000/countries?region=Africa
Expected: Only African countries
```

#### Test 4: Filter by Currency
```
Method: GET
URL: http://localhost:3000/countries?currency=USD
Expected: Only countries using USD
```

#### Test 5: Sort by GDP
```
Method: GET
URL: http://localhost:3000/countries?sort=gdp_desc
Expected: Countries sorted by GDP (highest first)
```

#### Test 6: Get Specific Country
```
Method: GET
URL: http://localhost:3000/countries/Nigeria
Expected: 200 status with Nigeria data
```

#### Test 7: Get Non-existent Country
```
Method: GET
URL: http://localhost:3000/countries/Atlantis
Expected: 404 status with error message
```

#### Test 8: Get Status
```
Method: GET
URL: http://localhost:3000/status
Expected: Total countries and last refresh time
```

#### Test 9: Get Summary Image
```
Method: GET
URL: http://localhost:3000/countries/image
Expected: PNG image displayed/downloaded
```

#### Test 10: Delete Country
```
Method: DELETE
URL: http://localhost:3000/countries/TestCountry
Expected: 204 status (no content)
```

### Using cURL
```bash
# Refresh countries
curl -X POST http://localhost:3000/countries/refresh

# Get all countries
curl http://localhost:3000/countries

# Filter by region
curl "http://localhost:3000/countries?region=Africa"

# Get specific country
curl http://localhost:3000/countries/Nigeria

# Get status
curl http://localhost:3000/status

# Get image
curl http://localhost:3000/countries/image --output summary.png

# Delete country
curl -X DELETE http://localhost:3000/countries/Nigeria
```

---

## 🚀 Deployment

### Deploying to Railway

#### 1. Prepare for Deployment

**Ensure your `package.json` has:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

**Update `src/config/database.js` for Railway:**
```javascript
const mysql = require('mysql2/promise');

// Railway provides DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

let pool;

if (databaseUrl) {
  // Production: Use DATABASE_URL from Railway
  pool = mysql.createPool(databaseUrl);
} else {
  // Local development
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'country_api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = { pool };
```

#### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Country Currency API"
git branch -M main
git remote add origin https://github.com/yourusername/country-currency-api.git
git push -u origin main
```

#### 3. Deploy on Railway

1. Go to https://railway.app/
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `country-currency-api` repository
6. Click "Add Plugin" → Select "MySQL"
7. Railway will:
   - Auto-detect Node.js
   - Install dependencies
   - Provide DATABASE_URL automatically
   - Deploy your app

#### 4. Set Up Database

After MySQL plugin is added:

1. Click on MySQL plugin
2. Click "Connect"
3. Copy connection details
4. Use a MySQL client to connect and run:
```sql
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  capital VARCHAR(255),
  region VARCHAR(100),
  population BIGINT NOT NULL,
  currency_code VARCHAR(10),
  exchange_rate DECIMAL(15, 6),
  estimated_gdp DECIMAL(20, 2),
  flag_url TEXT,
  last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_region (region),
  INDEX idx_currency (currency_code)
);
```

**OR use Railway's built-in query tool.**

#### 5. Generate Domain

1. Go to your service in Railway
2. Click "Settings"
3. Click "Generate Domain"
4. Copy your public URL: `https://your-app.up.railway.app`

#### 6. Test Deployment
```bash
# Test your live API
curl -X POST https://your-app.up.railway.app/countries/refresh
curl https://your-app.up.railway.app/countries
curl https://your-app.up.railway.app/status
```

---

## 📁 Project Structure
```
country-currency-api/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection configuration
│   │   └── config.js            # Environment variables and settings
│   ├── models/
│   │   └── Country.js           # Country model with database operations
│   ├── controllers/
│   │   ├── countryController.js # Country endpoint business logic
│   │   └── statusController.js  # Status endpoint logic
│   ├── routes/
│   │   └── countryRoutes.js     # API route definitions
│   ├── services/
│   │   ├── externalAPI.js       # External API calls
│   │   ├── imageGenerator.js    # Summary image generation
│   │   └── dataProcessor.js     # Data processing and GDP calculation
│   └── server.js                # Express app entry point
├── cache/
│   └── summary.png              # Auto-generated image (gitignored)
├── .env                         # Environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Dependency lock file
└── README.md                    # This file
```

### File Descriptions

| File/Folder | Purpose |
|-------------|---------|
| `src/server.js` | Main entry point, configures Express app |
| `src/config/database.js` | MySQL connection pool setup |
| `src/config/config.js` | Centralized configuration management |
| `src/models/Country.js` | Database operations (CRUD) |
| `src/controllers/countryController.js` | Endpoint logic for countries |
| `src/controllers/statusController.js` | Status endpoint logic |
| `src/routes/countryRoutes.js` | Route definitions |
| `src/services/externalAPI.js` | Fetch data from external APIs |
| `src/services/dataProcessor.js` | Process and calculate GDP |
| `src/services/imageGenerator.js` | Generate summary images |
| `cache/` | Stores generated images |

---

## ⚠️ Error Handling

The API returns consistent JSON error responses:

| Status Code | Error Type | Example |
|-------------|------------|---------|
| **400** | Bad Request | Invalid or missing data |
| **404** | Not Found | Resource doesn't exist |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | External API failure |

**Error Response Format:**
```json
{
  "error": "Error type",
  "details": "Detailed error message"
}
```

**Examples:**
```json
// 404 Not Found
{
  "error": "Country not found"
}

// 400 Bad Request
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}

// 503 Service Unavailable
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from REST Countries API"
}

// 500 Internal Server Error
{
  "error": "Internal server error"
}
```

---

## 🔄 GDP Calculation Formula
```javascript
estimated_gdp = (population × random(1000, 2000)) / exchange_rate
```

**Where:**
- `population` = Country population
- `random(1000, 2000)` = Random multiplier between 1000 and 2000
- `exchange_rate` = Exchange rate relative to USD

**Example for Nigeria:**
```
Population: 206,139,589
Random multiplier: 1,500 (random between 1000-2000)
Exchange rate: 1,600.23 NGN/USD

GDP = (206,139,589 × 1,500) / 1,600.23
    = 309,209,383,500 / 1,600.23
    = 193,215,789.45
```

**Note:** Random multiplier is regenerated on every refresh for each country.

---

## 🌐 External APIs Used

### 1. REST Countries API

**URL:** `https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies`

**Provides:**
- Country name
- Capital city
- Region
- Population
- Flag URL
- Currency information

### 2. Exchange Rate API

**URL:** `https://open.er-api.com/v6/latest/USD`

**Provides:**
- Real-time exchange rates
- Base currency: USD
- All world currencies

---

## 📊 Data Flow
```
1. POST /countries/refresh called
         ↓
2. Fetch countries from REST Countries API
         ↓
3. Fetch exchange rates from Exchange Rate API
         ↓
4. For each country:
   - Extract currency code
   - Match with exchange rate
   - Calculate estimated GDP
   - Prepare data object
         ↓
5. Store/Update in MySQL database
   - Match by name (case-insensitive)
   - Update existing or insert new
         ↓
6. Generate summary image
   - Get top 5 countries by GDP
   - Create PNG with data
   - Save to cache/summary.png
         ↓
7. Return success response
```

---

## 🐛 Troubleshooting

### Issue 1: Database Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solutions:**
1. Check MySQL is running: `sudo systemctl status mysql`
2. Verify credentials in `.env`
3. Check MySQL user has permissions:
```sql
GRANT ALL PRIVILEGES ON country_api.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

### Issue 2: Canvas/Image Generation Errors

**Error:** `Error: Cannot find module 'canvas'`

**Solutions:**

**Mac:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

**Windows:**
```bash
# Use Windows Build Tools
npm install --global windows-build-tools
npm install canvas
```

---

### Issue 3: External API Timeout

**Error:** `503 Service Unavailable`

**Solutions:**
1. Check internet connection
2. Verify API URLs are accessible
3. Increase timeout in `src/services/externalAPI.js`:
```javascript
const response = await axios.get(url, { timeout: 30000 }); // 30 seconds
```

---

### Issue 4: Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solutions:**

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

## 📝 Notes

### Currency Handling

- **Multiple currencies**: Only first currency code is stored
- **No currency**: `currency_code`, `exchange_rate`, and `estimated_gdp` set to null
- **Currency not in exchange rates**: `exchange_rate` and `estimated_gdp` set to null
- Country records are stored regardless of currency availability

### Refresh Behavior

- **Existing countries**: All fields updated, including new random GDP multiplier
- **New countries**: Inserted as new records
- **Failed refresh**: No database modifications
- **Success**: Updates global `last_refreshed_at` timestamp

### Performance

- Average refresh time: 10-15 seconds
- Processes ~250 countries
- Generates image after database update
- Connection pooling for efficient database access

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Built for the HNG Internship Backend Track
- Data provided by [REST Countries API](https://restcountries.com/)
- Exchange rates from [Open Exchange Rates API](https://open.er-api.com/)
- Learn more about HNG: [https://hng.tech/internship](https://hng.tech/internship)

---

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

## 🔗 Related Links

- [HNG Internship](https://hng.tech/internship)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Railway Documentation](https://docs.railway.app/)
- [REST Countries API](https://restcountries.com/)
- [Exchange Rate API](https://www.exchangerate-api.com/)

---

**Made with ❤️ for the HNG Internship Program**
```

---

## ✅ README Customization Checklist

Before submitting, replace these placeholders:
```
[ ] https://your-app-name.up.railway.app → Your actual Railway URL
[ ] https://github.com/yourusername/country-currency-api → Your GitHub repo URL
[ ] yourusername → Your GitHub username (appears 3 times)
[ ] Your Name → Your actual name (appears 3 times)
[ ] your.email@example.com → Your email (appears 2 times)
[ ] yourprofile → Your LinkedIn username (appears 1 time)