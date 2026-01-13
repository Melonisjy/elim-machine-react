import { useCallback } from 'react'

import type { QueryFunction } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// @ts-ignore
import type { AxiosError } from 'axios'

import { toast } from 'react-toastify'

import { auth, phpAuth } from '@core/utils/auth' // 실제 auth 임포트 경로 사용
import type { PhpApiResult } from '@core/utils/auth'
import { QUERY_KEYS } from '@/@core/data/queryKeys' // 실제 쿼리 키 임포트 경로 사용
import type {
  EngineerBasicResponseDtoType,
  EngineerResponseDtoType,
  engineerTypeType,
  GasMeasurementResponseDtoType,
  LicensePageResponseDtoType,
  LicenseResponseDtoType,
  MachineCategoryResponseDtoType,
  MachineEnergyTypeResponseDtoType,
  MachineEngineerOptionResponseDtoType,
  MachineEngineerPageResponseDtoType,
  MachineInspectionChecklistItemResultResponseDtoType,
  MachineInspectionChecklistItemResultUpdateRequestDtoType,
  MachineInspectionDetailResponseDtoType,
  MachineInspectionPageResponseDtoType,
  MachineInspectionResponseDtoType,
  MachineInspectionRootCategoryResponseDtoType,
  MachineInspectionSimpleResponseDtoType,
  machineInspectionSummaryResponseDtoType,
  MachineLeafCategoryResponseDtoType,
  MachinePerformanceReviewAgingReadResponseDtoType,
  MachinePerformanceReviewAgingUpdateResponseDtoType,
  MachinePerformanceReviewGuideResponseDtoType,
  MachinePerformanceReviewImprovementResponseDtoType,
  MachinePerformanceReviewMeasurementResponseDtoType,
  MachinePerformanceReviewOperationStatusResponseDtoType,
  MachinePerformanceReviewSummaryResponseDtoType,
  MachinePerformanceReviewYearlyPlanResponseDtoType,
  machineProjectEngineerDetailDtoType,
  MachineProjectPageDtoType,
  MachineProjectPicReadResponseDtoType,
  MachineProjectResponseDtoType,
  MachineProjectScheduleAndEngineerResponseDtoType,
  MachineReportCategoryReadResponseDtoType,
  MachineReportStatusResponseDtoType,
  MemberBasicDtoType,
  MemberCareerDtoType,
  MemberDetailResponseDtoType,
  MemberEtcDtoType,
  MemberLookupResponseDtoType,
  MemberOfficeDtoType,
  MemberPageDtoType,
  MemberPrivacyDtoType,
  LoginLogPageResponseDtoType,
  PipeMeasurementResponseDtoType,
  SafetyProjectAttachmentCreateRequestDtoType,
  SafetyProjectAttachmentCreateResponseDtoType,
  SafetyProjectAttachmentUpdateRequestDtoType,
  SafetyProjectAttachmentUpdateResponseDtoType,
  SafetyProjectEngineerUpdateRequestDtoType,
  SafetyProjectEngineerUpdateResponseDtoType,
  SafetyProjectNameUpdateRequestDtoType,
  SafetyProjectNameUpdateResponseDtoType,
  SafetyProjectNoteUpdateRequestDtoType,
  SafetyProjectNoteUpdateResponseDtoType,
  SafetyProjectPageResponseDtoType,
  SafetyProjectReadResponseDtoType,
  SafetyProjectScheduleAndEngineerResponseDtoType,
  SafetyProjectScheduleUpdateRequestDtoType,
  SafetyProjectScheduleUpdateResponseDtoType,
  SafetyProjectUpdateRequestDtoType,
  SafetyProjectUpdateResponseDtoType,
  successResponseDtoType,
  targetType,
  WindMeasurementResponseDtoType
} from '@core/types' // 타입 임포트
import { handleApiError } from '@core/utils/errorHandler'

// ------------------------- License 관련 -------------------------
export const useGetLicenseNames = () => {
  return useQuery({
    queryKey: QUERY_KEYS.LICENSE.GET_LICENSES_NAMES,
    queryFn: async data => {
      const [keyType] = data.queryKey

      const response = await auth
        .get<{
          data: { licenseIdAndNameResponseDtos: { id: number; companyName: string }[] }
        }>(`/api/licenses/names`)
        .then(v => v.data.data.licenseIdAndNameResponseDtos)

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/licenses
export const useGetLicenses = (queryParams: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LICENSE.GET_LICENSES(queryParams),
    queryFn: async data => {
      const [keyType, queryParams] = data.queryKey
      const params = new URLSearchParams(queryParams)

      if (!params.has('size')) {
        params.set('size', '15')
      }

      const response = await auth
        .get<{
          data: successResponseDtoType<LicensePageResponseDtoType[]>
        }>(`/api/licenses?${params}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType} in ${params}:`)

      return response
    }
  })
}

// GET api/licenses/[licenseId]
export const useGetLicense = (licenseId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LICENSE.GET_LICENSE(licenseId),
    queryFn: async data => {
      const [keyType, licenseId] = data.queryKey

      const response = await auth
        .get<{ data: LicenseResponseDtoType }>(`/api/licenses/${licenseId}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType}`)

      return response
    },
    enabled: Number(licenseId) > 0
  })
}

export const useMutateLicense = (licenseId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.LICENSE.GET_LICENSE(licenseId)

  const putLicense = async ({ data }: { data: LicenseResponseDtoType }) => {
    const response = await auth.put<{ data: LicenseResponseDtoType }>(`/api/licenses/${licenseId}`, data)

    return response.data.data
  }

  return useMutation<LicenseResponseDtoType, AxiosError, LicenseResponseDtoType>({
    mutationFn: data => putLicense({ data }),

    onSuccess: data => {
      queryClient.setQueryData(queryKey, data)
      console.log('LicenseResponseDtoType가 성공적으로 수정되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// ------------------------- MachineInspection 관련 -------------------------
// GET /api/machine-projects/${machineProjectId}/machine-inspections : 특정 프로젝트의 설비목록 가져오기

// GET /api/machine-projects/${machineProjectId}/machine-inspections/simple : 설비 목록 조회 (SIMPLE)
export const useGetInspectionsSimple = (machineProjectId: string) => {
  return useQuery({
    enabled: machineProjectId !== '',
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTIONS_SIMPLE(machineProjectId),
    queryFn: async data => {
      const [keytype, machineProjectId] = data.queryKey

      const response = await auth
        .get<{
          data: { machineInspections: MachineInspectionSimpleResponseDtoType[] }
        }>(`/api/machine-projects/${machineProjectId}/machine-inspections/simple`)
        .then(v => v.data.data.machineInspections)

      console.log(`!!! queryFn ${keytype}:`)

      return response
    },
    staleTime: 1000 * 60 * 5, // 5분
    retryDelay: 1000 * 60 * 5 // 5분
  })
}

export const useGetInspections = (machineProjectId: string, queryParams: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTIONS(machineProjectId, queryParams),
    queryFn: async data => {
      const [keyType, machineProjectId, queryParams] = data.queryKey
      const params = new URLSearchParams(queryParams)

      if (!params.has('size')) {
        params.set('size', '15')
      }

      const response = await auth
        .get<{
          data: successResponseDtoType<MachineInspectionPageResponseDtoType[]>
        }>(`/api/machine-projects/${machineProjectId}/machine-inspections?${params}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType} in ${machineProjectId} for ${params}:`)

      return response
    },
    staleTime: 1000 * 60 * 1 // 5분
  })
}

// GET /api/machine-projects/${machineProjectId}/machine-inspections : 설비 목록 조회 (모바일 설비 변경 Select용)
export const useGetEveryInspections = (machineProjectId: string) => {
  const maxCnt = 100
  const queryParams = `size=${maxCnt}`

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTIONS(machineProjectId, queryParams),
    queryFn: async data => {
      const [keytype, machineProjectId] = data.queryKey

      const response = await auth
        .get<{
          data: { content: MachineInspectionPageResponseDtoType[] }
        }>(`/api/machine-projects/${machineProjectId}/machine-inspections?${queryParams}`)
        .then(v => v.data.data.content)

      console.log(`!!! queryFn ${keytype}:`)

      return response
    },
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}
const fetchSingleInspection: QueryFunction<MachineInspectionDetailResponseDtoType, string[]> = async data => {
  const [keyInfo, machineProjectId, machineInspectionId] = data.queryKey

  // API 호출 로직
  const response = await auth
    .get<{
      data: MachineInspectionDetailResponseDtoType
    }>(`/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}`)
    .then(v => v.data.data)

  console.log(`!!! queryFn ${keyInfo}:`)

  return response
}

// 단일 설비 정보 전체 가져오기
export const useGetSingleInspection = (machineProjectId: string, machineInspectionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId),
    queryFn: fetchSingleInspection,
    staleTime: 1000 * 60 * 5, // 5분
    enabled: Number(machineInspectionId) > 0
  })
}

