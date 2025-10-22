import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create Context
const UserContext = createContext();

// 2️⃣ Create Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // full user object (id, name, role)
  const [role, setRole] = useState(null);

  // Optionally restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  // Helper to update user globally
  const setUserData = (userData) => {
    setUser(userData);
    setRole(userData?.role);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Helper to clear user on logout
  const clearUser = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, role, setUserData, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3️⃣ Custom hook for easy access
export const useUser = () => useContext(UserContext);
