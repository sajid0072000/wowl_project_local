import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotifierService } from "angular-notifier";
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var Hls: any;

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {

  @ViewChild('deleteModal') deleteModal: any;
  public Editor = ClassicEditor;
  public Editor1 = ClassicEditor;


  coursename: any = ""
  coursetypeid: any = ''


  courseInfo: any = [
    {
      "value": "",
      "valueErr": false,
    }
  ]


  upcomingArr: any = [
    {
      "value": "",
      "valueErr": false,
    }
  ]


  longdesc: any = ""
  thumbnailImage: any = ""
  coursebanner: any = ""
  coursevideourl: any = ""
  syllabus: any = ""
  outcomesList: any = [
    {
      "outcomes": "",
      "outcomesErr": false,
    }
  ]
  categoryList: any = [];
  coursecode: any = ""
  educatorid: any = ''


  coursenameErr: any = false
  coursetypeidErr: any = false
  longdescErr: any = false
  thumbnailImageErr: any = false
  coursebannerErr: any = false
  coursevideourlErr: any = false
  syllabusErr: any = false
  outcomesListErr: any = false
  categoryListErr: any = false
  selfaccessErr: any = false
  coursecodeErr: any = false
  educatoridErr: any = false

  FILE_URL = '' as any;

  courseid = '' as any
  categoryTypeArr = [] as any
  // categoriesList: any = [];
  fullScreenImg = '' as any;
  fullScreenVideo = '' as any


  categoriesSpinner: boolean = false
  spinnerEducator: boolean = false

  userType = 0;

  educatorname: any = ''
  educatorArr: any = []
  Video_URL = '' as any;
  UPLOAD_URL = '' as any;
  trncstatus = 0;
  selflearning = true
  isliveSelf: boolean = false;

  ispaid: boolean = false


  selfAccess: any = ''
  selfAccessErr: boolean = false;
  categoriesArr: any = [];
  categoriesName: any = '';

  lessionbannerimg: any = ''
  lessionbannerimgErr: boolean = false
  courseseq: any = ''
  courseseqErr: boolean = false

  videothumbnail:any=''
  videothumbnailErr:boolean = false


  constructor(
    private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private notifierService: NotifierService,
    private common: CommonService,
    private modalService: NgbModal,
  ) {
    this.FILE_URL = this.restapi.FILE_URL;
    this.Video_URL = this.restapi.Video_URL;
    this.UPLOAD_URL = this.restapi.UPLOAD_URL;

  }

  ngOnInit(): void {
    this.userType = this.common.getUserType();
    if (this.userType != 1) {
      this.educatorid = this.common.getUserId();
    }
    this.courseid = this.actroute.snapshot.params['id'];
    if (this.courseid == 0) {
      this.courseid = null
    }
    if (this.courseid) {
      this.getCourseById();
    }
    this.getCategoryType();

  }

  addMore(): any {
    this.outcomesList.push(
      {
        "outcomes": "",
        "outcomesErr": false,
      }
    )
  }

  addMoreInfo(): any {
    this.courseInfo.push(
      {
        "value": "",
        "valueErr": false,
      }
    )
  }


  addMoreUpcoming(): any {
    this.upcomingArr.push(
      {
        "value": "",
        "valueErr": false,
      }
    )
  }

  goToPreview(): any {
    let url = this.restapi.SERVER_BASE + '/course-details/' + this.courseid;
    window.open(url, '_blank');
  }

  searchCategoriesByName(): any {
    this.categoryListErr = false
    if(this.categoriesName.length % 3 ===0){
      let obj = {
        searchText: this.categoriesName,
        categoryTypeId: this.coursetypeid
      };
      this.categoriesSpinner = true
      this.restapi.getCategories(obj).subscribe((res: any) => {
        this.categoriesSpinner = false
        if (res.success) {
          this.categoriesArr = res.response;
  
        } else {
          this.categoriesArr = []
        }
      });
    }
  }


  getCategoriesIdByName(): any {
    this.categoryListErr = false
    this.isliveSelf = false;

    for (let data of this.categoriesArr) {
      if (data.name === this.categoriesName) {
        if (data.islive === 0) {
          this.isliveSelf = true
        }
        this.categoryList.push({ categoriesid: data.categoriesid })
        break;
      }
    }
  }


  getCourseById(): any {
    const data = {
      "courseid": this.courseid
    };
    this.common.loaderStart();
    this.restapi.getCourseById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {

        this.coursename = res.response.coursename;
        this.coursetypeid = res.response.coursetypeid;
        this.courseInfo = []
        for (let obj of res.response.shortdesc.split("|")) {
          this.courseInfo.push({ "value": obj, "valueErr": false })
        }
        this.outcomesList = []
        for (let obj of res.response.learningOutcomes) {
          this.outcomesList.push({ "outcomes": obj.outcomes, "outcomesErr": false })
        }

        this.categoryList.push({ categoriesid: res.response.category.categoriesId })
        this.categoriesName = res.response.category.name;
        if (res.response.category.islive == 0) {
          this.isliveSelf = true;
          this.selfAccess = res.response.selfaccess;
        } else {
          this.isliveSelf = false;
          this.upcomingArr = []
          for (let obj of res.response.selfaccess.split("|")) {
            this.upcomingArr.push({ "value": obj, "valueErr": false });
          }
        }

        this.longdesc = res.response.longdesc;
        this.thumbnailImage = res.response.coursephoto;
        this.coursebanner = res.response.coursebanner;
        this.coursevideourl = res.response.coursevideourl;
        this.syllabus = res.response.syllabus;

        // this.educatorid = res.response.educatorList.educatorid;
        this.educatorname = res.response.educatorList.educatorname;
        this.coursecode = res.response.coursecode;
        this.trncstatus = res.response.trncstatus;
        this.lessionbannerimg = res.response.lessionbannerimg
        this.courseseq = res.response.courseseq
        this.ispaid = res.response.ispaid === 1 ? true : false
        this.videothumbnail = res.response.videothumbnail
        const educator = [];
        for (let obj of res.response.educatorList) {
          educator.push({
            educatorid: obj.educatorid, educatorname: obj.educatorname
          })
        }
        this.educatorList = educator;

        if (this.trncstatus == 1) {
          const video = document.createElement('video');
          const vContainer: any = document.getElementById('video-container');
          video.id = 'video';
          video.className = 'urlvideoplayer';
          video.controls = true;
          video.style.width = '200px';
          video.style.height = '140px';
          video.style.cursor = 'pointer';
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(this.Video_URL + this.coursevideourl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              // video.play();
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = this.Video_URL + this.coursevideourl;
            video.addEventListener('loadedmetadata', () => {
              // video.play();
            });
          }
          vContainer.appendChild(video);
        }


        setTimeout(() => {
          this.searchEducatorByName()
        }, 500);


      }
    });
  }


  getCategoryType(): any {
    const data = {
      "searchText": ""
    }
    this.common.loaderStart();
    this.restapi.getCategoryType(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.categoryTypeArr = res.response
      } else {
        this.categoryTypeArr = []
      }
    });
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


  uploadBtnBanner(): any {
    let elem = document.getElementById('file-input-Banner')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedBanner(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.coursebannerErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.coursebanner = res.response.fileName;
        }
      })
    }
  }




  uploadBtnLessionBanner(): any {
    let elem = document.getElementById('file-input-Lession-Banner')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedLessionBanner(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.lessionbannerimgErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.lessionbannerimg = res.response.fileName;
        }
      })
    }
  }


  uploadBtnVideothumbnailImage(): any {
    let elem = document.getElementById('Video-Thumbnail')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedVideothumbnailImage(event: any): any {
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


  uploadEditBtn(): any {
    let elem = document.getElementById('file-input-video')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedVideo(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.coursevideourlErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.coursevideourl = res.response.fileName;
        }
      })
    }
  }

  uploadEditBtnSyllabus(): any {
    let elem = document.getElementById('file-input-Syllabus')
    if (elem) {
      elem.click()
    }
  }

  onFileChangedSyllabus(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.syllabusErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.syllabus = res.response.fileName;
        }
      })
    }
  }


  add(): any {
    this.coursenameErr = false
    this.coursetypeidErr = false
    this.longdescErr = false
    this.thumbnailImageErr = false
    this.coursebannerErr = false
    this.coursevideourlErr = false
    this.syllabusErr = false
    this.categoryListErr = false
    this.selfaccessErr = false
    this.coursecodeErr = false
    this.educatoridErr = false
    this.selfAccessErr = false
    this.courseseqErr = false
    this.lessionbannerimgErr = false
    this.videothumbnailErr = false


    for (let obj of this.outcomesList) {
      obj.outcomesErr = false
    }

    for (let obj of this.upcomingArr) {
      obj.valueErr = false
    }

    let err = 0

    let category = []

    for (let cat of this.categoryList) {
      category.push({ "coursecategoryid": cat.categoriesid })
    }

    let educator: any = []

    for (let edu of this.educatorList) {
      educator.push({ "educatorid": edu.educatorid })
    }



    if (this.coursename == '' || this.coursename == null || this.coursename == undefined) {
      this.coursenameErr = true;
      err++
    }

    if (this.coursetypeid == '' || this.coursetypeid == null || this.coursetypeid == undefined) {
      this.coursetypeidErr = true
      err++
    }
    if (category.length == 0) {
      this.categoryListErr = true
      err++
    }

    if (educator.length == 0) {
      this.educatoridErr = true
      err++
    }

    if (this.thumbnailImage == '' || this.thumbnailImage == null || this.thumbnailImage == undefined) {
      this.thumbnailImageErr = true
      err++
    }


    if (this.coursebanner == '' || this.coursebanner == null || this.coursebanner == undefined) {
      this.coursebannerErr = true
      err++
    }

    if (this.lessionbannerimg == '' || this.lessionbannerimg == null || this.lessionbannerimg == undefined) {
      this.lessionbannerimgErr = true
      err++
    }

    if (this.videothumbnail == '' || this.videothumbnail == null || this.videothumbnail == undefined) {
      this.videothumbnailErr = true
      err++
    }

    // if (this.syllabus == '' || this.syllabus == null || this.syllabus == undefined) {
    //   this.syllabusErr = true
    //   err++
    // }

    for (let out of this.outcomesList) {
      if (out.outcomes == '' || out.outcomes == null || out.outcomes == undefined) {
        out.outcomesErr = true
      }
    }

    if (this.coursecode == '' || this.coursecode == null || this.coursecode == undefined) {
      this.coursecodeErr = true
      err++
    }

    if (this.courseseq == '' || this.courseseq == null || this.courseseq == undefined) {
      this.courseseqErr = true
      err++
    }

    for (let obj of this.courseInfo) {
      if (obj.value == '' || obj.value == null || obj.value == undefined) {
        obj.valueErr = true
      }
    }

    if (this.longdesc == '' || this.longdesc == null || this.longdesc == undefined) {
      this.longdescErr = true
      err++
    }


    if (this.isliveSelf) {
      if (this.selfAccess === "" || this.selfAccess === null || this.selfAccess === undefined) {
        this.selfAccessErr = true
      }
    }

    if (!this.isliveSelf) {
      for (let obj of this.upcomingArr) {
        if (obj.value == '' || obj.value == null || obj.value == undefined) {
          obj.valueErr = true
        }
      }
    }


    let info = []

    for (let infoData of this.courseInfo) {
      info.push(infoData.value)
    }


    let upcome = []
    for (let upcominData of this.upcomingArr) {
      upcome.push(upcominData.value)
    }


    let outcomes = []

    for (let outData of this.outcomesList) {
      outcomes.push({ "outcomes": outData.outcomes })
    }


    if (err == 0) {


      var data: any = {
        "coursename": this.coursename,
        "coursetypeid": this.coursetypeid,
        "shortdesc": info.join("|"),
        "longdesc": this.longdesc,
        "coursephoto": this.thumbnailImage,
        "coursebanner": this.coursebanner,
        "coursevideourl": this.coursevideourl,
        "syllabus": this.syllabus,
        "outcomesList": outcomes,
        "categoryList": category,
        "selfaccess": this.isliveSelf ? this.selfAccess : upcome.join("|"),
        "coursecode": this.coursecode,
        "userId": this.common.getUserId(),
        "educatorList": educator,
        "lessionbannerimg": this.lessionbannerimg,
        "courseseq": this.courseseq,
        "ispaid": this.ispaid === true ? 1 : 0,
        "videothumbnail":this.videothumbnail

      }
      this.common.loaderStart();
      this.restapi.addCourse(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/course-list'])
        } else {
          this.notifierService.notify('error', res.message);
        }
      });
    }
  }

  edit(): any {
    this.coursenameErr = false
    this.coursetypeidErr = false
    this.longdescErr = false
    this.thumbnailImageErr = false
    this.coursebannerErr = false
    this.coursevideourlErr = false
    this.syllabusErr = false
    this.categoryListErr = false
    this.selfaccessErr = false
    this.coursecodeErr = false
    this.educatoridErr = false
    this.selfAccessErr = false
    this.courseseqErr = false
    this.lessionbannerimgErr = false
    this.videothumbnailErr = false



    for (let obj of this.outcomesList) {
      obj.outcomesErr = false
    }

    for (let obj of this.upcomingArr) {
      obj.valueErr = false
    }

    let err = 0

    let category = []

    for (let cat of this.categoryList) {
      category.push({ "coursecategoryid": cat.categoriesid })
    }

    let educator: any = []

    for (let edu of this.educatorList) {
      educator.push({ "educatorid": edu.educatorid })
    }


    if (this.coursename === '' || this.coursename === null || this.coursename === undefined) {
      this.coursenameErr = true;
      err++
    }

    if (this.coursetypeid == '' || this.coursetypeid == null || this.coursetypeid == undefined) {
      this.coursetypeidErr = true
      err++
    }
    if (category.length == 0) {
      this.categoryListErr = true
      err++
    }

    
    if (educator.length == 0) {
      this.educatoridErr = true
      err++
    }


    if (this.thumbnailImage == '' || this.thumbnailImage == null || this.thumbnailImage == undefined) {
      this.thumbnailImageErr = true
      err++
    }


    if (this.coursebanner == '' || this.coursebanner == null || this.coursebanner == undefined) {
      this.coursebannerErr = true
      err++
    }

    if (this.lessionbannerimg == '' || this.lessionbannerimg == null || this.lessionbannerimg == undefined) {
      this.lessionbannerimgErr = true
      err++
    }

    if (this.videothumbnail == '' || this.videothumbnail == null || this.videothumbnail == undefined) {
      this.videothumbnailErr = true
      err++
    }

    if (this.coursevideourl == '' || this.coursevideourl == null || this.coursevideourl == undefined) {
      this.coursevideourlErr = true
      err++
    }

    // if (this.syllabus == '' || this.syllabus == null || this.syllabus == undefined) {
    //   this.syllabusErr = true
    //   err++
    // }

    for (let out of this.outcomesList) {
      if (out.outcomes == '' || out.outcomes == null || out.outcomes == undefined) {
        out.outcomesErr = true
      }
    }

    if (this.coursecode == '' || this.coursecode == null || this.coursecode == undefined) {
      this.coursecodeErr = true
      err++
    }


    for (let obj of this.courseInfo) {
      if (obj.value == '' || obj.value == null || obj.value == undefined) {
        obj.valueErr = true
      }
    }

    if (this.longdesc == '' || this.longdesc == null || this.longdesc == undefined) {
      this.longdescErr = true
      err++
    }


    if (this.isliveSelf) {
      if (this.selfAccess === "" || this.selfAccess === null || this.selfAccess === undefined) {
        this.selfAccessErr = true
      }
    }

    if (!this.isliveSelf) {
      for (let obj of this.upcomingArr) {
        if (obj.value == '' || obj.value == null || obj.value == undefined) {
          obj.valueErr = true
        }
      }
    }


    let info = []

    for (let infoData of this.courseInfo) {
      info.push(infoData.value)
    }


    let upcome = []
    for (let upcominData of this.upcomingArr) {
      upcome.push(upcominData.value)
    }


    let outcomes = []

    for (let outData of this.outcomesList) {
      outcomes.push({ "outcomes": outData.outcomes })
    }


    if (err == 0) {
      const data: any = {
        "courseid": this.courseid,
        "coursename": this.coursename,
        "coursetypeid": this.coursetypeid,
        "shortdesc": info.join("|"),
        "longdesc": this.longdesc,
        "coursephoto": this.thumbnailImage,
        "coursebanner": this.coursebanner,
        "coursevideourl": this.coursevideourl,
        "syllabus": this.syllabus,
        "outcomesList": outcomes,
        "categoryList": category,
        "selfaccess": this.isliveSelf ? this.selfAccess : upcome.join("|"),
        "coursecode": this.coursecode,
        "userId": this.common.getUserId(),
        "educatorList": educator,
        "lessionbannerimg": this.lessionbannerimg,
        "courseseq": this.courseseq,
        "ispaid": this.ispaid ? 1 : 0,
        trncstatus: this.trncstatus + '',
        videothumbnail:this.videothumbnail
      }
      this.common.loaderStart();
      this.restapi.updateCourse(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/course-list'])
        } else {
          this.notifierService.notify('error', res.message);
        }
      });
    }

  }


  resetForm(): any {
    this.courseid = ''
    this.coursename = ""
    this.coursetypeid = ''
    this.courseInfo = [
      {
        "value": "",
        "valueErr": false,
      }
    ]

    this.longdesc = ""
    this.thumbnailImage = ""
    this.coursebanner = ""
    this.coursevideourl = ""
    this.syllabus = ""
    this.outcomesList = [
      {
        "outcomes": "",
        "outcomesErr": false,
      }
    ]
    this.categoryList = [];
    this.coursecode = ""
    this.educatorid = ''


    this.coursenameErr = false
    this.coursetypeidErr = false
    this.longdescErr = false
    this.thumbnailImageErr = false
    this.coursebannerErr = false
    this.coursevideourlErr = false
    this.syllabusErr = false
    this.categoryListErr = false
    this.selfaccessErr = false
    this.coursecodeErr = false
    this.educatoridErr = false

    this.router.navigate(['admin/app/course-list'])

  }

  changeCourseName(): any {
    this.coursenameErr = false
  }

  changeCourseTypeName(): any {
    this.coursetypeidErr = false
  }

  changeSyllabusName(): any {
    this.syllabusErr = false
  }

  changeOutcomingName(obj: any): any {
    obj.outcomesErr = false
  }

  changeInfo(obj: any): any {
    obj.valueErr = false
  }

  chngeLive(obj: any): any {

  }


  changeLongDecs(): any {
    this.longdescErr = false
  }

  changeSelfaccessName(): any {
    this.selfaccessErr = false
  }


  changecoursecodeName(): any {
    this.coursecodeErr = false
  }

  changecourseseq(): any {
    this.courseseqErr = false
  }


  imagePopUp(): any {
    this.fullScreenImg = this.FILE_URL + this.coursebanner;
    this.toggleFullScreenImg(1);
  }

  toggleFullScreenImg(flag: number): any {
    const elem = document.getElementById('fulldiv');
    if (elem) {
      elem.style.display = flag === 0 ? 'none' : 'block';
    }
  }


  onClickDelete(id: any): any {
    this.courseid = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  delete(): any {
    const data = {
      "userid": this.common.getUserId(),
      "courseid": this.courseid
    }
    this.common.loaderStart();
    this.restapi.deleteCourse(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.closeModal()
        this.router.navigate(["admin/app/course-list"]);

      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  closeModal(): any {
    this.courseid = '';
    this.modalService.dismissAll();
  }

  searchEducatorByName(): any {
    this.educatoridErr = false;
    if(this.educatorname.length % 3 ===0){
    var data = {
      "userId": this.common.getUserId(),
      "educatorname": this.educatorname
    }
    this.spinnerEducator = true;
    this.restapi.searchEducatorByName(data).subscribe((res: any) => {
      if (res.success) {
        this.educatorArr = res.response;
        this.spinnerEducator = false
      } else {
        this.educatorArr = [];
        this.spinnerEducator = false
      }
    });
  }
  }


  educatorList: any = []

  getEducatorIdByName(): any {
    this.educatoridErr = false
    for (let data of this.educatorArr) {
      if (data.educatorname === this.educatorname) {
        if (!this.educatorList.some((item: { educatorname: any; }) => item.educatorname === this.educatorname)) {
          this.educatorList.push({ educatorid: data.educatorid, educatorname: data.educatorname })
        }
      }
    }
  }
  educatorRemove(i: any): any {

    this.educatorList.splice(i, 1)

  }

  removeInfo(i: any): any {
    this.courseInfo.splice(i, 1)
  }

  removeUpcoming(i: any): any {
    this.upcomingArr.splice(i, 1)
  }

  removeoutcomes(i: any): any {
    this.outcomesList.splice(i, 1)
  }

  onFileChange(event: any): void {
    this.coursevideourl = event.file;
    this.trncstatus = 0;
  }


}
