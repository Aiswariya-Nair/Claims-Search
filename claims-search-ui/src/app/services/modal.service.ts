import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Claim } from '../models/claim';
import { ClaimDetailsModalComponent } from '../components/claim-details-modal/claim-details-modal.component';
import { ClaimEditModalComponent } from '../components/claim-edit-modal/claim-edit-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openViewClaimModal(claim: Claim): void {
    this.dialog.open(ClaimDetailsModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: { claim, mode: 'view' }
    });
  }

  openEditClaimModal(claim: Claim): Promise<Claim | undefined> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(ClaimEditModalComponent, {
        width: '80%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        data: { claim }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }
}