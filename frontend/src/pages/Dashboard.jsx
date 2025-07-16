import react from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Flame, FireExtinguisher, Shield } from "lucide-react";
import marco from "../../assets/Marco_main.jpg";
import ServiceCard from "../components/common/cards/ServiceCard";
import HeroSection from "../components/layout/HeroSection";

const logoUrl = new URL("../../assets/Marco_main.jpg", import.meta.url).href;

export default function Main() {
 
  const paragraphs = [
    "Mit über 25 Jahren Erfahrung reinigen wir zuverlässig alle Feuerungen: Holz, Pellets, Hackschnitzel, Öl- und Gasheizungen – ob Zentral- oder Einzelraumfeuerungen.",
    "Durch eine fachgerechte Reinigung sorgen wir für den optimalen Unterhalt Ihrer Anlage. Ein sauberes System verbessert den Brandschutz, verhindert Kaminbrände und sichert die Abgasführung. Zudem reduziert eine regelmäßige Wartung Störungen und senkt den Verbrauch durch bessere Wärmeübertragung.",
    "Auch kleinere Reparaturen wie der Austausch von Schamottsteinen oder Dichtungen übernehmen wir gerne. Zudem bieten wir Ofenscheibenreiniger und verschiedene Ofenventilatoren an – wir beraten Sie gerne!",
    "Mit unserer Arbeit gewährleisten wir Brandschutz, Sicherheit und Umweltschutz – und helfen Ihnen dabei, Kosten zu sparen.",
  ];


  return (
    <>

      <Helmet>
        <title>Kaminfeger & Feuerungskontrollen in Buchs | Marco Knapp</title>
        <meta
          name="description"
          content="Ihr zuverlässiger Kaminfeger in Buchs. Reinigung, Feuerungskontrollen und Brandschutz - mit über 25 Jahren Erfahrung. Jetzt Kontakt aufnehmen!"
        />
      </Helmet>

      <main>
        <div className="bg-gradient-to-b from-[#fff] to-[#f6f6f6] w-full">
          <div className="max-w-screen-xl mx-auto px-4 py-28 text-center">
            <HeroSection />
          </div>
        </div>


        <div className="flex justify-center mt-24 ">
          <div className="flex flex-col md:flex-row lg:space-x-24 md:space-x-16">

            <motion.img 
              src={logoUrl} 
              initial={{ opacity: 0, scale: 0.95}}
              whileInView={{ opacity: 1, scale: 1}}
              transition={{ duration: 0.6}}
              viewport={{ once: true}}
              className="w-auto max-w-full lg:h-[38em] md:h-[32em] sm:h-[26em] h-[16em] p-4 sm:p-6 md:p-8 lg:p-0 rounded-md shadow-md"
            />
            
            <div className="flex flex-col max-w-2xl md:max-w-2xl mx-auto space-y-2 md:space-y-4 p-4 sm:p-6 md:p-8 ">

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="lg:text-4xl md:text-2xl sm:text-xl  font-bold"
              >
                Der Kaminfeger - Ihr Feuerungsfachmann
              </motion.h2>
              
              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * (i + 1) }}
                  viewport={{ once: true }}
                  className={`text-base sm:text-lg md:text-xl leading-relaxed text-justify sm:text-left ${
                    i === 3 ? "font-semibold" : ""
                  }`}
                >
                  {text}
                </motion.p>
              ))}

            </div>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 py-16 mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">Unsere Dienstleistungen</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
            {[{
              title: "Kaminfeger-Arbeiten",
              icon: Flame,
              points: [
                "Reinigung von Öfen & Heizungen",
                "Reparatur von Schamottstein, Dichtungen, Glas",
                "Beratung & Modernisierung (z. B. Heizkassette)",
                "Verkauf stromloser Ofenventilatoren"
              ]
            },
            {
              title: "Feuerungskontrollen",
              icon: FireExtinguisher,
              points: [
                "Kontrolle von Öl-, Gas- & Holzfeuerungen",
                "Emissionsmessung zur Umwelt- & Kostenreduktion"
              ]
            },
            {
              title: "Brandschutz",
              icon: Shield,
              points: [
                "Verkauf von Feuerlöschern, Löschdecken & Rauchmeldern",
                "Hilfe bei Auswahl & Platzierung des Löschmittels"
              ]
            }].map((service, i) => (
              <ServiceCard delay={i * 0.2} key={service.title}>
                <div className="flex items-center gap-3 mb-4">
                  <service.icon className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700 text-base leading-relaxed">
                  {service.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </ServiceCard>
            ))}
          </div>

          <h3 className="text-center text-2xl font-semibold mt-20 mb-4">Persönlich, Professionell, Zuverlässig</h3>
          <p className="text-lg text-center leading-relaxed max-w-4xl mx-auto">
            Als erfahrener Kaminfeger arbeite ich mit Leidenschaft für Ihre Sicherheit.
            Ob Kontrolle, Reinigung oder Beratung – ich bin für Sie da. Kontaktieren Sie mich für eine unverbindliche Offerte.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {[{
              title: "Feuerlöscher",
              icon: FireExtinguisher,
              id: "feuerloescher",
              
            },
            {
              title: "Kontakt",
              icon: Shield,
              id: "kontakt",
            },
            {
              title: "Brandschutz",
              icon: Flame,
              id: "brandschutz",
            },
            {
              title: "Feuerungskontrollen",
              icon: Flame,
              id: "feuerungskontrollen",
            }].map((service, i) => (
              <Link to={`/${service.id}`} key={service.title} >
                <ServiceCard delay={i * 0.2}>
                  <div className="flex items-center justify-center gap-3 cursor-pointer">
                    <h3 className="text-lg">{service.title}</h3>
                    <service.icon className="w-12 h-12 text-red-600" />
                  </div>
                </ServiceCard>
                
              </Link>
              
            ))}
          </div>

          
        </section>

      </main>
    </>
  );
}
