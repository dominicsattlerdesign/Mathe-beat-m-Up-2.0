/* ---------- Spielablauf: Menüs, Touch-Steuerung, Kampf, Finisher ---------- */
const SAVE=(()=>{const s={done:0,diff:1,mute:false,story:null,name:"",lb:[],lang:(navigator.language||"de").slice(0,2)=="en"?"en":"de",vol:{m:.8,s:.9},track:0,alts:[],of:{},bst:[],arena:-1,ars:[],q:null};
  try{const n=localStorage.getItem("mb3");if(n)Object.assign(s,JSON.parse(n));else{const o=JSON.parse(localStorage.getItem("mrb2")||"null");if(o){s.done=o.done||0;s.diff=Math.min(3,(o.diff||0)+1);s.mute=!!o.mute}}}catch(e){}
  if(!Array.isArray(s.lb))s.lb=[];if(!s.vol)s.vol={m:.8,s:.9};if(!Array.isArray(s.alts))s.alts=[];if(!s.of)s.of={};if(!Array.isArray(s.bst))s.bst=[];if(s.arena==null)s.arena=-1;if(!Array.isArray(s.ars))s.ars=[];
  /* Grafikstufe: beim ersten Start nach Gerät raten (wenige Kerne, wenig Speicher oder kleiner Bildschirm = mittel) */
  if(s.q==null)s.q=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=3||Math.min(screen.width,screen.height)<500?1:2;LANG=s.lang;return s})();
const save=()=>{try{localStorage.setItem("mb3",JSON.stringify(SAVE))}catch(e){}};
const esc=t=>String(t).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";"),fmtT=t=>Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
/* Freigespielte Kämpfer stehen in SAVE.unl. Alte Spielstände (Freischalten nach Anzahl Durchgänge) werden übernommen. */
if(!Array.isArray(SAVE.unl)){SAVE.unl=CH.filter((c,i)=>i>=5&&SAVE.done>=i-4).map(c=>c.id)}
const unlocked=ch=>!ch.lock||SAVE.unl.includes(ch.id);
/* Nächster Kämpfer nach einem Story-Sieg, immer zufällig aus den gesperrten:
   in "Mittel" aus allen (Bosse inklusive), in den anderen Stufen nur aus den normalen Kämpfern */
const nextUnl=d=>{const free=CH.filter(c=>c.lock&&!unlocked(c)&&(d==2||!c.boss));return free.length?P(free):null};
/* Zweites Outfit: frei, wenn die Story mit dieser Figur geschafft wurde. useAlt = Spieler hat es gewählt. */
const altOk=c=>SAVE.alts.includes(c.id),useAlt=i=>!!(SAVE.of[CH[i].id]&&altOk(CH[i]));
const pic=(i,k,o=useAlt(i))=>o?(altPics(CH[i]),CH[i][k+"2"]):CH[i][k];
let lastUnl={c:[],o:null,s:null},lives=2;
const hearts=()=>`<span class="lives">${"♥".repeat(lives)}<s>${"♥".repeat(Math.max(0,2-lives))}</s></span>`;
/* Arenen: jede Figur hat ihre eigene (own). Die der fünf Start-Figuren sind frei, die anderen kommen über die Story mit der Figur.
   Bonus-Arenen: frei über Story-Siege auf "Schwer", eine pro Sieg in fester Reihenfolge. */
const owner=i=>CH.find(c=>c.id==STG[i].own),arenaOf=c=>STG.findIndex(x=>x.own==c.id);
const stageOk=i=>{const x=STG[i];if(x.bonus)return SAVE.bst.includes(i);if(x.own)return CH.indexOf(owner(i))<5||SAVE.ars.includes(x.own);return true},okStages=()=>STG.map((s,i)=>i).filter(stageOk);
const ATK={hieb:{n:"HIEB",kj:"拳",dm:6,c:0xff5a1a},kick:{n:"KICK",kj:"蹴",dm:10,c:0x25d4ff},wurf:{n:"WURF",kj:"投",dm:15,c:0x9a6bff},sig:{n:"SPEZIAL",dm:30}};
bi(ATK.hieb,"n","HIEB","PUNCH");bi(ATK.wurf,"n","WURF","THROW");bi(ATK.sig,"n","SPEZIAL","SPECIAL");
const QUIPS={};bi(QUIPS,"ko",["Das gibt Kopfweh.","Gute Nacht!","Autsch.","Sternchen zählen …","Der steht so schnell nicht auf."],["That’ll leave a mark.","Good night!","Ouch.","Counting stars …","Not getting up anytime soon."]);
bi(QUIPS,"bad",["Knapp daneben ist auch vorbei.","Das Ergebnis hat sich versteckt.","Fast! Nochmal.","Kopf hoch, weiter."],["Close isn’t quite right.","The answer went into hiding.","Almost! Try again.","Chin up, keep going."]);
const WORDS=[];[[["ZACK!","BAM!","PAFF!","TOK!"],["WHAP!","BAM!","POW!","TOK!"]],[["WUMMS!","KRACH!","DONG!","BÄMM!"],["WHAM!","CRASH!","DONG!","BOOM!"]],[["KRAWUMM!","RUMMS!","KABOOM!"],["KABLAM!","KRAKOOM!","KABOOM!"]]].forEach((w,i)=>bi(WORDS,i,w[0],w[1]));
const HERO=()=>L("Held","Hero"),qt=t=>L(`„${t}“`,`“${t}”`);
let mode="a",lvl=1,pickC=0,selC=0,pl=null,en=null,fighters=[],over=true,lock=false,sel=null,inp="",cards={},Q=Promise.resolve(),busy=0,fid=0,paused=false,pauseAt=0,stageI=0,round=1,wins={p:0,e:0},storyT=0,fo="none",cd={last:null,n:0,lock:null,left:0};
let T=0,hs=0,TSb=1,last=performance.now();
const q=fn=>{const id=fid;busy++;Q=Q.then(()=>id==fid&&fn()).catch(e=>console.error(e)).then(()=>{if(id==fid)busy--})};
const msg=t=>$("#msg").textContent=t;

/* ----- kleine Bildschirm-Effekte ----- */
function pop(t,col,x,y=3.4,cls=""){const[px,py]=scr(x,y),d=document.createElement("div");d.className="pop "+cls;d.textContent=t;d.style.left=px+"px";d.style.top=py+"px";if(col)d.style.color=col;document.body.appendChild(d);setTimeout(()=>d.remove(),950)}
function banner(t,sub){const b=$("#bn");b.innerHTML=(sub?`<small>${sub}</small>`:"")+t;b.classList.remove("go");void b.offsetWidth;b.classList.add("go")}
function flash(c){const f=$("#fl");f.style.background=typeof c=="number"?hex(c):c;f.classList.remove("go");void f.offsetWidth;f.classList.add("go")}
/* Kino-Modus: Balken, Vignette, Szene abdunkeln (Lichter werden danach wiederhergestellt) */
const LT={h:null};function cine(on){const was=document.body.classList.contains("cine");document.body.classList.toggle("cine",on);
  if(on&&!was){LT.h=hemi.intensity;LT.s=sun.intensity;hemi.intensity*=.42;sun.intensity*=.5}else if(!on&&was&&LT.h!=null){hemi.intensity=LT.h;sun.intensity=LT.s;LT.h=null}}
const speed=on=>$("#speed").classList.toggle("on",on);
/* Anime-Einblendung: Porträt und Attackenname rauschen auf einem schrägen Band durchs Bild */
function cutIn(f,title,sub){const el=$("#cut");document.documentElement.style.setProperty("--cc",hex(f.ch.c));el.querySelector("img").src=f.ch.o?(f.ch.bust2||f.ch.bust):f.ch.bust;
  el.querySelector("b").textContent=title;el.querySelector("small").textContent=sub;el.className="";void el.offsetWidth;el.className="go"+(f.isP?"":" r");sfx("whoosh")}
/* farbiger Randblitz bei harten Treffern */
function edgeFlash(c){const f=$("#fl");f.style.background=`radial-gradient(ellipse at center,transparent 35%,${typeof c=="number"?hex(c):c} 120%)`;f.classList.remove("go");void f.offsetWidth;f.classList.add("go")}
function impactFrame(ms=90){cv.classList.add("impact");setTimeout(()=>cv.classList.remove("impact"),ms)}

/* ----- Kämpfer im Kampf ----- */
function mkF(ch,side,isP,scale=1,o=0){const f=buildFighter(ch,o);f.side=side;f.isP=isP;f.hx=side*2.1;f.root.position.x=f.hx;f.root.scale.set(side>0?-scale:scale,scale,scale);f.sc*=scale;f.rs=scale;sc.add(f.root);
  f.max=f.hp=86+ch.st[1]*7;f.dm=.82+ch.st[0]*.07;f.mg=.7+ch.st[2]*.12;f.mt=0;snapPose(f);return f}
