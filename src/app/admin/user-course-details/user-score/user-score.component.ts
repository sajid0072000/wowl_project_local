import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-user-score',
  templateUrl: './user-score.component.html',
  styleUrls: ['./user-score.component.css']
})
export class UserScoreComponent implements OnInit {

  courseid:any='';
  userid:any ='';
  lessonScore:any =[];
  assesmentScore:any = [];

  constructor(
    private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal,
    private actroute:ActivatedRoute
  ){

  }
  ngOnInit(): void {
    this.actroute.paramMap.subscribe(params => {
      this.courseid = params.get('id');
      this.userid = params.get('userid');
    });
    this.userScoreDetails();
  }
  userScoreDetails(){
    const data = {
      courseid:this.courseid,
      userid:this.userid
    };
    this.commonservice.loaderStart();
    this.restapi.userScoreDetails(data).subscribe((res:any)=>{
      this.commonservice.loaderEnd();
        if(res.success){
          this.lessonScore = res.response.lessonscore;
          this.assesmentScore = res.response.assesmentscore;
        } else{
          this.lessonScore =[];
          this.assesmentScore =[];
        }
    },(err:any)=>{
      this.notifierService.notify('error',err.error.message);
    })
  }
}
