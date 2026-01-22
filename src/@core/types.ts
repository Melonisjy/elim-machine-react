// React Imports
import type { ReactNode } from 'react'

import type { StatusType } from '@/types/apps/chatTypes'

export type Layout = 'vertical' | 'collapsed' | 'horizontal'

export type Skin = 'default' | 'bordered'

export type Mode = 'system' | 'light' | 'dark'

export type SystemMode = 'light' | 'dark'

export type Direction = 'ltr' | 'rtl'

export type LayoutComponentWidth = 'compact' | 'wide'

export type LayoutComponentPosition = 'fixed' | 'static'

export type ChildrenType = {
  children: ReactNode
}

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

/* -------------------------- BasicTableHeader Type -------------------------- */
// tabler header column별 정보
export interface HeaderInfoType {
  label: string
  canSort: boolean
  hideOnTablet?: boolean
  width?: string | number
}

// table header 정보
export type HeaderType<T> = Partial<Record<keyof T, HeaderInfoType>>

export interface tableHeaderInfoType {
  member: HeaderType<MemberPageDtoType>
  user: HeaderType<UserDtoType>
  machineProject: HeaderType<MachineProjectPageDtoType>
  safetyProject: HeaderType<SafetyProjectPageResponseDtoType>
  machineInspection: HeaderType<MachineInspectionPageResponseDtoType>
  engineers: HeaderType<MachineEngineerPageResponseDtoType>
  licenses: HeaderType<LicensePageResponseDtoType>
  loginLog: HeaderType<LoginLogDtoType>
}

/* -------------------------- InputInfo Type -------------------------- */
export type InputFieldType = {
  type: InputType
  label: string
  options?: Array<{ value: string; label: string }>
  size?: BoxSizeType
  disabled?: boolean
}

export type BoxSizeType = 'sm' | 'md' | 'lg'
export type InputType = 'multi' | 'yn' | 'text' | 'number' | 'date' | 'long text' | 'juminNum' | 'map'

type InputInfoType<T> = Partial<Record<keyof T, InputFieldType>>

// member 인풋 정보 형식
export type memberInputInfoType = {
  basic: InputInfoType<MemberBasicDtoType>
  privacy: InputInfoType<MemberPrivacyDtoType>
  office: InputInfoType<MemberOfficeDtoType>
  career: InputInfoType<MemberCareerDtoType>
  etc: InputInfoType<MemberEtcDtoType>
}

// php
export type userInputInfoType = {
  basic: InputInfoType<UserBasicDtoType>
  privacy: InputInfoType<UserPrivacyDtoType>
  office: InputInfoType<UserOfficeDtoType>
  career: Omit<InputInfoType<UserCareerDtoType>, 'preJoinExperienceMonth'> & {
    preJoinExperienceMonth?: {
      industrySameMonth?: InputFieldType
      industryOtherMonth?: InputFieldType
    }
  }
  etc: Omit<InputInfoType<UserEtcDtoType>, 'benefits' | 'incomeTaxReduction'> & {
    benefits?: {
      youthJobLeap?: InputFieldType
      youthEmploymentIncentive?: InputFieldType
      youthDigital?: InputFieldType
      seniorInternship?: InputFieldType
      newMiddleAgedJobs?: InputFieldType
    }
    incomeTaxReduction?: {
      beginDate?: InputFieldType
      endDate?: InputFieldType
      employedType?: InputFieldType
      militaryPeriod?: InputFieldType
    }
    registeredAt?: InputFieldType
    lastLoginAt?: InputFieldType
  }
}

// machine-projects/[id] 인풋 정보 형식
export type machineProjectInputInfoType = InputInfoType<MachineProjectResponseDtoType>

// machine-projects/[id]/schedule_tab 인풋 정보 형식
export type machineScheduleInputInfoType = InputInfoType<MachineProjectScheduleAndEngineerResponseDtoType>

// machine-projects/[id]/machine-project-engineers 인풋 정보 형식
export type machineProjectEngineerInputInfoType = InputInfoType<machineProjectEngineerDetailDtoType>

// safety/projects/

// engineers/[id] 인풋 정보 형식
export type engineerInputInfoType = InputInfoType<EngineerResponseDtoType>

// licenses/[id] 인풋 정보 형식
export type licenseInputInfoType = InputInfoType<LicenseResponseDtoType>

/* -------------------------- Dto Type -------------------------- */
// -------- 캘린더 ----------
export interface CalendarEventResponseDtoType {
  id: number
  type: string
  name: string
  colorCode: string
}

// -------- 직원관리 --------
// POST api/members (필수: role)
export interface MemberCreateRequestDtoType {
  licenseName: string
  name: string

  // role: string
  memberStatus: string
  email: string
  note: string
}

export interface UserCreateRequestDtoType {
  licenseName: string
  name: string

  // role: string
  userStatus: string
  email: string
  note: string
}

// GET api/members (리스트)
export type MemberPageDtoType = {
  memberId: number
  version: number
  roleDescription: string
  name: string
  staffNum: string
  companyName: string
  officeDepartmentName: string
  officePositionDescription: string
  age: number
  email: string
  phoneNumber: string
  joinDate: string
  careerYear: number
  memberStatusDescription: string
  genderDescription: string
}

// GET /api/web/audit/users (유저리스트 조회)
export type UserDtoType = {
  no: number,
  userSeq: number,
  role: string,
  name: string,
  staffNum: string,
  licenseName: string,
  department: string,
  position: string,
  age: number,
  email: string,
  mobile: string,
  engineerYn: string,
  joinDate: string,
  careerYear: number,
  status: string,
}

export type UserResponseDtoType = {
  items: UserDtoType[],
  total: number,
  page: number,
  size: number,
}

// GET /api/web/users/{userId}
export type UserDetailResponseDtoType = {
  userId: number
  userBasicResponseDto: UserBasicDtoType
  userCareerResponseDto: UserCareerDtoType
  userEtcResponseDto: UserEtcDtoType
  userOfficeResponseDto: UserOfficeDtoType
  userPrivacyResponseDto: UserPrivacyDtoType
}

export type PermissionKey =
  | 'customer_menu'
  | 'customer_detail'
  | 'fms_id_manage'
  | 'contract_menu'
  | 'counseling_menu'
  | 'income_view'

export interface UserBasicDtoType {
  licenseName: string
  name: string
  role: string
  status: string
  email: string
  avatarFileName: string
  remark: string
  permission: Record<PermissionKey, ynResultType>
}

export interface UserPrivacyDtoType {
  nationality: string
  juminNum: string
  birthday: string
  phoneNumber: string
  emergency1: string
  emergency2: string | null
  address: string
  educationLevel: string
  educationMajor: string
  familyCnt: number
  carOwned: ynResultType
  carNumber: string
  suwonCarReg: number
  carModel: string
  religion: string
  bankName: string
  bankNumber: string
}

export interface UserOfficeDtoType {
  staffNum: string
  department: string
  team: string
  task: string
  position: string
  contractType: string
  apprentice: string
  workForm: string
  laborForm: string
  joinDate: string
  resignDate: string | null
  insurancesAcquisitionDate: string
  insurancesLossDate: string | null
  years: number
  contractYn: ynResultType
  staffCardYn: ynResultType
  fieldworkYn: ynResultType
}

