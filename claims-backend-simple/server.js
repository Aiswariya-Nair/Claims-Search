const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true
}));
app.use(express.json());

// Sample claims data
const sampleClaims = [
  {
    id: 1,
    claimId: 1,
    claimNumber: "CLM001",
    claimStatusCode: 1,
    examinerCode: "EX001",
    adjustingOfficeCode: "ADJ001",
    adjustingOfficeDesc: "Los Angeles Office",
    stateCode: "CA",
    incidentDate: "2024-01-15T10:30:00Z",
    addDate: "2024-01-16T09:00:00Z",
    policyNumber: "POL001",
    claimantName: "John Smith",
    ssn: "123-45-6789",
    status: "Open",
    lossState: "CA",
    programDesc: "Auto Insurance",
    examiner: "John Smith",
    type: "Auto",
    brokerName: "ABC Insurance Brokers",
    insured: "John Smith Company",
    supervisor: "Mary Johnson",
    accepted: "Yes",
    denied: "No",
    claimClosedDate: null,
    employeeNumber: "EMP001",
    jurisdictionDesc: "California State",
    jurisdictionCode: 1,
    jurisdictionClaimNumber: "CA-CLM-001",
    org1Code: "ORG001",
    org2Code: "ORG002"
  },
  {
    id: 2,
    claimId: 2,
    claimNumber: "CLM002",
    claimStatusCode: 2,
    examinerCode: "EX002",
    adjustingOfficeCode: "ADJ002",
    adjustingOfficeDesc: "New York Office",
    stateCode: "NY",
    incidentDate: "2024-01-16T14:15:00Z",
    addDate: "2024-01-17T10:00:00Z",
    policyNumber: "POL002",
    claimantName: "Jane Doe",
    ssn: "987-65-4321",
    status: "In Progress",
    lossState: "NY",
    programDesc: "Home Insurance",
    examiner: "Jane Doe",
    type: "Property",
    brokerName: "XYZ Insurance Group",
    insured: "Jane Doe Holdings",
    supervisor: "Robert Wilson",
    accepted: "Yes",
    denied: "No",
    claimClosedDate: null,
    employeeNumber: "EMP002",
    jurisdictionDesc: "New York State",
    jurisdictionCode: 2,
    jurisdictionClaimNumber: "NY-CLM-002",
    org1Code: "ORG003",
    org2Code: "ORG004"
  },
  {
    id: 3,
    claimId: 3,
    claimNumber: "CLM003",
    claimStatusCode: 1,
    examinerCode: "EX003",
    adjustingOfficeCode: "ADJ001",
    adjustingOfficeDesc: "Los Angeles Office",
    stateCode: "TX",
    incidentDate: "2024-01-17T08:45:00Z",
    addDate: "2024-01-18T11:00:00Z",
    policyNumber: "POL003",
    claimantName: "Bob Johnson",
    ssn: "456-78-9123",
    status: "Open",
    lossState: "TX",
    programDesc: "Auto Insurance",
    examiner: "Bob Johnson",
    type: "Auto",
    brokerName: "DEF Insurance Services",
    insured: "Bob Johnson Enterprises",
    supervisor: "Lisa Davis",
    accepted: "Pending",
    denied: "No",
    claimClosedDate: null,
    employeeNumber: "EMP003",
    jurisdictionDesc: "Texas State",
    jurisdictionCode: 3,
    jurisdictionClaimNumber: "TX-CLM-003",
    org1Code: "ORG005",
    org2Code: "ORG006"
  },
  {
    id: 4,
    claimId: 4,
    claimNumber: "CLM004",
    claimStatusCode: 3,
    examinerCode: "EX001",
    adjustingOfficeCode: "ADJ003",
    adjustingOfficeDesc: "Miami Office",
    stateCode: "FL",
    incidentDate: "2024-01-18T16:20:00Z",
    addDate: "2024-01-19T12:00:00Z",
    policyNumber: "POL004",
    claimantName: "Alice Brown",
    ssn: "321-54-9876",
    status: "Closed",
    lossState: "FL",
    programDesc: "Life Insurance",
    examiner: "Alice Brown",
    type: "Life",
    brokerName: "GHI Life Partners",
    insured: "Alice Brown Family Trust",
    supervisor: "Michael Lee",
    accepted: "Yes",
    denied: "No",
    claimClosedDate: "2024-02-15T10:00:00Z",
    employeeNumber: "EMP004",
    jurisdictionDesc: "Florida State",
    jurisdictionCode: 4,
    jurisdictionClaimNumber: "FL-CLM-004",
    org1Code: "ORG007",
    org2Code: "ORG008"
  },
  {
    id: 5,
    claimId: 5,
    claimNumber: "CLM005",
    claimStatusCode: 2,
    examinerCode: "EX004",
    adjustingOfficeCode: "ADJ002",
    adjustingOfficeDesc: "Chicago Office",
    stateCode: "IL",
    incidentDate: "2024-01-19T11:10:00Z",
    addDate: "2024-01-20T13:00:00Z",
    policyNumber: "POL005",
    claimantName: "Charlie Wilson",
    ssn: "654-32-1987",
    status: "In Progress",
    lossState: "IL",
    programDesc: "Health Insurance",
    examiner: "Charlie Wilson",
    type: "Health",
    brokerName: "JKL Health Solutions",
    insured: "Charlie Wilson Corp",
    supervisor: "Sarah Adams",
    accepted: "Under Review",
    denied: "No",
    claimClosedDate: null,
    employeeNumber: "EMP005",
    jurisdictionDesc: "Illinois State",
    jurisdictionCode: 5,
    jurisdictionClaimNumber: "IL-CLM-005",
    org1Code: "ORG009",
    org2Code: "ORG010"
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Claims Backend API',
    version: '1.0.0'
  });
});

