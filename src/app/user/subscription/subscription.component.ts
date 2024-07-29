import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {

  subscribeModalDiv: boolean = true
  subscribeModalDiv1: boolean = false

  courseobj: any = {}

  subscriptionid: any = ''
  planname: any = ''
  amount: any = ''
  totAmt: any = ''
  plantype: any = ''
  days: any = ''
  checkterm: boolean = false
  promocodeid: any = ''


  coursename: any = ''
  courseid: any = ''

  promocode: any = ''
  promocodeErr: boolean = false

  partnerid: any = ''
  partnercode: any = ''
  partnercodeErr: boolean = false

  options: any;

  receiptno: any = ''
  getamount: any = ''
  currency: any = ''
  orderid: any = ''

  rzp1: any;

  renewalMsg: any = ''

  FILE_URL: any = ''
  courseDetails: any;


  constructor(
    private modalService: NgbModal,
    private common: CommonService,
    private rest: RestApiService,
    private notifierService: NotifierService
  ) {
    this.FILE_URL = this.rest.FILE_URL
  }

  ngOnInit(): void {
    this.courseDetails = JSON.parse(this.common.getCourseDetails());
    this.courseid = this.courseDetails.courseid;
    this.courseobj = this.common.sheardData;
    this.coursename = this.courseobj.coursename
    // this.courseid = this.courseobj.courseid;
    this.fetchSubscriptionPlan();

    this.options = {
      "key": "",
      "amount": "",
      "currency": "",
      "name": "",
      "description": "",
      "image": "",
      "order_id": "",
      "handler": (response: any) => {
        this.getupdatePaymentStatus(response)
      },
      "prefill": {
        "name": "",
        "email": "",
        "contact": ""
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      },
      "error": {
        "code": "BAD_REQUEST_ERROR",
        "description": "Authentication failed due to incorrect otp",
        "field": null,
        "source": "customer",
        "step": "payment_authentication",
        "reason": "invalid_otp",
        "metadata": {
          "payment_id": "",
          "order_id": ""
        }
      }
    };
  }


  gotoTermsandCondition(url: any): any {
    window.open(url, '_blank');
  }



  fetchSubscriptionPlan(): any {
    const data = {
      userid: this.common.getUserId(),
      courseid: this.courseid
    };
    this.common.loaderStart();
    this.rest.fetchSubscriptionplan(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.subscriptionid = result.response.id;
        this.planname = result.response.planname;
        this.amount = result.response.amount;
        this.totAmt = result.response.amount;
        this.plantype = result.response.plantype;
        this.days = result.response.days
      }

    })
  }

  closeModal(): any {
    this.modalService.dismissAll();
  }

  buySubscription(): any {
    this.subscribeModalDiv = false
    this.subscribeModalDiv1 = true
  }

  toverifypromoCode(): any {
    this.promocodeErr = false
    let err = 0

    if (!this.promocode && !this.partnercode) {
      this.promocodeErr = true;
      err++;
    }

    if (err == 0) {
      const data = {
        userid: this.common.getUserId(),
        promocode: this.promocode,
        partnercode: this.partnercode
      };
      this.common.loaderStart();
      this.rest.toverifypromoCode(data).subscribe((result: any) => {
        this.common.loaderEnd()
        if (result.success) {
          if (this.partnercode !== "" && result.response.partnerid !== '') {
            this.partnerid = result.response.partnerid
          } else if (this.partnercode !== "" && result.response.partnerid == '') {
            this.notifierService.notify('error', "Invalid partner code");
          }
          if (this.promocode !== "" && result.response.id == undefined) {
            this.notifierService.notify('error', "Invalid promo code");
          } else if (this.promocode !== '') {
            this.promocodeid = result.response.id;
            this.partnerid = result.response.partnerid;
            if (result.response.offerType === 'flat') {
              this.totAmt = Number(this.amount) - Number(result.response.offerAmount);
            } else {
              this.totAmt = Number(this.amount) - ((Number(this.amount) / Number(result.response.offerAmount)) * 100);
            }
          }
        } else {
          this.notifierService.notify('error', result.message);
        }
      })
    }
  }

  paySubscription(): any {
    if (!this.checkterm) {
      this.notifierService.notify('error', "Please selcet terms and conditions");
      return false
    }
    this.generateOrderId()
  }


  generateOrderId(): any {
    const data = {
      userid: this.common.getUserId(),
      amount: this.totAmt,
      promocodeid: this.promocodeid
    };

    this.rest.generateOrderId(data).subscribe((result: any) => {
      if (result.success) {
        this.receiptno = result.response.receiptno;
        this.getamount = result.response.amount;
        this.currency = result.response.currency;
        this.orderid = result.response.orderid;
        if (result.response.amount > 0) {
          this.reazorOpen()
        } else {
          this.getupdateFreePaymentStatus({
            razorpay_payment_id: 'pay_' + this.orderid,
            razorpay_order_id: this.orderid,
            razorpay_signature: 'no signature'
          });
        }

      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  reazorOpen(): any {
    this.options.key = this.rest.RZP_KEY_ID;
    this.options.name = "WOWL";
    this.options.description = "WOWL Subscription Payment Transaction";
    this.options.currency = this.currency.toString();
    this.options.order_id = this.orderid;
    this.options.image = "assets/images/favicon-1.png";
    this.options.prefill.name = this.common.getUser().name;
    this.options.prefill.email = this.common.getUser().email;
    this.options.prefill.contact = this.common.getUser().mobile;
    this.options.amount = this.getamount;

    this.rzp1 = new this.common.nativeWindow.Razorpay(this.options);
    this.rzp1.open();
    this.rzp1.on('payment.failed', (response: any) => {
      this.getupdatePaymentStatusErr(response.error)
    });
  }


  getupdatePaymentStatus(res: any): any {
    const data = {
      "userid": this.common.getUserId(),
      "razorpaypaymentid": res.razorpay_payment_id,
      "razorpayorderid": res.razorpay_order_id,
      "razorpaysignature": res.razorpay_signature,
      "reason": "",
      "status": 1,
      "subscriptionid": this.subscriptionid,
      "courseid": this.courseid,
      "promocodeid": this.promocodeid,
      'partnerid': this.partnerid,
      "subscriptionday": this.days
    };
    this.common.loaderStart();
    this.rest.updatePaymentStatus(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        if (result.status === 1005) {
          this.notifierService.notify('warning', result.message);
        } else if (result.status === 200) {
          this.notifierService.notify('success', result.message);
          this.renewalMsg = result.response.renewalMsg;
          this.checkSubscriptionplanofuser();
          this.resetVal()
        }
        this.common.userdetailsSub.next({ success: true });
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  getupdateFreePaymentStatus(res: any): any {
    const data = {
      "userid": this.common.getUserId(),
      "razorpaypaymentid": res.razorpay_payment_id,
      "razorpayorderid": res.razorpay_order_id,
      "razorpaysignature": res.razorpay_signature,
      "reason": "",
      "status": 1,
      "subscriptionid": this.subscriptionid,
      "courseid": this.courseid,
      "promocodeid": this.promocodeid,
      'partnerid': this.partnerid,
      "subscriptionday": this.days
    };
    this.common.loaderStart();
    this.rest.updateFreePaymentStatus(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        if (result.status === 1005) {
          this.notifierService.notify('warning', result.message);
        } else if (result.status === 200) {
          this.notifierService.notify('success', result.message);
          this.renewalMsg = result.response.renewalMsg
          this.checkSubscriptionplanofuser()
          this.resetVal()
        }
        this.common.userdetailsSub.next({ success: true });
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  getupdatePaymentStatusErr(res: any): any {
    const data = {
      "userid": this.common.getUserId(),
      "razorpaypaymentid": res.metadata.payment_id,
      "razorpayorderid": res.metadata.order_id,
      "razorpaysignature": "",
      "reason": res.reason,
      "status": 2,
      "promocodeid": this.promocodeid,
      "subscriptionday": this.days,
      "subscriptionid": this.subscriptionid,
    };
    this.common.loaderStart();
    this.rest.updatePaymentStatus(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.notifierService.notify('success', result.message);
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  resetVal(): any {
    this.subscriptionid = ''
    this.amount = ''
    this.totAmt = ''
    this.days = ''
    this.checkterm = false
    this.promocodeid = ''
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
        this.closeModal()
        this.common.sheardData = this.renewalMsg
        this.common.getSubscriptionSuccess();
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }



}
