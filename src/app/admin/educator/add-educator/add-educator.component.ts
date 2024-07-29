import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormControl } from "@angular/forms";
import { RestApiService } from "src/app/rest-api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "src/app/common.service";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-add-educator",
  templateUrl: "./add-educator.component.html",
  styleUrls: ["./add-educator.component.css"],
})
export class AddEducatorComponent implements OnInit {

  @ViewChild("deleteModal") deleteModal: any;

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




  divArr: any = [
    {
      selecedSubject: "",
      selectLevel: "",
      agesFrom: "",
      agesTo: "",
    },
  ];
  qualificationArr: any = [];
  public Editor = ClassicEditor;


  imageforpop: any = "";
  streets: any[] = [];
  FILE_URL = "";
  upDatebtnFlag: boolean = false;



  dropdownList = [] as any;
  selectedItems = [] as any;
  dropdownSettings = {} as any;


  dropdownList2 = [] as any;
  selectedItems2 = [] as any;
  dropdownSettings2 = {} as any;


  show: boolean = false;
  passwordType: any

  nameFormat = /^([a-zA-Z ]){2,30}$/;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  subjectsArr: any = [];
  subjectsName: any = '';
  subjectsSpinner: boolean = false
  subjectsList: any = []

  categoriesArr: any = [];
  categoriesName: any = '';
  categoriesSpinner: boolean = false


  educatornameErr: boolean = false;
  educatorshortnameErr: boolean = false
  educatoremailErr: boolean = false
  educatoremailValidErr: boolean = false
  categoryTypeErr: boolean = false
  educatoraddressErr: boolean = false
  educatorImageErr: boolean = false;
  educatorphoneErr: boolean = false;
  educatorphoneValidErr: boolean = false
  passwordErr: boolean = false;
  passwordValidErr: boolean = false
  subheadingErr: boolean = false;
  educatorExpertErr: boolean = false
  categoriesNameErr: boolean = false
  subjectsNameErr: boolean = false
  educatorAboutErr: boolean = false
  teachingExperianceErr: boolean = false


  categoryListErr: any = "";
  subjectToughtErr: any = "";
  qualificationErr: any = "";
  subjectErr: any = "";
  aboutErr: any = "";


  constructor(
    private router: Router,
    private restapi: RestApiService,
    private actroute: ActivatedRoute,
    private commonservice: CommonService,
    private notifierService: NotifierService,
    private modalService: NgbModal

  ) {
    this.FILE_URL = this.restapi.FILE_URL;
  }

