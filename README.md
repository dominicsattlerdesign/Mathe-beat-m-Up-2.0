# Mathbrawl

Ein Mathe-Kampfspiel für das Tablet im Querformat. Wer richtig rechnet, greift an.

- **Drei Attacken, drei Aufgabenarten:** Hieb, Kick und Wurf mit je eigener Aufgabenart und elf Varianten. Dreimal dieselbe Attacke am Stück sperrt sie, bis zwei andere geschafft sind.
- **Spezial-Attacke und Finisher je Figur:** Die Spezial-Leiste lädt sich im Kampf auf, auch bei den Gegnern. Ist ihre Leiste voll, setzen sie ihre Spezial-Attacke ein. Den Finisher gibt es nur im Matchball, wenn der Gegner höchstens 10 % Leben hat, und nur 15 Sekunden lang.
- **15 Kämpfer:** 5 von Anfang an (Raiko, Akane, Zeno, Theo, Ida), pro Story-Durchgang kommt ein zufälliger gesperrter Kämpfer dazu. In der Stufe „Mittel“ ist es ein zufälliger gesperrter Kämpfer, nur dort können auch die Bosse Kaiser Null und Mathemagus frei werden.
- **Zweites Outfit und Arena je Figur:** Schafft man die Story mit einer Figur, wird zufällig ihr zweites Outfit oder ihre Arena frei, beim nächsten Mal das andere. Das Outfit ist in der Kämpferwahl umschaltbar.
- **15 Arenen, eine pro Figur**, mit Objekten, die im Kampf zu Bruch gehen. Die Arenen der fünf Start-Figuren sind von Anfang an frei, die anderen kommen über die Story (siehe unten). In der Story kämpft man in der Arena des Gegners. Dazu **3 Bonus-Arenen** (Kinderzimmer, Spielhalle, Neon-Gasse): jeder Story-Sieg auf „Schwer“ schaltet eine frei. Im Freien Kampf wählt man die Arena selbst oder per Zufall.
- **Vier Stufen:** 1.–2. Klasse (Plus und Minus bis 20), Leicht, Mittel, Schwer. Schwer mischt 75 % Aufgaben aus Mittel mit 25 % grossen Zahlen, dafür haben die Gegner dort mehr Leben (+25 %, Story-Bosse +50 % und +75 %).
- **Vorstufe Algebra (Mittel und Schwer):** Platzhalter mit zwei Schritten (`4 × ▢ + 3 = 31`), Symbol-Rätsel (`★ + ★ + 5 = 19`), Zahlenfolgen (`3, 6, 12, 24, ▢`) und Platzhalter vorne (`▢ ÷ 4 = 9`). Kommen vor allem im Wurf und in der Spezialattacke vor (etwa die Hälfte der Wurf-Aufgaben), dazu gelegentlich im Finisher. Mittel bleibt bis 100, Schwer bis 1000.
- **Story** (10 Kämpfe, jeder bis zwei Rundensiege, 2 Leben: nach der ersten Niederlage darf man den Kampf wiederholen, nach der zweiten beginnt die Story von vorn) und **Freier Kampf** mit freier Wahl von Gegner und Arena.
- Jede Runde startet mit einem Countdown „3, 2, 1, Rechnen!“.
- **Handy:** Auf Handys sind Attackenkarten und Zahlentasten gross (Zahlen in zwei Reihen), der Kampf wird dafür kleiner dargestellt. Tablets und Browser bleiben unverändert.
- **Auftritte vor dem Kampf:** 30 eigene Auftritte (je Figur und Outfit), z. B. Rokka springt von einem Piratenschiff, Volt-7 landet in einer Kapsel, Professor Kreide erscheint hinter einer Tafel. Tippen überspringt sie.
- **Kampfstil der Gegner:** Jede Figur hat als KI-Gegner ein eigenes Tempo. Flinke Gegner (Raiko, Shade, Mika) greifen öfter an und treffen schwächer, schwere (Goro, Oni-Maru) seltener und härter.
- **Rangliste:** schnellste Kampfzeit für die Story je Stufe, gespeichert auf dem Gerät.
- **Sprache:** Deutsch oder Englisch, umschaltbar auf dem Startbildschirm und in den Einstellungen.
- **Einstellungen:** Lautstärke für Musik und Soundeffekte, Grafik-Effekte (Hoch, Mittel, Niedrig für ältere Geräte), Wahl zwischen drei Arcade-Musiktiteln, auch im Pausenmenü.
- Soundeffekte und Menümusik werden live im Browser erzeugt, es gibt keine Audiodateien.

