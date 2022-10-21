import { useSession } from '@/context/session'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Input } from '@mantine/core';
import { IconSend } from '@tabler/icons'
import { SessionGuard } from '@/guards/SessionGuard'
import { Headers } from '@/components/Headers'
import { useInputState, useShallowEffect } from '@mantine/hooks'
import axios from 'axios';

const chatRoomPage: NextPage = () => {
  const router = useRouter()
  const roomId = router.query.id
  const { socket, sessionUser } = useSession();
  const [stringValue, setStringValue] = useInputState<string>("");
  const [message, setMessage] = useState<string[]>([]);

  // useEffect(() => {
  //   axios.get('/api/messages', { params: { roomId: roomId } }).then((res) => {
  //     console.log(res);
  //     setMessage(res.data)
  //   })
  // }, [])

  const sendMessage: any = () => {
    socket?.emit('sendMessage', { userId: sessionUser?.id, roomId: roomId, msg: stringValue })
    setStringValue('')
  }

  socket?.on('giveMessage', (response) => {
    setMessage([...message, response])
  })

  return (
    <SessionGuard>
      <Headers />
      { message ? message.map((data) => (
        <div key={data}>{data}</div>
      )) : <></> }
      <Input value={stringValue} placeholder="メッセージを入力してください" rightSection={<IconSend onClick={() => sendMessage()} />} onChange={setStringValue} />
    </SessionGuard>
  )
}

export default chatRoomPage
