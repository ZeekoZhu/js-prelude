import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeChangerService } from './theme-changer.service';

@Component({
    imports: [RouterModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  themeChanger = inject(ThemeChangerService);

  constructor() {
    this.themeChanger.changeTheme();
  }
}
