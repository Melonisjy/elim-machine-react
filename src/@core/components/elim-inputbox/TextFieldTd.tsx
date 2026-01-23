import type { TextFieldProps } from '@mui/material'
import { TextField } from '@mui/material'
import type { Path, RegisterOptions, UseFormReturn } from 'react-hook-form'

type TextFieldTdProps<T extends Record<string, any>> = {
  form: UseFormReturn<T, any, undefined>
  name: Path<T>
  colSpan?: number
  rowSpan?: number
  rules?: RegisterOptions<T, Path<T>>
} & Omit<TextFieldProps, 'displayEmpty' | 'renderValue' | 'size'>

/**
 * border가 없는 MUI TextField가 내재된 td
 * @param form
 * @param name
 * @param rules
 * @returns
 * @prop MUI TextField props 사용 가능
 */
export default function TextFieldTd<T extends Record<string, any>>({
  form,
  name,
  colSpan,
  rowSpan,
  rules,
  ...rest
}: TextFieldTdProps<T>) {
  const { slotProps, ...restExceptSlotProps } = rest
  const error = form.formState.errors[name]
  const errorMessage = error?.message as string | undefined

  return (
    <td colSpan={colSpan} rowSpan={rowSpan} className='p-0'>
      <TextField
        size='small'
        fullWidth
        error={!!error}
        helperText={error && errorMessage}
        slotProps={{
          ...slotProps,
          input: { ...slotProps?.input, sx: { '.MuiOutlinedInput-notchedOutline': { border: 0, borderRadius: 0 } } },
          htmlInput: { ...slotProps?.htmlInput, max: '2999-12-31', min: '1500-01-01' }
        }}
        {...form.register(name, rules)}
        {...restExceptSlotProps}
      />
    </td>
  )
}
