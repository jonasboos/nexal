export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-8 border border-border">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Impressum</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Angaben gemäß § 5 TMG</h2>
            <p>[Name des Unternehmens / Inhaber]</p>
            <p>[Straße und Hausnummer]</p>
            <p>[PLZ und Ort]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Kontakt</h2>
            <p>Telefon: [Telefonnummer]</p>
            <p>E-Mail: [E-Mail-Adresse]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
            <p>[Umsatzsteuer-ID, falls vorhanden]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Redaktionell verantwortlich</h2>
            <p>[Name des Verantwortlichen]</p>
            <p>[Anschrift des Verantwortlichen]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">EU-Streitschlichtung</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a>.</p>
            <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
