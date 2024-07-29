import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-final-assesment',
  templateUrl: './final-assesment.component.html',
  styleUrls: ['./final-assesment.component.css']
})
export class FinalAssesmentComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('listeningModal') listeningModal: any;
  @ViewChild('abortModal', { static: false }) abortModal: any;
  @ViewChild('timeoutModal', { static: false }) timeoutModal: any;

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
  totalAssesment: number = 0;
  courseid: any = '';
  score: any = '';
  FILE_URL: string;
  courseDetails: any;
  answerList: any = [];
  scoringmessage: any = '';
  audioflag: boolean = false;
  readingAssementFlag: boolean = false;
  listeningAssesmentFlag: boolean = false;
  constructor(
    private rest: RestApiService, private common: CommonService, private active: ActivatedRoute, private notifierService: NotifierService, private modalService: NgbModal, private router: Router
  ) {
    this.FILE_URL = rest.FILE_URL;
  }
  ngOnDestroy(): void {
    // localStorage.removeItem('completed');
  }
  ngOnInit(): void {
    if (!this.common.getUserId()) {
      this.router.navigate(['/']);
    }
    window.scrollTo(0, 0);
    this.courseid = this.active.snapshot.paramMap.get('id');
    this.courseDetails = JSON.parse(this.common.getCourseDetails());
    let completed: any = (localStorage.getItem('completed'));
    if (completed) {
      completed = JSON.parse(completed);
      this.readingAssementFlag = completed.readFlag;
      this.listeningAssesmentFlag = completed.listenFlag;
    } else {
      this.readingAssementFlag = false;
      this.listeningAssesmentFlag = false;
    }
    this.finalAssessmentSummary()
  }
  openassesmentModal(type: number, modal: any) {
    this.assesementType = '';
    if (type == 1) {
      this.assesementType = type;
      this.closeModal();
      this.getAssesentsByCoursId(1);
      this.modalService.open(modal, { centered: true, backdrop: false, size: 'xl' });
    } else if (type == 2) {
      this.assesementType = type;
      this.closeModal();
      this.getAssesentsByCoursId(2);
      this.modalService.open(modal, { centered: true, backdrop: false, size: 'xl' });
    }
  }
  openSpeakingAssesment(modal: any) {
    if (this.readingFlag == true && this.listeningFlag == true && this.speakingFlag == false) {
      this.assesementType = 3;
      this.getAssesentsByCoursId(3);
      this.modalService.open(modal, { centered: true, backdrop: false, size: 'lg' });
    } else if ((this.readingFlag == true && this.listeningFlag == false) || (this.readingFlag == false && this.listeningFlag == true)) {
      this.notifierService.notify('info', "You have to complete Reading & Listening assesment first");
    } else if (this.readingFlag == true && this.listeningFlag == true && this.speakingFlag == true) {
      this.notifierService.notify('info', "You have  completed all the assesments");
    }
    else {
      this.notifierService.notify('info', "You have to complete Reading & Listening assesment first");
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
    if (data.checkAns === undefined || data.checkAns === null) {
      this.notifierService.notify('error', 'You have to submit your answer before proceeding');
      return false;
    }
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
        this.finalAssessmentSummary();
        if (this.assesementType == 1) {
          this.readingAssementFlag = true;
        } else if (this.assesementType == 2) {
          this.listeningAssesmentFlag = true;
        }
        let obj = {
          readFlag: this.readingAssementFlag,
          listenFlag: this.listeningAssesmentFlag
        }
        localStorage.setItem('completed', JSON.stringify(obj));
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

  closeListeningModal() {
    this.questionArr = [];
    this.flag = 0;
    this.qnum = 1;
    this.idx = 0;
    this.timeLeft = false
    clearInterval(this.timerVal);
    this.submitBtnFlg = false;
    this.timerView = true
    this.progress = 100;
    localStorage.setItem('goto', 'speak');
    this.modalService.dismissAll();
    window.history.back();
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
        this.finalAssessmentSummary();
        if (data.assesmenttype == 1) {
          this.readingAssementFlag = true;
        } else if (data.assesmenttype == 2) {
          this.listeningAssesmentFlag = true;
        }
        let obj = {
          readFlag: this.readingAssementFlag,
          listenFlag: this.listeningAssesmentFlag
        }
        localStorage.setItem('completed', JSON.stringify(obj));
      } else {
        this.notifierService.notify('error', result.message);
      }
    });
  }
  openaborttestModal() {
    this.modalRef = this.modalService.open(this.abortModal, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
  }

  closeAbortMOdal(): any {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  speech: any;
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
        this.speech.rate = 1
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
    // Select a voice
    setTimeout(() => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.speech.voice = voices[0];
      } else {
        console.error('No voices available.');
        return;
      }
      // Speak the text
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
    const data = {
      userid: this.common.getUserId(),
      courseid: this.courseid
    };
    this.common.loaderStart();
    this.rest.finalAssessmentSummary(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.finalreport = res.response;
        for (let item of this.finalreport) {
          this.totalAssesment += item.max_score;
          if (item.assesmenttype == 1 && item.submitted) {
            this.readingFlag = true;
            this.listeningFlag = false;
          } else if (item.assesmenttype == 2 && item.submitted && this.readingFlag == true) {
            this.readingFlag = true;
            this.listeningFlag = true;
          } else if (item.assesmenttype == 3 && item.submitted) {
            this.listeningFlag = true;
            this.speakingFlag = true;
            this.readingFlag = true;
          }
        }
      } else {
        this.finalreport = [];
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    });
  }
}
