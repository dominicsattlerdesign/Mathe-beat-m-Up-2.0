/* ---------- Rechenaufgaben ----------
   Jede Attacke hat ihre eigene Aufgabenart:
   hieb = Plus & Minus, kick = Mal & Geteilt, wurf = Klammern, fin = Finisher (gemischt mit Klammern).
   Stufe d: 0 leicht, 1 mittel, 2 schwer. Ergebnis ist immer eine ganze Zahl >= 0. */
const rI=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),rP=a=>a[rI(0,a.length-1)];
const TASKS={
  hieb:[
    [()=>{const a=rI(3,12),b=rI(2,9);return[`${a} + ${b}`,a+b]},()=>{const a=rI(8,20),b=rI(2,a-2);return[`${a} − ${b}`,a-b]}],
    [()=>{const a=rI(12,58),b=rI(11,40);return[`${a} + ${b}`,a+b]},()=>{const a=rI(41,99),b=rI(11,38);return[`${a} − ${b}`,a-b]}],
    [()=>{const a=rI(120,640),b=rI(105,350);return[`${a} + ${b}`,a+b]},()=>{const a=rI(420,990),b=rI(110,390);return[`${a} − ${b}`,a-b]}]],
  kick:[
    [()=>{const a=rP([2,3,4,5,10]),b=rI(2,10);return[`${a} × ${b}`,a*b]},()=>{const a=rP([2,5,10]),b=rI(2,10);return[`${a*b} ÷ ${a}`,b]}],
    [()=>{const a=rI(3,9),b=rI(3,9);return[`${a} × ${b}`,a*b]},()=>{const a=rI(3,9),b=rI(3,10);return[`${a*b} ÷ ${a}`,b]}],
    [()=>{const a=rI(12,19),b=rI(3,9);return[`${a} × ${b}`,a*b]},()=>{const a=rI(6,12),b=rI(12,25);return[`${a*b} ÷ ${a}`,b]},()=>{const a=rI(2,9)*10,b=rI(3,9);return[`${a} × ${b}`,a*b]}]],
  wurf:[
    [()=>{const a=rI(4,9),b=rI(3,9),c=rI(2,a+b-2);return[`(${a} + ${b}) − ${c}`,a+b-c]},
     ()=>{const b=rI(2,6),c=rI(2,6),a=rI(b+c+1,20);return[`${a} − (${b} + ${c})`,a-b-c]},
     ()=>{const a=rI(9,18),b=rI(2,8),c=rI(2,9);return[`(${a} − ${b}) + ${c}`,a-b+c]},
     ()=>{const a=rI(3,12),b=rI(6,12),c=rI(2,5);return[`${a} + (${b} − ${c})`,a+b-c]}],
    [()=>{const a=rI(2,8),b=rI(2,8),c=rI(2,6);return[`(${a} + ${b}) × ${c}`,(a+b)*c]},
     ()=>{const a=rI(3,9),b=rI(6,12),c=rI(2,5);return[`${a} × (${b} − ${c})`,a*(b-c)]},
     ()=>{const c=rI(2,6),r=rI(3,9),a=rI(2,c*r-2);return[`(${a} + ${c*r-a}) ÷ ${c}`,r]},
     ()=>{const a=rI(4,9),b=rI(4,9),c=rI(2,9),d=rI(2,9);return[`(${a} × ${b}) − (${c} + ${d})`,a*b-c-d]},
     ()=>{const b=rI(3,8),c=rI(3,9);return[`100 − (${b} × ${c})`,100-b*c]}],
    [()=>{const a=rI(4,12),b=rI(4,12),c=rI(8,14),d=rI(2,6);return[`(${a} + ${b}) × (${c} − ${d})`,(a+b)*(c-d)]},
     ()=>{const a=rI(4,9),b=rI(5,12),c=rI(4,9),d=rI(5,30);return[`${a} × (${b} + ${c}) − ${d}`,a*(b+c)-d]},
     ()=>{const a=rI(3,9),b=rI(3,9),c=rI(3,9),d=rI(3,9);return[`(${a} × ${b}) + (${c} × ${d})`,a*b+c*d]},
     ()=>{const a=rI(30,60),b=rI(11,25),c=rI(3,8);return[`(${a} − ${b}) × ${c}`,(a-b)*c]},
     ()=>{const c=rI(4,9),r=rI(6,15),a=rI(8,c*r-8),d=rI(12,60);return[`(${a} + ${c*r-a}) ÷ ${c} + ${d}`,r+d]}]],
  fin:[
    [()=>{const a=rI(8,15),b=rI(4,9),c=rI(2,5),d=rI(2,5);return[`(${a} + ${b}) − (${c} + ${d})`,a+b-c-d]},
     ()=>{const a=rI(2,5),b=rI(2,5),c=rP([2,5,10]);return[`(${a} + ${b}) × ${c}`,(a+b)*c]},
     ()=>{const a=rI(20,40),b=rI(5,9),c=rI(4,9);return[`${a} − (${b} + ${c}) + 10`,a-b-c+10]}],
    [()=>{const a=rI(3,9),b=rI(3,9),c=rI(3,8),d=rI(5,20);return[`(${a} + ${b}) × ${c} − ${d}`,(a+b)*c-d]},
     ()=>{const a=rI(4,9),b=rI(4,9),c=rI(3,9),d=rI(3,9);return[`(${a} × ${b}) + (${c} × ${d})`,a*b+c*d]},
     ()=>{const a=rI(5,9),b=rI(12,20),c=rI(3,9);return[`${a} × (${b} − ${c}) + ${c}`,a*(b-c)+c]}],
    [()=>{const a=rI(6,15),b=rI(6,15),c=rI(3,8),d=rI(3,8);return[`(${a} + ${b}) × (${c} + ${d})`,(a+b)*(c+d)]},
     ()=>{const a=rI(12,19),b=rI(4,9),c=rI(4,9),d=rI(5,9);return[`${a} × ${b} − (${c} + ${d}) × 2`,a*b-(c+d)*2]},
     ()=>{const a=rI(25,60),b=rI(15,40),c=rI(4,9);return[`(${a} + ${b}) × ${c}`,(a+b)*c]}]],
};
function task(type,d){for(let i=0;i<20;i++){const t=rP(TASKS[type][d])();if(t[1]>=0&&Number.isInteger(t[1]))return t}return["2 + 2",4]}
/* Sekunden für Tempo-Bonus [×1.5, ×1.25] je Attacke */
const BONUS={hieb:[5,10],kick:[7,14],wurf:[12,22],fin:[16,30]};
