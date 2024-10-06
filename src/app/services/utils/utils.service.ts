import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTimeFormatOptions } from '@eonasdan/tempus-dominus';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  scrollToFirstInvalidControl(selector: string) {
    const form = document.getElementById(selector);
    const firstInvalidControl = form?.getElementsByClassName('ng-invalid')[0];

    firstInvalidControl?.scrollIntoView({ behavior: 'smooth' });
    (firstInvalidControl as HTMLElement).focus();
  }

  toggleSelectAll(e: any, items: any[]) {
    if (e.target.checked) {
      return items.map((item) => item.id);
    } else {
      return [];
    }
  }

  fileValidator(maxSizeMB: number, allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;

      if (!file) {
        return null; // no file selected
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        return { maxSize: { requiredSize: maxSizeMB, actualSize: fileSizeMB } };
      }

      if (!allowedTypes.includes(file.type)) {
        return {
          allowedTypes: { requiredTypes: allowedTypes, actualType: file.type },
        };
      }

      return null;
    };
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
      return `منذ ${days} يوم`;
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

  convertDateToArabicFormat(dateString: string) {
    const date = new Date(dateString);

    const options: DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('ar-EG', options);
    const formattedDate = formatter.format(date);

    return formattedDate;
  }
}
