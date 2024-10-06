import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AddADSServices } from 'src/app/services/dashboard/add-ads/add-ads.service';

@Component({
  selector: 'app-general-headers',
  templateUrl: './general-headers.component.html',
})
export class GeneralHeadersComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  addGeneralHeadersForm: FormGroup;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private addADSServices: AddADSServices
  ) {}

  ngOnInit(): void {
    this.initAddGeneralHeadersForm();
  }

  initAddGeneralHeadersForm() {
    this.addGeneralHeadersForm = this.fb.group({
      GeneralNews: ['', [Validators.required]],
    });
  }

  get f() {
    return this.addGeneralHeadersForm.controls;
  }

  addGeneralHeaders() {
    this.hasError = false;
    this.submitted = true;

    if (this.addGeneralHeadersForm.status === 'INVALID') {
      return;
    }

    const addGeneralHeadersSubscr = this.addADSServices
      .addGeneralHeaders(this.f.GeneralHeaders.value)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data);
            this.addGeneralHeadersForm.reset();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[ADD_GENERAL_HEADERS]', error);
          this.hasError = true;
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addGeneralHeadersSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
