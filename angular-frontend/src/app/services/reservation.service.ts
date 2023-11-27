import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {ApiService} from "./api.service";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(public jwtHelper: JwtHelperService,
              private apiService: ApiService,
              private userService: UserService,
              private http: HttpClient,
              private config: ConfigService,
              private router: Router,
              private route: ActivatedRoute,) {
  }
  token : any;
  reserve(reservation: any): Subscription {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
     this.token = localStorage.getItem('jwt');
    // Check whether the token is expired and return
    // true or false
    let s = this.jwtHelper.decodeToken(this.token)
    const body = {
      'email': s.email,
      'DateFrom': reservation.dateFrom,
      'DateTo': reservation.dateTo,
      'PricePerson': 0,
      'PriceAcc': reservation.priceAcc,
      'NumberOfPeople': 0,
      'Accid': reservation.accid,
    };
    return this.apiService.post(this.config._reservation_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
        {
          alert("Error")
        }else {
          alert("Save success");
          console.log(res)
          let returnUrl : String;
          returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl + "/"]);
        }
      });




  }
}
