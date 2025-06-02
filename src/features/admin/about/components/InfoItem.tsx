import React from 'react';
import { Typography, Link, Box, type SvgIconProps } from '@mui/material';

interface InfoItemProps {
  icon: React.ReactElement<SvgIconProps>;
  label: string;
  value?: string | null;
  isLink?: boolean;
  linkType?: 'web' | 'email';
}

/**
 * Component hiển thị một mục thông tin với icon
 */
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isLink = false, linkType = 'web' }) => {
  if (!value) return null;

  return (
    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ mr: 1 }}>{icon}</Box>
      <Box>
        <strong>{label}:</strong>{' '}
        {isLink ? (
          <Link 
            href={linkType === 'email' ? `mailto:${value}` : value}
            target={linkType === 'web' ? '_blank' : undefined}
            rel={linkType === 'web' ? 'noopener' : undefined}
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </Box>
    </Typography>
  );
};

export default InfoItem; 