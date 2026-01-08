'use client'

import type { SyntheticEvent } from 'react'
import { useCallback, useContext, useEffect, useState } from 'react'

import { redirect, useParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

import { CardContent, IconButton, Tab, Typography } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'

import classNames from 'classnames'

import { IconCheck, IconChevronRight, IconPencil, IconX } from '@tabler/icons-react'
import TabPanel from '@mui/lab/TabPanel'

import { useForm } from 'react-hook-form'

import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import CustomTextField from '@core/components/mui/TextField'
import DisabledTabWithTooltip from '@/app/(dashboard)/machine/[id]/_components/DisabledTabWithTooltip'
import {
  useGetEngineersOptions,
  useGetSafetyProject,
  useGetSafetyProjectScheduleTab,
  useMutateSafetyProjectName
} from '@core/hooks/customTanstackQueries'
import isEditingContext from './isEditingContext'
import type { SafetyProjectReadResponseDtoType, SafetyProjectTabValueType } from '@/@core/types'
import { isMobileContext } from '@/@core/contexts/mediaQueryContext'

import useSafetyProjectTabValueStore from '@/@core/hooks/zustand/useSafetyProjectTabValueStore'

import SafetyProjectTabContent from './_components/tabs/SafetyProjectTabContent'
import NoteTabContent from './_components/tabs/NoteTabContent'
import ScheduleAndEngineerTabContent from './_components/tabs/ScheduleAndEngineerTabContent'
import SafetyInspectionFormTabContent from './_components/tabs/SafetyInspectionFormTabContent'

const Tabs: { value: SafetyProjectTabValueType; label: SafetyProjectTabValueType }[] = [
  { value: '현장정보', label: '현장정보' },
  { value: '점검일정/참여기술진', label: '점검일정/참여기술진' },
  { value: '현장점검표', label: '현장점검표' },
  { value: '도면목록', label: '도면목록' },
  { value: '결함목록', label: '결함목록' },
  { value: '전체사진', label: '전체사진' },

  // { value: '자료실', label: '자료실' },
  { value: '특이사항', label: '특이사항' }
]

const SafetyProjectPage = () => {
  const isMobile = useContext(isMobileContext)

  const params = useParams()
  const safetyProjectId = params?.id as string

  const { tabValue, setTabValue } = useSafetyProjectTabValueStore(state => state)
  const [isEditing, setIsEditing] = useState(false)

  const { data: engineerList } = useGetEngineersOptions('SAFETY')

  // 안전진단현장 정보 조회
  const { data: safetyProjectData, refetch: refetchSafetyProjectData } = useGetSafetyProject(safetyProjectId)

  // 안전진단 점검일정/참여기술진 조회
  const { data: scheduleEngineerData, refetch: refetchScheduleEngineerData } =
    useGetSafetyProjectScheduleTab(safetyProjectId)

  const handleChange = (event: SyntheticEvent, newValue: SafetyProjectTabValueType) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    if (safetyProjectId) {
      switch (tabValue) {
        case '현장정보':
          if (!safetyProjectData) refetchSafetyProjectData()
          break
        case '점검일정/참여기술진':
          if (!scheduleEngineerData) refetchScheduleEngineerData()
          break
        default:
          break
      }
    }
  }, [
    safetyProjectId,
    tabValue,
    refetchSafetyProjectData,
    refetchScheduleEngineerData,
    engineerList,
    safetyProjectData,
    scheduleEngineerData
  ])

  return (
    <isEditingContext.Provider value={{ isEditing, setIsEditing }}>
      <Card className='h-full flex flex-col'>
        <div className={classNames('flex items-center justify-between', { 'p-0': isMobile, 'px-6 py-6': !isMobile })}>
          <CardHeader
            title={
              safetyProjectData && (
                <div
                  className={classNames('flex gap-0', {
                    'flex-col text-left items-start': isMobile,
                    'items-center': !isMobile
                  })}
                >
                  <Typography
                    variant='h4'
                    sx={{
                      ':hover': { color: 'primary.main' },
                      alignItems: 'center',
                      display: 'flex'
                    }}
                    onClick={() => redirect('/safety')}
                  >
                    안전진단현장
                    <IconChevronRight />
                  </Typography>
                  <SafetyProjectNameBox safetyProjectData={safetyProjectData} />
                </div>
              )
            }
            sx={{ cursor: 'pointer', padding: 0 }}
          />
        </div>

        <CardContent className='flex-1 flex flex-col overflow-y-hidden'>
          <TabContext value={tabValue}>
            {/* 탭 목록 */}
            <TabList onChange={handleChange} aria-label='nav tabs example'>
              {Tabs.map(tab => {
                return isEditing && tabValue !== tab.value ? (
                  <DisabledTabWithTooltip value={tab.value} label={tab.label} />
                ) : (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                )
              })}
            </TabList>
            <div className='flex-1 overflow-y-hidden pt-6'>
              <TabPanel value='현장정보' className='h-full'>
                {safetyProjectData ? (
                  <SafetyProjectTabContent />
                ) : (
                  <Typography>프로젝트 정보를 불러오는 중입니다.</Typography>
                )}
              </TabPanel>
              <TabPanel value='점검일정/참여기술진'>
                {scheduleEngineerData ? (
                  <ScheduleAndEngineerTabContent />
                ) : (
                  <Typography>점검일정 및 참여기술진 정보를 불러오는 중입니다.</Typography>
                )}
              </TabPanel>
              <TabPanel value='현장점검표' className='h-full'>
                <SafetyInspectionFormTabContent />
              </TabPanel>
              {/*
              <TabPanel value='설비목록' className='h-full'>
                <InspectionListTabContent />
              </TabPanel>
              <TabPanel value='전체사진' className='h-full'>
                <PictureListTabContent />
              </TabPanel>*/}
              <TabPanel value='특이사항'>
                {safetyProjectData ? <NoteTabContent /> : <Typography>특이사항 정보를 불러오는 중입니다.</Typography>}
              </TabPanel>
            </div>
          </TabContext>
        </CardContent>
      </Card>
    </isEditingContext.Provider>
  )
}

