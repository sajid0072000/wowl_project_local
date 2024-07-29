import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { NotifierService } from "angular-notifier";
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-attachment',
    templateUrl: './add-attachment.component.html',
    styleUrls: ['./add-attachment.component.css']
})
export class AddAttachmentComponent {

    @ViewChild('deleteModal') deleteModal: any;


    attachmentid = '' as any;
    coursename = '' as any;
    spinner: boolean = false;
    spinnerLession: boolean = false;
    courseArr = [] as any;
    courseid = '' as any;
    title = '' as any;
    lessionArr = [] as any;
    lessionid = '' as any;
    unittitle = '' as any;
    spinnerUnit: boolean = false;
    unitArr = [] as any;
    unitid = '' as any;
    filename = '' as any;
    orgfilename = '';
    FILE_ROOT = this.restapi.FILE_URL;

    coursenameErr: boolean = false
    lessonnameErr: boolean = false
    unitnameErr: boolean = false
    filenameErr: boolean = false


    constructor(
        private router: Router,
        private restapi: RestApiService,
        private actroute: ActivatedRoute,
        private notifierService: NotifierService,
        private common: CommonService,
        private modalService: NgbModal,

    ) {
    }

    ngOnInit(): void {
        this.attachmentid = this.actroute.snapshot.params['id'];
        if (this.attachmentid == 0) {
            this.attachmentid = null
        }
        if (this.attachmentid) {
            this.getAttachmentsById()
        }
    }

    goBack() {
        this.router.navigate(["admin/app/attachment-list"]);
    }

