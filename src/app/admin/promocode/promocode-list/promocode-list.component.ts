import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-promocode-list',
  templateUrl: './promocode-list.component.html',
  styleUrls: ['./promocode-list.component.css']
})
export class PromocodeListComponent implements OnInit {

  promocodeList: any = [];
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  offset = 0;
  limit = 20;
  selectedVal: any = 10;
  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];

  constructor(private restapi: RestApiService, private common: CommonService, private notifier: NotifierService, private router: Router) { }
  ngOnInit(): void {
    this.getAllPromocode();
  }

  getAllPromocode() {
    const data = {
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.restapi.getAllPromocode(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            for (let item of res.response) {
              item.validityStartDate = this.common.formatDate(item.validityStartDate);
              item.validityEndDate = this.common.formatDate(item.validityEndDate);
            }
            this.promocodeList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else{
        this.promocodeList = [];
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    })
  }

  gotoAdd() {
    this.router.navigate(["admin/app/add-promocode/0"]);
  }
  gotoEdit(id: any) {
    this.router.navigate(["admin/app/add-promocode/" + id]);
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getAllPromocode();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getAllPromocode();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getAllPromocode();
  }
}
