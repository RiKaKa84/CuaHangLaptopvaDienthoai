class Product {
    constructor(id, ownerId, title, imageUrl, description, price, category = 'laptop') {
        this.id = id;
        this.ownerId = ownerId;
        this.imageUrl = imageUrl;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
    }
}

export default Product;