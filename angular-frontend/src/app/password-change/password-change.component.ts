import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogComponent} from "../dialog/dialog.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private router: Router) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Password changed successfully') {
        this.router.navigate(['/profile']);
      }
    });
  }

  submitForm() {
    let message: string;
    if (this.changePasswordForm.valid) {
      const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;



      if (newPassword !== confirmPassword) {
        message = 'Passwords do not match';
      } else {
        // Implement logic for changing the password
        message = 'Password changed successfully';
      }
    } else {
      message = 'Form is invalid. Please check the fields.';
    }

    this.openDialog(message);
  }
}
