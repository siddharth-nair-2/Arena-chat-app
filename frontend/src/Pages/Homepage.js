import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Login from "../Components/authentication/Login";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Register from "../Components/authentication/Register";
import { TypeAnimation } from "react-type-animation";

const Homepage = () => {
  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      history.push("/"); // CHANGE THIS LATERRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    }
  }, [history]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="90vh"
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0,
              },
            },
          },
          particles: {
            color: {
              value: "#9bd770",
            },
            links: {
              color: "#9bd770",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <Container maxW="xl" centerContent style={{ marginBottom: "100px" }}>
        <Box
          display={{ base: "none", md: "flex" }}
          justifyContent="center"
          p={3}
          w="50%"
          marginTop="100px"
          maxWidth="185px"
        >
          <img src="./favicon.ico" alt="logo" />
        </Box>

        <Box bg="#9BD770" w="100%" p={4}>
          <Tabs isFitted defaultIndex={1} colorScheme="#375F1B">
            <TabList>
              <Tab>Register</Tab>
              <Tab>Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Register />
              </TabPanel>
              <TabPanel>
                <Login />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
      <TypeAnimation
        sequence={[
          "Hi, this is Arena", // Types 'Three' without deleting 'Two'
          2000,
          "Are you an exception?",
          1500,
          "Let me catch you!",
          2000,
        ]}
        wrapper="div"
        cursor={true}
        repeat={Infinity}
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "30px",
          fontWeight: "bold",
          color: "#1B3409",
          marginTop: "-50px",
        }}
      />
    </Box>
  );
};

export default Homepage;
