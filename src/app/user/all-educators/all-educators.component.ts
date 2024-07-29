import { Component } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-educators',
  templateUrl: './all-educators.component.html',
  styleUrls: ['./all-educators.component.css']
})
export class AllEducatorsComponent {

  limit:any='10'
  offSet:any='0'
  educatorArr:any=[]
  FILE_URL:any=''

  constructor(private rest: RestApiService, private common: CommonService, private router:Router) {
    this.FILE_URL = this.rest.FILE_URL

  }

  ngOnInit(): any {
    window.scroll(0,0)
    this.getEducatorList()

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



}
