import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import { FilterOption, Pagination } from 'src/app/models/components.model';
import { Image } from 'src/app/models/data.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
})
export class PhotosComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  search: string = '';
  pagination: Pagination = {
    current: 1,
  };
  filterOption: FilterOption = {
    isGalleryType: true,
    isGallery: true,

    galleryTypeId: '',
    galleryId: '',
  };

  moveForm: FormGroup;

  $isLoading: Observable<boolean>;

  images: Image[] = [];
  galleryTypes: any[] = [];
  galleries: any[] = [];

  selectedImages: string[] = [];

  constructor(
    private addNewService: AddNewService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
    private fb: FormBuilder
  ) {
    this.$isLoading = addNewService.isLoading$;
  }

  ngOnInit(): void {
    this.initMoveForm();
    this.dashboardService.galleryTypes$.subscribe((types) => {
      this.moveForm.controls.galleryTypeId.setValue(types[0]?.galleryTypeID);
      this.onGalleryTypeChange(types[0]?.galleryTypeID);
      this.galleryTypes = types;
    });

    this.getImages();
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getImages(300, e.target.value);
  }

  initMoveForm() {
    this.moveForm = this.fb.group({
      galleryTypeId: ['', Validators.required],
      galleryId: [{ value: '', disabled: true }, Validators.required],
    });
  }

  get f() {
    return this.moveForm.controls;
  }

  getImages(delay: number = 0, search?: string) {
    const getImagesSubscr = this.addNewService
      .getGalleryImages(
        this.pagination.current,
        this.filterOption.galleryTypeId,
        this.filterOption.galleryId,
        search ? search : this.search
      )
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: {
          data: { images: any[]; count: number; pageNumbers: number };
        }) => {
          if (data.data) {
            this.pagination = {
              current: this.pagination.current,
              count: data.data.count,
              pages: Array.from(
                { length: data.data.pageNumbers },
                (_, i) => i + 1
              ),
            };

            this.images = data.data.images;
            this.cdr.detectChanges();
          } else {
            this.images = [];
          }
        },
        error: (error: any) => {
          console.log('[GET_IMAGES]', error);
        },
      });
    this.unsubscribe.push(getImagesSubscr);
  }

  onGalleryTypeChange(e: any) {
    const getGalleriesSubscr = this.addNewService
      .getGalleryByType(e.target ? e?.target.value : e)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: any[]) => {
          this.galleries = data;
          this.moveForm.controls.galleryId.enable();
          this.moveForm.controls.galleryId.setValue(data[0].galleryID);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('GET_GALLERIES_ON_TYPE_CHANGE', err);
        },
      });
    this.unsubscribe.push(getGalleriesSubscr);
  }

  toggleSelectAll(e: any) {
    this.selectedImages = this.utilsService.toggleSelectAll(e, this.images);
  }

  toggleSelect(e: any) {
    if (e.target.checked) {
      this.selectedImages.push(e.target.value);
    } else {
      this.selectedImages = this.selectedImages.filter(
        (id) => id === e.target.value
      );
    }
  }

  recieveFilterOption(data: any) {
    this.filterOption = data;
    this.getImages();
  }

  recieveChangedPage(data: number) {
    this.pagination.current = data;
    this.getImages();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
