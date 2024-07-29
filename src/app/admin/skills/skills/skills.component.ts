import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {

  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('addModal') addModal: any;
  offset = 0;
  limit = 20;
  skillsList: any = [];
  id = '' as any
  selectedVal: any = 20;
  public pageList: Array<any> = [
    { name: '10', value: '10' },
    { name: '15', value: '15' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' }
  ];

  searchText: any = ''


  name: any = ""
  skillId: any = ''

  skillErr: any = ''

  constructor(
    private router: Router,
    private restapi: RestApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getSkills();
  }

  goToPreview(): any {

  }

  changeSkillName(): any {
    this.skillErr = ''

  }

  previousBtnDesable: boolean = true;
  nextBtnDesable: boolean = false;

  getSkills(): any {
    let obj = {
      'offset': this.offset + '',
      'limit': this.limit,
      'searchText': this.searchText
    }
    this.common.loaderStart();
    this.restapi.getSkills(obj).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response) {
          if (res.response.length > 0) {
            this.skillsList = res.response;
            this.nextBtnDesable = res.response.length < this.limit;
          } else {
            this.nextBtnDesable = true;
            this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
          }
        } else {
          this.nextBtnDesable = true;
        }
      } else {
        this.skillsList = [];
      }
    })
  }


  changePagelimit(event: any): any {
    this.offset = 0;
    this.limit = Number(event.target.value);
    this.getSkills();
  }

  previousPage(): any {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.offset = this.offset < 0 ? 0 : this.offset;
    this.getSkills();
    if (this.offset <= 0) {
      this.previousBtnDesable = true;
    }
  }

  nextPage(): any {
    this.previousBtnDesable = false;
    this.offset = this.offset + this.limit;
    this.getSkills();
  }

  add(): any {
    this.skillId = ''
    this.name = ''
    this.modalService.open(this.addModal, { centered: true, size: 'lg' });
  }

  edit(id: any, item: any): any {
    this.skillId = id
    this.name = item.Name
    this.common.setLimit(this.limit)
    this.common.setOffset(this.offset)
    this.common.setSearchText(this.searchText)
    this.modalService.open(this.addModal, { centered: true, size: 'lg' });
  }


  delete(): any {
    const data = {
      "id": this.skillId
    }
    this.common.loaderStart();
    this.restapi.deleteSkill(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.getSkills()
        this.closeModal()
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  onClickDelete(id: any): any {
    this.id = id
    this.modalService.open(this.deleteModal, { centered: true, size: 'md' });
  }

  closeModal(): any {
    this.id = '';
    this.skillId = ''
    this.name = ''
    this.modalService.dismissAll();
  }


  enableActive(e: any): any {
    const checked = e.target.checked == 0 ? 0 : 1;
    const checkedValue = e.target.value;
    var data = {
      "id": checkedValue,
      "active": checked
    }
    this.common.loaderStart();
    this.restapi.enableActiveSkill(data).subscribe((res: any) => {
      this.common.loaderEnd();
      console.log(res.response);
      if (res.success) {
        this.notifierService.notify('success', res.message);
        this.getSkills()
      } else {
        this.notifierService.notify('error', res.message);
      }
    })

  }

  onEnter() {
    this.getSkills();
  }

  search(): any {
    if (this.searchText.length % 3 === 0) {
      this.getSkills();
    }
    if (this.searchText.length == 0) {
      this.getSkills();
    }
  }


  onSubmit(): any {
    this.skillErr = ''
    let err = 0

    if (this.name == "" || this.name == null || this.name == undefined) {
      this.skillErr = "Skill name required";
      err++;
    }

    if (err == 0) {
      const data = {
        "name": this.name
      }
      this.common.loaderStart()
      this.restapi.addSkill(data).subscribe((result: any) => {
        this.common.loaderEnd()
        if (result.success) {
          this.notifierService.notify('success', result.message);
          this.closeModal()
          this.getSkills()
        } else {
          this.notifierService.notify('error', result.message);
        }
      })
    }
  }

  onEdit(): any {

    this.skillErr = ''
    let err = 0

    if (this.name == "" || this.name == null || this.name == undefined) {
      this.skillErr = "Skill name required";
      err++;
    }

    if (err == 0) {
      const data = {
        "id": this.skillId,
        "name": this.name
      }
      this.common.loaderStart()
      this.restapi.updateSkill(data).subscribe((result: any) => {
        this.common.loaderEnd()
        if (result.success) {
          this.notifierService.notify('success', result.message);
          if (this.common.getLimit()) {
            this.limit = this.common.getLimit()
          }
          if (this.common.getOffset()) {
            this.offset = this.common.getOffset()
          }
          if (this.common.getSearchText()) {
            this.searchText = this.common.getSearchText()
          }
          this.getSkills()
          this.closeModal()
        } else {
          this.notifierService.notify('error', result.message);
        }
      })
    }

  }


}
