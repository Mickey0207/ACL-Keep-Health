import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SiteList: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/sites', { replace: true });
  }, [navigate]);
  return null;
};

export default SiteList;
