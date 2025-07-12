const reportData = JSON.parse(localStorage.getItem('salesReportData'));

    if (!reportData) {
      document.body.innerHTML = `
        <div class="container text-center py-20">
          <h2 class="text-2xl font-bold text-gray-600">No data available.</h2>
          <p class="mt-2 text-gray-500">Please go back and checkout from the cart.</p>
        </div>
      `;
    } else {
      document.getElementById('timestamp').textContent = reportData.timestamp;

      const tbody = document.getElementById('report-body');

      reportData.cart.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td data-label="Product" class="center">
            <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;object-fit:cover;margin-right:10px;border-radius:4px;">
            ${item.name}
          </td>
          <td data-label="Size">${item.size}</td>
          <td data-label="Price">$${parseFloat(item.price).toFixed(2)}</td>
          <td data-label="Quantity">${item.quantity}</td>
          <td data-label="Total">$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });

      document.getElementById('report-subtotal').textContent = parseFloat(reportData.subtotal).toFixed(2);
      document.getElementById('report-discount').textContent = parseFloat(reportData.discount).toFixed(2);
      document.getElementById('report-tax').textContent = parseFloat(reportData.tax).toFixed(2);
      document.getElementById('report-total').textContent = parseFloat(reportData.total).toFixed(2);
    }