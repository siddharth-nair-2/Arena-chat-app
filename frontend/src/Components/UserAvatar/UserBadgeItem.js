import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      my={2}
      mr={1}
      variant="solid"
      fontSize={{ base: 12, md: 16, lg: 12 }}
      bg="arenaColors.300"
      cursor="pointer"
      fontWeight="bold"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      onClick={handleFunction}
      color="arenaColors.100"
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
