import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebaseConnection"; 
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore"; 

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [mensagem, setMensagem] = useState(''); 
  const [posts, setPosts] = useState([]);
  const [respostaTexto, setRespostaTexto] = useState('');

  async function adicionar() {
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
      mensagem: mensagem, 
      respostas: [] 
    })
    .then(() => {
      console.log("Dados cadastrados");
      setAutor("");
      setTitulo("");
      setMensagem(""); 
      buscarPosts();
    })
    .catch((error) => {
      console.log("Deu erro: " + error);
    });
  }

  async function buscarPosts() {
    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
            mensagem: doc.data().mensagem, 
            respostas: doc.data().respostas || [] 
          });
        });
        setPosts(lista);
      })
      .catch(() => {
        console.log("Erro ao buscar posts.");
      });
  }

  async function adicionarResposta(postId) {
    const docRef = doc(db, "posts", postId);
    const novaResposta = {
      texto: respostaTexto,
      autor: autor,
      id: Date.now() 
    };

    await updateDoc(docRef, {
      respostas: [...posts.find(post => post.id === postId).respostas, novaResposta] 
    })
    .then(() => {
      setRespostaTexto('');
      buscarPosts(); 
    })
    .catch((error) => {
      console.log("Erro ao adicionar resposta: " + error);
    });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deletado com sucesso");
        buscarPosts();
      })
      .catch((error) => {
        console.log("Erro ao excluir post: " + error);
      });
  }

  useEffect(() => {
    buscarPosts();
  }, []);

  return (
    <div className="Container">
      
      

      <div className="CriarDiscussao">
       
        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#2c2c2c", color: "#fff" }}>
          <h3>Criar Nova Discussão</h3>
          <label>Título da Discussão:</label>
          <textarea
            placeholder="Digite o título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label>Nome do Autor:</label>
          <input
            type="text"
            placeholder="Nome do autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />

          <label>Adicionar Mensagem:</label>
          <textarea
            placeholder="Digite sua mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          <button onClick={adicionar}>Cadastrar</button>
        </div>
      </div>

      
      <div className="ListaPosts">
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "8px", backgroundColor: "#2c2c2c", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span><strong>Autor:</strong> {post.autor}</span>
                <span><strong>ID:</strong> {post.id}</span>
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                <strong>TÍTULO DO POST:</strong> <div style={{ fontSize: "1.2em" }}>{post.titulo}</div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <strong>Mensagem:</strong> <div>{post.mensagem}</div> 
              </div>
              <button onClick={() => excluirPost(post.id)} style={{ marginTop: "10px" }}>Excluir</button>

              
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                <textarea 
                  placeholder="Digite sua resposta"
                  value={respostaTexto}
                  onChange={(e) => setRespostaTexto(e.target.value)}
                />
                <button onClick={() => adicionarResposta(post.id)}>Responder</button>
              </div>
              {post.respostas.length > 0 && (
                <ul style={{ marginLeft: "40px", marginTop: "10px" }}>
                  {post.respostas.map((resposta) => (
                    <li key={resposta.id}>
                      <strong>Resposta de um usuário: {resposta.autor}:</strong> {resposta.texto}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