function clearFighters(){for(const f of fighters){sc.remove(f.root);const h=f.J.hd.children[0].material;h.map&&h.map.dispose();h.dispose()}fighters=[];pl=en=null}
function hud(){$("#ph").style.width=$("#pht").style.width=pl.hp/pl.max*100+"%";$("#eh").style.width=$("#eht").style.width=en.hp/en.max*100+"%";$("#pm").style.width=pl.mt+"%";
  const full=pl.mt>=100;$("#pmb").classList.toggle("full",full);const f=$("#fin");f.classList.toggle("rdy",full);f.classList.toggle("sel",sel=="sig");f.firstElementChild.style.width=pl.mt+"%";
  $("#fint").textContent=full?ATK.sig.n+" · "+pl.ch.sig.toUpperCase():ATK.sig.n+" "+Math.round(pl.mt)+" %";$("#finq").textContent=full?cards.sig.q[0]:"";
  const er=en.mt>=100;$("#ecb").classList.toggle("full",er);$("#elbl").textContent=er?L("SPEZIAL BEREIT!","SPECIAL READY!"):L("GEGNER-ANGRIFF","ENEMY ATTACK");
  for(const[id,n]of[["#pw",wins.p],["#ew",wins.e]])document.querySelectorAll(id+" i").forEach((e,i)=>e.classList.toggle("w",i<n))}
const newCard=k=>({q:task(k,SAVE.diff),t0:0});
function render(){const lb=LABELS[SAVE.diff?1:0];
  $("#cards").innerHTML=["hieb","kick","wurf"].map(k=>{const LK=cd.lock==k;return`<button type="button" class="card ${k}${sel==k?" sel":""}${LK?" cdl":""}" data-k="${k}"><span class="kj">${ATK[k].kj}</span><b>${ATK[k].n}</b><small>${LK?(LANG=="en"?"Resting · "+cd.left+" more":"Pause · noch "+cd.left+" andere"):lb[k]}</small><div class="q${cards[k].q[0].length>13?" lg":""}">${LK?(LANG=="en"?"locked":"gesperrt"):cards[k].q[0]}</div></button>`}).join("");
  document.body.classList.toggle("lock",lock);hud();renderAns()}
function renderAns(){const t=sel&&cards[sel].q[0];const pt=t&&t.split("▢"),em=`<em>${inp||"?"}</em>`;
  /* Bei gesuchter Zahl steht die Eingabe direkt in der Lücke, sonst hinter dem Gleichheitszeichen */
  $("#ans").innerHTML=sel?(pt.length>1?`<span>${pt[0]}</span>${em}<span>${pt[1]}</span>`:`<span>${t} =</span>${em}`)+`<u id="bl"></u><i id="bon"></i>`:`<span class="hint">${lock?L("Dein Kämpfer greift an …","Your fighter attacks …"):L("Attacke antippen, dann rechnen.","Tap an attack, then solve it.")}</span>`}
function pick(k){if(over||lock||paused||(k=="sig"&&pl.mt<100)||(k=="fin"&&fo!="on"))return;
  if(k==cd.lock){sfx("wrong");msg(L(`${ATK[k].n} macht Pause. Schaffe erst ${cd.left==1?"eine andere Attacke":cd.left+" andere Attacken"}!`,`${ATK[k].n} needs a rest. Land ${cd.left==1?"one other attack":cd.left+" other attacks"} first!`));return}
  if(sel!=k)inp="";sel=k;if(!cards[k].t0)cards[k].t0=performance.now();sfx("pick");render()}
function press(k){if(over||lock||paused||!sel)return;
  if(k=="del"){inp=inp.slice(0,-1);sfx("key")}else if(k=="ok")return submit();else if(inp.length<6){inp+=k;sfx("key")}renderAns()}
/* Finisher-Angebot: Gegner taumelt, 15 Sekunden für eine schwere Aufgabe. Gibt es nur einmal pro Kampf. */
function offerFin(){fo="on";en.dizzy=true;pose(en,"dizzy",8);dizzyStars(en);cards.fin={q:task("fin",SAVE.diff),t0:performance.now()};sel="fin";inp="";sfx("unlock");colorBurst(0xffc21a,0xff3b2f,3);
  const f=$("#fo");f.hidden=false;f.querySelector("span").textContent="必殺 FINISHER · "+pl.ch.fin;f.querySelector("b").textContent=cards.fin.q[0];msg(L(`${en.ch.n} taumelt! Löse die Aufgabe in ${FIN_TIME} Sekunden.`,`${en.ch.n} is dizzy! Solve it within ${FIN_TIME} seconds.`));render()}
function endOffer(t){fo="used";$("#fo").hidden=true;en.dizzy=false;if(busy==0&&en.hp>0)pose(en,"idle",10);if(sel=="fin"){sel=null;inp=""}if(t)msg(t);render()}
function submit(){if(!sel||inp===""||lock||over)return;
  const k=sel,c=cards[k],ok=+inp==c.q[1],el=(performance.now()-c.t0)/1000,th=BONUS[k];sel=null;inp="";lock=true;
  if(k=="fin"){fo="used";$("#fo").hidden=true;
    if(ok){sfx("ok");msg("Finisher!");q(async()=>{await attack(pl,en,"fin",1);lock=false;if(!over)render()})}
    else{sfx("wrong");endOffer(L(`Daneben! ${c.q[0].includes("▢")?"▢":c.q[0]} = ${c.q[1]}. Der Finisher ist futsch, jetzt normal zu Ende kämpfen.`,`Missed! ${c.q[0].includes("▢")?"▢":c.q[0]} = ${c.q[1]}. The finisher is gone, win the fight the normal way.`));q(async()=>{pose(pl,"stumble",20);await wait(.65);pose(pl,"idle",12);lock=false;if(!over)render()})}
    return render()}
  cards[k]=newCard(k);let note="";
  if(k!="sig"){if(cd.last==k)cd.n++;else{cd.last=k;cd.n=1}
    if(ok&&cd.lock&&k!=cd.lock&&--cd.left<=0){note=L(` ${ATK[cd.lock].n} ist wieder frei.`,` ${ATK[cd.lock].n} is ready again.`);cd.lock=null}
    if(cd.n>=3){cd.lock=k;cd.left=2;cd.n=0;cd.last=null;note=L(` Dreimal ${ATK[k].n} am Stück: Der macht jetzt Pause, bis du 2 andere Attacken schaffst.`,` Three ${ATK[k].n}es in a row: it rests until you land 2 other attacks.`)}}
  else if(ok&&cd.lock&&--cd.left<=0){note=L(` ${ATK[cd.lock].n} ist wieder frei.`,` ${ATK[cd.lock].n} is ready again.`);cd.lock=null}
  if(ok){const mu=el<=th[0]?1.5:el<=th[1]?1.25:1;sfx("ok");msg((mu>1.4?L("Blitzschnell! Schaden ×1,5.","Lightning fast! Damage ×1.5."):mu>1?L("Schnell gerechnet! Schaden ×1,25.","Quick maths! Damage ×1.25."):L("Richtig!","Correct!"))+note);if(k=="sig")pl.mt=0;
    q(async()=>{await attack(pl,en,k,mu);lock=false;if(!over)render()})}
  else{sfx("wrong");msg(`${P(QUIPS.bad)} ${c.q[0].includes("▢")?"▢":c.q[0]} = ${c.q[1]}.`+note);en.timer-=en.iv*.15;
    q(async()=>{pose(pl,"stumble",20);pop("?!","#a79fc7",pl.root.position.x,4);await wait(.65);pose(pl,"idle",12);lock=false;if(!over)render()})}
  render()}
$("#pad").innerHTML=["1","2","3","4","5","6","7","8","9","0","del","ok"].map(k=>`<button type="button" class="k${k=="ok"?" ok":k=="del"?" del":""}" data-k="${k}">${k=="del"?"⌫":k=="ok"?"OK":k}</button>`).join("");
$("#pad").addEventListener("pointerdown",e=>{const b=e.target.closest("[data-k]");if(!b)return;e.preventDefault();b.classList.add("dn");setTimeout(()=>b.classList.remove("dn"),110);press(b.dataset.k)});
$("#cards").addEventListener("pointerdown",e=>{const b=e.target.closest("[data-k]");if(b){e.preventDefault();pick(b.dataset.k)}});
$("#fin").addEventListener("pointerdown",e=>{e.preventDefault();pick("sig")});
$("#fo").addEventListener("pointerdown",e=>{e.preventDefault();pick("fin")});
addEventListener("keydown",e=>{if(e.target&&e.target.tagName=="INPUT")return;if(e.key>="0"&&e.key<="9"&&e.key.length==1)press(e.key);else if(e.key=="Backspace")press("del");else if(e.key=="Enter")press("ok")});
document.addEventListener("gesturestart",e=>e.preventDefault());document.addEventListener("contextmenu",e=>e.preventDefault());

/* ----- Bewegungs-Bausteine ----- */
const fx_=f=>f.root.position;
async function dash(f,tx,dur=.2){const x0=fx_(f).x;if(Math.abs(tx-x0)<.1)return;f.run=true;pose(f,"run",30);sfx("swoosh");streak(tx,1.7*f.sc,Math.sign(tx-x0),f.ch.c,Math.min(4,Math.abs(tx-x0)));
  await tw(dur,p=>{fx_(f).x=lerp(x0,tx,ease(p))});f.run=false}
async function backHop(f){const x0=fx_(f).x,y0=fx_(f).y;if(Math.abs(f.hx-x0)<.2&&y0<.1){pose(f,"idle",12);return}f.grounded=false;pose(f,"kickCh",22);sfx("jump");
  const hh=Math.abs(f.hx-x0)>3.4?3.3:1.7;
  await tw(hh>2?.5:.4,p=>{fx_(f).x=lerp(x0,f.hx,p);fx_(f).y=lerp(y0,0,p)+Math.sin(p*Math.PI)*hh;f.piv.rotation.x=-Math.PI*2*ease(p)});
  f.piv.rotation.x=0;fx_(f).y=0;f.grounded=true;pose(f,"idle",16);dust(f.hx,0,3);sfx("land")}
