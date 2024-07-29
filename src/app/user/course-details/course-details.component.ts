import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent {
  @ViewChild('advierModal') advierModal: any;
  @ViewChild('awesomeModal') awesomeModal: any;
  @ViewChild('stepOne') stepOne: any;
  @ViewChild('stepTwo') stepTwo: any;
  @ViewChild('stepThree') stepThree: any;



  offerType: any = ''
  offerAmount: any = ''
  readingLimit: any = ''
  coursename: any = ''
  courseid: any = '';
  isLive: any = '';
  FILE_URL: any = '';
  coursebanner: any = '';
  selfaccess: any = '';
  longdesc: any = '';
  shortdesc: any = '';
  promocode: any = '';
  planname: any = '';
  amount: any = '';
  plantype: any = '';
  days: any = '';
  // sessionid =10
  name: any = '';
  email: any = '';
  mobile: any = '';
  nameErr: any = '';
  emailErr: any = '';
  mobileErr: any = '';
  promocodeErr: any = '';
  validEmailErr: boolean = false;
  validMobileNumberErr: boolean = false;
  showAwesomeFlg: boolean = false

  courseDetails: any = {
    courseDtl:{},
    educator:[]
  };



  coursevideourl: any = ''
  videoDiv: boolean = false

  totAmt: any = ''

  ispaid: any = ''


  constructor(
    private modalService: NgbModal,
    private active: ActivatedRoute,
    private common: CommonService,
    private rest: RestApiService,
    private router: Router,
    private notifierService: NotifierService
  ) {
    this.FILE_URL = this.rest.FILE_URL;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.courseDetails.courseDtl = {
    courseid:'',
    coursename:'',
    shortdesc:'',
    longdesc:'',
    coursephoto:'',
    coursebanner:'',
    coursecode:'',
    coursevideourl:'',
    videothumbnail:'',
    syllabus:'',
    ispaid:'',
    selfaccess:'',
    learningOutcomes:[]
    }
    this.courseid = this.active.snapshot.paramMap.get('id');
    this.isLive = this.active.snapshot.paramMap.get('isLive');
    this.getTotalCourseDetails();
    if (this.courseid) {
      this.common.Subject.subscribe((res: any) => {
        // this.gotoCourseLesson(this.courseid);
        setTimeout(() => {
          this.checkLoginforJoin(this.courseid, this.courseDetails.courseDtl)
        }, 100);
      })
    }
  }


  openAwesomeModal(): void {
    this.modalService.open(this.awesomeModal, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
  }


  openAdviserModal(modal: any) {
    this.name = '';
    this.email = '';
    this.mobile = '';
    this.nameErr = '';
    this.emailErr = '';
    this.mobileErr = '';
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
    });
  }

  openUcomingModal(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
    });
  }

  openSelflearningModal(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
    });
  }

  closeModal() {
    this.amount = ''
    this.modalService.dismissAll();
  }
  closeModal1() {
    this.modalService.dismissAll();
  }

  getTotalCourseDetails(): any {
    const data = {
      userId: this.common.getUserId(),
      courseid: this.courseid,
    };
    this.common.loaderStart();
    this.rest.getTotalCourseDetails(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.courseDetails = result.response;
        this.ispaid = result.response.courseDtl.ispaid
        this.longdesc = result.response.courseDtl.longdesc
        this.selfaccess = result.response.courseDtl.selfaccess;
        this.coursebanner = this.courseDetails.courseDtl.coursebanner;
        this.coursevideourl = this.courseDetails.courseDtl.coursevideourl;
        this.coursename = result.response.courseDtl.coursename;
      }
    });
  }

  playVideo(): any {
    this.videoDiv = true;
    setTimeout(() => {
      this.common.getTrancoding('video-container', '100%', '100%', this.coursevideourl, '')
    }, 500);
  }

  changeNameFun(): any {
    this.nameErr = false;
  }

  changeEmalFun(): any {
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    this.emailErr = false;
    this.validEmailErr = false;
    if (this.email) {
      if (!filter.test(this.email)) {
        this.validEmailErr = true;
      }
    }
  }

  chngeMobileFun(): any {
    this.mobileErr = false;
    this.validMobileNumberErr = false;
    if (this.mobile) {
      if (
        this.mobile.toString().length < 7 ||
        this.mobile.toString().length > 14
      ) {
        this.validMobileNumberErr = true;
      }
    }
  }

  checkLogin(): any {
    if (this.common.getUserId() !== null) {
      this.LiveCourseRequestByUserId();
    } else {

      this.name = '';
      this.email = '';
      this.mobile = '';
      this.nameErr = false;
      this.emailErr = false;
      this.mobileErr = false;
      this.validEmailErr = false

      this.modalService.open(this.advierModal, {
        centered: true,
        size: 'md',
        backdrop: true,
      });
    }
  }


  checkLoginforJoin(id: any, data: any): any {
    this.common.newcourseid = id;
    if (data.totalLessionCount == 0) {
      this.common.getComingSoon();
    } else {
      if (this.common.getUserId() == null) {
        this.common.getLogin()
      } else {
        if (this.ispaid !== 0) {
          if (this.common.checkSubscription()) {
            let temp = this.common.getSubscriptionCourse();
            if (temp.length > 0) {
              if (temp[0].isexpire == 1) {
                this.notifierService.notify('info', 'Please renew your subscription!');
                this.common.sheardData = data;
                this.common.getSubscription();
              } else if (temp[0].courseid == this.courseid && temp[0].isexpire == 0) {
                this.gotoCourseLesson(id);
              }
              else {
                this.common.getLeavingMidway()
              }
            }
          } else {
            this.common.sheardData = data;
            this.common.getSubscription()
          }
        } else {
          this.gotoCourseLesson(id)
        }
      }
    }





    // if (this.ispaid !== 0) {
    //   if (this.common.getUserId() == null) {
    //     this.common.getLogin()
    //   } else {
    //     if (this.common.checkSubscription()) {
    //       let temp = this.common.getSubscriptionCourse()
    //       if (temp.length > 0) {
    //         if (temp[0].isexpire == 1) {
    //           this.notifierService.notify('info', 'Please renew your subscription!');
    //         } else if (temp[0].courseid == this.courseid && temp[0].isexpire == 0) {
    //           this.gotoCourseLesson(id);
    //         }
    //         else {
    //           this.common.getLeavingMidway()
    //         }
    //       }
    //     } else {
    //       this.common.sheardData = data;
    //       this.common.getSubscription()
    //     }
    //   }
    // } else {
    //   this.gotoCourseLesson(id)
    // }
  }



  LiveCourseRequestByUserId(): any {
    const data = {
      userid: this.common.getUserId(),
      sessionid: '',
      name: '',
      email: '',
      mobile: '',
      courseid: this.courseid,
    };
    this.common.loaderStart();
    this.rest.LiveCourseRequest(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        setTimeout(() => {
          this.openAwesomeModal();
        }, 100);
        this.notifierService.notify('success', result.message);
      } else {
        if (result.status == 1004) {
          this.notifierService.notify('warning', result.message);
        } else {
          this.notifierService.notify('error', result.message);
        }
      }
    });
  }

  LiveCourseRequestBySessionId(): any {
    this.nameErr = false;
    this.emailErr = false;
    this.validEmailErr = false;
    this.mobileErr = false;
    this.validMobileNumberErr = false;

    let err = 0;
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (this.name === '' || this.name === null || this.name === undefined) {
      this.nameErr = true;
      err++;
    }

    if (this.email === '' || this.email === null || this.email === undefined) {
      this.emailErr = true;
      err++;
    }

    if (this.email) {
      if (!filter.test(this.email)) {
        this.validEmailErr = true;
        err++;
      }
    }

    if (
      this.mobile === '' ||
      this.mobile === null ||
      this.mobile === undefined
    ) {
      this.mobileErr = true;
      err++;
    }

    if (this.mobile) {
      if (
        this.mobile.toString().length < 7 ||
        this.mobile.toString().length > 14
      ) {
        this.validMobileNumberErr = true;
        err++;
      }
    }



    if (err == 0) {
      const data = {
        userid: '',
        sessionid: Math.floor(Math.random() * 1000000 + 1),
        name: this.name,
        email: this.email,
        mobile: this.mobile,
        courseid: this.courseid,
      };
      this.common.loaderStart();
      this.rest.LiveCourseRequest(data).subscribe((result: any) => {
        this.common.loaderEnd();
        if (result.success) {
          this.notifierService.notify('success', result.message);
          setTimeout(() => {
            this.openAwesomeModal();
          }, 100);
          this.closeModal()
          this.resetfun()
        } else {
          if (result.status == 1004) {
            this.notifierService.notify('warning', result.message);
          } else {
            this.notifierService.notify('error', result.message);
          }
        }
      });
    }
  }

  resetfun(): any {
    this.name = '';
    this.email = '';
    this.mobile = '';
    this.nameErr = false;
    this.emailErr = false;
    this.mobileErr = false;
    this.validEmailErr = false;
    this.validMobileNumberErr = false;
  }

  splitDescription(theString: any) {
    return theString.split('|');
  }

  downloadPdf(url: any): any {
    window.open(this.FILE_URL + url, '_blank');
  }

  gotoCourseLesson(path: any): any {
    this.router.navigate(['/course-lesson/' + path]);
  }

  gotoEducator(educatorid: any): any {
    this.router.navigate(['/educator/' + educatorid]);
  }


}
