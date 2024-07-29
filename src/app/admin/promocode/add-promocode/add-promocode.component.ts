import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-add-promocode',
  templateUrl: './add-promocode.component.html',
  styleUrls: ['./add-promocode.component.css']
})
export class AddPromocodeComponent implements OnInit {

  promocodeId: any = '';
  promocode: any = '';
  offerType: any = '';
  offerAmount: any = '';
  readingLimit: any = '';
  validityStartDate: any = '';
  validityEndDate: any = '';

  promocodeErr: boolean = false;
  offertypeErr: boolean = false;
  offeramountErr: boolean = false;
  readinglimitErr: boolean = false;
  startdateErr: boolean = false;
  enddateErr: boolean = false;
  updateFlag: boolean = false;

  offertypeList: any = [
    { type: 'flat', name: 'FLAT' },
    { type: 'percentage', name: 'PERCENTAGE' }

  ]

  constructor(private restapi: RestApiService, private common: CommonService, private notifier: NotifierService, private router: Router, private actroute: ActivatedRoute , private modalservice : NgbModal) { }

  ngOnInit(): void {
    this.promocodeId = this.actroute.snapshot.params['id'];
    if (this.promocodeId && this.promocodeId != '0') {
      this.updateFlag = true;
      this.getAllPromocode();
    }
  }

  getAllPromocode() {
    const data = {
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.restapi.getAllPromocode(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        let temp = res.response;
        for (let item of temp) {
          if (item.id == this.promocodeId) {
            this.promocode = item.promocode;
            this.offerType = item.offerType;
            this.offerAmount = item.offerAmount;
            this.validityStartDate = this.common.formatDate(item.validityStartDate);
            this.validityEndDate = this.common.formatDate(item.validityEndDate);
            this.readingLimit = item.readingLimit;
          }
        }
      }
    });
  }


  addPromocode() {
    this.promocodeErr = false;
    this.offertypeErr = false;
    this.offeramountErr = false;
    this.readinglimitErr = false;
    this.startdateErr = false;
    this.enddateErr = false;

    let err = 0;

    if (this.promocode === '' || this.promocode === undefined || this.promocode === null) {
      this.promocodeErr = true;
      err++;
    }
    if (this.offerType === '' || this.offerType === undefined || this.offerType === null) {
      this.offertypeErr = true;
      err++;
    }
    if (this.offerAmount === '' || this.offerAmount === undefined || this.offerAmount === null) {
      this.offeramountErr = true;
      err++;
    }
    if (this.readingLimit === '' || this.readingLimit === undefined || this.readingLimit === null) {
      this.readinglimitErr = true;
      err++;
    }
    if (this.validityStartDate === '' || this.validityStartDate === undefined || this.validityStartDate === null) {
      this.startdateErr = true;
      err++;
    }
    if (this.validityEndDate === '' || this.validityEndDate === undefined || this.validityEndDate === null) {
      this.enddateErr = true;
      err++;
    }

    if (err == 0) {
      const data = {
        promocode: this.promocode,
        offerType: this.offerType,
        offerAmount: this.offerAmount,
        validityStartDate: this.validityStartDate,
        validityEndDate: this.validityEndDate,
        readingLimit: this.readingLimit
      };
      this.common.loaderStart();
      this.restapi.addPromocode(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.resetForm();
          this.notifier.notify('success', res.message);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifier.notify('error', err.error.message);
      });
    }
  }

  updatePromocode() {
    this.promocodeErr = false;
    this.offertypeErr = false;
    this.offeramountErr = false;
    this.readinglimitErr = false;
    this.startdateErr = false;
    this.enddateErr = false;

    let err = 0;

    if (this.promocode === '' || this.promocode === undefined || this.promocode === null) {
      this.promocodeErr = true;
      err++;
    }
    if (this.offerType === '' || this.offerType === undefined || this.offerType === null) {
      this.offertypeErr = true;
      err++;
    }
    if (this.offerAmount === '' || this.offerAmount === undefined || this.offerAmount === null) {
      this.offeramountErr = true;
      err++;
    }
    if (this.readingLimit === '' || this.readingLimit === undefined || this.readingLimit === null) {
      this.readinglimitErr = true;
      err++;
    }
    if (this.validityStartDate === '' || this.validityStartDate === undefined || this.validityStartDate === null) {
      this.startdateErr = true;
      err++;
    }
    if (this.validityEndDate === '' || this.validityEndDate === undefined || this.validityEndDate === null) {
      this.enddateErr = true;
      err++;
    }

    if (err == 0) {
      const data = {
        id: this.promocodeId,
        promocode: this.promocode,
        offerType: this.offerType,
        offerAmount: this.offerAmount,
        validityStartDate: this.validityStartDate,
        validityEndDate: this.validityEndDate,
        readingLimit: this.readingLimit
      };
      this.common.loaderStart();
      this.restapi.updatePromocode(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.resetForm();
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifier.notify('error', err.error.message);
      });
    }

  }

  opendeletemodal(deleteModal:any){
    this.modalservice.open(deleteModal ,{centered :true , size :'md'});
  }

  deletePromocode(){
    const data = {
      id:this.promocodeId
    };
    this.common.loaderStart();
    this.restapi.deletePromocode(data).subscribe((res:any)=>{
      this.common.loaderEnd();
      if(res.success){
        this.notifier.notify("success", res.message);
        this.router.navigate(["admin/app/promocode-list"]);
        this.closeModal();
      } else{
        this.notifier.notify("error", res.message);
      }
    },(err:any)=>{
      this.notifier.notify("error", err.error.message);
      
    });
  }

  closeModal(){
    this.modalservice.dismissAll();
  }

  resetForm() {
    this.promocode = '';
    this.offerType = '';
    this.offerAmount = '';
    this.readingLimit = '';
    this.validityStartDate = '';
    this.validityEndDate = '';
    this.promocodeErr = false;
    this.offertypeErr = false;
    this.readinglimitErr = false;
    this.startdateErr = false;
    this.enddateErr = false;
    this.router.navigate(["admin/app/promocode-list"]);
  }

  clearpromocodeErr() {
    this.promocodeErr = false;
  }
  clearoffertypeErr() {
    this.offertypeErr = false;
  }
  clearofferamountErr() {
    this.offeramountErr = false;
  }
  clearreadinglimitErr() {
    this.readinglimitErr = false;
  }
  clearstartdateErr() {
    this.startdateErr = false;
  }
  clearenddateErr() {
    this.enddateErr = false;
  }
}
