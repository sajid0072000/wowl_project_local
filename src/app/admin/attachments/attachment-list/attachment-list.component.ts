import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";


@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.css']
})
export class AttachmentListComponent {
  @ViewChild('deleteModal') deleteModal: any;


  attachmentArr = [] as any
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  isPrevious: boolean = true;
  offset = 0;
  limit = 20;
  unitid = '' as any
  courseid = '' as any
  lessionid = '' as any
  attachmentList = [] as any
  id = '' as any

  coursename = '' as any
  spinner: boolean = false
  spinnerLession: boolean = false
  courseArr = [] as any

  title = '' as any
  lessionArr = [] as any

  unittitle = '' as any
  spinnerUnit: boolean = false
  unitArr = [] as any
  FILE_ROOT = this.restapi.FILE_URL;
  constructor(
    private router: Router,
    private restapi: RestApiService,
    private common: CommonService,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getAttachments();
  }

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  getAttachments(): any {
    let obj = {
      "userId": this.common.getUserId(),
      "limit": this.limit,
      "offset": this.offset,
      "unitid": this.unitid,
      "courseid": this.courseid,
      "lessionid": this.lessionid,
    };
    this.common.loaderStart();
    this.restapi.getAttachments(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        if(res.response) {
          if (res.response.length > 0) {
            this.attachmentList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.attachmentList = [];
      }
    })
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getAttachments();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getAttachments();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getAttachments();
  }

  add(): any {
    this.router.navigate(['admin/app/add-attachment/0'])
  }

  edit(id: any): any {
    this.router.navigate(['admin/app/add-attachment/' + id])
  }

  delete(): any {
    const data = {
      "userId": this.common.getUserId(),
      "id": this.id
    }
    this.common.loaderStart();
    this.restapi.deleteAttachments(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.getAttachments()
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

  searchCourseByName(): any {
    if (this.coursename.length !== 0) {
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
    } else {
      this.courseid = ''
      this.getAttachments()
      this.courseArr = []
    }
  }

  getCourseIdByName(): any {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }
    this.getAttachments()
  }

  searchLessionByName(): any {
    if (this.title.length !== 0) {
      const data = {
        "userId": this.common.getUserId(),
        "title": this.title,
        "courseid": this.courseid
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
    } else {
      this.lessionid = ''
      this.getAttachments()
      this.lessionArr = []
    }
  }

  getLessionIdByName(): void {
    for (let data of this.lessionArr) {
      if (data.title === this.title) {
        this.lessionid = data.id
        break;
      }
    }
    this.getAttachments()
  }

  searchUnitByName(): any {
    if (this.unittitle.length !== 0) {
      const data = {
        "userId": this.common.getUserId(),
        "unittitle": this.unittitle,
        "courseid": this.courseid,
        "lessionid": this.lessionid
      }
      this.spinnerUnit = true
      this.restapi.searchUnitByName(data).subscribe((res: any) => {
        if (res.success) {
          this.unitArr = res.response
          this.spinnerUnit = false
        }
        else {
          this.unitArr = []
          this.spinnerUnit = false
        }
      });
    } else {
      this.unitid = ''
      this.getAttachments()
      this.unitArr = []
    }
  }

  getUnitIdByName(): void {
    for (let data of this.unitArr) {
      if (data.unittitle === this.unittitle) {
        this.unitid = data.id
        break;
      }
    }
    this.getAttachments()
  }

  ononEnter() {
    this.getAttachments()

 } 
search(): any {

    this.getAttachments()

  }

  onReset(): any {

    this.coursename = ''
    this.courseid = ''
    this.lessionid = ''
    this.title = ''
    this.unitid = ''
    this.unittitle = ''
    this.getAttachments()
  }

}
