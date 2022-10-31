import SessionGuard from "@/guards/SessionGuard";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import Peer, { MeshRoom, RoomStream } from "skyway-js";

let localStream: MediaStream

const CallArea: NextPage = () => {
  const router = useRouter()
  const [room, setRoom] = useState<string>("");
  const [peer, setPeer] = useState<Peer>();
  const [myPeerId, setMyPeerId] = useState<string>();

  // router.queryまで読み込まれたら、roomをセット
  useEffect(() => {
    if (router.asPath !== router.route) {
      setRoom(router.query.id as string)
    }
  }, [router])

  useEffect(() => {
    const peer = new Peer({
      key: process.env.NEXT_PUBLIC_SKYWAY_API_KEY as string,
    });
    setPeer(peer);
    peer.once('open', (id) => {
      setMyPeerId(id);
    });
  }, [room]);

  if (peer === undefined || myPeerId === undefined) return <></>;
  return <CallAreaMain peer={peer} myPeerId={myPeerId} roomId={room} />;
};

const CallAreaMain: React.FC<{
  peer: Peer;
  myPeerId: string;
  roomId: string;
}> = ({ peer, myPeerId, roomId }) => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [otherVideos, setOtherVideos] = useState<RoomStream[]>([]);
  const [joinRoom, setJoinRoom] = useState<MeshRoom>();

  useEffect(() => {
    // 自身のデバイスを取得
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      if (myVideoRef.current !== null) {
        myVideoRef.current.srcObject = stream;
      }
      localStream = stream;
    })
    .catch((error) => {
      console.error(error);
    });
  }, [])

  // =========== Room関係 ===========

  // 接続ボタンを押下時
  const joinRoomSubmit = () => {
    // ルームへ接続
    const room = peer.joinRoom(roomId, {
      mode: "mesh",
      stream: localStream
    })

    setJoinRoom(room);
  }

  // 切断ボタンを押下時
  const leaveRoomSubmit = () => {
    joinRoom?.close();
    setJoinRoom(undefined);
  }

  if (joinRoom) {
    // ルームへ接続したときの処理
    joinRoom.once("open", () => {
      console.log("=== You joined ===");
    })

    // ルーム切断時の処理
    joinRoom.once("close", () => {
      console.log("=== You left ===");
    })

    // ピア接続時に呼ばれる処理
    joinRoom.on("peerJoin", (peerId) => {
      console.log("=== " + peerId + " joined ===");
    })

    // ピアのストリーム取得時に呼ばれる
    joinRoom.on("stream", async (stream) => {
      setOtherVideos([...otherVideos, stream])
    })
  }

  // =========== 操作関係 ===========
  // 音声 ON/OFF
  const [audioOn, setAudioOn] = useState(true);
  const toggleAudio = () => {
    localStream.getAudioTracks()[0].enabled = !audioOn;
    setAudioOn(!audioOn);
  };

  // カメラ ON/OFF
  const [videoOn, setVideoOn] = useState(true);
  const toggleVideo = () => {
    localStream.getVideoTracks()[0].enabled = !videoOn;
    setVideoOn(!videoOn);
  }

  return (
    <SessionGuard>
      <div>
        <video ref={myVideoRef} autoPlay muted playsInline />
        <button onClick={joinRoomSubmit}>接続</button>
        <button onClick={leaveRoomSubmit}>切断</button>
        <button onClick={toggleAudio}>
          {audioOn === true ? '○音声がオンです' : '✖︎音声がオフです'}
        </button>
        <button onClick={toggleVideo}>
          {videoOn === true ? '○ビデオがオンです' : '✖︎ビデオがオフです'}
        </button>
        { otherVideos ? otherVideos.map((otherVideo) => {
          return <OtherVideo data={otherVideo} />
        }) : <></>}
      </div>
    </SessionGuard>
  )
}

const OtherVideo: FC<{data: RoomStream}> = ({data}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = data
    }
  })

  return (
    <video ref={videoRef} autoPlay muted playsInline />
  )
}

export default CallArea
