import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css']
})
export class UserProfileComponent {

  constructor(private router: Router,  public jwtHelper: JwtHelperService, private authGuard: AuthGuard, private service: UserService,private auth : AuthService) {
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
  async ngOnInit() {
    this.token = this.auth.getDecodedAccessToken();
    this.post = await this.service.getOne(this.token.email).toPromise();

    this.forma = new FormGroup({
      username: new FormControl(this.post.username),
      email: new FormControl(this.post.email),
      bdate: new FormControl(this.post.birthday),
    });

    this.b = 1;
  }


}
