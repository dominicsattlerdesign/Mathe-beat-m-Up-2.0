# Mathbrawl

Ein Mathe-Kampfspiel für das Tablet im Querformat. Wer richtig rechnet, greift an.

- **Drei Attacken, drei Aufgabenarten:** Hieb, Kick und Wurf mit je eigener Aufgabenart und elf Varianten. Dreimal dieselbe Attacke am Stück sperrt sie, bis zwei andere geschafft sind.
- **Spezial-Attacke und Finisher je Figur:** Die Spezial-Leiste lädt sich im Kampf auf, auch bei den Gegnern. Ist ihre Leiste voll, setzen sie ihre Spezial-Attacke ein. Den Finisher gibt es nur im Matchball, wenn der Gegner höchstens 10 % Leben hat, und nur 15 Sekunden lang.
- **15 Kämpfer:** 5 von Anfang an, pro Story-Durchgang kommt ein zufälliger gesperrter Kämpfer dazu. In der Stufe „Mittel“ ist es ein zufälliger gesperrter Kämpfer, nur dort können auch die Bosse Kaiser Null und Mathemagus frei werden.
- **Zweites Outfit und Arena je Figur:** Schafft man die Story mit einer Figur, wird zufällig ihr zweites Outfit oder ihre Arena frei, beim nächsten Mal das andere. Das Outfit ist in der Kämpferwahl umschaltbar.
- **15 Arenen, eine pro Figur**, mit Objekten, die im Kampf zu Bruch gehen. Die Arenen der fünf Start-Figuren sind von Anfang an frei, die anderen kommen über die Story (siehe unten). In der Story kämpft man in der Arena des Gegners. Dazu **3 Bonus-Arenen** (Kinderzimmer, Spielhalle, Neon-Gasse): jeder Story-Sieg auf „Schwer“ schaltet eine frei. Im Freien Kampf wählt man die Arena selbst oder per Zufall.
- **Vier Stufen:** 1.–2. Klasse (Plus und Minus bis 20), Leicht, Mittel, Schwer. Schwer mischt 75 % Aufgaben aus Mittel mit 25 % grossen Zahlen, dafür haben die Gegner dort mehr Leben (+25 %, Story-Bosse +50 % und +75 %).
- **Story** (10 Kämpfe, jeder bis zwei Rundensiege) und **Freier Kampf**.
- **Rangliste:** schnellste Kampfzeit für die Story je Stufe, gespeichert auf dem Gerät.
- **Sprache:** Deutsch oder Englisch, umschaltbar auf dem Startbildschirm und in den Einstellungen.
- **Einstellungen:** Lautstärke für Musik und für Effekte, Wahl zwischen drei Arcade-Musiktiteln, auch im Pausenmenü.
- Soundeffekte und Menümusik werden live im Browser erzeugt, es gibt keine Audiodateien.

## Spielen

`index.html` über einen beliebigen Webserver öffnen, zum Beispiel:

```
npx serve .
```

Spielstand, Name und Rangliste liegen im `localStorage` des Browsers.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Oberfläche und Styles |
| `js/audio.js` | Soundeffekte und Menümusik (WebAudio) |
| `js/math.js` | Aufgaben-Generator je Attacke und Stufe |
| `js/gfx.js` | Renderer, Schatten, Materialien, Kamera, Effekte |
| `js/fighters.js` | Körper, Gesichter, Waffen, Posen und die 15 Kämpfer |
| `js/stages.js` | Arenen und zerstörbare Objekte |
| `js/moves.js` | Spezial-Attacken und Finisher je Figur |
| `js/game.js` | Menüs, Steuerung, Kampfregeln, Rangliste |

three.js (r128) wird von cdnjs geladen.
