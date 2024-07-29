import { Injectable, HostListener } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";
import { Subject, Subscribable, subscribeOn } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { SubscriptionComponent } from './user/subscription/subscription.component';
import { SubscriptionSuccessComponent } from './user/subscription-success/subscription-success.component';
import { ComingSoonComponent } from './user/coming-soon/coming-soon.component';
import { LanguagePopupComponent } from './user/language-popup/language-popup.component';
import { LeavingMidwayComponent } from './user/leaving-midway/leaving-midway.component';

import * as Plyr from 'plyr';

declare var Hls: any;

function _window(): any {
  return window;
}


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  get nativeWindow(): any {
    return _window();
  }

  PAYLOAD_ENC_DEC: string = "4f776e6616e74616WOWL@2024#123ADCT$1ad%dsd^9*!3dreADe75446173";
  Video_URL: any = ''
  FILE_URL: any = ''
  Subject = new Subject<any>();
  sheardId: any = ''
  sheardData: any
  isSignFlag: boolean = false;
  newcourseid: any = '';
  userdetailsSub = new Subject<any>();

  courseUrl: any
  assignmentDtl: any = null;

  get userCountryCode() {
    return sessionStorage.getItem('userCountryCode');
  }

  constructor(private modalService: NgbModal, private spinner: NgxSpinnerService, private rest: RestApiService) {
    this.Video_URL = this.rest.Video_URL;
    this.FILE_URL = this.rest.FILE_URL
  }

  ngOnInit(): void {
    if (this.getSignin()) {
      this.isSignFlag = this.getSignin()
    }
  }


  decryptPayload(data: any): any {
    return JSON.parse(CryptoJS.AES.decrypt(data, this.PAYLOAD_ENC_DEC.trim()).toString(CryptoJS.enc.Utf8));
  }

  encryptPayload(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.PAYLOAD_ENC_DEC).toString();
  }

  public doUnload(): void {
    this.doBeforeUnload();
  }

  public doBeforeUnload(): void {
    if (!this.isSignFlag) {
      this.logoutUser()
    }
  }

  checkSubscription(): any {
    const data: any = localStorage.getItem('checkspbu')

    if (data) {
      const val: any = JSON.parse(this.decryptPayload(data))
      console.log(val)
      return val.length !== 0 ? true : false
    } else {
      return false
    }
  }

  getSubscriptionCourse(): any {
    let data: any = localStorage.getItem('checkspbu');
    if (data) {
      return JSON.parse(this.decryptPayload(data));
    } else {
      return null;
    }
  }

  getUser(): any {
    const data: any = localStorage.getItem('user')
    if (data) {
      return JSON.parse(this.decryptPayload(data));
    } else {
      return null;
    }
  }

  getLoginAudit(): any {
    const data: any = localStorage.getItem('user');
    if (data) {
      let val: any = this.decryptPayload(data);
      return val.loginauditid ? val.loginauditid : null;
    } else {
      return null;
    }
  }

  getSubscriptionCourseExpire(): any {
    let data: any = localStorage.getItem('checkspbu');
    if (data) {
      data = JSON.parse(this.decryptPayload(data));
      console.log("data", data)
      if (data.length > 0) {
        if (data[0].isexpire == 1) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  capitalize(s: any): any {
    return s[0].toUpperCase() + s.slice(1);
  }

  getUserId(): any {
    const data: any = localStorage.getItem('userid');
    if (data) {
      return this.decryptPayload(data);
    } else {
      return null;
    }
  }

  getUserImage(): any {
    const data: any = localStorage.getItem('userimage');
    if (data) {
      return this.decryptPayload(data);
    } else {
      return null;
    }
  }

  getLoginUserName(): any {
    const data: any = localStorage.getItem('name');
    if (data) {
      return this.decryptPayload(data);
    } else {
      return null;
    }
  }

  getUserType(): any {
    const type = localStorage.getItem('usertype');
    if (type) {
      return JSON.parse(this.decryptPayload(type));
    } else {
      return null;
    }
  }

  loaderStart(): void {
    this.spinner.show();
  }

  loaderEnd(): void {
    this.spinner.hide();
  }

  formatTime(min: any): any {
    if (isNaN(min) || min < 0) {
      return '0';
    }
    const hours = Math.floor(min / 60);
    const remainingMinutes = min % 60;
    let temp = '';
    if (hours > 0) {
      if (hours !== 1) {
        temp = `${hours} Hours`;
      } else {
        temp = `${hours} Hour`;
      }
    }

    if (remainingMinutes > 0) {
      temp += ` ${remainingMinutes} Minutes`;
    }

    return temp;
  }

  formatDate(date: any, flag = 0, format = 'YYYY-MM-DD') {
    let d = flag === 0 ? new Date(date) : date, month = '' + (d.getMonth() + 1), day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (format === 'YYYY-MM-DD') {
      return [year, month, day].join('-');
    } else {
      return [day, month, year].join('-');
    }
  }

  formatDateTime(date: any, flag = 0, format = 'YYYY-MM-DD') {
    let d = flag === 0 ? new Date(date) : date, month = '' + (d.getMonth() + 1), day = '' + d.getDate(),
      hours = '' + d.getHours(), minutes = '' + d.getMinutes(), second = '' + d.getSeconds(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (second.length < 2) second = '0' + second;
    if (format === 'YYYY-MM-DD') {
      return [year, month, day].join('-') + ' ' + [hours, minutes, second].join(':');
    } else {
      return [day, month, year].join('-') + ' ' + [hours, minutes, second].join(':');
    }
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  getUserTypePermission(): any {
    if (localStorage.getItem('usertype') === '1') {
      return 1;
    }
    if (localStorage.getItem('usertype') === '2') {
      return 2;
    }
    if (localStorage.getItem('usertype') === '3') {
      return 3;
    }
    // return 2
  }

  getTrancoding(vContainerId: any, videoWidth: any, videoHeight: any, videoUrl: any, thumbnailImage: any): any {
    const video = document.createElement('video');
    const vContainer: any = document.getElementById(vContainerId);
    vContainer.innerHTML = '';
    video.className = 'urlvideoplayer';
    video.controls = true;
    video.style.width = videoWidth;
    video.style.height = videoHeight;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.Video_URL + videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.Video_URL + videoUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
    vContainer.appendChild(video);
  }

  getLogin(): any {
    this.modalService.open(LoginComponent, { centered: true, size: 'md', backdrop: false });
  }

  getSignup(): any {
    this.modalService.open(SignupComponent, { centered: true, size: 'md', backdrop: false });
  }

  getSubscription(): any {
    this.modalService.open(SubscriptionComponent, { centered: true, size: 'lg', backdrop: false });
  }

  getSubscriptionSuccess(): any {
    this.modalService.open(SubscriptionSuccessComponent, { centered: true, size: 'md', backdrop: false });
  }

  getComingSoon(): any {
    this.modalService.open(ComingSoonComponent, { centered: true, size: 'md', backdrop: false });
  }

  getLessionPopup(): any {
    this.modalService.open(LanguagePopupComponent, { centered: true, size: 'md', backdrop: false });
  }

  getLeavingMidway(): any {
    this.modalService.open(LeavingMidwayComponent, { centered: true, size: 'md', backdrop: false });
  }

  getLessonVideo(): any {
    const data: any = localStorage.getItem('video-lession');
    if (data) {
      return JSON.parse(this.decryptPayload(data));
    } else {
      return null;
    }
  }

  getLimit(): any {
    return sessionStorage.getItem('limit')
  }

  getOffset(): any {
    return sessionStorage.getItem('offset')
  }

  getSearchText(): any {
    return sessionStorage.getItem('searchText')
  }

  getCourseid(): any {
    return sessionStorage.getItem('courseid')
  }

  getCourseName(): any {
    return sessionStorage.getItem('coursename')
  }

  getLessonid(): any {
    return sessionStorage.getItem('lessionid')
  }

  getLessonName(): any {
    return sessionStorage.getItem('lessionname')
  }

  setUser(data: any): any {
    localStorage.setItem('user', this.encryptPayload(data))
  }

  setUserid(data: any): any {
    localStorage.setItem('userid', this.encryptPayload(data))
  }

  setLoginauditid(data: any): any {
    localStorage.setItem('loginauditid', this.encryptPayload(data))
  }

  setUserimage(data: any): any {
    localStorage.setItem('userimage', this.encryptPayload(data))
  }

  setCheckspbu(data: any): any {
    localStorage.setItem('checkspbu', this.encryptPayload(data))
  }

  setVideoLession(data: any): any {
    localStorage.setItem('video-lession', this.encryptPayload(data))
  }

  setSignin(data: any): any {
    localStorage.setItem('isSign', this.encryptPayload(data))
  }

  getSignin(): any {
    const data: any = localStorage.getItem('isSign');
    if (data) {
      return this.decryptPayload(data);
    } else {
      return null;
    }
  }

  getLoginauditid(): any {
    const data: any = localStorage.getItem('loginauditid');
    if (data) {
      return this.decryptPayload(data);
    } else {
      return null;
    }
  }

  logoutUser(): any {
    localStorage.removeItem("user");
    localStorage.removeItem("userid");
    localStorage.removeItem("userimage");
    localStorage.removeItem("isEdit")
    localStorage.removeItem("checkspbu")
    localStorage.removeItem("isSign")
    localStorage.removeItem("loginauditid")
    localStorage.removeItem("completed");
    localStorage.removeItem('goto');

  }

  logoutAdmin(): any {
    localStorage.removeItem("name");
    localStorage.removeItem("userid");
    localStorage.removeItem("usertype");
  }

  clearAdminData(): any {
    sessionStorage.removeItem('limit')
    sessionStorage.removeItem('offset')
    sessionStorage.removeItem('searchText')
    sessionStorage.removeItem('courseid')
    sessionStorage.removeItem('coursename')
    sessionStorage.removeItem('lessionid')
    sessionStorage.removeItem('lessionname')
  }

  setLimit(data: any): any {
    sessionStorage.setItem('limit', data)
  }

  setOffset(data: any): any {
    sessionStorage.setItem('offset', data)
  }

  setSearchText(data: any): any {
    sessionStorage.setItem('searchText', data)
  }

  setCourseid(data: any): any {
    sessionStorage.setItem('courseid', data)
  }

  setCoursename(data: any): any {
    sessionStorage.setItem('coursename', data)
  }

  setLessionid(data: any): any {
    sessionStorage.setItem('lessionid', data)
  }

  setLessionname(data: any): any {
    sessionStorage.setItem('lessionname', data)
  }

  removeUserImage(): any {
    localStorage.removeItem('userimage')
  }

  setPartnerId(data: any) {
    sessionStorage.setItem('partnerid', data)
  }

  getPartnerId() {
    return sessionStorage.getItem('partnerid');
  }

  setAdminData(data: any): any {
    localStorage.setItem('name', this.encryptPayload(data.name));
    localStorage.setItem('userid', this.encryptPayload(data.userId));
    localStorage.setItem('usertype', this.encryptPayload(data.userType));
  }

  setCourseDetails(data: any) {
    localStorage.setItem('courseDetails', this.encryptPayload(data))
  }

  getCourseDetails(): any {
    const data: any = localStorage.getItem('courseDetails');
    if (data) {
      return this.decryptPayload(data);
    } else {
      return null;
    }
  }

  async getCurrentCountry() {
    try {
      const data = await fetch('https://api.ipify.org?format=json');
      const resp = await data.json();
      if (resp) {
        const country = await fetch('https://ipapi.co/' + resp.ip + '/json/');
        const countryResp = await country.json();
        return countryResp.country_calling_code.replace('+', '');
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
}
