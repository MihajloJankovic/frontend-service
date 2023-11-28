import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ViewEncapsulation } from '@angular/core';
import { AccomondationService } from '../services/accomondation.service';

@Component({
  selector: 'app-accommodation-create',
  templateUrl: './accommodation-create.component.html',
  styleUrls: ['./accommodation-create.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccommodationCreateComponent {
  accommodationForm: FormGroup;
  amenitiesList: string[] = ['Wifi', 'Parking', 'Air Conditioning', 'Swimming Pool', 'Gym']

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private accommodationService: AccomondationService
  ) {
    this.accommodationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      amenities: this.fb.array([]),
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Accommodation created successfully') {
        this.router.navigate(['/accommodations']);
      }
    });
  }

  submitAccommodation() {
    if (this.accommodationForm.valid) {
      this.accommodationService.createAccommodation(this.accommodationForm.value).subscribe(
        (res) => {
          if (res.body === 'NOT_ACCEPTABLE' || res.name === 'HttpErrorResponse') {
            this.openDialog('Error');
          } else {
            this.openDialog('Accommodation created successfully');
          }
        },
        (error) => {
          console.error('Error creating accommodation:', error);
          this.openDialog('Error');
        }
      );
    } else {
      alert('Invalid form data. Please check the fields.');
    }
  }

  closeDialog() {
    this.dialog.closeAll()
  }
}
