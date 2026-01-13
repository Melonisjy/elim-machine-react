'use client'

import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import MenuItem from '@mui/material/MenuItem'

import CustomTextField from '@core/components/mui/TextField'
import BasicTable from '@/@core/components/elim-table/BasicTable'
import { DEFAULT_PAGESIZE, PageSizeOptions } from '@/@core/data/options'
import { TABLE_HEADER_INFO } from '@/@core/data/table/tableHeaderInfo'
import { useGetLoginLogs } from '@core/hooks/customTanstackQueries'
import type { LoginLogDtoType } from '@core/types'
import BasicTablePagination from '@/@core/components/elim-table/BasicTablePagination'
import useSetQueryParams from '@/@core/hooks/searchParams/useSetQueryParams'

export default function LoginLogPage() {
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') ?? 0)
  const size = Number(searchParams.get('size') ?? DEFAULT_PAGESIZE)

  const { data, isLoading, isError } = useGetLoginLogs(searchParams.toString())

  const items = data?.items ?? []
  const totalCount = data?.total ?? 0

  const disabled = isLoading || isError

  const setQueryParams = useSetQueryParams<'page' | 'size'>()

  const handleRowClick = async (row: LoginLogDtoType) => {
    // 간단하게만 작업하므로 클릭 시 동작 없음
    console.log('로그인 기록 클릭:', row)
  }

  return (
    <Card className='relative h-full flex flex-col'>
      <CardHeader slotProps={{ title: { typography: 'h4' } }} title={`로그인 기록 (${totalCount})`} className='pbe-4' />

      <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-3 sm:p-6 border-bs gap-2 sm:gap-4'>
        <div className='flex gap-2'>
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
        </div>
      </div>

      {/* 테이블 */}
      <div className='flex-1 overflow-y-hidden'>
        <BasicTable<LoginLogDtoType>
          header={TABLE_HEADER_INFO.loginLog}
          data={items}
          handleRowClick={handleRowClick}
          loading={isLoading}
          error={isError}
        />
      </div>

      {/* 페이지네이션 */}
      <BasicTablePagination totalCount={totalCount} disabled={disabled} />
    </Card>
  )
}
