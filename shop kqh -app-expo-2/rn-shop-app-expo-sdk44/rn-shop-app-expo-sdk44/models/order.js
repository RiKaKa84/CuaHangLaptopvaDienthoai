import moment, * as moments from 'moment';

class Order {
    constructor(id, items, totalAmount, date, address, paymentMethod, status) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = date;
        this.address = address || '';
        this.paymentMethod = paymentMethod || 'COD';
        this.status = status || 'warehouse'; 
        // status values: 'warehouse' | 'packing' | 'shipping' | 'delivered'
    }
    get readableDate() {
        return moment(this.date).format('MMMM Do YYYY, hh:mm');
    }
}

export default Order;