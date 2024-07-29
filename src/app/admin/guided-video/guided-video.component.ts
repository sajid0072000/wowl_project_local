import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-guided-video',
  templateUrl: './guided-video.component.html',
  styleUrls: ['./guided-video.component.css'],
})
export class GuidedVideoComponent implements OnInit {
  public Editor = ClassicEditor;

  description: any = '';
  descriptionErr: any;
  title: any;
  titleErr: any;
  video: any;
  videoErr: any;
  teacherLead: any;
  learningGuide: any;

  teacher_lead: any = {};
  learning_guided: any = {};

  teacher_lead_video: any = '';
  learning_guided_video: any = '';
  trnstatus: any = 0;
  thumbnailImage: any = ""

  thumbnailImageErr: any = false

  FILE_URL:any=''
  videokeys: any = [];
  videoObj: any = {};
  type: any = '';
  isView: boolean = false;

  constructor(
    private restapi: RestApiService,
    private notifierService: NotifierService,
    private common: CommonService
  ) { this.FILE_URL = this.restapi.FILE_URL}
  ngOnInit(): void {
    this.getGuidedVideo();
  }

  changeDecs(): any {
    this.descriptionErr = false;
  }

  onFileChange(event: any): void {
    this.video = event.file;
    this.trnstatus = 0;
  }

  update(): any {
    this.titleErr = false;
    this.videoErr = false;
    this.descriptionErr = false;

    let err = 0;

    if (this.title == '' || this.title == null || this.title == undefined) {
      this.titleErr = true;
      err++;
    }

    if (this.video == '' || this.video == null || this.video == undefined) {
      this.videoErr = true;
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

    if (err == 0) {
      const data: any = {
        title: this.title,
        description: this.description,
        thumbnailImage:this.thumbnailImage,
        video: this.video,
        type: this.type,
        trnstatus: this.trnstatus + '',
      };
      this.common.loaderStart();
      this.restapi.updateGuidedVideo(data).subscribe((res: any) => {
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
    this.video = '';
    this.description = '';
    this.type = '';
    this.titleErr = false;
    this.videoErr = false;
    this.descriptionErr = false;
  }

  

  getGuidedVideo(): any {
    const data: any = {};
    this.common.loaderStart();
    this.restapi.getGuidedVideo(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.videokeys = Object.keys(res.response);
        this.videoObj = res.response;
      } else {
        this.notifierService.notify('error', res.message);
      }
    });
  }

  groupBy(objectArray: any, property: any) {
    return objectArray.reduce(function (acc: any, obj: any) {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  

  edit(item: any): any {
    this.type = item;
    this.isView = true;
    this.titleErr = false;
    this.videoErr = false;
    this.descriptionErr = false;

    const temp: any = this.videoObj[item];
    this.title = temp.title;

    this.description = temp.description;
    this.trnstatus = temp.trnstatus;
    this.video = temp.video;
    this.thumbnailImage = temp.thumbnailImage

    if (temp.trnstatus === 1) {
      setTimeout(() => {
        this.common.getTrancoding(
          'video-container',
          '100%',
          '100%',
          this.video,
          ''
        );
      }, 500);
      
    }

  }

  cancelForm(): any {
    this.type = '';
    this.isView = false;
  }

  uploadBtnthumbnailImage(): any {
    let elem = document.getElementById('file-input-thumbnailImage')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedthumbnailImage(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.thumbnailImageErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.thumbnailImage = res.response.fileName;
        }
      })
    }
  }
}
