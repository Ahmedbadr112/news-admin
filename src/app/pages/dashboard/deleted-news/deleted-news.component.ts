import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import {
  FilterOption,
  ListOptions,
  Pagination,
} from 'src/app/models/components.model';
import { DeletedNewsService } from 'src/app/services/dashboard/deleted-news/deleted-news.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-deleted-news',
  templateUrl: './deleted-news.component.html',
})
export class DeletedNewsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  items: any[] = [];
  selectedNews: string[] = [];

  groupListOptions: ListOptions = {
    isDelete: true,
    isCheckList: true,
    isViews: true,
    delete: (id: string) => {
      this.selectedNews.push(id);
      this.deleteDeletedNew();
    },
  };

  pagination: Pagination = {
    current: 1,
  };

  search = '';
  filterOption: FilterOption = {
    categoryId: '',
    subCategoryId: '',
  };

  isLoading$: Observable<boolean>;

  constructor(
    private deletedNewsService: DeletedNewsService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.deletedNewsService.isLoading$;
  }

  ngOnInit(): void {
    this.getDeletedNews();
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getDeletedNews(300, e.target.value);
  }

  getDeletedNews(delay: number = 0, search?: string) {
    const getDeletedNewsSubscr = this.deletedNewsService
      .getDeletedNews(
        this.pagination.current,
        search,
        this.filterOption.categoryId,
        this.filterOption.subCategoryId
      )
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: { news: any[]; pageNumbers: number; count: number }) => {
          if (data) {
            this.pagination = {
              current: this.pagination.current,
              pages: Array.from({ length: data.pageNumbers }, (_, i) => i + 1),
              count: data.count,
            };
            this.items = data.news;
            this.cdr.detectChanges();
          } else {
            this.items = [];
          }
        },
        error: (error: any) => {
          console.log('[GET_DELETED_NEWS]', error);
        },
      });
    this.unsubscribe.push(getDeletedNewsSubscr);
  }

  recieveFilterOption(data: any) {
    this.filterOption = data;
    if (data.category && data.subCategory) {
      this.getDeletedNews();
    }
  }

  deleteDeletedNew() {
    const deleteDeletedNewSubscr = this.deletedNewsService
      .deleteDeletedNew(this.selectedNews)
      .pipe()
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.error(data.message);
          } else {
            this.items = [];
          }
        },
        error: (error: any) => {
          console.log('[DELETE_DELETED_NEW]', error);
        },
      });
    this.unsubscribe.push(deleteDeletedNewSubscr);
  }

  toggleSelectAll(e: any) {
    this.selectedNews = this.utilsService.toggleSelectAll(
      e,
      this.items.map((items) => items.news).flat(1)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
