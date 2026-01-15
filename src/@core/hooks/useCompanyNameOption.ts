import { useGetLicenseNames } from './customTanstackQueries'

export default function useLicenseNameOption() {
  const { data } = useGetLicenseNames()

  return data?.map(v => ({ label: v.licenseName, value: v.licenseName }))
}
