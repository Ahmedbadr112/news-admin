import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FilterOption, ListOptions } from 'src/app/models/components.model';
import { NEW } from 'src/app/models/data.model';
import { EditorNewsStatusService } from 'src/app/services/dashboard/editor-news-status/editor-news-status.service';

@Component({
  selector: 'app-editor-news-state',
  templateUrl: './editor-news-state.component.html',
})
export class EditorNewsStateComponent implements OnDestroy {
  private unsubscribe: Subscription[] = [];

  news: NEW[] = [];
  searchQuery: string = '';
  selectedNews: string[] = [];
  pageNumber: number = 1;

  groupListOptions: ListOptions = {
    isPreview: true,
    isVersion: true,
    isState: true,
    isEmployee: true,
  };

  filterOptions: FilterOption = {
    isStatus: true,

    statusId: '',
  };

  isLoading$: Observable<boolean>;

  constructor(
    private editorNewsStateService: EditorNewsStatusService,
    private cdr: ChangeDetectorRef
  ) {
    this.editorNewsStateService.isLoading$ = this.isLoading$;
  }

  ngOnInit(): void {
    this.getEditorNews();
  }

  getEditorNews() {
    const getEditorNewsSubscr = this.editorNewsStateService
      .getMyNews(this.pageNumber, this.filterOptions.statusId)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.news = data.news;
            this.cdr.detectChanges();
          } else {
            this.news = [];
          }
        },
        error: (error: any) => {
          console.log('[NEWS]', error);
        },
      });
    this.unsubscribe.push(getEditorNewsSubscr);
  }

  recieveFilterOption(data: FilterOption) {
    this.filterOptions = data;
    this.getEditorNews();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
