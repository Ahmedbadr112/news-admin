import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AddADSServices } from 'src/app/services/dashboard/add-ads/add-ads.service';

@Component({
  selector: 'app-ads-text-file-code',
  templateUrl: './ads-text-file-code.component.html',
})
export class AdsTextFileCodeComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  addAdsTextFileCodeForm: FormGroup;

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
    this.addAdsTextFileCodeForm = this.fb.group({
      AdsTextFileCode: ['', [Validators.required]],
    });
  }

  get f() {
    return this.addAdsTextFileCodeForm.controls;
  }

  addAdsTextFileCode() {
    this.hasError = false;
    this.submitted = true;

    if (this.addAdsTextFileCodeForm.status === 'INVALID') {
      return;
    }

    const addAdsTextFileCodeSubscr = this.addADSServices
      .addAdsTextFileCode(this.f.AdsTextFileCode.value)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.toast.success(data);
            this.addAdsTextFileCodeForm.reset();
            this.submitted = false;
          }
        },
        error: (error: any) => {
          console.log('[ADD_Ads_Text_File_Code]', error);
          this.hasError = true;
          this.submitted = false;
        },
      });
    this.unsubscribe.push(addAdsTextFileCodeSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
