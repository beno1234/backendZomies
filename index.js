const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const multer = require("multer");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const upload = multer();

async function enviarEmailBackend(
  nome,
  telefone,
  email,
  instagram,
  curriculoFile,
  curriculoName
) {
  try {
    // Configurações do servidor SMTP
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "contas@bmouseproductions.com",
        pass: "knvwhsvlydkuriuc",
      },
    });

    // Corpo do e-mail
    let info = await transporter.sendMail({
      from: "contas@bmouseproductions.com",
      to: ["benolopesdias@gmail.com"],
      subject: "Nova candidatura no formulário de Trabalhe Conosco",
      html: `<p>Nome: ${nome}</p>
               <p>Telefone: ${telefone}</p>
               <p>Instagram: ${instagram}</p>
               <p>E-mail: ${email}</p>`,
      attachments: [
        {
          filename: curriculoName,
          content: curriculoFile.buffer,
        },
      ],
    });

    console.log("E-mail enviado: %s", info.messageId);
  } catch (err) {
    console.error(err);
  }
}

app.post("/send-email", upload.single("curriculoFile"), async (req, res) => {
  const { nome, telefone, email, instagram, curriculoName } = req.body;
  const curriculoFile = req.file;

  try {
    if (!curriculoFile) {
      throw new Error("Arquivo não encontrado");
    }

    await enviarEmailBackend(
      nome,
      telefone,
      email,
      instagram,
      curriculoFile,
      curriculoFile.originalname
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ msg: "E-mail enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
