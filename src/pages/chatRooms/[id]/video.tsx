import { useSession } from "@/context/session";
import { SessionGuard } from "@/guards/SessionGuard";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const WebVideo: NextPage = () => {
  const { socket } = useSession()
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const yourVideoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()
  const [room, setRoom] = useState<string>("");

  // router.queryまで読み込まれたら、roomをセット
  useEffect(() => {
    if (router.asPath !== router.route) {
      setRoom(router.query.id as string)
    }
  }, [router])

  // roomがセットされたら、videoをセット
  useEffect(() => {
    const setVideoStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream
        if (stream) {
          socket?.emit("sendVideo", { roomId: room, stream: stream })
        }
      }
    }

    // const setAudioStream = async () => {
    //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    //   if (audioRef.current) {
    //     audioRef.current.srcObject = stream
    //   }
    // }

    setVideoStream()
    // setAudioStream()
  }, [socket])

  socket?.on("giveVideo", (response) => {
    console.log(response);
    if (yourVideoRef.current) {
      yourVideoRef.current.srcObject = response.stream
    }
  })

  return (
    <SessionGuard>
      <div>
        <video
          style={{ width: '300px', height: '300px', maxWidth: '100%' }}
          ref={myVideoRef}
          autoPlay
          playsInline />
        <video
          style={{ width: '300px', height: '300px', maxWidth: '100%' }}
          ref={yourVideoRef}
          autoPlay
          playsInline />
        {/* <audio
          ref={audioRef}
          controls
          autoPlay
        /> */}
      </div>
    </SessionGuard>
  )
}

export default WebVideo;
