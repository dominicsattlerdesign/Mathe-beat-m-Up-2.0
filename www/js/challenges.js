/* ---------- Herausforderungen: Freischalten nicht nur über die Story ----------
   Statistik in SAVE.st, geschaffte Herausforderungen in SAVE.chd. Belohnung: f = Kämpfer, o = zweites Outfit, a = Arena (Besitzer-ID),
   b = Bonus-Arena (Index in STG). Was schon frei ist, bleibt frei. */
if(!SAVE.st)SAVE.st={};if(!Array.isArray(SAVE.chd))SAVE.chd=[];
const STD=()=>{const s=SAVE.st;s.atk=s.atk||{};s.k=s.k||{};s.def=s.def||{};s.defM=s.defM||{};for(const k of["ok","blitz","streak","best","fin","winA","winV","clash","flaw","hard"])s[k]=s[k]||0;return s};
const atkOf=(id,k)=>((STD().atk[id]||{})[k]||0),atkSum=k=>Object.values(STD().atk).reduce((n,a)=>n+(a[k]||0),0);
const bonusIdx=n=>STG.findIndex(x=>x.bonus&&x.en==n);
/* Text-Bausteine in vier Sprachen */
const T4=(de,en,fr,es)=>()=>L(de,en,fr,es);
const ANAME={hieb:["Hieb","Punch","Coup","Puño"],kick:["Kick","Kick","Coup de pied","Patada"],wurf:["Wurf","Throw","Lancer","Lanzamiento"]};
const an=k=>L(...ANAME[k]);
/* Signatur-Attacke je Kämpfer für die Outfit-Herausforderungen */
const OUTK={raiko:"kick",akane:"hieb",rokka:"wurf",zeno:"wurf",tetsu:"wurf",volt:"hieb",luna:"wurf",goro:"hieb",shade:"hieb",mika:"kick",drako:"hieb",oni:"hieb",seraph:"kick",kaiser:"wurf",magus:"wurf"};
const cn=id=>CH.find(c=>c.id==id).n;
const CHL=[
  /* Kämpfer */
  {id:"f_rokka",r:["f","rokka"],need:30,v:()=>atkSum("wurf"),t:()=>L("Lande 30 Würfe","Land 30 throws","Réussis 30 lancers","Acierta 30 lanzamientos")},
  {id:"f_volt",r:["f","volt"],need:25,v:()=>STD().blitz,t:()=>L("Löse 25 Aufgaben blitzschnell (×1,5)","Solve 25 problems lightning fast (×1.5)","Résous 25 calculs ultra-rapides (×1,5)","Resuelve 25 cuentas rapidísimo (×1,5)")},
  {id:"f_goro",r:["f","goro"],need:5,v:()=>STD().winA,t:()=>L("Gewinne 5 Freie Kämpfe","Win 5 free fights","Gagne 5 combats libres","Gana 5 combates libres")},
  {id:"f_shade",r:["f","shade"],need:10,v:()=>STD().best,t:()=>L("10 richtige Antworten am Stück","10 correct answers in a row","10 bonnes réponses d’affilée","10 respuestas correctas seguidas")},
  {id:"f_mika",r:["f","mika"],need:50,v:()=>atkSum("kick"),t:()=>L("Lande 50 Kicks","Land 50 kicks","Réussis 50 coups de pied","Acierta 50 patadas")},
  {id:"f_drako",r:["f","drako"],need:3,v:()=>STD().defM.akane||0,t:()=>L("Besiege Akane 3× auf Mittel oder Schwer","Beat Akane 3× on Medium or Hard","Bats Akane 3× en Moyen ou Difficile","Vence a Akane 3× en Medio o Difícil")},
  {id:"f_oni",r:["f","oni"],need:5,v:()=>STD().fin,t:()=>L("Schaffe 5 Finisher","Land 5 finishers","Réussis 5 finishers","Consigue 5 remates")},
  {id:"f_seraph",r:["f","seraph"],need:3,v:()=>STD().flaw,t:()=>L("Gewinne 3 Kämpfe ohne falsche Antwort","Win 3 fights without a wrong answer","Gagne 3 combats sans erreur","Gana 3 combates sin fallar")},
  {id:"f_mimi",r:["f","mimi"],need:10,v:()=>atkSum("sig"),t:()=>L("Setze 10 Spezialattacken ein","Use 10 special attacks","Utilise 10 attaques spéciales","Usa 10 ataques especiales")},
  /* zweite Outfits: 25× die Lieblingsattacke mit genau diesem Kämpfer */
  ...Object.entries(OUTK).map(([id,k])=>({id:"o_"+id,r:["o",id],need:25,v:()=>atkOf(id,k),t:()=>L(`Nutze mit ${cn(id)} 25× ${an(k)}`,`Use ${an(k)} 25× with ${cn(id)}`,`Utilise ${an(k)} 25× avec ${cn(id)}`,`Usa ${an(k)} 25× con ${cn(id)}`)})),
  /* Arenen der freispielbaren Kämpfer: den Besitzer zweimal besiegen */
  ...["rokka","volt","goro","shade","mika","drako","oni","seraph","kaiser","magus","mimi"].map(id=>({id:"a_"+id,r:["a",id],need:2,v:()=>STD().def[id]||0,t:()=>L(`Besiege ${cn(id)} 2×`,`Beat ${cn(id)} 2×`,`Bats ${cn(id)} 2×`,`Vence a ${cn(id)} 2×`)})),
  /* Bonus-Arenen über Rechen-Aufgaben (gibt es in Mittel und Schwer) */
  {id:"b_neon",r:["b","Neon Alley"],need:30,v:()=>STD().k.seq||0,t:()=>L("Löse 30 Zahlenfolgen","Solve 30 number patterns","Résous 30 suites de nombres","Resuelve 30 series de números")},
];
/* Belohnung: Name, Bild und ob sie schon frei ist */
function rwInfo(r){const[t,id]=r;
  if(t=="f"){const i=CH.findIndex(c=>c.id==id);return{n:CH[i].n,img:CH[i].bust,has:unlocked(CH[i]),what:L("Kämpfer","Fighter","Combattant","Luchador")}}
  if(t=="o"){const c=CH.find(c=>c.id==id);return{n:c.alt?L(c.alt.on[0],c.alt.on[1]):"",img:c.bust,has:altOk(c),what:L("Outfit für ","Outfit for ","Tenue pour ","Traje para ")+c.n}}
  if(t=="a"){const i=arenaOf(CH.find(c=>c.id==id));return{n:STG[i].n,st:i,has:stageOk(i),what:L("Arena","Arena","Arène","Arena")}}
  if(t=="b"){const i=bonusIdx(id);return{n:STG[i].n,st:i,has:SAVE.bst.includes(i),what:L("Bonus-Arena","Bonus arena","Arène bonus","Arena extra")}}
  return{n:L("Trophäe","Trophy","Trophée","Trofeo"),has:false,what:""}}
