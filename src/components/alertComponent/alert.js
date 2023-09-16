import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function BasicAlerts({ alerttype, message }) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {alerttype === 'error' && <Alert severity="error">{message}</Alert>}
      {alerttype === 'warning' && <Alert severity="warning">{message}</Alert>}
      {alerttype === 'info' && <Alert severity="info">{message}</Alert>}
      {alerttype === 'success' && <Alert severity="success">{message}</Alert>}
    </Stack>
  );
}
