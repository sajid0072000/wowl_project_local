import { Component} from '@angular/core';
import { country } from 'src/assets/json/countries_states';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { NotifierService } from "angular-notifier";



@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent {

  // countrycode: any = '';
  // countrycodeErr: boolean = false;
  // countryCodeArr: any = [];
  name:any=''
  email:any=''
  mobile: any = '';
  reason: any = ''
  isAccountDelete:boolean=false
  nameErr:boolean=false;
  emailErr:boolean=false;
  validEmailErr:boolean=false;
  mobileErr: boolean = false
  reasonErr: boolean = false
  validMobileNumberErr: boolean = false
  isAccountDeleteErr:boolean=false
  

  constructor(public common: CommonService, private rest: RestApiService, private notifierService: NotifierService,
    ) {

  }
  ngOnInit(): void {
    // this.countryCodeArr = country
  }

  // getCallingCode() {
  //   for (let obj of this.countryCodeArr) {
  //     if (obj.emoji + ' ' + obj.callingCode === this.countrycode) {
  //       this.countrycode = obj.callingCode
  //     }
  //   }
  // }

  nameFun():any{
    this.nameErr=false
  }

  emailFun():any{
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


    reasonFun():any{
      this.reasonErr=false
    }

    mobileFun():any{
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


  regTestforMobile(string: any): boolean {
    var regex = /^[0-9]+$/;
    return regex.test(string);
  }

  onKeyPressMobile(event: any): any {
    this.mobileErr = false;
    if (this.mobile) {
      if (
        this.mobile.toString().length < 10 ||
        this.mobile.toString().length > 15
      ) {
        this.validMobileNumberErr = true;
      } else {
        this.validMobileNumberErr = false;
      }
    }
    let temp = event.key;
    if (!this.regTestforMobile(temp)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  checkFun():any{
    this.isAccountDeleteErr=false
  }
  

  deleteAccount(): any {
    this.nameErr=false;
    this.emailErr=false;
    this.validEmailErr=false;
    this.mobileErr = false;
    this.validMobileNumberErr = false
    // this.countrycodeErr = false;
    this.reasonErr = false
    this.isAccountDeleteErr=false
  

    let err = 0

    let filter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (this.name === '' || this.name === null || this.name === undefined) {
      this.nameErr = true;
      err++
    }

    if (this.email == "" || this.email == null || this.email == undefined) {
      this.emailErr = true
      err++
    }

    if (this.email) {
      if (!filter.test(this.email)) {
        this.validEmailErr = true;
        err++;
      }
    }


    if (this.mobile === '' || this.mobile === null || this.mobile === undefined) {
      this.mobileErr = true;
      err++
    }

    // if (this.countrycode === '' || this.countrycode === null || this.countrycode === undefined) {
    //   this.countrycodeErr = true;
    //   err++
    // }


    if (this.mobile) {
      if (
        this.mobile.toString().length < 10 ||
        this.mobile.toString().length > 15
      ) {
        this.validMobileNumberErr = true;
        err++;
      }
    }

    if (this.reason === '' || this.reason === null || this.reason === undefined) {
      this.reasonErr = true;
      err++
    }

   
    if (this.isAccountDelete === false || this.isAccountDelete === null || this.isAccountDelete === undefined) {
      this.isAccountDeleteErr = true;
      err++
    }
    

    if (err === 0) {
      const data = {
        "name":this.name,
        "email":this.email,
        "mobile": this.mobile,
        'reason':this.reason,
        // "countrycode": this.countrycode,
        "isAccountDelete":this.isAccountDelete == true ? 1 : 0
      }
      this.rest.deleteProfileRequest(data).subscribe((result:any)=>{
        if(result.success){
          this.notifierService.notify('success', result.message);
          this.resetForm()
        }else{
          this.notifierService.notify('error', result.message);
        }
      })
    }
  }

  resetForm():any{
    this.name=''
    this.email=''
    this.mobile = ''
    this.reason = ''
    // this.countrycode = ''
    this.isAccountDelete=false
    this.nameErr=false;
    this.emailErr=false;
    this.validEmailErr=false
    this.mobileErr=false;
    // this.countrycodeErr = false;
    this.validMobileNumberErr = false;
    this.reasonErr = false;
    this.isAccountDeleteErr=false
     }
  
 
  }



