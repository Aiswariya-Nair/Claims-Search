import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Claim } from '../../models/claim';

@Component({
  selector: 'app-claims-grid',
  standalone: true,
  imports: [CommonModule],
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

  trackByClaim(index: number, claim: Claim): string {
    const claimId = claim.claimId || claim.id;
    if (claimId !== undefined && claimId !== null) {
      return claimId.toString();
    }
    return index.toString();
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
    
    this.claimSelected.emit({event, claim});
    
    // Emit the claimsSelected event with all selected claim IDs
    this.claimsSelected.emit(Array.from(this.selectedClaims));
  }

  onViewClaim(claim: Claim): void {
    this.viewClaim.emit(claim);
    this.claimView.emit(claim); // For compatibility
  }

  onEditClaim(claim: Claim): void {
    this.editClaim.emit(claim);
    this.claimEdit.emit(claim); // For compatibility
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
}