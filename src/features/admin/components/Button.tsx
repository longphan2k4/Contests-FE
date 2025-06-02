import { Button as MuiButton } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & ButtonProps;

const Button: React.FC<Props> = ({ children, ...props }) => {
  return (
    <MuiButton variant="contained" {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
