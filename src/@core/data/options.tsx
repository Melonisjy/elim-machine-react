import { IconBackslash, IconPercentage0, IconX } from '@tabler/icons-react'

import type {
  contractTypeType,
  equipmentPhaseType,
  gradeType,
  laborFormType,
  officePositionType,
  machineProjectPicTypeType,
  workFormType,
  projectStatusType,
  safetyInspectionTypeType,
  checkTypeType,
  safetyGradeType,
  ynResultType,
  genderType,
  buildingGradeType,
  fuelTypeType,
  fanTypeType,
  pipeTypeType,
  workStatusType,
  facilityClassificationType,
  facilityClassType,
  facilityTypeType,
  userStatusType
} from '@core/types'

type OptionType<T> = { value: T; label: string }[]

export const YNOption: OptionType<ynResultType> = [
  { value: 'Y', label: '예' },
  { value: 'N', label: '아니오' }
]

export const mapLabelToValue = (options: { label: string, value: string }[], inputValue?: string): string => {
  if (!inputValue) return ''

  const normalizedInput = inputValue.trim()

  const foundByLabel = options.find(opt => opt.label === normalizedInput || opt.label.trim() === normalizedInput)
  if (foundByLabel) return foundByLabel.value

  const foundByValue = options.find(
    opt => opt.value.toUpperCase() === normalizedInput.toUpperCase() ||
      opt.value.toUpperCase() === normalizedInput.trim().toUpperCase()
  )

  if (foundByValue) return foundByValue.value

  return inputValue
}


// member
// 해당 옵션은 실제로 사용되지 않음. InputBox에서 실제 라이선스 리스트를 가져와서 사용하기 때문.
export const companyNameOption = []

export const roleOption = [
  { value: 'GUEST', label: '게스트' },
  { value: 'USER', label: '일반 사용자' },
  { value: 'STAFF', label: '직원' },
  { value: 'MANAGER', label: '매니저' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'SUPERADMIN', label: '최고 관리자' }
]

export const userStatusOption: OptionType<userStatusType> = [
  { value: 'NORMAL', label: '재직중' },
  { value: 'QUIT', label: '퇴사' },
  { value: 'PENDING', label: '승인대기' },
]

export const nationalityOption = [
  { value: 'KOREAN', label: '내국인' },
  { value: 'FOREIGNER', label: '외국인' }
]

export const officeDepartmentNameOption = [
  { value: 'CONSTRUCTION_BUSINESS', label: '건설사업' },
  { value: 'CONSTRUCTION_SAFETY', label: '건설안전' },
  { value: 'ARCHITECTURAL_ENGINEERING', label: '건축기술' },
  { value: 'MANAGEMENT_PLANNING', label: '경영기획' },
  { value: 'MANAGEMENT_SUPPORT', label: '경영지원' },
  { value: 'STRUCTURE', label: '구조' },
  { value: 'STRUCTURAL_ENGINEERING', label: '구조기술' },
  { value: 'MECHANICAL_EQUIPMENT', label: '기계설비' },
  { value: 'TECHNICAL_SALES', label: '기술영업' },
  { value: 'TECHNICAL_SALES_CS', label: '기술영업CS' },
  { value: 'TECHNICAL_DATA', label: '기술자료' },
  { value: 'CORPORATE_RESEARCH_CENTER', label: '기업부설연구소' },
  { value: 'PLANNING_DEPARTMENT', label: '기획부' },
  { value: 'PLANNING_PROMOTION', label: '기획홍보' },
  { value: 'EXTERNAL_COOPERATION_TEAM', label: '대외협력팀' },
  { value: 'CEO', label: '대표이사' },
  { value: 'LEGAL_ADVISORY', label: '법률자문' },
  { value: 'ADMINISTRATION', label: '사무' },
  { value: 'DESIGN_TEAM', label: '설계팀' },
  { value: 'SAFETY_DIAGNOSIS_DEPARTMENT', label: '안전진단부' },
  { value: 'EXECUTIVE_OFFICE', label: '임원실' },
  { value: 'CIVIL_ENGINEERING_TECH', label: '토목기술' },
  { value: 'CIVIL_ENGINEERING_DEPARTMENT', label: '토목부' }
]

