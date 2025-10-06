package com.claims.repository;

import com.claims.model.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    @Query("SELECT c FROM Claim c WHERE " +
           "c.active = '1' AND " +
           "(:q IS NULL OR LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.claimantName) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
           "(:claimNumber IS NULL OR LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :claimNumber, '%'))) AND " +
           "(:policyNumber IS NULL OR LOWER(c.policyNumber) LIKE LOWER(CONCAT('%', :policyNumber, '%'))) AND " +
           "(:claimantName IS NULL OR LOWER(c.claimantName) LIKE LOWER(CONCAT('%', :claimantName, '%'))) AND " +
           "(:ssn IS NULL OR c.ssn = :ssn) AND " +
           "(:dolStart IS NULL OR c.incidentDate >= :dolStart) AND " +
           "(:dolEnd IS NULL OR c.incidentDate <= :dolEnd) AND " +
           "(:reportedStart IS NULL OR c.incidentReportedDate >= :reportedStart) AND " +
           "(:reportedEnd IS NULL OR c.incidentReportedDate <= :reportedEnd) AND " +
           "(:statusList IS NULL OR c.claimStatusCode IN :statusList) AND " +
           "(:orgIds IS NULL OR c.org1Code IN :orgIds OR c.org2Code IN :orgIds OR c.org3Code IN :orgIds OR c.org4Code IN :orgIds) AND " +
           "(:examinerIds IS NULL OR c.examinerCode IN :examinerIds) AND " +
           "(:underwriterIds IS NULL OR c.underwriterCode IN :underwriterIds) AND " +
           "(:lossStates IS NULL OR c.lossStateCode IN :lossStates OR c.stateCode IN :lossStates) AND " +
           "(:programs IS NULL OR c.programCode IN :programs) AND " +
           "(:insuranceTypes IS NULL OR c.insuranceTypeId IN :insuranceTypes) AND " +
           "(:affiliateClaimNumber IS NULL OR LOWER(c.affiliateClaimNumber) LIKE LOWER(CONCAT('%', :affiliateClaimNumber, '%'))) AND " +
           "(:jurisdictionClaimNumber IS NULL OR LOWER(c.jurisdictionClaimNumber) LIKE LOWER(CONCAT('%', :jurisdictionClaimNumber, '%')))")
    Page<Claim> findClaimsWithFilters(
        @Param("q") String q,
        @Param("claimNumber") String claimNumber,
        @Param("policyNumber") String policyNumber,
        @Param("claimantName") String claimantName,
        @Param("ssn") String ssn,
        @Param("dolStart") LocalDateTime dolStart,
        @Param("dolEnd") LocalDateTime dolEnd,
        @Param("reportedStart") LocalDateTime reportedStart,
        @Param("reportedEnd") LocalDateTime reportedEnd,
        @Param("statusList") List<Long> statusList,
        @Param("orgIds") List<String> orgIds,
        @Param("examinerIds") List<String> examinerIds,
        @Param("underwriterIds") List<String> underwriterIds,
        @Param("lossStates") List<String> lossStates,
        @Param("programs") List<String> programs,
        @Param("insuranceTypes") List<Long> insuranceTypes,
        @Param("affiliateClaimNumber") String affiliateClaimNumber,
        @Param("jurisdictionClaimNumber") String jurisdictionClaimNumber,
        Pageable pageable
    );

    @Query("SELECT DISTINCT c.claimStatusCode FROM Claim c WHERE c.claimStatusCode IS NOT NULL AND c.active = '1' ORDER BY c.claimStatusCode")
    List<Long> findDistinctStatuses();

    @Query("SELECT DISTINCT c.lossStateCode FROM Claim c WHERE c.lossStateCode IS NOT NULL AND c.active = '1' ORDER BY c.lossStateCode")
    List<String> findDistinctLossStates();

    @Query("SELECT DISTINCT c.programCode FROM Claim c WHERE c.programCode IS NOT NULL AND c.active = '1' ORDER BY c.programCode")
    List<String> findDistinctPrograms();

    @Query("SELECT DISTINCT c.insuranceTypeId FROM Claim c WHERE c.insuranceTypeId IS NOT NULL AND c.active = '1' ORDER BY c.insuranceTypeId")
    List<Long> findDistinctInsuranceTypes();

    @Query("SELECT DISTINCT c.examinerCode FROM Claim c WHERE c.examinerCode IS NOT NULL AND c.active = '1' ORDER BY c.examinerCode")
    List<String> findDistinctExaminers();

    @Query("SELECT DISTINCT c.underwriterCode FROM Claim c WHERE c.underwriterCode IS NOT NULL AND c.active = '1' ORDER BY c.underwriterCode")
    List<String> findDistinctUnderwriters();

    @Query("SELECT DISTINCT c.organizationCode FROM Claim c WHERE c.organizationCode IS NOT NULL AND c.active = '1' ORDER BY c.organizationCode")
    List<String> findDistinctOrganizations();

    // Typeahead queries
    @Query("SELECT DISTINCT c.claimantName FROM Claim c WHERE c.claimantName IS NOT NULL AND c.active = '1' " +
           "AND LOWER(c.claimantName) LIKE LOWER(CONCAT('%', :term, '%')) ORDER BY c.claimantName LIMIT 10")
    List<String> findClaimantNamesByTerm(@Param("term") String term);

    @Query("SELECT DISTINCT c.claimNumber FROM Claim c WHERE c.claimNumber IS NOT NULL AND c.active = '1' " +
           "AND LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :term, '%')) ORDER BY c.claimNumber LIMIT 10")
    List<String> findClaimNumbersByTerm(@Param("term") String term);

    @Query("SELECT DISTINCT c.policyNumber FROM Claim c WHERE c.policyNumber IS NOT NULL AND c.active = '1' " +
           "AND LOWER(c.policyNumber) LIKE LOWER(CONCAT('%', :term, '%')) ORDER BY c.policyNumber LIMIT 10")
    List<String> findPolicyNumbersByTerm(@Param("term") String term);

    @Query("SELECT DISTINCT c.examinerCode FROM Claim c WHERE c.examinerCode IS NOT NULL AND c.active = '1' " +
           "AND LOWER(c.examinerCode) LIKE LOWER(CONCAT('%', :term, '%')) ORDER BY c.examinerCode LIMIT 10")
    List<String> findExaminersByTerm(@Param("term") String term);

    @Query("SELECT DISTINCT c.programCode FROM Claim c WHERE c.programCode IS NOT NULL AND c.active = '1' " +
           "AND LOWER(c.programCode) LIKE LOWER(CONCAT('%', :term, '%')) ORDER BY c.programCode LIMIT 10")
    List<String> findProgramsByTerm(@Param("term") String term);

    @Query("SELECT DISTINCT c.underwriterCode FROM Claim c WHERE c.underwriterCode IS NOT NULL AND c.active = '1' " +
           "AND LOWER(c.underwriterCode) LIKE LOWER(CONCAT('%', :term, '%')) ORDER BY c.underwriterCode LIMIT 10")
    List<String> findUnderwritersByTerm(@Param("term") String term);
}