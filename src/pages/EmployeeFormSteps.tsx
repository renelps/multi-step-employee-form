import { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, createTheme, ThemeProvider, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../services/firebase';
import { z } from 'zod';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

const ColaboradorSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  email: z.string().email("Por favor, insira um e-mail válido."),
  department: z.string().min(1, "Selecione um departamento."),
  active: z.boolean(),
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  }
});

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'progress',
})<ProgressBarProps>(({ progress }) => ({
  height: '2px',
  backgroundColor: '#00FFFF',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${progress}%`,
    backgroundColor: theme.palette.success.main,
    transition: 'width 0.3s ease-in-out',
  },
}));

interface StepIndicatorProps {
  active?: boolean;
  completed?: boolean;
}

const StepIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed',
})<StepIndicatorProps>(({ active, completed }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
  position: 'relative',
  color: active || completed ? theme.palette.success.main : '#8A8A8A',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-20px',
    width: '1px',
    height: '100%',
    backgroundColor: active || completed ? theme.palette.success.main : '#D0D0D0',
  },
}));

export default function EmployeeFormSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    title: '',
    email: '',
    department: '',
    active: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleNext = () => {
    const result = ColaboradorSchema.pick({
      title: true,
      email: true,
      active: true,
    }).safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce((acc, current) => {
        if (current.path.length > 0) {
            acc[current.path[0] as string] = current.message;
        }
        return acc;
      }, {} as { [key: string]: string });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    const result = ColaboradorSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce((acc, current) => {
        if (current.path.length > 0) {
            acc[current.path[0] as string] = current.message;
        }
        return acc;
      }, {} as { [key: string]: string });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    
    try {
      await addDoc(collection(db, "collaborators"), result.data);
      alert("Colaborador cadastrado com sucesso!");
      setFormData({ title: '', email: '', department: '', active: true });
      navigate('/');

    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
      alert("Houve um erro ao cadastrar o colaborador.");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = () => {
    if (currentStep === 1) return 0;
    if (currentStep === 2) return 50;
    return 100;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100%', backgroundColor: '' }}>
        <Box sx={{ paddingX: '40px', backgroundColor: '#fff' }}>
          <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <Typography variant="body1" sx={{ color: '#8A8A8A' }}>Colaboradores</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>• Cadastrar Colaborador</Typography>
          </Box>
          <ProgressBar progress={getProgress()} />
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: '125px',
              right: '-3px',
              transform: 'translateX(-50%)',
              fontWeight: 'bold',
              color: theme.palette.success.main,
            }}
          >
            {getProgress()}%
        </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: { xs: 0, md: 1 },  padding: '40px' }}>
          <Box sx={{ flexBasis: '25%', flexShrink: 0, paddingRight: '40px', borderRight: '1px solid #E0E0E0' }}>
            <Box>
              <StepIndicator active={currentStep === 1} completed={currentStep > 1}>
                <Box sx={{ marginRight: '15px' }}>
                  {currentStep > 1 ? (
                    <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>1</Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Infos Básicas</Typography>
              </StepIndicator>
              <StepIndicator active={currentStep === 2}>
                <Box sx={{ marginRight: '15px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Infos Profissionais</Typography>
              </StepIndicator>
            </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1, paddingLeft: { xs: '0px', md: '40px' } }}> 
            {currentStep === 1 && (
              <>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '20px'}}>Informações Básicas</Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}>
                  <TextField
                    label="Título"
                    variant="outlined"
                    fullWidth
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="Digite o título aqui"
                    sx={{
                      marginBottom: '20px',
                      '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } },
                      '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
                    }}
                  />
                  <TextField
                    label="E-mail"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    placeholder="Digite o título aqui"
                    sx={{
                      marginBottom: '30px',
                      '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } },
                      '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                    <Typography variant="body1" sx={{ marginRight: '10px' }}>Ativar ao criar</Typography>
                    <Switch color="success" name="active" checked={formData.active} onChange={handleSwitchChange} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
                  <Button
                    variant="text"
                    disabled
                    sx={{ color: '#8A8A8A', marginTop: '20px' }}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      textTransform: 'none',
                      padding: '2px 30px',
                      '&:hover': { backgroundColor: '#45A245' },
                    }}
                  >
                    Próximo
                  </Button>
                </Box>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Informações Profissionais</Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}>
                  <FormControl fullWidth sx={{ marginBottom: '30px' }} error={!!errors.department}>
                    <InputLabel id="department-label">Selecione um departamento</InputLabel>
                    <Select
                      labelId="department-label"
                      id="department-select"
                      value={formData.department}
                      label="Selecione um departamento"
                      name="department"
                      onChange={handleSelectChange}
                      sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                      }}
                    >
                      <MenuItem value="Design">Design</MenuItem>
                      <MenuItem value="TI">TI</MenuItem>
                      <MenuItem value="Financeiro">Marketing</MenuItem>
                      <MenuItem value="Recursos Humanos">Produto</MenuItem>
                    </Select>
                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.department}</Typography>
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                  <Button
                    variant="text"
                    onClick={handleBack}
                    sx={{ color: '#8A8A8A', marginTop: '20px' }}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      textTransform: 'none',
                      padding: '2px 30px',
                      '&:hover': { backgroundColor: '#45A245' },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Concluir'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
