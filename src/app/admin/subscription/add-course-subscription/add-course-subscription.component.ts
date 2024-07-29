import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-course-subscription',
  templateUrl: './add-course-subscription.component.html',
  styleUrls: ['./add-course-subscription.component.css']
})
export class AddCourseSubscriptionComponent {

  @ViewChild('deleteModal') deleteModal: any;

  selectedOption: string = ''; // Default to option 1

  coursesubscriptionid: any = ''
  mstsubscriptionplanid: any = ''
  planname: any = ''
  courseid: any = ''
  coursename: any = ''

  mstsubscriptionplanidErr: boolean = false
  courseidErr: boolean = false

  courselist: any = [];
  spinner: boolean = false
  subscriptionList:any=[]


  constructor(private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.coursesubscriptionid = this.actroute.snapshot.params["id"];
    this.getAllSubscriptionPlans()
    if (this.coursesubscriptionid != 0) {
      this.getCourseSubscriptionById();
    }else{
      this.coursesubscriptionid = null
    }
  }


  getAllSubscriptionPlans():any{
    this.commonservice.loaderStart();
    this.restapi.getAllSubscriptionPlans({limit:'', offset:''}).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
            this.subscriptionList = res.response;
        } else {
            this.subscriptionList = [];
        }
    })

  }


  resetForm(): any {
    this.router.navigate(["admin/app/course-subscription"]);
  }

  delete(): any {
    const data = {
      "id": this.coursesubscriptionid
    };
    this.commonservice.loaderStart();
    this.restapi.deleteCourseSubscription(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.router.navigate(['admin/app/course-subscription']);
        this.closeModal()
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  onClickDelete(id: any): any {
    this.coursesubscriptionid = id;
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.coursesubscriptionid = '';
    this.modalService.dismissAll();
  }


  add(): any {

    this.courseidErr = false
    this.mstsubscriptionplanidErr = false

    let err = 0

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.courseidErr = true
      err++
    }

    if (this.mstsubscriptionplanid == '' || this.mstsubscriptionplanid == null || this.mstsubscriptionplanid == undefined) {
      this.mstsubscriptionplanidErr = true
      err++
    }

    if (err == 0) {

      let obj = {
        "mstsubscriptionplanid": this.mstsubscriptionplanid,
        "courseid": this.courseid
      }

      this.commonservice.loaderStart();
      this.restapi.addCourseSubscription(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.notifierService.notify("success", res.message);
          this.router.navigate(['admin/app/course-subscription']);
        } else {
          this.notifierService.notify("error", res.message)
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message)
      })


    }


  }

  getCourseSubscriptionById() {
    const obj = {
      id: this.coursesubscriptionid
    };
    this.commonservice.loaderStart();
    this.restapi.getCourseSubscriptionById(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.coursename = res.response.coursename,
          this.courseid = res.response.courseid;
        this.mstsubscriptionplanid = res.response.mstsubscriptionplanid
        this.planname = res.response.planname
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message)
    });
  }

  edit(): any {

    this.courseidErr = false
    this.mstsubscriptionplanidErr = false

    let err = 0

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.courseidErr = true
      err++
    }

    if (this.mstsubscriptionplanid == '' || this.mstsubscriptionplanid == null || this.mstsubscriptionplanid == undefined) {
      this.mstsubscriptionplanidErr = true
      err++
    }

    if (err == 0) {

      const obj = {
        id: this.coursesubscriptionid,
        "mstsubscriptionplanid": this.mstsubscriptionplanid,
        "courseid": this.courseid
      };
      this.commonservice.loaderStart();
      this.restapi.updateCourseSubscription(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.router.navigate(['admin/app/course-subscription']);
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message);
      })
    }
  }


  searchCourseByName() {
    this.courseidErr = false
    const obj = {
      userId: this.commonservice.getUserId(),
      coursename: this.coursename
    };
    this.spinner = true
    this.restapi.searchCourseByName(obj).subscribe((res: any) => {
      if (res.success) {
        this.courselist = res.response;
        this.spinner = false
      } else {
        this.courselist = [];
        this.spinner = false
      }
    }, (err: any) => {
    });
  }

  getCourseIdByName() {
    for (let data of this.courselist) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }
  }


  goBack() {
    this.router.navigate(["admin/app/lesson-mapping"]);
  }

}
