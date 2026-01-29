import type { InputFieldType, SafetyProjectFilterType } from '../../types'
import { projectStatusOption, regionOption, safetyInspectionTypeOption } from '../options'

export const SAFETY_PROJECT_FILTER_INFO: Record<keyof SafetyProjectFilterType, InputFieldType> = {
  status: { type: 'multi', label: '상태', options: projectStatusOption },
  inspectionType: { type: 'multi', label: '점검종류', options: safetyInspectionTypeOption },
  licenseName: { type: 'multi', label: '점검업체' },
  engineerName: { type: 'multi', label: '점검자' },
  region: { type: 'multi', label: "지역", options: regionOption }
}
