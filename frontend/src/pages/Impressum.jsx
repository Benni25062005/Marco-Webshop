import React from "react";
import { Helmet } from "react-helmet";

export default function Impressum() {
  return (
    <>
      <Helmet>
        <title>Impressum | Kaminfeger Knapp Buchs</title>
        <meta
          name="description"
          content="Impressum von Kaminfeger Knapp: gesetzlich vorgeschriebene Anbieterkennzeichnung mit Firmenangaben, Kontaktinformationen und Verantwortlichkeiten."
        />
      </Helmet>

      <div className="p-8 max-w-3xl mx-auto text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Impressum</h1>

        <div className="space-y-4">
          <p>
            <strong>Marco Knapp</strong>
          </p>
          <p>
            Schützenhausweg 8 <br />
            9470 Buchs <br />
            Schweiz
          </p>

          <p>
            <strong>Kontakt:</strong>
            <br />
            Telefon: +41 79 814 81 32 <br />
            E-Mail:{" "}
            <a
              href="mailto:kaminfeger-knapp@gmx.ch"
              className="text-blue-600 underline"
            >
              kaminfeger-knapp@gmx.ch
            </a>
          </p>

          <p>
            <strong>Umsatzsteuer-Identifikationsnummer:</strong>
            <br />
            CH-MWST: 1234
          </p>

          <h2 className="text-xl font-semibold mt-8">Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für
            die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird
            jedoch keine Gewähr übernommen.
          </p>

          <h2 className="text-xl font-semibold mt-6">Haftung für Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter, auf deren
            Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten
            ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
          </p>

          <h2 className="text-xl font-semibold mt-6">Urheberrecht</h2>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
            dieser Website unterliegen dem schweizerischen Urheberrecht. Die
            Vervielfältigung, Bearbeitung oder Verbreitung außerhalb der Grenzen
            des Urheberrechts bedarf der schriftlichen Zustimmung des Autors.
          </p>
        </div>
      </div>
    </>
  );
}
