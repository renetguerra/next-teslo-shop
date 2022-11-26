const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

export const orderSizes = (entries: Array<string>): Array<string> => {
 
    const orderOfValues = entries.map(s =>  validSizes.indexOf(s))
    
    return orderOfValues.sort((a,b) => a - b).map(num => {
      return validSizes[num]
    })
}