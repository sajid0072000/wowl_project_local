import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { ElementRef } from '@angular/core';
import { NotifierService } from 'angular-notifier';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  name: any = ''
  email: any = ''
  mobile: any = ''
  captchacode: any = ''
  nameErr: any = ''
  emailErr: any = ''
  validEmailErr: boolean = false;
  validmobileNumberErr:boolean=false
  mobileErr: any = ''
  captchacodeErr: any = ''
  ValidcaptchacodeErr:boolean=false
  generatedCaptcha:any=''
  newCapthca:any=''


  quickLinkArr:any=[]
  policyArr:any=[]
  menuArr:any=''

  constructor(private router: Router, 
    private rest: RestApiService,
    public common: CommonService,
    private notifierService:NotifierService,
    private elementRef: ElementRef) { 
    
   }


  ngOnInit(): void {
    this.getQuickLink()
    this.getPolicy()
    this.getMenuArr()
    this.generateCaptcha()
  }

  goto(path: any):any {
    if(path==''){
      this.common.getComingSoon()
    }else{
      this.router.navigate(["/"]).then(() => {
        this.router.navigate([path])
      })
    }
  }

  gotoHref(path:any):any{
    this.router.navigate(["/"]).then(() => {
      this.router.navigate([path])
    })
  }


  getQuickLink():any{
    this.quickLinkArr.push(
      {name:"About us", path:"/wowl-ueg/0"},
      {name:"Team WOWL-UEG", path: "/wowl-ueg/2"},
      {name:"Teachers’ Profiles", path:"/all-eductors"},
      {name:"Gallery", path:""},
      {name:"Blog", path:""}
      )
  }

  getPolicy():any{
    this.policyArr.push(
      {name:"Privacy Policy", path:"/privacy-policy"},
      {name:"Terms and Conditions", path:"/term-condition"},
      {name:"Digital Safeguarding", path:"/digital-safeguarding"},
      {name:"Cancellation and Refund", path:"/cancellation-and-refund"}
      )
  }

  getMenuArr(): any {
    this.rest.getCategoryTypeAndCourses({}).subscribe((result: any) => {
      if (result.success) {
        if (result.success) {
          let temp = result.response
          for (let obj of temp) {
            obj.navDropdown = false
            obj.path = "/language/" + obj.categoryTypeId
            obj.name = obj.categoryTypeName + " Programmes" 
          }
          this.menuArr = temp
        }
      }
    })
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

  regTest(string: any): boolean {
    var regex = /^[A-Za-z\s]+$/; 
    return regex.test(string);
  }
  
  onKeyPress(event: any): any {
    this.nameErr = false;
    let temp = event.key;
    if (!this.regTest(temp)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  

  mobileFun():any{
    this.mobileErr = false;
    this.validmobileNumberErr = false;
    if (this.mobile) {
      if (
        this.mobile.toString().length < 10 ||
        this.mobile.toString().length > 15
      ) {
        this.validmobileNumberErr = true;
      }
    }
  }

  captchaFun():any{
    this.captchacodeErr = false
    this.ValidcaptchacodeErr= false
  }

  addContactDetails(): any {
    this.nameErr = false
    this.emailErr = false
    this.mobileErr = false
    this.captchacodeErr = false
    this.validEmailErr = false
    this.ValidcaptchacodeErr= false
    let err = 0
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.name == "" || this.name == null || this.name == undefined) {
      this.nameErr = true
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
        this.validmobileNumberErr = true;
        err++;
      }
    }
    if (this.captchacode == "" || this.captchacode == null || this.captchacode == undefined) {
      this.captchacodeErr = true;
      err++;
    } 
    else {
      if (this.captchacode !== this.generatedCaptcha  && this.captchacode !== this.newCapthca) {
        this.ValidcaptchacodeErr = true;
        err++;
      } 
    }
    if (err == 0) {
      const data ={
        "name":this.name,
        "email":this.email,
        "mobile":this.mobile
    }
      this.common.loaderStart()
      this.rest.addContactUs(data).subscribe((res:any) => {
        this.common.loaderEnd()
       if(res.success){
        if(res.status===1004){
          this.notifierService.notify('info', res.message)
        }
        if(res.status===200){
          this.notifierService.notify('success', res.message)
          this.resetFun()
          this.regenerateCaptcha()
        }
       } else{
        this.notifierService.notify('error', res.message);
       }
      }, (err)=>{
        this.notifierService.notify('error', err.error.message);
      })
    }
  }
  resetFun():any{
    this.nameErr = false
    this.emailErr = false
    this.mobileErr = false
    this.captchacodeErr = false
    this.validEmailErr = false
    this.ValidcaptchacodeErr= false
    this.name = ''
    this.email = ''
    this.mobile = ''
    this.captchacode = ''
    this.email = ''
  }

  generateCaptcha(): any {
    var result = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 5; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    this.generatedCaptcha = result; 
    $('.dynamic-code').text(result);
  }

  // regenerate captcha
  regenerateCaptcha(): any {
    var result = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 5; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    this.newCapthca = result
    this.elementRef.nativeElement.querySelector('.dynamic-code').textContent = result;
  }

  openSocialMedia(actype:any){
    if(actype==1){
      window.open('https://www.facebook.com/wowlapp?mibextid=ZbWKwL');
    } else if(actype=='2'){
      window.open('https://www.instagram.com/wowlapp?igsh=MWw3OHVtYzRrdHdzbA==');
    } else if(actype == '3'){
      window.open('https://x.com/WowlEdtech?s=20 ');
    } else if(actype == '4'){
      window.open(' https://youtube.com/@Wowlacademy?si=y4K0esLH5xwOW-zB')
    }
  }

}
