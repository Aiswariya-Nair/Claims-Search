package com.claims.controller;

import com.claims.dto.ClaimDto;
import com.claims.dto.ClaimsResponse;
import com.claims.service.ClaimsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class ClaimsController {

    @Autowired
    private ClaimsService claimsService;

    // Add root endpoint to prevent whitelabel error
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Claims Backend API is running");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/claims")
    public ResponseEntity<Map<String, Object>> searchClaims(@RequestParam Map<String, Object> filters) {
        try {
            // Convert page to 0-based for internal processing but keep API 1-based
            if (filters.containsKey("page")) {
                int page = Integer.parseInt(filters.get("page").toString());
                filters.put("page", Math.max(0, page - 1)); // Convert to 0-based
            }
            if (filters.containsKey("pageSize")) {
                filters.put("pageSize", Integer.parseInt(filters.get("pageSize").toString()));
            }

            ClaimsResponse response = claimsService.searchClaims(filters);
            
            // Convert to API response format
            Map<String, Object> apiResponse = new HashMap<>();
            apiResponse.put("items", response.getClaims());
            apiResponse.put("page", response.getCurrentPage() + 1); // Convert back to 1-based
            apiResponse.put("pageSize", response.getPageSize());
            apiResponse.put("total", response.getTotalRecords());
            
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error searching claims: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/fetchMyqueue")
    public ResponseEntity<Map<String, Object>> getMyQueue(@RequestParam Map<String, Object> filters) {
        try {
            ClaimsResponse response = claimsService.getMyQueue(filters);
            
            // Convert to myqueue API response format
            Map<String, Object> queueResponse = new HashMap<>();
            queueResponse.put("iTotalRecords", response.getTotalRecords());
            queueResponse.put("iTotalDisplayRecords", response.getTotalRecords());
            queueResponse.put("data", response.getClaims());
            
            return ResponseEntity.ok(queueResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error fetching queue: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/claims/{claimId}")
    public ResponseEntity<ClaimDto> getClaimById(@PathVariable Long claimId) {
        try {
            ClaimDto claim = claimsService.getClaimById(claimId);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/claims")
    public ResponseEntity<ClaimDto> createClaim(@RequestBody ClaimDto claim) {
        try {
            ClaimDto createdClaim = claimsService.createClaim(claim);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Dropdown APIs
    @GetMapping("/claims/statuses")
    public ResponseEntity<List<Map<String, Object>>> getClaimStatuses() {
        try {
            List<Map<String, Object>> statuses = claimsService.getClaimStatuses();
            return ResponseEntity.ok(statuses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/loss-states")
    public ResponseEntity<List<Map<String, Object>>> getLossStates() {
        try {
            List<Map<String, Object>> lossStates = claimsService.getLossStates();
            return ResponseEntity.ok(lossStates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/programs")
    public ResponseEntity<List<Map<String, Object>>> getPrograms() {
        try {
            List<Map<String, Object>> programs = claimsService.getPrograms();
            return ResponseEntity.ok(programs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/insurance-types")
    public ResponseEntity<List<Map<String, Object>>> getInsuranceTypes() {
        try {
            List<Map<String, Object>> insuranceTypes = claimsService.getInsuranceTypes();
            return ResponseEntity.ok(insuranceTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/examiners")
    public ResponseEntity<List<Map<String, Object>>> getExaminers() {
        try {
            List<Map<String, Object>> examiners = claimsService.getExaminers();
            return ResponseEntity.ok(examiners);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/organizations")
    public ResponseEntity<List<Map<String, Object>>> getOrganizations() {
        try {
            List<Map<String, Object>> organizations = claimsService.getOrganizations();
            return ResponseEntity.ok(organizations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/underwriters")
    public ResponseEntity<List<Map<String, Object>>> getUnderwriters() {
        try {
            List<Map<String, Object>> underwriters = claimsService.getUnderwriters();
            return ResponseEntity.ok(underwriters);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Typeahead APIs
    @GetMapping("/claims/typeahead/employer")
    public ResponseEntity<List<Map<String, Object>>> getEmployerTypeahead(@RequestParam String term) {
        try {
            List<Map<String, Object>> employers = claimsService.getEmployerTypeahead(term);
            return ResponseEntity.ok(employers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/typeahead/claim-number")
    public ResponseEntity<List<String>> getClaimNumberTypeahead(@RequestParam String term) {
        try {
            List<String> claimNumbers = claimsService.getClaimNumberTypeahead(term);
            return ResponseEntity.ok(claimNumbers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/typeahead/policy-number")
    public ResponseEntity<List<String>> getPolicyNumberTypeahead(@RequestParam String term) {
        try {
            List<String> policyNumbers = claimsService.getPolicyNumberTypeahead(term);
            return ResponseEntity.ok(policyNumbers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/typeahead/program")
    public ResponseEntity<List<String>> getProgramTypeahead(@RequestParam String term) {
        try {
            List<String> programs = claimsService.getProgramTypeahead(term);
            return ResponseEntity.ok(programs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/typeahead/underwriter")
    public ResponseEntity<List<String>> getUnderwriterTypeahead(@RequestParam String term) {
        try {
            List<String> underwriters = claimsService.getUnderwriterTypeahead(term);
            return ResponseEntity.ok(underwriters);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/claims/export")
    public ResponseEntity<byte[]> exportClaims(
            @RequestParam Map<String, Object> filters,
            @RequestParam(defaultValue = "csv") String format) {
        try {
            // Get the filtered data
            filters.put("pageSize", 10000); // Large page size for export
            ClaimsResponse response = claimsService.searchClaims(filters);
            
            // Generate export data based on format
            byte[] data;
            String filename;
            MediaType mediaType;
            
            switch (format.toLowerCase()) {
                case "xlsx":
                    data = generateExcelExport(response.getClaims());
                    filename = "claims_export.xlsx";
                    mediaType = MediaType.APPLICATION_OCTET_STREAM;
                    break;
                case "json":
                    data = generateJsonExport(response.getClaims());
                    filename = "claims_export.json";
                    mediaType = MediaType.APPLICATION_JSON;
                    break;
                default: // csv
                    data = generateCsvExport(response.getClaims());
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private byte[] generateCsvExport(List<ClaimDto> claims) {
        StringBuilder csv = new StringBuilder();
        
        // Add header with 🔍 symbol as per requirements
        csv.append("Claim Number,Status,Examiner,State,Incident Date,Policy Number,Claimant Name,SSN,Program,Organization\n");
        
        // Add data rows
        for (ClaimDto claim : claims) {
            csv.append(escapeForCsv(claim.getClaimNumber())).append(",")
               .append(escapeForCsv(claim.getStatus())).append(",")
               .append(escapeForCsv(claim.getExaminer())).append(",")
               .append(escapeForCsv(claim.getStateCode())).append(",")
               .append(escapeForCsv(claim.getIncidentDateStr())).append(",")
               .append(escapeForCsv(claim.getPolicyNumber())).append(",")
               .append(escapeForCsv(claim.getClaimantName())).append(",")
               .append(escapeForCsv(claim.getSsn())).append(",")
               .append(escapeForCsv(claim.getProgramDesc())).append(",")
               .append(escapeForCsv(claim.getOrganizationCode())).append("\n");
        }
        
        return csv.toString().getBytes();
    }

    private byte[] generateExcelExport(List<ClaimDto> claims) {
        // For now, return CSV format with Excel extension
        // In production, use Apache POI to generate actual Excel files
        return generateCsvExport(claims);
    }

    private byte[] generateJsonExport(List<ClaimDto> claims) {
        // Simple JSON export - in production use Jackson ObjectMapper
        StringBuilder json = new StringBuilder();
        json.append("{\"claims\":[");
        
        for (int i = 0; i < claims.size(); i++) {
            ClaimDto claim = claims.get(i);
            if (i > 0) json.append(",");
            json.append("{")
                .append("\"claimNumber\":\"").append(claim.getClaimNumber()).append("\",")
                .append("\"status\":\"").append(claim.getStatus()).append("\",")
                .append("\"examiner\":\"").append(claim.getExaminer()).append("\",")
                .append("\"claimantName\":\"").append(claim.getClaimantName()).append("\"")
                .append("}");
        }
        
        json.append("]}");
        return json.toString().getBytes();
    }

    private String escapeForCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}