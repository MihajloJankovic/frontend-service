// reset-password.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string;
  token: string;
  newPassword: string = '';  // Initialize the properties
  repeatPassword: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    // Use paramMap to access route parameters
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submitResetPassword(): void {
    // Implement logic to submit the new password
    // You can use this.newPassword and this.repeatPassword
    console.log('New Password:', this.newPassword);
    console.log('Repeat Password:', this.repeatPassword);

    // After handling the reset logic, you might want to navigate to another page
    // For example, navigate to the login page
    this.router.navigate(['/login']);
  }
}
