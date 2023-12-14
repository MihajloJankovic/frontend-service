import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {JwtHelperService} from "@auth0/angular-jwt";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, private auth: AuthService) {

  }
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
