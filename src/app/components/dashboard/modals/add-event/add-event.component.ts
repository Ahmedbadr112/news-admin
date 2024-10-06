import {
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
import { FilesService } from 'src/app/services/dashboard/files/files.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
})
export class AddEventComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  eventForm: FormGroup;

  @ViewChild('modal') private modalComponent: ModalComponent;

  submitted: boolean = false;
  isLoading$: Observable<boolean>;
  hasError: boolean = false;

  @Input() event: any;
  @Input() type: string = '';

  @Output() isEventAdded = new EventEmitter<boolean>(false);

  modalConfig: ModalConfig = {
    modalTitle: (this.type !== 'edit' ? 'أضافة' : 'تعديل') + 'حدث',
    dismissButtonLabel: this.type !== 'edit' ? 'حفظ' : 'تعديل',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      if (this.type === 'edit') {
        this.editEvent();
      } else {
        this.addEvent();
      }
      this.eventForm.reset();
      this.modalComponent.dismiss();
    },
  };

  constructor(
    private fb: FormBuilder,
    private filesService: FilesService,
    private toastr: ToastrService
  ) {
    this.isLoading$ = this.filesService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.eventForm.controls;
  }

  initForm() {
    this.eventForm = this.fb.group({
      event: [this.event.event ?? '', Validators.required],
    });
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  addEvent() {
    this.submitted = true;
    const addEventSubscr = this.filesService
      .addEvent(this.f.event.value)
      .subscribe({
        next: (data) => {
          if (data) {
            this.toastr.success(data.message);
            this.submitted = false;
            this.isEventAdded.emit(true);
          }
        },
        error: (error: any) => {
          console.log('[ADD_EVENT]', error);
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addEventSubscr);
  }

  editEvent() {
    this.submitted = true;
    const addEventSubscr = this.filesService
      .editEvent(this.f.event.value)
      .subscribe({
        next: (data) => {
          if (data) {
            this.toastr.success(data.message);
            this.submitted = false;
            this.isEventAdded.emit(true);
          }
        },
        error: (error: any) => {
          console.log('[ADD_EVENT]', error);
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addEventSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
