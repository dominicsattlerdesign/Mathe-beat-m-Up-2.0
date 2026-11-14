/* ---------- Eigene Kampfbewegungen: jeder Kämpfer hat 3 Hiebe, 3 Kicks und 2 Würfe ----------
   Die Bewegungen werden aus Bausteinen gebaut (Kombo, Sprungtritt, Wurf …) und pro Kämpfer mit eigenem Tempo,
   eigenen Effekten und eigenen Requisiten versehen. Jede Bewegung macht in Summe genau den übergebenen Schaden (dm),
   damit alle Kämpfer fair bleiben. Schwere Kämpfer (Tempo 1–2) bewegen sich langsamer, dafür wackelt alles mehr. */
const SPD={1:1.32,2:1.16,3:1,4:.93,5:.85};
const sp=a=>SPD[TEMPO[a.ch.id]||3],hvy=a=>(TEMPO[a.ch.id]||3)<=2;
const Wt=(a,t)=>wait(t*sp(a)),Tw=(a,t,fn)=>tw(t*sp(a),fn);
const SW=a=>hvy(a)?"whoosh":"swoosh";
const unkeep=m=>{sc.remove(m);const i=TEMP.indexOf(m);if(i>=0)TEMP.splice(i,1)};

/* ----- Element-Effekte bei jedem Treffer ----- */
function cardBits(x,y,n){for(let i=0;i<n;i++){const m=new THREE.Mesh(gB(.26,.38,.02),bmat(i%2?0xff3dcb:0xf4f0ff)),v=[rnd(-4,4),rnd(1,5)];m.position.set(x,y,.5);
  fxAdd(m,.55,(m,p,dt)=>{m.position.x+=v[0]*dt;m.position.y+=v[1]*dt;v[1]-=12*dt;m.rotation.z+=.3;m.rotation.y+=.2})}}
function rocks(x,y,n){for(let i=0;i<n;i++){const m=M(gD(rnd(.14,.3)),0x6a6570,[x,y,0],sc,1,0,"stone");debris.push({m,v:new THREE.Vector3(rnd(-4,4),rnd(2,7),rnd(-2,2)),s:new THREE.Vector3(rnd(8),rnd(8),rnd(8)),l:1.6,r:.2})}}
function fireBits(x,y,n,c1,c2){for(let i=0;i<n;i++)fireball(x,y,x+rnd(-1.1,1.1),y+rnd(-.2,1.5),i%2?c1:c2,.3,rnd(.16,.32))}
function sym(t,x,y,c="#3dffd0",s=1.1){const m=txt(t,c,s);fxAdd(m,.7,(m,p)=>{m.position.set(x,y+p*1.4,.6);m.material.opacity=p>.6?1-(p-.6)/.4:1})}
const EFX={
  raiko:(a,x,y,lv)=>{sparks(x,y,.6,6+lv*4,[0xffd83a,0xffffff],8);glow(x,y,0xffd83a,2+lv);if(lv>1)bolt(x,0xffffff,10,0)},
  akane:(a,x,y,lv)=>{fireBits(x,y,2+lv*2,0xff5a1a,0xffc21a);glow(x,y,0xff5a1a,2.5+lv)},
  rokka:(a,x,y,lv)=>{sparks(x,y,.6,8+lv*5,[0x25d4ff,0xffffff,0x7fe8ff],6);if(lv>1)ring(x,.06,0,0x25d4ff,2.5)},
  zeno:(a,x,y,lv)=>{cardBits(x,y,2+lv*2)},
  tetsu:(a,x,y,lv)=>{slashArc(x,y,0xffffff,rnd(6.3),1.5+lv*.4);if(lv)sparks(x,y,.6,6+lv*3,[0xffb7d5,0xffffff],5)},
  volt:(a,x,y,lv)=>{sparks(x,y,.6,6+lv*4,[0x25d4ff,0xff8a00,0xffffff],9);if(lv)glow(x,y,0x25d4ff,3+lv)},
  luna:(a,x,y,lv)=>{star(x+rnd(-.3,.3),y+.4,0xffe98a,.7+lv*.3);glow(x,y,0xc9b8ff,2+lv)},
  goro:(a,x,y,lv)=>{rocks(x,y,2+lv*2);dust(x,0,3+lv*2)},
  shade:(a,x,y,lv)=>{sparks(x,y,.6,8+lv*4,[0x1c1a2a,0x9a6bff,0x3a2a60],6);glow(x,y,0x9a6bff,2+lv)},
  mika:(a,x,y,lv)=>{sparks(x,y,.6,6+lv*4,[0x3fe06b,0xb8ffcc,0xffffff],7);if(lv)hitRing(x,y,0x3fe06b,1+lv*.3)},
  drako:(a,x,y,lv)=>{fireBits(x,y,2+lv*2,0xff3b2f,0xffe14d);glow(x,y,0xff3b2f,3+lv)},
  oni:(a,x,y,lv)=>{sparks(x,y,.6,6+lv*3,[0xffc21a,0xffffff],7);if(lv)bolt(x,0xffc21a,10,0)},
  seraph:(a,x,y,lv)=>{sparks(x,y,.6,6+lv*4,[0xffe98a,0xffffff],7);if(lv)shaft(x,0xffe98a,.35,.9)},
  kaiser:(a,x,y,lv)=>{hitRing(x,y,0x9a3cff,1+lv*.5);sparks(x,y,.6,6+lv*4,[0x05040a,0x9a3cff,0xff2a4a],6)},
  magus:(a,x,y,lv)=>{sym(P(["+","−","×","÷","=","π","√","%"]),x+rnd(-.5,.5),y+.6)},
};
function hit(a,b,dm,o={}){impact(a,b,dm,o);const x=fx_(b).x,y=o.y!=null?o.y:2.1*b.sc+fx_(b).y,lv=o.lv||0;(EFX[a.ch.id]||(()=>{}))(a,x,y,lv);
  if(hvy(a)){CAM.shake=Math.max(CAM.shake,.22+lv*.16);if(lv)dust(x,0,3+lv*2)}}

/* ----- kleine Bewegungs-Helfer ----- */
const go=(a,b,g,t=.2)=>dash(a,clamp(fx_(b).x+a.side*g,-6.9,6.9),t*sp(a));
function bump(b,h=.6,t=.26){if(b.hp<=0)return Promise.resolve();b.grounded=false;return tw(t,p=>{fx_(b).y=Math.sin(p*Math.PI)*h}).then(()=>{fx_(b).y=0;b.grounded=true})}
async function land(a){await landA(a);if(hvy(a)){CAM.shake=Math.max(CAM.shake,.4);dust(fx_(a).x,0,6);ring(fx_(a).x,.06,0,a.ch.c,2.4)}}
async function END(k,a,b){
  if(k=="launch")return launch(b,b.side*6.2,1.6,.6,1);if(k=="high")return launch(b,b.side*4.8,3.2,.8,1.5);if(k=="low")return launch(b,b.side*6.5,.6,.5,0);
  if(k=="far")return launch(b,b.side*7,2.3,.72,2);if(k=="bump")return bump(b);if(k=="crouch"){if(b.hp>0)pose(b,"crouch",35);return Wt(a,.4)}return Wt(a,.22)}
const LAUNCHY=k=>k&&k!="bump"&&k!="crouch";
async function grab(a,b){await go(a,b,.95,.2);pose(a,"grab",35);sfx("grab");await Wt(a,.14);b.grounded=false;b.downed=true;pose(b,"held",30)}
function dropProp(mk,x,a){const m=mk(a);fxAdd(m,.5,(m,p)=>{const q=Math.min(1,p*6);m.position.set(x,lerp(7,1.7,q*q),.4);if(p>.6)m.scale.setScalar(Math.max(.01,1-(p-.6)/.4))})}
const trailOf=cols=>(x,y)=>sparks(x,y,0,1,cols,2);
const fireTrail=c=>(x,y)=>fireball(x,y,x+rnd(-.3,.3),y+rnd(0,.5),c,.25,rnd(.12,.22));

