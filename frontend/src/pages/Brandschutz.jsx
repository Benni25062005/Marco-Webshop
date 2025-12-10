import React from "react";
import { MapPin, PackageCheck, Wrench } from "lucide-react";
import BrandschutzCard from "../components/common/cards/BrandschutzCard";
import { Link } from "react-router-dom";

const logoUrl = new URL("../../assets/Bild_Brandschutz.jpg", import.meta.url)
  .href;

export default function Main() {
  return (
    <>
      <Helmet>
        <title>
          Professioneller Brandschutz für Ihr Gebäude | Kaminfeger Knapp
        </title>
        <meta
          name="description"
          content="Individuelle Brandschutzlösungen: Beratung, Planung und Umsetzung von Schutzkonzepten, Löschgeräten und Wartung. Sicherheit für Wohn- und Geschäftsbauten."
        />
      </Helmet>

      <main>
        <div className="flex justify-center mt-24">
          <div className="flex flex-col md:flex-row lg:space-x-24 md:space-x-16">
            <img
              src={logoUrl}
              className="w-auto max-w-full h-auto lg:h-[38em] md:h-[32em] sm:h-[26em] h-[16em] p-4 sm:p-6 md:p-8 lg:p-0 rounded-md shadow-md"
            ></img>

            <div className="flex flex-col max-w-2xl md:max-w-2xl mx-auto space-y-2 md:space-y-4 p-4 sm:p-6 md:p-8">
              <h2 className="lg:text-4xl md:text-2xl sm:text-xl font-bold">
                Brandschutz - Beratung, Produkte & Service
              </h2>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-justify sm:text-left ">
                Als Kaminfeger ist Brandschutz seit jeher Teil meiner täglichen
                Arbeit. Ab sofort biete ich zusätzlich professionelle Beratung,
                Verkauf und Wartung von Feuerlöschern, Löschdecken und
                Rauchmeldern an – alles aus einer Hand.
              </p>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-justify sm:text-left">
                Ich setze auf fluorfreie Feuerlöscher ohne PFAS –
                umweltfreundlich und zukunftssicher, denn in der EU sind diese
                Stoffe bereits verboten.
              </p>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-justify sm:text-left">
                Gerne besichtige ich Ihre Liegenschaft in der Region Buchs SG
                und berate Sie zu geeigneten Löschmitteln und deren optimaler
                Platzierung. Auch die Wartung Ihrer Feuerlöscher übernehme ich –
                empfohlen alle drei Jahre.
              </p>

              <p className="text-base font-semibold sm:text-lg md:text-xl leading-relaxed text-justify sm:text-left">
                Brandschutz, der schützt – für Ihre Sicherheit, die Umwelt und
                klare Vorschriften.
              </p>
            </div>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 py-16 mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Meine Leistungen im Überblick
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Beratung vor Ort",
                icon: MapPin,
                points: [
                  "Individuelle Beurteilung Ihrer Liegenschaft inkl. Platzierung und Wahl des richtigen Löschmittels.",
                ],
              },
              {
                title: "Verkauf & Lieferung",
                icon: PackageCheck,
                points: [
                  "Fluorfreie Feuerlöscher, Rauchmelder und Löschdecken – direkt zu Ihnen geliefert.",
                ],
              },
              {
                title: "Wartung",
                icon: Wrench,
                points: [
                  "Pflichtgemässe Kontrolle und Instandhaltung alle drei Jahre – schnell und unkompliziert.",
                ],
              },
            ].map((service, i) => (
              <BrandschutzCard delay={i * 0.2} key={service.title}>
                <div className="flex items-center gap-3 mb-4">
                  <service.icon className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700 text-base leading-relaxed">
                  {service.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </BrandschutzCard>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Brandschutz vom Profi – kompetent, umweltbewusst, regional
          </h2>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Als Kaminfeger ist Brandschutz ein fester Bestandteil meiner Arbeit.
            Ab sofort biete ich umfassende Dienstleistungen in diesem Bereich
            an: individuelle Beratung, Verkauf von Feuerlöschern, Löschdecken
            und Rauchmeldern – sowie deren Wartung.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
            <p className="text-sm text-red-800">
              Die von mir angebotenen fluorfreien Feuerlöscher enthalten kein
              PFAS. Diese sogenannten „ewigen Chemikalien“ sind in der EU seit
              2024 verboten – auch in der Schweiz ist ein Verbot absehbar.
            </p>
          </div>

          <p className="text-base text-gray-700 mb-6">
            Gerne besichtige ich Ihre Liegenschaft in der Region Buchs SG und
            berate Sie zur optimalen Auswahl und Platzierung der Löschmittel.
            Auch die empfohlene Wartung alle drei Jahre übernehme ich
            zuverlässig.
          </p>

          <Link to="/kontakt">
            <button className="bg-red-600 text-white text-base font-medium px-6 py-3 rounded-xl hover:bg-red-700 transition">
              Jetzt Angebot anfordern
            </button>
          </Link>
        </section>
      </main>
    </>
  );
}