export const officePositionOption: OptionType<officePositionType> = [
  { value: 'TEMPORARY', label: '단기' },
  { value: 'INTERN', label: '인턴' },
  { value: 'STAFF', label: '사원' },
  { value: 'JUNIOR_STAFF', label: '주임' },
  { value: 'ASSISTANT_MANAGER', label: '대리' },
  { value: 'SENIOR_ASSISTANT_MANAGER', label: '선임' },
  { value: 'RESPONSIBLE', label: '책임' },
  { value: 'TEAM_LEADER', label: '팀장' },
  { value: 'SECTION_CHIEF', label: '소장' },
  { value: 'DEPUTY_GENERAL_MANAGER', label: '본부장' },
  { value: 'MANAGER', label: '과장' },
  { value: 'SENIOR_MANAGER', label: '부장' },
  { value: 'DEPUTY_MANAGER', label: '차장' },
  { value: 'DIRECTOR', label: '이사' },
  { value: 'EXECUTIVE_DIRECTOR', label: '상무' },
  { value: 'SENIOR_EXECUTIVE_DIRECTOR', label: '전무' },
  { value: 'ADVISOR', label: '고문' },
  { value: 'VICE_PRESIDENT', label: '부사장' },
  { value: 'PRESIDENT', label: '사장' }
]

export const contractTypeOption: OptionType<contractTypeType> = [
  { value: 'REGULAR', label: '정규직' },
  { value: 'CONTRACT_1Y', label: '계약직1년' },
  { value: 'CONTRACT_2Y', label: '계약직2년' },
  { value: 'NON_REGULAR', label: '무기계약직' },
  { value: 'DAILY', label: '일용직' },
  { value: 'TEMPORARY', label: '단기시급' }
]

export const laborFormOption: { value: laborFormType; label: string }[] = [
  { value: 'RESIDENT', label: '상근' },
  { value: 'NON_RESIDENT', label: '비상근' }
]

export const workFormOption: { value: workFormType; label: string }[] = [
  { value: 'DEEMED', label: '간주' },
  { value: 'SPECIAL', label: '별정' }
]

export const gradeOption: { value: gradeType; label: string }[] = [
  { value: 'ASSIST', label: '보조' },
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
  { value: 'EXPERT', label: '특급' }
]

export const genderOption: OptionType<genderType> = [
  { value: 'MALE', label: '남' },
  { value: 'FEMALE', label: '여' }
]

export const careerYearOption = [
  { value: '1', label: '1년차 이상' },
  { value: '2', label: '2년차 이상' },
  { value: '3', label: '3년차 이상' },
  { value: '4', label: '4년차 이상' },
  { value: '5', label: '5년차 이상' },
  { value: '6', label: '6년차 이상' },
  { value: '7', label: '7년차 이상' },
  { value: '8', label: '8년차 이상' },
  { value: '9', label: '9년차 이상' },
  { value: '10', label: '10년차 이상' }
]

