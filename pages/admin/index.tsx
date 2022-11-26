import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interfaces/dashboard';

const Dashboard = () => {

    const {data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30*1000 // 30 seg
    });

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
      const insterval = setInterval(()=> {
        console.log('Tick');
        setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
      }, 1000)

      return () => clearInterval(insterval);

    }, []);
    
    if (!error && !data) {
        return <></>
    }

    if (error) {
        console.log(error);
        return <Typography>Error al cargar la información</Typography>
    }

  return (
    <AdminLayout title='Dashboard' subTitle='Estadísticas generales' icon={ <DashboardOutlined/> }>
        <Grid container spacing={2}>            
            <SummaryTile title={data?.numberOfOrders!} subTitle='Órdenes totales' icon={ <CreditCardOutlined color='secondary' sx={{fontSize: 40}} /> } />

            <SummaryTile title={data?.paidOrders!} subTitle='Órdenes pagadas' icon={ <AttachMoneyOutlined color='success' sx={{fontSize: 40}} /> } />

            <SummaryTile title={data?.notPaidOrders!} subTitle='Órdenes pendientes' icon={ <CreditCardOffOutlined color='success' sx={{fontSize: 40}} /> } />

            <SummaryTile title={data?.numberOfClients!} subTitle='Clientes' icon={ <GroupOutlined color='primary' sx={{fontSize: 40}} /> } />

            <SummaryTile title={data?.numberOfProducts!} subTitle='Productos' icon={ <CategoryOutlined color='warning' sx={{fontSize: 40}} /> } />

            <SummaryTile title={data?.productsWithoutInventory!} subTitle='Sin Existencias' icon={ <CancelPresentationOutlined color='error' sx={{fontSize: 40}} /> } />

            <SummaryTile title={data?.lowInventory!} subTitle='Bajo inventario' icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{fontSize: 40}} /> } />

            <SummaryTile title={refreshIn} subTitle='Actualización en:' icon={ <AccessTimeOutlined color='secondary' sx={{fontSize: 40}} /> } />
        </Grid>
    </AdminLayout>
  )
}

export default Dashboard