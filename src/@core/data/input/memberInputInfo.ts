import {
  companyNameOption,
  contractTypeOption,
  gradeOption,
  nationalityOption,
  officeDepartmentNameOption,
  officePositionOption,
  userStatusOption,
  workFormOption,
  YNOption
} from '@/@core/data/options'
import type { userInputInfoType } from '../../types'

// 직원 상세 페이지
export const MEMBER_INPUT_INFO: userInputInfoType = {
  basic: {
    name: {
      size: 'md',
      type: 'text',
      label: '이름'
    },
    email: {
      size: 'md',
      type: 'text',
      label: '이메일'
    },
    licenseName: {
      size: 'md',
      type: 'multi',
      label: '소속',
      options: companyNameOption
    },
    status: {
      size: 'md',
      type: 'multi',
      label: '재직 상태',
      options: userStatusOption
    },
    remark: {
      size: 'lg',
      type: 'long text',
      label: '비고'
    }
  },
  privacy: {
    nationality: {
      size: 'md',
      type: 'multi',
      label: '국적',
      options: nationalityOption
    },
    juminNum: {
      size: 'md',
      type: 'juminNum',
      label: '주민등록번호'
    },
    birthday: {
      size: 'md',
      type: 'date',
      label: '생년월일'
    },
    phoneNumber: {
      size: 'md',
      type: 'text',
      label: '전화번호'
    },
    emergency1: {
      size: 'md',
      type: 'text',
      label: '비상연락처1'
    },
    emergency2: {
      size: 'md',
      type: 'text',
      label: '비상연락처2'
    },
    familyCnt: {
      size: 'md',
      type: 'number',
      label: '가족 수'
    },
    religion: {
      size: 'md',
      type: 'text',
      label: '종교'
    },
    address: {
      size: 'lg',
      type: 'map',
      label: '도로명 주소'
    },
    // detailAddress: {
    //   size: 'lg',
    //   type: 'text',
    //   label: '상세 주소'
    // },
    educationLevel: {
      size: 'md',
      type: 'text',
      label: '최종학력'
    },
    educationMajor: {
      size: 'md',
      type: 'text',
      label: '전공'
    },
    carOwned: {
      size: 'md',
      type: 'yn',
      label: '차량 보유 여부',
      options: YNOption
    },
    carNumber: {
      size: 'md',
      type: 'text',
      label: '차량번호'
    },
    bankName: {
      size: 'md',
      type: 'text',
      label: '은행명'
    },
    bankNumber: {
      size: 'md',
      type: 'text',
      label: '계좌번호'
    }
  },
  office: {
    staffNum: {
      size: 'md',
      type: 'text',
      label: '사번'
    },
    department: {
      size: 'md',
      type: 'multi', // 다중 선택 가능
      label: '부서',
      options: officeDepartmentNameOption
    },
    position: {
      size: 'md',
      type: 'multi', // 다중 선택 가능
      label: '직위',
      options: officePositionOption
    },
    apprentice: {
      size: 'md',
      type: 'text',
      label: '수습'
    },
    contractType: {
      size: 'md',
      type: 'multi', // 다중 선택 가능
      label: '계약 유형',
      options: contractTypeOption
    },
    contractYn: {
      size: 'md',
      type: 'yn',
      label: '계약 여부'
    },
    laborForm: {
      size: 'md',
      type: 'multi', // 다중 선택 가능
      label: '근로형태',
      options: [
        { value: 'RESIDENT', label: '상근' },
        { value: 'NON_RESIDENT', label: '비상근' }
      ]
    },
    workForm: {
      size: 'md',
      type: 'multi', // 다중 선택 가능
      label: '근무형태',
      options: workFormOption
    },
    fieldworkYn: {
      size: 'md',
      type: 'yn',
      label: '현장근무 여부'
    },
    staffCardYn: {
      size: 'md',
      type: 'yn',
      label: '사원증 여부'
    },
    joinDate: {
      size: 'md',
      type: 'date',
      label: '입사일'
    },
    resignDate: {
      size: 'md',
      type: 'date',
      label: '퇴사일'
    },
    insurancesAcquisitionDate: {
      size: 'md',
      type: 'date',
      label: '보험 취득일'
    },
    insurancesLossDate: {
      size: 'md',
      type: 'date',
      label: '보험 상실일'
    },
    // groupInsuranceYn: {
    //   size: 'md',
    //   type: 'yn',
    //   label: '단체보험 가입여부'
    // }
  },
  career: {
    jobGrade: {
      size: 'md',
      type: 'multi', // 다중 선택 가능
      label: '등급',
      options: gradeOption,
      disabled: true
    },
    jobField: {
      size: 'md',
      type: 'text',
      label: '직무분야'
    },
    preJoinExperienceMonth: {
      industrySameMonth: {
        size: 'md',
        type: 'number',
        label: '동종업계 경력(월)'
      },
      industryOtherMonth: {
        size: 'md',
        type: 'number',
        label: '타업계 경력(월)'
      }
    },
    certNum1: {
      size: 'md',
      type: 'text',
      label: '자격증1'
    },
    certNum2: {
      size: 'md',
      type: 'text',
      label: '자격증2'
    }
  },
  etc: {
    benefits: {
      youthJobLeap: {
        size: 'md',
        type: 'text',
        label: '청년 일자리 도약'
      },
      youthEmploymentIncentive: {
        size: 'md',
        type: 'text',
        label: '청년 채용 특별 장려금'
      },
      youthDigital: {
        size: 'md',
        type: 'text',
        label: '청년 디지털'
      },
      seniorInternship: {
        size: 'md',
        type: 'text',
        label: '시니어 인턴십'
      },
      newMiddleAgedJobs: {
        size: 'md',
        type: 'text',
        label: '신중년 적합직무'
      }
    },
    incomeTaxReduction: {
      beginDate: {
        size: 'md',
        type: 'date',
        label: '소득세 감면 시작일'
      },
      endDate: {
        size: 'md',
        type: 'date',
        label: '소득세 감면 종료일'
      },
      employedType: {
        size: 'md',
        type: 'text',
        label: '취업자 유형'
      },
      militaryPeriod: {
        size: 'md',
        type: 'text',
        label: '군복무 기간'
      }
    },
    registeredAt: {
      size: 'md',
      type: 'text',
      label: '등록일'
    },
    lastLoginAt: {
      size: 'md',
      type: 'text',
      label: '최종 로그인일'
    }
  }
}
