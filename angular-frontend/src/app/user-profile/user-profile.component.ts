import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import {JwtHelperService} from "@auth0/angular-jwt";
import {ReservationService} from "../services/reservation.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css']
})
export class UserProfileComponent {

  constructor(private router: Router,  public jwtHelper: JwtHelperService,private reservation : ReservationService, private authGuard: AuthGuard, private service: UserService,private auth : AuthService) {
      if(this.auth.isAuthenticated())
      {

      }
      else {

          this.router.navigate(['/']);
      }
  }

    b= 0;
  post:any;
  uname:any;
    email:any;
    bdate:any;
    token:any;
    forma :any;
  reservations: any[] = [];
  async ngOnInit() {
    this.token = this.auth.getDecodedAccessToken();
    this.post = await this.service.getOne(this.token.email).toPromise();
    this.reservation.getreservations(this.post.email).subscribe((res) => {
      if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
      {
        alert("Error")
      }else {
        console.log(res)
        this.reservations = res.body;
      }
    });
    this.forma = new FormGroup({
      username: new FormControl(this.post.username),
      email: new FormControl(this.post.email),
      bdate: new FormControl(this.post.birthday),
    });

    this.b = 1;
  }
  delete(ida :any):void{
    this.reservation.delete(ida).subscribe((res) => {
      if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
      {
        alert("Error")
      }else {
        console.log(res)
        alert("canceled reservation")
        this.router.navigate(['/']);
      }
    });
  }
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

}
