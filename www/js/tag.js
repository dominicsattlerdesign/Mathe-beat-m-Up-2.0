/* ---------- Freier Kampf als Tag Team ----------
   Jede Seite hat 2 Kämpfer. Geht einer K.O., springt der zweite sofort in die Arena, ohne neues Intro und ohne Countdown.
   Wer zuerst beide Kämpfer verliert, verliert. Zu Beginn: pro Team ein Banner mit beiden Köpfen und Namen, dann ein gemeinsames Team-Intro.
   Das Team-Intro wird aus Bausteinen zusammengesetzt (Ankunft, gemeinsame Geste, Team-Spruch, Team-Name). Welche Kombination eine Paarung
   bekommt, hängt fest von beiden Kämpfern und ihren Outfits ab: jede Paarung hat so immer ihr eigenes, gleichbleibendes Intro. */
const TG={p:[],e:[],cur:{p:0,e:0},ko:{p:0,e:0}};
const isTag=()=>mode=="a";

/* ----- Auswahl ----- */
function tagHead(){const s=n=>{const i=TG.p[n];return`<span class="tslot${i!=null?" f":""}">${i!=null?`<img src="${pic(i,"bust")}" alt="">`:n+1}</span>`};
  return`<div class="tagh"><b>Tag Team</b>${s(0)}${s(1)}<small>${TG.p.length?L("Wähle deinen zweiten Kämpfer","Choose your second fighter","Choisis ton deuxième combattant","Elige a tu segundo luchador"):L("Wähle deinen ersten Kämpfer","Choose your first fighter","Choisis ton premier combattant","Elige a tu primer luchador")}</small></div>`}
function tagGo(){if(TG.p.includes(selC)){sfx("wrong");return}TG.p.push(selC);pickC=TG.p[0];
  if(TG.p.length<2){const nx=ORDER.find(i=>unlocked(CH[i])&&!TG.p.includes(i));if(nx!=null)selC=nx;selChar()}else{TG.e=[];tagOppScreen()}}
function tagOppScreen(){const t=TG.e,slot=n=>{const i=t[n];return`<span class="tslot${i!=null?" f":""}">${i!=null?`<img src="${CH[i].bust}" alt="">`:"?"}</span>`};
  menu(`<h2 class="pickh">${L("Wähle das Gegner-Team","Choose the enemy team","Choisis l’équipe adverse","Elige el equipo rival")}</h2><div class="tagh">${slot(0)}${slot(1)}<small>${L("Gegner-Team: 2 Gegner oder Zufall","Enemy team: 2 opponents or random","Équipe adverse : 2 adversaires ou au hasard","Equipo rival: 2 rivales o al azar")}</small></div>
   <div class="grid opp"><button type="button" class="tile rnd" data-a="topp" data-id="-1"><b>?</b><span>${L("Zufall","Random")}</span></button>
   ${ORDER.map(i=>[CH[i],i]).map(([c,i])=>TG.p.includes(i)?"":unlocked(c)?`<button type="button" class="tile${t.includes(i)?" on":""}" data-a="topp" data-id="${i}"><img src="${c.bust}" alt=""><span>${c.n}</span>${t.includes(i)?`<b class="no">${t.indexOf(i)+1}</b>`:""}</button>`:`<div class="tile lock"><img src="${c.bust}" alt=""><span>???</span></div>`).join("")}</div>
   <div class="rowb"><button class="btn alt sm" data-a="pickBack">${L("Zurück","Back")}</button><button class="btn" data-a="tnext"${t.length<2?" disabled":""}>${L("Weiter zur Arena","On to the arena")}</button></div>`,1)}
Object.assign(ACTIONS,{
  topp(b){const i=+b.dataset.id,t=TG.e;if(i<0){const pool=CH.map((c,k)=>k).filter(k=>unlocked(CH[k])&&!TG.p.includes(k)&&!t.includes(k));while(t.length<2&&pool.length)t.push(pool.splice(R(0,pool.length-1),1)[0])}
    else{const n=t.indexOf(i);if(n>=0)t.splice(n,1);else if(t.length<2)t.push(i);else t[1]=i}tagOppScreen()},
  tnext(){if(TG.e.length==2)arenaScreen()},
});

/* ----- Kämpfer bauen ----- */
const mkTP=i=>mkF(CH[i],-1,true,1,useAlt(i)?1:0);
/* Gegner wie im Freien Kampf: Leben, Angriffstempo und Kampfstil je nach Stufe und Kämpfer */
function mkTE(oi){const f=mkF(CH[oi],1,false),LV=[2,3,5,8][SAVE.diff];f.max=f.hp=Math.round((44+LV*6+CH[oi].st[1]*3)*(SAVE.diff==3?1.25:1));
  f.iv=(12-LV*.55)*.75*.7*.9;if(SAVE.diff==0)f.iv=5.5;else f.iv=SAVE.diff>=2?3:Math.min(f.iv,4.5);const t=TEMPO[CH[oi].id]||3;f.iv*=1+(3-t)*.13;f.tdm=1+(3-t)*(t<3?.15:.11);f.timer=f.iv;return f}
