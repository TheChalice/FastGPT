import { startQueue } from './utils/tools';
import { PRICE_SCALE } from '@fastgpt/global/support/wallet/bill/constants';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { connectMongo } from '@fastgpt/service/common/mongo/init';
import { hashStr } from '@fastgpt/global/common/string/tools';
import { createDefaultTeam } from '@fastgpt/service/support/user/team/controller';
import { exit } from 'process';
import { initVectorStore } from '@fastgpt/service/common/vectorStore/controller';
import http from "http";
import axios from 'axios';
import qs from "querystring";
import jwt from "jsonwebtoken";
import {ERROR_ENUM} from "@fastgpt/global/common/error/errorCode";

/**
 * connect MongoDB and init data
 */
export function connectToDatabase(): Promise<void> {
  return connectMongo({
    beforeHook: () => {},
    afterHook: () => {
      initVectorStore();
      // start queue
      startQueue();
      return initRootUser();
    }
  });
}

async function initRootUser() {
  try {
    const rootUser = await MongoUser.findOne({
      username: 'root'
    });
    const psw = process.env.DEFAULT_ROOT_PSW || '123456';

    let rootId = rootUser?._id || '';

    // init root user
    if (rootUser) {
      await MongoUser.findOneAndUpdate(
        { username: 'root' },
        {
          password: hashStr(psw)
        }
      );
    } else {
      const { _id } = await MongoUser.create({
        username: 'root',
        password: hashStr(psw)
      });
      rootId = _id;
    }
    // init root team
    await createDefaultTeam({ userId: rootId, maxSize: 1, balance: 9999 * PRICE_SCALE });

    console.log(`root user init:`, {
      username: 'root',
      password: psw
    });
  } catch (error) {
    console.log('init root user error', error);
    exit(1);
  }
}
const qianyuBaseUrl = process.env.WEIXIN_BASE_URL || 'http://192.168.1.116:6441';
//console.log('process.env.WEIXIN_BASE_URL', process.env.WEIXIN_BASE_URL);
//console.log('qianyuBaseUrl', process.env.WEIXIN_BASE_URL);

export function authQianyu(token: string) {
  return new Promise<{
    username: string;
  }>((resolve, reject) => {

    // axios.get('http://10.19.90.46:18441/portal/newtest/jttest/chatbi/api/chat/opening?token='+token)
    const url=qianyuBaseUrl+'/qy/api/user/getUserName?token='+token
    //console.log('url',url);
    axios.get(url)
        .then((response) => {
          //console.log('response',response);
                // console.log(data);
                resolve(response.data.data || '');
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });

  });
}
type MyArrayType = {
  label: string;
  value: string;
}[];
export function authQianyuurlList() {
  return new Promise<MyArrayType>((resolve, reject) => {

    // axios.get('http://10.19.90.46:18441/portal/newtest/jttest/chatbi/api/chat/opening?token='+token)
    const url=qianyuBaseUrl+'/qy/api/core/interface/showApis'
    // console.log('url',url);
    axios.post(url,{})
        .then((response) => {
          // console.log('response',response.data.data);
          resolve(response.data.data || []);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });

  });
}
