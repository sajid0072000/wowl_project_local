import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent  implements OnInit{
certificateArrList:Array<any>=[]
selectedVal: any = 20;
public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
];
previousBtnDesable: boolean = true;
nextBtnDesable: boolean = false;
offset = 0;
limit = 20;
FILE_URL: any = '';
constructor(private common:CommonService, private router:Router, private restApi:RestApiService){
  this.FILE_URL = this.restApi.GENERATED_PDF_NEW;
}
  ngOnInit(): void {
    window.scrollTo(0, 0);
    if (!this.common.getUserId()) {
      this.router.navigate(['/']);
    }
    this.getCetificate()
  }

  

  getCetificate(){
    let obj = {
        // 'offset':this.offset + '',
        // 'limit': this.limit,
        'userid':this.common.getUserId()
    }
    this.common.loaderStart();
    this.restApi.fetchCertificateForUser(obj).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
            if (res.response) {
                if (res.response.length > 0) {
                    this.certificateArrList = res.response;
                    this.nextBtnDesable = res.response.length < this.limit;
                } else {
                    this.nextBtnDesable = true;
                    this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
                }
            } else {
                this.nextBtnDesable = true;
            }
        } else {
            this.certificateArrList = [];
        }
    })
}


  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getCetificate();
}

previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getCetificate();
    if (this.offset <= 0) {
        this.previousBtnDesable = true;
    }
}

nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getCetificate();
}


downloadPdf(url: any): any {
  if (url) {
    window.open(this.FILE_URL + url, '_blank');
  }
}

}
