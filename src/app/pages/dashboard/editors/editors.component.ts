import { Editor } from './../../../models/data.model';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import { ListOptions } from 'src/app/models/components.model';
import { EditorsService } from 'src/app/services/dashboard/editors/editors.service';

@Component({
  selector: 'app-editors',
  templateUrl: './editors.component.html',
})
export class EditorsComponent implements OnDestroy, OnInit {
  private unsubscribe: Subscription[] = [];

  items: any[] = [];
  search = '';
  pageNumber: number = 1;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;

  listOptions: ListOptions = {
    isEdit: true,
    isEnable: true,
    isDelete: true, 
    isEditor:true,
    enable: (editorId: string) => {
      this.onEnable(editorId);
    },
  };

  constructor(
    private editorsService: EditorsService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.editorsService.isLoading$;
  }

  ngOnInit(): void {
    this.getAllEditors();
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getAllEditors(300, this.pageNumber, this.search);
  }

  getAllEditors(delay: number = 0, pageNumber?: number, search?: string) {
    this.hasError = false;
    const getAllEditorsSubscr = this.editorsService
      .getAllEditors(pageNumber, search)
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: any[]) => {
          if (data) {
            const items = data.map((item) => ({
              name: item.editorName,
              ...item,
            }));
            this.items = items;
            this.cdr.detectChanges();
          } else {
            this.items = [];
          }
        },
        error: (error: any) => {
          console.log('[GET_ALL_EDITORS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getAllEditorsSubscr);
  }
 

  onEnable(editorId: string) {
    this.hasError = false;
    const toggleEnableEditorSubscr = this.editorsService
      .toggleEnableEditor(editorId)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data.message);
          }
        },
        error: (error: any) => {
          console.log('[TOGGLE_ENABLE_EDITOR]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(toggleEnableEditorSubscr);
  }
  
  recievePageNumber(data: number) {
    this.pageNumber = data;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
