export const storage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),

  getUser: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('user'),

  clearAll: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default storage;
