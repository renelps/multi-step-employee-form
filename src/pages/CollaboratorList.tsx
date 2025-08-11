import { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { FaArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import AvatarImage from "../assets/avatar.png";
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    success: {
      main: '#4CAF50',
    },
  },
});

interface StatusBadgeProps {
  status: boolean;
}

const StatusBadge = styled('span')<StatusBadgeProps>(({ status }) => ({
  backgroundColor: status ? '#E8F5E9' : '#FFEBEE',
  color: status ? '#4CAF50' : '#F44336',
  padding: '4px 12px',
  borderRadius: '7px',
  fontWeight: 'bold',
  fontSize: '12px',
}));

interface Collaborator {
  id: string;
  title: string;
  email: string;
  department: string;
  active: boolean;
  avatar?: string;
}

export default function Colaboradores() {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const collaboratorsCollectionRef = collection(db, 'collaborators');
      const data = await getDocs(collaboratorsCollectionRef);

      const fetchedCollaborators = data.docs.map((doc) => {
        const collaboratorData = doc.data();
        return {
          ...collaboratorData,
          id: doc.id,
        } as Collaborator;
      });

      setCollaborators(fetchedCollaborators);
    };

    fetchCollaborators();
  }, []);

  const handleNewCollaboratorClick = () => {
    navigate('/step-info');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ paddingX: { xs: '10px', md: '60px' }, paddingTop: "40px", minHeight: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>Colaboradores</Typography>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: '#4CAF50',
              color: '#fff',
              padding: '10px 20px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#45A245' },
            }}
            onClick={handleNewCollaboratorClick}
          >
            Novo Colaborador
          </Button>
        </Box>

        <Paper sx={{
          borderRadius: "15px",

          overflow: 'hidden'
        }}>
          <TableContainer sx={{ border: 'none'}}>
            <Table>
              <TableHead sx={{ background: "#f4f4f4" }}>
                <TableRow>
                  <TableCell sx={{paddingY: "25px"}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#606060' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Nome</Typography>
                      <FaArrowDown size={14} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#606060' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                      <FaArrowDown size={14} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#606060' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Departamento</Typography>
                      <FaArrowDown size={14} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end", gap: '8px', color: '#606060' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Status</Typography>
                      <FaArrowDown size={14} />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collaborators.map((collaborator) => (
                  <TableRow key={collaborator.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar>
                          <Box
                            component="img"
                            sx={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: 2,
                              boxShadow: 3,
                            }}
                            src={AvatarImage}
                            alt="Minha Imagem"
                          />
                        </Avatar>
                        {collaborator.title}
                      </Box>
                    </TableCell>
                    <TableCell>{collaborator.email}</TableCell>
                    <TableCell>{collaborator.department}</TableCell>
                    <TableCell >
                      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: 'center'}}>
                        <StatusBadge status={collaborator.active}>
                          <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                            {collaborator.active ? 'Ativo' : 'Inativo'}
                          </Typography>
                        </StatusBadge>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
