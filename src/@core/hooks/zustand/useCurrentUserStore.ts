import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 로그인과 리프레쉬 반환값으로 오는 유저 정보를 전역 상태로 관리하기 위해 zustand 스토어 생성
// 사용처: 반갑습니다 멘트에 들어가는 유저 이름, 클릭 시 나오는 유저 모달

type UserInfoType = {
  userId: number
  name?: string
  role: string
  licenseSeq?: number
  licenseName?: string
} | null

interface CurrentUserState {
  currentUser: UserInfoType
  setCurrentUserName: (value: string) => void
  setCurrentUser: (value: UserInfoType) => void
}

const CurrentUserCreator: StateCreator<CurrentUserState> = set => ({
  // ⭐ 초기 상태 (State)
  currentUser: { userId: 0, name: '', role: '', licenseSeq: 0, licenseName: '' },

  // ⭐ 액션 (Action)
  setCurrentUserName: (value: string) => {
    set(prev => ({ currentUser: prev.currentUser && { ...prev.currentUser, name: value } })) // set 함수를 통해 상태 업데이트
    console.log(`zustand call (setCurrentUserName : ${value})!`)
  },

  // ⭐ 액션 (Action)
  setCurrentUser: (value: UserInfoType) => {
    set({ currentUser: value }) // set 함수를 통해 상태 업데이트
    console.log(`zustand call (setCurrentUser : ${value})!`)
  }
})

const useCurrentUserStore = create<CurrentUserState>()(
  persist(CurrentUserCreator, {
    name: 'currentUserInfo'
  })
)

export default useCurrentUserStore
