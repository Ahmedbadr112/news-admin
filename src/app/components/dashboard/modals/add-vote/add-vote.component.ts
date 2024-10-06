import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/shared/modal/modal.component';
import { ModalConfig } from 'src/app/models/components.model';
import { Vote } from 'src/app/models/data.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { VoteService } from 'src/app/services/dashboard/vote/vote.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-add-vote',
  templateUrl: './add-vote.component.html',
})
export class AddVoteComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  voteForm: FormGroup;

  @ViewChild('modal') private modalComponent: ModalComponent;

  @Output() onAddVoteEmitter = new EventEmitter<Vote>();

  submitted: boolean = false;
  isLoading$: Observable<boolean>;

  categories: any[] = [];

  startDate: string;
  endDate: string;

  modalConfig: ModalConfig = {
    modalTitle: 'أضافة استطلاع رأي',
    dismissButtonLabel: 'حفظ',
    closeButtonLabel: 'اغلاق',
    customDismiss: () => {
      this.addVote();
    },
  };

  constructor(
    private fb: FormBuilder,
    private voteService: VoteService,
    private utilsService: UtilsService,
    private dashboardService: DashboardService,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.voteService.isLoading$;
    this.dashboardService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.voteForm.controls;
  }

  initForm() {
    this.voteForm = this.fb.group({
      sectionId: ['', [Validators.required]],
      pollBody: ['', [Validators.required]],
      voteOptions: this.fb.array([
        this.fb.control('', [Validators.required]),
        this.fb.control('', [Validators.required]),
      ]),
    });
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  get voteOptions(): FormArray {
    return this.voteForm.get('voteOptions') as FormArray;
  }

  toggleVoteOption(index?: number): void {
    if (index) {
      this.voteOptions.removeAt(index);
    } else {
      this.voteOptions.push(this.fb.control('', [Validators.required]));
    }
  }

  addVote() {
    this.submitted = true;

    if (this.voteForm.invalid) {
      this.utilsService.scrollToFirstInvalidControl('addVote');
      return;
    }

    const vote = {
      sectionId: this.f.sectionId.value,
      pollBody: this.f.pollBody.value,
      startDate: this.startDate,
      endDate: this.endDate,
      voteOptions: this.voteOptions.controls.map((control) => control.value),
    };

    const addVoteSubscr = this.voteService.addVote(vote).subscribe({
      next: (data: any) => {
        if (data) {
          this.toast.success(data.message);
          this.onAddVoteEmitter.emit(vote);
          this.modalComponent.close();
        } else {
          this.toast.error('يوجد خطأ ف البيانات');
        }
        this.submitted = false;
      },
      error: (error: any) => {
        console.log('[ADD_VOTE]', error);
        this.submitted = false;
      },
    });
    this.unsubscribe.push(addVoteSubscr);
  }

  receiver(recevier: string, data: any) {
    (this as any)[recevier] = data;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
