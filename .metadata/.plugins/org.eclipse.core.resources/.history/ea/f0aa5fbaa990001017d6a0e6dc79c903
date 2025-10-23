package com.claim_search.model;

import lombok.Data;
import java.io.Serializable;

@Data
public class ClaimantId implements Serializable {
    private Long claimId;
    private Long claimantId;
    
    public ClaimantId() {}
    
    public ClaimantId(Long claimId, Long claimantId) {
        this.claimId = claimId;
        this.claimantId = claimantId;
    }
    
    // Explicitly define equals and hashCode for proper composite key functionality
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        ClaimantId that = (ClaimantId) o;
        
        if (!claimId.equals(that.claimId)) return false;
        return claimantId.equals(that.claimantId);
    }
    
    @Override
    public int hashCode() {
        int result = claimId.hashCode();
        result = 31 * result + claimantId.hashCode();
        return result;
    }
}