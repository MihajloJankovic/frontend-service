// reset-password.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetPasswordComponent {
  email: string;
  token: string;
  newPassword: string = '';
  repeatPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService  // Inject AuthService directly into the constructor
  ) {
    // Use paramMap to access route parameters
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submitResetPassword(): void {
    console.log('New Password:', this.newPassword);
    console.log('Repeat Password:', this.repeatPassword);

    if (this.newPassword === this.repeatPassword) {
      this.authService.resetPassword(this.email, this.token, this.newPassword);
      this.router.navigate(['/login']);
    } else {
      console.error('Passwords do not match');
    }
    
  }
}
