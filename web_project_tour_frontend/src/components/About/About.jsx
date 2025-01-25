import { useNavigate } from "react-router-dom";
import "./About.css";
import { useState } from "react";

export default function About() {
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const aboutParagraph = `Fundada com o objetivo de oferecer experiências de viagem inesquecíveis, a
        nossa agência se destaca por proporcionar pacotes personalizados para cada
        perfil de viajante. Acreditamos que viajar vai além de conhecer novos
        lugares; trata-se de vivenciar culturas, criar memórias e conectar-se com o
        mundo de maneira única.\n
        Com anos de experiência no setor, trabalhamos com parceiros de confiança
        para garantir a melhor qualidade em cada detalhe de sua jornada, desde a
        escolha do destino até a estadia. Nosso time de especialistas está sempre à
        disposição para auxiliar na criação de roteiros que atendam às suas
        expectativas e proporcionem momentos inesquecíveis.\n
        Seja uma viagem de lazer, aventura ou relaxamento, estamos comprometidos em transformar os seus sonhos em realidade.\n
        Foto do Header de Marek Piwnicki`;

  const aboutHeading = isHoveringHeader ? "Retornar" : "Sobre Nós";
  const navigate = useNavigate();

  const handleHeaderClick = () => {
    navigate('/');
  };

  const handleMouseEnter = () => setIsHoveringHeader(true);
  const handleMouseLeave = () => setIsHoveringHeader(false);

  return (
    <section className="about">
      <h3
        onClick={handleHeaderClick}
        className="about__heading"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {aboutHeading}
      </h3>
      <p className="about__paragraph">{aboutParagraph}</p>
      <p className="about__heading">Nos Contate</p>
      <p className="about__paragraph">
        Whatsapp: +55 99 9999-9999 <br />
        Email: bigemail@fake.com
      </p>
    </section>
  );
}
