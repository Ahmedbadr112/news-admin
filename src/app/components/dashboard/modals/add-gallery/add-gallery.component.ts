import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig } from 'src/app/models/components.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { GalleryService } from 'src/app/services/dashboard/gallery/gallery.service';

@Component({
  selector: 'app-add-gallery',
  templateUrl: './add-gallery.component.html',
})
export class AddGalleryComponent implements OnDestroy {
  private unsubscribe: Subscription[] = [];

  galleryForm: FormGroup;

  @ViewChild('modal') private modalComponent: ModalComponent;

  @Output() eventEmitter = new EventEmitter<boolean>(false);

  isLoading$: Observable<boolean>;

  @Input() galleryId: string;
  @Input() type: 'add' | 'edit' = 'add';

  galleryTypes: any[] = [];

  modalConfig: ModalConfig = {
    modalTitle: this.type === 'edit' ? 'تعديل البوم' : 'أضافة البوم',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      if (this.type === 'edit') {
        this.editGallery();
      } else {
        this.addGallery();
      }
    },
  };

  constructor(
    private fb: FormBuilder,
    private galleryService: GalleryService,
    private toast: ToastrService,
    private dashboardService: DashboardService
  ) {
    this.isLoading$ = this.galleryService.isLoading$;
  }

  get f() {
    return this.galleryForm.controls;
  }

  initForm() {
    this.galleryForm = this.fb.group({
      GalleryTypeId: ['', Validators.required],
      GalleryName: ['', Validators.required],
      GalleryDescription: ['', Validators.required],
      GalleryKeywords: ['', Validators.required],
    });
  }

  addGallery() {
    const addGallerySubscr = this.galleryService
      .addGallery({
        GalleryTypeId: this.f.GalleryTypeId.value,
        GalleryName: this.f.GalleryName.value,
        GalleryDescription: this.f.GalleryDescription.value,
        GalleryKeywords: this.f.GalleryKeywords.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
            this.eventEmitter.emit(true);
            this.galleryForm.reset();
            this.modalComponent.dismiss();
          }
        },
        error: (error: any) => {
          console.log('[ADD_GALLERY]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(addGallerySubscr);
  }

  getGalleryById(galleryId: string) {
    const getGalleryByIdSubscr = this.galleryService
      .getGalleryById(galleryId)
      .subscribe({
        next: (data: any) => {
          if (data.status === 200) {
            this.f.GalleryTypeId.setValue(data.data.galleryTypeId);
            this.f.GalleryName.setValue(data.data.galleryName);
            this.f.GalleryDescription.setValue(data.data.galleryDescription);
            this.f.GalleryKeywords.setValue(data.data.galleryKeywords);
          }
        },
        error: (error: any) => {
          console.log('[GET_GALLERY_BY_ID]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(getGalleryByIdSubscr);
  }

  editGallery() {
    const editGallerySubscr = this.galleryService
      .editGallery({
        GalleryTypeId: this.f.GalleryTypeId.value,
        GalleryId: this.galleryId,
        GalleryName: this.f.GalleryName.value,
        GalleryDescription: this.f.GalleryDescription.value,
        GalleryKeywords: this.f.GalleryKeywords.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
            this.eventEmitter.emit(true);
            this.galleryForm.reset();
            this.modalComponent.dismiss();
          }
        },
        error: (error: any) => {
          console.log('[EDIT_GALLERY]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(editGallerySubscr);
  }

  async openModal() {
    this.initForm();
    this.dashboardService.galleryTypes$.subscribe((types) => {
      this.galleryTypes = types;
    });
    if (this.type === 'edit') {
      this.getGalleryById(this.galleryId);
    }

    return await this.modalComponent.open();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
