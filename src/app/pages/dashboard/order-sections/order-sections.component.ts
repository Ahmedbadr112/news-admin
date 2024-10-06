import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SectionsService } from 'src/app/services/dashboard/sections/sections.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { FilterOption } from 'src/app/models/components.model';

@Component({
  selector: 'app-order-sections',
  templateUrl: './order-sections.component.html',
})
export class OrderSectionsComponent implements OnDestroy {
  private unsubscribe: Subscription[] = [];

  sections: any[] = [];
  categories: any[] = [];

  itemsIds: string[];

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  filterOptions: FilterOption = {
    isCategories: true,
    categoryId: '',
  };

  constructor(
    private sectionsService: SectionsService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.sectionsService.isLoading$;
    this.dashboardService.categories$.subscribe((categories) => {
      this.categories = categories;
      this.getSectionsOrder(categories[0]?.categoryID);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getSectionsOrder(categoryId: string) {
    this.hasError = false;

    const getSectionsOrderSubscr = this.sectionsService
      .getOrderedSections(categoryId)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.sections = data.map((section) => ({
              title: section.name,
              ...section,
            }));

            this.itemsIds = this.sections.map((section) => section.id);
            this.cdr.detectChanges();
          } else {
            this.sections = [];
          }
        },
        error: (error: any) => {
          console.log('[SECTIONS_ORDER]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getSectionsOrderSubscr);
  }

  orderSections() {
    this.hasError = false;

    const orderCategoriesSubscr = this.sectionsService
      .orderSections(this.filterOptions.categoryId ?? '', this.itemsIds)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.success(data);
          }
        },
        error: (error: any) => {
          console.log('[ORDER_SECTIONS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(orderCategoriesSubscr);
  }

  recieveFilterOptions(data: any) {
    this.filterOptions = data;
    this.getSectionsOrder(data.categoryId);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
