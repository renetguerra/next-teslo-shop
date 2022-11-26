import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'
import { countries } from '../../utils'

const Summary = () => {

    const router = useRouter();
    const { numberOfItems, shippingAddress, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {   
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        } 
    }, [router]);

    const onCreateOrder = async() => {
        setIsPosting(true);
        const {hasError, message} = await createOrder(); // depende del resultado, navegación

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`); // En este caso, message es el _id de Order
    }
    
    if (!shippingAddress) return (<></>);

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='sumary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({numberOfItems} { (numberOfItems > 1) ? 'artículos' : 'artículo' } )</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NextLink legacyBehavior href='/checkout/address' passHref >
                                <Link>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>
                        
                        <Typography>{shippingAddress?.firstName} {shippingAddress?.lastName} </Typography>
                        <Typography>{shippingAddress?.address}{ (shippingAddress?.address2) ? `, ${shippingAddress?.address2}` : '' }</Typography>
                        <Typography>{shippingAddress?.city}, {shippingAddress?.zip}</Typography>
                        <Typography>{ countries.find(c => c.code === shippingAddress?.country)?.name }</Typography>
                        <Typography>{shippingAddress?.phone}</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='end'>
                            <NextLink legacyBehavior href='/cart' passHref >
                                <Link>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary/>

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                            <Button color='secondary' className='circular-btn' fullWidth onClick={ onCreateOrder } disabled={ isPosting }> 
                                Confirmar orden
                            </Button>

                            <Chip color='error' label={ errorMessage } sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>        
    </ShopLayout>
  )
}

export default Summary