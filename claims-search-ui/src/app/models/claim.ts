export interface Claim {
  // Core claim fields
  id?: string;   
  claimId?: number;
  claimStatusCode: number;
  claimNumber: string;
  brokerName?: string;   
  examinerCode: string;
  adjustingOfficeCode: string;
  stateCode: string;
  incidentDate: string;
  addDate: string;
  policyNumber?: string;
  claimantName?: string;
  ssn?: string;
  programCode?: string;
  insuranceTypeId?: number;
  organizationCode?: string;
  
  // Additional fields from requirements
  org1Code?: string;
  org2Code?: string;
  org3Code?: string;
  org4Code?: string;
  lossState?: string;
  lossStateCode?: string;
  underwriterCode?: string;
  jurisdictionCode?: number;
  incidentReportedDate?: string;
  claimClosedDate?: string;
  estimatedIncidentAmount?: number;
  totalPayoutOnIncident?: number;
  active?: string;
  masterClaim?: string;
  affiliateClaimNumber?: string;
  jurisdictionClaimNumber?: string;
  
  // Enhanced display fields
  status?: string;
  programDesc?: string;
  examiner?: string;
  insuranceTypeDesc?: string;
  adjustingOfficeDesc?: string;
  jurisdictionDesc?: string;
  incidentDateStr?: string;
  addDateStr?: string;
  closedDateStr?: string;
  statusFlag?: string;
  claimantSuffix?: string;
  idmFlag?: string;
  billReviewVendorId?: number;
  billReviewVendorName?: string;
  clientCode?: number;
  claimantId?: number;
  claimantFirstName?: string;
  claimantLastName?: string;
  fromincidentDate?: string;
  toincidentDate?: string;
  insuredId?: string;
  supervisorId?: string;
  supervisor?: string;
  insured?: string;
  insurerNumber?: string;
  insurer?: string;
  claimantTypeCode?: number;
  claimantTypeDesc?: string;
  claimantNumber?: number;
  accepted?: string;
  denied?: string;
  employeeNumber?: string;
  entityName?: string;
  claimantOrEntityName?: string;
  claimantFirstOrEntityName?: string;
  insuredName?: string;
  type?: string;
}

export interface ClaimsResponse {
  items?: Claim[];
  claims?: Claim[];
  totalRecords?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  page?: number;
  pageSize?: number;
  
  // Legacy format support
  _embedded?: {
    claims?: Claim[];
  };
  _links?: {
    self?: { href?: string };
    profile?: { href?: string };
  };
}

export interface MyQueueResponse {
  iTotalRecords: number;
  iTotalDisplayRecords: number;
  data: Claim[];
}

// Dropdown/lookup interfaces
export interface StatusOption {
  value: number;
  label: string;
  statusCode?: number;
  statusDesc?: string;
}

export interface StateOption {
  value: string;
  label: string;
  stateCode?: string;
  stateDesc?: string;
}

export interface ProgramOption {
  value: string;
  label: string;
  programCode?: string;
  programDesc?: string;
}

export interface InsuranceTypeOption {
  value: number;
  label: string;
  insuranceType?: number;
  insuranceTypeDesc?: string;
}

export interface ExaminerOption {
  value: string;
  label: string;
  examinerCode?: string;
  examinerName?: string;
}

export interface OrganizationOption {
  value: string;
  label: string;
  orgCode?: string;
  orgDesc?: string;
}

export interface UnderwriterOption {
  underwriterCode: string;
  underwriterName: string;
}

// Typeahead interfaces
export interface EmployerTypeahead {
  insured: string;
  insured_id: string;
}