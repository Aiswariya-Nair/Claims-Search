import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Claim } from '../../models/claim';

@Component({
  selector: 'app-claim-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './claim-details-modal.component.html',
  styleUrls: ['./claim-details-modal.component.scss']
})
export class ClaimDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ClaimDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { claim: Claim, mode: 'view' | 'edit' }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // For view mode, just close the dialog
    // In a real implementation, you would emit the updated claim data
    this.dialogRef.close(this.data.claim);
  }

  formatSSN(ssn: string): string {
    if (!ssn) return '-';
    // Format as XXX-XX-XXXX
    return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  }
  
  // Helper method to get status class for styling
  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-unknown';
    
    const normalizedStatus = status.toLowerCase().replace(' ', '_');
    switch (normalizedStatus) {
      case 'open':
        return 'status-open';
      case 'closed':
        return 'status-closed';
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-in_progress';
      case 'reopened':
        return 'status-reopened';
      default:
        return 'status-unknown';
    }
  }
}