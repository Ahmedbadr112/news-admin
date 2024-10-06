import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishComponent } from './publish/publish.component';
import { NewsStatusComponent } from './news-status/news-status.component';
import { EditorNewsStateComponent } from './editor-news-state/editor-news-state.component';
import { AddNewComponent } from './add-new/add-new.component';
import { AddNewWithIdComponent } from './add-new-with-id/add-new-with-id.component';
import { OrderNewsComponent } from './order-news/order-news.component';
import { VotesComponent } from './votes/votes.component';
import { SectionsComponent } from './sections/sections.component';
import { UrgentNewsComponent } from './urgent-news/urgent-news.component';
import { MainNewsComponent } from './main-news/main-news.component';
import { DeletedNewsComponent } from './deleted-news/deleted-news.component';
import { EditorsComponent } from './editors/editors.component';
import { VersionsComponent } from './versions/versions.component';
import { CategoryComponent } from './category/category.component';
import { OperationsComponent } from './operations/operations.component';
import { GeneralHeadersComponent } from './ads/general-headers/general-headers.component';
import { HomePageHeadersComponent } from './ads/home-page-headers/home-page-headers.component';
import { InnerPagesHeadersComponent } from './ads/inner-pages-headers/inner-pages-headers.component';
import { AdsTextFileCodeComponent } from './ads/ads-text-file-code/ads-text-file-code.component';
import { PhotosComponent } from './photos/photos.component';
import { OrderEditorsComponent } from './order-editors/order-editors.component';
import { OrderCategoriesComponent } from './order-category/order-category.component';
import { OrderSectionsComponent } from './order-sections/order-sections.component';
import { GalleriesComponent } from './galleries/galleries.component';
import { NewsFilesComponent } from './news-files/news-files.component';
import { NewsUrgentFilesComponent } from './news-urgent-files/news-urgent-files.component';
import { TagProfilesComponent } from './tag-profiles/tag-profiles.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'main-news',
        pathMatch: 'full',
      },
      {
        path: 'publish',
        component: PublishComponent,
      },
      {
        path: 'main-news',
        component: MainNewsComponent,
      },
      {
        path: 'news-status',
        component: NewsStatusComponent,
      },
      {
        path: 'editor-news-state',
        component: EditorNewsStateComponent,
      },
      {
        path: 'add-new',
        component: AddNewComponent,
      },
      {
        path: 'add-new-with-id',
        component: AddNewWithIdComponent,
      },
      {
        path: 'order-news',
        component: OrderNewsComponent,
      },
      {
        path: 'all-votes',
        component: VotesComponent,
      },
      {
        path: 'sections',
        component: SectionsComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'urgent-news',
        component: UrgentNewsComponent,
      },
      {
        path: 'deleted-news',
        component: DeletedNewsComponent,
      },
      {
        path: 'editors',
        component: EditorsComponent,
      },
      {
        path: 'versions/:id',
        component: VersionsComponent,
      },
      {
        path: 'operations/:id',
        component: OperationsComponent,
      },
      {
        path: 'ads/general-headers',
        component: GeneralHeadersComponent,
      },
      {
        path: 'ads/home-page-headers',
        component: HomePageHeadersComponent,
      },
      {
        path: 'ads/inner-page-headers',
        component: InnerPagesHeadersComponent,
      },
      {
        path: 'ads/ads-text-file-code',
        component: AdsTextFileCodeComponent,
      },
      {
        path: 'photos',
        component: PhotosComponent,
      },
      {
        path: 'order-editors',
        component: OrderEditorsComponent,
      },
      {
        path: 'order-sections',
        component: OrderSectionsComponent,
      },
      {
        path: 'order-categories',
        component: OrderCategoriesComponent,
      },
      {
        path: 'galleries',
        component: GalleriesComponent,
      },
      {
        path: 'news-files',
        component: NewsFilesComponent,
      },
      {
        path: 'news-urgent-files',
        component: NewsUrgentFilesComponent,
      },
      {
        path: 'tag-profiles',
        component: TagProfilesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
