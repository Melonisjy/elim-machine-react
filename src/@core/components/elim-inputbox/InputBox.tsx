import { createContext, useContext, useState } from 'react'

import Grid from '@mui/material/Grid2'

import { Box, Button, InputAdornment, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import type { BoxSizeType, InputFieldType, ynResultType } from '@core/types'
import { MemberIdContext } from '@/app/(dashboard)/member/_components/UserModal'
import { handleApiError } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'
import { useGetLicenseFilter } from '@core/hooks/customTanstackQueries'
import YNSelectBox from './YNSelectBox'
import PostCodeButton from '../elim-button/PostCodeButton'

interface InputBoxProps {
  tabFieldKey: string
  value: string
  onChange: (value: string) => void
  tabInfos: Record<string, InputFieldType>
  isEditing?: boolean
  size?: BoxSizeType
  disabled?: boolean
  showLabel?: boolean
  required?: boolean
  placeholder?: string
}

const InputBoxContext = createContext<InputBoxProps | null>(null)

/**
 * @param tabInfos * id와 그에 따른 박스 구성에 필요한 정보들 (ex. {name: {size: 'md', type: 'text', label: '이름'}, ...})
 * @param tabFieldKey * box 구성 정보를 알아내는 데 필요한 id (ex. companyName, ...)
 * @param value * value
 * @param onChange * (value: string) => void
 * @param size box의 size, tabField에 정의되어 있는 사이즈보다 우선시됨.
 * @param disabled
 * @param showLabel
 * @param required
 * @param placeholder
 */
export function InputBox(props: InputBoxProps) {
  const { size, tabFieldKey, tabInfos } = props
  const tabField = tabInfos[tabFieldKey]

  const SizeMap = {
    sm: { xs: 12, sm: 2 },
    md: { xs: 12, sm: 6 },
    lg: { xs: 12 }
  }

  return (
    <InputBoxContext.Provider value={{ ...props, showLabel: props.showLabel ?? true }}>
      <Grid size={SizeMap[size ?? tabField?.size ?? 'md']}>
        <InputBoxContent />
      </Grid>
    </InputBoxContext.Provider>
  )
}

function InputBoxContent() {
  const props = useContext(InputBoxContext)
  const { isEditing, tabInfos, tabFieldKey, value, onChange, showLabel, required, placeholder } = props!
  const tabField = tabInfos[tabFieldKey]
  const disabled = props?.disabled ?? tabField?.disabled ?? false

  // 회사명 옵션
  const { data: licenseFilter } = useGetLicenseFilter()
  const companyNameOption = licenseFilter?.map(v => ({ value: String(v.licenseSeq), label: v.name }))

  // 주민번호 핸들링
  const [juminNum, setJuminNum] = useState(value)
  const memberId = useContext(MemberIdContext)

  const label = (showLabel && tabField?.label) ?? ''

  async function getJuminNum() {
    try {
      const response = await auth.post<{ data: { juminNum: string } }>(`/api/members/jumin-num/view`, {
        memberId: memberId
      })

      setJuminNum(response.data.data.juminNum)
    } catch (error: any) {
      handleApiError(error)
    }
  }

  // 수정 중이 아닐 때는 input이 아닌 일반 텍스트 박스가 뜨도록.
  if (tabField && isEditing === false) {
    const realValue =
      tabField.type === 'multi'
        ? tabField.options?.find(option => option.value === value)?.label
        : tabField.type === 'yn'
          ? value === 'Y'
            ? '예'
            : value === 'N'
              ? '아니오'
              : '_'
          : value

    return (
      <div className='flex flex-col p-0'>
        {showLabel && <span className='text-[13px] p-0 mb-[1px] w-fit'>{tabField.label}</span>}
        <Box
          className={'my-[1px] relative text-[15px] border-color-border rounded-lg px-[14px] py-[7.25px]'.concat(
            showLabel ? ' border' : ''
          )}
        >
          {tabField.type !== 'juminNum' ? (
            <span>{realValue ? realValue : '_'}</span>
          ) : (
            <>
              <span>{realValue ? juminNum : '_'}</span>
              <Button
                onClick={getJuminNum}
                variant='contained'
                size='small'
                className='absolute top-[50%] -translate-y-1/2 right-1 p-1'
              >
                노출
              </Button>
            </>
          )}
        </Box>
      </div>
    )
  }

  switch (tabField?.type) {
    case 'date':
    case 'number':
      return (
        <CustomTextField
          required={showLabel && required}
          slotProps={{ htmlInput: { name: tabFieldKey, min: '1800-01-01', max: '2999-01-01' } }}
          type={tabField.type}
          id={tabFieldKey}
          disabled={disabled}
          fullWidth
          label={label}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'multi':
      const hasValue = value && value !== ''
      return (
        <CustomTextField
          id={tabFieldKey}
          disabled={disabled}
          select
          fullWidth
          label={label}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          required={showLabel && required}
          sx={{
            '& .MuiInputBase-root': {
              ...(hasValue && {
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }),
            },
          }}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected || selected === '') {
                  return <span style={{ color: '#999' }}>{placeholder || tabField?.label || '전체'}</span>
                }
                const selectedValue = selected as string
                const option = (tabFieldKey === 'licenseName' ? companyNameOption : tabField?.options)?.find(
                  opt => opt.value === selectedValue
                )
                return option?.label || selectedValue || ''
              }
            }
          }}
        >
          <MenuItem value=''>{placeholder || tabField?.label || '전체'}</MenuItem>
          {(tabFieldKey === 'licenseName' ? companyNameOption : tabField?.options)?.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomTextField>
      )
    case 'yn':
      return (
        <YNSelectBox
          required={showLabel && required}
          name={tabFieldKey}
          id={tabFieldKey}
          disabled={disabled}
          label={label}
          value={(value as ynResultType | null) ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'text':
      return (
        <CustomTextField
          placeholder={placeholder}
          required={showLabel && required}
          slotProps={{
            htmlInput: { name: tabFieldKey }
          }}
          id={tabFieldKey}
          disabled={disabled}
          fullWidth
          label={label}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'long text':
      return (
        <CustomTextField
          required={showLabel && required}
          multiline
          rows={4}
          slotProps={{ htmlInput: { name: tabFieldKey } }}
          id={tabFieldKey}
          disabled={disabled}
          fullWidth
          label={label}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'juminNum':
      return (
        <div className='relative'>
          <CustomTextField
            required={showLabel && required}
            slotProps={{ htmlInput: { name: tabFieldKey } }}
            id={tabFieldKey}
            disabled={disabled}
            fullWidth
            label={label}
            value={juminNum ?? ''}
            onChange={e => {
              setJuminNum(e.target.value)
              onChange(e.target.value)
            }}
          />

          <Button onClick={getJuminNum} variant='contained' size='small' className='absolute bottom-[10%] right-1 p-1'>
            노출
          </Button>
        </div>
      )
    case 'map':
      return (
        <CustomTextField
          required={showLabel && required}
          fullWidth
          slotProps={{
            htmlInput: { name: tabFieldKey },
            input: {
              endAdornment: (
                <InputAdornment sx={{ color: 'white' }} position='end'>
                  <PostCodeButton onChange={onChange} />
                </InputAdornment>
              )
            }
          }}
          id={tabFieldKey}
          disabled={disabled}
          label={label}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    default:
      return null
  }
}
