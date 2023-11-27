import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./interceptor/TokenInterceptor";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {ConfigService} from "./services/config.service";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {NoopAnimationsModule, BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { ReservationComponent } from './reservation/reservation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {CalendarModule} from "primeng/calendar";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import { AccommodationsComponent } from './accommodations/accommodations.component';
import { AccommodationCreateComponent } from './accommodation-create/accommodation-create.component';
import { ResetRequestComponent } from './reset-request/reset-request.component';
import {UserService} from "./services/user.service";
import {ReservationService} from "./services/reservation.service";
import {AccomondationService} from "./services/accomondation.service";



const routes: Routes = [
  { path: 'profile', component: UserProfileComponent},
  { path: 'editProfile', component: UserProfileEditComponent},
  { path: 'passwordChange', component: PasswordChangeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'accommodation/:id', component: AccommodationComponent},
  { path: 'accommodations', component: AccommodationsComponent},
  { path: 'accommodationsCreate', component: AccommodationCreateComponent},
  { path: 'reset-request', component: ResetRequestComponent},
  // { path: 'reset', component: ResetComponent},
];
@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    PasswordChangeComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UserProfileEditComponent,
    DialogComponent,
    AccommodationComponent,
    ReservationComponent,
    AccommodationsComponent,
    AccommodationCreateComponent,
    ResetRequestComponent,
  ],

  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    CalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [RouterModule],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService, ConfigService,UserService,AccomondationService,ReservationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
