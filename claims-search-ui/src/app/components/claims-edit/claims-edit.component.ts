import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Claim } from '../../models/claim';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-claims-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './claims-edit.component.html',
  styleUrls: ['./claims-edit.component.scss']
})
export class ClaimsEditComponent {
  @Input() claim: Claim | null = null;
  @Output() save = new EventEmitter<Claim>();
  @Output() cancel = new EventEmitter<void>();

  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClaimsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { claim: Claim }
  ) {
    this.editForm = this.createForm();
    this.claim = data.claim;
  }

  ngOnInit(): void {
    if (this.claim) {
      this.editForm.patchValue({
        claimNumber: this.claim.claimNumber,
        status: this.claim.status,
        claimantName: this.claim.claimantName || this.claim.claimantFirstOrEntityName,
        incidentDate: this.claim.incidentDate ? new Date(this.claim.incidentDate).toISOString().split('T')[0] : '',
        brokerName: this.claim.brokerName,
        insured: this.claim.insured || this.claim.insuredName,
        supervisor: this.claim.supervisor,
        employee: this.claim.employee,
        jurisdictionDesc: this.claim.jurisdictionDesc,
        bodyPart: this.claim.bodyPart
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      claimNumber: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      claimantName: [''],
      incidentDate: [''],
      brokerName: [''],
      insured: [''],
      supervisor: [''],
      employee: [''],
      jurisdictionDesc: [''],
      bodyPart: ['']
    });
  }

  onSave(): void {
    if (this.editForm.valid && this.claim) {
      // Get the raw values including disabled fields
      const formValue = this.editForm.getRawValue();
      
      const updatedClaim: Claim = {
        ...this.claim,
        ...formValue,
        incidentDate: formValue.incidentDate ? new Date(formValue.incidentDate).toISOString() : this.claim.incidentDate
      };
      
      // Handle specific field mappings
      if (formValue.status) {
        updatedClaim.status = formValue.status;
      }
      
      this.save.emit(updatedClaim);
      this.dialogRef.close(updatedClaim);
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.dialogRef.close();
  }
}