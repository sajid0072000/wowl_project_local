import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonService} from 'src/app/common.service';
import {RestApiService} from 'src/app/rest-api.service';
import {NotifierService} from "angular-notifier";
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {country} from 'src/assets/json/countries_states';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  subspdtl: any = {}
  userdetails: any = {};
  name: string = ''
  countrycode: any = '';
  email: any = '';
  mobile: any = '';
  city: any = '';
  dob: any = '';
  photourl: any = null;
  gender: any = '';
  subscriptionFlag: boolean = true
  occupation: any = '';
  countryArr: any = [];
  occupationArr: any = [];
  educationArr: any = [];

  countryid: any = '';
  backupcountryid: any = '';

  education: any = '';

  // errr
  nameErr: any = '';
  countrycodeErr: any = '';
  emailErr: any = '';
  mobileErr: any = '';
  cityErr: any = '';
  dobErr: any = '';
  photourlErr: any = '';
  genderErr: any = '';

  occupationErr: any = '';
  countryidErr: any = '';
  educationErr: any = '';

  getCountrylimit = 10;
  getCountryoffset = 0;

  getOccupationlimit = 10;
  getOccupationoffset = 0;

  getEducationlimit = 10;
  getEducationoffset = 0;

  FILE_URL: any = '';
  validMobileNumberErr: boolean = false;
  validEmailErr: boolean = false;
  userid: any = ''
  address: any = ''
  startdate: any = '';
  actualamount: any = '';
  updatedStartDate: any = ''
  renewaldate: any = ''
  updaterenewaldate: any = ''
  enddate: any = ''
  updatedEnddate: any = ''
  currentDate = '';

  subHistoryList: any = [];
  btnFlag: boolean = false;
  renewSubscription: Subscription = new Subscription;
  loginType: any = 0;
  constructor(private router: Router, public common: CommonService, private rest: RestApiService, private notifierService: NotifierService, private modalService: NgbModal,) {
    this.FILE_URL = this.rest.FILE_URL;
  }

  countryCodeArr: any = []

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.btnFlag = this.common.getSubscriptionCourseExpire()
    this.getsubsHistory();
    let today = new Date();
    today.setDate(today.getDate() - 1);
    this.currentDate = this.common.formatDate(today, 1)
    this.countryCodeArr = country
    if (!this.common.getUserId()) {
      this.router.navigate(['/'])
    }
    this.getCountry();
    this.getEducation();
    this.getOccupation();

    const dateField = document.getElementById('dob');
    if (dateField) {
      dateField.addEventListener('change', (ev: any) => {
        if (ev.target.value) {
          ev.target.classList.add('has-value');
        } else {
          ev.target.classList.remove('has-value');
        }
      });
    }

  }

  ngOnDestroy(): void {
    if (this.renewSubscription) {
      this.renewSubscription.unsubscribe();
    }
  }

  changeCountryCode(): any {
    this.countrycodeErr = false
  }

  opensubscriptionModal(modal: any): any {
    this.modalService.open(modal, {
      centered: true,
      size: 'sm',
      backdrop: true,
    });

  }

  closeModal(): any {
    this.modalService.dismissAll()
  }

  opendeleteModal(modal: any): any {
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
  }

  deleteProfile(): any {
    const data = {
      userid: this.common.getUserId()
    }
    this.common.loaderStart()
    this.rest.deleteUser(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.notifierService.notify('success', result.message);
        this.logout()
        this.closeModal()

      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  logout(): any {
    this.common.logoutUser()
    this.logoutfun()
    this.router.navigate(['/']).then(() => {
      this.router.navigate(['/'])
    })
  }

  logoutfun(): any {
    const data = {
      "loginauditid": this.common.getUserId()
    }
    this.common.loaderStart()
    this.rest.logout(data).subscribe((res: any) => {
      this.common.loaderEnd()
      if (res.success) {
        this.notifierService.notify('success', res.message)
      } else {
        this.notifierService.notify('error', res.message)
      }
    }, (err) => {
      this.notifierService.notify('error', err.error.message);
    })
  }

  uploadBtn(): any {
    let elem = document.getElementById('file-input');
    if (elem) {
      elem.click();
    }
  }

  onFileChanged(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.rest.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.photourl = res.response.fileName;
        }
      });
    }
  }

  getCountry() {
    const data = {
      limit: this.getCountrylimit,
      offset: this.getCountryoffset,
    };
    this.common.loaderStart();
    this.rest.getCountry(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.countryArr = res.response;
      } else {
        this.countryArr = [];
      }
      this.fethUserdetails();
    });
  }

  getOccupation() {
    const data = {
      limit: this.getOccupationlimit,
      offset: this.getOccupationoffset,
    };
    this.common.loaderStart();
    this.rest.getOccupation(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.occupationArr = res.response;
      } else {
        this.occupationArr = [];
      }
    });
  }

  getEducation() {
    const data = {
      limit: this.getEducationlimit,
      offset: this.getEducationoffset,
    };
    this.common.loaderStart();
    this.rest.getEducation(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.educationArr = res.response;
      } else {
        this.educationArr = [];
      }
    });
  }

  fethUserdetails() {

    const data = {
      userid: this.common.getUserId(),
    };
    this.common.loaderStart();
    this.rest.fetchUserDetail(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.userdetails = res.response;
        this.userid = this.userdetails.userid
        this.name = this.userdetails.name
        this.mobile = this.userdetails.mobile
        this.countrycode = this.userdetails.countrycode
        this.email = this.userdetails.email
        this.city = this.userdetails.address
        // console.log(this.userdetails.dob, "before condition");
        if (this.userdetails.dob !== undefined && this.userdetails.dob !== null && this.userdetails.dob !== "") {
          this.dob = formatDate(this.userdetails.dob, 'yyyy-MM-dd', 'en-US')
        }

        this.gender = this.userdetails.gender
        this.education = this.userdetails.qualification
        this.occupation = this.userdetails.occupation
        this.photourl = this.userdetails.photourl
        this.countryid = this.userdetails.countryid;
        this.backupcountryid = this.userdetails.countryid;
        this.subspdtl = res.response.subspdtl;
        if (this.subspdtl !== null) {

          this.btnFlag = this.common.getSubscriptionCourseExpire()
          this.actualamount = this.subspdtl.actualamount;
          this.startdate = res.response.subspdtl.startdate
          this.startdate = new Date(this.startdate);
          this.updatedStartDate = this.startdate.toDateString();

          // end date
          this.enddate = res.response.subspdtl.enddate
          this.enddate = new Date(this.enddate);
          this.updatedEnddate = this.enddate.toDateString();

          // renewable date
          this.renewaldate = res.response.subspdtl.renewaldate
          this.renewaldate = new Date(this.renewaldate);
          this.updaterenewaldate = this.renewaldate.toDateString();
        }
        // start date
        if(this.countryid) {
          for(const obj of this.countryArr){
            if(obj.id == this.countryid){
              this.loginType = obj.logintype;
              break;
            }
          }
        } else {
          for(const obj of this.countryArr){
            if(obj.countrycode == this.countrycode){
              this.loginType = obj.logintype;
              this.countryid = obj.id;
              this.backupcountryid = obj.id;
              break;
            }
          }
        }

      } else {
        this.userdetails = {};
      }
    });
  }

  onKeyPress(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode !== 32) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  onKeyPressCode(event: any): void {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^\d+$/.test(inputChar) && event.keyCode !== 8) {
      event.preventDefault();
    }
  }

  mobileFun(): any {
    this.mobileErr = false;
    if (this.mobile) {
      if (
        this.mobile.toString().length > 15 ||
        this.mobile.toString().length < 10
      ) {
        this.validMobileNumberErr = true
      } else {
        this.validMobileNumberErr = false
      }
    }
  }

  emailFun(): any {
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

  updateuserdetails() {
    this.photourlErr = false;
    this.nameErr = false;
    this.countrycodeErr = false;
    this.mobileErr = false;
    this.emailErr = false;
    this.countryidErr = false;
    this.cityErr = false;
    this.dobErr = false;
    this.genderErr = false;
    this.educationErr = false;
    this.occupationErr = false;
    this.validMobileNumberErr = false;
    this.validEmailErr = false;

    let err = 0;
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.name === '' || this.name === null || this.name === undefined) {
      this.nameErr = true;
      err++;
    }

    if (
      this.countrycode === '' ||
      this.countrycode === null ||
      this.countrycode === undefined
    ) {
      this.countrycodeErr = true;
      err++;
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
        this.mobile.toString().length < 10 ||
        this.mobile.toString().length > 15
      ) {
        this.validMobileNumberErr = true;
        err++;
      }
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
      this.countryid === '' ||
      this.countryid === null ||
      this.countryid === undefined
    ) {
      this.countryidErr = true;
      err++;
    }
    if (this.city === '' || this.city === null || this.city === undefined) {
      this.cityErr = true;
      err++;
    }
    if (this.dob === '' || this.dob === null || this.dob === undefined) {
      this.dobErr = true;
      err++;
    }
    if (
      this.gender === '' ||
      this.gender === null ||
      this.gender === undefined
    ) {
      this.genderErr = true;
      err++;
    }
    if (
      this.education === '' ||
      this.education === null ||
      this.education === undefined
    ) {
      this.educationErr = true;
      err++;
    }
    if (
      this.occupation === '' ||
      this.occupation === null ||
      this.occupation === undefined
    ) {
      this.occupationErr = true;
      err++;
    }
    if (err == 0) {
      const data = {
        userid: this.common.getUserId(),
        mobile: this.mobile,
        email: this.email,
        countryid: this.countryid,
        countrycode: this.countrycode,
        name: this.name,
        city: this.city,
        dob: formatDate(this.dob, 'yyyy-MM-dd', 'en-US'),
        gender: this.gender,
        education: this.education,
        occupation: this.occupation,
        photourl: this.photourl,
      };
      this.common.loaderStart();
      this.rest.updateUserDetail(data).subscribe((result: any) => {
        if (result.success) {
          this.notifierService.notify('success', result.message);
          if (this.photourl !== null) {
            this.common.setUserimage(this.photourl)
          } else {
            this.common.removeUserImage()
          }
          this.fethUserdetails()
        } else {
          this.notifierService.notify('error', result.message);
        }
      });
    }

  }

  getCallingCode() {
    for (let obj of this.countryCodeArr) {
      if (obj.emoji + ' ' + obj.callingCode === this.countrycode) {
        this.countrycode = obj.callingCode
      }
    }
  }

  openrenewModal(modal: any) {
    this.modalService.open(modal, {centered: true, size: 'xl', backdrop: false})
  }

  getsubsHistory() {
    const data = {
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.rest.getsubcriptionHistory(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (let item of res.response) {
          item.startdate = this.common.formatDate(item.startdate);
          item.enddate = this.common.formatDate(item.enddate);
        }
        this.subHistoryList = res.response;

      } else {
        this.subHistoryList = [];
      }
    })
  }

  openPaymentmodal() {
    this.renewSubscription = this.common.userdetailsSub.asObservable().subscribe((res: any) => {
      this.fethUserdetails();
    });
    let temp = this.common.getSubscriptionCourse();
    if (temp.length > 0) {
      this.common.sheardData = temp[0];
      this.common.getSubscription();
      this.fethUserdetails();
    }
  }
}
