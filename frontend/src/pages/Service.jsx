import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const loeschposten = new URL("../../assets/Loeschposten.jpg", import.meta.url)
  .href;
const feuerloescher = new URL("../../assets/feuerloescher.jpg", import.meta.url)
  .href;

export default function Service() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Helmet>
        <title>
          Kamin- & Heizungsservice | Reinigung & Wartung | Marco Knapp
        </title>
        <meta
          name="description"
          content="Gründliche Kaminreinigung, Heizungsservice und regelmäßige Wartung durch Kaminfeger Knapp. Mehr Sicherheit, weniger Störungen und optimale Energieausnutzung."
        />
      </Helmet>

      {/* Leistungen & Preise */}
      <section className="mb-16">
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Leistungen & Preise
        </h2>

        <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
          <div className="">
            <img src={feuerloescher} />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
              Feuerlöscher Service & Verkauf
            </div>
            <h3 className="mt-3 text-lg font-semibold">Feuerlöscher-Service</h3>
            <ul className="mt-3 space-y-1 text-gray-700">
              <li>
                Service <span className="font-semibold">ab 68.– CHF</span>
              </li>
              <li>
                ab 3 Feuerlöscher:{" "}
                <span className="font-semibold">60.– CHF</span>
              </li>
              <li className="text-sm text-gray-600">
                exkl. Dichtungen, Ersatzlöschmittel und Anfahrt
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-700">
              <span className="font-medium">Keine Anfahrtspauschale</span>, wenn
              der Service mit dem
              <span className="font-medium"> Kaminfegerdienst</span> kombiniert
              wird.
            </p>
            <p className="mt-3 text-sm text-gray-700">
              Ich verkaufe{" "}
              <span className="font-medium">nur Schaumlöscher</span>, die ohne
              umweltschädliche PFAS-Fluorverbindungen auskommen – wichtig im
              Hinblick auf das bevorstehende EU-weite Fluorverbot.
            </p>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-red-200 to-transparent" />

        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
              Wartung Löschposten
            </div>
            <h3 className="mt-3 text-lg font-semibold">Löschposten-Service</h3>
            <ul className="mt-3 space-y-1 text-gray-700">
              <li>
                Service <span className="font-semibold">ab 68.– CHF</span>
              </li>
              <li>
                ab 3 Löschposten:{" "}
                <span className="font-semibold">60.– CHF</span>
              </li>
              <li className="text-sm text-gray-600">
                exkl. Dichtungen, Ersatzmaterial und Anfahrt
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-700">
              <span className="font-medium">Keine Anfahrtspauschale</span>, wenn
              der Service mit dem
              <span className="font-medium"> Kaminfegerdienst</span> zusammen
              gemacht wird.
            </p>

            <div className="mt-4">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Termin & Angebot anfragen <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="">
            <img src={loeschposten} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Service & Wartung – Feuerlöscher
        </h1>
        <p className="mt-3 text-gray-600">
          Professioneller Brandschutz für Ihre Liegenschaft: Bereitstellung,
          Installation und regelmäßige Wartung von Feuerlöschern gemäß
          Vorschriften.
        </p>
      </section>

      {/* Leistungen */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold">Meine Leistungen</h2>
        <ul className="mt-4 space-y-3">
          {[
            "Bereitstellung und Installation passender Feuerlöscher (Typ & Größe nach Bedarf)",
            "Wartung & Prüfung durch zertifizierte Fachkräfte in den vorgeschriebenen Intervallen",
            "Austausch und fachgerechte Entsorgung alter oder defekter Geräte",
            "Beratung zur optimalen Auswahl und Platzierung in Ihren Objekten",
          ].map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-red-500" />
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Service-Pauschalen */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold">
          Service-Pauschalen Feuerlöscher
        </h2>
        <div className="mt-4 space-y-4 text-gray-700">
          <p>
            Um Anfahrtskosten zu reduzieren, kombiniere ich Termine für den
            <span className="font-medium"> Feuerlöscher-Service</span> wenn
            möglich mit meinen
            <span className="font-medium"> Kaminfeger-Arbeiten</span> in Ihrer
            Liegenschaft.
          </p>

          <p>
            Nach einer <span className="font-medium">Erstbesichtigung</span>{" "}
            erhalten Sie ein maßgeschneidertes Angebot mit transparenten
            Pauschalen.
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <span className="font-medium">Nicht enthalten:</span> Ersatzteile
              und das Erneuern der Löschmittel.
            </li>
            <li>
              <span className="font-medium">Hinweis Löschmittel:</span> je nach
              Hersteller vorgeschriebener Austausch alle{" "}
              <span className="whitespace-nowrap">6–9 Jahre</span>.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold">So läuft’s ab</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Besichtigung",
              text: "Kurztermin vor Ort für Bestandsaufnahme.",
            },
            {
              step: "2",
              title: "Angebot",
              text: "Individuelles, transparentes Service-Paket.",
            },
            {
              step: "3",
              title: "Service",
              text: "Wartung/Prüfung gemäß Norm – dokumentiert.",
            },
          ].map((s) => (
            <li
              key={s.step}
              className="group rounded-2xl border border-red-200 bg-white p-4 transition hover:shadow-sm"
            >
              <div className="text-sm font-medium text-red-600">
                Schritt {s.step}
              </div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-gray-600">{s.text}</p>
              <div className="mt-3 h-1 w-10 rounded-full bg-red-100 transition group-hover:bg-red-500" />
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
