import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { NotifierService } from "angular-notifier";
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css']
})
export class AddExerciseComponent {

  @ViewChild('deleteModal') deleteModal: any;

  exerciseid = '' as any
  coursename = '' as any
  courseid = '' as any
  courseArr = [] as any
  title = '' as any
  lessionArr = [] as any
  lessionid = '' as any
  exercisename = '' as any
  description = '' as any
  spinner: boolean = false
  spinnerLession: boolean = false
  questionList = [] as any;
  selected: any = '';
  coursenameErr: boolean = false
  lessonnameErr: boolean = false
  exercisenameErr: boolean = false
  descriptionErr: boolean = false
  examtime = '' as any
  examtimeErr: boolean = false;

  constructor(
    private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private notifierService: NotifierService,
    private common: CommonService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.exerciseid = this.actroute.snapshot.params['id'];
    this.questionList.push({
      "question": "",
      "questionErr": false,
      "correctans": null,
      "selected": -1,
      "optionList": [
        {
          "optiondesc": "",
          "optiondescErr": false,
          "iscorrect": false,
          "iscorrect1": false,
        }
      ]
    })
    if (this.exerciseid == 0) {
      this.exerciseid = null
    }
    if (this.exerciseid) {
      this.getExerciseById()
    }
  }

  goBack() {
    this.router.navigate(["admin/app/exercise-list"]);
  }