function rwGive(r){const[t,id]=r;if(t=="f"&&!SAVE.unl.includes(id))SAVE.unl.push(id);if(t=="o"&&!SAVE.alts.includes(id))SAVE.alts.push(id);if(t=="a"&&!SAVE.ars.includes(id))SAVE.ars.push(id);if(t=="b"){const i=bonusIdx(id);if(i>=0&&!SAVE.bst.includes(i))SAVE.bst.push(i)}}
/* prüfen, ob etwas neu geschafft ist */
function chCheck(){let n=0;for(const c of CHL){if(SAVE.chd.includes(c.id)||c.v()<c.need)continue;const info=rwInfo(c.r);SAVE.chd.push(c.id);rwGive(c.r);n++;
  toast(L("Herausforderung geschafft!","Challenge complete!","Défi réussi !","¡Reto superado!"),c.t()+(c.r[0]&&!info.has?" → "+info.what+(c.r[0]=="o"?"":": ")+(c.r[0]=="o"?"":info.n):""),c.r[0]=="f"||c.r[0]=="o"?info.img:null)}
  if(n){save();sfx("unlock")}}
/* Hinweis, wie man etwas Gesperrtes freispielt (mit Fortschritt) */
function chHint(t,id){
  if(t=="f"&&id=="kaiser")return L("Schaffe die Story auf Mittel oder Schwer.","Clear the story on Medium or Hard.","Termine l’histoire en Moyen ou Difficile.","Supera la historia en Medio o Difícil.");
  if(t=="f"&&id=="magus")return L("Schaffe die Story auf Schwer.","Clear the story on Hard.","Termine l’histoire en Difficile.","Supera la historia en Difícil.");
  if(t=="b"&&id=="Playroom")return L("Story 1× schaffen","Clear the story once","Termine l’histoire 1×","Supera la historia 1×");
  if(t=="b"&&id=="Arcade Hall")return L(`Story 3× schaffen (${Math.min(3,SAVE.done)}/3)`,`Clear the story 3× (${Math.min(3,SAVE.done)}/3)`,`Termine l’histoire 3× (${Math.min(3,SAVE.done)}/3)`,`Supera la historia 3× (${Math.min(3,SAVE.done)}/3)`);
  const c=CHL.find(c=>c.r[0]==t&&c.r[1]==id);if(!c)return L("Noch gesperrt","Locked");
  return L("Herausforderung","Challenge","Défi","Reto")+": "+c.t()+` (${Math.min(c.v(),c.need)}/${c.need})`}
