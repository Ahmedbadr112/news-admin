import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishComponent } from './publish/publish.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { ComponentsModule } from '../../components/components.module';
import { NewsStatusComponent } from './news-status/news-status.component';
import { EditorNewsStateComponent } from './editor-news-state/editor-news-state.component';
import { AddNewComponent } from './add-new/add-new.component';
import { AddNewWithIdComponent } from './add-new-with-id/add-new-with-id.component';
import { OrderNewsComponent } from './order-news/order-news.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VotesComponent } from './votes/votes.component';
import { SectionsComponent } from './sections/sections.component';
import { UrgentNewsComponent } from './urgent-news/urgent-news.component';
import { MainNewsComponent } from './main-news/main-news.component';
import { DeletedNewsComponent } from './deleted-news/deleted-news.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorsComponent } from './editors/editors.component';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { CategoryComponent } from './category/category.component';
import { VersionsComponent } from './versions/versions.component';
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
import { ModalsModule } from 'src/app/components/dashboard/modals/modals.module';
import { NewsFilesComponent } from './news-files/news-files.component';
import { NewsUrgentFilesComponent } from './news-urgent-files/news-urgent-files.component';
import { TagProfilesComponent } from './tag-profiles/tag-profiles.component';

@NgModule({
  declarations: [
    PublishComponent,
    NewsStatusComponent,
    EditorNewsStateComponent,
    AddNewComponent,
    AddNewWithIdComponent,
    OrderNewsComponent,
    SectionsComponent,
    VotesComponent,
    UrgentNewsComponent,
    MainNewsComponent,
    DeletedNewsComponent,
    EditorsComponent,
    CategoryComponent,
    VersionsComponent,
    OperationsComponent,
    GeneralHeadersComponent,
    HomePageHeadersComponent,
    InnerPagesHeadersComponent,
    AdsTextFileCodeComponent,
    PhotosComponent,
    OrderEditorsComponent,
    OrderCategoriesComponent,
    OrderSectionsComponent,
    GalleriesComponent,
    NewsFilesComponent,
    NewsUrgentFilesComponent,
    TagProfilesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ComponentsModule,
    DragDropModule,
    ReactiveFormsModule,
    EditorComponent,
    ModalsModule,
  ],
})
export class DashboardModule {}
