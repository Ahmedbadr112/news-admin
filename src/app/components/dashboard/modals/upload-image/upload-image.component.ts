import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalConfig } from 'src/app/models/components.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Image } from 'src/app/models/data.model';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss',
})
export class UploadImageComponent implements OnDestroy {
  @Input() type: 'upload' | 'link' | 'edit' | 'upload-with-album' = 'upload';
  @Input() editedImage: Image;
  @Input() galleryId: string;

  uploadImageForm: FormGroup;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';

  private unsubscribe: Subscription[] = [];
  @ViewChild('modal') private modalComponent: ModalComponent;

  galleryTypes: { galleryTypeID: string; galleryTypeTitle: string }[] = [];
  gallery: { galleryID: string; galleryTitle: string }[] = [];

  isLoading$: Observable<boolean>;

  modalConfig: ModalConfig = {
    modalTitle:
      this.type === 'upload'
        ? 'أضافة صورة'
        : this.type === 'edit'
        ? 'تعديل صورة'
        : 'رفع صورة',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'الغاء',
    customDismiss: () => {
      if (this.type === 'edit') {
        this.updateImage();
      } else {
        this.addImage();
      }
    },
  };

  image: File | undefined = undefined;
  imageUrl: string = '';
  filePreview: string | ArrayBuffer | null | undefined = null;

  constructor(
    private fb: FormBuilder,
    private addNewService: AddNewService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.isLoading$ = this.addNewService.isLoading$;
  }

  get f() {
    return this.uploadImageForm.controls;
  }

  initUploadImageForm() {
    this.uploadImageForm = this.fb.group({
      subCategoryId: [
        {
          value: this.editedImage?.subCategoryId ?? '',
          disabled:
            !!this.editedImage?.subCategoryId ||
            this.type === 'upload-with-album',
        },
        [Validators.required],
      ],
      Caption: [this.editedImage?.picCaption ?? '', [Validators.required]],
      CHKWaterMark: [this.editedImage?.CHKWaterMark ?? false],
    });
  }

  async openModal() {
    this.initUploadImageForm();
    this.dashboardService.galleryTypes$.subscribe((types) => {
      this.galleryTypes = types;
    });
    this.getGalleryByType();
    if (this.type === 'upload-with-album') {
      this.f.subCategoryId.setValue(this.galleryId);
    }
    return await this.modalComponent.open();
  }

  getGalleryByType(e?: any) {
    const galleryId = e ? e.target.value : this.galleryTypes[0]?.galleryTypeID;
    const getGalleryByTypeSubscr = this.addNewService
      .getGalleryByType(galleryId)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: typeof this.gallery) => {
          if (data) {
            this.gallery = data;
            if (this.type !== 'upload-with-album') {
              this.f.subCategoryId.setValue(data[0].galleryID);
            }
            this.cdr.detectChanges();
          } else {
            this.gallery = [];
          }
        },
        error: (error: any) => {
          console.log('[Gallery]', error);
        },
      });
    this.unsubscribe.push(getGalleryByTypeSubscr);
  }

  addImage() {
    const addImageSubscr = this.addNewService
      .addImage(
        this.f.subCategoryId.value,
        this.f.Caption.value,
        this.f.CHKWaterMark.value,
        this.imageUrl,
        0,
        0,
        0,
        0,
        this.image
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
          }
        },
        error: (error: any) => {
          console.log('[ADD_IMAGE]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(addImageSubscr);
  }

  updateImage() {
    const addImageSubscr = this.addNewService
      .updateImage(
        this.editedImage.id,
        this.f.Caption.value,
        this.f.CHKWaterMark.value,
        this.imageUrl,
        0,
        0,
        0,
        0,
        this.image
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
          }
        },
        error: (error: any) => {
          console.log('[UPDATE_IMAGE]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(addImageSubscr);
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
  //     event.objectUrl as string
  //   );
  //   // event.blob can be used to upload the cropped image
  // }
  // imageLoaded(image: LoadedImage) {
  //   // show cropper
  // }
  // cropperReady() {
  //   // cropper ready
  // }
  // loadImageFailed() {
  //   // show message
  // }

  recieveImage(data: any) {
    this.image = data;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
