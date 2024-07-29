import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { NotifierService } from "angular-notifier";
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-add-course-educator-map',
  templateUrl: './add-course-educator-map.component.html',
  styleUrls: ['./add-course-educator-map.component.css']
})
export class AddCourseEducatorMapComponent {

  @ViewChild('deleteModal') deleteModal: any;


  courseeducatormapid = '' as any
  coursename = '' as any
  spinner: boolean = false
  courseArr = [] as any
  courseid = '' as any
  educatorname = '' as any
  spinnerEducator: boolean = false
  educatorArr = [] as any
  educatorid = '' as any


  coursenameErr: boolean = false
  educatornameErr: boolean = false


  constructor(
    private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private notifierService: NotifierService,
    private common: CommonService,
    private modalService: NgbModal,

  ) { }


  ngOnInit(): void {
    this.courseeducatormapid = this.actroute.snapshot.params['id'];
    if (this.courseeducatormapid == 0) {
      this.courseeducatormapid = null
    }
    if (this.courseeducatormapid) {
      this.getCourseEducatorMapById()
    }
  }

  goBack() {
    this.router.navigate(["admin/app/course-educator-map-list"]);
  }

  getCourseEducatorMapById(): any {
    var data = {
      "userId": this.common.getUserId(),
      "id": this.courseeducatormapid
    }
    this.common.loaderStart();
    this.restapi.getCourseEducatorMapById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.courseid = res.response.courseid;
        this.coursename = res.response.coursename;
        this.educatorid = res.response.educatorid
        this.educatorname = res.response.educatorname;
          this.searchCourseByName()
          this.searchEducatorByName()

      }
    });
  }

  goToPreview(): any {

  }


  delete(): any {
    const data = {
      "userId": this.common.getUserId(),
      "id": this.courseeducatormapid
    }
    this.common.loaderStart();
    this.restapi.deleteCourseEducatorMap(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.router.navigate(['admin/app/course-educator-map-list'])
        this.closeModal()
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }


  onClickDelete(id: any): any {
    this.courseeducatormapid = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.courseeducatormapid = '';
    this.modalService.dismissAll();
  }





  searchCourseByName(): any {
    this.coursenameErr=false
    var data = {
      "userId": this.common.getUserId(),
      "coursename": this.coursename
    }
    this.spinner = true
    this.restapi.searchCourseByName(data).subscribe((res: any) => {
      if (res.success) {
        this.courseArr = res.response
        this.spinner = false
        if(this.courseeducatormapid){
          for (let data of this.courseArr) {
            if (data.coursename === this.coursename) {
              this.courseid = data.courseid
              break;
            }
          }
        }
      }
      else {
        this.courseArr = []
        this.spinner = false
      }
    });
  }

  getCourseIdByName(): void {
    for (let data of this.courseArr) {
      if (data.coursename === this.coursename) {
        this.courseid = data.courseid
        break;
      }
    }
  }



  searchEducatorByName(): any {
    this.educatornameErr=false
    var data = {
      "userId": this.common.getUserId(),
      "educatorname": this.educatorname
    }
    this.spinnerEducator = true
    this.restapi.searchEducatorByName(data).subscribe((res: any) => {
      if (res.success) {
        this.educatorArr = res.response
        this.spinnerEducator = false
        if(this.courseeducatormapid){
          for (let data of this.educatorArr) {
            if (data.educatorname === this.educatorname) {
              this.educatorid = data.educatorid
              break;
            }
          }
        }
      }
      else {
        this.educatorArr = []
        this.spinnerEducator = false
      }
    });
  }

  getEducatorIdByName(): void {
    for (let data of this.educatorArr) {
      if (data.educatorname === this.educatorname) {
        this.educatorid = data.educatorid
        break;
      }
    }
  }

  add(): any {

    this.coursenameErr = false
    this.educatornameErr = false

    let err = 0

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.coursenameErr = true
      err++
    }
    if (this.educatorid == '' || this.educatorid == null || this.educatorid == undefined) {
      this.educatornameErr = true
      err++
    }

    if (err == 0) {

      var data: any = {
        "userId": this.common.getUserId(),
        "courseid": this.courseid,
        "educatorid": this.educatorid
      }

      console.log("data------", data)
      this.common.loaderStart();
      this.restapi.addCourseEducatorMap(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/course-educator-map-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });


    }



  }

  edit(): any {

    this.coursenameErr = false
    this.educatornameErr = false

    let err = 0

    if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
      this.coursenameErr = true
      err++
    }
    if (this.educatorid == '' || this.educatorid == null || this.educatorid == undefined) {
      this.educatornameErr = true
      err++
    }

    if (err == 0) {
      var data: any = {
        "userId": this.common.getUserId(),
        "id": this.courseeducatormapid,
        "courseid": this.courseid,
        "educatorid": this.educatorid
      }

      console.log("data", data)
      this.common.loaderStart();
      this.restapi.updateCourseEducatorMap(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifierService.notify('success', res.message);
          this.resetForm()
          this.router.navigate(['admin/app/course-educator-map-list'])
        }
        else {
          this.notifierService.notify('error', res.message);
        }
      });
    }

  }


  resetForm(): any {
    this.courseid = '',
      this.educatorid = ''
    this.coursename = ''
    this.educatorname = ''
    this.coursenameErr = false
    this.educatornameErr = false
    this.router.navigate(["admin/app/course-educator-map-list"]);

  }





}
