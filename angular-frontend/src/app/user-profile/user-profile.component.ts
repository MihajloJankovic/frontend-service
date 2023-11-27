import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css']
})
export class UserProfileComponent {
  constructor(
    private authGuard: AuthGuard,
    private router: Router) {}
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
    
  navigateToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
