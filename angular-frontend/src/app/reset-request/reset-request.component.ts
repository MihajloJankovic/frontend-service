import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';  // If AuthService is shared, you might want to reconsider this import
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request.component.html',
  styleUrls: ['./reset-request.component.css']
})
export class ResetRequestComponent {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close if needed
    });
  }

  submitForm() {
    const email = this.resetForm.get('email')?.value;

    if (!email) {
      this.openDialog('Email is required.');
      return;
    }

    const resetRequestData = {
      email: email
    };

    this.authService.sendResetRequest(resetRequestData);
  }
}
