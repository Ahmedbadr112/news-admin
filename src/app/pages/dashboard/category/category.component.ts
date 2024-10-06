import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { FilterOption, ListOptions } from 'src/app/models/components.model';
import { CategoryService } from 'src/app/services/dashboard/category/category.service';
import { SectionsService } from 'src/app/services/dashboard/sections/sections.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  items: any[] = [];

  listOptions: ListOptions = {
    isCheckList: true,
    isEdit: true,
    edit: () => {},
  };

  selectedCategories: string[] = [];
  pageNumber: number = 1;

  isLoading$: Observable<boolean>;
  hasError: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.isLoading$ = this.categoryService.isLoading$;
  }

  toggleSelectAll(e: any) {
    this.selectedCategories = this.utilsService.toggleSelectAll(e, this.items);
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.hasError = false;

    const getAllCategoriesSubscr = this.categoryService
      .getAllCategories()
      .subscribe({
        next: (data: any[]) => {
          this.items = data.map((item) => ({ id: item.categoryID, ...item }));
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('[GET_ALL_SECTIONS]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(getAllCategoriesSubscr);
  }

  deleteCategories() {
    this.hasError = false;

    const deleteSectionsSubscr = this.categoryService
      .deleteCategories(this.selectedCategories)
      .subscribe({
        next: (data: string) => {
          if (data) {
            this.toast.error(data);
            this.selectedCategories = [];
            this.getAllCategories();
          } else {
            this.toast.error('لا يمكن حذف باب يوجد بداخله باب فرعي');
          }
        },
        error: (error: any) => {
          console.log('[DELETE]', error);
          this.hasError = true;
        },
      });
    this.unsubscribe.push(deleteSectionsSubscr);
  }

  recieveSelectedItems(data: string[]) {
    this.selectedCategories = data;
  }

  recieveIsNewCategoryAdded(data: boolean) {
    if (data) {
      this.getAllCategories();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
