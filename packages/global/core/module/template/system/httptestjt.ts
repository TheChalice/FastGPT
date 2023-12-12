import { FlowNodeInputTypeEnum, FlowNodeTypeEnum } from '../../node/constant';
import { FlowModuleTemplateType } from '../../type.d';
import { ModuleDataTypeEnum, ModuleInputKeyEnum, ModuleTemplateTypeEnum } from '../../constants';
import { Input_Template_TFSwitch } from '../input';
import { Output_Template_Finish } from '../output';

export const HttptestModule: FlowModuleTemplateType = {
  id: FlowNodeTypeEnum.httptestRequest,
  templateType: ModuleTemplateTypeEnum.externalCall,
  flowType: FlowNodeTypeEnum.httptestRequest,
  avatar: '/imgs/module/http.png',
  name: 'HTTP（千语模块）',
  intro: '自己攒的HTTP POST 请求，实现更为复杂的操作（联网搜索、数据库查询等）',
  showStatus: true,
  inputs: [
    Input_Template_TFSwitch,
    {
      key: ModuleInputKeyEnum.httpUrl,
      value: 'http://10.1.251.110:6442/qy',
      type: FlowNodeInputTypeEnum.select,
      valueType: ModuleDataTypeEnum.string,
      list:[
        { label: '千语', value: 'http://10.1.251.110:6442/qy' },
        { label: '千语test', value: 'http://10.1.251.110:6442/qy' }
      ],
      label: '请求地址1111',
      description: '请求目标地址',
      placeholder: 'https://api.fastgpt.run/getInventory',
      required: true,
      showTargetInApp: false,
      showTargetInPlugin: false
    }
  ],
  outputs: [Output_Template_Finish]
};
