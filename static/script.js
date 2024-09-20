document.getElementById("limpar-busca").addEventListener("click", function() {
    document.querySelector("#busca-cliente form").reset();
});


document.getElementById("carregar-busca").addEventListener("click", function(event) {
    event.preventDefault(); 

    const inputs = document.querySelectorAll("#form input")
    let count = 0

    inputs.forEach(input => {
        if (input.value.trim() !== ""){
            count += 1
        }
    })
    if (count > 1) {
        alert("Por favor, utilize apenas um campo para busca.")
        return
    }

    const productId = document.getElementById("id-produto-input").value;
    const productName = document.getElementById("nome-produto-input").value;
    const productDescription = document.getElementById("descricao-produto-input").value;

    if (!productId && !productName && !productDescription) {
        alert("Por favor, insira algum campo para fazer a busca.");
        return;
    }

    if(productDescription){
        fetch(`/api/products/${productDescription}`)
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

    } else if(productId){
        fetch(`/api/products/${productDescription}`)
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

    } if(productDescription){
        fetch(`/api/products/${productDescription}`)
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
});