export interface UserCareerDtoType {
  jobField: string
  jobGrade: string
  certNum1: string
  certNum2: string
  preJoinExperienceMonth: {
    industrySameMonth: number
    industryOtherMonth: number
  }
}

export type BenefitKey =
  | 'youthJobLeap'
  | 'youthEmploymentIncentive'
  | 'youthDigital'
  | 'seniorInternship'
  | 'newMiddleAgedJobs'

export interface UserEtcDtoType {
  benefits: Record<BenefitKey, string>
  incomeTaxReduction: {
    beginDate: string
    endDate: string
    employedType: string
    militaryPeriod: string
  }
  registeredAt: string
  lastLoginAt: string
}

// export type MemberLookupResponseDtoType = {
//   memberId: number
//   email: string
//   name: string
// }

// // 직원관리 필터
// export interface MemberFilterType {
//   companyName: string
//   officeDepartmentName: string
//   officePosition: string
//   memberStatus: string
//   careerYear: string
//   contractType: string
//   laborForm: string
//   workForm: string
//   gender: genderType
//   foreignYn: string
//   birthMonth: string
// }


// ---------------------------------------------

// GET api/members/[memberId]
export type MemberDetailResponseDtoType = {
  memberBasicResponseDto: MemberBasicDtoType
  memberCareerResponseDto: MemberCareerDtoType
  memberEtcResponseDto: MemberEtcDtoType
  memberOfficeResponseDto: MemberOfficeDtoType
  memberPrivacyResponseDto: MemberPrivacyDtoType
}

export interface MemberBasicDtoType {
  memberId: number
  version: number
  companyName: string
  name: string
  memberStatus: memberStatusType
  email: string
  s3Key: string
  note: string
}

export interface MemberPrivacyDtoType {
  memberId: number
  version: number
  foreignYn: ynResultType
  juminNum: string
  birthday: string
  phoneNumber: string
  emerNum1: string
  emerNum2: string
  roadAddress: string | null
  jibunAddress: string | null
  detailAddress: string | null
  educationLevel: string
  educationMajor: string
  familyCnt: number
  carYn: ynResultType
  carNumber: string
  religion: string
  bankName: string
  bankNumber: string
}

export interface MemberOfficeDtoType {
  memberId: number
  version: number
  staffNum: string
  officeDepartmentId: number
  officeDepartmentName: string
  officePosition: officePositionType
  contractType: contractTypeType
  apprentice: string
  workForm: workFormType
  laborForm: laborFormType
  contractYn: ynResultType
  staffCardYn: ynResultType
  fieldworkYn: ynResultType
  joinDate: string
  resignDate: string | null
  insuranceAcquisitionDate: string
  insuranceLostDate: string | null
  groupInsuranceYn: ynResultType
}

export interface MemberCareerDtoType {
  memberId: number
  grade: gradeType
  version: number
  jobField: string
  licenseName1: string
  licenseName2: string
  industrySameMonth: number
  industryOtherMonth: number
}
export interface MemberEtcDtoType {
  memberId: number
  version: number
  youthJobLeap: string
  youthEmploymentIncentive: string
  youthDigital: string
  seniorInternship: string
  newMiddleAgedJobs: string
  incomeTaxReducedBeginDate: string
  incomeTaxReducedEndDate: string
  employedType: string
  militaryPeriod: string
}

export type MemberLookupResponseDtoType = {
  memberId: number
  email: string
  name: string
}

// 직원관리 필터
export interface MemberFilterType {
  licenseName: string
  department: string
  position: string
  status: string
  careerYear: string
  contractType: string
  laborForm: string
  workForm: string
  gender: genderType
  nationality: string
  birthMonth: string
  region: string
}

// ----------- 기계설비현장 (Machine Project) -----------
// POST api/machine-projects
export interface MachineProjectCreateRequestDtoType {
  companyName: string
  machineProjectName: string
  beginDate: string
  endDate: string
  fieldBeginDate: string
  fieldEndDate: string
  note: string
}

// GET api/machine-projects (리스트)
export interface MachineProjectPageDtoType {
  machineProjectId: number
  version: number
  projectStatusDescription: string
  region: string
  machineProjectName: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  inspectionCount: number
  companyName: string
  grossArea: number
  tel: string
  engineerNames: string[]
}

// GET api/machine-projects/[machineProjectId] : 현장정보 조회
export type MachineProjectResponseDtoType = {
  roadAddress: string | null
  detailAddress: string | null
  bizno: string | null
  completeDate: string | null
  contractDate: string | null
  contractManager: string | null
  contractManagerEmail: string | null
  contractManagerTel: string | null
  contractPartner: string | null
  contractPartnerEmail: string | null
  contractPartnerTel: string | null
  contractPrice: number | null
  companyName: string | null
  grossArea: number | null
  houseCnt: number | null
  institutionName: string | null
  machineProjectName: string
  machineMaintainer1Info: string | null
  machineMaintainer1Name: string | null
  machineMaintainer2Info: string | null
  machineMaintainer2Name: string | null
  machineMaintainer3Info: string | null
  machineMaintainer3Name: string | null
  machineManager1Info: string | null
  machineManager1Name: string | null
  machineManager2Info: string | null
  machineManager2Name: string | null
  machineManager3Info: string | null
  machineManager3Name: string | null
  manager: string | null
  managerPhone: string | null
  projectStatus: projectStatusType | null
  projectStatusDescription: string | null
  purpose: string | null
  representative: string | null
  requirement: string | null
  structure: string | null
  tel: string | null
  vatIncludedYn: ynResultType | null
  version: number | null
  note: string | null
}

// GET /api/machine-projects/{machineProjectId}/schedule-tab : 일정 및 기술진 DTO
export type MachineProjectScheduleAndEngineerResponseDtoType = {
  machineProjectScheduleId: number
  version: number
  beginDate: string
  endDate: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  projectEndDate: string
  checkType: string
  checkTypeDescription: string
  buildingGrade: buildingGradeType
  buildingGradeDescription: string
  reportManagerEmail: string
  tiIssueDate: string
  engineers: machineProjectEngineerDetailDtoType[]
}

// 엔지니어 정보
export interface machineProjectEngineerDetailDtoType {
  engineerId: number
  engineerName: string
  grade: gradeType | ''
  gradeDescription: string
  engineerLicenseNum: string
  beginDate: string
  endDate: string
  note: string
}

// 기계설비현장 필터
export interface MachineProjectFilterType {
  projectStatus: projectStatusType
  companyName: string
  engineerName: string
}

// PUT api/machine-projects-[id]/machine-project-engineers 기계설비 프로젝트 참여 기술진 수정 요청 DTO
export interface MachineProjectEngineerUpdateRequestDtoType {
  engineerId: number
  beginDate: string
  endDate: string
  note: string
}

// PUT /api/machine-projects/{machineProjectId}/schedule 기계설비 프로젝트 점검 일정 수정 요청 DTO

export interface MachineProjectScheduleUpdateRequestDtoType {
  version: number
  beginDate: string
  endDate: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  projectEndDate: string
  checkType: checkTypeType
  buildingGrade: buildingGradeType
  reportManagerEmail: string
  tiIssueDate: string
}

export type MachineProjectScheduleUpdateResponseDtoType = MachineProjectScheduleUpdateRequestDtoType & {
  machineProjectScheduleId: number
  buildingGradeDescription: string
  checkTypeDescription: string
}