## Spielen im Browser

Das Spiel liegt im Ordner `www`. Über einen beliebigen Webserver öffnen, zum Beispiel:

```
npx serve www
```

Alles Nötige liegt lokal bei (three.js in `www/vendor`, Schriften in `www/fonts`), das Spiel läuft also auch ohne Internet.

## Android-App (Tablet)

Die App wird mit [Capacitor](https://capacitorjs.com) gebaut: Name „Math Brawl“, ID `de.mathbrawl.app`, immer Querformat, Vollbild ohne Status- und Navigationsleiste, Bildschirm bleibt während des Spiels an.

Voraussetzungen: Node.js 20 oder neuer, Android Studio (bringt Android SDK und Java mit).

```
npm install
npm run sync          # kopiert www in das Android-Projekt
npm run open          # öffnet das Projekt in Android Studio
```

Debug-APK direkt per Kommandozeile bauen:

```
npm run apk           # Windows
npm run apk:mac       # macOS / Linux
```

Die APK liegt danach unter `android/app/build/outputs/apk/debug/app-debug.apk`. Auf das Tablet kopieren und installieren (dafür „Installation aus unbekannten Quellen“ erlauben) oder mit angeschlossenem Tablet `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`.

### Play Store

Für den Play Store wird ein signiertes App-Bundle (`.aab`) gebaut. Dafür braucht es den Upload-Schlüssel `android/mathbrawl-upload.jks` und die Datei `android/keystore.properties` mit den Passwörtern. Beide stehen absichtlich nicht im Git und müssen sicher aufbewahrt werden.

```bash
npm run sync
cd android && ./gradlew bundleRelease
```

Das Bundle liegt unter `android/app/build/outputs/bundle/release/app-release.aab`. Vor jedem Update `versionCode` (und `versionName`) in `android/app/build.gradle` erhöhen. Store-Bilder, Texte und die Datenschutzerklärung liegen im Ordner `playstore/`.

Nach jeder Änderung an den Spieldateien in `www` vor dem Bauen `npm run sync` ausführen (macht `npm run apk` automatisch).

Das App-Icon liegt in `android/app/src/main/res/mipmap-*`, die Vorlage in 1024 px in `resources/icon-1024.png`.

Spielstand, Name und Rangliste liegen im `localStorage` des Browsers.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `www/index.html` | Oberfläche und Styles |
| `www/js/audio.js` | Soundeffekte und Menümusik (WebAudio) |
| `www/js/math.js` | Aufgaben-Generator je Attacke und Stufe |
| `www/js/gfx.js` | Renderer, Schatten, Materialien, Kamera, Effekte |
| `www/js/fighters.js` | Körper, Gesichter, Waffen, Posen und die 15 Kämpfer |
| `www/js/stages.js` | Arenen und zerstörbare Objekte |
| `www/js/moves.js` | Spezial-Attacken und Finisher je Figur |
| `www/js/walkins.js` | Auftritte vor dem Kampf (30 Stück) |
| `www/js/game.js` | Menüs, Steuerung, Kampfregeln, Rangliste |

three.js (r128) liegt in `www/vendor`, die Schriften Bangers und Chakra Petch (SIL Open Font License) in `www/fonts`.

| Ordner | Inhalt |
| --- | --- |
| `android/` | Android-Projekt (Capacitor) |
| `resources/` | App-Icon in 1024 px |
| `capacitor.config.json` | App-Name, ID, Webordner |

## Mitwirkende

- Spielidee und Game Design: Dominic Sattler
- Programmiert mit Claude Code von Anthropic