async function landA(a,dur=.16){const y0=fx_(a).y;await tw(dur,p=>{fx_(a).y=y0*(1-p)});fx_(a).y=0;a.piv.rotation.x=0;a.turn.rotation.y=FACE;a.grounded=true;pose(a,"idle",14);sfx("land")}
async function launch(b,toX,h,dur,spins=1,o={}){b.grounded=false;b.downed=true;pose(b,"air",20);const x0=fx_(b).x,y0=fx_(b).y,r0=b.piv.rotation.x,yl=-1.32*b.sc,r1=-(spins*2*Math.PI+Math.PI/2);toX=clamp(toX,-7.1,7.1);
  await tw(dur,p=>{fx_(b).x=lerp(x0,toX,p);fx_(b).y=lerp(y0,yl,p*p)+Math.sin(p*Math.PI)*h;b.piv.rotation.x=lerp(r0,r1,p)});
  b.piv.rotation.x=-Math.PI/2;pose(b,"down",25);dust(toX,0,9);CAM.shake=Math.max(CAM.shake,.3);if(o.land)o.land();else{sfx("land");breakNear(toX,1.9,Math.sign(toX)||1,1,4);crack(toX,1.4,1)}
  const x1=toX,x2=clamp(toX+Math.sign(toX-x0)*.7,-7.3,7.3);await tw(.3,p=>{fx_(b).y=yl+Math.sin(p*Math.PI)*.4;fx_(b).x=lerp(x1,x2,p)})}
async function getUp(b){await wait(.3);const y0=fx_(b).y;pose(b,"crouch",14);await tw(.28,p=>{b.piv.rotation.x=-Math.PI/2*(1-ease(p));fx_(b).y=y0*(1-p)});b.piv.rotation.x=0;fx_(b).y=0;b.grounded=true;b.downed=false;b.turn.rotation.y=FACE}
async function recover(a,b){await Promise.all([backHop(a),(async()=>{if(b.downed)await getUp(b);await dash(b,b.hx,.28);pose(b,b.dizzy?"dizzy":"idle",12)})()]);a.turn.rotation.y=b.turn.rotation.y=FACE}
/* Countdown vor jeder Runde: 3, 2, 1, Rechnen! gross zwischen den Kämpfern. Erst danach darf man angreifen. */
async function countdown(){const id=fid,el=$("#cdn");
  for(const t of["3","2","1",L("Rechnen!","Solve!")]){if(id!=fid||!pl)return false;const[px,py]=scr((fx_(pl).x+fx_(en).x)/2,2.7);el.style.left=px+"px";el.style.top=py+"px";el.textContent=t;
    el.className="";void el.offsetWidth;el.className=t.length>1?"go word":"go";sfx(t.length>1?"gong":"pick");await rt(t.length>1?.85:.72)}
  el.className="word out";return id==fid}
