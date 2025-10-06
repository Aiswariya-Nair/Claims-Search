export interface FilterParams {
  // Full-text search
  q?: string;
  
  // Basic filters
  claimNumber?: string;
  policyNumber?: string;
  claimantName?: string;
  ssn?: string;
  
  // Date filters (matching API contract)
  dolStart?: string;  // Date of Loss start
  dolEnd?: string;    // Date of Loss end
  reportedStart?: string;
  reportedEnd?: string;
  
  // Multi-select filters
  status?: string[];
  orgIds?: string[];    // Organization IDs
  adjusterIds?: string[]; // Examiner/Adjuster IDs
  underwriterIds?: string[];
  lossStates?: string[];
  programs?: string[];
  insuranceTypes?: number[];
  tags?: string[];
  
  // Additional filters from requirements
  affiliateClaimNumber?: string;
  jurisdictionClaimNumber?: string;
  employeeNumber?: string;
  examiner?: string;
  employer?: string;
  program?: string;
  claimantType?: string;
  organization1?: string;
  organization2?: string;
  organization3?: string;
  organization4?: string;
  brokerName?: string;
  emailId?: string;
  phoneNumber?: string;
  dob?: string;
  adjustingOffice?: string;
  
  // Amount filters
  minAmount?: number;
  maxAmount?: number;
  
  // Pagination and sorting
  sort?: string;    // "field:asc|desc"
  page?: number;    // 1-based page number
  pageSize?: number; // max 100
  
  // Legacy support
  incidentDateStart?: string;
  incidentDateEnd?: string;
  lossState?: string[];
  insuranceType?: number[];
  organization?: string[];
}