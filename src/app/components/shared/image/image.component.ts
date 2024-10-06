import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Image } from 'src/app/models/data.model';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent implements OnChanges {
  filePreview: string | ArrayBuffer | null | undefined = null;
  @Input() selectedImage: any;

  @Output() selectedImageEmitter = new EventEmitter<Image | File | null>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.selectedImageEmitter.emit(input.files[0]);
      this.previewFile(this.selectedImage);
      this.cdr.detectChanges();
    }
  }

  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview = e.target?.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeSelectedImg() {
    this.selectedImage = null;
    this.selectedImageEmitter.emit(null);
    this.filePreview = null;
    this.cdr.detectChanges();
  }
}
