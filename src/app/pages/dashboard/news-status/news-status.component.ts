import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import {
  FilterOption,
  ListOptions,
  TableOption,
} from 'src/app/models/components.model';
import { NEW } from 'src/app/models/new.model';
import { NewsStatusService } from 'src/app/services/dashboard/news-status/news-status.service';

@Component({
  selector: 'app-news-status',
  templateUrl: './news-status.component.html',
  styleUrl: './news-status.component.scss',
})
export class NewsStatusComponent implements OnDestroy, OnInit {
  private unsubscribe: Subscription[] = [];

  news: NEW[] = [];
  searchQuery: string = '';
  selectedNews: string[] = [];
  pageNumber: number = 1;

  groupListOptions: ListOptions = {};

  filterOptions: FilterOption = {
    isCategories: true,
    isSubCategories: true,
    isStatus: true,
    isRoles: true,

    categoryId: '',
    subCategoryId: '',
    statusId: '',
    roleId: '',
  };

  hasError: boolean = false;

  constructor(
    private newsStatusService: NewsStatusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getNews();
  }

  onSearch(e: any) {
    this.searchQuery = e.target.value;
    this.getNews(300);
  }

  getNews(delay = 0) {
    this.hasError = false;
    const getNewsSubscr = this.newsStatusService
      .getNews(
        this.pageNumber,
        this.searchQuery,
        this.filterOptions.statusId,
        this.filterOptions.categoryId,
        this.filterOptions.subCategoryId
      )
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.news = data.news;
            this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          console.log('[NEWS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getNewsSubscr);
  }

  recieveFilterOption(data: FilterOption) {
    this.filterOptions = data;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
