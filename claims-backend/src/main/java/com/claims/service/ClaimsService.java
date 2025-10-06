package com.claims.service;

import com.claims.dto.ClaimDto;
import com.claims.dto.ClaimsResponse;
import com.claims.model.Claim;
import com.claims.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class ClaimsService {

    @Autowired
    private ClaimRepository claimRepository;

    public ClaimsResponse searchClaims(Map<String, Object> filters) {
        try {
            // Extract pagination parameters
            int page = Math.max(0, (Integer) filters.getOrDefault("page", 0));
            int pageSize = Math.min(100, Math.max(1, (Integer) filters.getOrDefault("pageSize", 25)));
            String sortBy = (String) filters.getOrDefault("sort", "addDate:desc");
            
            // Parse sort parameter
            Sort sort = parseSort(sortBy);
            Pageable pageable = PageRequest.of(page, pageSize, sort);

            // Extract and validate filter parameters
            String q = sanitizeString((String) filters.get("q"));
            String claimNumber = sanitizeString((String) filters.get("claimNumber"));
            String policyNumber = sanitizeString((String) filters.get("policyNumber"));
            String claimantName = sanitizeString((String) filters.get("claimantName"));
            String ssn = sanitizeString((String) filters.get("ssn"));
            String affiliateClaimNumber = sanitizeString((String) filters.get("affiliateClaimNumber"));
            String jurisdictionClaimNumber = sanitizeString((String) filters.get("jurisdictionClaimNumber"));
            
            // Parse date filters
            LocalDateTime dolStart = parseDate((String) filters.get("dolStart"));
            LocalDateTime dolEnd = parseDate((String) filters.get("dolEnd"));
            LocalDateTime reportedStart = parseDate((String) filters.get("reportedStart"));
            LocalDateTime reportedEnd = parseDate((String) filters.get("reportedEnd"));
            
            // Parse list filters
            List<Long> statusList = parseLongList((String) filters.get("status"));
            List<String> orgIds = parseStringList((String) filters.get("orgIds"));
            List<String> examinerIds = parseStringList((String) filters.get("adjusterIds"));
            List<String> underwriterIds = parseStringList((String) filters.get("underwriterIds"));
            List<String> lossStates = parseStringList((String) filters.get("lossStates"));
            List<String> programs = parseStringList((String) filters.get("programs"));
            List<Long> insuranceTypes = parseLongList((String) filters.get("insuranceTypes"));

            // Execute search
            Page<Claim> claimsPage = claimRepository.findClaimsWithFilters(
                q, claimNumber, policyNumber, claimantName, ssn,
                dolStart, dolEnd, reportedStart, reportedEnd,
                statusList, orgIds, examinerIds, underwriterIds,
                lossStates, programs, insuranceTypes,
                affiliateClaimNumber, jurisdictionClaimNumber,
                pageable
            );

            // Convert to DTOs with enhanced data
            List<ClaimDto> claimDtos = claimsPage.getContent()
                .stream()
                .map(this::convertToEnhancedDto)
                .collect(Collectors.toList());

            return new ClaimsResponse(
                claimDtos,
                claimsPage.getTotalElements(),
                claimsPage.getTotalPages(),
                claimsPage.getNumber(),
                claimsPage.getSize()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error searching claims: " + e.getMessage(), e);
        }
    }

    public ClaimsResponse getMyQueue(Map<String, Object> filters) {
        // This method provides the API response format as specified in requirements
        return searchClaims(filters);
    }

    public ClaimDto getClaimById(Long claimId) {
        if (claimId == null || claimId <= 0) {
            throw new IllegalArgumentException("Invalid claim ID: " + claimId);
        }
        
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));
        return convertToEnhancedDto(claim);
    }

    public List<Map<String, Object>> getClaimStatuses() {
        try {
            return claimRepository.findDistinctStatuses()
                .stream()
                .map(status -> {
                    Map<String, Object> statusMap = new HashMap<>();
                    statusMap.put("statusCode", status);
                    statusMap.put("statusDesc", getStatusDescription(status));
                    return statusMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving claim statuses: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getLossStates() {
        try {
            return claimRepository.findDistinctLossStates()
                .stream()
                .map(state -> {
                    Map<String, Object> stateMap = new HashMap<>();
                    stateMap.put("stateCode", state);
                    stateMap.put("stateDesc", getStateDescription(state));
                    return stateMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving loss states: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getPrograms() {
        try {
            return claimRepository.findDistinctPrograms()
                .stream()
                .map(program -> {
                    Map<String, Object> programMap = new HashMap<>();
                    programMap.put("programCode", program);
                    programMap.put("programDesc", getProgramDescription(program));
                    return programMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving programs: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getInsuranceTypes() {
        try {
            return claimRepository.findDistinctInsuranceTypes()
                .stream()
                .map(type -> {
                    Map<String, Object> typeMap = new HashMap<>();
                    typeMap.put("insuranceType", type);
                    typeMap.put("insuranceTypeDesc", getInsuranceTypeDescription(type));
                    return typeMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving insurance types: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getExaminers() {
        try {
            return claimRepository.findDistinctExaminers()
                .stream()
                .map(examiner -> {
                    Map<String, Object> examinerMap = new HashMap<>();
                    examinerMap.put("examinerCode", examiner);
                    examinerMap.put("examinerName", getExaminerName(examiner));
                    return examinerMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving examiners: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getOrganizations() {
        try {
            return claimRepository.findDistinctOrganizations()
                .stream()
                .map(org -> {
                    Map<String, Object> orgMap = new HashMap<>();
                    orgMap.put("orgCode", org);
                    orgMap.put("orgDesc", getOrganizationDescription(org));
                    return orgMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving organizations: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getUnderwriters() {
        try {
            return claimRepository.findDistinctUnderwriters()
                .stream()
                .map(underwriter -> {
                    Map<String, Object> underwriterMap = new HashMap<>();
                    underwriterMap.put("underwriterCode", underwriter);
                    underwriterMap.put("underwriterName", getUnderwriterName(underwriter));
                    return underwriterMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving underwriters: " + e.getMessage(), e);
        }
    }

    // Typeahead methods
    public List<Map<String, Object>> getEmployerTypeahead(String term) {
        try {
            return claimRepository.findClaimantNamesByTerm(term)
                .stream()
                .map(name -> {
                    Map<String, Object> employerMap = new HashMap<>();
                    employerMap.put("insured", name);
                    employerMap.put("insured_id", name.hashCode());
                    return employerMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving employer typeahead: " + e.getMessage(), e);
        }
    }

    public List<String> getClaimNumberTypeahead(String term) {
        try {
            return claimRepository.findClaimNumbersByTerm(term);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving claim number typeahead: " + e.getMessage(), e);
        }
    }

    public List<String> getPolicyNumberTypeahead(String term) {
        try {
            return claimRepository.findPolicyNumbersByTerm(term);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving policy number typeahead: " + e.getMessage(), e);
        }
    }

    public List<String> getProgramTypeahead(String term) {
        try {
            return claimRepository.findProgramsByTerm(term);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving program typeahead: " + e.getMessage(), e);
        }
    }

    public List<String> getUnderwriterTypeahead(String term) {
        try {
            return claimRepository.findUnderwritersByTerm(term);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving underwriter typeahead: " + e.getMessage(), e);
        }
    }

    public ClaimDto createClaim(ClaimDto claimDto) {
        try {
            validateClaimDto(claimDto);
            
            Claim claim = convertDtoToEntity(claimDto);
            claim.setAddDate(LocalDateTime.now());
            claim.setActive("1");
            
            Claim savedClaim = claimRepository.save(claim);
            return convertToEnhancedDto(savedClaim);
        } catch (Exception e) {
            throw new RuntimeException("Error creating claim: " + e.getMessage(), e);
        }
    }

    // Utility methods
    private Sort parseSort(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "addDate");
        }
        
        String[] parts = sortBy.split(":");
        if (parts.length != 2) {
            return Sort.by(Sort.Direction.DESC, "addDate");
        }
        
        String field = parts[0];
        String direction = parts[1].toLowerCase();
        
        Sort.Direction sortDirection = "asc".equals(direction) ? 
            Sort.Direction.ASC : Sort.Direction.DESC;
            
        return Sort.by(sortDirection, field);
    }

    private String sanitizeString(String input) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        return input.trim();
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        try {
            // Try different date formats
            String[] formats = {
                "yyyy-MM-dd'T'HH:mm:ss",
                "yyyy-MM-dd HH:mm:ss",
                "yyyy-MM-dd",
                "MM/dd/yyyy",
                "MM-dd-yyyy"
            };
            
            for (String format : formats) {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                    if (format.equals("yyyy-MM-dd")) {
                        return LocalDateTime.parse(dateStr + "T00:00:00");
                    }
                    return LocalDateTime.parse(dateStr, formatter);
                } catch (DateTimeParseException ignored) {
                    // Try next format
                }
            }
            
            throw new IllegalArgumentException("Unable to parse date: " + dateStr);
        } catch (Exception e) {
            return null; // Return null for invalid dates instead of throwing
        }
    }

    private List<Long> parseLongList(String listStr) {
        if (listStr == null || listStr.trim().isEmpty()) {
            return null;
        }
        
        try {
            return List.of(listStr.split(","))
                .stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::parseLong)
                .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private List<String> parseStringList(String listStr) {
        if (listStr == null || listStr.trim().isEmpty()) {
            return null;
        }
        
        return List.of(listStr.split(","))
            .stream()
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
    }

    private ClaimDto convertToEnhancedDto(Claim claim) {
        ClaimDto dto = new ClaimDto(claim);
        
        // Add enhanced fields
        dto.setStatus(getStatusDescription(claim.getClaimStatusCode()));
        dto.setLossState(getStateDescription(claim.getLossStateCode()));
        dto.setProgramDesc(getProgramDescription(claim.getProgramCode()));
        dto.setExaminer(getExaminerName(claim.getExaminerCode()));
        dto.setInsuranceTypeDesc(getInsuranceTypeDescription(claim.getInsuranceTypeId()));
        dto.setAdjustingOfficeDesc(getAdjustingOfficeDescription(claim.getAdjustingOfficeCode()));
        dto.setJurisdictionDesc(getJurisdictionDescription(claim.getJurisdictionCode()));
        
        // Set formatted dates
        if (claim.getIncidentDate() != null) {
            dto.setIncidentDateStr(claim.getIncidentDate().format(DateTimeFormatter.ofPattern("MM-dd-yyyy hh:mm:ss a")));
        }
        if (claim.getAddDate() != null) {
            dto.setAddDateStr(claim.getAddDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm:ss a")));
        }
        if (claim.getClaimClosedDate() != null) {
            dto.setClosedDateStr(claim.getClaimClosedDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm:ss a")));
        }
        
        // Set status flag
        dto.setStatusFlag(determineStatusFlag(claim));
        
        return dto;
    }

    private Claim convertDtoToEntity(ClaimDto dto) {
        Claim claim = new Claim();
        claim.setClaimNumber(dto.getClaimNumber());
        claim.setClaimStatusCode(dto.getClaimStatusCode());
        claim.setExaminerCode(dto.getExaminerCode());
        claim.setAdjustingOfficeCode(dto.getAdjustingOfficeCode());
        claim.setStateCode(dto.getStateCode());
        claim.setPolicyNumber(dto.getPolicyNumber());
        claim.setClaimantName(dto.getClaimantName());
        claim.setSsn(dto.getSsn());
        claim.setProgramCode(dto.getProgramCode());
        claim.setInsuranceTypeId(dto.getInsuranceTypeId());
        claim.setOrganizationCode(dto.getOrganizationCode());
        claim.setOrg1Code(dto.getOrg1Code());
        claim.setOrg2Code(dto.getOrg2Code());
        claim.setOrg3Code(dto.getOrg3Code());
        claim.setOrg4Code(dto.getOrg4Code());
        claim.setLossState(dto.getLossState());
        claim.setLossStateCode(dto.getLossStateCode());
        claim.setUnderwriterCode(dto.getUnderwriterCode());
        claim.setJurisdictionCode(dto.getJurisdictionCode());
        claim.setAffiliateClaimNumber(dto.getAffiliateClaimNumber());
        claim.setJurisdictionClaimNumber(dto.getJurisdictionClaimNumber());
        
        if (dto.getIncidentDate() != null) {
            claim.setIncidentDate(LocalDateTime.parse(dto.getIncidentDate()));
        }
        if (dto.getIncidentReportedDate() != null) {
            claim.setIncidentReportedDate(LocalDateTime.parse(dto.getIncidentReportedDate()));
        }
        
        return claim;
    }

    private void validateClaimDto(ClaimDto dto) {
        if (dto.getClaimNumber() == null || dto.getClaimNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Claim number is required");
        }
        if (dto.getClaimStatusCode() == null) {
            throw new IllegalArgumentException("Claim status code is required");
        }
        if (dto.getExaminerCode() == null || dto.getExaminerCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Examiner code is required");
        }
    }

    private String determineStatusFlag(Claim claim) {
        // Determine if claim is reopened (R) or normal
        if (claim.getClaimStatusCode() != null && claim.getClaimStatusCode() == 4) {
            return "R ";
        }
        return "";
    }

    // Description mapping methods (in production, these would come from lookup tables)
    private String getStatusDescription(Long statusCode) {
        if (statusCode == null) return "Unknown";
        
        Map<Long, String> statusMap = Map.of(
            1L, "Open",
            2L, "Closed",
            3L, "Pending",
            4L, "Reopened",
            5L, "Denied"
        );
        return statusMap.getOrDefault(statusCode, "Status " + statusCode);
    }

    private String getStateDescription(String stateCode) {
        if (stateCode == null) return "Unknown";
        
        Map<String, String> stateMap = Map.of(
            "AK", "Alaska",
            "CA", "California",
            "NY", "New York",
            "TX", "Texas",
            "FL", "Florida",
            "IL", "Illinois",
            "WA", "Washington"
        );
        return stateMap.getOrDefault(stateCode, stateCode);
    }

    private String getProgramDescription(String programCode) {
        if (programCode == null) return "Unknown";
        
        Map<String, String> programMap = Map.of(
            "AUTO", "Auto Insurance",
            "HOME", "Home Insurance",
            "LIFE", "Life Insurance",
            "HEALTH", "Health Insurance",
            "WC", "Workers Compensation",
            "GL", "General Liability"
        );
        return programMap.getOrDefault(programCode, programCode);
    }

    private String getInsuranceTypeDescription(Long typeId) {
        if (typeId == null) return "Unknown";
        
        Map<Long, String> typeMap = Map.of(
            1L, "Comprehensive",
            2L, "Collision",
            3L, "Liability",
            4L, "Auto",
            5L, "Personal Injury Protection",
            10L, "Business Interruption"
        );
        return typeMap.getOrDefault(typeId, "Type " + typeId);
    }

    private String getExaminerName(String examinerCode) {
        if (examinerCode == null) return "Unknown";
        
        Map<String, String> examinerMap = Map.of(
            "hkhan", "Haseeb Khan",
            "jsmith", "John Smith",
            "jdoe", "Jane Doe",
            "EX001", "John Smith",
            "EX002", "Jane Doe",
            "EX003", "Bob Johnson",
            "EX004", "Alice Brown"
        );
        return examinerMap.getOrDefault(examinerCode, examinerCode);
    }

    private String getOrganizationDescription(String orgCode) {
        if (orgCode == null) return "Unknown";
        
        Map<String, String> orgMap = Map.of(
            "ORG001", "Organization 1",
            "ORG002", "Organization 2",
            "ORG003", "Organization 3"
        );
        return orgMap.getOrDefault(orgCode, orgCode);
    }

    private String getUnderwriterName(String underwriterCode) {
        if (underwriterCode == null) return "Unknown";
        
        Map<String, String> underwriterMap = Map.of(
            "UW001", "Underwriter 1",
            "UW002", "Underwriter 2",
            "UW003", "Underwriter 3"
        );
        return underwriterMap.getOrDefault(underwriterCode, underwriterCode);
    }

    private String getAdjustingOfficeDescription(String officeCode) {
        if (officeCode == null) return "Unknown";
        
        Map<String, String> officeMap = Map.of(
            "420", "Chicago",
            "421", "New York",
            "422", "Los Angeles",
            "ADJ001", "Main Office",
            "ADJ002", "Branch Office",
            "ADJ003", "Regional Office"
        );
        return officeMap.getOrDefault(officeCode, officeCode);
    }

    private String getJurisdictionDescription(Long jurisdictionCode) {
        if (jurisdictionCode == null) return "Unknown";
        
        Map<Long, String> jurisdictionMap = Map.of(
            1L, "Federal",
            2L, "State",
            3L, "Local"
        );
        return jurisdictionMap.getOrDefault(jurisdictionCode, "Jurisdiction " + jurisdictionCode);
    }
}