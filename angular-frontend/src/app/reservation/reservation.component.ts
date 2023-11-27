import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReservationService} from "../services/reservation.service";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  reservationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reservation : ReservationService
  ) {
    this.reservationForm = this.fb.group({
      accid: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      priceAcc: ['', Validators.required]
    });
  }

  submitReservation() {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
      this.reservation.reserve(reservationData,)
      console.log('Reservation submitted:', reservationData);

      this.dialogRef.close();
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
