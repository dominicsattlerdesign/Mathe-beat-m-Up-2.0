/* ---------- Zweites Outfit: eigene Spezial-Attacke und eigener Finisher ----------
   SIG2[id](a,b,dm,d,c): Schaden in Summe genau dm (wie SIG). FIN2[id](a,b,d,c): endet mit K.O. (wie FIN).
   Namen in vier Sprachen: [de, en, fr, es]. Ohne zweites Outfit gelten weiter SIG/FIN aus moves.js. */
const OUT2={
  raiko:{sig:["Frostkette","Frost Chain","Chaîne de givre","Cadena de escarcha"],fin:["Eiszeit","Ice Age","Ère glaciaire","Era de hielo"]},
  akane:{sig:["Lotus-Sturm","Lotus Storm","Tempête de lotus","Tormenta de loto"],fin:["Mitternachtslotus","Midnight Lotus","Lotus de minuit","Loto de medianoche"]},
  rokka:{sig:["Flottenbefehl","Fleet Command","Ordre de la flotte","Orden de la flota"],fin:["Admiralsanker","Admiral’s Anchor","Ancre de l’amiral","Ancla del almirante"]},
  zeno:{sig:["Zylinder-Zauber","Top Hat Magic","Magie du chapeau","Magia de chistera"],fin:["Tauben-Finale","Dove Finale","Final des colombes","Final de palomas"]},
  tetsu:{sig:["Feuerklinge","Fire Blade","Lame de feu","Espada de fuego"],fin:["Rote Sonne","Red Sun","Soleil rouge","Sol rojo"]},
  volt:{sig:["Goldlaser","Gold Laser","Laser doré","Láser dorado"],fin:["Goldregen","Gold Rain","Pluie d’or","Lluvia de oro"]},
  luna:{sig:["Sonnenstrahlen","Sun Rays","Rayons de soleil","Rayos de sol"],fin:["Sonnenaufgang","Sunrise","Lever de soleil","Amanecer"]},
  goro:{sig:["Shiko-Stampfer","Shiko Stomp","Piétinement shiko","Pisotón shiko"],fin:["Yokozuna-Schieber","Yokozuna Push","Poussée du yokozuna","Empujón yokozuna"]},
  shade:{sig:["Rotmond-Klingen","Red Moon Blades","Lames de lune rouge","Hojas de luna roja"],fin:["Schattenspiegel","Shadow Mirror","Miroir d’ombre","Espejo de sombra"]},
  mika:{sig:["Drachentanz","Dragon Dance","Danse du dragon","Danza del dragón"],fin:["Grosses Feuerwerk","Grand Fireworks","Grand feu d’artifice","Gran castillo de fuegos"]},
  drako:{sig:["Frostatem","Frost Breath","Souffle de givre","Aliento helado"],fin:["Gletschersturz","Glacier Crash","Chute du glacier","Caída del glaciar"]},
  oni:{sig:["Blitzpauke","Lightning Drum","Tambour éclair","Tambor relámpago"],fin:["Taiko-Donner","Taiko Thunder","Tonnerre taiko","Trueno taiko"]},
  seraph:{sig:["Schattenfedern","Shadow Feathers","Plumes d’ombre","Plumas de sombra"],fin:["Schwarzer Komet","Black Comet","Comète noire","Cometa negro"]},
  kaiser:{sig:["Weisses Loch","White Hole","Trou blanc","Agujero blanco"],fin:["Supernova","Supernova","Supernova","Supernova"]},
  magus:{sig:["Tafelanschrieb","Blackboard Blast","Tableau noir","Pizarra explosiva"],fin:["Hausaufgaben-Lawine","Homework Avalanche","Avalanche de devoirs","Avalancha de deberes"]},
};
const ICE=0x9fe8ff,ICE2=0xdff8ff;
const dropMesh=m=>{sc.remove(m);const i=TEMP.indexOf(m);if(i>=0)TEMP.splice(i,1)};
/* kleine Bausteine */
function shards(x,y,cols,n=10,sz=.22){for(let i=0;i<n;i++){const m=M(gB(sz,sz*1.6,sz),P(cols),[x+rnd(-.4,.4),y+rnd(-.6,.6),0],sc,0);debris.push({m,v:new THREE.Vector3(rnd(-6,6),rnd(2,9),rnd(-3,3)),s:new THREE.Vector3(rnd(9),rnd(9),rnd(9)),l:1.5,r:.15})}}
function iceBlock(b){const m=new THREE.Mesh(gB(1.7*b.sc,3.8*b.sc,1.5),addMat(ICE,.5));m.position.set(fx_(b).x,1.85*b.sc,0);return keep(m)}
function crescent(c,s=1){const m=new THREE.Mesh(geo("cres2",()=>new THREE.RingGeometry(1.1,1.5,28,1,-1.1,2.2)),addMat(c,.95));m.scale.setScalar(s);return m}
async function fly2(m,x0,y0,x1,y1,dur,arc=0,spin=0,trail){keep(m);await tw(dur,p=>{m.position.set(lerp(x0,x1,p),lerp(y0,y1,p)+Math.sin(p*Math.PI)*arc,.3);m.rotation.z+=spin;if(trail&&Math.random()<.7)trail(m.position.x,m.position.y)});dropMesh(m)}
const bump2=(b,h=.7,t=.22)=>{if(b.hp<=0)return Promise.resolve();b.grounded=false;return tw(t,p=>{fx_(b).y=Math.sin(p*Math.PI)*h}).then(()=>{fx_(b).y=0;b.grounded=true})};
const hatMesh=()=>{const g=new THREE.Group();M(gC(.8,.8,1.6,18),0x15131a,[0,.8,0],g);M(gC(1.3,1.3,.1,22),0x15131a,[0,0,0],g);M(gC(.82,.82,.3,18),0xd6222c,[0,.25,0],g,0);return g};
const coin=()=>{const m=M(gC(.28,.28,.07,14),0xffc21a,null,null,0,0x553300,"metal");m.rotation.x=Math.PI/2;return m};
const book=()=>{const m=M(gB(rnd(.8,1.1),.22,rnd(.6,.8)),P([0xd6222c,0x2a6fd6,0x3fa34d,0xffc21a,0x8a3cd6]),null,null,1);return m};

