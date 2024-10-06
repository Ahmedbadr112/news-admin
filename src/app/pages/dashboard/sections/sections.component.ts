import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import {
  FilterOption,
  ListOptions,
  Pagination,
} from 'src/app/models/components.model';
import { Section } from 'src/app/models/data.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { SectionsService } from 'src/app/services/dashboard/sections/sections.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
})
export class SectionsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  sections: Section[] = [];
  selectedSections: string[] = [];

  filterOptions: FilterOption = { isCategories: true, categoryId: '' };

  listOptions: ListOptions = {
    isCheckList: true,
    isEdit: true,
    edit: () => {},
  };

  pagination: Pagination = { current: 1 };

  isLoading$: Observable<boolean>;

  constructor(
    private sectionsService: SectionsService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    private dashboardService: DashboardService
  ) {
    this.isLoading$ = this.sectionsService.isLoading$;
  }

  toggleSelectAll(e: any) {
    this.selectedSections = this.utilsService.toggleSelectAll(e, this.sections);
  }

  ngOnInit(): void {
    this.dashboardService.categories$.subscribe((categories) => {
      this.getAllSections(categories[0]?.categoryID);
    });
  }

  getAllSections(categoryId?: string) {
    if (!categoryId && !this.filterOptions.categoryId) return;
    const getAllSectionSubscr = this.sectionsService
      .getAllSections(
        this.pagination.current,
        categoryId ?? this.filterOptions.categoryId
      )
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.sections = data;
            this.cdr.detectChanges();
          } else {
            this.sections = [];
          }
        },
        error: (error: any) => {
          console.log('[GET_ALL_SECTIONS]', error);
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(getAllSectionSubscr);
  }

  deleteSections() {
    const deleteSectionsSubscr = this.sectionsService
      .deleteSections(this.selectedSections)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.error(data);
            this.selectedSections = [];
            this.getAllSections();
          }
        },
        error: (error: any) => {
          console.log('[DELETE_SECTIONS]', error);
        },
      });
    this.unsubscribe.push(deleteSectionsSubscr);
  }

  recieveSelectedItems(data: string[]) {
    this.selectedSections = data;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
