package com.claim_search.model;

import jakarta.persistence.*;

@Entity
@Table(name = "coverage_type", schema = "public")
public class CoverageType {
    @Id
    @Column(name = "coverage_type_id")
    private Integer coverageTypeId;
    
    @Column(name = "coverage_type_desc")
    private String coverageTypeDesc;
    
    // Getters and setters
    public Integer getCoverageTypeId() { return coverageTypeId; }
    public void setCoverageTypeId(Integer coverageTypeId) { this.coverageTypeId = coverageTypeId; }
    
    public String getCoverageTypeDesc() { return coverageTypeDesc; }
    public void setCoverageTypeDesc(String coverageTypeDesc) { this.coverageTypeDesc = coverageTypeDesc; }
}