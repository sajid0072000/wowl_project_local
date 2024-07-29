import { Component, ViewChild } from '@angular/core'; 
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-course-educator-map-list',
  templateUrl: './course-educator-map-list.component.html',
  styleUrls: ['./course-educator-map-list.component.css']
})
export class CourseEducatorMapListComponent {

  @ViewChild('deleteModal') deleteModal: any;


  courseeducatorList=[] as any
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
  educatorid='' as any
  id='' as any
  courseid='' as any

  coursename = '' as any
  spinner: boolean = false
  courseArr = [] as any
  educatorname = '' as any
  spinnerEducator: boolean = false
  educatorArr = [] as any

  constructor(
    private router: Router,
    private restapi: RestApiService,
    private common: CommonService,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) { }

  ngOnInit():void {
    this.getCourseEducatorMap();
  }
  
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;


  getCourseEducatorMap(flag = 0): any {
    if(flag == 0) {
      this.offset = 0;
    }
    let obj = {
      "userId": this.common.getUserId(),
      "limit": this.limit,
      "offSet": this.offset,
      "educatorid": this.educatorid,
      "courseid":this.courseid,
    };
    this.common.loaderStart();
    this.restapi.getCourseEducatorMap(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if(res.response) {
          if(this.offset == 0) {
            this.courseeducatorList = res.response;
          } else {
            if (res.response.length > 0) {
              this.courseeducatorList = res.response;
              this.nextBtnDesable = res.response.length < this.limit;
            } else {
              this.nextBtnDesable = true;
              this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
            }
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.courseeducatorList = [];
      }
    })
  }

  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getCourseEducatorMap();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getCourseEducatorMap(1);
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage():any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getCourseEducatorMap(1);
  }

  add(): any {
    this.router.navigate(['admin/app/add-course-educator-map/0'])
  }

  edit(id: any): any {
    this.router.navigate(['admin/app/add-course-educator-map/' + id])
  }

  delete(): any {
    const data = {
      "userId": this.common.getUserId(),
      "id":this.id
    }
    this.common.loaderStart();
    this.restapi.deleteCourseEducatorMap(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.getCourseEducatorMap()
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

  getCourseIdByName(): any {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid;
        this.getCourseEducatorMap();
        break;
      }
    }
  }



  searchEducatorByName():any {
    const data = {
      "userId": this.common.getUserId(),
      "educatorname": this.educatorname
    }
    this.spinnerEducator = true
    this.restapi.searchEducatorByName(data).subscribe((res: any) => {
      if (res.success) {
        this.educatorArr = res.response
        this.spinnerEducator = false
      }
      else {
        this.educatorArr = []
        this.spinnerEducator = false
      }
    });
  }

  getEducatorIdByName():any {
    for (let data of this.educatorArr) {
      if (data.educatorname === this.educatorname) {
        this.educatorid = data.educatorid;
        this.getCourseEducatorMap()
        break;
      }
    }
  }


  onSearch():any{
    this.getCourseEducatorMap()
  }

  onReset():any{

    this.coursename=''
    this.courseid=''
    this.educatorid=''
    this.educatorname=''
    this.getCourseEducatorMap()
  }

}
