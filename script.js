// Fetch data with .then
function fetchDataWithThen() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

// Fetch data with async/await
async function fetchDataWithAsyncAwait() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Render data in the table
function renderTable(data) {
    const tableBody = document.getElementById('cryptoTable');
    tableBody.innerHTML = ''; // Clear previous data

    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${coin.image}" alt="${coin.name}" width="20" height="20"> ${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const rows = Array.from(document.querySelectorAll('#cryptoTable tr'));

    rows.forEach(row => {
        const name = row.cells[0].innerText.toLowerCase();
        const symbol = row.cells[1].innerText.toLowerCase();
        row.style.display = name.includes(searchValue) || symbol.includes(searchValue) ? '' : 'none';
    });
});

// Sort by market cap
document.getElementById('sortMktCapBtn').addEventListener('click', function() {
    fetchDataWithAsyncAwait().then(data => {
        data.sort((a, b) => b.market_cap - a.market_cap);
        renderTable(data);
    });
});

// Sort by percentage change
document.getElementById('sortPercentageBtn').addEventListener('click', function() {
    fetchDataWithAsyncAwait().then(data => {
        data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderTable(data);
    });
});

// Initial fetch
fetchDataWithThen(); // Use fetchDataWithAsyncAwait() if you prefer async/await