// Info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    app: {
      name: 'Claims Backend API',
      description: 'Claims Management System Backend',
      version: '1.0.0'
    },
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      claims: '/api/claims',
      export: '/api/claims/export'
    },
    timestamp: new Date().toISOString()
  });
});

// Specific claims endpoints (must be defined BEFORE the general /api/claims route)
// Get claim statuses
app.get('/api/claims/statuses', (req, res) => {
  const statuses = [...new Set(sampleClaims.map(c => c.status))];
  res.json(statuses);
});

// Get loss states
app.get('/api/claims/loss-states', (req, res) => {
  const states = [...new Set(sampleClaims.map(c => c.lossState))];
  const stateObjects = states.map(state => ({
    code: state,
    name: state
  }));
  res.json(stateObjects);
});

// Get programs
app.get('/api/claims/programs', (req, res) => {
  const programs = [...new Set(sampleClaims.map(c => c.programDesc))];
  const programObjects = programs.map(program => ({
    id: program,
    description: program
  }));
  res.json(programObjects);
});

// Get insurance types
app.get('/api/claims/insurance-types', (req, res) => {
  const types = [
    { id: 1, description: 'Comprehensive' },
    { id: 2, description: 'Collision' },
    { id: 3, description: 'Liability' },
    { id: 4, description: 'Personal Injury Protection' }
  ];
  res.json(types);
});

// Get examiners
app.get('/api/claims/examiners', (req, res) => {
  const examiners = [...new Set(sampleClaims.map(c => c.examiner))];
  const examinerObjects = examiners.map(examiner => ({
    id: examiner,
    name: examiner
  }));
  res.json(examinerObjects);
});

// Get organizations
app.get('/api/claims/organizations', (req, res) => {
  const organizations = [
    { orgCode: 'ORG001', orgDesc: 'Organization 1' },
    { orgCode: 'ORG002', orgDesc: 'Organization 2' },
    { orgCode: 'ORG003', orgDesc: 'Organization 3' },
    { orgCode: 'ORG004', orgDesc: 'Organization 4' },
    { orgCode: 'ORG005', orgDesc: 'Organization 5' }
  ];
  res.json(organizations);
});

// Get underwriters
app.get('/api/claims/underwriters', (req, res) => {
  const underwriters = [
    { underwriterCode: 'UW001', underwriterName: 'Underwriter 1' },
    { underwriterCode: 'UW002', underwriterName: 'Underwriter 2' },
    { underwriterCode: 'UW003', underwriterName: 'Underwriter 3' }
  ];
  res.json(underwriters);
});

// Typeahead endpoints
app.get('/api/claims/typeahead/employer', (req, res) => {
  const { term } = req.query;
  const employers = [
    { insured: 'Employer A', insured_id: 'EMP001' },
    { insured: 'Employer B', insured_id: 'EMP002' },
    { insured: 'Employer C', insured_id: 'EMP003' }
  ];
  res.json(employers);
});

app.get('/api/claims/typeahead/claim-number', (req, res) => {
  const { term } = req.query;
  const claimNumbers = ['CLM001', 'CLM002', 'CLM003', 'CLM004', 'CLM005'];
  res.json(claimNumbers);
});

app.get('/api/claims/typeahead/policy-number', (req, res) => {
  const { term } = req.query;
  const policyNumbers = ['POL001', 'POL002', 'POL003', 'POL004', 'POL005'];
  res.json(policyNumbers);
});

app.get('/api/claims/typeahead/program', (req, res) => {
  const { term } = req.query;
  const programs = ['Auto Insurance', 'Home Insurance', 'Life Insurance', 'Health Insurance'];
  res.json(programs);
});

app.get('/api/claims/typeahead/underwriter', (req, res) => {
  const { term } = req.query;
  const underwriters = ['Underwriter A', 'Underwriter B', 'Underwriter C'];
  res.json(underwriters);
});

