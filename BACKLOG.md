# Mathbrawl – Sammelliste aus dem Nutzertest

Punkte 1–9 sind umgesetzt (Test-APK Version 1.3). Neue Punkte unten anhängen.

1. **Mehr Rechnungen.** Die Aufgaben wiederholen sich zu oft (vor allem Kick / Einmaleins: Leicht 117, Mittel 299, Schwer 600 verschiedene Rechnungen).
2. **Eigene Startpose für jeden Kämpfer.** Im Moment haben alle dieselbe.
3. **Theo:** breiteres und etwas längeres Schwert.
4. **Neuer Spezial-Charakter zum Freispielen: Mimi Tus**
   - Blonde Haare, schwarzes Basecap, Hoodie
   - Kampfstil erinnert an einen Betrunkenen (Drunken-Fist-Stil)
   - Auftritt: erscheint aus einer grauen Rauchwolke und sitzt weinend darin
   - Attacken und Spezialmoves haben immer etwas mit Herzen zu tun (Ideen frei)
   - Eigene Hiebe, Kicks, Würfe, eigene Spezial-Attacke, eigener Finisher, eigenes Intro
   - Kein zweites Outfit
   - Freispielbare Arena: Liebespalast
5. **Freier Kampf als Tag Team** (wieder entfernt, gefiel im Test nicht)
   - 2 Kämpfer wählen
   - Geht einer K.O., springt der zweite in die Arena, es geht direkt weiter (kein neues Intro, kein neues 3-2-1)
   - Gemeinsames Intro für beide Kämpfer eines Teams, für jede mögliche Paarung ein eigenes, auch mit zweiten Outfits
   - Pro Team nur ein Banner mit beiden Namen und Köpfen
6. **Arena-Auswahl:** Nicht alle Kästchen sind gleich gross, die obere Reihe ist grösser als die darunter.
7. **Freischalten über Herausforderungen statt nur über die Story.** Mehr Abwechslung: Kämpfer, Outfits, Arenen und Musik über eigene Aufgaben freispielen.
   Vorschläge (noch offen):
   - **Attacken-Herausforderungen:** „Nutze mit Theo 25× die Wurfattacke“, „Lande 50 Kicks mit Mika“, „Löse 20 Aufgaben blitzschnell (×1,5)“
   - **Gegner-Herausforderungen:** „Besiege mit Akane den Kämpfer Drako 3× auf Schwer“, „Besiege jeden Start-Kämpfer einmal“
   - **Rechen-Herausforderungen:** „10 richtige Antworten am Stück“, „Gewinne einen Kampf ohne falsche Antwort“, „Löse 30 Platzhalter-Aufgaben“
   - **Finisher und Spezial:** „Schaffe 10 Finisher“, „Setze mit Volt-7 5× die Spezialattacke ein“
   - **Versus:** „Gewinne 5 Versus-Spiele“, „Löse 3 Zusammenpralle aus“
   - **Story:** bleibt eine Quelle, aber nicht mehr die einzige
   - **Zuordnungsidee:** Kämpfer über Story und Gegner-Herausforderungen, zweite Outfits über Attacken-Herausforderungen mit genau diesem Kämpfer, Arenen über Siege gegen den Besitzer der Arena oder über Rechen-Herausforderungen, Musik über Versus
   - Eigener Bildschirm „Herausforderungen“ mit Fortschrittsbalken (z. B. 17/25) und einer Meldung im Kampf, wenn eine geschafft ist
   - Fortschritt wird auf dem Gerät gespeichert, bisher Freigeschaltetes bleibt frei
8. **Rechnungen auf kleinen Bildschirmen (z. B. Google Pixel 9) teilweise nicht vollständig sichtbar** und dadurch nicht lösbar. Lange Aufgaben (Zahlenfolgen, Klammern, Algebra) auf den Karten und im Antwortfeld prüfen und so anpassen, dass sie immer ganz zu sehen sind.
9. **Vibration bei falscher Antwort** (haptisches Feedback). Wieder entfernt, brachte im Test nichts. Machbar in der Android-App über das Capacitor-Plugin „Haptics“ (bzw. `navigator.vibrate`), braucht die Berechtigung VIBRATE. Viele Tablets haben keinen Vibrationsmotor, dort passiert einfach nichts. Im Browser geht es nur auf Android, nicht auf iPhone/iPad. Idee: kurzes Doppel-Brummen bei falsch, evtl. ganz kurzes Tippen bei Treffern; in den Einstellungen ein- und ausschaltbar.
10. **Grafik glatter** (Test-APK): gleich dicke Umrisslinien, rundere Kämpfer (mehr Segmente), feinerer Toon-Verlauf, Leuchten (Bloom) + Farbkorrektur auf „Hoch“, weichere Übergänge zwischen Posen, Kontaktschatten unter den Füssen.

