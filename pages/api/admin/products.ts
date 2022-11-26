import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { orderSizes } from '../../../utils/sorts';
import { Slide } from 'react-slideshow-image';

import { v2 as cloudinary } from 'cloudinary'

// Configuramos Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = | { message: string }
            | IProduct[]
            | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {    
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);                    
        case 'POST':
            return createProduct(req, res);
        case 'PUT':
            return updateProduct(req, res);                    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const products = await Product.find().sort({ title: 'asc' }).lean();
    await db.disconnect();
    
    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });
        return product;
    });

    res.status(200).json(updatedProducts);
}

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El Id del producto no es válido' });
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    try {
        await db.connect();
        const product = await Product.findById(_id);
        if (!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }
        
        product.images.forEach(async(image) => {
            if (!images.includes(image)) {
                // Borrar de Cloudinary
                const fileCompleteName = image.substring(image.lastIndexOf('/') + 1).split('.');
                const fileName = fileCompleteName[0];
                await cloudinary.uploader.destroy(fileName);
            }
        })

        let sizes = req.body.sizes;
        req.body.sizes = orderSizes(sizes)
        await product.update(req.body);    
        await db.disconnect();

        return res.status(200).json(product);

    } catch (error) {
        console.log(error);        
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }
}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    try {
        await db.connect();
        const productInDb = await Product.findOne({ slug: req.body.slug });
        if (productInDb) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
        }

        let sizes = req.body.sizes;
        req.body.sizes = orderSizes(sizes);   

        const productToCreate = new Product(req.body);
        await productToCreate.save();
        await db.disconnect();

        return res.status(201).json(productToCreate);

    } catch (error) {
        console.log(error);        
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }
}

