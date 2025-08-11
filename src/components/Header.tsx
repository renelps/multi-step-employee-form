import { Box } from "@mui/material";
import AvatarImage from "../assets/avatar.png";

export const Header = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "40px",
        display: "flex",
        justifyContent: "flex-end",
        paddingX: "20px",
        color: "#fff",
        zIndex: 1000,
      }}
    >
      <Box sx={{
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "flex-end",
        background: "green",
        marginRight: "40px",
        marginTop: "15px"
      }}>
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
      </Box>
    </Box>
  );
};