// ----------- 안전진단현장 (Safety Project) -----------
// GET /api/safety/projects
export interface SafetyProjectPageResponseDtoType {
  safetyProjectId: number
  version: number
  projectStatusDescription: string
  safetyInspectionTypeDescription: string
  region: string
  buildingName: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  facilityClassificationDescription: string
  facilityClassDescription: string
  companyName: string
  grossArea: string
  engineerNames: string[]
}

// 안전진단현장 필터
export interface SafetyProjectFilterType {
  projectStatus: projectStatusType
  companyName: string
  engineerName: string
}

// POST api/safety/projects
export interface SafetyProjectCreateRequestDtoType {
  companyName: string
  safetyInspectionType: safetyInspectionTypeType
  buildingName: string
  uniqueNo: string | null
  facilityNo: string | null
  buildingId: string | null
  beginDate: string
  endDate: string
  note: string | null
}

export interface SafetyProjectReadResponseDtoType {
  safetyProjectId: number
  version: number
  name: string
  buildingName: string
  uniqueNo: string
  buildingId: string
  facilityNo: string
  roadAddress: string
  jibunAddress: string
  detailAddress: string
  managementEntityName: string
  grossArea: string
  representative: string
  completeDate: string
  safetyInspectionType: safetyInspectionTypeType
  safetyGrade: safetyGradeType
  facilityClassification: facilityClassificationType
  manager: string
  facilityClass: facilityClassType
  managerPhone: string
  facilityType: facilityTypeType
  tel: string
  bizno: string
  threeDUrl: string
  requirement: string
  note: string
  attachments: SafetyProjectAttachmentReadResponseDtoType[]
  contractDate: string
  projectStatus: projectStatusType
  contractPrice: number
  companyName: string
  contractManager: string
  contractManagerTel: string
  contractManagerEmail: string
  contractPartner: string
  contractPartnerEmail: string
  contractPartnerTel: string
  vatIncludedYn: ynResultType
  specialNote: string
}

interface SafetyProjectAttachmentReadResponseDtoType {
  safetyProjectAttachmentId: number
  safetyAttachmentType: safetyAttachmentTypeType
  originalFileName: string
  presignedUrl: string
}

// PATCH/api/safety/projects/{safetyProjectId}
export type SafetyProjectUpdateRequestDtoType = Omit<
  SafetyProjectReadResponseDtoType,
  'safetyProjectId' | 'specialNote' | 'name' | 'attachments'
>

export type SafetyProjectUpdateResponseDtoType = Omit<
  SafetyProjectReadResponseDtoType,
  'specialNote' | 'name' | 'attachments'
>

// PATCH /api/safety/projects/{safetyProjectId}/special-note - description:	안전진단 프로젝트 특이사항(specialNote) 수정 요청 DTO
export interface SafetyProjectNoteUpdateRequestDtoType {
  version: number
  specialNote: string
}

export type SafetyProjectNoteUpdateResponseDtoType = SafetyProjectNoteUpdateRequestDtoType

// PATCH /api/safety/projects/{safetyProjectId}/name
// description:	안전진단 현장명 수정 요청 DTO
export interface SafetyProjectNameUpdateRequestDtoType {
  version: number
  name: string
}

// 이름 수정 응답 DTO
export interface SafetyProjectNameUpdateResponseDtoType {
  version: number
  projectName: string
}

// GET /api/safety/projects/{safetyProjectId}/schedule-tab
// description:	안전진단 프로젝트 점검 일정 및 참여 기술진 응답 DTO
export interface SafetyProjectScheduleAndEngineerResponseDtoType {
  safetyProjectScheduleId: number
  version: number
  beginDate: string
  endDate: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  projectEndDate: string
  reportManagerEmail: string
  tiIssueDate: string
  engineers: SafetyProjectEngineerDetailResponseDtoType[]
}

// description:	안전진단 프로젝트 참여 기술진 응답 DTO
export interface SafetyProjectEngineerDetailResponseDtoType {
  engineerId: number
  engineerName: string
  gradeDescription: string
  engineerLicenseNum: string
  beginDate: string
  endDate: string
  note: string
}

// 점검일정 수정 요청/응답 dto
export interface SafetyProjectScheduleUpdateRequestDtoType {
  version: number
  beginDate: string
  endDate: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  projectEndDate: string
  reportManagerEmail: string
  tiIssueDate: string
}

export interface SafetyProjectScheduleUpdateResponseDtoType {
  safetyProjectScheduleId: number
  version: number
  beginDate: string
  endDate: string
  fieldBeginDate: string
  fieldEndDate: string
  reportDeadline: string
  projectEndDate: string
  reportManagerEmail: string
  tiIssueDate: string
}

export interface SafetyProjectEngineerUpdateRequestDtoType {
  engineerId: number
  beginDate: string
  endDate: string
  note: string
}

export type SafetyProjectEngineerUpdateResponseDtoType = SafetyProjectEngineerDetailResponseDtoType

// description:	안전진단 현장 첨부파일 등록 요청 DTO
export interface SafetyProjectAttachmentCreateRequestDtoType {
  safetyAttachmentType: safetyAttachmentTypeType
  originalFileName: string
  s3Key: string
}

// description:	첨부파일 단건 등록 응답 DTO
export interface SafetyProjectAttachmentCreateResponseDtoType {
  safetyProjectAttachmentId: number
}

// description:	안전진단 프로젝트 첨부파일 단건 수정 요청 DTO
export interface SafetyProjectAttachmentUpdateRequestDtoType {
  safetyProjectAttachmentId: number
  safetyAttachmentType: safetyAttachmentTypeType
  originalFileName: string
  s3Key: string
}

// PUT /api/safety/projects/{safetyProjectId}/attachments
// description:	안전진단 프로젝트 첨부파일 단건 수정 요청 DTO
export interface SafetyProjectAttachmentUpdateResponseDtoType {
  safetyProjectAttachmentId: number
  safetyAttachmentType: safetyAttachmentTypeType
  originalFileName: string
  s3Key: string
  presignedUrl: string
  downloadPresignedUrl: string
}

// ----------- Engineer 관련 API -----------
// api/engineers/options
export interface MachineEngineerOptionListResponseDtoType {
  engineers: MachineEngineerOptionResponseDtoType[]
}

export interface MachineEngineerOptionResponseDtoType {
  memberId: number
  engineerId: number
  engineerName: string
  gradeDescription: string
  engineerLicenseNum: string
  officePositionDescription: string
}

// GET api/engineers
export interface MachineEngineerPageResponseDtoType {
  engineerId: number
  version: number
  companyName: string
  name: string
  officeDepartmentName: string
  officePositionDescription: string
  engineerLicenseNum: string
  email: string
  phoneNumber: string
  workStatusDescription: string
  projectCnt: number
  remark: string
  latestProjectId: number
  latestProjectName: string
  latestProjectBeginDate: string
  latestProjectEndDate: string
  gradeDescription: string
}

// GET api/engineers/[engineerId] :기계설비 인력 조회 응답 DTO
export interface EngineerResponseDtoType {
  id: number
  version: number
  name: string
  email: string
  phoneNumber: string
  grade: string
  engineerLicenseNum: string
  remark: string
}