/* ----- Hiebe ----- */
/* Kombo: mehrere Schläge nacheinander. hits: {p:Pose, f:Anteil, lv, pre:Ausholpose, lunge, cut:Schnittbogen, fx} */
const hCombo=o=>async(a,b,dm)=>{await go(a,b,o.gap||1.45);const H=o.hits,n=H.length;
  for(let i=0;i<n;i++){const h=H[i],last=i==n-1;if(h.pre){pose(a,h.pre,30);await Wt(a,h.pw||.13)}pose(a,h.p,h.ps||50);sfx(h.sw||SW(a));
    if(h.lunge)await Tw(a,.07,p=>{fx_(a).x=clamp(fx_(a).x-a.side*h.lunge*.05,-6.9,6.9)});else await Wt(a,.07);
    const y=(h.y||2.1)*b.sc;if(h.cut)slashArc(fx_(b).x,y,h.cut===1?a.ch.c:h.cut,h.rot!=null?h.rot:rnd(6.3),h.cs||2.4);
    hit(a,b,dm*h.f,{lv:h.lv||0,arc:h.arc,s:h.s||(h.lv?"heavy":"punch"),y,push:h.push!=null?h.push:.1,quiet:h.q,stop:h.stop,noReact:last&&LAUNCHY(o.end)});
    if(h.fx)h.fx(a,b);await Wt(a,h.after!=null?h.after:.13)}
  await END(o.end,a,b)};
/* Schwerer Einzelschlag mit Ausholen */
const hHeavy=o=>async(a,b,dm)=>{await go(a,b,o.gap||1.5,.22);pose(a,o.pre||"windup",22);glow(fx_(a).x,2.2*a.sc,a.ch.c,2.6,.4);if(o.charge)o.charge(a);await Wt(a,o.cw||.3);
  pose(a,o.p||"cross",58);sfx(SW(a));await Wt(a,.07);hit(a,b,dm,{lv:2,arc:o.arc,s:o.s||"heavy",stop:.13,noReact:LAUNCHY(o.end||"launch"),y:(o.y||2.1)*b.sc});if(o.fx)o.fx(a,b);
  await END(o.end||"launch",a,b)};
/* Verschwinden und von hinten zuschlagen */
const hBlink=o=>async(a,b,dm)=>{const d=-a.side,bx=fx_(b).x,n=o.n||2;pose(a,"crouch",30);await Wt(a,.12);glow(fx_(a).x,1.8,a.ch.c,3,.3);streak(fx_(a).x,1.6,d,a.ch.c,4);a.root.visible=false;sfx("whoosh");await Wt(a,.14);
  for(let i=0;i<n;i++){const back=i%2==0,last=i==n-1;fx_(a).x=clamp(bx+(back?d:-d)*1.3,-7,7);a.turn.rotation.y=back?-FACE:FACE;a.root.visible=true;glow(fx_(a).x,2,a.ch.c,2.6,.25);
    pose(a,last?(o.p2||"upper"):(o.p||"cross"),58);sfx(SW(a));await Wt(a,.06);hit(a,b,dm*(last?(n>1?.6:1):.4/(n-1)),{lv:last?2:0,arc:1,s:last?"heavy":"punch",noReact:last&&LAUNCHY(o.end||"launch"),stop:last?.12:.05,push:.05});
    if(!last){await Wt(a,.12);a.root.visible=false;sfx("whoosh");await Wt(a,.08)}}
  a.turn.rotation.y=FACE;await END(o.end||"launch",a,b)};
/* Durch den Gegner hindurch: ein Schnitt, dann der Treffer */
const hThrough=o=>async(a,b,dm)=>{const d=-a.side,bx=fx_(b).x,x0=fx_(a).x,tx=clamp(bx+d*1.9,-6.8,6.8);pose(a,o.pre||"windup",25);await Wt(a,.26);sfx("whoosh");pose(a,"cross",50);streak(tx,1.8*a.sc,d,a.ch.c,6);
  await Tw(a,.08,p=>{fx_(a).x=lerp(x0,tx,p)});slashArc(bx,2.1*b.sc,0xffffff,.4,2.8);pose(a,"hurl",30);await Wt(a,.36);
  for(let i=0;i<(o.n||3);i++)slashArc(bx+rnd(-.3,.3),2*b.sc+rnd(-.6,.6),i?a.ch.c:0xffffff,rnd(6),2.2);hit(a,b,dm,{lv:1,s:"heavy",stop:.12,push:.01});if(o.fx)o.fx(a,b);await Wt(a,.3)};
/* Sprung und Schlag von oben */
const hSlam=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,tx=clamp(fx_(b).x-d*1.15,-6.9,6.9),H=o.h||3.1;pose(a,"crouch",25);await Wt(a,.16);a.grounded=false;sfx("jump");pose(a,"skyfall",20);dust(x0,0,3);
  await Tw(a,.3,p=>{fx_(a).x=lerp(x0,tx,p);fx_(a).y=eOut(p)*H});await Wt(a,.07);sfx("whoosh");pose(a,"hurl",45);await Tw(a,.1,p=>{fx_(a).y=H*(1-p*p)});fx_(a).y=0;a.grounded=true;
  const bx=fx_(b).x;if(o.prop)dropProp(o.prop,bx,a);hit(a,b,dm,{lv:2,s:"slam",y:3*b.sc,r:2,max:4,noReact:1,stop:.12});ring(bx,.06,0,a.ch.c,3.5);dust(bx,0,8);if(hvy(a))crack(bx,2,1);if(o.fx)o.fx(a,b);
  if(b.hp>0){pose(b,"crouch",35);await Wt(a,.45)}};
/* Drehschlag (auch als Drehtritt mit p:"kick") */
const hSpin=o=>async(a,b,dm)=>{await go(a,b,o.gap||1.4);pose(a,"windup",30);await Wt(a,.12);sfx(SW(a));pose(a,o.p||"cross",40);const t=o.turns||1;
  await Tw(a,.26*t,p=>{a.turn.rotation.y=FACE+p*Math.PI*2*t;if(o.trail&&Math.random()<.5)o.trail(fx_(a).x,2,a)});a.turn.rotation.y=FACE;pose(a,o.p||"cross",60);
  slashArc(fx_(b).x,2*b.sc,o.col||a.ch.c,0,2.6);hit(a,b,dm,{lv:2,arc:1,s:o.s||"heavy",noReact:LAUNCHY(o.end||"launch"),stop:.12,y:(o.y||2)*b.sc});if(o.fx)o.fx(a,b);await END(o.end||"launch",a,b)};
/* In den Boden schlagen: Stacheln steigen unter dem Gegner auf */
const hGround=o=>async(a,b,dm)=>{const d=-a.side,ax=fx_(a).x,bx=fx_(b).x;pose(a,"lift",25);await Wt(a,.25);pose(a,"hurl",50);sfx("slam");CAM.shake=Math.max(CAM.shake,.4);crack(ax+d*1,1.2,0);ring(ax+d*1,.06,0,a.ch.c,2.5);
  for(let i=0;i<3;i++){const x=lerp(ax+d*1.2,bx,(i+1)/3),m=M(gK(.3+i*.06,2.2,6),o.col||0x6a6570,[x,-1.4,rnd(-.2,.2)],sc,1,o.em||0,o.kind||"stone"),h=1+i*.45;
    tw(.55,p=>{m.position.y=-1.4+Math.sin(p*Math.PI)*h}).then(()=>sc.remove(m));dust(x,0,3);await Wt(a,.08)}
  hit(a,b,dm,{lv:2,noReact:1,s:"heavy",y:1.2});if(o.fx)o.fx(a,b);await launch(b,b.side*4.8,3,.75,1.5)};
