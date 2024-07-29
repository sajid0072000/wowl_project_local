import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-add-reading-assesment',
  templateUrl: './add-reading-assesment.component.html',
  styleUrls: ['./add-reading-assesment.component.css']
})
export class AddReadingAssesmentComponent implements OnInit {

  assesmentid: any = '';
  questionList: any = [];
  coursename: any = '';
  coursenameErr: boolean = false;
  spinner: boolean = false;
  courseArr: any = [];
  courseid: any = '';
  description: any = ''
  obj: any = {
    description: '',
    question: '',
    audiofile: '',
    selected: -1,
    assesmenttype: 1,
    descriptionErr: false,
    questionErr: false,
    optionList: [
      {
        optiontext: '',
        correctans: 0,
        isSelected: false,
        optiontextErr: false
      }
    ]
  }


  constructor(private restapi: RestApiService, private common: CommonService, private notifier: NotifierService, private modalservice: NgbModal, private actroute: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.assesmentid = this.actroute.snapshot.params['id'];

    if (this.assesmentid == 0) {
      this.questionList.push(this.obj);
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
        this.questionList.push(details);
        for (let [index, item] of this.questionList.entries()) {
          for (let [idx, obj] of item.optionList.entries()) {
            obj.isSelected = obj.correctans == 1 ? true : false;
          }
        }

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
          this.courseArr = res.response
          this.spinner = false
        }
        else {
          this.courseArr = []
          this.spinner = false
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
  changeQueFun(item: any) {
    item.questionErr = false;
  }
  remove(idx: any) {
    this.questionList.splice(idx, 1)
  }
  addMore(): any {
    let obj: any = {
      description: '',
      question: '',
      audiofile: '',
      selected: -1,
      assesmenttype: 1,
      descriptionErr: false,
      questionErr: false,
      optionList: [
        {
          optiontext: '',
          correctans: 0,
          isSelected: false,
          optiontextErr: false
        }
      ]
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
      if (item.description === '' || item.description === undefined || item.description === null) {
        item.descriptionErr = true,
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
        assesmenttype: 1,
        questionList: this.questionList
      };
      this.common.loaderStart();
      this.restapi.createFinalAssesment(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.router.navigate(['admin/app/reading-assesment-list']);
          this.resetForm();

          this.notifier.notify('success', res.message);

        } else {
          this.notifier.notify('error', res.message);
          this.resetForm();
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
    if (item.description === '' || item.description === undefined || item.description === null) {
      item.descriptionErr = true,
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
    if (err == 0) {
      for (let [index, item] of this.questionList.entries()) {
        for (const [i, obj] of item.optionList.entries()) {
          obj.correctans = obj.isSelected == true ? 1 : 0;
        }
      }
      const data = {
        assesmentid: this.assesmentid,
        courseid: this.courseid,
        assesmenttype: 1,
        description: this.questionList[0].description,
        question: this.questionList[0].question,
        audiofile: '',
        optionList: this.questionList[0].optionList
      }
      this.common.loaderStart();
      this.restapi.updateFinalAssesmentQuestion(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.router.navigate(['admin/app/reading-assesment-list']);
          this.notifier.notify('success', res.message);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.notifier.notify('error', err.error.message);
      })
    }
  }


  changeOptionFun(item: any) {
    item.optiontextErr = false;
  }

  changeDescriptionFun(obj: any): any {
    obj.descriptionErr = false;
  }

  resetForm() {
    this.courseid = '';
    this.questionList = [];
    this.questionList.push(this.obj);
    this.router.navigate(['admin/app/reading-assesment-list']);
  }
  onClickDelete(modal: any) {
    this.modalservice.open(modal, { centered: true, size: 'md', backdrop: false });
  }
  delete() {
    const data = {
      assesmentid: this.assesmentid,
    };
    this.common.loaderStart();
    this.restapi.deleteAssesment(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.router.navigate(['admin/app/reading-assesment-list']);
        this.closeModal();

        this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    })
  }

  closeModal() {
    this.modalservice.dismissAll();
  }

}
