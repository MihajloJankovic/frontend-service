import { Injectable } from '@angular/core';
import {ConfigService} from "../services/config.service";
import {ApiService} from "../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser :any;
  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  getOne() {
    return this.apiService.get(this.config._profile_url);
  }

  saveUser(userToSave:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });


    const body = {
      'displayName': userToSave.name,
      'description': userToSave.content
    };

    return this.apiService.post(this.config._profile_edit_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
        {
          alert("Error")
        }else {
          alert("Save success");
          let returnUrl : String;
          returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl + "/HomePage"]);
        }
      });
  }

}

