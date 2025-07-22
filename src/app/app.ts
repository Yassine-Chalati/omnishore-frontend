import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainContainer } from "./core/containers/main-container/main-container";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cv');
}
