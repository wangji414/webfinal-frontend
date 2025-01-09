import Store from "./components/Store";
import Product from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Purchase from "./components/Purchase";
import React from "react";
import Crud from "./components/Crud";

import { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Box } from "@chakra-ui/react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showing, setShowing] = useState(false);
  const [cartBtnShow, setCartBtnShow] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    const storedCartData = localStorage.getItem("storedCartData");
    return storedCartData ? JSON.parse(storedCartData) : [];
  });
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      localStorage.removeItem("storedCartData");
    } else {
      localStorage.setItem("storedCartData", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((preItems) => [...preItems, item]);
  };

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        showing,
        setShowing,
        cartBtnShow,
        setCartBtnShow,
        cartItems,
        setCartItems,
        addToCart,
        purchaseItems,
        setPurchaseItems,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/crud" element={<Crud />} /> {/* 新增的路由 */}
          <Route path="*" element={<Box>404 Not Found</Box>} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
export { useAppContext };
