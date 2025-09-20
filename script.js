document.addEventListener('DOMContentLoaded', () => {
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productQtyInput = document.getElementById('product-qty');
    const addBtn = document.getElementById('add-btn');
    const shoppingList = document.getElementById('shopping-list');
    const totalValueSpan = document.getElementById('total-value');
    const saveBtn = document.getElementById('save-btn');
    const downloadBtn = document.getElementById('download-btn');

    let shoppingItems = JSON.parse(localStorage.getItem('shoppingItems')) || [];

    function renderList() {
        shoppingList.innerHTML = '';
        shoppingItems.sort((a, b) => a.name.localeCompare(b.name));
        shoppingItems.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = `list-item ${item.checked ? 'disabled' : ''}`;
            listItem.dataset.index = index;
            listItem.innerHTML = `
                <div class="item-info">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} aria-label="Desabilitar ${item.name}">
                    <span class="item-name">${item.name}</span>
                    <span class="item-details">(R$ ${item.price.toFixed(2)} x ${item.qty})</span>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" aria-label="Editar ${item.name}">✎</button>
                    <button class="delete-btn" aria-label="Excluir ${item.name}">✖</button>
                </div>
            `;
            shoppingList.appendChild(listItem);
        });
        updateTotal();
    }

    function updateTotal() {
        const total = shoppingItems.reduce((acc, item) => {
            return acc + (item.checked ? 0 : item.price * item.qty);
        }, 0);
        totalValueSpan.textContent = `R$ ${total.toFixed(2)}`;
    }

    function addItem() {
        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        const qty = parseInt(productQtyInput.value);

        if (name && !isNaN(price) && !isNaN(qty) && price >= 0 && qty >= 1) {
            shoppingItems.push({ name, price, qty, checked: false });
            saveItems();
            renderList();
            productNameInput.value = '';
            productPriceInput.value = '';
            productQtyInput.value = '';
        }
    }

    function deleteItem(index) {
        shoppingItems.splice(index, 1);
        saveItems();
        renderList();
    }

    function editItem(index) {
        const item = shoppingItems[index];
        const newName = prompt('Editar nome:', item.name);
        const newPrice = prompt('Editar preço:', item.price);
        const newQty = prompt('Editar quantidade:', item.qty);

        if (newName !== null && newName.trim() !== '') {
            item.name = newName.trim();
        }
        if (newPrice !== null && !isNaN(parseFloat(newPrice)) && parseFloat(newPrice) >= 0) {
            item.price = parseFloat(newPrice);
        }
        if (newQty !== null && !isNaN(parseInt(newQty)) && parseInt(newQty) >= 1) {
            item.qty = parseInt(newQty);
        }

        saveItems();
        renderList();
    }

    function toggleChecked(index) {
        shoppingItems[index].checked = !shoppingItems[index].checked;
        saveItems();
        renderList();
    }

    function saveItems() {
        localStorage.setItem('shoppingItems', JSON.stringify(shoppingItems));
    }

    function downloadList() {
        const textToSave = shoppingItems.map(item => {
            const status = item.checked ? '[X]' : '[ ]';
            return `${status} ${item.name} (R$ ${item.price.toFixed(2)} x ${item.qty})`;
        }).join('\n');
        const blob = new Blob([textToSave], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista_compras_ElizaVilela.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    addBtn.addEventListener('click', addItem);
    shoppingList.addEventListener('click', (e) => {
        const listItem = e.target.closest('.list-item');
        if (!listItem) return;

        const index = listItem.dataset.index;
        if (e.target.classList.contains('delete-btn')) {
            deleteItem(index);
        } else if (e.target.classList.contains('edit-btn')) {
            editItem(index);
        } else if (e.target.type === 'checkbox') {
            toggleChecked(index);
        }
    });

    saveBtn.addEventListener('click', saveItems);
    downloadBtn.addEventListener('click', downloadList);

    renderList();
});
