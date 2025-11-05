// src/modules/items/models/ItemModel.ts

export class ItemModel {
    id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;

    constructor(
        id: number = 0,
        code: string = '',
        name: string = '',
        description: string = '',
        price: number = 0,
        stock: number = 0
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }

    // Example method to calculate the total value of the item
    totalValue(): number {
        return this.price * this.stock;
    }

    // Method to validate if the item data is correct
    validate(): boolean {
        return this.code !== '' && this.name !== '' && this.price > 0 && this.stock >= 0;
    }
}
