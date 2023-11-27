import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'; // Dodajemo Router
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: 'user-profile-edit.component.html',
  styleUrls: ['user-profile-edit.component.css']
})
export class UserProfileEditComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authGuard: AuthGuard,
    private router: Router) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(6)],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      country: [''],
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
  submitForm() {
    if (this.userForm.valid) {
      const updatedUserData = this.userForm.value;
      console.log('Changes saved:', updatedUserData);

      this.router.navigate(['/profile']);
    } else {

      console.log('Form is invalid. Please check the fields.');
      this.router.navigate(['/profile']);
    }
  }
}
