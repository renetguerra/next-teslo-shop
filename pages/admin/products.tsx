import React from 'react'
import useSWR from 'swr';
import NextLink from 'next/link'
import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../components/layouts'
import { IProduct } from '../../interfaces';

const columns: GridColDef[] = [            
    {         
        field: 'img', headerName: 'Foto',
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
                    <CardMedia component='img' className='fadeIn' image={row.img} alt={row.title} />
                </a>
            )
        } 
    },
    { 
        field: 'title', headerName: 'Producto', width: 250,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink legacyBehavior href={`/admin/products/${params.row.slug}`} passHref>
                    <Link underline='always'>
                         {params.row.title}
                    </Link>
                </NextLink>
            )
        },
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Talla', width: 250 }    
];

const Products = () => {
    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if (!data && ! error) return (<></>);
    
    const rows = data!.map(product => ({
        id: product._id,
        slug: product.slug,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
    }));

  return (
    <AdminLayout title={`Productos (${data?.length})`} subTitle='Manteniemiento de productos' icon={ <CategoryOutlined/> }>
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }} >
            <Button startIcon={ <AddOutlined/> } color='secondary' href='/admin/products/new'>
                Crear producto
            </Button>
        </Box>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight />                
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default Products