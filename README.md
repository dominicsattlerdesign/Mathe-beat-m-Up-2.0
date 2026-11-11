# Mathbrawl

Ein Mathe-Kampfspiel für das Tablet im Querformat. Wer richtig rechnet, greift an.

- **Drei Attacken, drei Aufgabenarten:** Hieb, Kick und Wurf mit je eigener Aufgabenart und elf Varianten. Dreimal dieselbe Attacke am Stück sperrt sie, bis zwei andere geschafft sind.
- **Spezial-Attacke und Finisher je Figur:** Die Spezial-Leiste lädt sich im Kampf auf. Den Finisher gibt es nur im Matchball, wenn der Gegner höchstens 10 % Leben hat, und nur 15 Sekunden lang.
- **15 Kämpfer:** 5 von Anfang an, pro Story-Durchgang kommen zwei dazu.
- **5 Arenen** mit Objekten, die im Kampf zu Bruch gehen.
- **Vier Stufen:** 1.–2. Klasse (Plus und Minus bis 100), Leicht, Mittel, Schwer.
- **Story** (10 Kämpfe, jeder bis zwei Rundensiege) und **Freier Kampf**.
- **Rangliste:** schnellste Kampfzeit für die Story je Stufe, gespeichert auf dem Gerät.
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
