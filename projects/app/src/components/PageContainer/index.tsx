import React, { useState, useEffect, useMemo } from 'react';
import { Box, useTheme, type BoxProps } from '@chakra-ui/react';
import MyBox from '../common/MyBox';

const PageContainer = ({ children, ...props }: BoxProps & { isLoading?: boolean }) => {
  const theme = useTheme();
    const [showMessage, setShowMessage] = useState(true);
    const paramValue = localStorage.getItem('paramName');
    useEffect(() => {
        if (paramValue == 'show') {
            setShowMessage(true);
        }else {
            setShowMessage(false);
        }
    })

  return (
    <MyBox bg={'myGray.100'} h={'100%'} p={!showMessage ?'':[0, 5]} px={!showMessage ?'':[0, 6]} {...props}>
      <Box
        h={'100%'}
        bg={'white'}
        borderRadius={props?.borderRadius || [0, '2xl']}
        border={['none', theme.borders.lg]}
        overflow={'overlay'}
      >
        {children}
      </Box>
    </MyBox>
  );
};

export default PageContainer;
