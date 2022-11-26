import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data = | { message: string }
            | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
            
        default:
            res.status(400).json({ message: 'Bad request' });
    }
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;
    // Verificar que tengamos un usuario
    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Debe estar autenticado para hacer esta operación.'});
    }
    // Crear array con los productos del carrito de compras
    const productsIds = orderItems.map( product => product._id );
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
            // const currentPrice = dbProducts.find( prod => new mongoose.Types.ObjectId(prod.id).toString() === current._id)?.price;
            if (!currentPrice) {
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }
            return (currentPrice * current.quantity) + prev
        }, 0);

        const taxRate_IVA = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const totalInBd = subTotal * ( taxRate_IVA + 1);

        if ( total !== totalInBd ) {
            throw new Error('El total no cuadra con el monto');
        }
        // Todo bien hasta este punto
        const userId = session.user._id;
        const orderToCreate = new Order({ ...req.body, isPaid: false, user: userId });
        orderToCreate.total = Math.round( orderToCreate.total * 100 ) / 100; // Para tener solamente dos decimales
        await orderToCreate.save();
        await db.disconnect();

        return res.status(201).json(orderToCreate);
    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        });
    }
}
