import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild, OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig, Section } from 'src/app/models/components.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { SectionsService } from 'src/app/services/dashboard/sections/sections.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.scss',
})
export class AddSectionComponent implements OnInit, OnDestroy {
  sectionForm: FormGroup;
  filterForm: FormGroup;

  private unsubscribe: Subscription[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;

  @Output() eventEmitter = new EventEmitter<boolean>();

  @Input() type: 'edit' | 'add' = 'add';
  @Input() sectionId: string;

  @Input() item: any;

  isLoading$: Observable<boolean>;
  newsCategories: any[] = [];

  modalConfig: ModalConfig = {
    modalTitle: this.type === 'edit' ? 'تعديل باب فرعي' : 'أضافة باب فرعي',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      if (this.type === 'edit') {
        this.editSection();
      } else {
        this.addMainSection();
      }
    },
  };

  constructor(
    private fb: FormBuilder,
    private sectionsService: SectionsService,
    private dashboardService: DashboardService,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.sectionsService.isLoading$;
    this.dashboardService.categories$.subscribe((categories) => {
      this.newsCategories = categories;
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.sectionForm.controls;
  }

  initForm() {
    this.sectionForm = this.fb.group({
      Description: ['', Validators.required],
      CategoryId: ['', Validators.required],
      Keywords: ['', Validators.required],
      SecTitle: ['', Validators.required],
      Hide: [false],
      WeeklySection: [false],
    });
  }

  async openModal() {
    this.initForm();
    if (this.type === 'edit') {
      this.sectionForm.removeControl('CategoryId');
      this.getSectionById(this.sectionId);
    }
    return await this.modalComponent.open();
  }

  addMainSection() {
    if (!this.sectionForm.invalid) {
      return;
    }
    const addMainSectionSubscr = this.sectionsService
      .addMainSection({
        Description: this.f.Description.value,
        Keywords: this.f.Keywords.value,
        CategoryId: this.f.CategoryId.value,
        SecTitle: this.f.SecTitle.value,
        Hide: this.f.Hide.value,
        WeeklySection: this.f.WeeklySection.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
            this.eventEmitter.emit(true);
            this.modalComponent.close();
          }
        },
        error: (error: any) => {
          console.log('[ADD_MAIN_SECTION]', error);
        },
      });
    this.unsubscribe.push(addMainSectionSubscr);
  }

  editSection() {
    const editSectionSubscr = this.sectionsService
      .editSection({
        SectionId: this.sectionId,
        Description: this.f.Description.value,
        Keywords: this.f.Keywords.value,
        SecTitle: this.f.SecTitle.value,
        Hide: this.f.Hide.value,
        WeeklySection: this.f.WeeklySection.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
            this.eventEmitter.emit(true);
            this.modalComponent.close();
          }
        },
        error: (error: any) => {
          console.log('[EDIT_MAIN_SECTION]', error);
        },
      });
    this.unsubscribe.push(editSectionSubscr);
  }

  getSectionById(sectionId: string) {
    const getSectionByIdSubscr = this.sectionsService
      .getSectionById(sectionId)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.f.Description.setValue(data.data.description);
            this.f.Keywords.setValue(data.data.keywords);
            this.f.SecTitle.setValue(data.data.secTitle);
            this.f.Hide.setValue(data.data.hide);
            this.f.WeeklySection.setValue(data.data.weeklySection);
          }
        },
        error: (error: any) => {
          console.log('[GET_SECTION_BY_ID]', error);
        },
      });
    this.unsubscribe.push(getSectionByIdSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
