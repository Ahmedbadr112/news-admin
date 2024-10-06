import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig } from 'src/app/models/components.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { EditorsService } from 'src/app/services/dashboard/editors/editors.service';

@Component({
  selector: 'app-add-editor',
  templateUrl: './add-editor.component.html',
})
export class AddEditorComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  defaultEditor: {
    editorName: string;
    editorEmail: string;
    editorDetails: string;
    image: File | null;
  } = {
    editorName: '',
    editorEmail: '',
    editorDetails: '',
    image: null,
  };

  editorForm: FormGroup;

  @ViewChild('modal') private modalComponent: ModalComponent;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;

  modalConfig: ModalConfig = {
    modalTitle: 'أضافة كاتب',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      this.addEditor();
      this.editorForm.reset();
      this.modalComponent.dismiss();
    },
  };

  constructor(
    private fb: FormBuilder,
    private editorsService: EditorsService,
    private toastr: ToastrService
  ) {
    this.isLoading$ = this.editorsService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.editorForm.controls;
  }

  initForm() {
    this.editorForm = this.fb.group({
      editorName: [this.defaultEditor.editorName, Validators.required],
      editorEmail: [this.defaultEditor.editorEmail],
      editorDetails: [this.defaultEditor.editorDetails, Validators.required],
      image: [this.defaultEditor.image],
    });
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  addEditor() {
    this.hasError = false;
    const getGalleryTypesSubscr = this.editorsService
      .addEditor(
        this.f.editorName.value,
        this.f.image.value,
        this.f.editorDetails.value,
        this.f.editorEmail.value
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.toastr.success(data.message);
          }
        },
        error: (error: any) => {
          console.log('[GalleryTypes]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getGalleryTypesSubscr);
  }
}
