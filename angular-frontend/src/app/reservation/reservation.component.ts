import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReservationService} from "../services/reservation.service";
import { AuthGuard } from '../services/auth.guard';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {DialogComponent} from "../dialog/dialog.component";

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
    public dialog: MatDialog,
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
    const dateFrom = new Date(this.reservationForm.get('dateFrom')?.value);
    const dateTo = new Date(this.reservationForm.get('dateTo')?.value);

    if (dateFrom > dateTo) {
      this.openDialog('The start date cannot be after the end date. Please select valid date ranges.\n');
      return;
    }

    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
      reservationData.accid = this.data.id
      this.reservation.reserve(reservationData)
      this.dialogRef.close();
    } else {
      this.openDialog('Form is invalid. Please check the fields!');
      this.setRedBorderForField('dateFrom');
      this.setRedBorderForField('dateTo');
    }
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Registration successful') {
        this.router.navigate(['/login']);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  setGreenBorderForField(inputId: string) {
    const control = this.reservationForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.reservationForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }
}
