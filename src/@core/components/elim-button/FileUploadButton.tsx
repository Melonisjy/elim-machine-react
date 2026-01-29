'use client'

import { useRef, ReactNode } from 'react'
import { IconButton, Button } from '@mui/material'
import { IconFileUpload } from '@tabler/icons-react'

type FileUploadButtonProps = {
    onFileSelect: (file: File) => void | Promise<void>
    accept?: string // 예: 'image/*', '.pdf', '.xlsx'
    multiple?: boolean
    variant?: 'icon' | 'button' // IconButton 또는 Button 스타일 선택
    buttonText?: string // variant가 'button'일 때 표시할 텍스트
    disabled?: boolean
    className?: string
    sx?: any
    children?: ReactNode // 커스텀 버튼 내용
}

export default function FileUploadButton({
    onFileSelect,
    accept,
    multiple = false,
    variant = 'icon',
    buttonText = '파일 선택',
    disabled = false,
    className,
    sx,
    children
}: FileUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)

        if (multiple) {
            for (const file of files) {
                await onFileSelect(file)
            }
        } else {
            await onFileSelect(files[0])
        }

        // input 초기화 (같은 파일 다시 선택 가능하도록)
        e.target.value = ''
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    return (
        <>
            {variant === 'icon' ? (
                <IconButton
                    onClick={handleClick}
                    disabled={disabled}
                    className={className}
                    sx={sx}
                >
                    {children || <IconFileUpload />}
                </IconButton>
            ) : (
                <Button
                    onClick={handleClick}
                    disabled={disabled}
                    className={className}
                    sx={sx}
                    component="span"
                >
                    {children || buttonText}
                </Button>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </>
    )
}