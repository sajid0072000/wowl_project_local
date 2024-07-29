import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-lession-list',
  templateUrl: './lession-list.component.html',
  styleUrls: ['./lession-list.component.css']
})
export class LessionListComponent {

  @ViewChild('deleteModal') deleteModal: any;
  id = '' as any
  offset = 0;
  limit = 20;
  lessionList: any = [];
  lessionid = '' as any
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  isPrevious: boolean = true;
  searchText = '' as any
  courseid = '' as any
  coursename = '' as any
  spinner: boolean = false
  courseArr = [] as any


  constructor(
    private router: Router,
    private restapi: RestApiService,
    private common: CommonService,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    if (this.common.getLimit()) {
      this.limit = this.common.getLimit()
    }
    if (this.common.getOffset()) {
      this.offset = this.common.getOffset()
    }
    if (this.common.getSearchText()) {
      this.searchText = this.common.getSearchText()
    }
    if (this.common.getCourseid()) {
      this.courseid = this.common.getCourseid()
    }
    if (this.common.getCourseName()) {
      this.coursename = this.common.getCourseName()
    }
    this.getLession();
  }

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;


  getLession(): any {
    const obj = {
      "userId": this.common.getUserId(),
      'offset': this.offset + '',
      'limit': this.limit,
      'searchText': this.searchText,
      "courseid": this.courseid
    }
    this.common.loaderStart();
    this.restapi.getLession(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.lessionList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.lessionList = [];
      }
    })
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getLession();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getLession();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getLession();
  }

  add(): any {
    this.router.navigate(['admin/app/add-lession/0'])
  }

  edit(id: any): any {
    this.common.setLimit(this.limit)
    this.common.setOffset(this.offset)
    this.common.setSearchText(this.searchText)
    this.common.setCourseid(this.courseid)
    this.common.setCoursename(this.coursename)
    this.router.navigate(['admin/app/add-lession/' + id])
  }


  delete(): any {
    const data = {
      "userId": this.common.getUserId(),
      "id": this.id
    }
    this.common.loaderStart();
    this.restapi.deleteLession(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.getLession()
        this.closeModal()
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  onClickDelete(id: any): any {
    this.id = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.id = '';
    this.modalService.dismissAll();
  }

  onEnter() {
    this.getLession();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getLession();
    }
    if (this.searchText.length == 0) {
      this.getLession();
    }
  }

  searchCourseByName(): any {
    if (this.coursename.length % 3 == 0) {
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
    this.getLession()
  }

  onSearch(): any {
    this.getLession()
  }

  onReset(): any {

    this.coursename = ''
    this.courseid = ''
    this.getLession()
  }

}
