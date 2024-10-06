import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import Tagify from '@yaireo/tagify';

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrl: './tags-input.component.scss',
})
export class TagsInputComponent implements AfterViewInit {
  @Output() tagsEmitter = new EventEmitter<string[]>();
  ngAfterViewInit(): void {
    const tagifyInput = document.querySelector(
      '#kt_tagify_1'
    ) as HTMLInputElement;
    new Tagify(tagifyInput, {
      duplicates: false,
    });
  }

  onTagsChange(e: any) {
    this.tagsEmitter.emit(
      JSON.parse(e.target.value).map((tag: { value: string }) => tag.value)
    );
  }
}
