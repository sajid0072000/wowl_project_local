import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-user-course-audit',
  templateUrl: './user-course-audit.component.html',
  styleUrls: ['./user-course-audit.component.css']
})
export class UserCourseAuditComponent implements OnInit {
  coursename:any ='';
  courseArr:any =[];
  userName:any ='';
  userList:any =[];
  spinner:boolean = false;
  spinnerUser:boolean = false;
  courseid:any ='';
  userid:any ='';
  userCourseList:any=[];
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
    this.userCourseAuditList();

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
    this.userCourseAuditList();
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
      this.userCourseAuditList();
    }
    userCourseAuditList(){
      const data = {
        courseid:this.courseid,
        userid:this.userid,
        limit:this.limit,
        offset:this.offset
      };
  
      this.commonservice.loaderStart();
      this.restapi.userCourseAuditList(data).subscribe((res:any)=>{
        this.commonservice.loaderEnd();
        if(res.success){
          if(res.response !=null){
            if(res.response.length > 0){
              for(const obj of res.response) {
                obj.createdat = this.commonservice.formatDateTime(obj.createdat);
              }
              this.userCourseList = res.response;
              this.nextBtnDesable = res.response.length < this.limit;
            } else{
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else{
            this.userCourseList = [];
            this.nextBtnDesable = true;
          }
        } else{
          this.userCourseList = [];
          this.commonservice.loaderEnd();
        }
      } , (err:any)=>{
        this.notifierService.notify('error',err.error.message);
      })
    }

    gotoDetials(item:any){
      this.router.navigate(['/admin/app/user-score/'+item.courseid+'/'+item.userid])
    }

    changePagelimit(event: any): any {
      this.offset = 0;
      this.limit = Number(event.target.value);
    }
  
    previousPage(): any {
      this.offset = this.offset > 0 ? this.offset - this.limit : 0;
      this.offset = this.offset < 0 ? 0 : this.offset;
      this.userCourseAuditList();
      if (this.offset <= 0) {
        this.previousBtnDesable = true;
      }
    }
  
    nextPage(): any {
      this.previousBtnDesable = false;
      this.offset = this.offset + this.limit;
      this.userCourseAuditList();
    }
}