function koFx(){banner("K.O.!",P(QUIPS.ko));impactFrame(110);sfx("ko");flash("#fff");TSb=.22;rt(1.2).then(()=>TSb=1)}
function impact(a,b,dmg,o={}){
  dmg=Math.max(1,Math.round(dmg));b.hp=Math.max(0,b.hp-dmg);const d=-a.side,x=fx_(b).x,lv=o.lv||0,y=o.y!=null?o.y:2.1*b.sc+fx_(b).y,cx=x-d*.45;
  star(cx,y,a.ch.c,o.big?3.2:1.3+lv*.55);glow(cx,y,a.ch.c,o.big?12:3.2+lv*1.8,.32);colorBurst(a.ch.c,a.kc||0xffffff,o.big?3.4:1.5+lv*.8);sparks(cx,y,.6,o.big?48:12+lv*8,[0xffffff,0xffe14d,a.ch.c],7+lv*2.5);
  hitRing(cx,y,a.ch.c,o.big?2.4:.8+lv*.45);if(lv||o.big)burstLines(cx,y,a.ch.c,o.big?18:8+lv*3,o.big?4.2:1.8+lv*.7);if(lv>=2||o.big){edgeFlash(a.ch.c);dust(x,0,6+lv*3)}if(o.arc)slashArc(cx,y,a.ch.c,rnd(6),1.4+lv*.4);
  if(!o.quiet)pop(P(WORDS[o.big?2:lv]),hex(a.ch.c),x-d*.3,y+1.7);pop("−"+dmg,"#fff",x+d*.5,y+.8,"dm");
  CAM.shake=Math.max(CAM.shake,.13+lv*.2+(o.big?.95:0));flashLight(a.ch.c,2+lv,x,2);sfx(o.s||"punch");hs=o.stop!=null?o.stop:.045+lv*.035;
  breakNear(x,o.r||1.25,d,1+lv*.3,o.max||2);if(lv||o.big)crack(x,o.big?5:1+lv,o.big?2:lv);
  if(!o.nomt){const ka=a.isP?1:.75,kb=b.isP?1:.75;a.mt=Math.min(100,a.mt+dmg*1.05*a.mg*ka);b.mt=Math.min(100,b.mt+dmg*.75*kb)}
  hud();if(b.hp<=0&&!over&&!o.noKO){over=true;koFx()}
  if(!o.noReact){pose(b,"hurt",30);const bx=x;tw(.22,p=>{fx_(b).x=clamp(bx+d*(Math.sin(p*Math.PI)*.3+p*(o.push||.12)),-7,7)})}
}
/* ----- Attacken: jede Art hat mehrere Varianten, die abwechselnd drankommen ----- */
const slamLand=(a,b,dm)=>()=>{impact(a,b,dm,{lv:2,s:"slam",y:.5,noReact:1,r:2.7,max:6,stop:.12});ring(fx_(b).x,.06,0,a.ch.c,4)};
const MOVES={
 hieb:[
  {n:"Dreier-Kombo",async f(a,b,dm){const d=-a.side;await dash(a,fx_(b).x-d*1.5,.2);const seq=[["jab",.28],["cross",.3],["upper",.42]];
    for(let i=0;i<3;i++){pose(a,i==2?"windup":"idle",30);await wait(i==2?.14:.07);pose(a,seq[i][0],45);sfx("swoosh");await wait(.075);
      impact(a,b,dm*seq[i][1],{lv:i==2?1:0,arc:1,s:i==2?"heavy":"punch",y:(i==2?2.6:2.1)*b.sc,push:i==2?.5:.1,quiet:i==1});
      if(i==2&&b.hp>0){b.grounded=false;tw(.3,p=>{fx_(b).y=Math.sin(p*Math.PI)*.7}).then(()=>{b.grounded=true})}
      await wait(i==2?.3:.15)}}},
  {n:"Blitzschnitt",async f(a,b,dm){const d=-a.side,bx=fx_(b).x,x0=fx_(a).x,tx=clamp(bx+d*1.9,-6.8,6.8);pose(a,"windup",25);await wait(.24);sfx("whoosh");pose(a,"cross",50);streak(tx,1.8*a.sc,d,a.ch.c,6);
    await tw(.08,p=>{fx_(a).x=lerp(x0,tx,p)});slashArc(bx,2.1*b.sc,0xffffff,.4,2.8);pose(a,"hurl",30);await wait(.36);
    for(let i=0;i<3;i++)slashArc(bx+rnd(-.3,.3),2*b.sc+rnd(-.6,.6),i?a.ch.c:0xffffff,rnd(6),2.2);
    impact(a,b,dm,{lv:1,s:"heavy",stop:.12,push:.01});await wait(.3)}},
  {n:"Hammerfaust",async f(a,b,dm){const d=-a.side,x0=fx_(a).x,tx=fx_(b).x-d*1.15;pose(a,"crouch",25);await wait(.14);a.grounded=false;sfx("jump");pose(a,"skyfall",20);dust(x0,0,3);
    await tw(.3,p=>{fx_(a).x=lerp(x0,tx,p);fx_(a).y=eOut(p)*3.1});await wait(.07);sfx("whoosh");pose(a,"hurl",45);await tw(.1,p=>{fx_(a).y=3.1*(1-p*p)});fx_(a).y=0;a.grounded=true;
    impact(a,b,dm,{lv:2,s:"slam",y:3.1*b.sc,r:2,max:4,noReact:1,stop:.12});ring(fx_(b).x,.06,0,a.ch.c,3.5);dust(fx_(b).x,0,8);if(b.hp>0){pose(b,"crouch",35);await wait(.5)}}},
  {n:"Trommelfeuer",async f(a,b,dm){const d=-a.side;await dash(a,fx_(b).x-d*1.45,.18);
    for(let i=0;i<6;i++){pose(a,i%2?"cross":"jab",55);if(i%2==0)sfx("swoosh");await wait(.065);impact(a,b,dm*.12,{arc:i%2,quiet:i%3!=0,push:.05,stop:.02,y:(1.8+(i%3)*.3)*b.sc})}
    pose(a,"windup",30);await wait(.16);pose(a,"cross",50);sfx("swoosh");await wait(.07);impact(a,b,dm*.28,{lv:1,s:"heavy",arc:1,push:.7});await wait(.3)}},
 ],
 kick:[
  {n:"Wirbeltritt",async f(a,b,dm){const d=-a.side,x0=fx_(a).x,tx=fx_(b).x-d*1.55;
    pose(a,"crouch",25);await wait(.15);a.grounded=false;sfx("jump");pose(a,"kickCh",25);dust(x0,0,3);
    await tw(.36,p=>{fx_(a).x=lerp(x0,tx,ease(p));fx_(a).y=Math.sin(p*Math.PI)*1.5*(1-p*.5)+.55*p;a.turn.rotation.y=FACE+p*Math.PI*2;if(p>.55&&a.tp!==POSE.kick){pose(a,"kick",40);sfx("swoosh")}});
    a.turn.rotation.y=FACE;impact(a,b,dm,{lv:1,s:"kick",y:2.3*b.sc,noReact:1,arc:1,stop:.11});streak(fx_(b).x+d*2,1.6,d,0xffffff,4);
    await Promise.all([launch(b,b.side*6.3,1.4,.6,1),(async()=>{await wait(.12);await landA(a)})()])}},
  {n:"Fegetritt",async f(a,b,dm){const d=-a.side,x0=fx_(a).x,bx=fx_(b).x;pose(a,"slide",25);sfx("whoosh");
    await tw(.24,p=>{fx_(a).x=lerp(x0,bx-d*1.2,eOut(p));if(Math.random()<.4)dust(fx_(a).x,0,1)});
    impact(a,b,dm*.4,{s:"kick",y:.5,noReact:1,stop:.06});b.grounded=false;b.downed=true;pose(b,"air",25);pose(a,"crouch",25);
    await tw(.3,p=>{fx_(b).y=eOut(p)*1.5;b.piv.rotation.x=-eOut(p)*Math.PI/2});
    a.grounded=false;pose(a,"kick",50);sfx("swoosh");a.piv.rotation.x=-.5;await tw(.1,p=>{fx_(a).y=p*.9});
    impact(a,b,dm*.6,{lv:1,s:"kick",arc:1,noReact:1,y:fx_(b).y+1.6*b.sc,stop:.1});
    await Promise.all([launch(b,b.side*6.3,1.6,.62,1),landA(a)])}},
  {n:"Orkantritt",async f(a,b,dm){const d=-a.side,x0=fx_(a).x,tx=fx_(b).x-d*1.35;let h=0;pose(a,"crouch",25);await wait(.13);a.grounded=false;sfx("jump");pose(a,"kick",30);
    await tw(.75,p=>{fx_(a).x=lerp(x0,tx+d*.4*p,Math.min(1,p*2.2));fx_(a).y=.75+Math.sin(p*Math.PI)*.35;a.turn.rotation.y=FACE+p*Math.PI*6;
      const n=p>.86?3:p>.56?2:p>.28?1:0;if(n>h){h=n;sfx("swoosh");impact(a,b,dm*(h==3?.5:.25),{s:"kick",arc:1,lv:h==3?1:0,noReact:h==3,quiet:h==2,y:2.3*b.sc,push:.25,stop:h==3?.1:.03})}});
    a.turn.rotation.y=FACE;await Promise.all([launch(b,b.side*6.3,1.2,.55,1),landA(a)])}},
  {n:"Sturzflug-Tritt",async f(a,b,dm){const d=-a.side,x0=fx_(a).x,bx=fx_(b).x,ux=x0+d*.3,uy=4.2;pose(a,"crouch",25);await wait(.14);a.grounded=false;sfx("jump");pose(a,"kickCh",22);dust(x0,0,3);
    await tw(.32,p=>{fx_(a).x=lerp(x0,ux,p);fx_(a).y=eOut(p)*uy;a.piv.rotation.x=-Math.PI*2*p});a.piv.rotation.x=.75;pose(a,"kick",50);await wait(.13);sfx("whoosh");
    const tx=bx-d*1.2;streak(tx,2.2,d,a.ch.c,5);await tw(.13,p=>{fx_(a).x=lerp(ux,tx,p);fx_(a).y=lerp(uy,.5,p)});
    impact(a,b,dm,{lv:2,s:"kick",arc:1,noReact:1,y:2*b.sc,stop:.13,r:1.6});ring(bx,.06,0,a.ch.c,3);
    await Promise.all([launch(b,b.side*6.5,.5,.5,0),landA(a)])}},
 ],
 wurf:[
  {n:"Schleuderwurf",async f(a,b,dm){const d=-a.side;await dash(a,fx_(b).x-d*.95,.2);pose(a,"grab",35);sfx("grab");await wait(.14);
    b.grounded=false;b.downed=true;pose(b,"held",30);pose(a,"lift",16);const ax=fx_(a).x,bx=fx_(b).x,ly=3.72*a.sc-1.6*b.sc;
    await tw(.3,p=>{const e=ease(p);fx_(b).x=lerp(bx,ax,e);fx_(b).y=e*ly;b.piv.rotation.x=-e*Math.PI/2});
    sfx("whoosh");setTimeout(()=>sfx("whoosh"),230);
    await tw(.52,p=>{const r=FACE+ease(p)*Math.PI*4;a.turn.rotation.y=r;b.turn.rotation.y=r});
    a.turn.rotation.y=b.turn.rotation.y=FACE;pose(a,"hurl",45);sfx("whoosh");
    await launch(b,b.side*6.4,2.4,.62,2,{land:slamLand(a,b,dm)})}},
  {n:"Himmelssturz",async f(a,b,dm){const d=-a.side;await dash(a,fx_(b).x-d*.95,.2);pose(a,"grab",35);sfx("grab");await wait(.14);
    b.grounded=false;b.downed=true;a.grounded=false;pose(b,"held",30);pose(a,"lift",20);const ax=fx_(a).x,bx=fx_(b).x,H=4.3,yl=-1.32*b.sc;sfx("jump");setTimeout(()=>sfx("whoosh"),200);
    await tw(.5,p=>{const e=eOut(p),r=FACE+p*Math.PI*4;fx_(a).y=e*H;fx_(b).y=e*H+.3;fx_(b).x=lerp(bx,ax+d*.55,Math.min(1,p*3));b.piv.rotation.x=-Math.min(1,p*2)*Math.PI;a.turn.rotation.y=r;b.turn.rotation.y=r});
    a.turn.rotation.y=b.turn.rotation.y=FACE;await wait(.1);sfx("whoosh");
    await tw(.15,p=>{const e=p*p;fx_(a).y=H*(1-e);fx_(b).y=lerp(H+.3,yl+1.5,e)});
    fx_(a).y=0;a.grounded=true;pose(a,"hurl",40);impact(a,b,dm,{lv:2,s:"slam",y:.6,noReact:1,r:2.7,max:6,stop:.14});ring(fx_(b).x,.06,0,a.ch.c,4.5);dust(fx_(b).x,0,10);
    await tw(.32,p=>{b.piv.rotation.x=lerp(-Math.PI,-Math.PI/2,p);fx_(b).y=lerp(yl+1.5,yl,p)+Math.sin(p*Math.PI)*.4;fx_(b).x+=d*.02});pose(b,"down",25)}},
  {n:"Riesenschwung",async f(a,b,dm){const d=-a.side;await dash(a,fx_(b).x-d*.95,.2);pose(a,"grab",35);sfx("grab");await wait(.14);
    b.grounded=false;b.downed=true;pose(b,"held",30);const ax=fx_(a).x,bx=fx_(b).x,R=1.8,by=1.3-1.6*b.sc;let n0=0;
    await tw(.2,p=>{b.piv.rotation.x=-p*Math.PI/2;fx_(b).y=p*by;fx_(b).x=lerp(bx,ax+d*R,p)});
    await tw(1.05,p=>{const th=p*p*Math.PI*6;fx_(b).x=ax+d*R*Math.cos(th);fx_(b).z=R*Math.sin(th);a.turn.rotation.y=FACE-th;b.turn.rotation.y=FACE-th;const n=Math.floor(th/6.2832+.5);if(n>n0){n0=n;sfx("whoosh")}});
    fx_(b).z=0;a.turn.rotation.y=b.turn.rotation.y=FACE;pose(a,"hurl",45);breakNear(ax,2.2,d,1,3);
    await launch(b,b.side*6.5,1.3,.5,1.5,{land:slamLand(a,b,dm)})}},
 ],
};
/* Englische Namen der Varianten */
{const en={hieb:["Triple Combo","Flash Cut","Hammer Fist","Drum Roll"],kick:["Whirl Kick","Sweep Kick","Hurricane Kick","Dive Kick"],wurf:["Sling Throw","Sky Drop","Giant Swing"]};
 for(const k in en)MOVES[k].forEach((m,i)=>bi(m,"n",m.n,en[k][i]))}
async function runMove(k,a,b,dm){const ML=MOVES[k],m=a.lastMv=a.lastMv||{};a.kc=ATK[k].c;colorBurst(a.ch.c,a.kc,1.6);let i;do{i=R(0,ML.length-1)}while(m[k]===i);m[k]=i;
  pop(ML[i].n+"!",null,fx_(a).x,4.6*a.sc,"mv");await ML[i].f(a,b,dm)}
const ACT={hieb:(a,b,dm)=>runMove("hieb",a,b,dm),kick:(a,b,dm)=>runMove("kick",a,b,dm),wurf:(a,b,dm)=>runMove("wurf",a,b,dm)};
/* Gegnerschaden im Verhältnis zum Spieler. Ziel auf Mittel und Schwer (bei 107 Leben): Freier Kampf 4–7 Treffer bis K.O. (210 %),
   Story 7–12 Treffer (120 %). Sonst 88 %. */
