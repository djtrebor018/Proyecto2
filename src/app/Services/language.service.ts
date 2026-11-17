import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly languages: AppLanguage[] = ['es', 'en'];

  constructor(private readonly translate: TranslateService) {
    this.translate.addLangs(this.languages);
    const savedLanguage = localStorage.getItem('language') ?? 'es';
    this.changeLanguage(savedLanguage);
  }

  get currentLanguage(): AppLanguage {
    return this.translate.currentLang as AppLanguage || 'es';
  }

  changeLanguage(language: string): AppLanguage {
    const selectedLanguage = this.languages.find((supportedLanguage) => supportedLanguage === language);
    if (!selectedLanguage) {
      throw new Error(`Unsupported language: ${language}`);
    }

    this.translate.use(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    return selectedLanguage;
  }
}
