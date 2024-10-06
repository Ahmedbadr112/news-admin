import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
  timeout,
} from 'rxjs';
import { FilterOption, ListOptions } from 'src/app/models/components.model';
import { NewWithDate, Status } from 'src/app/models/data.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { PublishService } from 'src/app/services/dashboard/publish/publish.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
})
export class PublishComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  newsToPublish: NewWithDate[] = [];
  selectedNews: string[] = [];
  status: Status[] = [];

  filterOptions: FilterOption = {
    isCategories: true,
    isSubCategories: true,

    categoryId: '',
    subCategoryId: '',
  };

  search: string = '';
  selectedStatus: number = 1;

  groupLisOptions: ListOptions = {
    isEdit: true,
    isVersion: true,
    isCheckList: true,
    isPreview: true,
  };

  isLoading$: Observable<boolean>;

  constructor(
    private publishService: PublishService,
    private dashboardService: DashboardService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.publishService.isLoading$;
  }

  ngOnInit(): void {
    this.getNewsToPublish();
    this.dashboardService.rolePassListSubject.subscribe({
      next: (data: any) => {
        this.status = data;
      },
    });
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getNewsToPublish(300);
  }

  getNewsToPublish(delay: number = 0): void {
    const getNewsToPublishSubscr = this.publishService
      .getNewsToPublish(
        this.search,
        this.filterOptions.categoryId,
        this.filterOptions.subCategoryId
      )
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: NewWithDate[]) => {
          if (data) {
            this.newsToPublish = data;
            this.cdr.detectChanges();
          } else {
            this.newsToPublish = [];
          }
        },
        error: (error: any) => {
          console.log('[GET_NEWS_TO_PUBLISH]', error);
        },
      });
    this.unsubscribe.push(getNewsToPublishSubscr);
  }

  returnNews(): void {
    if (!this.selectedNews.length) {
      this.toast.error('يجب ان تختار خبر علي الأقل');
      return;
    }

    const returnNewsSubscr = this.publishService
      .returnNews(this.selectedStatus, this.selectedNews)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.success(data);
            this.getNewsToPublish();
          }
        },
        error: (error: any) => {
          console.log('[RETURN_NEWS]', error);
        },
      });
    this.unsubscribe.push(returnNewsSubscr);
  }

  receiveSelectedNews(data: string[]) {
    this.selectedNews = data;
  }

  deleteNews() {
    if (!this.selectedNews.length) {
      this.toast.error('يجب ان تختار خبر علي الأقل');
      return;
    }

    const deleteNewSubscr = this.publishService
      .deleteNew(this.selectedNews)
      .subscribe({
        next: (data: { message: string; status: number }) => {
          if (data.status === 200) {
            this.toast.error(data.message);
            this.getNewsToPublish();
          }
        },
        error: (error: any) => {
          console.log('[DELETE]', error);
          this.toast.error(error.message);
        },
      });
    this.unsubscribe.push(deleteNewSubscr);
  }

  publishNews() {
    if (!this.selectedNews.length) {
      this.toast.error('يجب ان تختار خبر علي الأقل');
      return;
    }

    const publishNewSubscr = this.publishService
      .publishNews(this.selectedNews)
      .pipe(timeout(7000))
      .subscribe({
        next: (data: { message: string; status: number }) => {
          if (data) {
            this.toast.success(data.message);
            this.getNewsToPublish();
          } else {
            this.toast.error('حدث خطأ ما');
          }
        },
        error: (error: any) => {
          console.log('[PUBLISH]', error);
          if (error.name === 'TimeoutError') {
            this.toast.error('حدث خطأ ما. حاول في وقت لاحق');
          }
        },
      });
    this.unsubscribe.push(publishNewSubscr);
  }

  onSelectedRoleChange(e: any) {
    this.selectedStatus = e.target.value;
  }

  recieveFilterOptions(data: any) {
    this.filterOptions = data;
    this.getNewsToPublish();
  }

  toggleSelectAll(e: any) {
    if (e.target.checked) {
      this.selectedNews = this.newsToPublish[0]?.news.map((item) =>
        String(item.id)
      );
    } else {
      this.selectedNews = [];
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
