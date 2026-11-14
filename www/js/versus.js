/* ---------- Versus: zwei Spielende an einem Tablet ----------
   Spieler 1 rechnet unten, Spieler 2 oben (Steuerpult um 180° gedreht). Gleiche Stufe für beide, kein Computer-Gegner.
   Jeder wählt 2 Kämpfer. Geht einer K.O., kommt der zweite rein. Wer zuerst beide verliert, hat verloren.
   Antworten beide innerhalb von 0,7 Sekunden richtig, gibt es einen Zusammenprall: beide nehmen etwas Schaden. */
const VS_OK=()=>!PHONE&&GH>=560&&GW>=880;
const CLASH_T=700;
const V={team:[[],[]],cur:[0,0],ko:[0,0],pend:[null,null],gen:0,c:[]};
const PN=p=>L("Spieler ","Player ")+(p+1);

/* zweites Steuerpult: gleicher Aufbau wie das untere, nur ohne IDs */
{const p2=document.createElement("div");p2.id="panel2";p2.className="pnl";p2.hidden=true;
 p2.innerHTML=`<div class="pleft"><div class="pcards"></div><button type="button" class="pfin"><i></i><span></span><b></b></button></div><div class="pmsg"></div><div class="pside"><div class="pans"></div><div class="ppad"></div></div>`;
 document.body.insertBefore(p2,$("#menu"));
 p2.querySelector(".ppad").innerHTML=$("#pad").innerHTML;
 p2.querySelector(".ppad").addEventListener("pointerdown",e=>{const b=e.target.closest("[data-k]");if(!b)return;e.preventDefault();b.classList.add("dn");setTimeout(()=>b.classList.remove("dn"),110);vPress(1,b.dataset.k)});
 p2.querySelector(".pcards").addEventListener("pointerdown",e=>{const b=e.target.closest("[data-k]");if(b){e.preventDefault();vPick(1,b.dataset.k)}});
 p2.querySelector(".pfin").addEventListener("pointerdown",e=>{e.preventDefault();vPick(1,"sig")});
 const els=r=>({root:r,cards:r.querySelector(".pcards"),fin:r.querySelector(".pfin"),msg:r.querySelector(".pmsg"),ans:r.querySelector(".pans")});
 V.c=[{p:0,el:els($("#panel"))},{p:1,el:els(p2)}]}

const vF=p=>p?en:pl;
function vReset(c){Object.assign(c,{sel:null,inp:"",lock:false,cd:{last:null,n:0,lock:null,left:0},cards:{hieb:newCard("hieb"),kick:newCard("kick"),wurf:newCard("wurf"),sig:newCard("sig")}})}
function vMsg(c,t){c.el.msg.textContent=t}

/* ----- Auswahl: jeder Spieler wählt 2 Kämpfer, Spieler 2 sieht seinen Bildschirm gedreht ----- */
function vPickScreen(p){const t=V.team[p],other=V.team[1-p];
  const slot=n=>{const i=t[n];return`<div class="vslot${i!=null?" f":""}"><small>${n+1}</small>${i!=null?`<img src="${pic(i,"bust")}" alt="">`:"?"}</div>`};
  menu(`<h2 class="pickh">${PN(p)} · ${L("Wähle 2 Kämpfer","Choose 2 fighters")}</h2>
   <div class="vteam">${slot(0)}${slot(1)}<p class="tag" style="max-width:340px;text-align:left;margin:0">${L("Kämpfer 1 fängt an. Geht er K.O., kommt Kämpfer 2 rein.","Fighter 1 starts. If they’re knocked out, fighter 2 steps in.")}</p></div>
   <div class="grid vgrid">${ORDER.map(i=>[CH[i],i]).filter(([c])=>unlocked(c)).map(([c,i])=>{const n=t.indexOf(i),tk=other.includes(i);
     return`<button type="button" class="tile${n>=0?" on":""}${tk?" taken":""}" data-a="vtile" data-p="${p}" data-i="${i}"><img src="${pic(i,"bust")}" alt=""><span>${c.n}</span>${n>=0?`<b class="no">${n+1}</b>`:""}</button>`}).join("")}</div>
   <div class="rowb"><button class="btn alt sm" data-a="vback" data-p="${p}">${L("Zurück","Back")}</button><button class="btn" data-a="vnext" data-p="${p}"${t.length<2?" disabled":""}>${p?L("Weiter zur Arena","On to the arena"):L("Weiter zu Spieler 2","On to player 2")}</button></div>`,1);
  if(p)$("#menu").classList.add("flip")}
