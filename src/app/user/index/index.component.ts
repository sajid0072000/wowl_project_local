import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
declare var $: any;
import { NotifierService } from "angular-notifier";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {


  isNav: boolean = false;
  isTop: boolean = true
  isNavADropDown: boolean = false
  menuArr: any = []
  url = '' as any
  FILE_URL: any = ''
  educatorLimit: any = 10
  educatorOffset: any = 0
  educatorArr = [] as any
  headerCategoryButtonArr: any = []
  teacher_leadObj: any = {}
  nav: boolean = false
  limitNotification: any = 20;
  offsetNotification: any = 0;
  notificationArr: any = []
  whyWowlLimit: any = 20
  whyWowlOffset: any = 0
  whyWowlArr: any = []
  limitLandingContent: any = 20
  offsetLandingContent: any = 0
  LandingContent: any = []
  landingTitle: any = ''
  landingContentimg: any = ''
  landingDescription: any = ''
  landingTitle1: any = ''
  landingContentimg1: any = ''
  landingDescription1: any = ''
  offset: any = 0
  limit: any = 20
  teamwowlList: any = []
  videoDiv: boolean = false
  deviceInfo: any;
  isMobile: boolean = false;
  constructor(private router: Router, private rest: RestApiService, public common: CommonService, private notifierService: NotifierService,
    private deviceService: DeviceDetectorService) { this.FILE_URL = this.rest.FILE_URL }


  ngOnInit(): void {
    window.scroll(0, 0);
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    // console.log(this.deviceInfo.os, isMobile);

    (async () => {
      const userCountryCode = await this.common.getCurrentCountry();
      sessionStorage.setItem('userCountryCode', userCountryCode);
    })();

    const userType = this.common.getUserType();
    if (userType === 1) {
      this.router.navigate(['/admin/app/admin-dashboard'])
    }
    if (userType === 2) {
      this.router.navigate(['/admin/app'])
    }
    if (userType === 4) {
      this.router.navigate(['/admin/app/partner-dashboard'])
    }
    this.getEducatorList()
    this.getMenuArr()
    this.getGuidedVideo()
    this.getDetails()
    if (this.common.getUserId() !== null) {
      this.checkSubscriptionplanofuser()
      this.getNotification()
    }
    this.intervalNotification()
    this.common.Subject.subscribe((res: any) => {
      this.getNotification()
    })
    this.getWhyWowl()
    this.getLandingContent();
  }

  getWhyWowl(): any {
    let data = {
      "limit": this.whyWowlLimit,
      "offset": this.whyWowlOffset
    }
    this.rest.getWhyWowl(data).subscribe((result: any) => {
      if (result.success) {
        this.whyWowlArr = result.response
      } else {
        this.whyWowlArr = []
      }
    })
  }

  getLandingContent(): any {
    let data = {
      "limit": this.limitLandingContent,
      "offset": this.offsetLandingContent
    }
    this.rest.getLandingContent(data).subscribe((result: any) => {
      if (result.success) {
        this.LandingContent = result.response
        this.landingTitle = this.LandingContent[0].title
        this.landingContentimg = this.LandingContent[0].contentimg
        this.landingDescription = this.LandingContent[0].description
        this.landingTitle1 = this.LandingContent[1].title
        this.landingContentimg1 = this.LandingContent[1].contentimg
        this.landingDescription1 = this.LandingContent[1].description
      } else {
        this.LandingContent = []
      }
    })
  }

  getDetails(): any {
    let data = {
      "offset": this.offset,
      "limit": this.limit
    }
    this.common.loaderStart();
    this.rest.getTeamwowl(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.teamwowlList = res.response;
      } else {
        this.teamwowlList = [];
      }
    })
  }

  intervalNotification(): any {
    setInterval(() => {
      if (this.common.getUserId() !== null) {
        this.getNotification()
      }
    }, 30000)
  }

  getNotification(): any {
    const data = {
      "limit": this.limitNotification.toString(),
      "offset": this.offsetNotification.toString(),
      "userid": this.common.getUserId()
    }
    this.rest.getNotification(data).subscribe((result: any) => {
      if (result.success) {
        if (result.response.length > 0) {
          this.notificationArr = result.response;
        } else {
          this.notificationArr = [];
        }
      } else {
        this.notificationArr = [];
      }
    })
  }

  playVideo(): any {
    this.videoDiv = true;
    setTimeout(() => {
      this.common.getTrancoding('video-container1', '100%', '100%', this.teacher_leadObj.video, this.teacher_leadObj.thumbnailImage)
    }, 500);
  }

  getGuidedVideo(): any {
    this.rest.getGuidedVideo({}).subscribe((result: any) => {
      if (result.success) {
        this.common.setVideoLession(JSON.stringify(result.response.learning_guided))
        this.teacher_leadObj = result.response.teacher_lead

      }
    })
  }

  login(): any {
    this.common.getLogin()
  }

  getEducatorList(): any {
    const data = {
      "limit": this.educatorLimit,
      "offSet": this.educatorOffset
    }
    this.common.loaderStart()
    this.rest.getEducatorList(data).subscribe((result: any) => {
      this.common.loaderEnd()
      if (result.success) {
        this.educatorArr = result.response
        this.educatorListDesign()
      }
    })
  }

  educatorListDesign(): any {
    setTimeout(() => {
      $("#tech_caro").owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        nav: true,
        responsive: {
          0: {
            items: 2,
          },
          600: {
            items: 3,
          },
          1000: {
            items: 5,
          },
        },
      });
    }, 1000);

  }

  addClass(i: any): any {
    for (let [index, obj] of this.menuArr.entries()) {
      if (index == i) {
        obj.navDropdown = true
      } else {
        obj.navDropdown = false
      }
    }
  }

  removeClass(): any {
    for (let [index, obj] of this.menuArr.entries()) {
      obj.navDropdown = false
    }
  }

  getMenuArr(): any {
    this.common.loaderStart()
    this.rest.getCategoryTypeAndCourses({}).subscribe((result: any) => {
      this.common.loaderEnd()
      if (result.success) {
        let temp = result.response
        let temp2 = result.response
        for (let data of temp2) {
          data.path = "/language/" + data.categoryTypeId
        }
        this.headerCategoryButtonArr = temp2
        let resultTemp: any = [{ name: "HOME", path: "/", navDropdown: false, child: [] }]
        for (let obj of temp) {
          obj.navDropdown = false
          obj.path = "/language/" + obj.categoryTypeId
          let tempChild = []
          for (let chi of obj.courseList) {
            chi.path = "/course-details/" + chi.courseid + '/' + chi.islive
            tempChild.push({ name: chi.coursename, path: chi.path })
          }
          resultTemp.push({ name: obj.categoryTypeName, path: obj.path, navDropdown: false, child: tempChild })
        }

        resultTemp.push(
          {
            name: "OTHER", path: "", navDropdown: false, child: [
              { name: "Beginners’ Mandarin", path: "" },
              { name: "Beginners’ Arabic", path: "" },
              { name: "Beginners’ Hindi", path: "" },
            ]
          },
          {
            name: "WOWL-UEG", path: "/wowl-ueg/1", navDropdown: false, child: [
              { name: "About Us", path: "/wowl-ueg/0" },
              { name: "Our Team", path: "/wowl-ueg/2" },
              { name: "Our Teachers", path: "/all-eductors" },
              { name: "Gallery", path: "" },
              { name: "Blog", path: "" },
              { name: "Contact Us", path: "" },
            ]
          }
        )

        this.menuArr = resultTemp

      }
    })


  }

  goto(path: string) {
    for (let [index, obj] of this.menuArr.entries()) {
      obj.navDropdown = false
    }
    if (path == "") {
      this.common.getComingSoon()
    } else {
      this.router.navigate([path])
    }

  }

  gotoHref(path: any): any {
    this.removeClass();
    this.router.navigate(["/"]).then(() => {
      this.router.navigate([path])
    })
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 250) {
      this.isNav = true;
      this.isTop = false
    } else {
      this.isNav = false;
      this.isTop = true
    }
  }

  scrollToTop(): any {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  gotoEducator(educatorid: any): any {
    this.router.navigate(['/educator/' + educatorid])
  }


  logout(): any {
    this.logoutfun()
    this.router.navigate(['/']).then(() => {
      this.router.navigate(['/'])
      this.common.logoutUser()
    })
  }

  logoutfun(): any {
    const data = {
      "loginauditid": this.common.getLoginauditid()
    }
    this.common.loaderStart()
    this.rest.logout(data).subscribe((res: any) => {
      this.common.loaderEnd()
      if (res.success) {
        this.notifierService.notify('success', res.message)
      } else {
        this.notifierService.notify('error', res.message)
      }
    }, (err) => {
      this.notifierService.notify('error', err.error.message);
    })
  }

  profile(): any {
    this.router.navigate(['/profile'])
  }

  checkSubscriptionplanofuser(): any {
    const data = {
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.rest.checkSubscriptionPlanofuser(data).subscribe((result: any) => {
      this.common.loaderEnd();
      if (result.success) {
        this.common.setCheckspbu(JSON.stringify(result.response))
      } else {
        this.notifierService.notify('error', result.message);
      }
    })
  }

  gotoDetails(): any {
    this.router.navigate(['/course-details/32/0']);
  }

  gotoLanding(): any {
    this.common.getComingSoon()
  }


  gotoCertificate(): any {
    this.router.navigate(['/certificate'])
  }


}

