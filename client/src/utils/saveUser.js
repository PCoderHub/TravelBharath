export const saveUserAndTokens = ({ user, access, refresh }) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};
