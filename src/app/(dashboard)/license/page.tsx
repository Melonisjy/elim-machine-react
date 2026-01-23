'use client'

import { useState, useCallback } from 'react'

// MUI Imports
import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import { IconPlus, IconReload, IconTrashFilled } from '@tabler/icons-react'

import { Alert, Backdrop, CircularProgress, Typography } from '@mui/material'

import { useQueryClient } from '@tanstack/react-query'

import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import type { LicensePageResponseDtoType } from '@core/types'
import { TABLE_HEADER_INFO } from '@/@core/data/table/tableHeaderInfo'
import BasicTable from '@/@core/components/elim-table/BasicTable'
import SearchBar from '@/@core/components/elim-inputbox/SearchBar'
import { DEFAULT_PAGESIZE, PageSizeOptions } from '@/@core/data/options'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import AddModal from './_components/AddLicenseModal'
import LicenseModal from './_components/LicenseModal'
import { auth } from '@core/utils/auth'
import { useGetLicense, useGetLicenses } from '@core/hooks/customTanstackQueries'
import deleteLicense from './_util/deleteLicense'
import useUpdateParams from '@/@core/hooks/searchParams/useUpdateParams'
import useSetQueryParams from '@/@core/hooks/searchParams/useSetQueryParams'
import BasicTablePagination from '@/@core/components/elim-table/BasicTablePagination'

