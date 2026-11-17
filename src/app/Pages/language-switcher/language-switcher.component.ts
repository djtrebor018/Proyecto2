import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppLanguage, LanguageService } from '../../Services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  @Input() appearance: 'navbar' | 'login' = 'navbar';
  idioma: AppLanguage;

  constructor(private readonly languageService: LanguageService) {
    this.idioma = this.languageService.currentLanguage;
  }

  cambiarIdioma(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLSelectElement) {
      this.idioma = this.languageService.changeLanguage(target.value);
    }
  }
}