    getAttachmentsById(): any {
        const data = {
            userId: this.common.getUserId(),
            id: this.attachmentid
        };
        this.common.loaderStart();
        this.restapi.getAttachmentsById(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.courseid = res.response.courseid;
                this.coursename = res.response.coursename;
                this.lessionid = res.response.lessionid;
                this.title = res.response.title;
                this.unitid = res.response.unitid;
                this.unittitle = res.response.unittitle;
                this.filename = res.response.filename;
                this.orgfilename = res.response.orgfilename;
                this.getCourseIdByName();
                this.getLessionIdByName();
                this.getUnitIdByName();

            }
        });
    }

    delete(): any {
        const data = {
            "userId": this.common.getUserId(),
            "id": this.attachmentid
        }
        this.common.loaderStart();
        this.restapi.deleteAttachments(data).subscribe((res: any) => {
            this.common.loaderEnd();
            console.log(res.response);
            if (res.success) {
                this.notifierService.notify('success', res.message);
                this.closeModal()
                this.router.navigate(['admin/app/attachment-list'])

            } else {
                this.notifierService.notify('error', res.message);
            }
        })

    }

    onClickDelete(id: any): any {
        this.attachmentid = id
        this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
    }

    closeModal(): any {
        this.attachmentid = '';
        this.modalService.dismissAll();
    }









    goToPreview(): any {

    }

    uploadBtn(): any {
        let elem = document.getElementById('file-input')
        if (elem) {
            elem.click()
        }
    }


    searchCourseByName(): any {
        this.coursenameErr = false
        const data = {
            userId: this.common.getUserId(),
            coursename: this.coursename
        };
        this.spinner = true;
        this.restapi.searchCourseByName(data).subscribe((res: any) => {
            if (res.success) {
                this.courseArr = res.response;
                this.spinner = false
            } else {
                this.courseArr = []
                this.spinner = false
            }
        });
    }

    getCourseIdByName(): any {
        for (let data of this.courseArr) {
            if (data.coursename === this.coursename) {
                this.courseid = data.courseid
                break;
            }
        }
    }

    searchLessionByName(): any {
        this.lessonnameErr = false
        const data = {
            userId: this.common.getUserId(),
            title: this.title,
            courseid: this.courseid
        };
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

    getLessionIdByName(): any {
        for (let data of this.lessionArr) {
            if (data.title === this.title) {
                this.lessionid = data.id;
                break;
            }
        }
    }

    searchUnitByName(): any {
        this.unitnameErr = false
        const data = {
            userId: this.common.getUserId(),
            unittitle: this.unittitle,
            courseid: this.courseid,
            lessionid: this.lessionid
        };
        this.spinnerUnit = true;
        this.restapi.searchUnitByName(data).subscribe((res: any) => {
            if (res.success) {
                this.unitArr = res.response;
                this.spinnerUnit = false
            } else {
                this.unitArr = []
                this.spinnerUnit = false
            }
        });
    }

    getUnitIdByName(): void {
        for (let data of this.unitArr) {
            if (data.unittitle === this.unittitle) {
                this.unitid = data.id;
                break;
            }
        }
    }

    onFileChanged(event: any): void {
        this.filenameErr = false
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            const fd = new FormData();
            fd.append('file', file);
            this.common.loaderStart();
            this.restapi.uploadFile(fd).subscribe((res: any) => {
                this.common.loaderEnd();
                if (res.success) {
                    this.filename = res.response.fileName;
                    this.orgfilename = res.response.orgfilename
                }
            })
        }
    }

    add(): any {

        this.coursenameErr = false
        this.lessonnameErr = false
        this.unitnameErr = false
        this.filenameErr = false

        let err = 0

        if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
            this.coursenameErr = true
            err++
        }
        if (this.lessionid == '' || this.lessionid == null || this.lessionid == undefined) {
            this.lessonnameErr = true
            err++
        }
        if (this.unitid == '' || this.unitid == null || this.unitid == undefined) {
            this.unitnameErr = true
            err++
        }

        if (this.filename == '' || this.filename == null || this.filename == undefined) {
            this.filenameErr = true
            err++
        }

        if (err == 0) {

            const data: any = {
                "userId": this.common.getUserId(),
                "unitid": this.unitid,
                "courseid": this.courseid,
                "lessionid": this.lessionid,
                "filename": this.filename,
                "orgfilename": this.orgfilename
            }
            this.common.loaderStart();
            this.restapi.addAttachments(data).subscribe((res: any) => {
                this.common.loaderEnd();
                if (res.success) {
                    this.notifierService.notify('success', res.message);
                    this.resetForm();
                    this.router.navigate(['admin/app/attachment-list'])
                } else {
                    this.notifierService.notify('error', res.message);
                }
            });


        }



    }

    edit(): any {
        this.coursenameErr = false
        this.lessonnameErr = false
        this.unitnameErr = false
        this.filenameErr = false

        let err = 0

        if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
            this.coursenameErr = true
            err++
        }
        if (this.lessionid == '' || this.lessionid == null || this.lessionid == undefined) {
            this.lessonnameErr = true
            err++
        }
        if (this.unitid == '' || this.unitid == null || this.unitid == undefined) {
            this.unitnameErr = true
            err++
        }

        if (this.filename == '' || this.filename == null || this.filename == undefined) {
            this.filenameErr = true
            err++
        }

        if (err == 0) {

            const data: any = {
                "userId": this.common.getUserId(),
                "id": this.attachmentid,
                "unitid": this.unitid,
                "courseid": this.courseid,
                "lessionid": this.lessionid,
                "filename": this.filename,
                "orgfilename": this.orgfilename
            };
            this.common.loaderStart();
            this.restapi.updateAttachments(data).subscribe((res: any) => {
                this.common.loaderEnd();
                if (res.success) {
                    this.notifierService.notify('success', res.message);
                    this.resetForm();
                    this.router.navigate(['admin/app/attachment-list'])
                } else {
                    this.notifierService.notify('error', res.message);
                }
            });
        }

    }


    resetForm(): void {
        this.unitid = '';
        this.courseid = '';
        this.lessionid = '';
        this.filename = '';
        this.orgfilename = '';
        this.coursenameErr = false
        this.lessonnameErr = false
        this.unitnameErr = false
        this.filenameErr = false
        this.router.navigate(['admin/app/attachment-list'])

    }

}
