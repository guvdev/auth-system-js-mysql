// 1️⃣ Cliente envia dados
// 2️⃣ Backend valida
// 3️⃣ Backend consulta banco
// 4️⃣ Backend criptografa senha
// 5️⃣ Backend salva usuário
// 6️⃣ Backend responde

const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => { //Quando alguém acessar a URL /, eu vou responder com um JSON.
  res.json({ message: "API de autenticação funcionando " });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


const bcrypt = require("bcrypt");

// ROTA DE REGISTRO
app.post("/register", async (req, res) => { //async = “Aqui dentro eu vou usar código que demora”
  const { name, email, password } = req.body; //POST = enviar dados (nome, email, senha. req.body pega os dados que o client enviou.
  // 1. Validação básica
  if (!name || !email || !password) { // !name SE name NÃO existir
    return res.status(400).json({
      success: false,
      message: "Preencha todos os campos",
    });
  }

  try {
    // 2. Verifica se o email já existe
    const checkQuery = "SELECT id FROM users WHERE email = ?";
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Erro no servidor",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email já cadastrado",
        });
      }

      // 3. Criptografa a senha
      const passwordHash = await bcrypt.hash(password, 10);

      // 4. Insere usuário no banco
      const insertQuery =
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";

      db.query(
        insertQuery,
        [name, email, passwordHash],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Erro ao criar usuário",
            });
          }

          return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso ",
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro inesperado",
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Preencha todos os campos",
    });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.json({
        success: false,
        message: "Erro no servidor",
      });
    }

    if (results.length === 0) {
      return res.json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const user = results[0];

    const senhaCorreta = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!senhaCorreta) {
      return res.json({
        success: false,
        message: "Senha incorreta",
      });
    }

    //  LOGIN OK (SEM TOKEN)
    return res.json({
      success: true,
      message: "Login realizado com sucesso",
    });
  });
});