Object.assign(ACTIONS,{
  versus(){mode="v";if(pl){endFightUi();musicOn();attract();pl=en=null}V.team=[[],[]];vPickScreen(0)},
  vtile(b){const p=+b.dataset.p,i=+b.dataset.i,t=V.team[p],n=t.indexOf(i);if(n>=0)t.splice(n,1);else if(t.length<2)t.push(i);else t[1]=i;vPickScreen(p)},
  vnext(b){const p=+b.dataset.p;if(V.team[p].length<2)return;if(p==0)vPickScreen(1);else arenaScreen()},
  vback(b){const p=+b.dataset.p;if(p==0)home();else vPickScreen(0)},
  vnew(){V.team=[[],[]];vPickScreen(0)},
});

/* ----- Kampf starten ----- */
function vStart(){
  fid++;tws.length=0;rtw.length=0;TSb=1;hs=0;cine(false);speed(false);musicOff();
  stageI=SAVE.arena>=0&&stageOk(SAVE.arena)?SAVE.arena:P(okStages());
  menu(`<p class="tag">Versus · ${DIFFS[SAVE.diff][0]}</p><h1 class="logo"><span>${STG[stageI].n}</span>Versus</h1>`,1);
  setTimeout(()=>{const id=fid;
    clearFighters();clearTemp();buildStage(stageI);V.cur=[0,0];V.ko=[0,0];V.pend=[null,null];V.gen++;
    pl=vMk(0);en=vMk(1);fighters=[pl,en];
    round=1;wins={p:0,e:0};fo="none";$("#fo").hidden=true;sel=null;inp="";lock=false;busy=0;Q=Promise.resolve();over=true;document.body.classList.remove("lock");
    for(const c of V.c){vReset(c);vMsg(c,L("Löse eine Aufgabe, dann greift dein Kämpfer an!","Solve a problem and your fighter attacks!"))}
    $("#lv").innerHTML=`<b>VERSUS</b>${STG[stageI].n}`;vNames();
    $("#hud").hidden=false;$("#panel").hidden=false;$("#panel2").hidden=false;vRenderAll();layout();
    CAM.mode="fight";CAM.k=5;camFight();CAM.p.copy(CAM.tp).add(new THREE.Vector3(0,2,8));CAM.l.copy(CAM.tl);
    setTimeout(()=>{if(id!=fid)return;menuHide();vTeamIntro().then(()=>{if(id!=fid)return;rt(.3).then(countdown).then(ok=>{if(ok&&id==fid)over=false})})},2100)
  },60)}
/* Kämpfer bauen. Versus-Leben etwas tiefer als im Einzelspiel, damit ein Duell mit 4 Kämpfern nicht zu lange dauert. */
function vMk(p){const i=V.team[p][V.cur[p]],f=mkF(CH[i],p?1:-1,!p,1,useAlt(i)?1:0);f.max=f.hp=Math.round(f.max*.85);return f}
function vNames(){$("#pn").textContent=pl.ch.n;$("#en").textContent=en.ch.n;$("#pi").src=pic(V.team[0][V.cur[0]],"bust");$("#ei").src=pic(V.team[1][V.cur[1]],"bust")}

/* ----- Anzeige ----- */
function vHud(){if(!pl||!en)return;$("#ph").style.width=$("#pht").style.width=pl.hp/pl.max*100+"%";$("#eh").style.width=$("#eht").style.width=en.hp/en.max*100+"%";
  $("#pm").style.width=pl.mt+"%";$("#ec").style.width=en.mt+"%";$("#pmb").classList.toggle("full",pl.mt>=100);$("#ecb").classList.toggle("full",en.mt>=100);$("#ecb").classList.remove("warn");
  $("#plbl").textContent=$("#elbl").textContent=ATK.sig.n;
  /* Rauten = Kämpfer, die noch stehen */
  for(const[id,p]of[["#pw",0],["#ew",1]])document.querySelectorAll(id+" i").forEach((e,i)=>e.classList.toggle("w",i<2-V.ko[p]));
  for(const c of V.c)if(c.cards)vFin(c)}