// Claims search endpoint (general route - must be defined AFTER specific routes)
app.get('/api/claims', (req, res) => {
  try {
    let filteredClaims = [...sampleClaims];
    
    // Apply filters
    const { q, claimNumber, status, policyNumber, claimantName, ssn, dolStart, dolEnd, 
            lossStates, programs, insuranceTypes, adjusterIds, orgIds, affiliateClaimNumber, 
            jurisdictionClaimNumber, employeeNumber, page = 0, pageSize = 20 } = req.query;
    
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredClaims = filteredClaims.filter(claim => 
        claim.claimNumber.toLowerCase().includes(searchTerm) ||
        claim.claimantName.toLowerCase().includes(searchTerm)
      );
    }
    
    if (claimNumber) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.claimNumber.toLowerCase().includes(claimNumber.toLowerCase())
      );
    }
    
    if (policyNumber) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.policyNumber && claim.policyNumber.toLowerCase().includes(policyNumber.toLowerCase())
      );
    }
    
    if (claimantName) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.claimantName && claim.claimantName.toLowerCase().includes(claimantName.toLowerCase())
      );
    }
    
    if (ssn) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.ssn && claim.ssn.includes(ssn)
      );
    }
    
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filteredClaims = filteredClaims.filter(claim => 
        statusArray.includes(claim.status)
      );
    }
    
    if (lossStates && lossStates.length > 0) {
      const statesArray = Array.isArray(lossStates) ? lossStates : [lossStates];
      filteredClaims = filteredClaims.filter(claim => 
        statesArray.includes(claim.lossState)
      );
    }
    
    if (programs && programs.length > 0) {
      const programsArray = Array.isArray(programs) ? programs : [programs];
      filteredClaims = filteredClaims.filter(claim => 
        programsArray.includes(claim.programDesc)
      );
    }
    
    // Pagination
    const startIndex = parseInt(page) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedClaims = filteredClaims.slice(startIndex, endIndex);
    
    const response = {
      claims: paginatedClaims,
      totalRecords: filteredClaims.length,
      totalPages: Math.ceil(filteredClaims.length / parseInt(pageSize)),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize)
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in claims search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export claims (must be before /:claimId route)
app.get('/api/claims/export', (req, res) => {
  try {
    const format = req.query.format || 'csv';
    console.log(`Export request received for format: ${format}`);
    
    // Apply the same filters as the search
    let filteredClaims = [...sampleClaims];
    const { q, claimNumber, status } = req.query;
    
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredClaims = filteredClaims.filter(claim => 
        claim.claimNumber.toLowerCase().includes(searchTerm) ||
        claim.claimantName.toLowerCase().includes(searchTerm)
      );
    }
    
    if (claimNumber) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.claimNumber.toLowerCase().includes(claimNumber.toLowerCase())
      );
    }
    
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filteredClaims = filteredClaims.filter(claim => 
        statusArray.includes(claim.status)
      );
    }
    
    if (format === 'csv') {
      const csvData = [
        'Claim Number,Status,Examiner,State,Incident Date,Policy Number,Claimant Name',
        ...filteredClaims.map(claim => 
          `"${claim.claimNumber}","${claim.status}","${claim.examiner}","${claim.lossState}","${claim.incidentDate}","${claim.policyNumber}","${claim.claimantName}"`
        )
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="claims_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvData);
      console.log(`CSV export completed: ${filteredClaims.length} claims`);
    } else if (format === 'json') {
      const jsonData = JSON.stringify(filteredClaims, null, 2);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="claims_export_${new Date().toISOString().split('T')[0]}.json"`);
      res.send(jsonData);
      console.log(`JSON export completed: ${filteredClaims.length} claims`);
    } else if (format === 'xlsx') {
      // For Excel, we'll return CSV format for simplicity
      const csvData = [
        'Claim Number,Status,Examiner,State,Incident Date,Policy Number,Claimant Name',
        ...filteredClaims.map(claim => 
          `"${claim.claimNumber}","${claim.status}","${claim.examiner}","${claim.lossState}","${claim.incidentDate}","${claim.policyNumber}","${claim.claimantName}"`
        )
      ].join('\n');
      
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', `attachment; filename="claims_export_${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(csvData);
      console.log(`Excel export completed: ${filteredClaims.length} claims`);
    } else {
      res.status(400).json({ error: 'Unsupported format. Use csv, json, or xlsx.' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Get claim by ID
app.get('/api/claims/:claimId', (req, res) => {
  const claimId = parseInt(req.params.claimId);
  const claim = sampleClaims.find(c => c.id === claimId);
  
  if (claim) {
    res.json(claim);
  } else {
    res.status(404).json({ error: 'Claim not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Claims Backend API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Claims API: http://localhost:${PORT}/api/claims`);
  console.log('');
  console.log('Ready to accept connections from frontend on http://localhost:4200 or http://localhost:4201');
});

module.exports = app;