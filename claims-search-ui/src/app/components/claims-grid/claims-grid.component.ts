import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Claim } from '../../models/claim';
import { ClaimDetailsModalComponent } from '../claim-details-modal/claim-details-modal.component';
import { ClaimsEditComponent } from '../claims-edit/claims-edit.component';

@Component({
  selector: 'app-claims-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './claims-grid.html',
  styleUrls: ['./claims-grid.scss']
})
export class ClaimsGridComponent {
  @Input() claims: Claim[] = [];
  @Input() totalRecords = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 20;
  @Input() loading = false;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() claimSelected = new EventEmitter<{event: Event, claim: Claim}>();
  @Output() viewClaim = new EventEmitter<Claim>();
  @Output() editClaim = new EventEmitter<Claim>();
  @Output() claimView = new EventEmitter<Claim>(); // Added for compatibility
  @Output() claimEdit = new EventEmitter<Claim>(); // Added for compatibility
  @Output() claimsSelected = new EventEmitter<string[]>(); // Added for compatibility

  selectedClaims: Set<string> = new Set();
  allSelected = false;

  constructor(private dialog: MatDialog) {}

  trackByClaim(index: number, claim: Claim): string {
    // Use a more unique identifier for tracking
    const claimId = claim.claimId || claim.id;
    if (claimId !== undefined && claimId !== null) {
      return claimId.toString();
    }
    // Fallback to claim number and index
    return `${claim.claimNumber || ''}-${index}`;
  }

  isClaimSelected(claim: Claim): boolean {
    const claimId = claim.claimId || claim.id;
    if (claimId !== undefined && claimId !== null) {
      return this.selectedClaims.has(claimId.toString());
    }
    return this.selectedClaims.has('');
  }

  onClaimSelect(event: Event, claim: Claim): void {
    const checkbox = event.target as HTMLInputElement;
    const claimId = claim.claimId || claim.id;
    let claimIdStr = '';
    if (claimId !== undefined && claimId !== null) {
      claimIdStr = claimId.toString();
    }
    
    if (checkbox.checked) {
      this.selectedClaims.add(claimIdStr);
    } else {
      this.selectedClaims.delete(claimIdStr);
    }
    
    // Check if all claims are selected
    this.allSelected = this.claims.every(c => {
      const id = c.claimId || c.id;
      return id !== undefined && id !== null ? this.selectedClaims.has(id.toString()) : this.selectedClaims.has('');
    });
    
    this.claimSelected.emit({event, claim});
    
    // Emit the claimsSelected event with all selected claim IDs
    this.claimsSelected.emit(Array.from(this.selectedClaims));
  }

  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleSelectAll(checkbox.checked);
  }

  onSelectAllClick(): void {
    this.allSelected = !this.allSelected;
    this.toggleSelectAll(this.allSelected);
  }

  private toggleSelectAll(select: boolean): void {
    if (select) {
      // Select all claims on the current page
      this.claims.forEach(claim => {
        const claimId = claim.claimId || claim.id;
        if (claimId !== undefined && claimId !== null) {
          this.selectedClaims.add(claimId.toString());
        } else {
          this.selectedClaims.add('');
        }
      });
    } else {
      // Deselect all claims on the current page
      this.claims.forEach(claim => {
        const claimId = claim.claimId || claim.id;
        if (claimId !== undefined && claimId !== null) {
          this.selectedClaims.delete(claimId.toString());
        } else {
          this.selectedClaims.delete('');
        }
      });
    }
    
    // Emit the claimsSelected event with all selected claim IDs
    this.claimsSelected.emit(Array.from(this.selectedClaims));
  }

  onViewClaim(claim: Claim): void {
    const dialogRef = this.dialog.open(ClaimDetailsModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: { claim, mode: 'view' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle any result if needed
        console.log('View dialog closed with result:', result);
      }
    });
    
    this.viewClaim.emit(claim);
    this.claimView.emit(claim); // For compatibility
  }

  onEditClaim(claim: Claim): void {
    const dialogRef = this.dialog.open(ClaimsEditComponent, {
      width: '500px',
      height: '600px',
      data: { claim }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated claim
        console.log('Edit dialog closed with result:', result);
        this.editClaim.emit(result);
        this.claimEdit.emit(result); // For compatibility
        
        // Force change detection
        this.claims = [...this.claims];
      }
    });
  }

  formatSSN(ssn: string): string {
    if (!ssn) return '-';
    // Format as XXX-XX-XXXX
    return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.pageChange.emit(page);
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getStartRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    
    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, current, and last pages with ellipses
      pages.push(1);
      
      if (this.currentPage > 3) {
        pages.push(-1); // Ellipsis indicator
      }
      
      // Show pages around current page
      for (let i = Math.max(2, this.currentPage - 1); 
           i <= Math.min(totalPages - 1, this.currentPage + 1); 
           i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (this.currentPage < totalPages - 2) {
        pages.push(-1); // Ellipsis indicator
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  /**
   * Get the display status for a claim, mapping claimStatusCode to status names
   * when the status field is "Unknown" or not set
   */
  getDisplayStatus(claim: Claim): string {
    // If status is already set and not "Unknown", return it directly
    if (claim.status && claim.status !== 'Unknown') {
      return claim.status;
    }
    
    // If status is "Unknown" or not set, try to derive it from claimStatusCode
    if (claim.claimStatusCode !== undefined) {
      switch (claim.claimStatusCode) {
        case 1:
          return 'Open';
        case 2:
          return 'Closed';
        case 3:
          return 'Pending';
        case 4:
          return 'Reopened';
        case 5:
          return 'Denied';
        default:
          return 'Unknown';
      }
    }
    
    // If neither status nor claimStatusCode is available, return 'Unknown'
    return 'Unknown';
  }

  // Method to manually trigger change detection
  refreshClaims(): void {
    console.log('Refreshing claims grid');
    this.claims = [...this.claims];
  }

}