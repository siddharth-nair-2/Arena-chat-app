import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import MyChats from "../MyChats";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import EditIcon from "@mui/icons-material/Edit";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import BlurOffIcon from "@mui/icons-material/BlurOff";

const SideDrawer = ({ fetchAgain, particlesVisible, setParticlesVisible }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [picLoading, setPicLoading] = useState();
  const [particles, setParticles] = useState(true);
  const [showNameEditArrow, setShowNameEditArrow] = useState(false);

  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const [nameChangeInput, setNameChangeInput] = useState(user.name);
  const [chatListFilter, setChatListFilter] = useState("");
  const [pic, setPic] = useState(user.pic);
  const [profilePic, setProfilePic] = useState();
  const history = useHistory();
  const {
    isOpen: isOpenSearchDrawer,
    onOpen: onOpenSearchDrawer,
    onClose: onCloseSearchDrawer,
  } = useDisclosure();
  const {
    isOpen: isOpenProfileDrawer,
    onOpen: onOpenProfileDrawer,
    onClose: onCloseProfileDrawer,
  } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleNameChangeSubmit(nameChangeInput);
    }
  };
  const handleNameChangeSubmit = async (nameChangeInput) => {
    if (nameChangeInput.length > 15) {
      toast({
        title: "The character limit is 15!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/updateName",
        {
          userId: user._id,
          name: nameChangeInput,
        },
        config
      );
      let tempToken = user.token;
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          email: data.email,
          name: data.name,
          pic: data.pic,
          token: tempToken,
          _id: data._id,
        })
      );
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Choose a profile picture!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          setProfilePic(data.url.toString());
          handleProfilePicChange(data.url.toString());
          setLoading(false);
        })
        .then(() => {
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Choose a profile picture!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleProfilePicChange = async (newPic) => {
    try {
      setPicLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/updatePic",
        {
          userId: user._id,
          pic: newPic,
        },
        config
      );
      let tempToken = user.token;
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          email: data.email,
          name: data.name,
          pic: data.pic,
          token: tempToken,
          _id: data._id,
        })
      );
      setPic(data.pic);
      setPicLoading(false);
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPicLoading(false);
    }
  };
  const handleSearchEnterPress = async (event) => {
    if (event.key === "Enter") {
      if (!search) {
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }

      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/api/user?search=${search}`, config);

        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      };
      const response = await fetch("api/chat", requestOptions);
      const data = await response.json();

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onCloseSearchDrawer();
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
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", lg: "flex" }}
      height="100%"
      bg="transparent"
      w={{
        base: selectedChat ? "0%" : "100%",
        lg: "50%",
        xl: "31.9%",
      }}
    >
      <Box
        display={{ base: "none", lg: "block" }}
        bg="#1B3409"
        w="16.6%"
        p="5px 10px 5px 10px"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          h="100%"
        >
          <Box
            style={{
              display: 'base: "none", lg: "flex"',
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "10px",
            }}
          >
            <Avatar
              size="md"
              display={{ base: "none", lg: "block" }}
              cursor="pointer"
              name={user.name}
              src={pic}
              onClick={onOpenProfileDrawer}
              _hover={{
                transform: "scale(1.05)",
              }}
            />
            <Box
              fontSize={48}
              display={{ base: "none", lg: "block" }}
              style={{ cursor: "pointer" }}
              onClick={onOpenSearchDrawer}
              _hover={{
                transform: "scale(1.05)",
              }}
            >
              <PersonAddIcon
                style={{
                  display: 'base: "none", lg: "flex"',
                  backgroundColor: "#EBF7E3",
                  borderRadius: "50%",
                  padding: "2px",
                }}
                fontSize="inherit"
              />
            </Box>
            <Box
              fontSize={48}
              display={{ base: "none", lg: "block" }}
              style={{ cursor: "pointer", marginTop: "-15px" }}
              _hover={{
                transform: "scale(1.05)",
              }}
            >
              <LogoutIcon
                onClick={logoutHandler}
                style={{
                  backgroundColor: "#EBF7E3",
                  borderRadius: "50%",
                  padding: "2px",
                }}
                fontSize="inherit"
              />
            </Box>
          </Box>
          <Box
            fontSize={48}
            display={{ base: "none", lg: "block" }}
            style={{ cursor: "pointer", marginTop: "-15px" }}
            _hover={{
              transform: "scale(1.05)",
            }}
            onClick={(e) => {
              setParticlesVisible(particlesVisible === 0 ? 80 : 0);
              setParticles(!particles);
            }}
          >
            {particles ? (
              <BlurOffIcon
                style={{
                  backgroundColor: "#EBF7E3",
                  borderRadius: "50%",
                  padding: "2px",
                }}
                fontSize="inherit"
              />
            ) : (
              <BlurOnIcon
                style={{
                  backgroundColor: "#EBF7E3",
                  borderRadius: "50%",
                  padding: "2px",
                }}
                fontSize="inherit"
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box
        alignItems="center"
        bg="#66B032"
        w={{
          base: selectedChat ? "0%" : "100%",
          lg: "83.6%",
        }}
      >
        <Box
          my="10px"
          style={{
            display: "flex",
            width: "100%",
            height: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="./ChatScreenLogo.png"
            alt="logo"
            style={{
              maxWidth: "230px",
              maxHeight: "95px",
              width: "auto",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#B3D79A",
            marginLeft: "10px",
            marginRight: "10px",
            position: "relative",
            zIndex: "1",
          }}
        >
          <Button variant="ghost" cursor="default" _hover={{ bg: "#B3D79A" }}>
            <SearchOutlinedIcon color="#40721E" />
          </Button>
          <Input
            border="none"
            focusBorderColor="transparent"
            ml="-10px"
            onChange={(e) => setChatListFilter(e.target.value)}
          />
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} color="#40721E" />
            </MenuButton>
            <MenuList
              px="5px"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #65B032",
                justifyContent: "center",
                alignItems: "center",
                opacity: "1",
                backgroundColor: "#B3D79A",
              }}
            >
              {!notification.length && "No new messages!"}
              {notification?.map((noti, index) => (
                <MenuItem
                  key={noti._id}
                  bg="#B3D79A"
                  color="arenaColors.500"
                  pb="10px"
                  borderBottom={
                    notification.length > 1 && notification[index + 1]
                      ? "1px solid #40721E"
                      : "none"
                  }
                  _hover={{
                    bg: "#40721E",
                    borderRadius: "6px",
                    color: "arenaColors.100",
                  }}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
        <MyChats fetchAgain={fetchAgain} chatListFilter={chatListFilter} />
        <Box
          display={{ base: "flex", lg: "none" }}
          bg="arenaColors.500"
          alignItems="center"
          justifyContent="space-evenly"
          style={{
            width: "100%",
            position: "fixed",
            bottom: "0",
          }}
        >
          <Box
            fontSize={{ base: "46", md: "69" }}
            pt="7px"
            style={{ cursor: "pointer" }}
            hover={{
              transform: "scale(1.02)",
            }}
          >
            <LogoutIcon
              onClick={logoutHandler}
              style={{
                transform: "rotate(180deg)",
                backgroundColor: "#EBF7E3",
                borderRadius: "50%",
                padding: "2px",
              }}
              fontSize="inherit"
            />
          </Box>
          <Avatar
            size="lg"
            cursor="pointer"
            name={user.name}
            src={pic}
            onClick={onOpenProfileDrawer}
          />
          <Box
            fontSize={{ base: "46", md: "69" }}
            pt="7px"
            style={{ cursor: "pointer" }}
            onClick={onOpenSearchDrawer}
          >
            <PersonAddIcon
              style={{
                backgroundColor: "#EBF7E3",
                borderRadius: "50%",
                padding: "2px",
              }}
              fontSize="inherit"
            />
          </Box>
        </Box>
      </Box>
      <Drawer
        placement="left"
        onClose={onCloseProfileDrawer}
        isOpen={isOpenProfileDrawer}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="#1B3409" color="#EBF7E3">
          <DrawerHeader borderBottomWidth="1px" textAlign="center">
            EDIT PROFILE
          </DrawerHeader>
          <DrawerBody>
            <div className="profilepic">
              <img className="profilepic__image" src={pic} alt="profile-pic" />
              <div className="profilepic__content">
                <input
                  id="profile-pic-upload"
                  type="file"
                  p={1.5}
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="profilepic__icon"
                >
                  <EditIcon fontSize="inherit" />
                </label>
              </div>
            </div>
            <Box
              display="flex"
              pb={2}
              alignItems="center"
              justifyContent="center"
              width="70%"
              margin="auto"
              marginTop="60px"
              borderBottom="1px solid #EBF7E3"
            >
              <InputGroup
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="20px"
              >
                <Input
                  paddingBottom={3}
                  fontSize="18px"
                  defaultValue={user.name}
                  textAlign="center"
                  border="none"
                  onKeyDown={handleKeypress}
                  focusBorderColor="transparent"
                  onChange={(e) => setNameChangeInput(e.target.value)}
                  onFocus={(e) => {
                    setShowNameEditArrow(true);
                  }}
                />
              </InputGroup>
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
                {user.email}
              </Text>
            </Box>
            <Button
              display={showNameEditArrow ? "flex" : "none"}
              alignItems="center"
              justifyContent="center"
              width="60%"
              margin="auto"
              marginTop="100px"
              bg="arenaColors.100"
              color="arenaColors.500"
              borderRadius={0}
              onClick={(e) => handleNameChangeSubmit(nameChangeInput)}
              isDisabled={nameChangeInput === user.name}
            >
              Update Profile
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Drawer
        placement="left"
        onClose={onCloseSearchDrawer}
        isOpen={isOpenSearchDrawer}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="#1B3409" color="#EBF7E3">
          <DrawerHeader borderBottomWidth="1px" textAlign="center">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                focusBorderColor="#66B032"
                onKeyDown={handleSearchEnterPress}
              />
              <Button color="#1B3409" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
