import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { FilterOption, ListOptions } from 'src/app/models/components.model';
import { NewWithDate } from 'src/app/models/data.model';
import { UrgentNewsService } from 'src/app/services/dashboard/urgent-news/urgent-news.service';

@Component({
  selector: 'app-urgent-news',
  templateUrl: './urgent-news.component.html',
})
export class UrgentNewsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  items: any[];
  pageNumber: number = 1;
  availablePages: number = 0;

  isLoading$: Observable<boolean>;

  groupListOptions: ListOptions = {
    isEditWithModal: true,
    isEnable: true,
    isDelete: true,

    type: 'edit-urgent',

    enable: (id: string) => {
      this.toggleEnableUrgentNew(id);
    },
    delete: (id: string) => {
      this.deleteUrgentContent(id);
    },
  };

  filterOptions: FilterOption = {
    isCategories: true,
    isSubCategories: true,

    categoryId: '',
    subCategoryId: '',
  };

  constructor(
    private urgentNewsService: UrgentNewsService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUrgentNews();
  }

  getUrgentNews() {
    const getUrgentNewsSubscr = this.urgentNewsService
      .getUrgentNews(String(this.pageNumber))
      .subscribe({
        next: (data: NewWithDate) => {
          this.items = data.news;
          this.availablePages = data.pageNumbers ?? 1;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('[GET_URGENT_NEWS]', error);
          this.toast.error(error.message);
        },
      });
    this.unsubscribe.push(getUrgentNewsSubscr);
  }

  deleteUrgentContent(id: string) {
    const deleteUrgentContentSubscr = this.urgentNewsService
      .deleteUrgentContent(id)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.error(data);
            this.getUrgentNews();
          }
        },
        error: (error: any) => {
          console.log('[DELETE_URGENT_CONTENT]', error);
        },
      });
    this.unsubscribe.push(deleteUrgentContentSubscr);
  }

  toggleEnableUrgentNew(id: string) {
    const toggleEnableUrgentNewSubscr = this.urgentNewsService
      .toggleEnableUrgentNew(id)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data);
            this.getUrgentNews();
          }
        },
        error: (error: any) => {
          console.log('[TOGGLE_ENABLE_URGENT_NEW]', error);
        },
      });
    this.unsubscribe.push(toggleEnableUrgentNewSubscr);
  }

  recieveIsUrgentContentAdded(data: boolean) {
    if (data) {
      this.getUrgentNews();
    }
  }
}
