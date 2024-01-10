import type { moduleDispatchResType } from '@fastgpt/global/core/chat/type.d';
import type { ModuleDispatchProps } from '@/types/core/chat/type';
import { ModuleInputKeyEnum, ModuleOutputKeyEnum } from '@fastgpt/global/core/module/constants';
import { URL } from 'url';
import {ModulejtDispatchProps} from "@/types/core/chat/type";

export type HttpRequestProps = ModulejtDispatchProps<{
  [ModuleInputKeyEnum.abandon_httpUrl]: string;
  [ModuleInputKeyEnum.httpMethod]: string;
  [ModuleInputKeyEnum.httpReqUrl]: string;
  // [ModuleInputKeyEnum.httpHeader]: string;
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
    inputs: { url,system_httpReqUrl,urlheader, ...body },
    req
  } = props as HttpRequestProps;
  console.log('system_httpReqUrl', system_httpReqUrl);
  // console.log('props',props.res);
  // if (req) {
  //   console.log('Qytoken', req.headers.qytoken);
  // }

  const requestBody = {
    ...body,
    chatId,
    variables
  };
  // console.log('requestBody', requestBody);
  try {
    let response;
    if (req&&req.headers&&req.headers.qytoken) {
      const qytoken = req.headers.qytoken
      if (typeof qytoken === "string") {
        response = await fetchData({
          system_httpReqUrl,
          body: requestBody,
          qytoken
        });
      }

    }else {
      response = await fetchData({
        system_httpReqUrl,
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
                           system_httpReqUrl,
  body,
                           qytoken
}: {
  system_httpReqUrl: string;
  body: Record<string, any>;
  qytoken?: string;
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

  if (qytoken) {

    // let headers=parseHeader()
    // headers['Content-Type']='application/json'
    // headers['Content-Type']=qytoken
    console.log('url', system_httpReqUrl);
    console.log('qytoken', qytoken);

    const response = await fetch(system_httpReqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': qytoken,
      },
      body: JSON.stringify(body)
    }).then((res) => res.json());

    return response;
  }else {
    const response = await fetch(system_httpReqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then((res) => res.json());

    return response;
  }

}
