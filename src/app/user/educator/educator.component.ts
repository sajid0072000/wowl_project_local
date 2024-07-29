import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-educator',
  templateUrl: './educator.component.html',
  styleUrls: ['./educator.component.css']
})
export class EducatorComponent {

  educatorId:any='';
  educatorDetails:any={
    educatorname: '',
    educatorphotouri: '',
    educatorsubheading: '',
    educatorexcerpt: '',
    about: '',
    teachingexp: '',
    categorytypename: ''
  };
  FILE_URL:any='';

  constructor(private rest:RestApiService, private common:CommonService, private active:ActivatedRoute) { this.FILE_URL = this.rest.FILE_URL }


  ngOnInit(): void {
    window.scroll(0,0)
    this.educatorId = this.active.snapshot.paramMap.get('id');
    this.getEducatorProfile()
  }

  getEducatorProfile():any{
    const data = {
      "educatorId":this.educatorId
    }
    this.common.loaderStart()
    this.rest.getEducatorProfile(data).subscribe((result:any)=>{
      this.common.loaderEnd()
      if(result.success){
        this.educatorDetails = result.response[0]
      }else{
        this.educatorDetails = {}
      }
    })
  }

}
