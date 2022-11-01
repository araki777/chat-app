import {
  Header,
  Box,
} from '@mantine/core';
import { FC, ReactNode } from 'react';

const Headers: FC<{ children: ReactNode }> = ({children}) => {
  return (
    <Box>
      <Header height={60} px="md">
        {children}
      </Header>
    </Box>
  );
}

export default Headers
