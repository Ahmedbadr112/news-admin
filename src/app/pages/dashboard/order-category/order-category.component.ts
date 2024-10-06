import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { OrderNewsService } from 'src/app/services/dashboard/order-news/order-news.service';
import { FilterOption } from 'src/app/models/components.model';
import { OrderEditorsService } from 'src/app/services/dashboard/order-editors/order-editors.service';
import { CategoryService } from 'src/app/services/dashboard/category/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-category',
  templateUrl: './order-category.component.html',
})
export class OrderCategoriesComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  categories: any[] = [];

  itemsIds = this.categories?.map((category) => category.newId);

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  constructor(
    private categoriesService: CategoryService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.categoriesService.isLoading$;
  }

  ngOnInit(): void {
    this.getCategoriesOrder();
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

  getCategoriesOrder() {
    this.hasError = false;

    const getCategoriesOrderSubscr = this.categoriesService
      .getOrderedCategories()
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.categories = data.map((category) => ({
              title: category.name,
              secTitle: category.seoTitle,
              ...category,
            }));
            this.cdr.detectChanges();
          } else {
            this.categories = [];
          }
        },
        error: (error: any) => {
          console.log('[CATEGORIES_ORDER]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getCategoriesOrderSubscr);
  }

  orderCategories() {
    this.hasError = false;
    const orderCategoriesSubscr = this.categoriesService
      .orderCategories(this.itemsIds)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.success(data);
          }
        },
        error: (error: any) => {
          console.log('[ORDER_CATEGORIES]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(orderCategoriesSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