/* Statistik-Ereignisse aus dem Spiel */
const ST={
  ok(id,k,mu,kind){const s=STD();s.ok++;s.streak++;s.best=Math.max(s.best,s.streak);if(mu>1.4)s.blitz++;if(kind)s.k[kind]=(s.k[kind]||0)+1;
    if(k=="fin")s.fin++;else{const a=s.atk[id]=s.atk[id]||{};a[k]=(a[k]||0)+1}FW.ok++;chCheck();save()},
  bad(){STD().streak=0;FW.bad++;save()},
  ko(eid){const s=STD();s.def[eid]=(s.def[eid]||0)+1;if(SAVE.diff>=2)s.defM[eid]=(s.defM[eid]||0)+1;chCheck();save()},
  win(m){const s=STD();if(m=="v")return;if(m=="a")s.winA++;if(FW.bad==0&&FW.ok>0)s.flaw++;if(SAVE.diff==3)s.hard++;chCheck();save()},
  fight(){FW.ok=0;FW.bad=0},
};
const FW={ok:0,bad:0};

/* kleine Meldung oben im Bild, auch mitten im Kampf */
const TQ=[];let tBusy=false;
function toast(title,txt,img){TQ.push([title,txt,img]);if(!tBusy)toastNext()}
function toastNext(){const it=TQ.shift();if(!it){tBusy=false;return}tBusy=true;let el=$("#toast");if(!el){el=document.createElement("div");el.id="toast";document.body.appendChild(el)}
  el.innerHTML=(it[2]?`<img src="${it[2]}" alt="">`:`<i>★</i>`)+`<div><b>${it[0]}</b><span>${esc(it[1])}</span></div>`;el.className="";void el.offsetWidth;el.className="go";setTimeout(()=>{el.className="out";setTimeout(toastNext,400)},3200)}

/* Bildschirm „Herausforderungen“ */
function chScreen(){const done=SAVE.chd.length;
  const row=c=>{const v=Math.min(c.v(),c.need),ok=SAVE.chd.includes(c.id),info=rwInfo(c.r);
    const pic_=info.img?`<img src="${info.img}" alt="">`:info.st!=null?`<span class="cst" style="${arStyle(info.st)}"></span>`:`<i>★</i>`;
    return`<div class="chr${ok?" ok":""}">${pic_}<div class="cht"><b>${c.t()}</b><small>${c.r[0]?info.what+(c.r[0]=="o"?" · "+info.n:": "+info.n):info.n}</small><div class="chb"><i style="width:${v/c.need*100}%"></i></div></div><span class="chv">${ok?"✓":v+"/"+c.need}</span></div>`};
  menu(`<h2>${L("Herausforderungen","Challenges","Défis","Retos")}</h2><p class="tag">${done} / ${CHL.length} ${L("geschafft","done","réussis","superados")}</p>
   <div class="chl">${CHL.map(row).join("")}</div><button class="btn alt sm" data-a="home">${L("Zurück","Back")}</button>`,1)}
ACTIONS.chal=chScreen;
/* beim Start einmal prüfen (z. B. nach einem Update mit neuen Herausforderungen) */
setTimeout(()=>{try{chCheck()}catch(e){}},1500);
