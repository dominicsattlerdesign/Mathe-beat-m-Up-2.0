/* ---------- Rechenaufgaben ----------
   Jede Attacke hat ihre eigene Aufgabenart. Stufe d:
   0 = 1.–2. Klasse (nur Plus & Minus im Zahlenraum bis 20), 1 = leicht, 2 = mittel, 3 = schwer.
   hieb/kick/wurf = Standard-Attacken, sig = Spezial-Attacke, fin = Finisher (schwer, 15 Sekunden).
   Eine Aufgabe ist [Text, Lösung]. Steht ▢ im Text, wird die fehlende Zahl gesucht. */
const rI=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),rP=a=>a[rI(0,a.length-1)];
const DIFFS=[["1.–2. Klasse","Plus & Minus bis 20"],["Leicht","kleines Einmaleins"],["Mittel","Einmaleins & Klammern"],["Schwer","grosse Zahlen"]];
const LABELS=[{hieb:"Plus bis 20",kick:"Minus bis 20",wurf:"Plus & Minus"},{hieb:"Plus & Minus",kick:"Mal & Geteilt",wurf:"Klammern"}];
const TASKS={
  hieb:[
    /* 1.–2. Klasse: Plus im Zahlenraum bis 20 */
    [()=>{const a=rI(1,9),b=rI(1,9);return[`${a} + ${b}`,a+b]},
     ()=>{const a=rI(10,17),b=rI(1,20-a);return[`${a} + ${b}`,a+b]},
     ()=>{const a=rI(2,9),b=rI(11-a,9);return[`${a} + ${b}`,a+b]},
     ()=>{const a=rI(2,10);return[`${a} + ${a}`,a+a]},
     ()=>{const b=rI(1,10);return[`10 + ${b}`,10+b]},
     ()=>{const a=rI(1,9);return[`${a} + ▢ = 10`,10-a]},
     ()=>{const a=rI(2,14),c=rI(a+2,20);return[`${a} + ▢ = ${c}`,c-a]},
     ()=>{const a=rI(11,19);return[`${a} + ▢ = 20`,20-a]}],
    [()=>{const a=rI(3,12),b=rI(2,9);return[`${a} + ${b}`,a+b]},()=>{const a=rI(8,20),b=rI(2,a-2);return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(11,25),b=rI(3,9);return[`${a} + ${b}`,a+b]},()=>{const a=rI(21,30),b=rI(3,9);return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(3,9),b=rI(3,9),c=rI(2,6);return[`${a} + ${b} + ${c}`,a+b+c]},
     ()=>{const a=rI(4,12),c=rI(a+2,20);return[`${a} + ▢ = ${c}`,c-a]},()=>{const a=rI(6,15);return[`${a} + ${a}`,a+a]}],
    [()=>{const a=rI(12,58),b=rI(11,40);return[`${a} + ${b}`,a+b]},()=>{const a=rI(41,99),b=rI(11,38);return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(20,60),b=rI(11,30),c=rI(5,19);return[`${a} + ${b} − ${c}`,a+b-c]},
     ()=>{const a=rI(15,60),c=rI(a+11,99);return[`${a} + ▢ = ${c}`,c-a]},()=>{const b=rI(12,45),c=rI(11,50);return[`▢ − ${b} = ${c}`,b+c]},
     ()=>{const a=rI(100,180),b=rI(15,60);return[`${a} − ${b}`,a-b]},()=>{const a=rI(26,75);return[`${a} + ${a}`,a+a]}],
    [()=>{const a=rI(120,640),b=rI(105,350);return[`${a} + ${b}`,a+b]},()=>{const a=rI(420,990),b=rI(110,390);return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(12,60)*100,b=rI(11,39)*100;return[`${a} + ${b}`,a+b]},()=>{const a=rI(40,99)*100,b=rI(11,39)*100;return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(150,500),c=rI(a+120,999);return[`${a} + ▢ = ${c}`,c-a]},()=>{const b=rI(101,499);return[`1000 − ${b}`,1000-b]},
     ()=>{const a=rI(120,400),b=rI(110,300),c=rI(105,200);return[`${a} + ${b} + ${c}`,a+b+c]}]],
  kick:[
    /* 1.–2. Klasse: Minus im Zahlenraum bis 20 */
    [()=>{const a=rI(4,10),b=rI(1,a-1);return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(12,19),b=rI(1,a-10);return[`${a} − ${b}`,a-b]},
     ()=>{const a=rI(11,18),b=rI(a-9,9);return[`${a} − ${b}`,a-b]},
     ()=>{const b=rI(1,19);return[`20 − ${b}`,20-b]},
     ()=>{const a=rI(11,20);return[`${a} − 10`,a-10]},
     ()=>{const a=rI(4,10)*2;return[`${a} − ${a/2}`,a/2]},
     ()=>{const a=rI(8,20),c=rI(2,a-2);return[`${a} − ▢ = ${c}`,a-c]},
     ()=>{const b=rI(2,9),c=rI(2,20-b);return[`▢ − ${b} = ${c}`,b+c]}],
    [()=>{const a=rP([2,3,4,5,10]),b=rI(2,10);return[`${a} × ${b}`,a*b]},()=>{const a=rP([2,5,10]),b=rI(2,10);return[`${a*b} ÷ ${a}`,b]},
     ()=>{const a=rP([2,5,10]),b=rI(2,10);return[`▢ × ${a} = ${a*b}`,b]},()=>{const a=rI(2,10)*2;return[`${a} ÷ 2`,a/2]},
     ()=>{const a=rP([3,4]),b=rI(2,10);return[`${a*b} ÷ ${a}`,b]},()=>{const a=rI(2,5);return[`${a} × ${a}`,a*a]}],
    [()=>{const a=rI(3,9),b=rI(3,9);return[`${a} × ${b}`,a*b]},()=>{const a=rI(3,9),b=rI(3,10);return[`${a*b} ÷ ${a}`,b]},
     ()=>{const a=rI(3,9),b=rI(3,9);return[`▢ × ${a} = ${a*b}`,b]},()=>{const a=rI(2,9),b=rI(2,9)*10;return[`${a} × ${b}`,a*b]},
     ()=>{const a=rI(3,9),b=rI(3,9);return[`${a*b} ÷ ▢ = ${b}`,a]},()=>{const a=rI(4,10);return[`${a} × ${a}`,a*a]},
     ()=>{const a=rI(2,9),b=rI(2,9);return[`${a*b*10} ÷ 10`,a*b]}],
    [()=>{const a=rI(12,19),b=rI(3,9);return[`${a} × ${b}`,a*b]},()=>{const a=rI(6,12),b=rI(12,25);return[`${a*b} ÷ ${a}`,b]},
     ()=>{const a=rI(2,9)*10,b=rI(3,9);return[`${a} × ${b}`,a*b]},()=>{const a=rI(2,9)*10,b=rI(2,9)*10;return[`${a} × ${b}`,a*b]},
     ()=>{const a=rI(11,15);return[`${a} × ${a}`,a*a]},()=>{const a=rI(2,5),b=rI(3,6),c=rI(2,5);return[`${a} × ${b} × ${c}`,a*b*c]},
     ()=>{const a=rI(4,9),b=rI(11,19);return[`▢ × ${a} = ${a*b}`,b]},()=>{const a=rI(3,9),b=rI(12,40);return[`${a*b*10} ÷ ${a*10}`,b]}]],
  wurf:[
    /* 1.–2. Klasse: Plus & Minus gemischt mit drei Zahlen, alles bleibt zwischen 0 und 20 */
    [()=>{const a=rI(3,10),b=rI(2,20-a>9?9:20-a),c=rI(1,a+b-1);return[`${a} + ${b} − ${c}`,a+b-c]},
     ()=>{const a=rI(8,19),b=rI(2,a-2),c=rI(1,20-(a-b));return[`${a} − ${b} + ${c}`,a-b+c]},
     ()=>{const a=rI(2,8),b=rI(2,7),c=rI(1,20-a-b);return[`${a} + ${b} + ${c}`,a+b+c]},
     ()=>{const a=rI(10,20),b=rI(2,6),c=rI(1,a-b-1);return[`${a} − ${b} − ${c}`,a-b-c]},
     ()=>{const a=rI(2,9),c=rI(1,9);return[`${a} + ${10-a} + ${c}`,10+c]},
     ()=>{const a=rI(11,19),c=rI(1,9);return[`${a} − ${a-10} − ${c}`,10-c]}],
    [()=>{const a=rI(4,9),b=rI(3,9),c=rI(2,a+b-2);return[`(${a} + ${b}) − ${c}`,a+b-c]},
     ()=>{const b=rI(2,6),c=rI(2,6),a=rI(b+c+1,20);return[`${a} − (${b} + ${c})`,a-b-c]},
     ()=>{const a=rI(9,18),b=rI(2,8),c=rI(2,9);return[`(${a} − ${b}) + ${c}`,a-b+c]},
     ()=>{const a=rI(3,12),b=rI(6,12),c=rI(2,5);return[`${a} + (${b} − ${c})`,a+b-c]},
     ()=>{const a=rI(2,5),b=rI(2,5),c=rP([2,5,10]);return[`(${a} + ${b}) × ${c}`,(a+b)*c]},
     ()=>{const a=rI(5,9),b=rI(2,4),c=rI(6,9),d=rI(2,5);return[`(${a} − ${b}) + (${c} − ${d})`,a-b+c-d]},
     ()=>{const a=rI(12,20),b=rI(6,10),c=rI(2,5);return[`${a} − (${b} − ${c})`,a-b+c]}],
    [()=>{const a=rI(2,8),b=rI(2,8),c=rI(2,6);return[`(${a} + ${b}) × ${c}`,(a+b)*c]},
     ()=>{const a=rI(3,9),b=rI(6,12),c=rI(2,5);return[`${a} × (${b} − ${c})`,a*(b-c)]},
     ()=>{const c=rI(2,6),r=rI(3,9),a=rI(2,c*r-2);return[`(${a} + ${c*r-a}) ÷ ${c}`,r]},
     ()=>{const a=rI(4,9),b=rI(4,9),c=rI(2,9),d=rI(2,9);return[`(${a} × ${b}) − (${c} + ${d})`,a*b-c-d]},
     ()=>{const b=rI(3,8),c=rI(3,9);return[`100 − (${b} × ${c})`,100-b*c]},
     ()=>{const a=rI(20,50),b=rI(3,9),c=rI(3,9);return[`${a} + (${b} × ${c})`,a+b*c]},
     ()=>{const c=rI(3,9),r=rI(3,9),b=rI(2,8);return[`(${c*r} ÷ ${c}) + ${b}`,r+b]},
     ()=>{const a=rI(3,9),b=rI(5,9),c=rI(2,4);return[`(${a} × ${b}) − (${a} × ${c})`,a*(b-c)]}],
    [()=>{const a=rI(4,12),b=rI(4,12),c=rI(8,14),d=rI(2,6);return[`(${a} + ${b}) × (${c} − ${d})`,(a+b)*(c-d)]},
     ()=>{const a=rI(4,9),b=rI(5,12),c=rI(4,9),d=rI(5,30);return[`${a} × (${b} + ${c}) − ${d}`,a*(b+c)-d]},
     ()=>{const a=rI(3,9),b=rI(3,9),c=rI(3,9),d=rI(3,9);return[`(${a} × ${b}) + (${c} × ${d})`,a*b+c*d]},
     ()=>{const a=rI(30,60),b=rI(11,25),c=rI(3,8);return[`(${a} − ${b}) × ${c}`,(a-b)*c]},
     ()=>{const c=rI(4,9),r=rI(6,15),a=rI(8,c*r-8),d=rI(12,60);return[`(${a} + ${c*r-a}) ÷ ${c} + ${d}`,r+d]},
     ()=>{const a=rI(2,5),b=rI(2,6),c=rI(2,5),d=rI(2,6);return[`${a} × (${b} + ${c} × ${d})`,a*(b+c*d)]},
     ()=>{const a=rI(200,500),b=rI(6,9),c=rI(11,19);return[`${a} − (${b} × ${c})`,a-b*c]},
     ()=>{const c=rI(3,9),r=rI(11,25),d=rI(3,9),e=rI(3,9);return[`(${c*r} ÷ ${c}) − (${d} + ${e})`,r-d-e]}]],
  fin:[
    [()=>{const a=rI(4,9),b=rI(3,20-a>9?9:20-a),c=rI(2,a+b-2),d=rI(1,20-(a+b-c)>9?9:20-(a+b-c));return[`${a} + ${b} − ${c} + ${d}`,a+b-c+d]},
     ()=>{const a=rI(14,20),b=rI(2,6),c=rI(2,a-b-3),d=rI(1,20-(a-b-c)>9?9:20-(a-b-c));return[`${a} − ${b} − ${c} + ${d}`,a-b-c+d]},
     ()=>{const a=rI(2,6),b=rI(2,6),c=rI(2,6),d=rI(1,a+b+c-1);return[`${a} + ${b} + ${c} − ${d}`,a+b+c-d]},
     ()=>{const a=rI(3,9),c=rI(1,5),e=rI(a+3,19);return[`${a} + ▢ − ${c} = ${e-c}`,e-a]}],
    [()=>{const a=rI(8,15),b=rI(4,9),c=rI(2,5),d=rI(2,5);return[`(${a} + ${b}) − (${c} + ${d})`,a+b-c-d]},
     ()=>{const a=rI(2,5),b=rI(2,5),c=rP([2,5,10]),d=rI(3,9);return[`(${a} + ${b}) × ${c} − ${d}`,(a+b)*c-d]},
     ()=>{const a=rI(2,5),b=rP([2,5,10]),c=rI(2,5),d=rP([2,5,10]);return[`(${a} × ${b}) + (${c} × ${d})`,a*b+c*d]}],
    [()=>{const a=rI(3,9),b=rI(3,9),c=rI(3,8),d=rI(5,20);return[`(${a} + ${b}) × ${c} − ${d}`,(a+b)*c-d]},
     ()=>{const a=rI(4,9),b=rI(4,9),c=rI(3,9),d=rI(3,9);return[`(${a} × ${b}) + (${c} × ${d})`,a*b+c*d]},
     ()=>{const a=rI(5,9),b=rI(12,20),c=rI(3,9);return[`${a} × (${b} − ${c}) + ${c}`,a*(b-c)+c]},
     ()=>{const a=rI(6,9),b=rI(6,9),c=rI(3,6),d=rI(3,6);return[`(${a} × ${b}) − (${c} × ${d})`,a*b-c*d]}],
    [()=>{const a=rI(6,15),b=rI(6,15),c=rI(3,8),d=rI(3,8);return[`(${a} + ${b}) × (${c} + ${d})`,(a+b)*(c+d)]},
     ()=>{const a=rI(12,19),b=rI(4,9),c=rI(4,9),d=rI(5,9);return[`${a} × ${b} − (${c} + ${d}) × 2`,a*b-(c+d)*2]},
     ()=>{const a=rI(25,60),b=rI(15,40),c=rI(4,9);return[`(${a} + ${b}) × ${c}`,(a+b)*c]},
     ()=>{const a=rI(11,15),b=rI(4,9),c=rI(6,9);return[`(${a} × ${a}) − (${b} × ${c})`,a*a-b*c]}]],
};
/* Spezial-Attacke: mittelschwer, bunt gemischt aus der Stufe */
TASKS.sig=[0,1,2,3].map(d=>TASKS.wurf[d].concat(TASKS.kick[d].slice(-3),TASKS.hieb[d].slice(-2)));
function task(type,d){for(let i=0;i<20;i++){const t=rP(TASKS[type][d])();if(t[1]>=0&&Number.isInteger(t[1]))return t}return["2 + 2",4]}
/* Sekunden für Tempo-Bonus [×1.5, ×1.25] je Attacke */
const BONUS={hieb:[5,10],kick:[7,14],wurf:[12,22],sig:[12,22],fin:[8,15]};
const FIN_TIME=15;
