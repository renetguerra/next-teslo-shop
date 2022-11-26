import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';
import NextLink from 'next/link'
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { ShopLayout } from '../../components/layouts'
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { ShippingAddress } from '../../interfaces/order';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si está pagada la orden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid ? <Chip color="success" label="Pagada" variant='outlined' />
                : <Chip color="error" label="No pagada" variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver Orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink legacyBehavior href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        },
    },
];

interface Props {
    orders: IOrder[]
}

const History: NextPage<Props> = ({ orders }) => {

    const rows = orders.map((order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))

  return (
    <ShopLayout title='Historial de órdenes' pageDescription='Historial de órdenes del cliente'>
        <Typography variant='h1' component='h1'>Historial de órdenes</Typography>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight />                
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const req = ctx.req;
    const session: any = await getSession({req});

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);


    return {
        props: {
            orders
        }
    }
}

export default History