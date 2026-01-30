'use client'

import { useState, useCallback, createContext, useContext, useMemo } from 'react'

// MUI Imports
import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import { IconBoltOff, IconPlus, IconReload } from '@tabler/icons-react'

import { useQueryClient } from '@tanstack/react-query'

import { Alert, Backdrop, CircularProgress, Typography } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import type { EngineerFilterType, engineerTypeType, MachineEngineerRowDtoType, SafetyEngineerPageResponseDtoType, SafetyEngineerRowDtoType, successResponseDtoType } from '@core/types'
import { TABLE_HEADER_INFO } from '@/@core/data/table/tableHeaderInfo'
import BasicTable from '@core/components/elim-table/BasicTable'
import SearchBar from '@core/components/elim-inputbox/SearchBar'
import { DEFAULT_PAGESIZE, PageSizeOptions } from '@core/data/options'
import { ENGINEER_FILTER_INFO } from '@core/data/filter/engineerFilterInfo'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'

import { useGetEngineer, useGetMachineEngineers, useGetEngineersOptions, useGetSafetyEngineers, useGetLicenseFilter } from '@core/hooks/customTanstackQueries'
import BasicTableFilter from '@/@core/components/elim-table/BasicTableFilter'
import useUpdateParams from '@/@core/hooks/searchParams/useUpdateParams'
import useSetQueryParams from '@/@core/hooks/searchParams/useSetQueryParams'
import useFilterChips from '@core/hooks/useFilterChips'
import FilterChipBar from '@core/components/elim-table/FilterChipBar'
import BasicTablePagination from '@core/components/elim-table/BasicTablePagination'
import deleteEngineer from '../../utils/deleteEngineer'
import AddEngineerModal from './AddEngineerModal'
import EngineerModal from './EngineerModal'

const engineerTypeContext = createContext<engineerTypeType | null>(null)

export function useEngineerTypeContext() {
  const engineerType = useContext(engineerTypeContext)

  if (!engineerType) throw new Error('error in engineerTypeContext')

  return engineerType
}

/**
 * @type T
 * MachineEngineerPageResponseDtoType
 * @type K
 * MachineDetialResponseDtoType
 * @returns
 */
