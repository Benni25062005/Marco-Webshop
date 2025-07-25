import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { motion } from "framer-motion";
import "react-phone-input-2/lib/style.css";

export default function Main() {
  const [phone, setPhone] = useState("");

  return (
    <>
      <main>
        <div className="mt-8">
          <div className="flex justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium ">
              Kontakt
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-start mt-16 gap-16">
            {/*Kontaktinformationen*/}
            <div className="max-w-md ">
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
            <div className="flex flex-col max-w-lg space-y-4 ml-64">
              <h1 className="text-xl sm:text-2xl font-medium mb-4">
                Schicken Sie uns eine E-mail
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 ">
                <input
                  className="ProfileInputyStyle"
                  placeholder="Vorname"
                  type="text"
                  id="vn"
                ></input>
                <input
                  className="ProfileInputyStyle"
                  placeholder="Nachname"
                  type="text"
                  id="nn"
                ></input>
              </div>

              <input
                className="ProfileInputyStyle"
                placeholder="Email"
                type="email"
                id="email"
              ></input>

              <textarea
                className="ProfileInputyStyle"
                id="nachricht"
                placeholder="Hinterlassen Sie hier Ihre E-mail"
              ></textarea>

              <div className="w-full">
                <PhoneInput
                  country={"ch"}
                  onlyCountries={["ch", "at", "de"]}
                  preferredCountries={["ch"]}
                  value={phone} //die gesamte telefonnummer kann ich mit der variable "phone" aufrufen!
                  onChange={setPhone}
                  inputClass="!border-0"
                  dropdownClass="!bg-white !shadow-md !border !border-gray-300"
                  containerClass="!border-2 !rounded-md !shadow-sm focus:!border-bgorange focus:!ring-bgorange focus:!outline-none w-full"
                />
              </div>

              <motion.button
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md self-center"
                initial={{ opacity: 0, y: 0 }}
                whileHover={{ scale: 1.02 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Senden
              </motion.button>
            </div>
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