const hardFree=()=>mode=="a"&&SAVE.diff>=2,enF=()=>SAVE.diff>=2?(mode=="a"?2.1:1.2):.88;
async function attack(a,b,k,mu){if(over)return;
  if(k=="fin")await finMove(a,b);
  else if(k=="sig"){a.kc=0xffffff;await sigMove(a,b,ATK.sig.dm*a.dm*(a.isP?mu:enF()*(a.tdm||1)))}
  else await ACT[k](a,b,/* Gegner: dieselbe Attacke macht 88 % des Spielerschadens */ATK[k].dm*a.dm*(a.isP?mu:enF()*(a.tdm||1)));
  if(b.hp>0){await recover(a,b);
    /* Finisher gibt es nur im Matchball: der Spieler führt 1 Runde und der Gegner hat höchstens 10 % Leben */
    if(a.isP&&fo=="none"&&wins.p==1&&b.hp<=b.max*.1&&!over)offerFin();return}
  /* Runde vorbei: gekämpft wird, bis jemand zwei Runden gewonnen hat */
  if(fo=="on")endOffer();
  if(!b.downed)await launch(b,b.side*5.6,2,.75,1);pose(b,"down",20);await backHop(a);a.turn.rotation.y=FACE;pose(a,"win",10);
  const w=a.isP?"p":"e";wins[w]++;hud();await rt(1.5);
  if(wins[w]>=2)return result(a.isP);
  round++;banner(L("Runde ","Round ")+round,L("Stand ","Score ")+`${wins.p} : ${wins.e}`);sfx("gong");clearTemp();untint(b);squash(b,1,1);b.root.visible=true;b.dizzy=false;
  await Promise.all([getUp(b).then(()=>dash(b,b.hx,.3)),rt(1)]);
  for(const f of[pl,en]){f.hp=f.max;pose(f,"idle",12);f.turn.rotation.y=FACE;fx_(f).z=0}
  en.timer=en.iv;sel=null;inp="";msg(wins.p==1?L("Matchball! Bring den Gegner unter 10 % Leben für den Finisher.","Match point! Get your opponent below 10 % health for the finisher."):L("Neue Runde, volle Kraft für beide!","New round, full power for both!"));render();await rt(1.1);if(await countdown())over=false}

/* ----- Kampf starten / beenden ----- */
function storyOpp(n){if(n==10)return pickC==14?13:14;if(n==5)return pickC==13?10:13;const pool=[];for(let i=0;i<10;i++)if(i!=pickC)pool.push(i);return pool[((n<5?n-1:n-2)+pickC*3)%pool.length]}
function layout(){const p=$("#panel"),r=document.documentElement.style;
  if(p.hidden){VO.x=VO.y=0;VO.fw=VO.fh=1}
  else{r.setProperty("--cl","0px");r.setProperty("--cr","0px");const hh=($("#hud").offsetHeight||70)*UIH,dk=Math.max(0,p.offsetHeight-22)*UIP;
    VO.x=0;VO.y=(dk-hh*.9)/2;VO.fw=1;VO.fh=(GH-hh-dk)/GH}
  applyOff()}
function startFight(){
  fid++;tws.length=0;rtw.length=0;TSb=1;hs=0;cine(false);speed(false);musicOff();
  const story=mode=="s",boss=story&&(lvl==10||lvl==5),oi=story?storyOpp(lvl):(()=>{const i=CH.findIndex(c=>c.id==SAVE.opp);return i>=0&&i!=pickC&&unlocked(CH[i])?i:P(CH.map((c,i)=>i).filter(i=>i!=pickC&&unlocked(CH[i])))})(),LV=story?lvl:[2,3,5,8][SAVE.diff];
  stageI=story?arenaOf(CH[oi]):SAVE.arena>=0&&stageOk(SAVE.arena)?SAVE.arena:P(okStages());
  menu(`<div class="vs"><figure><img src="${pic(pickC,"full")}" alt=""><figcaption>${CH[pickC].n}<small>${qt(CH[pickC].q)}</small></figcaption></figure><div class="v">VS</div><figure><img src="${CH[oi].full}" alt=""><figcaption>${CH[oi].n}<small>${qt(CH[oi].q)}</small></figcaption></figure></div>
    <p class="tag">${story?(lvl==10?L("Endkampf","Final battle"):lvl==5?L("Boss-Kampf","Boss battle"):L("Kampf "+lvl+" von 10","Fight "+lvl+" of 10"))+" · ":""}${STG[stageI].n}</p>`,1);sfx("vs");
  setTimeout(()=>{const id=fid;
    clearFighters();clearTemp();buildStage(stageI);
    pl=mkF(CH[pickC],-1,true,1,useAlt(pickC)?1:0);en=mkF(CH[oi],1,false,boss?(lvl==10?1.18:1.1):1);fighters=[pl,en];
    round=1;wins={p:0,e:0};fo="none";cd={last:null,n:0,lock:null,left:0};$("#fo").hidden=true;
    en.max=en.hp=Math.round((44+LV*6+CH[oi].st[1]*3+(boss?14:0))*(SAVE.diff==3?(boss?(lvl==10?1.75:1.5):1.25):1));if(boss)en.dm*=1.03;/* Stufe Schwer: Gegner +25 % Leben, Story-Bosse Kampf 5 +50 %, Kampf 10 +75 %. Bosse immer +3 % Schaden */en.iv=(12-LV*.55)*.75*.7*.9;if(SAVE.diff==0)en.iv=5.5;else if(!story)en.iv=SAVE.diff>=2?3:Math.min(en.iv,4.5);/* 1.–2. Klasse: immer 5,5 s zwischen Gegnerangriffen, auch in der Story. Freier Kampf: Leicht höchstens 4,5 s, Mittel und Schwer 3 s. Jeder Abstand schwankt zufällig zwischen −20 % und +10 %, im Freien Kampf auf Mittel und Schwer zwischen −30 % und +5 %. *//* Kampfstil des Gegners: Tempo 5 = 26 % schneller und 22 % weniger Schaden, Tempo 1 = 26 % langsamer und 30 % mehr Schaden */
    {const t=TEMPO[CH[oi].id]||3;en.iv*=1+(3-t)*.13;en.tdm=1+(3-t)*(t<3?.15:.11)}en.timer=en.iv;
    $("#pn").textContent=CH[pickC].n;$("#en").textContent=CH[oi].n;$("#pi").src=pic(pickC,"bust");$("#ei").src=CH[oi].bust;
    $("#lv").innerHTML=`<b>${story?(lvl==10?L("ENDKAMPF","FINAL BATTLE"):L("KAMPF ","FIGHT ")+lvl+"/10"):L("FREIER KAMPF","FREE FIGHT")}</b>${STG[stageI].n}${story?" "+hearts():""}`;
    cards={hieb:newCard("hieb"),kick:newCard("kick"),wurf:newCard("wurf"),sig:newCard("sig"),fin:newCard("fin")};sel=null;inp="";lock=false;busy=0;Q=Promise.resolve();over=true;
    $("#hud").hidden=false;$("#panel").hidden=false;msg(L("Löse eine Aufgabe, dann greift dein Kämpfer an!","Solve a problem and your fighter attacks!"));render();layout();
    CAM.mode="fight";CAM.k=5;camFight();CAM.p.copy(CAM.tp).add(new THREE.Vector3(0,2,8));CAM.l.copy(CAM.tl);
    setTimeout(()=>{if(id!=fid)return;menuHide();intro().then(()=>{if(id!=fid)return;banner(L("Runde 1","Round 1"),story?(lvl==10?L("Endkampf","Final battle"):L("Kampf ","Fight ")+lvl)+L(" · wer zuerst 2 Runden gewinnt"," · first to win 2 rounds"):L("Wer zuerst 2 Runden gewinnt","First to win 2 rounds"));sfx("gong");rt(1.25).then(countdown).then(ok=>{if(ok&&id==fid)over=false})})},2100);
  },60);
}
function endFightUi(){$("#panel").hidden=true;$("#hud").hidden=true;$("#fo").hidden=true;cine(false);speed(false);layout();CAM.mode="menu"}
function result(win){
  over=true;endFightUi();const s=mode=="s";sfx(win?"win":"lose");
  const sc_=`${wins.p} : ${wins.e}`;
  if(win&&s&&lvl<10){lvl++;SAVE.story={c:pickC,lvl,t:storyT,lv:lives};save();
    menu(`<h2>${L("Sieg","Victory")} ${sc_}</h2><p>${L(`Kampf ${lvl-1} von 10 geschafft. Kampfzeit bisher: ${fmtT(storyT)}`,`Fight ${lvl-1} of 10 done. Fight time so far: ${fmtT(storyT)}`)}</p><button class="btn" data-a="next">${L("Weiter zu Kampf ","On to fight ")+lvl}</button><button class="btn alt" data-a="home">${L("Hauptmenü","Main menu")}</button>`,1)}
  else if(win&&s){SAVE.done++;SAVE.story=null;const e={n:SAVE.name||HERO(),d:SAVE.diff,t:Math.round(storyT),c:pickC};SAVE.lb.push(e);SAVE.lb.sort((a,b)=>a.t-b.t);
    const rank=SAVE.lb.filter(x=>x.d==e.d).indexOf(e)+1;SAVE.lb=SAVE.lb.filter(x=>SAVE.lb.filter(y=>y.d==x.d).indexOf(x)<20);const pc=CH[pickC],hasO=SAVE.alts.includes(pc.id),ai=arenaOf(pc),hasA=stageOk(ai);let no=false,na=null;
    if(!hasO&&!hasA){if(Math.random()<.5)no=true;else na=ai}else if(!hasO)no=true;else if(!hasA)na=ai;
    if(no)SAVE.alts.push(pc.id);if(na!=null)SAVE.ars.push(pc.id);
    const nc=nextUnl(e.d);if(nc)SAVE.unl.push(nc.id);
    const ns=e.d==3?STG.findIndex((x,i)=>x.bonus&&!SAVE.bst.includes(i)):-1;if(ns>=0)SAVE.bst.push(ns);
    lastUnl={c:nc?[nc]:[],o:no?CH[pickC]:null,s:ns>=0?ns:null,a:na};save();const nu=lastUnl.c.length||no||ns>=0||na!=null;
    menu(`<p class="tag">${L("Story geschafft","Story cleared")} · ${DIFFS[e.d][0]}</p><h1 class="logo"><span>${L("Du bist","You are the")}</span>Champion!</h1><p>${L(`${esc(e.n)} hat mit ${CH[pickC].n} alle zehn Gegner besiegt. Kampfzeit ${fmtT(e.t)}, das ist Platz ${rank} der Rangliste.`,`${esc(e.n)} beat all ten opponents with ${CH[pickC].n}. Fight time ${fmtT(e.t)}, that’s rank ${rank} on the leaderboard.`)}</p><div class="rowb">${nu?`<button class="btn gold" data-a="unlock">${L("Was ist das …?","What’s that …?")}</button>`:""}<button class="btn alt" data-a="lb" data-i="${e.d}">${L("Rangliste","Leaderboard")}</button>${nu?"":`<button class="btn" data-a="home">${L("Hauptmenü","Main menu")}</button>`}</div>`,1)}
  else if(win)menu(`<h2>${L("Gewonnen","You won")} ${sc_}</h2><div class="rowb"><button class="btn" data-a="arcade">${L("Nochmal","Again")}</button><button class="btn alt" data-a="home">${L("Hauptmenü","Main menu")}</button></div>`,1);
  else if(s&&lives>1){lives--;SAVE.story={c:pickC,lvl,t:storyT,lv:lives};save();
    menu(`<h2>${L("Niederlage","Defeat")} ${sc_}</h2><p>${L(`Du hast noch ${lives} Leben. Versuch Kampf ${lvl} gleich nochmal!`,`You have ${lives} life left. Try fight ${lvl} again!`)}</p><p class="tag">${hearts()}</p><div class="rowb"><button class="btn" data-a="again">${L("Weiterkämpfen","Keep fighting")}</button><button class="btn alt" data-a="home">${L("Hauptmenü","Main menu")}</button></div>`,1)}
  else if(s){lives=0;SAVE.story=null;save();
    menu(`<h1 class="logo"><span>Game</span>Over</h1><p>${L(`Keine Leben mehr. ${CH[pickC].n} ist in Kampf ${lvl} gescheitert, die Story beginnt von vorn.`,`No lives left. ${CH[pickC].n} fell in fight ${lvl}, the story starts over.`)}</p><div class="rowb"><button class="btn" data-a="story">${L("Neue Story","New story")}</button><button class="btn alt" data-a="home">${L("Hauptmenü","Main menu")}</button></div>`,1)}
  else menu(`<h2>${L("Niederlage","Defeat")} ${sc_}</h2><p>${P(L(["Das war knapp. Atme durch und such dir den nächsten Gegner!","Auch Champions fallen mal um. Aufstehen, Krone richten.","Dein Gegner hatte Glück. Sagt er jedenfalls."],["That was close. Take a breath and pick your next opponent!","Even champions fall over sometimes. Get up, fix your crown.","Your opponent got lucky. At least that’s what they say."]))}</p><div class="rowb"><button class="btn" data-a="arcade">${L("Nochmal","Again")}</button><button class="btn alt" data-a="home">${L("Hauptmenü","Main menu")}</button></div>`,1)}

