import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClaimsService } from '../../services/claims';
import { ConnectionTestService } from '../../services/connection-test';
import { Claim, ClaimsResponse } from '../../models/claim';
import { FilterParams } from '../../models/filter-params';
import { ClaimsGridComponent } from '../claims-grid/claims-grid.component';


@Component({
  selector: 'app-claims-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClaimsGridComponent],
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

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private connectionTest: ConnectionTestService
  ) {
    this.searchForm = this.createForm();
  }

  ngOnInit(): void {
    this.testBackendConnection();
    this.searchClaims();
    this.testApi(); // Add this line to test the API response
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
        alert('Cannot connect to backend server. Please ensure the Spring Boot application is running on port 8080.');
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
    
    this.claimsService.searchClaims(filters).subscribe({
      next: (response: ClaimsResponse) => {
        console.log('Claims search response:', response);
        
        // Safe access to claims data from different response formats
        this.claims = response.claims || response.items || [];
        this.totalRecords = response.totalRecords || response.total || 0;
        this.loading = false;
        
        if (this.claims.length === 0) {
          console.warn('No claims found in response');
        } else {
          console.log(`Found ${this.claims.length} claims`);
          this.backendConnected = true;
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

  prepareFilters(): FilterParams {
    const formValue = this.searchForm.value;
    return {
      ...formValue,
      page: this.currentPage - 1, // Convert to 0-based for backend
      pageSize: this.pageSize
    };
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
    this.currentPage = page;
    this.searchClaims();
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
}