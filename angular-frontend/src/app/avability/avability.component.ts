import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AuthGuard} from "../services/auth.guard";
import {AccomondationService} from "../services/accomondation.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {AccommodationCreateComponent} from "../accommodation-create/accommodation-create.component";
import {ReservationService} from "../services/reservation.service";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-avability',
  templateUrl: './avability.component.html',
  styleUrls: ['./avability.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AvabilityComponent {
  accommodationName: string = '';
  accommodationDescription: string = '';
  priceMode: string = '';
  totalPrice: number = 0;
  pricePerPerson: number = 0;
  numberOfPersons: number = 0;

  avaForm: FormGroup;
  constructor( private fb: FormBuilder,
               public dialogRef: MatDialogRef<AvabilityComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private authGuard: AuthGuard,
               private service: AccomondationService,
               private reservation: ReservationService,
               private dialog: MatDialog,
               private router: Router) {

      this.avaForm = this.fb.group({

        totalPrice: [0, Validators.required],
        pricePerPerson: [0, Validators.required],
        numberOfPersons: [0, Validators.required],
        priceMode: ['total', Validators.required],
        from: new FormControl(null, Validators.required),
        to: new FormControl(null, Validators.required),
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
    if (true) {
      const credentials = {
        uid : this.data.uid,
        totalPrice: this.avaForm.value.totalPrice,
        pricePerPerson: this.avaForm.value.pricePerPerson,
        numberOfPersons: this.avaForm.value.numberOfPersons,
        from: this.avaForm.value.from,
        to: this.avaForm.value.to,
      };
      this.reservation.set_avability(credentials)
      console.log('Avaibility created:', credentials);

      this.dialogRef.close();
    } else {
      this.openDialog('Form is invalid. Please check the fields.');
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

  closeDialog() {
    this.dialogRef.close();
  }
}
