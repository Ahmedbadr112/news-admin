import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig } from 'src/app/models/components.model';
import { VersionsService } from 'src/app/services/dashboard/versions/versions.service';
import moment from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-compare-versions',
  templateUrl: './compare-versions.component.html',
})
export class CompareVersionsComponent implements OnDestroy {
  private unsubscribe: Subscription[] = [];
  @ViewChild('modal') private modalComponent: ModalComponent;

  @Input() selectedItems: string[] = [];

  @Output() errorEmit = new EventEmitter<string>();

  hasError: boolean = false;
  isLoading$: Observable<boolean>;

  items: any[] = [];

  modalConfig: ModalConfig = {
    modalTitle: 'مقارنة اصدارين',
    hideDismissButton: true,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private versionService: VersionsService,
    private sanitizer: DomSanitizer
  ) {
    this.isLoading$ = this.versionService.isLoading$;
  }

  async openModal() {
    if (this.selectedItems.length < 2) {
      this.errorEmit.emit('يجب اختيار خبرين للمقارنة');
      return;
    }
    if (this.selectedItems.length > 2) {
      this.errorEmit.emit('يجب اختيار خبرين فقط للمقارنة');
      return;
    }
    this.compareNews();
    return await this.modalComponent.open();
  }

  compareNews() {
    const compareNewsSubscr = this.versionService
      .compareNews(this.selectedItems)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.items = data;
            this.cdr.detectChanges();
          } else {
            this.items = [];
          }
        },
        error: (error: any) => {
          console.log('[COMPARE_NEWS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(compareNewsSubscr);
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatDateString(dateString: string): string {
    const inputDate = moment(dateString, 'DD-MMM-YYYY hh:mm:ss A');
    const now = moment();

    const monthsDiff = now.diff(inputDate, 'months');
    const daysDiff = now.diff(inputDate, 'days');
    const hoursDiff = now.diff(inputDate, 'hours');
    const minutesDiff = now.diff(inputDate, 'minutes');

    let timeDiffString = '';

    if (monthsDiff > 0) {
      timeDiffString = `منذ ${monthsDiff > 2 ? monthsDiff : ''} ${
        monthsDiff > 1 ? (monthsDiff === 2 ? 'شهرين ' : 'شهور') : 'شهر'
      }`;
    } else if (daysDiff > 0) {
      timeDiffString = `منذ ${daysDiff} ${
        daysDiff > 1 ? (daysDiff === 2 ? 'ين' : 'ايام') : 'يوم'
      }`;
    } else if (hoursDiff > 0) {
      timeDiffString = `منذ ${hoursDiff} ساعة${hoursDiff > 1 ? 'ات' : ''}`;
    } else if (minutesDiff > 0) {
      timeDiffString = `منذ ${minutesDiff} دقيقة${minutesDiff > 1 ? '' : ''}`;
    } else {
      timeDiffString = 'منذ لحظات';
    }

    const formattedTime = inputDate
      .format('hh:mm A')
      .replace('AM', 'ص')
      .replace('PM', 'م');

    const result = `${timeDiffString} الساعة ${formattedTime}`;
    return result;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
