import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { NEW } from 'src/app/models/data.model';
import { MainNewsService } from 'src/app/services/dashboard/main-news/main-news.service';

@Component({
  selector: 'app-main-news',
  templateUrl: './main-news.component.html',
})
export class MainNewsComponent implements OnDestroy, OnInit {
  private unsubscribe: Subscription[] = [];

  news: NEW[] = [];

  groupListOptions: ListOptions = {
    isDelete: true,
    isVersion: true,
    isPreview: true,
    isDate: true,
    delete: (id?: string) => {
      if (id) {
        this.deleteNew(id);
      }
    },
  };
  pagination: Pagination = {
    count: 1,
    pages: [1],
    current: 1,
  };

  filterOption: FilterOption = {
    isCategories: true,
    isSubCategories: true,
    isType: true,

    categoryId: '',
    subCategoryId: '',
    typeId: '',
  };

  search: string = '';

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  constructor(
    private mainNewsService: MainNewsService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.mainNewsService.isLoading$;
  }

  ngOnInit(): void {
    this.getPublishedNews();
  }

  onSearch(e: any) {
    this.search = e.target.value;

    this.getPublishedNews(300, e.target.value);
  }

  getPublishedNews(delay: number = 0, search?: string) {
    this.hasError = false;

    const getPublishedNewsSubscr = this.mainNewsService
      .getPublishedNews(
        this.pagination.current,
        search,
        this.filterOption.categoryId,
        this.filterOption.subCategoryId,
        this.filterOption.typeId
      )
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: { news: NEW[]; count: number; pageNumbers: number }) => {
          this.news = data?.news;

          this.pagination = {
            current: this.pagination.current,
            pages: Array.from({ length: data?.pageNumbers }, (_, i) => i + 1),
            count: data?.count,
          };
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('[GET_PUBLISHED_NEWS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getPublishedNewsSubscr);
  }

  deleteNew(id: string) {
    this.hasError = false;

    const deleteNewSubscr = this.mainNewsService.deleteNew(id).subscribe({
      next: (data: string) => {
        if (data) {
          this.toast.error(data);
          this.getPublishedNews();
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.log('[DELETE_NEW]', error);
        this.hasError = true;
      },
    });
    this.unsubscribe.push(deleteNewSubscr);
  }

  recieveFilterOption(data: FilterOption) {
    this.filterOption = data;
    this.getPublishedNews();
  }

  recieveChangedPage(data: number) {
    this.pagination.current = data;
    this.getPublishedNews();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
