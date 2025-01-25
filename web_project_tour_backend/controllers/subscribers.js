const mongoose = require('mongoose');
const CustomError = require('../utils/customError');
const { Subscriber } = require('../models/subscribers');

const signup = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(200).send({ message: 'Você já está inscrito!' });
    }

    // Salva o e-mail no banco de dados
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // // Envia e-mail de confirmação
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Assinatura da Newsletter',
    //   text: 'Obrigado por se inscrever em nossa newsletter!',
    // };

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     return next(
    //       new CustomError('Erro ao enviar o e-mail de confirmação', 500)
    //     );
    //   }
    // });

    res
      .status(200)
      .send({ message: 'Inscrição na newsletter realizada com sucesso!' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
};
