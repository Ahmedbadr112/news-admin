export interface ListOptions {

  isEdit?: boolean;
  isEditWithModal?: boolean;
  isEnable?: boolean;
  isDelete?: boolean;
  isVersion?: boolean;
  isCheckList?: boolean;
  isResult?: boolean;
  isPreview?: boolean;
  isDate?: boolean;
  isViews?: boolean;
  isState?: boolean;
  isEmployee?: boolean;
  isCustom?: boolean;
  isEditor?: boolean;

  type?: string;

  edit?: (id:string) => void;
  enable?: (id: string) => void;
  delete?: (id: string) => void;
}

export interface Pagination {
  current: number;
  pages?: number[];
  count?: number;
}

export interface FilterOption {
  isRoles?: boolean;
  isCategories?: boolean;
  isOrderCategories?: boolean;
  isSubCategories?: boolean;
  isOrderSubCategories?: boolean;
  isStatus?: boolean;
  isType?: boolean;
  isGallery?: boolean;
  isGalleryType?: boolean;

  categoryId?: string;
  statusId?: string;
  roleId?: string;
  subCategoryId?: string;
  orderCategoryId?: string;
  orderSubCategoryId?: string;
  typeId?: string;
  galleryId?: string;
  galleryTypeId?: string;
}

export interface TableOption {
  isCheckbox?: boolean;

  headerCols?: { title: string; width: number }[];
  actions?: { title: string; click: (id: number) => void; icon: string }[];
}

export interface CustomButton {
  content: string;
  bgColor: string;

  click: () => void;
}

export type Image =
  | {
      icon: string;
      title: string;
      description: string;
    }
  | File
  | undefined;

export interface Draft {
  newAutoSaveId: number;
  title: string;
  secTitle: string;
  createdDate: string;
}

export interface Section {
  SecTitle: string;
  Hide: boolean;
  WeeklySection: boolean;
  Keywords: string;
  Description: string;
  SectionId: number | null;
}

export interface Category {
  Name: string;
  Hide: boolean;
  SeoTitle: string;
  SeoKeyWords: string;
  SeoDescription: string;
}

export interface ModalConfig {
  modalTitle: string;
  dismissButtonLabel?: string;
  closeButtonLabel?: string;
  shouldClose?(): Promise<boolean> | boolean;
  shouldDismiss?(): Promise<boolean> | boolean;
  onClose?(): Promise<boolean> | boolean;
  onDismiss?(): Promise<boolean> | boolean;
  disableCloseButton?(): boolean;
  disableDismissButton?(): boolean;
  hideCloseButton?(): boolean;
  hideDismissButton?: boolean;
  customDismiss?(): void;
}

export interface GalleryImage {
  date: string;
  icon: string;
  title: string;
  description: string;
  id: number;
}
