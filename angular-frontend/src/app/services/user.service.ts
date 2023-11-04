import { Injectable } from '@angular/core';
import {ConfigService} from "../services/config.service";
import {ApiService} from "../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";

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


}

