import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";

@Component({
    selector: 'app-lesson-mapping-list',
    templateUrl: './lesson-mapping-list.component.html',
    styleUrls: ['./lesson-mapping-list.component.css']
})
export class LessonMappingListComponent {
    @ViewChild('deleteModal') deleteModal: any;
    offset = 0;
    limit = 20;
    mapingList: any = [];
    lessionMapid: any = '';
    selectedVal: any = 20;

    courseid = '' as any
    coursename = '' as any;
    spinner: boolean = false
    courseArr: any = [];
    lessionid = '' as any
    title = '' as any;
    spinnerLession: boolean = false
    lessionArr: any = [];

    public pageList: Array<any> = [
        { name: '10', value: '10' },
        { name: '15', value: '15' },
        { name: '20', value: '20' },
        { name: '30', value: '30' },
        { name: '50', value: '50' }
    ];
    isPrevious: boolean = true;

    constructor(
        private router: Router,
        private restapi: RestApiService,
        private common: CommonService,
        private modalService: NgbModal,
        private notifierService: NotifierService
    ) {
    }

    ngOnInit(): void {
        if (this.common.getLimit()) {
            this.limit = this.common.getLimit()
        }
        if (this.common.getOffset()) {
            this.offset = this.common.getOffset()
        }
        if (this.common.getCourseid()) {
            this.courseid = this.common.getCourseid()
        }
        if (this.common.getCourseName()) {
            this.coursename = this.common.getCourseName()
        }
        if (this.common.getLessonid()) {
            this.lessionid = this.common.getLessonid()
        }
        if (this.common.getLessonName()) {
            this.title = this.common.getLessonName()
        }
        this.getLessionmap();
    }

    previousBtnDesable: boolean = true;
    nextBtnDesable: boolean = false;

    getLessionmap(): any {
        const obj = {
            "userId": this.common.getUserId(),
            "limit": this.limit,
            "offset": this.offset + "",
            "courseid": this.courseid,
            "lessionid": this.lessionid
        }
        this.common.loaderStart();
        this.restapi.getLessionmap(obj).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.response) {
                    if (res.response.length > 0) {
                        this.mapingList = res.response;
                        this.nextBtnDesable = res.response.length < this.limit;
                    } else {
                        this.nextBtnDesable = true;
                        this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
                    }
                } else {
                    this.nextBtnDesable = true;
                }
            } else {
                this.mapingList = []
            }
        }, (err: any) => {
            this.notifierService.notify("success", err.error.message)

        });
    }

    changePagelimit(event: any): any {
        this.offset = 0;
        this.limit = Number(event.target.value);
        this.getLessionmap();
    }

    previousPage(): any {
        this.offset = this.offset > 0 ? this.offset - this.limit : 0;
        this.offset = this.offset < 0 ? 0 : this.offset;
        this.getLessionmap();
        if (this.offset <= 0) {
            this.previousBtnDesable = true;
        }
    }

    nextPage(): any {
        this.previousBtnDesable = false;
        this.offset = this.offset + this.limit;
        this.getLessionmap();
    }

    add(): any {
        this.router.navigate(["admin/app/add-lessonmapping//0"]);
    }

    edit(id: any): any {
        this.common.setLimit(this.limit)
        this.common.setOffset(this.offset)
        this.common.setCourseid(this.courseid)
        this.common.setCoursename(this.coursename)
        this.common.setLessionid(this.lessionid)
        this.common.setLessionname(this.title)
        this.router.navigate(['admin/app/add-lessonmapping/' + id])
    }

    delete(): any {
        const data = {
            "userId": Number(this.common.getUserId()),
            "id": this.lessionMapid
        };
        this.common.loaderStart();
        this.restapi.deleteLessionmap(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.closeModal();
                this.getLessionmap();
                this.notifierService.notify('success', res.message);
                this.getLessionmap()
                this.closeModal()
            } else {
                this.notifierService.notify('error', res.message);
            }
        })

    }

    onClickDelete(id: any): any {
        this.lessionMapid = id;
        this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
    }

    closeModal(): any {
        this.lessionMapid = '';
        this.modalService.dismissAll();
    }

    searchCourseByName(): any {
        if (this.coursename.length % 3 === 0) {
            const obj = {
                "userId": this.common.getUserId(),
                "coursename": this.coursename
            };
            this.spinner = true;
            this.restapi.searchCourseByName(obj).subscribe((res: any) => {
                if (res.success) {
                    this.courseArr = res.response
                    this.spinner = false
                } else {
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
        this.getLessionmap()
    }

    searchLessionByName(): any {
        if (this.title.length % 3 === 0) {
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
                } else {
                    this.lessionArr = []
                    this.spinnerLession = false
                }
            });
        }
    }

    getLessionIdByName(): any {
        for (let data of this.lessionArr) {
            if (data.title === this.title) {
                this.lessionid = data.id
                break;
            }
        }
        this.getLessionmap()
    }

    ononEnter() {
        this.getLessionmap();
    }

    search(): any {
        this.getLessionmap()
    }

    onReset(): any {
        this.coursename = ''
        this.courseid = ''
        this.lessionid = ''
        this.title = ''
        this.getLessionmap()
    }
}