function vFin(c){const f=vF(c.p);if(!f)return;const full=f.mt>=100,b=c.el.fin;b.classList.toggle("rdy",full);b.classList.toggle("sel",c.sel=="sig");b.firstElementChild.style.width=f.mt+"%";
  b.querySelector("span").textContent=full?ATK.sig.n+" · "+f.ch.sig.toUpperCase():ATK.sig.n+" "+Math.round(f.mt)+" %";b.querySelector("b").textContent=full?c.cards.sig.q[0]:""}
function vRender(c){const lb=LABELS[SAVE.diff?1:0];
  c.el.cards.innerHTML=["hieb","kick","wurf"].map(k=>{const LK=c.cd.lock==k,q=c.cards[k].q;return`<button type="button" class="card ${k}${c.sel==k?" sel":""}${LK?" cdl":""}" data-k="${k}"><span class="kj">${ATK[k].kj}</span><b>${ATK[k].n}</b><small>${LK?(LANG=="en"?"Resting · "+c.cd.left+" more":"Pause · noch "+c.cd.left+" andere"):(q[2]?L(...KINDS[q[2]]):lb[k])}</small><div class="q${q[0].length>19?" xl":q[0].length>13?" lg":""}">${LK?(LANG=="en"?"locked":"gesperrt"):q[0]}</div></button>`}).join("");
  c.el.root.classList.toggle("lk",c.lock);vFin(c);vAns(c)}
function vAns(c){const t=c.sel&&c.cards[c.sel].q[0],em=`<em>${c.inp||"?"}</em>`;let h;
  if(!c.sel)h=`<span class="hint">${c.wrong?L("Kurz durchatmen …","Take a breath …"):c.lock?L("Dein Kämpfer greift an …","Your fighter attacks …"):L("Attacke antippen, dann rechnen.","Tap an attack, then solve it.")}</span>`;
  else{const pt=t.split("▢"),sy=!t.includes("▢")&&unk(t)!==t?unk(t):null;h=(sy?`<span>${sy} =</span>${em}`:pt.length>1?`<span>${pt[0]}</span>${em}<span>${pt[1]}</span>`:`<span>${t} =</span>${em}`)+`<u></u><i class="pbon"></i>`}
  c.el.ans.innerHTML=h}
const vRenderAll=()=>{for(const c of V.c)vRender(c);vHud()};
/* Tempo-Bonus-Balken für beide Pulte */
function vTick(){for(const c of V.c){if(!c.sel)continue;const el=(performance.now()-c.cards[c.sel].t0)/1000,th=BONUS[c.sel],u=c.el.ans.querySelector("u"),bo=c.el.ans.querySelector(".pbon");
  if(u){u.textContent=el<=th[0]?L("BLITZ ×1,5","FLASH ×1.5"):el<=th[1]?L("SCHNELL ×1,25","QUICK ×1.25"):"";bo.style.width=clamp(1-el/th[1],0,1)*100+"%";bo.style.background=el<=th[0]?"var(--gold)":"var(--cyan)"}}}
function vShift(d){for(const c of V.c)if(c.cards)for(const k in c.cards)if(c.cards[k].t0)c.cards[k].t0+=d;for(const pd of V.pend)if(pd)pd.t+=d}
/* Bildaufteilung: Pult 2 oben gedreht, Leisten darunter, Arena in der Mitte, Pult 1 unten */
function vLayout(){const r=document.documentElement.style,p2=$("#panel2"),s=UIP,h=p2.offsetHeight;r.setProperty("--cl","0px");r.setProperty("--cr","0px");
  p2.style.transform=`translate(${GW}px,${h*s}px) rotate(180deg) scale(${s})`;$("#hud").style.top=h*s+"px";
  const hh=($("#hud").offsetHeight||70)*UIH,dk=Math.max(0,$("#panel").offsetHeight-22)*UIP,top=h*s+hh*.9;
  VO.x=0;VO.y=(dk-top)/2;VO.fw=1;VO.fh=Math.max(.3,(GH-hh-dk-h*s)/GH);applyOff()}

