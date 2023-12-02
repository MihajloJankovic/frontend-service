import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
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

  onRecaptchaResolved(captchaResponse: string | null): void {
    // Update the 'recaptcha' form control value with the resolved captcha response
    this.loginForm.get('recaptcha')?.setValue(captchaResponse);
  }
  submitForm() {

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!username || !password) {
      this.openDialog('Both username and password are required.');
      return;
    }
    if (this.loginForm.invalid) {
      alert("capcha is required !")
      return;
    }
    const credentials = {
      email: username,
      password: password
    };

    this.authService.login(credentials)

  }
}
