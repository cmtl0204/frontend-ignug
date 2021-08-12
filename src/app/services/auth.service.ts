import {Injectable} from '@angular/core';
import themes from '../../assets/themes/themes.json';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() {
  }

  changeTheme(theme: string) {
    const themePath = themes.find(element => element.name == theme)?.path;
    console.log(themePath);
    const element = document.getElementById('theme-css');
    if (element && themePath) {
      element.setAttribute('href', themePath);
    }
  }

  get token(): string | null {
    return localStorage.getItem('token') ? JSON.parse(String(localStorage.getItem('token'))) : null;
  }

  set token(value: string | undefined | null) {
    localStorage.setItem('token', JSON.stringify(value));
  }

  removeLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
  }

}
