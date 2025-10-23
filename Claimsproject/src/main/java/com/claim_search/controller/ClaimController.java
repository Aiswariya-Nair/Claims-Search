package com.claim_search.controller;
import com.claim_search.model.Claim;
import com.claim_search.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

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
        
        List<Claim> allClaims = claimRepository.findAll();
        List<Claim> filteredClaims = allClaims;
        
        // Apply claim number filter if provided
        if (allParams.containsKey("claimNumber") && !allParams.get("claimNumber").isEmpty()) {
            String claimNumber = allParams.get("claimNumber");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> claim.getClaimNumber() != null && 
                         claim.getClaimNumber().toLowerCase().contains(claimNumber.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // Apply other filters as needed
        // For example, policy number filter
        if (allParams.containsKey("policyNumber") && !allParams.get("policyNumber").isEmpty()) {
            String policyNumber = allParams.get("policyNumber");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> claim.getPolicyNumber() != null && 
                         claim.getPolicyNumber().toLowerCase().contains(policyNumber.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // Apply SSN filter if provided
        if (allParams.containsKey("ssn") && !allParams.get("ssn").isEmpty()) {
            String ssn = allParams.get("ssn");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> claim.getSsn() != null && 
                         claim.getSsn().contains(ssn))
                .collect(Collectors.toList());
        }
        
        // Apply status filter if provided
        if (allParams.containsKey("status") && !allParams.get("status").isEmpty()) {
            String status = allParams.get("status");
            String[] statuses = status.split(",");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> {
                    for (String s : statuses) {
                        if (claim.getStatus() != null && claim.getStatus().equalsIgnoreCase(s.trim())) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", filteredClaims);
        response.put("total", filteredClaims.size());
        response.put("page", 1);
        response.put("pageSize", filteredClaims.size());
        response.put("totalPages", 1);
        
        return ResponseEntity.ok(response);
    }
    
    // Export claims endpoint
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportClaims(
            @RequestParam Map<String, String> allParams,
            @RequestParam(defaultValue = "csv") String format) {
        
        // Get filtered claims using the same logic as getClaims
        List<Claim> allClaims = claimRepository.findAll();
        List<Claim> filteredClaims = allClaims;
        
        // Apply claim number filter if provided
        if (allParams.containsKey("claimNumber") && !allParams.get("claimNumber").isEmpty()) {
            String claimNumber = allParams.get("claimNumber");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> claim.getClaimNumber() != null && 
                         claim.getClaimNumber().toLowerCase().contains(claimNumber.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // Apply other filters as needed
        if (allParams.containsKey("policyNumber") && !allParams.get("policyNumber").isEmpty()) {
            String policyNumber = allParams.get("policyNumber");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> claim.getPolicyNumber() != null && 
                         claim.getPolicyNumber().toLowerCase().contains(policyNumber.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (allParams.containsKey("ssn") && !allParams.get("ssn").isEmpty()) {
            String ssn = allParams.get("ssn");
            filteredClaims = filteredClaims.stream()
                .filter(claim -> claim.getSsn() != null && 
                         claim.getSsn().contains(ssn))
                .collect(Collectors.toList());
        }
        
        // Generate export data based on format
        byte[] data;
        String filename;
        MediaType mediaType;
        
        switch (format.toLowerCase()) {
            case "xlsx":
                data = generateCsvExport(filteredClaims); // For now, return CSV with Excel extension
                filename = "claims_export.xlsx";
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
                break;
            case "json":
                data = generateJsonExport(filteredClaims);
                filename = "claims_export.json";
                mediaType = MediaType.APPLICATION_JSON;
                break;
            default: // csv
                data = generateCsvExport(filteredClaims);
                filename = "claims_export.csv";
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
                break;
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        
        return ResponseEntity.ok()
            .headers(headers)
            .body(data);
    }
    
    private byte[] generateCsvExport(List<Claim> claims) {
        StringBuilder csv = new StringBuilder();
        
        // Add header
        csv.append("Claim Number,Claim ID,Status,Examiner,State,Incident Date,Policy Number,Claimant Name,SSN,Program,Organization\n");
        
        // Add data rows
        for (Claim claim : claims) {
            csv.append(escapeForCsv(claim.getClaimNumber())).append(",")
               .append(escapeForCsv(String.valueOf(claim.getId()))).append(",")
               .append(escapeForCsv(claim.getStatus())).append(",")
               .append(escapeForCsv(claim.getExaminerCode())).append(",")
               .append(escapeForCsv(claim.getStateCode())).append(",")
               .append(escapeForCsv(claim.getIncidentDate() != null ? claim.getIncidentDate().toString() : "")).append(",")
               .append(escapeForCsv(claim.getPolicyNumber())).append(",")
               .append(escapeForCsv(claim.getClaimantName())).append(",")
               .append(escapeForCsv(claim.getSsn())).append(",")
               .append(escapeForCsv(claim.getProgramCode())).append(",")
               .append(escapeForCsv(claim.getOrganizationCode())).append("\n");
        }
        
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
    
    private byte[] generateJsonExport(List<Claim> claims) {
        StringBuilder json = new StringBuilder();
        json.append("{\"claims\":[");
        
        for (int i = 0; i < claims.size(); i++) {
            Claim claim = claims.get(i);
            if (i > 0) json.append(",");
            json.append("{")
                .append("\"claimNumber\":\"").append(escapeJson(claim.getClaimNumber())).append("\",")
                .append("\"claimId\":").append(claim.getId()).append(",")
                .append("\"status\":\"").append(escapeJson(claim.getStatus())).append("\",")
                .append("\"examiner\":\"").append(escapeJson(claim.getExaminerCode())).append("\",")
                .append("\"claimantName\":\"").append(escapeJson(claim.getClaimantName())).append("\"")
                .append("}");
        }
        
        json.append("]}");
        return json.toString().getBytes(StandardCharsets.UTF_8);
    }
    
    private String escapeForCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
    
    private String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
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