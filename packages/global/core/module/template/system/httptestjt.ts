import { FlowNodeInputTypeEnum, FlowNodeTypeEnum } from '../../node/constant';
import { FlowModuleTemplateType } from '../../type.d';
import { ModuleDataTypeEnum, ModuleInputKeyEnum, ModuleTemplateTypeEnum } from '../../constants';
import { Input_Template_TFSwitch } from '../input';
import { Output_Template_Finish } from '../output';

let qyToken='';


let selectlist=[
  { label: '千语', value: 'http://10.1.251.110:6442/qy' },
  { label: '千语test1', value: 'http://10.1.251.110:6442/qy/api/core/interface/showApis' },
  { label: '千语test2', value: 'http://10.1.251.110:6442/qy/api/base/user/query/page' }
]
if (typeof window !== 'undefined') {
  // 只有在浏览器环境中才运行这段代码
  // console.log('localStorage', localStorage);
  qyToken = localStorage.getItem('qyToken')||'';
  const selectliststr = localStorage.getItem('modellist')||'';
  // console.log('selectliststr',selectliststr);
  if (selectliststr) {
    selectlist = JSON.parse(selectliststr)
  }
}
// if (qyToken) {
//   selectlist.forEach(function (item){
//     item.value=item.value+'?qyToken='+qyToken
//   })
// }
export const HttptestModule: FlowModuleTemplateType = {
  id: FlowNodeTypeEnum.httptestRequest,
  templateType: ModuleTemplateTypeEnum.externalCall,
  flowType: FlowNodeTypeEnum.httptestRequest,
  avatar: '/imgs/module/http.png',
  name: 'HTTP（内部服务调用）',
  intro: '内部服务的HTTP POST 请求，实现更为复杂的操作（联网搜索、数据库查询等）',
  showStatus: true,
  inputs: [
    Input_Template_TFSwitch,
    {
      key: ModuleInputKeyEnum.httpUrl,
      value: selectlist[0].value,
      type: FlowNodeInputTypeEnum.select,
      valueType: ModuleDataTypeEnum.string,
      list:selectlist,
      label: '请求地址',
      description: '请求目标地址',
      placeholder: 'https://api.fastgpt.run/getInventory',
      required: true,
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.httpHeader,
      value: `X-Authorization:${qyToken}`,
      type: FlowNodeInputTypeEnum.input,
      valueType: ModuleDataTypeEnum.string,
      label: '请求header',
      description: '请求header对象',
      placeholder: 'Authorization:XXX',
      required: false,
      showTargetInApp: false,
      showTargetInPlugin: false
    },
  ],
  outputs: [Output_Template_Finish]
};
