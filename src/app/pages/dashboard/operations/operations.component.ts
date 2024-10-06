import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { FilterOption, ListOptions } from 'src/app/models/components.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { OperationsService } from 'src/app/services/dashboard/operations/operations.service';
import { PublishService } from 'src/app/services/dashboard/publish/publish.service';
import { VersionsService } from 'src/app/services/dashboard/versions/versions.service';
import { PageInfoService } from 'src/app/services/layout/page-info.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
})
export class OperationsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  items: any[] = [];
  selectedNews: string[] = [];
  rolePassList: { id: string; name: string }[] = [];

  selectedRole: number = 1;

  search: string = '';
  filterOptions: FilterOption = {
    isCategories: true,
    isSubCategories: true,

    categoryId: '',
    subCategoryId: '',
  };
  groupLisOptions: ListOptions = {
    isDelete: true,
    isEdit: true,
    isVersion: true,
    isCheckList: true,
    delete: () => {},
    edit: () => {},
  };

  hasError: boolean;
  isLoading$: Observable<boolean>;

  groupListOptions: ListOptions = {
    isEdit: true,
    isCheckList: true,

    edit() {},
  };

  constructor(
    private publishService: PublishService,
    private dashboardService: DashboardService,
    private pageInfoServices: PageInfoService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private operationService: OperationsService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.pageInfoServices.updateTitle('العمليات' + ' - ALWakeel');

    this.getOperations();
    this.dashboardService.rolePassListSubject.subscribe({
      next: (data: any) => {
        this.rolePassList = data;
      },
    });
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getOperations(300);
  }

  returnNews(): void {
    this.hasError = false;
    if (!this.selectedNews.length) return;
    const returnNewsSubscr = this.publishService
      .returnNews(this.selectedRole, this.selectedNews)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.success(data);
            this.getOperations();
          }
        },
        error: (error: any) => {
          console.log('[RETURN_NEWS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(returnNewsSubscr);
  }

  deleteNews(id?: string) {
    this.hasError = false;
    if (id) {
      this.selectedNews.push(id);
    }
    const deleteNewSubscr = this.publishService
      .deleteNew(this.selectedNews)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.error(data);
            this.getOperations();
          }
        },
        error: (error: any) => {
          console.log('[DELETE]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(deleteNewSubscr);
  }

  getOperations(delay: number = 0): void {
    this.hasError = false;
    const getOperationsSubscr = this.operationService
      .getOperations()
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.items = data;
            this.cdr.detectChanges();
          } else {
            this.items = [];
          }
        },
        error: (error: any) => {
          console.log('OPERATIONS', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getOperationsSubscr);
  }

  toggleSelectAll(e: any) {
    this.selectedNews = this.utilsService.toggleSelectAll(
      e,
      this.items.map((items) => items.news)
    );
  }

  onSelectedRoleChange(e: any) {
    this.selectedRole = e.target.value;
  }

  receiveSelectedNews(data: any) {
    this.selectedNews = data;
  }

  recieveFilterOptions(data: any) {
    this.filterOptions = data;
    this.getOperations();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
