import { Box, Button, Center, GridItem, Heading, Image, Input, SimpleGrid, Spacer, Spinner, Tag } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import Cart from './Cart';
import Slide from './Slide';
import { useAppContext } from '../App';

const StoreItem = ({ _id, name, price, image, tags, description }) => {
    const { token, addToCart, cartItems } = useAppContext();
    const navigate = useNavigate();

    const handleCardClick = () => {
        localStorage.setItem("productData", JSON.stringify({ id: _id, title: name, price, image, category: tags.join(", "), description, quantity: 1, totalPrice: price }));
        window.open(`#/product/${_id}`, "_blank");
    };

    const handleCartAdd = (e) => {
        e.stopPropagation();
        if (token) {
            if (cartItems.find(item => item.id === _id)) {
                alert("It's already in the cart!");
            } else {
                addToCart({ id: _id, title: name, image, price, category: tags.join(", "), description, quantity: 1, totalPrice: price });
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <Box className="productCard" p={4} borderRadius="lg" borderWidth="1px" cursor="pointer" backgroundColor="white" onClick={handleCardClick}>
            <Center>
                <Image src={image} alt={name} w={24} />
            </Center>
            <Heading mt={4} noOfLines={2} size="sm" fontWeight="normal">{name}</Heading>
            <Tag mt={4} size={{ base: "sm", lg: "md" }}>{tags.join(", ")}</Tag><br />
            <Box display="flex" justifyContent="space-between">
                <Tag mt={4} size={{ base: "md", md: "lg" }}>${price}</Tag>
                <Box as='i' className='fa fa-cart-shopping fa-lg cart' mt={{ base: "7", md: "8" }} onClick={handleCartAdd}></Box>
            </Box>
        </Box>
    );
};

function Store() {
    const { setCartBtnShow, loading, setLoading } = useAppContext();
    const [filteredItems, setFilteredItems] = useState([]);  
    const [storeItem, setStoreItem] = useState([]);  

    useEffect(() => {
        setCartBtnShow(true);  
        setLoading(true);  
        const token = localStorage.getItem('token');
        axios.get('http://localhost:7000/api/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(({ data }) => {
            setStoreItem(data.data);
            setFilteredItems(data.data);  
            setLoading(false);  
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(false);  
        });
    }, [setCartBtnShow, setLoading]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(); 
        }
    };

    const handleSearch = () => {
        const searchBox = document.getElementById("searchBox");
        let searchItems = storeItem.filter(item => item.name.toLowerCase().includes(searchBox.value.toLowerCase()));
        setFilteredItems(searchItems); 
        searchBox.value = "";  // 搜索後清空搜索框
    };

    const handleFilter = (e) => {
        const filterValue = e.target.value.toLowerCase();
    
        if (filterValue === "all") {
            setFilteredItems(storeItem);  
        } else {
            let filtered = storeItem.filter(item => 
                item.tags.some(tag => tag.toLowerCase() === filterValue)
            );
            setFilteredItems(filtered);  
        }
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
                                <Button onClick={handleSearch} type="button">
                                    <Box as="i" className="fa fa-magnifying-glass"></Box>
                                </Button>
                            </Box>
                            <Slide />
                            <Box mt={8} textAlign={{ base: "left", md: "center" }}>
                                <Button mx="1" my="0.5" value="all" size="sm" onClick={handleFilter} backgroundColor="blue" color="white">All</Button>
                                <Button mx="1" my="0.5" value="新品" size="sm" onClick={handleFilter} backgroundColor="pink" color="black">新品</Button>
                                <Button mx="1" my="0.5" value="熱銷" size="sm" onClick={handleFilter} backgroundColor="pink" color="black">熱銷</Button>
                                <Button mx="1" my="0.5" value="期間限定" size="sm" onClick={handleFilter} backgroundColor="pink" color="black">期間限定</Button>
                                <Button mx="1" my="0.5" value="折扣" size="sm" onClick={handleFilter} backgroundColor="pink" color="black">折扣</Button>
                                <Button mx="1" my="0.5" value="限量" size="sm" onClick={handleFilter} backgroundColor="pink" color="black">限量</Button>
                            </Box>

                            <Box display="flex" flexWrap="wrap" justifyContent={{base: "flex-start", md: "center"}}>
                                <Button mx="1" my="0.5" value="服裝" size="sm" onClick={handleFilter} backgroundColor="black" color="white">服裝</Button>
                                <Button mx="1" my="0.5" value="配飾" size="sm" onClick={handleFilter} backgroundColor="black" color="white">配飾</Button>
                                <Button mx="1" my="0.5" value="美妝保養" size="sm" onClick={handleFilter} backgroundColor="black" color="white">美妝保養</Button>
                                <Button mx="1" my="0.5" value="電子產品" size="sm" onClick={handleFilter} backgroundColor="black" color="white">電子產品</Button>
                                <Button mx="1" my="0.5" value="公仔玩具" size="sm" onClick={handleFilter} backgroundColor="black" color="white">公仔玩具</Button>
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
