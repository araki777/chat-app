import { useSession } from '@/context/session'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Box, Paper, Text } from '@mantine/core';
import { IconSend } from '@tabler/icons'
import { SessionGuard } from '@/guards/SessionGuard'
import { Headers } from '@/components/Headers'
import { useInputState } from '@mantine/hooks'
import axios from 'axios';
import RichTextEditor from '@/components/RichText';

const chatRoomPage: NextPage = () => {
  const router = useRouter()
  const { socket, sessionUser } = useSession();
  const [stringValue, setStringValue] = useInputState<string>("");
  const [message, setMessage] = useState<any[]>([]);
  const [room, setRoom] = useState<string>("");

  // メッセージ取得処理
  const getMessage = async () => {
    await axios.get('/api/messages', { params: { roomId: room } }).then((res) => {
      setMessage([...res.data])
    })
  }

  // router.queryまで読み込まれたら、roomをセット
  useEffect(() => {
    if (router.asPath !== router.route) {
      setRoom(router.query.id as string)
    }
  }, [router])

  // roomがセットされたら、メッセージを取得
  useEffect(() => {
    getMessage()
  }, [room])

  const sendMessage: any = () => {
    console.log(stringValue);
    socket?.emit('sendMessage', { userId: sessionUser?.id, roomId: room, msg: stringValue })
    setStringValue('')
  }

  socket?.on('giveMessage', (response) => {
    setMessage([...message, response])
  })

  return (
    <SessionGuard>
      <Headers />
      <Box>
        <Box sx={{ display: 'relative', overflowX: 'hidden', overflowY: 'scroll', height: 590 }}>
          { message ? message.map((data) => (
            ( data.user_id === sessionUser?.id ? (
              <Box key={data.id} sx={{ width: '100%', display: 'inline-block' }}>
                <Paper shadow="xs" radius="xl" p="lg" sx={{
                  float: 'right',
                  position: "relative",
                  margin: "1em 0",
                  padding: "13px !important",
                  background: "#e0edff",
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: "0",
                    right: -8,
                    marginTop: -5,
                    border: "7px solid transparent",
                    borderRight: "15px solid #e0edff",
                    transform: "rotate(145deg)",
                    filter: "drop-shadow(-1px 1px 1px rgb(0 0 0 / 5%))"
                  }
                  }}>
                  <Text sx={{ maxWidth: 400 }} size="xs" dangerouslySetInnerHTML={{ __html: data.message }} />
                </Paper>
              </Box>
            ) : (
              <Box key={data.id}>
                <Paper shadow="xs" radius="xl" p="lg" sx={{
                  display: "inline-block",
                  position: "relative",
                  margin: "1em 0",
                  padding: "13px !important",
                  background: "#e0edff",
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: "0",
                    left: -8,
                    marginTop: -5,
                    border: "7px solid transparent",
                    borderRight: "15px solid #e0edff",
                    transform: "rotate(45deg)",
                    filter: "drop-shadow(-1px 1px 1px rgb(0 0 0 / 5%))"
                  }
                  }}>
                  <Text sx={{ maxWidth: 400 }} size="xs" dangerouslySetInnerHTML={{ __html: data.message }} />
                </Paper>
              </Box>
            ))
          )) : <></> }
        </Box>
        <RichTextEditor value={stringValue} onChange={setStringValue} id="rte" controls={[
          ['bold', 'italic', 'underline', 'link', 'image'],
          ['unorderedList', 'h1', 'h2'],
          ['alignLeft', 'alignCenter', 'alignRight']
        ]} />
        <Button size="xs" sx={{
          float: 'right',
          margin: '10px 0 10px 10px',
          width: 40,
          paddingLeft: 10,
          paddingRight: 10
          }} onClick={() => sendMessage()}>
          <IconSend />
        </Button>
      </Box>
    </SessionGuard>
  )
}

export default chatRoomPage
