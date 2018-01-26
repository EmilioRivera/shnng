import { Component } from '@angular/core';
import { DEFAULT_LINKS } from './links';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Material Demo';
  public readonly appLinks = DEFAULT_LINKS;
}
