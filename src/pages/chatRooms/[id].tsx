import { useSession } from '@/context/session'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Input } from '@mantine/core';
import { IconSend } from '@tabler/icons'
import { SessionGuard } from '@/guards/SessionGuard'
import { Headers } from '@/components/Headers'
import { useInputState } from '@mantine/hooks'
import { io } from 'socket.io-client';
import axios from 'axios';

const chatRoomPage: NextPage = () => {
  const router = useRouter()
  const roomId = router.query.id
  const { socket } = useSession();
  const [stringValue, setStringValue] = useInputState<string>("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    socket?.emit('join', roomId)
  })

  const sendMessage: any = () => {
    socket?.emit('sendMessage', { roomId: roomId, msg: stringValue })
    setStringValue('')
  }

  socket?.on('giveMessage', (response) => {
    setChat([...chat, response])
  })

  return (
    <SessionGuard>
      <Headers />
      { chat ? chat.map((data) => (
        <div key={data}>{data}</div>
      )) : <></> }
      <Input value={stringValue} placeholder="メッセージを入力してください" rightSection={<IconSend onClick={() => sendMessage()} />} onChange={setStringValue} />
    </SessionGuard>
  )
}

export default chatRoomPage
