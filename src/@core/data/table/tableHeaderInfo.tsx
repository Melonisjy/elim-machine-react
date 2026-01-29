import type { tableHeaderInfoType } from '../../types'

// TODO: 추후 input info와 연동..? field들에 대해서 번역한 단어를 저장해두는 것도 좋을 듯..
// table 생성 중 헤더 생성에 필요.
export const TABLE_HEADER_INFO: tableHeaderInfoType = {
  // 직원관리 탭 테이블
  member: {
    // roleDescription: { label: '권한', canSort: true },
    name: { label: '이름', canSort: true },
    staffNum: { label: '사번', canSort: false, hideOnTablet: true },
    companyName: { label: '소속', canSort: true },
    officeDepartmentName: { label: '부서', canSort: true, hideOnTablet: true },
    officePositionDescription: { label: '직위', canSort: false },
    age: { label: '나이', canSort: true }, //gender도 함께 표시
    email: { label: '이메일', canSort: true, hideOnTablet: true },
    phoneNumber: { label: '휴대폰', canSort: false, hideOnTablet: true },
    joinDate: { label: '입사일', canSort: true, hideOnTablet: true },
    careerYear: { label: '근속년수', canSort: true, hideOnTablet: true },
    memberStatusDescription: { label: '상태', canSort: false, hideOnTablet: true }
  },
  // NEW !!! 
  user: {
    name: { label: '이름', canSort: true, width: '80px' },
    staffNum: { label: '사번', canSort: false, hideOnTablet: true, width: '120px' },
    licenseName: { label: '소속', canSort: true, width: '180px' },
    department: { label: '부서', canSort: false, width: '100px' },
    position: { label: '직위', canSort: false, width: '80px' },
    age: { label: '나이', canSort: true, width: '100px' },
    email: { label: '이메일', canSort: true, hideOnTablet: true },
    mobile: { label: '휴대폰', canSort: false, hideOnTablet: true, width: '180px' },
    joinDate: { label: '입사일', canSort: true, hideOnTablet: true, width: '180px' },
    careerYear: { label: '근속년수', canSort: true, hideOnTablet: true, width: '120px' },
    status: { label: '상태', canSort: false, hideOnTablet: true, width: '100px' }
  },
  machineProject: {
    projectStatusDescription: { label: '상태', canSort: false },
    region: { label: '지역', canSort: false },
    machineProjectName: { label: '현장명', canSort: true },
    fieldBeginDate: { label: '현장점검', canSort: true },
    fieldEndDate: { label: '점검종료', canSort: true },
    reportDeadline: { label: '보고서마감', canSort: true },
    inspectionCount: { label: '설비', canSort: false },
    companyName: { label: '점검업체', canSort: true },
    engineerNames: { label: '참여기술진', canSort: false },
    grossArea: { label: '연면적(㎡)', canSort: true },
    tel: { label: '전화번호', canSort: false }
  },
  safetyProject: {
    status: { label: '상태', canSort: false },
    checkType: { label: '종류', canSort: false },
    region: { label: '지역', canSort: false },
    placeName: { label: '건물명', canSort: false },
    fieldBeginDate: { label: '현장점검', canSort: true },
    fieldEndDate: { label: '점검종료', canSort: true },
    reportDate: { label: '보고서마감', canSort: true },
    facilityType: { label: '구분', canSort: false },
    jong: { label: '종별', canSort: false },
    licenseName: { label: '점검업체', canSort: true },
    engineers: { label: '참여기술진', canSort: false },
    grossArea: { label: '연면적(㎡)', canSort: true }
  },
  machineInspection: {
    machineParentCateName: { label: '분류', canSort: false },
    machineInspectionName: { label: '설비명', canSort: false },
    machinePicCount: { label: '사진', canSort: false },
    purpose: { label: '용도', canSort: false },
    location: { label: '위치', canSort: false },
    engineerNames: { label: '점검자', canSort: false },
    checkDate: { label: '점검일', canSort: false },
    inspectionStatus: { label: '결과', canSort: false }
  },
  machineEngineers: {
    companyName: { label: '회사명', canSort: false },
    gradeDescription: { label: '등급', canSort: true },
    name: { label: '이름', canSort: true },
    officeDepartmentName: { label: '부서', canSort: false },
    officePositionDescription: { label: '직급', canSort: false },
    engineerLicenseNum: { label: '수첩발급번호', canSort: false },
    email: { label: '이메일', canSort: false },
    // eslint-disable-next-line lines-around-comment
    // phoneNumber: { label: '휴대폰', canSort: false },
    workStatusDescription: { label: '상태', canSort: false },
    projectCnt: { label: '현장수', canSort: false },
    latestProjectName: { label: '마지막현장', canSort: false },
    latestProjectBeginDate: { label: '투입기간', canSort: false }, // latestProjectEndDate도 함께 표시
    remark: { label: '비고', canSort: false }
  },
  safetyEngineers: {
    licenseName: { label: '회사명', canSort: false },
    grade: { label: '등급', canSort: true },
    name: { label: '이름', canSort: true },
    department: { label: '부서', canSort: false },
    position: { label: '직급', canSort: false },
    licenseNum: { label: '수첩발급번호', canSort: false },
    email: { label: '이메일', canSort: false },
    status: { label: '상태', canSort: false },
    projectCnt: { label: '현장수', canSort: false },
    lastProject: { label: '마지막현장', canSort: false },
    lastProjectDate: { label: '투입기간', canSort: false }, // latestProjectEndDate도 함께 표시
    remark: { label: '비고', canSort: false }
  },
  licenses: {
    name: { label: '업체명', canSort: false },
    bizno: { label: '사업자번호', canSort: false, hideOnTablet: true },
    region: { label: '지역', canSort: false },
    ceoName: { label: '대표자명', canSort: false },
    userCnt: { label: '직원', canSort: true, hideOnTablet: true },
    machineProjectCnt: { label: '기계설비', canSort: true, hideOnTablet: true },
    safetyProjectCnt: { label: '안전진단', canSort: true, hideOnTablet: true },
    manager: { label: '담당자명', canSort: false, hideOnTablet: true },
    email: { label: '이메일', canSort: false, hideOnTablet: true },
    phoneNumber: { label: '휴대폰', canSort: false, hideOnTablet: true },
    telNumber: { label: '전화번호', canSort: false },
    contractDate: { label: '계약일', canSort: false, hideOnTablet: true },
    expireDate: { label: '만료일', canSort: false, hideOnTablet: true }
  },
  loginLog: {
    regTime: { label: '로그인 시간', canSort: true },
    name: { label: '이름', canSort: true },
    email: { label: '이메일', canSort: true },
    licenseName: { label: '소속', canSort: false },
    mobile: { label: '휴대폰', canSort: false, hideOnTablet: true },
    ipAddr: { label: 'IP 주소', canSort: false },
    deviceType: { label: '기기', canSort: false },
    success: { label: '성공 여부', canSort: false }
  }
}
