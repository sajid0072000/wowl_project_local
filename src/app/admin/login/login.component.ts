import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

import { Router } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';
import { CommonService } from "../../common.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    username: any = '';
    password: any = '';

    showHideFlag: boolean = false
    passwordFlag: any = 'password'

    constructor(private router: Router, private restapi: RestApiService, private notifierService: NotifierService,
        private common: CommonService) {
    }

    ngOnInit(): void {
        const userType = this.common.getUserType();
        if (userType === 1) {
            this.router.navigate(['/admin/app/admin-dashboard'])
        } 
        if (userType === 2) {
            this.router.navigate(['/admin/app'])
        } 
        if (userType === 4) {
            this.router.navigate(['/admin/app/partner-dashboard'])
        }
    }

    login(): any {
        if (!this.checkValidation()) {
            return false;
        }
        const obj = {
            username: this.username,
            password: this.password
        };
        this.restapi.adminLogin(obj).subscribe((res: any) => {
            if (res.success) {
                this.common.setAdminData(res.response)
                if (res.response.userType == 1) {
                    this.router.navigate(['/admin/app/admin-dashboard']);
                }
                if (res.response.userType == 2) {
                    this.router.navigate(['/admin/app']);
                }
                if(res.response.userType == 4){
                    this.common.setPartnerId(res.response.partnerid);
                    this.router.navigate(['/admin/app/partner-dashboard']);
                }
            } else {
                this.notifierService.notify('info', res.message);
            }
        })
    }

    checkValidation(): boolean {
        if (this.username == '') {
            return false;
        }
        if (this.password == '') {
            return false;
        }
        return true;
    }

    showHide(): any {
        if (!this.showHideFlag) {
            this.showHideFlag = true
            this.passwordFlag = 'text'
        } else {
            this.showHideFlag = false
            this.passwordFlag = 'password'
        }
    }
}
