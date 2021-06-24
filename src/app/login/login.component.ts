import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginForm = this.fb.group({
    password: ['', Validators.required],
    username: ['',],
    //email: ['',],
  });

  logSubs: Subscription;
  isLogged$: Observable<boolean>;

  showRecPass: boolean = false;
  showUser: boolean = true;
  showEmail: boolean = true;


  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {

    this.isLogged$ = this.auth.returnAsObs().pipe(
      map((val) => {
        if (val) {
          console.log('Logueado!');
          this.router.navigate(['/ventas'])
        }
        return val;
      }));

  }

  ngOnInit() {
    // this.auth.isLoggedIn();
  }

  public login(): void {
  
    this.auth.login(this.LoginForm.value);
  }

  ngOnDestroy(): void {
    // this.logSubs.unsubscribe();
  }

  checkForm() {

  }

}
