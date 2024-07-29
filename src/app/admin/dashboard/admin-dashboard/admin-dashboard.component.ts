import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  limit: any = 20;
  offset: any = 0;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  selectedVal: any = 20;
  partnerData: any = [];
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  barchartdata: any = [];
  piechartdata: any = [];
  totalno: any = '';
  totalsales: any = '';

  partnername: any = '';
  partnerList: any = [];
  partnerid:any = '';

  partnerSpinner: boolean = false;

  constructor(private common: CommonService, private restapi: RestApiService, private notifier: NotifierService) { }
  ngOnInit(): void {
    this.getParnerData('totalno');
    this.getParnerData('totalamount');
    this.getParnerData('individual');
  }

  getParnerData(type: any) {
    const data = {
      type: type,
      partnerid: this.partnerid,
      limit: this.limit,
      offset: this.offset
    };
    this.common.loaderStart();
    this.restapi.partnerDashBoardForAdmin(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (type == 'totalno') {
          this.barchartdata = res.response.result;
        } else if (type == 'totalamount') {
          this.piechartdata = res.response.result;
        } else if (type == 'individual') {
          if (res.response.result) {
            if (res.response.result.length > 0) {
              this.partnerData = res.response.result;
              this.nextBtnDesable = res.response.result.length < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else {
            this.nextBtnDesable = true;

          }
          this.totalno = res.response.totalno.totalno;
          this.totalsales = res.response.totalno.totalsales;
        }
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    });
  }
  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getParnerData('individual');
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getParnerData('individual');
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getParnerData('individual');
  }


  getPartnerBySearch() {
    const data = {
      searchText: this.partnername
    }
    this.partnerSpinner = true;
    this.restapi.getPartnersBySearch(data).subscribe((res: any) => {
      if (res.success) {
        this.partnerList = res.response;
        this.partnerSpinner = false;
      } else {
        this.partnerList = [];
        this.partnerSpinner = false;
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
      this.partnerSpinner = false;
    });
  }

  partnerNameById() {
    for(let item of this.partnerList){
      if(this.partnername == item.name){
        this.partnerid = item.id;
         this.getParnerData('individual');
         break;
      }
    }
  }

}
