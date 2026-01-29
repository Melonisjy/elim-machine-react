'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

// Component Imports
import TabContext from '@mui/lab/TabContext'

import type { SxProps } from '@mui/material'
import { DialogContent, Divider, IconButton, Typography } from '@mui/material'
import classNames from 'classnames'
import type { TransitionProps } from '@mui/material/transitions'
import { IconX } from '@tabler/icons-react'

type DefaultModalProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  value?: string
  open: boolean
  setOpen: (open: boolean) => void
  title: string | React.ReactElement
  headerDescription?: string
  children?: ReactNode
  primaryButton?: ReactNode
  secondaryButton?: ReactNode
  modifyButton?: ReactNode
  deleteButton?: ReactNode
  uploadButton?: ReactNode
  onClose?: () => void
  TransitionProps?: TransitionProps
  sx?: SxProps
}

/**
 * @param open *
 * @param setOpen *
 * @param title *
 * @param childeren TabList, TabPanel
 * @param value 몇번째 탭인지 알려주는 상태.
 * @returns modal component 리턴.
 */
export default function DefaultModal(props: DefaultModalProps) {
  const {
    size = 'md',
    value,
    open,
    setOpen,
    title,
    headerDescription,
    children,
    primaryButton,
    secondaryButton,
    modifyButton,
    deleteButton,
    uploadButton,
    onClose = () => {
      setOpen(false)
    },
    TransitionProps,
    sx
  } = props

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(_, reason) => reason !== 'backdropClick' && onClose()}
      maxWidth={size}
      scroll='paper' // ✅ DialogContent 안에서만 스크롤
      closeAfterTransition={false}
      sx={{ ...sx, '& .MuiDialog-paper': { overflow: 'visible' } }}
      slotProps={{ transition: TransitionProps }}
    >
      {/* 닫기 버튼 */}
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <IconX />
      </IconButton>

      {/* 수정/삭제 버튼 */}
      <div className='absolute left-4 top-4 sm:left-8 sm:top-8 flex gap-2'>
        {modifyButton}
        {deleteButton}
      </div>

      {/* 제목 */}
      <DialogTitle
        sx={{ pt: '1.5rem !important' }}
        variant='h4'
        className={classNames(
          'flex items-center gap-0 whitespace-pre-wrap flex-col text-center sm:pbs-16 sm:pbe-3 sm:pli-16',
          {
            'text-xl sm:text-3xl': size !== 'sm',
            'text-lg sm:text-xl': size === 'sm'
          }
        )}
      >
        <Typography component={'div'} variant='h3'>
          {title}
        </Typography>
        {headerDescription && (
          <Typography
            component='div'
            sx={theme => ({ fontSize: theme.typography.h5.fontSize })}
            className='flex flex-col text-center'
          >
            {headerDescription}
          </Typography>
        )}
      </DialogTitle>

      {/* ✅ 스크롤 처리되는 본문 */}
      <DialogContent
        sx={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {value ? (
          children && <TabContext value={value}>{children}</TabContext>
        ) : (
          <>
            <Divider variant='middle' />
            {children}
          </>
        )}
      </DialogContent>

      {/* 하단 버튼 */}
      {(primaryButton || secondaryButton || uploadButton) && (
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-[20px] lg:mt-[40px]' >
          {primaryButton}
          {uploadButton}
          {secondaryButton}
        </DialogActions>
      )}
    </Dialog>
  )
}
