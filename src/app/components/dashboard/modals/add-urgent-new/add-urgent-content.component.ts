import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig } from 'src/app/models/components.model';
import { NewWithDate } from 'src/app/models/data.model';
import { UrgentNewsService } from 'src/app/services/dashboard/urgent-news/urgent-news.service';

@Component({
  selector: 'app-add-urgent-new',
  templateUrl: './add-urgent-content.component.html',
})
export class AddUrgentContentComponent implements OnInit {
  urgentContentForm: FormGroup;

  private unsubscribe: Subscription[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;

  @Input() type: string = '';
  @Input() urgentNew: any;

  @Output() onNewUrgentContentAddedEmitter = new EventEmitter<boolean>();

  submitted: boolean = false;

  isLoading$: Observable<boolean>;

  modalConfig: ModalConfig = {
    modalTitle: 'أضافة محتوي عاجل',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      if (this.type === 'edit') {
        this.updateUrgentContent();
      } else {
        this.addUrgentContentWithTitle();
      }
    },
  };

  constructor(
    private fb: FormBuilder,
    private urgentNewsService: UrgentNewsService,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.urgentNewsService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.urgentContentForm.controls;
  }

  initForm() {
    this.urgentContentForm = this.fb.group({
      Title: [
        this.type === 'edit' ? this.urgentNew.title : '',
        [Validators.required],
      ],
      isUrgentNew: [this.type === 'edit' ? this.urgentNew.active : false],
    });
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  addUrgentContentWithTitle() {
    this.submitted = true;
    this.onNewUrgentContentAddedEmitter.emit(false);
    const addUrgentContentSubscr = this.urgentNewsService
      .addUrgentContentWithTitle(this.f.Title.value, this.f.isUrgentNew.value)
      .subscribe({
        next: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            this.toast.success(data.message);
            this.onNewUrgentContentAddedEmitter.emit(true);
            this.modalComponent.close();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[ADD_URGENT_CONTENT]', error);
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addUrgentContentSubscr);
  }

  updateUrgentContent() {
    this.submitted = true;
    this.onNewUrgentContentAddedEmitter.emit(false);
    const updateUrgentContentSubscr = this.urgentNewsService
      .updateUrgentContent(
        this.urgentNew.id,
        this.f.Title.value,
        this.f.isUrgentNew.value
      )
      .subscribe({
        next: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            this.toast.success(data.message);
            this.onNewUrgentContentAddedEmitter.emit(true);
            this.modalComponent.close();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[UPDATE_URGENT_CONTENT]', error);
          this.submitted = false;
          this.toast.error(error.message);
        },
      });
    this.unsubscribe.push(updateUrgentContentSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
