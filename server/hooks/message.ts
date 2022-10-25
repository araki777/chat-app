import { supabase } from "../../src/lib/supabase";
import { PrismaClient } from "@prisma/client";
import { decode } from "punycode";

const prisma = new PrismaClient();

// supabaseのストレージ保存が上手く行かないので、後で対応
// 画像の共有自体は出来てるみたい...
export const createMessage = async (response: any) => {
  // const images = response.msg.match(/<img(.|\s)*?>/gi)
  // if (images) {
  //   for (let i = 0, l = images.length; i < l; i++) {
  //     const { data, error } = await supabase.storage.from('message-image').upload(
  //       images[i].match(/src=["|'](.*?)["|']/)[1],
  //       decode('base64FileData'),
  //       { contentType: 'image/png' })
  //   }
  //   const message = await prisma.messages.create({
  //     data: {
  //       message: response.msg,
  //       user_id: response.userId,
  //       room_id: response.roomId
  //     }
  //   })

  //   return message
  // } else {
    const message = await prisma.messages.create({
      data: {
        message: response.msg,
        user_id: response.userId,
        room_id: response.roomId
      }
    })

    return message
  // }
}
