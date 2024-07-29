import { Component, OnInit, ViewChild } from "@angular/core";

import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RestApiService } from "src/app/rest-api.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-application-version',
  templateUrl: './application-version.component.html',
  styleUrls: ['./application-version.component.css']
})
export class ApplicationVersionComponent {

  id:any=''
  packageName:any=''
  versionName:any=''
  versionCode:any=''
  appLink:any=''
  platfrom:any=''
  isUpdate:any=''
  status:boolean=false

  packageNameErr:boolean=false
  versionNameErr:boolean=false
  versionCodeErr:boolean=false
  appLinkErr:boolean=false
  platfromErr:boolean=false
  isUpdateErr:boolean = false


  offset = 0;
  limit = 20;
  selectedVal: any = 10;

  applicationversionList:any=[]

  public pageList: Array<any> = [
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "30", value: "30" },
    { name: "50", value: "50" },
  ];

  @ViewChild("deleteModal") deleteModal: any;
  @ViewChild("addmodal") addmodal: any

  previousBtnDesable: boolean = false;
  nextBtnDesable: boolean = false;
  constructor(
    private router: Router,
    private restapi: RestApiService,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal

  ) {

  }

  ngOnInit(): void {
    this.applicationversiongetall();
  }


  applicationversiongetall(): any {
    const obj = {
      offset: this.offset,
      limit: this.limit
    }
    this.commonservice.loaderStart();
    this.restapi.applicationversiongetall(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.applicationversionList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.applicationversionList = [];
      }
    }, (err: any) => {
    })
  }



  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.applicationversiongetall();
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.applicationversiongetall();
  }
  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.applicationversiongetall();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  gotoAdd(): any {
    this.resetForm()
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false })
  }

  gotoEdit(data: any): any {
    this.id = data.id;
    this.packageName = data.packageName;
    this.versionName = data.versionName;
    this.versionCode = data.versionCode;
    this.appLink = data.appLink;
    this.isUpdate = data.isUpdate;
    this.status = data.status === 0 ? false : true;
    this.platfrom = data.platfrom
    this.commonservice.setLimit(this.limit)
    this.commonservice.setOffset(this.offset)
    this.modalService.open(this.addmodal, { centered: true, size: "lg", backdrop: false })
  }


  add(): any {
    this.packageNameErr = false;
    this.versionNameErr = false;
    this.versionCodeErr = false;
    this.appLinkErr = false;
    this.platfromErr =false;
    this.isUpdateErr = false

    let err= 0

    if (this.packageName == '' || this.packageName == null || this.packageName == undefined) {
      this.packageNameErr = true;
      err++
    }

    if (this.versionName == '' || this.versionName == null || this.versionName == undefined) {
      this.versionNameErr = true;
      err++
    }

    if (this.versionCode == '' || this.versionCode == null || this.versionCode == undefined) {
      this.versionCodeErr = true;
      err++
    }

    if (this.appLink == '' || this.appLink == null || this.appLink == undefined) {
      this.appLinkErr = true;
      err++
    }

    if (this.platfrom == '' || this.platfrom == null || this.platfrom == undefined) {
      this.platfromErr = true;
      err++
    }

    if (this.isUpdate == '' || this.isUpdate == null || this.isUpdate == undefined) {
      this.isUpdateErr = true;
      err++
    }

    if(err==0){

      const data = {
        "packageName": this.packageName,
        "versionName": this.versionName,
        "versionCode": this.versionCode,
        "appLink": this.appLink,
        "isUpdate": this.isUpdate,
        "status": this.status === false ? "0" : "1",
        "platfrom":this.platfrom
      }

      this.restapi.applicationversionadd(data).subscribe((result:any)=>{
        if(result.success){
          this.notifierService.notify('success', result.message);
          this.resetForm()
          this.applicationversiongetall()
        }else{
          this.notifierService.notify('error', result.message);
        }
      })
    }
  }



  edit(): any {
    this.packageNameErr = false;
    this.versionNameErr = false;
    this.versionCodeErr = false;
    this.appLinkErr = false;
    this.platfromErr =false;
    this.isUpdateErr = false


    let err= 0

    if (this.packageName == '' || this.packageName == null || this.packageName == undefined) {
      this.packageNameErr = true;
      err++
    }

    if (this.versionName == '' || this.versionName == null || this.versionName == undefined) {
      this.versionNameErr = true;
      err++
    }

    if (this.versionCode == '' || this.versionCode == null || this.versionCode == undefined) {
      this.versionCodeErr = true;
      err++
    }

    if (this.appLink == '' || this.appLink == null || this.appLink == undefined) {
      this.appLinkErr = true;
      err++
    }

    if (this.platfrom == '' || this.platfrom == null || this.platfrom == undefined) {
      this.platfromErr = true;
      err++
    }

    if (this.isUpdate == '' || this.isUpdate == null || this.isUpdate == undefined) {
      this.isUpdateErr = true;
      err++
    }

    if(err==0){

      const data = {
        "id": this.id,
        "packageName": this.packageName,
        "versionName": this.versionName,
        "versionCode": this.versionCode,
        "appLink": this.appLink,
        "isUpdate": this.isUpdate,
        "status": this.status === false ? "0" : "1",
        "platfrom":this.platfrom,
        modifiedAt:"1"
      }

      this.restapi.applicationversionupdate(data).subscribe((result:any)=>{
        if(result.success){
          this.notifierService.notify('success', result.message);
          this.resetForm()
          this.applicationversiongetall()
        }else{
          this.notifierService.notify('error', result.message);
        }
      })
    }
  }


  resetForm():any{
    this.id = ''
    this.packageName=''
    this.versionName=''
    this.versionCode=''
    this.appLink=''
    this.platfrom=''
    this.isUpdate = ''
    this.status = false
    this.packageNameErr = false;
    this.versionNameErr = false;
    this.versionCodeErr = false;
    this.appLinkErr = false;
    this.platfromErr=false
    this.isUpdateErr=false
    this.modalService.dismissAll();
  }



  closeModal():any{
    this.modalService.dismissAll();
  }


  changePackageName():any{
    this.packageNameErr=false
  }

  changeVersionName():any{
    this.versionNameErr=false
  }

  changeVersionCode():any{
    this.versionCodeErr=false
  }

  changeappLink():any{
    this.appLinkErr=false
  }
  changePlatfrom():any{
    this.platfromErr = false
  }

  onClickDelete(id: any): any {
    this.id = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  changeUpdate():any{
    this.isUpdateErr=false
  }

  delete(): any {

    // const obj = {
    //   userId: this.commonservice.getUserId(),
    //   id: this.institueId,
    // };
    // this.commonservice.loaderStart();
    // this.restapi.applicationversiongetAppVersionDtl(obj).subscribe(
    //   (res: any) => {
    //     this.commonservice.loaderEnd();
    //     if (res.success) {
    //       this.closeModal();
    //       this.getInstitueData();
    //       this.notifierService.notify("success", res.message);
    //     } else {
    //       this.notifierService.notify("error", res.message);
    //     }
    //   },
    //   (err: any) => {
    //     this.notifierService.notify("error", err.error.message);
    //   }
    // );
  }

}
