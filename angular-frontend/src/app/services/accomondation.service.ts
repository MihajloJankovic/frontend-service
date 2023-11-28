import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {ApiService} from "./api.service";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";

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

  getOne(id : string) {
    return this.apiService.get(this.config._accommodation_url+"/"+id)
  }
  createAccommodation(accommodation: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return this.apiService.post(this.config._addAccommodation_url, JSON.stringify(accommodation), headers);
  }
}