const rmF=f=>{sc.remove(f.root);const h=f.J.hd.children[0].material;h.map&&h.map.dispose();h.dispose()};
function tNames(){$("#pn").textContent=pl.ch.n;$("#en").textContent=en.ch.n;$("#pi").src=pic(TG.p[TG.cur.p],"bust");$("#ei").src=CH[TG.e[TG.cur.e]].bust}

/* ----- Kampf starten ----- */
function tStart(){
  fid++;tws.length=0;rtw.length=0;TSb=1;hs=0;cine(false);speed(false);musicOff();pickC=TG.p[0];
  stageI=SAVE.arena>=0&&stageOk(SAVE.arena)?SAVE.arena:P(okStages());
  menu(`<p class="tag">${L("Freier Kampf","Free Fight")} · Tag Team · ${DIFFS[SAVE.diff][0]}</p><h1 class="logo"><span>${STG[stageI].n}</span>Tag Team</h1>`,1);sfx("vs");
  setTimeout(()=>{const id=fid;
    clearFighters();clearTemp();buildStage(stageI);TG.cur={p:0,e:0};TG.ko={p:0,e:0};
    pl=mkTP(TG.p[0]);en=mkTE(TG.e[0]);fighters=[pl,en];
    round=1;wins={p:0,e:0};fo="none";cd={last:null,n:0,lock:null,left:0};$("#fo").hidden=true;tNames();
    $("#lv").innerHTML=`<b>${L("FREIER KAMPF","FREE FIGHT")}</b>Tag Team · ${STG[stageI].n}`;
    cards={hieb:newCard("hieb"),kick:newCard("kick"),wurf:newCard("wurf"),sig:newCard("sig"),fin:newCard("fin")};sel=null;inp="";lock=false;busy=0;Q=Promise.resolve();over=true;
    $("#hud").hidden=false;$("#panel").hidden=false;msg(L("Löse eine Aufgabe, dann greift dein Kämpfer an!","Solve a problem and your fighter attacks!"));render();layout();
    CAM.mode="fight";CAM.k=5;camFight();CAM.p.copy(CAM.tp).add(new THREE.Vector3(0,2,8));CAM.l.copy(CAM.tl);
    setTimeout(async()=>{if(id!=fid)return;menuHide();await tagBanners();if(id!=fid)return;await duoIntros();if(id!=fid)return;
      banner("Tag Team",L("Wer zuerst beide Kämpfer verliert, verliert","Lose both fighters and you lose","Perdre ses deux combattants, c’est perdre","Pierdes si caen tus dos luchadores"));sfx("gong");
      await rt(1.25);if(await countdown()&&id==fid)over=false},2100)},60)}

/* Team-Banner: Spielerteam unten von links, Gegnerteam oben von rechts (nicht gedreht) */
function tagBanners(){const el=$("#vsi"),band=(t,cls,lab,own)=>`<div class="tb ${cls}" style="--c1:${hex(CH[t[0]].c)};--c2:${hex(CH[t[1]].c)}"><div class="tl">${lab}</div><div class="tm">${t.map(i=>`<figure><img src="${own?pic(i,"bust"):CH[i].bust}" alt=""><figcaption>${CH[i].n}</figcaption></figure>`).join(`<span>&amp;</span>`)}</div></div>`;
  el.innerHTML=band(TG.e,"p4",L("Gegner-Team","Enemy team","Équipe adverse","Equipo rival"))+`<div class="vv">VS</div>`+band(TG.p,"p1",L("Dein Team","Your team","Ton équipe","Tu equipo"),1);
  el.hidden=false;el.className="";void el.offsetWidth;el.className="go";document.body.classList.add("vsi");sfx("vs");setTimeout(()=>sfx("gong"),700);
  return new Promise(res=>{let done=false;const end=()=>{if(done)return;done=true;el.removeEventListener("pointerdown",end);el.className="out";document.body.classList.remove("vsi");setTimeout(()=>{el.hidden=true},300);res()};
    el.addEventListener("pointerdown",end);setTimeout(end,2800)})}