/* ----- Eingabe ----- */
function vPick(p,k){const c=V.c[p],f=vF(p);if(over||paused||c.lock||!f||k=="fin"||(k=="sig"&&f.mt<100))return;
  if(k==c.cd.lock){sfx("wrong");vMsg(c,L(`${ATK[k].n} macht Pause. Schaffe erst ${c.cd.left==1?"eine andere Attacke":c.cd.left+" andere Attacken"}!`,`${ATK[k].n} needs a rest. Land ${c.cd.left==1?"one other attack":c.cd.left+" other attacks"} first!`));return}
  if(c.sel!=k)c.inp="";c.sel=k;if(!c.cards[k].t0)c.cards[k].t0=performance.now();sfx("pick");vRender(c)}
function vPress(p,k){const c=V.c[p];if(over||paused||c.lock||!c.sel)return;
  if(k=="del"){c.inp=c.inp.slice(0,-1);sfx("key")}else if(k=="ok")return vSubmit(p);else if(c.inp.length<6){c.inp+=k;sfx("key")}vAns(c)}
function vSubmit(p){const c=V.c[p];if(!c.sel||c.inp==="")return;
  const k=c.sel,cd=c.cd,card=c.cards[k],ok=+c.inp==card.q[1],el=(performance.now()-card.t0)/1000,th=BONUS[k],f=vF(p),g=V.gen;c.sel=null;c.inp="";c.lock=true;c.cards[k]=newCard(k);let note="";
  /* dreimal dieselbe Attacke am Stück: Pause, bis 2 andere geschafft sind (wie im Einzelspiel) */
  if(k!="sig"){if(cd.last==k)cd.n++;else{cd.last=k;cd.n=1}
    if(ok&&cd.lock&&k!=cd.lock&&--cd.left<=0){note=L(` ${ATK[cd.lock].n} ist wieder frei.`,` ${ATK[cd.lock].n} is ready again.`);cd.lock=null}
    if(cd.n>=3){cd.lock=k;cd.left=2;cd.n=0;cd.last=null;note=L(` Dreimal ${ATK[k].n}: Der macht jetzt Pause.`,` Three ${ATK[k].n}es: it needs a rest now.`)}}
  else if(ok&&cd.lock&&--cd.left<=0){note=L(` ${ATK[cd.lock].n} ist wieder frei.`,` ${ATK[cd.lock].n} is ready again.`);cd.lock=null}
  if(ok){const mu=el<=th[0]?1.5:el<=th[1]?1.25:1;sfx("ok");vMsg(c,(mu>1.4?L("Blitzschnell! Schaden ×1,5.","Lightning fast! Damage ×1.5."):mu>1?L("Schnell gerechnet! Schaden ×1,25.","Quick maths! Damage ×1.25."):L("Richtig!","Correct!"))+note);if(k=="sig")f.mt=0;vOk(p,k,mu)}
  else{sfx("wrong");vMsg(c,`${P(QUIPS.bad)} ${unk(card.q[0])} = ${card.q[1]}.`+note);pop("?!","#a79fc7",fx_(f).x,4);if(busy==0)pose(f,"stumble",20);
    /* falsche Antwort: gut eine Sekunde Pause für dieses Pult */
    c.wrong=true;setTimeout(()=>{c.wrong=false;if(g!=V.gen)return;c.lock=false;if(busy==0&&!over&&vF(p)==f)pose(f,"idle",12);vRender(c)},1100)}
  vRender(c);vHud()}

