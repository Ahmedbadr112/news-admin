import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';
import { ListOptions, Pagination } from 'src/app/models/components.model';
import { TagProfilesService } from 'src/app/services/dashboard/tag-profiles/tag-profile.service';

@Component({
  selector: 'app-tag-profiles',
  templateUrl: './tag-profiles.component.html',
})
export class TagProfilesComponent {
  private unsubscribe: Subscription[] = [];

  tags: any[] = [];
  search: string = '';
  pagination: Pagination = {
    current: 1,
  };

  groupListOptions: ListOptions = {};

  isLoading$: Observable<boolean>;

  constructor(
    private tagProfilesService: TagProfilesService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.tagProfilesService.isLoading$ = this.isLoading$;
  }

  ngOnInit(): void {
    this.getTagProfiles();
  }

  onSearch(e: any) {
    this.search = e.target.value;
    this.getTagProfiles(300, e.target.value);
  }

  getTagProfiles(delay = 0, search?: string) {
    const getNewsSubscr = this.tagProfilesService
      .getTagProfiles(this.pagination.current, search)
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.tags = data;
            this.cdr.detectChanges();
          } else {
            this.tags = [];
          }
        },
        error: (error: any) => {
          this.toast.error(error.error.message);
        },
      });
    this.unsubscribe.push(getNewsSubscr);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