/* ----- Team-Intro aus Bausteinen ----- */
const hashStr=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const keyOf=f=>f.ch.id+(f.ch.o?"2":"");
/* Ankunft: 0 vom Himmel, 1 Sprint von der Seite, 2 Salto von aussen, 3 Erscheinen in einer Element-Explosion */
const ARRIVE=[
  async(f,x)=>{put(f,x,9);pose(f,"skyfall",30);await A(.45,p=>{fx_(f).y=9*(1-p*p)});fx_(f).y=0;landFx(f,f.ch.c,1);(EFX[f.ch.id]||(()=>{}))(f,x,1,1);pose(f,"crouch",30);await A(.25)},
  async(f,x)=>{const x0=x+f.side*9;put(f,x0);f.run=true;pose(f,"run",30);sfx("swoosh");await A(.45,p=>{fx_(f).x=lerp(x0,x,eOut(p));if(Math.random()<.5)dust(fx_(f).x,0,1)});f.run=false;streak(x,1.6,-f.side,f.ch.c,4);pose(f,"idle",20);await A(.15)},
  async(f,x)=>{await arc(f,x+f.side*8,0,0,x,0,0,3.4,.6,1);landFx(f,f.ch.c,0);pose(f,"crouch",30);await A(.2)},
  async(f,x)=>{glow(x,1.8,f.ch.c,6,.5);ring(x,.06,0,f.ch.c,3.5,.5);(EFX[f.ch.id]||(()=>{}))(f,x,2,2);sfx("zap");put(f,x);f.ms=f.ms||f.model.scale.x;f.model.scale.setScalar(.01);await A(.3,p=>f.model.scale.setScalar(Math.max(.01,eOut(p))*(f.ms||1)));pose(f,"win",30);await A(.2)},
];
/* gemeinsame Gesten der beiden Partner */
const face=(a,b)=>{a.turn.rotation.y=fx_(b).x>fx_(a).x?(a.side<0?FACE:-FACE):(a.side<0?-FACE:FACE)};
const GEST=[
  async(a,b)=>{face(a,b);face(b,a);pose(a,"upper",40);pose(b,"upper",40);await A(.25);const mx=(fx_(a).x+fx_(b).x)/2;sparks(mx,3.3,.3,20,[0xffffff,a.ch.c,b.ch.c],8);hitRing(mx,3.3,0xffffff,1.6);sfx("punch");await A(.4)},
  async(a,b)=>{face(a,b);face(b,a);pose(a,"cross",50);pose(b,"cross",50);await A(.2);const mx=(fx_(a).x+fx_(b).x)/2;glow(mx,2.3,0xffffff,3,.4);ring(mx,2.3,0,a.ch.c,1.6,.4);sfx("heavy");CAM.shake=.25;await A(.45)},
  async(a,b)=>{a.turn.rotation.y=b.turn.rotation.y=0;pose(a,"win",30);pose(b,"win",30);aura(a,a.ch.c,.8);aura(b,b.ch.c,.8);sfx("charge");await A(.75)},
  async(a,b)=>{const x0=fx_(b).x,x1=fx_(a).x+(fx_(a).x-x0)*.9;await arc(b,x0,0,0,x1,0,0,2.8,.45,1);landFx(b,b.ch.c,0);await arc(b,x1,0,0,x0,0,0,2.4,.4,0);pose(b,"win",30);await A(.3)},
  async(a,b)=>{pose(a,"charge",20);pose(b,"charge",20);gather(a,a.ch.c,.7);gather(b,b.ch.c,.7);await A(.7);glow(fx_(a).x,2,a.ch.c,5,.4);glow(fx_(b).x,2,b.ch.c,5,.4);sfx("boom");CAM.shake=.3;pose(a,"win",30);pose(b,"win",30);await A(.3)},
  async(a,b)=>{pose(a,"cross",40);pose(b,"jab",40);a.turn.rotation.y=b.turn.rotation.y=FACE;await A(.15);for(const f of[a,b])pop("!",hex(f.ch.c),fx_(f).x,4.4*f.sc,"mv");sfx("warn");await A(.6)},
];
/* Team-Sprüche ({A}, {B} = Namen, {T} = Team-Name) */
const DUOQ=[
  ["{A} und {B}: unschlagbar!","{A} and {B}: unbeatable!","{A} et {B} : imbattables !","{A} y {B}: ¡imbatibles!"],
  ["{A} rechnet, {B} schlägt zu!","{A} solves, {B} strikes!","{A} calcule, {B} frappe !","¡{A} calcula, {B} golpea!"],
  ["Team {T} ist da!","Team {T} is here!","L’équipe {T} est là !","¡El equipo {T} está aquí!"],
  ["Zwei gegen zwei? Leicht!","Two against two? Easy!","Deux contre deux ? Facile !","¿Dos contra dos? ¡Fácil!"],
  ["{B}, halt mir den Rücken frei!","{B}, watch my back!","{B}, couvre-moi !","¡{B}, cúbreme!"],
  ["Gemeinsam sind wir 100 %!","Together we’re 100 %!","Ensemble, on fait 100 % !","¡Juntos somos el 100 %!"],
  ["{A} + {B} = Sieg!","{A} + {B} = victory!","{A} + {B} = victoire !","¡{A} + {B} = victoria!"],
  ["Achtung, hier kommt Team {T}!","Look out, here comes Team {T}!","Attention, voici l’équipe {T} !","¡Cuidado, llega el equipo {T}!"],
];
const teamName=(a,b)=>{const x=a.ch.n.replace(/[^A-Za-zÄÖÜäöü]/g,""),y=b.ch.n.replace(/[^A-Za-zÄÖÜäöü]/g,"");return x.slice(0,Math.ceil(x.length/2))+y.slice(Math.floor(y.length/2)).toLowerCase()};
async function duoIntro(f1,ci2,isP){const f2=isP?mkTP(ci2):mkF(CH[ci2],f1.side,false);fighters.push(f2);f2.root.visible=false;f1.root.visible=false;
  const h=hashStr(keyOf(f1)+"+"+keyOf(f2)),X=f1.hx,X2=clamp(X+f1.side*1.8,-6.6,6.6),o={X:(X+X2)/2,d:-f1.side,s:f1.side,c:f1.ch.c};
  camAt(o.X+o.d*1.6,2.7,9.4,o.X,2.1,4);camSnap();
  try{await ARRIVE[h%4](f1,X);await ARRIVE[(h>>3)%4](f2,X2);await GEST[(h>>6)%6](f1,f2);
    const q=DUOQ[(h>>9)%8],T=teamName(f1,f2),txt=L(...q).replace(/{A}/g,f1.ch.n).replace(/{B}/g,f2.ch.n).replace(/{T}/g,T);pop(txt,"#fff",o.X,4.8,"mv");await A(1);
    /* der Partner springt auf die Ersatzbank (aus dem Bild) */
    await arc(f2,fx_(f2).x,0,0,f1.side*10,0,0,3,.5,1)}catch(e){if(e!==WI.CANCEL)console.error(e)}
  rmF(f2);fighters.splice(fighters.indexOf(f2),1);settle(f1);pose(f1,"idle",12)}
