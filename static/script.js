document.getElementById("limpar-busca").addEventListener("click", function() {
    document.querySelector("#busca-cliente form").reset();
});

function Request(url) {
    
    fetch(`${url}`)
        .then(response => response.json())
        .then(data => {
            // Limpa o conteúdo anterior
            const produtoInfoDiv = document.getElementById("produto-info");
            produtoInfoDiv.innerHTML = ""; 

            // Verifica se o produto foi encontrado
            if (data.message) {
                produtoInfoDiv.innerHTML = `<p>${data.message}</p>`;
                return;
            }

            // Cria a tabela
            const table = document.createElement("table");
            table.innerHTML = `
                <tr>
                    <th>Atributos</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>ID</td>
                    <td>${data.id}</td>
                </tr>
                <tr>
                    <td>Nome</td>
                    <td>${data.name}</td>
                </tr>
                <tr>
                    <td>Preço</td>
                    <td>${data.price}</td>
                </tr>
                <tr>
                    <td>Descrição</td>
                    <td>${data.description}</td>
                </tr>
            `;

            // Adiciona a tabela ao elemento HTML
            produtoInfoDiv.appendChild(table);
        })
        .catch(error => {
            console.error('Erro ao buscar o produto:', error);
            document.getElementById("produto-info").innerHTML = `<p>Erro ao buscar o produto.</p>`;
        });
}

document.getElementById("carregar-busca").addEventListener("click", function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura o ID do produto inserido no input
    const productId = document.getElementById("id-produto-input").value;

    const productName = document.getElementById("nome-produto-input").value;

    const productDescription = document.getElementById("descricao-produto-input").value;

    if (!productId && !productName && !productDescription) {
        alert("Por favor, insira algum campo para fazer a busca.");
        return;
    }

    let count = 0
    if (productId) count++
    if (productName) count++
    if (productDescription) count++

    if (count > 1) {
        alert("Por favor, utilize apenas um campo para buscar.");
        return;
    }

    // Faz a requisição ao backend
    if(productName) {
        Request(`/api/products/name/${productName}`);
    } else if(productId) {
        Request(`/api/products/${productId}`);
    } else {
        Request(`/api/products/description/${productDescription}`);
    }
    
});