/* Gegner heranziehen, dann zuschlagen */
const hPull=o=>async(a,b,dm)=>{const d=-a.side,ax=fx_(a).x,bx=fx_(b).x,tx=clamp(ax+d*1.4,-6.9,6.9);pose(a,"grab",30);glow(ax+d*.8,2,a.ch.c,3,.5);sfx("charge");b.grounded=false;pose(b,"air",25);
  await Tw(a,.32,p=>{fx_(b).x=lerp(bx,tx,ease(p));fx_(b).y=Math.sin(p*Math.PI)*.6;if(Math.random()<.6)sparks(fx_(b).x,2,0,1,[a.ch.c,0xffffff],2)});fx_(b).y=0;b.grounded=true;
  pose(a,o.p||"cross",60);sfx(SW(a));await Wt(a,.06);hit(a,b,dm,{lv:2,s:"heavy",noReact:1,stop:.12});if(o.fx)o.fx(a,b);await END(o.end||"launch",a,b)};
/* Stoss mit Lichtstrahl / Energie */
const hBeam=o=>async(a,b,dm)=>{await go(a,b,o.gap||2.4);pose(a,"windup",25);glow(fx_(a).x,2.2,a.ch.c,2.5,.4);await Wt(a,.22);pose(a,o.p||"cross",60);sfx("zap");
  const ax=fx_(a).x-a.side*.6,bx=fx_(b).x,n=o.n||1;beam(ax,bx-a.side*.6,2.1*a.sc,o.col||a.ch.c,.35,.35);await Wt(a,.05);
  for(let i=0;i<n;i++){const last=i==n-1;hit(a,b,dm/n,{lv:last?2:0,s:last?"heavy":"punch",noReact:last,quiet:i>0&&!last,push:.05,stop:.04});await Wt(a,.07)}
  if(o.fx)o.fx(a,b);await END(o.end||"launch",a,b)};

/* ----- Kicks ----- */
const kFly=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,tx=clamp(fx_(b).x-d*(o.gap||1.5),-6.9,6.9),H=o.h||1.4;pose(a,"crouch",25);await Wt(a,.14);a.grounded=false;sfx("jump");pose(a,"kickCh",25);dust(x0,0,3);let k=0;
  await Tw(a,o.t||.36,p=>{fx_(a).x=lerp(x0,tx,ease(p));fx_(a).y=Math.sin(p*Math.PI)*H*(1-p*.5)+.55*p;if(o.spin)a.turn.rotation.y=FACE+p*Math.PI*2*o.spin;if(o.flip)a.piv.rotation.x=-p*Math.PI*2*o.flip;
    if(o.trail&&Math.random()<.6)o.trail(fx_(a).x,fx_(a).y+1.4,a);if(p>.55&&!k){k=1;pose(a,"kick",40);sfx(SW(a))}});
  a.turn.rotation.y=FACE;a.piv.rotation.x=0;hit(a,b,dm,{lv:o.lv!=null?o.lv:1,s:"kick",arc:1,noReact:1,stop:.11,y:(o.y||2.3)*b.sc});if(o.fx)o.fx(a,b);
  await Promise.all([END(o.end||"launch",a,b),(async()=>{await Wt(a,.1);await land(a)})()])};
const kAxe=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,bx=fx_(b).x,tx=clamp(bx-d*1.2,-6.9,6.9),H=o.h||3;pose(a,"crouch",25);await Wt(a,.14);a.grounded=false;sfx("jump");pose(a,"kickCh",25);dust(x0,0,3);
  await Tw(a,.34,p=>{fx_(a).x=lerp(x0,tx,p);fx_(a).y=eOut(p)*H;a.piv.rotation.x=-Math.PI*2*p*(o.flips||1);if(o.trail&&Math.random()<.5)o.trail(fx_(a).x,fx_(a).y+1.4,a)});a.piv.rotation.x=0;pose(a,"kick",60);await Wt(a,.08);sfx(SW(a));
  await Tw(a,.1,p=>{fx_(a).y=H*(1-p)+.6*p});hit(a,b,dm,{lv:2,s:"slam",noReact:1,stop:.13,y:2.6*b.sc,r:1.8});ring(bx,.06,0,a.ch.c,3);dust(bx,0,6);if(o.fx)o.fx(a,b);
  if(b.hp>0)pose(b,"crouch",35);await land(a);await Wt(a,.25)};
const kMulti=o=>async(a,b,dm)=>{await go(a,b,o.gap||1.4,.18);const n=o.n||3,lf=o.lastF||.4;if(o.air){a.grounded=false;sfx("jump");await Tw(a,.15,p=>{fx_(a).y=p*o.air})}
  for(let i=0;i<n;i++){const last=i==n-1;pose(a,i%2?"kickCh":"kick",o.ps||60);if(o.spin)await Tw(a,.1,p=>{a.turn.rotation.y=FACE+p*Math.PI*2});else await Wt(a,o.gapT||.08);a.turn.rotation.y=FACE;pose(a,"kick",70);sfx(SW(a));
    hit(a,b,dm*(last?lf:(1-lf)/(n-1)),{s:"kick",arc:1,lv:last?1:0,quiet:!last&&i%2==1,push:last?.4:.08,stop:last?.1:.03,y:(o.ys?o.ys[i%o.ys.length]:1.6+(i%3)*.4)*b.sc,noReact:last&&LAUNCHY(o.end)});
    if(o.each)o.each(a,b,i);await Wt(a,.06)}
  if(o.air)await land(a);await END(o.end,a,b)};
const kDive=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,bx=fx_(b).x,ux=x0+d*.3,uy=o.h||4.2;pose(a,"crouch",25);await Wt(a,.14);a.grounded=false;sfx("jump");pose(a,"kickCh",22);dust(x0,0,3);
  await Tw(a,.32,p=>{fx_(a).x=lerp(x0,ux,p);fx_(a).y=eOut(p)*uy;a.piv.rotation.x=-Math.PI*2*p});a.piv.rotation.x=.75;pose(a,"kick",50);await Wt(a,.12);sfx("whoosh");
  const tx=clamp(bx-d*1.2,-6.9,6.9);streak(tx,2.2,d,a.ch.c,5);await Tw(a,.13,p=>{fx_(a).x=lerp(ux,tx,p);fx_(a).y=lerp(uy,.5,p);if(o.trail)o.trail(fx_(a).x,fx_(a).y+1,a)});
  hit(a,b,dm,{lv:2,s:"kick",arc:1,noReact:1,y:2*b.sc,stop:.13,r:1.6});ring(bx,.06,0,a.ch.c,3);if(o.fx)o.fx(a,b);await Promise.all([launch(b,b.side*6.5,.5,.5,0),land(a)])};
const kSweep=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,bx=fx_(b).x;pose(a,"slide",25);sfx("whoosh");
  await Tw(a,.24,p=>{fx_(a).x=lerp(x0,bx-d*1.2,eOut(p));if(Math.random()<.5){dust(fx_(a).x,0,1);if(o.trail)o.trail(fx_(a).x,.4,a)}});
  hit(a,b,dm*.4,{s:"kick",y:.5,noReact:1,stop:.06});b.grounded=false;b.downed=true;pose(b,"air",25);pose(a,"crouch",25);
  await Tw(a,.28,p=>{fx_(b).y=eOut(p)*(o.h||1.5);b.piv.rotation.x=-eOut(p)*Math.PI/2});
  a.grounded=false;pose(a,"kick",50);sfx(SW(a));a.piv.rotation.x=-.5;await Tw(a,.1,p=>{fx_(a).y=p*.9});
  hit(a,b,dm*.6,{lv:1,s:"kick",arc:1,noReact:1,y:fx_(b).y+1.6*b.sc,stop:.1});if(o.fx)o.fx(a,b);await Promise.all([launch(b,b.side*6.3,1.6,.62,1),land(a)])};
const kStomp=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,tx=clamp(fx_(b).x-d*(o.gap||2),-6.9,6.9);pose(a,"crouch",25);await Wt(a,.18);a.grounded=false;sfx("jump");pose(a,"skyfall",20);
  await Tw(a,.36,p=>{fx_(a).x=lerp(x0,tx,p);fx_(a).y=Math.sin(p*Math.PI)*(o.h||2.4)});fx_(a).y=0;a.grounded=true;pose(a,"crouch",40);sfx("slam");CAM.shake=Math.max(CAM.shake,.5+(hvy(a)?.3:0));
  for(let i=0;i<3;i++)ring(tx,.06,0,i?a.ch.c:0xffffff,2+i*1.6,.5);dust(tx,0,10);crack(fx_(b).x,1.4,1);if(o.fx)o.fx(a,b);
  hit(a,b,dm,{lv:2,s:"slam",noReact:1,y:.6,stop:.12});await launch(b,b.side*5.6,2.6,.7,1);pose(a,"idle",14)};
