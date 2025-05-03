import React from 'react';
import { Button, ButtonProps, styled, keyframes, useMediaQuery, useTheme } from '@mui/material';

interface AnimatedButtonProps extends ButtonProps {
  animation?: 'shine' | 'pulse';
  smallOnMobile?: boolean;
}

const shine = keyframes`
  from {
    mask-position: 150%;
  }
  
  to {
    mask-position: -50%;
  }
`;

const StyledButton = styled(Button)<AnimatedButtonProps>(({ theme, animation }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    '&::before': {
      animation: animation === 'shine' ? `${shine} 0.85s ease-in-out` : 'none',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent)',
    mask: 'linear-gradient(#000 0 0)',
    maskComposite: 'exclude',
  },
}));

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  animation = 'shine', 
  smallOnMobile = true,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const mobileProps = isMobile && smallOnMobile ? {
    size: 'small' as const,
    sx: {
      ...(props.sx || {}),
      fontSize: '0.8rem',
      py: 0.75,
      minHeight: '36px',
    }
  } : {};
  
  return (
    <StyledButton animation={animation} {...props} {...mobileProps}>
      {children}
    </StyledButton>
  );
};

export default AnimatedButton; 