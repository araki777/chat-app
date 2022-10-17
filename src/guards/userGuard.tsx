import { useRouter } from 'next/router'
import { useUser } from '@/context/user'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}


const UserGuard = ({ children }: Props) => {
  const { user } = useUser();
  const router = useRouter();

  // if (user === undefined && router.pathname !== '/login' && router.pathname !== '/signUp') {
  //   router.push('/login');
  //   return null
  // }

  // if (user !== undefined && router.pathname === '/login') {
  //   router.push('/');
  //   return null
  // }

  return <>{children}</>
}

export default UserGuard
