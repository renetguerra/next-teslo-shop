import React, { FC, useContext } from 'react'
import NextLink from 'next/link'
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context/cart';
import { ICartProduct, IOrderItem } from '../../interfaces';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { currency } from '../../utils';

interface Props {
  editable?: boolean;
  products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

  const {cart, updateCartQuantity, removeCartProduct} = useContext(CartContext);

  const onCartProductQuantityChanged = (product: ICartProduct, currentQuantity: number) => {
    product.quantity = currentQuantity;
    updateCartQuantity(product);
  }

  const productsToShow = products ? products : cart;

  return (
    <>
        {
            productsToShow.map( product => (
                <Grid container spacing={2} key={ product.slug + product.size } sx={{mb:1}}>
                  <Grid item xs={3}>
                    <NextLink legacyBehavior href={`product/${product.slug}`} passHref >
                      <Link>
                        <CardActionArea>
                          <CardMedia image={product.image} component='img' sx={{ borderRadius: '5px' }}/>
                        </CardActionArea>
                      </Link>
                    </NextLink>
                  </Grid>
                  <Grid item xs={7}>
                    <Box display={'flex'} flexDirection='column'>
                      <Typography variant='body1'>{ product.title }</Typography>
                      <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>                  
                      {
                        editable 
                          ? (
                              <ItemCounter currentQuantity={ product.quantity } maxQuantity={ 10 } 
                                onUpdateQuantity={(currentQuantity) => { onCartProductQuantityChanged(product as ICartProduct, currentQuantity)} } /> 
                            )
                          : <Typography variant='h5'>{ product.quantity} {product.quantity > 1 ? 'artículos' : 'artículo' }</Typography>
                      }                      
                    </Box>
                  </Grid>
                  <Grid item xs={2} display='flex' alignItems={'center'} flexDirection='column'>
                    <Typography variant='subtitle1'>{ currency.format(product.price * product.quantity) }</Typography>                
                    {
                      editable && (
                        <Button variant='text' color='error' title='Remover' onClick={ () => removeCartProduct(product as ICartProduct) }>                         
                          <DeleteForeverOutlinedIcon />
                        </Button>
                      )
                    }
                    
                  </Grid>
                </Grid>
            ))
        }
    </>
  )
}
