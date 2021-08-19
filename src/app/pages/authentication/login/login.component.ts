import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {AuthHttpService, AuthService, MessageService} from '@services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  primeIcons = PrimeIcons;

  constructor(private formBuilder: FormBuilder,
              private authHttpService: AuthHttpService,
              public messageService: MessageService,
              private authService: AuthService,
              private router: Router) {
    this.formLogin = this.newFormLogin();
  }

  ngOnInit(): void {

  }

  newFormLogin(): FormGroup {
    return this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      deviceName: ['MiPC', [Validators.required]],
    });
  }

  get usernameField() {
    return this.formLogin.controls['username'];
  }

  get passwordField() {
    return this.formLogin.controls['password'];
  }

  get deviceNameField() {
    return this.formLogin.controls['deviceName'];
  }

  onSubmit() {
    console.log(this.formLogin);
    if (this.formLogin.valid) {
      this.login();
    } else {
      this.formLogin.markAllAsTouched();
    }
  }

  login() {
    this.authHttpService.login(this.formLogin.value).subscribe(
      response => {
        this.messageService.success(response);
        this.redirect();
      }, error => {
        this.messageService.error(error);
      });
  }

  redirect() {
    this.router.navigate(['/user-administration']);
  }
}
