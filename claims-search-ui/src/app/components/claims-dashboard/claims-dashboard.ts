import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { ClaimsService } from '../../services/claims';
import { ConnectionTestService } from '../../services/connection-test';
import { ClaimsGridComponent } from '../claims-grid/claims-grid.component';
import { ClaimDetailsModalComponent } from '../claim-details-modal/claim-details-modal.component';
import { ClaimsEditComponent } from '../claims-edit/claims-edit.component';
import { 
  Claim, 
  ClaimsResponse,
  StatusOption,
  StateOption,
  ProgramOption,
  InsuranceTypeOption,
  ExaminerOption,
  OrganizationOption
} from '../../models/claim';
import { FilterParams } from '../../models/filter-params';

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-claims-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    ClaimsGridComponent
  ],
  templateUrl: './claims-dashboard.html',
  styleUrls: ['./claims-dashboard.scss']
})
export class ClaimsDashboardComponent implements OnInit {
  searchForm!: FormGroup;
  
  // Signals for reactive UI
  searchData = signal<Claim[]>([]);
  showResults = signal<boolean>(false);
  loading = signal<boolean>(false);
  connectionStatus = signal<boolean>(true);
  
  // Filter and pagination
  totalRecords = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(20);
  totalPages = signal<number>(0);
  
  // UI state
  showFilterDialog = signal<boolean>(false);
  selectedRows = signal<string[]>([]);
  sortConfig = signal<SortConfig | null>(null);
  editingClaim = signal<Claim | null>(null);
  viewingClaim = signal<Claim | null>(null);
  
  // Dropdown data
  statusOptions = signal<StatusOption[]>([]);
  stateOptions = signal<StateOption[]>([]);
  programOptions = signal<ProgramOption[]>([]);
  insuranceTypeOptions = signal<InsuranceTypeOption[]>([]);
  examinerOptions = signal<ExaminerOption[]>([]);
  organizationOptions = signal<OrganizationOption[]>([]);
  brokerOptions = signal<string[]>([]);