const kKnee=o=>async(a,b,dm)=>{const d=-a.side,x0=fx_(a).x,tx=clamp(fx_(b).x-d*1.1,-6.9,6.9);pose(a,"run",30);sfx("whoosh");
  await Tw(a,o.t||.28,p=>{fx_(a).x=lerp(x0,tx,p*p);if(Math.random()<.5){dust(fx_(a).x,0,1);if(o.trail)o.trail(fx_(a).x,1.4,a)}});
  a.grounded=false;pose(a,"kickCh",60);await Tw(a,.1,p=>{fx_(a).y=p*.9});hit(a,b,dm,{lv:2,s:"kick",noReact:1,stop:.12,y:1.9*b.sc});if(o.fx)o.fx(a,b);
  await Promise.all([launch(b,b.side*6.2,o.h||2.2,.65,1),land(a)])};
const kPush=o=>async(a,b,dm)=>{await go(a,b,o.gap||1.6);pose(a,"kickCh",30);await Wt(a,.2);pose(a,"kick",60);sfx(SW(a));await Tw(a,.06,p=>{fx_(a).x=clamp(fx_(a).x-a.side*.08,-6.9,6.9)});
  hit(a,b,dm,{lv:2,s:"kick",noReact:1,stop:.12,y:1.9*b.sc,push:0});if(o.fx)o.fx(a,b);streak(fx_(b).x,1.8,-a.side,a.ch.c,4);await launch(b,b.side*6.8,.7,.5,0);pose(a,"idle",12)};

/* ----- Würfe ----- */
/* Geschoss(e) werfen. mk(a,i) baut das Geschoss. */
const wProj=o=>async(a,b,dm)=>{const d=-a.side,n=o.n||1,lf=n>1?(o.lastF||.4):1;if(o.gap)await go(a,b,o.gap);if(o.pre){pose(a,o.pre,25);await Wt(a,.18)}
  for(let i=0;i<n;i++){const last=i==n-1;pose(a,o.p||(i%2?"cross":"hurl"),50);sfx(o.sw||"whoosh");const m=keep(o.mk(a,i)),ax=fx_(a).x+d*.7,ay=(o.y0||2.5)*a.sc,bx=fx_(b).x,by=(o.y1||2.1)*b.sc+(o.spread?rnd(-.4,.4):0);
    if(o.face)m.rotation.z=d>0?0:Math.PI;
    const f=Tw(a,o.t||.3,p=>{m.position.set(lerp(ax,bx,p),lerp(ay,by,p)+Math.sin(p*Math.PI)*(o.arc||0),.3);m.rotation.z+=o.spin!=null?o.spin:.4;if(o.trail&&Math.random()<.7)o.trail(m.position.x,m.position.y,a)})
      .then(()=>{unkeep(m);hit(a,b,dm*(last?lf:(1-lf)/(n-1)),{lv:last?2:0,s:last?"heavy":"punch",noReact:last,quiet:!last&&i%2==1,push:.1,stop:last?.12:.03,y:by});if(o.boom&&last)o.boom(bx,by,a)});
    if(last)await f;else await Wt(a,o.gapT||.14)}
  await END(o.end||"launch",a,b)};
/* packen, drehen, schleudern */
const wSpin=o=>async(a,b,dm)=>{await grab(a,b);pose(a,"lift",16);const ax=fx_(a).x,bx=fx_(b).x,ly=3.72*a.sc-1.6*b.sc,S=o.spins||2;
  await Tw(a,.3,p=>{const e=ease(p);fx_(b).x=lerp(bx,ax,e);fx_(b).y=e*ly;b.piv.rotation.x=-e*Math.PI/2});let n0=0;
  await Tw(a,.26*S,p=>{const r=FACE+ease(p)*Math.PI*2*S;a.turn.rotation.y=r;b.turn.rotation.y=r;const n=Math.floor(p*S*2);if(n>n0){n0=n;sfx("whoosh")}if(o.trail&&Math.random()<.6)o.trail(fx_(b).x,fx_(b).y+1,a)});
  a.turn.rotation.y=b.turn.rotation.y=FACE;pose(a,"hurl",45);sfx("whoosh");
  await launch(b,b.side*6.4,o.h||2.4,.62,2,{land:()=>{hit(a,b,dm,{lv:2,s:"slam",y:.5,noReact:1,r:2.7,max:6,stop:.12});ring(fx_(b).x,.06,0,a.ch.c,4);if(o.boom)o.boom(fx_(b).x,.6,a)}})};
/* packen, hochspringen, mit dem Gegner in den Boden */
const wSky=o=>async(a,b,dm)=>{await grab(a,b);const d=-a.side;a.grounded=false;pose(a,"lift",20);const ax=fx_(a).x,bx=fx_(b).x,H=o.h||4.3,yl=-1.32*b.sc;sfx("jump");
  await Tw(a,.5,p=>{const e=eOut(p),r=FACE+p*Math.PI*2*(o.turns||2);fx_(a).y=e*H;fx_(b).y=e*H+.3;fx_(b).x=lerp(bx,ax+d*.55,Math.min(1,p*3));b.piv.rotation.x=-Math.min(1,p*2)*Math.PI;a.turn.rotation.y=r;b.turn.rotation.y=r;if(o.trail&&Math.random()<.6)o.trail(ax,fx_(a).y+1.5,a)});
  a.turn.rotation.y=b.turn.rotation.y=FACE;await Wt(a,.1);sfx("whoosh");await Tw(a,.15,p=>{const e=p*p;fx_(a).y=H*(1-e);fx_(b).y=lerp(H+.3,yl+1.5,e)});
  fx_(a).y=0;a.grounded=true;pose(a,"hurl",40);hit(a,b,dm,{lv:2,s:"slam",y:.6,noReact:1,r:2.7,max:6,stop:.14});ring(fx_(b).x,.06,0,a.ch.c,4.5);dust(fx_(b).x,0,10);if(o.boom)o.boom(fx_(b).x,.6,a);
  await Tw(a,.32,p=>{b.piv.rotation.x=lerp(-Math.PI,-Math.PI/2,p);fx_(b).y=lerp(yl+1.5,yl,p)+Math.sin(p*Math.PI)*.4});pose(b,"down",25)};
/* über den Kopf heben und vor sich in den Boden rammen */
const wSlam=o=>async(a,b,dm)=>{await grab(a,b);pose(a,"lift",18);const d=-a.side,ax=fx_(a).x,bx=fx_(b).x,ly=3.72*a.sc-1.6*b.sc+(o.hi||0),yl=-1.32*b.sc;sfx("whoosh");
  await Tw(a,.34,p=>{const e=ease(p);fx_(b).x=lerp(bx,ax,e);fx_(b).y=e*ly;b.piv.rotation.x=-e*Math.PI});await Wt(a,o.hold||.14);pose(a,"hurl",55);sfx("whoosh");const tx=clamp(ax+d*1.3,-6.9,6.9);
  await Tw(a,.16,p=>{fx_(b).x=lerp(ax,tx,p);fx_(b).y=lerp(ly,yl+.3,p*p);b.piv.rotation.x=lerp(-Math.PI,-Math.PI/2,p)});fx_(b).y=yl;b.piv.rotation.x=-Math.PI/2;
  hit(a,b,dm,{lv:2,s:"slam",y:.5,noReact:1,r:2.7,max:6,stop:.14});ring(tx,.06,0,a.ch.c,4.5);dust(tx,0,10);if(o.boom)o.boom(tx,.6,a);CAM.shake=Math.max(CAM.shake,.6);pose(b,"down",25);await Wt(a,.35)};
