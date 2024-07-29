import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { faL, faTruckRampBox } from '@fortawesome/free-solid-svg-icons';
import {
  ProgressSpinnerMode,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { ComingSoonComponent } from '../coming-soon/coming-soon.component';
declare var $: any;

declare var Hls: any;
@Component({
  selector: 'app-courselesson',
  templateUrl: './courselesson.component.html',
  styleUrls: ['./courselesson.component.css'],
})
export class CourselessonComponent implements OnInit {

  @ViewChild('timeoutModal', { static: false }) timeoutModal: any;
  @ViewChild('ComingSoonComponent') ComingSoonComponent: any

  valueExamTime: any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';

  @ViewChild('assemessmentModal', { static: false }) assemessmentModal: any;
  @ViewChild('abortModal', { static: false }) abortModal: any;

  courseid: any = '';
  FILE_URL: any = '';
  courseDetails: any = {};
  lessionid: any = '';
  fetchLessonObj: any = {};
  lessionDetails: any = [];
  currentUnit: any = '';
  isView: boolean = false;
  indexLesson: any = '';
  lessonObj: any = {};
  otherVideoLessionArr: any = [];
  lessonListKeys: any = [];
  Video_URL = '';
  questionArr: any = [];
  examtime: any = '';
  lessionname: any = '';
  exercisedescription: any = '';
  coursename: any = '';
  idx: number = 0;
  questionData: any = {};
  showQuestionFlag: boolean = false;
  qnum: number = 1;
  flag: number = 0;
  nextBtnFlg: boolean = false;
  submitBtnFlg: boolean = false;
  optionErr: any = '';
  assesmentcompletion: any = ''
  isOptionSelected: boolean = false;
  answerList: any = [];
  ansArr: any = [];
  questionId: any = '';
  exerciseId: any = '';
  timerVal: any;
  score: any = ''
  scoringmessage: any = ''
  timerView: boolean = true
  attemptNo: any = ''
  abortTesting: boolean = true
  videoDiv: boolean = false
  progress = 100;
  timerTitle = '';
  subtitle = 'minute';
  modalRef: any;
  exerciseList: any = [];
  lessionVideoURL: string = '';
  lessonVideoData: any = {};
  title: any = '';
  description: any = '';
  video: any = '';
  thumbnailImage: any = '';
  duration = 0;
  progressPerecent:any=''
  constructor(
    private rest: RestApiService,
    private common: CommonService,
    private active: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) {
    this.FILE_URL = this.rest.FILE_URL;
    this.Video_URL = this.rest.Video_URL;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    if (!this.common.getUserId()) {
      this.router.navigate(['/']);
    }
    this.courseid = this.active.snapshot.paramMap.get('id');
    this.getLessionsByCourseId();
    const gudidedVideoDetails = this.common.getLessonVideo();
    this.title = gudidedVideoDetails.title;
    this.description = gudidedVideoDetails.description;
    this.video = gudidedVideoDetails.video;
    this.thumbnailImage = gudidedVideoDetails.thumbnailImage;
    this.progressPercentage()
  }

  opentimeoutModal(): any {
    this.modalRef = this.modalService.open(this.timeoutModal, {
      centered: true,
      size: 'sm',
      backdrop: true,
    });
  }

  closetimeOutModal(): any {
    if (this.modalRef) {
      this.modalRef.close()
      this.restSubmit()
    }
  }

  playVideo(): any {
    this.videoDiv = true;
    setTimeout(() => {
      this.common.getTrancoding(
        'video-container',
        '100%',
        '100%',
        this.video,
        this.thumbnailImage
      );
    }, 500);
  }

  changeView(data: any, id: any, name: any): any {
    if (data.ispaid === 1) {
      if (this.common.getUserId() == null) {
        this.common.getLogin();
      } else {
        if (this.common.checkSubscription()) {

          let temp = this.common.getSubscriptionCourse();
          if (temp[0].isexpire == 1) {
            this.notifierService.notify('info', 'Please renew your subscription!');
            data.coursename = name;
            data.courseid = id;
            this.common.sheardData = data;
            this.common.getSubscription()
          } else {
            if (temp[0].courseid == this.courseid) {
              this.assesmentcompletion = false
              this.isView = true;
              this.lessonObj = data;
              this.lessionid = data.lessionId;
              this.currentUnit = data.unitId;
              setTimeout(() => {
                /* this.common.getTrancoding(
                  'video-container-big',
                  '100%',
                  '100%',
                  data.videourl,
                  ''
                ); */
                console.log(data.videourl)
                this.getVideoDuration(data.videourl);
              }, 100);
              this.getUnitsExceptCurrentOne();
            } else {
              this.common.newcourseid = this.courseid;
              this.common.getLeavingMidway()
            }
          }
        } else {
          data.coursename = name
          data.courseid = id
          this.common.sheardData = data;
          this.common.getSubscription()
        }
      }
    } else {
      this.assesmentcompletion = false
      this.isView = true;
      this.lessonObj = data;
      this.lessionid = data.lessionId;
      this.currentUnit = data.unitId;
      setTimeout(() => {
        /* this.common.getTrancoding(
          'video-container-big',
          '100%',
          '100%',
          data.videourl,
          ''
        ); */
        console.log(data.videourl)
        this.getVideoDuration(data.videourl);
      }, 100);
      this.getUnitsExceptCurrentOne();
    }
  }

  getVideoDuration(videourl: string) {
    const data = {
      userid: this.common.getUserId(),
      courseid: this.courseid,
      lessionid: this.lessonObj.lessionId,
      unitid: this.lessonObj.unitId
    };
    this.common.loaderStart();
    this.rest.getVideoDuration(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.duration = res.response.duration;
        this.lessionVideoURL = this.Video_URL + videourl;
        try {
          const element = document.getElementById("player-container");
          if (element) {
            element.scrollIntoView();
          }
        } catch (e) { }
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  playOther(data: any, id: any, name: any): any {
    if (data.ispaid === 1) {
      if (this.common.getUserId() == null) {
        this.common.getLogin();
      } else {
        if (this.common.checkSubscription()) {
          let temp = this.common.getSubscriptionCourse();
          if (temp[0].isexpire == 1) {
            this.notifierService.notify('info', 'Please renew your subscription!');
            data.coursename = name
            data.courseid = id
            this.common.sheardData = data;
            this.common.getSubscription()
          } else {
            if (temp[0].courseid == this.courseid) {
              this.assesmentcompletion = false
              this.isView = true;
              this.lessonObj = data;
              this.currentUnit = data.unitid;
              setTimeout(() => {
                /* this.common.getTrancoding(
                  'video-container-big',
                  '100%',
                  '100%',
                  data.videourl,
                  ''
                ); */
                console.log(data.videourl)
                this.getVideoDuration(data.videourl);
              }, 100);
              this.getUnitsExceptCurrentOne();
            } else {
              this.common.newcourseid = this.courseid;
              this.common.getLeavingMidway()
            }
          }
        } else {
          data.coursename = name;
          data.courseid = id;
          this.common.sheardData = data;
          this.common.getSubscription()
        }
      }
    } else {
      this.assesmentcompletion = false
      this.isView = true;
      this.lessonObj = data;
      this.currentUnit = data.unitid;
      setTimeout(() => {
        /* this.common.getTrancoding(
          'video-container-big',
          '100%',
          '100%',
          data.videourl,
          ''
        ); */
        this.getVideoDuration(data.videourl);
      }, 100);
      this.getUnitsExceptCurrentOne();
    }
  }

  getUnitsExceptCurrentOne(): any {
    const data = {
      lessionid: this.lessionid,
      currentUnit: this.currentUnit,
    };
    this.common.loaderStart();
    this.rest.getUnitsExceptCurrentOne(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.exerciseList = [];
        for (const obj of result.response) {
          if (obj.type === 'exercise') {
            this.exerciseList.push(obj);
          }
        }
        this.otherVideoLessionArr = result.response;
        console.log(this.otherVideoLessionArr,">>>>>>>>>>>>>>>othervideo")
      } else {
        this.otherVideoLessionArr = [];
      }
    });
  }

  // courseId
  getLessionsByCourseId(): any {
    const data = {
      userId: this.common.getUserId(),
      courseid: this.courseid,
      deviceType: 'web',
    };

    this.rest.getLessionsByCourseId(data).subscribe((result: any) => {
      if (result.success) {
        this.courseDetails = result.response;
        this.coursename = result.response.coursename;
        this.assesmentcompletion = result.response.assesmentcompletion;
        // this.assesmentcompletion = true;
        let temp = this.courseDetails.lessionDetails;
        for (let obj of temp) {
          obj.isActive = false;
          this.lessonListKeys.push(obj.lessiontitle);
        }
        this.lessionDetails = temp;
        this.getLessionMapV2();
      }
      let obj = {
        courseid: this.courseDetails.courseid,
        coursebanner: this.courseDetails.coursebanner,
        coursename: this.coursename,
        coursephoto: this.courseDetails.coursephoto,
        coursevideourl: this.courseDetails.coursevideourl,
        lessionbannerimg: this.courseDetails.lessionbannerimg
      }
      this.common.setCourseDetails(JSON.stringify(obj));
    });
  }

  getLessionMapV2(): any {
    const data = {
      lessionid: this.lessionid,
      courseid: this.courseid,
    };

    this.common.loaderStart();
    this.rest.getLessionMapV2(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        let elem: any = document.getElementById('lession-list');
        elem.innerHTML = '';
        const temp = result.response;
        const groupedLesson: any = this.groupBy(temp, 'lessionTitle');
        this.fetchLessonObj = groupedLesson;
        // this.lessonListKeys = Object.keys(this.fetchLessonObj);
        this.getAppendData();
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    });
  }

  getAppendData(): any {
    let lsesonlist: any = document.getElementById('lession-list');

    for (let key of this.lessonListKeys) {
      if (this.fetchLessonObj[key] == undefined) {
        continue;
      }
      var new_row = document.createElement('div');
      new_row.className = 'lesson_div';
      var new_row1 = document.createElement('div');
      new_row1.className = 'row text-center';
      new_row.appendChild(new_row1);
      var new_row2 = document.createElement('div');
      new_row2.className = 'common-language-blue-head-text';
      new_row1.appendChild(new_row2);
      var h3_row = document.createElement('h3');
      new_row2.appendChild(h3_row);
      h3_row.append(key);
      var new_row3 = document.createElement('div');
      new_row3.className = 'container common_space';
      new_row.appendChild(new_row3);
      var new_row4 = document.createElement('div');
      new_row4.className = 'row d-flex';
      new_row3.appendChild(new_row4);
      this.fetchLessonObj[key].sort((a: any, b: any) => {
        return a.seq - b.seq;
      })
      for (let obj of this.fetchLessonObj[key]) {
        if (obj.type === 'unit') {
          var new_row5 = document.createElement('div');
          new_row5.className = 'col-md-3 col-sm-12 mb-3';
          var new_row6 = document.createElement('div');
          new_row6.className = 'lesn_dv les-img lesion-video-icon';
          new_row5.appendChild(new_row6);
          var new_row7 = document.createElement('div');
          new_row7.className = 'lesn_dv_img';
          new_row6.appendChild(new_row7);

          if (obj.ispaid === 0) {
            var strong1 = document.createElement('strong')
            strong1.className = 'fre_acs';
            strong1.append('Free');
            var span1 = document.createElement('span')
            span1.append('');
            strong1.appendChild(span1);
            new_row7.appendChild(strong1);
          }

          var img_row = document.createElement('img');
          img_row.src = this.FILE_URL + obj.thumbnailimg;
          new_row7.appendChild(img_row);
          var new_row8 = document.createElement('div');
          new_row8.className = 'lesn_dv_inr';
          new_row6.appendChild(new_row8);
          var new_row9 = document.createElement('div');
          new_row9.className =
            'd-flex justify-content-between align-items-start';
          new_row8.appendChild(new_row9);
          var h3_row1 = document.createElement('h3');
          h3_row1.className = 'm-0';
          new_row9.appendChild(h3_row1);
          h3_row1.append(obj.unittitle);
          var strong_row = document.createElement('strong');
          new_row9.appendChild(strong_row);
          strong_row.append(obj.unitcode);
          var p_row = document.createElement('p');
          new_row8.appendChild(p_row);
          p_row.append(obj.description);
          var p_row1 = document.createElement('p');
          new_row8.appendChild(p_row1);
          p_row1.append('Teacher:' + obj.educatorname);
          if(obj.isWatchComplete === true){
            console.log(obj,">>>>>>>>>>>>parent video")
            var img = document.createElement('img');
            img.src = 'assets/img/accept.png'; 
            img.style.marginLeft = '16px'; 
            img.style.width = '20px'; 
            img.style.height = '20px'; 
            p_row1.appendChild(img);
          }
          new_row5.addEventListener('click', () => {
            this.changeView(obj, this.courseid, this.coursename);
          });
          new_row4.appendChild(new_row5);
        } else if (obj.type === 'exercise') {
          // var new_row11 = document.createElement('div');
          // new_row11.className = 'row';
          // new_row.appendChild(new_row11);
          // var new_row12 = document.createElement('div');
          // new_row12.className = 'col-12';
          // new_row11.appendChild(new_row12);
          // var new_row13 = document.createElement('div');
          // new_row13.className = 'd-flex justify-content-center gry-bg';
          // new_row12.appendChild(new_row13);
          // var new_row14 = document.createElement('div');
          // new_row14.className = 'practice-div';
          // new_row13.appendChild(new_row14);
          // var strong_row1 = document.createElement('strong');
          // new_row14.appendChild(strong_row1);
          // strong_row1.append(
          //   'YOU’VE JUST COMPLETED ONE GOOD LESSON NOW MAKE IT PERFECT WiTH SOME PRACTICE'
          // );
          // var new_row15 = document.createElement('div');
          // new_row15.className = 'practice-partner';
          // new_row13.appendChild(new_row15);
          // var strong_row2 = document.createElement('strong');
          // new_row15.appendChild(strong_row2);
          // strong_row2.append(
          //   'Get into a conversation with your Personal Practice Partner'
          // );
          var new_row16 = document.createElement('div');
          new_row16.className = 'row mt-4';
          new_row.appendChild(new_row16);
          var new_row17 = document.createElement('div');
          new_row17.className = 'col-12';
          new_row16.appendChild(new_row17);
          var new_row18 = document.createElement('div');
          new_row18.className =
            'd-flex justify-content-between align-items-center slfsatmn';
          new_row17.appendChild(new_row18);
          var strong_row3 = document.createElement('strong');
          new_row18.appendChild(strong_row3);
          strong_row3.append('Additional Learning Recommendations');

          strong_row3.addEventListener('click', () => {
            this.common.newcourseid = this.courseid;
            if (this.common.getUserId() == null) {
              this.common.getLogin()
            } else {
              if (this.common.checkSubscription()) {
                let temp = this.common.getSubscriptionCourse()
                if (temp.length > 0) {
                  if (temp[0].isexpire == 1) {
                    this.notifierService.notify('info', 'Please renew your subscription!');
                    this.common.sheardData = obj;
                    this.common.getSubscription()
                  } else if (temp[0].courseid == this.courseid && temp[0].isexpire == 0) {
                    this.downloadPdf(obj.additional_learning_recommendations);
                  }
                  else {
                    this.common.getLeavingMidway()
                  }
                }
              } else {
                this.common.sheardData = obj;
                this.common.getSubscription()
              }
            }
          });

          var new_row19 = document.createElement('div');
          new_row19.className = 'bg-blue';
          new_row18.appendChild(new_row19);

          new_row19.addEventListener('click', () => {
            this.userCheck(obj);
          });
          var new_row20 = document.createElement('div');
          new_row20.className = 'practice-div';
          new_row19.appendChild(new_row20);
          var strong_row4 = document.createElement('strong');
          new_row20.appendChild(strong_row4);
          strong_row4.append('SELF ASSESSMENT');
          var new_row21 = document.createElement('div');
          new_row21.className = 'practice-partner';
          new_row19.appendChild(new_row21);
          var strong_row5 = document.createElement('strong');
          new_row21.appendChild(strong_row5);
          strong_row5.append('Check how well you’ve learnt this lesson');
          if (obj.isPass === true) {
            var img = document.createElement('img');
            img.src = 'assets/img/accept.png';
            img.style.marginLeft = '16px';
            img.style.width = '20px';
            img.style.height = '20px';
            strong_row5.appendChild(img); 
        }
        }
      }
      lsesonlist.appendChild(new_row);
    }
  }

  openAssesment(obj: any) {
    obj.exerciseId = obj.exerciseid;
    this.userCheck({ ...this.lessonObj, ...obj })
  }

  userCheck(obj: any): any {
    if (!this.common.getUserId()) {
      this.common.getLogin();
    } else {
      if (this.common.checkSubscription()) {
        let temp = this.common.getSubscriptionCourse()
        if (temp.length > 0) {
          if (temp[0].isexpire == 1) {
            this.notifierService.notify('info', 'Please renew your subscription!');
            this.common.sheardData = obj;
            this.common.getSubscription()
          } else if (temp[0].courseid == this.courseid && temp[0].isexpire == 0) {
            this.lessionid = obj.lessionId;
            this.exerciseId = obj.exerciseId;
            this.examtime = obj.examtime;
            this.timerTitle = this.examtime + '';
            this.exercisedescription = obj.description;
            this.lessionname = obj.lessionTitle;
            if (obj.isQna == 0) {
              this.openComingsoonModal();
            } else {
              this.getExerciseById(obj.exerciseId);
              this.openAssessmentModal();
            }
          }
          else {
            this.common.getLeavingMidway()
          }
        }
      } else {
        this.common.sheardData = obj;
        this.common.getSubscription()
      }
    }
  }

  otherAdditionalLearningRecommendations(obj: any): any {
    if (this.common.getUserId() == null) {
      this.common.getLogin()
    } else {
      if (this.common.checkSubscription()) {
        let temp = this.common.getSubscriptionCourse()
        if (temp.length > 0) {
          if (temp[0].isexpire == 1) {
            this.notifierService.notify('info', 'Please renew your subscription!');
            this.common.sheardData = obj;
            this.common.getSubscription()
          } else if (temp[0].courseid == this.courseid && temp[0].isexpire == 0) {
            this.downloadPdf(obj.additional_learning_recommendations);
          }
          else {
            this.common.getLeavingMidway()
          }
        }
      } else {
        this.common.sheardData = obj;
        this.common.getSubscription()
      }
    }
  }

  openComingsoonModal() {
    this.modalService.open(ComingSoonComponent, { centered: true, size: 'md', backdrop: false });
  }

  gotToAdditionalLearning() {
    if (this.common.checkSubscription()) {
      let temp = this.common.getSubscriptionCourse()
      if (temp.length > 0) {
        if (temp[0].isexpire == 1) {
          this.notifierService.notify('info', 'Please renew your subscription!');
          this.common.getSubscription()
        } else if (temp[0].courseid == this.courseid && temp[0].isexpire == 0) {
          this.router.navigate(['/additionalLearning/' + this.courseid]);
        } else {
          this.common.getLeavingMidway()
        }
      }
    } else {
      this.common.getSubscription()
    }

  }

  downloadPdf(url: any): any {
    if (url == '' || url == null) {
      this.openComingsoonModal();
    } else {
      window.open(this.FILE_URL + url, '_blank');
    }
  }

  openAssessmentModal() {
    this.modalService.open(this.assemessmentModal, {
      centered: true,
      size: 'xl',
      backdrop: false,
    });

  }

  closeModal() {
    this.questionArr = [];
    this.flag = 0;
    this.qnum = 1;
    this.idx = 0;
    this.timeLeft = false
    clearInterval(this.timerVal);
    this.submitBtnFlg = false;
    this.timerView = true
    this.progress = 100;
    this.modalService.dismissAll();
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

  gotoLesson(lessionid: any, i: any): any {
    for (let [index, obj] of this.lessionDetails.entries()) {
      if (index == i) {
        obj.isActive = true;
      } else {
        obj.isActive = false;
      }
    }
    this.lessionid = lessionid;
    this.isView = false;
    this.getLessionMapV2();
  }

  gotoAssessment(): void {
    this.router.navigate(['/assessment']);
  }

  getExerciseById(id: any): any {
    const data = {
      userId: this.common.getUserId(),
      exerciseId: id.toString(),
    };
    this.common.loaderStart();
    this.rest.getExerciseQuestionsAndOptions(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.attemptNo = result.response.attempt;
        let temp: any = result.response.questions;
        for (let data of temp) {
          data.required = false;
          data.checkAns = '';
        }
        this.questionArr = temp;
      }
    });
  }

  nextQuestion(num: number, data: any, i: any): any {
    this.idx = this.idx + num;
    this.qnum = this.qnum + 1;
    if (this.questionArr.length - 1 == this.idx) {
      this.submitBtnFlg = true;
      this.abortTesting = false
    } else {
      this.submitBtnFlg = false;
      this.abortTesting = true
    }
  }

  getAns(event: any, questionData: any) {
    questionData.checkAns = event.target.value;
  }

  timeLeft: any = false

  showQuestion(): any {

    if (this.questionArr.length - 1 == this.idx) {
      this.submitBtnFlg = true;
      this.abortTesting = false
    } else {
      this.submitBtnFlg = false;
      this.abortTesting = true
    }

    this.flag = 1;
    this.timer(this.examtime);
    this.subtitle = 'minute'
    this.timeLeft = true

  }

  submitAns(data: any): any {
    let temp: any = [];

    for (let item of this.questionArr) {
      temp.push({ questionid: item.questionid, answerid: item.checkAns });
    }

    this.answerList = temp;

    const value = {
      batchid: Math.floor((Math.random() * 1000000) + 1) + "",
      userid: this.common.getUserId(),
      courseid: this.courseid,
      lessionid: this.lessionid,
      exerciseid: this.exerciseId,
      answerList: this.answerList
    };


    this.rest.checkAnswer(value).subscribe((result: any) => {
      if (result.success) {
        this.notifierService.notify('success', result.message);
        clearInterval(this.timerVal);
        this.score = result.response.score
        this.scoringmessage = result.response.scoringmessage;
        this.timerView = false;
        this.flag = 3;
        this.lessonAssementComplete();
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  timer(minute: any): any {
    let progress = 0;

    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    this.timerVal = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      const remaining = `${prefix}${Math.floor(seconds / 60)}.${textSec}`;
      this.timerTitle = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      this.subtitle = 'minute left';
      this.progress = (Number(remaining) * 100) / this.examtime;
      if (seconds == 0) {
        this.timeLeft = false
        clearInterval(this.timerVal);
        this.opentimeoutModal()
      }
    }, 1000);
  }

  restSubmit(): any {

    let temp: any = [];

    for (let item of this.questionArr) {
      temp.push({ questionid: item.questionid, answerid: item.checkAns });
    }

    this.answerList = temp;

    const value = {
      batchid: Math.floor((Math.random() * 1000000) + 1) + "",
      userid: this.common.getUserId(),
      courseid: this.courseid,
      lessionid: this.lessionid,
      exerciseid: this.exerciseId,
      answerList: this.answerList
    };


    this.rest.checkAnswer(value).subscribe((result: any) => {
      if (result.success) {
        this.notifierService.notify('success', result.message);
        this.score = result.response.score
        this.scoringmessage = result.response.scoringmessage
        this.timerView = false
        this.flag = 3;
        this.lessonAssementComplete();
      } else {
        this.notifierService.notify('error', result.message);
      }
    })

  }

  openaborttestModal(): any {
    this.modalRef = this.modalService.open(this.abortModal, {
      centered: true,
      size: 'sm',
      backdrop: true,
    });
  }

  closeAbortMOdal(): any {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  lessonAssementComplete() {
    const data = {
      courseid: this.courseid,
      userId: this.common.getUserId()
    };
    // this.common.loaderStart();
    this.rest.lessonAssementComplete(data).subscribe((res: any) => {
      // this.common.loaderEnd();
      if (res.success) {
        this.assesmentcompletion = res.response.assesmentcompleted;
      }
    })
  }

progressPercentage() {
  const data = {
    lessionid: this.lessionid,
    courseid: this.courseid,
  }
  this.rest.getProgressPercent(data).subscribe((res:any) => {
    if(res.success){
        this.progressPerecent=res.response.watchPercentage
        this.progressPerecent=Math.round(res.response.watchPercentage)
    }
  })
}

}
