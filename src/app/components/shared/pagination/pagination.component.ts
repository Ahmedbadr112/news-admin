import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from 'src/app/models/components.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() pagination: Pagination;

  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  setCurrent(page: number) {
    if (this.pagination) {
      this.pagination.current = page;
      this.pageChange.emit(page);
    }
  }
}
