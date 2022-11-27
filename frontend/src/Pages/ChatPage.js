import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ChatBox from "../Components/ChatBox";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ChatPage = () => {
  const { user } = ChatState();
  const [particlesVisible, setParticlesVisible] = useState(80);
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <>
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
              enable: false,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 400,
              },
              value: particlesVisible,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          detectRetina: true,
        }}
      />
      <div style={{ width: "100%", display: "flex", height: "100vh" }}>
        {user && (
          <SideDrawer
            fetchAgain={fetchAgain}
            particlesVisible={particlesVisible}
            setParticlesVisible={setParticlesVisible}
          />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </>
  );
};

export default ChatPage;
