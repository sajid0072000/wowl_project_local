import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


@Component({
  selector: 'app-educator-profile',
  templateUrl: './educator-profile.component.html',
  styleUrls: ['./educator-profile.component.css']
})
export class EducatorProfileComponent {

  constructor(
    private router: Router,
    private restapi: RestApiService,
    private common: CommonService,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) { }

  educatorObj = {} as any
  FILE_URL = '' as any

  educatorname: any = "";
  educatorshortname: any = "";
  educatoremail: any = "";
  educatorphone: any = "";
  educatoraddress: any = "";
  educatorImage: any = "";
  subheading: any = "";
  educatorExpert: any = "";
  educatorAbout: any = "";
  teachingExperiance: any = "";
  fullScreenImg = "";
  searchText: any = "";
  password: any = "";
  categoryType: any = "";
  categoryTypeList: any = [];

  categoryList: any = [];
  categoriesList: any = [];

  subjectToughtList: any = [];
  subjectTought: any = [];

  gradeArr: any = [];
  levelArr: any = [];
  subjectArr: any = [];
  // institutionArr: any = [];

  educatorsId: any = "";
  educatorDetails: any;

  public Editor = ClassicEditor;

  qualificationArr: any = [
    {
      subjectid: "",
      levelid: "",
      gradeid: "",
      institutionid: "",
      time: "",
      subjectArr: [],
      levelArr: [],
      gradeArr: [],
      institutionArr: [],
    },
  ];

  dropdownList = [] as any;
  selectedItems = [] as any;
  dropdownSettings = {} as any;


  dropdownList2 = [] as any;
  selectedItems2 = [] as any;
  dropdownSettings2 = {} as any;

  nameFormat = /^([a-zA-Z ]){2,30}$/;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  


