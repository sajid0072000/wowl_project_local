import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NotifierService } from 'angular-notifier';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isNav: boolean = false;
  isTop: boolean = true;

  isNavADropDown: boolean = false
  menuArr: any = []

  FILE_URL: any = ''

  limitNotification: any = 20;
  offsetNotification: any = 0;
  notificationArr: any = []


  constructor(private router: Router, private rest: RestApiService, public common: CommonService, private notifierService: NotifierService) { this.FILE_URL = this.rest.FILE_URL }

  ngOnInit(): void {
    this.getMenuArr();
    if (this.common.getUserId() !== null) {
      this.checkSubscriptionplanofuser()
      this.getNotification()
    }
    this.intervalNotification()

    this.common.Subject.subscribe((res: any) => {
      this.getNotification()
    })

  }

  intervalNotification(): any {
    const interval = setInterval(() => {
      if (this.common.getUserId() !== null) {
        this.getNotification();
      } else {
        clearInterval(interval);
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

  login(): any {
    this.common.getLogin()
  }

  logout(): any {
    var path = window.location.pathname;
    this.logoutfun()
    this.router.navigate(['/']).then(() => {
      if (path == '/profile') {
        this.router.navigate(['/'])
        this.common.logoutUser()
      } else {
        this.router.navigate([path])
        this.common.logoutUser()
      }
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

    this.rest.getCategoryTypeAndCourses({}).subscribe((result: any) => {
      if (result.success) {
        if (result.success) {
          let temp = result.response
          let resultTemp: any = [{ name: "HOME", path: "/", navDropdown: false, child: [] }]
          for (let obj of temp) {
            obj.navDropdown = false
            obj.path = "/language/" + obj.categoryTypeId
            let tempChild = []
            for (let chi of obj.courseList) {
              chi.path = "/course-details/" + chi.courseid + "/" + chi.islive
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
                { name: "Our Teachers", path: "/all-eductors"},
                { name: "Gallery", path: "" },
                { name: "Blog", path: "" },
                { name: "Contact Us", path: "" },
              ]
            }
          )

          this.menuArr = resultTemp

        }
      }
    })
  }

  goto(path: string) {
    for (let [index, obj] of this.menuArr.entries()) {
      obj.navDropdown = false
    }
    if (path == '') {
      this.common.getComingSoon()
    } else {
      this.router.navigate(["/"]).then(() => {
        this.router.navigate([path])
      })
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
}
