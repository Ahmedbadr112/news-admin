import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig, Pagination } from 'src/app/models/components.model';
import { Image } from 'src/app/models/data.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
})
export class AddImageComponent implements OnDestroy {
  selectedImage: {} = {};
  filterForm: FormGroup;
  pagination: Pagination = { current: 1 };

  private unsubscribe: Subscription[] = [];
  @ViewChild('modal') private modalComponent: ModalComponent;

  galleryTypes: { galleryTypeID: string; galleryTypeTitle: string }[] = [];
  gallery: { galleryID: string; galleryTitle: string }[] = [];
  images: Image[] = [];
  hasError: boolean = false;

  isLoading$: Observable<boolean>;

  modalConfig: ModalConfig = {
    modalTitle: 'اختيار صورة',
    dismissButtonLabel: 'تأكيد',
    closeButtonLabel: 'الغاء',
    hideDismissButton: true,
  };

  @Output() selectedImageEmitter = new EventEmitter<Image>();

  constructor(
    private fb: FormBuilder,
    private addNewService: AddNewService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.addNewService.isLoading$;
  }

  get f() {
    return this.filterForm.controls;
  }

  initForm() {
    this.filterForm = this.fb.group({
      GalleryTypeId: [''],
      GalleryId: [''],
      searchText: [''],
    });
  }

  async openModal() {
    this.initForm();
    this.dashboardService.galleryTypes$.subscribe((types) => {
      this.galleryTypes = types;
    });
    this.getGalleryByType();
    this.getGalleryImages();
    return await this.modalComponent.open();
  }

  getGalleryByType(e?: any) {
    const galleryId = e ? e.target.value : this.galleryTypes[0]?.galleryTypeID;
    this.hasError = false;
    const getGalleryByTypeSubscr = this.addNewService
      .getGalleryByType(galleryId)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: typeof this.gallery) => {
          if (data) {
            this.gallery = data;
            this.cdr.detectChanges();
          } else {
            this.gallery = [];
          }
        },
        error: (error: any) => {
          console.log('[Gallery]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getGalleryByTypeSubscr);
  }

  getGalleryImages() {
    this.hasError = false;
    const getGalleryImagesSubscr = this.addNewService
      .getGalleryImages(
        this.pagination.current,
        this.f.GalleryId.value,
        this.f.GalleryTypeId.value,
        this.f.searchText.value
      )
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: {
          pageNumbers: number;
          count: number;
          images: Image[];
        }) => {
          if (data) {
            this.pagination = {
              count: data.count,
              current: this.pagination.current,
              pages: Array.from({ length: data.pageNumbers }, (_, i) => i + 1),
            };
            this.images = data.images;
            this.cdr.detectChanges();
          } else {
            this.images = [];
          }
        },
        error: (error: any) => {
          console.log('[Gallery_IMAGES]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getGalleryImagesSubscr);
  }

  recieveSelectedImage(data: Image) {
    this.selectedImageEmitter.emit(data);
    this.modalComponent.close();
  }

  recieveChangedPage(data: number) {
    this.pagination.current = data;
    this.getGalleryImages();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
