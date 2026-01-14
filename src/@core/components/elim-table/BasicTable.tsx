import type { MouseEvent } from 'react'
import { useCallback, useContext, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import classNames from 'classnames'

import type { TableCellProps } from '@mui/material'
import { Checkbox, Divider, ListItemIcon, Menu, MenuItem, styled, TableCell, Typography } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'

import { IconCaretDownFilled, IconCaretUpFilled, IconExclamationCircleFilled } from '@tabler/icons-react'

import type { HeaderType } from '@core/types'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import { DEFAULT_PAGESIZE } from '@/@core/data/options'
import { isMobileContext, isTabletContext } from '@/@core/contexts/mediaQueryContext'

const StyledTableCell = styled(TableCell)<TableCellProps>({ padding: 14 })

interface BasicTableProps<T> {
  header: HeaderType<T>
  data?: T[]
  handleRowClick: (row: T) => Promise<void>
  loading: boolean
  error: boolean
  multiException?: Partial<Record<keyof T, Array<keyof T>>>
  listException?: Array<keyof T>
  showCheckBox?: boolean
  isChecked?: (item: T) => boolean
  handleCheckItem?: (item: T) => void
  handleCheckAllItems?: (checked: boolean) => void
  onClickPicCount?: (row: T) => void
  rightClickMenuHeader?: (contextMenu: { mouseX: number; mouseY: number; row: T }) => string
  rightClickMenu?: { icon: JSX.Element; label: string; handleClick: (row: T) => void }[]
}

/**
 * queryParams 기반으로 동작하는 테이블.
 * @type T 데이터 배열 요소의 타입
 * @param header* 테이블 헤더 정보 (ex. {name: {label: '이름', canSort: true}, ...})
 * @param data* 테이블을 구성할 배열 데이터
 * @param handleRowClick* 행 클릭 시 동작 함수 (row: T) => void
 * @param loading* 데이터 로딩 여부
 * @param error* 데이터 에러 여부
 * @param multiException 하나의 column에 여러 데이터 표시 예외처리
 * @param listException 리스트 타입의 데이터 예외처리
 * @param isChecked 체크박스 prop
 * @param showCheckBox 체크박스 prop
 * @param handleCheckItem 체크박스 prop
 * @param handleCheckAllItems 체크박스 prop
 * @param rightClickMenuHeader 우클릭 prop: 우클릭 시 보이는 헤더의 문자열을 반환하는 함수
 * @param rightClickMenu 우클릭 prop: 우클릭 시 보이는 메뉴별 아이콘, 이름, 클릭 함수
 * @param onClickPicCount 테이블의 picCount 클릭 동작 함수
 *
 * @returns prop으로 받은 테이블 정보로 테이블 생성
 */
export default function BasicTable<T extends Record<keyof T, string | number | string[]>>({
  header,
  data,
  rightClickMenuHeader,
  rightClickMenu,
  handleRowClick,
  multiException,
  listException,
  loading,
  error,
  showCheckBox = false,
  isChecked,
  handleCheckItem,
  handleCheckAllItems,
  onClickPicCount
}: BasicTableProps<T>) {
  const isTablet = useContext(isTabletContext)
  const isMobile = useContext(isMobileContext)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const sort = searchParams.get('sort')?.split(',')
  const page = Number(searchParams.get('page') ?? 0)
  const size = Number(searchParams.get('size') ?? DEFAULT_PAGESIZE)

  const currentUserId = useCurrentUserStore(set => set.currentUser)?.userId

  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; row: T } | null>(null)

  const handleContextMenu = (event: MouseEvent, rowInfo: T) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            row: rowInfo
          }
        : // 닫힌 상태에서 다시 열릴 때 위치를 재설정하여 메뉴가 제대로 표시되도록 함
          null
    )
  }

  const handleClose = () => {
    setContextMenu(null)
  }

  const handleSorting = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams)

      if (!sort) {
        params.set('sort', `${key},asc`)
      } else if (sort[0] === key) {
        switch (sort[1]) {
          case 'asc':
            params.set('sort', `${key},desc`)
            break
          case 'desc':
            params.delete('sort')
            break
          default:
            break
        }
      } else {
        params.set('sort', `${key},asc`)
      }

      router.replace(pathname + '?' + params.toString())
    },
    [sort, searchParams, router, pathname]
  )

  return (
    <TableContainer
      sx={{
        mx: 2,
        width: theme => `calc(100% - ${theme.spacing(4)})`,
        border: '1px solid lightgray',
        overflowY: 'auto',
        maxHeight: '100%'
      }}
    >
      <Table stickyHeader aria-label='simple table' sx={{ position: 'relative', height: '100%' }}>
        <TableHead className='select-none'>
          <TableRow sx={{ zIndex: '2' }}>
            {showCheckBox && handleCheckAllItems && (
              <StyledTableCell>
                <Checkbox
                  sx={{ padding: 0 }}
                  onChange={e => {
                    const checked = e.target.checked

                    handleCheckAllItems(checked)
                  }}
                />
              </StyledTableCell>
            )}
            {!isTablet && (
              <StyledTableCell align='center' key='order' className='font-medium text-base'>
                번호
              </StyledTableCell>
            )}
            {Object.keys(header).map(key => {
              const k = key as keyof T

              return (
                <StyledTableCell
                  size={isMobile ? 'small' : 'medium'}
                  key={key}
                  align='center'
                  className={classNames(
                    'text-base',
                    {
                      'cursor-pointer hover:underline': !(loading || error) && header[k]?.canSort,
                      'font-bold select-none': header[k]?.canSort,
                      'font-medium': !header[k]?.canSort
                    },
                    { hidden: isTablet && header[k]?.hideOnTablet }
                  )}
                  sx={isTablet ? { p: 0, py: 2, px: 1 } : {}}
                  onClick={!(loading || error) && header[k]?.canSort ? () => handleSorting(key) : undefined}
                >
                  <div className='flex items-center justify-center gap-1'>
                    {header[k]?.label}
                    {header[k]?.canSort &&
                      (sort && sort[0] === k ? (
                        sort[1] === 'desc' ? (
                          <IconCaretDownFilled color='gray' size={18} />
                        ) : (
                          <IconCaretUpFilled color='gray' size={18} />
                        )
                      ) : (
                        <UnfoldMoreIcon className='text-gray-400' sx={{ fontSize: '18px' }} />
                      ))}
                  </div>
                </StyledTableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            new Array(3)
              .fill(0)
              .map((_, idx) => idx)
              .map(v => (
                <TableRow sx={{ zIndex: 0 }} key={v} className='animate-pulse'>
                  {['번호'].concat(Object.keys(header)).map(header => (
                    <StyledTableCell key={header}>
                      <div className='h-[22px] w-full grid place-items-center'>
                        <div className='h-2 w-full rounded bg-gray-300'></div>
                      </div>
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))
          ) : data && data.length > 0 ? (
            data.map((info, index) => {
              return (
                <TableRow
                  hover={true}
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className='cursor-pointer'
                  onClick={() => {
                    if (contextMenu) return

                    if (!showCheckBox) {
                      handleRowClick(info)
                    } else if (handleCheckItem) {
                      handleCheckItem(info)
                    }
                  }}
                  onContextMenu={e => {
                    rightClickMenu && handleContextMenu(e, info)
                  }}
                >
                  {/* 우클릭 메뉴 */}
                  {contextMenu && (
                    <Menu
                      slotProps={{ paper: { sx: { boxShadow: 'var(--mui-customShadows-sm)' } } }}
                      open={contextMenu !== null}
                      onClose={handleClose}
                      anchorReference='anchorPosition'
                      anchorPosition={
                        contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
                      }
                    >
                      {
                        <MenuItem
                          onClick={() => {
                            handleRowClick(contextMenu.row)
                            handleClose()
                          }}
                          sx={{ display: 'flex', alignItems: 'center', px: 3 }}
                        >
                          {rightClickMenuHeader && (
                            <div className='flex gap-2'>
                              <ListItemIcon className='grid place-items-center'>
                                <IconExclamationCircleFilled size={26} className='text-blue-500' />
                              </ListItemIcon>
                              <Typography variant='h5'>{rightClickMenuHeader(contextMenu)}</Typography>
                            </div>
                          )}
                        </MenuItem>
                      }
                      <Divider />
                      {rightClickMenu?.map(v => (
                        <MenuItem
                          sx={{ display: 'flex', alignItems: 'center' }}
                          key={v.label}
                          onClick={() => {
                            v.handleClick(contextMenu.row)
                            setContextMenu(null)
                          }}
                        >
                          <ListItemIcon className='grid place-items-center'>{v.icon}</ListItemIcon>
                          <Typography variant='h6' className='text-gray-500'>
                            {v.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                  {/* 체크박스 */}
                  {showCheckBox && isChecked && (
                    <StyledTableCell size={isMobile ? 'small' : 'medium'}>
                      <Checkbox
                        sx={{ padding: 0 }}
                        disabled={(info as any)?.memberId === currentUserId}
                        checked={isChecked(info)}
                      />
                    </StyledTableCell>
                  )}
                  {/* 번호 */}
                  {!isTablet && (
                    <StyledTableCell size={isMobile ? 'small' : 'medium'} align='center' key={'order'}>
                      <Typography>{page * size + index + 1}</Typography>
                    </StyledTableCell>
                  )}
                  {/* 데이터 출력 */}
                  {Object.keys(header).map(key => {
                    const k = key as keyof T

                    let cell: string | undefined = ''

                    // 1. MultiException 예외 처리
                    if (multiException && Object.keys(multiException).includes(key)) {
                      const t_key = key as keyof typeof multiException

                      const pieces = multiException[t_key]?.map(value =>
                        value === 'latestProjectEndDate' ? info[value]?.toString().slice(5) : info[value]
                      )

                      cell = pieces?.join(t_key === 'age' ? '  ' : ' ~ ')
                    }

                    // 2. ListException 처리
                    else if (listException && listException.includes(k)) {
                      const list = info[k] as string[]

                      // 세 개 이상일 경우 외 (length - 2) 로 처리
                      cell =
                        list.length < 3
                          ? list.join(', ')
                          : list
                              .slice(0, 2)
                              .join(', ')
                              .concat(` 외 ${list.length - 2}`)
                    }

                    // 3. Exception이 아닌 경우
                    else {
                      // remark의 경우 최대 3자까지만 출력
                      if (k === 'remark') {
                        cell = info[k]
                          ?.toString()
                          .slice(0, 3)
                          .concat(info[k]?.toString().length > 3 ? '..' : '')
                      } else {
                        cell = info[k] as string
                      }
                    }

                    return (
                      <StyledTableCell
                        size={isMobile ? 'small' : 'medium'}
                        key={k?.toString()}
                        align='center'
                        sx={isTablet ? { p: 0, py: 2, px: 1 } : {}}
                        className={classNames({ hidden: isTablet && header[k]?.hideOnTablet })}
                      >
                        {/* 사진의 경우 클릭 가능하도록 */}
                        <Typography
                          onClick={e => {
                            if (k === 'machinePicCount' && onClickPicCount) {
                              e.stopPropagation()
                              onClickPicCount(info)
                            }
                          }}
                          sx={{
                            ...(k === 'machinePicCount' && {
                              color: 'primary.main',
                              ':hover': { textDecoration: 'underline' }
                            })
                          }}
                        >
                          {cell}
                        </Typography>
                      </StyledTableCell>
                    )
                  })}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <StyledTableCell
                colSpan={Object.keys(header).length + 1}
                className='text-center'
                variant='body'
                sx={{ ...(error && { color: 'error.main' }) }}
              >
                {error ? '데이터를 불러오는 데 실패했습니다.' : '현재 조건을 충족하는 데이터가 없습니다.'}
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
