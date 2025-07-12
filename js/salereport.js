// ✅ Replace with your deployed Apps Script URL
    const apiUrl = 'https://script.google.com/macros/s/AKfycbzywsOh0hrUzJuKqoLuIBOJEECAzQl1bF4qvTduKpYzlFmnFCuVSMv0LFwuOXnKKYP9/exec?action=read';

    // Format timestamp
    function formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    }

    // Parse order string into structured object
    function parseOrderData(order) {
      try {
        const parts = order.split(":");
        const customerName = parts[0];
        const rest = parts.slice(1).join(":");
        const lines = rest.split(";").filter(Boolean);
        const items = [];

        let subtotal = 0;
        let discount = 0;
        let tax = 0;
        let total = 0;

        for (let i = 0; i < lines.length; i++) {
          const fields = lines[i].split(",");
          if (fields.length === 5) {
            const [name, size, price, quantity, itemTotal] = fields;
            subtotal += parseFloat(itemTotal);
            items.push({ name, size, price, quantity, itemTotal });
          } else if (fields.length === 4) {
            [discount, tax, total] = fields.map(Number);
          }
        }

        return { customerName, items, subtotal, discount, tax, total };
      } catch (e) {
        console.error("Error parsing order:", e);
        return { customerName: "Unknown", items: [], subtotal: 0, discount: 0, tax: 0, total: 0 };
      }
    }

    // Load orders from API
    async function loadOrders() {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === 'success') {
          displayOrders(result.data);
        } else {
          document.getElementById('orders-body').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-red-500">Failed to load sales reports.</td></tr>`;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('orders-body').innerHTML = `
          <tr><td colspan="7" class="text-center py-4 text-red-500">Could not connect to the server.</td></tr>`;
      }
    }

    // Render orders into the table
    function displayOrders(data) {
      const tbody = document.getElementById('orders-body');
      tbody.innerHTML = '';

      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-500">No orders found.</td></tr>`;
        return;
      }

      data.forEach((row) => {
        const timestamp = formatTimestamp(row.Timestamp || row[0]);
        const orderData = row.OrderData || row[1];
        const { customerName, items, subtotal, discount, tax, total } = parseOrderData(orderData);

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 transition-colors";

        tr.innerHTML = `
          <td class="px-4 py-3 whitespace-nowrap">${timestamp}</td>
          <td class="px-4 py-3 whitespace-nowrap">${customerName}</td>
          <td class="px-4 py-3">
            <ul class="space-y-1">
              ${items.map(item => `
                <li class="text-sm">
                  ${item.name} (size: ${item.size}) x ${item.quantity} - $${parseFloat(item.itemTotal).toFixed(2)}
                </li>`).join('')}
            </ul>
          </td>
          <td class="px-4 py-3 text-right">$${subtotal.toFixed(2)}</td>
          <td class="px-4 py-3 text-right">$${discount.toFixed(2)}</td>
          <td class="px-4 py-3 text-right">$${tax.toFixed(2)}</td>
          <td class="px-4 py-3 text-right font-semibold">$${total.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Load orders on page load
    window.onload = loadOrders;