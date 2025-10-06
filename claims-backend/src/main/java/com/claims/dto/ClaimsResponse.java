package com.claims.dto;

import java.util.List;

public class ClaimsResponse {
    private List<ClaimDto> claims;
    private long totalRecords;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    public ClaimsResponse() {}

    public ClaimsResponse(List<ClaimDto> claims, long totalRecords, int totalPages, int currentPage, int pageSize) {
        this.claims = claims;
        this.totalRecords = totalRecords;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    // Getters and Setters
    public List<ClaimDto> getClaims() {
        return claims;
    }

    public void setClaims(List<ClaimDto> claims) {
        this.claims = claims;
    }

    public long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
}