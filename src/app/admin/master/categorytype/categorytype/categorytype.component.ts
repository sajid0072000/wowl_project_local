import { Component, OnInit, ViewChild } from "@angular/core";
import { NotifierService } from "angular-notifier";
import { RestApiService } from "src/app/rest-api.service";
import { CommonService } from "src/app/common.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

declare var Hls: any;


@Component({
  selector: "app-categorytype",
  templateUrl: "./categorytype.component.html",
  styleUrls: ["./categorytype.component.css"],
})
export class CategorytypeComponent {
  public Editor = ClassicEditor;

  name: any = "";
  description: any = "";
  thumbnailImage: any = "";
  logo: any = "";
  bannerImage: any = "";
  whylearnlangwithwowl: any = "";
  demovideo: any = "";
  Hidden: boolean = false;


  nameErr: any = "";
  descriptionErr: any = "";
  thumbnailImageErr: any = "";
  logoErr: any = "";
  bannerImageErr: any = "";
  whylearnlangwithwowlErr: any = "";
  demovideoErr: any = "";




  categorytype: any = "";
  categorytypeList: any = [];
  categoryTypeId: any = "";
  hidecategory: boolean = false;
  isHidden: any = "";
  categorytypeId: any = "";
  searchText: any = "";
  offset = 0;
  limit = 20;
  isActive = 0;
  isPrevious: boolean = true;

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  videothumbnailErr: any = ''
  videothumbnail: any = ''
  popupimg: any = ''
  popupimgErr: any = ''
  popupactivate: any = false
  landingtitle: any = ''
  landingtitleErr: any = ''




  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];

  FILE_URL = '' as any;
  fullScreenImg = '' as any;
  Video_URL = '' as any;
  UPLOAD_URL = '' as any;
  trncstatus = 0;



  @ViewChild("deleteModal") deleteModal: any;
  @ViewChild("addmodal") addmodal: any;
  constructor(
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private restapi: RestApiService,
    private modalService: NgbModal
  ) {
    this.FILE_URL = this.restapi.FILE_URL;
    this.Video_URL = this.restapi.Video_URL;
    this.UPLOAD_URL = this.restapi.UPLOAD_URL;
  }

  ngOnInit(): void {
    this.getcategoryType();
  }






  uploadBtnLogoImage(): any {
    let elem = document.getElementById('file-input-logoImage')
    if (elem) {
      elem.click()
    }
  }



  onFileChangedLogoImage(event: any): any {
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
      })
    }
  }



  uploadBtnvideothumbnail(): any {
    let elem = document.getElementById('file-input-Video-Thumbnail')
    if (elem) {
      elem.click()
    }
  }



  onFileChangedvideothumbnail(event: any): any {
    this.videothumbnailErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.videothumbnail = res.response.fileName;
        }
      })
    }
  }



  uploadBtnPopup(): any {
    let elem = document.getElementById('file-input-Pop-up')
    if (elem) {
      elem.click()
    }
  }



  onFileChangedPopup(event: any): any {
    this.popupimgErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.popupimg = res.response.fileName;
        }
      })
    }
  }





  uploadBtnthumbnailImage(): any {
    let elem = document.getElementById('file-input-thumbnailImage')
    if (elem) {
      elem.click()
    }
  }



  uploadBtnbannerImage(): any {
    let elem = document.getElementById('file-input-bannerImage')
    if (elem) {
      elem.click()
    }
  }




  uploadBtndemovideo(): any {
    let elem = document.getElementById('file-input-demovideo')
    if (elem) {
      elem.click()
    }
  }



  onFileChangedthumbnailImage(event: any): any {
    this.thumbnailImageErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.thumbnailImage = res.response.fileName;
        }
      })
    }
  }


  onFileChangedbannerImage(event: any): any {
    this.bannerImageErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.bannerImage = res.response.fileName;
        }
      })
    }
  }
  onFileChangeddemovideo(event: any): any {
    this.demovideoErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.demovideo = res.response.fileName;
        }
      })
    }
  }

  imagePopUp(): any {
    this.fullScreenImg = this.FILE_URL + this.bannerImage;
    this.toggleFullScreenImg(1);
  }

  toggleFullScreenImg(flag: number): any {
    const elem = document.getElementById('fulldiv');
    if (elem) {
      elem.style.display = flag === 0 ? 'none' : 'block';
    }
  }

  enableActive(e: any): any {
    const checked = e.target.checked == 0 ? 0 : 1;
    const checkedValue = e.target.value;
    const data = {
      categoryTypeId: checkedValue,
      Hidden: checked + "",
    };

    this.commonservice.loaderStart();
    this.restapi.updateHidden(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.notifierService.notify("success", res.message);
        this.getcategoryType();
      } else {
        this.notifierService.notify("error", res.message);
      }
    });
  }


  gotoAdd() {
    this.categoryTypeId = '';
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false });
  }

  gotoEdit(data: any) {
    console.log(data);
    this.categoryTypeId = data.categoryTypeId;
    this.name = data.name;
    this.bannerImage = data.bannerImage
    this.description = data.description
    this.thumbnailImage = data.thumbnailImage;
    this.logo = data.logo;
    this.whylearnlangwithwowl = data.whylearnlangwithwowl;
    this.demovideo = data.demovideo;
    this.Hidden = data.Hidden === 0 ? false : true;
    this.videothumbnail = data.videothumbnail;
    this.landingtitle = data.landingtitle
    this.popupimg = data.popupimg
    this.popupactivate = data.popupactivate === 0 ? false : true
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.commonservice.setSearchText(this.searchText)
    this.modalService.open(this.addmodal, {
      centered: true,
      size: "lg",
      backdrop: false,
    });

    this.trncstatus = data.trncstatus;
    if (this.trncstatus == 1) {
      const video = document.createElement('video');
      const vContainer: any = document.getElementById('video-container');
      vContainer.innerHTML = '';
      video.id = 'video';
      video.className = 'urlvideoplayer';
      video.controls = true;
      video.style.width = '200px';
      video.style.height = '140px';
      video.style.cursor = 'pointer';
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(this.Video_URL + this.demovideo);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.Video_URL + this.demovideo;
        video.addEventListener('loadedmetadata', () => {
          // video.play();
        });
      }
      vContainer.appendChild(video);
    }
  }

  getcategoryType() {
    const obj = {
      offset: this.offset,
      limit: this.limit,
      searchText: this.searchText
    };
    this.commonservice.loaderStart();
    this.restapi.fetchCategoryType(obj).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();

        if (res.success) {
          if (res.response) {
            if (res.response.length > 0) {
              this.categorytypeList = res.response;
              this.nextBtnDesable = res.response.length < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          } else {
            this.nextBtnDesable = true;
          }
        } else {
          this.categorytypeList = [];
        }
      }, (err: any) => { }
    );
  }

  changeNameFun(): any {
    this.nameErr = '';
  }

  changeDescriptionFun(): any {
    this.descriptionErr = '';
  }

  changelandingtitleFun(): any {
    this.landingtitleErr = ''
  }
  changeWhylearnlangwithwowlFun(): any {
    this.whylearnlangwithwowlErr = '';
  }

  addCategorytype(): any {
    this.logoErr = "";
    this.nameErr = "";
    this.descriptionErr = "";
    this.thumbnailImageErr = "";
    this.bannerImageErr = "";
    this.whylearnlangwithwowlErr = "";
    this.demovideoErr = "";
    this.landingtitleErr = ''
    this.popupimgErr = ''
    this.videothumbnailErr = ''


    let err = 0

    if (this.name == '' || this.name == null || this.name == undefined) {
      this.nameErr = "Name required";
      err++;
    }

    if (this.landingtitle == '' || this.landingtitle == null || this.landingtitle == undefined) {
      this.landingtitleErr = "Landing title required";
      err++;
    }

    if (this.description == '' || this.description == null || this.description == undefined) {
      this.descriptionErr = "Description required";
      err++;
    }

    if (this.logo == '' || this.logo == null || this.logo == undefined) {
      this.logoErr = "Logo required";
      err++;
    }

    if (this.thumbnailImage == '' || this.thumbnailImage == null || this.thumbnailImage == undefined) {
      this.thumbnailImageErr = "Thumbnail image required";
      err++;
    }


    if (this.bannerImage == '' || this.bannerImage == null || this.bannerImage == undefined) {
      this.bannerImageErr = "Banner image required";
      err++;
    }

    if (this.whylearnlangwithwowl == '' || this.whylearnlangwithwowl == null || this.whylearnlangwithwowl == undefined) {
      this.whylearnlangwithwowlErr = "Why learn lang with wowl required";
      err++;
    }

    if (this.demovideo == '' || this.demovideo == null || this.demovideo == undefined) {
      this.demovideoErr = "Demo video required";
      err++;
    }

    if (this.videothumbnail == '' || this.videothumbnail == null || this.videothumbnail == undefined) {
      this.videothumbnailErr = "Video Thumbnail image required";
      err++;
    }

    if (this.popupimg == '' || this.popupimg == null || this.popupimg == undefined) {
      this.popupimgErr = "Pop up image required";
      err++;
    }

    if (err == 0) {

      const obj = {
        "name": this.name,
        "description": this.description,
        "logo": this.logo,
        "thumbnailImage": this.thumbnailImage,
        "bannerImage": this.bannerImage,
        "whylearnlangwithwowl": this.whylearnlangwithwowl,
        "demovideo": this.demovideo,
        "Hidden": this.Hidden === false ? '0' : '1',
        "videothumbnail": this.videothumbnail,
        "landingtitle": this.landingtitle,
        "popupimg": this.popupimg,
        "popupactivate": this.popupactivate === false ? '0' : '1'

      }

      this.commonservice.loaderStart();
      this.restapi.insertCategoryType(obj).subscribe(
        (res: any) => {
          this.commonservice.loaderEnd();
          if (res.success) {
            this.closeAddModal();
            this.getcategoryType();
            this.resetForm();
            this.notifierService.notify("success", res.message);
          } else {
            this.notifierService.notify("error", res.message);
          }
        },
        (err: any) => {
          this.notifierService.notify("error", err.error.message);
        }
      );


    }

  }
  updateCategorytype(): any {
    this.nameErr = "";
    this.descriptionErr = "";
    this.thumbnailImageErr = "";
    this.logoErr = "";
    this.bannerImageErr = "";
    this.whylearnlangwithwowlErr = "";
    this.demovideoErr = "";
    this.landingtitleErr = ''
    this.popupimgErr = ''
    this.videothumbnailErr = ''

    let err = 0

    if (this.name == '' || this.name == null || this.name == undefined) {
      this.nameErr = "Name required";
      err++;
    }

    if (this.landingtitle == '' || this.landingtitle == null || this.landingtitle == undefined) {
      this.landingtitleErr = "Landing title required";
      err++;
    }


    if (this.description == '' || this.description == null || this.description == undefined) {
      this.descriptionErr = "Description required";
      err++;
    }

    if (this.logo == '' || this.logo == null || this.logo == undefined) {
      this.logoErr = "Logo required";
      err++;
    }

    if (this.thumbnailImage == '' || this.thumbnailImage == null || this.thumbnailImage == undefined) {
      this.thumbnailImageErr = "Thumbnail image required";
      err++;
    }

    if (this.bannerImage == '' || this.bannerImage == null || this.bannerImage == undefined) {
      this.bannerImageErr = "Banner image required";
      err++;
    }

    if (this.whylearnlangwithwowl == '' || this.whylearnlangwithwowl == null || this.whylearnlangwithwowl == undefined) {
      this.whylearnlangwithwowlErr = "Why learn lang with wowl required";
      err++;
    }

    if (this.demovideo == '' || this.demovideo == null || this.demovideo == undefined) {
      this.demovideoErr = "Demo video required";
      err++;
    }

    if (this.videothumbnail == '' || this.videothumbnail == null || this.videothumbnail == undefined) {
      this.videothumbnailErr = "Video Thumbnail image required";
      err++;
    }

    if (this.popupimg == '' || this.popupimg == null || this.popupimg == undefined) {
      this.popupimgErr = "Pop up image required";
      err++;
    }

    if (err == 0) {

      const obj = {
        categoryTypeId: this.categoryTypeId,
        "name": this.name,
        "description": this.description,
        "logo": this.logo,
        "thumbnailImage": this.thumbnailImage,
        "bannerImage": this.bannerImage,
        "whylearnlangwithwowl": this.whylearnlangwithwowl,
        "demovideo": this.demovideo,
        "Hidden": this.Hidden === false ? '0' : '1',
        "trncstatus": this.trncstatus + '',
        "videothumbnail": this.videothumbnail,
        "landingtitle": this.landingtitle,
        "popupimg": this.popupimg,
        "popupactivate": this.popupactivate === false ? '0' : '1'
      };

      this.commonservice.loaderStart();
      this.restapi.updateName(obj).subscribe(
        (res: any) => {
          this.commonservice.loaderEnd();
          if (res.success) {
            this.notifierService.notify("success", res.message);
            this.resetForm();
            if (this.commonservice.getLimit()) {
              this.limit = this.commonservice.getLimit()
            }
            if (this.commonservice.getOffset()) {
              this.offset = this.commonservice.getOffset()
            }
            if (this.commonservice.getSearchText()) {
              this.searchText = this.commonservice.getSearchText()
            }
            this.closeModal();
            this.getcategoryType();
          } else {
            this.notifierService.notify("error", res.message);
          }
        },
        (err: any) => {
          this.notifierService.notify("error", err.error.message);
        }
      );
    }
  }

  closeAddModal() {
    this.resetForm();
    this.modalService.dismissAll();
  }

  deleteCategorytype() {
    const obj = {
      categoryTypeId: this.categoryTypeId
    };
    this.commonservice.loaderStart();
    this.restapi.deletedCategoryType(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.closeModal();
        this.getcategoryType();
        this.notifierService.notify('success', res.message);
      } else {
        this.notifierService.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    })
  }
  onClickDelete(id: any): any {
    this.categoryTypeId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  closeModal(): any {
    this.categoryTypeId = "";
    this.modalService.dismissAll();
  }


  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getcategoryType();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getcategoryType();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getcategoryType();
  }

  resetForm() {
    this.categoryTypeId = "";
    this.name = "";
    this.description = "";
    this.logo = "";
    this.thumbnailImage = "";
    this.bannerImage = "";
    this.whylearnlangwithwowl = "";
    this.demovideo = "";
    this.Hidden = false;
    this.nameErr = "";
    this.descriptionErr = "";
    this.thumbnailImageErr = "";
    this.bannerImageErr = "";
    this.whylearnlangwithwowlErr = "";
    this.demovideoErr = "";
  }

  onEnter() {
    this.getcategoryType();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getcategoryType();
    }
    if (this.searchText.length == 0) {
      this.getcategoryType();
    }
  }


  onFileChange(event: any): void {
    this.demovideo = event.file;
    this.trncstatus = 0;
  }
}