/* ----- Menüs ----- */
function menu(h,solid){const m=$("#menu");m.hidden=false;m.classList.toggle("solid",!!solid);m.innerHTML=h;m.scrollTop=0;$("#snd").hidden=false}
function menuHide(){$("#menu").hidden=true;$("#snd").hidden=true}
function attract(si){fid++;tws.length=0;rtw.length=0;TSb=1;over=true;clearFighters();buildStage(si!=null?si:P(okStages()));const ok=CH.map((c,i)=>i).filter(i=>unlocked(CH[i])),a=P(ok),b=P(ok.filter(i=>i!=a));
  fighters=[mkF(CH[a],-1,true),mkF(CH[b],1,false)];CAM.mode="menu"}
const logo=()=>`<h1 class="logo"><span>Math</span>brawl</h1><p class="tag">${L("Rechnen · Kämpfen · Siegen","Solve · Fight · Win")}</p>`;
function home(){endFightUi();musicOn();if(!fighters.length||pl)attract();pl=en=null;const st=SAVE.story;
  menu(logo()+`<div class="rowb"><button class="btn" data-a="story">Story<small>${L("10 KÄMPFE BIS ZUM MATHEMAGUS","10 FIGHTS TO THE MATHEMAGUS")}</small></button>${st?`<button class="btn gold" data-a="cont">${L("Weiterkämpfen","Continue")}<small>${CH[st.c].n.toUpperCase()} · ${L("KAMPF","FIGHT")} ${st.lvl}/10 · ${"♥".repeat(st.lv||2)}</small></button>`:""}<button class="btn alt" data-a="arcade">${L("Freier Kampf","Free Fight")}<small>${L("EIN GEGNER, EINE ARENA","ONE OPPONENT, ONE ARENA")}</small></button></div>
   <div class="seg" id="dseg">${DIFFS.map((d,i)=>`<button type="button" data-a="diff" data-i="${i}" class="${SAVE.diff==i?"on":""}">${d[0]}<small>${d[1]}</small></button>`).join("")}</div>
   <div class="rowb"><button class="btn alt sm" data-a="lb" data-i="${SAVE.diff}">${L("Rangliste","Leaderboard")}</button><button class="btn alt sm" data-a="name">${L("Spieler","Player")}: ${esc(SAVE.name||HERO())}</button><button class="btn alt sm" data-a="settings">${L("Einstellungen","Settings")}</button></div>
   <p class="tag">${L("Story geschafft","Story cleared")}: ${SAVE.done}×</p>`)}
const langSeg=()=>`<div class="seg" role="group" aria-label="Sprache / Language">${[["de","Deutsch"],["en","English"]].map(([k,t])=>`<button type="button" data-a="lang" data-l="${k}" class="${LANG==k?"on":""}">${t}</button>`).join("")}</div>`;
function startScreen(){const v=$("#pname")?$("#pname").value:SAVE.name;menu(logo()+`<label class="nmf" for="pname"><input id="pname" aria-label="Name" type="text" maxlength="12" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Name" value="${esc(v)}"></label><button class="btn blink" data-a="start">Start</button>${langSeg()}`)}
/* Einstellungen: Lautstärke für Musik und Effekte, Sprache. back = wohin "Zurück" führt */
let setBack="home";
function settings(back){setBack=back||setBack;const v=k=>Math.round(SAVE.vol[k]*100);
  menu(`<h2>${L("Einstellungen","Settings")}</h2><div class="sets">
   <label for="vm"><span>${L("Musik","Music")}</span><input id="vm" type="range" min="0" max="100" step="5" value="${v("m")}"><b id="vmv">${v("m")} %</b></label>
   <label for="vs"><span>${L("Soundeffekte","Sound effects")}</span><input id="vs" type="range" min="0" max="100" step="5" value="${v("s")}"><b id="vsv">${v("s")} %</b></label>
   <div class="srow wide"><span>${L("Grafik-Effekte","Visual effects")} <small class="hint">${L("„Niedrig“ für ältere Tablets und Handys","“Low” for older tablets and phones")}</small></span><div class="seg">${[L("Niedrig","Low"),L("Mittel","Medium"),L("Hoch","High")].map((t,k)=>`<button type="button" data-a="qual" data-i="${k}" class="${SAVE.q==k?"on":""}">${t}</button>`).join("")}</div></div>
   <div class="srow wide"><span>${L("Musiktitel","Music track")}</span><div class="seg">${TRK.map((t,k)=>`<button type="button" data-a="track" data-i="${k}" class="${SAVE.track==k?"on":""}">${L(t.n[0],t.n[1])}</button>`).join("")}</div></div>
   <div class="srow"><span>${L("Sprache","Language")}</span>${langSeg()}</div></div>
   <div class="rowb"><button class="btn alt sm" data-a="back">${L("Zurück","Back")}</button><button class="btn sm danger" data-a="reset">${L("Fortschritt zurücksetzen","Reset progress")}</button></div>`,1)}
function applyLang(){document.documentElement.lang=LANG;$("#skiphint").textContent=L("Tippen zum Überspringen","Tap to skip");$("#plbl").textContent=ATK.sig.n;$("#elbl").textContent=L("GEGNER-ANGRIFF","ENEMY ATTACK");
  $("#snd").textContent=L("TON","SOUND");$("#snd").setAttribute("aria-label",L("Ton an oder aus","Sound on or off"))}
