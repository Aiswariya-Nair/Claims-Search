package com.claim_search.controller;
import com.claim_search.model.Claim;
import com.claim_search.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/claims")
@CrossOrigin(origins = "http://localhost:4200")
public class ClaimController {
    
    @Autowired
    private ClaimRepository claimRepository;
    
    // Get all claims with optional filtering
    @GetMapping
    public ResponseEntity<Map<String, Object>> getClaims(
            @RequestParam Map<String, String> allParams) {
        
        // For now, get all claims (add filtering logic later)
        List<Claim> claims = claimRepository.findAll();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", claims);
        response.put("total", claims.size());
        response.put("page", 0);
        response.put("pageSize", claims.size());
        response.put("totalPages", 1);
        
        return ResponseEntity.ok(response);
    }
    
    // Get claim by ID
    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        return claimRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new claim
    @PostMapping
    public Claim createClaim(@RequestBody Claim claim) {
        return claimRepository.save(claim);
    }
    
    // Update claim
    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaim(@PathVariable Long id, @RequestBody Claim claimDetails) {
        return claimRepository.findById(id)
                .map(claim -> {
                    claim.setClaimStatusCode(claimDetails.getClaimStatusCode());
                    claim.setClaimNumber(claimDetails.getClaimNumber());
                    claim.setExaminerCode(claimDetails.getExaminerCode());
                    claim.setAdjustingOfficeCode(claimDetails.getAdjustingOfficeCode());
                    claim.setStateCode(claimDetails.getStateCode());
                    claim.setIncidentDate(claimDetails.getIncidentDate());
                    claim.setAddDate(claimDetails.getAddDate());
                    return ResponseEntity.ok(claimRepository.save(claim));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete claim
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClaim(@PathVariable Long id) {
        return claimRepository.findById(id)
                .map(claim -> {
                    claimRepository.delete(claim);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}