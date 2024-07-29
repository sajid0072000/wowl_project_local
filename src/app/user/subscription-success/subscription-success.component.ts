import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-subscription-success',
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.css']
})
export class SubscriptionSuccessComponent {

  renewalMsg:any=''

  constructor(
    private modalService: NgbModal,
    private common: CommonService,
    private rest: RestApiService
  ) {

  }

  ngOnInit(): void {
    this.renewalMsg = this.common.sheardData
  }

  closeModal(): any {
    this.modalService.dismissAll();
  }

}
