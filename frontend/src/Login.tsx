import React from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Wrapper } from "./Home";
import { useContext } from "react";
import { UserContext } from "./contexts/user";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";

export const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const clickLogin = () => {
    setUser({ ...user, id: "1" });
    navigate("home");
  };

  return (
    <Wrapper>
      <Header />
      <Container>
        <FormControl
          sx={{ m: 1, width: "25ch" }}
          variant="outlined"
          error={error}
        >
          <InputLabel htmlFor="outlined-adornment-password" error={error}>
            Username
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-username"
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            label="username"
          />
        </FormControl>
        <FormControl
          sx={{ m: 1, width: "25ch" }}
          variant="outlined"
          error={error}
        >
          <InputLabel htmlFor="outlined-adornment-password" error={error}>
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            error={error}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ marginTop: 2, height: 50 }}
            onClick={() => {}}
          >
            Login
          </Button>
        </FormControl>
      </Container>
      <Footer />
    </Wrapper>
  );
};

const Container = styled.div`
  width: 400px;
  height: 300px;
  margin: 150px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
