// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import {connectToDatabase, authQianyu, authQianyuurlList} from '@/service/mongo';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    let list=await authQianyuurlList()
    // console.log('list', list);

    jsonRes(res, {
      data: list
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
