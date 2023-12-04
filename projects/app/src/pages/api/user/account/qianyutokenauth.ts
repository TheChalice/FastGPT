// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { createJWT, setCookie } from '@fastgpt/service/support/permission/controller';
import { connectToDatabase,authQianyu } from '@/service/mongo';
import { getUserDetail } from '@/service/support/user/controller';
import type { PostLoginProps } from '@fastgpt/global/support/user/api.d';
import {PostSigninProps} from "@fastgpt/global/support/user/api.d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { token} = req.body as PostSigninProps;
    const tmbId=''
    // let username='root'
    let username=await authQianyu(token)
    console.log('username', username);
    if (!username) {
      throw new Error('取不出用户');
    }
    // 检测用户是否存在
    const user = await MongoUser.findOne({
      username
    });

    if (!user) {
      throw new Error('没这个用户');
    }
    //
    const userDetail = await getUserDetail({ tmbId, userId: user._id });
    //
    const fasttoken = createJWT(userDetail);
    setCookie(res, fasttoken);

    jsonRes(res, {
      data: {
        // user: userDetail,
        fasttoken
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
