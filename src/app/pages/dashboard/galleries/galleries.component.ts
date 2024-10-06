import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import {
  FilterOption,
  ListOptions,
  Pagination,
} from 'src/app/models/components.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { GalleryService } from 'src/app/services/dashboard/gallery/gallery.service';

@Component({
  selector: 'app-galleries',
  templateUrl: './galleries.component.html',
})
export class GalleriesComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  search: string = '';
  pagination: Pagination = {
    current: 1,
  };

  filterOptions: FilterOption = {
    isGalleryType: true,

    galleryTypeId: '',
  };

  listOptions: ListOptions = {
    isCustom: true,
  };

  galleryTypes: any[] = [];
  galleries: any[] = [];

  isLoading$: Observable<boolean>;

  constructor(
    private dashboardService: DashboardService,
    private galleryService: GalleryService,
    private addNewService: AddNewService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.isLoading$ = galleryService.isLoading$;
  }

  ngOnInit(): void {
    this.dashboardService.galleryTypes$.subscribe((types) => {
      this.galleryTypes = types;
    });
    this.getGalleriesByType();
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getGalleriesByType(300, e.target.value);
  }

  getGalleriesByType(delay: number = 0, search?: string) {
    const getGalleriesByTypeSubscr = this.addNewService
      .getGalleryByType(this.filterOptions.galleryTypeId, search)
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.galleries = data;
            this.cdr.detectChanges();
          } else {
            this.galleries = [];
          }
        },
        error: (error: any) => {
          console.log('[GET_GALLERIES_BY_TYPE]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(getGalleriesByTypeSubscr);
  }

  updateGalleryToMain(galleryId: string) {
    const updateGalleryToMainSubscr = this.galleryService
      .updateGalleryToMain(galleryId)
      .pipe()
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
            this.getGalleriesByType();
          }
        },
        error: (error: any) => {
          console.log('[GET_GALLERIES_BY_TYPE]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(updateGalleryToMainSubscr);
  }

  deleteGallery(galleryId: string) {
    const deleteGallerySubscr = this.galleryService
      .deleteGallery(galleryId)
      .pipe()
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.error(data.message);
            this.getGalleriesByType();
          }
        },
        error: (error: any) => {
          console.log('[DELETE_GALLERY]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(deleteGallerySubscr);
  }

  recieveFilterOption(data: any) {
    this.filterOptions = data;
    this.getGalleriesByType();
  }

  recieveEvent(data: any) {
    this.getGalleriesByType();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
