import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, ErrorStateMatcher } from '@angular/material/core';
import { Claim } from '../../models/claim';

// Custom error state matcher for better validation UX
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}

@Component({
  selector: 'app-claim-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatError
  ],
  templateUrl: './claim-edit-modal.component.html',
  styleUrls: ['./claim-edit-modal.component.scss']
})
export class ClaimEditModalComponent implements OnInit {
  editForm: FormGroup;
  customErrorStateMatcher = new CustomErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClaimEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { claim: Claim }
  ) {
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.populateForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Core Information
      claimNumber: [{ value: '', disabled: true }],
      status: ['', [Validators.required]],
      claimType: [''],
      
      // Claimant Information
      claimantName: ['', [Validators.required, Validators.minLength(2)]],
      ssn: ['', [this.ssnValidator]],
      employee: [''],
      bodyPart: [''],
      
      // Insurance Information
      policyNumber: [''],
      insured: [''],
      brokerName: [''],
      program: [''],
      
      // Assignment Information
      examiner: [''],
      supervisor: [''],
      adjustingOffice: [''],
      
      // Location Information
      stateCode: [''],
      lossState: [''],
      org1Code: [''],
      org2Code: [''],
      
      // Date Information
      incidentDate: [''],
      addDate: [''],
      
      // Status Flags
      accepted: [''],
      denied: [''],
      closed: [''],
      
      // Jurisdiction Information
      jurisdiction: [''],
      jurisdictionClaimNumber: ['']
    });
  }

  populateForm(): void {
    if (this.data.claim) {
      // Format dates for the date pickers
      const incidentDate = this.data.claim.incidentDate ? new Date(this.data.claim.incidentDate) : null;
      const addDate = this.data.claim.addDate ? new Date(this.data.claim.addDate) : null;
      
      this.editForm.patchValue({
        claimNumber: this.data.claim.claimNumber,
        status: this.data.claim.status,
        claimType: this.data.claim.claimType || this.data.claim.type,
        claimantName: this.data.claim.claimantName || this.data.claim.claimantFirstOrEntityName,
        ssn: this.data.claim.ssn,
        employee: this.data.claim.employee,
        bodyPart: this.data.claim.bodyPart,
        policyNumber: this.data.claim.policyNumber,
        insured: this.data.claim.insured || this.data.claim.insuredName,
        brokerName: this.data.claim.brokerName,
        program: this.data.claim.programDesc || this.data.claim.programCode,
        examiner: this.data.claim.examiner || this.data.claim.examinerCode,
        supervisor: this.data.claim.supervisor,
        adjustingOffice: this.data.claim.adjustingOfficeDesc || this.data.claim.adjustingOfficeCode,
        stateCode: this.data.claim.stateCode,
        lossState: this.data.claim.lossState,
        org1Code: this.data.claim.org1Code,
        org2Code: this.data.claim.org2Code,
        incidentDate: incidentDate,
        addDate: addDate,
        accepted: this.data.claim.accepted,
        denied: this.data.claim.denied,
        closed: this.data.claim.closed,
        jurisdiction: this.data.claim.jurisdictionDesc || this.data.claim.jurisdictionCode,
        jurisdictionClaimNumber: this.data.claim.jurisdictionClaimNumber
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      // Get the raw values including disabled fields
      const formValue = this.editForm.getRawValue();
      
      // Format dates back to strings
      const incidentDate = formValue.incidentDate ? 
        new Date(formValue.incidentDate).toISOString() : null;
      const addDate = formValue.addDate ? 
        new Date(formValue.addDate).toISOString() : null;
      
      const updatedClaim: Claim = {
        ...this.data.claim,
        ...formValue,
        incidentDate: incidentDate,
        addDate: addDate
      };
      
      // Handle specific field mappings
      if (formValue.status) {
        updatedClaim.status = formValue.status;
      }
      
      this.dialogRef.close(updatedClaim);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.editForm);
      
      // Show error message to user
      console.log('Form is invalid. Please check the highlighted fields.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        } else {
          control.markAsTouched();
        }
      }
    });
  }

  // Format SSN for display
  formatSSN(ssn: string): string {
    if (!ssn) return '';
    // Format as XXX-XX-XXXX
    return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  }
  
  // Parse SSN for form input (remove formatting)
  parseSSN(formattedSSN: string): string {
    if (!formattedSSN) return '';
    // Remove all non-digit characters
    return formattedSSN.replace(/\D/g, '');
  }
  
  // Custom SSN validator
  private ssnValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const ssn = control.value.toString().replace(/\D/g, '');
    if (ssn.length === 0) return null;
    
    if (ssn.length !== 9) {
      return { invalidSSN: true };
    }
    
    return null;
  }
}