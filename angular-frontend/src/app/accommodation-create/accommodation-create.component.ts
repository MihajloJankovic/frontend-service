// accommodation-create.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  amenitiesList: string[] = ['Wifi', 'Parking', 'Air Conditioning', 'Swimming Pool', 'Gym'];
  selectedAmenities: string[] = [];

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
      location: ['', Validators.required],
    });
  }


  get amenitiesFormArray(): FormArray {
    return this.accommodationForm.get('amenities') as FormArray;
  }

  isSelected(amenity: string): boolean {
    const isSelected = this.selectedAmenities.includes(amenity);
    return isSelected;
  }


  updateAmenitiesList(amenity: string) {
    const index = this.selectedAmenities.indexOf(amenity);

    if (index !== -1) {
      // Ako je pronađeno, uklonite iz liste
      this.selectedAmenities.splice(index, 1);
    } else {
      // Ako nije pronađeno, dodajte u listu
      this.selectedAmenities.push(amenity);
    }
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
      this.accommodationForm.value.amenities = this.selectedAmenities;
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
