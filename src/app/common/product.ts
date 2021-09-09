export class Product {
    id !: number;
    sku !: string | undefined;
    name !: string | undefined;
    description !: string | undefined;
    unitPrice !: number | undefined;
    imageUrl !: string | undefined;
    active !: boolean;
    unitsInStock !: number;
    dateCreated !: Date;
    lastUpdated !: Date;
}