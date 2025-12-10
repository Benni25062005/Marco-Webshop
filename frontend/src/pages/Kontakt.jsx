import React, { useEffect, useState } from "react";
import Turnstile from "react-turnstile";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Main() {
  const [user, setUser] = useState({
    vorname: "",
    nachname: "",
    email: "",
    nachricht: "",
  });
  const [cfToken, setCfToken] = useState("");
  const [sending, setSending] = useState(false);
  const [tsKey, setTsKey] = useState(0);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  const canSend =
    !!cfToken &&
    !!user.vorname &&
    !!user.nachname &&
    !!user.email &&
    !!user.nachricht;

  async function handleSubmit(e) {
    e.preventDefault?.();
    if (!canSend) return;

    setSending(true);
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, cf_token: cfToken }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      setUser({
        vorname: "",
        nachname: "",
        email: "",
        nachricht: "",
      });
      setCfToken("");
      setTsKey((k) => k + 1);
      toast.success("Nachricht gesendet");
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Senden der Nachricht");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Kontakt | Kaminfeger Knapp in Buchs | Termin anfragen</title>
        <meta
          name="description"
          content="Kontakt zu Kaminfeger Knapp in Buchs: Telefon, E-Mail und Kontaktformular für Terminvereinbarungen, Offerten und Fragen rund um Brandschutz und Feuerung."
        />
      </Helmet>

      <main>
        <div className="mt-8">
          <div className="flex justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium ">
              Kontakt
            </h1>
          </div>

          <div className="flex flex-col p-4 justify-center lg:flex-row items-center lg:justify-center lg:items-start mt-16 gap-16">
            {/*Kontaktinformationen*/}
            <div className="max-w-md w-full">
              <p className="text-xl sm:text-2xl font-medium">
                Kaminfegermeister Marco Knapp
              </p>
              <p className="font-medium mt-8">Adresse</p>
              <p>Kaminfegergeschäft Knapp Marco</p>
              <p>Schützenhausweg 8</p>
              <p>9470 Buchs</p>

              <p className="font-medium mt-6">Telefon</p>
              <p>Natel +41 79 814 81 32</p>

              <p className="font-medium mt-6">Email</p>
              <p>kaminfeger-knapp@gmx.ch</p>
            </div>

            {/*Kontaktformular*/}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full max-w-lg space-y-4 ml-0 lg:ml-16"
            >
              <h1 className="text-xl sm:text-2xl font-medium mb-4">
                Schicken Sie uns eine E-mail
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 ">
                <input
                  onChange={handleInputChange}
                  name="vorname"
                  value={user.vorname}
                  className="ProfileInputyStyle"
                  placeholder="Vorname"
                  type="text"
                  id="vn"
                ></input>
                <input
                  onChange={handleInputChange}
                  name="nachname"
                  value={user.nachname}
                  className="ProfileInputyStyle"
                  placeholder="Nachname"
                  type="text"
                  id="nn"
                ></input>
              </div>

              <input
                onChange={handleInputChange}
                value={user.email}
                name="email"
                className="ProfileInputyStyle"
                placeholder="Email"
                type="email"
                id="email"
              ></input>

              <textarea
                onChange={handleInputChange}
                value={user.nachricht}
                name="nachricht"
                className="ProfileInputyStyle"
                id="nachricht"
                placeholder="Hinterlassen Sie hier Ihre E-mail"
              ></textarea>

              <div className="mt-2">
                <Turnstile
                  key={tsKey}
                  sitekey={process.env.TURNSTILE_SITE_KEY}
                  onVerify={(token) => setCfToken(token)}
                  onExpire={() => setCfToken("")}
                  onError={() => setCfToken("")}
                  options={{ theme: "light" }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={!canSend || sending}
                className={`w-full mt-4 ${
                  !canSend || sending ? "opacity-50 cursor-not-allowed" : ""
                } bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md`}
                initial={{ opacity: 0, y: 0 }}
                whileHover={{ scale: 1.02 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {sending ? "Senden..." : "Senden"}
              </motion.button>
            </form>
          </div>

          {/*Map*/}
          <div className="mt-16 flex justify-center ">
            <iframe
              className="max-w-3xl rounded-md shadow-md"
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=Sch%C3%BCtzenhausweg%208%209470%20Buchs+(Kaminfegermeister%20Marco%20Knapp)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            >
              <a href="https://www.gps.ie/collections/drones/">buy drones</a>
            </iframe>
          </div>
        </div>
      </main>
    </>
  );
}
