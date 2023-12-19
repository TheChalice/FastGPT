import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Box, Flex, Image, Spinner, useDisclosure, useTheme} from '@chakra-ui/react';
import { PageTypeEnum } from '@/constants/user';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import type {MyObject, ResLogin} from '@/global/support/api/userRes.d';
import { useRouter } from 'next/router';
import { useUserStore } from '@/web/support/user/useUserStore';
import { useChatStore } from '@/web/core/chat/storeChat';
import LoginForm from './components/LoginForm';
import {postqymodellist, posttokenSingin} from '@/web/support/user/api';
import { useToast } from '@/web/common/hooks/useToast';
import dynamic from 'next/dynamic';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { clearToken, setToken } from '@/web/support/user/auth';
import { feConfigs } from '@/web/common/system/staticData';
import CommunityModal from '@/components/CommunityModal';
import Script from 'next/script';
import MyTooltip from "@/components/MyTooltip";
import MyIcon from "@/components/Icon";
import Loading from '@/components/Loading';
import {useLoading} from "@/web/common/hooks/useLoading";
const RegisterForm = dynamic(() => import('./components/RegisterForm'));
const ForgetPasswordForm = dynamic(() => import('./components/ForgetPasswordForm'));

const Login = () => {
    const theme = useTheme();
    const { Loading } = useLoading();
    const Dom = useRef<HTMLDivElement>(null);
    const controlIconStyle = {
        w: '300px',
        cursor: 'pointer',
        p: 1,
        bg: 'white',
        // borderRadius: 'lg',
        // boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        // border: theme.borders.base,
        mr: 3
    };
    // 设置cookie的函数
    const setCookie = (name: string, value: string, days?: number) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
        console.log('document.cookie', document.cookie);
    };
  const router = useRouter();
  const { lastRoute = '' } = router.query as { lastRoute: string };
  const { isPc } = useSystemStore();
  const [pageType, setPageType] = useState<`${PageTypeEnum}`>(PageTypeEnum.login);
  const { setUserInfo } = useUserStore();
  const { setLastChatId, setLastChatAppId } = useChatStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toast } = useToast();
  const loginSuccess = useCallback(
    (res: ResLogin) => {
      // init store
      setLastChatId('');
      setLastChatAppId('');

      setUserInfo(res.user);
      setToken(res.token);

      setCookie('token', res.token, 7);
      setTimeout(() => {
        router.push(lastRoute ? decodeURIComponent(lastRoute) : '/app/list');
      }, 300);
    },
    [lastRoute, router, setLastChatId, setLastChatAppId, setUserInfo]
  );

  // function DynamicComponent({ type }: { type: `${PageTypeEnum}` }) {
  //   const TypeMap = {
  //     [PageTypeEnum.login]: LoginForm,
  //     [PageTypeEnum.register]: RegisterForm,
  //     [PageTypeEnum.forgetPassword]: ForgetPasswordForm
  //   };
  //
  //   const Component = TypeMap[type];
  //
  //   return <Component setPageType={setPageType} loginSuccess={loginSuccess} />;
  // }

  useEffect(() => {
    clearToken();
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const path = urlParams.get('path');

      if (token) {

          postqymodellist().then(function (res){
              // console.log('res', JSON.stringify(res));
              let selectlist=res
              // selectlist.forEach(function (item){
              //     item.value=item.value+'?qyToken='+token
              // })
              localStorage.setItem('modellist',JSON.stringify(selectlist))

              // router.replace('/app/list');
          }).catch(function (error){
              toast({
                  title: error.message || '获取model列表异常',
                  status: 'error'
              });
          })
          posttokenSingin({token}).then(function (res){
              localStorage.setItem('qyToken',token)
              console.log('res', res);
              setLastChatId('');
              setLastChatAppId('');

              setUserInfo(res.user);
              setToken(res.token);
              if (path) {
                  if (path === 'app') {
                      setTimeout(() => {
                          router.push('/app/list');
                      }, 300);
                  }else if(path === 'dataset'){
                      setTimeout(() => {
                          router.push('/dataset/list');
                      }, 300);
                  }else if(path === 'chat'){
                      setTimeout(() => {
                          router.push('/chat');
                      }, 300);
                  }else {
                      setTimeout(() => {
                          router.push('/app/list');
                      }, 300);
                  }
              }else {
                  setTimeout(() => {
                      router.push('/app/list');
                  }, 300);
              }

              // router.replace('/app/list');
          }).catch(function (error){
              toast({
                  title: error.message || '登录异常',
                  status: 'error'
              });
          })
          // setShowMessage(false);
      } else {

          // setShowMessage(true);
      }
    // router.prefetch('/app/list');
  }, []);

  return (
      <Box ref={Dom} w={'100%'} flex={'1 0 0'}  h={'100%'} position={'relative'}>
          <Loading loading={true} fixed={true} />
      </Box>

  );
};

export async function getServerSideProps(context: any) {
  return {
    props: { ...(await serviceSideProps(context)) }
  };
}

export default Login;