// machineInspectionResponseDto 수정
export const useMutateMachineInspectionResponseDto = (machineProjectId: string, machineInspectionId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId)

  const putMachineInspectionResponseDto = async ({ data }: { data: MachineInspectionResponseDtoType }) => {
    const response = await auth.put<{ data: MachineInspectionResponseDtoType }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}`,
      data
    )

    return response.data.data
  }

  return useMutation<MachineInspectionResponseDtoType, AxiosError, MachineInspectionResponseDtoType>({
    mutationFn: data => putMachineInspectionResponseDto({ data }),

    onSuccess: data => {
      queryClient.setQueryData(
        queryKey,
        (prev: MachineInspectionDetailResponseDtoType) =>
          ({ ...prev, machineInspectionResponseDto: data }) as MachineInspectionDetailResponseDtoType
      )
      console.log('MachineInspectionResponseDto가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// engineerIds 수정
export const useMutateEngineerIds = (machineProjectId: string, machineInspectionId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId)

  const putMachineInspectionResponseDto = async ({ data }: { data: number[] }) => {
    const response = await auth.put<{ data: { engineerIds: number[] } }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/machine-inspection-engineers`,
      { engineerIds: data }
    )

    return response.data.data.engineerIds
  }

  return useMutation<number[], AxiosError, number[]>({
    mutationFn: data => putMachineInspectionResponseDto({ data }),

    onSuccess: data => {
      queryClient.setQueryData(
        queryKey,
        (prev: MachineInspectionDetailResponseDtoType) =>
          ({ ...prev, engineerIds: data }) as MachineInspectionDetailResponseDtoType
      )
      console.log('engineerIds가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// MachineInspectionChecklistItemResultUpdateRequestDto 수정
export const useMutateMachineInspectionChecklistItemResultUpdateRequestDto = (
  machineProjectId: string,
  machineInspectionId: string
) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId)

  const putMachineInspectionResponseDto = async ({
    data
  }: {
    data: MachineInspectionChecklistItemResultUpdateRequestDtoType[]
  }) => {
    const response = await auth.put<{
      data: {
        machineInspectionChecklistItemResultUpdateResponseDtos: MachineInspectionChecklistItemResultUpdateRequestDtoType[]
      }
    }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/machine-inspection-checklist-item-results`,
      { machineInspectionChecklistItemResultUpdateRequestDtos: data }
    )

    return response.data.data.machineInspectionChecklistItemResultUpdateResponseDtos
  }

  return useMutation<
    MachineInspectionChecklistItemResultUpdateRequestDtoType[],
    AxiosError,
    MachineInspectionChecklistItemResultUpdateRequestDtoType[]
  >({
    mutationFn: data => putMachineInspectionResponseDto({ data }),

    onSuccess: data => {
      queryClient.setQueryData(
        queryKey,
        (prev: MachineInspectionDetailResponseDtoType) =>
          ({
            ...prev,
            machineChecklistItemsWithPicCountResponseDtos: prev.machineChecklistItemsWithPicCountResponseDtos.map(v => {
              const f = data.find(p => p.id === v.machineInspectionChecklistItemResultBasicResponseDto.id)

              return f ? { ...v, machineInspectionChecklistItemResultBasicResponseDto: f } : v
            })
          }) as MachineInspectionDetailResponseDtoType
      )
      console.log('MachineInspectionChecklistItemResultUpdateRequestDto가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// GasMeasurementResponseDto 수정
export const useMutateGasMeasurementResponseDto = (machineProjectId: string, machineInspectionId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId)

  const putMachineInspectionResponseDto = async ({ data }: { data: GasMeasurementResponseDtoType }) => {
    const response = await auth.put<{ data: GasMeasurementResponseDtoType }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/gasMeasurement`,
      data
    )

    return response.data.data
  }

  return useMutation<GasMeasurementResponseDtoType, AxiosError, GasMeasurementResponseDtoType>({
    mutationFn: data => putMachineInspectionResponseDto({ data }),

    onSuccess: data => {
      queryClient.setQueryData(
        queryKey,
        (prev: MachineInspectionDetailResponseDtoType) =>
          ({ ...prev, gasMeasurementResponseDto: data }) as MachineInspectionDetailResponseDtoType
      )
      console.log('GasMeasurementResponseDto가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// WindMeasurementResponseDto 수정
export const useMutateWindMeasurementResponseDto = (machineProjectId: string, machineInspectionId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId)

  const putMachineInspectionResponseDto = async ({ data }: { data: WindMeasurementResponseDtoType[] }) => {
    const response = await auth.put<{ data: { windMeasurementUpdateResponseDtos: WindMeasurementResponseDtoType[] } }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/windMeasurements`,
      { windMeasurementUpdateRequestDtos: data }
    )

    return response.data.data.windMeasurementUpdateResponseDtos
  }

  return useMutation<WindMeasurementResponseDtoType[], AxiosError, WindMeasurementResponseDtoType[]>({
    mutationFn: data => putMachineInspectionResponseDto({ data }),

    onSuccess: data => {
      queryClient.setQueryData(
        queryKey,
        (prev: MachineInspectionDetailResponseDtoType) =>
          ({ ...prev, windMeasurementResponseDtos: data }) as MachineInspectionDetailResponseDtoType
      )
      console.log('WindMeasurementResponseDto가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// PipeMeasurementResponseDto 수정
export const useMutatePipeMeasurementResponseDto = (machineProjectId: string, machineInspectionId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId)

  const putMachineInspectionResponseDto = async ({ data }: { data: PipeMeasurementResponseDtoType[] }) => {
    const response = await auth.put<{ data: { pipeMeasurementUpdateResponseDtos: PipeMeasurementResponseDtoType[] } }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/pipeMeasurements`,
      { pipeMeasurementUpdateRequestDtos: data }
    )

    return response.data.data.pipeMeasurementUpdateResponseDtos
  }

  return useMutation<PipeMeasurementResponseDtoType[], AxiosError, PipeMeasurementResponseDtoType[]>({
    mutationFn: data => putMachineInspectionResponseDto({ data }),

    onSuccess: data => {
      queryClient.setQueryData(
        queryKey,
        (prev: MachineInspectionDetailResponseDtoType) =>
          ({ ...prev, pipeMeasurementResponseDtos: data }) as MachineInspectionDetailResponseDtoType
      )
      console.log('pipeMeasurementResponseDto가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// 단일 설비 정보에서 체크리스트 정보만 샘플링
export const useGetChecklistInfo = (machineProjectId: string, machineInspectionId: string) => {
  const selectMachineChecklistItemsWithPicCountResponseDtos = useCallback(
    (data: MachineInspectionDetailResponseDtoType) => {
      console.log('select machineChecklistItemsWithPicCountResponseDtos!')

      return data.machineChecklistItemsWithPicCountResponseDtos
    },
    []
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId),
    queryFn: fetchSingleInspection,
    select: selectMachineChecklistItemsWithPicCountResponseDtos,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// 단일 설비 정보에서 machineInspectionResponseDto만 샘플링
export const useGetSingleInspectionSumamry = (machineProjectId: string, machineInspectionId: string) => {
  const selectMachineInspectionResponseDto = useCallback((data: MachineInspectionDetailResponseDtoType) => {
    console.log('select machineInspectionResponseDto!')

    return data.machineInspectionResponseDto
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_INSPECTION_INFO(machineProjectId, machineInspectionId),
    queryFn: fetchSingleInspection,
    select: selectMachineInspectionResponseDto,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-inspections/root-categories
export const useGetRootCategories = (machineProjectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_ROOT_CATEGORIES(machineProjectId),
    queryFn: async data => {
      const [keytype, machineProjectId] = data.queryKey

      const response = await auth
        .get<{
          data: { rootCategories: MachineInspectionRootCategoryResponseDtoType[] }
        }>(`/api/machine-projects/${machineProjectId}/machine-inspections/root-categories`)
        .then(v => v.data.data.rootCategories)

      console.log(`!!! queryFn ${keytype}:`)

      return response
    },
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/machine-inspection-checklist-item-results/${checklistResultId}
const fetchChecklistResult: QueryFunction<
  MachineInspectionChecklistItemResultResponseDtoType,
  string[]
> = async data => {
  const [keyInfo, machineProjectId, machineInspectionId, checklistResultId] = data.queryKey

  const response = await auth
    .get<{
      data: MachineInspectionChecklistItemResultResponseDtoType
    }>(
      `/api/machine-projects/${machineProjectId}/machine-inspections/${machineInspectionId}/machine-inspection-checklist-item-results/${checklistResultId}`
    )
    .then(v => v.data.data)

  console.log(`!!! queryFn ${keyInfo}:`, response)

  return response
}

export const useGetChecklistResult = (
  machineProjectId: string,
  machineInspectionId: string,
  checklistResultId: string
) => {
  const isEnabled = checklistResultId !== 'undefined'

  return useQuery({
    enabled: isEnabled,
    queryKey: QUERY_KEYS.MACHINE_INSPECTION.GET_CHECKLIST_RESULT(
      machineProjectId,
      machineInspectionId,
      checklistResultId
    ),
    queryFn: fetchChecklistResult,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/${machineProjectId}/machine-project-pics/overview?machineProjectPicType=OVERVIEW
export const useGetOverviewPics = (machineProjectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PROJECT_PIC.GET_OVERVIEW(machineProjectId),
    queryFn: async data => {
      const [keytype, machineProjectId] = data.queryKey

      const response = await auth
        .get<{
          data: { machineProjectPics: MachineProjectPicReadResponseDtoType[] }
        }>(`/api/machine-projects/${machineProjectId}/machine-project-pics/overview?machineProjectPicType=OVERVIEW`)
        .then(v => v.data.data.machineProjectPics)

      console.log(`!!! queryFn ${keytype}:`)

      return response
    },
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-categories
export const useGetCategories = () => {
  const fetchCategories: QueryFunction<MachineCategoryResponseDtoType[], string[]> = useCallback(async data => {
    const response = await auth
      .get<{ data: { machineCategoryResponseDtos: MachineCategoryResponseDtoType[] } }>(`/api/machine-categories`)
      .then(v => v.data.data.machineCategoryResponseDtos)

    const [keyType] = data.queryKey

    console.log(`!!! queryFn ${keyType}:`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_CATEGORY.GET_MACHINE_CATEGORY,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-categories/leaf
export const useGetLeafCategories = () => {
  const fetchLeafCategories: QueryFunction<MachineLeafCategoryResponseDtoType[], string[]> = useCallback(async data => {
    const response = await auth
      .get<{ data: { leafCategories: MachineLeafCategoryResponseDtoType[] } }>(`/api/machine-categories/leaf`)
      .then(v => v.data.data.leafCategories)

    const [keyType] = data.queryKey

    console.log(`!!! queryFn ${keyType}:`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_CATEGORY.GET_MACHINE_LEAF_CATEGORY,
    queryFn: fetchLeafCategories,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-energy-types
export const useGetEnergyTypes = () => {
  const fetchEnergyTypes: QueryFunction<MachineEnergyTypeResponseDtoType[], string[]> = useCallback(async data => {
    const response = await auth
      .get<{ data: { machineEnergyTypes: MachineEnergyTypeResponseDtoType[] } }>(`/api/machine-energy-types`)
      .then(v => v.data.data.machineEnergyTypes)

    const [keyType] = data.queryKey

    console.log(`!!! queryFn ${keyType}:`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_ENERGY_TYPE,
    queryFn: fetchEnergyTypes,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-energy-targets
export const useGetEnergyTargets = (machineProjectId: string, machineEnergyTypeId: string) => {
  const fetchEnergyTargets: QueryFunction<targetType[], string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: { machineEnergyTargets: targetType[] }
        }>(
          `/api/machine-projects/${machineProjectId}/machine-energy-targets?machineEnergyTypeId=${machineEnergyTypeId}`
        )
        .then(v => v.data.data.machineEnergyTargets)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId, machineEnergyTypeId]
  )

  const isEnabled = machineEnergyTypeId !== 'undefined'

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_ENERGY_TARGET.GET_ENERGY_TARGETS(machineProjectId, machineEnergyTypeId),
    queryFn: fetchEnergyTargets,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-energy-usages 에너지 사용량 전체 조회
export const useGetEnergyUsages = (machineProjectId: string, machineEnergyTypeId: string, years: number[]) => {
  const fetchEnergyUsages: QueryFunction<
    { targetId: number; year: number; monthlyValues: Record<string, number> }[],
    string[]
  > = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: { machineEnergyUsages: { targetId: number; year: number; monthlyValues: Record<string, number> }[] }
        }>(
          `/api/machine-projects/${machineProjectId}/machine-energy-usages?machineEnergyTypeId=${machineEnergyTypeId}&years=${years.join(', ')}`
        )
        .then(v => v.data.data.machineEnergyUsages)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId, machineEnergyTypeId, years]
  )

  const isEnabled = machineEnergyTypeId !== 'undefined' && years !== undefined

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_ENERGY_USAGE.GET_ENERGY_USAGES(machineProjectId, machineEnergyTypeId, years),
    queryFn: fetchEnergyUsages,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-report-categories
export const useGetReportCategories = () => {
  const fetchReportCategories: QueryFunction<MachineReportCategoryReadResponseDtoType[], string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: { machineReportCategories: MachineReportCategoryReadResponseDtoType[] }
        }>(`/api/machine-report-categories`)
        .then(v => v.data.data.machineReportCategories)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    []
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_REPORT_CATEGORY_CONTROLLER,
    queryFn: fetchReportCategories,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-reports/status
export const useGetReportStatuses = (machineProjectId: string, machineReportCategoryIds: number[]) => {
  const fetchReportStatuses: QueryFunction<MachineReportStatusResponseDtoType[], string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: { machineReports: MachineReportStatusResponseDtoType[] }
        }>(
          `/api/machine-projects/${machineProjectId}/machine-reports/status?machineReportCategoryIds=${machineReportCategoryIds.join(', ')}`
        )
        .then(v => v.data.data.machineReports)

      console.log(`!!! queryFn ${data.queryKey}:`)

      return response
    },
    [machineProjectId, machineReportCategoryIds]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_REPORT.GET_MACHINE_REPORT_STATUSES(machineProjectId, machineReportCategoryIds),
    queryFn: fetchReportStatuses,
    enabled: machineReportCategoryIds.length > 0,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-inspection-opinions/summary
export const useGetInspectionOpinions = (machineProjectId: string) => {
  const fetchInspectionOpinions: QueryFunction<machineInspectionSummaryResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: machineInspectionSummaryResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-inspection-opinions/summary`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_INSPECTION_OPINION.GET_INSPECTION_OPINION(machineProjectId),
    queryFn: fetchInspectionOpinions,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// ------------------------- MachineProject 관련 -------------------------
// GET /api/machine-projects/{machineProjectId}/machine-project-engineers
export const useGetParticipatedEngineerList = (machineProjectId: string) => {
  const fetchParticipatedEngineers: QueryFunction<machineProjectEngineerDetailDtoType[], string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: { machineProjectEngineerResponseDtos: machineProjectEngineerDetailDtoType[] }
        }>(`/api/machine-projects/${machineProjectId}/machine-project-engineers`)
        .then(v => v.data.data.machineProjectEngineerResponseDtos)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PROJECT.GET_MACHINE_PROJECT_ENGINEERS(machineProjectId),
    queryFn: fetchParticipatedEngineers,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/schedule-tab
export const useGetMachineProjectScheduleTab = (machineProjectId: string) => {
  const fetchScheduleTab: QueryFunction<MachineProjectScheduleAndEngineerResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachineProjectScheduleAndEngineerResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/schedule-tab`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PROJECT.GET_MACHINE_PROJECT_SCHEDULE_TAB(machineProjectId),
    queryFn: fetchScheduleTab,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/machine-projects/{machineProjectId}/
export const useGetMachineProject = (machineProjectId: string) => {
  const fetchMachineProjectData: QueryFunction<MachineProjectResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachineProjectResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    enabled: machineProjectId !== '',
    queryKey: QUERY_KEYS.MACHINE_PROJECT.GET_MACHINE_PROJECT(machineProjectId),
    queryFn: fetchMachineProjectData,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

interface MachineProjectNoteUpdateResponseDto {
  version: number
  note: string
}

export const useMutateMachineProjectNote = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PROJECT.GET_MACHINE_PROJECT(machineProjectId)

  return useMutation<MachineProjectNoteUpdateResponseDto, AxiosError, MachineProjectNoteUpdateResponseDto>({
    mutationFn: async data => {
      const response = await auth.put<{ data: MachineProjectNoteUpdateResponseDto }>(
        `/api/machine-projects/${machineProjectId}/note`,
        data
      )

      return response.data.data
    },

    onSuccess: newNote => {
      queryClient.setQueryData(queryKey, (prev: MachineProjectResponseDtoType) => ({
        ...prev,
        note: newNote.note,
        version: newNote.version
      }))
      console.log('useMutateMachineProjectNote.')
      toast.info('특이사항이 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

export const useMutateMachineProjectName = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const machineProjectQueryKey = QUERY_KEYS.MACHINE_PROJECT.GET_MACHINE_PROJECT(machineProjectId)

  return useMutation<SafetyProjectNameUpdateResponseDtoType, AxiosError, SafetyProjectNameUpdateRequestDtoType>({
    mutationFn: async data => {
      const response = await auth
        .put<{
          data: SafetyProjectNameUpdateResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/name`, data)
        .then(v => v.data.data)

      return response
    },

    onSuccess: newName => {
      queryClient.setQueryData(machineProjectQueryKey, (prev: MachineProjectResponseDtoType) => ({
        ...prev,
        machineProjectName: newName.projectName,
        version: newName.version
      }))
      queryClient.removeQueries({ queryKey: ['GET_MACHINE_PROJECTS'] })
      console.log('useMutateMachineProjectName.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects
export const useGetMachineProjects = (queryParams: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PROJECT.GET_MACHINE_PROJECTS(queryParams),
    queryFn: async data => {
      const [keyType, queryParams] = data.queryKey
      const params = new URLSearchParams(queryParams)

      if (!params.has('size')) {
        params.set('size', '15')
      }

      const response = await auth
        .get<{
          data: successResponseDtoType<MachineProjectPageDtoType[]>
        }>(`/api/machine-projects?${params}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType}:`)

      return response
    }
  })
}

// ------------------------- Safety Project 관련 -------------------------
// GET /api/machine-projects
export const useGetSafetyProjects = (queryParams: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECTS(queryParams),
    queryFn: async data => {
      const [keyType, queryParams] = data.queryKey
      const params = new URLSearchParams(queryParams)

      if (!params.has('size')) {
        params.set('size', '15')
      }

      const response = await auth
        .get<{
          data: successResponseDtoType<SafetyProjectPageResponseDtoType[]>
        }>(`/api/safety/projects?${params}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType}:`)

      return response
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/
export const useGetSafetyProject = (safetyProjectId: string) => {
  const fetchSafetyProjectData: QueryFunction<SafetyProjectReadResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: SafetyProjectReadResponseDtoType
        }>(`/api/safety/projects/${safetyProjectId}`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [safetyProjectId]
  )

  return useQuery({
    enabled: safetyProjectId !== '',
    queryKey: QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT(safetyProjectId),
    queryFn: fetchSafetyProjectData
  })
}

export const useMutateSafetyProject = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT(safetyProjectId)

  return useMutation<SafetyProjectUpdateResponseDtoType, AxiosError, SafetyProjectUpdateRequestDtoType>({
    mutationFn: async data => {
      const response = await auth
        .patch<{
          data: SafetyProjectUpdateResponseDtoType
        }>(`/api/safety/projects/${safetyProjectId}`, data)
        .then(v => v.data.data)

      return response
    },

    onSuccess: newData => {
      queryClient.setQueryData(queryKey, (prev: SafetyProjectReadResponseDtoType) => ({
        ...prev,
        ...newData
      }))
      queryClient.removeQueries({ queryKey: ['GET_SAFETY_PROJECTS'] })

      console.log('useMutateSafetyProject.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

export const useMutatePutSafetyProjectAttachment = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT(safetyProjectId)

  return useMutation<
    SafetyProjectAttachmentUpdateResponseDtoType,
    AxiosError,
    SafetyProjectAttachmentUpdateRequestDtoType
  >({
    mutationFn: async data => {
      const response = await auth
        .put<{
          data: SafetyProjectAttachmentUpdateResponseDtoType
        }>(`/api/safety/projects/${safetyProjectId}/attachments`, data)
        .then(v => v.data.data)

      return response
    },

    onSuccess: newAttachment => {
      queryClient.setQueryData(queryKey, (prev: SafetyProjectReadResponseDtoType) => {
        const newAttachments = prev.attachments.map(v =>
          v.safetyProjectAttachmentId === newAttachment.safetyProjectAttachmentId
            ? { ...v, originalFileName: newAttachment.originalFileName, presignedUrl: newAttachment.presignedUrl }
            : v
        )

        return { ...prev, attachments: newAttachments }
      })
      console.log('useMutatePutSafetyProjectAttachment.')
      toast.info('첨부파일 수정이 완료되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

export const useMutatePostSafetyProjectAttachment = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT(safetyProjectId)

  return useMutation<
    SafetyProjectAttachmentCreateResponseDtoType,
    AxiosError,
    SafetyProjectAttachmentCreateRequestDtoType & { presignedUrl: string }
  >({
    mutationFn: async data => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { presignedUrl, ...rest } = data

      const response = await auth
        .post<{
          data: SafetyProjectAttachmentCreateResponseDtoType
        }>(`/api/safety/projects/${safetyProjectId}/attachments`, rest)
        .then(v => v.data.data)

      return response
    },

    onSuccess: (newAttachment, request) => {
      queryClient.setQueryData(queryKey, (prev: SafetyProjectReadResponseDtoType) => {
        const newAttachments = prev.attachments.push({
          safetyProjectAttachmentId: newAttachment.safetyProjectAttachmentId,
          safetyAttachmentType: request.safetyAttachmentType,
          originalFileName: request.originalFileName,
          presignedUrl: request.presignedUrl
        })

        return { ...prev, attachments: newAttachments }
      })
      console.log('useMutatePutSafetyProjectAttachment.')
      toast.info('첨부파일 생성이 완료되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

export const useMutateSafetyProjectName = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT(safetyProjectId)

  return useMutation<SafetyProjectNameUpdateResponseDtoType, AxiosError, SafetyProjectNameUpdateRequestDtoType>({
    mutationFn: async data => {
      const response = await auth
        .patch<{
          data: SafetyProjectNameUpdateResponseDtoType
        }>(`/api/safety/projects/${safetyProjectId}/name`, data)
        .then(v => v.data.data)

      return response
    },

    onSuccess: newName => {
      queryClient.setQueryData(queryKey, (prev: SafetyProjectReadResponseDtoType) => ({
        ...prev,
        name: newName.projectName,
        version: newName.version
      }))
      queryClient.removeQueries({ queryKey: ['GET_SAFETY_PROJECTS'] })

      console.log('useMutateSafetyProjectName.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

export const useMutateSafetyProjectSpecialNote = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT(safetyProjectId)

  return useMutation<SafetyProjectNoteUpdateResponseDtoType, AxiosError, SafetyProjectNoteUpdateRequestDtoType>({
    mutationFn: async data => {
      const response = await auth
        .patch<{
          data: SafetyProjectNoteUpdateResponseDtoType
        }>(`/api/safety/projects/${safetyProjectId}/special-note`, data)
        .then(v => v.data.data)

      return response
    },

    onSuccess: newNote => {
      queryClient.setQueryData(queryKey, (prev: SafetyProjectReadResponseDtoType) => ({
        ...prev,
        specialNote: newNote.specialNote,
        version: newNote.version
      }))
      console.log('useMutateMachineProjectNote.')
      toast.info('특이사항이 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/safety/projects/{safetyProjectId}/schedule-tab
export const useGetSafetyProjectScheduleTab = (safetyProjectId: string) => {
  const fetchSafetyProjectScheduleTab: QueryFunction<SafetyProjectScheduleAndEngineerResponseDtoType, string[]> =
    useCallback(
      async data => {
        const response = await auth
          .get<{
            data: SafetyProjectScheduleAndEngineerResponseDtoType
          }>(`/api/safety/projects/${safetyProjectId}/schedule-tab`)
          .then(v => v.data.data)

        const [keyType] = data.queryKey

        console.log(`!!! queryFn ${keyType}:`)

        return response
      },
      [safetyProjectId]
    )

  return useQuery({
    queryKey: QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT_SCHEDULE_TAB(safetyProjectId),
    queryFn: fetchSafetyProjectScheduleTab,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

export const useMutateSafetyProjectSchedule = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT_SCHEDULE_TAB(safetyProjectId)

  return useMutation<SafetyProjectScheduleUpdateResponseDtoType, AxiosError, SafetyProjectScheduleUpdateRequestDtoType>(
    {
      mutationFn: async data => {
        const response = await auth
          .put<{
            data: SafetyProjectScheduleUpdateResponseDtoType
          }>(`/api/safety/projects/${safetyProjectId}/schedule`, data)
          .then(v => v.data.data)

        return response
      },

      onSuccess: newData => {
        queryClient.setQueryData(queryKey, (prev: SafetyProjectReadResponseDtoType) => ({
          ...prev,
          ...newData
        }))
        queryClient.removeQueries({ queryKey: ['GET_SAFETY_PROJECTS'] })

        console.log('useMutateSafetyProjectSchedule.')
      },

      onError: error => {
        console.error(error)
        handleApiError(error)
      }
    }
  )
}

export const useMutateSafetyProjectEngineers = (safetyProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECT_SCHEDULE_TAB(safetyProjectId)

  return useMutation<
    SafetyProjectEngineerUpdateResponseDtoType[],
    AxiosError,
    SafetyProjectEngineerUpdateRequestDtoType[]
  >({
    mutationFn: async data => {
      const response = await auth
        .put<{
          data: { safetyProjectEngineers: SafetyProjectEngineerUpdateResponseDtoType[] }
        }>(`/api/safety/projects/${safetyProjectId}/safety-project-engineers`, { engineers: data })
        .then(v => v.data.data.safetyProjectEngineers)

      return response
    },

    onSuccess: response => {
      queryClient.setQueryData(queryKey, (prev: SafetyProjectScheduleAndEngineerResponseDtoType) => {
        return {
          ...prev,
          engineers: response
        } as SafetyProjectScheduleAndEngineerResponseDtoType
      })
      console.log('useMutateSafetyProjectEngineers.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// ------------------------- Engineer 관련 -------------------------
// GET /api/machine-projects/{machineProjectId}/machine-project-engineers
export const useGetEngineersOptions = (engineerType: engineerTypeType = 'MACHINE') => {
  const fetchEngineersOptions: QueryFunction<MachineEngineerOptionResponseDtoType[], string[]> = useCallback(
    async data => {
      const [keyType, engineerType] = data.queryKey

      const response = await auth
        .get<{
          data: { engineers: MachineEngineerOptionResponseDtoType[] }
        }>(`/api/engineers/options?engineerType=${engineerType}`)
        .then(v => v.data.data.engineers)

      console.log(`!!! queryFn ${keyType}_${engineerType}:`)

      return response
    },
    []
  )

  return useQuery({
    queryKey: QUERY_KEYS.ENGINEER.GET_ENGINEERS_OPTIONS(engineerType),
    queryFn: fetchEngineersOptions,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/engineers
export const useGetEngineers = (queryParams: string, engineerType: engineerTypeType = 'MACHINE') => {
  const fetchEngineers: QueryFunction<
    successResponseDtoType<MachineEngineerPageResponseDtoType[]>,
    string[]
  > = useCallback(async data => {
    const [keyType, engineerType, queryParams] = data.queryKey

    const params = new URLSearchParams(queryParams)

    if (!params.has('size')) {
      params.set('size', '15')
    }

    params.set('engineerType', engineerType)

    const response = await auth
      .get<{
        data: successResponseDtoType<MachineEngineerPageResponseDtoType[]>
      }>(`/api/engineers?${params}`)
      .then(v => v.data.data)

    console.log(`!!! queryFn ${keyType}_${engineerType} ${params}:`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.ENGINEER.GET_ENGINEERS(engineerType, queryParams),
    queryFn: fetchEngineers,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/engineers/by-member/{memberId}
export const useGetEngineerByMemberId = (memberId: string, engineerType: engineerTypeType = 'MACHINE') => {
  const fetchEngineer: QueryFunction<EngineerBasicResponseDtoType, string[]> = useCallback(
    async data => {
      const [keyType, engineerType] = data.queryKey

      const response = await auth
        .get<{
          data: EngineerBasicResponseDtoType
        }>(`/api/engineers/by-member/${memberId}?engineerType=${engineerType}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType}_${engineerType}:`)

      return response
    },
    [memberId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.ENGINEER.GET_ENGINEER_BY_MEMBERID(engineerType, memberId),
    queryFn: fetchEngineer,
    staleTime: 1000 * 60 * 5, // 5분
    enabled: Number(memberId) > 0
  })
}

// GET api/engineers/[engineerId]
export const useGetEngineer = (engineerId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ENGINEER.GET_ENGINEER(engineerId),
    queryFn: async data => {
      const [keyType, engineerId] = data.queryKey

      const response = await auth
        .get<{ data: EngineerResponseDtoType }>(`/api/engineers/${engineerId}`)
        .then(v => v.data.data)

      console.log(`!!! queryFn ${keyType}`)

      return response
    },
    enabled: Number(engineerId) > 0
  })
}

export const useMutateEngineer = (engineerId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.ENGINEER.GET_ENGINEER(engineerId)

  const putLicense = async ({ data }: { data: EngineerResponseDtoType }) => {
    const response = await auth.put<{ data: EngineerResponseDtoType }>(`/api/engineers/${engineerId}`, data)

    return response.data.data
  }

  return useMutation<EngineerResponseDtoType, AxiosError, EngineerResponseDtoType>({
    mutationFn: data => putLicense({ data }),

    onSuccess: data => {
      queryClient.setQueryData(queryKey, data)
      queryClient.removeQueries({ queryKey: ['GET_SAFETY_PROJECT_SCHEDULE_TAB'] })
      console.log('EngineerResponseDtoType가 성공적으로 수정되었습니다.')
    },

    onError: error => {
      console.error(error)
    },
    throwOnError: true
  })
}

// ------------------------- Member 관련 -------------------------
// GET /api/members
export const useGetMembers = (queryParams: string) => {
  const fetchMembers: QueryFunction<successResponseDtoType<MemberPageDtoType[]>, string[]> = useCallback(async data => {
    const [keyType, queryParams] = data.queryKey

    const params = new URLSearchParams(queryParams)

    if (!params.has('size')) {
      params.set('size', '15')
    }

    const response = await auth
      .get<{
        data: successResponseDtoType<MemberPageDtoType[]>
      }>(`/api/members?${params}`)
      .then(v => v.data.data)

    console.log(`!!! queryFn ${keyType} ${params}:`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.GET_MEMBERS(queryParams),
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// GET /api/members/lookup
export const useGetMembersLookup = () => {
  const fetchMembers: QueryFunction<MemberLookupResponseDtoType[], string[]> = useCallback(async data => {
    const [keyType] = data.queryKey

    const response = await auth
      .get<{
        data: { memberLookupResponseDtos: MemberLookupResponseDtoType[] }
      }>(`/api/members/lookup`)
      .then(v => v.data.data.memberLookupResponseDtos)

    console.log(`!!! queryFn ${keyType}`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.GET_MEMBERS_LOOKUP,
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

export const useGetSingleMember = (memberId: string) => {
  const fetchMember: QueryFunction<MemberDetailResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MemberDetailResponseDtoType
        }>(`/api/members/${memberId}`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [memberId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.GET_SINGLE_MEMBER(memberId),
    queryFn: fetchMember,
    enabled: Number(memberId) > 0,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

export const useMutateSingleMemberBasic = (memberId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MEMBER.GET_SINGLE_MEMBER(memberId)

  const putSingleMemberBasic = async (memberId: string, data: MemberBasicDtoType) => {
    if (Number(memberId) <= 0) {
      throw new Error('수정하려는 memberId가 0 이하입니다')
    }

    const response = await auth
      .put<{ data: MemberBasicDtoType }>(`/api/members/${memberId}`, data)
      .then(v => v.data.data)

    return response
  }

  return useMutation<MemberBasicDtoType, AxiosError, MemberBasicDtoType>({
    mutationFn: data => putSingleMemberBasic(memberId, data),

    onSuccess: newMemberBasicData => {
      queryClient.setQueryData(queryKey, (prev: MemberDetailResponseDtoType) => ({
        ...prev,
        memberBasicResponseDto: newMemberBasicData
      }))
      console.log('member basic info가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

export type MemberType = 'basic' | 'privacy' | 'office' | 'career' | 'etc'

const memberRequestInfo: Record<MemberType, { url: string; dtoKey: keyof MemberDetailResponseDtoType }> = {
  basic: { url: '', dtoKey: 'memberBasicResponseDto' },
  privacy: { url: '/member-privacy', dtoKey: 'memberPrivacyResponseDto' },
  office: { url: '/member-office', dtoKey: 'memberOfficeResponseDto' },
  career: { url: '/member-career', dtoKey: 'memberCareerResponseDto' },
  etc: { url: '/member-etc', dtoKey: 'memberEtcResponseDto' }
}

// 직원 수정 단일화
export const useMutateSingleMember = <
  T = MemberBasicDtoType | MemberPrivacyDtoType | MemberOfficeDtoType | MemberCareerDtoType | MemberEtcDtoType
>(
  memberId: string,
  memberType: MemberType
) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MEMBER.GET_SINGLE_MEMBER(memberId)
  const requestInfo = memberRequestInfo[memberType]

  const putSingleMember = async (memberId: string, data: T) => {
    if (Number(memberId) <= 0) {
      throw new Error('수정하려는 memberId가 0 이하입니다')
    }

    const response = await auth
      .put<{
        data: T
      }>(`/api/members/${memberId}${requestInfo.url}`, data)
      .then(v => v.data.data)

    return response
  }

  return useMutation<T, AxiosError, T>({
    mutationFn: data => putSingleMember(memberId, data),

    onSuccess: data => {
      queryClient.setQueryData(queryKey, (prev: MemberDetailResponseDtoType) => ({
        ...prev,
        [requestInfo.dtoKey]: { ...prev[requestInfo.dtoKey], ...data }
      }))
      console.log(`member ${memberType} info가 성공적으로 저장되었습니다.`)
    },

    onError: error => {
      console.error(error)
    }
  })
}

export const useGetJuminNumView = (memberId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.GET_JUMIN_NUM_VIEW(memberId),
    queryFn: async data => {
      const queryKey = data.queryKey
      const [keyType, memberId] = queryKey

      const fullJuminNum = await auth
        .post<{ data: { juminNum: string } }>(`/api/members/jumin-num/view`, { memberId: memberId })
        .then(v => v.data.data.juminNum)

      console.log(`!!! queryFn ${keyType}`)

      return fullJuminNum
    },
    enabled: Number(memberId) > 0
  })
}

// ------------------------- 성능점검시 검토사항 관련 -------------------------
// GET /api/machine-projects/{machineProjectId}/machine-performance-review/yearly-plan 연도별 계획
export const useGetYearlyPlan = (machineProjectId: string) => {
  const fetchYearlyPlan: QueryFunction<MachinePerformanceReviewYearlyPlanResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachinePerformanceReviewYearlyPlanResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/yearly-plan`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_YEARLY_PLAN(machineProjectId),
    queryFn: fetchYearlyPlan,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// --- [1] Yearly Plan (연도별 계획) Mutation ---
const putYearlyPlanData = async ({
  machineProjectId,
  data
}: {
  machineProjectId: string
  data: MachinePerformanceReviewYearlyPlanResponseDtoType
}) => {
  const response = await auth.put<{ data: MachinePerformanceReviewYearlyPlanResponseDtoType }>(
    `/api/machine-projects/${machineProjectId}/machine-performance-review/yearly-plan`,
    data
  )

  return response.data.data
}

export const useMutateYearlyPlan = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_YEARLY_PLAN(machineProjectId)

  return useMutation<
    MachinePerformanceReviewYearlyPlanResponseDtoType,
    AxiosError,
    MachinePerformanceReviewYearlyPlanResponseDtoType
  >({
    mutationFn: data => putYearlyPlanData({ machineProjectId, data }),

    onSuccess: newYearlyPlanData => {
      queryClient.setQueryData(queryKey, newYearlyPlanData)
      console.log('연도별 계획 정보가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// --- [1-A] Yearly Plan Auto Fill (연도별 계획 자동채우기) Mutation ---
export const useMutateYearlyPlanAutoFill = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_YEARLY_PLAN(machineProjectId)

  return useMutation<MachinePerformanceReviewYearlyPlanResponseDtoType, AxiosError>({
    mutationFn: async () => {
      const response = await auth.put<{ data: MachinePerformanceReviewYearlyPlanResponseDtoType }>(
        `/api/machine-projects/${machineProjectId}/machine-performance-review/yearly-plan/auto-fill`
      )

      return response.data.data
    },

    onSuccess: newYearlyPlanData => {
      queryClient.setQueryData(queryKey, newYearlyPlanData)
      console.log('연도별 계획 자동채우기 정보가 성공적으로 반영되었습니다.')
      toast.info('연도별 계획 자동채우기를 완료했습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/result-summary 성능점검시 검토사항 - 결과요약
export const useGetResultSummary = (machineProjectId: string) => {
  const fetchResultSummary: QueryFunction<MachinePerformanceReviewSummaryResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachinePerformanceReviewSummaryResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/result-summary`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_RESULT_SUMMARY(machineProjectId),
    queryFn: fetchResultSummary,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// --- [2] Result Summary (결과요약) Mutation ---

export const useMutateResultSummary = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_RESULT_SUMMARY(machineProjectId)

  const putResultSummaryData = async ({
    machineProjectId,
    data
  }: {
    machineProjectId: string
    data: MachinePerformanceReviewSummaryResponseDtoType
  }) => {
    const response = await auth.put<{ data: MachinePerformanceReviewSummaryResponseDtoType }>(
      `/api/machine-projects/${machineProjectId}/machine-performance-review/result-summary`,
      data
    )

    return response.data.data
  }

  return useMutation<
    MachinePerformanceReviewSummaryResponseDtoType,
    AxiosError,
    MachinePerformanceReviewSummaryResponseDtoType
  >({
    mutationFn: data => putResultSummaryData({ machineProjectId, data }),

    onSuccess: newSummaryData => {
      queryClient.setQueryData(queryKey, newSummaryData)
      console.log('결과요약 정보가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// --- [2-A] Result Summary Auto Fill (결과요약 자동채우기) Mutation ---

export const useMutateResultSummaryAutoFill = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_RESULT_SUMMARY(machineProjectId)

  return useMutation<machineInspectionSummaryResponseDtoType, AxiosError>({
    mutationFn: async () => {
      const response = await auth.put<{ data: machineInspectionSummaryResponseDtoType }>(
        `/api/machine-projects/${machineProjectId}/machine-performance-review/result-summary/auto-fill`
      )

      return response.data.data
    },

    onSuccess: newSummaryData => {
      queryClient.setQueryData(queryKey, newSummaryData)
      console.log('결과요약 자동채우기 정보가 성공적으로 반영되었습니다.')
      toast.info('연도별 계획 자동채우기를 완료했습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/operation-status 성능점검시 검토사항 - 작동상태
export const useGetOperationStatus = (machineProjectId: string) => {
  const fetchOperationStatus: QueryFunction<MachinePerformanceReviewOperationStatusResponseDtoType, string[]> =
    useCallback(
      async data => {
        const response = await auth
          .get<{
            data: MachinePerformanceReviewOperationStatusResponseDtoType
          }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/operation-status`)
          .then(v => v.data.data)

        const [keyType] = data.queryKey

        console.log(`!!! queryFn ${keyType}:`)

        return response
      },
      [machineProjectId]
    )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_OPERATION_STATUS(machineProjectId),
    queryFn: fetchOperationStatus,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// --- [3] Operation Status (작동상태) Mutation ---

const putOperationStatusData = async ({
  machineProjectId,
  data
}: {
  machineProjectId: string
  data: MachinePerformanceReviewOperationStatusResponseDtoType
}) => {
  const response = await auth.put<{ data: MachinePerformanceReviewOperationStatusResponseDtoType }>(
    `/api/machine-projects/${machineProjectId}/machine-performance-review/operation-status`,
    data
  )

  return response.data.data
}

export const useMutateOperationStatus = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_OPERATION_STATUS(machineProjectId)

  return useMutation<
    MachinePerformanceReviewOperationStatusResponseDtoType,
    AxiosError,
    MachinePerformanceReviewOperationStatusResponseDtoType
  >({
    mutationFn: data => putOperationStatusData({ machineProjectId, data }),

    onSuccess: newStatusData => {
      queryClient.setQueryData(queryKey, newStatusData)
      console.log('작동상태 정보가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// --- [3-A] Operation Status Auto Fill (작동상태 자동채우기) Mutation ---

export const useMutateOperationStatusAutoFill = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_OPERATION_STATUS(machineProjectId)

  return useMutation<MachinePerformanceReviewOperationStatusResponseDtoType, AxiosError>({
    mutationFn: async () => {
      const response = await auth.put<{ data: MachinePerformanceReviewOperationStatusResponseDtoType }>(
        `/api/machine-projects/${machineProjectId}/machine-performance-review/operation-status/auto-fill`
      )

      return response.data.data
    },

    onSuccess: newStatusData => {
      queryClient.setQueryData(queryKey, newStatusData)
      console.log('작동상태 자동채우기 정보가 성공적으로 반영되었습니다.')
      toast.info('작동상태 자동채우기를 완료했습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/measurement 성능점검시 검토사항 - 측정값 일치
export const useGetMeasurement = (machineProjectId: string) => {
  const fetchMeasurement: QueryFunction<MachinePerformanceReviewMeasurementResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachinePerformanceReviewMeasurementResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/measurement`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_MEASUREMENT(machineProjectId),
    queryFn: fetchMeasurement,
    staleTime: 1000 * 60 * 5, // 5분
    throwOnError: true
  })
}

// --- [4] Measurement (측정값 일치) Mutation ---

const putMeasurementData = async ({
  machineProjectId,
  data
}: {
  machineProjectId: string
  data: MachinePerformanceReviewMeasurementResponseDtoType
}) => {
  const response = await auth.put<{ data: MachinePerformanceReviewMeasurementResponseDtoType }>(
    `/api/machine-projects/${machineProjectId}/machine-performance-review/measurement`,
    data
  )

  return response.data.data
}

export const useMutateMeasurement = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_MEASUREMENT(machineProjectId)

  return useMutation<
    MachinePerformanceReviewMeasurementResponseDtoType,
    AxiosError,
    MachinePerformanceReviewMeasurementResponseDtoType
  >({
    mutationFn: data => putMeasurementData({ machineProjectId, data }),

    onSuccess: newMeasurementData => {
      queryClient.setQueryData(queryKey, newMeasurementData)
      console.log('측정값 일치 정보가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// --- [4-A] Measurement Auto Fill (측정값 일치 자동채우기) Mutation ---
export const useMutateMeasurementAutoFill = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_MEASUREMENT(machineProjectId)

  return useMutation<MachinePerformanceReviewMeasurementResponseDtoType, AxiosError>({
    mutationFn: async () => {
      const response = await auth.put<{ data: MachinePerformanceReviewMeasurementResponseDtoType }>(
        `/api/machine-projects/${machineProjectId}/machine-performance-review/measurement/auto-fill`
      )

      return response.data.data
    },

    onSuccess: newMeasurementData => {
      queryClient.setQueryData(queryKey, newMeasurementData)
      console.log('측정값 일치 자동채우기 정보가 성공적으로 반영되었습니다.')
      toast.info('측정값 일치 자동채우기를 완료했습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/improvement 성능점검시 검토사항 - 개선사항
export const useGetImprovement = (machineProjectId: string) => {
  const fetchImprovement: QueryFunction<MachinePerformanceReviewImprovementResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachinePerformanceReviewImprovementResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/improvement`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_IMPROVEMENT(machineProjectId),
    queryFn: fetchImprovement,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// --- [5] Improvement (개선사항) Mutation ---

const putImprovementData = async ({
  machineProjectId,
  data
}: {
  machineProjectId: string
  data: MachinePerformanceReviewImprovementResponseDtoType
}) => {
  const response = await auth.put<{ data: MachinePerformanceReviewImprovementResponseDtoType }>(
    `/api/machine-projects/${machineProjectId}/machine-performance-review/improvement`,
    data
  )

  return response.data.data
}

export const useMutateImprovement = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_IMPROVEMENT(machineProjectId)

  return useMutation<
    MachinePerformanceReviewImprovementResponseDtoType,
    AxiosError,
    MachinePerformanceReviewImprovementResponseDtoType
  >({
    mutationFn: data => putImprovementData({ machineProjectId, data }),

    onSuccess: newImprovementData => {
      queryClient.setQueryData(queryKey, newImprovementData)
      console.log('개선사항 정보가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// --- [5-A] Improvement Auto Fill (개선사항 자동채우기) Mutation ---
export const useMutateImprovementAutoFill = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_IMPROVEMENT(machineProjectId)

  return useMutation<MachinePerformanceReviewImprovementResponseDtoType, AxiosError>({
    mutationFn: async () => {
      const response = await auth.put<{ data: MachinePerformanceReviewImprovementResponseDtoType }>(
        `/api/machine-projects/${machineProjectId}/machine-performance-review/improvement/auto-fill`
      )

      return response.data.data
    },

    onSuccess: newImprovementData => {
      queryClient.setQueryData(queryKey, newImprovementData)
      console.log('개선사항 자동채우기 정보가 성공적으로 반영되었습니다.')
      toast.info('개선사항 자동채우기를 완료했습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/aging 성능점검시 검토사항 - 노후도
export const useGetAging = (machineProjectId: string) => {
  const fetchAging: QueryFunction<MachinePerformanceReviewAgingReadResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachinePerformanceReviewAgingReadResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/aging`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_AGING(machineProjectId),
    queryFn: fetchAging,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// --- [6] Aging (노후도) Mutation ---

const putAgingData = async ({
  machineProjectId,
  data
}: {
  machineProjectId: string
  data: MachinePerformanceReviewAgingUpdateResponseDtoType
}) => {
  // 노후도의 응답 DTO는 Read DTO이지만, 업데이트 요청 시에도 동일한 DTO 형태를 사용할 수 있다고 가정합니다.
  const response = await auth.put<{ data: MachinePerformanceReviewAgingUpdateResponseDtoType }>(
    `/api/machine-projects/${machineProjectId}/machine-performance-review/aging`,
    data
  )

  return response.data.data
}

export const useMutateAging = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_AGING(machineProjectId)

  return useMutation<
    MachinePerformanceReviewAgingUpdateResponseDtoType,
    AxiosError,
    MachinePerformanceReviewAgingUpdateResponseDtoType
  >({
    mutationFn: data => putAgingData({ machineProjectId, data }),

    onSuccess: newAgingData => {
      queryClient.setQueryData(queryKey, (prev: MachinePerformanceReviewAgingReadResponseDtoType) => ({
        ...prev,
        ...newAgingData
      }))
      console.log('노후도 정보가 성공적으로 저장되었습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// --- [6-A] Aging Auto Fill (노후도 자동채우기) Mutation ---
export const useMutateAgingAutoFill = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_AGING(machineProjectId)

  return useMutation<MachinePerformanceReviewAgingUpdateResponseDtoType, AxiosError>({
    mutationFn: async () => {
      const response = await auth.put<{
        data: MachinePerformanceReviewAgingUpdateResponseDtoType
      }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/aging/auto-fill`)

      return response.data.data
    },

    onSuccess: newAgingData => {
      queryClient.setQueryData(queryKey, (prev: MachinePerformanceReviewAgingReadResponseDtoType) => ({
        ...prev,
        ...newAgingData
      }))
      console.log('노후도 자동채우기 정보가 성공적으로 반영되었습니다.')
      toast.info('노후도 자동채우기를 완료했습니다.')
    },

    onError: error => {
      console.error(error)
      handleApiError(error)
    }
  })
}

// GET /api/machine-projects/{machineProjectId}/machine-performance-review/guide 성능점검시 검토사항 - 유지관리지침서
export const useGetGuide = (machineProjectId: string) => {
  const fetchGuide: QueryFunction<MachinePerformanceReviewGuideResponseDtoType, string[]> = useCallback(
    async data => {
      const response = await auth
        .get<{
          data: MachinePerformanceReviewGuideResponseDtoType
        }>(`/api/machine-projects/${machineProjectId}/machine-performance-review/guide`)
        .then(v => v.data.data)

      const [keyType] = data.queryKey

      console.log(`!!! queryFn ${keyType}:`)

      return response
    },
    [machineProjectId]
  )

  return useQuery({
    queryKey: QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_GUIDE(machineProjectId),
    queryFn: fetchGuide,
    staleTime: 1000 * 60 * 5 // 5분
  })
}

// --- [7] Guide (유지관리지침서) Mutation (기존 훅) ---
export const useMutateGuide = (machineProjectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.MACHINE_PERFORMANCE_REVIEW.GET_GUIDE(machineProjectId)

  // PUT 요청을 수행하는 함수
  const putGuideData = async ({
    machineProjectId,
    data
  }: {
    machineProjectId: string
    data: MachinePerformanceReviewGuideResponseDtoType
  }) => {
    const response = await auth.put<{ data: MachinePerformanceReviewGuideResponseDtoType }>(
      `/api/machine-projects/${machineProjectId}/machine-performance-review/guide`,
      data
    )

    return response.data.data
  }

  return useMutation<
    MachinePerformanceReviewGuideResponseDtoType,
    AxiosError,
    MachinePerformanceReviewGuideResponseDtoType
  >({
    mutationFn: data => putGuideData({ machineProjectId, data }),

    // 성공 시
    onSuccess: newGuideData => {
      // 쿼리 캐시를 최신 데이터로 업데이트 (옵션)
      queryClient.setQueryData(queryKey, newGuideData)

      // useGetGuide 쿼리를 무효화하여 최신 데이터를 다시 가져오도록 유도
      // queryClient.invalidateQueries({ queryKey: queryKey })

      console.log('유지관리지침서 정보가 성공적으로 저장되었습니다.')
    },

    // 실패 시
    onError: error => {
      console.log(error)
      handleApiError(error)
    }
  })
}

// ------------------------- 로그인 기록 관련 -------------------------
// GET /api/authentication/web/login-logs
export const useGetLoginLogs = (queryParams: string) => {
  const fetchLoginLogs: QueryFunction<LoginLogPageResponseDtoType, string[]> = useCallback(async data => {
    const [keyType, queryParams] = data.queryKey

    const params = new URLSearchParams(queryParams)

    if (!params.has('size')) {
      params.set('size', '20')
    }
    if (!params.has('page')) {
      params.set('page', '1')
    }

    const response = await phpAuth
      .get<PhpApiResult<LoginLogPageResponseDtoType>>(`/api/authentication/web/login-logs?${params}`)
      .then(v => {
        if (v.data.success && v.data.data) {
          return v.data.data
        }
        throw new Error(v.data.message || '로그인 기록 조회 실패')
      })

    console.log(`!!! queryFn ${keyType} ${params}:`)

    return response
  }, [])

  return useQuery({
    queryKey: QUERY_KEYS.LOGIN_LOG.GET_LOGIN_LOGS(queryParams),
    queryFn: fetchLoginLogs,
    staleTime: 1000 * 60 * 5 // 5분
  })
}
