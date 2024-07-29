import { Component, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NotifierService } from "angular-notifier";
import { CommonService } from "src/app/common.service";
import { RestApiService } from "src/app/rest-api.service";

@Component({
  selector: "app-grades",
  templateUrl: "./grades.component.html",
  styleUrls: ["./grades.component.css"],
})
export class GradesComponent {
  gradeId: any = "";
  gradename: any = "";
  gradeArr: any = [];
  score: any = "";
  gradePoint: any = "";
  categoryArr: any = [];
  categoryId: any = "";
  parentArr: any = [];
  parentcategoryname: any = "";
  searchText: any = "";
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
  gradeNameErr: any = '';
  scoreErr: any = '';
  gradePointErr: any = '';

  @ViewChild("deleteModal") deleteModal: any;
  @ViewChild("addmodal") addmodal: any;
  constructor(
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private restapi: RestApiService,
    private modalService: NgbModal
  ) { }
  ngOnInit(): void {
    this.getQualificationGrade();
  }

  gotoAdd() {
    this.gradeId = "";
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false });
  }

  gotoEdit(data: any) {
    this.gradename = data.Name;
    this.score = data.Score;
    this.gradePoint = data.ParentCategory;
    this.gradeId = data.Id
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.modalService.open(this.addmodal, {
      centered: true,
      size: "lg",
      backdrop: false,
    });
  }
  getQualificationGrade() {
    const obj = {
      userId: this.commonservice.getUserId(),
      offSet: this.offset,
      limit: this.limit,
      searchText: this.searchText
    };
    this.commonservice.loaderStart();
    this.restapi.fetchQualificationGrade(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          if (res.response) {
            if (res.response.length > 0) {
              this.gradeArr = res.response;
              this.nextBtnDesable = res.response.length < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else {
            this.nextBtnDesable = true;
          }
        } else {
          this.gradeArr = []
        }
      },
      (err: any) => { }
    );
  }



  changeGradeFun(): any {
    this.gradeNameErr = '';
  }

  changeScoreFun(): any {
    this.scoreErr = '';
  }

  changePoinFun(): any {
    this.gradePointErr = '';
  }


  addQaulificationgrade(): any {
    this.gradeNameErr = '';
    this.scoreErr = '';
    this.gradePointErr = ''

    let err = 0

    if (this.gradename == '' || this.gradename == null || this.gradename == undefined) {
      this.gradeNameErr = 'Grade name required';
      err++
    }
    if (this.score == '' || this.score == null || this.score == undefined) {
      this.scoreErr = 'Score required';
      err++
    }
    if (this.gradePoint == '' || this.gradePoint == null || this.gradePoint == undefined) {
      this.gradePointErr = 'Point  required';
      err++;
    }


    if (err == 0) {

      const obj = {
        userId: this.commonservice.getUserId(),
        name: this.gradename,
        score: this.score,
        parentCategory: this.gradePoint,
      };
      this.commonservice.loaderStart();
      this.restapi.addQualificationGrade(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.closeAddModal();
          this.getQualificationGrade();
          this.notifierService.notify("success", res.message);
          this.resetForm();

        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err) => {
        this.notifierService.notify("error", err.error.message);
      }
      );


    }


  }
  updateQualificationGrade(): any {
    this.gradeNameErr = '';
    this.scoreErr = '';
    this.gradePointErr = ''

    let err = 0

    if (this.gradename == '' || this.gradename == null || this.gradename == undefined) {
      this.gradeNameErr = 'Grade name required';
      err++
    }
    if (this.score == '' || this.score == null || this.score == undefined) {
      this.scoreErr = 'Score required';
      err++
    }
    if (this.gradePoint == '' || this.gradePoint == null || this.gradePoint == undefined) {
      this.gradePointErr = 'Point  required';
      err++;
    }


    if (err == 0) {
      const obj = {

        "userId": this.commonservice.getUserId(),
        "name": this.gradename,
        "score": this.score,
        "parentCategory": this.gradePoint,
        "id": this.gradeId
      }

      this.commonservice.loaderStart();
      this.restapi.updateQualificationGrade(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
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
          this.getQualificationGrade();
          this.closeAddModal();
        } else {
          this.notifierService.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifierService.notify('error', err.error.message);
      })
    }
  }

  closeAddModal() {
    this.resetForm();
    this.modalService.dismissAll();
  }

  deleteGrade() {
    const obj = {
      userId: this.commonservice.getUserId(),
      id: this.gradeId
    };
    this.commonservice.loaderStart();
    this.restapi.deleteQualificationGrade(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.limit = 20;
        this.offset = 0;
        this.closeModal();
        this.getQualificationGrade();
        this.notifierService.notify('success', res.message);
      } else {
        this.notifierService.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    })

  }
  onClickDelete(id: any): any {
    this.gradeId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.gradeId = "";
    this.modalService.dismissAll();
  }
  resetForm() {
    this.gradename = '';
    this.score = '';
    this.gradePoint = '';
    this.gradeNameErr = '';
    this.scoreErr = '';
    this.gradePointErr = ''
  }
  validationForm(): any {
    this.gradeNameErr = '';
    this.scoreErr = '';
    this.gradePointErr = ''
    if (this.gradename == '' || this.gradename == null || this.gradename == undefined) {
      this.gradeNameErr = '*Grade Name Required';
      return false;
    }
    if (this.score == '' || this.score == null || this.score == undefined) {
      this.scoreErr = '*Score Required';
      return false;
    }
    if (this.gradePoint == '' || this.gradePoint == null || this.gradePoint == undefined) {
      this.gradePointErr = '*Point  Required';
      return false;
    }
    return true;
  }
  // searchCategoryName() {
  //   const obj = {
  //     searchText: this.parentcategoryname,
  //   };
  //   this.spinner = true;
  //   this.restapi.getCategories(obj).subscribe(
  //     (res: any) => {
  //       this.spinner = false;
  //       if (res.success) {
  //         this.categoryArr = res.response;
  //       } else {
  //         this.categoryArr = [];
  //         this.spinner = false;
  //       }
  //     },
  //     (err: any) => {
  //       this.notifierService.notify("err", err.error.message);
  //     }
  //   );
  // }
  // getparentCategoryIdByName() {
  //   for (let data of this.categoryArr) {
  //     if (data.name === this.parentcategoryname) {
  //       this.categoryId = data.categoriesid;
  //       break;
  //     }
  //   }
  // }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getQualificationGrade();
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getQualificationGrade();
  }
  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getQualificationGrade();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  onEnter() {
    this.getQualificationGrade();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getQualificationGrade();
    }
    if (this.searchText.length == 0) {
      this.getQualificationGrade();
    }
  }

  goToPreview(): any {

  }
}