function lbScreen(d){const rows=SAVE.lb.filter(x=>x.d==d).slice(0,10);
  menu(`<h2>${L("Rangliste","Leaderboard")}</h2><p>${L("Schnellste Kampfzeit für die ganze Story. Gespeichert auf diesem Gerät.","Fastest fight time for the whole story. Saved on this device.")}</p><div class="seg">${DIFFS.map((x,i)=>`<button type="button" data-a="lb" data-i="${i}" class="${d==i?"on":""}">${x[0]}</button>`).join("")}</div>
   ${rows.length?`<table class="rank"><thead><tr><th>${L("Platz","Rank")}</th><th>Name</th><th>${L("Kämpfer","Fighter")}</th><th>${L("Zeit","Time")}</th></tr></thead><tbody>${rows.map((r,i)=>`<tr${r.n==SAVE.name?' class="me"':""}><td>${i+1}.</td><td>${esc(r.n)}</td><td>${CH[r.c].n}</td><td>${fmtT(r.t)}</td></tr>`).join("")}</tbody></table>`
    :`<p class="tag">${L(`Noch kein Eintrag. Schaff die Story in „${DIFFS[d][0]}“, dann stehst du hier ganz oben.`,`No entries yet. Clear the story on “${DIFFS[d][0]}” and you’ll be on top.`)}</p>`}
   <button class="btn alt sm" data-a="home">${L("Zurück","Back")}</button>`,1)}
/* Arena-Auswahl im Freien Kampf. Gesperrte Bonus-Arenen zeigen, wie man sie bekommt. */
const arStyle=i=>{const[c1,c2]=STG[i].cols;return`background:linear-gradient(150deg,${hex(STG[i].fog)} 0%,${hex(c1)} 120%),${hex(c2)}`};
/* Gegner-Wahl im Freien Kampf: alle freigespielten Kämpfer außer dem eigenen, oder Zufall */
function oppScreen(){const cur=CH.findIndex(c=>c.id==SAVE.opp),ok=cur>=0&&cur!=pickC&&unlocked(CH[cur]);
  menu(`<h2>${L("Wähle deinen Gegner","Choose your opponent")}</h2><div class="grid opp">
   <button type="button" class="tile rnd${ok?"":" on"}" data-a="opp" data-id=""><b>?</b><span>${L("Zufall","Random")}</span></button>
   ${CH.map((c,i)=>i==pickC?"":unlocked(c)?`<button type="button" class="tile${ok&&cur==i?" on":""}" data-a="opp" data-id="${c.id}"><img src="${c.bust}" alt=""><span>${c.n}</span></button>`:`<div class="tile lock"><img src="${c.bust}" alt=""><span>???</span></div>`).join("")}</div>
   <button class="btn alt sm pback" data-a="pickBack">${L("Zurück","Back")}</button>`,1)}
function arenaScreen(){const cur=SAVE.arena>=0&&stageOk(SAVE.arena)?SAVE.arena:-1;
  const tile=(x,i)=>{const o=owner(i);if(stageOk(i))return`<button type="button" class="ar${cur==i?" on":""}" data-a="arena" data-i="${i}" style="${arStyle(i)}">${x.bonus?`<i>BONUS</i>`:o?`<img src="${o.bust}" alt="">`:""}<span>${x.n}</span></button>`;
    return`<div class="ar lk"><b>?</b><span>${x.bonus?L("Bonus-Arena","Bonus arena"):(unlocked(o)?L("Arena von ","Arena of ")+o.n:"???")}</span><small>${x.bonus?L("Story auf „Schwer“ schaffen","Clear the story on “Hard”"):unlocked(o)?L(`Story mit ${o.n} schaffen`,`Clear the story with ${o.n}`):L("Kämpfer noch gesperrt","Fighter still locked")}</small></div>`};
  const order=STG.map((x,i)=>i).sort((a,b)=>(STG[a].bonus?1:0)-(STG[b].bonus?1:0)||(owner(a)?CH.indexOf(owner(a)):0)-(owner(b)?CH.indexOf(owner(b)):0));
  menu(`<h2>${L("Wähle die Arena","Choose the arena")}</h2><div class="arenas">
   <button type="button" class="ar rnd${cur<0?" on":""}" data-a="arena" data-i="-1"><b>?</b><span>${L("Zufall","Random")}</span></button>${order.map(i=>tile(STG[i],i)).join("")}</div>
   <button class="btn alt sm pback" data-a="oppBack">${L("Zurück","Back")}</button>`,1)}
function selChar(){if(!unlocked(CH[selC]))selC=0;
  menu(`<h2 class="pickh">${L("Wähle deinen Kämpfer","Choose your fighter")}</h2><div class="pick"><div class="grid">${CH.map((c,i)=>`<button type="button" class="tile${unlocked(c)?"":" lock"}${i==selC?" on":""}" data-a="tile" data-i="${i}"><img src="${unlocked(c)?pic(i,"bust"):c.bust}" alt=""><span>${unlocked(c)?c.n:"???"}</span></button>`).join("")}</div><div class="det" id="det"></div></div><button class="btn alt pback" data-a="home" style="font-size:20px;min-height:48px;padding:8px 24px">${L("Zurück","Back")}</button>`,1);showDet(selC)}
function showDet(i,pv){selC=i;const c=CH[i],u=unlocked(c),ao=altOk(c),cur=useAlt(i)?1:0,o=pv==null?cur:pv,lockO=o==1&&!ao;
  document.querySelectorAll(".tile").forEach((t,j)=>{t.classList.toggle("on",j==i);if(j==i&&u)t.querySelector("img").src=pic(i,"bust")});
  const seg=`<div class="seg osel">${[L("Outfit 1","Outfit 1"),ao?L(c.alt.on[0],c.alt.on[1]):L("Outfit 2 · gesperrt","Outfit 2 · locked")].map((t,k)=>`<button type="button" data-a="outfit" data-o="${k}" class="${o==k?"on":""}">${t}</button>`).join("")}</div>`;
  $("#det").innerHTML=`<img src="${u?pic(i,"full",o==1):c.full}" alt="" class="${u&&!lockO?"":"lk"}"><div class="info">`+(u?`<div class="ti">${c.ti}</div><h3>${c.n}</h3>${seg}<p>${lockO?L(`Schaffe die Story mit ${c.n}, um dieses Outfit freizuschalten.`,`Clear the story with ${c.n} to unlock this outfit.`):c.d}</p>
    <div class="st">${L(["Kraft","Leben","Spezial"],["Power","Health","Special"]).map((s,k)=>`<span>${s}</span><div>${[1,2,3,4,5].map(n=>`<i class="${n<=c.st[k]?"f":""}"></i>`).join("")}</div>`).join("")}</div>
    <div class="fn"><small>${L("SPEZIAL-ATTACKE","SPECIAL ATTACK")}</small>${c.sig}</div><div class="fn"><small>FINISHER</small>${c.fin}</div><button class="btn" data-a="go">${L("Kämpfen!","Fight!")}</button>`
   :`<div class="ti">${c.boss?L("Boss · noch gesperrt","Boss · locked"):L("Noch gesperrt","Locked")}</div><h3>???</h3><p>${c.boss?L(`Boss-Kämpfer: nur über die Story in der Stufe „${DIFFS[2][0]}“ freizuschalten. Dort wird bei jedem Durchgang ein zufälliger gesperrter Kämpfer frei, die Bosse eingeschlossen.`,`Boss fighter: only unlockable through the story on “${DIFFS[2][0]}”. Each clear there unlocks a random locked fighter, bosses included.`)
      :L(`Schaffe die Story, dann kommt der nächste Kämpfer dazu. Jeder Durchgang schaltet einen Kämpfer frei. Bisher geschafft: ${SAVE.done}×.`,`Clear the story to unlock the next fighter. Every clear unlocks one fighter. Cleared so far: ${SAVE.done}×.`)}</p><button class="btn" disabled>${L("Gesperrt","Locked")}</button>`)+`</div>`}