// PUT api/engineers/[engineerId]
export interface EngineerUpdateRequestDtoType {
  version: number
  name: string
  grade: string
  engineerLicenseNum: string
  remark: string
}

// POST api/engineers
export interface MachineEngineerCreateRequestDtoType {
  memberId: number
  grade: string
  engineerLicenseNum: string
  remark: string
}

// 설비인력 필터
export interface EngineerFilterType {
  companyName: string
  grade: string
  workStatus: workStatusType
}

// ----------- 설비목록 -----------
// GET inspections simple
export interface MachineInspectionSimpleResponseDtoType {
  id: number
  name: string
}

// GET api/machine-projects/{machineProjectId}/machine-inspections: 점검 설비 리스트 조회 (설비 목록 조회)
export interface MachineInspectionPageResponseDtoType {
  machineInspectionId: number
  version: number
  machineParentCateName: string
  machinePicCount: number
  machineInspectionName: string
  purpose: string
  location: string
  checkDate: string
  inspectionStatus: string
  engineerNames: string[]
}

// GET api/machine-projects/{machineProjectId}/machine-inspections/{machineInspectionId}: 점검 설비 상세 응답 DTO
export interface MachineInspectionDetailResponseDtoType {
  checklistExtensionType: checklistExtensionTypeType
  machineInspectionResponseDto: MachineInspectionResponseDtoType
  engineerIds: number[]
  machineChecklistItemsWithPicCountResponseDtos: MachineChecklistItemsWithPicCountResponseDtosType[]
  gasMeasurementResponseDto: GasMeasurementResponseDtoType
  pipeMeasurementResponseDtos: PipeMeasurementResponseDtoType[]
  windMeasurementResponseDtos: WindMeasurementResponseDtoType[]
}

// 점검 설비 기본 정보 응답 DTO
export interface MachineInspectionResponseDtoType {
  version: number
  id: number
  machineInspectionName: string
  machineCategoryId: number
  machineCategoryName: string
  purpose: string
  location: string
  equipmentPhase: equipmentPhaseType | null
  equipmentPhaseDate: string
  checkDate: string
  remark: string
}

// 점검 항목 + 사진 개수 등의 정보 목록
export interface MachineChecklistItemsWithPicCountResponseDtosType {
  machineProjectChecklistItemId: number
  machineProjectChecklistItemName: string
  checklistSubItems: MachineChecklistSubItemWithPicCountResponseDtoMachineChecklistSubItemWithPicCountResponseDtoType[]
  totalMachinePicCount: number
  machineInspectionChecklistItemResultBasicResponseDto: MachineInspectionChecklistItemResultBasicResponseDtoType
}

// 점검 결과 수정 요청 DTO
export type MachineInspectionChecklistItemResultUpdateRequestDtoType =
  MachineInspectionChecklistItemResultBasicResponseDtoType

export interface MachineInspectionChecklistItemResultBasicResponseDtoType {
  id: number
  version: number
  inspectionResult: string
  deficiencies: string | null
  actionRequired: string | null
}

// 점검 항목의 하위 항목 및 사진 개수 응답 DTO
export interface MachineChecklistSubItemWithPicCountResponseDtoMachineChecklistSubItemWithPicCountResponseDtoType {
  machineProjectChecklistSubItemId: number
  machineProjectChecklistSubItemName: string
  machinePicCount: number
}

// 가스 측정값 응답 DTO
export interface GasMeasurementResponseDtoType {
  version: number
  fuelType: fuelTypeType
  capacity: string
  o2: string
  co: string
  eff: string
  xair: string
  co2Ratio: string
  no: string
  nox: string
  standardUsage: string
  startTime: string
  startMeterValue: string
  endTime: string
  endMeterValue: string
}

// 배관 측정 응답 DTO
export interface PipeMeasurementResponseDtoType {
  pipeMeasurementId: number
  version: number
  pipeType: pipeTypeType
  pipePosition: string
  outerDiameter: string
  nominalThickness: string
  measuredThickness1: string
  measuredThickness2: string
  measuredThickness3: string
  measuredThickness4: string
  measuredThickness5: string
}

// 풍량 측정 응답 DTO
export interface WindMeasurementResponseDtoType {
  windMeasurementId: number
  version: number
  fanType: fanTypeType
  designAirVolumeCMM: string
  designFrequency: string
  designRpm: string
  designPoles: string
  horizontal: string
  vertical: string
  measurementBasis: string
  frequency: string
  topFront: string
  topCenter: string
  topRear: string
  midFront: string
  midCenter: string
  midRear: string
  bottomFront: string
  bottomCenter: string
  bottomRear: string
}

// 점검자 정보 응답 DTO
export interface MachineEngineerInfoResponseDtoType {
  machineInspectionId: number
  machineEngineerId: number
  machineEngineerName: string
}

export interface MachineInspectionFilterType {
  engineerName: string
}

// GET /api/machine-projects/{machineProjectId}/machine-inspections/{machineInspectionId}/machine-inspection-checklist-item-results
// 점검 항목 결과 응답 DTO
export interface MachineInspectionChecklistItemResultResponseDtoType {
  id: number
  version: number
  deficiencies: string | null
  actionRequired: string | null
}

// POST 설비추가 형식
export interface MachineInspectionCreateRequestDtoType {
  machineCategoryId: number
  purpose: string
  location: string
  cnt: number
}

// MachineCategory
// GET /api/machine-categories 기계설비 카테고리 전체 조회
export interface MachineCategoryResponseDtoType {
  id: number
  parentId: number
  name: string
}

// GET /api/machine-categories/leaf
export interface MachineLeafCategoryResponseDtoType {
  id: number
  name: string
}

export interface MachineInspectionRootCategoryResponseDtoType {
  machineCategoryId: number
  machineCategoryName: string
}

// ----------- 보고서 관련 -----------
export interface MachineEnergyTypeResponseDtoType {
  machineEnergyTypeId: number
  name: string
}

export interface targetType {
  name: string
  machineEnergyTargetId: number
}

export interface MachineEnergyUsageReadResponseDtoType {
  targetId: number
  year: number
  monthlyValues: string
}

// GET /api/machine-projects/{machineProjectId}/machine-reports/status 보고서 상태 다건 조회
export interface MachineReportStatusResponseDtoType {
  machineReportCategoryId: number
  machineCategoryId: number | null
  latestMachineReportId: number
  reportStatus: reportStatusType
  updatedAt: string
  fileName: string
}

// GET /api/machine-projects/{machineProjectId}/machine-reports/machine-report-categories/status 카테고리별 보고서 상태 조회
export interface MachineReportCategoryDetailResponseDtoType {
  machineReportCategoryId: number
  reports: MachineReportSimpleResponseDtoType[]
  latestStatus: reportStatusType
  latestReportId: number
  completedCount: number
}

export interface MachineReportSimpleResponseDtoType {
  id: number
  reportStatus: StatusType
  updatedAt: string
  fileName: string
}

// 기계설비 보고서 카테고리 응답 DTO
export interface MachineReportCategoryReadResponseDtoType {
  id: number
  name: string
  reportTemplateCode: string
}

// 점검의견서 조회 응답 DTO
export interface machineInspectionSummaryResponseDtoType {
  machineInspectionSummaryResponseDto: {
    summaryElements: {
      machineTopCategoryName: string
      inspectionResult: inspectionResultType
      actionRequired: Record<string, string>
    }[]
  }
  inspectionResultOverallOpinion: string
  performanceInspectionReportResult: string
}

