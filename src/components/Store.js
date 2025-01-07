import { Box, Button, Center, GridItem, Heading, Image, Input, SimpleGrid, Spacer, Spinner, Tag } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import NavBar from './NavBar';
import Cart from './Cart';
import Slide from './Slide';
import { useAppContext } from '../App';

const StoreItem = ({ id, title, price, image, category, description }) => {
    const { token, addToCart, cartItems } = useAppContext();
    const navigate = useNavigate();

    const handleCardClick = () => {
        localStorage.setItem("productData", JSON.stringify({ id, title, price, image, category, description, quantity: 1, totalPrice: price }));
        window.open(`#/product/${id}`, "_blank");
    };

    const handleCartAdd = (e) => {
        e.stopPropagation();
        if (token) {
            if (cartItems.find(item => item.id === id)) {
                alert("It's already in the cart!");
            } else {
                addToCart({ id, title, image, price, category, description, quantity: 1, totalPrice: price });
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <Box className="productCard" p={4} borderRadius="lg" borderWidth="1px" cursor="pointer" backgroundColor="white"
             onClick={handleCardClick}>
            <Center>
                <Image src={image} w={24} />
            </Center>
            <Heading mt={4} noOfLines={2} size="sm" fontWeight="normal">{title}</Heading>
            <Tag mt={4} size={{ base: "sm", lg: "md" }}>{category}</Tag><br />
            <Box display="flex" justifyContent="space-between">
                <Tag mt={4} size={{ base: "md", md: "lg" }}>${price}</Tag>
                <Box as='i' className='fa fa-cart-shopping fa-lg cart' mt={{ base: "7", md: "8" }} onClick={handleCartAdd}></Box>
            </Box>
        </Box>
    );
};

function Store() {
    const { setCartBtnShow, loading, setLoading } = useAppContext();
    const [filteredItems, setFilteredItems] = useState([]);     // 存取Search Box对对应数据
    const [storeItem, setStoreItem] = useState([]);             // 存取API获取数据

    useEffect(() => {
        setCartBtnShow(true);
        axios.get('https://fakestoreapi.com/products')
            .then(({ data }) => {
                setLoading(false);
                setStoreItem(data);
                setFilteredItems(data);
            });
    }, [setCartBtnShow, setLoading]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSearch = () => {
        const searchBox = document.getElementById("searchBox");
        let searchItems = storeItem.filter(item => item.title.toLowerCase().includes(searchBox.value.toLowerCase()));
        setFilteredItems(searchItems);
        searchBox.value = "";
    };

    const handleFilter = (e) => {
        if (e.target.value === "all") {
            setFilteredItems(storeItem);
        } else {
            let f = storeItem.filter(item => item.category.toLowerCase() === e.target.value.toLowerCase());
            setFilteredItems(f);
        }
    };

    const handleCrudRedirect = () => {
        window.location.href = 'http://127.0.0.1:5500/public/crud.html';
    };
    
    
    
    

    return (
        <Box>
            <NavBar />
            <Box position="relative" backgroundColor="#f5f5f5">
                <Cart />
                <Box p={3} mx="auto">
                    {loading ? (
                        <Center mt={6}>
                            <Spinner />
                        </Center>
                    ) : (
                        <Box mx="auto" w={{ base: "100%", md: "85%", lg: "75%" }}>
                            <Box display="flex" mt={6}>
                                <Input id="searchBox" type="text" onKeyDown={handleKeyDown} placeholder="Search" backgroundColor="white" />
                                <Button onClick={handleSearch}>
                                    <Box as="i" className="fa fa-magnifying-glass"></Box>
                                </Button>
                            </Box>
                            <Slide />                      
                            <Box mt={8} textAlign={{ base: "left", md: "center" }}>
                                {/*商品特色分類 */}
                                <Button mx="1" my="0.5" value="all" size="sm" onClick={handleFilter} backgroundColor="black" color="white">All</Button>
                                <Button mx="1" my="0.5" value="新品" size="sm" onClick={handleFilter} backgroundColor="black" color="white">新品</Button>
                                <Button mx="1" my="0.5" value="熱銷" size="sm" onClick={handleFilter} backgroundColor="black" color="white">熱銷</Button>
                                <Button mx="1" my="0.5" value="期間限定" size="sm" onClick={handleFilter} backgroundColor="black" color="white">期間限定</Button>
                                <Button mx="1" my="0.5" value="折扣" size="sm" onClick={handleFilter} backgroundColor="black" color="white">折扣</Button>
                                <Button mx="1" my="0.5" value="限量" size="sm" onClick={handleFilter} backgroundColor="black" color="white">限量</Button>
                            </Box>

                                {/*商品種類分類*/}
                            <Box display="flex" flexWrap="wrap" justifyContent={{base: "flex-start", md: "center"}}>

                                <Button mx="1" my="0.5" value="服飾" size="sm" onClick={handleFilter} backgroundColor="black" color="white">服裝</Button>
                                <Button mx="1" my="0.5" value="飾品配件" size="sm" onClick={handleFilter} backgroundColor="black" color="white">飾品與配件</Button>
                                <Button mx="1" my="0.5" value="化妝品保養品" size="sm" onClick={handleFilter} backgroundColor="black" color="white">化妝品與保養品</Button>
                                <Button mx="1" my="0.5" value="電子產品" size="sm" onClick={handleFilter} backgroundColor="black" color="white">電子產品</Button>
                                <Button mx="1" my="0.5" value="玩具" size="sm" onClick={handleFilter} backgroundColor="black" color="white">玩具與收藏品</Button>
                                <Button mx="1" my="0.5" value="食品" size="sm" onClick={handleFilter} backgroundColor="black" color="white">食品</Button>
                                <Button mx="1" my="0.5" value="健身用品" size="sm" onClick={handleFilter} backgroundColor="black" color="white">健身用品</Button>
                                </Box>

                            <Box as="hr" w="100%" mx="auto" mt={6} mb={8} />
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 1, md: 6 }} mt={4} p={{ base: 0, md: 2 }}>
                                {filteredItems.map(item => (
                                    <GridItem key={item.id}>
                                        <StoreItem {...item} />
                                    </GridItem>
                                ))}
                            </SimpleGrid>
                            <Spacer my={20} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Store;
