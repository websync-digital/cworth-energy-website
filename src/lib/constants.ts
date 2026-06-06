export const COMPANY_PHONE = "+2349017813274";
export const COMPANY_NAME = "Cworth Energy";

export const formatNaira = (value: number): string =>
  `₦${new Intl.NumberFormat('en-NG').format(value)}`;

export const formatWhatsAppMessage = (productName: string, price: string | number) => {
    const formattedPrice = typeof price === 'number' ? formatNaira(price) : price;
    return `Hello ${COMPANY_NAME}! 👋\n\nI'm interested in purchasing the *${productName}* priced at *${formattedPrice}*.\n\nKindly provide more information about this product.\n\nThank you! 🌟`;
};