import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-partner-dashboard',
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.css']
})
export class PartnerDashboardComponent implements OnInit {
  barchartdata: any = [];
  piechartdata: any = []

  limit: any = 10;
  offset: any = 0;
  totalSales: any = '';
  totalAmount: any = '';
  partnerData: any = [];
  partnerid: any = '';

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  selectedVal: any = 20;


  constructor(private common: CommonService, private notifier: NotifierService, private restapi: RestApiService) { }
  ngOnInit(): void {
    this.partnerid = this.common.getPartnerId()
    if (this.partnerid) {
      this.partnerDashboard()
      this.getPartnerTable();
    }
  }

  partnerDashboard() {
    const data = {
      partnerid: Number(this.partnerid),
    }
    this.common.loaderStart();
    this.restapi.partnerDashBoardCount(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {

        this.totalSales = res.response.totalno.totalno;
        if (this.totalSales <= 9) {
          this.totalSales = '0' + this.totalSales
        }
        this.totalAmount = res.response.totalno.totalsales;
        let barchart: any = [];
        let piechart: any = [];
        for (let item of res.response.result) {
          barchart.push({ label: item.month_year, value: item.saleno });
          piechart.push({ label: item.month_year, value: item.saleamount })
        }
        this.barchartdata = barchart;
        this.piechartdata = piechart;
      } else{
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    });
  }


  getPartnerTable(){
    const data = {
      partnerid:this.partnerid,
      limit:this.limit,
      offset:this.offset
    };
    this.common.loaderStart();
    this.restapi.partnerDashboardIndividual(data).subscribe((res:any)=>{
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.partnerData = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else{
        this.partnerData = [];
      }
    },(err:any)=>{
      this.notifier.notify('error',err.error.message);
    })
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getPartnerTable();
    }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getPartnerTable();
        if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getPartnerTable();
    }

}
