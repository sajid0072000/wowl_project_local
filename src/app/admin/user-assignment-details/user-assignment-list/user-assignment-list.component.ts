import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver'
import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-assignment-list',
  templateUrl: './user-assignment-list.component.html',
  styleUrls: ['./user-assignment-list.component.css']
})
export class UserAssignmentListComponent implements OnInit {

  lessionName:string = '';
  lessionid:any = '';
  lessionArr:Array<any> = [];


  coursename : string = '';
  courseid:string = '';
  courseArr:Array<any> = [];

  userName:string = '';
  userid:any = '';
  userList:Array<any> = [];

  assignmentList:Array<any> = [];
  spinner: boolean = false
  spinnerLession: boolean = false;
  spinnerUser:boolean = false;
  offset = 0;
  limit = 20;
  isPrevious: boolean = true;
  selectedVal: string = '20';
  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ]
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;


  constructor(
      private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
    if (this.commonservice.getLimit()) {
      this.limit = this.commonservice.getLimit()
    }
    if (this.commonservice.getOffset()) {
      this.offset = this.commonservice.getOffset()
    }
    this.getUserAssignmentDetails();
  }

  downloadlistAssmntSheetExl(): any {
    const data = {
      "userId": this.commonservice.getUserId()
    }
    this.commonservice.loaderStart()
    this.restapi.assmntSheetExl(data).subscribe((res: any) => {
      this.commonservice.loaderEnd()
      if (res.success) {
        this.notifierService.notify('success', res.message)
        saveAs(this.restapi.GENERATED_PDF_URL + res.response, res.response);
      } else {
        this.notifierService.notify('error', res.message)
      }
    })
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
    this.getUserAssignmentDetails();
    }

  searchLessionByName(): any {
    if (this.lessionName.length  % 3 === 0) {
      const data = {
        "userId": this.commonservice.getUserId(),
        "title": this.lessionName,
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
      if (data.title === this.lessionName) {
        this.lessionid = data.id
        break;
      }
    }
    this.getUserAssignmentDetails();
  }
  searchUserByName(){
    if (this.userName.length  % 3 === 0) {
      const data = {
        searchText:this.userName
      };
      this.spinnerUser = true
      this.restapi.getUserList(data).subscribe((res: any) => {
        if (res.success) {
          this.userList = res.response
          this.spinnerUser = false
        }
        else {
          this.userList = []
          this.spinnerUser = false
        }
      });
    }
  }
  getUserIdByName(){
    for (let data of this.userList) {
      if (data.username === this.userName) {
        this.userid = data.userid;
        break;
      }
    }
    this.getUserAssignmentDetails();
  }


  getUserAssignmentDetails(){
    const data = {
      courseid:this.courseid,
      lessionid:this.lessionid,
      userid:this.userid,
      limit:this.limit,
      offset:this.offset
    };

    this.commonservice.loaderStart();
    this.restapi.getUserAssementDetails(data).subscribe((res:any)=>{
      this.commonservice.loaderEnd();
      if(res.success){
        if(res.response !=null){
          if(res.response.length > 0){
            for(const obj of res.response) {
              obj.createdat = this.commonservice.formatDateTime(obj.createdat);
            }
            this.assignmentList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else{
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else{
          this.assignmentList = [];
          this.nextBtnDesable = true;
        }
      } else{
        this.assignmentList = [];
        this.commonservice.loaderEnd();
      }
    } , (err:any)=>{
      this.notifierService.notify('error',err.error.message);
    })
  }


  gotoDetials(item:any){
    this.commonservice.assignmentDtl = item;
    this.router.navigate(['admin/app/assignment-details/'+item.attemptid])
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getUserAssignmentDetails();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getUserAssignmentDetails();
  }
}
