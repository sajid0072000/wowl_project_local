import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent {
  constructor(
    private modalService: NgbModal,
    private common: CommonService,
    private rest: RestApiService
  ) {

  }

  closeModal(): any {
    this.modalService.dismissAll();
  }

}
