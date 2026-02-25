/* =========================
   AUTH SYSTEM
========================= */

const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const dashboardSection = document.getElementById('dashboardSection');

const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const loggedUser = document.getElementById('loggedUser');
const logoutBtn = document.getElementById('logoutBtn');

let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

/* Switch Forms */
showLogin.onclick = () => {
    loginSection.classList.remove('hidden');
    registerSection.classList.add('hidden');
};

showRegister.onclick = () => {
    registerSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
};

/* Register */
registerForm.onsubmit = e => {
    e.preventDefault();

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const confirm = regConfirmPassword.value;

    if(password !== confirm){
        alert("Passwords do not match");
        return;
    }

    if(users.find(u => u.email === email)){
        alert("Email already exists");
        return;
    }

    users.push({name,email,password});
    localStorage.setItem('users', JSON.stringify(users));

    alert("yes regestered on!");
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
};

/* Login */
loginForm.onsubmit = e => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    const user = users.find(u => u.email === email && u.password === password);

    if(!user){
        alert(" SORY PLAESE AGAIN");
        return;
    }

    currentUser = user;
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loggedUser.textContent = "Hello, " + user.name;

    refreshAll();
};

/* Logout */
logoutBtn.onclick = () => {
    dashboardSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    currentUser = null;
};


/* =========================
   SIDEBAR NAVIGATION
========================= */

const menuDashboard = document.getElementById('menuDashboard');
const menuProducts = document.getElementById('menuProducts');
const menuReports = document.getElementById('menuReports');
const menuSettings = document.getElementById('menuSettings');

const dashboardContent = document.getElementById('dashboardContent');
const productsContent = document.getElementById('productsContent');
const reportsContent = document.getElementById('reportsContent');
const settingsContent = document.getElementById('settingsContent');

function setActive(menu){
    [menuDashboard,menuProducts,menuReports,menuSettings]
    .forEach(m=>m.classList.remove('active'));
    menu.classList.add('active');

    dashboardContent.classList.add('hidden');
    productsContent.classList.add('hidden');
    reportsContent.classList.add('hidden');
    settingsContent.classList.add('hidden');
}

menuDashboard.onclick = () => {
    setActive(menuDashboard);
    dashboardContent.classList.remove('hidden');
};

menuProducts.onclick = () => {
    setActive(menuProducts);
    productsContent.classList.remove('hidden');
};

menuReports.onclick = () => {
    setActive(menuReports);
    reportsContent.classList.remove('hidden');
    updateReports();
};

menuSettings.onclick = () => {
    setActive(menuSettings);
    settingsContent.classList.remove('hidden');
};


/* =========================
   DARK MODE
========================= */

const darkModeToggle = document.getElementById('darkModeToggle');
const toggleDark = document.getElementById('toggleDark');

darkModeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
};

if(toggleDark){
    toggleDark.onclick = () => {
        document.body.classList.toggle('dark-mode');
    };
}


/* =========================
   PRODUCTS SYSTEM
========================= */

let products = JSON.parse(localStorage.getItem('products')) || [
    {id:1,name:"Laptop",category:"Electronics",quantity:5,price:800},
    {id:2,name:"Phone",category:"Electronics",quantity:10,price:500},
    {id:3,name:"Chair",category:"Furniture",quantity:2,price:120}
];

let productId = products.length
    ? Math.max(...products.map(p=>p.id)) + 1
    : 1;

const productTable = document.getElementById('productTable');
const showAddProduct = document.getElementById('showAddProduct');
const addProductSection = document.getElementById('addProductSection');
const productForm = document.getElementById('productForm');
const searchProduct = document.getElementById('searchProduct');

function saveProducts(){
    localStorage.setItem('products', JSON.stringify(products));
}

/* Toggle Form */
if(showAddProduct){
    showAddProduct.onclick = () => {
        addProductSection.classList.toggle('hidden');
    };
}

/* Add Product */
if(productForm){
productForm.onsubmit = e => {
    e.preventDefault();

    const name = productName.value.trim();
    const category = productCategory.value.trim();
    const quantity = parseInt(productQuantity.value);
    const price = parseFloat(productPrice.value);

    products.push({
        id: productId++,
        name,
        category,
        quantity,
        price
    });

    saveProducts();
    productForm.reset();
    addProductSection.classList.add('hidden');
    refreshAll();
};
}

/* Delete Product */
function deleteProduct(id){
    products = products.filter(p => p.id !== id);
    saveProducts();
    refreshAll();
}

/* Search */
if(searchProduct){
searchProduct.addEventListener('input', e=>{
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('#productTable tr').forEach(row=>{
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(query) ? "" : "none";
    });
});
}

/* Render Table */
function renderProducts(){
    if(!productTable) return;

    productTable.innerHTML = "";

    products.forEach(p=>{
        const status = p.quantity < 3
            ? '<span style="color:red;font-weight:bold;">Low</span>'
            : 'In Stock';

        productTable.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.quantity}</td>
            <td>$${p.price}</td>
            <td>${status}</td>
            <td>
                <button onclick="deleteProduct(${p.id})">
                    Delete
                </button>
            </td>
        </tr>`;
    });
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard(){
    if(!totalProducts) return;

    totalProducts.textContent = products.length;

    const totalVal = products.reduce((sum,p)=>sum+(p.price*p.quantity),0);
    totalValue.textContent = "$" + totalVal;

    const low = products.filter(p=>p.quantity < 3).length;
    lowStock.textContent = low;
}


/* =========================
   BAR CHART (SMALL)
========================= */

let chart;

function updateChart(){
    const canvas = document.getElementById("reportChart");
    if(!canvas) return;

    if(chart) chart.destroy();

    chart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: products.map(p=>p.name),
            datasets: [{
                label: "Stock Value",
                data: products.map(p=>p.price*p.quantity),
                backgroundColor: "#2563eb"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


/* =========================
   REPORTS
========================= */

function updateReports(){
    if(!reportTotalProducts) return;

    reportTotalProducts.textContent = products.length;

    const totalVal = products.reduce((s,p)=>s+p.price*p.quantity,0);
    reportTotalValue.textContent = "$" + totalVal;

    const avg = products.length
        ? products.reduce((s,p)=>s+p.price,0)/products.length
        : 0;

    reportAvgPrice.textContent = "$" + avg.toFixed(2);

    if(products.length){
        const highest = products.reduce((a,b)=>a.price>b.price?a:b);
        reportHighest.textContent = highest.name;
    } else {
        reportHighest.textContent = "-";
    }
}


/* =========================
   SETTINGS
========================= */

const saveName = document.getElementById('saveName');
const changeName = document.getElementById('changeName');
const resetSystem = document.getElementById('resetSystem');

if(saveName){
saveName.onclick = ()=>{
    if(currentUser){
        currentUser.name = changeName.value;
        localStorage.setItem('users', JSON.stringify(users));
        loggedUser.textContent = "Hello, " + currentUser.name;
        alert("Name updated!");
    }
};
}

if(resetSystem){
resetSystem.onclick = ()=>{
    if(confirm("Reset all products?")){
        products = [];
        saveProducts();
        refreshAll();
    }
};
}


/* =========================
   REFRESH ALL
========================= */

function refreshAll(){
    renderProducts();
    updateDashboard();
    updateChart();
    updateReports();
}
