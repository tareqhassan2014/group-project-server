export default interface IProduct {
    category: string;
    name: string;
    seller: string;
    wholePrice: string;
    priceFraction: string;
    stock: number;
    star: number;
    starCount: number;
    img: string;
    url: string;
    features: object[] | [];
    price: number;
    shipping: number;
}
