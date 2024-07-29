import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from "angular-notifier";
@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {

    offset = 0;
    limit = 20;
    subscriptionList: any = [];
    subscriptionid = '' as any;
    selectedVal: any = 20;
    public pageList: Array<any> = [
        { name: '10', value: '10' },
        { name: '15', value: '15' },
        { name: '20', value: '20' },
        { name: '30', value: '30' },
        { name: '50', value: '50' }
    ];
    constructor(
        private router: Router,
        private restapi: RestApiService,
        public common: CommonService,
        private modalService: NgbModal,
        private notifierService: NotifierService
    ) {
    }

    ngOnInit(): void {
        if (this.common.getLimit()) {
            this.limit = this.common.getLimit()
        }
        if (this.common.getOffset()) {
            this.offset = this.common.getOffset()
        }
        this.getSubscriptionList();
    }

    previousBtnDesable: boolean = true;
    nextBtnDesable: boolean = false;

    getSubscriptionList(): any {
        let obj = {
            'offset': this.offset + '',
            'limit': this.limit
        }
        this.common.loaderStart();
        this.restapi.getAllSubscriptionPlans(obj).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.response) {
                    if (res.response.length > 0) {
                        this.subscriptionList = res.response;
                        this.nextBtnDesable = res.response.length < this.limit;
                    } else {
                        this.nextBtnDesable = true;
                        this.offset = this.offset > 0 ? this.offset - this.limit : this.offset;
                    }
                } else {
                    this.nextBtnDesable = true;
                }
            } else {
                this.subscriptionList = [];
            }
        })
    }


    changePagelimit(event: any): any {
        this.offset = 0;
        this.limit = Number(event.target.value);
        this.getSubscriptionList();
    }

    previousPage(): any {
        this.offset = this.offset > 0 ? this.offset - this.limit : 0;
        this.offset = this.offset < 0 ? 0 : this.offset;
        this.getSubscriptionList();
        if (this.offset <= 0) {
            this.previousBtnDesable = true;
        }
    }

    nextPage(): any {
        this.previousBtnDesable = false;
        this.offset = this.offset + this.limit;
        this.getSubscriptionList();
    }

    add(): any {
        this.router.navigate(['admin/app/add-subscription/0'])
    }

    edit(id: any): any {
        this.common.setLimit(this.limit)
        this.common.setOffset(this.offset)
        this.router.navigate(['admin/app/add-subscription/' + id])
    }


}