// ----------- presignedURL 관련 -----------
// POST /api/machine-projects/{machineProjectId}/machine-pics 프로젝트 내 전체 사진 조회 (Presigned URL 포함)
export interface MachinePicPresignedUrlResponseDtoType {
  machineInspectionId: number
  machineInspectionName: string
  machinePicId: number
  version: number
  machineCategoryId: number
  machineProjectChecklistItemId: number
  machineProjectChecklistSubItemId: number
  machineCategoryName: string
  machineProjectChecklistItemName: string
  machineProjectChecklistSubItemName: string
  originalFileName: string
  measuredValue: string
  alternativeSubTitle: string
  s3Key: string
  presignedUrl: string
  downloadPresignedUrl: string
  remark: string
}

export interface machinePicCreateRequestDtoType {
  machineProjectChecklistSubItemId: number
  originalFileName: string
  s3Key: string
}

export interface MachineInspectionPicUploadPresignedUrlBatchRequestDtoType {
  uploadType: uploadTypeType
  originalFileNames: string[]
  machineProjectChecklistItemId: number
  machineProjectChecklistSubItemId: number
}

// ----------- 무한스크롤 사진 관련 -----------
// 무한스크롤 커서 정보 (사진 조회용)
export interface MachinePicCursorType {
  lastMachineCateSortOrder: number
  lastMachinePicCateSortOrder: number
  lastMachineProjectChecklistSubItemSortOrder: number
  lastMachineInspectionId: number
  lastMachinePicId: number
}

// PUT /api/machine-projects/{machineProjectId}/machine-inspections/{machineInspectionId}/machine-pics/{machinePicId}
export interface MachinePicUpdateResponseDtoType {
  machineInspectionId: number
  machinePicId: number
  version: number
  machineProjectChecklistSubItemId: number
  originalFileName: string
  s3Key: string
  presignedUrl: string
  downloadPresignedUrl: string
  cdnPath: string
  alternativeSubTitle: string
  measuredValue: string
  remark: string
}

export type MachinePicUpdateRequestDtoType = Omit<
  MachinePicUpdateResponseDtoType,
  'machinePicId' | 'downloadPresignedUrl' | 'cdnPath'
>

// ----------- machineProject Pic 관련 -------------
// GET /api/machine-projects/{machineProjectId}/machine-project-pics
export interface MachineProjectPicReadResponseDtoType {
  id: number
  version: number
  originalFileName: string
  machineProjectPicType: machineProjectPicTypeType
  presignedUrl: string
  downloadPresignedUrl: string
  remark: string
}

// PUT /api/machine-projects/{machineProjectId}/machine-project-pics/{machineProjectPicId}
export interface MachineProjectPicUpdateRequestDtoType {
  version: number
  originalFileName: string
  downloadPresignedUrl: string
  machineProjectPicType: machineProjectPicTypeType
  remark: string
}

// ----------- 라이선스 -----------
// api/licenses 라이선스 목록 조회 응답 DTO
// export interface LicensePageResponseDtoType {
//   licenseId: number
//   version: number
//   region: string
//   bizno: string
//   companyName: string
//   ceoName: string
//   memberCount: number
//   machineEngineerCount: number
//   safetyEngineerCount: number
//   managerName: string
//   managerEmail: string
//   managerPhoneNumber: string
//   tel: string
//   contractDate: string
//   expireDate: string
// }

// php
// GET /api/web/audit/licenses
export interface LicensePageResponseDtoType {
  num: number
  licenseSeq: number
  name: string
  englishName: string
  region: string
  bizno: string
  ceoName: string
  contractDate: string
  expireDate: string
  userCnt: number
  machineEngineerCnt: number
  safetyEngineerCnt: number
  machineProjectCnt: number
  safetyProjectCnt: number
  manager: string
  email: string
  phoneNumber: string
  telNumber: string
}

// GET api/licenses/[licenseId] : 라이선스 단건 조회 응답 DTO
// POST api/licneses : 라이선스 등록
export interface LicenseResponseDtoType {
  id: number
  version: number
  companyName: string
  companyNameAbbr: string
  bizno: string
  ceoName: string
  managerName: string
  managerPhoneNumber: string
  managerEmail: string
  taxEmail: string
  homepageAddr: string
  tel: string
  fax: string
  roadAddress: string
  jibunAddress: string
  detailAddress: string
  businessType: string
  businessCategory: string
  contractDate: string
  expireDate: string
  remark: string
}

export interface LicenseCreateRequestDto {
  companyName: string
  companyNameAbbr: string
  bizno: string
  ceoName: string
  managerName: string
  managerPhoneNumber: string
  managerEmail: string
  taxEmail: string
  homepageAddr: string
  tel: string
  fax: string
  roadAddress: string
  jibunAddress: string
  detailAddress: string
  businessType: string
  businessCategory: string
  contractDate: string
  expireDate: string
  remark: string
}

