import * as React from 'react';
import Alert from '@mui/material/Alert';
import './OutlinedAlerts.css';

export default function OutlinedAlerts() {
  return (
    <div className="alert-container">
      <Alert variant="filled" severity="success">
      You're in! Explore ProBot now!🚀
      </Alert>
    </div>
  );
}
