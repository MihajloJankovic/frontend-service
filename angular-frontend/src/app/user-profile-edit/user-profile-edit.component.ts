import { Component } from '@angular/core';

import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service"; // Dodajemo Router
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'; // Dodajemo Router
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: 'user-profile-edit.component.html',
  styleUrls: ['user-profile-edit.component.css']
})
export class UserProfileEditComponent {
  userForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router,private auth : AuthService,private service : UserService,
    private authGuard: AuthGuard,) {
    if(this.auth.isAuthenticated())
    {

    }
    else {

      this.router.navigate(['/']);
    }
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      firstname: ['', Validators.required, Validators.minLength(3)],
      lastname: ['', Validators.required, Validators.minLength(3)],
      gender: [''],
      birthday: [''],
    });
  }
  b= 0;
  post:any;
  gender:any;
  email:any;
  token:any;
  async ngOnInit() {

    this.token = this.auth.getDecodedAccessToken()
    var profile = this.service.getOne(this.token.email).subscribe((data) => {
      this.post = data;

      if (this.post.gender == "true") {
        this.userForm = new FormGroup({
          email: new FormControl(this.post.email),
          username: new FormControl(this.post.username),
          firstname: new FormControl(this.post.firstname),
          lastname: new FormControl(this.post.lastname),
          birthday: new FormControl(this.post.birthday),
          gender: new FormControl("Male"),
        });
      } else {
        this.userForm = new FormGroup({
          email: new FormControl(this.post.email),
          username: new FormControl(this.post.username),
          firstname: new FormControl(this.post.firstname),
          lastname: new FormControl(this.post.lastname),
          birthday: new FormControl(this.post.birthday),
          gender: new FormControl("Female"),
        });
      }
      this.b = 1;
    });
  }
    submitForm()
    {
      if (this.userForm.valid) {
        const updatedUserData = this.userForm.value;
        this.service.saveUser(updatedUserData)
        console.log('Changes saved:', updatedUserData);

        this.router.navigate(['/profile']);
      } else {

        alert('Form is invalid. Please check the fields.');
        this.router.navigate(['/profile']);
      }
    }
}
