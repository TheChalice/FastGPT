import React,{useState} from 'react';
import { NodeProps } from 'reactflow';
import NodeCard from '../render/NodeCard';
import { FlowModuleItemType } from '@fastgpt/global/core/module/type.d';
import Divider from '../modules/Divider';
import Container from '../modules/Container';
import RenderInput from '../render/RenderInput';
import { Box, Button } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import RenderOutput from '../render/RenderOutput';

import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum
} from '@fastgpt/global/core/module/node/constant';
import { ModuleIOValueTypeEnum } from '@fastgpt/global/core/module/constants';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 6);




const NodeHttp = ({ data }: NodeProps<FlowModuleItemType>) => {
  const [isActive, setIsActive] = useState(false);
  const { moduleId, inputs, outputs } = data;
  if ( data.inputs&&data.inputs[1].key === "url") {
    // console.log('data.inputs1', data.inputs);
    if (data.inputs[1].list) {
      // console.log('data.inputs2', data.inputs);
      data.inputs[1].list.forEach(function (item){
        // console.log('item', item.qyoutput);
        if (data.inputs[1].value === item.value) {
          // console.log('data.inputs3', data.inputs);

          if (item.parameters.length + 3 !== data.inputs.length) {
            data.inputs=[data.inputs[0],data.inputs[1],data.inputs[2]];
            if (item.parameters.length === 0) {
              setIsActive(!isActive);
              return
            }
            item.parameters.forEach(function (item:{name:string,dataType:string}){
              data.inputs.push( {
                connected:false,
                description: "",
                edit:true,
                key: item.name,
                label: item.name,
                required: false,
                type: "target",
                valueType: "string",
              })
            })
            setIsActive(!isActive);
          }

          if (item.qyoutput) {


            // if (data.outputs.length===3)  {
            //   console.log(item.parameters);
            //   data.outputs=[data.outputs[0]];
            //   item.qyoutput.forEach(function (item:{label:string}){
            //     data.outputs.push( {
            //       description:"",
            //       edit:true,
            //       key:item.label,
            //       label:item.label,
            //       targets:[{'moduleId': moduleId, 'key': 'text'}],
            //       type:"source",
            //       valueType:"string",
            //      })
            //   })
            //   setIsActive(!isActive);
            // }



          }
        }

      })


    }
  }
  return (
      <NodeCard minW={'350px'} {...data}>
        <Container borderTop={'2px solid'} borderTopColor={'myGray.200'}>
          <RenderInput moduleId={moduleId} flowInputList={inputs} />
        </Container>
        <Divider text="Output" />
        <Container>
          <RenderOutput moduleId={moduleId} flowOutputList={outputs} />
        </Container>
      </NodeCard>
  );
};
export default React.memo(NodeHttp);
