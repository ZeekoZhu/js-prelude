import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeChangerService {
  private document = inject(DOCUMENT);

  changeTheme() {
    // set data-theme on html element
    this.document.documentElement.setAttribute('data-theme', 'light');
  }
}