## Geplant für nächste Woche: Figuren-Update („Akane Maximum“)

Vorschau-Bild und Bau-Skript: `docs/grafik-vorschau/` (das Skript baut die verbesserte Akane neben der heutigen auf und macht die Vergleichsbilder).

11. **Fehler Pferdeschwanz:** Bei Frisur „pony“ (z. B. Akane) ist der Zopf falsch herum gedreht (`rotation.x=-.5` statt nach hinten) und sticht vorne unter dem Kinn heraus („roter Bart“). Von hinten sieht man keinen Zopf.
12. **Akane als Vorzeigefigur komplett überarbeiten**, wie im Vorschaubild:
    - Schärpe als Stoffband, das schräg am Oberkörper anliegt (statt geradem schwarzem Balken)
    - Kimono-Kragen links über rechts, Faltenrock mit Saum, Gürtelknoten mit Enden
    - Haare: weiche Ponysträhnen, lange Seitensträhnen, Hinterkopf bedeckt, durchgehender Pferdeschwanz mit Schleife
    - Stirnband mit Knoten und hängenden Bändern
    - Neues Gesicht: grössere Augen mit mehreren Glanzpunkten, feine Brauen, Nasenschatten, entschlossener Mund
    - Arme und Beine mit Muskelformen, sauberer Hals, Fäuste mit Knöcheln, Füsse mit Zehen, Bandagen
    - Schatten je Material: Haut warm, Stoff kühl, leichter Glanz auf Haar und Metall
13. **Danach entscheiden:** Was davon für alle Kämpfer gilt (Körperformen, Hals, Hände, Füsse, Gesicht, Schattierung) und welche Figuren einzeln überarbeitet werden. Leistung auf echten Tablets und Handys messen (die Maximal-Akane hat etwa dreimal so viele Teile).
14. **Arenen verbessern** (umgesetzt, Test-APK), Vorbild: `docs/grafik-vorschau/dojo_vergleich.png` und `dojo_verbessert.js`.
    Pro Arena mehr Tiefe und Details: Dächer/Gebäude statt flacher Wände, echte Bäume mit Ästen und Blütenwolken, Laternen mit Glühen, Banner, Lichtstrahlen, Nebelschichten, Blätter/Blüten auf dem Boden. Wiederverwendbare Bausteine für alle Arenen bauen (Baum, Lichtstrahl, Nebel, Bodenstreu, Laterne, geschwungenes Dach). Auf „Mittel“/„Niedrig“ weniger Details; Blüten sparsam zeichnen. In Etappen über alle 16 Arenen + 3 Bonus-Arenen, Leistung auf echten Geräten messen.
15. **Unterschiedliche Körperformen** (umgesetzt, Test-APK): `docs/grafik-vorschau/koerperformen.png`.
    Neue Körperwerte je Kämpfer zusätzlich zu Grösse (h) und Breite (w): Schultern (sh), Bauch (bel), Armdicke (arm), Beinlänge (leg), Kopfgrösse (hd). Vorschlag:
    | Kämpfer | Idee | Werte |
    |---|---|---|
    | Raiko | schlank, lange Beine | leg 1.08, sh .94 |
    | Akane | sportlich, etwas kleiner | h .94, leg 1.05, sh .94 |
    | Käpt’n Rokka | klein und rund | h .86, w 1.18, bel 1.5, leg .82, hd 1.06 |
    | Zeno | gross und dünn | h 1.12, w .88, leg 1.12, sh .9 |
    | Theo | kräftige Schultern | h 1.03, sh 1.16, arm 1.12 |
    | Volt-7 | sehr breite Schultern | h 1.04, sh 1.3, arm 1.2 |
    | Ida | schlank | h 1.03, w .84, leg 1.06 |
    | Goro | der Grösste und Breiteste | h 1.16, w 1.32, sh 1.35, bel 1.3, arm 1.38, hd .88 |
    | Shade | hager, lange Glieder | h 1.05, w .86, leg 1.14, arm .86 |
    | Mika | die Kleinste | h .84, leg .92, hd 1.1 |
    | Drako | Ritter, breit | h 1.07, sh 1.2, arm 1.14 |
    | Oni-Maru | gross und massig | h 1.15, w 1.28, sh 1.25, bel 1.3, arm 1.3, hd .92 |
    | Seraph | gross und elegant | h 1.12, leg 1.1 |
    | Kaiser Null | gross, mächtig | h 1.18, sh 1.22 |
    | Mathemagus | alter Zauberer mit Bauch | h 1.04, bel 1.25, sh .88 |
    | Mimi Tus | klein, etwas rundlich | h .86, w 1.06, bel 1.2, hd 1.1 |
    Beim Umbau prüfen: Trefferhöhen, Würfe/Griffe, Waffen in der Hand, Kamera-Ausschnitt, Porträts.
