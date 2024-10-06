import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
})
export class DateTimePickerComponent {
  public selectedMoment = new Date();
  @Output() dateEmitter = new EventEmitter<string>();
  dateChange(e: any) {
    this.dateEmitter.emit(moment(e.value).format('YYYY-MM-DDTHH:mm:ss'));
  }
}
