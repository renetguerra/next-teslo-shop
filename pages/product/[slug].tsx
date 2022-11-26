import React, { useContext, useState } from 'react'
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSizeSelector, ProductSlideshow } from '../../components/products';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database';
import { ItemCounter } from '../../components/ui';
import { CartContext } from '../../context/cart';

interface Props {
  product: IProduct
}

const Product: NextPage<Props> = ({ product }) => {

  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,    
    image: product.images[0],    
    price: product.price,   
    slug: product.slug,   
    title: product.title,    
    gender: product.gender,
    quantity: 1
  });  

  const selectedSize = (size:ISize) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct, // currentProduct es lo mismo que tempCartProduct (solo con un nombre más amigable).
      size
    }))
  }

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct, // currentProduct es lo mismo que tempCartProduct (solo con un nombre más amigable).
      quantity
    }))
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;

    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description} >
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 7 } >
          <ProductSlideshow images={ product.images } />
        </Grid>
        <Grid item xs={ 12 } sm={ 5 } >
          <Box display='flex' flexDirection='column' >
            {/* titulos */}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>
            {/* cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2' component='h1'>Cantidad: { product.inStock }</Typography>

              <ItemCounter currentQuantity={ tempCartProduct.quantity } onUpdateQuantity={ onUpdateQuantity } maxQuantity={ product.inStock } />

              <ProductSizeSelector sizes={ product.sizes } selectedSize={ tempCartProduct.size } onSelectedSize={ (size) => selectedSize(size) } />
            </Box>

            {/* Agregar al carrito */}
            {
              (product.inStock > 0) ? (
                <Button color='secondary' className='circular-btn' onClick={ onAddProduct }>
                  { 
                    tempCartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla' 
                  }                  
                </Button>
              ) : (
                <Chip label="No hay disponibles" color='error' variant='outlined' />
              )
            }                        

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción: </Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs.map( ({slug}) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async(ctx) => {
  const { slug = '' } = ctx.params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400 // 60*60*24(Seconds)
  }

}

export default Product
