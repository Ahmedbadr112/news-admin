import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EventObj } from '@tinymce/tinymce-angular/editor/Events';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tiny-mce-editor',
  templateUrl: './tiny-mce-editor.component.html',
})
export class TinyMCEEditorComponent {
  @Output() story: HTMLBodyElement;

  getTinyMCEContent(e: EventObj<any>) {
    console.log(e);
  }
}
