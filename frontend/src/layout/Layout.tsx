import {ReactElement, useCallback, useState} from "react";
import TopNav from "./TopNav";
import {styled} from "@mui/material";
import SideNav from "./SideNav";


const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
});

const Layout = ({children}: ReactElement | any) => {
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(
    () => {
      if (openNav) {
        setOpenNav(false);
      }
    },
    [openNav]
  );
  return (
    <>
        <TopNav onNavOpen={() => setOpenNav(true)} />
        <SideNav
          onClose={() => setOpenNav(false)}
          open={openNav}
        />
        <LayoutRoot>
          <LayoutContainer>
            {children}
          </LayoutContainer>
        </LayoutRoot>

    </>
  )
}

export default Layout;