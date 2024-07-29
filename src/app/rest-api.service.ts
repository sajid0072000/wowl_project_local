import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  BASE_URL = environment.BASE_URL;
  GENERATED_PDF_URL = environment.GENERATED_PDF_URL
  FILE_URL = environment.FILE_URL;
  SERVER_BASE = environment.SERVER_BASE;
  Video_URL = environment.Video_URL;
  UPLOAD_URL = environment.UPLOAD_URL;
  RZP_KEY_ID = environment.RZP_KEY_ID;
  UPLOAD_SOCKET_URL = environment.UPLOAD_SOCKET_URL;
  GENERATED_PDF_NEW=environment.GENERATED_PDF_NEW

  constructor(private http: HttpClient) {
  }

  adminLogin(data: any) {
    return this.http.post(this.BASE_URL + '/v1/login/loginCheck', data, httpOptions);
  }

  uploadFile(data: any) {
    return this.http.post(this.BASE_URL + '/v1/upload/file', data);
  }

  insertCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/insert', data, httpOptions);
  }

  updateName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/update', data, httpOptions);
  }

  deletedCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/delete', data, httpOptions);
  }

  fetchCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/fetchCategoryType', data, httpOptions);
  }

  updateHidden(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categorytype/editHidden', data, httpOptions);
  }

  searchCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categorytype/searchCategoryType', data, httpOptions);
  }

  insertCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categories/insertCategories', data, httpOptions);
  }

  updateCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categories/updateCategories', data, httpOptions);
  }

  deleteCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categories/deleteCategories', data, httpOptions);
  }

  fetchCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categories/fetchCategories', data, httpOptions);
  }

  getCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getCategories', data, httpOptions)
  }

  getCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getCategoryType', data, httpOptions);
  }

  getSubjects(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getSubjects', data, httpOptions)
  }

  getQualificationGrades(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getQualificationGrades', data, httpOptions);
  }

  getQualificationLevels(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getQualificationLevels', data, httpOptions);
  }

  getQualificationSubjects(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getQualificationSubjects', data, httpOptions);
  }

  getInstitution(data: any) {
    return this.http.post(this.BASE_URL + '/v1/master/getInstitution', data, httpOptions);
  }

  addEducator(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/addEducator', data, httpOptions);
  }

  getEducator(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/getEducator', data, httpOptions);
  }

  getEducatorById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/getEducatorById', data, httpOptions);
  }

  updateEducator(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/updateEducator', data, httpOptions);
  }

  deleteEducator(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/deleteEducator', data, httpOptions);
  }

  enableActive(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/enableActive', data, httpOptions);
  }

  enableApprove(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/enableApprove', data, httpOptions);
  }

  getCourses(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/getCourses', data, httpOptions);
  }

  addCourse(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/addCourse', data, httpOptions);
  }

  getCourseById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/getCourseById', data, httpOptions);
  }

  updateCourse(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/updateCourse', data, httpOptions);
  }

  deleteCourse(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/deleteCourse', data, httpOptions);
  }

  enableApproveCourse(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/enableApprove', data, httpOptions);
  }

  enableActiveCourse(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/enableActive', data, httpOptions);
  }

  searchCourseByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courses/searchCourseByName', data, httpOptions);
  }

  getLession(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/getLession', data, httpOptions);
  }

  addLession(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/addLession', data, httpOptions);
  }

  getLessionById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/getLessionById', data, httpOptions);
  }

  updateLession(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/updateLession', data, httpOptions);
  }

  deleteLession(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/deleteLession', data, httpOptions);
  }

  searchLessionByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/searchLessionByName', data, httpOptions);
  }

  getUnits(data: any) {
    return this.http.post(this.BASE_URL + '/v1/unit/getUnit', data, httpOptions);
  }

  getUnitById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/unit/getUnitById', data, httpOptions);
  }

  addUnit(data: any) {
    return this.http.post(this.BASE_URL + '/v1/unit/addUnit', data, httpOptions);
  }

  updateUnit(data: any) {
    return this.http.post(this.BASE_URL + '/v1/unit/updateUnit', data, httpOptions);
  }

  deleteUnit(data: any) {
    return this.http.post(this.BASE_URL + '/v1/unit/deleteUnit', data, httpOptions);
  }

  searchUnitByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/unit/searchUnitByName', data, httpOptions);
  }

  addExercise(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/addExercise', data, httpOptions);
  }

  getExercise(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/getExercise', data, httpOptions);
  }

  deleteExercise(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/deleteExercise', data, httpOptions);
  }

  updateExercise(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/updateExercise', data, httpOptions);
  }

  getExerciseById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/getExerciseById', data, httpOptions);
  }

  addAttachments(data: any) {
    return this.http.post(this.BASE_URL + '/v1/attachments/addAttachments', data, httpOptions);
  }

  getAttachments(data: any) {
    return this.http.post(this.BASE_URL + '/v1/attachments/getAttachments', data, httpOptions);
  }

  getAttachmentsById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/attachments/getAttachmentsById', data, httpOptions);
  }

  updateAttachments(data: any) {
    return this.http.post(this.BASE_URL + '/v1/attachments/updateAttachments', data, httpOptions);
  }

  deleteAttachments(data: any) {
    return this.http.post(this.BASE_URL + '/v1/attachments/deleteAttachments', data, httpOptions);
  }

  searchEducatorByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/educator/searchEducatorByName', data, httpOptions);
  }

  addCourseEducatorMap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courseeducatormap/addCourseEducatorMap', data, httpOptions);
  }

  updateCourseEducatorMap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courseeducatormap/updateCourseEducatorMap', data, httpOptions);
  }

  deleteCourseEducatorMap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courseeducatormap/deleteCourseEducatorMap', data, httpOptions);
  }

  getCourseEducatorMapById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courseeducatormap/getCourseEducatorMapById', data, httpOptions);
  }

  getCourseEducatorMap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/courseeducatormap/getCourseEducatorMap', data, httpOptions);
  }

  getLessionmap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lessionmap/getLessionmap', data, httpOptions);
  }

  getLessionmapById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lessionmap/getLessionmapById', data, httpOptions);
  }

  addLessionmap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lessionmap/addLessionmap', data, httpOptions);
  }

  updateLessionmap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lessionmap/updateLessionmap', data, httpOptions);
  }

  deleteLessionmap(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lessionmap/deleteLessionmap', data, httpOptions);
  }

  searchExerciseByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/searchExerciseByName', data, httpOptions);
  }

  getUserDetails(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/getUserDetails', data, httpOptions);
  }

  addCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/insertCategoryId', data, httpOptions);
  }

  updateCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/updateName', data, httpOptions);
  }

  deleteCategoryType(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categoryType/deletedCategories', data, httpOptions);
  }

  fetchQualificationSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/QualificationSubjects/fetchQualificationSubjects', data, httpOptions);
  }

  addQualificationSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/QualificationSubjects/insertQualificationSubjects', data, httpOptions);
  }

  updateQaulificationSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/QualificationSubjects/updateQulaificationSubjects', data, httpOptions);
  }

  deleteQualificationSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/QualificationSubjects/deletedQualificationSubjects', data, httpOptions);
  }

  fetchQualificationLevel(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationLevels/fetchQualificationLevels', data, httpOptions);
  }

  addQualificationLevel(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationLevels/insertQualificationLevels', data, httpOptions);
  }

  updateQualificationLevel(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationLevels/updateQualificationLevels', data, httpOptions);
  }

  deleteQualificationLevel(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationLevels/deletedQualificationLevels', data, httpOptions);
  }

  fetchQualificationGrade(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationGrades/fetchQualificationGrades', data, httpOptions);
  }

  addQualificationGrade(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationGrades/insertQualificationGrades', data, httpOptions);
  }

  updateQualificationGrade(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationGrades/updationQualificationGrades', data, httpOptions);
  }

  deleteQualificationGrade(data: any) {
    return this.http.post(this.BASE_URL + '/v1/qualificationGrades/deletQualificationGrades', data, httpOptions);
  }

  addCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categories/insertCategories', data, httpOptions);
  }

  fetchSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subject/fetchSubjects', data, httpOptions);
  }

  insertSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subject/insertSubjects', data, httpOptions);
  }

  updateSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subject/updateSubjectDtl', data, httpOptions);
  }

  deleteSubject(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subject/deletedSubjects', data, httpOptions);
  }

  fetchInstitue(data: any) {
    return this.http.post(this.BASE_URL + '/v1/institutions/fetchInstitutionsDtl', data, httpOptions);
  }

  inserInstitue(data: any) {
    return this.http.post(this.BASE_URL + '/v1/institutions/insertInstitutionsDtl', data, httpOptions)
  }

  updateInstitue(data: any) {
    return this.http.post(this.BASE_URL + '/v1/institutions/updateInstitutionsDtl', data, httpOptions)
  }

  deleteInstitue(data: any) {
    return this.http.post(this.BASE_URL + '/v1/institutions/deleteInstitutionsDtl', data, httpOptions)
  }

  addToCart(data: any) {
    return this.http.post(this.BASE_URL + '/v1/cart/addToCart', data, httpOptions)
  }

  getCart(data: any) {
    return this.http.post(this.BASE_URL + '/v1/cart/getCart', data, httpOptions)
  }

  deleteCart(data: any) {
    return this.http.post(this.BASE_URL + '/v1/cart/deleteCart', data, httpOptions)
  }

  courseDetailsOnboarding(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/courseDetails', data, httpOptions)
  }

  getPopularCourses(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getPopularCourses', data, httpOptions)
  }

  searchCourse(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/searchCourse', data, httpOptions)
  }

  getFeaturedCourses(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getFeaturedCourses', data, httpOptions)
  }

  getRecentAddedCourses(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getRecentAddedCourses', data, httpOptions)
  }

  getTopCategories(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getTopCategories', data, httpOptions)
  }

  addSkill(data: any) {
    return this.http.post(this.BASE_URL + '/v1/skillList/addSkill', data, httpOptions)
  }

  updateSkill(data: any) {
    return this.http.post(this.BASE_URL + '/v1/skillList/updateSkill', data, httpOptions)
  }

  getSkills(data: any) {
    return this.http.post(this.BASE_URL + '/v1/skillList/getSkills', data, httpOptions)
  }

  deleteSkill(data: any) {
    return this.http.post(this.BASE_URL + '/v1/skillList/deleteSkill', data, httpOptions)
  }

  enableActiveSkill(data: any) {
    return this.http.post(this.BASE_URL + '/v1/skillList/enableActive', data, httpOptions)
  }

  searchSkillByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/skillList/searchSkillByName', data, httpOptions)
  }

  searchSubjectsByName(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subject/searchSubjectsByName', data, httpOptions)
  }

  getCategoryTypeById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/categorytype/getCategoryTypeById', data, httpOptions)
  }

  startModule(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/startModule', data, httpOptions)
  }

  updatePublicSource(data: any) {
    return this.http.post(this.BASE_URL + '/v1/publicsource/updatePublicSource', data, httpOptions)
  }

  getPublicSource(data: any) {
    return this.http.post(this.BASE_URL + '/v1/publicsource/getPublicSource', data, httpOptions)
  }

  getCategoryTypeAndCourses(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getCategoryTypeAndCourses', data, httpOptions)
  }

  getCategoryTypesById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getCategoryTypesById', data, httpOptions)
  }

  getEducatorList(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getEducatorList', data, httpOptions)
  }

  getTotalCourseDetails(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getTotalCourseDetails', data, httpOptions)
  }

  getLessionsByCourseId(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getLessionsByCourseId', data, httpOptions)
  }

  getLessionMapV2(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getLessionMapV2', data, httpOptions)
  }

  getUnitsExceptCurrentOne(data: any) {
    return this.http.post(this.BASE_URL + '/v1/lession/getUnitsExceptCurrentOne', data, httpOptions)
  }

  getEducatorProfile(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getEducatorProfile', data, httpOptions)
  }

  userSignUp(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/userSignUp', data, httpOptions)
  }

  userSignUpv2(data: any) {
    return this.http.post(this.BASE_URL + '/v2/user/userSignUp', data, httpOptions)
  }

  updateUserDetail(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/updateUserDetail', data, httpOptions)
  }

  userSignIn(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/userSignIn', data, httpOptions)
  }

  userVerification(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/userVerification', data, httpOptions)
  }

  userVerificationv2(data: any) {
    return this.http.post(this.BASE_URL + '/v2/user/userVerification', data, httpOptions)
  }

  resendOtp(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/resendOtp', data, httpOptions)
  }

  resendOtpv2(data: any) {
    return this.http.post(this.BASE_URL + '/v2/user/resendOtp', data, httpOptions)
  }

  fetchUserDetail(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/fetchUserDetail', data, httpOptions)
  }

  getGuidedVideo(data: any) {
    return this.http.post(this.BASE_URL + '/v1/guidedvideo/getGuidedVideo', data, httpOptions)
  }

  updateGuidedVideo(data: any) {
    return this.http.post(this.BASE_URL + '/v1/guidedvideo/updateGuidedVideo', data, httpOptions);
  }

  getCountry(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getCountry', data, httpOptions);
  }

  getEducation(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getEducation', data, httpOptions);
  }

  getOccupation(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getOccupation', data, httpOptions);
  }

  LiveCourseRequest(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/liveCourseRequest', data, httpOptions);
  }

  checkAnswer(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/checkAnswer', data, httpOptions);
  }

  fetchSubscriptionplan(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/fetchsp', data, httpOptions);
  }

  checkSubscriptionPlanofuser(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/checkspbu', data, httpOptions);
  }

  toverifypromoCode(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/verifyPromo', data, httpOptions);
  }

  generateOrderId(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/generateOrderId', data, httpOptions);
  }

  updatePaymentStatus(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/updatePaymentStatus', data, httpOptions);
  }
  updateFreePaymentStatus(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/updateFreePaymentStatus', data, httpOptions);
  }

  selfAssessmentSummary(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/selfAssessmentSummary', data, httpOptions);
  }

  updateSelfAssessmentSummary(data: any) {
    return this.http.post(this.BASE_URL + '/v1/exercise/updateSelfAssessmentSummary', data, httpOptions);
  }

  deleteUser(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/deleteUser', data, httpOptions);
  }

  getNotification(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/getNotification', data, httpOptions);
  }

  getTalktoadvisor(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getLiveCourseRequestDetails', data, httpOptions);
  }

  getSubscriptiondetails(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getSubscriptionDetails', data, httpOptions);
  }

  deleteProfileRequest(data: any) {
    return this.http.post(this.BASE_URL + '/v1/deleteprofilerequest/deleteProfileRequest', data, httpOptions);
  }

  addTeamwowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/teamwowl/addTeamwowl', data, httpOptions);
  }

  getTeamwowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/teamwowl/getTeamwowl', data, httpOptions);
  }
  updateTeamwowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/teamwowl/updateTeamwowl', data, httpOptions);
  }

  deleteTeamwowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/teamwowl/deleteTeamwowl', data, httpOptions);
  }

  // why wowl
  addWhyWowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/whywowl/addWhyWowl', data, httpOptions);
  }
  updateWhyWowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/whywowl/updateWhyWowl', data, httpOptions);
  }

  getWhyWowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/whywowl/getWhyWowl', data, httpOptions);
  }

  getWhyWowlById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/whywowl/getWhyWowlById', data, httpOptions);
  }
  deleteWhyWowl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/whywowl/deleteWhyWowl', data, httpOptions);
  }

  // landing content
  updateLandingContent(data: any) {
    return this.http.post(this.BASE_URL + '/v1/landingcontent/updateLandingContent', data, httpOptions);
  }

  getLandingContent(data: any) {
    return this.http.post(this.BASE_URL + '/v1/landingcontent/getLandingContent', data, httpOptions);
  }

  getLandingContentById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/landingcontent/getLandingContentById', data, httpOptions);
  }

  addContactUs(data: any) {
    return this.http.post(this.BASE_URL + '/v1/contactus/addContactUs', data, httpOptions);
  }

  getExerciseQuestionsAndOptions(data: any) {
    return this.http.post(this.BASE_URL + '/v1/onboarding/getExerciseQuestionsAndOptions', data, httpOptions);
  }

  getAbout(data: any) {
    return this.http.post(this.BASE_URL + '/v1/about/getAbout', data, httpOptions);
  }
  updateAbout(data: any) {
    return this.http.post(this.BASE_URL + '/v1/about/updateAbout', data, httpOptions);
  }
  getDeleteProfiles(data: any) {
    return this.http.post(this.BASE_URL + '/v1/deleteprofilerequest/getDeleteProfiles', data, httpOptions);
  }

  getContactUsDetails(data: any) {
    return this.http.post(this.BASE_URL + '/v1/contactus/getContactUsDetails', data, httpOptions);
  }

  applicationversionupdate(data: any) {
    return this.http.post(this.BASE_URL + '/v1/applicationversion/update', data, httpOptions);
  }

  applicationversiongetall(data: any) {
    return this.http.post(this.BASE_URL + '/v1/applicationversion/get-all', data, httpOptions);
  }

  applicationversiongetbyid(data: any) {
    return this.http.post(this.BASE_URL + '/v1/applicationversion/get-by-id', data, httpOptions);
  }

  applicationversionadd(data: any) {
    return this.http.post(this.BASE_URL + '/v1/applicationversion/add', data, httpOptions);
  }

  applicationversiongetAppVersionDtl(data: any) {
    return this.http.post(this.BASE_URL + '/v1/applicationversion/getAppVersionDtl', data, httpOptions);
  }

  addCourseSubscription(data: any) {
    return this.http.post(this.BASE_URL + '/v1/coursesubscription/addCourseSubscription', data, httpOptions);
  }

  updateCourseSubscription(data: any) {
    return this.http.post(this.BASE_URL + '/v1/coursesubscription/updateCourseSubscription', data, httpOptions);
  }

  getCourseSubscriptionById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/coursesubscription/getCourseSubscriptionById', data, httpOptions);
  }

  getCourseSubscription(data: any) {
    return this.http.post(this.BASE_URL + '/v1/coursesubscription/getCourseSubscription', data, httpOptions);
  }

  deleteCourseSubscription(data: any) {
    return this.http.post(this.BASE_URL + '/v1/coursesubscription/deleteCourseSubscription', data, httpOptions);
  }

  addSubscriptionPlan(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscriptionplan/addSubscriptionPlan', data, httpOptions);
  }

  updateSubscriptionPlan(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscriptionplan/updateSubscriptionPlan', data, httpOptions);
  }

  getAllSubscriptionPlans(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscriptionplan/getAllSubscriptionPlans', data, httpOptions);
  }

  deleteSubscriptionPlan(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscriptionplan/deleteSubscriptionPlan', data, httpOptions);
  }

  getSubscriptionPlanById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscriptionplan/getSubscriptionPlanById', data, httpOptions);
  }

  logout(data: any) {
    return this.http.post(this.BASE_URL + '/v1/user/logout', data, httpOptions);
  }

  endSubscription(data: any) {
    return this.http.post(this.BASE_URL + '/v1/subscription/endSubscription', data, httpOptions);
  }

  addPartner(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/addPartner', data, httpOptions);
  }

  updatePartner(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/updatePartner', data, httpOptions);
  }

  getPartnerById(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/getPartnerById', data, httpOptions);
  }

  getPartners(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/getPartners', data, httpOptions);
  }

  deletePartner(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/deletePartner', data, httpOptions);
  }

  // Alay

  partnerDashBoardForAdmin(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/partnerDashboardAdminPanel', data, httpOptions);
  }
  getPartnersBySearch(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/getPartnersDashboard', data, httpOptions);
  }
  partnerDashBoardCount(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/partnerDashboardCountAndAmount', data, httpOptions);
  }
  partnerDashboardIndividual(data: any) {
    return this.http.post(this.BASE_URL + '/v1/partner/partnerDashboardIndividual', data, httpOptions);
  }


  // Promocode

  addPromocode(data : any){
    return this.http.post(this.BASE_URL + '/v1/promocode/addPromocode', data, httpOptions);
  }
  updatePromocode(data : any){
    return this.http.post(this.BASE_URL + '/v1/promocode/updatePromocode', data, httpOptions);
  }
  getAllPromocode(data:any){
    return this.http.post(this.BASE_URL + '/v1/promocode/getPromocode', data, httpOptions);
  }
  deletePromocode(data:any){
    return this.http.post(this.BASE_URL + '/v1/promocode/deletePromocode', data, httpOptions);
  }

  getsubcriptionHistory(data:any){
    return this.http.post(this.BASE_URL + '/v1/subscription/getSubscriptionHistory', data, httpOptions);
  }

  // 
  getUserAssementDetails(data:any){
    return this.http.post(this.BASE_URL + '/v1/assessmentdetails/listUserAttempts', data, httpOptions);
  }
  getAssessmentDetailsByAttemptid(data:any){
    return this.http.post(this.BASE_URL + '/v1/assessmentdetails/listUserAttemptDetails', data, httpOptions);
  }

  getUserList(data:any){
    return this.http.post(this.BASE_URL + '/v1/user/getAllUsers', data, httpOptions);
  }

  talkToAdvExl(data:any){
    return this.http.post(this.BASE_URL + '/v1/excelgenerate/talkToAdvExl', data, httpOptions);
  }

  contactUsExl(data:any){
    return this.http.post(this.BASE_URL + '/v1/excelgenerate/contactUsExl', data, httpOptions);
  }

  assmntSheetExl(data:any){
    return this.http.post(this.BASE_URL + '/v1/excelgenerate/assmntSheetExl', data, httpOptions);
  }

  subscriptionExl(data:any){
    return this.http.post(this.BASE_URL + '/v1/excelgenerate/subscriptionExl', data, httpOptions);
  }

  assmntDtlPdf(data:any){
    return this.http.post(this.BASE_URL + '/v1/assessmentdetails/assmntDtlPdf', data, httpOptions);
  }

  getVideoDuration(data:any){
    return this.http.post(this.BASE_URL + '/v1/userstatistic/getVideoDuration', data, httpOptions);
  }

  addStatistic(data:any){
    return this.http.post(this.BASE_URL + '/v1/userstatistic/addStatistic', data, httpOptions);
  }

  // final-assesment

  createFinalAssesment(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/createFinalAssesmentQuestion', data, httpOptions);
  }
  getAllAssesmentsbyType(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/getAllAssesmentsbyType', data, httpOptions);
  }
  getAssementDetailsById(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/getAssementDetailsById', data, httpOptions);
  }
  updateFinalAssesmentQuestion(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/updateFinalAssesmentQuestion', data, httpOptions);
  }
  deleteAssesment(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/deleteAssesment', data, httpOptions);
  }
  getFinalAssesmentByCourseId(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/getFinalAssesmentByCourseId', data, httpOptions);
  }

  submitAssesment(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/submitAssesment', data, httpOptions);
  }
  finalAssessmentSummary(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/finalAssessmentSummary', data, httpOptions);
  }
  // 
  userCourseAuditList(data:any){
    return this.http.post(this.BASE_URL + '/v1/usercourseaudit/userlist', data, httpOptions);
  }
  userScoreDetails(data:any){
    return this.http.post(this.BASE_URL + '/v1/usercourseaudit/userScoreDetails' , data , httpOptions);
  }
  getAllowedCountries(){
    return this.http.get(this.BASE_URL + '/v1/user/getAllowedCountries', httpOptions);
  }

  lessonAssementComplete(data:any){
    return this.http.post(this.BASE_URL + '/v1/onboarding/lessonAssementComplete', data, httpOptions)
  }

  getProgressPercent(data:any){
    return this.http.post(this.BASE_URL + '/v1/onboarding/getProgressPercent', data, httpOptions)
  }

  updateSpentForLession(data:any){
    return this.http.post(this.BASE_URL + '/v1/exercise/updateSpentForLession', data, httpOptions)
  }

  getCertificate(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/getCertificate', data, httpOptions)
  }

  fetchCertificateForUser(data:any){
    return this.http.post(this.BASE_URL + '/v1/finalassesment/fetchCertificateForUser', data, httpOptions)
  }

}
