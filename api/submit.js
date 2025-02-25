// api/submit.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Lidar com requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    // Obter dados do formulário
    const data = req.body;

    // Validar campos obrigatórios
    const requiredFields = ['nome', 'email', 'whatsapp', 'idade', 'experiencia', 'inicio'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Campo obrigatório não preenchido: ${field}` 
        });
      }
    }

    // Configurar transporte de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Ou outro serviço de email
      auth: {
        user: process.env.EMAIL_USER,  // Configure estas variáveis no Vercel
        pass: process.env.EMAIL_PASS    // Senha de app ou senha normal
      }
    });

    // Preparar conteúdo do email
    const mailOptions = {
      from: `"Formulário Site Personal" <${process.env.EMAIL_USER}>`,
      to: 'lucianopaiva2.lpb@gmail.com',
      subject: 'Nova Inscrição - Personal Trainer',
      text: `
        Nova inscrição recebida:
        
        Nome: ${data.nome}
        Idade: ${data.idade}
        Email: ${data.email}
        WhatsApp: ${data.whatsapp}
        Instagram: ${data.instagram || 'Não informado'}
        Experiência: ${data.experiencia}
        Previsão de início: ${data.inicio}
      `,
      html: `
        <h2>Nova inscrição recebida</h2>
        <p><strong>Nome:</strong> ${data.nome}</p>
        <p><strong>Idade:</strong> ${data.idade}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Instagram:</strong> ${data.instagram || 'Não informado'}</p>
        <p><strong>Experiência:</strong> ${data.experiencia}</p>
        <p><strong>Previsão de início:</strong> ${data.inicio}</p>
      `
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    // Retornar sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Formulário enviado com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao enviar o formulário. Por favor, tente novamente.' 
    });
  }
}
