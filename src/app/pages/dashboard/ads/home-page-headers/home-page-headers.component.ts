import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AddADSServices } from 'src/app/services/dashboard/add-ads/add-ads.service';

@Component({
  selector: 'app-home-page-headers',
  templateUrl: './home-page-headers.component.html',
})
export class HomePageHeadersComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  addHomePageHeadersForm: FormGroup;

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
    this.addHomePageHeadersForm = this.fb.group({
      HomePageHeaders: ['', [Validators.required]],
    });
  }

  get f() {
    return this.addHomePageHeadersForm.controls;
  }

  addGeneralHeaders() {
    this.hasError = false;
    this.submitted = true;

    if (this.addHomePageHeadersForm.status === 'INVALID') {
      return;
    }

    const addHomePageHeadersSubscr = this.addADSServices
      .addHomePageHeaders(this.f.HomePageHeaders.value)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data);
            this.addHomePageHeadersForm.reset();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[ADD_HOME_PAGE_HEADERS]', error);
          this.hasError = true;
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addHomePageHeadersSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
