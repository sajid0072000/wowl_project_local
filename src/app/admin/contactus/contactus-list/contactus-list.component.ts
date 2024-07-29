import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NotifierService } from "angular-notifier";
import { saveAs } from 'file-saver'
@Component({
  selector: 'app-contactus-list',
  templateUrl: './contactus-list.component.html',
  styleUrls: ['./contactus-list.component.css']
})
export class ContactusListComponent implements OnInit {
  offset = 0;
  limit = 20;
  contactusdetailslistArr: any = [];
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  selectedVal: any = 20;


  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  isPrevious: boolean = true;



  constructor(
    private restapi: RestApiService,
    private common: CommonService,
    private notifierService: NotifierService
  ) {

  }
  ngOnInit(): void {
    this.getcontactusDetails()
  }

  downloadlistContactUsExl(): any {
    const data = {
      "userId": this.common.getUserId()
    }
    this.common.loaderStart()
    this.restapi.contactUsExl(data).subscribe((res: any) => {
      this.common.loaderEnd()
      if (res.success) {
        this.notifierService.notify('success', res.message)
        saveAs(this.restapi.GENERATED_PDF_URL + res.response, "contactUsExl.xlsx")
      } else {
        this.notifierService.notify('error', res.message)
      }
    })
  }


  getcontactusDetails(): any {
    const data = {
      "limit": this.limit,
      "offset": this.offset
    }
    this.common.loaderStart();
    this.restapi.getContactUsDetails(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.contactusdetailslistArr = res.response;

            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.contactusdetailslistArr = []
      }
    }, (err: any) => {
      this.notifierService.notify("success", err.error.message)

    });
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getcontactusDetails();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getcontactusDetails();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getcontactusDetails();
  }

}
