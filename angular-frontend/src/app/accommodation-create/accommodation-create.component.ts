// accommodation-create.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthGuard } from '../services/auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AccomondationService } from '../services/accomondation.service';
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-accommodation-create',
  templateUrl: './accommodation-create.component.html',
  styleUrls: ['./accommodation-create.component.css'],
})
export class AccommodationCreateComponent implements OnInit {
  accommodationForm: FormGroup;
  amenitiesList: string[] = [
    'Free Wi-Fi',
    'Swimming Pool',
    'Gym',
    'Restaurant',
    'Parking',
    'Spa and Wellness Center',
    '24/7 Front Desk',
    'Air Conditioning',
    'Business Center',
    'Pet-Friendly',
  ];
  selectedAmenities: string[] = [];
  description: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccommodationCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authGuard: AuthGuard,
    private service: AccomondationService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.accommodationForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      amenities: [[]], // Inicijalno prazan niz za multioption listu
    });
  }

  ngOnInit(): void {
    // Perform role check
    const canActivate = this.authGuard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    if (!canActivate) {
      console.log('Unauthorized access');
      this.router.navigate(['/login']);
    } else {
      console.log('Component initialized');
    }
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Login successful') {
        this.router.navigate(['/profile']);
      }
    });
  }

  checkForm(accommodationForm : FormGroup): boolean {


    if (this.areFieldsEmpty() || this.accommodationForm.get('location')?.value === null || this.accommodationForm.get('description')?.value === '') {
      this.openDialog('All fields are required.');
      this.setRedBorderForField('name')
      this.setRedBorderForField('location')
      return false;
    }
    return true; // Ako sve provere prođu, forma je validna
  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.accommodationForm.controls).forEach((field) => {
      const control = this.accommodationForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.accommodationForm.get(controlName);

    if (condition !== undefined) {
      if (control && condition && (control.dirty || control.touched)) {
        return true;
      } else {
        return false;
      }
    }

    if (control && control.invalid && (control.dirty || control.touched)) {
      return true;
    }

    return false;
  }

  setGreenBorderForField(inputId: string) {
    const control = this.accommodationForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.accommodationForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }

  submitAccommodation() {
    if (this.checkForm(this.accommodationForm)) {
      this.service.createAccommodation(this.accommodationForm.value);
      console.log('Accommodation created:', this.accommodationForm.value);

      this.dialogRef.close();
      this.router.navigate(['/accommodations']);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
