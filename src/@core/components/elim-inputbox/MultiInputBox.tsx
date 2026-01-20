import { Grid2, MenuItem, TextField, Typography } from '@mui/material'
import type { Path, UseFormReturn } from 'react-hook-form'
import { Controller, useFormState } from 'react-hook-form'

import { YNOption } from '@/@core/data/options'

interface MultiInputBoxProps<T extends Record<string, any>> {
  form: UseFormReturn<T, any, undefined>
  labelMap: Partial<Record<Path<T>, Partial<{ label: string; options: { label: string; value: string | number }[] }>>>
  name: Path<T>
  disabled?: boolean
  column?: number
  required?: boolean
}

/**
 * useForm을 사용할 때 쓰는 input box (select용)
 * @param name * form의 name
 * @param form * form
 * @param labelMap * INPUT_INFO
 * @param diabled 선택 옵션
 * @param required 선택 옵션
 * @param column 1: 반칸, 2: fullWidth (기본값: 1)
 */
export default function MultiInputBox<T extends Record<string, any>>({
  form,
  labelMap,
  name,
  disabled = false,
  required = false,
  column = 1
}: MultiInputBoxProps<T>) {
  const label = labelMap[name]?.label ?? ''
  const option = name.includes('Yn') ? YNOption : labelMap[name]?.options

  const dirty = (form.formState.dirtyFields as any)[name]

  const error = useFormState({ ...form, name: name }).errors[name]

  return (
    <Grid2 size={column}>
      <div className='flex flex-col w-full relative'>
        <Typography
          sx={{ position: 'relative', width: 'fit-content' }}
          {...(dirty && { color: 'primary.main' })}
          {...(error && { color: 'error.main' })}
          {...(disabled && { color: 'lightgray' })}
          {...(required && { fontWeight: 'bold' })}
        >
          {label}
          {required && <sup className='absolute right-0 translate-x-full text-red-500'>*</sup>}
        </Typography>
        <Controller
          rules={{ ...(required && { required: { value: required, message: '필수 입력입니다' } }) }}
          name={name}
          control={form.control}
          render={({ field }) => (
            <TextField
              disabled={disabled || (option?.length ?? 0) === 0}
              size='small'
              value={field.value}
              onChange={field.onChange}
              select
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: v => {
                    const normalizedValue = String(v ?? '').toUpperCase()

                    const foundOption = option?.find(p =>
                      String(p.value ?? '').toUpperCase() === normalizedValue ||
                      String(p.label ?? '').toUpperCase() === normalizedValue
                    )

                    return foundOption ? (
                      <Typography variant='inherit'>{foundOption.label}</Typography>
                    ) : (
                      <Typography variant='inherit' fontStyle={'italic'} color='gray'>
                        미정
                      </Typography>
                    )
                  }
                }
              }}
            >
              {(option?.length ?? 0) === 0 ? (
                <MenuItem value={100}>사랑해요~</MenuItem> // option의 길이가 0인 경우, <select인데 자식이 없으면 안돼>라는 MUI 에러가 뜨는 것 방지
              ) : (
                option?.map(v => (
                  <MenuItem value={v.value} key={v.value}>
                    {v.label}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        />
        {error && (
          <Typography
            variant='caption'
            sx={{ position: 'absolute', right: 0, top: 0 }}
            color='error.main'
            align='right'
          >
            {error.message?.toString()}
          </Typography>
        )}
      </div>
    </Grid2>
  )
}
