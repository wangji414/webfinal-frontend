import { Box, Button, Circle, Heading, Hide, IconButton, Menu, MenuButton, MenuItem, MenuList, Show, Center, SimpleGrid, Spacer, Spinner } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAppContext } from "../App";
import Cart from './Cart';
import Slide from './Slide';

function NavBar() {
    const { token, setToken, setShowing, cartItems, cartBtnShow } = useAppContext();
    const [loading, setLoading] = useState(false); // 定义 loading 状态

    const handleLogout = () => {
        setToken("");
        alert("Logout successfully");
        localStorage.removeItem("userToken");
    };

    const handleOpenCart = () => {
        setShowing(true);
    };

    const handleCrudRedirect = () => {
        setLoading(true); // 开始加载
        setTimeout(() => { // 模拟异步操作
            window.location.href = 'http://127.0.0.1:5500/public/crud.html';
            setLoading(false); // 停止加载
        }, 1000);
    };

    return (
        <Box p={2} display="flex" justifyContent="space-between" backgroundColor="black" position="sticky" top={0} zIndex={90}>
            <Link to={'/'}>
                <Heading ml={1} color="white">Store App</Heading>
            </Link>
             {/* 新增管理按鈕 */}
                            {token && (
                    <Button 
                        ml={-2150} 
                        colorScheme="blue" 
                        onClick={handleCrudRedirect}
                        isLoading={loading} 
                    >
                        管理
                    </Button>
                )}

             {/*store app按鈕*/}
            <Show below="768px">              
                <Menu>                    
                    <MenuButton
                        mt={1}
                        as={IconButton}
                        icon={<HamburgerIcon />}
                        variant='outline'
                        backgroundColor="white"
                    />


                    <MenuList>
                        {token ?
                            <Box>
                                {cartBtnShow ?
                                    <MenuItem>
                                        <Box mt={1} mr={2} onClick={handleOpenCart} position="relative">
                                            Cart<Box as="i" className="fa fa-cart-shopping" ml={1} mr={1}></Box>
                                            {cartItems.length === 0 ? "" :
                                                <Circle w={5} h={5} backgroundColor="red" color="white" display="inline-block" textAlign="center">
                                                    {cartItems.length}
                                                </Circle>}
                                        </Box>
                                    </MenuItem>

                                    : ""}
                                <MenuItem>
                                    <Link to={'/'}>
                                        <Box mt={1} mr={4} onClick={handleLogout}>Log Out<Box as="i" className="fa fa-right-from-bracket" ml={1}></Box></Box>
                                    </Link>
                                </MenuItem>
                            </Box>
                            :
                            <MenuItem>
                                <Link to={'/login'}>
                                    <Box mt={1} mr={4}>Log In<Box as="i" className="fa fa-right-to-bracket" ml={1}></Box></Box>
                                </Link>
                            </MenuItem>
                        }
                    </MenuList>
                </Menu>
            </Show>
            


            <Hide below="768px">
                {token ?
                    <Box>
                        {cartBtnShow ?
                            <Button mt={1} mr={2} onClick={handleOpenCart} position="relative">
                                Cart<Box as="i" className="fa fa-cart-shopping" ml={1}></Box>
                                {cartItems.length === 0 ? "" :
                                    <Circle w={5} h={5} backgroundColor="red" color="white" position="absolute" bottom={-1} right={-1}>
                                        {cartItems.length}
                                    </Circle>}
                            </Button>
                            : ""}
                        <Link to={'/'}>
                            <Button mt={1} mr={4} onClick={handleLogout}>Log Out<Box as="i" className="fa fa-right-from-bracket" ml={1}></Box></Button>
                        </Link>
                    </Box>
                    :
                    <Link to={'/login'}>
                        <Button mt={1} mr={4}>Log In<Box as="i" className="fa fa-right-to-bracket" ml={1}></Box></Button>
                    </Link>
                }
            </Hide>
        </Box>
    );
}

export default NavBar;