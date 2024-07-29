import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import {CommonService} from "../common.service";
import { RestApiService } from '../rest-api.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    showDrawer = true;
    drawer: any;

    menuArr = [] as any

    url = '' as any
    panelOpenState = false;

    isNavDropDown:boolean=false


    constructor(private router: Router, public common: CommonService, private rest:RestApiService , private notifierService:NotifierService) {
    }

    ngOnInit(): void {
        const userType = this.common.getUserType();
        /*if (userType === 1) {
            this.router.navigate(['/admin/app/admin-dashboard'])
        }*/
        if (userType === 2) {
            this.router.navigate(['/admin/app'])
        }
        if (userType === 4) {
            this.router.navigate(['/admin/app/partner-dashboard'])
        }
        if (!userType) {
            this.router.navigate(['/admin'])
        }
        this.getMenu()
    }

    addClass(i:any):any{
        for(let [index,obj] of this.menuArr.entries()){
            if(index == i){
                if(!obj.navDropdown){
                    obj.navDropdown = true
                }else{
                    obj.navDropdown = false
                }
            }else{
                obj.navDropdown = false
            }
        }
    }

    removeClass():any{
        for(let [index,obj] of this.menuArr.entries()){
            obj.navDropdown = false
        }
    }

    getMenu(): any {
        if (this.common.getUserType() == 1) {
            this.menuArr.push(
                {path: "/admin/app/course-list", name: "Course", navDropdown:false, child: []},
                {path: "/admin/app/educators", name: "Educator", navDropdown:false, child: []},
                {
                    path: "", name: "Resources", navDropdown:false, child: [
                        {path: "/admin/app/lession-list", name: "Lesson"},
                        {path: "/admin/app/unit-list", name: "Unit"},
                        {path: "/admin/app/exercise-list", name: "Exercise"},
                        {path: "/admin/app/lesson-mapping", name: "Lesson Mapping"},
                        {path: "/admin/app/taltoadvisor", name: "Talk to Advisor"},
                        
                        {path: "/admin/app/reading-assesment-list", name: "Reading Assesment"},
                        {path: "/admin/app/listening-assesment-list", name: "Listening Assesment"},
                        {path: "/admin/app/speaking-assesment-list", name: "Speaking Assesment"},

                    ]
                },
                {
                    path: "", name: "Admin", navDropdown:false, child: [
                        {path: "/admin/app/course-educator-map-list", name: "Course Educator Mapping"},
                        {path: "/admin/app/public-source", name: "Public Source"},
                        {path: "/admin/app/guided-video", name: "Guided Video"},
                        {path: "/admin/app/why-wowl", name: "Why wowl"},
                        {path: "/admin/app/landing-content", name: "Landing content"},
                        {path: "/admin/app/about-page", name: "About"},
                        {path: "/admin/app/delete-profile", name: "Delete Account"},
                        {path: "/admin/app/contact-us", name: "Contact us"},
                        {path: "/admin/app/application-version", name: "Application Version"},
                        {path: "/admin/app/subscription", name: "Subscription"},
                        {path: "/admin/app/course-subscription", name: "Course Subscription"},
                        {path: "/admin/app/subscription-user", name: "Subscription User"},
                        {path: "/admin/app/partner-list", name: "Partner"},
                        {path: "/admin/app/user-assignment-list", name: "User assignment audit"},
                        {path: "/admin/app/user-course-audit" , name:"User Course Audit"}
                    ]
                },
                {
                    path: "", name: "Data",  navDropdown:false, child: [

                        {path: "/admin/app/teamwowl-list", name: "Team Wowl"},
                        {path: "/admin/app/categorytype", name: "Category Type"},
                        {path: "/admin/app/categories", name: "Category"},
                    ]
                },
                {path: "/admin/app/promocode-list", name: "Promo Code", navDropdown:false, child: []},
            )
        }

        if (this.common.getUserType() == 2) {
            this.menuArr.push(
                {path: "/admin/app/educator-profile", name: "Profile",  navDropdown:false, child: []},
                {path: "/admin/app/course-list", name: "Course", navDropdown:false, child: []},
                {
                    path: "", name: "Resources",  navDropdown:false, child: [
                        {path: "/admin/app/lession-list", name: "Lesson"},
                        {path: "/admin/app/unit-list", name: "Unit"},
                        {path: "/admin/app/exercise-list", name: "Exercise"},
                        // {path: "/admin/app/attachment-list", name: "Attachment"},
                        {path: "/admin/app/lesson-mapping", name: "Lesson Mapping"}
                    ]
                }
            )
        }
        if(this.common.getUserType() == 4){
            this.menuArr.push(
                // {path: "/admin/app/partner-dashboard", name: "Partner Dashboard", navDropdown:false, child: []},
            )
        }

    }

    goto(path: string) {
        for(let [index,obj] of this.menuArr.entries()){
                obj.navDropdown = false
        }
        this.url = path;
        this.router.navigate([path])
        this.common.clearAdminData();
    }

    logout(): void {
        this.common.logoutAdmin();
        this.router.navigate(['/admin'])
    }


}
