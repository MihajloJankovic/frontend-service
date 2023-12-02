// accommodation-create.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthGuard } from '../services/auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {AccomondationService} from "../services/accomondation.service";

@Component({
  selector: 'app-accommodation-create',
  templateUrl: './accommodation-create.component.html',
  styleUrls: ['./accommodation-create.component.css'],
})
export class AccommodationCreateComponent implements OnInit {
  accommodationForm: FormGroup;
  amenitiesList: string[] = ['Wifi', 'Parking', 'Air Conditioning', 'Swimming Pool', 'Gym']

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccommodationCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authGuard: AuthGuard,
    private service: AccomondationService,
    private router: Router
  ) {
    this.accommodationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location:['', Validators.required],
      amenities: this.fb.array([]),

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

  submitAccommodation() {
    if (this.accommodationForm.valid) {
      this.service.createAccommodation(this.accommodationForm.value)
      console.log('Accommodation created:', this.accommodationForm.value);

      this.dialogRef.close();
      this.router.navigate(['/accommodations'])
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
