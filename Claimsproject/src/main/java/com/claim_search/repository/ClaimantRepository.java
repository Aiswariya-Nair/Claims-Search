package com.claim_search.repository;

import com.claim_search.model.Claimant;
import com.claim_search.model.ClaimantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaimantRepository extends JpaRepository<Claimant, ClaimantId> {
}

