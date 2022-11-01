import { useSession } from '@/context/session'
import { Group } from '@mantine/core'
import { MantineLogo } from '@mantine/ds'
import BaseButton from './BaseButton'


const HomeHeaderContents = () => {
  const { onSignOut } = useSession()

  return (
  <Group position="apart" sx={{ height: '100%' }}>
    <MantineLogo size={30} />

    <Group>
      <BaseButton type="button" value="ログアウト" onClick={() => onSignOut()} />
    </Group>
  </Group>
  )
}
export default HomeHeaderContents
