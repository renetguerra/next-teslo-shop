import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';
import { db } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces';

type Data = | { message: string }
            | IProduct              
    

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {    

    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'DELETE':
            return deleteProduct(req, res);
                
        default:
            return res.status(400).json({ message: 'Bad request' });
    }    
}

const getProductBySlug = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const  { slug } = req.query;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if (!product) {        
        return res.status(404).json({ message: 'No hay producto con ese slug ' + slug });
    }    
    
    product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    });

    res.status(200).json(product!);  
   
}

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const  { slug } = req.query;

    await db.connect();

    const productToUpdate = await Product.findById(slug);

    if (!productToUpdate) {
        await db.disconnect();
        return res.status(400).json({ message: 'No hay producto con ese slug ' + slug });
    }

    const {       
        description = productToUpdate.description,
        price = productToUpdate.price
    } = req.body;

    try {
        // const updatedproduct = await Product.findByIdAndUpdate(slug, { description, price }, { runValidators: true, new: true });        
        productToUpdate.description = description;
        productToUpdate.price = price;
        await productToUpdate.save();

        await db.disconnect();

        res.status(200).json(productToUpdate!);  

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({ message: error.errors.status.message });
    }
}

const deleteProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {   

    const  { id } = req.query;

    await db.connect();
  
    const productToDelete = await Product.findByIdAndDelete(id);
  
    if (!productToDelete) {
        await db.disconnect();
        return res.status(400).json({ message: 'No hay producto con ese ID ' + id });
    }    

    try {        
        await db.disconnect();
        res.status(200).json(productToDelete!);         

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({ message: error.errors.status.message });
    }
}