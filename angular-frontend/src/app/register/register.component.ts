import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from "../dialog/dialog.component";
import { ViewEncapsulation } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ConfigService} from "../services/config.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog,private auth: AuthService,private service : UserService, private config: ConfigService) {



    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['', Validators.required],
      birthday: new FormControl(null, Validators.required),
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Registration successful') {
        this.router.navigate(['/login']);
      }
    });
  }

  checkForm(registerForm: FormGroup): boolean {


    if (this.areFieldsEmpty()) {
      this.openDialog('All fields are required.');
      this.setBorderForField();
      this.setRedBorderForField('birthday')
      return false;
    }
    // Provera za ime i prezime sa prvim velikim slovom
    const nameRegex = /^[A-Z][a-z]*$/;

// Provera za ime
    if (!nameRegex.test(registerForm.value.firstname)) {
      this.setRedBorderForField('firstname')
      this.openDialog('First name must start with a capital letter.');
      return false;
    }
    else{
      this.setGreenBorderForField('firstname')
    }

// Provera za prezime
    if (!nameRegex.test(registerForm.value.lastname)) {
      this.setRedBorderForField('lastname')
      this.openDialog('Last name must start with a capital letter.');
      return false;
    }
    else{
      this.setGreenBorderForField('lastname')
    }

    if (!registerForm.value.gender) {
      this.setRedBorderForField('gender')
      this.openDialog('Gender is a required field.');
      return false;
    }
    else{
      this.setGreenBorderForField('gender')
    }


    if (!registerForm.value.role) {
      this.setRedBorderForField('role')
      this.openDialog('Role is a required field.');
      return false;
    }
    else{
      this.setGreenBorderForField('role')
    }

    // Provera da li je korisnik stariji od 18 godina
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (registerForm.value.birthday > eighteenYearsAgo) {
      this.setRedBorderForField('birthday')
      this.openDialog('You must be at least 18 years old.');
      return false;
    }
    else{
      this.setGreenBorderForField('birthday')
    }

    // Provera za email sa regex-om
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.value.email)) {
      this.setRedBorderForField('email')
      this.openDialog('Invalid email address.');
      return false;
    }
    else{
      this.setGreenBorderForField('email')
    }

    // Provera za username
    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!usernameRegex.test(registerForm.value.username)) {
      this.setRedBorderForField('username');
      this.openDialog('Username must contain at least one lowercase letter, one uppercase letter, one number, and be at least 6 characters long.');
      return false;
    }
    else{
      this.setGreenBorderForField('username')
    }

    // Provera za lozinku
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (registerForm.value.password !== registerForm.value.confirmPassword || !passwordRegex.test(registerForm.value.password)) {
      this.setRedBorderForField('password')
      this.setRedBorderForField('confirmPassword')
      this.openDialog('Passwords must match and contain at least one lowercase letter, one uppercase letter, one number, and one special character. Password must be at least 7 characters long.');
      return false;
    }
    else{
      this.setGreenBorderForField('password')
      this.setGreenBorderForField('confirmPassword')
    }

    this.setInvalidClass('firstname', !nameRegex.test(registerForm.value.firstname));
    this.setInvalidClass('lastname', !nameRegex.test(registerForm.value.lastname));
    this.setInvalidClass('gender', !registerForm.value.gender);
    this.setInvalidClass('role', !registerForm.value.role);
    this.setInvalidClass('birthday', registerForm.value.birthday > eighteenYearsAgo);
    this.setInvalidClass('email', !emailRegex.test(registerForm.value.email));
    this.setInvalidClass('username', !usernameRegex.test(registerForm.value.username));
    this.setInvalidClass('password', registerForm.value.password !== registerForm.value.confirmPassword || !passwordRegex.test(registerForm.value.password));
    this.setInvalidClass('confirmPassword', registerForm.value.password !== registerForm.value.confirmPassword || !passwordRegex.test(registerForm.value.password));



    return true; // Ako sve provere prođu, forma je validna


  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.registerForm.controls).forEach((field) => {
      const control = this.registerForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.registerForm.get(controlName);

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

  setGreenBorderForField(inputId: string) {
    const control = this.registerForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.registerForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }

  setBorderForField(inputId?: string, color: 'red' | 'green' = 'red') {
    if (inputId) {
      const control = this.registerForm.get(inputId);
      if (control && control.value === '') {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
          inputElement.style.border = `2.5px solid ${color}`;
        }
      }
    } else {
      Object.keys(this.registerForm.controls).forEach((field) => {
        const control = this.registerForm.get(field);
        if (control && control.value === '') {
          const inputElement = document.getElementById(field);
          if (inputElement) {
            inputElement.style.border = `2.5px solid ${color}`;
          }
        }
      });
    }
  }


  submitForm() {
    if (this.checkForm(this.registerForm) == true) {
      this.service.register(this.registerForm.value)
      this.router.navigate(['/login'])
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
