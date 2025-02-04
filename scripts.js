function getByID(id) {
return document.getElementById(id);
}

let url = 'https://jsonplaceholder.typicode.com/'

async function buscaPosts() {
    try {
        let response = await fetch(url + 'posts'); // Faz a requisição dos posts da API
        if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    // Transforma os dados em json
    let posts = await response.json();

    return posts
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
    }
}

async function buscarAutores(autorId) {
    try {
        let response = await fetch(url + `users/${autorId}`); // Faz a requisição dos autores 
        if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    // Transforma os dados em json
    let autores = await response.json();
    // console.log(autores)
    return autores
    } catch (error) {
        console.error('Erro ao buscar autores:', error);
    }
}

async function buscarComentarios(postId) {
    try {
        let response = await fetch(url + `comments?postId=${postId}`); // Faz a requisição dos autores 
        if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    // Transforma os dados em json
    let comentarios = await response.json();

    return comentarios
    } catch (error) {
        console.error('Erro ao buscar comentarios:', error);
    }
}

async function exibePosts() {
    let posts = await buscaPosts();

    let quantidade = 6;

    for (let i = 1; i <= quantidade; i++) {
        let titulo = getByID(`tituloPost${i}`);
        let body = getByID(`bodyPost${i}`);
        let conteudo = getByID(`conteudo${i}`);

        // Pegar o post correspondente
        let post = posts[i - 1];

        titulo.innerHTML = post.title.toUpperCase();
        body.innerHTML = post.body;

        // Criação do link para buscar os dados do altor
        let autor = await buscarAutores(post.userId);

        let dadosAutor = getByID(`dadosAutor${i}`);
        dadosAutor.addEventListener('click', async(funcao) => {
            funcao.preventDefault();

            if (conteudo.style.display === 'none'){

                conteudo.innerHTML = `<h3>Dados do autor: </h3>
                    <p><strong>Nome do autor:</strong> ${autor.name}</p>
                    <p><strong>Email: </strong>${autor.email}</p>
                    <p><strong>Telefone do autor:</strong> ${autor.phone}</p>`;

                conteudo.style.display = 'block';
                dadosAutor.textContent = 'Ocultar dados do autor';
            } else {
                // Oculta os comentários
                conteudo.style.display = 'none';
                dadosAutor.textContent = 'Buscar dados do autor';
            } ;
        });
    
        // conteudo.innerHTML = `
        //     <p><strong>AUTOR:</strong> ${autor.username}</p>
        //     <p><strong>EMAIL:</strong> ${autor.email}</p>
        //     `;

        // Inclusão de comentários
        try {   
            let listaComentarios = await buscarComentarios(post.id);
            let linkComentario = getByID(`linkComentario${i}`);

            linkComentario.addEventListener('click', async (evento) =>{
                evento.preventDefault();
                let divcomentarios = getByID(`comentarios${i}`);

                if (divcomentarios.style.display === 'none'){
                    divcomentarios.innerHTML = `<h3>Comentários: </h3>`;
                    
                    listaComentarios.forEach(comentario => {
                        divcomentarios.innerHTML += `
                            <p>(${comentario.email}) - <strong>${comentario.name}</strong></p>
                            <p>${comentario.body}</p>`;
                    });

                    divcomentarios.style.display = 'block';
                    linkComentario.textContent = 'Ocultar comentários'
                } else {
                    // Oculta os comentários
                    divcomentarios.style.display = 'none';
                    linkComentario.textContent = 'Acessar comentários'
                }                    
            })
        } catch (error) {
            listaComentarios.innerHTML = `<p>Erro: ${error.message}</p>`;
        };     
    };
};

exibePosts()
