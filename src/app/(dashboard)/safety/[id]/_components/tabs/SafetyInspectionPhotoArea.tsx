'use client'

import React from 'react'

import { Typography } from '@mui/material'

type SafetyInspectionPhotoAreaProps = {
  photos?: string[] // presignedUrl 배열 (전체사진 탭에서 추가된 사진)
  label?: string
}

/**
 * 현장점검표 사진 영역 컴포넌트 (레거시 방식: 숫자 하이퍼링크)
 * 전체사진 탭에서 추가된 사진이 숫자로 표시되고, 클릭하면 새 탭에서 열림
 * @param photos 업로드된 사진 URL 배열 (전체사진 탭에서 관리)
 * @param label 사진 영역 라벨 (선택사항)
 */
const SafetyInspectionPhotoArea = ({ photos = [], label }: SafetyInspectionPhotoAreaProps) => {
  const handlePhotoClick = (photoUrl: string) => {
    window.open(photoUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='flex flex-wrap gap-0 items-center justify-center min-h-[30px]'>
      {/* 전체사진 탭에서 추가된 사진 목록 - 레거시 방식: 숫자 하이퍼링크 */}
      {photos.length > 0 ? (
        photos.map((photo, index) => (
          <React.Fragment key={index}>
            <Typography
              component='a'
              href={photo}
              target='_blank'
              rel='noopener noreferrer'
              onClick={e => {
                e.preventDefault()
                handlePhotoClick(photo)
              }}
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 14,
                '&:hover': {
                  color: 'primary.dark',
                  textDecoration: 'underline'
                }
              }}
            >
              {index + 1}
            </Typography>
            {index < photos.length - 1 && (
              <Typography component='span' sx={{ mx: 0.5, fontSize: 14, color: 'text.secondary' }}>
                /
              </Typography>
            )}
          </React.Fragment>
        ))
      ) : (
        <Typography variant='body2' color='text.secondary' sx={{ fontSize: 12 }}>
          -
        </Typography>
      )}
    </div>
  )
}

export default SafetyInspectionPhotoArea
