import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-lesson-mapping',
    templateUrl: './add-lesson-mapping.component.html',
    styleUrls: ['./add-lesson-mapping.component.css']
})
export class AddLessonMappingComponent implements OnInit {
    @ViewChild('deleteModal') deleteModal: any;

    selectedOption: string = ''; // Default to option 1
    options: any;
    userId = '' as any;
    courseid = '' as any;
    lessionid = '' as any;
    refid = '' as any;
    type = '' as any;
    seq = '' as any;
    lessionmapid = '' as any;
    upDatebtnFlag: boolean = false;
    courselist: any = [];
    coursename = '';
    lessionname = '';
    lessionList: any = [];
    unitname = '';
    unitList: any = [];
    unitid = '';
    exercisename = '' as any;
    exerciseList: any = [];
    exerciseid = '' as any;
    courseErr: any = '';
    lessionErr: any = '';
    selectionErr: any = '';
    exerciseErr: any = '';
    seqErr: any = '';
    unitErr: any = '';


    spinner: boolean = false
    spinnerLession: boolean = false
    spinnerUnit: boolean = false;
    spinnerExercise: boolean = false;


    coursenameErr: boolean = false
    lessionnameErr: boolean = false
    selectedOptionErr: boolean = false
    unitnameErr: boolean = false
    exercisenameErr: boolean = false
    sequenceErr: boolean = false

    constructor(private router: Router,
        private restapi: RestApiService,
        private actroute: ActivatedRoute,
        private commonservice: CommonService,
        private notifierService: NotifierService,
        private modalService: NgbModal,

    ) { }

    ngOnInit(): void {
        this.lessionmapid = this.actroute.snapshot.params["id"];
        if (this.lessionmapid != 0) {
            this.upDatebtnFlag = true;
            this.getLessionmapById();
        }
    }


    resetForm(): any {

        this.coursenameErr = false
        this.lessionnameErr = false
        this.selectedOptionErr = false
        this.unitnameErr = false
        this.exercisenameErr = false
        this.sequenceErr = false

        this.router.navigate(["admin/app/lesson-mapping"]);

    }

    delete(): any {
        const data = {
            "userId": this.commonservice.getUserId(),
            "id": this.lessionmapid
        };
        this.commonservice.loaderStart();
        this.restapi.deleteLessionmap(data).subscribe((res: any) => {
            this.commonservice.loaderEnd();
            if (res.success) {
                this.notifierService.notify('success', res.message);
                this.router.navigate(['admin/app/lesson-mapping']);
                this.closeModal()
            } else {
                this.notifierService.notify('error', res.message);
            }
        })

    }

    onClickDelete(id: any): any {
        this.lessionmapid = id;
        this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
    }

    closeModal(): any {
        this.lessionmapid = '';
        this.modalService.dismissAll();
    }


    goToPreview(): any {

    }


    changeTypeFun(): any {
        this.selectedOptionErr = false
    }

    changeSeqFun(): any {
        this.sequenceErr = false
    }


    addLessionmap(): any {

        this.coursenameErr = false
        this.lessionnameErr = false
        this.selectedOptionErr = false
        this.unitnameErr = false
        this.exercisenameErr = false
        this.sequenceErr = false

        let err = 0

        if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
            this.coursenameErr = true
            err++
        }

        if (this.lessionname == '' || this.lessionname == null || this.lessionname == undefined) {
            this.lessionnameErr = true
            err++
        }
        if (this.selectedOption == '' || this.selectedOption == null || this.selectedOption == undefined) {
            this.selectedOptionErr = true
            err++
        }
        if (this.selectedOption === 'unit') {
            if (this.unitname == '' || this.unitname == null || this.unitname == undefined) {
                this.unitnameErr = true
                err++
            }
        } else {
            if (this.exercisename == '' || this.exercisename == null || this.exercisename == undefined) {
                this.exercisenameErr = true
                err++
            }
        }
        if (this.seq == '' || this.seq == null || this.seq == undefined) {
            this.sequenceErr = true
            err++
        }

