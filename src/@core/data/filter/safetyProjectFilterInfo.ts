import type { InputFieldType, SafetyProjectFilterType } from '../../types'
import { projectStatusOption, regionOption } from '../options'

export const SAFETY_PROJECT_FILTER_INFO: Record<keyof SafetyProjectFilterType, InputFieldType> = {
  projectStatus: { type: 'multi', label: '진행상태', options: projectStatusOption },
  companyName: { type: 'multi', label: '점검업체' },
  engineerName: { type: 'multi', label: '점검자' },
  region: { type: 'multi', label: "지역", options: regionOption }
}
