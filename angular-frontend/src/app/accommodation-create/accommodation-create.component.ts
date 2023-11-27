// accommodation-create.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-accommodation-create',
  templateUrl: './accommodation-create.component.html',
  styleUrls: ['./accommodation-create.component.css']
})
export class AccommodationCreateComponent {
  accommodationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccommodationCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.accommodationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priceMode: ['total', Validators.required],
      totalPrice: [null, Validators.required],
      pricePerPerson: [null, Validators.required],
      numberOfPersons: [null, Validators.required]
    });
  }

  submitAccommodation() {
    if (this.accommodationForm.valid) {

      const accommodationData = this.accommodationForm.value;
      console.log('Accommodation created:', accommodationData);

      this.dialogRef.close();
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