async function duoIntros(){const id=++WI.id;WI.active=true;const vo={x:VO.x,y:VO.y,fw:VO.fw,fh:VO.fh};VO.x=VO.y=0;VO.fw=VO.fh=1;applyOff();
  document.body.classList.add("cine","intro");CAM.mode="cine";en.root.visible=false;
  if(WI.id===id)await duoIntro(pl,TG.p[1],true);if(WI.id===id)await duoIntro(en,TG.e[1],false);
  WI.active=false;$("#cut").className="";clearTemp();for(const f of[pl,en]){settle(f);pose(f,"idle",12)}fighters=[pl,en];
  document.body.classList.remove("cine","intro");Object.assign(VO,vo);layout();CAM.mode="fight";CAM.k=4}

/* ----- K.O. im Tag Team: Partner springt rein, es geht direkt weiter ----- */
async function tKO(a,b){const s=b.isP?"p":"e";TG.ko[s]++;hud();if(fo=="on")endOffer();
  if(!b.downed)await launch(b,b.side*5.6,2,.75,1);pose(b,"down",20);
  if(TG.ko[s]>=2){await backHop(a);a.turn.rotation.y=FACE;pose(a,"win",10);wins={p:TG.ko.e,e:TG.ko.p};hud();await rt(1.5);return result(a.isP)}
  await rt(.6);TG.cur[s]=1;rmF(b);const nf=s=="p"?mkTP(TG.p[1]):mkTE(TG.e[1]);nf.root.visible=false;fx_(nf).x=nf.side*10;if(s=="p")pl=nf;else en=nf;fighters=[pl,en];tNames();
  if(s=="p"){sel=null;inp="";lock=false}await recoverStand(a);await vJumpIn(nf);if(s=="e")en.timer=en.iv;
  msg(s=="p"?L("Dein Partner springt ein!","Your partner jumps in!","Ton partenaire entre en jeu !","¡Tu compañero entra!"):L("Der Gegner wechselt!","The enemy tags in!","L’adversaire change !","¡El rival cambia!"));
  render();over=false}
async function recoverStand(a){if(a.downed)await getUp(a);if(Math.abs(fx_(a).x-a.hx)>.2||fx_(a).y>.05)await backHop(a);a.turn.rotation.y=FACE;pose(a,"idle",12)}
