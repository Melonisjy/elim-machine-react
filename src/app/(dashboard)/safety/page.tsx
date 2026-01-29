'use client'

// React Imports
import { useState, useCallback, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'

// Component Imports
import 'dayjs/locale/ko'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import dayjs from 'dayjs'

import { IconCopyPlusFilled, IconPlus, IconReload, IconTrashFilled } from '@tabler/icons-react'

import { Backdrop, CircularProgress, Typography, Chip, Box, Alert } from '@mui/material'

import { useQueryClient } from '@tanstack/react-query'


import type { SafetyProjectDtoType, SafetyProjectFilterType } from '@core/types'
import { TABLE_HEADER_INFO } from '@/@core/data/table/tableHeaderInfo'
import SearchBar from '@core/components/elim-inputbox/SearchBar'
import BasicTable from '@core/components/elim-table/BasicTable'
import AddSafetyProjectModal from './_components/AddSafetyProjectModal'
import { DEFAULT_PAGESIZE } from '@core/data/options'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'
import BasicTableFilter from '@/@core/components/elim-table/BasicTableFilter'
import { useGetEngineersOptions, useGetLicenseNames, useGetSafetyProjects, useGetSafetyEngineerFilter, useGetLicenseFilter } from '@core/hooks/customTanstackQueries'
import { QUERY_KEYS } from '@core/data/queryKeys'
import useUpdateParams from '@/@core/hooks/searchParams/useUpdateParams'
import useSetQueryParams from '@/@core/hooks/searchParams/useSetQueryParams'
import BasicTablePagination from '@core/components/elim-table/BasicTablePagination'
import { SAFETY_PROJECT_FILTER_INFO } from '@/@core/data/filter/safetyProjectFilterInfo'
import useSafetyProjectTabValueStore from '@/@core/hooks/zustand/useSafetyProjectTabValueStore'
import { formatNumber } from '@/utils/number'

// datepicker 한글화
dayjs.locale('ko')

type periodType = 0 | 1 | 3 | 6

// 현장점검 기간 버튼 옵션
const periodOptions: periodType[] = [1, 3, 6]

export default function SafetyPage() {
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()
  const router = useRouter()

  const page = Number(searchParams.get('page') ?? 0)
  const size = Number(searchParams.get('size') ?? DEFAULT_PAGESIZE)
  const placeName = searchParams.get('placeName')
  const fieldBeginDate = searchParams.get('fieldBeginDate')
  const fieldEndDate = searchParams.get('fieldEndDate')

  const setTabValue = useSafetyProjectTabValueStore(set => set.setTabValue)

  const [curMonth, setCurMonth] = useState<0 | 1 | 3 | 6 | null>(0)

  const [addModalOpen, setAddModalOpen] = useState(false)

  const {
    data: engineers,
  } = useGetEngineersOptions('SAFETY')

  const { data: licenseNames } = useGetLicenseNames()
  const { data: licenseFilter } = useGetLicenseFilter()
  const { data: safetyEngineerFilter } = useGetSafetyEngineerFilter()

  const {
    data: safetyProjectsPages,
    refetch: refetchPages,
    isLoading: isLoadingPages,
    isError
  } = useGetSafetyProjects(searchParams.toString())

  const safetyProjectsRaw = safetyProjectsPages?.items ?? []

  const safetyProjects: SafetyProjectDtoType[] = safetyProjectsRaw.map(p => {
    const raw =
      typeof p.engineers === 'string'
        ? JSON.parse(p.engineers)
        : p.engineers

    const engineerNames = Array.isArray(raw)
      ? (raw as { name: string }[]).map(e => e.name)
      : []

    return {
      ...p,
      engineers: engineerNames,
      grossArea:
        typeof p.grossArea === 'number'
          ? formatNumber(p.grossArea)
          : p.grossArea ?? '',
    }
  })


  const [loading, setLoading] = useState(false)

  const total_loading = loading || isLoadingPages
  const disabled = total_loading || isError

  const totalCount = safetyProjectsPages?.total ?? 0

  const EXTENDED_SAFETY_PROJECT_FILTER_INFO = useMemo(
    () => ({
      ...SAFETY_PROJECT_FILTER_INFO,
      engineerName: {
        ...SAFETY_PROJECT_FILTER_INFO.engineerName,
        options: safetyEngineerFilter
          ?.filter(
            engineer => engineer && engineer.engineerSeq != null
          )
          .map(engineer => ({
            value: engineer.engineerSeq.toString(),          // 쿼리에는 seq
            label: `${engineer.name} (${engineer.grade})`    // 화면 표시는 이름(+등급)
          }))
      },
      licenseName: {
        ...SAFETY_PROJECT_FILTER_INFO.licenseName,
        options: licenseNames?.map(l => ({
          value: l.id.toString(),
          label: l.licenseName
        }))
      }
    }),
    [safetyEngineerFilter, licenseNames]
  )

  // params를 변경하는 함수를 입력하면 해당 페이지로 라우팅까지 해주는 함수
  const updateParams = useUpdateParams()

  type paramType = 'page' | 'size' | 'placeName' | 'region' | 'fieldBeginDate' | 'fieldEndDate'

  const setQueryParams = useSetQueryParams<paramType>()

  const resetQueryParams = useCallback(() => {
    updateParams(params => {
      params.delete('page')
      params.delete('placeName')
      params.delete('region')
      params.delete('fieldBeginDate')
      params.delete('fieldEndDate')
      params.delete('sort')

      const filterKeys = Object.keys(EXTENDED_SAFETY_PROJECT_FILTER_INFO)

      filterKeys.forEach(v => {
        const paramKey = v === 'licenseName' ? 'licenseSeq' : v === 'engineerName' ? 'engineerSeq' : v
        params.delete(paramKey)
      })
    })

    setCurMonth(null)
  }, [updateParams, EXTENDED_SAFETY_PROJECT_FILTER_INFO])

  const clearDateQueryParam = useCallback(() => {
    updateParams(params => {
      params.delete('fieldBeginDate')
      params.delete('fieldEndDate')
      params.set('page', '0')
    })
  }, [updateParams])

  // offset만큼 요소수가 변화했을 때 valid한 페이지 param을 책임지는 함수
  const adjustPage = useCallback(
    (offset = 0) => {
      const lastPageAfter = Math.max(Math.ceil((totalCount + offset) / size) - 1, 0)

      if (offset > 0 || page > lastPageAfter) {
        lastPageAfter > 0 ? setQueryParams({ page: lastPageAfter }) : updateParams(params => params.delete('page'))
      }
    },
    [page, setQueryParams, totalCount, size, updateParams]
  )

  // tanstack query cache 삭제 및 refetch
  const removeQueryCaches = useCallback(() => {
    refetchPages()

    queryClient.removeQueries({
      predicate(query) {
        const key = query.queryKey

        return (
          Array.isArray(key) &&
          key[0] === QUERY_KEYS.SAFETY_PROJECT.GET_SAFETY_PROJECTS(searchParams.toString())[0] &&
          key[1] !== searchParams.toString()
        ) // 스크롤 유지를 위해 현재 data는 refetch, 나머지는 캐시 지우기
      }
    })
  }, [refetchPages, queryClient, searchParams])

  /**
   * 요소를 하나 추가했을 때 첫번째 페이지로 설정하고 새로고침하는 함수
   */
  const handlePageWhenPlusOne = useCallback(() => {
    setQueryParams({ page: 0 })
    removeQueryCaches()
  }, [setQueryParams, removeQueryCaches])

  // 기계설비현장 선택 핸들러
  const handleSafetyProjectClick = async (safetyProject: SafetyProjectDtoType) => {
    if (!safetyProject?.num) return

    try {
      setTabValue('현장정보')
      router.push(`/safety/${safetyProject.num}`)
    } catch (error) {
      handleApiError(error, '프로젝트 정보를 불러오는 데 실패했습니다.')
    }
  }

  function onClickMonth(month: 0 | 1 | 3 | 6) {
    if (month === 0) {
      clearDateQueryParam()
    } else {
      const currentTime = dayjs()

      setQueryParams({
        fieldBeginDate: currentTime.subtract(month, 'month').format('YYYY-MM-DD'),
        fieldEndDate: currentTime.format('YYYY-MM-DD'),
        page: 0
      })
    }

    setCurMonth(month)
  }

  const handleDeleteRow = async (row: SafetyProjectDtoType) => {
    try {
      setLoading(true)
      await auth.delete(`/api/safety/projects/${row.num}`)
      adjustPage(-1)
      removeQueryCaches()
      handleSuccess(`${row.placeName}이(가) 삭제되었습니다`)
    } catch (e) {
      handleApiError(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyRow = async (row: SafetyProjectDtoType) => {
    try {
      setLoading(true)
      await auth.post(`/api/safety/projects/${row.num}/clone`)
      handlePageWhenPlusOne()
      handleSuccess(`${row.placeName}이(가) 복사되었습니다`)
    } catch (e) {
      handleApiError(e)
    } finally {
      setLoading(false)
    }

    return
  }

  const getActiveFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    const activeFilters: Array<{ key: string; label: string; value: string; displayValue: string }> = []

    Object.keys(EXTENDED_SAFETY_PROJECT_FILTER_INFO).forEach(filterKey => {
      const paramKey =
        filterKey === 'licenseName' ? 'licenseSeq'
          : filterKey === 'engineerName' ? 'engineerSeq'
            : filterKey

      const filterValue = params.get(paramKey)
      if (filterValue && filterValue !== '') {
        const filterInfo = EXTENDED_SAFETY_PROJECT_FILTER_INFO[filterKey as keyof SafetyProjectFilterType]
        const filterLabel = filterInfo.label

        if (filterInfo.type === 'multi') {
          const values = filterValue.split(',')

          values.forEach(value => {
            let displayValue = value

            if (filterKey === 'licenseName') {
              const license = licenseFilter?.find(l => String(l.licenseSeq) === value)
              displayValue = license?.name ?? value
            } else if (filterKey === 'engineerName') {
              const engineer = safetyEngineerFilter?.find(e => String(e.engineerSeq) === value)
              displayValue = engineer ? `${engineer.name} (${engineer.grade})` : value
            } else {
              const option = filterInfo.options?.find(opt => String(opt.value) === value)
              displayValue = option ? option.label : value
            }

            activeFilters.push({
              key: filterKey,
              label: filterLabel,
              value,
              displayValue
            })
          })
        }
      }
    })

    // 건물명 검색도 Chip으로 표시 (UsersPage의 name 필터와 동일 패턴)
    const placeNameValue = params.get('placeName')
    if (placeNameValue && placeNameValue !== '') {
      activeFilters.push({
        key: 'placeName',
        label: '건물명',
        value: placeNameValue,
        displayValue: placeNameValue
      })
    }

    return activeFilters
  }, [searchParams, EXTENDED_SAFETY_PROJECT_FILTER_INFO, engineers, licenseNames, safetyEngineerFilter, licenseFilter])

  const removeFilter = useCallback(
    (filterKey: string, filterValue: string) => {
      updateParams(params => {
        // placeName(건물명 검색)은 MEMBER_FILTER_INFO에 해당 키가 없으므로 바로 제거
        if (filterKey === 'placeName') {
          params.delete('placeName')
          params.delete('page')
          return
        }

        const paramKey = filterKey === 'licenseName' ? 'licenseSeq' : filterKey === 'engineerName' ? 'engineerSeq' : filterKey
        const currentValue = params.get(paramKey)

        if (!currentValue) return

        const filterInfo = EXTENDED_SAFETY_PROJECT_FILTER_INFO[filterKey as keyof SafetyProjectFilterType]

        // multi 타입인 경우 콤마로 구분된 값에서 제거
        if (filterInfo?.type === 'multi') {
          const values = currentValue.split(',').filter(v => v !== filterValue)

          if (values.length > 0) {
            params.set(paramKey, values.join(','))
          } else {
            params.delete(paramKey)
          }
        } else {
          // single 타입인 경우 전체 제거
          params.delete(paramKey)
        }

        // 필터 변경 시 페이지를 0으로 리셋
        params.delete('page')
      })
    },
    [updateParams, EXTENDED_SAFETY_PROJECT_FILTER_INFO]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
      <Backdrop
        open={loading}
        sx={theme => ({
          zIndex: theme.zIndex.modal + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          color: 'white'
        })}
      >
        <CircularProgress size={60} color='inherit' />
        <Typography variant='inherit'>요청을 처리하는 중</Typography>
      </Backdrop>
      <Card className='relative h-full flex flex-col'>
        <CardHeader
          slotProps={{ title: { typography: 'h4' } }}
          title={`안전진단현장 (${totalCount})`}
          className='pbe-4'
        />
        {/* 필터바 */}
        <BasicTableFilter<SafetyProjectFilterType>
          filterInfo={EXTENDED_SAFETY_PROJECT_FILTER_INFO}
          disabled={disabled}
        />

        {/* 활성화된 필터 Chip 표시 */}
        {getActiveFilters().length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6, pb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {getActiveFilters().map((filter, index) => (
                <Chip
                  key={`${filter.key}-${filter.value}-${index}`}
                  label={`${filter.label}: ${filter.displayValue}`}
                  onDelete={() => removeFilter(filter.key, filter.value)}
                  color='primary'
                  variant='outlined'
                  size='small'
                />
              ))}
            </Box>
            <Button
              startIcon={<IconReload />}
              onClick={resetQueryParams}
              size='small'
              disabled={disabled}
            >
              필터 초기화
            </Button>
          </Box>
        )}
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <div className='flex gap-8 items-center'>
            <div className='flex gap-2 flex-wrap'>
              {/* 건물명으로 검색 */}
              <SearchBar
                key={`projectName_${placeName}`}
                placeholder='건물명으로 검색'
                defaultValue={placeName ?? ''}
                setSearchKeyword={keyword => {
                  setQueryParams({ placeName: keyword, page: 0 })
                }}
                disabled={disabled}
              />
            </div>

            <div className='flex gap-4'>
              {/* 현장점검 기간 */}
              <div className='flex items-center gap-2 text-base'>
                <DatePicker
                  disabled={disabled}
                  label='점검 시작일'
                  value={fieldBeginDate ? dayjs(fieldBeginDate) : null}
                  format={'YYYY.MM.DD'}
                  onChange={date => {
                    setQueryParams({ fieldBeginDate: dayjs(date).format('YYYY-MM-DD'), page: 0 })
                    setCurMonth(null)
                  }}
                  showDaysOutsideCurrentMonth
                  slotProps={{ textField: { size: 'small' } }}
                  sx={{ p: 0, m: 0, width: 150 }}
                />
                <span>~</span>
                <DatePicker
                  disabled={disabled}
                  label='점검 종료일'
                  value={fieldEndDate ? dayjs(fieldEndDate) : null}
                  format={'YYYY.MM.DD'}
                  onChange={date => {
                    setQueryParams({ fieldEndDate: dayjs(date).format('YYYY-MM-DD'), page: 0 })
                    setCurMonth(null)
                  }}
                  showDaysOutsideCurrentMonth
                  slotProps={{ textField: { size: 'small' } }}
                  sx={{ p: 0, m: 0, width: 150 }}
                />
              </div>
              <div className='flex gap-2'>
                {periodOptions.map(month => (
                  <Button
                    className='whitespace-nowrap'
                    onClick={() => onClickMonth(month)}
                    disabled={disabled}
                    key={month}
                    variant='contained'
                    color={curMonth === month ? 'info' : 'primary'}
                  >
                    {month}개월
                  </Button>
                ))}
                <Button
                  className='whitespace-nowrap'
                  onClick={() => onClickMonth(0)}
                  disabled={disabled}
                  variant='contained'
                  color={curMonth === 0 ? 'success' : 'primary'}
                >
                  전체
                </Button>
              </div>
            </div>
          </div>
          {/* 안전진단현장 추가 버튼 */}
          <Button
            variant='contained'
            startIcon={<IconPlus />}
            onClick={() => setAddModalOpen(!addModalOpen)}
            className='max-sm:is-full whitespace-nowrap'
            disabled={disabled}
          >
            추가
          </Button>
        </div>
        <Alert severity="info" sx={{ mx: 3, mb: 2 }}>
          <Typography variant="body2">
            우클릭으로 현장을 삭제하거나 복사할 수 있습니다
          </Typography>
        </Alert>
        {/* 테이블 */}
        <div className='flex-1 overflow-y-hidden'>
          <BasicTable<SafetyProjectDtoType>
            header={TABLE_HEADER_INFO.safetyProject}
            data={safetyProjects}
            handleRowClick={handleSafetyProjectClick}
            loading={isLoadingPages}
            error={isError}
            listException={['engineers']}
            rightClickMenuHeader={contextMenu => {
              return contextMenu.row['placeName']
            }}
            rightClickMenu={[
              { icon: <IconCopyPlusFilled size={20} color='gray' />, label: '복사', handleClick: handleCopyRow },
              {
                icon: <IconTrashFilled size={20} color='gray' />,
                label: '삭제',
                handleClick: handleDeleteRow
              }
            ]}
          />
        </div>
        <BasicTablePagination totalCount={totalCount} disabled={disabled} />
      </Card>
      {/* 생성 모달 */}
      {
        addModalOpen && (
          <AddSafetyProjectModal open={addModalOpen} setOpen={setAddModalOpen} reloadPage={handlePageWhenPlusOne} />
        )
      }
    </LocalizationProvider >
  )
}
