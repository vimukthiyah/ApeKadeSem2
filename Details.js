document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryContainer = document.querySelector('#orderSummary');

    // Retrieve saved orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];

    if (savedOrders.length > 0) {
        const latestOrder = savedOrders[savedOrders.length - 1];
        const orderSummaryTable = document.createElement('table');
        orderSummaryTable.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                ${latestOrder.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity} ${item.unit}</td>
                        <td>LKR ${item.price.toFixed(2)}</td>
                        <td>LKR ${item.totalPrice.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">Total:</td>
                    <td>LKR ${latestOrder.total}</td>
                </tr>
            </tfoot>
        `;

        orderSummaryContainer.appendChild(orderSummaryTable);
    } else {
        orderSummaryContainer.innerHTML = '<p>No orders found.</p>';
    }
});
