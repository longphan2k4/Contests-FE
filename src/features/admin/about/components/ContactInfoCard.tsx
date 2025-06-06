import React from 'react';
import { Paper, Typography } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InfoItem from './InfoItem';
import type { About } from '../types/about';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';

interface ContactInfoCardProps {
  aboutInfo: About;
}

/**
 * Component hiển thị thông tin liên hệ trong card
 */
const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ aboutInfo }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ContactMailIcon sx={{ mr: 1 }} /> Thông tin liên hệ
      </Typography>

      <InfoItem 
        icon={<SchoolIcon />} 
        label="Tên đơn vị" 
        value={aboutInfo.data.schoolName} 
      />
      
      <InfoItem 
        icon={<BusinessIcon />} 
        label="Phòng/Ban" 
        value={aboutInfo.data.departmentName} 
      />

      <InfoItem 
        icon={<EmailIcon />} 
        label="Email" 
        value={aboutInfo.data.email} 
        isLink 
        linkType="email" 
      />

      <InfoItem 
        icon={<LanguageIcon />} 
        label="Website" 
        value={aboutInfo.data.website} 
        isLink 
      />

      <InfoItem 
        icon={<FacebookIcon />} 
        label="Fanpage" 
        value={aboutInfo.data.fanpage} 
        isLink 
      />
    </Paper>
  );
};

export default ContactInfoCard;
