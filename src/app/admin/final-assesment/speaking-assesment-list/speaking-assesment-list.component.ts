import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-speaking-assesment-list',
  templateUrl: './speaking-assesment-list.component.html',
  styleUrls: ['./speaking-assesment-list.component.css']
})
export class SpeakingAssesmentListComponent {
  exerciseList = [] as any
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  isPrevious: boolean = true;
  limit = 20;
  offset = 0;
  assesmenttype = 3;
  assesmentList: any = [];
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  courseArr: any = [];
  coursename: any = '';
  searchText: any = ''
  spinner: boolean = false;
  courseid: any = '';

  constructor(private restapi: RestApiService, private common: CommonService, private notifier: NotifierService, private router: Router) { }
  ngOnInit(): void {
    this.getAllAssesment();
  }


  searchCourseByName(): any {
    if (this.coursename.length % 3 === 0) {
      const data = {
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

  getCourseIdByName(): any {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }
    this.getAllAssesment()
  }

  search() {
    this.getAllAssesment();
  }
  onEnter() {
    this.getAllAssesment();
  }
  getAllAssesment() {
    const data = {
      offset: this.offset,
      limit: this.limit,
      assesmenttype: this.assesmenttype,
      courseid:this.courseid,
      searchText:this.searchText
    };
    this.common.loaderStart();
    this.restapi.getAllAssesmentsbyType(data).subscribe((res: any) => {
      this.common.loaderEnd()
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.assesmentList = res.response;
            this.nextBtnDesable = this.assesmentList < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.assesmentList = [];
      }
    }, (err: any) => {
      this.notifier.notify('error', err.error.message);
    })
  }

  add(): any {
    this.router.navigate(['admin/app/add-speaking-assesment/' + 0]);
  }

  edit(id: any) {
    this.router.navigate(['admin/app/add-speaking-assesment/' + id]);
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getAllAssesment();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getAllAssesment();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getAllAssesment();
  }
}

