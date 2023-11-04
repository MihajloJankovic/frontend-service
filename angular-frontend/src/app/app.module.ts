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
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';


const routes: Routes = [
  { path: 'profile', component: UserProfileComponent},
  { path: 'editProfile', component: UserProfileEditComponent},
  { path: 'passwordChange', component: PasswordChangeComponent},
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
  ],
  exports: [RouterModule],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
