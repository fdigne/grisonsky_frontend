import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../domains/Login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DashboardService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginValue: Login = new Login();
  displayErrorMessage : boolean;
  errorMessage : String = "Erreur de saisie - Vérifiez votre utilisateur/mot de passe";

  constructor(private dashboardService: DashboardService, fb: FormBuilder, private router: Router) { 
    this.loginForm = fb.group({
      login: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.displayErrorMessage = false;
    localStorage.clear();
  }

  login() {
    this.loginValue.login = this.loginForm.value.login;
    this.loginValue.password = this.loginForm.value.password;
    this.dashboardService.login(this.loginValue).subscribe( renter => {
      if(renter == null) {
        this.displayErrorMessage = true;
      }
      else {
        localStorage.setItem("user", renter.name);
        this.router.navigateByUrl('/dashboard');
      }
    })
  }


}
