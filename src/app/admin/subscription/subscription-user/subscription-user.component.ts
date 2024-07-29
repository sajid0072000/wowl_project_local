import {Component, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from 'src/app/rest-api.service';
import {CommonService} from 'src/app/common.service';
import {NotifierService} from "angular-notifier";
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-subscription-user',
  templateUrl: './subscription-user.component.html',
  styleUrls: ['./subscription-user.component.css']
})
export class SubscriptionUserComponent {
  offset = 0;
  limit = 20;
  subscriptionlistArr: any = [];
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  selectedVal: any = 20;
  public pageList: Array<any> = [
    {name: '10', value: '10'},
    {name: '15', value: '15'},
    {name: '20', value: '20'},
    {name: '30', value: '30'},
    {name: '50', value: '50'}
  ];
  isPrevious: boolean = true;

  constructor(
    private restapi: RestApiService,
    private common: CommonService,
    private notifierService: NotifierService) {

  }

  ngOnInit(): void {
    this.getSubscriptionDetails()

  }

  downloadlistSubscriptionExl(): any {
    const data = {
      "userId": this.common.getUserId()
    }
    this.common.loaderStart()
    this.restapi.subscriptionExl(data).subscribe((res: any) => {
      this.common.loaderEnd()
      if (res.success) {
        this.notifierService.notify('success', res.message)
        saveAs(this.restapi.GENERATED_PDF_URL + res.response, res.response);
      } else {
        this.notifierService.notify('error', res.message)
      }
    })
  }

  getSubscriptionDetails(): any {
    const data = {
      "limit": this.limit,
      "offset": this.offset
    };
    console.log(data);
    this.common.loaderStart();
    this.restapi.getSubscriptiondetails(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.subscriptionlistArr = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.subscriptionlistArr = []
      }
    }, (err: any) => {
      this.notifierService.notify("success", err.error.message)

    });
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getSubscriptionDetails();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getSubscriptionDetails();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    if(!this.nextBtnDesable) {
      this.previousBtnDesable = false;
      this.offset = this.offset + this.limit;
      this.getSubscriptionDetails();
    }
  }


}
