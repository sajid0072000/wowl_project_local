import { Component, OnInit, ViewChild } from "@angular/core";

import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { Router } from "@angular/router";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: "app-categories-list",
  templateUrl: "./categories-list.component.html",
  styleUrls: ["./categories-list.component.css"],
})
export class CategoriesListComponent implements OnInit {
  public Editor = ClassicEditor;

  name: any = ""
  description: any = ""
  islive: boolean = false
  categoryTypeId: any = ''

  nameErr: any = ""
  descriptionErr: any = ""
  categoryTypeIdErr: any = ''


  categoriesId: any = ''
  categoryTypeName: any = ''


  categoryName = "" as any;
  categoryArr: any = [];
  categoryId: any = "";

  categoryList: any = [];
  parentcategoryname: any = "";
  parentcategoryId: any = "";
  categoryType = "" as any;
  categoryTypeArr: any = [];


  spinner: boolean = false;
  spinnerType: boolean = false;
  userid = "" as any;
  FILE_URL = "" as any;
  FILE_ROOT = this.restapi.FILE_URL;
  offset = 0;
  limit = 20;
  unitid: any = "";
  isPrevious: boolean = true;
  selectedVal: any = 10;


  sequence: any = ''
  sequenceErr: any = ''


  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];
  @ViewChild("deleteModal") deleteModal: any;
  @ViewChild("addmodal") addmodal: any;

  searchText = "" as any;

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  constructor(
    private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal
  ) {
    this.FILE_URL = this.restapi.FILE_URL;
  }

  ngOnInit(): void {
    this.getCategoryData();
  }

  gotoAdd(): any {
    this.categoriesId = "";
    this.modalService.open(this.addmodal, {
      centered: true,
      size: "lg",
      backdrop: false,
    });
  }

  gotoEdit(data: any): any {
    this.name = data.categoriesName
    this.description = data.description
    this.islive = data.islive === 0 ? false : true
    this.categoriesId = data.categoriesId
    this.categoryTypeId = data.categoryTypeId
    this.categoryTypeName = data.categoryTypeName
    this.sequence = data.Sequence
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.modalService.open(this.addmodal, {
      centered: true,
      size: "lg",
      backdrop: false,
    });
  }

  closeAddModal() {
    this.resetForm();
    this.modalService.dismissAll();
  }

  getCategoryData(): any {
    const obj = {
      userId: this.commonservice.getUserId(),
      offset: this.offset,
      limit: this.limit,
      searchText: this.searchText,
      categoryTypeId: this.categoryTypeId
    };
    this.commonservice.loaderStart();
    this.restapi.fetchCategories(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          if (res.response) {
            if (res.response.length > 0) {
              this.categoryList = res.response;
              this.nextBtnDesable = res.response.length < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else {
            this.nextBtnDesable = true;
          }
        } else {
          this.categoryList = [];
        }
      },
      (err: any) => { }
    );
  }

  changeName(): any {
    this.nameErr = "";
  }

  changeSequence(): any {
    this.sequenceErr = "";
  }

  changeDescription(): any {
    this.descriptionErr = "";
  }



  addCategory(): any {

    this.nameErr = ""
    this.descriptionErr = ""
    this.categoryTypeIdErr = ''

    let err = 0

    if (
      this.name == "" ||
      this.name == null ||
      this.name == undefined
    ) {
      this.nameErr = "Name required";
      err++;
    }
    if (
      this.description == "" ||
      this.description == null ||
      this.description == undefined
    ) {
      this.descriptionErr = "Description required";
      err++;
    }
    if (
      this.categoryTypeId == "" ||
      this.categoryTypeId == null ||
      this.categoryTypeId == undefined
    ) {
      this.categoryTypeIdErr = "Category type required";
      err++;
    }

    if (
      this.sequence == "" ||
      this.sequence == null ||
      this.sequence == undefined
    ) {
      this.sequenceErr = "Sequence required";
      err++;
    }

    if (err == 0) {
      const obj = {
        userId: this.commonservice.getUserId(),
        name: this.name,
        description: this.description,
        islive: this.islive === false ? '0' : '1',
        sequence: this.sequence,
        categoryTypeId: this.categoryTypeId,
      };
      this.commonservice.loaderStart();
      this.restapi.insertCategories(obj).subscribe(
        (res: any) => {
          this.commonservice.loaderEnd();
          if (res.success) {
            this.closeAddModal();
            this.getCategoryData();
            this.resetForm();
            this.notifierService.notify("success", res.message);
          } else {
            this.notifierService.notify("error", res.message);
          }
        },
        (err) => {
          this.notifierService.notify("error", err.error.message);
        }
      );


    }




  }
  updateCategory(): any {
    this.nameErr = ""
    this.descriptionErr = ""
    this.categoryTypeIdErr = ''

    let err = 0

    if (
      this.name == "" ||
      this.name == null ||
      this.name == undefined
    ) {
      this.nameErr = "Name required";
      err++;
    }
    if (
      this.description == "" ||
      this.description == null ||
      this.description == undefined
    ) {
      this.descriptionErr = "Description required";
      err++;
    }
    if (
      this.categoryTypeId == "" ||
      this.categoryTypeId == null ||
      this.categoryTypeId == undefined
    ) {
      this.categoryTypeIdErr = "Category type required";
      err++;
    }

    if (
      this.sequence == "" ||
      this.sequence == null ||
      this.sequence == undefined
    ) {
      this.sequenceErr = "Sequence required";
      err++;
    }

    if (err == 0) {
      const obj = {
        categoriesId: this.categoriesId,
        userId: this.commonservice.getUserId(),
        name: this.name,
        description: this.description,
        islive: this.islive === false ? '0' : '1',
        sequence: this.sequence,
        categoryTypeId: this.categoryTypeId,
      };
      this.commonservice.loaderStart();
      this.restapi.updateCategories(obj).subscribe(
        (res: any) => {
          this.commonservice.loaderEnd();
          if (res.success) {
            this.notifierService.notify("success", res.message);
            this.resetForm();
            if (this.commonservice.getLimit()) {
              this.limit = this.commonservice.getLimit()
            }
            if (this.commonservice.getOffset()) {
              this.offset = this.commonservice.getOffset()
            }
            if (this.commonservice.getSearchText()) {
              this.searchText = this.commonservice.getSearchText()
            }
            this.getCategoryData();
            this.closeAddModal();
          } else {
            this.notifierService.notify("error", res.message);
          }
        },
        (err: any) => {
          this.notifierService.notify("error", err.error.message);
        }
      );
    }
  }

  deleteCategory(): any {
    const obj = {
      userId: this.commonservice.getUserId(),
      categoriesId: this.categoriesId,
    };
    this.commonservice.loaderStart();
    this.restapi.deleteCategories(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.closeModal();
          this.getCategoryData();
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      },
      (err: any) => {
        this.notifierService.notify("error", err.message);
      }
    );
  }

  onClickDelete(id: any): any {
    this.categoriesId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.categoriesId = ''
    this.modalService.dismissAll();
  }

  searchCategoryName() {
    this.categoryTypeIdErr = "";
    const obj = {
      searchText: this.categoryTypeName
    };
    this.spinner = true;
    this.restapi.searchCategoryType(obj).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.success) {
          this.categoryTypeArr = res.response;
        } else {
          this.categoryTypeArr = [];
          this.spinner = false;
        }
      },
      (err: any) => {
        this.notifierService.notify("err", err.error.message);
      }
    );
  }
  getCategoryTypeIdByName() {
    for (let data of this.categoryTypeArr) {
      if (data.name === this.categoryTypeName) {
        this.categoryTypeId = data.categoryTypeId;
        break;
      }
    }
  }


  resetForm() {
    this.nameErr = ""
    this.descriptionErr = ""
    this.categoryTypeIdErr = ''
    this.name = ""
    this.description = ""
    this.islive = false
    this.categoryTypeId = ''
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getCategoryData();
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getCategoryData();
  }
  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getCategoryData();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  onEnter() {
    this.getCategoryData();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getCategoryData();
    }
    if (this.searchText.length == 0) {
      this.getCategoryData();
    }
  }

}
