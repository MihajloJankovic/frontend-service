import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
    private dialog: MatDialog,
    private router: Router,
    private auth: AuthService,
    private service: UserService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      email: [{ value: '', readonly:true}],
      username: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]*$/)]],
      lastname: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]*$/)]],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
    });
  }

  b = 0;
  post: any;
  gender: any;
  email: any;
  token: any;

  ngOnInit() {
    this.b = 1;
    this.token = this.auth.getDecodedAccessToken();
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

      console.log(this.post);

    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Profile updated') {
        this.router.navigate(['/profile']);
      }
    });
  }

  checkForm(userForm: FormGroup): boolean {
    if (this.areFieldsEmpty()) {
      this.openDialog('All fields are required.');
      this.setBorderForField();
      return false;
    }

    // Provera za ime i prezime sa prvim velikim slovom
    const nameRegex = /^[A-Z][a-z]*$/;

// Provera za ime
    if (!nameRegex.test(userForm.value.firstname)) {
      this.setRedBorderForField('firstname')
      this.openDialog('First name must start with a capital letter.');
      return false;
    }
    else{
      this.setGreenBorderForField('firstname')
    }

// Provera za prezime
    if (!nameRegex.test(userForm.value.lastname)) {
      this.setRedBorderForField('lastname')
      this.openDialog('Last name must start with a capital letter.');
      return false;
    }
    else{
      this.setGreenBorderForField('lastname')
    }



    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!usernameRegex.test(userForm.value.username)) {
      this.setRedBorderForField('username');
      this.openDialog('Username must contain at least one lowercase letter, one uppercase letter, one number, and be at least 6 characters long.');
      return false;
    }
    else{
      this.setGreenBorderForField('username')
    }


    this.setInvalidClass('firstname', !nameRegex.test(userForm.value.firstname));
    this.setInvalidClass('lastname', !nameRegex.test(userForm.value.lastname));
    this.setInvalidClass('gender', !userForm.value.gender);
    this.setInvalidClass('username', !usernameRegex.test(userForm.value.username));

    return true;
  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.userForm.controls).forEach((field) => {
      const control = this.userForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }
  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.userForm.get(controlName);

    if (condition !== undefined) {
      if (control && condition && (control.dirty || control.touched)) {
        return true;
      } else {
        return false;
      }
    }

    if (control && control.invalid && (control.dirty || control.touched)) {
      return true;
    }

    return false;
  }


  submitForm() {
    this.setGreenBorderForField('username')
    this.setGreenBorderForField('firstname')
    this.setGreenBorderForField('lastname')
    this.setGreenBorderForField('gender')
    this.setGreenBorderForField('birthday')
    if (this.checkForm(this.userForm) == true) {
      this.service.saveUser(this.userForm.value)
      this.router.navigate(['/profile'])
    }
  }

  setGreenBorderForField(inputId: string) {
    const control = this.userForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.userForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }

  setBorderForField(inputId?: string, color: 'red' | 'green' = 'red') {
    if (inputId) {
      const control = this.userForm.get(inputId);
      if (control && control.value === '') {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
          inputElement.style.border = `2.5px solid ${color}`;
        }
      }
    } else {
      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        if (control && control.value === '') {
          const inputElement = document.getElementById(field);
          if (inputElement) {
            inputElement.style.border = `2.5px solid ${color}`;
          }
        }
      });
    }
  }
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
