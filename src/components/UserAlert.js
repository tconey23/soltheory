import { useEffect, useState } from 'react';
import { useGlobalContext } from '../business/GlobalContext';
import { Snackbar } from '@mui/material';

const UserAlert = () => {
  const [display, setDisplay] = useState(false);
  const { alertProps } = useGlobalContext();
  const [icon, setIcon] = useState()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDisplay(false);
  };

  useEffect(() => {
    console.log(alertProps)
    if (alertProps.display) {
      setDisplay(true);

      switch(alertProps.severity) {
        case 'error': setIcon(<i className="fi fi-sr-exclamation" style={{color: 'gold'}}></i>)
        break;
        case 'success': setIcon(<i class="fi fi-sr-check-circle" style={{color: 'green'}}></i>)
        break;
      }

    }
  }, [alertProps]);



  return (
    <Snackbar
      open={display}
      autoHideDuration={3000}
      onClose={handleClose}
      message={
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon}
            {alertProps.text}
            </span>
        }
    />
  );
};

export default UserAlert;
