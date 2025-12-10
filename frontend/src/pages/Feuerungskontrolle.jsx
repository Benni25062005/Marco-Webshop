import React from "react";
import { Thermometer, Leaf, FileText, Flame } from "lucide-react";
import BrandschutzCard from "../components/common/cards/BrandschutzCard";
import { Link } from "react-router-dom";

const imageUrl = new URL("../../assets/Marco_Bild.jpeg", import.meta.url).href;

export default function Main() {
  return (
    <>
      <Helmet>
        <title>
          Feuerungskontrolle & Emissionsmessung | Kaminfeger Knapp Buchs
        </title>
        <meta
          name="description"
          content="Amtliche Feuerungskontrollen für Öl-, Gas- und Holzfeuerungen. Fachgerechte Messung, Dokumentation und Beratung für effiziente und sichere Heizungen."
        />
      </Helmet>

      <main>
        {/* Hero + Einleitung */}
        <div className="flex justify-center mt-24">
          <div className="flex flex-col md:flex-row lg:space-x-24 md:space-x-16">
            <img
              src={imageUrl}
              className="w-auto max-w-full h-auto lg:h-[38em] md:h-[32em] sm:h-[26em] h-[16em] p-4 sm:p-6 md:p-8 lg:p-0 rounded-md shadow-md"
              alt="Feuerungskontrolle"
            />

            <div className="flex flex-col max-w-2xl mx-auto space-y-4 p-4 sm:p-6 md:p-8">
              <h2 className="lg:text-4xl md:text-2xl sm:text-xl font-bold">
                Feuerungskontrolle – Verantwortung für Umwelt und Technik
              </h2>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-left sm:text-left ">
                Als Feuerungskontrolleur prüfe ich Heizungsanlagen – darunter
                Holz-, Öl- und Gasfeuerungen – auf deren Abgaswerte,
                Energieeffizienz und technischen Zustand. Die Kontrollen
                erfolgen mit moderner Messtechnik.
              </p>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-left">
                Gemessen werden unter anderem Sauerstoffgehalt, CO₂-Emissionen,
                Rauchgastemperatur und Stickoxidwerte. Die Resultate vergleiche
                ich mit den gesetzlich definierten Grenzwerten der
                Luftreinhalteverordnung (LRV).
              </p>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-left">
                Ziel ist eine saubere, effiziente und gesetzeskonforme
                Heizungsanlage – gut für Umwelt, Geldbeutel und Nachbarschaft.
              </p>

              <p className="text-base font-semibold sm:text-lg md:text-xl leading-relaxed text-gray-900">
                Feuerungskontrolle, die wirkt – für Effizienz, Luftqualität und
                klare Vorschriften.
              </p>
            </div>
          </div>
        </div>

        {/* Leistungen */}
        <section className="max-w-6xl mx-auto px-4 py-20 mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Was ich konkret für Sie tue
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Abgasmessung & Effizienzkontrolle",
                icon: Thermometer,
                points: [
                  "CO₂, O₂, NOx, Rauchgastemperatur, Kesselwerte",
                  "Bewertung gemäß LRV-Richtlinien",
                ],
              },
              {
                title: "Beratung bei Handlungsbedarf",
                icon: Leaf,
                points: [
                  "Service-Empfehlungen zur Senkung der Werte",
                  "Sanierungsfrist bei gesetzlichen Abweichungen",
                ],
              },
              {
                title: "Dokumentation & Behördenmeldung",
                icon: FileText,
                points: [
                  "Berichte, Fristsetzung, offizielle Meldungen",
                  "Transparenz gegenüber Eigentümer:innen & Behörden",
                ],
              },
            ].map((service, i) => (
              <BrandschutzCard
                delay={i * 0.2}
                key={service.title}
                className={i % 2 === 0 ? "bg-red-50" : "bg-white"}
              >
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

        {/* Holzfeuerungskontrolle */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Holzfeuerungskontrolle – natürlich, aber nicht harmlos
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Auch Holzfeuerungen unterliegen der Luftreinhalteverordnung. Bei
              Anlagen bis 70 kW erfolgt eine Sichtkontrolle der Anlage, Asche
              und des Brennstofflagers. Wichtig: Nur naturbelassenes, gut
              getrocknetes Holz darf verbrannt werden.
            </p>

            <p className="text-sm text-red-800 mb-4">
              Abfallverbrennung (z. B. lackiertes oder behandeltes Holz) ist
              gesetzlich verboten und wird bei Verdacht überprüft.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://www.fairfeuern.ch/index.php?id=9"
                target="_blank"
                rel="noreferrer"
                className="text-red-600 underline hover:text-red-800"
              >
                🔗 Fair feuern Schweiz
              </a>
              <a
                href="https://www.fedlex.admin.ch/eli/cc/1986/208_208_208/de"
                target="_blank"
                rel="noreferrer"
                className="text-red-600 underline hover:text-red-800"
              >
                🔗 Luftreinhalteverordnung (LRV)
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Jetzt Kontrolle vereinbaren und Emissionen reduzieren.
          </h3>
          <Link to="/kontakt">
            <button className="bg-red-600 text-white text-base font-medium px-6 py-3 rounded-xl hover:bg-red-700 transition">
              Feuerungskontrolle anfragen
            </button>
          </Link>
        </section>
      </main>
    </>
  );
}
