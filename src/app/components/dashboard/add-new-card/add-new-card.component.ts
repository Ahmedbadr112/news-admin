import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Tagify from '@yaireo/tagify';
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
    NewsType: string;
    sectionId: string;
    CatId: string;
    image1Id: string;
    ByLine: string;
    Title: string;
    SubTitle: string;
    Brief: string;
    PictureCaption1: string;
    Notes: string;
    Story: string;
    Tags: string[];
    ChkNewsTicker: boolean;
    ChkTopNews: boolean;
    ChkTopNewCategory: boolean;
  } = {
    NewsType: '1',
    sectionId: '',
    CatId: '',
    image1Id: '',
    ByLine: '',
    Title: '',
    SubTitle: '',
    Brief: '',
    PictureCaption1: '',
    Notes: '',
    Story: '',
    Tags: [],
    ChkNewsTicker: false,
    ChkTopNews: false,
    ChkTopNewCategory: false,
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

  hasError: boolean = false;

  selectedImage: {
    icon: string;
    title: string;
    description: string;
  } | null = null;

  selectedAttachment: File | null = null;

  @ViewChild('albumSelect') albumSelect: ElementRef;

  constructor(
    private addNewService: AddNewService,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.addNewService.isLoading$;
  }

  ngOnInit(): void {
    this.getContentTypes();
    this.dashboardService.newsCategories$.subscribe((categories) => {
      this.newsCategories = categories;
    });
    this.onSelectedNewsCategoriesChange();
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
    const getContentTypesSubscr = this.dashboardService
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

  onSelectedNewsCategoriesChange(e?: any) {
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
      NewsType: [this.defaultNew.NewsType, Validators.required],
      sectionId: [this.defaultNew.sectionId, Validators.required],
      CatId: [this.defaultNew.CatId, Validators.required],
      image1Id: [this.defaultNew.image1Id, Validators.required],
      ByLine: [this.defaultNew.ByLine, Validators.required],
      Title: [this.defaultNew.Title, Validators.required],
      SubTitle: [this.defaultNew.SubTitle],
      Brief: [this.defaultNew.Brief],
      Story: [this.defaultNew.Story, Validators.required],
      PictureCaption1: [this.defaultNew.PictureCaption1, Validators.required],
      Notes: [this.defaultNew.Notes],
      Tags: [this.defaultNew.Tags],
      ChkNewsTicker: [this.defaultNew.ChkNewsTicker],
      ChkTopNews: [this.defaultNew.ChkTopNews],
      ChkTopNewCategory: [this.defaultNew.ChkTopNewCategory],
    });
  }

  onSaveNew() {}

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

  recieveSelectedImage(data: {
    icon: string;
    title: string;
    description: string;
  }) {
    this.selectedImage = data;
  }

  recieveIsSelectedSelectedImageRemoved(data: boolean) {
    this.selectedImage = data ? null : this.selectedImage;
  }
}
