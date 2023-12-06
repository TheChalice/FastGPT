import React, { useState, useCallback, useEffect } from 'react';
import {Box, Flex, Image, useDisclosure, useTheme} from '@chakra-ui/react';
import { PageTypeEnum } from '@/constants/user';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import type { ResLogin } from '@/global/support/api/userRes.d';
import { useRouter } from 'next/router';
import { useUserStore } from '@/web/support/user/useUserStore';
import { useChatStore } from '@/web/core/chat/storeChat';
import LoginForm from './components/LoginForm';
import { posttokenSingin } from '@/web/support/user/api';
import { useToast } from '@/web/common/hooks/useToast';
import dynamic from 'next/dynamic';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { clearToken, setToken } from '@/web/support/user/auth';
import { feConfigs } from '@/web/common/system/staticData';
import CommunityModal from '@/components/CommunityModal';
import Script from 'next/script';
import MyTooltip from "@/components/MyTooltip";
import MyIcon from "@/components/Icon";
const RegisterForm = dynamic(() => import('./components/RegisterForm'));
const ForgetPasswordForm = dynamic(() => import('./components/ForgetPasswordForm'));

const Login = () => {
    const theme = useTheme();
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

      if (token) {
          posttokenSingin({token}).then(function (){
              router.replace('/app/list');
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
    router.prefetch('/app/list');
  }, []);

  return (
    <>
      {feConfigs.googleClientVerKey && (
        <Script
          src={`https://www.recaptcha.net/recaptcha/api.js?render=${feConfigs.googleClientVerKey}`}
        ></Script>
      )}
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        bg={`url('/icon/login-bg.svg') no-repeat`}
        backgroundSize={'cover'}
        userSelect={'none'}
        h={'100%'}
        px={[0, '10vw']}
      >
        <Flex
          height="100%"
          w={'100%'}
          maxW={'1240px'}
          maxH={['auto', 'max(660px,80vh)']}
          backgroundColor={'#fff'}
          alignItems={'center'}
          justifyContent={'center'}
          py={[5, 10]}
          px={'5vw'}
          borderRadius={isPc ? 'md' : 'none'}
          gap={5}
        >
          {isPc && (
            <Image
              src={'/icon/loginLeft.svg'}
              order={pageType === PageTypeEnum.login ? 0 : 2}
              flex={'1 0 0'}
              w="0"
              maxW={'600px'}
              height={'100%'}
              maxH={'450px'}
              alt=""
              loading={'lazy'}
            />
          )}


          <Box
            position={'relative'}
            order={1}
            flex={`0 0 ${isPc ? '400px' : '100%'}`}
            height={'100%'}
            border="1px"
            borderColor="gray.200"
            py={5}
            px={10}
            borderRadius={isPc ? 'md' : 'none'}
          >
            {/*<DynamicComponent type={pageType} />*/}
              <MyTooltip label={'加载中...'}>
                  <MyIcon {...controlIconStyle} name={'common/loading'} />
              </MyTooltip>
              <p style={{textAlign: 'center'}}>{'获取单点用户中...'}</p>
            {/*{feConfigs?.concatMd && (*/}
            {/*  <Box*/}
            {/*    fontWeight={'bold'}*/}
            {/*    color={'myBlue.700'}*/}
            {/*    cursor={'pointer'}*/}
            {/*    position={'absolute'}*/}
            {/*    right={5}*/}
            {/*    bottom={3}*/}
            {/*    onClick={onOpen}*/}
            {/*  >*/}
            {/*    无法登录，点击联系*/}
            {/*  </Box>*/}
            {/*)}*/}
          </Box>
        </Flex>

        {isOpen && <CommunityModal onClose={onClose} />}
      </Flex>
    </>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: { ...(await serviceSideProps(context)) }
  };
}

export default Login;
