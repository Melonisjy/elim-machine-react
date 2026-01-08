'use client'

import React, { useState } from 'react'

import { MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'

import FormControlLabel from '@mui/material/FormControlLabel'

import styles from '@core/styles/customTable.module.css'

// 외벽 마감재 옵션
const exteriorWallFinishOptions = [
  { value: 'DECORATIVE_BRICK', label: '치장벽돌' },
  { value: 'TILE', label: '타일' },
  { value: 'STONE', label: '석재' },
  { value: 'COMPOSITE_PANEL', label: '복합판넬' },
  { value: 'EXPOSED_CONCRETE_WATER_PAINT', label: '노출콘크리트 위 수성페인트' },
  { value: 'OTHER', label: '기타' }
]

// 지반침하 옵션
const groundSubsidenceOptions = [
  { value: 'GROUND_SUBSIDENCE_ROAD', label: '지반침하 및 도로포장상태' },
  { value: 'ROAD_EXPANSION_JOINT', label: '도로부 신축이음부상태' }
]

// ===== 공통 스타일 상수 =====
// 테이블 셀의 기본 스타일을 한 곳에서 관리합니다.
// 이렇게 하면 나중에 스타일을 변경할 때 한 곳만 수정하면 됩니다.
const baseCellStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid #d1d5db'
}

const headerCellStyle: React.CSSProperties = {
  ...baseCellStyle,
  fontWeight: 600,
  background: '#f3f4f6',
  textAlign: 'center'
}

// ===== 테이블 셀 래퍼 컴포넌트 =====
// 반복되는 <td>, <th> 태그를 컴포넌트로 만들어서 코드를 간결하게 합니다.
type CellProps = {
  children?: React.ReactNode
  colSpan?: number
  rowSpan?: number
  style?: React.CSSProperties
}

const Td: React.FC<CellProps> = ({ children, colSpan, rowSpan, style }) => (
  <td colSpan={colSpan} rowSpan={rowSpan} style={{ ...baseCellStyle, ...style }}>
    {children}
  </td>
)

const Th: React.FC<CellProps> = ({ children, colSpan, rowSpan, style }) => (
  <th colSpan={colSpan} rowSpan={rowSpan} style={{ ...headerCellStyle, ...style }}>
    {children}
  </th>
)

// ===== TextField 래퍼 컴포넌트 =====
// 자주 사용하는 TextField 설정을 간단하게 만들어줍니다.
type TextFieldProps = {
  placeholder?: string
  multiline?: boolean
  rows?: number
  type?: string
}

const FormTextField: React.FC<TextFieldProps> = ({ placeholder, multiline, rows, type }) => (
  <TextField
    size='small'
    fullWidth
    variant='outlined'
    placeholder={placeholder}
    multiline={multiline}
    rows={rows}
    type={type}
  />
)

// ===== 층별 데이터 정의 =====
// 옥탑지붕층, 지상층, 지하층은 완전히 동일한 구조를 가지고 있습니다.
// 이렇게 데이터 배열로 만들면 반복 코드를 크게 줄일 수 있습니다.
const floorSections = [
  {
    title: '옥탑지붕층',
    description: '(헬리포트,옥탑층,지붕층,EV기계실,물탱크실,태양광 등)'
  },
  {
    title: '지상층',
    description: '(계단실,복도,EV홀,상층부 주차장,램프,공조실 등)'
  },
  {
    title: '지하층',
    description: '(전기실,발전기실,기계실,물탱크실,저수조실,지하주차장, 주차장램프 등)'
  }
]

