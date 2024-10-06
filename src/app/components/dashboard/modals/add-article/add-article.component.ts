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
import { EditorsService } from 'src/app/services/dashboard/editors/editors.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
})
export class AddArticleComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  editorForm: FormGroup;

  @ViewChild('modal') private modalComponent: ModalComponent;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;

  modalConfig: ModalConfig = {
    modalTitle: 'أختيار مقال',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      // this.addEditor();
      // this.editorForm.reset();
      // this.modalComponent.dismiss();
    },
  };

  constructor(
    private fb: FormBuilder,
    private editorsService: EditorsService,
    private toastr: ToastrService
  ) {
    this.isLoading$ = this.editorsService.isLoading$;
  }

  ngOnInit(): void {}

  async openModal() {
    return await this.modalComponent.open();
  }
}
