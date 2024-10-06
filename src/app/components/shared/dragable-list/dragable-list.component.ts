import { Component, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-dragable-list',
  templateUrl: './dragable-list.component.html',
  styleUrl: './dragable-list.component.scss',
})
export class DragableListComponent {
  @Input() items: any[];
  @Input() isLoading: boolean | null;
  colors = ['primary', 'dark'];

  constructor(private utilsService: UtilsService) {}

  timeSince(date: string) {
    return this.utilsService.timeSinceInArabic(date);
  }
}
