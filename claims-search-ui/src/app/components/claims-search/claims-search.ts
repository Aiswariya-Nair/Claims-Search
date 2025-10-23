import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ClaimsService } from '../../services/claims';
import { ConnectionTestService } from '../../services/connection-test';
import { Claim, ClaimsResponse } from '../../models/claim';
import { FilterParams } from '../../models/filter-params';
import { ClaimsGridComponent } from '../claims-grid/claims-grid.component';
import { ClaimDetailsModalComponent } from '../claim-details-modal/claim-details-modal.component';
import { ClaimsEditComponent } from '../claims-edit/claims-edit.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-claims-search',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ClaimsGridComponent
  ],
  templateUrl: './claims-search.html',
  styleUrls: ['./claims-search.scss']
})
export class ClaimsSearchComponent implements OnInit {
  searchForm: FormGroup;
  claims: Claim[] = [];
  loading = false;
  totalRecords = 0;
  currentPage = 1;
  pageSize = 20;
  backendConnected = false;
  private searchSubject = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private claimsService: ClaimsService,
    private connectionTest: ConnectionTestService
  ) {
    this.searchForm = this.createForm();
  }

  ngOnInit(): void {
    this.testBackendConnection();
    this.searchClaims();
  }

  /**
   * Handle form submission explicitly
   * This method is called when the form is submitted
   */
  onSubmit(): void {
    console.log('Form submitted');
    // Reset to first page when submitting a new search
    this.currentPage = 1;
    this.searchClaims();
  }

  testBackendConnection(): void {
    this.connectionTest.testConnection().subscribe({
      next: (response) => {
        console.log('Backend connection successful:', response);
        this.backendConnected = true;
      },
      error: (error) => {
        console.error('Backend connection failed:', error);
        this.backendConnected = false;
        alert('Cannot connect to backend server. Please ensure the backend application is running on port 8080.');
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      q: [''],
      claimNumber: [''],
      policyNumber: [''],
      claimantName: [''],
      ssn: [''],
      status: [[]],
      incidentDateStart: [''],
      incidentDateEnd: [''],
      lossState: [[]],
      program: [[]],
      insuranceType: [[]],
      examiner: [[]],
      organization: [[]]
    });
  }

  searchClaims(): void {
    this.loading = true;
    const filters = this.prepareFilters();
    
    console.log('Searching claims with filters:', filters);
    console.log('Current page:', this.currentPage);
    console.log('Page size:', this.pageSize);
    
    this.claimsService.searchClaims(filters).subscribe({
      next: (response: ClaimsResponse) => {
        console.log('Claims search response:', response);
        console.log('Claims received:', response.claims);
        console.log('Total records:', response.totalRecords);
        console.log('Current page from response:', response.currentPage);
        
        // Safe access to claims data from different response formats
        this.claims = response.claims || response.items || [];
        
        // Log the first few claim numbers to see the format
        console.log('First 10 claim numbers from backend:', this.claims.slice(0, 10).map(c => c.claimNumber));
        
        // Always sort claims by claim number to ensure proper order
        this.sortClaimsByNumber();
        
        this.totalRecords = response.totalRecords || response.total || 0;
        this.loading = false;
        
        if (this.claims.length === 0) {
          console.warn('No claims found in response');
        } else {
          console.log(`Found ${this.claims.length} claims on page ${this.currentPage}`);
          this.backendConnected = true;
          // Verify if claims are properly sorted
          this.verifySorting();
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading = false;
        this.backendConnected = false;
        // Show user-friendly error message
        alert(`Failed to load claims: ${error.message}. Please check if the backend is running on port 8080.`);
      }
    });
  }

  /**
   * Method to search by any individual field
   * @param fieldName The name of the field to search by
   */
  searchByField(fieldName: string): void {
    const fieldValue = this.searchForm.get(fieldName)?.value;
    console.log(`Searching by field ${fieldName}:`, fieldValue);
    
    // For multi-select fields, we need to handle them differently
    if (fieldName === 'status' || fieldName === 'lossState' || fieldName === 'program' || 
        fieldName === 'insuranceType' || fieldName === 'examiner' || fieldName === 'organization') {
      // For multi-select fields, we'll do a general search which will include these filters
      console.log('Triggering search for multi-select field');
      this.searchClaims();
      return;
    }
    
    // For date fields, we'll also do a general search
    if (fieldName === 'incidentDateStart' || fieldName === 'incidentDateEnd') {
      console.log('Triggering search for date field');
      this.searchClaims();
      return;
    }
    
    // For text fields, if there's a value, we'll do a general search with all filters
    if (fieldValue && fieldValue.trim() !== '') {
      console.log('Triggering search with value:', fieldValue);
      // Just trigger the general search which will include this field
      this.searchClaims();
      return;
    }
    
    // If no value, do a general search
    console.log('Triggering general search');
    this.searchClaims();
  }

  /**
   * Called when any filter value changes
   * This allows for real-time filtering if needed
   */
  onFilterChange(): void {
    console.log('Filter changed, triggering debounced search');
    // Trigger debounced search
    this.searchSubject.next();
  }

  prepareFilters(): FilterParams {
    const formValue = this.searchForm.value;
    console.log('Form values:', formValue);
    
    // Create base filters object
    const filters: FilterParams = {
      page: this.currentPage, // Keep as 1-based to match interface
      pageSize: this.pageSize,
      sort: 'claimNumber:asc' // Ensure explicit sort parameter
    };
    
    console.log('Preparing filters - currentPage:', this.currentPage, 'pageSize:', this.pageSize);
    
    // Map form values to filter parameters with proper names for backend
    // Text fields
    if (formValue.q) filters.q = formValue.q;
    if (formValue.claimNumber) filters.claimNumber = formValue.claimNumber;
    if (formValue.policyNumber) filters.policyNumber = formValue.policyNumber;
    if (formValue.claimantName) filters.claimantName = formValue.claimantName;
    if (formValue.ssn) filters.ssn = formValue.ssn;
    
    // Date fields (map to backend names)
    if (formValue.incidentDateStart) filters.dolStart = formValue.incidentDateStart;
    if (formValue.incidentDateEnd) filters.dolEnd = formValue.incidentDateEnd;
    
    // Multi-select fields (map to backend names and convert values)
    if (formValue.status && formValue.status.length > 0) {
      // Convert string status values to numbers for backend
      filters.status = formValue.status.map((s: string) => {
        switch(s) {
          case 'open': return 1;
          case 'closed': return 2;
          case 'pending': return 3;
          case 'settled': return 4;
          default: return 1; // default to open
        }
      });
    }
    
    if (formValue.lossState && formValue.lossState.length > 0) {
      filters.lossStates = formValue.lossState;
    }
    
    if (formValue.program && formValue.program.length > 0) {
      filters.programs = formValue.program;
    }
    
    if (formValue.insuranceType && formValue.insuranceType.length > 0) {
      filters.insuranceTypes = formValue.insuranceType.map((t: string) => parseInt(t, 10));
    }
    
    if (formValue.examiner && formValue.examiner.length > 0) {
      filters.adjusterIds = formValue.examiner;
    }
    
    if (formValue.organization && formValue.organization.length > 0) {
      filters.orgIds = formValue.organization;
    }
    
    console.log('Prepared filters with proper backend mapping:', filters);
    return filters;
  }

  resetForm(): void {
    this.searchForm.reset();
    // Clear the form completely by setting all values to empty
    this.searchForm.patchValue({
      q: '',
      claimNumber: '',
      policyNumber: '',
      claimantName: '',
      ssn: '',
      status: [],
      incidentDateStart: '',
      incidentDateEnd: '',
      lossState: [],
      program: [],
      insuranceType: [],
      examiner: [],
      organization: []
    });
    this.currentPage = 1;
    this.claims = [];
    this.totalRecords = 0;
    this.searchClaims();
  }

  onPageChange(page: number): void {
    console.log('Page change requested:', page);
    console.log('Current page before change:', this.currentPage);
    this.currentPage = page;
    console.log('Current page after change:', this.currentPage);
    console.log('Calling searchClaims with updated page');
    this.searchClaims();
    
    // Force change detection
    setTimeout(() => {
      console.log('After timeout - currentPage:', this.currentPage);
    }, 0);
  }

  exportData(format: 'csv' | 'xlsx' | 'json'): void {
    if (this.claims.length === 0) {
      alert('No claims data to export. Please search for claims first.');
      return;
    }

    const filters = this.prepareFilters();
    console.log(`Exporting ${this.claims.length} claims as ${format}...`);
    
    this.claimsService.exportClaims(filters, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `claims-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log(`Export completed: ${format}`);
      },
      error: (error) => {
        console.error('Export error:', error);
        alert(`Failed to export data: ${error.message}`);
      }
    });
  }

  addTestClaim(): void {
    const newClaim: Claim = {
      claimNumber: 'CLM012',
      claimStatusCode: 1,
      examinerCode: 'EX001',
      adjustingOfficeCode: 'ADJ001',
      stateCode: 'CA',
      incidentDate: '2024-02-01T10:00:00',
      addDate: new Date().toISOString(),
      policyNumber: 'POL012',
      claimantName: 'Test User',
      ssn: '123-45-6789',
      programDesc: 'AUTO',
      insuranceTypeId: 1,
      examiner: 'John Smith'
    };

    this.claimsService.createClaim(newClaim).subscribe({
      next: (createdClaim) => {
        console.log('Claim created:', createdClaim);
        // Refresh the claims list
        this.currentPage = 1;
        this.searchClaims();
      },
      error: (error) => {
        console.error('Error creating claim:', error);
        alert(`Failed to create claim: ${error.message}`);
      }
    });
  }

  // Add this method to test the API response
  testApi(): void {
    console.log('Testing API connection...');
    this.claimsService.testApi().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        
        // Safe access to claims array
        const claims = response.claims || response.items || [];
        console.log('Claims from API:', claims);
        console.log('Number of claims:', claims.length);
        
        // Only access first claim if it exists
        if (claims && claims.length > 0) {
          const firstClaim = claims[0];
          console.log('First claim:', firstClaim);
          console.log('First claim ID:', firstClaim.claimId);
          console.log('First claim status code:', firstClaim.claimStatusCode);
          console.log('First claim number:', firstClaim.claimNumber);
          console.log('First claim examiner code:', firstClaim.examinerCode);
          console.log('First claim adjusting office code:', firstClaim.adjustingOfficeCode);
          console.log('First claim state code:', firstClaim.stateCode);
          console.log('First claim incident date:', firstClaim.incidentDate);
          console.log('First claim add date:', firstClaim.addDate);
          console.log('First claim policy number:', firstClaim.policyNumber);
          console.log('First claim claimant name:', firstClaim.claimantName);
          console.log('First claim SSN:', firstClaim.ssn);
          console.log('First claim program code:', firstClaim.programDesc);
          console.log('First claim insurance type ID:', firstClaim.insuranceTypeId);
          console.log('First claim organization code:', firstClaim.organizationCode);
        } else {
          console.log('No claims found in response');
        }
      },
      error: (error) => {
        console.error('API Test Error:', error);
        this.backendConnected = false;
      }
    });
  }

  // Add this method to test sorting specifically
  testSorting(): void {
    console.log('Testing claim number sorting (CLM-XXX format)...');
    
    // Create a test array with CLM-XXX format claim numbers
    const testClaims: Claim[] = [
      { claimNumber: 'CLM-010', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-001', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-005', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-002', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-007', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-003', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-009', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-004', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-006', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' },
      { claimNumber: 'CLM-008', claimStatusCode: 1, examinerCode: 'test', adjustingOfficeCode: 'test', stateCode: 'CA', incidentDate: '2024-01-01', addDate: '2024-01-01' }
    ];
    
    console.log('Before sorting:', testClaims.map(c => c.claimNumber));
    
    // Sort using the same logic
    testClaims.sort((a, b) => {
      const numA = this.extractClaimNumber(a.claimNumber);
      const numB = this.extractClaimNumber(b.claimNumber);
      return numA - numB;
    });
    
    console.log('After sorting:', testClaims.map(c => c.claimNumber));
    
    // Expected order should be:
    // CLM-001, CLM-002, CLM-003, CLM-004, CLM-005, CLM-006, CLM-007, CLM-008, CLM-009, CLM-010
  }

  // Add this method to test backend sorting
  testBackendSorting(): void {
    console.log('Testing backend sorting...');
    
    this.claimsService.testSorting().subscribe({
      next: (response) => {
        console.log('Backend sorting test response:', response);
      },
      error: (error) => {
        console.error('Backend sorting test error:', error);
      }
    });
  }

  // Add this method to verify if claims are sorted correctly
  verifySorting(): void {
    if (this.claims.length < 2) {
      console.log('Not enough claims to verify sorting');
      return;
    }
    
    console.log('Verifying claim number sorting (CLM-XXX format)...');
    
    let isSorted = true;
    let firstUnsortedIndex = -1;
    
    for (let i = 0; i < this.claims.length - 1; i++) {
      const current = this.extractClaimNumber(this.claims[i].claimNumber);
      const next = this.extractClaimNumber(this.claims[i + 1].claimNumber);
      
      if (current > next) {
        console.log(`Sorting issue found at index ${i}: ${this.claims[i].claimNumber}(${current}) > ${this.claims[i + 1].claimNumber}(${next})`);
        isSorted = false;
        if (firstUnsortedIndex === -1) {
          firstUnsortedIndex = i;
        }
      }
    }
    
    if (isSorted) {
      console.log('Claims are properly sorted by claim number');
    } else {
      console.log('Claims are NOT properly sorted by claim number - applying manual sort');
      // Apply manual sorting as a fallback
      this.sortClaimsByNumber();
      
      // Verify again after sorting
      this.verifySortingAfterFix();
    }
  }
  
  // Method to verify sorting after applying fix
  verifySortingAfterFix(): void {
    console.log('Verifying sorting after manual fix...');
    
    let isSorted = true;
    for (let i = 0; i < this.claims.length - 1; i++) {
      const current = this.extractClaimNumber(this.claims[i].claimNumber);
      const next = this.extractClaimNumber(this.claims[i + 1].claimNumber);
      
      if (current > next) {
        console.log(`Still unsorted at index ${i}: ${this.claims[i].claimNumber}(${current}) > ${this.claims[i + 1].claimNumber}(${next})`);
        isSorted = false;
      }
    }
    
    if (isSorted) {
      console.log('Claims are now properly sorted by claim number');
    } else {
      console.log('Warning: Claims are still not properly sorted');
    }
  }
  
  // Manual sort method that can be called to re-sort the current claims
  manualSort(): void {
    console.log('Manually sorting claims (CLM-XXX format)...');
    console.log('Before manual sort:', this.claims.slice(0, 10).map(c => c.claimNumber));
    
    this.claims.sort((a, b) => {
      const numA = this.extractClaimNumber(a.claimNumber);
      const numB = this.extractClaimNumber(b.claimNumber);
      return numA - numB;
    });
    
    console.log('After manual sort:', this.claims.slice(0, 10).map(c => c.claimNumber));
  }

  // Method to force a search with explicit sorting
  forceSortedSearch(): void {
    console.log('Forcing sorted search (CLM-XXX format)...');
    
    // Reset to first page
    this.currentPage = 1;
    
    // Prepare filters with explicit sort
    const filters = this.prepareFilters();
    filters.sort = 'claimNumber:asc';
    
    console.log('Forcing search with filters:', filters);
    
    this.loading = true;
    this.claimsService.searchClaims(filters).subscribe({
      next: (response: ClaimsResponse) => {
        console.log('Forced search response:', response);
        
        // Safe access to claims data
        this.claims = response.claims || response.items || [];
        
        // Log the claim numbers
        console.log('Claims from forced search:', this.claims.slice(0, 10).map(c => c.claimNumber));
        
        // Always sort claims by claim number to ensure proper order
        this.sortClaimsByNumber();
        
        this.totalRecords = response.totalRecords || response.total || 0;
        this.loading = false;
        
        if (this.claims.length === 0) {
          console.warn('No claims found in forced search');
        } else {
          console.log(`Found ${this.claims.length} claims in forced search`);
          this.backendConnected = true;
          // Verify sorting
          this.verifySorting();
        }
      },
      error: (error) => {
        console.error('Forced search error:', error);
        this.loading = false;
        this.backendConnected = false;
        alert(`Failed to load claims: ${error.message}`);
      }
    });
  }

  onViewClaim(claim: Claim): void {
    console.log('View claim:', claim);
    // Open the view modal
    this.dialog.open(ClaimDetailsModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: { claim, mode: 'view' }
    });
  }

  onEditClaim(claim: Claim): void {
    console.log('Edit claim:', claim);
    // Open the edit modal
    const dialogRef = this.dialog.open(ClaimsEditComponent, {
      width: '500px',
      height: '600px',
      data: { claim }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated claim
        this.onClaimSave(result);
      }
    });
  }

  // Add the missing onClaimSave method
  onClaimSave(updatedClaim: Claim): void {
    console.log('Save claim:', updatedClaim);
    
    // Get the claim ID
    const claimId = updatedClaim.claimId?.toString() || updatedClaim.id?.toString();
    if (!claimId) {
      console.error('Cannot update claim: Missing claim ID');
      return;
    }
    
    // Call the service to update the claim
    this.claimsService.updateClaim(claimId, updatedClaim).subscribe({
      next: (claim: Claim) => {
        // Update the claim in the data array
        const index = this.claims.findIndex(c => 
          (c.claimId === claim.claimId) || (c.id === claim.id));
        if (index !== -1) {
          this.claims[index] = claim;
          console.log('Claim updated successfully');
          
          // Trigger change detection
          this.claims = [...this.claims];
        }
      },
      error: (error: any) => {
        console.error('Error updating claim:', error);
        alert('Failed to update claim: ' + error.message);
      }
    });
  }

  // Add the missing onClaimSelect method
  onClaimSelect(event: any): void {
    console.log('Claim selected:', event);
    // Handle claim selection if needed
  }

  // Method to manually sort claims by claim number (CLM-XXX format)
  sortClaimsByNumber(): void {
    console.log('Sorting claims by claim number (CLM-XXX format)...');
    console.log('Before sorting:', this.claims.slice(0, 10).map(c => c.claimNumber));
    
    this.claims.sort((a, b) => {
      // Extract numeric parts from CLM-XXX format (handle both CLM-XXX and CLM-XXXX formats)
      const numA = this.extractClaimNumber(a.claimNumber);
      const numB = this.extractClaimNumber(b.claimNumber);
      
      // Handle invalid numbers
      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      
      return numA - numB;
    });
    
    console.log('After sorting:', this.claims.slice(0, 10).map(c => c.claimNumber));
  }
  
  // Helper method to extract numeric part from claim number
  private extractClaimNumber(claimNumber: string): number {
    if (!claimNumber) return 0;
    
    // Handle CLM-XXX format
    if (claimNumber.startsWith('CLM-')) {
      const numericPart = claimNumber.replace('CLM-', '');
      return parseInt(numericPart, 10) || 0;
    }
    
    // Handle other formats (fallback)
    return parseInt(claimNumber.replace(/\D/g, ''), 10) || 0;
  }

  // Add this method to test the extraction logic
  testExtraction(): void {
    console.log('Testing claim number extraction...');
    
    const testCases = [
      'CLM-001', 'CLM-002', 'CLM-010', 'CLM-100', 
      'CLM-007', 'CLM-003', 'CLM-009', 'CLM-004'
    ];
    
    const extracted = testCases.map(claimNumber => ({
      original: claimNumber,
      extracted: this.extractClaimNumber(claimNumber)
    }));
    
    console.log('Extraction results:', extracted);
    
    // Sort by extracted number
    extracted.sort((a, b) => a.extracted - b.extracted);
    
    console.log('Sorted by extracted number:', extracted);
  }
}