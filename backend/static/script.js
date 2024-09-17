document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('Form');
    const dadosProduto = document.getElementById('Dados');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const productId = document.getElementById('productId').value;

        
        fetch(`http://127.0.0.1:5000/api/products/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Produto não encontrado');
                }
                return response.json();
            })
            .then(data => {
                dadosProduto.innerHTML = `
                    <strong>ID:</strong> ${data.id}<br>
                    <strong>Nome:</strong> ${data.name}<br>
                    <strong>Preço:</strong> ${data.price}<br>
                    <strong>Descrição:</strong> ${data.description}
                `;
            })
            .catch(error => {
                console.error('Erro:', error);
                dadosProduto.innerHTML = 'Ocorreu um erro ao buscar o produto';
            });
    });
});
