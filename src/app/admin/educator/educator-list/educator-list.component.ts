import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RestApiService } from "src/app/rest-api.service";
import {
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-educator-list",
  templateUrl: "./educator-list.component.html",
  styleUrls: ["./educator-list.component.css"],
})
export class EducatorListComponent implements OnInit {
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  offset = 0;
  limit = 20;
  educatorsList: any = [];
  educatorid = "";
  searchText = '' as any

  isActive = 0;
  isPrevious: boolean = true;
  selectedVal: any = 10;
  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];
  @ViewChild("deleteModal") deleteModal: any;
  constructor(
    private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal
  ) { }

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
    this.getEducator();
  }

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  getEducator(): any {
    let obj = {
      offset: this.offset + "",
      limit: this.limit,
      searchText: this.searchText,
    };
    this.commonservice.loaderStart();
    this.restapi.getEducator(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          if (res.response) {
            if (res.response.length > 0) {
              this.educatorsList = res.response;
              this.nextBtnDesable = this.educatorsList < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else {
            this.nextBtnDesable = true;
          }
        } else {
          this.educatorsList = [];
        }
      },
      (err: any) => {
        this.notifierService.notify("error", err.error.message);
      }
    );
  }

  gotoAdd(): any {
    this.router.navigate(["admin/app/add-educator/0"]);
  }

  gotoEdit(id: any): any {
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.router.navigate(["admin/app/add-educator/" + id]);
  }

  deleteEducator(): any {
    let params = {
      userId: this.commonservice.getUserId(),
      educatorid: this.educatorid,
    };
    this.commonservice.loaderStart();
    this.restapi.deleteEducator(params).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.notifierService.notify("success", res.message);
          this.closeModal();
          this.getEducator();
        } else {
          this.notifierService.notify("error", res.message);
        }
      },
      (err: any) => {
        this.commonservice.loaderEnd();
        this.notifierService.notify("error", err.error.message);
      }
    );
  }

  onClickDelete(id: any): any {
    this.educatorid = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.educatorid = "";
    this.modalService.dismissAll();
  }

  enableActive(e: any): any {
    const checked = e.target.checked == 0 ? 0 : 1;
    const checkedValue = e.target.value;
    var data = {
      educatorid: checkedValue,
      active: checked,
    };
    this.commonservice.loaderStart();
    this.restapi.enableActive(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify("success", res.message);
        this.getEducator();
      } else {
        this.notifierService.notify("error", res.message);
      }
    });
  }

  approve(e: any): any {
    const checked = e.target.checked == 0 ? 0 : 1;
    const checkedValue = e.target.value;

    let params = {
      educatorid: checkedValue,
      approvedby: Number(this.commonservice.getUserId()),
      approved: checked,
    };
    this.commonservice.loaderStart();
    this.restapi.enableApprove(params).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.getEducator();
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      },
      (err: any) => {
        this.commonservice.loaderEnd();
        this.notifierService.notify("error", err.error.message);
      }
    );
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getEducator();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getEducator();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getEducator();
  }

  onEnter() {
    this.getEducator();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getEducator();
    }
    if (this.searchText.length == 0) {
      this.getEducator();
    }
  }
}
