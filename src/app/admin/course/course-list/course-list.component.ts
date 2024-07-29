import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";


@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {
    @ViewChild('deleteModal') deleteModal: any;
    offset = 0;
    limit = 20;
    coursesList: any = [];
    courseid = '' as any;
    selectedVal: any = 20;
    public pageList: Array<any> = [
        { name: '10', value: '10' },
        { name: '15', value: '15' },
        { name: '20', value: '20' },
        { name: '30', value: '30' },
        { name: '50', value: '50' }
    ];
    searchText = '' as any

    constructor(
        private router: Router,
        private restapi: RestApiService,
        public common: CommonService,
        private modalService: NgbModal,
        private notifierService: NotifierService
    ) {
    }

    ngOnInit(): void {
        if(this.common.getLimit()){
            this.limit = this.common.getLimit()
        }
        if(this.common.getOffset()){
            this.offset = this.common.getOffset()
        }
        if(this.common.getSearchText()){
            this.searchText = this.common.getSearchText()
        }
        this.getCourses();
    }

    previousBtnDesable: boolean = true;
    nextBtnDesable: boolean = false;

    getCourses(): any {
        let obj = {
            'offset': this.offset + '',
            'limit': this.limit,
            'searchText': this.searchText
        }
        this.common.loaderStart();
        this.restapi.getCourses(obj).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.response) {
                    if (res.response.length > 0) {
                        this.coursesList = res.response;
                        this.nextBtnDesable = res.response.length < this.limit;
                    } else {
                        this.nextBtnDesable = true;
                        this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
                    }
                } else {
                    this.nextBtnDesable = true;
                }
            } else {
                this.coursesList = [];
            }
        })
    }


    changePagelimit(event: any): any {
        this.offset = 0;
        this.limit = Number(event.target.value);
        this.getCourses();
    }

    previousPage(): any {
        this.offset = this.offset > 0 ? this.offset - this.limit : 0;
        this.offset = this.offset < 0 ? 0 : this.offset;
        this.getCourses();
        if (this.offset <= 0) {
            this.previousBtnDesable = true;
        }
    }

    nextPage(): any {
        this.previousBtnDesable = false;
        this.offset = this.offset + this.limit;
        this.getCourses();
    }

    add(): any {
        this.router.navigate(['admin/app/add-course/0'])
    }

    edit(id: any): any {
        this.common.setLimit(this.limit)
        this.common.setOffset(this.offset)
        this.common.setSearchText(this.searchText)
        this.router.navigate(['admin/app/add-course/' + id])
    }


    delete(): any {
        const data = {
            "userid": this.common.getUserId(),
            "courseid": this.courseid
        }
        this.common.loaderStart();
        this.restapi.deleteCourse(data).subscribe((res: any) => {
            this.common.loaderEnd();
            console.log(res.response);
            if (res.success) {
                this.notifierService.notify('success', res.message);
                this.getCourses()
                this.closeModal()
            } else {
                this.notifierService.notify('error', res.message);
            }
        })

    }

    onClickDelete(id: any): any {
        this.courseid = id
        this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
    }

    closeModal(): any {
        this.courseid = '';
        this.modalService.dismissAll();
    }

    approve(e: any): any {
        const checked = e.target.checked == 0 ? 0 : 1;
        const checkedValue = e.target.value;
        var data = {
            "userid": this.common.getUserId(),
            "courseid": checkedValue,
            "approvedby": this.common.getUserId(),
            "approved": checked
        }
        this.common.loaderStart();
        this.restapi.enableApproveCourse(data).subscribe((res: any) => {
            this.common.loaderEnd();
            console.log(res.response);
            if (res.success) {
                this.getCourses()
                this.notifierService.notify('success', res.message);
            } else {
                this.notifierService.notify('error', res.message);
            }
        })

    }

    enableActive(e: any): any {
        const checked = e.target.checked == 0 ? 0 : 1;
        const checkedValue = e.target.value;
        var data = {
            "userid": this.common.getUserId(),
            "courseid": checkedValue,
            "active": checked
        }
        this.common.loaderStart();
        this.restapi.enableActiveCourse(data).subscribe((res: any) => {
            this.common.loaderEnd();
            console.log(res.response);
            if (res.success) {
                this.notifierService.notify('success', res.message);
                this.getCourses()
            } else {
                this.notifierService.notify('error', res.message);
            }
        })

    }

    onEnter() {
        this.getCourses();
    }
    search(): any {
        if (this.searchText.length % 3 === 0) {
            this.getCourses();
        }
        if (this.searchText.length == 0) {
            this.getCourses();
        }
    }


}
