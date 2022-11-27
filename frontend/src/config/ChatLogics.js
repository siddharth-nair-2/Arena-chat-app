export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSenderData = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isNotLoggedInUser = (messages, m, i, userId) => {
  return i < messages.length && messages[i].sender._id !== userId;
};

export const otherUsersFirstMsg = (messages, m, i, userId) => {
  return (
    i <= messages.length - 1 &&
    messages[i - 1]?.sender._id !== messages[i]?.sender._id
  );
};

export const groupChatMarginCalc = (messages, m, i, userId) => {
  if (
    !otherUsersFirstMsg(messages, m, i, userId) &&
    isNotLoggedInUser(messages, m, i, userId) &&
    messages[i].chat.isGroupChat
  )
    return 38;
  else if (!isNotLoggedInUser(messages, m, i, userId)) return "auto";
  else return 0;
};
export const isLastMsgToday = (messages, m, i) => {
  let time = new Date(messages[i].createdAt);
  var ts = time.getTime();
  var today = new Date().setHours(0, 0, 0, 0);
  var thatDay = new Date(ts).setHours(0, 0, 0, 0);

  if (today === thatDay) {
    return true;
  }
  return false;
};
export const isPrevMsgToday = (messages, m, i) => {
  if (!messages[i - 1]) return false;
  let time = new Date(messages[i - 1].createdAt);
  var ts = time.getTime();
  var today = new Date().setHours(0, 0, 0, 0);
  var thatDay = new Date(ts).setHours(0, 0, 0, 0);

  if (today === thatDay) {
    return true;
  }
  return false;
};

export const isLastMsgTodayFlexDir = (messages, m, i) => {
  let time = new Date(messages[i].createdAt);
  var ts = time.getTime();
  var today = new Date().setHours(0, 0, 0, 0);
  var thatDay = new Date(ts).setHours(0, 0, 0, 0);

  if (today === thatDay) {
    return "column";
  }
  return "row";
};
export const isPrevMsgSameDayAsCurr = (messages, m, i) => {
  if (!messages[i - 1]) return false;

  let timePrevMessage = new Date(messages[i - 1].createdAt);
  let timeCurrMessage = new Date(messages[i].createdAt);

  var tsPrev = timePrevMessage.getTime();
  var tsCurr = timeCurrMessage.getTime();
  var prevDay = new Date(tsPrev).setHours(0, 0, 0, 0);
  var currDay = new Date(tsCurr).setHours(0, 0, 0, 0);

  if (prevDay === currDay) {
    return true;
  }
  return false;
};
