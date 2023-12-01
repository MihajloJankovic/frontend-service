import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {ApiService} from "./api.service";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccomondationService {

  constructor( public jwtHelper: JwtHelperService,
               private apiService: ApiService,
               private userService: UserService,
               private http: HttpClient,
               private config: ConfigService,
               private router: Router,
               private route: ActivatedRoute,) { }
  token:any;
  getOne(id : string) {
    return this.apiService.get(this.config._accommodation_url+"/"+id)
  }
  getAllAccommodations(): Observable<any> {
    return this.apiService.get(this.config._accommodations_url);
  }
  createAccommodation(accommodationToCreate: any): Subscription {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    this.token = localStorage.getItem('jwt');
    let s = this.jwtHelper.decodeToken(this.token)

    const body = {
      'name': accommodationToCreate.name,
      'location': accommodationToCreate.location,
      'adress': accommodationToCreate.location,
      'email': s.email,
      'amenities': accommodationToCreate.amenities,
    };




    return this.apiService.post(this.config._addAccommodation_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
        {
          alert("Error")
        }else {
          alert("Save success");
          console.log(res)
          let returnUrl : String;
        }
      });
  }

  getFilteredAccommodations(filters: any): Observable<any> {
    return this.apiService.post(this.config._filtered_accommodations_url, filters);
  }
}
