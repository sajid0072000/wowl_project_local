import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from 'src/app/common.service';
import {LoginComponent} from '../login/login.component';
import {RestApiService} from 'src/app/rest-api.service';
import {NotifierService} from "angular-notifier";
import {country} from 'src/assets/json/countries_states';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  mobile: any = '';
  name: any = '';
  countrycode: any = '91';

  mobileErr: boolean = false;
  validMobileErr: boolean = false;

  nameErr: boolean = false;
  countrycodeErr: boolean = false;

  isView: boolean = false;
  userid: any = '';

  otp: any = '';
  otpErr: boolean = false;

  display: any;
  isTimer: boolean = false;
  countryArr: any = [];
  timerIntervel: any;
  allowedCountries: any = [];
  email: string = '';
  emailErr: boolean = false;
  validEmailErr: boolean = false;
  countryId = 0;
  constructor(private modalService: NgbModal, private common: CommonService, private rest: RestApiService, private notifierService: NotifierService,) {

  }

  ngOnInit(): void {
    this.countryArr = country;
    this.getAllowedCountries();
    this.countrycode = this.common.userCountryCode;
  }

  getAllowedCountries(): any {
    this.rest.getAllowedCountries().subscribe((result: any) => {
      if (result.success) {
        this.allowedCountries = result.response;
        this.onCountryChange();
      }
    })
  }

  validateEmail(email: string): any {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  signUp(): any {
    let err = 0;
    this.nameErr = false;
    this.countrycodeErr = false;
    this.mobileErr = false;
    this.validMobileErr = false;

    if (this.name === '' || this.name === undefined || this.name === null) {
      this.nameErr = true;
      err++;
    }

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
        "mobile": this.mobile,
        "name": this.name,
        "userType": 3,
        "countrycode": this.countrycode,
        "email": this.email,
        "countryid": this.countryId
      }
      this.rest.userSignUpv2(data).subscribe((result: any) => {
        if (result.success) {
          this.isView = true
          this.notifierService.notify('success', result.message);

          this.timer(2);
        } else {
          this.notifierService.notify('error', result.message);
        }
      })
    }
  }

  changeCountryCode(): any {
    this.countrycodeErr = false
  }

  changeName(): any {
    this.nameErr = false
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


  varify(): any {

    let err = 0
    this.otpErr = false

    if (this.otp === '' || this.otp === undefined || this.otp === null) {
      this.otpErr = true
      err++
    }

    const data = {
      "mobile": this.mobile,
      "name": this.name,
      "userType": 3,
      "countrycode": this.countrycode,
      "otp": this.otp,
      "email": this.email,
      "countryid": this.countryId
    }

    if (err == 0) {
      this.rest.userVerificationv2(data).subscribe((result: any) => {
        if (result.success) {
          this.notifierService.notify('success', result.message);
          setTimeout(() => {
            this.closeModal()
            this.common.setUser(JSON.stringify(result.response))
            this.common.setUserid(result.response.userid)
            this.common.setLoginauditid(result.response.loginauditid)
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


  resend(): any {
    const data = {
      "mobile": this.mobile,
      "countrycode": this.countrycode,
      "email": this.email
    }

    this.rest.resendOtpv2(data).subscribe((result: any) => {
      if (result.success) {
        this.notifierService.notify('success', result.message);
        this.timer(2);
        this.isTimer = false
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }


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


  openLoginModal(): any {
    this.closeModal()
    this.modalService.open(LoginComponent, {centered: true, size: 'md', backdrop: true});
  }

  closeModal(): any {
    clearInterval(this.timerIntervel);
    this.modalService.dismissAll()
  }

  getCallingCode() {
    for (let obj of this.countryArr) {
      if (obj.emoji + ' ' + obj.callingCode === this.countrycode) {
        this.countrycode = obj.callingCode
      }
    }
  }

  onKeyPressCode(event: any): void {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^\d+$/.test(inputChar) && event.keyCode !== 8) {
      event.preventDefault();
    }
  }

  onKeyPress(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode !== 32) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  countrycodeFun(): any {
    this.countrycodeErr = false
  }

  onCountryChange() {
    this.email = '';
    this.mobile = '';
    for(const obj of this.allowedCountries) {
      if(obj.countrycode == this.countrycode) {
        this.countryId = obj.id;
        break;
      }
    }
    console.log(this.countryId)
  }

}
