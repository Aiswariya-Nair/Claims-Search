# Claims Management System

A comprehensive Claims Search & Filter UI system built with **Angular 17+** frontend and **Spring Boot** backend, using **PostgreSQL** database.

## 🏗️ Project Structure

```
Claims Project/
├── claims-backend/          # Spring Boot backend API
├── claims-search-ui/        # Angular 17+ frontend
├── claims-backend-simple/   # Node.js simple backend (alternative)
├── Claimsproject/          # Legacy Spring Boot project
├── setup-database.sql      # PostgreSQL database setup
└── README.md              # This file
```

## 🔧 Prerequisites

1. **Java 17** or higher
2. **Node.js 18** or higher
3. **PostgreSQL 12** or higher
4. **Angular CLI** (`npm install -g @angular/cli`)
5. **Maven 3.6** or higher

## 🚀 Quick Start

### 1. Database Setup

```bash
# Start PostgreSQL service
# Create database
createdb claims_db

# Run setup script
psql -d claims_db -f setup-database.sql
```

### 2. Backend Setup

```bash
cd claims-backend

# Install dependencies and start
mvn clean install
mvn spring-boot:run

# Or use the startup script on Windows
start-backend-postgres.bat
```

Backend will be available at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd claims-search-ui

# Install dependencies
npm install

# Start development server
ng serve --proxy-config proxy.conf.json

# Or use the startup script on Windows
start-frontend.bat
```

Frontend will be available at: `http://localhost:4200`

## 📊 Features

### Core Functionality

- **🔍 Advanced Search** - Full-text search across claims with multiple filters
- **📋 Rich Filtering** - Filter by status, dates, organizations, examiners, etc.
- **📊 Data Export** - Export search results as CSV, Excel, or JSON
- **🔄 Real-time Updates** - Live connection status and data refresh
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices

### Search Filters

- **Basic Filters**: Claim Number, Policy Number, Claimant Name, SSN
- **Date Filters**: Date of Loss, Reported Date (with range selection)
- **Multi-select Filters**: Status, Organizations, Loss States, Programs, Insurance Types, Examiners
- **Advanced Filters**: Affiliate Claim Number, Jurisdiction Claim Number, Employee Number

### Data Grid Features

- **Sortable Columns** - Click headers to sort by any column
- **Pagination** - Configurable page sizes (20, 50, 100 records per page)
- **Bulk Selection** - Select multiple claims for batch operations
- **Status Indicators** - Visual status badges with "R" for reopened claims

## 🛠️ API Endpoints

### Claims API

- `GET /api/claims` - Search claims with filters
- `GET /api/claims/{id}` - Get claim by ID
- `POST /api/claims` - Create new claim
- `GET /api/claims/export` - Export claims data

### Dropdown APIs

- `GET /api/claims/statuses` - Get claim statuses
- `GET /api/claims/loss-states` - Get loss states
- `GET /api/claims/programs` - Get programs
- `GET /api/claims/insurance-types` - Get insurance types
- `GET /api/claims/examiners` - Get examiners
- `GET /api/claims/organizations` - Get organizations

### Typeahead APIs

- `GET /api/claims/typeahead/employer?term={term}` - Employer search
- `GET /api/claims/typeahead/claim-number?term={term}` - Claim number search
- `GET /api/claims/typeahead/policy-number?term={term}` - Policy number search

## 📋 Sample API Response

```json
{
  "items": [
    {
      "claimId": 136895137,
      "claimNumber": "240000821",
      "claimStatusCode": 1,
      "examinerCode": "hkhan",
      "adjustingOfficeCode": "420",
      "stateCode": "AK",
      "incidentDate": "2024-03-13T12:00:00",
      "addDate": "2024-03-21T09:43:09.401771",
      "policyNumber": "POL012",
      "claimantName": "aa5, aa665",
      "ssn": "123456789",
      "status": "Open",
      "lossState": "Alaska",
      "programDesc": "Auto Insurance",
      "examiner": "Haseeb Khan",
      "insuranceTypeId": 4,
      "organizationCode": "ORG001"
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": 150
}
```

## 🎨 UI Components

### Search Form
- Quick search bar with typeahead
- Advanced filter panel with all search criteria
- Reset and Search buttons with appropriate icons

### Results Grid
- Sortable data table with claim information
- Pagination controls
- Bulk selection checkboxes
- Export buttons (📊 CSV, 📈 Excel, 📋 JSON)

### Status Indicators
- Open, Closed, Pending, Reopened status badges
- Red "R" badge for reopened claims
- Connection status indicator (🔌)

## 🔧 Configuration

### Backend Configuration (`application.properties`)

```properties
server.port=8080
server.servlet.context-path=/api

# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/claims_db
spring.datasource.username=postgres
spring.datasource.password=password

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:4200
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

### Frontend Configuration (`proxy.conf.json`)

```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## 📊 Database Schema

The system uses PostgreSQL with the main `claim` table containing:

- **Core Fields**: claim_id, claim_number, claim_status_code, examiner_code
- **Dates**: incident_date, add_date, incident_reported_date, claim_closed_date  
- **Organizations**: org1_code, org2_code, org3_code, org4_code
- **Financial**: estimated_incident_amount, total_payout_on_incident
- **Status**: active, status_flag, master_claim

## 🧪 Testing

### Backend Testing
```bash
cd claims-backend
mvn test
```

### Frontend Testing
```bash
cd claims-search-ui
ng test
```

### API Testing
Use the provided test endpoints:
- Health Check: `GET http://localhost:8080/api/health`
- Sample Search: `GET http://localhost:8080/api/claims?pageSize=5`

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd claims-backend
mvn clean package
java -jar target/claims-backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd claims-search-ui
ng build --configuration production
# Deploy dist/ folder to web server
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Verify database credentials in `application.properties`
   - Check if `claims_db` database exists

2. **CORS Issues**
   - Verify proxy configuration in `proxy.conf.json`
   - Check CORS settings in backend configuration

3. **Node.js/Angular Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Update Angular CLI: `npm install -g @angular/cli@latest`

4. **Port Conflicts**
   - Backend default: 8080
   - Frontend default: 4200
   - Change ports in respective configuration files if needed

## 📝 Notes

- The application includes standardized button symbols as per requirements:
  - 🔍 Search
  - 🗑️ Reset  
  - 📊 CSV Export
  - 📈 Excel Export
  - 📋 JSON Export
  - 🔌 Connection Test

- All API endpoints support filtering, sorting, and pagination
- The system is designed for high performance with indexed database queries
- Responsive design works on all device sizes

## 📞 Support

For issues or questions, please check the troubleshooting section above or refer to the API documentation.