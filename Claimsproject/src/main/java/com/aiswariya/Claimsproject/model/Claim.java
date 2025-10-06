package com.aiswariya.Claimsproject.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "claim")
public class Claim {
    
    @Id
    @Column(name = "claim_id")
    private Long claimId;
    
    @Column(name = "claim_status_code")
    private Long claimStatusCode;
    
    @Column(name = "claim_number", length = 20)
    private String claimNumber;
    
    @Column(name = "examiner_code", length = 10)
    private String examinerCode;
    
    @Column(name = "adjusting_office_code", length = 3)
    private String adjustingOfficeCode;
    
    @Column(name = "state_code", length = 2)
    private String stateCode;
    
    @Column(name = "incident_date")
    private LocalDateTime incidentDate;
    
    @Column(name = "add_date")
    private LocalDateTime addDate;
    
    @Column(name = "policy_number")
    private String policyNumber;
    
    @Column(name = "claimant_name")
    private String claimantName;
    
    @Column(name = "ssn", length = 9)
    private String ssn;
    
    @Column(name = "program_code")
    private String programCode;
    
    @Column(name = "insurance_type_id")
    private Long insuranceTypeId;
    
    @Column(name = "organization_code")
    private String organizationCode;
    
    @Column(name = "org1_code", length = 10)
    private String org1Code;
    
    @Column(name = "org2_code", length = 10)
    private String org2Code;
    
    @Column(name = "org3_code", length = 10)
    private String org3Code;
    
    @Column(name = "org4_code", length = 10)
    private String org4Code;
    
    @Column(name = "loss_state", length = 50)
    private String lossState;
    
    @Column(name = "loss_state_code", length = 5)
    private String lossStateCode;
    
    @Column(name = "underwriter_code", length = 10)
    private String underwriterCode;
    
    @Column(name = "jurisdiction_code")
    private Long jurisdictionCode;
    
    @Column(name = "incident_reported_date")
    private LocalDateTime incidentReportedDate;
    
    @Column(name = "claim_closed_date")
    private LocalDateTime claimClosedDate;
    
    @Column(name = "estimated_incident_amount")
    private BigDecimal estimatedIncidentAmount;
    
    @Column(name = "total_payout_on_incident")
    private BigDecimal totalPayoutOnIncident;
    
    @Column(name = "active", length = 1)
    private String active = "1";
    
    @Column(name = "master_claim", length = 1)
    private String masterClaim;
    
    @Column(name = "affiliate_claim_number", length = 30)
    private String affiliateClaimNumber;
    
    @Column(name = "jurisdiction_claim_number", length = 25)
    private String jurisdictionClaimNumber;

    // Constructors
    public Claim() {}

    public Claim(String claimNumber, Long claimStatusCode, String examinerCode, 
                 String adjustingOfficeCode, String stateCode, LocalDateTime incidentDate) {
        this.claimNumber = claimNumber;
        this.claimStatusCode = claimStatusCode;
        this.examinerCode = examinerCode;
        this.adjustingOfficeCode = adjustingOfficeCode;
        this.stateCode = stateCode;
        this.incidentDate = incidentDate;
        this.addDate = LocalDateTime.now();
        this.active = "1";
    }

    // Getters and Setters
    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public Long getClaimStatusCode() {
        return claimStatusCode;
    }

