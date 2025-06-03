import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import InfoItem from './InfoItem';
import type { About } from '../types/about';

interface ContactInfoCardProps {
  aboutInfo: About;
  title?: string;
}

/**
 * Component hiển thị thông tin liên hệ trong card
 */
const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ 
  aboutInfo,
  title = 'Thông tin liên hệ'
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SchoolIcon sx={{ mr: 1 }} /> {title}
      </Typography>

      <Box>
        <InfoItem 
          icon={<SchoolIcon />} 
          label="Trường" 
          value={aboutInfo.schoolName} 
        />
        
        <InfoItem 
          icon={<SchoolIcon />} 
          label="Khoa" 
          value={aboutInfo.departmentName} 
        />
        
        <InfoItem 
          icon={<LanguageIcon />} 
          label="Website" 
          value={aboutInfo.website} 
          isLink
          linkType="web"
        />
        
        <InfoItem 
          icon={<EmailIcon />} 
          label="Email" 
          value={aboutInfo.email} 
          isLink
          linkType="email"
        />
        
        <InfoItem 
          icon={<FacebookIcon />} 
          label="Fanpage" 
          value={aboutInfo.fanpage} 
          isLink
          linkType="web"
        />
      </Box>
    </Paper>
  );
};

export default ContactInfoCard; 