import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mantine/core'

// react-konvaを使用しているコンポーネントはdynamic importを利用する
const StageComponent = dynamic(() => import('@/components/StageComponent'), { ssr: false })

const CanvasPage: FC = () => {

  return (
    <Box sx={{ width: "100%" }}>
      <StageComponent />
    </Box>
  )
}

export default CanvasPage