// ----------- 성능점검시 검토사항 -----------
// GET /api/machine-projects/{machineProjectId}/machine-performance-review/result-summary 결과요약
export interface MachinePerformanceReviewSummaryResponseDtoType {
  maintenanceGuidelineAdequacy: string
  systemOperationalStatus: string
  designAndMeasuredValueConsistency: string
  equipmentAgingDegree: string
  inspectionDeficiencies: string
  improvementNeedsAndPlan: string
  energyUsageByType: string
  energyEfficiencyOperationMethod: string
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/yearly-plan 연도별 계획
export interface MachinePerformanceReviewYearlyPlanResponseDtoType {
  refrigeratorResult: resultType
  refrigeratorDeficiency: string
  refrigeratorPlanYear1: planYearType
  refrigeratorPlanYear2: planYearType
  refrigeratorPlanYear3: planYearType
  refrigeratorPlanYear4: planYearType
  refrigeratorPlanYear5: planYearType
  coolingTowerResult: resultType
  coolingTowerDeficiency: string
  coolingTowerPlanYear1: planYearType
  coolingTowerPlanYear2: planYearType
  coolingTowerPlanYear3: planYearType
  coolingTowerPlanYear4: planYearType
  coolingTowerPlanYear5: planYearType
  thermalStorageResult: resultType
  thermalStorageDeficiency: string
  thermalStoragePlanYear1: planYearType
  thermalStoragePlanYear2: planYearType
  thermalStoragePlanYear3: planYearType
  thermalStoragePlanYear4: planYearType
  thermalStoragePlanYear5: planYearType
  boilerResult: resultType
  boilerDeficiency: string
  boilerPlanYear1: planYearType
  boilerPlanYear2: planYearType
  boilerPlanYear3: planYearType
  boilerPlanYear4: planYearType
  boilerPlanYear5: planYearType
  heatExchangerResult: resultType
  heatExchangerDeficiency: string
  heatExchangerPlanYear1: planYearType
  heatExchangerPlanYear2: planYearType
  heatExchangerPlanYear3: planYearType
  heatExchangerPlanYear4: planYearType
  heatExchangerPlanYear5: planYearType
  expansionTankResult: resultType
  expansionTankDeficiency: string
  expansionTankPlanYear1: planYearType
  expansionTankPlanYear2: planYearType
  expansionTankPlanYear3: planYearType
  expansionTankPlanYear4: planYearType
  expansionTankPlanYear5: planYearType
  pumpResult: resultType
  pumpDeficiency: string
  pumpPlanYear1: planYearType
  pumpPlanYear2: planYearType
  pumpPlanYear3: planYearType
  pumpPlanYear4: planYearType
  pumpPlanYear5: planYearType
  renewableEnergySystemResult: resultType
  renewableEnergySystemDeficiency: string
  renewableEnergySystemPlanYear1: planYearType
  renewableEnergySystemPlanYear2: planYearType
  renewableEnergySystemPlanYear3: planYearType
  renewableEnergySystemPlanYear4: planYearType
  renewableEnergySystemPlanYear5: planYearType
  packageAirConditionerResult: resultType
  packageAirConditionerDeficiency: string
  packageAirConditionerPlanYear1: planYearType
  packageAirConditionerPlanYear2: planYearType
  packageAirConditionerPlanYear3: planYearType
  packageAirConditionerPlanYear4: planYearType
  packageAirConditionerPlanYear5: planYearType
  precisionAirConditionerResult: resultType
  precisionAirConditionerDeficiency: string
  precisionAirConditionerPlanYear1: planYearType
  precisionAirConditionerPlanYear2: planYearType
  precisionAirConditionerPlanYear3: planYearType
  precisionAirConditionerPlanYear4: planYearType
  precisionAirConditionerPlanYear5: planYearType
  airHandlingUnitResult: resultType
  airHandlingUnitDeficiency: string
  airHandlingUnitPlanYear1: planYearType
  airHandlingUnitPlanYear2: planYearType
  airHandlingUnitPlanYear3: planYearType
  airHandlingUnitPlanYear4: planYearType
  airHandlingUnitPlanYear5: planYearType
  fanCoilUnitResult: resultType
  fanCoilUnitDeficiency: string
  fanCoilUnitPlanYear1: planYearType
  fanCoilUnitPlanYear2: planYearType
  fanCoilUnitPlanYear3: planYearType
  fanCoilUnitPlanYear4: planYearType
  fanCoilUnitPlanYear5: planYearType
  ventilationSystemResult: resultType
  ventilationSystemDeficiency: string
  ventilationSystemPlanYear1: planYearType
  ventilationSystemPlanYear2: planYearType
  ventilationSystemPlanYear3: planYearType
  ventilationSystemPlanYear4: planYearType
  ventilationSystemPlanYear5: planYearType
  filterResult: resultType
  filterDeficiency: string
  filterPlanYear1: planYearType
  filterPlanYear2: planYearType
  filterPlanYear3: planYearType
  filterPlanYear4: planYearType
  filterPlanYear5: planYearType
  sanitaryFacilityResult: resultType
  sanitaryFacilityDeficiency: string
  sanitaryFacilityPlanYear1: planYearType
  sanitaryFacilityPlanYear2: planYearType
  sanitaryFacilityPlanYear3: planYearType
  sanitaryFacilityPlanYear4: planYearType
  sanitaryFacilityPlanYear5: planYearType
  hotWaterSupplyResult: resultType
  hotWaterSupplyDeficiency: string
  hotWaterSupplyPlanYear1: planYearType
  hotWaterSupplyPlanYear2: planYearType
  hotWaterSupplyPlanYear3: planYearType
  hotWaterSupplyPlanYear4: planYearType
  hotWaterSupplyPlanYear5: planYearType
  waterTankResult: resultType
  waterTankDeficiency: string
  waterTankPlanYear1: planYearType
  waterTankPlanYear2: planYearType
  waterTankPlanYear3: planYearType
  waterTankPlanYear4: planYearType
  waterTankPlanYear5: planYearType
  drainageResult: resultType
  drainageDeficiency: string
  drainagePlanYear1: planYearType
  drainagePlanYear2: planYearType
  drainagePlanYear3: planYearType
  drainagePlanYear4: planYearType
  drainagePlanYear5: planYearType
  sewageTreatmentResult: resultType
  sewageTreatmentDeficiency: string
  sewageTreatmentPlanYear1: planYearType
  sewageTreatmentPlanYear2: planYearType
  sewageTreatmentPlanYear3: planYearType
  sewageTreatmentPlanYear4: planYearType
  sewageTreatmentPlanYear5: planYearType
  waterReuseResult: resultType
  waterReuseDeficiency: string
  waterReusePlanYear1: planYearType
  waterReusePlanYear2: planYearType
  waterReusePlanYear3: planYearType
  waterReusePlanYear4: planYearType
  waterReusePlanYear5: planYearType
  pipeLineResult: resultType
  pipeLineDeficiency: string
  pipeLinePlanYear1: planYearType
  pipeLinePlanYear2: planYearType
  pipeLinePlanYear3: planYearType
  pipeLinePlanYear4: planYearType
  pipeLinePlanYear5: planYearType
  ductResult: resultType
  ductDeficiency: string
  ductPlanYear1: planYearType
  ductPlanYear2: planYearType
  ductPlanYear3: planYearType
  ductPlanYear4: planYearType
  ductPlanYear5: planYearType
  insulationResult: resultType
  insulationDeficiency: string
  insulationPlanYear1: planYearType
  insulationPlanYear2: planYearType
  insulationPlanYear3: planYearType
  insulationPlanYear4: planYearType
  insulationPlanYear5: planYearType
  automaticControlResult: resultType
  automaticControlDeficiency: string
  automaticControlPlanYear1: planYearType
  automaticControlPlanYear2: planYearType
  automaticControlPlanYear3: planYearType
  automaticControlPlanYear4: planYearType
  automaticControlPlanYear5: planYearType
  noiseVibrationSeismicResult: resultType
  noiseVibrationSeismicDeficiency: string
  noiseVibrationSeismicPlanYear1: planYearType
  noiseVibrationSeismicPlanYear2: planYearType
  noiseVibrationSeismicPlanYear3: planYearType
  noiseVibrationSeismicPlanYear4: planYearType
  noiseVibrationSeismicPlanYear5: planYearType
  note: string
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/operation-status 작동상태
export interface MachinePerformanceReviewOperationStatusResponseDtoType {
  refrigeratorResult: resultType
  refrigeratorRemark: string
  coolingTowerResult: resultType
  coolingTowerRemark: string
  thermalStorageResult: resultType
  thermalStorageRemark: string
  boilerResult: resultType
  boilerRemark: string
  heatExchangerResult: resultType
  heatExchangerRemark: string
  expansionTankResult: resultType
  expansionTankRemark: string
  pumpResult: resultType
  pumpRemark: string
  renewableEnergySystemResult: resultType
  renewableEnergySystemRemark: string
  packageAirConditionerResult: resultType
  packageAirConditionerRemark: string
  precisionAirConditionerResult: resultType
  precisionAirConditionerRemark: string
  airHandlingUnitResult: resultType
  airHandlingUnitRemark: string
  fanCoilUnitResult: resultType
  fanCoilUnitRemark: string
  ventilationSystemResult: resultType
  ventilationSystemRemark: string
  filterResult: resultType
  filterRemark: string
  sanitaryFacilityResult: resultType
  sanitaryFacilityRemark: string
  hotWaterSupplyResult: resultType
  hotWaterSupplyRemark: string
  waterTankResult: resultType
  waterTankRemark: string
  drainageResult: resultType
  drainageRemark: string
  sewageTreatmentResult: resultType
  sewageTreatmentRemark: string
  waterReuseResult: resultType
  waterReuseRemark: string
  pipeLineResult: resultType
  pipeLineRemark: string
  ductResult: resultType
  ductRemark: string
  insulationResult: resultType
  insulationRemark: string
  automaticControlResult: resultType
  automaticControlRemark: string
  noiseVibrationSeismicResult: resultType
  noiseVibrationSeismicRemark: string
  opinion: string
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/measurement 측정값 일치
export interface MachinePerformanceReviewMeasurementResponseDtoType {
  refrigeratorResult: matchResultType
  refrigeratorRemark: string
  coolingTowerResult: matchResultType
  coolingTowerRemark: string
  thermalStorageResult: matchResultType
  thermalStorageRemark: string
  boilerResult: matchResultType
  boilerRemark: string
  heatExchangerResult: matchResultType
  heatExchangerRemark: string
  expansionTankResult: matchResultType
  expansionTankRemark: string
  pumpResult: matchResultType
  pumpRemark: string
  renewableEnergySystemResult: matchResultType
  renewableEnergySystemRemark: string
  packageAirConditionerResult: matchResultType
  packageAirConditionerRemark: string
  precisionAirConditionerResult: matchResultType
  precisionAirConditionerRemark: string
  airHandlingUnitResult: matchResultType
  airHandlingUnitRemark: string
  fanCoilUnitResult: matchResultType
  fanCoilUnitRemark: string
  ventilationSystemResult: matchResultType
  ventilationSystemRemark: string
  filterResult: matchResultType
  filterRemark: string
  sanitaryFacilityResult: matchResultType
  sanitaryFacilityRemark: string
  hotWaterSupplyResult: matchResultType
  hotWaterSupplyRemark: string
  waterTankResult: matchResultType
  waterTankRemark: string
  drainageResult: matchResultType
  drainageRemark: string
  sewageTreatmentResult: matchResultType
  sewageTreatmentRemark: string
  waterReuseResult: matchResultType
  waterReuseRemark: string
  pipeLineResult: matchResultType
  pipeLineRemark: string
  ductResult: matchResultType
  ductRemark: string
  insulationResult: matchResultType
  insulationRemark: string
  automaticControlResult: matchResultType
  automaticControlRemark: string
  noiseVibrationSeismicResult: matchResultType
  noiseVibrationSeismicRemark: string
  opinion: string
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/improvement 개선사항
export interface MachinePerformanceReviewImprovementResponseDtoType {
  refrigeratorResult: resultType
  refrigeratorDeficiency: string
  refrigeratorImprovement: string
  coolingTowerResult: resultType
  coolingTowerDeficiency: string
  coolingTowerImprovement: string
  thermalStorageResult: resultType
  thermalStorageDeficiency: string
  thermalStorageImprovement: string
  boilerResult: resultType
  boilerDeficiency: string
  boilerImprovement: string
  heatExchangerResult: resultType
  heatExchangerDeficiency: string
  heatExchangerImprovement: string
  expansionTankResult: resultType
  expansionTankDeficiency: string
  expansionTankImprovement: string
  pumpResult: resultType
  pumpDeficiency: string
  pumpImprovement: string
  renewableEnergySystemResult: resultType
  renewableEnergySystemDeficiency: string
  renewableEnergySystemImprovement: string
  packageAirConditionerResult: resultType
  packageAirConditionerDeficiency: string
  packageAirConditionerImprovement: string
  precisionAirConditionerResult: resultType
  precisionAirConditionerDeficiency: string
  precisionAirConditionerImprovement: string
  airHandlingUnitResult: resultType
  airHandlingUnitDeficiency: string
  airHandlingUnitImprovement: string
  fanCoilUnitResult: resultType
  fanCoilUnitDeficiency: string
  fanCoilUnitImprovement: string
  ventilationSystemResult: resultType
  ventilationSystemDeficiency: string
  ventilationSystemImprovement: string
  filterResult: resultType
  filterDeficiency: string
  filterImprovement: string
  sanitaryFacilityResult: resultType
  sanitaryFacilityDeficiency: string
  sanitaryFacilityImprovement: string
  hotWaterSupplyResult: resultType
  hotWaterSupplyDeficiency: string
  hotWaterSupplyImprovement: string
  waterTankResult: resultType
  waterTankDeficiency: string
  waterTankImprovement: string
  drainageResult: resultType
  drainageDeficiency: string
  drainageImprovement: string
  sewageTreatmentResult: resultType
  sewageTreatmentDeficiency: string
  sewageTreatmentImprovement: string
  waterReuseResult: resultType
  waterReuseDeficiency: string
  waterReuseImprovement: string
  pipeLineResult: resultType
  pipeLineDeficiency: string
  pipeLineImprovement: string
  ductResult: resultType
  ductDeficiency: string
  ductImprovement: string
  insulationResult: resultType
  insulationDeficiency: string
  insulationImprovement: string
  automaticControlResult: resultType
  automaticControlDeficiency: string
  automaticControlImprovement: string
  noiseVibrationSeismicResult: resultType
  noiseVibrationSeismicDeficiency: string
  noiseVibrationSeismicImprovement: string
  note: string
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/guide 검토가이드
export interface MachinePerformanceReviewGuideResponseDtoType {
  builtDrawingYn: ynResultType
  specificationYn: ynResultType
  loadCalculationYn: ynResultType
  operationManual: ynResultType
  manufacturerCertificateYn: ynResultType
  techStandardForm3Yn: ynResultType
  techStandardForm4Yn: ynResultType
  techStandardForm5Yn: ynResultType
  techStandardForm6Yn: ynResultType
}

export interface MachinePerformanceReviewAgingItemResponseDtoType {
  machineRootCategoryName: string
  systemName: string
  durableYearProcurement: number
  durableYearRealEstate: number
  usedYear: number
  remark: string
}

export interface MachinePerformanceReviewAgingReadResponseDtoType {
  agingEquipments: MachinePerformanceReviewAgingItemResponseDtoType[]
  agingStandard: agingStandardType
  agingInspectionResult: string
}

export interface MachinePerformanceReviewAgingUpdateResponseDtoType {
  agingStandard: agingStandardType
  agingInspectionResult: string
}

// ----------- 모바일 -----------
// GET /api/engineers/by-member/{memberId}
export interface EngineerBasicResponseDtoType {
  engineerId: number
  companyName: string
  memberName: string
  grade: gradeType
  engineerLicenseNum: string
}

// ----------- 로그인 -----------
// POST /api/authentication/web/login
export interface LoginResponseDtoType {
  jwtTokenRes: TokenResponseDto
  userSeq: number
  name: string
  email: string
  status: string
  roles: string[]
  pwResetRequired?: boolean
}


// JWT 토큰 발급 DTO
export interface TokenResponseDto {
  tokenType: string
  accessToken: string
  accessExp: number
}

// 로그인 기록
export interface LoginLogDtoType {
  seq: number
  regTime: string
  email: string
  name: string
  licenseName: string
  mobile: string
  countryCode: string
  ipAddr: string
  deviceType: string
  success: 'Y' | 'N'
}

export interface PhpApiResponseDtoType<T> {
  items: T[]
  total: number
  page: number
  size: number
}

// ----------- 공통 -----------
// 성공 반환 데이터
export interface successResponseDtoType<T> {
  content: T
  page: PageInfoDtoType
}

// page
export interface PageInfoDtoType {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

/* -------------------------- ENUM Type -------------------------- */
export type agingStandardType = 'KOREA_REAL_ESTATE_BOARD' | 'PUBLIC_PROCUREMENT_SERVICE'

export type ynResultType = 'Y' | 'N'

export type matchResultType = 'MATCH' | 'MISMATCH' | 'NONE'

export type inspectionResultType = 'PASS' | 'FAIL' | 'NONE'

export type planYearType = 'INSPECTION' | 'REPLACEMENT' | 'REPAIR' | 'INSTALLATION' | 'NONE'

export type resultType = 'PASS' | 'FAIL' | 'NONE'

export type machineProjectPicTypeType = 'OVERVIEW' | 'LOCATION_MAP' | 'ETC'

export type uploadTypeType = 'INSPECTION_IMAGE' | 'PROJECT_IMAGE'

export type equipmentPhaseType = 'INSTALL' | 'MANUFACTURE' | 'USE'

export type officePositionType =
  | 'TEMPORARY'
  | 'INTERN'
  | 'STAFF'
  | 'JUNIOR_STAFF'
  | 'ASSISTANT_MANAGER'
  | 'SENIOR_ASSISTANT_MANAGER'
  | 'RESPONSIBLE'
  | 'TEAM_LEADER'
  | 'SECTION_CHIEF'
  | 'DEPUTY_GENERAL_MANAGER'
  | 'MANAGER'
  | 'SENIOR_MANAGER'
  | 'DEPUTY_MANAGER'
  | 'DIRECTOR'
  | 'EXECUTIVE_DIRECTOR'
  | 'SENIOR_EXECUTIVE_DIRECTOR'
  | 'ADVISOR'
  | 'VICE_PRESIDENT'
  | 'PRESIDENT'

export type contractTypeType = 'REGULAR' | 'CONTRACT_1Y' | 'CONTRACT_2Y' | 'NON_REGULAR' | 'DAILY' | 'TEMPORARY'
export type laborFormType = 'RESIDENT' | 'NON_RESIDENT'
export type workFormType = 'DEEMED' | 'SPECIAL'

export type checklistExtensionTypeType =
  | 'NONE'
  | 'GAS_MEASUREMENT'
  | 'WIND_MEASUREMENT'
  | 'WIND_MEASUREMENT_SA_RA'
  | 'PIPE_MEASUREMENT'

export type engineerTypeType = 'MACHINE' | 'SAFETY'

export type gradeType = 'ASSIST' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export type memberStatusType = 'NORMAL' | 'QUIT' | 'PENDING' | 'LEAVE'

// php
export type userStatusType = 'NORMAL' | 'QUIT' | 'PENDING' | 'LEAVE'

export type reportStatusType = 'PENDING' | 'COMPLETED' | 'FAILED'

export type projectStatusType =
  | 'CONTRACT_COMPLETED'
  | 'SITE_INSPECTION_COMPLETED'
  | 'REPORT_WRITING'
  | 'REPORT_WRITING_COMPLETED'
  | 'REPORT_SUBMITTING'
  | 'REPORT_SUBMITTED'

export type safetyInspectionTypeType =
  | 'REGULAR_SAFETY_INSPECTION'
  | 'PRECISE_SAFETY_INSPECTION'
  | 'PRECISE_SAFETY_DIAGNOSTIC'
  | 'SEISMIC_PERFORMANCE_EVALUATION'
  | 'STRUCTURAL_SAFETY_ASSESSMENT'

export type safetyGradeType = 'POOR' | 'GOOD'

export type facilityClassificationType =
  | 'BRIDGE'
  | 'TUNNEL'
  | 'PORT'
  | 'DAM'
  | 'BUILDING'
  | 'SCHOOL_BUILDING'
  | 'RIVER'
  | 'WATERWORKS'
  | 'EMBANKMENT_AND_RETAINING_WALL'
  | 'JOINT_DISTRICT'

export type facilityClassType = 'CLASS_1' | 'CLASS_2' | 'CLASS_3' | 'CLASS_OUT'

export type facilityTypeType =
  | 'CLASS1_BUILDING_21F_OR_50K'
  | 'CLASS1_RAILWAY_STATION_OVER_30K'
  | 'CLASS1_UNDERGROUND_OVER_10K'
  | 'CLASS2_BUILDING_16F_TO_21F_OR_30K_TO_50K'
  | 'CLASS2_CULTURE_EDU_SALES_ETC'
  | 'CLASS2_RAILWAY_SUBWAY_STATION'
  | 'CLASS2_UNDERGROUND_5K_TO_10K'
  | 'CLASS3_APARTMENT_5F_TO_15F'
  | 'CLASS3_MULTI_UNIT_HOUSING_660M2_TO_4F'
  | 'CLASS3_DORMITORY_OVER_660M2'
  | 'CLASS3_BUILDING_11F_TO_16F_OR_5K_TO_30K'
  | 'CLASS3_CULTURE_EDU_SALES_ETC_SMALL'
  | 'CLASS3_RAILWAY_FACILITIES'
  | 'CLASS3_PUBLIC_OFFICE_OVER_300M2'
  | 'CLASS3_PUBLIC_OFFICE_OVER_1000M2'
  | 'CLASS3_UNDERGROUND_UNDER_5000M2'
  | 'CLASS3_LOCAL_GOV_REQUIRED_FACILITY'

export type safetyAttachmentTypeType =
  | 'BUILDING_REGISTER'
  | 'FACILITY_REGISTER'
  | 'WORK_ORDER'
  | 'EDUCATION_CERTIFICATE'

export type checkTypeType = 'COOLING' | 'HEATING'

export type genderType = 'FEMALE' | 'MALE'

export type buildingGradeType = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'SUPREME'

export type fuelTypeType =
  | 'LNG' // 액화천연가스
  | 'LPG' // 액화석유가스
  | 'LIQUID_FUEL' // 액체연료
  | 'SOLID_FUEL' // 고체연료
  | 'GASEOUS_FUEL' // 기체연료
  | 'PET_COKE' // 석유코크스
  | 'BIOGAS' // 바이오가스
  | 'GAS_HEATPUMP' // 가스히트펌프
  | 'ETC' // 기타

export type fanTypeType = 'SA' | 'RA'

export type pipeTypeType =
  | 'CARBON_STEEL' // 탄소강관
  | 'STAINLESS_STEEL' // 스테인리스강관
  | 'COPPER_PIPE' // 구리관

export type workStatusType =
  | 'WAITING' // 대기
  | 'ONSITE' // 현장
  | 'WORKING' // 작업
  | 'RESERVED' // 예약

/* -------------------------- TabValue Type -------------------------- */
// 기계설비현장 탭
export type MachineProjectTabValueType = '현장정보' | '점검일정/참여기술진' | '설비목록' | '전체사진' | '특이사항'

// 안전진단현장 탭
export type SafetyProjectTabValueType =
  | '현장정보'
  | '점검일정/참여기술진'
  | '현장점검표'
  | '도면목록'
  | '결함목록'
  | '전체사진'

  // | '자료실'
  | '특이사항'
