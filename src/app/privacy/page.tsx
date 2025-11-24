export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-8 border border-border">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Datenschutzerklärung</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium text-foreground mt-2">Allgemeine Hinweise</h3>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Hosting</h2>
            <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
            <p>[Name des Hosters]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-lg font-medium text-foreground mt-2">Datenschutz</h3>
            <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Hinweis zur verantwortlichen Stelle</h3>
            <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <p>[Name des Unternehmens / Verantwortlichen]</p>
            <p>[Adresse]</p>
            <p>E-Mail: [E-Mail-Adresse]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Datenerfassung auf dieser Website</h2>
            <h3 className="text-lg font-medium text-foreground mt-2">Cookies</h3>
            <p>Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an.</p>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Server-Log-Dateien</h3>
            <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.</p>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Kontaktformular</h3>
            <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Analyse-Tools und Werbung</h2>
            <p>[Hier ggf. Angaben zu Google Analytics, Matomo etc. einfügen oder diesen Abschnitt entfernen]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Newsletter</h2>
            <p>Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Plugins und Tools</h2>
            <p>[Hier ggf. Angaben zu YouTube, Google Maps, Google Fonts etc. einfügen]</p>
          </section>
        </div>
      </div>
    </div>
  );
}