export default function Licensepage() {
  const searchParams = useSearchParams()

  const queryClient = useQueryClient()

  const { data: licensesPages, refetch: refetchPages, isLoading, isError } = useGetLicenses(searchParams.toString())

  const data = licensesPages?.items ?? []

  const disabled = isLoading || isError

  const totalCount = licensesPages?.total ?? 0

  const page = Number(searchParams.get('page') ?? 0)
  const size = Number(searchParams.get('size') ?? DEFAULT_PAGESIZE)
  const companyName = searchParams.get('companyName')
  const region = searchParams.get('region')

  // 모달 관련 상태
  const [openAdd, setOpenAdd] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)

  const [selectedId, setSelectedId] = useState(0)
  const { data: selectedData, isLoading: isLoadingLicense } = useGetLicense(selectedId.toString())

  // 선택삭제 기능 관련
  const [showCheckBox, setShowCheckBox] = useState(false)
  const [checked, setChecked] = useState<{ licenseSeq: number }[]>([])

  // params를 변경하는 함수를 입력하면 해당 페이지로 라우팅까지 해주는 함수
  const updateParams = useUpdateParams()

  type paramType = 'page' | 'size' | 'companyName' | 'region'

  const setQueryParams = useSetQueryParams<paramType>()

  const resetQueryParams = useCallback(() => {
    updateParams(params => {
      params.delete('page')
      params.delete('companyName')
      params.delete('region')
      params.delete('sort')
    })
  }, [updateParams])

  // 라이선스 선택 핸들러
  const handleLicenseClick = async (licenseData: LicensePageResponseDtoType) => {
    try {
      setSelectedId(licenseData.licenseSeq)
      // setOpenDetail(true)
    } catch (error) {
      handleApiError(error, '라이선스를 선택하는 데 실패했습니다.')
    }
  }

  // 설비인력 체크 핸들러 (다중선택)
  const handleCheckLicense = (license: LicensePageResponseDtoType) => {
    const { licenseSeq } = license
    const checked = isChecked(license)

    if (!checked) {
      setChecked(prev => prev.concat({ licenseSeq: licenseSeq }))
    } else {
      setChecked(prev => prev.filter(v => v.licenseSeq !== licenseSeq))
    }
  }

  const handleCheckAllLicenses = (checked: boolean) => {
    if (checked) {
      setChecked(data.map(v => ({ licenseSeq: v.licenseSeq })))
    } else {
      setChecked([])
    }
  }

  const isChecked = (license: LicensePageResponseDtoType) => {
    return checked.some(v => v.licenseSeq === license.licenseSeq)
  }

  // offset만큼 요소수가 변화했을 때 valid한 페이지 param을 책임지는 함수
  const adjustPage = useCallback(
    (offset = 0) => {
      const lastPageAfter = Math.max(Math.ceil((totalCount + offset) / size) - 1, 0)

      if (offset > 0 || page > lastPageAfter) {
        lastPageAfter > 0
          ? setQueryParams({ page: lastPageAfter })
          : updateParams(params => {
            params.delete('page')
          })
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

        return Array.isArray(key) && key[0] === 'GET_LICENSES' && key[1] !== searchParams.toString() // 스크롤 유지를 위해 현재 data는 refetch, 나머지는 캐시 지우기
      }
    })
  }, [refetchPages, queryClient, searchParams])

  // 여러 라이선스 한번에 삭제
  async function handleDeleteLicenses() {
    if (!checked.length) return

    try {
      await auth.delete(`/api/licenses`, {
        //@ts-ignore
        data: { licenseDeleteRequestDtos: checked }
      })

      adjustPage(-1 * checked.length)
      removeQueryCaches()
      setChecked([])
      setShowCheckBox(false)
      handleSuccess('선택된 라이선스들이 성공적으로 삭제되었습니다.')
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <>
      <Card className='relative h-full flex flex-col'>
        {/* 탭 제목 */}
        <CardHeader
          slotProps={{ title: { typography: 'h4' } }}
          title={
            <div className='w-full flex justify-between items-center'>
              <Typography variant='inherit'>{`라이선스관리 (${totalCount})`}</Typography>
              {/* 필터 초기화 버튼 */}
              <Button
                startIcon={<IconReload />}
                onClick={() => {
                  resetQueryParams()
                }}
                className='max-sm:is-full'
                disabled={disabled}
              >
                필터 초기화
              </Button>
            </div>
          }
          className='pbe-4'
        />

        <div className=' flex justify-between flex-col items-start sm:flex-row sm:items-center p-3 sm:p-6 border-bs gap-2 sm:gap-4'>
          <div className='flex gap-2'>
            {/* 페이지당 행수 */}
            <CustomTextField
              size='small'
              select
              value={size.toString()}
              onChange={e => {
                setQueryParams({ page: 0, size: e.target.value })
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
            <SearchBar
              key={`companyName_${companyName}`}
              defaultValue={companyName ?? ''}
              placeholder='업체명으로 검색'
              setSearchKeyword={companyName => {
                setQueryParams({ page: 0, companyName: companyName })
              }}
              disabled={disabled}
            />
            <SearchBar
              key={`region${region}`}
              defaultValue={region ?? ''}
              className='hidden sm:flex'
              placeholder='지역으로 검색'
              setSearchKeyword={region => {
                setQueryParams({ page: 0, region: region })
              }}
              disabled={disabled}
            />
          </div>

          <div className='flex sm:flex-row max-sm:is-full items-start sm:items-center gap-2 sm:gap-4'>
            {/* 한번에 삭제 */}
            {!showCheckBox ? (
              <Button disabled={disabled} variant='contained' onClick={() => setShowCheckBox(prev => !prev)}>
                선택삭제
              </Button>
            ) : (
              <div className='flex gap-1'>
                <Button variant='contained' color='error' onClick={() => handleDeleteLicenses()}>
                  {`(${checked.length}) 삭제`}
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    setShowCheckBox(prev => !prev)
                    handleCheckAllLicenses(false)
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
              disabled={disabled}
            >
              추가
            </Button>
          </div>
        </div>
        <Alert severity="info" sx={{ mx: 3, mb: 2 }}>
          <Typography variant="body2">
            행을 우클릭하거나 선택삭제 버튼을 클릭하여 라이선스를 삭제할 수 있습니다.
          </Typography>
        </Alert>
        {/* 테이블 */}
        <div className='flex-1 overflow-y-hidden'>
          <BasicTable<LicensePageResponseDtoType>
            header={TABLE_HEADER_INFO.licenses}
            data={data}
            handleRowClick={handleLicenseClick}
            loading={isLoading}
            error={isError}
            showCheckBox={showCheckBox}
            isChecked={isChecked}
            handleCheckItem={handleCheckLicense}
            handleCheckAllItems={handleCheckAllLicenses}
            rightClickMenuHeader={contextMenu => contextMenu.row.name}
            rightClickMenu={[
              {
                icon: <IconTrashFilled color='gray' size={20} />,
                label: '삭제',
                handleClick: async row => {
                  await deleteLicense(row.licenseSeq)
                  adjustPage(-1)
                  removeQueryCaches()
                }
              }
            ]}
          />
        </div>

        {/* 페이지네이션 */}
        <BasicTablePagination totalCount={totalCount} disabled={disabled} />
      </Card>

      {/* 모달들 */}
      {openAdd && (
        <AddModal
          open={openAdd}
          setOpen={setOpenAdd}
          reloadPage={() => {
            adjustPage(1)
            removeQueryCaches()
          }}
        />
      )}

      {openDetail &&
        (!isLoadingLicense ? (
          <LicenseModal
            open={openDetail}
            setOpen={setOpenDetail}
            initialData={selectedData!}
            adjustPage={adjustPage}
            reloadPages={removeQueryCaches}
          />
        ) : (
          <Backdrop open={isLoadingLicense} sx={theme => ({ zIndex: theme.zIndex.drawer + 1 })}>
            <CircularProgress size={100} sx={{ color: 'white' }} />
          </Backdrop>
        ))}
    </>
  )
}
