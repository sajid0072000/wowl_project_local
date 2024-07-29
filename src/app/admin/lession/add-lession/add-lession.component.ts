import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotifierService } from "angular-notifier";
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-add-lession',
  templateUrl: './add-lession.component.html',
  styleUrls: ['./add-lession.component.css']
})
export class AddLessionComponent {
  @ViewChild('deleteModal') deleteModal: any;

  additional_learning_recommendations = '' as any
  
  FILE_URL = '' as any;
  lessionid = '' as any
  coursename = '' as any
  title = '' as any
  description = '' as any
  agerange = '' as any
  seq = '' as any
  price = '' as any
  courseid = '' as any

  courseArr = [] as any

  spinner: boolean = false


  coursenameErr: boolean = false
  lessonnameErr: boolean = false
  seqErr: boolean = false
  descriptionErr: boolean = false
  additional_learning_recommendationsErr:boolean = false





  constructor(
    private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private notifierService: NotifierService,
    private common: CommonService,
    private modalService: NgbModal,

  ) { 
    this.FILE_URL = this.restapi.FILE_URL;
  }

  ngOnInit(): void {
    this.lessionid = this.actroute.snapshot.params['id'];
    if (this.lessionid == 0) {
      this.lessionid = null
    }
    if (this.lessionid) {
      this.getLessionById()
    }
  }

  delete(): any {
    const data = {
      "userId": this.common.getUserId(),
      "id": this.lessionid
    }
    this.common.loaderStart();
    this.restapi.deleteLession(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.closeModal()
        this.router.navigate(['admin/app/lession-list'])
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  goToPreview(): any {

  }

  goBack() {
    this.router.navigate(["admin/app/lession-list"]);
  }

  searchCourseByName(): any {
    this.coursenameErr = false
    if(this.coursename.length % 3 ===0 ){
      var data = {
        "userId": this.common.getUserId(),
        "coursename": this.coursename
      }
      this.spinner = true
      this.restapi.searchCourseByName(data).subscribe((res: any) => {
        if (res.success) {
          this.courseArr = res.response
          this.spinner = false
          if(this.lessionid){
            for (let data of this.courseArr) {
              if (data.coursename === this.coursename) {
                this.courseid = data.courseid
                break;
              }
            }
          }
        }
        else {
          this.courseArr = []
          this.spinner = false
        }
      });
    }
  }


  getLessionById(): any {
    var data = {
      "userId": this.common.getUserId(),
      "id": this.lessionid
    }
    this.common.loaderStart();
    this.restapi.getLessionById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        // this.lessionid = res.response.id;
        this.coursename = res.response.coursename;
        this.courseid = res.response.courseid;
        this.title = res.response.title;
        this.description = res.response.description;
        this.agerange = res.response.agerange;
        this.seq = res.response.seq;
        this.price = res.response.price;
        this.additional_learning_recommendations =  res.response.additional_learning_recommendations
        this.searchCourseByName();
        // setTimeout(() => {
        //   this.getCourseIdByName()
        // }, 1000);

      }
    });
  }


  changeLessonFun():any{
    this.lessonnameErr = false
  }

  changeSeqFun():any{
    this.seqErr = false
  }

  changeDescriptionFun():any{
    this.descriptionErr = false
  }




  add(): any {

    this.coursenameErr = false
    this.lessonnameErr = false
    this.seqErr = false
    this.descriptionErr = false
    this.additional_learning_recommendationsErr = false
    let err = 0

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.coursenameErr = true
      err++
    }
    if (this.title == '' || this.title == null || this.title == undefined) {
      this.lessonnameErr = true
      err++
    }
    if (this.description == '' || this.description == null || this.description == undefined) {
      this.seqErr = true
      err++
    }
    // if (this.additional_learning_recommendations == '' || this.additional_learning_recommendations == null || this.additional_learning_recommendations == undefined) {
    //   this.additional_learning_recommendationsErr = true
    //   err++
    // }
    if (this.seq == '' || this.seq == null || this.seq == undefined) {
      this.descriptionErr = true
      err++
    }

    if (err == 0) {
      var data: any = {
        "userId": this.common.getUserId(),
        "courseid": this.courseid,
        "title": this.title,
        "description": this.description,
        "additional_learning_recommendations":this.additional_learning_recommendations,
        "seq": this.seq
      }
      this.common.loaderStart();
      this.restapi.addLession(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/lession-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });

    }
  }

  edit(): any {
    this.coursenameErr = false
    this.lessonnameErr = false
    this.seqErr = false
    this.descriptionErr = false
    this.additional_learning_recommendationsErr = false

    let err = 0

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.coursenameErr = true
      err++
    }
    if (this.title == '' || this.title == null || this.title == undefined) {
      this.lessonnameErr = true
      err++
    }
    if (this.description == '' || this.description == null || this.description == undefined) {
      this.seqErr = true
      err++
    }
    // if (this.additional_learning_recommendations == '' || this.additional_learning_recommendations == null || this.additional_learning_recommendations == undefined) {
    //   this.additional_learning_recommendationsErr = true
    //   err++
    // }
    if (this.seq == '' || this.seq == null || this.seq == undefined) {
      this.descriptionErr = true
      err++
    }

    if (err == 0) {
      var data: any = {
        "userId": this.common.getUserId(),
        "id": this.lessionid,
        "courseid": this.courseid,
        "title": this.title,
        "description": this.description,
        "additional_learning_recommendations":this.additional_learning_recommendations,
        "seq": this.seq
      }
      this.common.loaderStart();
      this.restapi.updateLession(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/lession-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });
    }
  }


  resetForm(): any {
    this.courseid = "";
    this.courseArr=[]
    this.coursename=''
    this.title = '';
    this.description = '';
    this.additional_learning_recommendations=""
    this.seq = '';
    this.coursenameErr = false
    this.lessonnameErr = false
    this.seqErr = false
    this.descriptionErr = false
    this.additional_learning_recommendationsErr=false
    this.router.navigate(['admin/app/lession-list'])
  }


  getCourseIdByName(): any {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }

  }


  onClickDelete(id: any):any {
    this.lessionid = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal():any {
    this.lessionid = '';
    this.modalService.dismissAll();
  }


  uploadEditBtnAdditionalLearning(): any {
    let elem = document.getElementById('file-input-AdditionalLearning')
    if (elem) {
      elem.click()
    }
  }



  onFileChangedAdditionalLearning(event: any): any {
    if (event.target.files && event.target.files.length > 0) {
      this.additional_learning_recommendationsErr = false
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.additional_learning_recommendations = res.response.fileName;
        }
      })
    }
  }
}