/* ----- Angriffe und Zusammenprall ----- */
/* Läuft in der gemeinsamen Warteschlange. Nach einem K.O. (neue Generation) verfallen alte Aufträge. */
function vRun(ps,fn){const g=V.gen;q(async()=>{if(g==V.gen&&!over)await fn();if(g==V.gen)for(const p of ps){V.c[p].lock=false;vRender(V.c[p])}})}
function vOk(p,k,mu){const o=V.pend[1-p],me={p,k,mu,t:performance.now()};
  if(o&&k!="sig"&&o.k!="sig"){clearTimeout(o.to);V.pend[1-p]=null;const A=p?o:me,B=p?me:o;vRun([0,1],()=>clash(A,B));return}
  /* Hat der andere gerade eine Aufgabe offen, wartet die Attacke 0,7 s: Kommt seine richtige Antwort in dieser Zeit, prallen beide zusammen */
  const oc=V.c[1-p],wait=oc.sel&&!oc.lock&&k!="sig";
  const go=()=>vRun([p],()=>attack(vF(p),vF(1-p),k,mu));
  if(!wait)return go();
  V.pend[p]=me;const f=vF(p);if(busy==0)pose(f,"windup",20);pop("!",hex(f.ch.c),fx_(f).x,4.4*f.sc);
  me.to=setTimeout(function chk(){if(V.pend[p]!==me)return;if(paused){me.to=setTimeout(chk,100);return}V.pend[p]=null;if(over){V.c[p].lock=false;vRender(V.c[p]);return}go()},CLASH_T)}
async function clash(A,B){const a=pl,b=en;
  await Promise.all([a,b].map(async f=>{if(f.downed)await getUp(f)}));
  sfx("warn");pose(a,"windup",22);pose(b,"windup",22);await wait(.22);
  const mid=(fx_(a).x+fx_(b).x)/2;await Promise.all([dash(a,mid-.8,.2),dash(b,mid+.8,.2)]);pose(a,"cross",60);pose(b,"cross",60);
  const da=ATK[A.k].dm*a.dm*A.mu*.5,db=ATK[B.k].dm*b.dm*B.mu*.5;
  if(b.hp>1)impact(a,b,Math.min(da,b.hp-1),{lv:2,noKO:1,quiet:1,noReact:1});if(a.hp>1)impact(b,a,Math.min(db,a.hp-1),{lv:2,noKO:1,quiet:1,noReact:1});
  flash("#fff");impactFrame(170);glow(mid,2.1,0xffffff,13,.55);ring(mid,2.1,0,0xffc21a,6);sparks(mid,2.1,.6,56,[0xffffff,0xffc21a,a.ch.c,b.ch.c],13);burstLines(mid,2.1,0xffffff,20,4.6);hitRing(mid,2.1,0xffffff,2.6);
  CAM.shake=Math.max(CAM.shake,1);sfx("boom");sfx("slam");banner(L("ZUSAMMENPRALL!","CLASH!"),L("Beide gleichzeitig richtig","Both right at once"));
  TSb=.25;rt(.6).then(()=>{if(TSb==.25)TSb=1});
  pose(a,"hurt",30);pose(b,"hurt",30);await wait(.35);
  await Promise.all([backHop(a),backHop(b)]);a.turn.rotation.y=b.turn.rotation.y=FACE}

/* ----- K.O. und Kämpferwechsel ----- */
async function vKO(a,b){const pb=b.isP?0:1,g=++V.gen;for(const pd of V.pend)if(pd)clearTimeout(pd.to);V.pend=[null,null];
  for(const c of V.c){c.sel=null;c.inp="";c.lock=false;c.wrong=false}vRenderAll();
  if(!b.downed)await launch(b,b.side*5.6,2,.75,1);pose(b,"down",20);await backHop(a);a.turn.rotation.y=FACE;pose(a,"win",10);
  V.ko[pb]++;vHud();await rt(1.5);if(g!=V.gen)return;
  if(V.ko[pb]>=2)return vResult(1-pb);
  /* zweiter Kämpfer kommt rein, der Sieger behält seine Leben */
  V.cur[pb]=1;sc.remove(b.root);{const h=b.J.hd.children[0].material;h.map&&h.map.dispose();h.dispose()}
  const nf=vMk(pb);if(pb)en=nf;else pl=nf;fighters=[pl,en];fx_(nf).x=nf.hx;vNames();vHud();
  await rt(.4);await vJumpIn(nf);if(g!=V.gen)return;pose(a,"idle",12);a.turn.rotation.y=FACE;
  for(const c of V.c){c.lock=false;vMsg(c,L("Neuer Kämpfer! Weiter geht’s.","New fighter! Keep going."))}vRenderAll();
  await rt(.6);if(await countdown())over=false}
