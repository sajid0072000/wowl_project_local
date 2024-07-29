import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {NgSelectModule} from '@ng-select/ng-select';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import { NgChartsModule } from 'ng2-charts';

import {LoginComponent} from './login/login.component';
import {EducatorListComponent} from './educator/educator-list/educator-list.component';
import {AddEducatorComponent} from './educator/add-educator/add-educator.component';
import {AddLessionComponent} from './lession/add-lession/add-lession.component';
import {CourseListComponent} from './course/course-list/course-list.component';
import {AddCourseComponent} from './course/add-course/add-course.component';
import {LessionListComponent} from './lession/lession-list/lession-list.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AddExerciseComponent} from './exercise/add-exercise/add-exercise.component';
import {ExerciseListComponent} from './exercise/exercise-list/exercise-list.component';
import {UnitlistComponent} from './unit/unitlist/unitlist.component';
import {AddUnitComponent} from './unit/add-unit/add-unit.component';
import { AddAttachmentComponent } from './attachments/add-attachment/add-attachment.component';
import { AttachmentListComponent } from './attachments/attachment-list/attachment-list.component';
import { AddCourseEducatorMapComponent } from './course-educator-map/add-course-educator-map/add-course-educator-map.component';
import { CourseEducatorMapListComponent } from './course-educator-map/course-educator-map-list/course-educator-map-list.component';
import { LessonMappingListComponent } from './lesssonMapping/lesson-mapping-list/lesson-mapping-list.component';
import { AddLessonMappingComponent } from './lesssonMapping/add-lesson-mapping/add-lesson-mapping.component';
import { EducatorProfileComponent } from './profile/educator-profile/educator-profile.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { EducatorDashboardComponent } from './dashboard/educator-dashboard/educator-dashboard.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CategorytypeComponent } from './master/categorytype/categorytype/categorytype.component';
import { CategoriesListComponent } from './master/categories/categories-list/categories-list.component';
import { QualificationsubjectComponent } from './master/qualifiaction/qualificationsubject/qualificationsubject.component';
import { LevelsComponent } from './master/qualifiaction/levels/levels.component';
import { GradesComponent } from './master/qualifiaction/grades/grades.component';
import { SubjectListComponent } from './master/subjects/subject-list/subject-list.component';
import { InstitueListComponent } from './master/institue/institue-list/institue-list.component';
import { FooterComponent } from './footer/footer.component';
import { SkillsComponent } from './skills/skills/skills.component';
import { PublicSourceComponent } from './public-source/public-source.component';
import { NgChunkUploadComponent } from './ng-chunk-upload/ng-chunk-upload.component';
import { GuidedVideoComponent } from './guided-video/guided-video.component';
import { TalktoadvisorlistComponent } from './talktoadvisorlist/talktoadvisorlist.component';
import { AddwowalTeamComponent } from './addwowal-team/addwowal-team.component';
import { LandingContentComponent } from './landing-content/landing-content.component';
import { WhyWowlComponent } from './why-wowl/why-wowl.component';
import { AboutPageComponent } from './master/about-page/about-page.component';
import { DeletedprofileListComponent } from './delete-profile/deletedprofile-list/deletedprofile-list.component';
import { ContactusListComponent } from './contactus/contactus-list/contactus-list.component';
import { LoginHeaderComponent } from './login/login-header/login-header.component';
import { LoginFooterComponent } from './login/login-footer/login-footer.component';
import { ApplicationVersionComponent } from './application-version/application-version/application-version.component';
import { SubscriptionUserComponent } from './subscription/subscription-user/subscription-user.component';
import { AddSubscriptionComponent } from './subscription/add-subscription/add-subscription.component';
import { CourseSubscriptionComponent } from './subscription/course-subscription/course-subscription.component';
import { SubscriptionComponent } from './subscription/subscription/subscription.component';
import { AddCourseSubscriptionComponent } from './subscription/add-course-subscription/add-course-subscription.component';
import { AddPartnerComponent } from './partner/add-partner/add-partner.component';
import { PartnerListComponent } from './partner/partner-list/partner-list.component';
import { PartnerDashboardComponent } from './dashboard/partner-dashboard/partner-dashboard.component';

