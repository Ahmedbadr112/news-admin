import { ModalConfig } from 'src/app/models/components.model';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { EditorsService } from 'src/app/services/dashboard/editors/editors.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms'; // You've already imported these
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalsModule } from '../modals.module';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-edit-editor',
  templateUrl: './edit-editor.component.html',
})
export class EditEditorComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  defaultEditor: {
    editorId: string;
    editorName: string;
    editorEmail: string;
    editorDetails: string;
    image: File | null;
  } = {
    editorId: '',
    editorName: '',
    editorEmail: '',
    editorDetails: '',
    image: null,
  };

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Input() type: 'edit' | 'add' = 'add';
  @Input() sectionId: string;
  @Input() item: any;

  editEditorForm: FormGroup;
  @ViewChild('modal') private modalComponent: ModalComponent;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;

  modalConfig: ModalConfig = {
    modalTitle: 'تعديل كاتب',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      this.editEditor();
      this.editEditorForm.reset();
      this.modalComponent.dismiss();
    },
  };

  items: any[];
  editorId: string;

  handleClick(id: string): void {
    this.editorId = `${id}`;
    console.log('Selected ID:', this.editorId);
    this.cdr.markForCheck();
  }

  constructor(
    private editorsService: EditorsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.editorsService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.editEditorForm.controls;
  }

  initForm() {
    this.editEditorForm = this.fb.group({
      editorName: ['', Validators.required],
      editorEmail: [''],
      editorDetails: ['', Validators.required],
      image: [''],
    });
  }

  async openModal(id: string) {
    this.handleClick(id);
    return await this.modalComponent.open();
  }

  editEditor() {
    this.hasError = false;
    this.cdr.detectChanges();

    if (!this.f.editorName.value) {
      this.toastr.error('Editor Name is required.');
      return;
    }

    const editorIdString = this.editorId ? this.editorId.toString() : '';

    const getGalleryTypesSubscr = this.editorsService
      .editEditor(
        this.f.editorName.value,
        editorIdString,
        this.f.image.value,
        this.f.editorDetails.value,
        this.f.editorEmail.value
      )
      .subscribe({
        next: (data) => {
          if (data) {
            console.log(this.editorId);
            this.toastr.success(data.message);
            this.cdr.detectChanges(); // Ensure the view updates immediately
          }
        },
        error: (error: any) => {
          console.log('[GalleryTypes]', error);
          this.hasError = true;
          this.toastr.error('An error occurred while updating the editor.'); // Show error message
        },
      });

    // Ensure to store the subscription
    this.unsubscribe.push(getGalleryTypesSubscr);
  }
}
