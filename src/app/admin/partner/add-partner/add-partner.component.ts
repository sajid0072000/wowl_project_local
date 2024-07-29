import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { country } from 'src/assets/json/countries_states';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})
export class AddPartnerComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: any;
  name: any = ''
  partnercode: any = ''
  email: any = ''
  countrycode: any = ''
  countryCodeArr: any = []
  mobile: any = ''
  address: any = ''
  nameErr: boolean = false
  validNameErr: boolean = false
  partnercodeErr: boolean = false
  emailErr: boolean = false
  validEmailErr: boolean = false
  countrycodeErr: boolean = false
  addressErr: boolean = false
  mobileErr: any = ''
  validMobileErr: boolean = false
  partnerid: any = ''
  userid: any = ''
  updateFlag: boolean = false

  constructor(private router: Router, private restapi: RestApiService, private actroute: ActivatedRoute, private notifierService: NotifierService, private common: CommonService, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.partnerid = this.actroute.snapshot.params['id'];
    if (this.partnerid && this.partnerid != '0') {
      this.updateFlag = true
      this.getPartnerbyId()
    }
    this.countryCodeArr = country
  }


  delete(): any {
    const data = {
      "id": this.partnerid
    }
    this.common.loaderStart();
    this.restapi.deletePartner(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.closeModal()
        this.router.navigate(['admin/app/partner-list'])
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }


  goBack() {
    this.router.navigate(["admin/app/lession-list"]);
  }

  regTest(string: any): boolean {
    var regex = /^[A-Za-z\s]+$/;
    return regex.test(string);
  }
  onKeyPressName(event: any): any {
    this.nameErr = false;
    this.validNameErr = false;
    let temp = event.key;
    if (!this.regTest(temp)) {
      event.preventDefault();
      return false;
    }
    return true;
  }


  regTestforCallingcode(string: any): boolean {
    var regex = /^[0-9]+$/;
    return regex.test(string);
  }
  
  onKeyPressCode(event: any): any {
    this.countrycodeErr = false;
    let temp = event.key;
    if (temp === 'Backspace') {
      return true;
    }
    if (!this.regTestforCallingcode(temp)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  


  mobileFun(): any {
    this.mobileErr = false;
    if (this.mobile) {
      if (
        this.mobile.toString().length > 15 ||
        this.mobile.toString().length < 10
      ) {
        this.validMobileErr = true
      } else {
        this.validMobileErr = false
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
        this.validMobileErr = true;
      } else {
        this.validMobileErr = false;
      }
    }
    let temp = event.key;
    if (!this.regTestforMobile(temp)) {
      event.preventDefault();
      return false;
    }
    return true;
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


  partnerCodefun(): any {
    this.partnercodeErr = false
  }


  addressFun(): any {
    this.addressErr = false
  }

  addPartner(): any {
    this.nameErr = false
    this.validNameErr = false
    this.partnercodeErr = false
    this.emailErr = false
    this.validEmailErr = false
    this.countrycodeErr = false
    this.addressErr = false
    this.mobileErr = false
    this.validMobileErr = false
    let err = 0
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.name == "" || this.name == null || this.name == undefined) {
      this.nameErr = true
      err++
    }
    if (!this.name || /^\s*$/.test(this.name) || /\s{2,}/.test(this.name)) {
      this.validNameErr = true;
      err++;
    }
    if (this.partnercode == "" || this.partnercode == null || this.partnercode == undefined) {
      this.partnercodeErr = true
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
    if (this.countrycode == "" || this.countrycode == null || this.countrycode == undefined) {
      this.countrycodeErr = true
      err++
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
        this.validMobileErr = true;
        err++;
      }
    }
    if (this.address == "" || this.address == null || this.address == undefined) {
      this.addressErr = true
      err++
    }
    if (err == 0) {
      var data: any = {
        "name": this.name,
        "partnercode": this.partnercode,
        "email": this.email,
        "countrycode": this.countrycode,
        "mobile": this.mobile,
        "address": this.address
      }
      this.common.loaderStart();
      this.restapi.addPartner(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/partner-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });

    }
  }


  getPartnerbyId(): any {
    const data = {
      "id": this.partnerid
    }
    this.common.loaderStart();
    this.restapi.getPartnerById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.name = res.response.name
        this.partnercode = res.response.partnercode
        this.countrycode = res.response.countrycode
        this.mobile = res.response.mobile
        this.email = res.response.email
        this.address = res.response.address
        this.userid = res.response.userid
      }
      else {
        this.notifierService.notify('error', res.message);
      }
    });
  }


  updatePartner(): any {
    this.nameErr = false
    this.validNameErr = false
    this.partnercodeErr = false
    this.emailErr = false
    this.validEmailErr = false
    this.countrycodeErr = false
    this.addressErr = false
    this.mobileErr = false
    this.validMobileErr = false
    let err = 0
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.name == "" || this.name == null || this.name == undefined) {
      this.nameErr = true
      err++
    }
    if (!this.name || /^\s*$/.test(this.name) || /\s{2,}/.test(this.name)) {
      this.validNameErr = true;
      err++;
    }
    if (this.partnercode == "" || this.partnercode == null || this.partnercode == undefined) {
      this.partnercodeErr = true
      err++
    }
    // if (this.email == "" || this.email == null || this.email == undefined) {
    //   this.emailErr = true
    //   err++
    // }

    // if (this.email) {
    //   if (!filter.test(this.email)) {
    //     this.validEmailErr = true;
    //     err++;
    //   }
    // }
    if (this.countrycode == "" || this.countrycode == null || this.countrycode == undefined) {
      this.countrycodeErr = true
      err++
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
        this.validMobileErr = true;
        err++;
      }
    }
    if (this.address == "" || this.address == null || this.address == undefined) {
      this.addressErr = true
      err++
    }
    if (err == 0) {
      const data: any = {
        "id": this.partnerid,
        "userid": this.userid,
        "name": this.name,
        "partnercode": this.partnercode,
        "countrycode": this.countrycode,
        "mobile": this.mobile,
        "address": this.address
      }
      this.common.loaderStart();
      this.restapi.updatePartner(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/partner-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });
    }
  }


  resetForm(): any {
    this.name = ''
    this.partnercode = ''
    this.email = ''
    this.countrycode = ''
    this.address = ''
    this.mobile = ''
    this.nameErr = false
    this.validNameErr = false
    this.partnercodeErr = false
    this.emailErr = false
    this.validEmailErr = false
    this.countrycodeErr = false
    this.addressErr = false
    this.mobileErr = false
    this.validMobileErr = false
    this.updateFlag=false
    this.router.navigate(['admin/app/partner-list'])
  }

  onClickDelete(id: any): any {
    this.partnerid = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.partnerid = '';
    this.modalService.dismissAll();
  }

  getCallingCode() {
    for (let obj of this.countryCodeArr) {
      if (obj.emoji + ' ' + obj.callingCode === this.countrycode) {
        this.countrycode = obj.callingCode
      }
    }
  }


}
