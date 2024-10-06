import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { OrderNewsService } from 'src/app/services/dashboard/order-news/order-news.service';
import { FilterOption } from 'src/app/models/components.model';

@Component({
  selector: 'app-order-news',
  templateUrl: './order-news.component.html',
})
export class OrderNewsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  items: {
    newId: string;
    publishDate: string;
    title: string;
    secTitle: string;
  }[] = [];
  itemsIds = this.items?.map((item) => item.newId);

  filterOption: FilterOption = {
    isOrderCategories: true,
    isOrderSubCategories: true,
    orderCategoryId: '',
    orderSubCategoryId: '',
  };

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  constructor(
    private orderNews: OrderNewsService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.orderNews.isLoading$;
  }

  ngOnInit(): void {
    this.getNewsOrder();
  }

  drop(event: CdkDragDrop<typeof this.items>) {
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

  getNewsOrder() {
    this.hasError = false;

    const getNewsOrderSubscr = this.orderNews
      .getOrderNews(this.filterOption.orderCategoryId)
      .subscribe({
        next: (data: typeof this.items) => {
          console.log(data);

          if (data) {
            this.items = data;
            this.cdr.detectChanges();
          } else {
            this.items = [];
          }
        },
        error: (error: any) => {
          console.log('[NEWS_ORDER]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getNewsOrderSubscr);
  }

  saveOrder() {
    const itemsIds = this.items.map((item) => item.newId);
    this.hasError = false;
    const saveOrderSubscr = this.orderNews
      .saveOrder(
        itemsIds,
        this.filterOption.orderCategoryId,
        this.filterOption.orderSubCategoryId
      )
      .subscribe({
        next: (data: typeof this.items) => {
          if (data) {
          }
        },
        error: (error: any) => {
          console.log('[SAVE_ORDER]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(saveOrderSubscr);
  }

  recieveFilterOption(data: any) {
    this.filterOption = data;
    this.getNewsOrder();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