  ngOnInit(): void {
    this.passwordType = 'password';
    this.educatorsId = this.actroute.snapshot.params["id"];
    this.qualificationArr.push({
      subjectid: "",
      levelid: "",
      gradeid: "",
      institutionid: "",
      time: "",
      subjectidErr: false,
      levelidErr: false,
      gradeidErr: false,
      institutionidErr: false,
      timeErr: false,
      subjectArr: [],
      levelArr: [],
      gradeArr: [],
      institutionArr: [],
    })

    if (this.educatorsId == 0) {
      this.educatorsId = null
    }
    if (this.educatorsId) {
      this.getEducatorById();
    }

    this.getCategoryType();
    // this.getCategories();
    // this.getSubjects();

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

  goToPreview(): any {
    // let url = this.restapi.SERVER_BASE + '/course-details/' + this.educatorsId
    // window.open(url, '_blank');
  }


  uploadBtn(): any {
    let elem = document.getElementById('file-input')
    if (elem) {
      elem.click()
    }
  }

  onClickDelete(id: any): any {
    this.educatorsId = id;
    this.modalService.open(this.deleteModal, { centered: true, size: "md" });
  }

  deleteEducator(): any {
    let params = {
      userId: this.commonservice.getUserId(),
      educatorid: this.educatorsId,
    };
    this.commonservice.loaderStart();
    this.restapi.deleteEducator(params).subscribe(
      (res: any) => {
        this.commonservice.loaderEnd();
        if (res.success) {
          this.notifierService.notify("success", res.message);
          this.router.navigate(["admin/app/educators"]);
          this.closeModal()
        } else {
          this.notifierService.notify("error", res.message);
        }
      },
      (err: any) => {
        this.commonservice.loaderEnd();
        this.notifierService.notify("error", err.error.message);
      }
    );
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



  passwordShowHide(): any {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.show = true;
    } else {
      this.passwordType = 'password';
      this.show = false;
    }
  }



  onFileChanged(event: any) {
    this.educatorImageErr = false;
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

  changeEducatorNameFun(): any {
    this.educatornameErr = false;
  }

  changeEducatorShortNameFun(): any {
    this.educatorshortnameErr = false;
  }

  changeEducatorEmailFun(): any {
    this.educatoremailErr = false
    if (this.educatoremail) {
      if (!this.educatoremail.match(this.mailformat)) {
        this.educatoremailValidErr = true
      } else {
        this.educatoremailValidErr = false
      }
    }
  }

  changeEducatorcategoryTypeFun(): any {
    this.categoryTypeErr = false
  }

  changeEducatorAddressFun(): any {
    this.educatoraddressErr = false
  }

  changeEducatorPhoneFun(): any {
    this.educatorphoneErr = false;
    if (this.educatorphone) {
      if (
        this.educatorphone.toString().length > 15 ||
        this.educatorphone.toString().length < 7
      ) {
        this.educatorphoneValidErr = true
      } else {
        this.educatorphoneValidErr = false
      }
    }
  }

  changeEducatorPasswordFun(): any {
    this.passwordErr = false;
    if (this.password) {
      if (this.password.length < 8) {
        this.passwordValidErr = true;
      } else {
        this.passwordValidErr = false;
      }
    }

  }

  changeEducatorSubHeadingFun(): any {
    this.subheadingErr = false;
  }

  changeEducatorExpertFun(): any {
    this.educatorExpertErr = false
  }

  changeEducatorAboutFun(): any {
    this.educatorAboutErr = false
  }

  changeEducatorTeachingExperianceFun(): any {
    this.teachingExperianceErr = false
  }

  changeEducatorTimeFun(arr: any): any {
    arr.timeErr = false
  }


  addEducator(): any {

    this.educatornameErr = false;
    this.educatorshortnameErr = false
    this.educatoremailErr = false
    this.educatoremailValidErr = false
    this.categoryTypeErr = false
    this.educatoraddressErr = false
    this.educatorImageErr = false;
    this.educatorphoneErr = false;
    this.educatorphoneValidErr = false
    this.passwordErr = false;
    this.passwordValidErr = false;
    this.subheadingErr = false;
    this.educatorExpertErr = false
    this.categoriesNameErr = false
    this.subjectsNameErr = false
    this.educatorAboutErr = false
    this.teachingExperianceErr = false




    let err = 0;

    if (
      this.educatorname == "" ||
      this.educatorname == null ||
      this.educatorname == undefined
    ) {
      this.educatornameErr = true;
      err++;
    }

    if (
      this.educatorshortname == "" ||
      this.educatorshortname == null ||
      this.educatorshortname == undefined
    ) {
      this.educatorshortnameErr = true
      err++;
    }


    if (
      this.educatoremail == "" ||
      this.educatoremail == null ||
      this.educatoremail == undefined
    ) {
      this.educatoremailErr = true
      err++;
    }

    if (this.educatoremail) {
      if (!this.educatoremail.match(this.mailformat)) {
        this.educatoremailValidErr = true
        err++;
      }
    }


    if (
      this.categoryType == "" ||
      this.categoryType == null ||
      this.categoryType == undefined
    ) {
      this.categoryTypeErr = true
      err++;
    }


    if (
      this.educatoraddress == "" ||
      this.educatoraddress == null ||
      this.educatoraddress == undefined
    ) {
      this.educatoraddressErr = true
      err++;
    }

    if (this.educatorImage == "") {
      this.educatorImageErr = true;
      err++;
    }

    if (
      this.educatorphone == "" ||
      this.educatorphone == null ||
      this.educatorphone == undefined
    ) {
      this.educatorphoneErr = true;
      err++;
    }

    if (this.educatorphone) {
      if (
        this.educatorphone.toString().length > 15 ||
        this.educatorphone.toString().length < 7
      ) {
        this.educatorphoneValidErr = true
        err++;
      }
    }


    if (
      this.password == "" ||
      this.password == null ||
      this.password == undefined
    ) {
      this.passwordErr = true;
      err++;
    }

    if (this.password) {
      if (this.password.length < 8) {
        this.passwordValidErr = true;
        err++;
      }
    }


    if (
      this.subheading == "" ||
      this.subheading == null ||
      this.subheading == undefined
    ) {
      this.subheadingErr = true;
      err++;
    }


    if (
      this.educatorExpert == "" ||
      this.educatorExpert == null ||
      this.educatorExpert == undefined
    ) {
      this.educatorExpertErr = true
      err++;
    }


    
    if (
      this.educatorAbout == "" ||
      this.educatorAbout == null ||
      this.educatorAbout == undefined
    ) {
      this.educatorAboutErr = true
      err++;
    }

    if (
      this.teachingExperiance == "" ||
      this.teachingExperiance == null ||
      this.teachingExperiance == undefined
    ) {
      this.teachingExperianceErr = true
      err++;
    }


    if (err == 0) {
      const obj = {
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
        'about': this.educatorAbout,
        'teachingexp': this.teachingExperiance,
      };

      // obj
    //   {
    //     "socialid":1,
    //     "socialtype":"google",
    //     "userType":2,
    //     "usercode":"101",  
    // }

      console.log(obj, "<<<<<<<<<<<<<<<<<<<<<");

      this.commonservice.loaderStart();
      this.restapi.addEducator(obj).subscribe(
        (res: any) => {
          this.commonservice.loaderEnd();
          if (res.success) {
            this.notifierService.notify("success", res.message);
            this.resetForm();
            this.router.navigate(["admin/app/educators"]);
          } else {
            this.notifierService.notify("error", res.message);
          }
        },
        (err: any) => {
          this.commonservice.loaderEnd();
          this.notifierService.notify("error", err.error.message);
        }
      );
    }


  }

  getEducatorById() {
    let obj = {
      educatorid: this.educatorsId,
    };
    this.commonservice.loaderStart();
    this.restapi.getEducatorById(obj).subscribe((res: any) => {
      this.commonservice.loaderEnd();
      if (res.success) {
        console.log("res.response", res.response)
        this.educatorDetails = res.response;
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
        for (let cat of res.response.categoryList) {
          category.push(
            { "categoriesid": cat.categoryid, "name": cat.name }
          )
        }
        this.categoriesList = category


        var subject = []
        for (let sub of this.educatorDetails.subjectList) {
          subject.push(
            { "subjectid": sub.subjectid, "name": sub.name }
          )
        }
        this.subjectsList = subject


        this.qualificationArr = this.educatorDetails.qualificationList.length > 0 ? [] : this.educatorDetails.qualificationList;
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
  updateEducator(): any {


    this.educatornameErr = false;
    this.educatorshortnameErr = false
    this.educatoremailErr = false
    this.educatoremailValidErr = false
    this.categoryTypeErr = false
    this.educatoraddressErr = false
    this.educatorImageErr = false;
    this.educatorphoneErr = false;
    this.educatorphoneValidErr = false
    this.passwordErr = false;
    this.passwordValidErr = false;
    this.subheadingErr = false;
    this.educatorExpertErr = false
    this.categoriesNameErr = false
    this.subjectsNameErr = false
    this.educatorAboutErr = false
    this.teachingExperianceErr = false




    let err = 0;

    if (
      this.educatorname == "" ||
      this.educatorname == null ||
      this.educatorname == undefined
    ) {
      this.educatornameErr = true;
      err++;
    }

    if (
      this.educatorshortname == "" ||
      this.educatorshortname == null ||
      this.educatorshortname == undefined
    ) {
      this.educatorshortnameErr = true
      err++;
    }




    if (
      this.categoryType == "" ||
      this.categoryType == null ||
      this.categoryType == undefined
    ) {
      this.categoryTypeErr = true
      err++;
    }


    if (
      this.educatoraddress == "" ||
      this.educatoraddress == null ||
      this.educatoraddress == undefined
    ) {
      this.educatoraddressErr = true
      err++;
    }

    if (this.educatorImage == "") {
      this.educatorImageErr = true;
      err++;
    }

    if (
      this.educatorphone == "" ||
      this.educatorphone == null ||
      this.educatorphone == undefined
    ) {
      this.educatorphoneErr = true;
      err++;
    }

    if (this.educatorphone) {
      if (
        this.educatorphone.toString().length > 15 ||
        this.educatorphone.toString().length < 7
      ) {
        this.educatorphoneValidErr = true
        err++;
      }
    }




    if (
      this.subheading == "" ||
      this.subheading == null ||
      this.subheading == undefined
    ) {
      this.subheadingErr = true;
      err++;
    }


    if (
      this.educatorExpert == "" ||
      this.educatorExpert == null ||
      this.educatorExpert == undefined
    ) {
      this.educatorExpertErr = true
      err++;
    }


    
    if (
      this.educatorAbout == "" ||
      this.educatorAbout == null ||
      this.educatorAbout == undefined
    ) {
      this.educatorAboutErr = true
      err++;
    }

    if (
      this.teachingExperiance == "" ||
      this.teachingExperiance == null ||
      this.teachingExperiance == undefined
    ) {
      this.teachingExperianceErr = true
      err++;
    }

  

    if (err == 0) {

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
        'about': this.educatorAbout,
        'teachingexp': this.teachingExperiance,
      };

      console.log(obj)


      this.commonservice.loaderStart();
      this.restapi.updateEducator(obj).subscribe(
        (res: any) => {
          this.commonservice.loaderEnd();
          if (res.success) {
            this.resetForm();
            this.notifierService.notify("success", res.message);
            this.router.navigate(["admin/app/educators"]);
          } else {
            this.notifierService.notify("error", res.message);
          }
        },
        (err: any) => {
          this.notifierService.notify("error", err.error.message);
        }
      );
    }
  }


  resetForm() {
    this.educatorname = "";
    this.educatorshortname = "";
    this.password = "";
    this.educatoraddress = "";
    this.educatorphone = "";
    this.educatoremail = "";
    this.subheading = "";
    this.educatorExpert = "";
    this.categoryType = "";
    this.educatorImage = "";
    this.categoryList = [];
    this.subjectsList = [];
    this.qualificationArr = [
      {
        subjectid: "",
        levelid: "",
        gradeid: "",
        institutionid: "",
        time: "",
        subjectidErr: false,
        levelidErr: false,
        gradeidErr: false,
        institutionidErr: false,
        timeErr: false,
      },
    ];
    this.educatorAbout = "";
    this.teachingExperiance = "";
    this.educatornameErr = false;
    this.educatorshortnameErr = false
    this.educatoremailErr = false
    this.educatoremailValidErr = false
    this.categoryTypeErr = false
    this.educatoraddressErr = false
    this.educatorImageErr = false;
    this.educatorphoneErr = false;
    this.educatorphoneValidErr = false
    this.passwordErr = false;
    this.passwordValidErr = false;
    this.subheadingErr = false;
    this.educatorExpertErr = false
    this.categoriesNameErr = false
    this.subjectsNameErr = false
    this.educatorAboutErr = false
    this.teachingExperianceErr = false
    this.router.navigate(["admin/app/educators"]);

  }

  addExpTable(): any {
    let obj = {
      subjectid: "",
      levelid: "",
      gradeid: "",
      institutionid: "",
      time: "",
      subjectidErr: false,
      levelidErr: false,
      gradeidErr: false,
      institutionidErr: false,
      timeErr: false,
    };
    this.qualificationArr.push(obj);
  }
  deleteExpTable() {
    this.qualificationArr.pop();
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

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, "");
  }

  getCategoryType() {
    let obj = {
      searchText: "",
    };
    this.restapi.getCategoryType(obj).subscribe((res: any) => {
      this.categoryTypeList = res.response;
    });
  }
  // getCategories() {
  //   this.selectedItems = []
  //   this.categoryTypeErr
  //   let obj = {
  //     searchText: "",
  //     categoryTypeId: this.categoryType
  //   };
  //   this.restapi.getCategories(obj).subscribe((res: any) => {
  //     this.dropdownList = res.response;
  //   });
  // }
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
        obj.gradeidErr = false

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
        obj.levelidErr = false

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
        obj.subjectidErr = false
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
        obj.institutionidErr = false

      }
    });
  }

