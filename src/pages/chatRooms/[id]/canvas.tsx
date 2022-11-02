import { FC } from 'react'
import dynamic from 'next/dynamic'
import Headers from '@/modules/Headers'
import { Box } from '@mantine/core'

// react-konvaを使用しているコンポーネントはdynamic importを利用する
const StageComponent = dynamic(() => import('@/components/StageComponent'), { ssr: false })

const CanvasPage: FC = () => {

  return (
    <>
      <Headers>
        <></>
      </Headers>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: "300px", borderRight: "1px solid #e9ecef" }} />
        <StageComponent />
      </Box>
    </>
  )
}

export default CanvasPage
