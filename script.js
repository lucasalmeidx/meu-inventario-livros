/* ============================================================
   === LOGIN E LOGOUT =========================================
   ============================================================ */

const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('login-screen');
const siteContent = document.getElementById('site-content');

const correctEmail = "admin@site.com";
const correctPassword = "lucaslucas";

// Login com animação + pequeno "redirect"
loginForm.addEventListener('submit', function(e){
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    if (email === correctEmail && pass === correctPassword) {
        window.location.hash = "#inventario";
        loginScreen.style.display = "none";
        siteContent.style.display = "block";
    } else {
        alert("E-mail ou senha incorretos!");
    }
});

// BOTÃO DE SAIR
document.getElementById('logoutBtn').addEventListener('click', () => {
    siteContent.style.display = "none";
    loginScreen.style.display = "flex";
    window.location.hash = "";
});



/* ============================================================
   === SISTEMA DE INVENTÁRIO (CRUD + LocalStorage) ============
   ============================================================ */

const STORAGE_KEY = "inventario_livros_v1";

let books = loadBooks();  // Carrega assim que inicia

const form = document.getElementById("bookForm");
const tableBody = document.querySelector("#booksTable tbody");
const clearBtn = document.getElementById("clearAll");


// Enviar formulário
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const book = {
        id: Date.now(),   // ID único
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        date: document.getElementById("date").value,
        location: document.getElementById("location").value,
        status: document.getElementById("status").value
    };

    books.push(book);
    saveBooks();
    render();

    form.reset();
});


// Renderizar tabela
function render(){
    tableBody.innerHTML = "";

    books.forEach(book => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${escapeHtml(book.date)}</td>
            <td>${escapeHtml(book.location)}</td>
            <td class="status-${book.status}">${escapeHtml(book.status)}</td>

            <td>
                <button onclick="editBook(${book.id})">Editar</button>
                <button onclick="deleteBook(${book.id})">Excluir</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}


// Editar livro
function editBook(id){
    const book = books.find(b => b.id === id);
    if (!book) return;

    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('date').value = book.date;
    document.getElementById('location').value = book.location;
    document.getElementById('status').value = book.status;

    // Remove o antigo antes de regravar
    books = books.filter(b => b.id !== id);

    saveBooks();
    render();
}


// Excluir livro
function deleteBook(id){
    books = books.filter(book => book.id !== id);
    saveBooks();
    render();
}


// Botão limpar tudo
clearBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir TODO o inventário?")) {
        books = [];
        saveBooks();
        render();
    }
});



/* ============================================================
   === LOCAL STORAGE ==========================================
   ============================================================ */

function saveBooks(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks(){
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Erro ao carregar livros:", e);
        return [];
    }
}


/* ============================================================
   === SEGURANÇA BÁSICA (escape HTML) ==========================
   ============================================================ */

function escapeHtml(text){
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}



// Render inicial
render();
