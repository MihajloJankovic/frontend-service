import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";




@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  loginForm: FormGroup;
  private dialogIsOpen = false;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Login successful') {
        this.router.navigate(['/profile']);
      }
    });
  }

  submitForm() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    let message: string;

    if (!username || !password) {
      message = 'Both username and password are required.';
    } else if (username === 'Perica' && password === 'pera321') {
      message = 'Login successful';
    } else {
      message = 'Invalid credentials. Please check your username and password.';
    }

    this.openDialog(message);
  }
}