/* Vorstellung zu Beginn: je Team ein Banner mit beiden Köpfen und Namen (Spieler 2 gedreht), keine Einlauf-Animationen. Tippen überspringt. */
function vTeamIntro(){const el=$("#vsi"),band=p=>{const t=V.team[p];return`<div class="tb p${p+1}" style="--c1:${hex(CH[t[0]].c)};--c2:${hex(CH[t[1]].c)}"><div class="tl">${PN(p)}</div><div class="tm">${t.map(i=>`<figure><img src="${pic(i,"bust")}" alt=""><figcaption>${CH[i].n}</figcaption></figure>`).join(`<span>&amp;</span>`)}</div></div>`};
  el.innerHTML=band(1)+`<div class="vv">VS</div>`+band(0);el.hidden=false;el.className="";void el.offsetWidth;el.className="go";document.body.classList.add("vsi");sfx("vs");setTimeout(()=>sfx("gong"),700);
  return new Promise(res=>{let done=false;const end=()=>{if(done)return;done=true;el.removeEventListener("pointerdown",end);el.className="out";document.body.classList.remove("vsi");setTimeout(()=>{el.hidden=true},300);res()};
    el.addEventListener("pointerdown",end);setTimeout(end,2800)})}
/* Ersatzkämpfer springt von aussen in die Arena */
async function vJumpIn(f){const x0=f.side*10,x1=f.hx;f.root.visible=true;f.grounded=false;pose(f,"kickCh",25);fx_(f).x=x0;fx_(f).y=2;sfx("jump");setTimeout(()=>sfx("whoosh"),250);
  await tw(.8,p=>{fx_(f).x=lerp(x0,x1,p);fx_(f).y=lerp(2,0,p)+Math.sin(p*Math.PI)*4;f.piv.rotation.x=-Math.PI*2*eOut(p)});
  f.piv.rotation.x=0;fx_(f).y=0;f.grounded=true;landFx(f,f.ch.c,true);pose(f,"win",20);pop(f.ch.n+"!",hex(f.ch.c),x1,4.6*f.sc,"mv");await rt(.7);pose(f,"idle",12)}
/* Auftritt eines einzelnen Kämpfers (wie intro(), nur für einen) */
async function vEnter(f){const id=++WI.id;WI.active=true;const vo={x:VO.x,y:VO.y,fw:VO.fw,fh:VO.fh};VO.x=VO.y=0;VO.fw=VO.fh=1;applyOff();
  document.body.classList.add("cine","intro");CAM.mode="cine";f.root.visible=false;
  await walkIn(f);
  WI.active=false;$("#cut").className="";clearTemp();settle(f);pose(f,"idle",12);
  document.body.classList.remove("cine","intro");Object.assign(VO,vo);layout();CAM.mode="fight";CAM.k=4}
function vResult(w){over=true;endFightUi();sfx("win");const t=V.team[w],lt=V.team[1-w];
  menu(`<p class="tag">Versus · ${DIFFS[SAVE.diff][0]}</p><h1 class="logo"><span>${PN(w)}</span>${L("gewinnt!","wins!")}</h1>
   <div class="vres">${t.map((i,n)=>`<img src="${pic(i,"full")}" alt="" class="${n<V.cur[w]?"ko":""}">`).join("")}</div>
   <p>${L(`${CH[t[V.cur[w]]].n} steht als Letzter im Ring. ${CH[lt[0]].n} und ${CH[lt[1]].n} sind K.O.`,`${CH[t[V.cur[w]]].n} is the last one standing. ${CH[lt[0]].n} and ${CH[lt[1]].n} are knocked out.`)}</p>
   <div class="rowb"><button class="btn" data-a="again">${L("Revanche","Rematch")}</button><button class="btn alt" data-a="vnew">${L("Neue Teams","New teams")}</button><button class="btn alt" data-a="home">${L("Hauptmenü","Main menu")}</button></div>`,1);
  /* Gewinnt Spieler 2, steht das Ergebnis für ihn richtig herum */
  if(w)$("#menu").classList.add("flip")}
