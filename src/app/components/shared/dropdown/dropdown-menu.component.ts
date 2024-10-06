import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { FilterOption } from 'src/app/models/components.model';
import {
  Category,
  ContentType,
  OrderCategory,
  orderSubCategory,
  Role,
  RolePassList,
  Status,
  SubCategory,
} from 'src/app/models/data.model';
import { AddNewService } from 'src/app/services/dashboard/add-new/add-new.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { PublishService } from 'src/app/services/dashboard/publish/publish.service';
import { LayoutService } from 'src/app/services/layout/layout.service';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  filterForm: FormGroup;

  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @Output() filterOptionsEmitter = new EventEmitter<FilterOption>();

  @Input() filterOptions: FilterOption;

  rolesPassList: RolePassList[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  orderCategories: OrderCategory[] = [];
  orderSubCategories: orderSubCategory[] = [];
  roles: Role[] = [];
  galleries: any[] = [];
  galleryTypes: any[] = [];
  contentTypes: ContentType[] = [];

  isError: boolean = false;

  constructor(
    private publishService: PublishService,
    private dashboardService: DashboardService,
    private addNewService: AddNewService,
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.filterOptions.isRoles) {
      this.publishService.rolePassList$.subscribe((rolesPassList) => {
        this.rolesPassList = rolesPassList;
      });
    }

    if (this.filterOptions.isCategories) {
      this.dashboardService.categories$.subscribe((categories) => {
        this.categories = categories;
      });
    }

    if (this.filterOptions.isOrderCategories) {
      this.getNewsOrderCategories();
    }

    if (this.filterOptions.isStatus) {
      this.layoutService.newsStatusCount$.subscribe((status) => {
        this.roles = status;
      });
    }

    if (this.filterOptions.isGalleryType) {
      this.dashboardService.galleryTypes$.subscribe((types) => {
        this.galleryTypes = types;
      });
    }

    this.dashboardService.contentTypes$.subscribe((conetntTypes) => {
      this.contentTypes = conetntTypes;
    });

    this.initForm();
  }

  get f() {
    return this.filterForm.controls;
  }

  initForm() {
    this.filterForm = this.fb.group({
      roleId: [''],
      categoryId: [''],
      orderCategoryId: [''],
      subCategoryId: [{ value: '', disabled: this.subCategories.length }],
      orderSubCategoryId: [''],
      statusId: [''],
      galleryId: [{ value: '', disabled: true }],
      galleryTypeId: [''],
      typeId: [''],
    });
  }

  getNewsOrderCategories(): void {
    this.isError = false;
    const getNewsOrderCategoriesSubscr = this.dashboardService
      .getNewsOrderCategories()
      .subscribe({
        next: (data: OrderCategory[]) => {
          this.orderCategories = data;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('ORDER_CATEGORIES', error);
          this.isError = true;
        },
      });
    this.unsubscribe.push(getNewsOrderCategoriesSubscr);
  }

  onSelectedNewsOrderCategoriesChange(e: any) {
    this.isError = false;

    const getNewsSubCategoriesSubscr = this.dashboardService
      .getNewsOrderSubCategories(e.target.value)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: orderSubCategory[]) => {
          this.orderSubCategories = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('NEWS_SUB_CATEGORIES', err);
          this.isError = true;
        },
      });
    this.unsubscribe.push(getNewsSubCategoriesSubscr);
  }

  onSelectedNewsCategoriesChange(e: any) {
    this.isError = false;

    const getNewsSubCategoriesSubscr = this.dashboardService
      .getNewsSubCategories(e.target.value)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: SubCategory[]) => {
          this.subCategories = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('NEWS_SUB_CATEGORIES', err);
          this.isError = true;
        },
      });
    this.unsubscribe.push(getNewsSubCategoriesSubscr);
  }

  onGalleryTypeChange(e: any) {
    this.isError = false;

    const getGalleriesSubscr = this.addNewService
      .getGalleryByType(e.target.value)
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (data: any[]) => {
          this.galleries = data;
          this.filterForm.controls.galleryId.enable();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('GET_GALLERIES', err);
          this.isError = true;
        },
      });
    this.unsubscribe.push(getGalleriesSubscr);
  }

  getGalleries() {
    this.isError = false;

    const getGalleriesSubscr = this.addNewService
      .getGalleries()
      .pipe()
      .subscribe({
        next: (data: any[]) => {
          this.galleries = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('GET_GALLERIES', err);
          this.isError = true;
        },
      });
    this.unsubscribe.push(getGalleriesSubscr);
  }

  onFilter() {
    this.filterOptionsEmitter.emit({
      ...this.filterOptions,
      categoryId: this.f.categoryId.value,
      statusId: this.f.statusId.value,
      roleId: this.f.roleId.value,
      subCategoryId: this.f.subCategoryId.value,
      orderCategoryId: this.f.orderCategoryId.value,
      orderSubCategoryId: this.f.orderSubCategoryId.value,
      galleryId: this.f.galleryId.value,
      galleryTypeId: this.f.galleryTypeId.value,
      typeId: this.f.typeId.value,
    });
  }

  reset() {
    this.filterOptionsEmitter.emit({
      ...this.filterOptions,
      categoryId: '',
      statusId: '',
      roleId: '',
      subCategoryId: '',
      orderCategoryId: '',
      orderSubCategoryId: '',
      galleryId: '',
      galleryTypeId: '',
      typeId: '',
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
