import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthHttpService} from '../../../services/auth-http.service';
import {MessageService} from '../../../services/message.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authHttpService: AuthHttpService,
              public messageService: MessageService,
              private authService: AuthService,
              private router:Router) {
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
        this.authService.token = response.token;
        this.authService.user = response.data.user;
        this.authService.roles = response.data.roles;
        this.authService.permissions = response.data.permissions;
        this.redirect();
      }, error => {
        this.authService.removeLogin();
        this.messageService.error(error);
      });
  }

  redirect(){
    this.router.navigate(['/user-administration']);
  }
}