const SafetyInspectionFormTabContent = () => {
  const [exteriorWallFinish, setExteriorWallFinish] = useState('OTHER')
  const [ventilationType, setVentilationType] = useState('')
  const [groundSubsidence, setGroundSubsidence] = useState('GROUND_SUBSIDENCE_ROAD')
  

  return (
    <div className='h-full flex flex-col max-w-[890px]'>
      <div
        style={{
          overflow: 'hidden',
          background: '#fafbfc',
          fontSize: 15,
          marginBottom: 16,
          overflowY: 'auto'
        }}
      >
        <div className={styles.container}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {/* ----- 헤더 정보 ----- */}
              <tr>
                <Th style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', whiteSpace: 'nowrap' }}>
                  점검자
                </Th>
                <Td colSpan={3} style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
                  <FormTextField />
                </Td>
                <Th style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', whiteSpace: 'nowrap' }}>
                  점검일자
                </Th>
                <Td colSpan={3} style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
                  <FormTextField type='date' />
                </Td>
              </tr>
              <tr>
                <Th style={{ whiteSpace: 'nowrap' }}>건물명</Th>
                <Td colSpan={3}>
                  <FormTextField />
                </Td>
                <Th style={{ whiteSpace: 'nowrap' }}>종별</Th>
                <Td colSpan={3}>
                  <FormTextField />
                </Td>
              </tr>
              <tr>
                <Th style={{ whiteSpace: 'nowrap' }}>점검항목</Th>
                <Td colSpan={7}>
                  <FormTextField />
                </Td>
              </tr>
              <tr>
                <Th style={{ whiteSpace: 'nowrap' }}>전경사진</Th>
                <Td colSpan={7} style={{ minHeight: '150px' }}>
                  {/* 사진 영역 */}
                </Td>
              </tr>

              {/* ----- 외벽 마감재 ----- */}
              {/* 첫 번째 행: 외벽 마감재 헤더 + 드롭다운 + 정면/우측/배면/좌측 헤더 + 기타 input */}
              <tr>
                <Th rowSpan={5} style={{ textOrientation: 'mixed', verticalAlign: 'middle' }}>
                  외벽
                  <br />
                  마감재
                </Th>
                <Td colSpan={2} rowSpan={4} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <Select
                    value={exteriorWallFinish}
                    onChange={e => setExteriorWallFinish(e.target.value)}
                    size='small'
                    fullWidth
                  >
                    {exteriorWallFinishOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Td>
                <Th style={{ width: '20%' }}>정면</Th>
                <Th style={{ width: '20%' }}>우측</Th>
                <Th style={{ width: '20%' }}>배면</Th>
                <Th style={{ width: '20%' }}>좌측</Th>
                <Td style={{ width: '20%' }}>
                  <FormTextField placeholder='기타' />
                </Td>
              </tr>
              {/* 첫 번째 데이터 행 */}
              <tr>
                <Td colSpan={1} style={{ height: '40px', verticalAlign: 'middle' }}></Td>
                <Td colSpan={1} style={{ height: '40px', verticalAlign: 'middle' }}></Td>
                <Td colSpan={1} style={{ height: '40px', verticalAlign: 'middle' }}></Td>
                <Td colSpan={1} style={{ height: '40px', verticalAlign: 'middle' }}></Td>
                <Td colSpan={3} style={{ height: '40px', verticalAlign: 'middle' }}></Td>
              </tr>
              {/* 두 번째 데이터 행 */}
              <tr>
                <Td colSpan={1} style={{ height: '40px' }}>
                  <FormTextField />
                </Td>
                <Td colSpan={1} style={{ height: '40px' }}>
                  <FormTextField />
                </Td>
                <Td colSpan={1} style={{ height: '40px' }}>
                  <FormTextField />
                </Td>
                <Td colSpan={1} style={{ height: '40px' }}>
                  <FormTextField />
                </Td>
                <Td colSpan={3} style={{ height: '40px' }}>
                  <FormTextField />
                </Td>
              </tr>
              {/* 보유필요시 사유 */}
              <tr>
                <Th colSpan={5}>보유필요시 사유</Th>
              </tr>
              <tr>
                <Td colSpan={2}>
                  <FormTextField placeholder='기타' />
                </Td>
                <Td colSpan={5}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* ----- 부대 시설 ----- */}
              {/* 환기구 (덮개상태) */}
              <tr>
                <Th rowSpan={16} style={{ textOrientation: 'mixed', verticalAlign: 'middle' }}>
                  부대
                  <br />
                  시설
                </Th>
                <Td colSpan={2} rowSpan={3} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  환기구 (덮개상태)
                  <br />
                  <small style={{ fontSize: 12, color: '#666' }}>
                    (바닥형 : 안전펜스, 추락위험 경고표지판 설치여부)
                  </small>
                </Td>
                <Td colSpan={2} rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {/* 사진 영역 */}
                </Td>
                <Td style={{ textAlign: 'center' }}>
                  <RadioGroup
                    row
                    value={ventilationType}
                    onChange={e => setVentilationType(e.target.value)}
                    sx={{ gap: 1, justifyContent: 'center' }}
                  >
                    <FormControlLabel value='FLOOR' control={<Radio size='small' />} label='바닥형' />
                  </RadioGroup>
                </Td>
                <Th colSpan={2} rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  보수사유
                </Th>
              </tr>
              <tr>
                <Td style={{ textAlign: 'center' }}>
                  <RadioGroup
                    row
                    value={ventilationType}
                    onChange={e => setVentilationType(e.target.value)}
                    sx={{ gap: 1, justifyContent: 'center' }}
                  >
                    <FormControlLabel value='WALL' control={<Radio size='small' />} label='벽부형' />
                  </RadioGroup>
                </Td>
              </tr>
              <tr>
                <Td colSpan={2}>
                  <FormTextField />
                </Td>
                <Td style={{ textAlign: 'center' }}>
                  <RadioGroup
                    row
                    value={ventilationType}
                    onChange={e => setVentilationType(e.target.value)}
                    sx={{ gap: 1, justifyContent: 'center' }}
                  >
                    <FormControlLabel value='STANDING' control={<Radio size='small' />} label='입상형' />
                  </RadioGroup>
                </Td>
                <Td colSpan={2}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* 지반침하 및 도로포장 */}
              <tr>
                <Td colSpan={2} rowSpan={5} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <Select
                    value={groundSubsidence}
                    onChange={e => setGroundSubsidence(e.target.value)}
                    size='small'
                    fullWidth
                  >
                    {groundSubsidenceOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Td>
                <Th>정면</Th>
                <Th>우측</Th>
                <Th>배면</Th>
                <Th>좌측</Th>
                <Td>
                  <FormTextField placeholder='기타' />
                </Td>
              </tr>
              <tr>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
              </tr>
              <tr>
                <Td><FormTextField /></Td>
                <Td><FormTextField /></Td>
                <Td><FormTextField /></Td>
                <Td><FormTextField /></Td>
                <Td><FormTextField /></Td>
              </tr>
              <tr>
                <Th colSpan={5} style={{ textAlign: 'left', fontSize: 12, color: '#666' }}>
                  보수필요시 사유 예)포장 B등급:양호 / C등급:차량운전자 불쾌감 유발 / D등급:8cm이상포트홀,상시물고임
                  안전저하
                </Th>
              </tr>
              <tr>
                <Td colSpan={5}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* 옹벽 • 석축 • 사면 */}
              <tr>
                <Td colSpan={2} rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  옹벽 • 석축 • 사면
                </Td>
                <Th>옹벽</Th>
                <Th>석축</Th>
                <Th>사면</Th>
                <Th colSpan={2}>보수사유</Th>
              </tr>
              <tr>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td colSpan={2}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* 담장 */}
              <tr>
                <Td colSpan={2} rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  담장
                </Td>
                <Td colSpan={3} rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {/* 사진 영역 */}
                </Td>
                <Th colSpan={2}>보수사유</Th>
              </tr>
              <tr>
                <Td colSpan={2}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* 추락방지시설 */}
              <tr>
                <Td rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  추락방지 시설
                </Td>
                <Td style={{ textAlign: 'center' }}>점검로</Td>
                <Td colSpan={3} style={{ textAlign: 'center' }}>
                  {/* 사진 영역 */}
                </Td>
                <Th colSpan={2}>보수사유</Th>
              </tr>
              <tr>
                <Td style={{ textAlign: 'center' }}>외부난간</Td>
                <Td colSpan={3} style={{ textAlign: 'center' }}>
                  {/* 사진 영역 */}
                </Td>
                <Td colSpan={2}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* 천창, 채광창(썬큰) */}
              <tr>
                <Td colSpan={2} rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  천창, 채광창(썬큰)
                </Td>
                <Th colSpan={2}>천창</Th>
                <Th colSpan={1}>채광창(썬큰)</Th>
                <Th colSpan={2}>보수사유</Th>
              </tr>
              <tr>
                <Td colSpan={2} style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td colSpan={1} style={{ textAlign: 'center' }}>{/* 사진 영역 */}</Td>
                <Td colSpan={2}>
                  <FormTextField multiline rows={3} />
                </Td>
              </tr>

              {/* 현장관계자 연락처 • 메모사항 */}
              <tr>
                <Th
                  colSpan={3}
                  rowSpan={2}
                  style={{ textAlign: 'left', verticalAlign: 'middle' }}
                >
                  현장관계자 연락처 • 메모사항
                  <br />
                  <small style={{ fontSize: 12, color: '#666', fontWeight: 400 }}>
                    (예:현장동행,관리주체fms승인,안전모착용)
                  </small>
                </Th>
                <Td colSpan={5} rowSpan={2}>
                  <FormTextField multiline rows={4} />
                </Td>
              </tr>
              <tr></tr>
              {/* 건축물 점검결과 점검자 의견 */}
              <tr>
                <Th colSpan={1} style={{ border: '2px solid #000', whiteSpace: 'nowrap' }}>
                  건축물 점검결과
                  <br />
                  점검자 의견
                </Th>
                <Td colSpan={7} style={{ border: '2px solid #000', borderLeft: 'none' }}>
                  <FormTextField multiline rows={7} />
                </Td>
              </tr>
              {/* 층별 점검 항목 */}
              {/* 옥탑지붕층, 지상층, 지하층은 동일한 구조를 가지고 있어서 map으로 반복 렌더링합니다. */}
              {floorSections.map((floor, index) => (
                <React.Fragment key={floor.title}>
                  <tr>
                    <Th rowSpan={3} style={{ verticalAlign: 'middle', width: '250px' }}>
                      {floor.title}
                      <br />
                      <small style={{ fontSize: 12, color: '#666', fontWeight: 400 }}>
                        {floor.description}
                      </small>
                    </Th>
                    {/* 첫 번째 행: 입력 필드 7개 */}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Td key={`input-${i}`}>
                        <FormTextField />
                      </Td>
                    ))}
                  </tr>
                  {/* 두 번째 행: 사진 영역 7개 */}
                  <tr>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Td key={`photo-${i}`} style={{ textAlign: 'center' }}>
                        {/* 사진 영역 */}
                      </Td>
                    ))}
                  </tr>
                  {/* 세 번째 행: 입력 필드 7개 */}
                  <tr>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Td key={`input2-${i}`}>
                        <FormTextField />
                      </Td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SafetyInspectionFormTabContent
