 import React, { useEffect, useState } from 'react';
 import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material'
 import { Link } from 'react-router-dom';
 import { type Product } from '../types/Product';


 function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
         const fetchProducts = async () => {
            const res = await fetch('https://dummyjson.com/products')
            const data = await res.json();
            setProducts(data.products);
            console.log(data);
         };
         fetchProducts();
    }, []);
    return (
        <Grid container spacing={2}>
            {products.map((product, index) => (
                <Grid size={4} key={index} component={Link} to={`/products/${product.id}`} >
                    <Card>
                        <CardMedia
                            component="img"
                            alt={product.title}
                            height="140"
                            image={product.images[0]}
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {product.title}
                            </Typography>
                            <Typography variant="h6">${product.price}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Home;