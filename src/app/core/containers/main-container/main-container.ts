import { Component } from '@angular/core';
import { DarkAndLghtModeButtonComponent } from "../../components/dark-and-lght-mode-button-component/dark-and-lght-mode-button-component";

@Component({
  selector: 'app-main-container',
  imports: [DarkAndLghtModeButtonComponent],
  templateUrl: './main-container.html',
  styleUrl: './main-container.css',
  standalone: true
})
export class MainContainer {

}
