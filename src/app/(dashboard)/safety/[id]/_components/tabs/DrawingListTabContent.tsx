// src/app/(dashboard)/safety/[id]/_components/tabs/DrawingListTabContent.tsx
import { useParams } from 'next/navigation'
import { Typography } from '@mui/material'

const DrawingListTabContent = () => {
    const params = useParams()
    const safetyProjectId = params?.id as string

    return (
        <div className='h-full'>
            <Typography variant='h5'>도면목록</Typography>
        </div>
    )
}

export default DrawingListTabContent