import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  public Editor = ClassicEditor;
  FILE_URL: any = ''
  aboutUEG:any=''
  aboutUEGErr:boolean = false;
  aboutWOWL:any=''
  aboutWOWLErr:boolean = false;
  video:any=''
  videoErr:boolean=false;
  trnstatus: any = 0;
  videothumbnail:any=''
  videothumbnailErr:boolean=false
  itemId: any = ''


  constructor(private restapi: RestApiService,
    private notifierService: NotifierService,
    private common: CommonService) {
    this.FILE_URL = this.restapi.FILE_URL
  }

  ngOnInit(): void {
    this.getAbout()
  }


  getAbout() {
    const data: any = {}
    this.common.loaderStart();
    this.restapi.getAbout(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.itemId=res.response.id
        this.aboutUEG=res.response.aboutUEG;
        this.aboutWOWL=res.response.aboutWOWL;
        this.videothumbnail =res.response.videothumbnail;
        this.video=res.response.video;
        setTimeout(() => {
          this.common.getTrancoding(
            'video-container',
            '100%',
            '100%',
            this.video,
            ''
          );
        }, 500);
      } else {
        this.notifierService.notify('error', res.message);
      }
    });
  }

  changeAboutUeg():any{
    this.aboutUEGErr=false
  }

  changeAboutWowl(): any {
    this.aboutWOWLErr = false;
  }

  update(): any {
    this.aboutUEGErr = false;
    this.aboutWOWLErr = false;
    this.videothumbnailErr=false;
    this.videoErr=false
    let err = 0;

    if (this.aboutUEG == '' || this.aboutUEG == null || this.aboutUEG == undefined) {
      this.aboutUEGErr = true;
      err++;
    }
    if (
      this.aboutWOWL == '' ||
      this.aboutWOWL == null ||
      this.aboutWOWL == undefined
    ) {
      this.aboutWOWLErr = true;
      err++;
    }

    if (this.videothumbnail == '' || this.videothumbnail == null || this.videothumbnail == undefined) {
      this.videothumbnailErr = true;
      err++;
    }

    if (this.video == '' || this.video == null || this.video == undefined) {
      this.videoErr = true;
      err++;
    }
    if (err == 0) {
      const data: any = {
        aboutUEG: this.aboutUEG,
        aboutWOWL: this.aboutWOWL,
        video: this.video,
        videothumbnail:this.videothumbnail
      };
      this.common.loaderStart();
      this.restapi.updateAbout(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
        } else {
          this.notifierService.notify('error', res.message);
        }
      });
    }
  }

  resetForm(): any {
    this.aboutUEG = '';
    this.aboutWOWL = '';
    this.videothumbnail = ''
    this.video=''
    this.aboutUEGErr = false;
    this.aboutWOWLErr = false;
    this.videothumbnailErr=false;
    this.videoErr=false
  }

  

  cancelForm(): any {
  }

  UploadVideothumbnailImage(): any {
    let elem = document.getElementById('file-input-videothumbnail')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedvideothumbnailImage(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.videothumbnailErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.videothumbnail = res.response.fileName;
        }
      })
    }
  }

  onFileChange(event: any): void {
    this.video = event.file;
    this.trnstatus = 0;
  }
}
