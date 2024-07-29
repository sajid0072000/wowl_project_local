import { Component, OnDestroy, OnInit } from '@angular/core';
import { saveAs } from 'file-saver'
import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit, OnDestroy {

  attemptid: any = '';
  details: any = [];
  assignmentDtl: any = {};
  userid: any = '';

  constructor(
    private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal,
    private actroute: ActivatedRoute
  ) { }
  ngOnDestroy(): void {
    this.commonservice.assignmentDtl = {};
  }

  ngOnInit(): void {
    this.assignmentDtl = this.commonservice.assignmentDtl;
    if(!this.assignmentDtl){
      this.router.navigate(['admin/app/user-assignment-list'])
    }
    this.attemptid = this.actroute.snapshot.params['id'];
    if (this.attemptid) {
      this.getAssignmentDetails();
    }
  }

  downloadlistAssmntDtlPdf(): any {
    const data = {
      "attemptid": this.attemptid
    }
    this.commonservice.loaderStart()
    this.restapi.assmntDtlPdf(data).subscribe((res: any) => {
      this.commonservice.loaderEnd()
      if (res.success) {
        this.notifierService.notify('success', res.message)
        saveAs(this.restapi.GENERATED_PDF_URL + res.response, "assmntDtlPdf.pdf")
      } else {
        this.notifierService.notify('error', res.message)
      }
    })
  }



  getAssignmentDetails() {
    const data = {
      attemptid: this.attemptid,
    };
    this.commonservice.loaderStart();
    this.restapi.getAssessmentDetailsByAttemptid(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.details = res.response;
      } else {
        this.details = [];
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    });
  }

}
