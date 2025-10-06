// Test script to verify our frontend changes
const https = require('https');
const http = require('http');

// Mock environment configuration
const environment = {
  production: false,
  apiUrl: '/api'
};

// Mock API service URL construction
function buildUrl(baseUrl, endpoint) {
  // Ensure proper URL construction with slashes
  if (!baseUrl) {
    return endpoint;
  }
  
  // Remove trailing slash from baseUrl and leading slash from endpoint to avoid double slashes
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  
  return base + path;
}

// Test the URL construction
console.log('Testing URL construction:');
console.log('Environment API URL:', environment.apiUrl);
console.log('Claims endpoint:', buildUrl(environment.apiUrl, 'claims'));
console.log('Health endpoint:', '/health'); // Health endpoint is at root level
console.log('Fetch MyQueue endpoint:', buildUrl(environment.apiUrl, 'fetchMyqueue'));
console.log('Claims export endpoint:', buildUrl(environment.apiUrl, 'claims/export'));
console.log('Claim by ID endpoint:', buildUrl(environment.apiUrl, 'claims/123'));

// Test making a request to our mock backend
console.log('\nTesting connection to mock backend...');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/health', // Health endpoint is at root level
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();