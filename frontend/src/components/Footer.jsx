import React from "react";

export default function Main(){

    return(<>
    
    <footer class="flex justify-center space-x-24 border-t mt-36 mb-12 pt-12">

        <div class="">
            <p class="font-medium">Adresse</p>
            <p>Kaminfegergeschäft Knapp Marco</p>
            <p>Schützenhausweg 8</p>
            <p>9470 Buchs</p>
        </div>

        <div>
            <p class="font-medium">Telefon</p>
            <p>Natel +41 79 814 81 32</p>
            <p class="font-medium">Email</p>
            <p>kaminfeger-knapp@gmx.ch</p>
        </div>

        <div class="flex flex-col">
            <p class="font-medium">Rechtliches</p>
            <a href="/impressum" class="underline">Impressum</a>
            <a href="/datenschutz" class="underline">Datenschutz</a>
            <a href="/kontakt" class="underline">Kontakt</a>
        </div>

    </footer>

    
    </>)

}