import React from 'react'
import NextLink from 'next/link'
import { Chip, Grid, Link } from '@mui/material'
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../components/layouts'
import { IOrder, IUser } from '../../interfaces';
import useSWR from 'swr';

const columns: GridColDef[] = [        
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 100 },
    { 
        field: 'isPaid',
        headerName: 'Pagada',
        description: 'Muestra información si está pagada la orden o no',
        width: 200,
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                row.isPaid ? <Chip color="success" label="Pagada" variant='outlined' />
                : <Chip color="error" label="Pendiente" variant='outlined' />
            )
        }
    },        
    { field: 'numberOfItems', headerName: 'Nº Productos', align: 'center', width: 150 },
    { 
        field: 'check',
        headerName: 'Ver orden',                
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                <a  href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer' >                    
                    Ver orden                    
                </a>
            )
        }
    },   
    { field: 'createdAt', headerName: 'Fecha de creación', width: 300 },
];

const Orders = () => {
    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if (!data && ! error) return (<></>);
    
    const rows = data!.map(order => ({
        id: order._id,
        name: (order.user as IUser).name,
        email: (order.user as IUser).email,
        isPaid: order.isPaid,
        total: order.total,
        numberOfItems: order.numberOfItems,
        createdAt: order.createdAt
    }));

  return (
    <AdminLayout title='Órdenes' subTitle='Manteniemiento de órdenes' icon={ <ConfirmationNumberOutlined/> }>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight />                
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default Orders