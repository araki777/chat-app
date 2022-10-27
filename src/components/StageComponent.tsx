import { FC, ReactNode, useEffect, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { Headers } from '@/components/Headers'
import { useSession } from '@/context/session';
import SessionGuard from '@/guards/SessionGuard';
import { useRouter } from 'next/router';
import { ThemeIcon } from '@mantine/core';
import { IconPhone } from '@tabler/icons';

type Props = {
  width: number;
  height: number;
}

type LineType = {
  points: number[]
}

interface MousePointItem {
  points: number[]
}

interface MousePointItems {
  [key: string]: MousePointItem
}

const StageComponent: FC = () => {
  const router = useRouter()
  const { socket, sessionUser } = useSession();
  const [room, setRoom] = useState<string>("");
  const [drawLine, setDrawLine] = useState<LineType>()
  const [lines, setLines] = useState<LineType[]>([])
  const [mouse, setMouse] = useState<MousePointItems>({})

  // router.queryまで読み込まれたら、roomをセット
  useEffect(() => {
    if (router.asPath !== router.route) {
      setRoom(router.query.id as string)
    }
  }, [router])

  // 他ユーザーのマウス状況を受け取る
  socket?.on("giveMouseMove", (response) => {
    // ユーザーごとにマウスポイント情報を保存
    setMouse({ [response.userId]: { points: response.points } })
  })

  // 描画処理を受け取る
  socket?.on("giveDraw", (response) => {
    setDrawLine({ points: response.points })
  })

  // 他の人の描画完了処理を受け取る
  socket?.on("giveDrawEnd", (response) => {
    setLines([...lines, { points: response.points }])
  })

  // 手書き開始
  const handleOnMouseDown = (e: any) => {
    const position = e.target.getStage().getPointerPosition()
    const { x, y } = position
    setDrawLine({
      points: [x, y]
    })
    // socket?.emit("draw", { roomId: room, points: [x, y] })
  }

  // 手書き中
  const handleOnMouseMove = (e: any) => {
    const position = e.target.getStage().getPointerPosition()
    const { x, y } = position
    // 一旦止めておく
    // socket?.emit("mouseMove", { roomId: room, points: [x, y], userId: sessionUser?.id })
    if (drawLine?.points) {
      setDrawLine({
        points: [...drawLine.points, x, y]
      })
    }
    // socket?.emit("draw", { roomId: room, points: [x, y] })
  }

  // 手書き終了
  const handleMouseUp = () => {
    if (!drawLine?.points) return
    setDrawLine(undefined)
    setLines([
      ...lines,
      { points: drawLine.points }
    ])
    socket?.emit("draw", { roomId: room, points: drawLine.points, status: 'end' })
  }

  const userMouseList: ReactNode[] = []
  Object.keys(mouse).forEach((key) => {
    userMouseList.push(<ThemeIcon key={key} sx={{
      position: 'absolute',
      top: mouse[key].points[0],
      left: mouse[key].points[1],
      zIndex: 10000 }}><IconPhone /></ThemeIcon>)
  })

  return (
    <SessionGuard>
      <Headers />
      { userMouseList }
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleOnMouseDown}
        onMouseMove={handleOnMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {[...lines, drawLine].map((line, index) => (
            <Line
              key={index}
              points={line?.points}
              fill="black"
              stroke="black"
              lineCap="round"
              draggable={true}
            />
          ))}
        </Layer>
      </Stage>
    </SessionGuard>
  )
}

export default StageComponent
