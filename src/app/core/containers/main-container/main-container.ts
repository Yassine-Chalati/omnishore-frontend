import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkAndLghtModeButtonComponent } from "../../components/dark-and-lght-mode-button-component/dark-and-lght-mode-button-component";
import { CvService } from '../../services/cv-service';
import { CvStructured } from '../../models/cv-structured.model';

@Component({
  selector: 'app-main-container',
  imports: [CommonModule, DarkAndLghtModeButtonComponent],
  templateUrl: './main-container.html',
  styleUrl: './main-container.css',
  standalone: true
})
export class MainContainer {
  cvStructured?: CvStructured;
  constructor(private cvService: CvService) {}


}
