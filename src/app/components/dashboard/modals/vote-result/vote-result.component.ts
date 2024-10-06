import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
  selector: 'app-vote-result',
  templateUrl: './vote-result.component.html',
})
export class VoteResultComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  @Input() votes: number = 0;
  @ViewChild('modal') private modalComponent: ModalComponent;

  result: any;

  isLoading$: Observable<boolean>;

  modalConfig: ModalConfig = {
    modalTitle: 'نتيجة استطلاع رأي',
    closeButtonLabel: 'اغلاق',
    hideDismissButton: true,
  };

  constructor(private voteService: VoteService, private toast: ToastrService) {
    this.isLoading$ = this.voteService.isLoading$;
  }

  ngOnInit(): void {
    // this.getVoteResult();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  // getVoteResult() {
  //   const addVoteSubscr = this.voteService.getVoteResult().subscribe({
  //     next: (data: any) => {
  //       if (data) {
  //         this.result = data;
  //       } else {
  //         this.toast.error('يوجد خطأ ف البيانات');
  //       }
  //     },
  //     error: (error: any) => {
  //       console.log('[VOTE_RESULT]', error);
  //     },
  //   });
  //   this.unsubscribe.push(addVoteSubscr);
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
