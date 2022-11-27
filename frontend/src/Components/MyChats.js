import { Box, Button, Image, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import Groups2Icon from "@mui/icons-material/Groups2";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderData } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import Moment from "react-moment";

const MyChats = ({ fetchAgain, chatListFilter }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      pt={3}
      bg="white"
      w={{ base: "100%" }}
      h="75%"
      zIndex="0"
      backgroundColor="#66B032"
      borderRadius="1g"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "24px" }}
        fontFamily="'Poppins', sans-serif"
        display="flex"
        fontWeight="600"
        color="#EBF7E3"
        w="100%"
        borderBottom="3px solid #EBF7E3"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "13px" }}
            color="#1B3409"
            opacity="0.5"
          >
            <Groups2Icon fontSize="large" />
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        pt={2}
        mr={-5}
        ml={-5}
        bg="transparent"
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" padding={0}>
            {chats
              ?.filter((singleChat) => {
                console.log(singleChat);
                console.log(chatListFilter);
                return (
                  (singleChat.isGroupChat &&
                    singleChat.chatName
                      .toLowerCase()
                      .includes(chatListFilter.toLowerCase())) ||
                  (!singleChat.isGroupChat &&
                    getSender(user, singleChat.users)
                      .toLowerCase()
                      .includes(chatListFilter.toLowerCase()))
                );
              })
              .map((chat) => (
                <div key={chat._id}>
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat && "#1B3409"}
                    fontWeight={selectedChat === chat && "500"}
                    px={selectedChat === chat ? "8" : "6"}
                    py={2}
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    color="#EBF7E3"
                    key={chat._id}
                    _hover={{ bg: "#1B3409" }}
                  >
                    {chat.isGroupChat ? (
                      <Image
                        src="./groupIcon.jpg"
                        alt="group-pic"
                        style={{
                          height: "60px",
                          width: "60px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <Image
                        src={getSenderData(user, chat.users).pic}
                        alt="group-pic"
                        style={{
                          height: "60px",
                          width: "60px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    )}
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="100%"
                      height="100%"
                      pb={5}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Text>
                          <b>
                            {!chat.isGroupChat
                              ? getSender(loggedUser, chat.users)
                              : chat.chatName}
                          </b>
                        </Text>
                        <Text>
                          <Moment
                            format="HH:mm"
                            trim
                            style={{
                              fontSize: "10px",
                              marginLeft: "auto",
                              color: "#E0E2DF",
                              fontStyle: "italic",
                            }}
                          >
                            {chat.latestMessage?.createdAt}
                          </Moment>
                        </Text>
                      </Box>
                      {chat.latestMessage && (
                        <Text fontSize="xs">
                          {chat.latestMessage.sender.name}
                          {": "}
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                  </Box>
                  <hr style={{ width: "100%", marginLeft: "auto" }} />
                </div>
              ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