  goBack() {
    this.router.navigate(["admin/app/educators"]);
  }




  searchCategoriesByName(): any {
    this.categoriesNameErr = false
    let obj = {
      searchText: this.categoriesName,
      categoryTypeId: this.categoryType
    };
    this.categoriesSpinner = true
    this.restapi.getCategories(obj).subscribe((res: any) => {
      this.categoriesSpinner = false
      if (res.success) {
        this.categoriesArr = res.response;
      } else {
        this.categoriesArr = []
      }
    });
  }



  searchSubjectByName() {
    this.subjectsNameErr = false
    let obj = {
      searchText: this.subjectsName,
    };
    this.subjectsSpinner = true
    this.restapi.getSubjects(obj).subscribe((res: any) => {
      this.subjectsSpinner = false
      if (res.success) {
        this.subjectsArr = res.response;
      } else {
        this.subjectsArr = [];
      }
    });
  }

  getCategoriesIdByName(): any {
    // this.categoriesNameErr = false
    for (let data of this.categoriesArr) {
      if (data.name === this.categoriesName) {
        if (!this.categoriesList.some((item: { name: any; }) => item.name === this.categoriesName)) {
          this.categoriesList.push({ categoriesid: data.categoriesid, name: data.name })
        }
      }
    }
  }

  getSubjectsIdByName(): any {
    // this.categoriesNameErr = false
    for (let data of this.subjectsArr) {
      if (data.name === this.subjectsName) {
        if (!this.subjectsList.some((item: { name: any; }) => item.name === this.subjectsName)) {
          this.subjectsList.push({ subjectid: data.id, name: data.name })
        }
      }
    }
  }

  catrgoriesRemove(i: any): any {
    this.categoriesList.splice(i, 1)
  }

  subjectsRemove(i: any): any {
    this.subjectsList.splice(i, 1)
  }

  closeModal():any {
    this.educatorsId = "";
    this.modalService.dismissAll();
  }

}
