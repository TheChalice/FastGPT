import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';

import 'katex/dist/katex.min.css';
import styles from './index.module.scss';
import dynamic from 'next/dynamic';

import CodeLight from './CodeLight';
import chartRenderer from './chartRenderer';
import {Box} from "@chakra-ui/react";
// import LineChartComponent from "@/components/Markdown/LineChartComponent";
// import BarChartComponent from "@/components/Markdown/BarChartComponent";
// import PieChartComponent from "@/components/Markdown/PieChartComponent";

const MermaidCodeBlock = dynamic(() => import('./img/MermaidCodeBlock'));
const MdImage = dynamic(() => import('./img/Image'));
const ChatGuide = dynamic(() => import('./chat/Guide'));
const EChartsCodeBlock = dynamic(() => import('./img/EChartsCodeBlock'));
const QuoteBlock = dynamic(() => import('./chat/Quote'));
const ImageBlock = dynamic(() => import('./chat/Image'));
const LineChartComponent = dynamic(() => import('./LineChartComponent'));
const PieChartComponent = dynamic(() => import('./PieChartComponent'));
const BarChartComponent = dynamic(() => import('./BarChartComponent'));


export enum CodeClassName {
  guide = 'guide',
  mermaid = 'mermaid',
  echarts = 'echarts',
  quote = 'quote',
  img = 'img',
  piechart = 'piechart',
  barchart = 'barchart',
  linechart = 'linechart'
}

function Code({ inline, className, children }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const codeType = match?.[1];
  // console.log('codeType', codeType);
  if (codeType === CodeClassName.mermaid) {
    return <MermaidCodeBlock code={String(children)} />;
  }

 if (codeType === CodeClassName.linechart) {
     const chartData = JSON.parse(children)
    return <LineChartComponent code={chartData} />;;
  }
 if (codeType === CodeClassName.piechart) {
     const chartData = JSON.parse(children)
    return <PieChartComponent code={chartData} />;;
  }
if (codeType === CodeClassName.barchart) {
     const chartData = JSON.parse(children)
    return <BarChartComponent code={chartData} />;;
  }

  if (codeType === CodeClassName.guide) {
    return <ChatGuide text={String(children)} />;
  }
  if (codeType === CodeClassName.echarts) {
    return <EChartsCodeBlock code={String(children)} />;
  }
  if (codeType === CodeClassName.quote) {
    return <QuoteBlock code={String(children)} />;
  }
  if (codeType === CodeClassName.img) {
    return <ImageBlock images={String(children)} />;
  }
  return (
    <CodeLight className={className} inline={inline} match={match}>
      {children}
    </CodeLight>
  );
}
function Image({ src }: { src?: string }) {
  return <MdImage src={src} />;
}

const Markdown = ({ source, isChatting = false }: { source: string; isChatting?: boolean }) => {

  const markdown = `
# 示例
这是一个折线图的例子：
\`\`\`piechart
[
  {
    "name": "Group A",
    "value": 400,
    "color": "#ff0000"
  },
  {
    "name": "Group B",
    "value": 300,
    "color": "#00ff00"
  },
  {
    "name": "Group C",
    "value": 300,
    "color": "#0000ff"
  },
  {
    "name": "Group D",
    "value": 200,
    "color": "#8884d8"
  }
]
\`\`\`
`;


  const components = useMemo(
    () => ({
      img: Image,
      pre: 'div',
      p: 'div',
      code: Code
    }),
    []
  );

  const formatSource = source
    .replace(/\\n/g, '\n&nbsp;')
    .replace(/(http[s]?:\/\/[^\s，。]+)([。，])/g, '$1 $2');

  return (
      <div>

            <>
              <ReactMarkdown
                  className={`markdown ${styles.markdown}
      ${isChatting ? (source === '' ? styles.waitingAnimation : styles.animation) : ''}
    `}
                  remarkPlugins={[RemarkGfm, RemarkMath, RemarkBreaks]}
                  rehypePlugins={[RehypeKatex]}
                  // @ts-ignore
                  components={components}
                  linkTarget={'_blank'}
              >
                {formatSource}
              </ReactMarkdown>
            </>


      </div>
  );
};

export default React.memo(Markdown);
