import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReservationService} from "../services/reservation.service";
import { AuthGuard } from '../services/auth.guard';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationComponent {
  reservationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private reservation : ReservationService,
    private authGuard: AuthGuard,private auth : AuthService,
    private router: Router
  ) {
    if(this.auth.isAuthenticated())
    {

    }
    else {

      this.router.navigate(['/']);
    }
    this.reservationForm = this.fb.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  submitReservation() {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
      reservationData.accid = this.data.id
      this.reservation.reserve(reservationData)
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
