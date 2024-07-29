import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-public-source',
  templateUrl: './public-source.component.html',
  styleUrls: ['./public-source.component.css']
})
export class PublicSourceComponent {
  offset = 0;
  limit = 20;
  publicResourceList: any = {};
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  FILE_URL = '' as any;

  isEdityoutube: boolean = false
  isEdityoutubeErr: boolean = false
  isEditBanner: boolean = false
  isEditBannerErr: boolean = false

  isEditPractice: boolean = false
  isEditPracticeErr: boolean = false


  sourceType: any = ""
  sourceValue: any = ""

  bannerImage: any = ''
  practiceImage: any = ''




  constructor(
    private router: Router,
    private restapi: RestApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) { this.FILE_URL = this.restapi.FILE_URL }

  ngOnInit(): void {
    this.getPublicSource();
  }

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  getPublicSource(): any {
    let obj = {
      "userId": this.common.getUserId()
    }
    this.common.loaderStart();
    this.restapi.getPublicSource(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.publicResourceList = res.response
        this.bannerImage = this.publicResourceList.promobanner
        this.practiceImage = this.publicResourceList.practicebanner
      }
    })
  }


  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getPublicSource();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getPublicSource();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getPublicSource();
  }

  onEditYoutube(): any {
    this.sourceValue = this.publicResourceList.youtubeurl
    this.isEdityoutube = true
  }

  onSaveYoutube(): any {

    if (this.sourceValue == '') {
      this.isEdityoutubeErr = true
      return false
    }

    const data = {
      "sourceType": "youtubeurl",
      "sourceValue": this.sourceValue,
      "userId": this.common.getUserId()
    }
    this.restapi.updatePublicSource(data).subscribe((result: any) => {
      if (result.success) {
        this.isEdityoutube = false
        this.sourceValue = ''
        this.isEdityoutubeErr = false
        this.getPublicSource()
      }
    })
  }


  onEditBanner(): any {
    this.isEditBanner = true
  }

  onSaveBanner(): any {

    if (this.bannerImage == '') {
      this.isEditBannerErr = true
      return false
    }

    const data = {
      "sourceType": "promobanner",
      "sourceValue": this.bannerImage,
      "userId": this.common.getUserId()
    }
    this.restapi.updatePublicSource(data).subscribe((result: any) => {
      if (result.success) {
        this.isEditBanner = false
        this.bannerImage = ''
        this.isEditBannerErr = false
        this.getPublicSource()
      }
    })
  }



  onEditPractice(): any {
    this.isEditPractice = true
  }

  onSavePractice(): any {

    if (this.practiceImage == '') {
      this.isEditPracticeErr = true
      return false
    }

    const data = {
      "sourceType": "practicebanner",
      "sourceValue": this.practiceImage,
      "userId": this.common.getUserId()
    }
    this.restapi.updatePublicSource(data).subscribe((result: any) => {
      if (result.success) {
        this.isEditPractice = false
        this.practiceImage = ''
        this.isEditPracticeErr = false
        this.getPublicSource()
      }
    })
  }

  uploadBtnBanner(): any {
    let elem = document.getElementById('file-input-Banner')
    if (elem) {
      elem.click()
    }
  }



  onFileChangedBanner(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.isEditBannerErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.bannerImage = res.response.fileName;
        }
      })
    }
  }



  uploadBtnPracticeImage(): any {
    let elem = document.getElementById('file-input-Practice')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedPracticeImage(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.isEditPracticeErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.practiceImage = res.response.fileName;
        }
      })
    }
  }




}
