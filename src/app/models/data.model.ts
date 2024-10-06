export interface ContentType {
  typeId: string;
  contentType1: string;
}

export interface ContentTypeSetting {
  roleID: number;
  contentTypeID: number;
  keyID: number;
  value: boolean;
  valueMin: number;
  valueMax: number;
  keyName: string;
  contentType: string;
}

export interface SubCategory {
  sectionID: string;
  secTitle: string;
}

export interface Category {
  categoryID: string;
  name: string;
  hide: boolean;
}

export interface Album {
  galleryID: string;
  galleryTitle: string;
}

export interface ValidationRule {
  roleID: number;
  contentTypeID: number;
  keyID: number;
  value: boolean;
  valueMin: number;
  valueMax: number;
  keyName: string;
  contentType: string;
}

export interface RolePassList {
  id: string;
  name: string;
}

export interface Category {
  categoryID: string;
  name: string;
}

export interface OrderCategory {
  id: string;
  name: string;
}

export interface orderSubCategory {
  sectionID: string;
  secTitle: string;
}

export interface SubCategory {
  sectionID: string;
  secTitle: string;
}

export interface Role {
  roleId: string;
  roleName: string;
}

export interface Vote {
  sectionId: string;
  pollBody: string;
  voteOptions: string[];
  startDate: string;
  endDate: string;
  activated?: number;
  totalVotes?: number;
}

export interface Status {
  id: string;
  name: string;
}

export interface NewWithDate {
  date: string;
  news: [
    {
      id: number;
      title: string;
      category: string | null;
      active: boolean;
      time: string;
      date: string;
    }
  ];
  pageNumbers?: number;
}

export interface NEW {
  id: number;
  date: string;
  title: string;
  subTitle: string;
  state: string;
  views: number;
  employee: string;
}

export interface Editor {
  editorId: number;
  editorName: string;
  active: boolean;
}

export interface Image {
  id: string;
  picName: string;
  picPath: string;
  picCaption: string;
  addedDate: string;
  subCategoryId?: string;
  CHKWaterMark?: boolean;
}

export interface Section {
  sectionId: number;
  secTitle: string;
  hide: boolean;

  weeklySection: boolean;
  keywords: string;
  description: string;
  categoryId: number;
}
