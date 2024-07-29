import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {RestApiService} from 'src/app/rest-api.service';
import {CommonService} from 'src/app/common.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent {

  @ViewChild('popupModal') popupModal: any;

  categoryTypeId: any = ''
  FILE_URL: any = ""

  categoryObj: any = {
    categoriesDtl: [],
    categoryTypeData: {}
  }
  bannerImage: any = ""
  name: any = ""
  demovideo: any = ""

  videoDiv: boolean = false

  popupimg: any = ''
  popupactivate: any = ''
  landingtitle: any = ''
  videothumbnail: any = ''


  constructor(private router: Router, private active: ActivatedRoute, private rest: RestApiService, private common: CommonService, private modalService: NgbModal) {
    this.FILE_URL = this.rest.FILE_URL
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.categoryObj.categoryTypeData = {
      description: '',
      whylearnlangwithwowl: '',
    }
    this.categoryTypeId = this.active.snapshot.paramMap.get('id');
    this.getCategoryTypesById()

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.modalService.dismissAll();
      }
    });

  }

  closeModal(): any {
    this.modalService.dismissAll();
  }

  playVideo(): any {
    this.videoDiv = true;
    setTimeout(() => {
      this.common.getTrancoding('video-container', '100%', '100%', this.demovideo, '')
    }, 500);
  }


  getCategoryTypesById(): any {
    const data = {
      "categoryTypeId": this.categoryTypeId
    }
    this.common.loaderStart()
    this.rest.getCategoryTypesById(data).subscribe((result: any) => {
      this.common.loaderEnd()
      if (result.success) {
        this.categoryObj = result.response;
        this.bannerImage = this.categoryObj.categoryTypeData.bannerImage
        this.name = this.categoryObj.categoryTypeData.name
        this.demovideo = this.categoryObj.categoryTypeData.demovideo
        this.popupimg = this.categoryObj.categoryTypeData.popupimg
        this.popupactivate = this.categoryObj.categoryTypeData.popupactivate
        this.landingtitle = this.categoryObj.categoryTypeData.landingtitle
        this.videothumbnail = this.categoryObj.categoryTypeData.videothumbnail
        if (this.popupactivate === 1) {
          this.common.sheardData = this.popupimg
          this.common.getLessionPopup()
        }
        if (this.categoryObj.categoriesDtl && this.categoryObj.categoriesDtl.length > 0) {
          for (let obj of this.categoryObj.categoriesDtl) {
            obj.courselist.sort((a: any, b: any) => a.courseseq - b.courseseq);
          }
        }
      }
    })
  }


  splitDescription(theString: any) {
    let temp: any = theString.split('|');
    let temp2: any = []
    for (let i = 0; i < 3; i++) {
      temp2.push(temp[i])
    }
    return temp2
  }


  goto(path: any, isLive: any) {
    this.router.navigate(["/course-details/" + path + "/" + isLive])
  }


}
