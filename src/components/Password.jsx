import { useEffect, useState } from 'react';
import { Button, FormControl, Input, InputLabel, Stack, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { updatePassword } from '../business/supabase_calls';
import useGlobalStore from '../business/useGlobalStore';
import { useNavigate } from 'react-router-dom';

const Password = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [match, setMatch] = useState(false);
  const [toggleShowPassword, setToggleShowPassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [resetPassword, setResetPassword] = useState(false)
  const [disableInput, setDisableInput] = useState(false)
  const navTo = useNavigate()

  useEffect(() => {
    const initSession = async () => {
        const hash = window.location.hash;
        console.log(hash)

        if (hash.includes('error_code=otp_expired')) {
            setErrorMsg('Your reset link has expired. Please request a new one.');
            setDisableInput(true)
            return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
            });

            if (error) {
            setErrorMsg('Failed to restore session. Please request a new link.');
            console.error(error);
            } else {
            setUserEmail(data?.user?.email ?? '');
            setResetPassword(true)
            console.log('✅ Session restored', data?.user?.email);
            }
        }
    };


    initSession();
  }, []);

  useEffect(() => {
    setMatch(newPassword && confPassword && newPassword === confPassword);
  }, [newPassword, confPassword]);

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    //   console.log(data, error)
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setStatus('Password updated successfully!');
      setNewPassword('');
      setConfPassword('');
      navTo('/')
    } catch (err) {
      setErrorMsg('Unexpected error occurred.');
    }
  };

  return (
    <Stack sx={{ height: '100%', width: '90%' }} paddingY={3}>
      {errorMsg && <Typography color="error">{errorMsg}</Typography>}
      {status && <Typography color="green">{status}</Typography>}

        <Stack sx={{ width: '90%' }} direction={'row'}>

            <Stack width={'90%'} justifyContent={'center'} alignItems={'center'}>
                <FormControl sx={{ paddingY: 2 }}>
                    <InputLabel htmlFor='password'>New password</InputLabel>
                    <Input
                    disabled={disableInput}
                    id='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={toggleShowPassword ? 'text' : 'password'}
                    />
                </FormControl>
            </Stack>

            <Stack justifyContent={'center'} alignItems={'center'}>
                <Button
                    onClick={() => setToggleShowPassword(prev => !prev)}
                >
                    {toggleShowPassword ? <i class="fi fi-sr-eye-crossed"></i> : <i class="fi fi-sr-eye"></i>}
                </Button>
            </Stack>

        </Stack>

        <Stack sx={{ width: '90%' }} direction={'row'} >

            <Stack width={'90%'} justifyContent={'center'} alignItems={'center'}>
                <FormControl sx={{ paddingY: 2 }}>
                    <InputLabel htmlFor='confpassword'>Confirm password</InputLabel>
                    <Input
                    disabled={disableInput}
                    id='confpassword'
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                    type={toggleShowPassword ? 'text' : 'password'}
                    />
                </FormControl>
            </Stack>

            <Stack justifyContent={'center'} alignItems={'center'}>
                <Button
                    onClick={() => setToggleShowPassword(prev => !prev)}
                >
                    {toggleShowPassword ? <i class="fi fi-sr-eye-crossed"></i> : <i class="fi fi-sr-eye"></i>}
                </Button>
            </Stack>

        </Stack>

        <Button disabled={!match} onClick={handleUpdate} sx={{ marginY: 2 }}>
            Accept
        </Button>
    </Stack>
  );
};

export default Password;

//<i class="fi fi-sr-eye"></i>
