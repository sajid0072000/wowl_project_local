import { Component, OnInit, ViewChild } from "@angular/core";

import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-institue-list',
  templateUrl: './institue-list.component.html',
  styleUrls: ['./institue-list.component.css']
})
export class InstitueListComponent implements OnInit {
  name = "" as any;
  institueList = "" as any
  institueId = "" as any




  offset = 0;
  limit = 20;
  unitid: any = "";
  selectedVal: any = 10;
  instituetErr = "" as any


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
  previousBtnDesable: boolean = false;
  nextBtnDesable: boolean = false;
  constructor(
    private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal

  ) {

  }

  ngOnInit(): void {
    this.getInstitueData();
  }

  goToPreview(): any {

  }



  gotoAdd(): any {
    this.institueId = ""
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false })
  }

  gotoEdit(data: any): any {
    this.institueId = data.Id;
    this.name = data.Name;
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false })
  }

  closeAddModal() {
    this.modalService.dismissAll();
  }

  getInstitueData(): any {
    const obj = {
      userId: this.commonservice.getUserId(),
      offset: this.offset,
      limit: this.limit,
      searchText: this.searchText
    }
    this.commonservice.loaderStart();
    this.restapi.fetchInstitue(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.institueList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.institueList = [];
      }
    }, (err: any) => {
    })
  }

  changeInstituteName(): any {
    this.instituetErr = ""
  }

  addInstitueName(): any {
    this.instituetErr = ""

    let err = 0

    if (this.name == "" || this.name == null || this.name == undefined) {
      this.instituetErr = "Institue name required";
      err++
    }

    if (err == 0) {

      const obj = {
        userId: this.commonservice.getUserId(),
        name: this.name
      }

      console.log(obj);

      this.commonservice.loaderStart();
      this.restapi.inserInstitue(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd()
        if (res.success) {
          this.closeAddModal();
          this.getInstitueData();
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


  updateInstitue(): any {

    this.instituetErr = ""

    let err = 0

    if (this.name == "" || this.name == null || this.name == undefined) {
      this.instituetErr = "Institue name required";
      err++
    }

    if (err == 0) {

      const obj = {
        userId: this.commonservice.getUserId(),
        name: this.name,
        id: this.institueId
      }
      this.commonservice.loaderStart();
      this.restapi.updateInstitue(obj).subscribe((res: any) => {
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
          this.getInstitueData();
          this.closeAddModal();
        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message);
      })
    }
  }




  deleteInstitue(): any {

    const obj = {
      userId: this.commonservice.getUserId(),
      id: this.institueId,
    };
    this.commonservice.loaderStart();
    this.restapi.deleteInstitue(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.closeModal();
          this.getInstitueData();
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
    this.name = ""
  }








  onClickDelete(id: any): any {
    this.institueId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.unitid = "";
    this.modalService.dismissAll();
  }






  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getInstitueData();
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getInstitueData();
  }
  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getInstitueData();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  onEnter() {
    this.getInstitueData();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getInstitueData();
    }
    if (this.searchText.length == 0) {
      this.getInstitueData();
    }
  }

}
