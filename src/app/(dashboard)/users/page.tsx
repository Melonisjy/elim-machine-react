'use client'

import { useState, useCallback, useContext } from 'react'

// MUI Imports
import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import { IconPlus, IconReload, IconTrashFilled } from '@tabler/icons-react'

import { useQueryClient } from '@tanstack/react-query'

import { Chip, Box } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import UserModal from './_components/UserModal'
import type { MemberFilterType, UserDtoType } from '@core/types'
import BasicTable from '@/@core/components/elim-table/BasicTable'
import SearchBar from '@/@core/components/elim-inputbox/SearchBar'
import { MEMBER_FILTER_INFO } from '@core/data/filter/memberFilterInfo'
import { DEFAULT_PAGESIZE, PageSizeOptions } from '@/@core/data/options'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'
import { TABLE_HEADER_INFO } from '@/@core/data/table/tableHeaderInfo'
import AddUserModal from './_components/AddUserModal'
import { useGetLicenseFilter, useGetUsers } from '@core/hooks/customTanstackQueries'
import BasicTableFilter from '@/@core/components/elim-table/BasicTableFilter'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import { printErrorSnackbar } from '@core/utils/snackbarHandler'
import useUpdateParams from '@/@core/hooks/searchParams/useUpdateParams'
import useSetQueryParams from '@/@core/hooks/searchParams/useSetQueryParams'
import BasicTablePagination from '@/@core/components/elim-table/BasicTablePagination'
import { isTabletContext } from '@/@core/contexts/mediaQueryContext'

