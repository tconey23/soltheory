import { useState } from "react";
import { AppBar, Box, Toolbar, Container, Button, Menu, MenuItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import solTheoryLogo from "../assets/soltheorylogo.png";
import { useNavigate } from "react-router-dom";
import {useMediaQuery} from "@mui/material";
import { useGlobalContext } from "../business/GlobalContext";

const AppHeader = () => {
  const {alertProps, setAlertProps} = useGlobalContext()
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElGames, setAnchorElGames] = useState(null);
  const nav = useNavigate()

  const isMobile = useMediaQuery("(max-width:430px)");

  const pages = ["SOL Games", "Thrive", "ESC", "Personos", "About"];
  const solGamesDropdown = ["21 Things", "Pic6"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Open and close handlers for "SOL Games" dropdown
  const handleOpenGamesMenu = (event) => {
    // setAnchorElGames(event.currentTarget);
    nav('/games')
  };

  const handleCloseGamesMenu = () => {
    setAnchorElGames(null);
  };

  return (
    <AppBar position="static" sx={{justifyContent: 'center', height: '80px'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/home">
            <img height={"75px"} src={solTheoryLogo} alt="Sol Theory Logo" />
          </Link>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page, i) =>
              page === "SOL Games" ? (
                <Box key={`${page}${i}`} sx={{ position: "relative" }}>
                  {
                    isMobile
                    ? <Link key={`${page}${i}`} style={{marginLeft: 10}} to={'/games'}>{page}</Link>
                    : <Button
                    key={`${page}${i}`}
                    onClick={handleOpenGamesMenu}
                    sx={{ my: 2, color: "white", display: "block", margin: 1}}
                    variant="contained"
                  >
                    {page}
                  </Button>}
                </Box>
              ) : (
                <>
                {isMobile 
                ? <Link key={i} style={{marginLeft: 10}}>
                    {page}
                  </Link>
                :<Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block", margin: 1}}
                    variant="contained"
                    >
                    {page}
                  </Button>
                }
                </>
              )
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu} sx={{ maxWidth: 122 }}>
                  <Typography sx={{ textAlign: "center", maxWidth: 122, fontSize: 1 }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