    public void setClaimStatusCode(Long claimStatusCode) {
        this.claimStatusCode = claimStatusCode;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public String getExaminerCode() {
        return examinerCode;
    }

    public void setExaminerCode(String examinerCode) {
        this.examinerCode = examinerCode;
    }

    public String getAdjustingOfficeCode() {
        return adjustingOfficeCode;
    }

    public void setAdjustingOfficeCode(String adjustingOfficeCode) {
        this.adjustingOfficeCode = adjustingOfficeCode;
    }

    public String getStateCode() {
        return stateCode;
    }

    public void setStateCode(String stateCode) {
        this.stateCode = stateCode;
    }

    public LocalDateTime getIncidentDate() {
        return incidentDate;
    }

    public void setIncidentDate(LocalDateTime incidentDate) {
        this.incidentDate = incidentDate;
    }

    public LocalDateTime getAddDate() {
        return addDate;
    }

    public void setAddDate(LocalDateTime addDate) {
        this.addDate = addDate;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getClaimantName() {
        return claimantName;
    }

    public void setClaimantName(String claimantName) {
        this.claimantName = claimantName;
    }

    public String getSsn() {
        return ssn;
    }

    public void setSsn(String ssn) {
        this.ssn = ssn;
    }

    public String getProgramCode() {
        return programCode;
    }

    public void setProgramCode(String programCode) {
        this.programCode = programCode;
    }

    public Long getInsuranceTypeId() {
        return insuranceTypeId;
    }

    public void setInsuranceTypeId(Long insuranceTypeId) {
        this.insuranceTypeId = insuranceTypeId;
    }

    public String getOrganizationCode() {
        return organizationCode;
    }

    public void setOrganizationCode(String organizationCode) {
        this.organizationCode = organizationCode;
    }

    public String getOrg1Code() {
        return org1Code;
    }

    public void setOrg1Code(String org1Code) {
        this.org1Code = org1Code;
    }

    public String getOrg2Code() {
        return org2Code;
    }

    public void setOrg2Code(String org2Code) {
        this.org2Code = org2Code;
    }

    public String getOrg3Code() {
        return org3Code;
    }

    public void setOrg3Code(String org3Code) {
        this.org3Code = org3Code;
    }

    public String getOrg4Code() {
        return org4Code;
    }

    public void setOrg4Code(String org4Code) {
        this.org4Code = org4Code;
    }

    public String getLossState() {
        return lossState;
    }

    public void setLossState(String lossState) {
        this.lossState = lossState;
    }

    public String getLossStateCode() {
        return lossStateCode;
    }

    public void setLossStateCode(String lossStateCode) {
        this.lossStateCode = lossStateCode;
    }

    public String getUnderwriterCode() {
        return underwriterCode;
    }

    public void setUnderwriterCode(String underwriterCode) {
        this.underwriterCode = underwriterCode;
    }

    public Long getJurisdictionCode() {
        return jurisdictionCode;
    }

    public void setJurisdictionCode(Long jurisdictionCode) {
        this.jurisdictionCode = jurisdictionCode;
    }

    public LocalDateTime getIncidentReportedDate() {
        return incidentReportedDate;
    }

    public void setIncidentReportedDate(LocalDateTime incidentReportedDate) {
        this.incidentReportedDate = incidentReportedDate;
    }

    public LocalDateTime getClaimClosedDate() {
        return claimClosedDate;
    }

    public void setClaimClosedDate(LocalDateTime claimClosedDate) {
        this.claimClosedDate = claimClosedDate;
    }

    public BigDecimal getEstimatedIncidentAmount() {
        return estimatedIncidentAmount;
    }

    public void setEstimatedIncidentAmount(BigDecimal estimatedIncidentAmount) {
        this.estimatedIncidentAmount = estimatedIncidentAmount;
    }

    public BigDecimal getTotalPayoutOnIncident() {
        return totalPayoutOnIncident;
    }

    public void setTotalPayoutOnIncident(BigDecimal totalPayoutOnIncident) {
        this.totalPayoutOnIncident = totalPayoutOnIncident;
    }

    public String getActive() {
        return active;
    }

    public void setActive(String active) {
        this.active = active;
    }

    public String getMasterClaim() {
        return masterClaim;
    }

    public void setMasterClaim(String masterClaim) {
        this.masterClaim = masterClaim;
    }

    public String getAffiliateClaimNumber() {
        return affiliateClaimNumber;
    }

    public void setAffiliateClaimNumber(String affiliateClaimNumber) {
        this.affiliateClaimNumber = affiliateClaimNumber;
    }

    public String getJurisdictionClaimNumber() {
        return jurisdictionClaimNumber;
    }

    public void setJurisdictionClaimNumber(String jurisdictionClaimNumber) {
        this.jurisdictionClaimNumber = jurisdictionClaimNumber;
    }
}