import { PieChartComponent } from './Chart/pie-chart/pie-chart.component';
import { BarChartComponent } from './Chart/bar-chart/bar-chart.component';
import { PromocodeListComponent } from './promocode/promocode-list/promocode-list.component';
import { AddPromocodeComponent } from './promocode/add-promocode/add-promocode.component';
import { UserAssignmentListComponent } from './user-assignment-details/user-assignment-list/user-assignment-list.component';
import { AssignmentDetailsComponent } from './user-assignment-details/assignment-details/assignment-details.component';
import { ReadingAssesmentListComponent } from './final-assesment/reading-assesment-list/reading-assesment-list.component';
import { AddReadingAssesmentComponent } from './final-assesment/add-reading-assesment/add-reading-assesment.component';
import { ListeningAssesmentListComponent } from './final-assesment/listening-assesment-list/listening-assesment-list.component';
import { AddListeningAssesmentComponent } from './final-assesment/add-listening-assesment/add-listening-assesment.component';
import { AddSpeakingAssesmentComponent } from './final-assesment/add-speaking-assesment/add-speaking-assesment.component';
import { SpeakingAssesmentListComponent } from './final-assesment/speaking-assesment-list/speaking-assesment-list.component';
import { UserCourseAuditComponent } from './user-course-details/user-course-audit/user-course-audit.component';
import { UserScoreComponent } from './user-course-details/user-score/user-score.component';


const notifierDefaultOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'right',
            distance: 12,
        },
        vertical: {
            position: 'top',
            distance: 12,
            gap: 10,
        },
    },
    theme: 'material',
    behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4,
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease',
        },
        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50,
        },
        shift: {
            speed: 300,
            easing: 'ease',
        },
        overlap: 150,
    },
};


@NgModule({
    declarations: [
        AdminComponent,
        LoginComponent,
        EducatorListComponent,
        AddEducatorComponent,
        AddLessionComponent,
        CourseListComponent,
        AddCourseComponent,
        LessionListComponent,
        AddExerciseComponent,
        ExerciseListComponent,
        UnitlistComponent,
        AddUnitComponent,
        AddAttachmentComponent,
        AttachmentListComponent,
        AddCourseEducatorMapComponent,
        CourseEducatorMapListComponent,
        LessonMappingListComponent,
        AddLessonMappingComponent,
        EducatorProfileComponent,
        AdminDashboardComponent,
        EducatorDashboardComponent,
        InstitueListComponent,
        SubjectListComponent,
        GradesComponent,
        LevelsComponent,
        QualificationsubjectComponent,
        CategoriesListComponent,
        FooterComponent,
        CategorytypeComponent,
        SkillsComponent,
        PublicSourceComponent,
        NgChunkUploadComponent,
        GuidedVideoComponent,
        TalktoadvisorlistComponent,
        AddwowalTeamComponent,
        LandingContentComponent,
        WhyWowlComponent,
        AboutPageComponent,
        DeletedprofileListComponent,
        ContactusListComponent,
        LoginHeaderComponent,
        LoginFooterComponent,
        ApplicationVersionComponent,
        SubscriptionUserComponent,
        AddSubscriptionComponent,
        CourseSubscriptionComponent,
        SubscriptionComponent,
        AddCourseSubscriptionComponent,
        AddPartnerComponent,
        PartnerListComponent,
        PartnerDashboardComponent,
        PieChartComponent,
        BarChartComponent,
        PromocodeListComponent,
        AddPromocodeComponent,
        UserAssignmentListComponent,
        AssignmentDetailsComponent,
        ReadingAssesmentListComponent,
        AddReadingAssesmentComponent,
        ListeningAssesmentListComponent,
        AddListeningAssesmentComponent,
        AddSpeakingAssesmentComponent,
        SpeakingAssesmentListComponent,
        UserCourseAuditComponent,
        UserScoreComponent,

    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatMenuModule,
        FormsModule,
        MatAutocompleteModule,
        NgMultiSelectDropDownModule.forRoot(),
        CKEditorModule,
        ReactiveFormsModule,
        NotifierModule.withConfig(notifierDefaultOptions),
        HttpClientModule,
        NgSelectModule,
        FontAwesomeModule,
        MatToolbarModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatListModule,
        MatExpansionModule,
        NgChartsModule

    ],
    schemas: []
})
export class AdminModule {
}