export default function EngineerPage({ engineerType = 'MACHINE' }: { engineerType?: engineerTypeType }) {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const { data: licenseFilter } = useGetLicenseFilter()


  const engineerTerm = ({ MACHINE: '기계설비 기술자', SAFETY: '안전진단 기술자' } as Record<engineerTypeType, string>)[
    engineerType
  ]

  const EXTENDED_ENGINEER_FILTER_INFO = useMemo(
    () => ({
      ...ENGINEER_FILTER_INFO,
      licenseName: {
        ...ENGINEER_FILTER_INFO.licenseName,
        options: licenseFilter?.map(l => ({
          value: String(l.licenseSeq),
          label: l.name,
        })),
      },
    }),
    [licenseFilter],
  )

  const { activeFilters, removeFilter } = useFilterChips<EngineerFilterType>({
    filterInfo: EXTENDED_ENGINEER_FILTER_INFO,
    extraTextFilters: [
      { key: 'name', label: '이름' },
      { key: 'projectName', label: '현장명' },
    ],
    paramKeyMapper: key =>
      key === 'licenseName' ? 'licenseSeq' // ✅ 회사 필터는 licenseSeq에 저장됨
        : key,
  })

  // 데이터 리스트
  const {
    data: engineersPages,
    refetch: refetchPages,
    isLoading,
    isError,
  } = engineerType === 'MACHINE'
      ? useGetMachineEngineers(searchParams.toString(), engineerType)
      : useGetSafetyEngineers(searchParams.toString())

  type EngineerRowDtoType = MachineEngineerRowDtoType | SafetyEngineerRowDtoType


  type MachineEngineersResponse = successResponseDtoType<MachineEngineerRowDtoType[]>

  const data: EngineerRowDtoType[] =
    engineerType === 'MACHINE'
      ? ((engineersPages as MachineEngineersResponse | undefined)?.content ?? [])
      : ((engineersPages as SafetyEngineerPageResponseDtoType | undefined)?.items ?? [])

  const totalCount =
    engineerType === 'MACHINE'
      ? ((engineersPages as MachineEngineersResponse | undefined)?.page.totalElements ?? 0)
      : ((engineersPages as SafetyEngineerPageResponseDtoType | undefined)?.total ?? 0)

  // 로딩 시도 중 = true, 로딩 끝 = false
  const [loading, setLoading] = useState(false)

  // 로딩이 끝나고 에러가 없으면 not disabled
  const disabled = loading || isError || isLoading

  // 페이지네이션 관련
  const page = Number(searchParams.get('page') ?? 0)
  const size = Number(searchParams.get('size') ?? DEFAULT_PAGESIZE)
  const projectName = searchParams.get('projectName')
  const name = searchParams.get('name')

  // 모달 관련 상태
  const [openAdd, setOpenAdd] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)

  const [selectedId, setSelectedId] = useState(0)
  const { data: selectedData, isLoading: isLoadingEngineer } = useGetEngineer(selectedId.toString())
  const { refetch: refetchEngineerOptions } = useGetEngineersOptions()

  // 선택삭제 기능 관련
  const [showCheckBox, setShowCheckBox] = useState(false)
  const [checked, setChecked] = useState<{ engineerId: number; version: number }[]>([])

  // params를 변경하는 함수를 입력하면 해당 페이지로 라우팅까지 해주는 함수
  const updateParams = useUpdateParams()


  type paramType = 'page' | 'size' | 'name' | 'projectName'

  const setQueryParams = useSetQueryParams<paramType>()

  const resetQueryParams = useCallback(() => {
    updateParams(params => {
      params.delete('page')
      params.delete('name')
      params.delete('projectName')
      params.delete('sort')

      const filterKeys = Object.keys(ENGINEER_FILTER_INFO)

      filterKeys.forEach(v => params.delete(v))
    })
  }, [updateParams])

  const handleEngineerClick = async (row: EngineerRowDtoType) => {
    // SAFETY 쪽은 아직 상세 모달 안 열어도 되면 그냥 리턴
    if (engineerType === 'SAFETY') return

    const engineer = row as MachineEngineerRowDtoType
    try {
      setSelectedId(engineer.engineerId)
      setOpenDetail(true)
    } catch (error) {
      handleApiError(error, '엔지니어를 선택하는 데 실패했습니다.')
    }
  }

  const handleCheckEngineer = (row: EngineerRowDtoType) => {
    if (engineerType === 'SAFETY') return

    const engineer = row as MachineEngineerRowDtoType
    const obj = { engineerId: engineer.engineerId, version: engineer.version }
    const checkedFlag = isChecked(engineer)

    if (!checkedFlag) {
      setChecked(prev => prev.concat(obj))
    } else {
      setChecked(prev => prev.filter(v => v.engineerId !== engineer.engineerId))
    }
  }

  const handleCheckAllEngineers = (checkedFlag: boolean) => {
    if (engineerType === 'SAFETY') return

    if (checkedFlag) {
      setChecked(
        (data as MachineEngineerRowDtoType[]).map(v => ({
          engineerId: v.engineerId,
          version: v.version,
        })),
      )
    } else {
      setChecked([])
    }
  }

  const isChecked = (row: EngineerRowDtoType) => {
    if (engineerType === 'SAFETY') return false

    const engineer = row as MachineEngineerRowDtoType
    return checked.some(v => v.engineerId === engineer.engineerId)
  }

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
    refetchEngineerOptions()
    refetchPages()

    queryClient.removeQueries({
      predicate(query) {
        const key = query.queryKey

        return (
          Array.isArray(key) &&
          key.length >= 3 &&
          key[0] === 'GET_ENGINEERS' &&
          key[1] === 'MACHINE' &&
          key[2] !== searchParams.toString()
        ) // 스크롤 유지를 위해 현재 data는 refetch, 나머지는 캐시 지우기
      }
    })
  }, [refetchEngineerOptions, refetchPages, queryClient, searchParams])

  // 여러 기술자 한번에 삭제
  async function handleDeleteEngineers() {
    if (!checked.length) return

    try {
      setLoading(true)
      await auth.delete(`/api/engineers`, {
        //@ts-ignore
        data: { engineerDeleteRequestDtos: checked }
      })

      adjustPage(-1 * checked.length)
      removeQueryCaches()
      handleSuccess(`선택된 ${engineerTerm} ${checked.length}명이 성공적으로 삭제되었습니다.`)
      setChecked([])
      setShowCheckBox(false)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <engineerTypeContext.Provider value={engineerType}>
      <Card className='relative h-full flex flex-col'>
        {/* 탭 제목 */}
        <CardHeader
          slotProps={{ title: { typography: 'h4' } }}
          title={`${engineerTerm} (${totalCount})`}
          className='pbe-4'
        />
        {/* 필터바 */}
        <BasicTableFilter<EngineerFilterType> filterInfo={EXTENDED_ENGINEER_FILTER_INFO} disabled={disabled} />
        <FilterChipBar
          activeFilters={activeFilters}
          removeFilter={removeFilter}
          onReset={resetQueryParams}
          disabled={disabled}
        />
        <div className=' flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <div className='flex gap-2'>
            {/* 페이지당 행수 */}
            <CustomTextField
              size='small'
              select
              value={size.toString()}
              onChange={e => {
                setQueryParams({ size: e.target.value, page: 0 })
              }}
              className='gap-[5px]'
              disabled={disabled}
              slotProps={{
                select: {
                  renderValue: selectedValue => {
                    return selectedValue + ' 개씩'
                  }
                }
              }}
            >
              {PageSizeOptions.map(pageSize => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                  {`\u00a0\u00a0`}
                </MenuItem>
              ))}
            </CustomTextField>
            {/* 이름으로 검색 */}
            <SearchBar
              key={`name_${name}`}
              defaultValue={name ?? ''}
              placeholder='이름으로 검색'
              setSearchKeyword={name => {
                setQueryParams({ name: name, page: 0 })
              }}
              disabled={disabled}
            />
            {/* 현장명으로 검색 */}
            <SearchBar
              key={`projectName_${projectName}`}
              defaultValue={projectName ?? ''}
              placeholder='현장명으로 검색'
              setSearchKeyword={projectName => {
                setQueryParams({ projectName: projectName, page: 0 })
              }}
              disabled={disabled}
            />
          </div>

          <div className='flex sm:flex-row max-sm:is-full items-start sm:items-center gap-5'>
            {/* 한번에 삭제 */}
            {!showCheckBox ? (
              <Button disabled={disabled} variant='contained' onClick={() => setShowCheckBox(prev => !prev)}>
                선택삭제
              </Button>
            ) : (
              <div className='flex gap-1'>
                <Button variant='contained' color='error' onClick={() => handleDeleteEngineers()}>
                  {`(${checked.length}) 삭제`}
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    setShowCheckBox(prev => !prev)
                    handleCheckAllEngineers(false)
                  }}
                >
                  취소
                </Button>
              </div>
            )}

            {/* 유저 추가 버튼 */}
            <Button
              variant='contained'
              startIcon={<IconPlus />}
              onClick={() => setOpenAdd(!openAdd)}
              className='max-sm:is-full'
              disabled={disabled}
            >
              추가
            </Button>
          </div>
        </div>
        <Alert severity="info" sx={{ mx: 3, mb: 2 }}>
          <Typography variant="body2">
            {`우클릭으로 ${engineerTerm}에서 제외할 수 있습니다`}
          </Typography>
        </Alert>

        {/* 테이블 */}
        <div className='flex-1 overflow-y-hidden'>
          <BasicTable<EngineerRowDtoType>
            multiException={
              engineerType === 'MACHINE'
                ? ({ latestProjectBeginDate: ['latestProjectBeginDate', 'latestProjectEndDate'] } as Partial<
                  Record<keyof EngineerRowDtoType, Array<keyof EngineerRowDtoType>>
                >)
                : undefined
            }
            header={engineerType === 'MACHINE' ? TABLE_HEADER_INFO.machineEngineers : TABLE_HEADER_INFO.safetyEngineers}
            data={data}
            handleRowClick={handleEngineerClick}
            loading={isLoading}
            error={isError}
            showCheckBox={engineerType === 'MACHINE' && showCheckBox}
            isChecked={isChecked}
            handleCheckItem={handleCheckEngineer}
            handleCheckAllItems={handleCheckAllEngineers}
            rightClickMenuHeader={contextMenu => contextMenu.row.name}
            rightClickMenu={[
              {
                icon: <IconBoltOff color='gray' size={20} />,
                label: `${engineerTerm}에서 제외`,
                handleClick: async row => {
                  if (engineerType === 'SAFETY') return
                  const engineer = row as MachineEngineerRowDtoType
                  await deleteEngineer(engineer.engineerId, engineer.version)
                  adjustPage(-1)
                  removeQueryCaches()
                },
              },
            ]}
          />
        </div>

        {/* 페이지네이션 */}
        <BasicTablePagination totalCount={totalCount} disabled={disabled} />
      </Card>

      {/* 모달들 */}
      {openAdd && (
        <AddEngineerModal
          open={openAdd}
          setOpen={setOpenAdd}
          reloadPage={() => {
            adjustPage(1)
            removeQueryCaches()
          }}
        />
      )}
      {openDetail &&
        (!isLoadingEngineer ? (
          <EngineerModal
            open={openDetail}
            setOpen={setOpenDetail}
            initialData={selectedData!}
            reloadPages={() => removeQueryCaches()}
          />
        ) : (
          <Backdrop open={isLoadingEngineer} sx={theme => ({ zIndex: theme.zIndex.drawer + 1 })}>
            <CircularProgress size={100} sx={{ color: 'white' }} />
          </Backdrop>
        ))}
    </engineerTypeContext.Provider>
  )
}
