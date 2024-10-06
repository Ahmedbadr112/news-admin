import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { ThemeModeService } from './components/extras/theme-mode-switcher/theme-mode.service';
import { TranslationService } from './modules/i18n';
import { Subscription } from 'rxjs';
import { DashboardService } from './services/dashboard/dashboard.service';
import { ContentType } from './models/data.model';
import { PublishService } from './services/dashboard/publish/publish.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private dashboardService: DashboardService
  ) {
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    this.modeService.init();
    this.getGalleryTypes();
    this.getCategories();
    this.getContentTypes();
    this.getRolesPassList();
  }

  getCategories(): void {
    const getNewsCategoriesSubscr = this.dashboardService
      .getCategories()
      .subscribe({
        next: (data: any[]) => {
          this.dashboardService.categoriesSubject.next(data);
        },
        error: (error: any) => {
          console.log('[NEWS_STATUS_COUNT]', error);
        },
      });
    this.unsubscribe.push(getNewsCategoriesSubscr);
  }

  getContentTypes(): void {
    const getNewsCategoriesSubscr = this.dashboardService
      .getContentTypes()
      .subscribe({
        next: (data: ContentType[]) => {
          this.dashboardService.contentTypesSubject.next(data);
        },
        error: (error: any) => {
          console.log('[NEWS_STATUS_COUNT]', error);
        },
      });
    this.unsubscribe.push(getNewsCategoriesSubscr);
  }

  getRolesPassList(): void {
    const getRolesPassListSubscr = this.dashboardService
      .getRolesPassList()
      .subscribe({
        next: (data: any) => {
          this.dashboardService.rolePassListSubject.next(data);
        },
        error: (error: any) => {
          console.log('ROLES_PASSLIST', error);
        },
      });
    this.unsubscribe.push(getRolesPassListSubscr);
  }

  getGalleryTypes() {
    const getGalleryTypesSubscr = this.dashboardService
      .getGalleryTypes()
      .subscribe({
        next: (data: any) => {
          this.dashboardService.galleryTypesSubject.next(data);
        },
        error: (error: any) => {
          console.log('[GET_GALLERY_TYPES]', error);
        },
      });
    this.unsubscribe.push(getGalleryTypesSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
