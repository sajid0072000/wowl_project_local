import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-leaving-midway',
  templateUrl: './leaving-midway.component.html',
  styleUrls: ['./leaving-midway.component.css']
})
export class LeavingMidwayComponent {

  step: any = 0
  newcourseid: any = '';

  constructor(
    private modalService: NgbModal,
    private common: CommonService,
    private rest: RestApiService,
    private notifierService: NotifierService

  ) {

  }

  ngOnInit(): void {
    this.newcourseid = this.common.newcourseid;
    console.log("this.newcourseid", this.newcourseid)
  }

  gotostep(value: any): any {
    this.step = value
  }

  closeModal(): any {
    this.modalService.dismissAll();
  }

  endSubscription(): any {
    let temp = this.common.getSubscriptionCourse();

    const data = {
      "userid": this.common.getUserId(),
      "subscriptionauditid": temp[0].subscriptionauditid,
      "courseid": temp[0].courseid,
      "partnerid": temp[0].partnerid,
      "newcourseid": this.newcourseid
    }

    this.rest.endSubscription(data).subscribe((result: any) => {
      if (result.success) {
        this.checkSubscriptionplanofuser();
        this.notifierService.notify('success', result.message);
        setTimeout(() => {
          this.closeModal()
        }, 500);
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
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

}
