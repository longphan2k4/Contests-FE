import React from 'react';
import { Grid } from '@mui/material';

// Define types for the component
interface GridItemProps {
  children: React.ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  className?: string;
  sx?: Record<string, unknown>;
}

// Wrapper component for Grid that includes the 'item' prop by default
const GridItem: React.FC<GridItemProps> = ({ children, ...props }) => {
  return <Grid {...props}>{children}</Grid>;
};

export default GridItem; 