import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthHttpService} from '../services/auth-http.service';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authHttpService: AuthHttpService,
              public messageService: MessageService) {
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
        localStorage.setItem('token', JSON.stringify(response.msg?.summary));
        this.messageService.success(response);
      }, error => {
        this.messageService.error(error);
      });
  }
}
