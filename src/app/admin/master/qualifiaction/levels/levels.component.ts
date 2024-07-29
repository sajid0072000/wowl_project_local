import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

  levelname: any = '';
  levelArr: any = [];
  levelId: any = '';
  score: any = '';
  categoryArr: any = [];
  categoryId: any = '';
  levelErr: any = '';
  parentcategoryname: any = '';
  searchText: any = '';
  offset = 0;
  limit = 20;
  isActive = 0;
  isPrevious: boolean = true;
  selectedVal: any = 20;
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];
  spinner: boolean = false;

  levelNameErr: any = ''
  parentcategorynameErr: any = ''

  @ViewChild("deleteModal") deleteModal: any;
  @ViewChild("addmodal") addmodal: any;
  constructor(private commonservice: CommonService,
    private notifierService: NotifierService,
    private restapi: RestApiService,
    private modalService: NgbModal

  ) { }
  ngOnInit(): void {
    this.getQualificationLevel();
  }


  gotoAdd() {
    this.levelId = '';
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false });
  }

  gotoEdit(data: any) {
    console.log(data);
    this.levelId = data.Id;
    this.levelname = data.Name;
    this.parentcategoryname = data.categoryname;
    this.categoryId = data.parentCategory
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.modalService.open(this.addmodal, {
      centered: true,
      size: "lg",
      backdrop: false,
    });

  }
  getQualificationLevel(): any {
    const obj = {
      userId: this.commonservice.getUserId(),
      offset: this.offset,
      limit: this.limit,
      searchText: this.searchText
    }
    this.commonservice.loaderStart();
    this.restapi.fetchQualificationLevel(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.levelArr = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.levelArr = [];
      }
    }, (err: any) => { })
  }

  changeLevelFun(): any {
    this.levelNameErr = ''
  }




  addQualificationlevel(): any {
    this.levelNameErr = ''
    this.parentcategorynameErr = ''

    let err = 0

    if (this.levelname == '' || this.levelname == null || this.levelname == undefined) {
      this.levelNameErr = 'Level Name Required';
      err++;
    }

    if (this.categoryId == '' || this.categoryId == null || this.categoryId == undefined) {
      this.parentcategorynameErr = 'Category name Required';
      err++;
    }

    if (err == 0) {

      const obj = {
        userId: this.commonservice.getUserId(),
        name: this.levelname,
        parentCategory: this.categoryId
      }
      this.commonservice.loaderStart();
      this.restapi.addQualificationLevel(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.closeAddModal();
          this.getQualificationLevel();
          this.resetform();
          this.notifierService.notify("success", res.message);

        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err) => {
        this.notifierService.notify("error", err.error.message);
      }
      );

    }


  }

  updateualificationlevel(): any {
    this.levelNameErr = ''
    this.parentcategorynameErr = ''

    let err = 0

    if (this.levelname == '' || this.levelname == null || this.levelname == undefined) {
      this.levelNameErr = 'Level Name Required';
      err++;
    }

    if (this.categoryId == '' || this.categoryId == null || this.categoryId == undefined) {
      this.parentcategorynameErr = 'Category name Required';
      err++;
    }

    if (err == 0) {
      const obj = {
        userId: this.commonservice.getUserId(),
        name: this.levelname,
        parentCategory: this.categoryId,
        id: this.levelId
      }
      this.commonservice.loaderStart();
      this.restapi.updateQualificationLevel(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetform();
          if (this.commonservice.getLimit()) {
            this.limit = this.commonservice.getLimit()
          }
          if (this.commonservice.getOffset()) {
            this.offset = this.commonservice.getOffset()
          }
          if (this.commonservice.getSearchText()) {
            this.searchText = this.commonservice.getSearchText()
          }
          this.getQualificationLevel();
          this.closeAddModal();
        } else {
          this.notifierService.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifierService.notify('error', err.error.message);
      })
    }
  }

  deleteQualificationLevel() {
    const obj = {
      userId: this.commonservice.getUserId(),
      id: this.levelId
    }
    this.commonservice.loaderStart();
    this.restapi.deleteQualificationLevel(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.limit = 20;
        this.offset = 0;
        this.closeModal();
        this.getQualificationLevel();
        this.notifierService.notify('success', res.message);
      } else {
        this.notifierService.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    })
  }

  validationForm(): any {
    this.levelErr = '';
    if (this.levelname == '' || this.levelname == null || this.levelname == undefined) {
      this.levelErr = '*Level Name Required';
      return false;
    }
    return true;
  }

  resetform() {
    this.levelname = '';
    this.parentcategoryname = '';
    this.levelErr = '';
  }

  closeAddModal() {
    this.resetform();
    this.modalService.dismissAll();
  }


  onClickDelete(id: any): any {
    this.levelId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    // this.educatorid = "";
    this.modalService.dismissAll();
  }

  searchCategoryName() {
    this.parentcategorynameErr = ''
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
    this.getQualificationLevel();
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getQualificationLevel();
  }
  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getQualificationLevel();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  onEnter() {
    this.getQualificationLevel();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getQualificationLevel();
    }
    if (this.searchText.length == 0) {
      this.getQualificationLevel();
    }
  }

  goToPreview(): any {

  }
}
