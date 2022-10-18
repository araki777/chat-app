import { useUser } from '@/context/user'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Input } from '@mantine/core';
import { IconSend } from '@tabler/icons'
import UserGuard from '@/guards/userGuard'
import { Headers } from '@/components/Headers'
import { useInputState } from '@mantine/hooks'

const chatRoomPage: NextPage = () => {
  const router = useRouter()
  const roomId = router.query.id
  const { socket, setSocket } = useUser();
  const [stringValue, setStringValue] = useInputState<string>("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) {
      setSocket(io())
    }

    socket?.emit('join', roomId)
  }, [roomId])

  const sendMessage: any = () => {
    socket?.emit('sendMessage', { roomId: roomId, msg: stringValue })
    setStringValue('')
  }

  socket?.on('giveMessage', (response) => {
    setChat([...chat, response])
  })

  return (
    <UserGuard>
      <Headers />
      { chat ? chat.map((data) => (
        <div key={data}>{data}</div>
      )) : <></> }
      <Input value={stringValue} placeholder="メッセージを入力してください" rightSection={<IconSend onClick={() => sendMessage()} />} onChange={setStringValue} />
    </UserGuard>
  )
}

export default chatRoomPage
