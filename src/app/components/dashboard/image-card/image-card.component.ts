import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Image } from 'src/app/models/data.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
})
export class ImageCardComponent implements OnDestroy {
  private unsubscribe: Subscription[] = [];
  imageLoaded: boolean = false;

  @Input() type: 'upload' | 'link' = 'upload';
  @Input() image: Image;
  @Input() isAllImagesSelected: boolean;
  @HostBinding('class') class = 'card h-100';

  @Output() selectedImageEmitter = new EventEmitter<any>();
  @Output() eventEmitter = new EventEmitter<boolean>();

  constructor(
    private utilsService: UtilsService,
    private addNewService: AddNewService,
    private toast: ToastrService
  ) {}

  timeSince(date: string) {
    return this.utilsService.timeSinceInArabic(date);
  }

  deleteImage(id: string) {
    const deleteImageSubscr = this.addNewService.deleteImage(id).subscribe({
      next: (data: any) => {
        if (data) {
          this.toast.error(data.message);
          this.eventEmitter.emit(true);
        }
      },
      error: (error: any) => {
        console.log('[DELETE_IMAGE]', error);
        this.toast.error(error.error.message);
      },
    });
    this.unsubscribe.push(deleteImageSubscr);
  }

  setMainImage(id: string) {
    const deleteImageSubscr = this.addNewService.setMainImage(id).subscribe({
      next: (data: any) => {
        if (data) {
          this.toast.success(data.message);
          this.eventEmitter.emit(true);
        }
      },
      error: (error: any) => {
        console.log('[SET_MAIN_IMAGE]', error);
        this.toast.error(error.error.message);
      },
    });
    this.unsubscribe.push(deleteImageSubscr);
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onSelect(e?: any) {
    this.selectedImageEmitter.emit(e ? e : this.image.id);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
