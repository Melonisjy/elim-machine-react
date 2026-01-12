// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import {
  IconBolt,
  IconCalendar,
  IconChevronRight,
  IconCircle,
  IconClipboard,
  IconClipboardCheck,
  IconHeartHandshake,
  IconHistory,
  IconPaperclip,
  IconSettings,
  IconShield,
  IconSpeakerphone,
  IconUsers,
  IconUsersGroup,
  IconUsersPlus,
  IconZoomQuestion
} from '@tabler/icons-react'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
// import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <IconChevronRight />
  </StyledVerticalNavExpandIcon>
)

// const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  // const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        className='text-base'
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <IconCircle /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href={`/calendar`} icon={<IconCalendar />}>
          {'대시보드'}
        </MenuItem>
        <MenuSection label='기계설비점검'>
          <MenuItem disabled href={`/machine`} icon={<IconSettings />}>
            {'기계설비현장'}
          </MenuItem>
          <MenuItem disabled href={`/machine/engineer`} icon={<IconUsers />}>
            {'설비인력'}
          </MenuItem>
          <MenuItem disabled href={`/machine/template`} icon={<IconClipboard />}>
            {'양식관리'}
          </MenuItem>
        </MenuSection>
        <MenuSection label='안전진단전검'>
          <MenuItem href={`/safety`} icon={<IconShield />}>
            {'안전진단현장'}
          </MenuItem>
          <MenuItem href={`/safety/engineer`} icon={<IconUsersGroup />}>
            {'진단인력'}
          </MenuItem>
          <MenuItem disabled href={`/safety/fault`} icon={<IconBolt />}>
            {'결함관리'}
          </MenuItem>
        </MenuSection>
        <MenuSection label='문의'>
          <MenuItem disabled href={`/board/notice`} icon={<IconSpeakerphone />}>
            {'공지사항'}
          </MenuItem>
          <MenuItem disabled href={`/board/files`} icon={<IconPaperclip />}>
            {'자료실'}
          </MenuItem>
          <MenuItem disabled href={`/board/faq`} icon={<IconClipboardCheck />}>
            {'FAQ'}
          </MenuItem>
          <MenuItem disabled href={`/board/qna`} icon={<IconZoomQuestion />}>
            {'일대일 문의'}
          </MenuItem>
        </MenuSection>
        <MenuSection label='관리'>
          <MenuItem href={`/member`} icon={<IconUsersPlus />}>
            {'직원관리'}
          </MenuItem>
          <MenuItem href={`/loginlog`} icon={<IconHistory />}>
            {'로그인 기록'}
          </MenuItem>
        </MenuSection>
        <MenuSection label='라이선스'>
          <MenuItem href={`/license`} icon={<IconHeartHandshake />}>
            {'라이선스관리'}
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