const SIG2={
  /* Eis-Ninja: Zickzack-Sprünge, jeder hinterlässt Eiskristalle, zum Schluss Eisspitzen aus dem Boden */
  async raiko(a,b,dm,d,c){const bx=fx_(b).x;a.grounded=false;
    for(let i=0;i<4;i++){const s=i%2?-1:1;fx_(a).x=clamp(bx+s*d*1.8,-7,7);fx_(a).y=rnd(.2,1.4);streak(fx_(a).x,2,s*d,ICE,5);pose(a,i%2?"cross":"kick",60);sparks(bx,2,.6,10,[ICE,ICE2,0xffffff],7);glow(bx,2,ICE,3.5);sfx("swoosh");impact(a,b,dm*.15,{arc:1,nomt:1,quiet:i%2,stop:.04,push:0});await wait(.14)}
    fx_(a).y=0;a.grounded=true;pose(a,"win",30);for(let i=0;i<5;i++){const m=M(gK(.28,2.4,6),ICE,[bx+rnd(-1,1),-1.4,rnd(-.4,.4)],sc,0,0x2a6a88);tw(.6,p=>{m.position.y=-1.4+Math.sin(Math.min(1,p*2.4)*Math.PI/2)*(1.6+i*.15)*(p>.75?1-(p-.75)/.25:1)}).then(()=>sc.remove(m))}
    sfx("boom");shards(bx,2,[ICE,ICE2,0xffffff],12);impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6,2.4,.7,1.5)},
  /* Schwarzer Lotus: dunkle Blütenblätter umkreisen den Gegner und schneiden zu */
  async akane(a,b,dm,d,c){const bx=fx_(b).x;pose(a,"win",20);const g=new THREE.Group();for(let i=0;i<16;i++){const m=new THREE.Mesh(gB(.42,.12,.26),bmat(i%3?0x15131a:0x8a1420));m.userData.a=i/16*6.283;m.userData.r=rnd(1,1.8);m.userData.y=rnd(.6,3.4);g.add(m)}g.position.x=bx;keep(g);sfx("whoosh");
    let h=0;await tw(1.1,p=>{g.children.forEach(m=>{const an=m.userData.a+p*14;m.position.set(Math.cos(an)*m.userData.r*(1-p*.5),m.userData.y,Math.sin(an)*m.userData.r*(1-p*.5));m.rotation.set(an,an*2,0)});
      const n=Math.floor(p*5);if(n>h&&n<5){h=n;slashArc(bx,rnd(1.4,2.8),h%2?0x8a1420:0xffc21a,rnd(6.3),2);sfx("swoosh");impact(a,b,dm*.12,{arc:1,nomt:1,quiet:h%2,stop:.03,push:.04})}});
    dropMesh(g);pose(a,"cross",60);glow(bx,2,0x8a1420,8,.5);sparks(bx,2,.6,30,[0x15131a,0x8a1420,0xffc21a],10);sfx("boom");impact(a,b,dm*.52,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.2,1.8,.6,1)},
  /* Admiral: zwei Schiffe feuern eine Breitseite mit fünf Kugeln */
  async rokka(a,b,dm,d,c){pose(a,"win",20);pop(L("Alle Kanonen!","All cannons!","Tous les canons !","¡Todos los cañones!"),"#fff",fx_(a).x,4.6,"mv");const bx=fx_(b).x;
    for(let i=0;i<5;i++){const m=M(gS(.34),0x23262f,null,null,1,0,"metal"),sx=(i%2?-d:d)*13,sy=5+i;sfx("boom");colorBurst(0xff8a00,c,1.2);
      fxAdd(m,.38,(m,p)=>{m.position.set(lerp(sx,bx,p),lerp(sy,2,p)+Math.sin(p*Math.PI)*2,0);if(Math.random()<.5)sparks(m.position.x,m.position.y,0,1,[0xff8a00,0x555555],2)});
      await wait(.3);dust(bx,0,5,0x555560);glow(bx,2,0xff8a00,4);impact(a,b,dm*(i==4?.4:.15),{lv:i==4?2:1,s:"heavy",nomt:1,noReact:i==4,quiet:i%2,push:.2})}
    await launch(b,b.side*6.4,1.8,.6,1)},
  /* Bühnenmagier: ein Riesenzylinder schwebt über dem Gegner, Tauben schiessen heraus, dann fällt der Hut */
  async zeno(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,hat=keep(hatMesh());hat.position.set(bx,6,0);hat.rotation.z=Math.PI;sfx("charge");await tw(.3,p=>{hat.position.y=6-eOut(p)*1.2});
    for(let i=0;i<4;i++){const dv=new THREE.Mesh(gS(.22,10,8),bmat(0xffffff)),x1=bx+rnd(-.5,.5);sfx("swoosh");await fly2(dv,bx,4.6,x1,rnd(1.6,2.8),.16,0,0,(x,y)=>sparks(x,y,0,1,[0xffffff,0xff3dcb],2));
      sparks(x1,2.2,.6,8,[0xffffff,0xf4f0ff],6);impact(a,b,dm*.15,{nomt:1,quiet:i%2,stop:.03,push:.05})}
    sfx("whoosh");await tw(.14,p=>{hat.position.y=4.8-p*3.4;hat.rotation.z=Math.PI*(1-p)});dropMesh(hat);dust(bx,0,8);ring(bx,.06,0,c,3.5);pop(L("Tada!","Ta-da!","Ta-da !","¡Tachán!"),hex(c),bx,4.6,"mv");
    impact(a,b,dm*.4,{lv:2,nomt:1,s:"slam",noReact:1});await launch(b,b.side*6,1.6,.6,1)},
  /* Rote Rüstung: drei brennende Schnitte, dann eine Feuersichel */
  async tetsu(a,b,dm,d,c){await dash(a,fx_(b).x-d*1.5,.18);const bx=fx_(b).x;
    for(let i=0;i<3;i++){pose(a,["cross","hurl","upper"][i],60);sfx("swoosh");await wait(.08);slashArc(bx,2.1,0xff5a1a,rnd(6.3),2.6);for(let k=0;k<4;k++)fireball(bx,2.1,bx+rnd(-1,1),rnd(1.5,3.4),k%2?0xff5a1a:0xffc21a,.3,.25);impact(a,b,dm*.2,{arc:1,nomt:1,quiet:i==1,stop:.04,push:.1});await wait(.12)}
    await backHop(a);pose(a,"cross",60);sfx("whoosh");const ax=fx_(a).x,m=crescent(0xff5a1a,1.8);m.rotation.z=d>0?0:Math.PI;await fly2(m,ax,1.9,fx_(b).x+d*.5,1.9,.22,0,0,(x,y)=>fireball(x,y,x,y+.6,0xffc21a,.25,.3));
    pillar(fx_(b).x,0xff5a1a,1,7,.5);impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1,stop:.14});await launch(b,b.side*6.3,1.4,.55,1)},
  /* Gold-Prototyp: goldener Augenlaser */
  async volt(a,b,dm,d,c){pose(a,"win",20);const ay=3.05*a.sc,ax=fx_(a).x+d*.3;glow(ax,ay,0xffc21a,3,.6);sfx("charge");await wait(.3);sfx("zap");let h=0;
    await tw(.9,p=>{const bx=fx_(b).x;if(Math.random()<.6)beam(ax,bx,ay-p*.9,0xffc21a,.22,.1);sparks(bx,2.1,.5,2,[0xffc21a,0xffffff],6);flashLight(0xffc21a,3,bx,2);const n=Math.floor(p*5);if(n>h&&n<5){h=n;impact(a,b,dm*.12,{nomt:1,quiet:1,stop:.02,push:.15})}});
    const bx=fx_(b).x;beam(ax,bx,2.1,0xffffff,.5,.3);glow(bx,2.1,0xffc21a,9,.5);ring(bx,2.1,0,0xffc21a,5,.5);sfx("boom");impact(a,b,dm*.52,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.3,1.8,.6,1.5)},
  /* Sonnenpriesterin: Sonnenscheibe am Himmel schickt fünf Strahlen */
  async luna(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,sun=new THREE.Mesh(gS(1.2,20,14),addMat(0xffc21a,.95));sun.position.set(bx,9,-1);keep(sun);glow(bx,9,0xffe14d,10,1.6,-1);sfx("charge");await wait(.3);
    for(let i=0;i<5;i++){const x=bx+(i<4?rnd(-.7,.7):0);shaft(x,0xffe14d,.3,i==4?2.2:1);sfx("zap");glow(x,2,0xffc21a,i==4?7:3,.3);ring(x,.06,0,0xffc21a,i==4?4:1.6,.3);impact(a,b,dm*(i==4?.4:.15),{nomt:1,quiet:i%2,lv:i==4?2:0,stop:.03,push:0,noReact:i==4,s:i==4?"heavy":"punch"});await wait(.14)}
    dropMesh(sun);await launch(b,b.side*6,1.8,.6,1)},
  /* Sumo-Champion: drei Shiko-Stampfer lassen den Gegner hüpfen, dann ein Schubser */
  async goro(a,b,dm,d,c){for(let i=0;i<3;i++){pose(a,"kickCh",20);await wait(.22);pose(a,"crouch",50);sfx("slam");const ax=fx_(a).x;CAM.shake=.5;ring(ax,.06,0,i%2?0xffffff:c,3+i*1.5,.5);dust(ax,0,6);crack(ax+(-a.side)*1,1,0);
      impact(a,b,dm*.2,{nomt:1,quiet:i==1,lv:1,s:"slam",stop:.04,push:0,y:.8});await bump2(b,.8+i*.3,.26)}
    pop(L("Dosukoi!","Dosukoi!","Dosukoi !","¡Dosukoi!"),hex(c),fx_(a).x,4.6,"mv");await dash(a,fx_(b).x-(-a.side)*1.2,.16);pose(a,"cross",60);sfx("heavy");impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*7,1.6,.6,1)},
  /* Roter Schatten: sechs rote Mondsicheln */
  async shade(a,b,dm,d,c){const ax=fx_(a).x;pose(a,"crouch",25);glow(ax,1.5,0xd6222c,3,.5);
    for(let i=0;i<6;i++){pose(a,i%2?"cross":"hurl",55);sfx("swoosh");const m=crescent(i%2?0xd6222c:0xff5a5a,.7+i*.08),y=rnd(1.4,2.8);m.rotation.z=(d>0?0:Math.PI)+rnd(-.5,.5);fly2(m,ax+d*.6,y,fx_(b).x,y,.16,0,0);await wait(.1);if(i)impact(a,b,dm*.1,{arc:1,nomt:1,quiet:i%2,stop:.02,push:.06,y})}
    await wait(.12);const bx=fx_(b).x;for(let i=0;i<6;i++)slashArc(bx,2+rnd(-1,1),i%2?0xd6222c:0x15131a,rnd(6.3),2);glow(bx,2,0xd6222c,8,.5);sfx("boom");impact(a,b,dm*.5,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6,2.6,.7,1.5)},
  /* Drachentänzerin: ein Papierdrache schlängelt sich dreimal durch den Gegner */
  async mika(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,seg=[];for(let i=0;i<9;i++){const m=M(i?gB(.6,.5,.5):gB(.8,.7,.6),i?(i%2?0xd6222c:0xffc21a):0xd6222c,null,sc,1);seg.push(m);TEMP.push(m)}sfx("whoosh");let h=0;
    await tw(1.3,p=>{seg.forEach((m,i)=>{const q=p*3-i*.05,x=bx+Math.sin(q*Math.PI*2)*3,y=2.2+Math.sin(q*Math.PI*4)*.9;m.position.set(x,y,Math.cos(q*Math.PI*2)*.8);m.rotation.z=Math.cos(q*Math.PI*2)*.6});
      const n=Math.floor(p*4);if(n>h&&n<4){h=n;sparks(bx,2,.6,10,[0xd6222c,0xffc21a],7);sfx("swoosh");impact(a,b,dm*.15,{nomt:1,quiet:h%2,stop:.03,push:.05})}});
    seg.forEach(dropMesh);burstLines(bx,2,0xffc21a,16,3.5);sparks(bx,2,.6,30,[0xd6222c,0xffc21a,0xffffff],10);sfx("boom");impact(a,b,dm*.55,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.3,2,.65,1)},
  /* Eisdrache: eisiger Atem, der Gegner wird kurz zu Eis */
  async drako(a,b,dm,d,c){const ax=fx_(a).x+d*.7,ay=3.05*a.sc;pose(a,"windup",20);await wait(.25);pose(a,"grab",40);sfx("whoosh");let h=0;const bx=fx_(b).x;
    await tw(.95,p=>{for(let i=0;i<3;i++)fireball(ax,ay,bx+rnd(-.4,.6),rnd(1,3.2),i?ICE:0xffffff,.3,rnd(.2,.4));flashLight(ICE,4,bx,2);const n=Math.floor(p*4.2);if(n>h&&h<4){h=n;impact(a,b,dm*.15,{nomt:1,quiet:h%2,stop:.02,push:.2})}});
    tint(b,ICE);const blk=iceBlock(b);sfx("stone");await wait(.3);dropMesh(blk);untint(b);shards(fx_(b).x,2,[ICE,ICE2,0xffffff],14);sfx("boom");impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.2,1.4,.55,1)},
  /* Blauer Oni: drei Schläge auf die Trommel, blaue Blitze */
  async oni(a,b,dm,d,c){const ax=fx_(a).x,B=0x4aa8ff;
    for(let i=0;i<3;i++){pose(a,"lift",25);await wait(.17);pose(a,"hurl",50);await wait(.07);const bx=fx_(b).x;sfx("slam");sfx("zap");CAM.shake=.45;ring(ax+d*1.2,.06,0,B,5+i*2,.5);bolt(bx,i%2?0xffffff:B,14,0);bolt(bx+rnd(-.6,.6),B,12,0);glow(bx,2,B,5);
      impact(a,b,dm*(i==2?.4:.3),{lv:i==2?2:1,nomt:1,s:"zap",quiet:i==1,noReact:i==2,push:.2});if(i<2)await bump2(b,.8,.2)}
    await launch(b,b.side*6.2,2,.6,1)},
  /* Gefallener Engel: dunkle Federn regnen auf den Gegner */
  async seraph(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x;shaft(bx,0x3a2a60,1,2.4);
    for(let i=0;i<7;i++){const x0=bx+rnd(-3,3),x1=bx+rnd(-.4,.4),y1=rnd(1.4,2.8),m=new THREE.Mesh(gB(.1,.7,.25),bmat(i%2?0x15131a:0x3a2a60));m.rotation.z=rnd(6.3);
      fxAdd(m,.26,(m,p)=>{m.position.set(lerp(x0,x1,p),lerp(11,y1,p),.3);m.rotation.z+=.3;if(Math.random()<.5)sparks(m.position.x,m.position.y,0,1,[0x3a2a60,0x9a6bff],2)});sfx("swoosh");await wait(.12);
      if(i>0)impact(a,b,dm*(i==6?.4:.1),{nomt:1,quiet:i%2,lv:i==6?2:0,stop:.03,push:.04,noReact:i==6,s:i==6?"heavy":"punch"})}
    glow(bx,2,0x3a2a60,7,.5);await launch(b,b.side*6,1.6,.6,1)},
  /* Weisser Kaiser: ein weisses Loch stösst den Gegner weg und platzt */
  async kaiser(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,ox=bx-d*1,oy=2.6,o=new THREE.Group();o.add(new THREE.Mesh(gS(.5,16,12),bmat(0xffffff)));const r=new THREE.Mesh(gT(.8,.06,8,30),addMat(0xc8d8ff,.9));r.rotation.x=1.2;o.add(r);o.position.set(ox,oy,0);keep(o);sfx("charge");
    b.grounded=false;pose(b,"hurt",30);let h=0;await tw(.8,p=>{r.rotation.z+=.3;o.scale.setScalar(.4+p*1.2);fx_(b).x=bx+d*p*1.6;fx_(b).y=Math.sin(p*Math.PI)*.6;if(Math.random()<.6)sparks(ox+rnd(-1.5,1.5),oy+rnd(-1.5,1.5),0,1,[0xffffff,0xc8d8ff],3);flashLight(0xffffff,3,ox,oy);
      const n=Math.floor(p*4);if(n>h&&n<4){h=n;impact(a,b,dm*.15,{nomt:1,quiet:1,stop:.02,push:0,noReact:1})}});
    fx_(b).y=0;dropMesh(o);sfx("boom");flash("#fff");glow(ox,oy,0xffffff,10,.5);ring(ox,oy,0,0xc8d8ff,6,.5);impact(a,b,dm*.55,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.4,1.8,.6,1.5)},
  /* Professor Kreide: Tafel mit Rechnung, der Schwamm trifft dreimal */
  async magus(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,bd=new THREE.Group();M(gB(3.4,2.2,.1),0x1f3a2a,[0,0,0],bd);M(gB(3.6,.15,.14),0x8a5a2b,[0,1.15,0],bd,0);M(gB(3.6,.15,.14),0x8a5a2b,[0,-1.15,0],bd,0);
    const t=txt("9 × 9 = 81","#f4f0e6",1);t.position.z=.07;bd.add(t);bd.position.set(bx-d*.2,4.6,-1.4);keep(bd);sfx("paper");await wait(.3);
    for(let i=0;i<3;i++){const sp=M(gB(.5,.25,.3),0xffc21a,null,null,1);sfx("whoosh");await fly2(sp,bx-d*.2,3.6,fx_(b).x+rnd(-.2,.2),2.3,.15,0,.5);sparks(fx_(b).x,2.3,.5,12,[0xffffff,0xe8e8e8],6);dust(fx_(b).x,2,3,0xffffff);impact(a,b,dm*.2,{nomt:1,quiet:i==1,stop:.04,push:.08})}
    pop(L("Richtig!","Correct!","Juste !","¡Correcto!"),"#3dffd0",bx,5.2,"mv");sfx("boom");dropMesh(bd);sparks(bx,4.6,0,20,[0x1f3a2a,0xf4f0e6],9);impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6,1.6,.6,1)},
};