/* festhalten und drücken, dann wegschleudern */
const wHug=o=>async(a,b,dm)=>{await grab(a,b);const n=o.n||3;
  for(let i=0;i<n;i++){pose(a,"lift",40);squash(b,.82,1.1);sfx("punch");CAM.shake=Math.max(CAM.shake,.3);hit(a,b,dm*.6/n,{quiet:i%2==1,stop:.04,push:0,noReact:1,y:2*b.sc});if(o.each)o.each(a,b,i);await Wt(a,.18);squash(b,1,1);pose(a,"grab",40);await Wt(a,.1)}
  pose(a,"hurl",50);sfx("whoosh");await launch(b,b.side*6.2,2.2,.6,1.5,{land:()=>{hit(a,b,dm*.4,{lv:2,s:"slam",y:.5,noReact:1,stop:.12});if(o.boom)o.boom(fx_(b).x,.6,a)}})};
/* ohne Berührung anheben (Magie), drehen, fallen lassen */
const wLift=o=>async(a,b,dm)=>{const bx=fx_(b).x,H=o.h||3.6,yl=-1.32*b.sc;pose(a,"charge",25);glow(fx_(a).x,2.4,a.ch.c,3,.5);sfx("charge");b.grounded=false;b.downed=true;pose(b,"air",25);
  await Tw(a,.6,p=>{fx_(b).y=eOut(p)*H;b.piv.rotation.x=-p*Math.PI*(o.flips||2);fx_(b).x=bx+Math.sin(p*9)*.15;if(Math.random()<.6)sparks(bx+rnd(-.8,.8),fx_(b).y+rnd(0,2),0,1,[a.ch.c,0xffffff],2);if(o.trail&&Math.random()<.4)o.trail(bx,fx_(b).y+1,a)});
  pose(a,"hurl",55);sfx("whoosh");await Wt(a,.08);await Tw(a,.16,p=>{fx_(b).y=lerp(H,yl+.2,p*p);b.piv.rotation.x=lerp(-Math.PI*(o.flips||2),-Math.PI/2-Math.PI*2*Math.ceil(o.flips||2),p)});b.piv.rotation.x=-Math.PI/2;fx_(b).y=yl;
  hit(a,b,dm,{lv:2,s:"slam",y:.5,noReact:1,r:2.7,max:6,stop:.14});ring(bx,.06,0,a.ch.c,4.5);dust(bx,0,10);if(o.boom)o.boom(bx,.6,a);pose(b,"down",25);await Wt(a,.3)};
/* Haken / Magnet: Gegner heranziehen, dann hochschlagen */
const wHook=o=>async(a,b,dm)=>{const d=-a.side,ax=fx_(a).x,bx=fx_(b).x,tx=clamp(ax+d*1.1,-6.9,6.9);pose(a,"hurl",50);sfx("whoosh");const m=keep(o.mk(a));
  await Tw(a,.2,p=>{m.position.set(lerp(ax+d*.6,bx,p),2.2,.3)});sfx("grab");b.grounded=false;pose(b,"air",25);
  await Tw(a,.3,p=>{const x=lerp(bx,tx,ease(p));fx_(b).x=x;fx_(b).y=Math.sin(p*Math.PI);m.position.set(x,2.2,.3);if(Math.random()<.6)sparks(x,2.2,0,1,[a.ch.c,0xffffff],2)});unkeep(m);fx_(b).y=0;
  pose(a,"upper",60);sfx(SW(a));await Wt(a,.06);hit(a,b,dm,{lv:2,s:"heavy",noReact:1,stop:.12,y:2.4*b.sc});if(o.boom)o.boom(fx_(b).x,2.2,a);await launch(b,b.side*5.5,3,.75,1.5)};
/* Gegner verschwindet und fällt von oben herunter */
const wVanish=o=>async(a,b,dm)=>{pose(a,"win",30);const bx=fx_(b).x,yl=-1.32*b.sc;sfx("charge");if(o.puff)o.puff(bx,2,a);await Wt(a,.3);b.root.visible=false;b.grounded=false;b.downed=true;if(o.puff)o.puff(bx,2,a);sfx("whoosh");await Wt(a,.35);
  fx_(b).y=7;b.root.visible=true;pose(b,"air",20);sfx("whoosh");await Tw(a,.3,p=>{fx_(b).y=lerp(7,yl+.2,p*p);b.piv.rotation.x=-p*Math.PI*2.5});b.piv.rotation.x=-Math.PI/2;fx_(b).y=yl;
  hit(a,b,dm,{lv:2,s:"slam",y:.5,noReact:1,r:2.7,max:6,stop:.14});ring(bx,.06,0,a.ch.c,4.5);dust(bx,0,10);if(o.boom)o.boom(bx,.6,a);pose(b,"down",25);await Wt(a,.3)};

/* ----- Requisiten ----- */
const MK={
  shuri:c=>()=>{const m=new THREE.Mesh(STAR,bmat(c));m.scale.setScalar(.36);return m},
  orb:(c,r=.35,core=0xffffff)=>()=>{const g=new THREE.Group();g.add(new THREE.Mesh(gS(r,14,10),addMat(c,.9)));g.add(new THREE.Mesh(gS(r*.55,10,8),bmat(core)));return g},
  card:()=>(a,i)=>new THREE.Mesh(gB(.5,.72,.03),bmat(i%2?0xff3dcb:0xf4f0ff)),
  barrel:()=>()=>{const g=new THREE.Group();M(gC(.42,.42,.8,12),0x8a5a2b,[0,0,0],g);for(const y of[-.28,.28])M(gT(.43,.05,6,16),0x3a3a44,[0,y,0],g,0).rotation.x=Math.PI/2;return g},
  anchor:()=>()=>{const g=new THREE.Group();M(gB(.18,1.8,.18),0x55657f,[0,0,0],g,1,0,"metal");M(gT(.24,.07,6,14),0x55657f,[0,1.05,0],g,1,0,"metal");M(gT(.7,.1,6,16,Math.PI),0x55657f,[0,-.6,0],g,1,0,"metal").rotation.z=Math.PI;return g},
  club:()=>()=>{const g=new THREE.Group();M(gC(.22,.12,1.7,8),0x3a2a1e,[0,0,0],g);for(let i=0;i<6;i++)M(gK(.07,.22,5),0xd8d0c0,[Math.cos(i)*.2,.2+i*.1,Math.sin(i)*.2],g,0).rotation.z=-Math.cos(i)*1.4;g.rotation.z=Math.PI/2;return g},
  spear:c=>a=>{const g=new THREE.Group(),m=new THREE.Mesh(gK(.14,2.6,6),addMat(c,.95));m.rotation.z=a.side>0?Math.PI/2:-Math.PI/2;g.add(m);return g},
  cres:c=>()=>{const m=new THREE.Mesh(geo("cresS",()=>new THREE.RingGeometry(.7,1,24,1,-1.1,2.2)),addMat(c,.95));return m},
  rock:()=>()=>M(gD(.5),0x6a6570,null,null,1,0,"stone"),
  magnet:()=>()=>{const g=new THREE.Group();M(gT(.3,.11,6,14,Math.PI),0xd8323a,[0,0,0],g,1,0,"metal");return g},
  void:()=>()=>{const g=new THREE.Group();g.add(new THREE.Mesh(gS(.42,14,10),bmat(0x05040a)));const r=new THREE.Mesh(gT(.66,.05,6,26),addMat(0x9a3cff,.9));r.rotation.x=1.2;g.add(r);return g},
  num:()=>(a,i)=>txt(["7","3","9","4"][i%4],i%2?"#ffc21a":"#3dffd0",1.3),
  sym:(t,c="#3dffd0",s=1.6)=>()=>txt(t,c,s),
};
const FT={fire:fireTrail(0xff7a1a),drake:fireTrail(0xff3b2f),zap:trailOf([0xffd83a,0xffffff]),water:trailOf([0x25d4ff,0xffffff]),dark:trailOf([0x1c1a2a,0x9a6bff]),jade:trailOf([0x3fe06b,0xb8ffcc]),
  star:(x,y)=>{if(Math.random()<.4)star(x,y,0xffe98a,.35)},light:trailOf([0xffe98a,0xffffff]),void:trailOf([0x05040a,0x9a3cff]),volt:trailOf([0x25d4ff,0xff8a00]),petal:trailOf([0xffb7d5,0xffffff])};
