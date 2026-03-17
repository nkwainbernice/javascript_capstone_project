const generateUserId = () => `user_${new Date().getTime()}`;

const getUserId = () => {
  let userId = localStorage.getItem('movieAppUserId');

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('movieAppUserId', userId);
  }

  return userId;
};


export { getUserId };