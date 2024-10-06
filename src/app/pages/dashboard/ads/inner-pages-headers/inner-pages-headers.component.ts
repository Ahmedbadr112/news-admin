import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AddADSServices } from 'src/app/services/dashboard/add-ads/add-ads.service';

@Component({
  selector: 'app-inner-pages-headers',
  templateUrl: './inner-pages-headers.component.html',
})
export class InnerPagesHeadersComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  addInnerPagesHeadersForm: FormGroup;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private addADSServices: AddADSServices
  ) {}

  ngOnInit(): void {
    this.initAddInnerPagesHeadersForm();
  }

  initAddInnerPagesHeadersForm() {
    this.addInnerPagesHeadersForm = this.fb.group({
      InnerPagesNews: ['', [Validators.required]],
    });
  }

  get f() {
    return this.addInnerPagesHeadersForm.controls;
  }

  addInnerPagesHeaders() {
    this.hasError = false;
    this.submitted = true;

    if (this.addInnerPagesHeadersForm.status === 'INVALID') {
      return;
    }

    const addInnerPagesHeadersSubscr = this.addADSServices
      .addInnerPageHeaders(this.f.InnerPagesHeaders.value)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data);
            this.addInnerPagesHeadersForm.reset();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[ADD_INNER_PAGES_HEADERS]', error);
          this.hasError = true;
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addInnerPagesHeadersSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
