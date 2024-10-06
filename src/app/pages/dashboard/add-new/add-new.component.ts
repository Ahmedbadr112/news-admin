import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import {
  Album,
  Category,
  ContentType,
  ContentTypeSetting,
  Editor,
  SubCategory,
  ValidationRule,
} from 'src/app/models/data.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { EditorsService } from 'src/app/services/dashboard/editors/editors.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
})
export class AddNewComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  addNewForm: FormGroup;

  isLoading$: Observable<boolean>;
  submitted: boolean = false;

  contentTypesSetting: ContentTypeSetting[] = [];
  contentTypes: ContentType[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  albums: Album[] = [];
  editors: Editor[] = [];

  contentTypeID: number = 1;

  selectedAlbums: Album[] = [];
  selectedImage: any = null;
  tags: string[] = [];
  date: string = '';
  addDraft: (
    form: any,
    tags: string[],
    selectedImage: any,
    date: string
  ) => void;
  interval: any;

  constructor(
    private dashboardService: DashboardService,
    private addNewService: AddNewService,
    private editorsService: EditorsService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.addNewService.isLoading$;
  }

  ngOnInit(): void {
    this.initAddNewForm(this.contentTypeID, this.contentTypesSetting);
    this.getContentTypeSetting();
    this.getGalleries();
    this.getAllEditors();

    this.dashboardService.contentTypes$.subscribe((conetntTypes) => {
      this.contentTypes = conetntTypes;
    });

    this.dashboardService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.interval = setInterval(() => {
      if (this.addDraft && this.f.CatId.value && this.f.sectionId.value) {
        this.addDraft(this.f, this.tags, this.selectedImage, this.date);
      }
    }, 30000);

    const id = this.route.snapshot.queryParamMap.get('id');
  }

  //TinyMCE
  // TINY_MCE_API_KEY: string = environment.TINY_MCE_API_KEY;
  // init: EditorComponent['init'] = {
  //   plugins: 'lists link image table code help wordcount',
  //   directionality: 'rtl',
  //   language: 'ar',
  // };

  onNewsTypeChange(e: any) {
    this.contentTypeID = e.target.value;
    this.initAddNewForm(this.contentTypeID, this.contentTypesSetting);
  }

  onCategoryChange(e: any) {
    this.subCategories = [];
    const getNewsSubCategoriesSubscr = this.dashboardService
      .getNewsSubCategories(e.target.value)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: { sectionID: string; secTitle: string }[]) => {
          this.subCategories = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('NEWS_SUB_CATEGORIES', err);
        },
      });
    this.unsubscribe.push(getNewsSubCategoriesSubscr);
  }

  getGalleries() {
    const getGalleriesSubscr = this.addNewService.getGalleries().subscribe({
      next: (data: any) => {
        if (data) {
          this.albums = data;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.log('[GET_GALLERIES]', error);
      },
    });
    this.unsubscribe.push(getGalleriesSubscr);
  }

  applyValidationRules(formGroup: FormGroup, rules: ValidationRule[]) {
    rules.forEach((rule) => {
      if (!rule.value && formGroup.contains(rule.keyName)) {
        formGroup.removeControl(rule.keyName);
      }
    });

    rules.forEach((rule) => {
      if (rule.value) {
        const control = formGroup.get(rule.keyName);

        const existingValidators =
          control && typeof control.validator === 'function'
            ? control.validator({} as AbstractControl)
            : null;

        const newValidators = [];

        if (existingValidators) {
          Object.keys(existingValidators).forEach((key) => {
            if (
              key !== 'minlength' &&
              key !== 'maxlength' &&
              typeof existingValidators[key] === 'function'
            ) {
              newValidators.push(existingValidators[key]);
            }
          });
        }

        if (rule.valueMin !== 0) {
          newValidators.push(Validators.minLength(rule.valueMin));
        }
        if (rule.valueMax !== 0) {
          newValidators.push(Validators.maxLength(rule.valueMax));
        }
        if (rule.keyName === 'ByLine') {
          newValidators.push(Validators.required);
        }

        if (control) {
          control.setValidators(newValidators);
          control.updateValueAndValidity();
        } else {
          formGroup.addControl(
            rule.keyName,
            this.fb.control('', newValidators)
          );
        }
      }
    });
  }

  initAddNewForm(contentTypeID: number, rules: ValidationRule[]) {
    this.addNewForm = this.fb.group({
      NewsType: [contentTypeID, [Validators.required]],
      CatId: ['', [Validators.required]],
      sectionId: ['', [Validators.required]],
      ByLine: ['', [Validators.required]],
      Title: ['', [Validators.required]],
      SubTitle: [''],
      Story: ['', [Validators.required]],
      Brief: ['', [Validators.required]],
      PictureCaption1: ['', [Validators.required]],
      Notes: [''],
      ChkNewsTicker: [false],
      ChkTopNews: [false],
      ChkReadNow: [false],
      ChkIsInstall: [false],
      ChkIsImage: [false],
      ChkIsAkhbarKhassa: [false],
      ChkTopNewCategory: [false],
      ChkTopNewSection: [false],
      ChkImportantNews: [false],
      ChkFilesNews: [false],
      ChkIsVideo: [false],
      ChkIsAkbhbarKhassa: [false],
    });

    const relevantRules = rules.filter(
      (rule) => rule.contentTypeID == contentTypeID
    );

    this.applyValidationRules(this.addNewForm, relevantRules);
  }

  get f() {
    return this.addNewForm.controls;
  }

  onRemoveAlbum(albumId: string) {
    this.selectedAlbums = this.selectedAlbums.filter(
      (album) => album.galleryID !== albumId
    );
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

  addNew(newAction: number) {
    this.submitted = true;

    if (!this.selectedImage) {
      this.utilsService.scrollToFirstInvalidControl('addNew');
      this.toast.error('اختر صورة من فضلك');
      return;
    }

    if (newAction === 4 && !this.date) {
      this.utilsService.scrollToFirstInvalidControl('addNew');
      this.toast.error('اختر تاريخ ووقت من فضلك');
      return;
    }

    if (this.addNewForm.status === 'INVALID') {
      this.utilsService.scrollToFirstInvalidControl('addNew');
      return;
    }

    const addNewSubscr = this.addNewService
      .addNew(
        newAction,
        this.f.sectionId.value,
        this.f.CatId.value,
        this.f.NewsType.value,
        this.f.Title.value,
        this.f.SubTitle.value,
        this.f.Brief.value,
        this.f.Story.value,
        this.tags,
        this.selectedImage?.id,
        0,
        this.f.PictureCaption1.value,
        '',
        this.f.ByLine.value,
        this.f.Notes.value,
        this.selectedAlbums.map((sa) => sa.galleryID),
        this.f.ChkNewsTicker.value,
        this.f.ChkTopNews.value,
        this.f.ChkTopNewCategory.value,
        this.f.ChkReadNow.value,
        this.f.ChkImportantNews.value,
        this.f.ChkFilesNews.value,
        this.f.ChkTopNewSection.value,
        this.f.ChkIsVideo.value,
        this.f.ChkIsInstall.value,
        this.f.ChkIsAkbhbarKhassa.value,
        this.f.ChkIsImage.value,
        this.date
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data);
            this.addNewForm.reset();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[ADD_NEW]', error);
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addNewSubscr);
  }

  receiver(recevier: string, data: any) {
    (this as any)[recevier] = data;
  }

  getContentTypeSetting() {
    const getContentTypeSettingSubscr = this.dashboardService
      .getContentTypeSetting()
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.contentTypesSetting = data;
            this.initAddNewForm(this.contentTypeID, data);
          }
        },
        error: (error: any) => {
          console.log('[CONTENT_TYPE_SETTING]', error);
        },
      });
    this.unsubscribe.push(getContentTypeSettingSubscr);
  }

  getAllEditors() {
    const getAllEditorsSubscr = this.editorsService.getAllEditors().subscribe({
      next: (data: any) => {
        if (data) {
          this.editors = data;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.log('[GET_ALL_EDITORS]', error);
      },
    });
    this.unsubscribe.push(getAllEditorsSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
