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

  checkForm(changePasswordForm: FormGroup): boolean {
    if (this.areFieldsEmpty()) {
      this.openDialog('All fields are required.');
      this.setBorderForField();
      this.setRedBorderForField('currentPassword');
      return false;
    }

    // Provera za lozinku
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

    if (
      changePasswordForm.value.newPassword !== changePasswordForm.value.confirmPassword ||
      !passwordRegex.test(changePasswordForm.value.newPassword)
    ) {
      this.setRedBorderForField('newPassword');
      this.setRedBorderForField('confirmPassword');
      this.openDialog(
        'Passwords must match and contain at least one lowercase letter, one uppercase letter, one number, and one special character. Password must be at least 7 characters long.'
      );
      return false;
    } else {
      this.setGreenBorderForField('newPassword');
      this.setGreenBorderForField('confirmPassword');
    }

    if (changePasswordForm.value.newPassword === changePasswordForm.value.currentPassword) {
      this.setRedBorderForField('newPassword');
      this.setRedBorderForField('currentPassword');
      this.openDialog('New password must be different from the current password.');
      return false;
    } else {
      this.setGreenBorderForField('newPassword');
      this.setGreenBorderForField('currentPassword');
    }

    this.setInvalidClass(
      'currentPassword',
      changePasswordForm.value.currentPassword !== changePasswordForm.value.confirmPassword ||
      !passwordRegex.test(changePasswordForm.value.currentPassword)
    );
    this.setInvalidClass(
      'newPassword',
      changePasswordForm.value.newPassword !== changePasswordForm.value.confirmPassword ||
      !passwordRegex.test(changePasswordForm.value.newPassword)
    );
    this.setInvalidClass(
      'confirmPassword',
      changePasswordForm.value.newPassword !== changePasswordForm.value.confirmPassword ||
      !passwordRegex.test(changePasswordForm.value.confirmPassword)
    );

    return true; // Ako sve provere prođu, forma je validna
  }

  // Ovo je samo privremena implementacija, zamenite sa stvarnom logikom



  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.changePasswordForm.controls).forEach((field) => {
      const control = this.changePasswordForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.changePasswordForm.get(controlName);

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
    const control = this.changePasswordForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.changePasswordForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }

  setBorderForField(inputId?: string, color: 'red' | 'green' = 'red') {
    if (inputId) {
      const control = this.changePasswordForm.get(inputId);
      if (control && control.value === '') {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
          inputElement.style.border = `2.5px solid ${color}`;
        }
      }
    } else {
      Object.keys(this.changePasswordForm.controls).forEach((field) => {
        const control = this.changePasswordForm.get(field);
        if (control && control.value === '') {
          const inputElement = document.getElementById(field);
          if (inputElement) {
            inputElement.style.border = `2.5px solid ${color}`;
          }
        }
      });
    }
  }

  submitForm() {
    let message: string;
    if (this.checkForm(this.changePasswordForm) == true) {
      const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;
      this.token = localStorage.getItem('jwt');
      // Check whether the token is expired and return
      // true or false
      let s = this.jwtHelper.decodeToken(this.token)
      this.user = {
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


      this.openDialog(message);
    }
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
