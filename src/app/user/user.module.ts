import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {PlyrModule} from 'ngx-plyr';


import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {IndexComponent} from './index/index.component';
import {FooterComponent} from './footer/footer.component';
import {WowlUegComponent} from './wowl-ueg/wowl-ueg.component';
import {HeaderComponent} from './header/header.component';

import {CourselessonComponent} from './courselesson/courselesson.component';
import {LanguageComponent} from './language/language.component';
import {EducatorComponent} from './educator/educator.component';
import {CourseDetailsComponent} from './course-details/course-details.component';
import {AllEducatorsComponent} from './all-educators/all-educators.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {FormsModule} from '@angular/forms';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {ProfileComponent} from './profile/profile.component';
import {AdditionalLearningComponent} from './additional-learning/additional-learning.component';
import {SubscriptionComponent} from './subscription/subscription.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SubscriptionSuccessComponent} from './subscription-success/subscription-success.component';

import {MatBadgeModule} from '@angular/material/badge';
import {ComingSoonComponent} from './coming-soon/coming-soon.component';
import {DeleteUserComponent} from './delete-user/delete-user.component';
import {TermConditionComponent} from './term-condition/term-condition.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {DigitalSafeguardingComponent} from './digital-safeguarding/digital-safeguarding.component';
import {CancellationRefundComponent} from './cancellation-refund/cancellation-refund.component';
import {LanguagePopupComponent} from './language-popup/language-popup.component';
import {LeavingMidwayComponent} from './leaving-midway/leaving-midway.component';
import {MatCardModule} from '@angular/material/card';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { FinalAssesmentComponent } from './final-assesment/final-assesment.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import { CertificateComponent } from './certificate/certificate.component';


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
    UserComponent,
    IndexComponent,
    FooterComponent,
    WowlUegComponent,
    HeaderComponent,

    CourselessonComponent,
    LanguageComponent,
    EducatorComponent,
    CourseDetailsComponent,
    AllEducatorsComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    AdditionalLearningComponent,
    SubscriptionComponent,
    SubscriptionSuccessComponent,
    ComingSoonComponent,
    DeleteUserComponent,
    TermConditionComponent,
    PrivacyPolicyComponent,
    DigitalSafeguardingComponent,
    CancellationRefundComponent,
    LanguagePopupComponent,
    LeavingMidwayComponent,
    VideoPlayerComponent,
    FinalAssesmentComponent,
    CertificateComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    MatBadgeModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      "showInnerStroke": false,

    }),
    MatCardModule,
    MatProgressBarModule,
    MatIconModule
    // PlyrModule

  ]
})
export class UserModule {
}
