import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Draft, TableOption } from 'src/app/models/components.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
})
export class DraftsComponent implements OnDestroy, OnInit {
  private unsubscribe: Subscription[] = [];

  hasError: boolean = false;

  @Output() draftEmitter = new EventEmitter<any>();
  @Output() addDraftEmitter = new EventEmitter<any>();

  tableOptions: TableOption = {
    actions: [
      {
        title: 'أسترجاع',
        icon: 'arrows-loop',
        click: (id: number) => {
          this.restoreDraft(id);
        },
      },
    ],
  };

  drafts: any[] = [];

  constructor(
    private addNewService: AddNewService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDrafts();
    this.addDraftEmitter.emit(this.addDraft);
  }

  getDrafts() {
    this.hasError = false;
    const getDraftsSubscr = this.addNewService.getDrafts().subscribe({
      next: (data: Draft[]) => {
        if (data) {
          const items = data.map((item) => ({
            id: item.newAutoSaveId,
            title: item.title,
            category: item.secTitle,
            dateWithTime: item.createdDate,
          }));
          this.drafts = items;
          this.cdr.detectChanges();
        } else {
          this.drafts = [];
        }
      },
      error: (error: any) => {
        console.log('[DRAFTS]', error);
        this.hasError = true;
      },
    });
    this.unsubscribe.push(getDraftsSubscr);
  }

  deleteAllDrafts() {
    this.hasError = false;
    const getDraftsSubscr = this.addNewService.deleteAllDrafts().subscribe({
      next: (data: any) => {
        if (data) {
          this.toast.error(data.message);
          this.getDrafts();
        }
      },
      error: (error: any) => {
        console.log('[DELETE_DRAFTS]', error);
        this.hasError = true;
      },
    });
    this.unsubscribe.push(getDraftsSubscr);
  }

  restoreDraft(id: number) {
    this.hasError = false;
    const restoreDraftSubscr = this.addNewService.restoreDraft(id).subscribe({
      next: (data: any) => {
        if (data) {
          this.draftEmitter.emit(data);
          this.getDrafts();
        }
      },
      error: (error: any) => {
        console.log('[RESTORE_DRAFTS]', error);
        this.hasError = true;
      },
    });
    this.unsubscribe.push(restoreDraftSubscr);
  }

  addDraft(form: any, tags: string[], selectedImage: any, date: string) {
    this.hasError = false;
    const addDraftSubscr = this.addNewService
      .addDraft(form, tags, selectedImage, date)
      .subscribe({
        error: (error: any) => {
          console.log('[ADD_DRAFTS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(addDraftSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
