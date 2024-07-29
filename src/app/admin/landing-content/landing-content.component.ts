import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-landing-content',
  templateUrl: './landing-content.component.html',
  styleUrls: ['./landing-content.component.css']
})
export class LandingContentComponent implements OnInit {

  public Editor = ClassicEditor;
  landingContentArr: any = [];
  description: any = '';
  descriptionErr: any;
  title: any;
  titleErr: any;
  contentimg: any = ""
  contentimgErr: any = false
  offset = 0;
  limit = 20;
  FILE_URL: any = ''

  type: any = '';
  isView: boolean = false;
  itemId: any = ''

  constructor(private restapi: RestApiService,
    private notifierService: NotifierService,
    private common: CommonService) {
    this.FILE_URL = this.restapi.FILE_URL

  }

  ngOnInit(): void {
    this.getLandingContent()
  }


  getLandingContent() {
    const data: any = {
      "limit": this.limit,
      "offset": this.offset
    }
    this.common.loaderStart();
    this.restapi.getLandingContent(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.success);
      if (res.success) {
        this.landingContentArr = res.response;
      } else {
        this.notifierService.notify('error', res.message);
      }
    });
  }

  changeDecs(): any {
    this.descriptionErr = false;
  }


  update(): any {
    this.titleErr = false;
    this.descriptionErr = false;
    this.contentimgErr = false;
    let err = 0;

    if (this.title == '' || this.title == null || this.title == undefined) {
      this.titleErr = true;
      err++;
    }
    if (
      this.description == '' ||
      this.description == null ||
      this.description == undefined
    ) {
      this.descriptionErr = true;
      err++;
    }

    if (this.contentimg == '' || this.contentimg == null || this.contentimg == undefined) {
      this.contentimgErr = true;
      err++;
    }
    if (err == 0) {
      const data: any = {
        id: this.itemId,
        title: this.title,
        description: this.description,
        contentimg: this.contentimg,
      };
      this.common.loaderStart();
      this.restapi.updateLandingContent(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.isView = false;
        } else {
          this.notifierService.notify('error', res.message);
        }
      });
    }
  }

  resetForm(): any {
    this.title = '';
    this.description = '';
    this.contentimg = ''
    this.titleErr = false;
    this.descriptionErr = false;
    this.contentimgErr = false;
  }

  edit(item: any): any {
    console.log(item,">>>>>>>>>");
    this.itemId = item.id;
    this.type = item;
    this.isView = true;
    this.titleErr = false;
    this.contentimgErr=false
    this.descriptionErr = false;
    this.title=item.title
    this.description=item.description
    this.contentimg=item.contentimg
  }

  cancelForm(): any {
    this.type = '';
    this.isView = false;
  }

  uploadBtnContentImage(): any {
    let elem = document.getElementById('file-input-contentImgage')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedcontentImage(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.contentimgErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.contentimg = res.response.fileName;
        }
      })
    }
  }



}