  // Table columns definition - UPDATED ARRAY
  displayedColumns: string[] = [
    'select', 
    'claimNumber', 
    'claimantName', 
    'incidentDate', 
    'status', 
    'examiner', 
    'stateCode', 
    'ssn', 
    'policyNumber',
    // ADD THESE MISSING FIELDS:
    'claimType',    // For "Type" column
    'closed',       // For "Closed" column  
    'employee',     // For "Employees" column
    'bodyPart'      // For "Body Part" column
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private claimsService: ClaimsService,
    private connectionTestService: ConnectionTestService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.testConnection();
    // Trigger initial search to load data
    this.handleSearch();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      // Quick search
      quickSearch: [''],
      
      // Basic search fields
      claimantFirstName: [''],
      claimantLastName: [''],
      claimNumber: [''],
      policyNumber: [''],
      ssn: [''],
      
      // Date filters
      fromIncidentDate: [''],
      toIncidentDate: [''],
      
      // Multi-select filters
      status: [[]],
      lossState: [[]],
      program: [[]],
      insuranceType: [[]],
      examiner: [[]],
      
      // Additional filters
      employeeNumber: [''],
      affiliateClaimNumber: [''],
      organization1: [''],
      organization2: [''],
      organization3: [''],
      organization4: [''],
      jurisdictionClaimNumber: [''],
      brokerName: [''],
      emailId: [''],
      phoneNumber: [''],
      dob: [''],
      adjustingOffice: [''],
      employer: [''],
      claimantType: [''],
      
      // Pagination
      pageSize: [20]
    });
  }

  private async loadDropdownData(): Promise<void> {
    try {
      // Load all dropdown data in parallel
      const [statuses, states, programs, insuranceTypes, examiners, organizations] = await Promise.all([
        this.claimsService.getClaimStatuses().toPromise(),
        this.claimsService.getLossStates().toPromise(),
        this.claimsService.getPrograms().toPromise(),
        this.claimsService.getInsuranceTypes().toPromise(),
        this.claimsService.getExaminers().toPromise(),
        this.claimsService.getOrganizations().toPromise()
      ]);

      // Set the actual data from backend
      if (statuses && statuses.length > 0) {
        this.statusOptions.set(statuses);
      } else {
        // Fallback to mock data if backend returns empty
        this.statusOptions.set([
          { value: 1, label: 'Open', statusCode: 1, statusDesc: 'Open' },
          { value: 2, label: 'Closed', statusCode: 2, statusDesc: 'Closed' },
          { value: 3, label: 'Pending', statusCode: 3, statusDesc: 'Pending' },
          { value: 4, label: 'Reopened', statusCode: 4, statusDesc: 'Reopened' }
        ]);
      }

      if (states && states.length > 0) {
        this.stateOptions.set(states);
      } else {
        // Fallback to mock data if backend returns empty
        this.stateOptions.set([
          { value: 'CA', label: 'California', stateCode: 'CA', stateDesc: 'California' },
          { value: 'NY', label: 'New York', stateCode: 'NY', stateDesc: 'New York' },
          { value: 'TX', label: 'Texas', stateCode: 'TX', stateDesc: 'Texas' },
          { value: 'FL', label: 'Florida', stateCode: 'FL', stateDesc: 'Florida' },
          { value: 'IL', label: 'Illinois', stateCode: 'IL', stateDesc: 'Illinois' }
        ]);
      }

      if (programs && programs.length > 0) {
        this.programOptions.set(programs);
      } else {
        // Fallback to mock data if backend returns empty
        this.programOptions.set([
          { value: 'AUTO', label: 'Auto Insurance', programCode: 'AUTO', programDesc: 'Auto Insurance' },
          { value: 'HOME', label: 'Home Insurance', programCode: 'HOME', programDesc: 'Home Insurance' },
          { value: 'LIFE', label: 'Life Insurance', programCode: 'LIFE', programDesc: 'Life Insurance' },
          { value: 'HEALTH', label: 'Health Insurance', programCode: 'HEALTH', programDesc: 'Health Insurance' }
        ]);
      }

      if (insuranceTypes && insuranceTypes.length > 0) {
        this.insuranceTypeOptions.set(insuranceTypes);
      } else {
        // Fallback to mock data if backend returns empty
        this.insuranceTypeOptions.set([
          { value: 1, label: 'Liability', insuranceType: 1, insuranceTypeDesc: 'Liability' },
          { value: 2, label: 'Comprehensive', insuranceType: 2, insuranceTypeDesc: 'Comprehensive' },
          { value: 3, label: 'Collision', insuranceType: 3, insuranceTypeDesc: 'Collision' },
          { value: 4, label: 'Auto', insuranceType: 4, insuranceTypeDesc: 'Auto' }
        ]);
      }

      if (examiners && examiners.length > 0) {
        this.examinerOptions.set(examiners);
      } else {
        // Fallback to mock data if backend returns empty
        this.examinerOptions.set([
          { value: 'EX001', label: 'John Smith', examinerCode: 'EX001', examinerName: 'John Smith' },
          { value: 'EX002', label: 'Jane Doe', examinerCode: 'EX002', examinerName: 'Jane Doe' },
          { value: 'EX003', label: 'Bob Johnson', examinerCode: 'EX003', examinerName: 'Bob Johnson' }
        ]);
      }

      if (organizations && organizations.length > 0) {
        this.organizationOptions.set(organizations);
      } else {
        // Fallback to mock data if backend returns empty
        this.organizationOptions.set([
          { value: 'ORG001', label: 'Organization 1', orgCode: 'ORG001', orgDesc: 'Organization 1' },
          { value: 'ORG002', label: 'Organization 2', orgCode: 'ORG002', orgDesc: 'Organization 2' },
          { value: 'ORG003', label: 'Organization 3', orgCode: 'ORG003', orgDesc: 'Organization 3' }
        ]);
      }
      
      // Mock broker options for now
      this.brokerOptions.set(['Broker A', 'Broker B', 'Broker C']);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      this.showError('Failed to load dropdown data');
      
      // Fallback to mock data on error
      this.statusOptions.set([
        { value: 1, label: 'Open', statusCode: 1, statusDesc: 'Open' },
        { value: 2, label: 'Closed', statusCode: 2, statusDesc: 'Closed' },
        { value: 3, label: 'Pending', statusCode: 3, statusDesc: 'Pending' },
        { value: 4, label: 'Reopened', statusCode: 4, statusDesc: 'Reopened' }
      ]);
      this.stateOptions.set([
        { value: 'CA', label: 'California', stateCode: 'CA', stateDesc: 'California' },
        { value: 'NY', label: 'New York', stateCode: 'NY', stateDesc: 'New York' },
        { value: 'TX', label: 'Texas', stateCode: 'TX', stateDesc: 'Texas' },
        { value: 'FL', label: 'Florida', stateCode: 'FL', stateDesc: 'Florida' },
        { value: 'IL', label: 'Illinois', stateCode: 'IL', stateDesc: 'Illinois' }
      ]);
      this.programOptions.set([
        { value: 'AUTO', label: 'Auto Insurance', programCode: 'AUTO', programDesc: 'Auto Insurance' },
        { value: 'HOME', label: 'Home Insurance', programCode: 'HOME', programDesc: 'Home Insurance' },
        { value: 'LIFE', label: 'Life Insurance', programCode: 'LIFE', programDesc: 'Life Insurance' },
        { value: 'HEALTH', label: 'Health Insurance', programCode: 'HEALTH', programDesc: 'Health Insurance' }
      ]);
      this.insuranceTypeOptions.set([
        { value: 1, label: 'Liability', insuranceType: 1, insuranceTypeDesc: 'Liability' },
        { value: 2, label: 'Comprehensive', insuranceType: 2, insuranceTypeDesc: 'Comprehensive' },
        { value: 3, label: 'Collision', insuranceType: 3, insuranceTypeDesc: 'Collision' },
        { value: 4, label: 'Auto', insuranceType: 4, insuranceTypeDesc: 'Auto' }
      ]);
      this.examinerOptions.set([
        { value: 'EX001', label: 'John Smith', examinerCode: 'EX001', examinerName: 'John Smith' },
        { value: 'EX002', label: 'Jane Doe', examinerCode: 'EX002', examinerName: 'Jane Doe' },
        { value: 'EX003', label: 'Bob Johnson', examinerCode: 'EX003', examinerName: 'Bob Johnson' }
      ]);
      this.organizationOptions.set([
        { value: 'ORG001', label: 'Organization 1', orgCode: 'ORG001', orgDesc: 'Organization 1' },
        { value: 'ORG002', label: 'Organization 2', orgCode: 'ORG002', orgDesc: 'Organization 2' },
        { value: 'ORG003', label: 'Organization 3', orgCode: 'ORG003', orgDesc: 'Organization 3' }
      ]);
    }
  }

  private testConnection(): void {
    this.connectionTestService.testConnection().subscribe({
      next: (isConnected) => {
        this.connectionStatus.set(isConnected);
        if (!isConnected) {
          this.showError('Connection to backend failed');
        }
      },
      error: () => {
        this.connectionStatus.set(false);
        this.showError('Connection to backend failed');
      }
    });
  }

  // Search functionality with 🔍 symbol as per requirements
  handleSearch(): void {
    this.loading.set(true);
    const formValue = this.searchForm.value;
    
    // Build filter parameters
    const filters: FilterParams = {
      q: formValue.quickSearch,
      claimNumber: formValue.claimNumber,
      policyNumber: formValue.policyNumber,
      claimantName: this.buildClaimantName(formValue.claimantFirstName, formValue.claimantLastName),
      ssn: formValue.ssn,
      dolStart: formValue.fromIncidentDate,
      dolEnd: formValue.toIncidentDate,
      status: formValue.status,
      lossStates: formValue.lossState,
      programs: formValue.program,
      insuranceTypes: formValue.insuranceType,
      adjusterIds: formValue.examiner,
      orgIds: this.buildOrganizationIds(formValue),
      affiliateClaimNumber: formValue.affiliateClaimNumber,
      jurisdictionClaimNumber: formValue.jurisdictionClaimNumber,
      employeeNumber: formValue.employeeNumber,
      page: this.currentPage(),
      pageSize: formValue.pageSize || 20,
      sort: this.buildSortParam()
    };

    this.claimsService.searchClaims(filters).subscribe({
      next: (response: ClaimsResponse) => {
        this.searchData.set(response.items || response.claims || []);
        this.totalRecords.set(response.total || response.totalRecords || 0);
        this.totalPages.set(response.totalPages || 0);
        this.showResults.set(true);
        this.loading.set(false);
        
        if ((response.items || response.claims || []).length === 0) {
          this.showInfo('No records found matching your criteria');
        }
      },
      error: (error: any) => {
        console.error('Search error:', error);
        this.loading.set(false);
        this.showError('Search failed: ' + error.message);
      }
    });
  }

  // Reset functionality with 🗑️ symbol as per requirements
  handleReset(): void {
    this.searchForm.reset();
    this.searchData.set([]);
    this.showResults.set(false);
    this.selectedRows.set([]);
    this.sortConfig.set(null);
    this.currentPage.set(1);
    this.totalRecords.set(0);
    this.totalPages.set(0);
    
    // Reset form to initial state
    this.searchForm.patchValue({
      pageSize: 20,
      status: [],
      lossState: [],
      program: [],
      insuranceType: [],
      examiner: []
    });
  }

  // Export functionality with 📊 symbols as per requirements
  handleExport(format: 'csv' | 'xlsx' | 'json'): void {
    const formValue = this.searchForm.value;
    const filters: FilterParams = this.buildFiltersFromForm(formValue);
    
    this.loading.set(true);
    
    this.claimsService.exportClaims(filters, format).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `claims_export.${format}`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.loading.set(false);
        
        // Show appropriate symbol based on format
        let symbol = '';
        switch (format) {
          case 'csv': symbol = '📊'; break;
          case 'xlsx': symbol = '📈'; break;
          case 'json': symbol = '📋'; break;
        }
        
        this.showSuccess(`${symbol} Export completed successfully`);
      },
      error: (error: any) => {
        console.error('Export error:', error);
        this.loading.set(false);
        this.showError('Export failed: ' + error.message);
      }
    });
  }

  // Connection test with 🔌 symbol as per requirements
  testConnectionManual(): void {
    this.connectionTestService.testConnection().subscribe({
      next: (isConnected) => {
        this.connectionStatus.set(isConnected);
        if (isConnected) {
          this.showSuccess('🔌 Connection successful');
        } else {
          this.showError('🔌 Connection failed');
        }
      },
      error: () => {
        this.connectionStatus.set(false);
        this.showError('🔌 Connection failed');
      }
    });
  }

  // Table functionality
  handleSort(column: string): void {
    const currentSort = this.sortConfig();
    let direction: 'asc' | 'desc' = 'asc';
    
    if (currentSort && currentSort.column === column) {
      direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    }
    
    this.sortConfig.set({ column, direction });
    this.handleSearch(); // Re-search with new sort
  }

  toggleRowSelection(claimId?: number): void {
    if (!claimId) return;
    
    const selected = this.selectedRows();
    const idStr = claimId.toString();
    
    if (selected.includes(idStr)) {
      this.selectedRows.set(selected.filter(id => id !== idStr));
    } else {
      this.selectedRows.set([...selected, idStr]);
    }
  }

  toggleAllRows(): void {
    const currentData = this.searchData();
    const selected = this.selectedRows();
    
    if (selected.length === currentData.length && currentData.length > 0) {
      this.selectedRows.set([]);
    } else {
      this.selectedRows.set(currentData.map(item => (item.claimId || 0).toString()));
    }
  }

  isAllSelected(): boolean {
    const currentData = this.searchData();
    return this.selectedRows().length === currentData.length && currentData.length > 0;
  }

  getStatusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'closed':
        return 'status-closed';
      case 'pending':
        return 'status-pending';
      case 'reopened':
        return 'status-reopened';
      default:
        return '';
    }
  }

  getSortIconClass(column: string, direction: 'asc' | 'desc'): string {
    const currentSort = this.sortConfig();
    if (currentSort && currentSort.column === column && currentSort.direction === direction) {
      return 'sort-active';
    }
    return 'sort-inactive';
  }

  getEntryCount(): string {
    const data = this.searchData();
    const showData = this.showResults();
    const total = this.totalRecords();
    const currentPageNum = this.currentPage();
    const pageSizeNum = this.pageSize();
    
    if (showData && data.length > 0) {
      const start = (currentPageNum - 1) * pageSizeNum + 1;
      const end = Math.min(start + data.length - 1, total);
      return `${start} to ${end} of ${total}`;
    }
    return '0 to 0 of 0';
  }

  // Pagination
  handlePageChange(page: number): void {
    this.currentPage.set(page);
    this.handleSearch();
  }

  handlePageSizeChange(newPageSize: number): void {
    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.searchForm.patchValue({ pageSize: newPageSize });
    this.handleSearch();
  }

  // Filter dialog
  openFilterDialog(): void {
    this.showFilterDialog.set(true);
  }

  closeFilterDialog(): void {
    this.showFilterDialog.set(false);
  }

  // Utility methods
  private buildClaimantName(firstName?: string, lastName?: string): string | undefined {
    if (!firstName && !lastName) return undefined;
    return [lastName, firstName].filter(Boolean).join(', ');
  }

  private buildOrganizationIds(formValue: any): string[] | undefined {
    const orgIds = [
      formValue.organization1,
      formValue.organization2,
      formValue.organization3,
      formValue.organization4
    ].filter(Boolean);
    return orgIds.length > 0 ? orgIds : undefined;
  }

  private buildSortParam(): string | undefined {
    const sortConfig = this.sortConfig();
    if (!sortConfig) return undefined;
    return `${sortConfig.column}:${sortConfig.direction}`;
  }

  private buildFiltersFromForm(formValue: any): FilterParams {
    return {
      q: formValue.quickSearch,
      claimNumber: formValue.claimNumber,
      policyNumber: formValue.policyNumber,
      claimantName: this.buildClaimantName(formValue.claimantFirstName, formValue.claimantLastName),
      ssn: formValue.ssn,
      dolStart: formValue.fromIncidentDate,
      dolEnd: formValue.toIncidentDate,
      status: formValue.status,
      lossStates: formValue.lossState,
      programs: formValue.program,
      insuranceTypes: formValue.insuranceType,
      adjusterIds: formValue.examiner,
      orgIds: this.buildOrganizationIds(formValue),
      affiliateClaimNumber: formValue.affiliateClaimNumber,
      jurisdictionClaimNumber: formValue.jurisdictionClaimNumber,
      employeeNumber: formValue.employeeNumber,
      pageSize: 10000, // Large page size for export
      sort: this.buildSortParam()
    };
  }

  // Notification methods
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Add these methods for ClaimsGrid events
  onClaimView(claim: Claim): void {
    console.log('View claim:', claim);
    // Open the view modal
    this.dialog.open(ClaimDetailsModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: { claim, mode: 'view' }
    });
  }

  onClaimEdit(claim: Claim): void {
    console.log('Edit claim:', claim);
    // Open the edit modal
    const dialogRef = this.dialog.open(ClaimsEditComponent, {
      width: '500px',
      height: '600px',
      data: { claim }
    });

    // Listen to the save event from the component
    const instance = dialogRef.componentInstance;
    instance.save.subscribe((updatedClaim: Claim) => {
      this.onClaimSave(updatedClaim);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated claim if not already handled by save event
        console.log('Edit dialog closed with result:', result);
      }
    });
  }

  onClaimSave(updatedClaim: Claim): void {
    console.log('Save claim:', updatedClaim);
    
    // Get the claim ID
    const claimId = updatedClaim.claimId?.toString() || updatedClaim.id?.toString();
    if (!claimId) {
      this.showError('Cannot update claim: Missing claim ID');
      return;
    }
    
    // Call the service to update the claim
    this.claimsService.updateClaim(claimId, updatedClaim).subscribe({
      next: (claim: Claim) => {
        // Update the claim in the data array
        const currentData = [...this.searchData()];
        const index = currentData.findIndex(c => 
          (c.claimId === claim.claimId) || (c.id === claim.id));
        if (index !== -1) {
          currentData[index] = claim;
          this.searchData.set(currentData);
          this.showSuccess('Claim updated successfully');
        }
        
        // Close the edit form
        this.editingClaim.set(null);
      },
      error: (error: any) => {
        console.error('Error updating claim:', error);
        this.showError('Failed to update claim: ' + error.message);
      }
    });
  }

  onClaimCancel(): void {
    console.log('Cancel editing');
    // Close the edit form
    this.editingClaim.set(null);
  }

  onClaimsSelected(selectedIds: string[]): void {
    console.log('Selected claims:', selectedIds);
    this.selectedRows.set(selectedIds);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.handleSearch();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}