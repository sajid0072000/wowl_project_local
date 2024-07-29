import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
declare var Hls: any;

@Component({
  selector: 'app-why-wowl',
  templateUrl: './why-wowl.component.html',
  styleUrls: ['./why-wowl.component.css']
})
export class WhyWowlComponent implements OnInit {


  @ViewChild('deleteModal') deleteModal: any;
  public Editor = ClassicEditor;
  detailsList = [] as any
  itemId: any = ''
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  title: any = ''
  titleErr: any = ''
  description: any = ''
  descriptionErr: any = ''
  upDatebtnFlag: boolean = false;
  logo: any = ''
  logoErr: any = ''

  UPLOAD_URL = '' as any;
  fullScreenImg = '' as any;
  FILE_URL = '' as any;
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  isPrevious: boolean = true;
  offset = 0;
  limit = 20;
  constructor(
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal){

    this.FILE_URL = this.restapi.FILE_URL;

    this.UPLOAD_URL = this.restapi.UPLOAD_URL;

  }

  ngOnInit(): void {
    this.getWhyWowldetails()
  }


  toggleFullScreenImg(flag: number): any {
    const elem = document.getElementById('fulldiv');
    if (elem) {
      elem.style.display = flag === 0 ? 'none' : 'block';
    }
  }


  getWhyWowldetails(): any {
    let data = {
      "offset": this.offset,
      "limit": this.limit
    }
    this.commonservice.loaderStart();
    this.restapi.getWhyWowl(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.detailsList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.detailsList = [];
      }
    })
  }

  addwhywowlDetails(): any {
    this.titleErr= ''
    this.descriptionErr = ''
    this.logoErr = ''
    let err = 0
    if (this.title == '' || this.title == null || this.title == undefined) {
      this.titleErr = 'Title is required';
      err++;
    }
    if (this.description == '' || this.description == null || this.description == undefined) {
      this.descriptionErr= 'Description is Required';
      err++;
    }
    if (this.logo == '' || this.logo == null || this.logo == undefined) {
      this.logoErr = 'Please Upload  Logo';
      err++
    }
    if (err == 0) {
      const data = {
        "title": this.title,
        "logo": this.logo,
        "description": this.description
      }
      this.commonservice.loaderStart()
      this.restapi.addWhyWowl(data).subscribe((res: any) => {
        this.commonservice.loaderEnd()
        if (res.success) {
          this.notifierService.notify('success', res.message)
          this.resetForm()
          this.getWhyWowldetails()
          this.closeModal()
        } else {
          this.notifierService.notify('error', res.message);
        }
      }, (err) => {
        this.notifierService.notify('error', err.error.message);
      })
    }
  }



  edit(item: any, modal: any): any {
    this.itemId = item.id
    this.title = item.title
    this.description = item.description
    this.logo = item.logo
    this.modalService.open(modal, { centered: true, size: 'lg' })
  }

  updateWhyWowldetails(): any {
    this.titleErr = ''
    this.descriptionErr = ''
    this.logoErr = ''
    let err = 0
    if (this.title == '' || this.title == null || this.title == undefined) {
      this.titleErr = 'Title is required';
      err++;
    }
    if (this.description == '' || this.description == null || this.description == undefined) {
      this.descriptionErr = 'Description  Required';
      err++;
    }
    if (this.logo == '' || this.logo == null || this.logo == undefined) {
      this.logoErr = 'Please Upload Logo';
      err++
    }
    if (err == 0) {
      const data = {
        "id": this.itemId,
        "title": this.title,
        "logo": this.logo,
        "description": this.description
      }
      this.commonservice.loaderStart()
      this.restapi.updateWhyWowl(data).subscribe((res: any) => {
        this.commonservice.loaderEnd()
        if (res.success) {
          this.notifierService.notify('success', res.message)
          this.getWhyWowldetails()
          this.resetForm()
          this.closeModal()
        } else {
          this.notifierService.notify('error', res.message);
        }
      }, (err) => {
        this.notifierService.notify('error', err.error.message);
      })
    }
  }


  resetForm(): any {
    this.itemId = ''
    this.title = ''
    this.description= ''
    this.logo = ''
    this.titleErr = ''
    this.descriptionErr = ''
    this.logoErr = ''
  }


  onClickDelete(id: any): any {
    this.itemId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }




  deletewhyWowl() {
    const data = {
      id: this.itemId
    };
    this.commonservice.loaderStart();
    this.restapi.deleteWhyWowl(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.closeModal();
        this.getWhyWowldetails();
        this.notifierService.notify('success', res.message);
      } else {
        this.notifierService.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    })
  }

  changeTileFun(): any {
    this.titleErr = ''
  }

  changeDescriptionFun(): any {
    this.descriptionErr = ''
  }
  uploadLogoImage(): any {
    let elem = document.getElementById('file-input-whyWowl');
    if (elem) {
      elem.click();
    }
  }

  onFileChangedWhywowlImage(event: any): any {
    this.logoErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.logo = res.response.fileName;
        }
      });
    }
  }



  closeModal(): any {
    this.modalService.dismissAll();
  }

  
  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getWhyWowldetails();
  }


  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getWhyWowldetails();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }



  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getWhyWowldetails();
  }
  
  openAddModal(modal: any): any {
    this.resetForm()
    this.modalService.open(modal, { centered: true, size: "lg" });
  }
 

}
