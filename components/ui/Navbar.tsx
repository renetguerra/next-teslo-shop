import React, { useContext, useState } from 'react'
import NextLink from 'next/link'
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import { SearchOutlined, ShoppingCartOutlined, ClearOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { CartContext, UIContext } from '../../context'

export const Navbar = () => {

    const router = useRouter();

    const { toggleSideMenu } = useContext(UIContext);
    const { numberOfItems }= useContext(CartContext)   

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;     
        router.push(`/search/${ searchTerm }`);           
    }   

  return (
    <AppBar>
        <Toolbar>
            <NextLink legacyBehavior href='/' passHref>
                <Link display='flex' alignItems='center'>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>
            </NextLink>

            <Box flex={ 1 } />

            <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block'} }} className='fadeIn'>
                <NextLink legacyBehavior href='/category/men' passHref>
                    <Link>
                        <Button color={ router.asPath === '/category/men' ? 'primary' : 'info' }>Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink legacyBehavior href='/category/women' passHref>
                    <Link>
                        <Button color={ router.asPath === '/category/women' ? 'primary' : 'info' }>Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink legacyBehavior href='/category/kid' passHref>
                    <Link>
                        <Button color={ router.asPath === '/category/kid' ? 'primary' : 'info' }>Niños</Button>
                    </Link>
                </NextLink>
            </Box>                       

            <Box flex={ 1 } />

            {/* Pantallas grandes */}
            {
                isSearchVisible
                    ? (
                        <Input sx={{ display: { xs: 'none', sm: 'flex'} }}
                            value={ searchTerm } autoFocus
                            onChange={ (e) => setSearchTerm(e.target.value) } 
                            onKeyDown={ (e) => e.key === 'Enter' && onSearchTerm() } 
                            type='text' placeholder="Buscar..." 
                            endAdornment={ 
                                <InputAdornment position="end">
                                    <IconButton onClick={ () => setIsSearchVisible(false) }>
                                        <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    )
                    : (
                        <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} 
                            onClick={ () => setIsSearchVisible(true)} className='fadeIn'>
                            <SearchOutlined/>
                        </IconButton>
                    )
            }
            
            {/* Pantallas pequeñas */}
            <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={ toggleSideMenu }>
                <SearchOutlined/>
            </IconButton>

            <NextLink legacyBehavior href='/cart' passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems } color='secondary' >
                            <ShoppingCartOutlined />
                        </Badge>                        
                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={ toggleSideMenu }>
                Menú
            </Button>
        </Toolbar>
    </AppBar>
  )
}
