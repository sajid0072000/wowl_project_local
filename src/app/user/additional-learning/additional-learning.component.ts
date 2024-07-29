import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-additional-learning',
  templateUrl: './additional-learning.component.html',
  styleUrls: ['./additional-learning.component.css']
})
export class AdditionalLearningComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('listeningModal') listeningModal: any;
  @ViewChild('abortModal', { static: false }) abortModal: any;
  @ViewChild('timeoutModal', { static: false }) timeoutModal: any;

  FILE_URL = "";
  courseid: any = ''
  title: any = ''
  attemptNo: any = ''
  score: any = ''
  lessionid: any = ''
  selfArr: any = [];
  totalScore = 0
  totalAttempt = 0
  learninghours: any = [];
  sum: any = ''
  qnum: number = 1;
  flag: number = 0;
  abortTesting: boolean = true;
  idx: number = 0;
  submitBtnFlg: boolean = false;
  coursename: any = ''
  progress = 100;
  timerView: boolean = true;
  timerTitle = '';
  subtitle = 'minute';
  examtime: any = 30;
  timerVal: any;
  actionText: string = '';
  transcript: string = '';
  isOutputHidden: boolean = true;
  recognition: any;
  modalRef: any;
  finalreport: any = [];
  readingFlag: boolean = false;
  speakingFlag: boolean = false;
  listeningFlag: boolean = false;
  questionArr: any = [];
  timeLeft: any = false;
  assesementType: any = '';
  totalAssementScore: number = 0;
  totalAssesment: number = 0;
  bannerImage: any = '';
  userName: any = ''
  courseDetails: any;
  speech: any;
  audioflag: boolean = false;
  answerList: any = [];
  scoringmessage: any = '';
  totalSpentLession = 0

  readingUnderDays: boolean = false;
  listeningUnderDays: boolean = false;
  speakingUnderDays: boolean = false;

  readingListeningDayCount: number = 0;
  speakingDayCount: number = 0;

  constructor(private rest: RestApiService, private common: CommonService, private active: ActivatedRoute, private notifierService: NotifierService, private modalService: NgbModal, private router: Router) {
    this.FILE_URL = rest.FILE_URL;
  }
  ngOnDestroy(): void {
    localStorage.removeItem('goto');
  }
  ngOnInit(): void {
    if (!this.common.getUserId()) {
      this.router.navigate(['/']);
    }
    console.log(this.common.getUserId());
    this.courseid = this.active.snapshot.paramMap.get('id');
    this.courseDetails = JSON.parse(this.common.getCourseDetails());
    this.userName = this.common.getUser().name;
    this.selfAssessmentSummary()
    let goto = localStorage.getItem('goto');
    if (goto) {
      setTimeout(() => {
        let div: any = document.getElementById('speak-asm');
        div.scrollIntoView({ block: 'center' });
      }, 150);
    } else {
      setTimeout(() => { window.scrollTo(0, 0); }, 100);
    }
  }
  selfAssessmentSummary(): any {
    const data = {
      courseid: this.courseid,
      userid: this.common.getUserId()
    }
    this.common.loaderStart()
    this.rest.selfAssessmentSummary(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.selfArr = result.response;
        let total = (this.selfArr.length * 10);
        this.totalScore = this.selfArr.reduce((sum: any, item: { score: any; }) => sum + (item.score || 0), 0);
        this.totalSpentLession = this.selfArr.reduce((sum: any, item: { spentForLession: any; }) => sum + (item.spentForLession || 0), 0);
        let percentage = (this.totalScore / total) * 100;
        let scoreOutOf50 = (percentage / 100) * 50;
        this.totalScore = Math.round(scoreOutOf50);
        this.finalAssessmentSummary();
        this.totalAttempt = this.selfArr.reduce((sum: any, item: { attemptNo: any; }) => sum + (item.attemptNo || 0), 0)
      } else {
        this.notifierService.notify('error', result.message)
      }
    });
  }
  updateselfAssessmentSummary(lessionid: any, idx: any): any {
    let score: any = '';
    let attemptNo: any = '';
    for (let i = 0; i < this.selfArr.length; i++) {
      score = this.selfArr[idx].score;
      attemptNo = this.selfArr[idx].attemptNo;
      break;
    }
    const data = {
      courseid: this.courseid,
      userid: this.common.getUserId(),
      summary: [
        {
          lessionid: lessionid,
          learninghours: this.learninghours[idx],
          attemptNo: attemptNo,
          score: score
        }
      ]
    }
    this.common.loaderStart()
    this.rest.updateSelfAssessmentSummary(data).subscribe((result: any) => {
      this.common.loaderEnd()
      if (result.success) {
        this.notifierService.notify('success', result.message);
      } else {
        this.notifierService.notify('error', result.message)
      }
    })
  }
  gotoAssesment(modal: any) {
    if (this.readingFlag == true && this.listeningFlag == true) {
      this.notifierService.notify('info', "You completed Reading & Listening assesment!");
    } else if (this.readingFlag == true && this.listeningFlag == false && this.listeningUnderDays == false) {
      this.router.navigate(['/final-assesment/' + this.courseid]);
    }
    else if (this.readingFlag == false && this.listeningFlag == false && this.readingUnderDays == false && this.listeningFlag == false) {
      this.router.navigate(['/final-assesment/' + this.courseid]);
    } else {
      this.notifierService.notify('info', `You have completed this assessment. You have the option to reappear after 14 days`);
    }
    // this.modalService.open(modal, { centered: true, backdrop: false, size: 'lg' });
  }
  openassesmentModal(type: number, modal: any) {
    this.assesementType = '';
    if (type == 1) {
      this.assesementType = type;
      this.closeModal();
      this.getAssesentsByCoursId(1);
      this.modalService.open(modal, { centered: true, backdrop: false, size: 'lg' });
    } else if (type == 2) {
      this.assesementType = type;
      this.closeModal();
      this.getAssesentsByCoursId(2);
      this.modalService.open(modal, { centered: true, backdrop: false, size: 'lg' });
    }
  }

  openSpeakingAssesment(modal: any) {
    if (this.readingFlag == true && this.listeningFlag == true && this.speakingFlag == false && this.speakingUnderDays == false) {
      this.assesementType = 3;
      this.getAssesentsByCoursId(3);
      this.modalService.open(modal, { centered: true, backdrop: false, size: 'xl' });
    } else if ((this.readingFlag == true && this.listeningFlag == false) || (this.readingFlag == false && this.listeningFlag == true) || (this.readingFlag == false && this.listeningFlag == false)) {
      this.notifierService.notify('info', "You have to complete Reading & Listening assesment first");
    } else if (this.readingFlag == true && this.listeningFlag == true && this.speakingFlag == true) {
      this.notifierService.notify('info', "You have  completed all the assesments");
    }
    else {
      this.notifierService.notify('info', `You have completed this assessment. You have the option to reappear after 14 days`);
    }
  }
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
  getAssesentsByCoursId(type: any) {
    this.questionArr = [];
    this.qnum = 1;
    this.idx = 0;
    this.submitBtnFlg = false;
    const data = {
      courseid: this.courseid,
      assesmenttype: type
    };
    this.common.loaderStart();
    this.rest.getFinalAssesmentByCourseId(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.examtime = res.response.examtime;
        this.timerTitle = this.examtime + '';
        this.questionArr = res.response.assesment;
      } else {
        this.questionArr = [];
      }
    });
  }
  playAudio() {
    const plyr = document.getElementById('audio-plyr') as HTMLAudioElement;

    this.audioflag = true;
    if (this.audioflag) {
      plyr.play();
    } else {
      plyr.pause();
    }
  }
  nextQuestion(num: number, data: any, i: any): any {
    this.idx = this.idx + num;
    this.qnum = this.qnum + 1;
    this.audioflag = false;
    if (this.questionArr.length - 1 == this.idx) {
      this.submitBtnFlg = true;
      this.abortTesting = false
    } else {
      this.submitBtnFlg = false;
      this.abortTesting = true
    }
  }
  getAns(e: any, questionData: any) {
    if (questionData.assesmenttype == 3) {
      questionData.checkAns = questionData.transcript;
    } else {
      questionData.checkAns = e.target.value;
    }
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
  restSubmit() {
    let temp: any = [];

    for (let item of this.questionArr) {
      if (item.assesmenttype == 3) {
        temp.push({ assesmentid: item.assesmentid, assesmenttype: item.assesmenttype, answer: item.transcript ? item.transcript : '' });
      } else {
        temp.push({ assesmentid: item.assesmentid, assesmenttype: item.assesmenttype, answer: item.checkAns });
      }
    }
    this.answerList = temp;
    const value = {
      batchid: Math.floor((Math.random() * 1000000) + 1) + "",
      userid: this.common.getUserId(),
      courseid: this.courseid,
      assesmenttype: this.assesementType,
      answerList: this.answerList
    };
    this.rest.submitAssesment(value).subscribe((result: any) => {
      if (result.success) {
        this.notifierService.notify('success', result.message);
        clearInterval(this.timerVal);
        this.score = result.response.score
        this.scoringmessage = result.response.scoringmessage;
        this.timerView = false
        this.flag = 3;
        // this.modalService.dismissAll();
        this.finalAssessmentSummary();
      } else {
        this.notifierService.notify('error', result.message);
      }
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
    this.progress = 100
    this.modalService.dismissAll();
  }
  submitAns(data: any): any {
    let temp: any = [];
    for (let item of this.questionArr) {
      if (item.assesmenttype == 3) {
        temp.push({ assesmentid: item.assesmentid, assesmenttype: item.assesmenttype, answer: item.transcript ? item.transcript : '' });
      } else {
        temp.push({ assesmentid: item.assesmentid, assesmenttype: item.assesmenttype, answer: item.checkAns });
      }
    }
    this.answerList = temp;
    const value = {
      batchid: Math.floor((Math.random() * 1000000) + 1) + "",
      userid: this.common.getUserId(),
      courseid: this.courseid,
      assesmenttype: data.assesmenttype,
      answerList: this.answerList
    };
    this.rest.submitAssesment(value).subscribe((result: any) => {
      if (result.success) {
        this.notifierService.notify('success', result.message);
        clearInterval(this.timerVal);
        this.score = result.response.score
        this.scoringmessage = result.response.scoringmessage;
        this.timerView = false
        this.flag = 3;
        // this.modalService.dismissAll();
        this.finalAssessmentSummary();
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }
  openaborttestModal() {
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
  runSpeechRecog(data: any) {
    // this.speech = null;
    this.isOutputHidden = false;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || (window as any).mozSpeechRecognition || (window as any).msSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onstart = () => {
    };
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      data.transcript = transcript;
      setTimeout(() => {
        this.speech = new SpeechSynthesisUtterance();
        this.speech.text = transcript;
        this.speech.lang = 'en-US';
        this.speech.pitch = 1;
        this.speech.rate = 1;
      }, 400);
      this.isOutputHidden = false;
      this.actionText = '';
    };
    this.recognition.onerror = (event: any) => {
      this.actionText = `Error: ${event.error}`;
    };
    this.recognition.onend = () => {
      this.actionText = '';
    };
    this.recognition.start();
  }
  speak() {
    this.stopSpeechRecog();
    setTimeout(() => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.speech.voice = voices[0];
      } else {
        return;
      }
      speechSynthesis.speak(this.speech);
    }, 500);
  }
  stopSpeechRecog() {
    this.recognition.stop();
    this.recognition.stop();
  }
  finalAssessmentSummary() {
    this.readingFlag = false;
    this.speakingFlag = false;
    this.listeningFlag = false;
    this.totalAssesment = 0;
    const data = {
      userid: this.common.getUserId(),
      courseid: this.courseid
    };
    this.common.loaderStart();
    this.rest.finalAssessmentSummary(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.finalreport = res.response;
        console.log(this.finalreport,">>>>>>>>>.finalreport")
        for (let item of this.finalreport) {

          let currentDate: any = new Date();
          let createdAt: any = new Date(item.createdat);

          let dayDiff = currentDate - createdAt;
          dayDiff = dayDiff / (1000 * 60 * 60 * 24)
          if ((item.assesmenttype == 1 && item.submitted && dayDiff < 14 )) {
            this.readingFlag = true;
            this.listeningFlag = false;
            this.speakingFlag = true;
            this.totalAssesment += item.max_score;
            // this.notifierService.notify('info',"You have completed this assessment. You have the option to reappear after 14 days")
          } else if ((item.assesmenttype == 2 && item.submitted && this.readingFlag == true && dayDiff < 14)) {
            this.speakingFlag = false;
            this.readingFlag = true;
            this.listeningFlag = true;
            this.totalAssesment += item.max_score;
            // this.notifierService.notify('info',"You have completed this assessment. You have the option to reappear after 14 days")
          } else if (item.assesmenttype == 3 && item.submitted && dayDiff < 14) {
            this.listeningFlag = true;
            this.speakingFlag = true;
            this.readingFlag = true;
            // this.notifierService.notify('info',"You have completed this assessment. You have the option to reappear after 14 days")
            setTimeout(() => {
              this.totalAssementScore = this.totalAssesment + item.max_score + this.totalScore;
            }, 100);
          }
          else if (item.assesmenttype == 1 && !item.submitted && dayDiff < 14) {
            this.readingUnderDays = true;
            this.readingListeningDayCount = 14 - Math.round(dayDiff);
            // this.notifierService.notify('info',"O-Oh! You haven’t met the passing criteria this time, please review the lessons and strengthen your understanding. You can reappear after 14 days.")
          }
         else if (item.assesmenttype == 2 && !item.submitted && dayDiff < 14) {
            this.listeningUnderDays = true;
            if (this.readingListeningDayCount == 0 && this.readingFlag == true) {
              this.readingListeningDayCount = 14 - Math.round(dayDiff);
            }
            // this.notifierService.notify('info',"O-Oh! You haven’t met the passing criteria this time, please review the lessons and strengthen your understanding. You can reappear after 14 days.")
          }
          else if (item.assesmenttype == 3 && !item.submitted && dayDiff < 14) {
            this.speakingUnderDays = true;
            this.speakingDayCount = 14 - Math.round(dayDiff);
          }
          // this.notifierService.notify('info',"O-Oh! You haven’t met the passing criteria this time, please review the lessons and strengthen your understanding. You can reappear after 14 days.")
        }
      } else {
        this.finalreport = [];
        this.totalAssesment = 0;
        this.totalAssementScore = 0;
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    });
  }


  updateSpentForLession(items: any) {
    const data = {
      "mst_exercises_attempt_id": items.mst_exercises_attempt_id,
      "spentForLession": items.spentForLession == "" ? "0" : items.spentForLession,
      "userId": this.common.getUserId(),
    }
    this.common.loaderStart();
    this.rest.updateSpentForLession(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.selfAssessmentSummary();
      } else {
        this.notifierService.notify('error', res.message)
      }
    })
  }

  getCertificate() {
    const data = {
    "userid":this.common.getUserId(),
    "courseid":this.courseid
    }
    this.common.loaderStart();
    this.rest.getCertificate(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
      } else {
        this.notifierService.notify('error', res.message)
      }
    })
  }

  validateNumberInput(event: KeyboardEvent): boolean {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    if (inputChar === '.' && (event.target as HTMLInputElement).value.includes('.')) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  
}
