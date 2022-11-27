import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8F7E3"
      _hover={{
        background: "arenaColors.200",
        color: "arenaColors.500",
        fontWeight: "bold",
        transform: "scale(1.05)",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="#1B3409"
      px={3}
      py={2}
      mb={2}
      borderRadius="2px"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
