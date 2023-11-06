import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  private dialogIsOpen = false;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
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
        this.router.navigate(['/profile']);
      }
    });
  }

  submitForm() {
    if (this.registerForm.valid) {
      const message = 'Registration successful';
      this.openDialog(message);
    } else {
      const message = 'Invalid form data. Please check the fields.';
      this.openDialog(message);
    }
  }
}
