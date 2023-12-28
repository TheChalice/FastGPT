import type { UserTypee } from '@fastgpt/global/support/user/type.d';
import type { PromotionRecordSchema } from '@fastgpt/global/support/activity/type.d';
export interface ResLogin {
  user: UserType;
  token: string;
}

interface Parameter {
  name: string;
  dataType: string;
}
export interface MyObject {
  label: string;
  value: string;
  qyoutput?:MyObject[];
  parameters?: { [key: string]: string; };
  parametersarr?: Parameter[];

}

export interface PromotionRecordType {
  _id: PromotionRecordSchema['_id'];
  type: PromotionRecordSchema['type'];
  createTime: PromotionRecordSchema['createTime'];
  amount: PromotionRecordSchema['amount'];
}
