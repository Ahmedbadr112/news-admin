import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TempusDominus } from '@eonasdan/tempus-dominus';
import Tagify from '@yaireo/tagify';
import { CKEditor4 } from 'ckeditor4-angular';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import $ from 'jquery';
import moment from 'moment';
import 'daterangepicker';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrl: './add-new-card.component.scss',
})
export class AddNewCardComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  defaultNew: {
    contentType: string;
    image1Id: string;
    byLine: string;
    Title: string;
    SubTitle: string;
    Story: string;
    PictureCaption1: string;
    Notes: string;
  } = {
    contentType: '1',
    image1Id: '',
    byLine: '',
    Title: '',
    SubTitle: '',
    Story: '',
    PictureCaption1: '',
    Notes: '',
  };
  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    directionality: 'rtl',
    language: 'ar',
  };
  addNewForm: FormGroup;

  isLoading$: Observable<boolean>;

  contentTypes: { typeId: string; contentType1: string }[] = [];
  newsCategories: { categoryID: string; name: string; hide: boolean }[] = [];
  newsSubCategories: { sectionID: string; secTitle: string }[] = [];
  albums: { galleryID: string; galleryTitle: string }[] = [];
  selectedAlbums: typeof this.albums = [];

  editorData = '<p class="text-right">مرحبا بك</p>';

  hasError: boolean = false;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null | undefined = null;

  @ViewChild('albumSelect') albumSelect: ElementRef;

  constructor(
    private addNewService: AddNewService,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.addNewService.isLoading$;
  }

  public onChange(event: CKEditor4.EventInfo) {
    this.editorData = event.editor.getData();
    console.log(this.editorData);
  }

  ngOnInit(): void {
    this.getContentTypes();
    this.getNewsCategories();
    this.onSelectedNewsCategoriesChange(this.newsCategories[0]);
    this.getGalleries();
    this.initForm();
  }

  ngAfterViewInit() {
    const tagifyInput = document.querySelector(
      '#kt_tagify_1'
    ) as HTMLInputElement;
    new Tagify(tagifyInput, {
      duplicates: false,
    });

    $('#kt_daterangepicker_2').daterangepicker({
      timePicker: true,
      singleDatePicker: true,
      parentEl: '.date',

      startDate: moment().startOf('hour'),
      endDate: moment().startOf('hour').add(32, 'hour'),
      locale: {
        format: 'M/DD hh:mm A',
      },
    });
  }

  getGalleries() {
    this.hasError = false;
    const getGalleriesSubscr = this.addNewService.getGalleries().subscribe({
      next: (data: { galleryID: string; galleryTitle: string }[]) => {
        if (data) {
          this.albums = data;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.log('[Galleries]', error);
        this.hasError = true;
      },
    });
    this.unsubscribe.push(getGalleriesSubscr);
  }

  getContentTypes() {
    this.hasError = false;
    const getContentTypesSubscr = this.addNewService
      .getContentTypes()
      .subscribe({
        next: (data: typeof this.contentTypes) => {
          if (data) {
            this.contentTypes = data;
            this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          console.log('[CONTENT_TYPES]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getContentTypesSubscr);
  }

  getNewsCategories(): void {
    this.hasError = false;
    const getNewsCategoriesSubscr = this.dashboardService
      .getNewsCategories()
      .subscribe({
        next: (data: { categoryID: string; name: string; hide: boolean }[]) => {
          this.newsCategories = data;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('NEWS_CATEGORIES', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getNewsCategoriesSubscr);
  }

  onSelectedNewsCategoriesChange(e: any) {
    this.hasError = false;
    if (!e) return;
    const getNewsSubCategoriesSubscr = this.dashboardService
      .getNewsSubCategories(e.target.value)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: { sectionID: string; secTitle: string }[]) => {
          this.newsSubCategories = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('NEWS_SUB_CATEGORIES', err);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getNewsSubCategoriesSubscr);
  }

  get f() {
    return this.addNewForm.controls;
  }

  initForm() {
    this.addNewForm = this.fb.group({
      contentType: [this.defaultNew.contentType],
      image1Id: [this.defaultNew.image1Id],
      byLine: [this.defaultNew.byLine],
      Title: [this.defaultNew.Title],
      SubTitle: [this.defaultNew.SubTitle],
      Story: [this.defaultNew.Story],
      PictureCaption1: [this.defaultNew.PictureCaption1],
      Notes: [this.defaultNew.Notes],
    });
  }

  onSaveNew() {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewFile(this.selectedFile);
      this.cdr.detectChanges();
    }
  }

  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview = e.target?.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeSelectedImg() {
    this.selectedFile = null;
    this.filePreview = null;
    this.cdr.detectChanges();
  }

  onSelectAlbum(id: string) {
    const selectedAlbum = this.albums.find((album) => album.galleryID == id);

    if (
      this.selectedAlbums.find(
        (album) => album.galleryID === selectedAlbum?.galleryID
      )
    )
      return;

    this.selectedAlbums.push(
      selectedAlbum as {
        galleryID: string;
        galleryTitle: string;
      }
    );
  }

  onRemoveAlbum(albumId: string) {
    this.selectedAlbums = this.selectedAlbums.filter(
      (album) => album.galleryID !== albumId
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
