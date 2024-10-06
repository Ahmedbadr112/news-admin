import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import { ListOptions, Pagination } from 'src/app/models/components.model';
import { FilesService } from 'src/app/services/dashboard/files/files.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-news-files',
  templateUrl: './news-files.component.html',
})
export class NewsFilesComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  files: any[] = [];

  isLoading$: Observable<boolean>;

  search: string = '';
  pagination: Pagination = {
    current: 1,
  };

  groupListOptions: ListOptions = {
    isCustom: true,
  };

  constructor(
    private filesService: FilesService,
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService
  ) {
    this.isLoading$ = filesService.isLoading$;
  }

  ngOnInit(): void {
    this.getFiles();
  }

  onSearch(e: any) {
    this.search = e.target.value;
  }

  getFiles(delay: number = 0, search?: string) {
    const getPublishedNewsSubscr = this.filesService
      .getFiles(this.pagination.current, search)
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: { files: any[]; count: number; pageNumbers: number }) => {
          this.files = data?.files;

          this.pagination = {
            current: this.pagination.current,
            pages: Array.from({ length: data?.pageNumbers }, (_, i) => i + 1),
            count: data?.count,
          };
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('[GET_FILES]', error);
        },
      });
    this.unsubscribe.push(getPublishedNewsSubscr);
  }

  convertDateToArabicFormat(dateString: string) {
    return this.utilsService.convertDateToArabicFormat(dateString);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
