import { Component, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from 'src/app/common.service';
import { SignupComponent } from '../signup/signup.component';
import { RestApiService } from 'src/app/rest-api.service';
import { NotifierService } from 'angular-notifier';

import { country } from 'src/assets/json/countries_states';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  countrycode: any = '';
  mobile: any = ''

  countrycodeErr: boolean = false
  mobileErr: boolean = false
  validMobileErr: boolean = false
  emailErr: boolean = false
  validEmailErr: boolean = false

  isView: boolean = false;
  otp: any = '';
  otpErr: boolean = false;
  userid: any = ''
  isTimer: boolean = false;

  display: any;

  categoryTypeArr: any = []

  countryArr: any = []
  allowedCountries: any = []

  isSignFlag: boolean = false;
  email: string = '';

  constructor(private modalService: NgbModal, private common: CommonService, private rest: RestApiService, private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.countryArr = country;
    this.isSignFlag = this.common.isSignFlag;
    this.getAllowedCountries();
    this.countrycode = this.common.userCountryCode;
  }

  getAllowedCountries(): any {
    this.rest.getAllowedCountries().subscribe((result: any) => {
      if (result.success) {
        this.allowedCountries = result.response;
      }
    })
  }

  changeLogin(): any {
    this.isSignFlag = this.isSignFlag === false ? false : true
    this.common.isSignFlag = this.isSignFlag
  }

  timerIntervel: any

  timer(minute: any): any {
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    this.timerIntervel = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.isTimer = true
        clearInterval(this.timerIntervel);
      }
    }, 1000);
  }


  changeCountryCode(): any {
    this.countrycodeErr = false
  }

  changeMobile(): any {
    this.mobileErr = false
    this.validMobileErr = false

    if (this.mobile) {
      if (this.mobile.toString().length < 7 || this.mobile.toString().length > 14) {
        this.validMobileErr = true
      }
    }
  }

  changeOtp(): any {
    this.otpErr = false
  }

  validateEmail(email: string): any {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  login() {
    let err = 0
    var letters = /^[A-Za-z]+$/;
    const number = /^[0-9]$/;
    this.countrycodeErr = false
    this.mobileErr = false
    this.validMobileErr = false;
    this.emailErr = false;
    this.validEmailErr = false;

    if (this.countrycode === '' || this.countrycode === undefined || this.countrycode === null || Number(this.countrycode) === 0) {
      this.countrycodeErr = true;
      err++;
    } else {
      let flag = 0;
      for (const obj of this.countryArr) {
        if (obj.callingCode == this.countrycode) {
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        this.countrycodeErr = true;
        err++;
      }
    }
    if(this.countrycode == 91) {
      if (this.mobile === '' || this.mobile === undefined || this.mobile === null) {
        this.mobileErr = true;
        err++
      }
      if (this.mobile) {
        if (this.mobile.toString().length < 7 || this.mobile.toString().length > 14) {
          this.validMobileErr = true;
          err++
        }
      }
    } else {
      if (this.email === '' || this.email === undefined || this.email === null) {
        this.emailErr = true;
        err++
      }
      if (this.email) {
        if (!this.validateEmail(this.email)) {
          this.validEmailErr = true;
          err++
        }
      }
    }

    let isnum = /^\d+$/.test(this.countrycode);
    if(!isnum) {
      this.countrycodeErr = true;
      err+=1;
    }

    if (err == 0) {

      const data = {
        countrycode: this.countrycode,
        mobile: this.mobile,
        email: this.email,
      }
      this.common.loaderStart()
      this.rest.userSignIn(data).subscribe((result: any) => {
        this.common.loaderEnd()
        if (result.success) {
          this.userid = result.response.userid;
          this.notifierService.notify('success', result.message);
          this.isView = true;
          this.timer(2);
        } else {
          this.notifierService.notify('error', result.message);
          this.isView = false;
        }

      })

    }

  }


  varify(): any {
    var err = 0
    this.otpErr = false
    if (this.otp === '' || this.otp === undefined || this.otp === null) {
      this.otpErr = true
      err++
    }
    if (err == 0) {
      const data = {
        "userid": this.userid,
        "otp": this.otp
      }
      this.rest.userVerification(data).subscribe((result: any) => {
        if (result.success) {
          this.notifierService.notify('success', result.message);
          setTimeout(() => {
            this.closeModal();
            // console.log('result.response >>> ', result.response);
            this.common.setUser(JSON.stringify(result.response))
            this.common.setUserid(result.response.userid)
            this.common.setLoginauditid(result.response.loginauditid)
            this.common.setSignin(this.isSignFlag)
            if (result.response.photourl !== null) {
              this.common.setUserimage(result.response.photourl)
            }
            this.checkSubscriptionplanofuser()
            this.common.Subject.next({});
          }, 1000);
        } else {
          this.notifierService.notify('error', result.message);
        }
      })

    }


  }

  reSend(): any {
    const data = {
      userid: this.userid,
      mobile: this.mobile,
      countrycode: this.countrycode,
      email: this.email
    };

    this.rest.resendOtp(data).subscribe((result: any) => {
      if (result.success) {
        this.userid = result.response.userid
        this.notifierService.notify('success', result.message);
        this.timer(2);
        this.isTimer = false
      } else {
        this.notifierService.notify('error', result.message);
      }
    })

  }


  opensignup(): any {
    this.closeModal()
    this.modalService.open(SignupComponent, { centered: true, size: 'md', backdrop: true });

  }


  closeModal(): any {
    clearInterval(this.timerIntervel);
    this.modalService.dismissAll()
  }




  checkSubscriptionplanofuser(): any {
    const data = {
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.rest.checkSubscriptionPlanofuser(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.common.setCheckspbu(JSON.stringify(result.response))
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  getCallingCode() {
    for (let obj of this.countryArr) {
      if (obj.emoji + ' ' + obj.callingCode === this.countrycode) {
        this.countrycode = obj.callingCode
      }
    }
  }

  onKeyPress(event: any): void {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^\d+$/.test(inputChar) && event.keyCode !== 8) {
      event.preventDefault();
    }
  }

  countrycodeFun(): any {
    this.countrycodeErr = false
  }

  onCountryChange() {
    this.email = '';
    this.mobile = '';
  }

}