        if (err == 0) {

            let obj = {
                "userId": this.commonservice.getUserId(),
                "courseid": this.courseid,
                "lessionid": this.lessionid,
                "refid": this.selectedOption == 'unit' ? this.unitid : this.exerciseid,
                "type": this.selectedOption,
                "seq": this.seq
            }

            this.commonservice.loaderStart();
            this.restapi.addLessionmap(obj).subscribe((res: any) => {
                this.commonservice.loaderEnd();
                if (res.success) {
                    this.notifierService.notify("success", res.message);
                    this.router.navigate(['admin/app/lesson-mapping']);
                } else {
                    this.notifierService.notify("error", res.message)
                }
            }, (err: any) => {
                this.notifierService.notify("error", err.error.message)
            })


        }


    }

    getLessionmapById() {
        const obj = {
            userId: 1,
            id: this.lessionmapid
        };
        this.commonservice.loaderStart();
        this.restapi.getLessionmapById(obj).subscribe((res: any) => {
            this.commonservice.loaderEnd();
            if (res.success) {
                console.log(res.response)
                this.userId = this.commonservice.getUserId();
                this.coursename = res.response.coursename,
                    this.lessionname = res.response.lessiontitle,
                    this.refid = res.response.refid;
                this.selectedOption = res.response.type;
                this.seq = res.response.lessionmapseq;
                this.courseid = res.response.courseid;
                this.lessionid = res.response.lessionid;
                if (res.response.type === 'unit') {
                    this.unitid = res.response.refid;
                    this.unitname = res.response.refName;
                    this.getunitIdByName();
                } else {
                    this.exerciseid = res.response.refid;
                    this.exercisename = res.response.refName;
                    this.getexerciseIdByName();
                }
            }
        }, (err: any) => {
            this.notifierService.notify('error', err.error.message)
        });
    }

    updateLessionmap(): any {
        this.coursenameErr = false
        this.lessionnameErr = false
        this.selectedOptionErr = false
        this.unitnameErr = false
        this.exercisenameErr = false
        this.sequenceErr = false

        let err = 0

        if (this.courseid == '' || this.courseid == null || this.courseid == undefined) {
            this.coursenameErr = true
            err++
        }

        if (this.lessionname == '' || this.lessionname == null || this.lessionname == undefined) {
            this.lessionnameErr = true
            err++
        }
        if (this.selectedOption == '' || this.selectedOption == null || this.selectedOption == undefined) {
            this.selectedOptionErr = true
            err++
        }
        if (this.selectedOption === 'unit') {
            if (this.unitname == '' || this.unitname == null || this.unitname == undefined) {
                this.unitnameErr = true
                err++
            }
        } else {
            if (this.exercisename == '' || this.exercisename == null || this.exercisename == undefined) {
                this.exercisenameErr = true
                err++
            }
        }
        if (this.seq == '' || this.seq == null || this.seq == undefined) {
            this.sequenceErr = true
            err++
        }

        if (err == 0) {

            const obj = {
                userId: this.commonservice.getUserId(),
                id: this.lessionmapid,
                courseid: this.courseid,
                lessionid: this.lessionid,
                refid: this.refid,
                type: this.selectedOption,
                seq: this.seq,
            };
            this.commonservice.loaderStart();
            this.restapi.updateLessionmap(obj).subscribe((res: any) => {
                this.commonservice.loaderEnd();
                if (res.success) {
                    this.router.navigate(['admin/app/lesson-mapping']);
                    this.notifierService.notify("success", res.message);
                } else {
                    this.notifierService.notify("error", res.message);
                }
            }, (err: any) => {
                this.notifierService.notify("error", err.error.message);
            })
        }
    }


    searchCourseByName() {
        this.coursenameErr = false
        if (this.coursename.length % 3 === 0) {
            const obj = {
                userId: this.commonservice.getUserId(),
                coursename: this.coursename
            };
            this.spinner = true
            this.restapi.searchCourseByName(obj).subscribe((res: any) => {
                if (res.success) {
                    this.courselist = res.response;
                    this.spinner = false
                } else {
                    this.courselist = [];
                    this.spinner = false
                }
            }, (err: any) => {
            });
        }
    }

    getCourseIdByName() {
        for (let data of this.courselist) {
            if (data.coursename === this.coursename) {
                this.courseid = data.courseid
                break;
            }
        }
    }

    searchLessionByName() {
        this.lessionnameErr = false
        if (this.lessionname.length % 3 === 0) {
            const obj = {
                "userId": this.commonservice.getUserId(),
                "title": this.lessionname,
                "courseid": this.courseid

            };
            this.spinnerLession = true
            this.restapi.searchLessionByName(obj).subscribe((res: any) => {
                if (res.success) {
                    this.lessionList = res.response;
                    this.spinnerLession = false
                } else {
                    this.lessionList = [];
                    this.spinnerLession = false
                }
            }, (err: any) => {
            })
        }
    }

    getLessonIdByName() {
        for (let data of this.lessionList) {
            if (data.title === this.lessionname) {
                this.lessionid = data.id
                break;
            }
        }
    }

    searchUnitByName() {
        this.unitnameErr = false
        const obj = {
            "userId": this.commonservice.getUserId(),
            "unittitle": this.unitname,
            "courseid": this.courseid,
            "lessionid": this.lessionid
        }
        this.spinnerUnit = true;
        this.restapi.searchUnitByName(obj).subscribe((res: any) => {
            if (res.success) {
                this.unitList = res.response;
                this.spinnerUnit = false;
            } else {
                this.unitList = [];
                this.spinnerUnit = false;
            }
        }, (err: any) => {
            // this.notifierService.notify("error", err.error.message);
        });
    }

    getunitIdByName() {
        for (let data of this.unitList) {
            if (data.unittitle === this.unitname) {
                this.unitid = data.id
                break;
            }
        }
    }

    searchExerciseByName() {
        this.exercisenameErr = false
        const obj = {
            "userId": this.commonservice.getUserId(),
            "exercisename": this.exercisename,
            "courseid": this.courseid,
            "lessionid": this.lessionid
        };
        this.spinnerExercise = true;
        this.restapi.searchExerciseByName(obj).subscribe((res: any) => {
            if (res.success) {
                this.exerciseList = res.response;
                this.spinnerExercise = false;
            } else {
                this.exerciseList = [];
                this.spinnerExercise = false;
            }
        }, (err: any) => {
        })
    }

    getexerciseIdByName() {
        for (let data of this.exerciseList) {
            if (data.exercisename === this.exercisename) {
                this.exerciseid = data.id;
                break;
            }
        }
    }

    goBack() {
        this.router.navigate(["admin/app/lesson-mapping"]);
    }
}
