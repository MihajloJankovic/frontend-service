import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthGuard} from "../services/auth.guard";
import {AccomondationService} from "../services/accomondation.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {AccommodationCreateComponent} from "../accommodation-create/accommodation-create.component";

@Component({
  selector: 'app-avability',
  templateUrl: './avability.component.html',
  styleUrls: ['./avability.component.css']
})
export class AvabilityComponent {
  avaForm: FormGroup;
  constructor( private fb: FormBuilder,
               public dialogRef: MatDialogRef<AvabilityComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private authGuard: AuthGuard,
               private service: AccomondationService,
               private router: Router) {

    this.avaForm = this.fb.group({
      name: ['', Validators.required],
      priceMode: ['total', Validators.required],
      totalPrice: [null, Validators.required],
      pricePerPerson: [null, Validators.required],
      numberOfPersons: [null, Validators.required],

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
    if (this.avaForm.valid) {
      this.service.createAccommodation(this.avaForm.value)
      console.log('Accommodation created:', this.avaForm.value);

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
