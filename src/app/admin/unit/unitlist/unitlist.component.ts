import { Component, OnInit, ViewChild } from "@angular/core";

import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-unitlist",
  templateUrl: "./unitlist.component.html",
  styleUrls: ["./unitlist.component.css"],
})
export class UnitlistComponent implements OnInit {
  unitList: any = [];
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
  isPrevious: boolean = true;
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];
  @ViewChild("deleteModal") deleteModal: any;

  searchText = "" as any;
  coursename = '' as any
  spinner: boolean = false
  spinnerLession: boolean = false
  courseArr = [] as any

  title = '' as any
  lessionArr = [] as any
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
    if (this.commonservice.getLimit()) {
      this.limit = this.commonservice.getLimit()
    }
    if (this.commonservice.getOffset()) {
      this.offset = this.commonservice.getOffset()
    }
    if (this.commonservice.getSearchText()) {
      this.searchText = this.commonservice.getSearchText()
    }
    if (this.commonservice.getCourseid()) {
      this.courseid = this.commonservice.getCourseid()
    }
    if (this.commonservice.getCourseName()) {
      this.coursename = this.commonservice.getCourseName()
    }
    if (this.commonservice.getLessonid()) {
      this.lessionid = this.commonservice.getLessonid()
    }
    if (this.commonservice.getLessonName()) {
      this.title = this.commonservice.getLessonName()
    }
    this.getUnits();
  }
  gotoAdd(): any {
    this.router.navigate(["admin/app/add-unit/0"]);
  }

  gotoEdit(id: any): any {
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.commonservice.setCourseid(this.courseid)
    this.commonservice.setCoursename(this.coursename)
    this.commonservice.setLessionid(this.lessionid)
    this.commonservice.setLessionname(this.title)
    this.router.navigate(["admin/app/add-unit/" + id]);
  }

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;


  getUnits(): any {
    const obj = {
      userId: this.commonservice.getUserId(),
      limit: this.limit,
      offset: this.offset,
      searchText: this.searchText,
      lessionid: this.lessionid,
      courseid: this.courseid
    };
    this.commonservice.loaderStart();
    this.restapi.getUnits(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          if (res.response !== null) {
            if (res.response.length > 0) {
              for (const obj of res.response) {
                obj.createdat = this.commonservice.formatDate(obj.createdat);

                const minutes = parseInt(obj.minute)
                const seconds = ((obj.minute - minutes) * 60).toFixed();
                obj.minute = minutes + ' minute ' + seconds + ' seconds';


              }
              this.unitList = res.response;
              this.nextBtnDesable = res.response.length < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else {
            this.unitList = [];
            this.nextBtnDesable = true;
          }

        } else {
          this.unitList = [];
        }
      },
      (err: any) => {
        this.notifierService.notify("error", err.error.message);
      }
    );
  }

  deleteUnit(): any {
    const obj = {
      userId: this.commonservice.getUserId(),
      id: this.unitid,
    };
    this.commonservice.loaderStart();
    this.restapi.deleteUnit(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.closeModal();
          this.getUnits();
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

  onClickDelete(id: any): any {
    this.unitid = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.unitid = "";
    this.modalService.dismissAll();
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getUnits();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getUnits();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getUnits();
  }


  onEnter() {
    this.getUnits();
  }

  searchCourseByName(): any {
    if (this.coursename.length % 3 === 0) {
      const data = {
        "userId": this.commonservice.getUserId(),
        "coursename": this.coursename
      }
      this.spinner = true
      this.restapi.searchCourseByName(data).subscribe((res: any) => {
        if (res.success) {
          this.courseArr = res.response
          this.spinner = false
        }
        else {
          this.courseArr = []
          this.spinner = false
        }
      });
    } 
  }

  getCourseIdByName(): any {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }
    this.getUnits()
  }

  searchLessionByName(): any {
    if (this.title.length  % 3 === 0) {
      const data = {
        "userId": this.commonservice.getUserId(),
        "title": this.title,
        "courseid": this.courseid
      }
      this.spinnerLession = true
      this.restapi.searchLessionByName(data).subscribe((res: any) => {
        if (res.success) {
          this.lessionArr = res.response
          this.spinnerLession = false
        }
        else {
          this.lessionArr = []
          this.spinnerLession = false
        }
      });
    } 
  }

  getLessionIdByName(): any {
    for (let data of this.lessionArr) {
      if (data.title === this.title) {
        this.lessionid = data.id
        break;
      }
    }
    this.getUnits()
  }


  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getUnits();
    }
    if (this.searchText.length == 0) {
      this.getUnits();
    }
  }

  onReset(): any {

    this.coursename = ''
    this.courseid = ''
    this.lessionid = ''
    this.title = ''
    this.getUnits()
  }
}
