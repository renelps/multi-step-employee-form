import React from 'react';
import { Box, Typography } from '@mui/material';
import { FaAngleLeft, FaGreaterThan, FaUser } from 'react-icons/fa';
import type { SxProps, Theme } from '@mui/system';
import { Link } from 'react-router-dom';

interface SidebarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
  sx?: SxProps<Theme>;
}

export const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen, sidebarOpen, sx }) => {
  return (
    <Box
      sx={{
        display: { xs: sidebarOpen ? "block" : "none", sm: "block" },
        position: { xs: "absolute", sm: "fixed" },
        left: { xs: sidebarOpen ? 0 : "-250px", sm: 0 },
        zIndex: 1000,
        width: '250px',
        height: '100vh',
        backgroundColor: '#fff',
        borderRight: '2px dashed #8A8A8A',
        transition: 'left 0.3s ease-in-out',
        ...sx,
        paddingLeft: "14px",
        paddingTop: "5px"
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>Flugo</Typography>

      <Box sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: "10px",
        marginTop: "10px"
      }}>
        <Box sx={{
          height: "30px",
          width: "30px",
          background: "#F9F9F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <FaUser size={20} color="#505050"/>
        </Box>
        <Typography sx={{ color: "#8A8A8A"}}>
          <Link 
            to="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Colaboradores
          </Link>
        </Typography>
        <Box sx={{
          paddingLeft: "20px"
        }}>
          { 
            sidebarOpen ? (
              <button onClick={() => setSidebarOpen(false)}>
                <FaAngleLeft size={12} color='#8A8A8A'/>
              </button>
            ): (
              <FaGreaterThan size={12} color='#8A8A8A'/>
            )
          }
        </Box>
      </Box>

    </Box>
  );
};
