import { Injectable } from '@angular/core';
import { Translation, LocaleService, TranslationService } from 'angular-l10n';

@Injectable()
export class LanguageService {
  
  private language: String = 'en';
  readonly supportedLanguages: String[] = ['en', 'fr', 'de'];
  
  constructor() {
    this.init(navigator.language.split('-')[0]);
  }

  init(lang: string): void {
    if (this.supportedLanguages.indexOf(lang) > -1) {
      this.language = lang;
    }
  }

  getLanguage(): any {
     return this.language;
  }

  getsupportedLanguages(): any[] {
    return this.supportedLanguages;
  }

}
