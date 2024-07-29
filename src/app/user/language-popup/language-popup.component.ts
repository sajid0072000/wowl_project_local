import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-language-popup',
  templateUrl: './language-popup.component.html',
  styleUrls: ['./language-popup.component.css']
})
export class LanguagePopupComponent {

  FILE_URL: any = ""
  popupimg:any=''

  constructor(
    private modalService: NgbModal,
    private common: CommonService,
    private rest: RestApiService
  ) {
    this.FILE_URL = this.rest.FILE_URL
  }

  ngOnInit(): void {
    this.popupimg = this.common.sheardData
  }

  closeModal(): any {
    this.modalService.dismissAll();
  }
}