export const birthMonthOption = Array.from({ length: 12 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1}월 생일자`
}))

export const regionOption = [
  { value: 'SEOUL', label: '서울' },
  { value: 'BUSAN', label: '부산' },
  { value: 'DAEGU', label: '대구' },
  { value: 'INCHEON', label: '인천' },
  { value: 'GWANGJU', label: '광주' },
  { value: 'DAEJEON', label: '대전' },
  { value: 'ULSAN', label: '울산' },
  { value: 'SEJONG', label: '세종' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'GANGWON', label: '강원' },
  { value: 'CHUNGBUK', label: '충북' },
  { value: 'CHUNGNAM', label: '충남' },
  { value: 'JEONBUK', label: '전북' },
  { value: 'JEONNAM', label: '전남' },
  { value: 'GYEONGBUK', label: '경북' },
  { value: 'GYEONGNAM', label: '경남' },
  { value: 'JEJU', label: '제주' }
]

// machine - project
export const projectStatusOption: OptionType<projectStatusType> = [
  { value: 'CONTRACT_COMPLETED', label: '계약 완료' },
  { value: 'SITE_INSPECTION_COMPLETED', label: '현장 점검 완료' },
  { value: 'REPORT_WRITING', label: '보고서 작성중' },
  { value: 'REPORT_WRITING_COMPLETED', label: '보고서 작성완료' },
  { value: 'REPORT_SUBMITTING', label: '보고서 제출중' },
  { value: 'REPORT_SUBMITTED', label: '보고서 제출완료' }
]

// machine - schedule
export const checkTypeOption: OptionType<checkTypeType> = [
  { value: 'COOLING', label: '냉방 점검' },
  { value: 'HEATING', label: '난방 점검' }
]

export const buildingGradeOption: OptionType<buildingGradeType> = [
  { value: 'BASIC', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
  { value: 'SUPREME', label: '특급' }
]

// machine - inspection
export const picCateInspectionStatusOption = [
  { value: 'NONE', label: <IconBackslash size={20} /> },
  { value: 'PASS', label: <IconPercentage0 size={20} /> },
  { value: 'FAIL', label: <IconX size={20} /> }
]

// machine-inspection - gas
export const fuelTypeOption: OptionType<fuelTypeType> = [
  { value: 'LNG', label: 'LNG' }, // 액화천연가스지만 LNG 그대로 많이 씀
  { value: 'LPG', label: 'LPG' }, // 액화석유가스지만 LPG 그대로 씀
  { value: 'LIQUID_FUEL', label: '액체연료' },
  { value: 'SOLID_FUEL', label: '고체연료' },
  { value: 'GASEOUS_FUEL', label: '기체연료' },
  { value: 'PET_COKE', label: '석유코크스' },
  { value: 'BIOGAS', label: '바이오가스' },
  { value: 'GAS_HEATPUMP', label: '가스히트펌프' },
  { value: 'ETC', label: '기타' }
]

// machine-inspection - gas
export const fanTypeOption: OptionType<fanTypeType> = [
  { value: 'SA', label: '급기팬 (SA)' },
  { value: 'RA', label: '환기팬 (RA)' }
]

// machine-inspection - pipe
export const pipeTypeOption: OptionType<pipeTypeType> = [
  { value: 'CARBON_STEEL', label: '탄소강관' },
  { value: 'STAINLESS_STEEL', label: '스테인리스강관' },
  { value: 'COPPER_PIPE', label: '구리관' }
]

// safety project
export const safetyInspectionTypeOption: OptionType<safetyInspectionTypeType> = [
  {
    value: 'REGULAR_SAFETY_INSPECTION',
    label: '정기안전점검'
  },
  { value: 'PRECISE_SAFETY_INSPECTION', label: '정밀안전점검' },
  { value: 'PRECISE_SAFETY_DIAGNOSTIC', label: '정밀안전진단' },
  { value: 'SEISMIC_PERFORMANCE_EVALUATION', label: '내진성능평가' },
  { value: 'STRUCTURAL_SAFETY_ASSESSMENT', label: '구조안전성검토' }
]

export const safetyGradeOption: OptionType<safetyGradeType> = [
  { value: 'GOOD', label: '양호' },
  { value: 'POOR', label: '미흡' }
]

export const facilityClassificationOption: OptionType<facilityClassificationType> = [
  { value: 'BRIDGE', label: '교량' },
  { value: 'TUNNEL', label: '터널' },
  { value: 'PORT', label: '항만' },
  { value: 'DAM', label: '댐' },
  { value: 'BUILDING', label: '건축물' },
  { value: 'SCHOOL_BUILDING', label: '건축물 (학교)' },
  { value: 'RIVER', label: '하천' },
  { value: 'WATERWORKS', label: '상하수도' },
  { value: 'EMBANKMENT_AND_RETAINING_WALL', label: '옹벽 및 절토사면' },
  { value: 'JOINT_DISTRICT', label: '공동구' }
]

export const facilityClassOption: OptionType<facilityClassType> = [
  { value: 'CLASS_1', label: '1종' },
  { value: 'CLASS_2', label: '2종' },
  { value: 'CLASS_3', label: '3종' },
  { value: 'CLASS_OUT', label: '종외시설' }
]

export const facilityTypeOption: OptionType<facilityTypeType> = [
  // 1종 시설물
  { value: 'CLASS1_BUILDING_21F_OR_50K', label: '1종-건축물(21층 이상 또는 연면적 5만㎡ 이상)' },
  { value: 'CLASS1_RAILWAY_STATION_OVER_30K', label: '1종-철도역사(연면적 3만㎡ 이상)' },
  { value: 'CLASS1_UNDERGROUND_OVER_10K', label: '1종-지하도상가(연면적 1만㎡ 이상)' },

  // 2종 시설물
  { value: 'CLASS2_BUILDING_16F_TO_21F_OR_30K_TO_50K', label: '2종-건축물(16층~21층 미만 또는 3만~5만㎡ 미만)' },
  { value: 'CLASS2_CULTURE_EDU_SALES_ETC', label: '2종-문화·교육·판매·숙박 등(연면적 3만㎡ 미만)' },
  { value: 'CLASS2_RAILWAY_SUBWAY_STATION', label: '2종-철도·지하철 역사' },
  { value: 'CLASS2_UNDERGROUND_5K_TO_10K', label: '2종-지하도상가(5천㎡~1만㎡ 미만)' },

  // 3종 시설물
  { value: 'CLASS3_APARTMENT_5F_TO_15F', label: '3종-공동주택(아파트 5층~15층)' },
  { value: 'CLASS3_MULTI_UNIT_HOUSING_660M2_TO_4F', label: '3종-연립주택(660㎡ 초과, 4층 이하)' },
  { value: 'CLASS3_DORMITORY_OVER_660M2', label: '3종-기숙사(연면적 660㎡ 초과)' },
  { value: 'CLASS3_BUILDING_11F_TO_16F_OR_5K_TO_30K', label: '3종-건축물(11층~16층 미만 또는 5천~3만㎡ 미만)' },
  { value: 'CLASS3_CULTURE_EDU_SALES_ETC_SMALL', label: '3종-문화·교육·판매·숙박 등(소규모)' },
  { value: 'CLASS3_RAILWAY_FACILITIES', label: '3종-철도시설물' },
  { value: 'CLASS3_PUBLIC_OFFICE_OVER_300M2', label: '3종-공공기관(300㎡ 초과)' },
  { value: 'CLASS3_PUBLIC_OFFICE_OVER_1000M2', label: '3종-공공기관(1,000㎡ 초과)' },
  { value: 'CLASS3_UNDERGROUND_UNDER_5000M2', label: '3종-지하도상가(5,000㎡ 미만)' },
  { value: 'CLASS3_LOCAL_GOV_REQUIRED_FACILITY', label: '3종-지자체 지정 필요 시설' }
]

/**
 * 안전진단 첨부파일 종류 옵션
 */
export const safetyAttachmentTypeOption = [
  { value: 'BUILDING_REGISTER', label: '건축물대장' },
  { value: 'FACILITY_REGISTER', label: '시설물대장' },
  { value: 'WORK_ORDER', label: '과업지시서' },
  { value: 'EDUCATION_CERTIFICATE', label: '교육수료증' }
] as const

export type safetyAttachmentTypeLabelType = (typeof safetyAttachmentTypeOption)[number]['label']

// engineer
export const engineersOption: { value: string | number; label: string }[] = []

export const workStatusOption: OptionType<workStatusType> = [
  { value: 'WAITING', label: '대기' },
  { value: 'ONSITE', label: '현장' },
  { value: 'WORKING', label: '작업' },
  { value: 'RESERVED', label: '예약' }
]

// machine project pic (현장사진)
export const projectPicOption: OptionType<machineProjectPicTypeType> = [
  { label: '전경사진', value: 'OVERVIEW' },
  { label: '위치도', value: 'LOCATION_MAP' },
  { label: '기타', value: 'ETC' }
]

// 설비 정보
export const equipmentPhaseOption: OptionType<equipmentPhaseType> = [
  { label: '설치일', value: 'INSTALL' },
  { label: '제조일', value: 'MANUFACTURE' },
  { label: '사용일', value: 'USE' }
]

// 측정값 자동입력
export const measuredValueOption = [
  '양호',
  '없음',
  '정상',
  'A',
  '㎝',
  '㎝Hg',
  'CO',
  'CO₂',
  'dB(A)',
  'Eff',
  'kgf/㎠',
  '㎾',
  'mbar',
  '㎜',
  '㎜/s',
  '㎜Aq',
  '㎜Hg',
  '㎫',
  '㏁',
  'NO',
  'NOx',
  'Nm³/h',
  'O₂',
  'Ratio',
  'rpm',
  'V',
  'XAir',
  'Ω',
  '℃',
  'm³',
  'm³/h',
  'm³/min'
].map(v => ({ value: v, label: v }))

// 공통
export const PageSizeOptions = [15, 20, 25, 30, 50, 100]

export const DEFAULT_PAGESIZE = 15

export const DEFAULT_PIC_PAGESIZE = 30