const ACTIONS={
  start(){const n=$("#pname");if(n){SAVE.name=n.value.trim().slice(0,12)||HERO();save()}auInit();try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock("landscape").catch(()=>{})}catch(e){}try{navigator.wakeLock&&navigator.wakeLock.request("screen").catch(()=>{})}catch(e){}home()},
  name(){startScreen();const n=$("#pname");n&&n.focus()},lb(b){lbScreen(+b.dataset.i)},
  settings(){settings("home")},back(){setBack=="pause"?pauseMenu():home()},
  lang(b){LANG=SAVE.lang=b.dataset.l;save();applyLang();if($("#pname"))startScreen();else settings()},
  story(){mode="s";lvl=1;selChar()},arcade(){mode="a";if(pl){endFightUi();musicOn();attract();pl=en=null}selChar()},
  cont(){const s=SAVE.story;mode="s";pickC=s.c;lvl=s.lvl;storyT=s.t||0;lives=s.lv||2;startFight()},
  diff(b){SAVE.diff=+b.dataset.i;save();document.querySelectorAll("#dseg button").forEach((x,i)=>x.classList.toggle("on",i==SAVE.diff))},
  tile(b){showDet(+b.dataset.i)},go(){pickC=selC;if(mode=="s"){SAVE.story=null;storyT=0;lives=2;save();startFight()}else oppScreen()},
  arena(b){SAVE.arena=+b.dataset.i;save();startFight()},pickBack(){selChar()},oppBack(){oppScreen()},
  opp(b){SAVE.opp=b.dataset.id;save();arenaScreen()},
  next(){startFight()},again(){startFight()},home(){home()},
  unlock(){const{c:cs,o,s:ns,a:na}=lastUnl;sfx("unlock");flash("#fff");if(o)altPics(o);if(na!=null||ns!=null)attract(na!=null?na:ns);
    menu(`<p class="tag">${L("Freigeschaltet","Unlocked")}</p><div class="rowb">${cs.map(c=>`<figure class="unf"><img class="unl" src="${c.full}" alt=""><figcaption><b>${c.n}</b>${L("Neuer Kämpfer","New fighter")}</figcaption></figure>`).join("")}${o?`<figure class="unf"><img class="unl" src="${o.full2}" alt=""><figcaption><b>${L(o.alt.on[0],o.alt.on[1])}</b>${L("Neues Outfit für ","New outfit for ")+o.n}</figcaption></figure>`:""}${ns!=null?`<figure class="unf"><div class="stc" style="${arStyle(ns)}">${STG[ns].n}</div><figcaption><b>${STG[ns].n}</b>${L("Neue Bonus-Arena","New bonus arena")}</figcaption></figure>`:""}${na!=null?`<figure class="unf"><div class="stc" style="${arStyle(na)}">${STG[na].n}</div><figcaption><b>${STG[na].n}</b>${L("Arena von ","Arena of ")+owner(na).n}</figcaption></figure>`:""}</div><button class="btn" data-a="home">${L("Weiter","Continue")}</button>`,1)},
  outfit(b){const c=CH[selC],o=+b.dataset.o;if(!o||altOk(c)){SAVE.of[c.id]=o;save()}showDet(selC,o)},
  track(b){SAVE.track=+b.dataset.i;save();musicTrack(SAVE.track);settings()},
  /* Fortschritt zurücksetzen: erst nachfragen, dann alles Freigespielte und die Rangliste löschen.
     Name, Sprache, Lautstärke, Grafik, Musiktitel und Stufe bleiben. */
  reset(){menu(`<h2>${L("Wirklich alles zurücksetzen?","Really reset everything?")}</h2>
   <p>${L("Alle freigespielten Kämpfer, Outfits und Arenen, der Story-Fortschritt und die komplette Rangliste werden gelöscht. Das lässt sich nicht rückgängig machen.","All unlocked fighters, outfits and arenas, your story progress and the whole leaderboard will be deleted. This cannot be undone.")}</p>
   <div class="rowb"><button class="btn alt" data-a="resetNo">${L("Nein, behalten","No, keep it")}</button><button class="btn danger" data-a="resetYes">${L("Ja, alles zurücksetzen","Yes, reset everything")}</button></div>`,1)},
  resetNo(){settings()},
  resetYes(){Object.assign(SAVE,{done:0,story:null,lb:[],unl:[],alts:[],of:{},bst:[],ars:[],arena:-1,opp:""});save();lives=2;storyT=0;lastUnl={c:[],o:null,s:null,a:null};sfx("ko");
    paused=false;fighters.length=0;home();menu(`<h2>${L("Fortschritt zurückgesetzt","Progress reset")}</h2><p>${L("Alles beginnt von vorn: 5 Kämpfer und ihre Arenen sind frei, der Rest wartet darauf, freigespielt zu werden.","Everything starts over: 5 fighters and their arenas are unlocked, the rest is waiting to be earned.")}</p><button class="btn" data-a="home">${L("Zum Hauptmenü","To main menu")}</button>`,1)},
  qual(b){SAVE.q=+b.dataset.i;save();setQuality(SAVE.q);settings()},
  resume(){paused=false;const d=performance.now()-pauseAt;for(const k in cards)if(cards[k].t0)cards[k].t0+=d;last=performance.now();menuHide()},
  quit(){paused=false;home()},
};
$("#menu").addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b||b.disabled)return;auInit();if(!["tile","diff","lb","lang","outfit","track","qual"].includes(b.dataset.a))sfx(b.dataset.a=="arena"?"vs":"click");else sfx("pick");ACTIONS[b.dataset.a](b)});
function pauseMenu(){menu(`<h2>Pause</h2><div class="rowb"><button class="btn" data-a="resume">${L("Weiter","Resume")}</button><button class="btn alt" data-a="psets">${L("Einstellungen","Settings")}</button><button class="btn alt" data-a="quit">${L("Kampf aufgeben","Give up")}</button></div>`,1)}
ACTIONS.psets=()=>settings("pause");
$("#pz").addEventListener("click",()=>{if(over||paused||document.body.classList.contains("cine"))return;paused=true;pauseAt=performance.now();sfx("click");pauseMenu()});
/* Schieberegler: Lautstärke sofort anwenden, beim Loslassen eine Hörprobe */
$("#menu").addEventListener("input",e=>{const t=e.target;if(t.id!="vm"&&t.id!="vs")return;auInit();SAVE.vol[t.id=="vm"?"m":"s"]=t.value/100;$("#"+t.id+"v").textContent=t.value+" %";auVol(SAVE.vol.m,SAVE.vol.s)});
$("#menu").addEventListener("change",e=>{const t=e.target;if(t.id=="vs")sfx("punch");if(t.id=="vm"||t.id=="vs")save()});
const sndBtn=$("#snd");function sndUi(){sndBtn.classList.toggle("off",SAVE.mute);sndBtn.setAttribute("aria-pressed",!SAVE.mute)}
sndBtn.addEventListener("click",()=>{auInit();SAVE.mute=!SAVE.mute;save();auMute(SAVE.mute);sndUi()});
document.addEventListener("visibilitychange",()=>{if(AU.ctx){if(document.hidden)AU.ctx.suspend();else AU.ctx.resume()}});

/* ----- Hauptschleife ----- */
function camFight(){const a=fx_(pl),b=fx_(en),mx=(a.x+b.x)/2,span=Math.abs(a.x-b.x)/2+2.3,tan=Math.tan(cam.fov*Math.PI/360),top=Math.min(9,Math.max(a.y,b.y,0));
  const z=clamp(Math.max(span/(tan*cam.aspect*VO.fw),(2.7+top*.72)/(tan*VO.fh)),8,38);CAM.tp.set(mx*.7,2.4+z*.07+top*.3,z);CAM.tl.set(mx*.7,2.05+top*.4,0)}
function loop(n){requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;
  if(paused){ren.render(sc,cam);return}
  const wd=dt*(hs>0?.02:TSb);hs-=dt;T+=wd;
  stepTw(rtw,dt);stepTw(tws,wd);for(const f of fighters)animFighter(f,wd,T);stepFx(wd,dt);stepStage(dt,T);
  if(pl&&!over){
    if(mode=="s")storyT+=dt;
    if(fo=="on"){const r=1-(performance.now()-cards.fin.t0)/1000/FIN_TIME;$("#fot").style.width=clamp(r,0,1)*100+"%";if(r<=0)endOffer(L("Zu langsam! Der Finisher ist futsch, jetzt normal zu Ende kämpfen.","Too slow! The finisher is gone, win the fight the normal way."))}
    if(busy==0&&fo!="on"){en.timer-=dt;if(en.timer<=0){en.timer=en.iv*(hardFree()?rnd(.7,1.05):rnd(.8,1.1));const k=en.mt>=100?"sig":P(["hieb","hieb","kick","kick","wurf"]);if(k=="sig")en.mt=0;
      q(async()=>{sfx("warn");pop(k=="sig"?"!!":"!",k=="sig"?"#ffc21a":"#ff3b2f",fx_(en).x,4.4*en.sc);pose(en,"windup",20);await wait(.4);await attack(en,pl,k,1)})}}
    const w=clamp(1-en.timer/en.iv,0,1);$("#ec").style.width=w*100+"%";$("#ecb").classList.toggle("warn",w>.85);
    if(sel){const el=(performance.now()-cards[sel].t0)/1000,th=BONUS[sel],bl=$("#bl"),bo=$("#bon");if(bl){bl.textContent=el<=th[0]?L("BLITZ ×1,5","FLASH ×1.5"):el<=th[1]?L("SCHNELL ×1,25","QUICK ×1.25"):"";bo.style.width=clamp(1-el/th[1],0,1)*100+"%";bo.style.background=el<=th[0]?"var(--gold)":"var(--cyan)"}}
  }
  if(CAM.mode=="fight"&&pl)camFight();else if(CAM.mode=="menu"){CAM.k=2;const z=clamp(6/(Math.tan(cam.fov*Math.PI/360)*cam.aspect),11,24);CAM.tp.set(Math.sin(T*.16)*5,3,z);CAM.tl.set(0,2.2,0)}
  /* Lichtshow: beim Finisher wandern die Kampflichter durch alle Farben */
  if(document.body.classList.contains("cine")){const h=(n/1400)%1;colA.color.setHSL(h,1,.55);colB.color.setHSL((h+.45)%1,1,.55);colA.intensity=colB.intensity=1.5;loop.show=1}
  else if(loop.show){loop.show=0;colA.color.setHex(STL.c[0]);colB.color.setHex(STL.c[1])}
  camStep(dt);ren.render(sc,cam)}

/* ----- Start ----- */
setQuality(SAVE.q);AU.muted=SAVE.mute;AU.vol={m:SAVE.vol.m,s:SAVE.vol.s};AU.track=Math.min(SAVE.track||0,TRK.length-1);applyLang();sndUi();rs();makePortraits();attract();
startScreen();
requestAnimationFrame(loop);
