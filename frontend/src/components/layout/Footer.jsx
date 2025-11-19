import React from "react";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <footer className="bg-white border-t mt-24">
      <div className="flex flex-col  mx-auto items-center max-w-[95rem] px-4 py-12">
        <div className="justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-44 xl:gap-56">
          {/* Adresse */}
          <address className="not-italic">
            <p className="font-semibold text-gray-900">Adresse</p>
            <p>Kaminfegergeschäft Knapp Marco</p>
            <p>Schützenhausweg 8</p>
            <p>9470 Buchs</p>
            {/* map link optional */}
            <a
              href="https://maps.google.com/?q=Schützenhausweg+8+9470+Buchs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline mt-2 inline-block"
            >
              Auf Karte anzeigen
            </a>
          </address>

          {/* Kontakt */}
          <div>
            <p className="font-semibold text-gray-900">Kontakt</p>
            <p>
              Telefon:{" "}
              <a href="tel:+41798148132" className="underline">
                +41 79 814 81 32
              </a>
            </p>
            <p className="mt-1">
              E-Mail:{" "}
              <a href="mailto:kaminfeger-knapp@gmx.ch" className="underline">
                kaminfeger-knapp@gmx.ch
              </a>
            </p>
          </div>

          {/* Rechtliches */}
          <nav className="flex flex-col">
            <p className="font-semibold text-gray-900">Rechtliches</p>
            <Link to="/impressum" className="underline mt-1">
              Impressum
            </Link>
            <Link to="/datenschutz" className="underline mt-1">
              Datenschutz
            </Link>
            <Link to="/agb" className="underline mt-1">
              AGB
            </Link>
            <Link to="/kontakt" className="underline mt-1">
              Kontakt
            </Link>
          </nav>
        </div>

        <div className="w-full justify-between border-t mt-10 pt-6 flex flex-col sm:flex-row  gap-4 text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Kaminfegergeschäft Knapp Marco. Alle
            Rechte vorbehalten.
          </p>
          <p className=" text-gray-500">CH • Buchs SG</p>
        </div>
      </div>
    </footer>
  );
}
