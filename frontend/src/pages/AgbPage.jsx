import React from "react";
import { Helmet } from "react-helmet";
// Wenn du React Router nutzt, kannst du statt <a> auch <Link> nehmen:
// import { Link } from "react-router-dom";

export default function Agb() {
  return (
    <>
      <Helmet>
        <title>Allgemeine Geschäftsbedingungen (AGB) | Kaminfeger Knapp</title>
        <meta
          name="description"
          content="Allgemeine Geschäftsbedingungen von Kaminfeger Knapp: Regelungen zu Leistungen, Preisen, Terminen, Haftung und Zahlungsmodalitäten für unsere Kunden."
        />
      </Helmet>

      {/* Gleiches Layout/Design wie typische Datenschutz-Seite: Center-Container + Card + Prose */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className=" bg-white p-6 sm:p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Allgemeine Geschäftsbedingungen
            </h1>
          </header>

          <article className="prose prose-gray max-w-none prose-headings:scroll-mt-24 prose-a:text-gray-900 prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline">
            <h2>1. Geltungsbereich</h2>
            <p>
              Für alle Bestellungen über unsere Webseite gelten die
              nachfolgenden Allgemeinen Geschäftsbedingungen (AGB). Das Angebot
              auf dieser Webseite richtet sich ausschliesslich an Konsumentinnen
              und Konsumenten mit Wohnsitz in der Schweiz (nachfolgend
              &quot;Kunde&quot;).
            </p>
            <p>
              Als Konsumentin oder Konsument wird eine natürliche Person
              bezeichnet, welche mit Kaminfegergeschäft Knapp geschäftliche
              Beziehungen pflegt, die weder ihrer gewerblichen noch ihrer
              selbständigen beruflichen Tätigkeit zugeordnet werden kann.
              Bestellungen in nicht haushaltsüblichen Mengen können ohne
              Begründung abgelehnt werden.
            </p>
            <p>
              Kaminfegergeschäft Knapp behält sich das Recht vor, diese AGB
              jederzeit zu ändern. Massgebend ist jeweils die zum Zeitpunkt der
              Bestellung geltende Version dieser AGB, welche für diese
              Bestellung nicht einseitig geändert werden können.
              Entgegenstehende oder von diesen AGB abweichende Bedingungen der
              Kundschaft werden nicht anerkannt.
            </p>
            <p>
              Der Betreiber dieses Internetauftritts ist{" "}
              <a href="/" aria-label="Startseite">
                Kaminfegergeschäft Knapp
              </a>
              .
            </p>

            <h2>2. Informationen auf dieser Webseite</h2>
            <p>
              Kaminfegergeschäft Knapp beinhaltet Informationen über Produkte
              und Dienstleistungen. Preis- und Sortimentsänderungen sowie
              technische Änderungen bleiben vorbehalten. Alle Angaben auf dieser
              Webseite (Produktbeschreibungen, Abbildungen, Illustrationen,
              Filme, Masse, Gewichte, technische Spezifikationen,
              Zubehörbeziehungen und sonstige Angaben) dienen der Illustration
              und sind als Näherungswerte zu verstehen und sind unverbindlich.
              Sie stellen insbesondere keine Zusicherung von Eigenschaften oder
              Garantien dar, ausser es ist explizit anders vermerkt.
              Kaminfegergeschäft Knapp bemüht sich, sämtliche Angaben und
              Informationen auf dieser Webseite korrekt, vollständig, aktuell
              und übersichtlich bereitzustellen, jedoch kann Kaminfegergeschäft
              Knapp weder ausdrücklich noch stillschweigend dafür Gewähr
              leisten.
            </p>
            <p>
              Sämtliche Angebote auf dieser Webseite gelten als freibleibend und
              sind nicht als verbindliche Offerte zu verstehen.
            </p>
            <p>
              Kaminfegergeschäft Knapp kann keine Garantie abgeben, dass die
              aufgeführten Produkte zum Zeitpunkt der Bestellung verfügbar sind.
              Daher sind alle Angaben zu Verfügbarkeit und Lieferzeiten ohne
              Gewähr und können sich jederzeit und ohne Ankündigung ändern.
            </p>

            <h2>3. Preise</h2>
            <p>
              Die auf Kaminfegergeschäft Knapp angegebenen Verkaufspreise
              stellen Endpreise dar und beinhalten, wenn nicht anders vermerkt,
              die gesetzliche Mehrwertsteuer und allfällige weitere gesetzliche
              Abgaben wie vorgezogene Recyclinggebühren (VRG) oder
              Urheberrechtsabgaben bei Elektronikgeräten. Die Preise verstehen
              sich rein netto in Schweizer Franken (CHF).
            </p>
            <p>
              Allfällige Versandkosten werden, wo nicht anders vorgesehen,
              zusätzlich verrechnet und sind durch den Kunden zu bezahlen.
              Versandkosten werden im Bestellprozess separat ausgewiesen.
            </p>
            <p>
              Technische Änderungen, Irrtümer und Druckfehler bleiben
              vorbehalten, insbesondere kann Kaminfegergeschäft Knapp
              Preisänderungen jederzeit und ohne Vorankündigungen vornehmen. In
              den Verkaufspreisen sind keine Beratungs- und
              Supportdienstleistungen inbegriffen.
            </p>

            <h2>4. Vertragsabschluss</h2>
            <p>
              Die Produkte und Preise auf dieser Webseite gelten als
              unverbindliche Angebote.
            </p>
            <p>
              Mit der Bestellung über diese Webseite inklusive der Annahme
              dieser AGB gibt der Kunde ein rechtlich verbindliches Angebot zum
              Vertragsabschluss ab. Kaminfegergeschäft Knapp versendet daraufhin
              eine automatische Bestelleingangsbestätigung per Email, welche
              bestätigt, dass das Angebot des Kunden bei Kaminfegergeschäft
              Knapp eingegangen ist. Getätigte Bestellungen sind für den Kunden
              verbindlich. Wo nicht anders vermerkt, gibt es kein Rückgabe- bzw.
              Rücktrittsrecht.
            </p>
            <p>
              Der Vertrag kommt zustande, sobald Kaminfegergeschäft Knapp eine
              Annahmeerklärung per Email versendet, worin der Versand der
              bestellten Produkte oder Dienstleistungen bestätigt wird.
            </p>
            <p>
              Bestellungen werden erst nach vollständigem Zahlungseingang
              (Ausnahme: Lieferung gegen Rechnung) und sofern die Waren
              verfügbar sind, ausgeliefert. Ergibt sich, dass die bestellten
              Waren nicht oder nicht vollständig geliefert werden können, ist
              Kaminfegergeschäft Knapp berechtigt, die Bestellung nicht oder nur
              teilweise anzunehmen bzw. auszuführen. In einem solchen Fall wird
              Kaminfegergeschäft Knapp den Kunden per Email informieren. Sollte
              die Zahlung des Kunden bereits bei Kaminfegergeschäft Knapp
              eingegangen sein, wird die Zahlung dem Kunden zurückerstattet. Ist
              noch keine Zahlung erfolgt, wird der Kunde von der Zahlungspflicht
              befreit.
            </p>

            <h2>5. Zahlungsmöglichkeiten und Eigentumsvorbehalt</h2>
            <p>
              Dem Kunden stehen die im Bestellvorgang angegebenen
              Zahlungsmöglichkeiten zur Verfügung.
            </p>
            <p>
              Kaminfegergeschäft Knapp behält sich das Recht vor, Kunden ohne
              Angabe von Gründen von einzelnen Zahlungsmöglichkeiten
              auszuschliessen oder auf Vorauskasse zu bestehen.
            </p>
            <p>
              Kaminfegergeschäft Knapp kann bei Zahlungsverzug des Kunden
              Verzugszinsen von 5% pro Jahr sowie eine Mahngebühr von maximal
              CHF 20.- pro Mahnung erheben.
            </p>
            <p>
              Die dem Kunden gelieferten Produkte bleiben bis zur vollständigen
              Bezahlung im Eigentum von Kaminfegergeschäft Knapp.
            </p>

            <h2>6. Lieferung, Prüfpflicht, Mängelrüge und Rücksendung</h2>
            <p>
              Die Lieferungen werden per Post oder Kurierdienst an die vom
              Kunden in der Bestellung angegebene Adresse versandt.
            </p>
            <p>
              Kaminfegergeschäft Knapp ist bemüht möglichst kurze Lieferfristen
              einzuhalten. Allfällig in der Bestellbestätigung angegebene
              Lieferfristen sind jedoch unverbindlich. Kaminfegergeschäft Knapp
              ist zu Teillieferungen berechtigt. Die Versandkosten werden in
              diesem Fall dem Kunden nur einmal berechnet.
            </p>
            <p>
              Der Versand der Rechnung, soweit Lieferung gegen Rechnung
              angeboten wird, erfolgt nach Wahl von Kaminfegergeschäft Knapp per
              Email oder auf dem Postweg.
            </p>
            <p>
              Ist die Lieferung nicht zustellbar oder verweigert der Kunde die
              Annahme der Lieferung, kann Kaminfegergeschäft Knapp den Vertrag
              nach einer Mitteilung per Email an den Kunden und unter Einhalten
              einer angemessenen Nachfrist auflösen sowie die Kosten für die
              Umtriebe in Rechnung stellen.
            </p>
            <p>
              Der Kunde ist verpflichtet, die gelieferten Waren sofort nach
              Eingang der Lieferung zu prüfen und allfällige Mängel, für die
              Kaminfegergeschäft Knapp Gewähr leistet, unverzüglich schriftlich
              per Brief oder Email an die Adresse im{" "}
              <a href="/impressum">Impressum</a> Anzeige zu machen.
            </p>
            <p>
              Rücksendungen an Kaminfegergeschäft Knapp erfolgen auf Rechnung
              und Gefahr des Kunden. Der Kunde hat die Waren originalverpackt,
              komplett mit allem Zubehör und zusammen mit dem Lieferschein und
              einer ausführlichen Beschreibung der Mängel an die von
              Kaminfegergeschäft Knapp angegebene Rücksendeadresse im{" "}
              <a href="/impressum">Impressum</a> zu schicken.
            </p>
            <p>
              Ergibt sich bei der Prüfung durch Kaminfegergeschäft Knapp, dass
              die Waren keine feststellbaren Mängel aufweisen oder diese nicht
              unter die Garantie des Herstellers fallen, kann Kaminfegergeschäft
              Knapp die Umtriebe, die Rücksendung oder die allfällige Entsorgung
              dem Kunden in Rechnung stellen.
            </p>

            <h2>7. Widerrufsrecht</h2>
            <p>
              Dem Kunden wird während 10 Kalendertagen nach Erhalt der Ware ein
              Widerrufsrecht gewährt. Die Frist gilt als eingehalten, wenn der
              Kunde den schriftlichen Widerruf per Email oder Brief (Adresse
              gemäss <a href="/impressum">Impressum</a>) innerhalb der Frist an
              Kaminfegergeschäft Knapp abschickt. Der Widerruf bedarf keiner
              Begründung.
            </p>
            <p>
              Die Ausübung des Widerrufsrechts führt zu einer Rückabwicklung des
              Vertrages. Der Kunde muss die Waren innert 10 Kalendertagen
              originalverpackt, komplett mit allem Zubehör und zusammen mit dem
              Lieferschein an die von Kaminfegergeschäft Knapp angegebene
              Rücksendeadresse im <a href="/impressum">Impressum</a>{" "}
              zurücksenden. Rücksendungen an Kaminfegergeschäft Knapp erfolgen
              auf Rechnung und Gefahr des Kunden. Eine allenfalls bereits
              geleistete Zahlung wird innerhalb von 20 Kalendertagen an den
              Kunden zurückerstattet, sofern Kaminfegergeschäft Knapp die Ware
              bereits zurückerhalten hat oder der Kunde einen Versandnachweis
              erbringen kann.
            </p>
            <p>
              Kaminfegergeschäft Knapp behält sich vor, für Beschädigungen,
              übermässige Abnutzung oder Wertverlust aufgrund unsachgemässen
              Umgangs angemessenen Entschädigung zu verlangen und die
              Wertminderung vom bereits bezahlten Kaufpreis abzuziehen oder dem
              Kunden in Rechnung zu stellen.
            </p>
            <p>In folgenden Fällen wird kein Widerrufsrecht gewährt:</p>
            <ul>
              <li>
                Wenn der Vertrag ein Zufallselement hat, namentlich weil der
                Preis Schwankungen unterliegt, auf die der Anbieter keinen
                Einfluss hat.
              </li>
              <li>
                Wenn der Vertrag eine bewegliche Sache zum Gegenstand hat, die
                aufgrund ihrer Beschaffenheit nicht für eine Rücksendung
                geeignet ist oder schnell verderben kann.
              </li>
              <li>
                Wenn der Vertrag eine bewegliche Sache zum Gegenstand hat, die
                nach Vorgaben des Kunden angefertigt wird oder eindeutig auf
                persönliche Bedürfnisse zugeschnitten ist.
              </li>
              <li>
                Wenn der Vertrag digitale Inhalte zum Gegenstand hat und diese
                Inhalte nicht auf einem festen Datenträger zur Verfügung
                gestellt werden oder wenn der Vertrag von beiden
                Vertragsparteien sofort vollständig zu erfüllen ist.
              </li>
              <li>
                Wenn der Vertrag eine Dienstleistung zum Gegenstand hat und der
                Vertrag vom Anbieter mit der vorgängigen ausdrücklichen
                Zustimmung des Kunden vollständig zu erfüllen ist, bevor die
                Widerrufsfrist abgelaufen ist.
              </li>
              <li>
                In den Bereichen Unterbringung, Beförderung, Lieferung von
                Speisen und Getränken sowie Freizeitgestaltung, wenn sich der
                Anbieter bei Vertragsabschluss verpflichtet, die
                Dienstleistungen zu einem bestimmten Zeitpunkt oder innerhalb
                eines genau angegebenen Zeitraums zu erbringen.
              </li>
            </ul>

            <h2>8. Gewährleistung</h2>
            <p>
              Kaminfegergeschäft Knapp bemüht sich, Waren in einwandfreier
              Qualität zu liefern. Bei rechtzeitig gerügten Mängeln übernimmt
              Kaminfegergeschäft Knapp während der gesetzlichen
              Gewährleistungsfrist von in der Regel zwei Jahren seit dem
              Lieferdatum die Gewährleistung für Mängelfreiheit und
              Funktionsfähigkeit des vom Kunden erworbenen Gegenstandes. Es
              liegt im Ermessen von Kaminfegergeschäft Knapp die Gewährleistung
              durch kostenlose Reparatur, gleichwertigen Ersatz oder durch
              Rückerstattung des Kaufpreises zu erbringen. Weitere
              Gewährleistungsrechte sind ausgeschlossen.
            </p>
            <p>
              Von der Gewährleistung werden die normale Abnützung sowie die
              Folgen unsachgemässer Behandlung oder Beschädigung durch den
              Kunden oder Drittpersonen sowie Mängel, die auf äussere Umstände
              zurückzuführen sind, nicht erfasst. Ebenso wird die Gewährleistung
              für Verbrauchs- und Verschleissteile (z.B. Batterien, Akkus, etc.)
              wegbedungen.
            </p>
            <p>
              Kaminfegergeschäft Knapp ist es nicht möglich, Zusicherungen oder
              Garantien für die Aktualität, Vollständigkeit und Korrektheit der
              Daten sowie für die ständige oder ungestörte Verfügbarkeit der
              Webseite, deren Funktionalitäten, integrierten Hyperlinks und
              weiteren Inhalten abzugeben. Insbesondere wird weder zugesichert,
              noch garantiert, dass durch die Nutzung der Webseite keine Rechte
              von Dritten verletzt werden, die nicht im Besitz von
              Kaminfegergeschäft Knapp sind.
            </p>

            <h2>9. Haftung</h2>
            <p>
              Kaminfegergeschäft Knapp schliesst jede Haftung, unabhängig von
              ihrem Rechtsgrund, sowie Schadenersatzansprüche gegen
              Kaminfegergeschäft Knapp und gegen allfällige Hilfspersonen und
              Erfüllungsgehilfen aus. Kaminfegergeschäft Knapp haftet
              insbesondere nicht für indirekte Schäden und Mangelfolgeschäden,
              entgangenen Gewinn oder sonstige Personen-, Sach- und reine
              Vermögensschäden des Kunden. Vorbehalten bleibt eine weitergehende
              zwingende gesetzliche Haftung, beispielsweise für grobe
              Fahrlässigkeit oder rechtswidrige Absicht.
            </p>
            <p>
              Kaminfegergeschäft Knapp benutzt Hyperlinks lediglich für den
              vereinfachten Zugang des Kunden zu anderen Webangeboten.
              Kaminfegergeschäft Knapp kann weder den Inhalt dieser Webangebote
              im Einzelnen kennen, noch die Haftung oder sonstige Verantwortung
              für die Inhalte dieser Webseiten übernehmen.
            </p>

            <h2>10. Datenschutz</h2>
            <p>
              Kaminfegergeschäft Knapp darf die im Rahmen des Vertragsschlusses
              aufgenommenen Daten zur Erfüllung der Verpflichtungen aus dem
              Kaufvertrag verarbeiten und nutzen sowie zu Marketingzwecken
              verwenden. Die zur Leistungserfüllung notwendigen Daten können
              auch an beauftrage Dienstleistungspartner (Logistikpartner) oder
              sonstigen Dritten weitergegeben werden.
            </p>
            <p>
              Die Datenschutzbestimmungen sind im Einzelnen unter folgendem Link
              abrufbar: <a href="/datenschutz">Datenschutz</a>
            </p>

            <h2>11. Teilungültigkeit</h2>
            <p>
              Sollten sich einzelne Bestimmungen dieser AGB als unwirksam oder
              undurchführbar erweisen oder unwirksam oder undurchführbar werden,
              so bleibt dadurch die Wirksamkeit der übrigen Bestimmungen
              unberührt.
            </p>

            <h2>12. Weitere Bestimmungen</h2>
            <p>
              Kaminfegergeschäft Knapp behält sich ausdrücklich vor, die
              vorliegenden AGB jederzeit zu ändern und ohne Ankündigung in Kraft
              zu setzen.
            </p>
            <p>
              Im Falle von Streitigkeiten kommt{" "}
              <strong>ausschliesslich materielles Schweizer Recht</strong> unter
              Ausschluss von kollisionsrechtlichen Normen zur Anwendung. Das
              UN-Kaufrecht (CISG, Wiener Kaufrecht) wird explizit
              ausgeschlossen.
            </p>
            <p>
              <strong>
                Gerichtsstand ist 9470 Buchs oder der Wohnsitz der Konsumentin
                oder des Konsumenten
              </strong>
              .
            </p>

            <h2>13. Kontakt</h2>
            <p>
              Bei Fragen zu diesen AGB bitte melden bei:{" "}
              <a href="/impressum">Impressum</a>
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
