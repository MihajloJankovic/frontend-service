import { Injectable } from '@angular/core';
import {ConfigService} from "../services/config.service";
import {ApiService} from "../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser :any;
  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }
  getOne(email : string) {
    return this.apiService.get(this.config._profile_url+"/"+email);
  }
  register(userToSave:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    // if (userToSave.gender == "male")
    // {
    //   userToSave.gender = "true";
    // }
    // if (userToSave.gender == "female")
    // {
    //   userToSave.gender = "false";
    // }

    userToSave.birthday = this.datePipe.transform(userToSave.birthday, 'yyyy-MM-dd')

    const body = {
      'username': userToSave.username,
      'firstname': userToSave.firstname,
      'lastname': userToSave.lastname,
      'gender': userToSave.gender,
      'birthday': userToSave.birthday,
      'email': userToSave.email,
      'role' : userToSave.role,
      'password' : userToSave.password
    };

    console.log(userToSave.role)


    return this.apiService.post(this.config._register_url, JSON.stringify(body), loginHeaders)
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
  saveUser(userToSave:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    userToSave.birthday = this.datePipe.transform(userToSave.birthday, 'yyyy-MM-dd')
    const body = {
      'username': userToSave.username,
      'firstname': userToSave.firstname,
      'lastname': userToSave.lastname,
      'gender': userToSave.gender,
      'birthday': userToSave.birthday,
      'email': userToSave.email,
    };

    return this.apiService.post(this.config._profile_edit_url, JSON.stringify(body), loginHeaders)
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

}

