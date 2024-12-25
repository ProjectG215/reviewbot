import * as React from 'react';
import Alert from '@mui/material/Alert';
import './OutlinedAlerts.css';

export default function OutlinedAlerts() {
  return (
    <div className="alert-container">
      <Alert variant="filled" severity="error">
      Uh-oh! Something went sideways... Please try again! 😅
      </Alert>
    </div>
  );
}
