import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(200).json({ message: 'Debe especificar el query de búsqueda' })
}