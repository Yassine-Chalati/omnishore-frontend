import { Component } from '@angular/core';
import { LoginContainer } from "../../containers/login-container/login-container";

@Component({
  selector: 'app-login-page',
  imports: [LoginContainer],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

}
