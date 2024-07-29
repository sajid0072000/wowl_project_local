import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.css']
})
export class AddSubscriptionComponent {

  @ViewChild('deleteModal') deleteModal: any;

  selectedOption: string = ''; // Default to option 1

  subscriptionid: any = ''

  planname:any=''
  amount:any=''
  plantype:any=''
  days:any=''
  isactive:boolean=false

  plannameErr:boolean=false
  amountErr:boolean=false
  plantypeErr:boolean=false
  daysErr:boolean=false

  

  constructor(private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.subscriptionid = this.actroute.snapshot.params["id"];
    if (this.subscriptionid != 0) {
      this.getSubscriptionPlanById();
    } else {
      this.subscriptionid = null
    }
  }



  resetForm(): any {
    this.router.navigate(["admin/app/subscription"]);
  }

  delete(): any {
    const data = {
      "id": this.subscriptionid
    };
    this.commonservice.loaderStart();
    this.restapi.deleteSubscriptionPlan(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.router.navigate(['admin/app/subscription']);
        this.closeModal()
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  onClickDelete(id: any): any {
    this.subscriptionid = id;
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.subscriptionid = '';
    this.modalService.dismissAll();
  }

  changePlanName():any{
    this.plannameErr = false
  }

  changeAmount():any{
    this.amountErr = false
  }

  changeType():any{
    this.plantypeErr = false
  }

  changeDays():any{
    this.daysErr = false
  }


  add(): any {

    this.plannameErr = false
    this.amountErr = false
    this.plantypeErr = false
    this.daysErr = false

    let err = 0

    if (this.planname == '' || this.planname == null || this.planname == undefined) {
      this.plannameErr = true
      err++
    }

    if (this.amount == '' || this.amount == null || this.amount == undefined) {
      this.amountErr = true
      err++
    }

    if (this.plantype == '' || this.plantype == null || this.plantype == undefined) {
      this.plantypeErr = true
      err++
    }

    if (this.days == '' || this.days == null || this.days == undefined) {
      this.daysErr = true
      err++
    }

    if (err == 0) {

      let obj = {
        "planname": this.planname,
        "amount": this.amount,
        "plantype": this.plantype,
        "days": this.days,
        "isactive": this.isactive===false? "0":"1"
      }
      this.commonservice.loaderStart();
      this.restapi.addSubscriptionPlan(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.notifierService.notify("success", res.message);
          this.router.navigate(['admin/app/subscription']);
        } else {
          this.notifierService.notify("error", res.message)
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message)
      })


    }


  }

  getSubscriptionPlanById() {
    const obj = {
      id: this.subscriptionid
    };
    this.commonservice.loaderStart();
    this.restapi.getSubscriptionPlanById(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.planname = res.response.planname
        this.amount = res.response.amount
        this.plantype = res.response.plantype
        this.days = res.response.days
        this.isactive = res.response.isactive
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message)
    });
  }

  edit(): any {

    this.plannameErr = false
    this.amountErr = false
    this.plantypeErr = false
    this.daysErr = false

    let err = 0

    if (this.planname == '' || this.planname == null || this.planname == undefined) {
      this.plannameErr = true
      err++
    }

    if (this.amount == '' || this.amount == null || this.amount == undefined) {
      this.amountErr = true
      err++
    }

    if (this.plantype == '' || this.plantype == null || this.plantype == undefined) {
      this.plantypeErr = true
      err++
    }

    if (this.days == '' || this.days == null || this.days == undefined) {
      this.daysErr = true
      err++
    }

    if (err == 0) {

      const obj = {
        id: this.subscriptionid,
        "planname": this.planname,
        "amount": this.amount,
        "plantype": this.plantype,
        "days": this.days,
        "isactive": this.isactive===false? "0":"1"
      };
      this.commonservice.loaderStart();
      this.restapi.updateSubscriptionPlan(obj).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.router.navigate(['admin/app/subscription']);
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      }, (err: any) => {
        this.notifierService.notify("error", err.error.message);
      })
    }
  }



  goBack() {
    this.router.navigate(["admin/app/subscription"]);
  }

}
