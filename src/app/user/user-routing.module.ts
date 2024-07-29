import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { HeaderComponent } from './header/header.component';
import { WowlUegComponent } from './wowl-ueg/wowl-ueg.component';
import { CourselessonComponent } from './courselesson/courselesson.component';
import { LanguageComponent } from './language/language.component';
import { EducatorComponent } from './educator/educator.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { AllEducatorsComponent } from './all-educators/all-educators.component';
import { ProfileComponent } from './profile/profile.component';
import { AdditionalLearningComponent } from './additional-learning/additional-learning.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CancellationRefundComponent } from './cancellation-refund/cancellation-refund.component';
import { DigitalSafeguardingComponent } from './digital-safeguarding/digital-safeguarding.component';
import { FinalAssesmentComponent } from './final-assesment/final-assesment.component';
import { CertificateComponent } from './certificate/certificate.component';



const routes: Routes = [
  { path: '', component: IndexComponent },
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: 'language/:id', component: LanguageComponent },
      { path: 'educator/:id', component: EducatorComponent },
      { path: 'course-details/:id/:isLive', component: CourseDetailsComponent },
      { path: 'wowl-ueg/:id', component: WowlUegComponent },
      { path: 'course-lesson/:id', component: CourselessonComponent },
      { path: 'all-eductors', component: AllEducatorsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'additionalLearning/:id', component: AdditionalLearningComponent },
      { path: 'delete-user', component: DeleteUserComponent },
      { path: 'term-condition', component: TermConditionComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'cancellation-and-refund', component: CancellationRefundComponent },
      { path: 'digital-safeguarding', component: DigitalSafeguardingComponent },
      { path: 'final-assesment/:id' , component:FinalAssesmentComponent},
      {path:'certificate',component:CertificateComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class UserRoutingModule { }
