import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarContainer } from '../../containers/nav-bar-container/nav-bar-container';

@Component({
  selector: 'app-cv-page',
  imports: [NavBarContainer, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {

}
