# Mathe-Raufbold · Beat ’em Up 2.0

Ein Mathe-Kampfspiel für das Tablet. Wer richtig rechnet, greift an.

- **Drei Attacken, drei Aufgabenarten:** Hieb (Plus & Minus), Kick (Mal & Geteilt), Wurf (Klammer-Aufgaben). Der Finisher mischt alles.
- **15 Kämpfer:** 10 von Anfang an, 5 geheime. Jeder Story-Durchgang schaltet einen weiteren frei.
- **5 Arenen** mit Objekten, die im Kampf zu Bruch gehen.
- **Story** (10 Kämpfe bis zum Mathemagus) und **Freier Kampf**, drei Schwierigkeitsstufen.
- Soundeffekte und Menümusik werden live im Browser erzeugt, es gibt keine Audiodateien.

## Spielen

`index.html` über einen beliebigen Webserver öffnen, zum Beispiel:

```
npx serve .
```

Der Spielstand (freigeschaltete Kämpfer, Story-Fortschritt, Schwierigkeit) liegt im `localStorage` des Browsers.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Oberfläche und Styles |
| `js/audio.js` | Soundeffekte und Menümusik (WebAudio) |
| `js/math.js` | Aufgaben-Generator je Attacke und Stufe |
| `js/gfx.js` | Renderer, Cel-Shading, Kamera, Effekte |
| `js/fighters.js` | Skelett, Posen und die 15 Kämpfer |
| `js/stages.js` | Arenen und zerstörbare Objekte |
| `js/game.js` | Menüs, Steuerung, Kampf, Finisher |

three.js (r128) wird von cdnjs geladen.
