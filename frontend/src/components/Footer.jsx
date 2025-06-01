import React from "react";

export default function Main(){

    return(<>
    
    <footer className="flex justify-center space-x-24 border-t mt-36 mb-12 pt-12">

        <div className="">
            <p className="font-medium">Adresse</p>
            <p>Kaminfegergeschäft Knapp Marco</p>
            <p>Schützenhausweg 8</p>
            <p>9470 Buchs</p>
        </div>

        <div>
            <p className="font-medium">Telefon</p>
            <p>Natel +41 79 814 81 32</p>
            <p className="font-medium">Email</p>
            <p>kaminfeger-knapp@gmx.ch</p>
        </div>

        <div className="flex flex-col">
            <p className="font-medium">Rechtliches</p>
            <a href="/impressum" className="underline">Impressum</a>
            <a href="/datenschutz" className="underline">Datenschutz</a>
            <a href="/kontakt" className="underline">Kontakt</a>
        </div>

    </footer>

    
    </>)

}