import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogComponent} from "../dialog/dialog.component";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder,public jwtHelper: JwtHelperService, private dialog: MatDialog, private router: Router, private auth: AuthService) {
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
  user:any
  token:any;
  submitForm() {
    let message: string;
    if (this.changePasswordForm.valid) {
      const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;
      this.token = localStorage.getItem('jwt');
      // Check whether the token is expired and return
      // true or false
      let s = this.jwtHelper.decodeToken(this.token)
      this.user= {
        email: s.email,
        currentPassword: currentPassword,
        newPassword: newPassword
      };

      if (newPassword !== confirmPassword) {
        message = 'Passwords do not match';
      } else {
        this.auth.changePassword(this.user)
        message = 'Password changed successfully';
      }
    } else {
      message = 'Form is invalid. Please check the fields.';
    }

    this.openDialog(message);
  }
}
