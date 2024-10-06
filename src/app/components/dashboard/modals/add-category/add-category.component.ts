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
import { Observable, Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { Category } from 'src/app/models/components.model';
import { ModalConfig } from 'src/app/models/components.model';
import { CategoryService } from 'src/app/services/dashboard/category/category.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  filterForm: FormGroup;

  private unsubscribe: Subscription[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;

  @Output() onNewCategoryAddedEmitter = new EventEmitter<boolean>();

  @Input() title: string = 'أضافة باب رئيسي';
  @Input() btnStyle: string = '';
  @Input() category: Category = {
    Name: '',
    Hide: false,
    SeoTitle: '',
    SeoKeyWords: '',
    SeoDescription: '',
  };

  hasError: boolean = false;

  isLoading$: Observable<boolean>;
  newsCategories: any[] = [];

  modalConfig: ModalConfig = {
    modalTitle: 'أضافة باب فرعي',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      if (!this.categoryForm.invalid) {
        this.addCategory();
        this.modalComponent.close();
      }
    },
  };

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dashboardService: DashboardService,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.categoryService.isLoading$;
    this.dashboardService.categories$.subscribe((categories) => {
      this.newsCategories = categories;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.categoryForm.controls;
  }

  initForm() {
    this.categoryForm = this.fb.group({
      Name: ['', Validators.required],
      SeoTitle: ['', Validators.required],
      SeoKeyWords: ['', Validators.required],
      SecTitle: ['', Validators.required],
      Hide: [false],
      SeoDescription: ['', Validators.required],
    });
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  addCategory() {
    this.hasError = false;
    this.onNewCategoryAddedEmitter.emit(false);
    const addCategorySubscr = this.categoryService
      .addCategory({
        Name: this.f.Name.value,
        SeoTitle: this.f.SeoTitle.value,
        SeoKeyWords: this.f.SeoKeyWords.value,
        SeoDescription: this.f.SeoDescription.value,
        Hide: this.f.Hide.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
            this.onNewCategoryAddedEmitter.emit(true);
          }
        },
        error: (error: any) => {
          console.log('[ADD_CATEGORY]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(addCategorySubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
