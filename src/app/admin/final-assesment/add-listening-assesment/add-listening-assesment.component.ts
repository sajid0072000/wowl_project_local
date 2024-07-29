import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-add-listening-assesment',
  templateUrl: './add-listening-assesment.component.html',
  styleUrls: ['./add-listening-assesment.component.css']
})
export class AddListeningAssesmentComponent implements OnInit, AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  FILE_URL = "";
  assesmentid: any = '';
  courseid: any = '';
  coursename: any = '';
  coursenameErr: boolean = false;
  spinner: boolean = false;
  courseArr: any = [];
  questionList: any = [];
  obj = {
    description: '',
    orgfile: '',
    audiofile: '',
    question: '',
    optionList: [
      {
        optiontext: '',
        correctans: 0,
        isSelected: false,
        optiontextErr: false
      }
    ],
    audioErr: false,
    questionErr: false
  };
  event: any = '';
  idx: any = '';


  constructor(private restapi: RestApiService,
    private common: CommonService,
    private notifier: NotifierService,
    private modalservice: NgbModal,
    private actroute: ActivatedRoute,
    private router: Router) {
    this.FILE_URL = this.restapi.FILE_URL;
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.questionList.push(this.obj);
    this.assesmentid = this.actroute.snapshot.params['id'];
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
        let details = res.response;
        this.courseid = details.courseid;
        this.coursename = details.coursename;
        // this.questionList[0].orgfile = details.audiofile;
        this.questionList[0].audiofile = details.audiofile;
        this.questionList[0].question = details.question;
        this.questionList[0].optionList = details.optionList;
        for (let [idx, obj] of this.questionList[0].optionList.entries()) {
          obj.isSelected = obj.correctans == 1 ? true : false;
        }
        setTimeout(() => {
          const audioplr: HTMLAudioElement = this.audioPlayer.nativeElement;
          audioplr.src = this.FILE_URL + this.questionList[0].audiofile;
          audioplr.load();
        }, 100);
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

  onFileChangedThumbImage(event: any, idx: any): any {
    this.event = event;
    this.idx = idx
  }

  uploadAudio() {
    this.questionList[this.idx].audioErr = false;
    if (this.event.target.files && this.event.target.files.length > 0) {
      let file = this.event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.common.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.questionList[this.idx].audiofile = res.response.fileName;
          this.questionList[this.idx].orgfile = '';
          let inp: any = document.getElementById('fileBtn');
          inp.value = '';
          setTimeout(() => {
            const audioplr: HTMLAudioElement|any = document.getElementById('audioplr'+this.idx);
            console.log(audioplr , '<<<<')
            audioplr.src = this.FILE_URL + this.questionList[this.idx].audiofile;
            audioplr.load();
          }, 100);
        }
      });
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
      if (item.audiofile === '' || item.audiofile === undefined || item.audiofile === null) {
        item.audioErr = true;
        err++;
      }
      if (item.question) {
        let temp = false
        for (let obj of item.optionList) {
          if (obj.optiontext == "" || obj.optiontext == null || obj.optiontext == undefined) {
            obj.optiontextErr = true
            err++
          }
          if (obj.isSelected) {
            temp = true
          }
        }
        if (!temp) {
          this.notifier.notify('error', "You have to check one option as answer for the question:" + item.question);
          err++
        }
      }
    }
    if (err == 0) {
      for (let [index, item] of this.questionList.entries()) {
        for (const [i, obj] of item.optionList.entries()) {
          obj.correctans = obj.isSelected == true ? 1 : 0;
          // obj.selected = i;
        }
      }
      const data = {
        courseid: this.courseid,
        assesmenttype: 2,
        questionList: this.questionList
      };
      console.log(data)
      this.common.loaderStart();
      this.restapi.createFinalAssesment(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.router.navigate(['admin/app/listening-assesment-list']);
          this.notifier.notify('success', res.message);

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
      console.log(item.questionErr);
      err++;
    }
    if (item.audiofile === '' || item.audiofile === undefined || item.audiofile === null) {
      item.audioErr = true;
      console.log(item.audioErr);
      err++;
    }
    if (item.question) {
      let temp = false
      for (let obj of item.optionList) {
        if (obj.optiontext == "" || obj.optiontext == null || obj.optiontext == undefined) {
          obj.optiontextErr = true
          err++;
        }
        if (obj.isSelected) {
          temp = true
        }
      }
      if (!temp) {
        this.notifier.notify('error', "You have to check one option as answer for the question:" + item.question);
        err++;
      }
    }
    if (err == 0) {
      for (let [index, item] of this.questionList.entries()) {
        for (const [i, obj] of item.optionList.entries()) {
          obj.correctans = obj.isSelected == true ? 1 : 0;
          // obj.selected = i;
        }
      }
      const data = {
        assesmentid: this.assesmentid,
        courseid: this.courseid,
        assesmenttype: 2,
        description: '',
        question: this.questionList[0].question,
        audiofile: this.questionList[0].audiofile,
        optionList: this.questionList[0].optionList
      };
      this.common.loaderStart();
      this.restapi.updateFinalAssesmentQuestion(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.router.navigate(['admin/app/listening-assesment-list']);

          this.notifier.notify('success', res.message);

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
      orgfile: '',
      audiofile: '',
      question: '',
      optionList: [
        {
          optiontext: '',
          correctans: 0,
          isSelected: false,
          optiontextErr: false
        }
      ],
      audioErr: false,
      questionErr: false
    }
    this.questionList.push(obj);
  }
  addMoreOption(i: any) {
    for (var [index, value] of this.questionList.entries()) {
      if (index == i) {
        value.optionList.push({
          optiontext: '',
          correctans: 0,
          isSelected: false,
          optiontextErr: false

        })
      }
    }
  }

  onClickDelete(modal: any) {
    this.modalservice.open(modal, { centered: true, size: 'md', backdrop: false });
  }

  remove(idx: any) {
    this.questionList.splice(idx, 1);
  }
  changeQueFun(item: any) {

  }
  changeOptionFun(item: any) {
    item.optiontextErr = false;
  }
  removeOption(indexQue: any, indexOpt: any): any {
    for (var [index, value] of this.questionList.entries()) {
      if (index == indexQue) {
        value.optionList.splice(indexOpt, 1)
      }
    }
  }

  changeOption(idx: any) {
    for (let [index, item] of this.questionList.entries()) {
      for (const [i, obj] of item.optionList.entries()) {
        if (i == idx) {
          obj.isSelected = true;
        } else {
          obj.isSelected = false;
        }
      }
    }
  }
  delete() {
    const data = {
      assesmentid: this.assesmentid,
    };
    this.common.loaderStart();
    this.restapi.deleteAssesment(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.router.navigate(['admin/app/listening-assesment-list']);
        this.closeModal();

        this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    });
  }

  closeModal() {
    this.modalservice.dismissAll();
  }

  resetForm() {
    this.questionList = [];
    this.courseid = '';
    this.coursename = '';
    this.router.navigate(['admin/app/listening-assesment-list']);
  }
}