  ngOnInit(): void {
    this.getUserDetails();
    this.FILE_URL = this.restapi.FILE_URL;
    this.getCategoryType();
    // this.getCategories();
    this.getSubjects();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'categoriesid',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onItemSelect2(item: any) {
    console.log(item);
  }
  onSelectAll2(items: any) {
    console.log(items);
  }

  getUserDetails() {
    let obj = {
      "userId": this.common.getUserId(),
      "userType": this.common.getUserType(),
      "loginUserId": this.common.getUserId()
    }
    this.common.loaderStart();
    this.restapi.getUserDetails(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        console.log("res", res.response)
        this.educatorObj = res.response
        this.educatorDetails = res.response;

        this.educatorsId = this.educatorDetails.educatorid
        this.educatorname = this.educatorDetails.educatorname;
        this.educatorshortname = this.educatorDetails.shortname;
        this.educatoraddress = this.educatorDetails.address;
        this.educatoremail = this.educatorDetails.email;
        this.educatorphone = this.educatorDetails.mobile;
        this.educatorImage = this.educatorDetails.educatorphotouri;
        this.educatorAbout = this.educatorDetails.about;
        this.teachingExperiance = this.educatorDetails.teachingexp;
        this.categoryType = this.educatorDetails.categorytype;
        this.educatorExpert = this.educatorDetails.educatorexcerpt;
        this.subheading = this.educatorDetails.educatorsubheading;


        var category = []
        for(let cat of this.educatorDetails.categoryList){
          category.push(
            {"categoriesid":cat.categoryid, "name":cat.name}
          )
        }
        this.selectedItems = category


        var subject = []
        for(let sub of this.educatorDetails.subjectList){
          subject.push(
            {"id":sub.subjectid, "name":sub.name}
          )
        }
        this.selectedItems2 = subject


        this.qualificationArr = this.educatorDetails.qualificationList.length > 0 ? []: this.educatorDetails.qualificationList;
        for (let i = 0; i < this.educatorDetails.qualificationList.length; i++) {
          this.qualificationArr.push({
            subjectid: "",
            levelid: "",
            gradeid: "",
            institutionid: "",
            time: "",
            subjectArr: [],
            levelArr: [],
            gradeArr: [],
            institutionArr: [],
          });
          this.qualificationArr[i].subjectid = this.educatorDetails.qualificationList[i].subjectid;
          this.getQualificationSubjects(
            this.educatorDetails.qualificationList[i].subjectname,
            this.qualificationArr[i]
          );

          this.qualificationArr[i].levelid = this.educatorDetails.qualificationList[i].levelid;
          this.getQualificationLevels(
            this.educatorDetails.qualificationList[i].levelname,
            this.qualificationArr[i]
          );

          this.qualificationArr[i].institutionid = this.educatorDetails.qualificationList[i].institutionid;
          this.getInstitution(
            this.educatorDetails.qualificationList[i].institutename,
            this.qualificationArr[i]
          );

          this.qualificationArr[i].gradeid = this.educatorDetails.qualificationList[i].gradeid;
          this.getQualificationGrade(
            this.educatorDetails.qualificationList[i].greadname,
            this.qualificationArr[i]
          );
          this.qualificationArr[i].time = this.educatorDetails.qualificationList[i].time;
        }
        
      }
    });
  }

  isView: boolean = true

  edit(): any {
    this.getUserDetails();
    this.getCategoryType();
    this.getCategories();
    this.getSubjects();

    this.isView = false
  }

  save(): any {

    let category = []
    for (let cat of this.selectedItems) {
      category.push(
        { "categoriesid": cat.categoriesid }
      )
    }

    let subject = []
    for (let sub of this.selectedItems2) {
      subject.push(
        { "subjectid": sub.id }
      )
    }
    

    if (
      this.educatorname == "" ||
      this.educatorname == null ||
      this.educatorname == undefined
    ) {
      this.notifierService.notify("error", "Educator name is required");
      return false;
    }
    if (!this.educatorname.match(this.nameFormat)) {
      this.notifierService.notify("error", "Educator name is required only charecter");
      return false;
    }

    if (
      this.educatorshortname == "" ||
      this.educatorshortname == null ||
      this.educatorshortname == undefined
    ) {
      this.notifierService.notify("error", "Short name is required");
      return false;
    }


    if (
      this.educatoremail == "" ||
      this.educatoremail == null ||
      this.educatoremail == undefined
    ) {
      this.notifierService.notify("error", "Email is required");
      return false;
    }

    if (!this.educatoremail.match(this.mailformat)) {
      this.notifierService.notify("error", "Valid email is required");
      return false;
    }


    if (
      this.categoryType == "" ||
      this.categoryType == null ||
      this.categoryType == undefined
    ) {
      this.notifierService.notify("error", "Category type is required");
      return false;
    }


    if (
      this.educatoraddress == "" ||
      this.educatoraddress == null ||
      this.educatoraddress == undefined
    ) {
      this.notifierService.notify("error", "Address is required");
      return false;
    }

    if (this.educatorImage == "") {
      this.notifierService.notify("error", "Image is required");
      return false;
    }

    if (
      this.educatorphone == "" ||
      this.educatorphone == null ||
      this.educatorphone == undefined
    ) {
      this.notifierService.notify("error", "Mobile number is required");
      return false;
    }

    if (
      this.educatorphone.toString().length > 15 ||
      this.educatorphone.toString().length < 7
    ) {
      this.notifierService.notify("error", "Valid mobile number is required");
      return false;
    }

    if (
      this.subheading == "" ||
      this.subheading == null ||
      this.subheading == undefined
    ) {
      this.notifierService.notify("error", "Subheading is required");
      return false;
    }


    if (
      this.educatorExpert == "" ||
      this.educatorExpert == null ||
      this.educatorExpert == undefined
    ) {
      this.notifierService.notify("error", "Educator expert is required");
      return false;
    }


    if (category.length == 0) {
      this.notifierService.notify("error", "Category is required");
      return false;
    }

    if (subject.length == 0) {
      this.notifierService.notify("error", "Subject tought is required");
      return false;
    }

    if (
      this.educatorAbout == "" ||
      this.educatorAbout == null ||
      this.educatorAbout == undefined
    ) {
      this.notifierService.notify("error", "About is required");
      return false;
    }

    if (
      this.teachingExperiance == "" ||
      this.teachingExperiance == null ||
      this.teachingExperiance == undefined
    ) {
      this.notifierService.notify("error", "Teaching experiance is required");
      return false;
    }

    for (let [index, obj] of this.qualificationArr.entries()) {
      if ((obj.subjectid == "" || obj.subjectid == null || obj.subjectid == undefined)) {
        this.notifierService.notify("error", "Qualification details missing in row no." + index);
        return false;
      }
      if (obj.levelid == "" || obj.levelid == null || obj.levelid == undefined) {
        this.notifierService.notify("error", "Qualification details missing in row no." + index);
        return false;
      }
      if (obj.gradeid == "" || obj.gradeid == null || obj.gradeid == undefined) {
        this.notifierService.notify("error", "Qualification details missing in row no." + index);
        return false;
      }
      if (obj.institutionid == "" || obj.institutionid == null || obj.institutionid == undefined) {
        this.notifierService.notify("error", "Qualification details missing in row no." + index);
        return false;
      }
      if (obj.time == "" || obj.time == null || obj.time == undefined) {
        this.notifierService.notify("error", "Qualification details missing in row no." + index);
        return false;
      }
    }

    const obj = {
      'educatorid': this.educatorsId,
      'educatorname': this.educatorname,
      'shortname': this.educatorshortname,
      'accesscontrol': "",
      'password': this.password,
      'webprofileId': "0",
      'requiredchecks': "",
      'availability': "",
      'address': this.educatoraddress,
      'mobile': this.educatorphone,
      'email': this.educatoremail,
      'educatorsubheading': this.subheading,
      'educatorexcerpt': this.educatorExpert,
      'categorytype': this.categoryType,
      'educatorphotouri': this.educatorImage,
      'subjectList': subject,
      'categoryList': category,
      'qualificationList': this.qualificationArr,
      'about': this.educatorAbout,
      'teachingexp': this.teachingExperiance,
    };
    console.log(obj)
    this.common.loaderStart();
    this.restapi.updateEducator(obj).subscribe(
      (res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.getUserDetails()
          this.isView = true
          this.notifierService.notify("success", res.message);
        } else {
          this.notifierService.notify("error", res.message);
        }
      },
      (err: any) => {
        this.notifierService.notify("error", err.error.message);
      }
    );
  }


  onFileChanged(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const fd = new FormData();
      fd.append("file", file);
      this.restapi.uploadFile(fd).subscribe((res: any) => {
        if (res.success) {
          this.educatorImage = res.response.fileName;
        }
      });
    }
  }

  imagePopUp() {
    this.fullScreenImg = this.FILE_URL + this.educatorImage;
    this.toggleFullScreenImg(1);
  }
  toggleFullScreenImg(flag: number): void {
    const elem = document.getElementById("fulldiv");
    if (elem) {
      elem.style.display = flag === 0 ? "none" : "block";
    }
  }

  

  getCategoryType() {
    let obj = {
      searchText: "",
    };
    this.restapi.getCategoryType(obj).subscribe((res: any) => {
      this.categoryTypeList = res.response;
    });
  }
  getCategories() {
    this.selectedItems=[]
    let obj = {
      searchText: "",
      categoryTypeId:this.categoryType
    };
    this.restapi.getCategories(obj).subscribe((res: any) => {
      this.dropdownList = res.response;
    });
  }
  getSubjects() {
    let obj = {
      searchText: "",
    };
    this.restapi.getSubjects(obj).subscribe((res: any) => {
      this.dropdownList2 = res.response;
    });
  }
  getQualificationGrade(search: any, obj: any) {
    let params = {
      searchText: search,
    };
    this.restapi.getQualificationGrades(params).subscribe((res: any) => {
      if (res.success) {
        obj.gradeArr = res.response;
      } else {
      }
    });
  }

  getQualificationLevels(search: any, obj: any) {
    let params = {
      searchText: search,
    };
    this.restapi.getQualificationLevels(params).subscribe((res: any) => {
      if (res.success) {
        obj.levelArr = res.response;
      }
    });
  }
  getQualificationSubjects(search: any, obj: any) {
    let params = {
      searchText: search,
    };
    this.restapi.getQualificationSubjects(params).subscribe((res: any) => {
      if (res.success) {
        obj.subjectArr = res.response;
      }
    });

  }
  getInstitution(search: any, obj: any) {
    let params = {
      searchText: search,
    };
    this.restapi.getInstitution(params).subscribe((res: any) => {
      if (res.success) {

        obj.institutionArr = res.response;
      }
    });
  }

  addExpTable(): any {
    let obj = {
      subjectid: "",
      levelid: "",
      gradeid: "",
      institutionid: "",
      time: "",
    };
    this.qualificationArr.push(obj);
  }
  deleteExpTable() {
    this.qualificationArr.pop();
  }

  goBack() {
    this.isView=true
  }

}
