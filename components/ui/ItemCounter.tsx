import React, { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';

interface Props {
  currentQuantity: number;
  maxQuantity: number;

  //Methods
  onUpdateQuantity: (quantity: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentQuantity, maxQuantity, onUpdateQuantity }) => {
  return (
    <Box display='flex' alignItems='center' >
        <IconButton disabled={ currentQuantity === 1 } onClick={ () => onUpdateQuantity(currentQuantity - 1) } >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}> { currentQuantity } </Typography>
        <IconButton disabled={ currentQuantity === maxQuantity } onClick={ () => onUpdateQuantity(currentQuantity + 1) }>
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
