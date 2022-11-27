import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  groupChatMarginCalc,
  isLastMsgToday,
  isNotLoggedInUser,
  isPrevMsgSameDayAsCurr,
  isPrevMsgToday,
  isSameUser,
  otherUsersFirstMsg,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import Moment from "react-moment";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
            {messages[0].chat.isGroupChat &&
              isNotLoggedInUser(messages, m, i, user._id) &&
              otherUsersFirstMsg(messages, m, i, user._id) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    style={{
                      marginTop:
                        (isLastMsgToday(messages, m, i) &&
                          !isPrevMsgToday(messages, m, i)) ||
                        (!isPrevMsgSameDayAsCurr(messages, m, i) &&
                          !isLastMsgToday(messages, m, i))
                          ? "100px"
                          : "7px",
                    }}
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              className="message-box-span"
              style={{
                display: "flex",
                flexDirection:
                  (isLastMsgToday(messages, m, i) &&
                    !isPrevMsgToday(messages, m, i)) ||
                  (!isPrevMsgSameDayAsCurr(messages, m, i) &&
                    !isLastMsgToday(messages, m, i))
                    ? "column"
                    : "row",
                width: "100%",
                textAlign: "center",
              }}
            >
              {isLastMsgToday(messages, m, i) &&
                !isPrevMsgToday(messages, m, i) && (
                  <span
                    style={{
                      color: "#1B3409",
                      backgroundColor: "#E3E8F0",
                      width: "80px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "50px",
                      marginBottom: "10px",
                      padding: "2px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    TODAY
                  </span>
                )}
              {!isPrevMsgSameDayAsCurr(messages, m, i) &&
                !isLastMsgToday(messages, m, i) && (
                  <span
                    style={{
                      color: "#1B3409",
                      backgroundColor: "#E3E8F0",
                      width: "180px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "50px",
                      marginBottom: "10px",
                      padding: "2px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Moment format="LL" trim>
                      {m.createdAt}
                    </Moment>
                  </span>
                )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#66B032" : "#375F1B"
                  }`,
                  marginLeft: groupChatMarginCalc(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  wordWrap: "normal",
                  display: "flex",
                  marginRight:
                    (isLastMsgToday(messages, m, i) &&
                      !isPrevMsgToday(messages, m, i) &&
                      isNotLoggedInUser(messages, m, i, user._id)) ||
                    (!isPrevMsgSameDayAsCurr(messages, m, i) &&
                      !isLastMsgToday(messages, m, i) &&
                      isNotLoggedInUser(messages, m, i, user._id))
                      ? "auto"
                      : "none",
                  maxWidth: "50%",
                  color: "#EBF7E3",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                {((messages[0].chat.isGroupChat === true &&
                  isNotLoggedInUser(messages, m, i, user._id) &&
                  otherUsersFirstMsg(messages, m, i, user._id)) ||
                  (isLastMsgToday(messages, m, i) &&
                    !isPrevMsgToday(messages, m, i)) ||
                  (!isPrevMsgSameDayAsCurr(messages, m, i) &&
                    !isLastMsgToday(messages, m, i))) &&
                  isNotLoggedInUser(messages, m, i, user._id) &&
                  messages[0].chat.isGroupChat === true && (
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "left",
                      }}
                    >
                      {m.sender.name}
                    </span>
                  )}
                {m.content}
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
                  {m.createdAt}
                </Moment>
              </span>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
