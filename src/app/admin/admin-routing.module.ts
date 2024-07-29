import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { EducatorListComponent } from './educator/educator-list/educator-list.component';
import { AddEducatorComponent } from './educator/add-educator/add-educator.component';
import { AddCourseComponent } from './course/add-course/add-course.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { AddLessionComponent } from './lession/add-lession/add-lession.component';
import { LessionListComponent } from './lession/lession-list/lession-list.component';
import { AddExerciseComponent } from './exercise/add-exercise/add-exercise.component';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { UnitlistComponent } from './unit/unitlist/unitlist.component';
import { AddUnitComponent } from './unit/add-unit/add-unit.component';
import { AddAttachmentComponent } from './attachments/add-attachment/add-attachment.component';
import { AttachmentListComponent } from './attachments/attachment-list/attachment-list.component';
import { AddCourseEducatorMapComponent } from './course-educator-map/add-course-educator-map/add-course-educator-map.component';
import { CourseEducatorMapListComponent } from './course-educator-map/course-educator-map-list/course-educator-map-list.component';
import { LessonMappingListComponent } from './lesssonMapping/lesson-mapping-list/lesson-mapping-list.component';
import { AddLessonMappingComponent } from './lesssonMapping/add-lesson-mapping/add-lesson-mapping.component';
import { EducatorProfileComponent } from './profile/educator-profile/educator-profile.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { EducatorDashboardComponent } from './dashboard/educator-dashboard/educator-dashboard.component';
import { CategorytypeComponent } from './master/categorytype/categorytype/categorytype.component';
import { CategoriesListComponent } from './master/categories/categories-list/categories-list.component';
import { InstitueListComponent } from './master/institue/institue-list/institue-list.component';
import { SubjectListComponent } from './master/subjects/subject-list/subject-list.component';
import { QualificationsubjectComponent } from './master/qualifiaction/qualificationsubject/qualificationsubject.component';
import { LevelsComponent } from './master/qualifiaction/levels/levels.component';
import { GradesComponent } from './master/qualifiaction/grades/grades.component';
import { SkillsComponent } from './skills/skills/skills.component';
import { PublicSourceComponent } from './public-source/public-source.component';
import { GuidedVideoComponent } from './guided-video/guided-video.component';
import { TalktoadvisorlistComponent } from './talktoadvisorlist/talktoadvisorlist.component';
import { AddwowalTeamComponent } from './addwowal-team/addwowal-team.component';
import { WhyWowlComponent } from './why-wowl/why-wowl.component';
import { LandingContentComponent } from './landing-content/landing-content.component';
import { AboutPageComponent } from './master/about-page/about-page.component';
import { DeletedprofileListComponent } from './delete-profile/deletedprofile-list/deletedprofile-list.component';
import { ContactusListComponent } from './contactus/contactus-list/contactus-list.component';
import { ApplicationVersionComponent } from './application-version/application-version/application-version.component';
import { SubscriptionUserComponent } from './subscription/subscription-user/subscription-user.component';
import { AddSubscriptionComponent } from './subscription/add-subscription/add-subscription.component';
import { CourseSubscriptionComponent } from './subscription/course-subscription/course-subscription.component';
import { SubscriptionComponent } from './subscription/subscription/subscription.component';
import { AddCourseSubscriptionComponent } from './subscription/add-course-subscription/add-course-subscription.component';
import { AddPartnerComponent } from './partner/add-partner/add-partner.component';
import { PartnerListComponent } from './partner/partner-list/partner-list.component';
import { PartnerDashboardComponent } from './dashboard/partner-dashboard/partner-dashboard.component';
import { PromocodeListComponent } from './promocode/promocode-list/promocode-list.component';
import { AddPromocodeComponent } from './promocode/add-promocode/add-promocode.component';
import { UserAssignmentListComponent } from './user-assignment-details/user-assignment-list/user-assignment-list.component';
import { AssignmentDetailsComponent } from './user-assignment-details/assignment-details/assignment-details.component';
import { ReadingAssesmentListComponent } from './final-assesment/reading-assesment-list/reading-assesment-list.component';
import { AddReadingAssesmentComponent } from './final-assesment/add-reading-assesment/add-reading-assesment.component';
import { ListeningAssesmentListComponent } from './final-assesment/listening-assesment-list/listening-assesment-list.component';
import { AddListeningAssesmentComponent } from './final-assesment/add-listening-assesment/add-listening-assesment.component';
import { SpeakingAssesmentListComponent } from './final-assesment/speaking-assesment-list/speaking-assesment-list.component';
import { AddSpeakingAssesmentComponent } from './final-assesment/add-speaking-assesment/add-speaking-assesment.component';
import { UserCourseAuditComponent } from './user-course-details/user-course-audit/user-course-audit.component';
import { UserScoreComponent } from './user-course-details/user-score/user-score.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    }, {
        path: 'app', component: AdminComponent,
        children: [

            { path: 'educators', component: EducatorListComponent },
            { path: 'add-educator/:id', component: AddEducatorComponent },
            { path: 'add-course/:id', component: AddCourseComponent },
            { path: 'course-list', component: CourseListComponent },
            { path: 'add-lession/:id', component: AddLessionComponent },
            { path: 'lession-list', component: LessionListComponent },
            { path: 'add-exercise/:id', component: AddExerciseComponent },
            { path: 'exercise-list', component: ExerciseListComponent },
            { path: 'unit-list', component: UnitlistComponent },
            { path: 'add-unit/:id', component: AddUnitComponent },
            { path: 'add-attachment/:id', component: AddAttachmentComponent },
            { path: 'attachment-list', component: AttachmentListComponent },
            { path: 'add-course-educator-map/:id', component: AddCourseEducatorMapComponent },
            { path: 'course-educator-map-list', component: CourseEducatorMapListComponent },
            { path: 'lesson-mapping', component: LessonMappingListComponent },
            { path: 'add-lessonmapping/:id', component: AddLessonMappingComponent },
            { path: 'educator-profile', component: EducatorProfileComponent },
            { path: 'categorytype', component: CategorytypeComponent },
            { path: 'categories', component: CategoriesListComponent },
            { path: 'institutes', component: InstitueListComponent },
            { path: 'subjectlist', component: SubjectListComponent },
            { path: 'qualification-subject', component: QualificationsubjectComponent },
            { path: 'qualification-levels', component: LevelsComponent },
            { path: 'qualification-grade', component: GradesComponent },
            { path: 'skills', component: SkillsComponent },
            { path: 'public-source', component: PublicSourceComponent },
            { path: 'guided-video', component: GuidedVideoComponent },
            { path: 'taltoadvisor', component: TalktoadvisorlistComponent },
            { path: 'teamwowl-list', component: AddwowalTeamComponent },
            { path: 'why-wowl', component: WhyWowlComponent },
            { path: 'landing-content', component: LandingContentComponent },
            { path: 'about-page', component: AboutPageComponent },
            { path: 'delete-profile', component: DeletedprofileListComponent },
            { path: 'contact-us', component: ContactusListComponent },
            { path: 'application-version', component: ApplicationVersionComponent },
            { path: 'subscription-user', component: SubscriptionUserComponent },
            { path: 'add-subscription/:id', component: AddSubscriptionComponent },
            { path: 'subscription', component: SubscriptionComponent },
            { path: 'add-course-subscription/:id', component: AddCourseSubscriptionComponent },
            { path: 'course-subscription', component: CourseSubscriptionComponent },
            { path: 'add-Partner/:id', component: AddPartnerComponent },
            { path: 'partner-list', component: PartnerListComponent },
            { path: 'partner-dashboard', component: PartnerDashboardComponent },
            { path: 'admin-dashboard', component: AdminDashboardComponent },
            { path: 'promocode-list', component: PromocodeListComponent },
            { path: 'add-promocode/:id', component: AddPromocodeComponent },
            { path: 'user-assignment-list', component: UserAssignmentListComponent },
            { path: 'assignment-details/:id', component: AssignmentDetailsComponent },
            { path: 'reading-assesment-list', component: ReadingAssesmentListComponent },
            { path: 'add-reading-assesment/:id', component: AddReadingAssesmentComponent },
            { path: 'listening-assesment-list', component: ListeningAssesmentListComponent },
            { path: 'add-listening-assesment/:id', component: AddListeningAssesmentComponent },
            { path: 'speaking-assesment-list', component: SpeakingAssesmentListComponent },
            { path: 'add-speaking-assesment/:id', component: AddSpeakingAssesmentComponent } , 
            { path: 'user-course-audit' , component:UserCourseAuditComponent},
            { path: 'user-score/:id/:userid' , component:UserScoreComponent}

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
