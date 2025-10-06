package com.claim_search.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claimant", schema = "public")
@IdClass(ClaimantId.class)
public class Claimant {
    @Id
    @Column(name = "claim_id")
    private Long claimId;
    
    @Id
    @Column(name = "claimant_id")
    private Long claimantId;
    
    @Column(name = "claimant_number")
    private Integer claimantNumber;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "claimant_name")
    private String claimantName;
    
    @Column(name = "ssn")
    private String ssn;
    
    @Column(name = "status_code")
    private Integer statusCode;
    
    @Column(name = "add_date")
    private LocalDateTime addDate;
    
    // Getters and setters
    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }
    
    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }
    
    public Integer getClaimantNumber() { return claimantNumber; }
    public void setClaimantNumber(Integer claimantNumber) { this.claimantNumber = claimantNumber; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }
    
    public String getSsn() { return ssn; }
    public void setSsn(String ssn) { this.ssn = ssn; }
    
    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    
    public LocalDateTime getAddDate() { return addDate; }
    public void setAddDate(LocalDateTime addDate) { this.addDate = addDate; }
}