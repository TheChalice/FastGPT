import type { moduleDispatchResType } from '@fastgpt/global/core/chat/type.d';
import type { ModuleDispatchProps } from '@/types/core/chat/type';
import { ModuleInputKeyEnum, ModuleOutputKeyEnum } from '@fastgpt/global/core/module/constants';
import { URL } from 'url';

export type HttpRequestProps = ModuleDispatchProps<{
  [ModuleInputKeyEnum.httpUrl]: string;
  [ModuleInputKeyEnum.httpHeader]?: string;
  [key: string]: any;
}>;
export type HttpResponse = {
  [ModuleOutputKeyEnum.failed]?: boolean;
  [ModuleOutputKeyEnum.responseData]: moduleDispatchResType;
  [key: string]: any;
};

export const dispatchHttptestRequest = async (props: Record<string, any>): Promise<HttpResponse> => {
  const {
    chatId,
    variables,
    inputs: { url,urlheader, ...body }
  } = props as HttpRequestProps;
  // console.log('urlheader', urlheader);
  const requestBody = {
    ...body,
    chatId,
    variables
  };
  // console.log('requestBody', requestBody);
  try {
    let response;
    if (urlheader) {
      response = await fetchData({
        url,
        body: requestBody,
        urlheader
      });
    }else {
      response = await fetchData({
        url,
        body: requestBody,
      });
    }


    return {
      responseData: {
        price: 0,
        body: requestBody,
        httpResult: response
      },
      ...response
    };
  } catch (error) {
    return {
      [ModuleOutputKeyEnum.failed]: true,
      responseData: {
        price: 0,
        body: requestBody,
        httpResult: { error }
      }
    };
  }
};

async function fetchData({
  url,
  body,
  urlheader
}: {
  url: string;
  body: Record<string, any>;
  urlheader?: string;
}): Promise<Record<string, any>> {
  // const qyToken = localStorage.getItem('qyToken');

  interface Headers {
    [key: string]: string;
  }

  function parseHeader(headerString: string): Headers {
    const headers: Headers = {};
    const headerPairs = headerString.split(',');

    headerPairs.forEach((pair) => {
      const index = pair.indexOf(':');
      if (index > -1) {
        const key = pair.substring(0, index).trim();
        const value = pair.substring(index + 1).trim();
        headers[key] = value;
      }
    });

    return headers;
  }

  // const qyToken = prameurl.searchParams.get('qyToken');

  if (urlheader) {

    let headers=parseHeader(urlheader)
    headers['Content-Type']='application/json'
    console.log('headers', headers);
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then((res) => res.json());

    return response;
  }else {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then((res) => res.json());

    return response;
  }

}
