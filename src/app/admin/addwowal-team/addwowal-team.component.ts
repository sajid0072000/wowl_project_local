import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
declare var Hls: any;

@Component({
  selector: 'app-addwowal-team',
  templateUrl: './addwowal-team.component.html',
  styleUrls: ['./addwowal-team.component.css']
})
export class AddwowalTeamComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: any;
  detailsList = [] as any
  itemId: any = ''
  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;
  name: any = ''
  nameErr: any = ''
  designation: any = ''
  designationErr: any = ''
  upDatebtnFlag: boolean = false;
  image: any = ''
  imageErr: any = ''

  UPLOAD_URL = '' as any;
  fullScreenImg = '' as any;
  FILE_URL = '' as any;
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];
  isPrevious: boolean = true;
  offset = 0;
  limit = 20;
  constructor(
    private router: Router,
    private actroute: ActivatedRoute,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal
  ) {
    this.FILE_URL = this.restapi.FILE_URL;

    this.UPLOAD_URL = this.restapi.UPLOAD_URL;
  }
  ngOnInit(): void {
    this.getDetails()
  }


  toggleFullScreenImg(flag: number): any {
    const elem = document.getElementById('fulldiv');
    if (elem) {
      elem.style.display = flag === 0 ? 'none' : 'block';
    }
  }

  getDetails(): any {
    let data = {
      "offset": this.offset,
      "limit": this.limit
    }
    this.commonservice.loaderStart();
    this.restapi.getTeamwowl(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.detailsList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.detailsList = [];
      }
    })
  }




  addDetails(): any {
    this.nameErr = ''
    this.designationErr = ''
    this.imageErr = ''
    let err = 0
    if (this.name == '' || this.name == null || this.name == undefined) {
      this.nameErr = 'Name is required';
      err++;
    }
    if (this.designation == '' || this.designation == null || this.designation == undefined) {
      this.designationErr = 'Degination  Required';
      err++;
    }
    if (this.image == '' || this.image == null || this.image == undefined) {
      this.imageErr = 'Please Upload  Image';
      err++
    }
    if (err == 0) {
      const data = {
        "name": this.name,
        "image": this.image,
        "designation": this.designation
      }
      this.commonservice.loaderStart()
      this.restapi.addTeamwowl(data).subscribe((res: any) => {
        this.commonservice.loaderEnd()
        if (res.success) {
          this.notifierService.notify('success', res.message)
          this.resetForm()
          this.getDetails()
          this.closeModal()
        } else {
          this.notifierService.notify('error', res.message);
        }
      }, (err) => {
        this.notifierService.notify('error', err.error.message);
      })
    }
  }


  edit(item: any, modal: any): any {
    this.itemId = item.id
    this.name = item.name
    this.designation = item.designation
    this.image = item.image
    this.upDatebtnFlag = true
    this.modalService.open(modal, { centered: true, size: 'lg' })
  }

  updateDetails(): any {
    this.nameErr = ''
    this.designationErr = ''
    this.imageErr = ''
    let err = 0
    if (this.name == '' || this.name == null || this.name == undefined) {
      this.nameErr = 'Name is required';
      err++;
    }
    if (this.designation == '' || this.designation == null || this.designation == undefined) {
      this.designationErr = 'Degination  Required';
      err++;
    }
    if (this.image == '' || this.image == null || this.image == undefined) {
      this.imageErr = 'Please Upload  Image';
      err++
    }
    if (err == 0) {
      const data = {
        "id": this.itemId,
        "name": this.name,
        "image": this.image,
        "designation": this.designation
      }
      this.commonservice.loaderStart()
      this.restapi.updateTeamwowl(data).subscribe((res: any) => {
        this.commonservice.loaderEnd()
        if (res.success) {
          this.notifierService.notify('success', res.message)
          this.getDetails()
          this.resetForm()
          this.closeModal()
        } else {
          this.notifierService.notify('error', res.message);
        }
      }, (err) => {
        this.notifierService.notify('error', err.error.message);
      })
    }
  }

  resetForm(): any {
    this.name = ''
    this.designation = ''
    this.image = ''
    this.nameErr = ''
    this.designationErr = ''
    this.imageErr = ''
  }


  onClickDelete(id: any): any {
    this.itemId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }


  deleteTeam() {
    const data = {
      id: this.itemId
    };
    this.commonservice.loaderStart();
    this.restapi.deleteTeamwowl(data).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        this.closeModal();
        this.getDetails();
        this.notifierService.notify('success', res.message);
      } else {
        this.notifierService.notify('error', res.message);
      }
    }, (err: any) => {
      this.notifierService.notify('error', err.error.message);
    })
  }

  changenameFun(): any {
    this.nameErr = ''
  }

  changeaboutFun(): any {
    this.designationErr = ''
  }
  uploadaboutImage(): any {
    let elem = document.getElementById('file-input-teamWowl');
    if (elem) {
      elem.click();
    }
  }

  onFileChangedTeammateImage(event: any): any {
    this.imageErr = '';
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      this.commonservice.loaderStart();
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.image = res.response.fileName;
        }
      });
    }
  }

  closeModal(): any {
    this.modalService.dismissAll();
  }
  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getDetails();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getDetails();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getDetails();
  }

  openAddModal(modal: any): any {
    this.modalService.open(modal, { centered: true, size: "lg" });
  }






}
