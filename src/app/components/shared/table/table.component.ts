import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CustomButton,
  FilterOption,
  TableOption,
} from 'src/app/models/components.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
  hasError: boolean = false;

  selectedItems: string[] = [];
  searchQuery: string = '';

  @Output() selectedNewsEmitter = new EventEmitter<string[]>();
  @Output() searchEmitter = new EventEmitter<string>();
  @Output() filterOptionEmitter = new EventEmitter<{}>();

  @Input() items: any;

  @Input() tableOptions: TableOption = {
    isCheckbox: false,

    headerCols: [
      { title: 'العنوان', width: 150 },
      { title: 'الوقت', width: 120 },
      { title: 'التاريخ', width: 100 },
    ],
    actions: [
      { title: 'publish', click: () => {}, icon: 'file-added' },
      { title: 'restore', click: () => {}, icon: 'arrow-zigzag' },
      { title: 'delete', click: () => {}, icon: 'trash' },
    ],
  };

  @Input() filterOptions: FilterOption;

  @Input() customBtns: CustomButton[] = [];

  convertToArabicTime(time: any) {
    let [hours, minutes] = time.split(':').map(Number);

    let suffix = hours < 12 ? 'ص' : 'م';
    hours = hours % 12 || 12;

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');

    return `${hours}:${minutes} ${suffix}`;
  }

  convertToFullDate(dateTime: string) {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/200${year}`;
  }

  timeSinceInArabic(dateString: string): string {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - targetDate.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `منذ ${days} أيام`;
    } else if (hours > 0) {
      return `منذ ${hours} ساعات`;
    } else if (minutes > 0) {
      return `منذ ${minutes} دقائق`;
    } else if (seconds > 0) {
      return `منذ ${seconds} ثواني`;
    } else {
      return 'الآن';
    }
  }

  onSelect(e: any) {
    this.selectedItems.push(e.target.id);
    this.selectedNewsEmitter.emit(this.selectedItems);
  }

  onFilter(e: any) {
    this.searchQuery = e.target.value;
    this.searchEmitter.emit(this.searchQuery);
  }

  onSearch(e: any) {
    this.searchQuery = e.target.value;
    this.searchEmitter.emit(this.searchQuery);
  }

  recevieFilterOption(data: {}) {
    this.filterOptionEmitter.emit(data);
  }
}
