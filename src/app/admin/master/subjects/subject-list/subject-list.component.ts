import { Component, OnInit, ViewChild } from "@angular/core";

import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { Router } from "@angular/router";
import { NgOption } from "@ng-select/ng-select";


@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  // 
  subjectId: any = '';
  parentId = "" as any;
  parentname: any = '';
  subjectName = "" as any;
  categoryId = "" as any;
  subjectList: any = [];
  parentSubjectArr: any = [];
  parentcategoryname: any;
  categoryArr: any = [];
  upDatebtnFlag: boolean = false;
  //
  index = 0
  categorySpinner: boolean = false
  spinner: boolean = false;
  userid = "" as any;
  courseid = "" as any;
  lessionid = "" as any;
  unittitle = "" as any;
  description = "" as any;
  videourl = "" as any;
  FILE_URL = "" as any;
  FILE_ROOT = this.restapi.FILE_URL;
  offset = 0;
  limit = 20;
  unitid: any = "";
  selectedVal: any = 20;
  subjectErr: any = "";
  parentErr: any = "";
  categoryErr: any = "";

  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];
  @ViewChild("deleteModal") deleteModal: any;
  @ViewChild("addmodal") addmodal: any

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

    this.getSubjectData();
  }

  goToPreview(): any {

  }


  gotoAdd(): any {
    this.subjectId = ''
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false })
  }

  gotoEdit(data: any): any {
    this.subjectId = data.Id;
    this.subjectName = data.Name;
    this.parentname = data.parentName;
    this.parentcategoryname = data.categoryName;
    this.parentId = data.ParentId;
    this.categoryId = data.CategoryId;
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
    this.modalService.dismissAll();
  }

  getSubjectData(): any {
    const obj = {
      offset: this.offset,
      limit: this.limit,
      searchText: this.searchText
    }
    this.commonservice.loaderStart();
    this.restapi.fetchSubject(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.subjectList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.subjectList = [];
      }
    }, (err: any) => {
    })


  }


  changeSubjectNameFun(): any {
    this.subjectErr = "";
  }


  addSubjectType(): any {

    this.subjectErr = "";
    this.parentErr = "";
    this.categoryErr = "";

    let err = 0


    if (this.subjectName == "" || this.subjectName == null) {
      this.subjectErr = "Subject name required";
      err++;
    }
    if (this.parentname == "" || this.parentname == null) {
      this.parentErr = "Parent subject name required";
      err++;
    }
    if (this.parentcategoryname == "" || this.parentcategoryname == null) {
      this.categoryErr = "Category type name required";
      err++;
    }

    if (err == 0) {

      const obj = {
        name: this.subjectName,
        parentId: this.parentId,
        categoryId: this.categoryId,
      }

      this.commonservice.loaderStart();
      this.restapi.insertSubject(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd()
        if (res.success) {
          this.closeAddModal();
          this.getSubjectData();
          this.resetForm();
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message);
      })

    }
  }


  updateSubject(): any {
    this.subjectErr = "";
    this.parentErr = "";
    this.categoryErr = "";

    let err = 0


    if (this.subjectName == "" || this.subjectName == null) {
      this.subjectErr = "Subject name required";
      err++;
    }
    if (this.parentname == "" || this.parentname == null) {
      this.parentErr = "Parent subject name required";
      err++;
    }
    if (this.parentcategoryname == "" || this.parentcategoryname == null) {
      this.categoryErr = "Category type name required";
      err++;
    }

    if (err == 0) {
      const obj = {
        id: this.subjectId,
        name: this.subjectName,
        parentId: this.parentId,
        categoryId: this.categoryId,
      }
      this.commonservice.loaderStart();
      this.restapi.updateSubject(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd()
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
          this.getSubjectData();
          this.closeAddModal();
        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message);
      })
    }
  }




  deleteSubject(): any {
    const obj = {
      id: this.subjectId,
    };
    this.commonservice.loaderStart();
    this.restapi.deleteSubject(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.closeModal();
          this.getSubjectData();
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      },
      (err: any) => {
        this.notifierService.notify("error", err.error.message);
      }
    );
  }

  resetForm(): any {
    this.subjectName = "";
    this.parentId = "";
    this.categoryId = "";
    this.parentname = "";
    this.parentcategoryname = "";
    this.subjectErr = "";
    this.parentErr = "";
    this.categoryErr = "";
  }







  onClickDelete(id: any): any {
    this.subjectId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.resetForm();
    this.unitid = "";
    this.modalService.dismissAll();

  }



  // subject

  searchparentSubjectName() {
    this.parentErr = "";
    const obj = {
      searchText: this.parentname
    }
    this.spinner = true;
    this.restapi.getSubjects(obj).subscribe((res: any) => {
      this.spinner = false;
      if (res.success) {
        this.parentSubjectArr = res.response
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    })
  }



  getparentSubjectId() {
    for (let obj of this.parentSubjectArr) {
      if (obj.name === this.parentname) {
        this.parentId = obj.id;
        break;
      }
    }
  }

  searchCategoryName() {
    this.categoryErr = "";
    const obj = {
      searchText: this.parentcategoryname,
      categoryTypeId: ""
    }
    this.spinner = true;
    this.restapi.getCategories(obj).subscribe((res: any) => {
      this.spinner = false;
      if (res.success) {
        this.categoryArr = res.response;
      }
      else {
        this.categoryArr = []
        this.spinner = false
      }
    }, (err: any) => {
      this.notifierService.notify('err', err.error.message)
    })

  }
  getparentCategoryIdByName() {
    for (let data of this.categoryArr) {
      if (data.name === this.parentcategoryname) {
        this.categoryId = data.categoriesid;
        break;
      }
    }
  }


  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getSubjectData();
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getSubjectData();
  }
  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getSubjectData();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  onEnter() {
    this.getSubjectData();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getSubjectData();
    }
    if (this.searchText.length == 0) {
      this.getSubjectData();
    }
  }



}
