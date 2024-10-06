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

@Component({
  selector: 'app-order-editors',
  templateUrl: './order-editors.component.html',
})
export class OrderEditorsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  editors: any[] = [];

  itemsIds = this.editors?.map((editor) => editor.newId);

  filterOption: FilterOption = {
    isOrderCategories: true,
    isOrderSubCategories: true,
    orderCategoryId: '',
    orderSubCategoryId: '',
  };

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  constructor(
    private orderEditorsService: OrderEditorsService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.orderEditorsService.isLoading$;
  }

  ngOnInit(): void {
    this.getNewsOrder();
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

  getNewsOrder() {
    this.hasError = false;

    const getNewsOrderSubscr = this.orderEditorsService
      .getOrderEditors(this.filterOption.orderCategoryId)
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            this.editors = data;
            this.cdr.detectChanges();
          } else {
            this.editors = [];
          }
        },
        error: (error: any) => {
          console.log('[EDITORS_ORDER]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getNewsOrderSubscr);
  }

  saveOrder() {
    const itemsIds = this.editors.map((editor) => editor.newId);
    this.hasError = false;
    const saveOrderSubscr = this.orderEditorsService
      .saveOrder(
        itemsIds,
        this.filterOption.orderCategoryId,
        this.filterOption.orderSubCategoryId
      )
      .subscribe({
        next: (data: any[]) => {
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
