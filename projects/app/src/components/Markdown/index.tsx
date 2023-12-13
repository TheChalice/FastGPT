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

const MermaidCodeBlock = dynamic(() => import('./img/MermaidCodeBlock'));
const MdImage = dynamic(() => import('./img/Image'));
const ChatGuide = dynamic(() => import('./chat/Guide'));
const EChartsCodeBlock = dynamic(() => import('./img/EChartsCodeBlock'));
const QuoteBlock = dynamic(() => import('./chat/Quote'));
const ImageBlock = dynamic(() => import('./chat/Image'));

export enum CodeClassName {
  guide = 'guide',
  mermaid = 'mermaid',
  echarts = 'echarts',
  quote = 'quote',
  img = 'img'
}

function Code({ inline, className, children }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const codeType = match?.[1];

  if (codeType === CodeClassName.mermaid) {
    return <MermaidCodeBlock code={String(children)} />;
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
  // console.log('isChatting', isChatting);
  if (isChatting === false) {
    console.log('source', source);
  }
//   const markdown = `
// # 示例
// 这是一个折线图的例子：
// \`\`\`linechart
// [
//  {
//     "name": "Page A",
//     "uv": 4000,
//     "pv": 2400
//   },
//   {
//     "name": "Page B",
//     "uv": 3000,
//     "pv": 1398
//   },
//   {
//     "name": "Page C",
//     "uv": 2000,
//     "pv": 9800
//   },
//   {
//     "name": "Page D",
//     "uv": 2780,
//     "pv": 3908
//   }
// ]
// \`\`\`
// `;
//   const markdown = `
// # 示例
// 这是一个折线图的例子：
// \`\`\`barchart
// [
//  {
//     "name": "Page A",
//     "uv": 4000,
//     "pv": 2400
//   },
//   {
//     "name": "Page B",
//     "uv": 3000,
//     "pv": 1398
//   },
//   {
//     "name": "Page C",
//     "uv": 2000,
//     "pv": 9800
//   },
//   {
//     "name": "Page D",
//     "uv": 2780,
//     "pv": 3908
//   }
// ]
// \`\`\`
// `;
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
  const isChart=true;
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
        {isChart && (
            <>
              <ReactMarkdown
                  components={chartRenderer}>
              {markdown}
              </ReactMarkdown>
            </>
        )}
        {!isChart && (
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
        )}

      </div>





  );
};

export default React.memo(Markdown);