const FIN2={
  /* Eis-Ninja: friert den Gegner ein und zerschmettert den Eisblock */
  async raiko(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);sfx("charge");for(let i=0;i<10;i++)fxAdd(new THREE.Mesh(gO(.18),bmat(i%2?ICE:0xffffff)),.6,(m,p)=>{const an=i*.63+p*6;m.position.set(bx+Math.cos(an)*(1.6-p*1.2),.4+p*3,Math.sin(an)*(1.6-p*1.2))},1);
    await rt(.6);tint(b,ICE);pose(b,"hurt",40);const blk=iceBlock(b);sfx("stone");CAM.shake=.4;pop(L("Brrr!","Brrr!","Brrr !","¡Brrr!"),"#dff8ff",bx,4.8,"mv");await rt(.8);
    const x0=fx_(a).x;a.grounded=false;pose(a,"kickCh",30);sfx("jump");await rt(.35,p=>{fx_(a).x=lerp(x0,bx-d*1.3,p);fx_(a).y=Math.sin(p*Math.PI)*2+p*.6});pose(a,"kick",60);sfx("whoosh");await rt(.08);
    dropMesh(blk);untint(b);shards(bx,2,[ICE,ICE2,0xffffff],26,.3);flash("#dff8ff");sfx("boom");kill(a,b,{s:"boom"});await Promise.all([launch(b,b.side*6.5,2.4,.8,2),landA(a)])},
  /* Schwarzer Lotus: eine riesige Lotusblüte schliesst sich und explodiert */
  async akane(a,b,d,c){const bx=fx_(b).x,g=new THREE.Group(),pet=[];for(let i=0;i<8;i++){const pv=new THREE.Group(),m=M(gK(.7,3.2,5),i%2?0x15131a:0x8a1420,[0,1.6,0],pv,1);pv.rotation.y=i/8*6.283;pv.userData.o=1.2;pet.push(pv);g.add(pv)}
    g.position.set(bx,0,0);keep(g);pose(a,"win",20);sfx("whoosh");await rt(.5,p=>{g.scale.setScalar(eOut(p))});pet.forEach(pv=>pv.children[0].rotation.x=1.2);
    await rt(.7,p=>{pet.forEach(pv=>pv.children[0].rotation.x=1.2*(1-ease(p)))});sfx("heavy");pop(L("Gute Nacht.","Good night.","Bonne nuit.","Buenas noches."),"#ff5a5a",bx,5.4,"mv");await rt(.5,p=>{g.rotation.y+=.1});
    flash("#fff");sfx("boom");glow(bx,2,0x8a1420,12,.6);sparks(bx,2,0,50,[0x15131a,0x8a1420,0xffc21a],12);for(let i=0;i<12;i++)fireball(bx,2,bx+rnd(-4,4),rnd(1,7),i%2?0x8a1420:0xffc21a,.5,.4);dropMesh(g);
    kill(a,b,{s:"boom"});await launch(b,b.side*5.5,4,.9,2)},
  /* Admiral: ein riesiger Anker fällt vom Himmel */
  async rokka(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);pop(L("Anker los!","Drop anchor!","Jetez l’ancre !","¡Echad el ancla!"),"#fff",fx_(a).x,4.6,"mv");await rt(.5);
    const g=new THREE.Group();M(gB(.45,4.4,.45),0x55657f,[0,0,0],g,1,0,"metal");M(gT(.6,.16,8,16),0x55657f,[0,2.5,0],g,1,0,"metal");M(gT(1.7,.25,8,20,Math.PI),0x55657f,[0,-1.5,0],g,1,0,"metal").rotation.z=Math.PI;g.position.set(bx,16,0);keep(g);sfx("whoosh");
    await rt(.4,p=>{g.position.y=16-p*p*12.6});CAM.shake=1;flash("#fff");sfx("slam");sfx("metal");dust(bx,0,16);crack(bx,3,2);for(let i=0;i<3;i++)ring(bx,.06,0,i?0x25d4ff:0xffffff,3+i*2,.6);
    squash(b,1.5,.2);kill(a,b,{s:"slam",y:.4});pop(L("PLATT!","FLAT!"),hex(c),bx,4.6);await rt(.9);dropMesh(g);squash(b,1,1);await launch(b,bx+b.side*.8,.3,.5,0)},
  /* Bühnenmagier: Gegner in die Zauberkiste, Tauben tragen ihn davon */
  async zeno(a,b,d,c){const bx=fx_(b).x,box=new THREE.Group();M(gB(2,3.6,1.6),0x5a2ea6,[0,1.8,0],box);for(const y of[.6,1.8,3])M(gB(2.05,.12,1.65),0xffc21a,[0,y,0],box,0);box.position.set(bx,8,0);keep(box);pose(a,"win",20);sfx("whoosh");
    await rt(.45,p=>{box.position.y=8*(1-eOut(p))});sfx("slam");dust(bx,0,8);b.root.visible=false;pop(L("Simsalabim!","Abracadabra!","Abracadabra !","¡Abracadabra!"),hex(c),bx,4.8,"mv");await rt(.6);
    for(let i=0;i<4;i++){pose(a,i%2?"jab":"cross",40);sfx("punch");box.rotation.y+=.4;await rt(.18)}sfx("boom");flash("#fff");dropMesh(box);sparks(bx,2,0,30,[0xffffff,0xffc21a,c],9);
    for(let i=0;i<10;i++)fxAdd(new THREE.Mesh(gS(.2,8,6),bmat(0xffffff)),1.4,(m,p)=>{m.position.set(bx+Math.sin(i*2+p*6)*(.5+p*2),1.5+p*9,Math.cos(i*2)*.5)},1);pop(L("… weg!","… gone!"),"#fff",bx,4.8,"mv");await rt(1.2);
    b.root.visible=true;kill(a,b,{s:"slam"});await fallBack(b,bx)},
  /* Rote Rüstung: ein Schnitt, eine rote Sonne geht auf, dann fällt der Gegner */
  async tetsu(a,b,d,c){const x0=fx_(a).x,bx=fx_(b).x,tx=clamp(bx+d*2.2,-6.8,6.8);pose(a,"windup",20);await rt(.5);sfx("whoosh");streak(tx,1.8,d,0xff5a1a,7);pose(a,"cross",60);await rt(.07,p=>{fx_(a).x=lerp(x0,tx,p)});slashArc(bx,2.1,0xff5a1a,.3,3.2);
    pose(a,"hurl",10);const sun=new THREE.Mesh(gS(2.4,24,16),addMat(0xd6222c,.9));sun.position.set(bx,-2,-4);keep(sun);await rt(1.2,p=>{sun.position.y=-2+eOut(p)*7;flashLight(0xd6222c,2+p*3,bx,3)});
    sfx("key");pose(a,"idle",20);await rt(.3);for(let i=0;i<6;i++)slashArc(bx,rnd(1,3.2),i%2?0xd6222c:0xffffff,rnd(6.3),2.6);flash("#fff");sfx("boom");kill(a,b,{s:"heavy"});await rt(.4);dropMesh(sun);await launch(b,bx+b.side*.6,.4,.5,0)},
  /* Gold-Prototyp: es regnet Goldmünzen, bis der Gegner darunter verschwindet */
  async volt(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);pop(L("Jackpot!","Jackpot!","Jackpot !","¡Premio gordo!"),"#ffc21a",fx_(a).x,4.6,"mv");const pile=[];
    for(let i=0;i<40;i++){const m=coin(),x=bx+rnd(-.9,.9),y1=.1+Math.floor(i/6)*.12+rnd(0,.3);keep(m);pile.push(m);m.position.set(x,9+rnd(0,2),rnd(-.5,.5));
      rt(.35,p=>{m.position.y=lerp(m.position.y,y1+Math.min(2.6,i*.07),p);m.rotation.z+=.3});if(i%4==0)sfx("key");await rt(.04)}
    await rt(.3);CAM.shake=.4;squash(b,1.2,.5);pose(b,"hurt",20);sfx("heavy");await rt(.6);sfx("boom");flash("#ffe14d");pile.forEach(m=>{debris.push({m,v:new THREE.Vector3(rnd(-7,7),rnd(4,10),rnd(-3,3)),s:new THREE.Vector3(rnd(9),rnd(9),rnd(9)),l:1.4,r:.1});const i=TEMP.indexOf(m);if(i>=0)TEMP.splice(i,1)});
    squash(b,1,1);kill(a,b,{s:"boom"});await launch(b,b.side*6,3,.8,2)},
  /* Sonnenpriesterin: die Sonne geht auf und nimmt den Gegner mit */
  async luna(a,b,d,c){const bx=fx_(b).x,sun=new THREE.Mesh(gS(2.6,24,16),addMat(0xffc21a,.95));sun.position.set(bx,-3,-3);keep(sun);pose(a,"win",20);sfx("charge");
    await rt(1,p=>{sun.position.y=-3+eOut(p)*9;flashLight(0xffe14d,2+p*4,bx,3);if(Math.random()<.5)shaft(bx+rnd(-3,3),0xffe14d,.2,.6)});b.grounded=false;b.downed=true;pose(b,"air",20);
    await rt(.9,p=>{fx_(b).y=eOut(p)*4.4;b.piv.rotation.x-=.15;squash(b,1-p*.6,1-p*.6)});flash("#fff");sfx("boom");glow(bx,6,0xffe14d,14,.8);b.root.visible=false;pop(L("Guten Morgen!","Good morning!","Bonjour !","¡Buenos días!"),"#ffe14d",bx,8,"mv");
    kill(a,b,{s:"boom",y:6});await rt(.9);dropMesh(sun);await fallBack(b,bx)},
  /* Sumo-Champion: ein Sumo-Ring erscheint, der Gegner fliegt hinaus */
  async goro(a,b,d,c){const ax=fx_(a).x,bx=fx_(b).x,mx=(ax+bx)/2,rg=new THREE.Mesh(gT(3,.14,8,40),bmat(0xf4f0e6));rg.rotation.x=Math.PI/2;rg.position.set(mx,.08,0);keep(rg);sfx("gong");pose(a,"crouch",20);
    pop(L("Hakkeyoi!","Hakkeyoi!","Hakkeyoi !","¡Hakkeyoi!"),hex(c),mx,4.8,"mv");await rt(.8);for(let i=0;i<5;i++){pose(a,i%2?"jab":"cross",60);sfx("punch");await dash(a,fx_(b).x-d*1.2,.12);impact(a,b,1,{nomt:1,quiet:i%2,noKO:1,push:.5,stop:.03});await rt(.12)}
    pose(a,"cross",70);sfx("heavy");flash("#fff");kill(a,b,{s:"heavy"});await flyOff(b,d);pose(a,"win",20);pop("YOKOZUNA!","#ffc21a",fx_(a).x,4.8,"mv");await rt(.7);dropMesh(rg);await fallBack(b,b.side*5.5)},
  /* Roter Schatten: rote Doppelgänger schlagen von allen Seiten zu */
  async shade(a,b,d,c){const bx=fx_(b).x;pose(a,"crouch",20);a.root.visible=false;sfx("whoosh");await rt(.3);
    for(let i=0;i<8;i++){const s=i%2?1:-1,x=bx+s*rnd(1,1.8),y=rnd(.4,2.4);glow(x,y+1.4,0xd6222c,3,.25);streak(x,y+1.6,-s,0xd6222c,4);slashArc(bx,rnd(1.2,3),i%2?0xd6222c:0x15131a,rnd(6.3),2.4);sfx("swoosh");impactFrame(30);pose(b,"hurt",60);await rt(.13)}
    a.root.visible=true;fx_(a).x=clamp(bx+d*1.6,-7,7);a.turn.rotation.y=-FACE;pose(a,"hurl",30);await rt(.6);pop(L("Spiegelbild.","Mirror image.","Reflet.","Reflejo."),"#ff5a5a",fx_(a).x,4.6,"mv");sfx("key");await rt(.5);
    flash("#fff");sfx("boom");for(let i=0;i<8;i++)slashArc(bx,rnd(1,3.2),0xd6222c,rnd(6.3),3);kill(a,b,{s:"heavy"});a.turn.rotation.y=FACE;await launch(b,b.side*5,.6,.5,0)},
  /* Drachentänzerin: Gegner fliegt in die Luft, Feuerwerk, dann fällt er herunter */
  async mika(a,b,d,c){const bx=fx_(b).x;await dash(a,bx-d*1.3,.15);pose(a,"kick",60);sfx("whoosh");impact(a,b,1,{nomt:1,noKO:1,noReact:1,lv:1});b.grounded=false;b.downed=true;pose(b,"air",20);
    await rt(.6,p=>{fx_(b).y=eOut(p)*6;b.piv.rotation.x-=.25});const cols=[0xff3dcb,0xffc21a,0x3fe06b,0x25d4ff,0xff5a1a];
    for(let i=0;i<6;i++){const x=bx+rnd(-3,3),y=rnd(5,9),cc=P(cols);sparks(x,y,-1,26,[cc,0xffffff],9);glow(x,y,cc,6,.5,-1);ring(x,y,-1,cc,2.5,.5);sfx(i%2?"boom":"zap");await rt(.18)}
    flash("#fff");kill(a,b,{s:"boom",y:fx_(b).y+1});pop(L("Oooh!","Oooh!","Oooh !","¡Oooh!"),"#ffc21a",bx,9.5,"mv");await launch(b,bx+b.side*.8,0,.7,1.5)},
  /* Eisdrache: ein Gletscher stürzt vom Himmel */
  async drako(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);sfx("charge");const gl=new THREE.Group();M(gB(3.2,2.6,2),ICE,[0,0,0],gl,1,0x2a6a88);M(gK(1.4,2,6),ICE2,[0,-2.1,0],gl,1).rotation.z=Math.PI;gl.position.set(bx,18,0);keep(gl);
    await rt(.6,p=>{flashLight(ICE,2+p*3,bx,4)});pop(L("Achtung, Eis!","Watch out, ice!","Attention, glace !","¡Cuidado, hielo!"),"#dff8ff",bx,4.8,"mv");await rt(.4);sfx("whoosh");
    await rt(.35,p=>{gl.position.y=18-p*p*15.6});CAM.shake=1.1;flash("#fff");sfx("slam");sfx("stone");dust(bx,0,16,0xdff8ff);crack(bx,3.5,2);shards(bx,2.2,[ICE,ICE2,0xffffff],30,.35);tint(b,ICE);
    kill(a,b,{s:"slam",y:.6});await rt(.8);dropMesh(gl);untint(b);await launch(b,bx+b.side*.8,.3,.5,0)},
  /* Blauer Oni: Gegner hüpft auf einer Riesentrommel, immer höher */
  async oni(a,b,d,c){const bx=fx_(b).x,dr=new THREE.Group(),B=0x4aa8ff;M(gC(1.8,1.8,1.2,22),0xd6222c,[0,.6,0],dr);M(gC(1.85,1.85,.08,22),0xf4f0e6,[0,1.22,0],dr,0);dr.position.set(bx,-1.4,0);keep(dr);sfx("stone");
    await rt(.4,p=>{dr.position.y=-1.4+eOut(p)*1.4});b.grounded=false;b.downed=false;pose(b,"air",20);fx_(b).y=1.3;
    for(let i=0;i<3;i++){pose(a,"lift",25);await rt(.18);pose(a,"hurl",55);sfx("slam");sfx("zap");bolt(bx,B,12,1.3);ring(bx,1.3,0,B,3+i,.4);CAM.shake=.5;const h=2+i*2;await rt(.5,p=>{fx_(b).y=1.3+Math.sin(p*Math.PI)*h;b.piv.rotation.x=-p*Math.PI*2})}
    flash("#cfe6ff");for(let i=0;i<3;i++)bolt(bx+rnd(-.5,.5),i?B:0xffffff,16,0);sfx("boom");kill(a,b,{s:"zap",y:2});await flyOff(b,d);dropMesh(dr);await rt(.5);await fallBack(b,b.side*5)},
  /* Gefallener Engel: fliegt hoch und stürzt als schwarzer Komet herab */
  async seraph(a,b,d,c){const bx=fx_(b).x,ax0=fx_(a).x;a.grounded=false;pose(a,"skyfall",20);sfx("jump");await rt(.5,p=>{fx_(a).y=eOut(p)*14});a.root.visible=false;pop("…","#9a6bff",bx,5,"mv");await rt(.7);
    const cm=new THREE.Mesh(gS(.7,14,10),bmat(0x15131a));keep(cm);sfx("whoosh");await rt(.4,p=>{cm.position.set(lerp(bx-d*4,bx,p),lerp(14,1.5,p*p),0);sparks(cm.position.x,cm.position.y,0,3,[0x3a2a60,0x9a6bff,0x15131a],4);glow(cm.position.x,cm.position.y,0x6a3ad0,3,.2)});
    dropMesh(cm);flash("#fff");CAM.shake=1;sfx("boom");glow(bx,1.5,0x6a3ad0,14,.7);for(let i=0;i<3;i++)ring(bx,.06,0,i?0x6a3ad0:0xffffff,3+i*2.2,.6);crack(bx,3,2);dust(bx,0,14,0x333340);
    a.root.visible=true;fx_(a).x=clamp(bx-d*1.3,-7,7);fx_(a).y=0;a.grounded=true;pose(a,"crouch",20);kill(a,b,{s:"boom"});await launch(b,b.side*6,2.6,.8,2);pose(a,"win",20)},
  /* Weisser Kaiser: ein kleiner Stern wächst und explodiert als Supernova */
  async kaiser(a,b,d,c){const bx=fx_(b).x,st=new THREE.Mesh(gS(.3,18,12),bmat(0xffffff));st.position.set(bx,4.5,-.5);keep(st);pose(a,"win",20);sfx("charge");
    await rt(1.4,p=>{const s=1+p*p*6;st.scale.setScalar(s);flashLight(0xffffff,2+p*5,bx,4);CAM.shake=p*.15;if(Math.random()<.5)sparks(bx+rnd(-2,2),4.5+rnd(-2,2),0,1,[0xffffff,0xc8d8ff],3)});
    pop(L("Ups.","Oops.","Oups.","Uy."),"#fff",fx_(a).x,4.6,"mv");await rt(.3);dropMesh(st);flash("#fff");impactFrame(140);sfx("boom");sfx("slam");CAM.shake=1.2;
    for(let i=0;i<4;i++)ring(bx,4.5,0,i%2?0xc8d8ff:0xffffff,4+i*3,.8);glow(bx,4.5,0xffffff,20,.9);burstLines(bx,4.5,0xffffff,24,8);kill(a,b,{s:"boom"});await launch(b,b.side*6.8,3,.9,2.5)},
  /* Professor Kreide: eine Lawine aus Hausaufgabenheften begräbt den Gegner */
  async magus(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);pop(L("Hausaufgaben!","Homework!","Devoirs !","¡Deberes!"),"#3dffd0",fx_(a).x,4.6,"mv");const pile=[];
    for(let i=0;i<22;i++){const m=book(),y1=.11+i*.13;m.position.set(bx+rnd(-.3,.3),10+rnd(0,2),rnd(-.3,.3));m.rotation.y=rnd(6.3);sc.add(m);TEMP.push(m);pile.push(m);rt(.3,p=>{m.position.y=lerp(m.position.y,y1,p)});if(i%3==0)sfx("paper");await rt(.06)}
    await rt(.3);squash(b,1.3,.4);sfx("heavy");CAM.shake=.5;pop(L("Note: Sehr gut!","Grade: A+!","Note : 20/20 !","Nota: ¡Sobresaliente!"),"#ffc21a",bx,5.6,"mv");await rt(.9);
    sfx("boom");pile.forEach(m=>{debris.push({m,v:new THREE.Vector3(rnd(-6,6),rnd(3,9),rnd(-3,3)),s:new THREE.Vector3(rnd(6),rnd(6),rnd(6)),l:1.4,r:.15});const i=TEMP.indexOf(m);if(i>=0)TEMP.splice(i,1)});
    squash(b,1,1);kill(a,b,{s:"boom"});await launch(b,b.side*6,2.6,.8,2)},
};

/* Namen am zweiten Outfit hinterlegen: outfit() setzt damit eigene sig/fin-Felder */
for(const id in OUT2){const ch=CH.find(c=>c.id==id);if(ch&&ch.alt)ch.alt.names=OUT2[id]}
