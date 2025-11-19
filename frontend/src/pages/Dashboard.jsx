import react, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Flame, FireExtinguisher, Shield } from "lucide-react";
import ServiceCard from "../components/common/cards/ServiceCard";
import HeroSection from "../components/layout/HeroSection";

const logoUrl = new URL("../../assets/Marco_main.jpg", import.meta.url).href;

export default function Main() {
  const paragraphs = [
    "Mit über 25 Jahren Erfahrung reinige ich zuverlässig alle Feuerungen: Holz-, Pellets-, Hackschnitzel-, Öl- und Gasheizungen – egal ob Zentral- oder Einzelraumfeuerungen.",
    "Durch eine fachgerechte Reinigung sorge ich für den optimalen Unterhalt Ihrer Anlage. Ein sauberes System verbessert den Brandschutz, verhindert Kaminbrände und stellt eine sichere Abgasführung sicher. Zudem reduziert eine regelmäßige Wartung Störungen und senkt den Verbrauch durch eine bessere Wärmeübertragung.",
    "Auch kleinere Reparaturen wie der Austausch von Schamottsteinen oder Dichtungen übernehme ich zuverlässig. Zusätzlich biete ich Ofenscheibenreiniger und verschiedene Ofenventilatoren an – und berate Sie gerne persönlich.",
    "Mit meiner Arbeit gewährleiste ich Brandschutz, Sicherheit und Umweltschutz – und helfe Ihnen gleichzeitig, langfristig Kosten zu sparen.",
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

      <main className=" ">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-homeBG bg-no-repeat bg-center bg-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 text-center">
            <HeroSection />
          </div>
        </section>

        <div className="flex justify-center mt-24 ">
          <div className="flex flex-col md:flex-row lg:space-x-24 md:space-x-16">
            <motion.img
              src={logoUrl}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg h-auto p-4 sm:p-6 md:p-8 lg:p-0 rounded-md shadow-md object-contain"
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
          <h2 className="text-4xl font-bold text-center mb-12">
            Meine Dienstleistungen
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
            {[
              {
                title: "Kaminfeger-Arbeiten",
                icon: Flame,
                points: [
                  "Reinigung von Öfen & Heizungen",
                  "Reparatur von Schamottstein, Dichtungen, Glas",
                  "Beratung & Modernisierung (z. B. Heizkassette)",
                  "Verkauf stromloser Ofenventilatoren",
                ],
              },
              {
                title: "Feuerungskontrollen",
                icon: FireExtinguisher,
                points: [
                  "Kontrolle von Öl-, Gas- & Holzfeuerungen",
                  "Emissionsmessung zur Umwelt- & Kostenreduktion",
                ],
              },
              {
                title: "Brandschutz",
                icon: Shield,
                points: [
                  "Verkauf von Feuerlöschern, Löschdecken & Rauchmeldern",
                  "Hilfe bei Auswahl & Platzierung des Löschmittels",
                ],
              },
            ].map((service, i) => (
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

          <h3 className="text-center text-2xl font-semibold mt-20 mb-4">
            Persönlich, Professionell, Zuverlässig
          </h3>
          <p className="text-lg text-center leading-relaxed max-w-4xl mx-auto">
            Als erfahrener Kaminfeger arbeite ich mit Leidenschaft für Ihre
            Sicherheit. Ob Kontrolle, Reinigung oder Beratung – ich bin für Sie
            da. Kontaktieren Sie mich für eine unverbindliche Offerte.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {[
              {
                title: "Feuerlöscher",
                icon: FireExtinguisher,
                id: "produkte",
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
              },
            ].map((service, i) => (
              <Link to={`/${service.id}`} key={service.title}>
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
