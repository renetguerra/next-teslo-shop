import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import { CartList, OrderSummary } from '../../../components/cart'
import { AdminLayout } from '../../../components/layouts'
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
    order: IOrder;
}

const Order: NextPage<Props> = ({order}) => {
   
  return (
    <AdminLayout title='Resumen de la orden' subTitle={`Orden Id: ${order._id}`} icon={<ConfirmationNumberOutlined/>}>        
        {
            order.isPaid ? (
                <Chip sx={{ my: 2}} label='Orden pagada' variant='outlined' color='success' icon={ <CreditScoreOutlined />} />
            ): 
            (
                <Chip sx={{ my: 2}} label='Pendiente de pago' variant='outlined' color='error' icon={ <CreditCardOffOutlined />} />
            )
            
        }
        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7}>
                <CartList products={ order.orderItems }/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='sumary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'artículos' : 'artículo'})</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>                            
                        </Box>
                        
                        <Typography>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</Typography>
                        <Typography>{order.shippingAddress.address} { order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ''}</Typography>
                        <Typography>{order.shippingAddress.city}, {order.shippingAddress.zip}</Typography>
                        <Typography>{order.shippingAddress.country}</Typography>
                        <Typography>{order.shippingAddress.phone}</Typography>

                        <Divider sx={{ my: 1 }} />                        

                        <OrderSummary orderValues={{
                                numberOfItems: order.numberOfItems,
                                subTotal: order.subTotal,
                                tax: order.tax,
                                total: order.total
                            }} 
                        />

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>                            
                            <Box sx={{ display: 'flex', flex: 1 }} flexDirection='column' >
                                {
                                    order.isPaid ? (
                                        <Chip sx={{ my: 2}} label='Pagada' variant='outlined' color='success' icon={ <CreditScoreOutlined />} />  
                                    ):
                                    (
                                        <Chip sx={{ my: 2}} label='Pendiente' variant='outlined' color='error' icon={ <CreditCardOffOutlined />} />  
                                    )
                                }   
                            </Box>                                                                                                                                                          
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>        
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { id = '' } = ctx.query;   
    const req = ctx.req;
    
    const order = await dbOrders.getOrderById(id.toString());
    
    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false
            }
        }
    }
    
    return {
        props: {
            order
        }
    }
}

export default Order