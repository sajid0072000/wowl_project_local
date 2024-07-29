import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-add-speaking-assesment',
  templateUrl: './add-speaking-assesment.component.html',
  styleUrls: ['./add-speaking-assesment.component.css']
})
export class AddSpeakingAssesmentComponent {
  assesmentid: any = '';
  courseid: any = '';
  coursename: any = '';
  coursenameErr: boolean = false;
  spinner: boolean = false;
  courseArr: any = [];
  questionList: any = [];
  obj = {
    description: '',
    audiofile: '',
    question: '',
    questionErr: false
  }
  constructor(private restapi: RestApiService, private common: CommonService, private notifier: NotifierService, private modalservice: NgbModal, private actroute: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.assesmentid = this.actroute.snapshot.params['id'];
    this.questionList.push(this.obj);
    if (this.assesmentid == 0) {
      this.assesmentid = null
    }
    if (this.assesmentid) {
      this.getAssesmentById()
    }
  }
  getAssesmentById() {
    const data = {
      assesmentid: this.assesmentid
    };
    this.common.loaderStart();
    this.restapi.getAssementDetailsById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        console.log(res.response);
        let details = res.response;
        this.courseid = details.courseid;
        this.coursename = details.coursename;
        this.questionList[0].question = details.question
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    });
  }

  searchCourseByName(): any {
    this.coursenameErr = false
    if (this.coursename.length % 3 === 0) {
      var data = {
        "userId": this.common.getUserId(),
        "coursename": this.coursename
      }
      this.spinner = true
      this.restapi.searchCourseByName(data).subscribe((res: any) => {
        if (res.success) {
          this.courseArr = res.response;
          this.spinner = false;
        }
        else {
          this.courseArr = [];
          this.spinner = false;
        }
      });
    }
  }

  getCourseIdByName(): void {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }
  }

  add() {
    let err = 0;
    if (this.courseid === '' || this.courseid === undefined || this.courseid === null) {
      this.coursenameErr = true;
      err++;
    }
    for (let item of this.questionList) {
      if (item.question === '' || item.question === undefined || item.question === null) {
        item.questionErr = true;
        err++;
      }
    }
    if (err == 0) {
      const data = {
        courseid: this.courseid,
        assesmenttype: 3,
        questionList: this.questionList
      };
      console.log(data, 'dataa');
      this.common.loaderStart();
      this.restapi.createFinalAssesment(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.router.navigate(['admin/app/speaking-assesment-list']);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifier.notify('error', err.error.message);
      });
    }
  }

  edit() {
    let err = 0;
    if (this.courseid === '' || this.courseid === undefined || this.courseid === null) {
      this.coursenameErr = true;
      err++;
    }
    let item = this.questionList[0];
    if (item.question === '' || item.question === undefined || item.question === null) {
      item.questionErr = true;
      err++;
    }
    if (err == 0) {
      const data = {
        assesmentid: this.assesmentid,
        courseid: this.courseid,
        assesmenttype: 3,
        description: '',
        question: this.questionList[0].question,
        audiofile: '',
      };
      console.log(data, 'dataa');
      this.common.loaderStart();
      this.restapi.updateFinalAssesmentQuestion(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.router.navigate(['admin/app/speaking-assesment-list']);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifier.notify('error', err.error.message);
      });
    }
  }

  addMore() {
    let obj = {
      description: '',
      audiofile: '',
      question: '',
      questionErr: false
    }
    this.questionList.push(obj);
  }

  onClickDelete(modal: any) {
    this.modalservice.open(modal , {centered:true, size:'md' , backdrop:false});
  }

  remove(idx: any) {
    this.questionList.splice(idx, 1);
  }
  changeQueFun(item: any) {
    item.questionErr = false;
  }
  delete() { 
    const data = {
      assesmentid:this.assesmentid , 
    };
    this.common.loaderStart();
    this.restapi.deleteAssesment(data).subscribe((res:any)=>{
      this.common.loaderEnd();
      if(res.success){
        this.router.navigate(['admin/app/speaking-assesment-list']);
        this.closeModal();

        this.notifier.notify('success', res.message);
      } else{
        this.notifier.notify('error',res.message);
      }
    } , (err:any)=>{
      this.notifier.notify('error',err.error.message);
    })
  }

  closeModal() { 
    this.modalservice.dismissAll();
  }

  resetForm() {
    this.questionList=[];
    this.courseid ='';
    this.coursename = ''
    this.router.navigate(['admin/app/speaking-assesment-list']); 
  }
}
