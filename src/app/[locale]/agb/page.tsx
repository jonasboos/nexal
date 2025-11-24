export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-8 border border-border">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Geltungsbereich</h2>
            <p>Für alle Bestellungen über unseren Online-Shop durch Verbraucher und Unternehmer gelten die nachfolgenden AGB.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Vertragspartner, Vertragsschluss</h2>
            <p>Der Kaufvertrag kommt zustande mit [Name des Unternehmens].</p>
            <p>Mit Einstellung der Produkte in den Online-Shop geben wir ein verbindliches Angebot zum Vertragsschluss über diese Artikel ab. Sie können unsere Produkte zunächst unverbindlich in den Warenkorb legen und Ihre Eingaben vor Absenden Ihrer verbindlichen Bestellung jederzeit korrigieren.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Vertragssprache, Vertragstextspeicherung</h2>
            <p>Die für den Vertragsschluss zur Verfügung stehende Sprache ist Deutsch.</p>
            <p>Wir speichern den Vertragstext und senden Ihnen die Bestelldaten und unsere AGB in Textform zu.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Preise und Zahlungsbedingungen</h2>
            <p>Die angegebenen Preise enthalten die gesetzliche Umsatzsteuer und sonstige Preisbestandteile.</p>
            <p>In unserem Shop stehen Ihnen grundsätzlich die folgenden Zahlungsarten zur Verfügung:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Kreditkarte</li>
              <li>[Weitere Zahlungsarten]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Widerrufsrecht</h2>
            <p>Verbrauchern steht das gesetzliche Widerrufsrecht wie in der Widerrufsbelehrung beschrieben zu.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Gewährleistung und Garantien</h2>
            <p>Es gilt das gesetzliche Mängelhaftungsrecht.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Streitbeilegung</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie hier finden: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a>.</p>
            <p>Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
