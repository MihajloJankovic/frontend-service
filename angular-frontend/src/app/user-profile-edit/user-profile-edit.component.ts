import {Component, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: 'user-profile-edit.component.html',
  styleUrls: ['user-profile-edit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileEditComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private service: UserService,
    private route: ActivatedRoute
  ) {
    // ... (ostatak koda)

    this.userForm = this.fb.group({
      email: [''],
      username: [''],
      firstname: [''],
      lastname: [''],
      gender: [''],
      birthday: [''],
    });
  }

  b = 0;
  post: any;
  gender: any;
  email: any;
  token: any;

  async ngOnInit() {
    this.b = 1;
    this.token = this.auth.getDecodedAccessToken()
    var profile = this.service.getOne(this.token.email).subscribe((data) => {
      this.post = data;

      this.userForm.patchValue({
        email: this.post.email,
        username: this.post.username,
        firstname: this.post.firstname,
        lastname: this.post.lastname,
        birthday: this.post.birthday,
        gender: this.post.gender
      });

      console.log(this.post)

    });

  }

  submitForm() {
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
