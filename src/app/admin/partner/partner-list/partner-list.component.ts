import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent  implements OnInit{


  @ViewChild('deleteModal') deleteModal: any;
  id = '' as any
  offset = 0;
  limit = 20;
  partnerList: any = [];
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];

  isPrevious: boolean = true;
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  constructor(private common:CommonService, private restapi:RestApiService, private notifierService:NotifierService, private router:Router,private modalService:NgbModal){}
  ngOnInit(): void {
    this.getPartners()
  }



  getPartners(): any {
    const obj = {
        "limit":this.limit,
        "offset":this.offset
    }
    this.common.loaderStart();
    this.restapi.getPartners(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.partnerList = res.response;
            
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.partnerList = [];
      }
    })
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getPartners();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getPartners();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getPartners();
  }

  add(): any {
    this.router.navigate(['admin/app/add-Partner/0'])
  }

  edit(id: any): any {
    this.router.navigate(['admin/app/add-Partner/' + id])
  }


  


}