export default function UsersPage() {
  const searchParams = useSearchParams()

  const curUserId = useCurrentUserStore(set => set.currentUser)?.userId

  const isTablet = useContext(isTabletContext)

  const queryClient = useQueryClient()

  const { data: usersPages, refetch: refetchPages, isLoading, isError } = useGetUsers(searchParams.toString())
  const { data: licenseFilter } = useGetLicenseFilter()

  const data = usersPages?.items ?? []

  const page = Number(searchParams.get('page') ?? 0)
  const size = Number(searchParams.get('size') ?? DEFAULT_PAGESIZE)
  const name = searchParams.get('name')

  const disabled = isLoading || isError

  const totalCount = usersPages?.total ?? 0

  // 모달 관련 상태
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [userDetailModalOpen, setUserDetailModalOpen] = useState(false)
  const [userId, setUserId] = useState(0)


  // 선택삭제 기능 관련
  // const [showCheckBox, setShowCheckBox] = useState(false)
  const [checked, setChecked] = useState<{ userId: number }[]>([])

  // params를 변경하는 함수를 입력하면 해당 페이지로 라우팅해주는 함수
  const updateParams = useUpdateParams()

  type paramType = 'page' | 'size' | 'name'

  // 객체 형식으로 데이터를 전달받으면 그에 따라 searchParams를 설정하고 라우팅하는 함수
  const setQueryParams = useSetQueryParams<paramType>()

  const resetQueryParams = useCallback(() => {
    updateParams(params => {
      params.delete('page')
      params.delete('name')
      params.delete('sort')

      const filterKeys = Object.keys(MEMBER_FILTER_INFO)

      filterKeys.forEach(v => params.delete(v))
    })
  }, [updateParams])

  // 활성화된 필터들을 추출하는 함수
  const getActiveFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    const activeFilters: Array<{ key: string; label: string; value: string; displayValue: string }> = []

    Object.keys(MEMBER_FILTER_INFO).forEach(filterKey => {
      const filterValue = params.get(filterKey)
      if (filterValue && filterValue !== '') {
        const filterInfo = MEMBER_FILTER_INFO[filterKey as keyof MemberFilterType]
        const filterLabel = filterInfo.label

        // multi 타입인 경우 여러 값을 처리
        if (filterInfo.type === 'multi') {
          const values = filterValue.split(',')
          values.forEach(value => {
            let displayValue: string

            // licenseName인 경우 동적 데이터에서 찾기
            if (filterKey === 'licenseName') {
              const license = licenseFilter?.find(l => String(l.licenseSeq) === value)
              displayValue = license?.name ?? value
            } else {
              const option = filterInfo.options?.find(opt => String(opt.value) === value)
              displayValue = option ? option.label : value
            }

            activeFilters.push({
              key: filterKey,
              label: filterLabel,
              value: value,
              displayValue: displayValue
            })
          })
        }
      }
    })

    // 이름 검색도 필터로 표시
    const nameValue = params.get('name')
    if (nameValue && nameValue !== '') {
      activeFilters.push({
        key: 'name',
        label: '이름',
        value: nameValue,
        displayValue: nameValue
      })
    }

    return activeFilters
  }, [searchParams, licenseFilter])

  // 특정 필터 제거 함수
  const removeFilter = useCallback(
    (filterKey: string, filterValue: string) => {
      updateParams(params => {
        const currentValue = params.get(filterKey)

        if (!currentValue) return

        // name 필터는 MEMBER_FILTER_INFO에 없으므로 바로 제거
        if (filterKey === 'name') {
          params.delete(filterKey)
          params.delete('page')
          return
        }

        const filterInfo = MEMBER_FILTER_INFO[filterKey as keyof MemberFilterType]

        // multi 타입인 경우 콤마로 구분된 값에서 제거
        if (filterInfo?.type === 'multi') {
          const values = currentValue.split(',').filter(v => v !== filterValue)
          if (values.length > 0) {
            params.set(filterKey, values.join(','))
          } else {
            params.delete(filterKey)
          }
        } else {
          // single 타입인 경우 전체 제거
          params.delete(filterKey)
        }

        // 필터 변경 시 페이지를 0으로 리셋
        params.delete('page')
      })
    },
    [updateParams]
  )

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

        return Array.isArray(key) && key[0] === 'GET_USERS' && key[1] !== searchParams.toString() // 스크롤 유지를 위해 현재 data는 refetch, 나머지는 캐시 지우기
      }
    })
  }, [refetchPages, queryClient, searchParams])

  // 사용자 선택 핸들러 (디테일 모달)
  const handleUserClick = async (user: UserDtoType) => {
    try {
      setUserId(user.userSeq)
      setUserDetailModalOpen(true)
    } catch (error) {
      handleApiError(error)
    }
  }

  // 사용자 체크 핸들러 (다중선택)
  const handleCheckUser = (user: UserDtoType) => {
    const obj = { userId: user.userSeq }
    const checked = isChecked(user)

    if (user.userSeq === curUserId) {
      printErrorSnackbar('', '본인은 삭제할 수 없습니다')

      return
    }

    if (!checked) {
      setChecked(prev => prev.concat(obj))
    } else {
      setChecked(prev => prev.filter(v => v.userId !== user.userSeq))
    }
  }

  const handleCheckAllUsers = (checked: boolean) => {
    if (checked) {
      setChecked(prev => {
        const newPrev = structuredClone(prev)

        data.forEach(user => {
          if (!prev.find(v => v.userId === user.userSeq) && user.userSeq !== curUserId) {
            newPrev.push({ userId: user.userSeq })
          }
        })

        return newPrev
      })
    } else {
      setChecked([])
    }
  }

  const isChecked = (user: UserDtoType) => {
    return checked.some(v => v.userId === user.userSeq)
  }

  // 여러 유저 한번에 삭제
  async function handleDeleteUsers() {
    if (!checked.length) return

    try {
      await auth.delete(`/api/web/users`, {
        //@ts-ignore
        data: { memberDeleteRequestDtos: checked }
      })

      adjustPage(-1 * checked.length)
      removeQueryCaches()
      // setShowCheckBox(false)
      setChecked([])
      handleSuccess(`선택된 직원 ${checked.length}명이 삭제되었습니다.`)
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleDeleteUser = useCallback(
    async (user: UserDtoType) => {
      try {
        await auth.delete(`/api/web/users/${user.userSeq}`, {
          //@ts-ignore
          data: { userId: user.userSeq }
        })

        adjustPage(-1)
        removeQueryCaches()
        handleSuccess(`선택된 직원이 삭제되었습니다.`)
      } catch (e) {
        handleApiError(e)
      }
    },
    [adjustPage, removeQueryCaches]
  )

  return (
    <>
      <Card className='relative h-full flex flex-col'>
        {/* 탭 제목 */}
        <CardHeader slotProps={{ title: { typography: 'h4' } }} title={`직원관리 (${totalCount})`} className='pbe-4' />
        {/* 필터바 */}
        {!isTablet && <BasicTableFilter<MemberFilterType> filterInfo={MEMBER_FILTER_INFO} disabled={disabled} />}
        {/* 활성화된 필터 Chip 표시 */}
        {!isTablet && getActiveFilters().length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6, pb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {getActiveFilters().map((filter, index) => (
                <Chip
                  key={`${filter.key}-${filter.value}-${index}`}
                  label={`${filter.label}: ${filter.displayValue}`}
                  onDelete={() => removeFilter(filter.key, filter.value)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
            <Button
              startIcon={<IconReload />}
              onClick={resetQueryParams}
              size="small"
              disabled={disabled}
            >
              필터 초기화
            </Button>
          </Box>
        )}
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-3 sm:p-6 border-bs gap-2 sm:gap-4'>
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
          <div className='flex sm:flex-row max-sm:is-full items-start sm:items-center gap-2 sm:gap-4'>
            {/* 유저 추가 버튼 */}
            <Button
              variant='contained'
              startIcon={<IconPlus />}
              onClick={() => setAddUserModalOpen(!addUserModalOpen)}
              disabled={disabled}
            >
              직원 추가
            </Button>
          </div>
        </div>
        {/* 테이블 */}
        <div className='flex-1 overflow-y-hidden'>
          <BasicTable<UserDtoType>
            header={TABLE_HEADER_INFO.user}
            data={data}
            handleRowClick={handleUserClick}
            loading={isLoading}
            error={isError}
            // showCheckBox={showCheckBox}
            isChecked={isChecked}
            handleCheckItem={handleCheckUser}
            handleCheckAllItems={handleCheckAllUsers}
            rightClickMenuHeader={contextMenu => contextMenu.row.name}
            rightClickMenu={[
              { icon: <IconTrashFilled color='gray' size={20} />, label: '삭제', handleClick: handleDeleteUser }
            ]}
          />
        </div>
        {/* 페이지네이션 */}
        <BasicTablePagination totalCount={totalCount} disabled={disabled} />
      </Card>

      {/* 모달들 */}
      {addUserModalOpen && (
        <AddUserModal
          open={addUserModalOpen}
          setOpen={setAddUserModalOpen}
          handlePageChange={() => {
            setQueryParams({ page: 0 })
            removeQueryCaches()
          }}
        />
      )}
      {userDetailModalOpen && userId > 0 && (
        <UserModal
          open={userDetailModalOpen}
          setOpen={setUserDetailModalOpen}
          userId={userId}
          onDelete={() => adjustPage(-1)}
          reloadPages={removeQueryCaches}
        />
      )}
    </>
  )
}
