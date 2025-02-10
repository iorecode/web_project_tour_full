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
