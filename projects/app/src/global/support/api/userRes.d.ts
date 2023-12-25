import type { UserTypee } from '@fastgpt/global/support/user/type.d';
import type { PromotionRecordSchema } from '@fastgpt/global/support/activity/type.d';
export interface ResLogin {
  user: UserType;
  token: string;
}
export interface MyObject {
  label: string;
  value: string;
  qyoutput?:MyObject[]
}

export interface PromotionRecordType {
  _id: PromotionRecordSchema['_id'];
  type: PromotionRecordSchema['type'];
  createTime: PromotionRecordSchema['createTime'];
  amount: PromotionRecordSchema['amount'];
}