  getExerciseById(): any {
    var data = {
      "userId": this.common.getUserId(),
      "id": this.exerciseid
    }
    this.common.loaderStart();
    this.restapi.getExerciseById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.courseid = res.response.courseid;
        this.coursename = res.response.coursename;
        this.lessionid = res.response.lessionid
        this.title = res.response.lessionname;
        this.exercisename = res.response.exercisename;
        // this.examtime =res.response.examtime
        this.description = res.response.exercisedescription;
        this.examtime = res.response.examtime;
        this.questionList = res.response.questionList;
        for (const [index, data] of this.questionList.entries()) {
          for (const [i, obj] of data.optionList.entries()) {
            obj.iscorrect1 = obj.iscorrect == 1 ? true : false
            // obj.selected = i;
          }
        }
        setTimeout(() => {
          this.getCourseIdByName()
          setTimeout(() => {
            this.getLessionIdByName()
          }, 1000);
        }, 1000);

      }
    });
  }

  delete(): any {
    const data = {
      "userId": this.common.getUserId(),
      "id": this.exerciseid
    }
    this.common.loaderStart();
    this.restapi.deleteExercise(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.closeModal()
        this.router.navigate(['admin/app/exercise-list'])

      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }


  onClickDelete(id: any): any {
    this.exerciseid = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.exerciseid = '';
    this.modalService.dismissAll();
  }
  goToPreview(): any {

  }

  addMore(): any {
    this.questionList.push({
      "question": "",
      "questionErr": false,
      "correctans": null,
      "selected": -1,
      "optionList": [
        {
          "optiondesc": "",
          "optiondescErr": false,
          "iscorrect": false,
          "iscorrect1": false,
        }
      ]
    })
  }

  addMoreOption(i: any): any {
    for (var [index, value] of this.questionList.entries()) {
      if (index == i) {
        value.optionList.push({
          "optiondesc": "",
          "optiondescErr": false,
          "iscorrect": false,
          "iscorrect1": false,

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

  remove(id: any): any {
    this.questionList.splice(id, 1)
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

  searchLessionByName(): any {
    this.lessonnameErr = false
    if (this.title.length % 3 === 0) {
      var data = {
        "userId": this.common.getUserId(),
        "title": this.title,
        "courseid": this.courseid,
      }
      this.spinnerLession = true
      this.restapi.searchLessionByName(data).subscribe((res: any) => {
        if (res.success) {
          this.lessionArr = res.response
          this.spinnerLession = false
        }
        else {
          this.lessionArr = []
          this.spinnerLession = false
        }
      });
    }
  }

  getLessionIdByName(): void {
    for (let data of this.lessionArr) {
      if (data.title === this.title) {
        this.lessionid = data.id
        break;
      }
    }
  }
  changeExeciseFun(): any {
    this.exercisenameErr = false
  }
  changeExametimeFun(): any {
    this.examtimeErr = false
  }
  changeDescriptionFun(): any {
    this.descriptionErr = false
  }

  changeQueFun(obj: any): any {
    obj.questionErr = false
  }

  changeOptionFun(item: any): any {
    item.optiondescErr = false
  }

  add(): any {
    this.coursenameErr = false
    this.lessonnameErr = false
    this.exercisenameErr = false
    this.descriptionErr = false
    this.examtimeErr = false
    for (let que of this.questionList) {
      que.questionErr = false
      for (let obj of que.optionList) {
        obj.optiondescErr = false
      }
    }

    let err = 0;

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.coursenameErr = true
      err++
    }
    if (this.lessionid == '' || this.lessionid == null || this.lessionid == undefined) {
      this.lessonnameErr = true
      err++
    }
    if (this.exercisename == '' || this.exercisename == null || this.exercisename == undefined) {
      this.exercisenameErr = true
      err++
    }


    if (this.examtime == '' || this.examtime == null || this.examtime == undefined) {
      this.examtimeErr = true
      err++
    }

    if (this.description == '' || this.description == null || this.description == undefined) {
      this.descriptionErr = true
      err++
    }

    for (let item of this.questionList) {
      if (item.question) {
        let temp = false

        for (let obj of item.optionList) {
          if (obj.optiondesc == "" || obj.optiondesc == null || obj.optiondesc == undefined) {
            obj.optiondescErr = true
            err++
          }
          if (obj.iscorrect1) {
            temp = true
          }
          obj.iscorrect = obj.iscorrect1 ? 1 : 0
        }
        if (!temp) {
          this.notifierService.notify('error', "You have to check one option as answer for the question:" + item.question);
          err++
        }
      }
    }

    // for (var [index, value] of this.questionList.entries()) {
    //   if (value.question == "" || value.question == null || value.question == undefined) {
    //     value.questionErr = true;
    //     err++
    //   }
    //   let temp = false
    //   for (var [i, obj] of value.optionList.entries()) {
    //     if (obj.optiondesc == "" || obj.optiondesc == null || obj.optiondesc == undefined) {
    //       obj.optiondescErr = true
    //       err++
    //     }
    //     if (obj.iscorrect1) {
    //       temp = true
    //     }
    //     obj.iscorrect = obj.iscorrect1 ? 1 : 0
    //   }
    //   if (!temp) {
    //     this.notifierService.notify('error', "You have to check one option as answer for the question:" + value.question);
    //     err++
    //   }
    // }

    if (err == 0) {
      if (this.questionList[0].question === '') {
        this.questionList = [];
      }
      const data: any = {
        "userId": this.common.getUserId(),
        "courseid": this.courseid,
        "lessionid": this.lessionid,
        "exercisename": this.exercisename,
        "questionList": this.questionList,
        "description": this.description,
        "examtime": this.examtime
      }
      this.common.loaderStart();
      this.restapi.addExercise(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/exercise-list'])
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
    this.exercisenameErr = false
    this.examtimeErr = false
    this.descriptionErr = false


    for (let que of this.questionList) {
      que.questionErr = false
      for (let obj of que.optionList) {
        obj.optiondescErr = false
      }
    }

    let err = 0;

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.coursenameErr = true
      err++
    }
    if (this.lessionid == '' || this.lessionid == null || this.lessionid == undefined) {
      this.lessonnameErr = true
      err++
    }
    if (this.exercisename == '' || this.exercisename == null || this.exercisename == undefined) {
      this.exercisenameErr = true
      err++
    }
    if (this.examtime == '' || this.examtime == null || this.examtime == undefined) {
      this.examtimeErr = true
      err++
    }
    // desc
    if (this.description == '' || this.description == null || this.description == undefined) {
      this.descriptionErr = true
      err++
    }

    for (let item of this.questionList) {
      if (item.question) {
        let temp = false

        for (let obj of item.optionList) {
          if (obj.optiondesc == "" || obj.optiondesc == null || obj.optiondesc == undefined) {
            obj.optiondescErr = true
            err++
          }
          if (obj.iscorrect1) {
            temp = true
          }
          obj.iscorrect = obj.iscorrect1 ? 1 : 0
        }
        if (!temp) {
          this.notifierService.notify('error', "You have to check one option as answer for the question:" + item.question);
          err++
        }
      }
    }

    // for (var [index, value] of this.questionList.entries()) {
    //   if (value.question == "" || value.question == null || value.question == undefined) {
    //     value.questionErr = true
    //     err++
    //   }
    //   let temp = false
    //   for (var [i, obj] of value.optionList.entries()) {
    //     if (obj.optiondesc == "" || obj.optiondesc == null || obj.optiondesc == undefined) {
    //       obj.optiondescErr = true
    //       err++
    //     }
    //     if (obj.iscorrect1) {
    //       temp = true
    //     }
    //     obj.iscorrect = obj.iscorrect1 ? 1 : 0
    //   }
    //   if (!temp) {
    //     this.notifierService.notify('error', "You have to check one option as answer for the question:" + value.question);
    //     err++
    //   }
    // }

    if (err == 0) {
      if(this.questionList.length > 0){
        if (this.questionList[0].question === '') {
          this.questionList = [];
      }
      }
      var data: any = {
        "userId": this.common.getUserId(),
        "id": this.exerciseid,
        "courseid": this.courseid,
        "lessionid": this.lessionid,
        "exercisename": this.exercisename,
        "examtime": this.examtime,
        "description": this.description,
        "questionList": this.questionList
      }      

      this.common.loaderStart();
      this.restapi.updateExercise(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/exercise-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });
    }

  }


  resetForm(): any {
    this.courseid = '';
    this.coursename = '';
    this.lessionid = ''
    this.title = ''
    this.exercisename = ''
    this.examtime = ''
    this.description = '';
    this.questionList = []
    this.coursenameErr = false
    this.lessonnameErr = false
    this.exercisenameErr = false
    this.examtimeErr = false
    this.descriptionErr = false


    for (let que of this.questionList) {
      que.questionErr = false
      for (let obj of que.optionList) {
        obj.optiondescErr = false
      }
    }
    this.router.navigate(['admin/app/exercise-list'])

  }

}
