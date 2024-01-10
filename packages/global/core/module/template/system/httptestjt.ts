import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { FlowModuleTemplateType } from '../../type';
import { ModuleIOValueTypeEnum, ModuleInputKeyEnum, ModuleTemplateTypeEnum } from '../../constants';
import {
  Input_Template_AddInputParam,
  Input_Template_DynamicInput,
  Input_Template_Switch
} from '../input';
import { Output_Template_AddOutput, Output_Template_Finish } from '../output';

let selectlist=[
  { label: '千语', value: 'http://10.1.251.110:6442/qy' },
  { label: '千语test1', value: 'http://10.1.251.110:6442/qy/api/core/interface/showApis' },
  { label: '千语test2', value: 'http://10.1.251.110:6442/qy/api/base/user/query/page' }
]
if (typeof window !== 'undefined') {
  // 只有在浏览器环境中才运行这段代码
  // console.log('localStorage', localStorage);
  const selectliststr = localStorage.getItem('modellist')||'';
  // console.log('selectliststr',selectliststr);
  if (selectliststr) {
    selectlist = JSON.parse(selectliststr)
  }
}
export const HttptestModule: FlowModuleTemplateType = {
  id: FlowNodeTypeEnum.httptestRequest,
  templateType: ModuleTemplateTypeEnum.externalCall,
  flowType: FlowNodeTypeEnum.httptestRequest,
  avatar: '/imgs/module/http.png',
  name: 'HTTP（内部服务调用）',
  intro: '内部服务的HTTP POST 请求，实现更为复杂的操作（联网搜索、数据库查询等）',
  showStatus: true,
  inputs: [
    Input_Template_Switch,
    {
      key: ModuleInputKeyEnum.httpMethod,
      type: FlowNodeInputTypeEnum.select,
      valueType: ModuleIOValueTypeEnum.string,
      label: 'core.module.input.label.Http Request Method',
      value: 'POST',
      list: [
        {
          label: 'GET',
          value: 'GET'
        },
        {
          label: 'POST',
          value: 'POST'
        }
      ],
      required: true,
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.httpReqUrl,
      type: FlowNodeInputTypeEnum.select,
      valueType: ModuleIOValueTypeEnum.string,
      value:selectlist[0].value,
      list:selectlist,
      label: 'core.module.input.label.Http Request Url',
      description: 'core.module.input.description.Http Request Url',
      placeholder: 'https://api.ai.com/getInventory',
      required: false,
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.httpHeader,
      type: FlowNodeInputTypeEnum.textarea,
      valueType: ModuleIOValueTypeEnum.string,
      label: 'core.module.input.label.Http Request Header',
      description: 'core.module.input.description.Http Request Header',
      placeholder: 'core.module.input.description.Http Request Header',
      required: false,
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    Input_Template_DynamicInput,
    {
      ...Input_Template_AddInputParam,
      editField: {
        key: true,
        name: true,
        description: true,
        required: true,
        dataType: true
      },
      defaultEditField: {
        label: '',
        key: '',
        description: '',
        inputType: FlowNodeInputTypeEnum.target,
        valueType: ModuleIOValueTypeEnum.string,
        required: true
      }
    }
  ],
  outputs: [
    Output_Template_Finish,
    {
      ...Output_Template_AddOutput,
      editField: {
        key: true,
        name: true,
        description: true,
        dataType: true
      },
      defaultEditField: {
        label: '',
        key: '',
        description: '',
        outputType: FlowNodeOutputTypeEnum.source,
        valueType: ModuleIOValueTypeEnum.string
      }
    }
  ]
};
