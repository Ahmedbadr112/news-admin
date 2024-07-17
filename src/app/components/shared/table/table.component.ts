import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NEW } from 'src/app/models/new.model';
import { PublishService } from 'src/app/services/dashboard/publish/publish.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
  hasError: boolean = false;

  selectedItems: string[] = [];
  searchQuery: string = '';
  pageNumber: number = 1;

  @Output() selectedNewsEmitter = new EventEmitter<string[]>();
  @Output() searchEmitter = new EventEmitter<string>();
  @Output() pageNumberEmitter = new EventEmitter<number>();
  @Output() filterOptionEmitter = new EventEmitter<{}>();

  @Input() items: any;
  @Input() publish: () => void;
  @Input() restore: () => void;
  @Input() deleteNew: (id: string) => void;
  @Input() restoreDraft: (id: string) => void;

  @Input() headerOptions: {
    checkBox: boolean;
    cols: string[];
    actions: string[];
    search: boolean;
    title?: string;
  } = {
    checkBox: true,
    cols: ['العنوان', 'الوقت', 'التاريخ'],
    actions: ['publish', 'restore', 'delete'],
    search: false,
    title: '',
  };

  @Input() isCategories: boolean = false;
  @Input() isSubCategories: boolean = false;
  @Input() isRoles: boolean = false;
  @Input() isStatus: boolean = false;
  @Input() isSearch: boolean = false;
  @Input() isDelete: boolean = false;
  @Input() isDraft: boolean = false;

  @Input() searchPlaceholder: string = 'ابحث بأستخدام اسم الخبر...';

  @Input() customBtns: {
    content: string;
    onClick: () => void;
    bgColor: string;
  }[] = [];

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

  onPageChange(e: any) {
    if (e.target.classList.includes('next')) {
      this.pageNumber++;
    } else if (e.target.classList.includes('previous')) {
      this.pageNumber--;
    } else {
      this.pageNumber = e.target.value;
    }
    this.pageNumberEmitter.emit(this.pageNumber);
  }

  recevieFilterOption(data: {}) {
    this.filterOptionEmitter.emit(data);
  }
}
