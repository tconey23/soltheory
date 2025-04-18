import { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, Container, Button, MenuList, ListItem, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import solTheoryLogo from "../assets/soltheorylogo.png";
import { useNavigate } from "react-router-dom";
import {useMediaQuery} from "@mui/material";
import { useGlobalContext } from "../business/GlobalContext";
import { Stack } from "@mui/material";
import {Modal} from "@mui/material";

const AppHeader = () => {
  const {alertProps, setAlertProps, isMobile, user, setUser, avatar} = useGlobalContext()
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false)
  const nav = useNavigate()

  
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReady(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleCloseNavMenu = () => {
   isMobile ? setMobileMenu(false) : setMobileMenu(false)
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    handleCloseModal({type: 'button'})

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('🚫 User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsReady(false);
  };
  const pages = ["SOL Games", "Thrive", "ESC", "Personos", "About"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];



  // Open and close handlers for "SOL Games" dropdown
  const handleOpenGamesMenu = (event) => {
    // setAnchorElGames(event.currentTarget);
    handleCloseNavMenu()
    nav('/games')
  };

  const handleCloseModal = (target) => {
    if(target.type !== 'button'){
      setMobileMenu(false)
    }
  }

  const handleAccount = () =>{
    if(user?.user?.name && user?.user?.email){
      nav('/account')
    } else {
      nav('/login')
    }

  }

  useEffect(() => {
    console.log(avatar)
  }, [user])

  return (
    <Stack height={'10vh'} width={'100vw'}>
    <AppBar position="static" sx={{display: 'flex', justifyContent: 'center', height: '100%'}}>
      <Container maxWidth="xl sx={{height: '100%'}}">
        <Toolbar disableGutters sx={{height: '100%'}}>
          <Link to="/home">
            <img height={"75px"} src={solTheoryLogo} alt="Sol Theory Logo" />
          </Link>

          {
            !isMobile && 
            <Box sx={{ flexGrow: 1, display: 'flex' }}>

            {pages.map((page, i) =>
              page === "SOL Games" ? (
                <Box key={`${page}${i}`} sx={{ position: "relative" }}>
                  <Button
                    key={`${page}${i}`}
                    onClick={handleOpenGamesMenu}
                    sx={{ my: 2, color: "white", display: "block", margin: 1}}
                    variant="contained"
                    >
                    {page}
                  </Button>
                </Box>
              ) : (
                <>
                <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block", margin: 1}}
                variant="contained"
                >
                    {page}
                  </Button>
                </>
              )
            )}

            {!isInstalled && 
            <Button
             sx={{ my: 2, color: "white", display: "block", margin: 1}}
             variant="contained"
             onClick={handleInstallClick} className="install-button">
                Install App
            </Button>}
          </Box>
          }

          {
            isMobile &&  
              <>
                <Stack direction={'row'} width={'100%'} justifyContent={'flex-end'}>  
                  <Button onClick={() => setMobileMenu(prev => !prev)} variant="contained">=</Button>
                </Stack>
              </>
          }
          <Button>
            <Avatar sx={{background: 'limeGreen'}}>
              <i class="fi fi-sr-envelope"></i>
            </Avatar>
          </Button>
          <Button onClick={() => nav('/friends')} >
            <Avatar>
              <i class="fi fi-rr-users"></i>
            </Avatar>
          </Button>
          <Button onClick={() => handleAccount()}>
            <Avatar key={user} src={avatar ? avatar : null}/>
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
    
    
    <Modal
      open={mobileMenu}
      onClick={(e) => handleCloseModal(e.target)}
      userData='MenuModal'
    >
              <Stack height={'100%'} width={'100%'} userData='MenuWrapper'>
                <Stack marginTop={10}>
                  <MenuList>
                    {pages.map((page, i) =>
                      page === "SOL Games" ? (
                        <ListItem userData='ListItem' key={`${page}${i}`} sx={{ position: "relative" }}>
                          <Button
                            key={`${page}${i}`}
                            onClick={handleOpenGamesMenu}
                            sx={{ my: 2, color: "white", display: "block", margin: 1}}
                            variant="contained"
                          >
                            {page}
                          </Button>
                        </ListItem>
                      ) : (
                        <ListItem userData='ListItem' key={`${page}${i}`} sx={{ position: "relative" }}>
                          <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: "white", display: "block", margin: 1}}
                            variant="contained"
                          >
                            {page}
                          </Button>
                      </ListItem>
                      )
                    )}
                    <ListItem>
                    {!isInstalled && 
                      <Button
                      sx={{ my: 2, color: "white", display: "block", margin: 1}}
                      variant="contained"
                      onClick={handleInstallClick} className="install-button">
                          Install App
                      </Button>}
                    </ListItem>
                  </MenuList>
                </Stack>
              </Stack>
    </Modal>
    </Stack>
  );
};

export default AppHeader;