const H=(p,f,o={})=>Object.assign({p,f},o);

/* ----- Die Bewegungen jedes Kämpfers: [Name DE, Name EN, Funktion] ----- */
const KMV={
 raiko:{
  hieb:[["Donnerhiebe","Thunder Jabs",hCombo({gap:1.35,hits:[H("jab",.14,{after:.07}),H("cross",.14,{q:1,after:.07}),H("jab",.14,{after:.07}),H("cross",.14,{q:1,after:.07}),H("upper",.44,{pre:"windup",pw:.1,lv:1,y:2.5})],end:"bump"})],
        ["Blitzschritt","Flash Step",hBlink({n:2,p:"cross",p2:"upper",end:"launch"})],
        ["Funkenfaust","Spark Fist",hHeavy({cw:.24,p:"cross",fx:(a,b)=>bolt(fx_(b).x,0xffffff,12,0),end:"low"})]],
  kick:[["Zickzack-Tritt","Zigzag Kick",kFly({h:1.9,flip:1,trail:FT.zap})],
        ["Donnerabsatz","Thunder Heel",kAxe({h:3.4,fx:(a,b)=>bolt(fx_(b).x,0xffd83a,12,0)})],
        ["Wirbelblitz","Spin Bolt",kMulti({n:3,spin:1,end:"high"})]],
  wurf:[["Shuriken-Salve","Shuriken Volley",wProj({n:4,mk:MK.shuri(0xdfe7ff),spin:.7,t:.22,gapT:.09,trail:FT.zap,spread:1})],
        ["Blitzschleuder","Bolt Sling",wSpin({spins:3,h:2.6,trail:FT.zap,boom:x=>bolt(x,0xffd83a,12,0)})]]},
 akane:{
  hieb:[["Glutkombo","Ember Combo",hCombo({hits:[H("jab",.2),H("cross",.2),H("cross",.2,{lunge:3}),H("upper",.4,{pre:"windup",lv:1,y:2.5})],end:"launch"})],
        ["Flammenhaken","Flame Hook",hSpin({p:"cross",end:"low",trail:FT.fire,col:0xff5a1a})],
        ["Vulkanfaust","Volcano Uppercut",hHeavy({pre:"crouch",p:"upper",cw:.26,y:2.6,fx:(a,b)=>pillar(fx_(b).x,0xff5a1a,1,7,.5),end:"high"})]],
  kick:[["Feuerrad-Tritt","Fire Wheel Kick",kFly({flip:1.5,h:1,trail:FT.fire})],
        ["Funkentritt","Spark Kicks",kMulti({n:3,ys:[.9,1.8,2.7],end:"launch"})],
        ["Phönixtritt","Phoenix Kick",kDive({trail:FT.fire,fx:(a,b)=>pillar(fx_(b).x,0xffc21a,1,6,.4)})]],
  wurf:[["Feuerball","Fireball",wProj({n:2,mk:MK.orb(0xff7a1a,.36,0xffe14d),spin:0,t:.3,trail:FT.fire,boom:(x,y)=>fireBits(x,y,8,0xff5a1a,0xffc21a)})],
        ["Glutschleuder","Ember Sling",wSpin({spins:2,trail:FT.fire,boom:x=>pillar(x,0xff5a1a,1,7,.5)})]]},
 rokka:{
  hieb:[["Säbelrasseln","Saber Rattle",hCombo({hits:[H("cross",.3,{cut:0xdfe7ff,rot:.6}),H("hurl",.3,{cut:0xdfe7ff,rot:2.4}),H("upper",.4,{cut:1,lv:1,y:2.5})],end:"launch"})],
        ["Ankerhieb","Anchor Smash",hSlam({h:2.6,prop:MK.anchor()})],
        ["Enterhaken","Boarding Lunge",hCombo({gap:2.3,hits:[H("cross",1,{pre:"windup",pw:.24,lunge:7,lv:2,cut:1,rot:0,cs:3})],end:"low"})]],
  kick:[["Holzbein-Tritt","Peg Leg Kick",kPush({fx:(a,b)=>ring(fx_(b).x,1.9,0,0x25d4ff,2)})],
        ["Breitseiten-Tritt","Broadside Kick",kMulti({n:2,lastF:.6,ys:[1.4,2.4],end:"launch"})],
        ["Wellenreiter","Wave Rider",kSweep({trail:FT.water,h:1.8})]],
  wurf:[["Fass-Wurf","Barrel Toss",wProj({mk:MK.barrel(),arc:1.5,spin:.25,t:.46,y0:3,boom:(x,y)=>{sparks(x,y,0,20,[0x8a5a2b,0x25d4ff,0xffffff],9);dust(x,0,6)}})],
        ["Über Bord!","Overboard!",wSpin({spins:2,h:3,trail:FT.water,boom:x=>{for(let i=0;i<3;i++)ring(x,.06,0,i?0x25d4ff:0xffffff,2+i*1.5,.5)}})]]},
 zeno:{
  hieb:[["Kartenklinge","Card Blade",hCombo({hits:[H("jab",.25,{cut:0xff3dcb}),H("cross",.25,{cut:0xf4f0ff,q:1}),H("hurl",.5,{lv:1,cut:1})],end:"bump"})],
        ["Trumpf-Stich","Trump Card",hHeavy({cw:.22,p:"cross",fx:(a,b)=>sym("A♠",fx_(b).x,2.6,"#f4f0ff",1.8),end:"launch"})],
        ["Mischmaschine","Shuffle Strike",hCombo({gap:1.35,hits:[H("jab",.12,{after:.06,fx:(a,b)=>cardBits(fx_(b).x,2,2)}),H("cross",.12,{after:.06,q:1}),H("jab",.12,{after:.06,fx:(a,b)=>cardBits(fx_(b).x,2,2)}),H("cross",.12,{after:.06,q:1}),H("upper",.52,{pre:"windup",pw:.1,lv:1,y:2.5})],end:"launch"})]],
  kick:[["Joker-Tritt","Joker Kick",kFly({flip:1,h:1.6,fx:(a,b)=>cardBits(fx_(b).x,2.3,8)})],
        ["Pik-Absatz","Spade Heel",kAxe({flips:2,h:3.2,fx:(a,b)=>sym("♠",fx_(b).x,3,"#f4f0ff",1.4)})],
        ["Kartenfächer","Card Fan Kick",hSpin({p:"kick",s:"kick",turns:2,y:2.2,trail:(x,y)=>cardBits(x,y,1),end:"launch"})]],
  wurf:[["Kartenwurf","Card Throw",wProj({n:3,mk:MK.card(),spin:.9,t:.22,spread:1,boom:(x,y)=>cardBits(x,y,8)})],
        ["Zaubertrick","Magic Trick",wVanish({puff:(x,y)=>cardBits(x,y,10)})]]},
 tetsu:{
  hieb:[["Iaido-Schnitt","Quick Draw",hThrough({n:3,fx:(a,b)=>sparks(fx_(b).x,2,0,10,[0xffb7d5,0xffffff],5)})],
        ["Kreuzschnitt","Cross Cut",hCombo({gap:1.5,hits:[H("cross",.5,{pre:"windup",pw:.2,cut:0xffffff,rot:.8,cs:2.8}),H("hurl",.5,{lv:1,cut:1,rot:2.3,cs:2.8})],end:"low"})],
        ["Sakura-Hiebe","Blossom Cuts",hCombo({hits:[H("cross",.25,{cut:0xffb7d5}),H("hurl",.25,{cut:0xffffff,q:1}),H("upper",.5,{lv:1,cut:0xffb7d5,y:2.5,fx:(a,b)=>sparks(fx_(b).x,2.4,0,18,[0xffb7d5,0xffffff],6)})],end:"launch"})]],
  kick:[["Ronin-Tritt","Ronin Kick",kPush({})],
        ["Fersenschwert","Heel Sword",hSpin({p:"kick",s:"kick",turns:1,col:0xffffff,trail:FT.petal,end:"launch"})],
        ["Mondsturz","Moon Drop",kDive({h:4.6,trail:FT.petal})]],
  wurf:[["Schulterwurf","Shoulder Throw",wSlam({})],
        ["Windklinge","Wind Blade",wProj({n:2,mk:MK.cres(0xffffff),face:1,spin:0,t:.24,lastF:.6,p:"cross",trail:FT.petal})]]},
 volt:{
  hieb:[["Kolbenschlag","Piston Punch",hHeavy({cw:.34,p:"cross",fx:(a,b)=>sparks(fx_(a).x,2,0,14,[0xffffff,0xc8d2e0],5),end:"launch"})],
        ["Doppelkolben","Double Piston",hCombo({hits:[H("cross",.45,{pre:"windup",pw:.22,lv:1}),H("cross",.55,{pre:"windup",pw:.18,lv:2,lunge:3})],end:"low"})],
        ["Elektro-Haken","Shock Hook",hSpin({p:"cross",turns:1,trail:FT.volt,fx:(a,b)=>bolt(fx_(b).x,0x25d4ff,10,0),end:"launch"})]],
  kick:[["Raketentritt","Rocket Kick",kFly({h:1,t:.3,trail:fireTrail(0xff8a00),end:"far"})],
        ["Stampfer","Stomper",kStomp({h:2})],
        ["Turbo-Knie","Turbo Knee",kKnee({trail:FT.volt})]],
  wurf:[["Magnetgriff","Magnet Grip",wHook({mk:MK.magnet(),boom:(x,y)=>sparks(x,y,0,16,[0x25d4ff,0xffffff],8)})],
        ["Bodenwurf","Piledriver",wSky({h:4,turns:1,trail:FT.volt})]]},
 luna:{
  hieb:[["Mondstab","Moon Staff",hCombo({hits:[H("hurl",.45,{cut:0xc9b8ff,cs:2.8}),H("upper",.55,{lv:1,cut:0xffe98a,y:2.5,cs:2.8})],end:"launch"})],
        ["Sternenstoss","Star Thrust",hBeam({col:0xffe98a,n:2,fx:(a,b)=>star(fx_(b).x,2.4,0xffe98a,1.4)})],
        ["Gezeitenschlag","Tide Strike",hSlam({h:2.6,fx:(a,b)=>shaft(fx_(b).x,0xc9b8ff,.5,1.6)})]],
  kick:[["Mondsichel-Tritt","Crescent Kick",kFly({flip:1,h:1.7,trail:FT.star})],
        ["Sternschnuppe","Shooting Star",kDive({h:4.8,trail:FT.star})],
        ["Schwebetritt","Floating Kicks",kMulti({n:3,air:1.4,ys:[2.2,2.6,3],end:"launch"})]],
  wurf:[["Mondkugel","Moon Orb",wProj({mk:MK.orb(0xc9b8ff,.46,0xffe98a),arc:1,spin:0,t:.42,trail:FT.star,boom:(x,y)=>{glow(x,y,0xc9b8ff,7,.5);ring(x,y,0,0xffe98a,3)}})],
        ["Schwerelos","Zero Gravity",wLift({h:3.8,flips:2,trail:FT.star})]]},
 goro:{
  hieb:[["Felsfaust","Boulder Fist",hHeavy({cw:.42,p:"cross",fx:(a,b)=>{rocks(fx_(b).x,2,6);crack(fx_(b).x,1.6,1)},end:"far"})],
        ["Bergklatscher","Mountain Clap",hHeavy({cw:.36,p:"grab",s:"slam",fx:(a,b)=>{hitRing(fx_(b).x,2,0xffffff,3);burstLines(fx_(b).x,2,0xff8a00,14,3)},end:"crouch"})],
        ["Erdstoss","Earth Spikes",hGround({})]],
  kick:[["Stampftritt","Stomp Kick",kPush({gap:1.7,fx:(a,b)=>rocks(fx_(b).x,1.5,4)})],
        ["Erdbeben","Earthquake",kStomp({h:1.5,gap:2.4,fx:(a,b)=>rocks(fx_(b).x,.5,6)})],
        ["Lawinenknie","Avalanche Knee",kKnee({t:.36,trail:(x)=>dust(x,0,2)})]],
  wurf:[["Bärenumarmung","Bear Hug",wHug({n:3,each:(a,b,i)=>pop(L("Knirsch!","Crunch!"),"#ff8a00",fx_(b).x,4.2,"mv")})],
        ["Bergschleuder","Mountain Toss",wSlam({hi:.6,hold:.3,boom:(x,y)=>rocks(x,1,8)})]]},
 shade:{
  hieb:[["Schattenklinge","Shadow Blade",hCombo({gap:1.3,hits:[H("cross",.2,{cut:0x9a6bff,lunge:2,after:.08}),H("hurl",.2,{cut:0x3a2a60,after:.08,q:1}),H("cross",.2,{cut:0x9a6bff,after:.08}),H("upper",.4,{lv:1,cut:1,y:2.5})],end:"launch"})],
        ["Hinterhalt","Ambush",hBlink({n:1,p2:"cross",end:"launch"})],
        ["Dunkelstoss","Dark Palm",hBeam({col:0x6a3ad0,n:3,gap:2})]],
  kick:[["Schattentritt","Shadow Sweep",kSweep({trail:FT.dark})],
        ["Phantomtritte","Phantom Kicks",kMulti({n:5,gapT:.05,lastF:.36,each:(a,b)=>glow(fx_(a).x-a.side*.3,1.8,0x9a6bff,2,.2),end:"launch"})],
        ["Mondloser Sprung","Moonless Leap",kAxe({flips:2,h:3.6,trail:FT.dark})]],
  wurf:[["Schattensterne","Shadow Stars",wProj({n:3,mk:MK.shuri(0x3a2a60),spin:.8,t:.2,gapT:.08,trail:FT.dark,spread:1})],
        ["Schattenfalle","Shadow Snare",wLift({h:3,flips:1,trail:FT.dark,boom:x=>{for(let i=0;i<4;i++){const m=M(gK(.25,1.8,6),0x1c1a2a,[x+rnd(-1,1),-1,0],sc,1,0x2a1050);tw(.5,p=>{m.position.y=-1+Math.sin(p*Math.PI)*1.6}).then(()=>sc.remove(m))}}})]]},
 mika:{
  hieb:[["Drachenpfote","Dragon Paw",hCombo({gap:1.3,hits:[H("jab",.15,{after:.06}),H("cross",.15,{after:.06,q:1}),H("jab",.15,{after:.06}),H("cross",.15,{after:.06,q:1}),H("cross",.4,{pre:"windup",pw:.1,lv:1,lunge:3})],end:"bump"})],
        ["Jade-Ellbogen","Jade Elbow",hCombo({gap:2.2,hits:[H("cross",1,{pre:"crouch",pw:.16,lunge:8,lv:2})],end:"low"})],
        ["Teeschalen-Hieb","Teacup Backfist",hSpin({p:"cross",turns:1,trail:FT.jade,fx:(a,b)=>pop(L("Klirr!","Clink!"),"#3fe06b",fx_(b).x,4.2,"mv"),end:"launch"})]],
  kick:[["Libellentritt","Dragonfly Kick",kFly({h:1.6,spin:1,trail:FT.jade})],
        ["Wirbelwind","Whirlwind Kicks",kMulti({n:4,spin:1,air:1.1,lastF:.4,end:"launch"})],
        ["Bambusfeger","Bamboo Sweep",kSweep({trail:FT.jade,h:1.7})]],
  wurf:[["Drachenschwanz","Dragon Tail",wSpin({spins:3,trail:FT.jade})],
        ["Jadekugel","Jade Orb",wProj({mk:MK.orb(0x3fe06b,.36,0xb8ffcc),arc:.8,spin:0,t:.32,trail:FT.jade,boom:(x,y)=>hitRing(x,y,0x3fe06b,2.4)})]]},
 drako:{
  hieb:[["Drachenklaue","Dragon Claw",hCombo({hits:[H("hurl",.4,{pre:"windup",pw:.2,cut:0xff3b2f,lv:1,cs:2.8}),H("cross",.6,{pre:"windup",pw:.14,cut:0xffe14d,lv:2,cs:3})],end:"launch"})],
        ["Schwanzhieb","Tail Whip",hSpin({p:"cross",turns:1,trail:FT.drake,col:0xff3b2f,end:"far"})],
        ["Ritterschlag","Knight Strike",hSlam({h:2.4,fx:(a,b)=>pillar(fx_(b).x,0xff3b2f,1,6,.4)})]],
  kick:[["Schuppentritt","Scale Kick",kPush({fx:(a,b)=>fireBits(fx_(b).x,1.9,6,0xff3b2f,0xffe14d)})],
        ["Flügelsprung","Wing Leap",kDive({h:5,trail:FT.drake})],
        ["Feuerstampfer","Fire Stomp",kStomp({h:2.2,fx:(a,b)=>pillar(fx_(b).x,0xff3b2f,1.2,7,.5)})]],
  wurf:[["Feuerspucke","Fire Spit",wProj({n:3,mk:MK.orb(0xff3b2f,.3,0xffe14d),p:"grab",y0:3,spin:0,t:.26,trail:FT.drake,spread:1})],
        ["Drachengriff","Dragon Grip",wSky({h:5,turns:2,trail:FT.drake,boom:x=>pillar(x,0xff3b2f,1.2,7,.5)})]]},
 oni:{
  hieb:[["Keulenschlag","Club Smash",hSlam({h:2,prop:MK.club(),fx:(a,b)=>bolt(fx_(b).x,0xffc21a,12,0)})],
        ["Rundumschlag","Big Swing",hSpin({p:"cross",turns:1,col:0xffc21a,end:"far"})],
        ["Lachende Faust","Laughing Fist",hHeavy({cw:.4,p:"cross",fx:(a,b)=>pop("HAHAHA!","#ffc21a",fx_(a).x,4.6,"mv"),end:"launch"})]],
  kick:[["Teufelstritt","Devil Kick",kPush({gap:1.7})],
        ["Donnerstampfer","Thunder Stomp",kStomp({h:1.8,fx:(a,b)=>bolt(fx_(b).x,0xffc21a,14,0)})],
        ["Oni-Knie","Oni Knee",kKnee({t:.34,h:2.6})]],
  wurf:[["Keulenwurf","Club Throw",wProj({mk:MK.club(),spin:.45,t:.36,arc:.6,boom:(x,y)=>{bolt(x,0xffc21a,10,0);dust(x,0,6)}})],
        ["Dämonenschleuder","Demon Sling",wSpin({spins:2,h:2.8,boom:x=>bolt(x,0xffc21a,14,0)})]]},
 seraph:{
  hieb:[["Lichtklinge","Light Blade",hCombo({hits:[H("cross",.45,{cut:0xffe98a,cs:2.8}),H("hurl",.55,{lv:1,cut:0xffffff,cs:3})],end:"launch"})],
        ["Himmelsstich","Heaven Thrust",hBeam({col:0xfff6c8,n:3})],
        ["Heiligenschein","Halo Slash",hSpin({p:"cross",turns:1,col:0xffe98a,fx:(a,b)=>{const m=new THREE.Mesh(gT(.9,.08,6,30),addMat(0xffe98a,.9));m.rotation.x=1.3;fxAdd(m,.6,(m,p)=>{m.position.set(fx_(b).x,3.9+p,.2);m.scale.setScalar(1+p);m.material.opacity=.9*(1-p)})},end:"launch"})]],
  kick:[["Federtritt","Feather Kick",kFly({h:1.4,trail:FT.light})],
        ["Engelssturz","Angel Dive",kDive({h:5,trail:FT.light,fx:(a,b)=>shaft(fx_(b).x,0xffe98a,.6,1.6)})],
        ["Strahlentritt","Ray Kicks",kMulti({n:3,each:(a,b)=>shaft(fx_(b).x,0xffe98a,.25,.7),end:"launch"})]],
  wurf:[["Lichtspeer","Light Spear",wProj({mk:MK.spear(0xffe98a),spin:0,t:.2,y0:2.6,boom:(x)=>shaft(x,0xffe98a,.6,1.8)})],
        ["Himmelfahrt","Ascension",wLift({h:4.2,flips:1,trail:FT.light,boom:x=>shaft(x,0xffe98a,.8,2)})]]},
 kaiser:{
  hieb:[["Leerenfaust","Void Fist",hHeavy({cw:.36,p:"cross",fx:(a,b)=>{ring(fx_(b).x,2.1,0,0x9a3cff,3.5);glow(fx_(b).x,2.1,0x05040a,4,.4)},end:"far"})],
        ["Kaiserliche Ohrfeige","Royal Slap",hCombo({hits:[H("hurl",.35,{pre:"windup",pw:.2,lv:1}),H("cross",.65,{pre:"windup",pw:.16,lv:2,fx:(a,b)=>pop(L("Majestät!","Majesty!"),"#9a3cff",fx_(a).x,4.6,"mv")})],end:"launch"})],
        ["Gravitationshieb","Gravity Strike",hPull({p:"upper",end:"high"})]],
  kick:[["Thronstoss","Throne Kick",kPush({fx:(a,b)=>hitRing(fx_(b).x,1.9,0x9a3cff,2)})],
        ["Dunkelstern","Dark Star Kick",kFly({h:2,trail:FT.void,end:"far"})],
        ["Ereignishorizont","Event Horizon",hSpin({p:"kick",s:"kick",turns:1,col:0x9a3cff,trail:FT.void,end:"launch"})]],
  wurf:[["Dunkle Kugel","Dark Orb",wProj({mk:MK.void(),spin:0,t:.5,arc:.5,trail:FT.void,boom:(x,y)=>{ring(x,y,0,0x9a3cff,4);glow(x,y,0x9a3cff,6,.5)}})],
        ["Schwerkraftwurf","Gravity Throw",wLift({h:3.4,flips:1,trail:FT.void})]]},
 magus:{
  hieb:[["Plus-Hieb","Plus Punch",hCombo({hits:[H("jab",.3,{fx:(a,b)=>sym("+",fx_(b).x,2.6)}),H("cross",.3,{fx:(a,b)=>sym("+",fx_(b).x,2.8)}),H("upper",.4,{lv:1,y:2.5,fx:(a,b)=>sym("=",fx_(b).x,3,"#ffc21a",1.4)})],end:"launch"})],
        ["Wurzelschlag","Root Strike",hSlam({h:2.8,prop:MK.sym("√","#3dffd0",2.2)})],
        ["Klammer-Kombo","Bracket Combo",hCombo({hits:[H("cross",.5,{pre:"windup",pw:.16,fx:(a,b)=>sym("(",fx_(b).x-.6,2.4,"#3dffd0",1.6)}),H("cross",.5,{pre:"windup",pw:.12,lv:2,fx:(a,b)=>sym(")",fx_(b).x+.6,2.4,"#3dffd0",1.6)})],end:"low"})]],
  kick:[["Pi-Tritt","Pi Kick",kFly({h:1.6,fx:(a,b)=>sym("π",fx_(b).x,3,"#ffc21a",1.6)})],
        ["Minus-Feger","Minus Sweep",kSweep({trail:(x,y)=>{if(Math.random()<.3)sym("−",x,y)}})],
        ["Hoch-zwei-Tritt","Squared Kick",kAxe({h:4,fx:(a,b)=>sym("x²",fx_(b).x,3.4,"#ffc21a",1.6)})]],
  wurf:[["Zahlenwurf","Number Throw",wProj({n:3,mk:MK.num(),spin:.15,t:.26,spread:1})],
        ["Bruchrechnung","Fraction",wVanish({puff:(x,y)=>sym("÷",x,y,"#ffc21a",2)})]]},
};
/* Englische Namen setzen */
for(const id in KMV)for(const k in KMV[id])KMV[id][k]=KMV[id][k].map(([de,en,f])=>{const m={f};bi(m,"n",de,en);return m});
