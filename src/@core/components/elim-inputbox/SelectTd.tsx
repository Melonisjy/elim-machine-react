import type { SelectProps } from '@mui/material'
import { FormHelperText, MenuItem, Select, Typography } from '@mui/material'
import type { Path, RegisterOptions, UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'

type SelectTdProps<T extends Record<string, any>> = {
  form: UseFormReturn<T, any, undefined>
  name: Path<T>
  option: { label: string; value: string | number; disabled?: boolean }[]
  colSpan?: number
  placeholder?: string
  rules?: RegisterOptions<T, Path<T>>
} & Omit<SelectProps, 'displayEmpty'>

/**
 * border가 없는 MUI Select가 내재된 td
 * @param form *
 * @param name *
 * @param option *
 * @param colSpan
 * @param placeholder
 * @param rules
 * @returns
 * @prop MUI Select props 사용 가능
 */
export default function SelectTd<T extends Record<string, any>>({
  form,
  name,
  option,
  colSpan = 1,
  placeholder,
  rules,
  ...rest
}: SelectTdProps<T>) {
  const error = form.formState.errors[name]
  const errorMessage = error?.message as string | undefined

  return (
    <td colSpan={colSpan} className='p-0'>
      <Controller
        control={form.control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <>
            <Select
              value={field.value}
              onChange={field.onChange}
              size='small'
              error={!!error}
              sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0, borderRadius: 0 } }}
              fullWidth
              displayEmpty
              renderValue={
                rest.renderValue
                  ? rest.renderValue
                  : value =>
                    value ? (
                      <Typography variant='inherit'>{option.find(v => v.value === value)?.label}</Typography>
                    ) : (
                      <Typography variant='inherit' color='lightgray'>
                        {placeholder ?? '미정'}
                      </Typography>
                    )
              }
              {...rest}
            >
              {option?.map(v => (
                <MenuItem disabled={v.disabled} key={v.value} value={v.value}>
                  {v.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <FormHelperText error sx={{ margin: 0, paddingLeft: '14px', paddingTop: '2px', fontSize: '0.75rem' }}>
                {errorMessage}
              </FormHelperText>
            )}
          </>
        )}
      />
    </td>
  )
}