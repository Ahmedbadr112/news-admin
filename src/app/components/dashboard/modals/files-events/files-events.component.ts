import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import {
  ListOptions,
  ModalConfig,
  Pagination,
} from 'src/app/models/components.model';
import { FilesService } from 'src/app/services/dashboard/files/files.service';

@Component({
  selector: 'app-files-events',
  templateUrl: './files-events.component.html',
})
export class FilesEventsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;

  isLoading$: Observable<boolean>;

  groupListOptions: ListOptions = {
    isEditWithModal: true,
    isDelete: true,

    type: 'edit-events',

    delete: (id) => {
      this.selectedEvents.push(id);
      this.deleteFilesEvents();
    },
  };

  selectedEvents: string[] = [];
  pagination: Pagination = {
    current: 1,
  };

  events: any[] = [];

  modalConfig: ModalConfig = {
    modalTitle: 'أحداث التغطيات',
    closeButtonLabel: 'اغلاق',
    hideDismissButton: true,
  };

  constructor(
    private filesService: FilesService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.filesService.isLoading$;
  }

  ngOnInit(): void {}

  async openModal() {
    return await this.modalComponent.open();
  }

  getFilesEvents() {
    const getFilesEventsSubscr = this.filesService
      .getFilesEvents(this.pagination.current)
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.events = data;
            this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          console.log('[GET_FILES_EVENTS]', error);
        },
      });
    this.unsubscribe.push(getFilesEventsSubscr);
  }

  deleteFilesEvents() {
    const deleteFilesEventsSubscr = this.filesService
      .deleteFilesEvents(this.selectedEvents)
      .subscribe({
        next: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            this.toast.error(data.message);
          }
        },
        error: (error: any) => {
          console.log('[DELETE_FILES_EVENTS]', error);
          this.toast.error(error.message);
        },
      });
    this.unsubscribe.push(deleteFilesEventsSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
