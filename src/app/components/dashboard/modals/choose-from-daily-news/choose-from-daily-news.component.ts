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
import { ListOptions, ModalConfig } from 'src/app/models/components.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UrgentNewsService } from 'src/app/services/dashboard/urgent-news/urgent-news.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-choose-from-daily-news',
  templateUrl: './choose-from-daily-news.component.html',
})
export class ChooseFromDailyNewsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;

  @Output() onUrgentNewsChoosedFromDailyNewsEmitter =
    new EventEmitter<boolean>();

  items: any[] = [];
  selectedItems: string[] = [];

  categories: any[] = [];
  subCategories: any[] = [];

  groupListOptions: ListOptions = {
    isCheckList: true,
  };

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  modalConfig: ModalConfig = {
    modalTitle: 'أضافة خبر عاجل من المحتويات اليومية',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    hideDismissButton: true,
  };

  searchForm: FormGroup;
  pageNumber: number = 2;

  @Output() onNewUrgentContentAddedEmitter = new EventEmitter<boolean>();

  constructor(
    private urgentNewsService: UrgentNewsService,
    private dashboardService: DashboardService,
    private toast: ToastrService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.isLoading$ = this.urgentNewsService.isLoading$;
    this.dashboardService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.searchForm = this.fb.group({
      search: [''],
      categoryId: [''],
      subCategoryId: [''],
    });
  }

  async openModal() {
    this.getDailyNews();
    return await this.modalComponent.open();
  }

  toggleSelectAll(e: any) {
    this.selectedItems = this.utilsService.toggleSelectAll(
      e,
      this.items.map((items) => items.news)
    );
  }

  onCategoryChange(e: any) {
    this.hasError = false;
    const getNewsSubCategoriesSubscr = this.dashboardService
      .getNewsSubCategories(e.target.value)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: { sectionID: string; secTitle: string }[]) => {
          this.subCategories = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('NEWS_SUB_CATEGORIES', err);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getNewsSubCategoriesSubscr);
  }

  get f() {
    return this.searchForm.controls;
  }

  getDailyNews() {
    this.hasError = false;
    const getDailyNewsSubscr = this.urgentNewsService
      .getDailyNewsContent(
        this.pageNumber,
        this.f.search.value,
        this.f.categoryId.value,
        this.f.subCategoryId.value
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.items = data.map(
              (item: { date: string; dailyNewsContent: [] }) => ({
                date: item.date,
                news: item.dailyNewsContent.map((news: { newId: string }) => ({
                  id: news.newId,
                  ...news,
                })),
              })
            );
            this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          console.log('[GET_DAILY_NEWS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getDailyNewsSubscr);
  }

  addUrgentContent() {
    this.hasError = false;

    if (!this.selectedItems.length) {
      this.toast.error('يجب عليك اختيار الأخبار المراد اضافاتها');
      return;
    }
    this.onNewUrgentContentAddedEmitter.emit(false);

    const addUrgentContentSubscr = this.urgentNewsService
      .addUrgentContent(this.selectedItems)
      .subscribe({
        next: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            this.toast.success(data.message);
            this.getDailyNews();
            this.onNewUrgentContentAddedEmitter.emit(true);
          } else {
            this.toast.error('حدث خطأ ما');
          }
        },
        error: (error: any) => {
          console.log('[GET_DAILY_NEWS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(addUrgentContentSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
