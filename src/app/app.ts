import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Timeline } from './features/timeline/timeline/timeline';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Timeline],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('naologic-assessment');
}
