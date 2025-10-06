// Simple mock backend server for testing
const express = require('express');
const app = express();
const port = 8080;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Mock health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Mock Claims Backend API',
    version: '1.0.0'
  });
});

// Mock claims endpoint
app.get('/api/claims', (req, res) => {
  res.json({
    items: [
      {
        claimId: 1,
        claimNumber: 'CLM001',
        status: 'Open',
        examiner: 'John Doe',
        stateCode: 'CA',
        incidentDate: '2025-01-15',
        policyNumber: 'POL001',
        claimantName: 'Alice Smith',
        ssn: '123-45-6789',
        programDesc: 'Auto Insurance',
        organizationCode: 'ORG001'
      },
      {
        claimId: 2,
        claimNumber: 'CLM002',
        status: 'Closed',
        examiner: 'Jane Doe',
        stateCode: 'NY',
        incidentDate: '2025-02-20',
        policyNumber: 'POL002',
        claimantName: 'Bob Johnson',
        ssn: '987-65-4321',
        programDesc: 'Home Insurance',
        organizationCode: 'ORG002'
      }
    ],
    page: 1,
    pageSize: 25,
    total: 2
  });
});

// Mock dropdown endpoints
app.get('/api/claims/statuses', (req, res) => {
  res.json([
    { code: 'OPEN', description: 'Open' },
    { code: 'CLOSED', description: 'Closed' },
    { code: 'PENDING', description: 'Pending' }
  ]);
});

app.get('/api/claims/programs', (req, res) => {
  res.json([
    { code: 'AUTO', description: 'Auto Insurance' },
    { code: 'HOME', description: 'Home Insurance' },
    { code: 'LIFE', description: 'Life Insurance' }
  ]);
});

app.get('/api/claims/loss-states', (req, res) => {
  res.json([
    { code: 'CA', description: 'California' },
    { code: 'NY', description: 'New York' },
    { code: 'TX', description: 'Texas' }
  ]);
});

app.get('/api/claims/insurance-types', (req, res) => {
  res.json([
    { code: 'FULL', description: 'Full Coverage' },
    { code: 'BASIC', description: 'Basic Coverage' }
  ]);
});

app.get('/api/claims/examiners', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]);
});

app.get('/api/claims/organizations', (req, res) => {
  res.json([
    { code: 'ORG001', description: 'Organization 1' },
    { code: 'ORG002', description: 'Organization 2' }
  ]);
});

// Start server
app.listen(port, () => {
  console.log(`Mock backend server running at http://localhost:${port}`);
  console.log(`Health endpoint: http://localhost:${port}/api/health`);
  console.log(`Claims endpoint: http://localhost:${port}/api/claims`);
});