function SafetyProjectNameBox({ safetyProjectData }: { safetyProjectData: SafetyProjectReadResponseDtoType }) {
  const params = useParams()
  const safetyProjectId = params?.id as string

  const { mutateAsync: mutateAsyncName } = useMutateSafetyProjectName(safetyProjectId)
  const [isEditingProjectName, setIsEditingProjectName] = useState(false)

  // 안전진단현장 이름 변경
  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty }
  } = useForm<{ name: string }>({
    defaultValues: {
      name: safetyProjectData?.name ?? ''
    }
  })

  const handleChangeProjectName = handleSubmit(
    useCallback(
      async data => {
        if (isDirty) {
          try {
            const newData = await mutateAsyncName({
              name: data.name,
              version: safetyProjectData?.version ?? 0
            })

            reset({ name: newData.projectName })
            handleSuccess('프로젝트 이름이 변경되었습니다.')
          } catch (error) {
            handleApiError(error)
          }
        }
      },
      [isDirty, mutateAsyncName, reset, safetyProjectData?.version]
    )
  )

  const CancelChangingProjectName = useCallback(() => {
    reset()
    setIsEditingProjectName(false)
  }, [reset, setIsEditingProjectName])

  return (
    <form className='flex items-center' onSubmit={handleChangeProjectName}>
      {!isEditingProjectName ? (
        <Typography color='black' variant='h4' sx={{ cursor: 'default' }}>
          {safetyProjectData?.name ?? ''}
        </Typography>
      ) : (
        <CustomTextField
          {...register('name')}
          slotProps={{
            input: { sx: { fontSize: 20, width: 'fit-content' } },
            htmlInput: { sx: { py: '0 !important' } }
          }}
        />
      )}
      <IconButton
        type='submit'
        onClick={() => {
          setIsEditingProjectName(prev => !prev)
        }}
      >
        {!isEditingProjectName ? <IconPencil /> : <IconCheck className='text-green-400 hover:text-green-500' />}
      </IconButton>
      {isEditingProjectName && (
        <IconButton type='button' onClick={CancelChangingProjectName}>
          <IconX className='text-red-400 hover:text-red-500' />
        </IconButton>
      )}
    </form>
  )
}

export default SafetyProjectPage
