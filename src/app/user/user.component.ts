import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../common.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private rest:RestApiService, public common:CommonService, private notifierService:NotifierService) { }

  ngOnInit(): void {
  }



logOutcall():any{
  const data = {
      "loginauditid":2
  }
  this.common.loaderStart()
  this.rest.logout(data).subscribe((res:any) => {
  this.common.loaderEnd()
 if(res.success){
  this.notifierService.notify('success',res.message)
 } else {
  this.notifierService.notify('error',res.message)
 }
  },(err) => {
      this.notifierService.notify('error', err.error.message);
  } )
}

}
