import React from 'react'
import NextLink from 'next/link'
import { Box, Link, Typography } from '@mui/material'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { ShopLayout } from '../../components/layouts'

const Empty = () => {
  return (
    <ShopLayout title='Carrito de compras vacío' pageDescription='No hay artículos en el carrito de compras'>
        <Box 
            display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row'} }} >
            
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }}/>
            <Box display='flex' flexDirection='column' alignItems='center'>                
                <Typography marginLeft={ 2 }>Su carrito está vacío</Typography>
                <NextLink legacyBehavior href='/' passHref>
                    <Link typography='h4' color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default Empty