// MUI Imports
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'

import { InputBox } from '@/@core/components/elim-inputbox/InputBox'
import type { InputFieldType } from '@core/types'

interface BasicTableFilterProps<T> {
  filterInfo: Record<keyof T, InputFieldType>
  disabled: boolean
  padding?: number
}

/**
 * 필터 입력 시 바로 SearchParams로 설정하는 테이블 필터
 * @param filterInfo 필터에 대한 정보 - Record<keyof T, InputFieldType>
 * @param disabled 필터 비활성화 여부
 * @type 필터 타입 (ex. MemberFilterType, ...)
 * @returns
 */
export default function BasicTableFilter<T>({ filterInfo, disabled, padding = 6 }: BasicTableFilterProps<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const setSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    const queryKey = key === 'licenseName' ? 'licenseSeq' : key === 'engineerName' ? 'engineerSeq' : key

    params.delete('page')
    if (value !== '') params.set(queryKey, value)
    else params.delete(queryKey)

    router.replace(pathname + '?' + params.toString())
  }

  return (
    <Grid container spacing={3} paddingBottom={padding} paddingX={padding}>
      {Object.keys(filterInfo).map(property => (
        <InputBox
          key={property}
          size='sm'
          tabInfos={filterInfo}
          tabFieldKey={property}
          disabled={disabled}
          value={searchParams.get(property === 'licenseName' ? 'licenseSeq' : property === 'engineerName' ? 'engineerSeq' : property) ?? ''}
          onChange={value => setSearchParam(property, value)}
          placeholder={filterInfo[property as keyof T]?.label}
          showLabel={false}
        />
      ))}
    </Grid>
  )
}
