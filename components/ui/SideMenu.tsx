import { useRouter } from 'next/router';
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { AuthContext, UIContext } from "../../context";
import { useContext, useState } from "react";


export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext(UIContext);
    const { isLoggedIn, user, logoutUser } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        localStorage.setItem('querySearch', searchTerm);
        navigateTo(`/search/${ searchTerm }`);
    }

    const navigateTo = (url: string) => {
        toggleSideMenu();
        router.push(url);
    }

  return (
    <Drawer open={ isMenuOpen } anchor='right' sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }} onClose={ toggleSideMenu } >
        <Box sx={{ width: 250, paddingTop: 5 }}>            
            <List>
                <ListItem>
                    <Input value={ searchTerm } autoFocus
                        onChange={ (e) => setSearchTerm(e.target.value) } 
                        onKeyDown={ (e) => e.key === 'Enter' && onSearchTerm() } 
                        type='text' placeholder="Buscar..." 
                        endAdornment={ 
                            <InputAdornment position="end">
                                <IconButton onClick={ onSearchTerm }>
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                {
                    isLoggedIn && (
                        <>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountCircleOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Perfil'} />
                            </ListItem>

                            <ListItem button onClick={() => navigateTo('/orders/history')}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Mis Ordenes'} />
                            </ListItem>
                        </>
                    )
                }                

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={ ()=> navigateTo('/category/men') }>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={ ()=> navigateTo('/category/women') } >
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={ ()=> navigateTo('/category/kid') } >
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>

                {
                    isLoggedIn ? (
                        <ListItem button onClick={ logoutUser }>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>
                    ) : (
                        <ListItem button onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>                        
                    )
                }
                           
                {/* Admin */}
                {
                    (isLoggedIn && user !== null && user?.role === 'admin') && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button onClick={() => navigateTo('/admin/')}>
                                <ListItemIcon>
                                    <DashboardOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>
                            <ListItem button onClick={() => navigateTo('/admin/products')}>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>
                            <ListItem button onClick={() => navigateTo('/admin/orders')}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItem>

                            <ListItem button onClick={() => navigateTo('/admin/users')}>
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>
                        </>                                              
                    )                                            
                }
                 </List>
                
        </Box>
    </Drawer>
  )
}