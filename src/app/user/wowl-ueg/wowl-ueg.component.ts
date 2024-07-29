import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wowl-ueg',
  templateUrl: './wowl-ueg.component.html',
  styleUrls: ['./wowl-ueg.component.css']
})
export class WowlUegComponent implements OnInit {

  limit:any='10'
  offSet:any='0'
  educatorArr:any=[]
  FILE_URL:any=''
  id:any=''
  aboutObj:any={}
  videoDiv: boolean = false
  offsetTeamWowl:any=0
  limitTeamWowl:any=20
  teamwowlList:any=[]


  constructor(private rest: RestApiService, private common: CommonService, private router:Router, private active: ActivatedRoute,) {
    this.FILE_URL = this.rest.FILE_URL

  }

  ngOnInit(): any {
    this.id = this.active.snapshot.paramMap.get('id');
    if(this.id == 1){
      window.scroll(0,320)
    }else if(this.id == 2){
      window.scroll(0,1165)
    }else{
      window.scroll(0,0)
    }

    this.getEducatorList()
    this.getDetails()
    this.getAbout()
  }

  playVideo(): any {
    this.videoDiv = true;
    setTimeout(() => {
      this.common.getTrancoding('video-container', '100%', '100%', this.aboutObj.video, '')
    }, 500);
  }

  getAbout():any{
    this.common.loaderStart();
    this.rest.getAbout({}).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
            this.aboutObj = res.response;
          } else {
        this.aboutObj = {};
      }
    })
  }

  getDetails(): any {
    let data = {
      "offset": this.offsetTeamWowl,
      "limit": this.limitTeamWowl
    }
    this.common.loaderStart();
    this.rest.getTeamwowl(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
            this.teamwowlList = res.response;
          } else {
        this.teamwowlList = [];
      }
    })
  }

  getEducatorList(): any {
    const data = {
      "limit": this.limit,
      "offSet": this.offSet
    }
    this.common.loaderStart()
    this.rest.getEducatorList(data).subscribe((result: any) => {
      this.common.loaderEnd()
      if (result.success) {
        this.educatorArr = result.response
      }else{
        this.educatorArr = []
      }
    })

  }

  gotoEducator(educatorid:any):any{
    this.router.navigate(['/educator/'+educatorid])
  }

  gotoButton(val:any):any{
    if(val == 1){
      window.scroll(0,900)
    }else if(val == 2){
      window.scroll(0,1115)
    }else{
      window.scroll(0,0)
    }
  }

}
