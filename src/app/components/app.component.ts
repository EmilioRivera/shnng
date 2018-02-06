import { Component } from '@angular/core';
import { DEFAULT_LINKS } from '../definitions/invariants';
import { ILink } from '../definitions/ILink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title: string = 'Material Demo';
  public readonly appLinks: ILink[] = DEFAULT_LINKS;
}
