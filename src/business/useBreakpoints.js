import { useTheme, useMediaQuery } from '@mui/material';

export default function useBreakpoints() {
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  const xl = useMediaQuery(theme.breakpoints.only('xl'));

  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const upXl = useMediaQuery(theme.breakpoints.up('xl'));

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));
  const downXl = useMediaQuery(theme.breakpoints.down('xl'));

  const screenSize = {
    xs, sm, md, lg, xl,
    upSm, upMd, upLg, upXl,
    downSm, downMd, downLg, downXl
  }

  return {screenSize};
}