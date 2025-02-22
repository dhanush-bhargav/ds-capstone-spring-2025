// src/components/FloatingNavButtons.js
import React from 'react';
import { Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FloatingNavButtons = ({ onBack, onNext, disableBack, disableNext }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '600px',
    }}>
      <Fab 
        color="secondary" 
        onClick={onBack} 
        disabled={disableBack} 
        size="medium"
      >
        <ArrowBackIcon />
      </Fab>
      <Fab 
        color="primary" 
        onClick={onNext} 
        disabled={disableNext} 
        size="medium"
      >
        <ArrowForwardIcon />
      </Fab>
    </div>
  );
};

export default FloatingNavButtons;
