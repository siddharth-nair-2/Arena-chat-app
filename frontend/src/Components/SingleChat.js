import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderData } from "../config/ChatLogics";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";

import io from "socket.io-client";
const ENDPOINT = "https://temp-arena-chat.herokuapp.com/";
// const ENDPOINT = "http://localhost:5000/";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [file, setFile] = useState();
  const [uploadPic, setUploadPic] = useState();

  const toast = useToast();
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  let groupUsers = selectedChat?.users
    ?.filter((e) => e._id !== user._id)
    ?.map((e) => e.name);
  groupUsers?.push("You");

  let sidebarGroupUsers = selectedChat?.users?.filter(
    (e) => e._id !== user._id
  );

  const {
    isOpen: isOpenGroupDrawer,
    onOpen: onOpenGroupDrawer,
    onClose: onCloseGroupDrawer,
  } = useDisclosure();

  const {
    isOpen: isOpenSingleProfileDrawer,
    onOpen: onOpenSingleProfileDrawer,
    onClose: onCloseSingleProfileDrawer,
  } = useDisclosure();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("typing", () => setIsTyping(true));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Invalid picture",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/tiff" ||
      pics.type === "image/heic"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Arena-chat");
      data.append("cloud_name", "dvqdfodqz");
      fetch("https://api.cloudinary.com/v1_1/dvqdfodqz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUploadPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Invalid picture",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const sendMessageUsingClick = async (event) => {
    if (newMessage) {
      if (file) {
        console.log("file exists");
        socket.emit("stop typing", selectedChat._id);
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              content: newMessage,
              contentType: "file",
              fileContent: uploadPic,
              mimeType: file.type,
              fileName: file.name,
              chatId: selectedChat._id,
            }),
          };
          setNewMessage("");
          setFile();
          fetch("/api/message", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              socket.emit("new message", data);
              setMessages([...messages, data]);
              setFetchAgain(!fetchAgain);
            });
        } catch (error) {
          toast({
            title: "Error!",
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      } else {
        console.log("file doesn't exist");
        socket.emit("stop typing", selectedChat._id);
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              content: newMessage,
              chatId: selectedChat._id,
            }),
          };
          setNewMessage("");
          fetch("/api/message", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              socket.emit("new message", data);
              setMessages([...messages, data]);
              setFetchAgain(!fetchAgain);
            });
        } catch (error) {
          toast({
            title: "Error!",
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      }
    }
  };
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      if (file) {
        console.log("file exists");
        socket.emit("stop typing", selectedChat._id);
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              content: newMessage,
              contentType: "file",
              fileContent: uploadPic,
              mimeType: file.type,
              fileName: file.name,
              chatId: selectedChat._id,
            }),
          };
          setNewMessage("");
          setFile();
          fetch("/api/message", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              socket.emit("new message", data);
              setMessages([...messages, data]);
              setFetchAgain(!fetchAgain);
            });
        } catch (error) {
          toast({
            title: "Error!",
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      } else {
        console.log("file doesn't exist");
        socket.emit("stop typing", selectedChat._id);
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              content: newMessage,
              chatId: selectedChat._id,
            }),
          };
          setNewMessage("");
          fetch("/api/message", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              socket.emit("new message", data);
              setMessages([...messages, data]);
              setFetchAgain(!fetchAgain);
            });
        } catch (error) {
          toast({
            title: "Error!",
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 2000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const selectFile = (e) => {
    if (e) {
      setNewMessage(e.target.files[0].name);
      setFile(e.target.files[0]);
      postDetails(e.target.files[0]);
    }
  };

  return (
    <>
      {selectedChat ? (
        <Box display="flex" width="100%" flexDirection="column" height="100%">
          {!selectedChat.isGroupChat ? (
            <Box
              bg="#3C671D" //This one
              w="100%"
              display="flex"
              padding="10px"
              alignItems="center"
              color="#EBF7E3"
              position={{ base: "fixed", md: "static" }}
              top={{ base: "0", md: "none" }}
              left={{ base: "0", md: "none" }}
              borderBottom="1px solid #1B3409"
            >
              <Box display={{ base: "flex", lg: "none" }}>
                <ArrowBackIosIcon
                  fontSize="medium"
                  color="inherit"
                  onClick={() => setSelectedChat("")}
                  display
                />
              </Box>
              <Box
                display="flex"
                w="100%"
                alignItems="center"
                marginLeft={{ base: "3px", lg: "23px" }}
              >
                <img
                  src={
                    selectedChat.users.filter((e) => e._id !== user._id)[0].pic
                  }
                  alt="profile-pic"
                  style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={onOpenSingleProfileDrawer}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  onClick={onOpenSingleProfileDrawer}
                  cursor="pointer"
                  ml={{ base: "3", lg: "10" }}
                >
                  <Text
                    fontSize={{ base: "22px", md: "24px" }}
                    pt={2}
                    width="100%"
                    fontWeight={600}
                    height="100%"
                    fontFamily="'Poppins', sans-serif"
                    display="flex"
                    alignItems="center"
                    color="arenaColors.100"
                    justifyContent="space-between"
                  >
                    {getSender(user, selectedChat.users)}
                  </Text>
                  {isTyping ? (
                    <Box
                      style={{
                        fontStyle: "italic",
                        fontWeight: "normal",
                        fontSize: "12px",
                      }}
                      // pl={{ base: "3", lg: "10" }}
                    >
                      typing...
                    </Box>
                  ) : (
                    <Box
                      style={{
                        fontStyle: "italic",
                        fontWeight: "normal",
                        fontSize: "12px",
                      }}
                      // pl={{ base: "3", lg: "10" }}
                    >
                      tap here for contact info
                    </Box>
                  )}
                </Box>
              </Box>
              <Box marginRight={{ base: "5px", lg: "30px" }}>
                <Image
                  src="./phoneIcon.png"
                  alt="profile-pic"
                  height={{ base: "35px", lg: "40px" }}
                />
              </Box>
              <Drawer
                placement="right"
                onClose={onCloseSingleProfileDrawer}
                isOpen={isOpenSingleProfileDrawer}
              >
                <DrawerOverlay />
                <DrawerContent backgroundColor="#1B3409" color="#EBF7E3">
                  <DrawerHeader borderBottomWidth="1px" textAlign="center">
                    PROFILE
                  </DrawerHeader>
                  <DrawerBody>
                    <Box
                      display="flex"
                      pb={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img
                        src={
                          selectedChat.users.filter(
                            (e) => e._id !== user._id
                          )[0].pic
                        }
                        alt="profile-pic"
                        style={{
                          height: "200px",
                          width: "200px",
                          marginTop: "60px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    <Box
                      display="flex"
                      pb={2}
                      alignItems="center"
                      justifyContent="center"
                      width="60%"
                      margin="auto"
                      marginTop="60px"
                      borderBottom="1px solid #EBF7E3"
                    >
                      <Text paddingBottom={3} fontSize="18px">
                        {getSender(user, selectedChat.users)}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      pb={2}
                      alignItems="center"
                      justifyContent="center"
                      width="60%"
                      margin="auto"
                      marginTop="20px"
                      borderBottom="1px solid #EBF7E3"
                    >
                      <Text paddingBottom={3} fontSize="18px">
                        {getSenderData(user, selectedChat.users).email}
                      </Text>
                    </Box>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Box>
          ) : (
            <>
              <Box
                bg="#3C671D"
                w="100%"
                display="flex"
                padding="10px"
                alignItems="center"
                color="#EBF7E3"
                borderBottom="1px solid #1B3409"
              >
                <Box display={{ base: "flex", lg: "none" }}>
                  <ArrowBackIosIcon
                    fontSize="medium"
                    color="inherit"
                    onClick={() => setSelectedChat("")}
                    display
                  />
                </Box>
                <Box
                  display="flex"
                  w="100%"
                  alignItems="center"
                  marginLeft={{ base: "3px", lg: "23px" }}
                >
                  <img
                    src="./groupIcon.jpg"
                    alt="profile-pic"
                    style={{
                      height: "60px",
                      width: "60px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={onOpenGroupDrawer}
                  />
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    >
                      <Text
                        fontSize={{ base: "24px", md: "24px" }}
                        ml={{ base: "3", lg: "8" }}
                        width="100%"
                        fontWeight={600}
                        height="100%"
                        fontFamily="'Poppins', sans-serif"
                        display="flex"
                        flexDirection="column"
                        color="arenaColors.100"
                        isCentered
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          cursor="pointer"
                          _hover={{ borderBottom: "1px solid #EBF7E3" }}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box
                            display={{ md: "none" }}
                            maxW={{ base: "150px", md: "none" }}
                          >
                            {selectedChat.chatName.length > 8
                              ? selectedChat.chatName.substring(0, 8) + "..."
                              : selectedChat.chatName}
                            {/* CHANGE THISSS */}
                          </Box>
                          <Box
                            display={{ base: "none", md: "block", lg: "none" }}
                          >
                            {selectedChat.chatName.length > 30
                              ? selectedChat.chatName.substring(0, 30) + "..."
                              : selectedChat.chatName}
                            {/* CHANGE THISSS */}
                          </Box>
                          <Box display={{ base: "none", lg: "block" }}>
                            {selectedChat.chatName.length > 60
                              ? selectedChat.chatName.substring(0, 60) + "..."
                              : selectedChat.chatName}
                            {/* CHANGE THISSS */}
                          </Box>
                          <EditIcon
                            fontSize="medium"
                            style={{ cursor: "pointer" }}
                          />
                        </Box>
                        {isTyping ? (
                          <div
                            style={{
                              fontStyle: "italic",
                              fontWeight: "normal",
                              fontSize: "12px",
                            }}
                          >
                            Someone is typing...
                          </div>
                        ) : (
                          <></>
                        )}
                      </Text>
                    </UpdateGroupChatModal>
                  </Box>
                </Box>
                <Box marginRight={{ base: "5px", lg: "30px" }}>
                  <Image
                    src="./phoneIcon.png"
                    alt="profile-pic"
                    height={{ base: "35px", lg: "40px" }}
                  />
                </Box>
              </Box>
              <Drawer
                placement="right"
                onClose={onCloseGroupDrawer}
                isOpen={isOpenGroupDrawer}
              >
                <DrawerOverlay />
                <DrawerContent backgroundColor="#1B3409" color="#EBF7E3">
                  <DrawerHeader
                    borderBottomWidth="1px"
                    textAlign="center"
                    fontWeight="bold"
                  >
                    {selectedChat.chatName}
                  </DrawerHeader>
                  <DrawerBody>
                    <Box
                      display="flex"
                      pb={2}
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img
                        src="./groupIcon.jpg"
                        alt="profile-pic"
                        style={{
                          height: "150px",
                          width: "150px",
                          marginTop: "20px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        pb={1}
                        alignItems="center"
                        justifyContent="center"
                        width="95%"
                        margin="auto"
                        marginTop="80px"
                        borderBottom="1px solid #EBF7E3"
                      >
                        <Text
                          paddingBottom={1}
                          fontSize="18px"
                          fontWeight="bold"
                        >
                          {sidebarGroupUsers?.length + 1} Members
                        </Text>
                      </Box>
                    </Box>
                    <Box height="575px" overflowY="scroll">
                      {sidebarGroupUsers?.map((e) => (
                        <Box
                          display="flex"
                          flexDirection="column"
                          pb={1}
                          alignItems="center"
                          justifyContent="center"
                          width="95%"
                          margin="auto"
                          marginTop="25px"
                          key={e._id}
                        >
                          <Image
                            src={e.pic}
                            alt="profile-pic-sidebar"
                            style={{
                              height: "40px",
                              width: "40px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              cursor: "pointer",
                            }}
                          />
                          <Text paddingBottom={1} fontSize="18px">
                            {e.name}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          )}
          <Box
            display="flex"
            justifyContent="flex-end"
            p={3}
            w="100%"
            height="100%"
            margin="auto"
            overflowY="hidden"
            flexDir="column"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="arenaColors.500"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              isRequired
              mt={3}
              position={{ base: "fixed", md: "static" }}
              bottom={{ base: "0", md: "none" }}
              left={{ base: "0", md: "none" }}
              onKeyDown={sendMessage}
            >
              <InputGroup>
                <Input
                  variant="filled"
                  bg="#BEE5A4"
                  placeholder="Type a message"
                  borderRadius="15px"
                  _focus={{
                    bg: "#BEE5A4",
                  }}
                  onChange={typingHandler}
                  onBlur={(e) => {
                    socket.emit("stop typing", selectedChat._id);
                    setTyping(false);
                  }}
                  value={newMessage}
                />
                {!file ? (
                  <InputLeftElement
                    className="upload-image-input"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    pt="6px"
                  >
                    <input
                      id="chat-upload-pic"
                      onChange={selectFile}
                      type="file"
                      accept="image/*"
                    />
                    <label
                      htmlFor="chat-upload-pic"
                      style={{ color: "#1B3409" }}
                    >
                      <ImageIcon
                        size="large"
                        color="INHERIT"
                        cursor="pointer"
                      ></ImageIcon>
                    </label>
                  </InputLeftElement>
                ) : (
                  <InputLeftElement
                    className="upload-image-input"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={(e) => {
                      setNewMessage("");
                      setFile();
                    }}
                  >
                    <CloseIcon
                      size="large"
                      color="INHERIT"
                      cursor="pointer"
                    ></CloseIcon>
                  </InputLeftElement>
                )}
                <InputRightElement
                  cursor="pointer"
                  onClick={sendMessageUsingClick}
                >
                  <div
                    style={{
                      color: "#1B3409",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SendIcon size="medium" color="INHERIT"></SendIcon>
                  </div>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          h="100%"
          color="arenaColors.500"
        >
          <img
            src="./noSelection.png"
            alt="background"
            style={{
              marginTop: "-250px",
            }}
          />
          <span
            style={{
              fontSize: "36px",
              marginTop: "-50px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Select user to chat with
          </span>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
