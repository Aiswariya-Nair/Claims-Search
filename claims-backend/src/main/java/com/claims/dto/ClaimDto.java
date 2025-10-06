package com.claims.dto;

import com.claims.model.Claim;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class ClaimDto {
    private Long claimId;
    private Long claimStatusCode;
    private String claimNumber;
    private String examinerCode;
    private String adjustingOfficeCode;
    private String stateCode;
    private String incidentDate;
    private String addDate;
    private String policyNumber;
    private String claimantName;
    private String ssn;
    private String programCode;
    private Long insuranceTypeId;
    private String organizationCode;
    
    // Additional fields for enhanced API response
    private String org1Code;
    private String org2Code;
    private String org3Code;
    private String org4Code;
    private String lossState;
    private String lossStateCode;
    private String underwriterCode;
    private Long jurisdictionCode;
    private String incidentReportedDate;
    private String claimClosedDate;
    private BigDecimal estimatedIncidentAmount;
    private BigDecimal totalPayoutOnIncident;
    private String active;
    private String masterClaim;
    private String affiliateClaimNumber;
    private String jurisdictionClaimNumber;
    
    // Enhanced fields for frontend display
    private String status;
    private String programDesc;
    private String examiner;
    private String insuranceTypeDesc;
    private String adjustingOfficeDesc;
    private String jurisdictionDesc;
    private String incidentDateStr;
    private String addDateStr;
    private String closedDateStr;
    private String statusFlag;
    private String claimantSuffix;
    private String idmFlag;
    private Long billReviewVendorId;
    private String billReviewVendorName;
    private Long clientCode;
    private Long claimantId;
    private String claimantFirstName;
    private String claimantLastName;
    private String fromincidentDate;
    private String toincidentDate;
    private String insuredId;
    private String supervisorId;
    private String supervisor;
    private String insured;
    private String insurerNumber;
    private String insurer;
    private Long claimantTypeCode;
    private String claimantTypeDesc;
    private Long claimantNumber;
    private String accepted;
    private String denied;
    private String employeeNumber;
    private String entityName;
    private String claimantOrEntityName;
    private String claimantFirstOrEntityName;

    public ClaimDto() {}

    public ClaimDto(Claim claim) {
        this.claimId = claim.getClaimId();
        this.claimStatusCode = claim.getClaimStatusCode();
        this.claimNumber = claim.getClaimNumber();
        this.examinerCode = claim.getExaminerCode();
        this.adjustingOfficeCode = claim.getAdjustingOfficeCode();
        this.stateCode = claim.getStateCode();
        this.incidentDate = claim.getIncidentDate() != null ? claim.getIncidentDate().toString() : null;
        this.addDate = claim.getAddDate() != null ? claim.getAddDate().toString() : null;
        this.policyNumber = claim.getPolicyNumber();
        this.claimantName = claim.getClaimantName();
        this.ssn = claim.getSsn();
        this.programCode = claim.getProgramCode();
        this.insuranceTypeId = claim.getInsuranceTypeId();
        this.organizationCode = claim.getOrganizationCode();
        this.org1Code = claim.getOrg1Code();
        this.org2Code = claim.getOrg2Code();
        this.org3Code = claim.getOrg3Code();
        this.org4Code = claim.getOrg4Code();
        this.lossState = claim.getLossState();
        this.lossStateCode = claim.getLossStateCode();
        this.underwriterCode = claim.getUnderwriterCode();
        this.jurisdictionCode = claim.getJurisdictionCode();
        this.incidentReportedDate = claim.getIncidentReportedDate() != null ? claim.getIncidentReportedDate().toString() : null;
        this.claimClosedDate = claim.getClaimClosedDate() != null ? claim.getClaimClosedDate().toString() : null;
        this.estimatedIncidentAmount = claim.getEstimatedIncidentAmount();
        this.totalPayoutOnIncident = claim.getTotalPayoutOnIncident();
        this.active = claim.getActive();
        this.masterClaim = claim.getMasterClaim();
        this.affiliateClaimNumber = claim.getAffiliateClaimNumber();
        this.jurisdictionClaimNumber = claim.getJurisdictionClaimNumber();
        
        // Set some default values for demo
        this.billReviewVendorId = 24L;
        this.billReviewVendorName = "Aon eSolutions Inc";
        this.clientCode = 1L;
        this.accepted = "No";
        this.denied = "No";
        this.statusFlag = "";
        this.idmFlag = "";
    }

    // Getters and Setters
    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public Long getClaimStatusCode() { return claimStatusCode; }
    public void setClaimStatusCode(Long claimStatusCode) { this.claimStatusCode = claimStatusCode; }

    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }

    public String getExaminerCode() { return examinerCode; }
    public void setExaminerCode(String examinerCode) { this.examinerCode = examinerCode; }

    public String getAdjustingOfficeCode() { return adjustingOfficeCode; }
    public void setAdjustingOfficeCode(String adjustingOfficeCode) { this.adjustingOfficeCode = adjustingOfficeCode; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }

    public String getAddDate() { return addDate; }
    public void setAddDate(String addDate) { this.addDate = addDate; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getSsn() { return ssn; }
    public void setSsn(String ssn) { this.ssn = ssn; }

    public String getProgramCode() { return programCode; }
    public void setProgramCode(String programCode) { this.programCode = programCode; }

    public Long getInsuranceTypeId() { return insuranceTypeId; }
    public void setInsuranceTypeId(Long insuranceTypeId) { this.insuranceTypeId = insuranceTypeId; }

    public String getOrganizationCode() { return organizationCode; }
    public void setOrganizationCode(String organizationCode) { this.organizationCode = organizationCode; }

    // Additional field getters and setters
    public String getOrg1Code() { return org1Code; }
    public void setOrg1Code(String org1Code) { this.org1Code = org1Code; }

    public String getOrg2Code() { return org2Code; }
    public void setOrg2Code(String org2Code) { this.org2Code = org2Code; }

    public String getOrg3Code() { return org3Code; }
    public void setOrg3Code(String org3Code) { this.org3Code = org3Code; }

    public String getOrg4Code() { return org4Code; }
    public void setOrg4Code(String org4Code) { this.org4Code = org4Code; }

    public String getLossState() { return lossState; }
    public void setLossState(String lossState) { this.lossState = lossState; }

    public String getLossStateCode() { return lossStateCode; }
    public void setLossStateCode(String lossStateCode) { this.lossStateCode = lossStateCode; }

    public String getUnderwriterCode() { return underwriterCode; }
    public void setUnderwriterCode(String underwriterCode) { this.underwriterCode = underwriterCode; }

    public Long getJurisdictionCode() { return jurisdictionCode; }
    public void setJurisdictionCode(Long jurisdictionCode) { this.jurisdictionCode = jurisdictionCode; }

    public String getIncidentReportedDate() { return incidentReportedDate; }
    public void setIncidentReportedDate(String incidentReportedDate) { this.incidentReportedDate = incidentReportedDate; }

    public String getClaimClosedDate() { return claimClosedDate; }
    public void setClaimClosedDate(String claimClosedDate) { this.claimClosedDate = claimClosedDate; }

    public BigDecimal getEstimatedIncidentAmount() { return estimatedIncidentAmount; }
    public void setEstimatedIncidentAmount(BigDecimal estimatedIncidentAmount) { this.estimatedIncidentAmount = estimatedIncidentAmount; }

    public BigDecimal getTotalPayoutOnIncident() { return totalPayoutOnIncident; }
    public void setTotalPayoutOnIncident(BigDecimal totalPayoutOnIncident) { this.totalPayoutOnIncident = totalPayoutOnIncident; }

    public String getActive() { return active; }
    public void setActive(String active) { this.active = active; }

    public String getMasterClaim() { return masterClaim; }
    public void setMasterClaim(String masterClaim) { this.masterClaim = masterClaim; }

    public String getAffiliateClaimNumber() { return affiliateClaimNumber; }
    public void setAffiliateClaimNumber(String affiliateClaimNumber) { this.affiliateClaimNumber = affiliateClaimNumber; }

    public String getJurisdictionClaimNumber() { return jurisdictionClaimNumber; }
    public void setJurisdictionClaimNumber(String jurisdictionClaimNumber) { this.jurisdictionClaimNumber = jurisdictionClaimNumber; }

    // Enhanced display fields
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProgramDesc() { return programDesc; }
    public void setProgramDesc(String programDesc) { this.programDesc = programDesc; }

    public String getExaminer() { return examiner; }
    public void setExaminer(String examiner) { this.examiner = examiner; }

    public String getInsuranceTypeDesc() { return insuranceTypeDesc; }
    public void setInsuranceTypeDesc(String insuranceTypeDesc) { this.insuranceTypeDesc = insuranceTypeDesc; }

    public String getAdjustingOfficeDesc() { return adjustingOfficeDesc; }
    public void setAdjustingOfficeDesc(String adjustingOfficeDesc) { this.adjustingOfficeDesc = adjustingOfficeDesc; }

    public String getJurisdictionDesc() { return jurisdictionDesc; }
    public void setJurisdictionDesc(String jurisdictionDesc) { this.jurisdictionDesc = jurisdictionDesc; }

    public String getIncidentDateStr() { return incidentDateStr; }
    public void setIncidentDateStr(String incidentDateStr) { this.incidentDateStr = incidentDateStr; }

    public String getAddDateStr() { return addDateStr; }
    public void setAddDateStr(String addDateStr) { this.addDateStr = addDateStr; }

    public String getClosedDateStr() { return closedDateStr; }
    public void setClosedDateStr(String closedDateStr) { this.closedDateStr = closedDateStr; }

    public String getStatusFlag() { return statusFlag; }
    public void setStatusFlag(String statusFlag) { this.statusFlag = statusFlag; }

    public String getClaimantSuffix() { return claimantSuffix; }
    public void setClaimantSuffix(String claimantSuffix) { this.claimantSuffix = claimantSuffix; }

    public String getIdmFlag() { return idmFlag; }
    public void setIdmFlag(String idmFlag) { this.idmFlag = idmFlag; }

    public Long getBillReviewVendorId() { return billReviewVendorId; }
    public void setBillReviewVendorId(Long billReviewVendorId) { this.billReviewVendorId = billReviewVendorId; }

    public String getBillReviewVendorName() { return billReviewVendorName; }
    public void setBillReviewVendorName(String billReviewVendorName) { this.billReviewVendorName = billReviewVendorName; }

    public Long getClientCode() { return clientCode; }
    public void setClientCode(Long clientCode) { this.clientCode = clientCode; }

    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }

    public String getClaimantFirstName() { return claimantFirstName; }
    public void setClaimantFirstName(String claimantFirstName) { this.claimantFirstName = claimantFirstName; }

    public String getClaimantLastName() { return claimantLastName; }
    public void setClaimantLastName(String claimantLastName) { this.claimantLastName = claimantLastName; }

    public String getFromincidentDate() { return fromincidentDate; }
    public void setFromincidentDate(String fromincidentDate) { this.fromincidentDate = fromincidentDate; }

    public String getToincidentDate() { return toincidentDate; }
    public void setToincidentDate(String toincidentDate) { this.toincidentDate = toincidentDate; }

    public String getInsuredId() { return insuredId; }
    public void setInsuredId(String insuredId) { this.insuredId = insuredId; }

    public String getSupervisorId() { return supervisorId; }
    public void setSupervisorId(String supervisorId) { this.supervisorId = supervisorId; }

    public String getSupervisor() { return supervisor; }
    public void setSupervisor(String supervisor) { this.supervisor = supervisor; }

    public String getInsured() { return insured; }
    public void setInsured(String insured) { this.insured = insured; }

    public String getInsurerNumber() { return insurerNumber; }
    public void setInsurerNumber(String insurerNumber) { this.insurerNumber = insurerNumber; }

    public String getInsurer() { return insurer; }
    public void setInsurer(String insurer) { this.insurer = insurer; }

    public Long getClaimantTypeCode() { return claimantTypeCode; }
    public void setClaimantTypeCode(Long claimantTypeCode) { this.claimantTypeCode = claimantTypeCode; }

    public String getClaimantTypeDesc() { return claimantTypeDesc; }
    public void setClaimantTypeDesc(String claimantTypeDesc) { this.claimantTypeDesc = claimantTypeDesc; }

    public Long getClaimantNumber() { return claimantNumber; }
    public void setClaimantNumber(Long claimantNumber) { this.claimantNumber = claimantNumber; }

    public String getAccepted() { return accepted; }
    public void setAccepted(String accepted) { this.accepted = accepted; }

    public String getDenied() { return denied; }
    public void setDenied(String denied) { this.denied = denied; }

    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getClaimantOrEntityName() { return claimantOrEntityName; }
    public void setClaimantOrEntityName(String claimantOrEntityName) { this.claimantOrEntityName = claimantOrEntityName; }

    public String getClaimantFirstOrEntityName() { return claimantFirstOrEntityName; }
    public void setClaimantFirstOrEntityName(String claimantFirstOrEntityName) { this.claimantFirstOrEntityName = claimantFirstOrEntityName; }
}