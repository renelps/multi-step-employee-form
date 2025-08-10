import React, { useEffect, useState } from "react"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Home from "./pages/CollaboratorList"; 
import EmployeeFormSteps from "./pages/EmployeeFormSteps"; 
import {Sidebar} from "./components/Sidebar";
import { Header } from "./components/Header"; 
import { Box, IconButton, useMediaQuery } from "@mui/material"; 
import MenuIcon from '@mui/icons-material/Menu';

import type { Theme } from "@mui/material";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  useEffect(() => {
    if (isMdUp) {
      setSidebarOpen(false);
    }
  }, [isMdUp]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Sidebar
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen} 
          sx={{
            display: { xs: sidebarOpen ? "block" : "none", md: "block" },
            position: { xs: "absolute", md: "fixed" },
            left: { xs: sidebarOpen ? 0 : "-300px", md: 0 },
            zIndex: 1000,
            width: '300px',
            height: '100vh',
            backgroundColor: '#fff',
            transition: 'left 0.3s ease-in-out',
          }} 
        />
        
        <Box
          sx={{
            width: "100%",
            boxSizing: "border-box",
            position: "relative",
            paddingLeft: { xs: 0, md: '300px' },
          }}
        >
          <Header />
          
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ display: { xs: "block", md: "none" }, position: "absolute", top: 10, left: 10 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ paddingTop: "60px" }}> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/step-info" element={<EmployeeFormSteps />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}
