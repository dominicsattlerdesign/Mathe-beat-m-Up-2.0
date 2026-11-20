/* ---------- Mimi Tus: torkelnder Herz-Kämpfer ----------
   Kampfstil wie ein Betrunkener (torkeln, schwanken, unerwartet zuschlagen), aber kindgerecht: kein Alkohol, nur Liebeskummer.
   Alles hat mit Herzen zu tun. Hier: Treffer-Effekt, 3 Hiebe, 3 Kicks, 2 Würfe, Spezial-Attacke, Finisher, Auftritt. */
const PINK=0xff5ca8,PINK2=0xff9ac8,RED=0xff3b5c;
function heartMesh(c=PINK,s=.3,e){const m=new THREE.Mesh(heartGeo(),e?addMat(c,.95):bmat(c));m.scale.setScalar(s);return m}
/* kleine Herzen fliegen auseinander */
function heartBurst(x,y,n=6,cols=[PINK,RED,PINK2,0xffffff],sz=.22,real){n=Math.ceil(n*Math.max(.5,QF));for(let i=0;i<n;i++){const m=heartMesh(P(cols),sz*rnd(.7,1.3)),v=[rnd(-3.5,3.5),rnd(1.5,5)];m.position.set(x,y,.6);
  fxAdd(m,.8,(m,p,dt)=>{m.position.x+=v[0]*dt;m.position.y+=v[1]*dt;v[1]-=6*dt;m.rotation.y+=dt*4;m.scale.setScalar(sz*(1-p*.6))},real)}}
/* Tränen (Liebeskummer): kleine blaue Tropfen */
function tears(f,n=4,real=1){const hx=fx_(f).x,hy=3.25*f.sc+fx_(f).y;for(let i=0;i<n;i++){const s=i%2?-1:1,m=new THREE.Mesh(gS(.06,8,6),bmat(0x7fd0ff)),v=[s*rnd(1,2),rnd(1,2.4)];m.position.set(hx+s*.18,hy,.4);
  fxAdd(m,.6,(m,p,dt)=>{m.position.x+=v[0]*dt;m.position.y+=v[1]*dt;v[1]-=9*dt},real)}}
EFX.mimi=(a,x,y,lv)=>{heartBurst(x,y,3+lv*3);if(lv)glow(x,y,PINK,2.5+lv)};
/* Torkeln: kurzer Schwank zur Seite, bevor der Schlag kommt */
async function wobble(a,t=.3){pose(a,"stumble",22);const z0=a.piv.rotation.z;await Tw(a,t,p=>{a.piv.rotation.z=Math.sin(p*Math.PI*2)*.28});a.piv.rotation.z=z0}
const hic=(a)=>pop(L("Hicks!","Hic!","Hic !","¡Hip!"),"#ff9ac8",fx_(a).x,4.4*a.sc,"mv");

KMV.mimi={
  hieb:[
    ["Herzklopfen","Heartbeat","Battement de cœur","Latido",hCombo({gap:1.35,hits:[H("jab",.2,{fx:(a,b)=>heartBurst(fx_(b).x,2.3,4)}),H("jab",.2,{q:1,after:.2}),H("cross",.2,{fx:(a,b)=>heartBurst(fx_(b).x,2.3,4)}),H("upper",.4,{pre:"windup",lv:1,y:2.5,fx:(a,b)=>{const m=heartMesh(RED,.9,1);fxAdd(m,.5,(m,p)=>{m.position.set(fx_(b).x,2.6,.5);m.scale.setScalar(.6+Math.sin(p*Math.PI*4)*.25)})}})],end:"launch"})],
    ["Torkelfaust","Stumble Fist","Poing titubant","Puño tambaleante",async(a,b,dm)=>{await go(a,b,2.2,.3);await wobble(a,.35);hic(a);await wobble(a,.25);
      pose(a,"cross",70);sfx("whoosh");await Tw(a,.08,p=>{fx_(a).x=clamp(fx_(a).x-a.side*.12,-6.9,6.9)});hit(a,b,dm,{lv:2,s:"heavy",noReact:1,stop:.13});await END("low",a,b)}],
    ["Liebesbrief-Ohrfeige","Love Letter Slap","Gifle lettre d’amour","Bofetada carta de amor",hHeavy({cw:.3,p:"hurl",fx:(a,b)=>{const m=M(gB(.6,.42,.03),0xfff2f6,null,null,1);const hm=heartMesh(RED,.12);hm.position.z=.03;m.add(hm);fxAdd(m,.6,(m,p)=>{m.position.set(fx_(b).x,2.4+p*1.4,.6);m.rotation.z+=.2})},end:"launch"})]],
  kick:[
    ["Wackeltritt","Wobble Kick","Coup vacillant","Patada tambaleante",kFly({h:.9,spin:.6,trail:(x,y)=>{if(Math.random()<.4)heartBurst(x,y,1,undefined,.15)}})],
    ["Schluckauf-Kicks","Hiccup Kicks","Coups du hoquet","Patadas de hipo",kMulti({n:3,ys:[1.2,2.6,1.8],each:(a,b,i)=>{if(i<2)hic(a)},end:"launch"})],
    ["Herzschmerz-Feger","Heartache Sweep","Balayette chagrin","Barrida de desamor",kSweep({h:1.7,trail:(x,y)=>{if(Math.random()<.5)heartBurst(x,y,1,undefined,.15)}})]],
  wurf:[
    ["Amors Pfeil","Cupid’s Arrow","Flèche de Cupidon","Flecha de Cupido",wProj({mk:a=>{const g=new THREE.Group(),sh=new THREE.Mesh(gC(.03,.03,1.4,6),bmat(0xf4f0e6));sh.rotation.z=Math.PI/2;g.add(sh);const h=heartMesh(RED,.28);h.position.x=-a.side*.75;h.rotation.z=-a.side*Math.PI/2;g.add(h);return g},spin:0,t:.22,p:"cross",trail:(x,y)=>{if(Math.random()<.5)heartBurst(x,y,1,undefined,.12)},boom:(x,y)=>heartBurst(x,y,12)})],
    ["Liebeskarussell","Love Carousel","Carrousel d’amour","Carrusel del amor",wSpin({spins:3,h:2.6,trail:(x,y)=>{if(Math.random()<.5)heartBurst(x,y,1,undefined,.18)},boom:x=>heartBurst(x,1,14)})]],
};
for(const k in KMV.mimi)KMV.mimi[k]=KMV.mimi[k].map(([de,en,fr,es,f])=>{const m={f};bi(m,"n",de,en,fr,es);return m});

/* Spezial-Attacke „Herzensbrecher“: ein Riesenherz fällt, zerbricht in zwei Hälften, die Scherben treffen */
SIG.mimi=async(a,b,dm,d,c)=>{pose(a,"win",20);const bx=fx_(b).x,h=heartMesh(PINK,1.8,1);h.position.set(bx,10,0);keep(h);sfx("charge");
  await tw(.35,p=>{h.position.y=10-eOut(p)*6.2;h.rotation.y=Math.sin(p*9)*.3});tears(a,6,0);pop(L("Mein Herz …","My heart …","Mon cœur …","Mi corazón …"),"#ff9ac8",fx_(a).x,4.6,"mv");await wait(.3);
  sfx("slam");unkeep(h);for(const s of[-1,1]){const half=heartMesh(PINK,1.8,1);half.scale.x=.9;fxAdd(half,.6,(m,p)=>{m.position.set(bx+s*p*1.6,3.8-p*p*3,0);m.rotation.z=s*p*1.2;m.material.opacity=.95*(1-p)})}
  for(let i=0;i<5;i++){heartBurst(bx,2.2,4);sparks(bx,2.2,.6,10,[PINK,RED,0xffffff],7);sfx(i%2?"punch":"zap");impact(a,b,dm*.12,{nomt:1,quiet:i%2,stop:.03,push:.05});await wait(.1)}
  glow(bx,2,PINK,9,.5);ring(bx,2,0,RED,5,.5);burstLines(bx,2,PINK,16,4);sfx("boom");impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.2,2,.65,1)};

/* Finisher „Liebeskummer“: Regenwolke über Mimi, Tränen, dann trägt ein Herzballon den Gegner davon und platzt */
FIN.mimi=async(a,b,d,c)=>{const ax=fx_(a).x,bx=fx_(b).x,cl=new THREE.Group();for(let i=0;i<6;i++)M(gS(rnd(.5,.8),12,8),0x8a8a9a,[rnd(-1,1),rnd(-.2,.2),rnd(-.3,.3)],cl,0);cl.position.set(ax,7,0);keep(cl);pose(a,"crouch",20);
  await rt(.5,p=>cl.position.y=7-eOut(p)*1.8);for(let i=0;i<6;i++){tears(a,3);drift(ax,4.6,0,0x7fd0ff,4,1,.6,-6,.6);sfx(i%2?"key":"pick");await rt(.15)}
  pop(L("*schnief*","*sniff*","*snif*","*snif*"),"#bfe8ff",ax,4.8,"mv");await rt(.4);pose(a,"win",20);sfx("charge");
  const bl=heartMesh(RED,.3,0);bl.position.set(bx,1.2,-.2);keep(bl);await rt(.6,p=>{bl.scale.setScalar(.3+eOut(p)*1.5);bl.position.y=1.2+p*.6});
  b.grounded=false;b.downed=true;pose(b,"air",20);const str=new THREE.Mesh(gC(.02,.02,1.2,4),bmat(0xffffff));keep(str);sfx("whoosh");
  await rt(1,p=>{const y=eOut(p)*5.5;bl.position.y=3+y;fx_(b).y=y;bl.rotation.z=Math.sin(p*8)*.15;str.position.set(bx,2.4+y,0)});
  pop(L("Tschüss!","Bye bye!","Au revoir !","¡Adiós!"),"#ff9ac8",bx,9.8,"mv");await rt(.3);sfx("boom");flash("#fff");unkeep(bl);unkeep(str);heartBurst(bx,8.4,24,undefined,.3,1);glow(bx,8.4,PINK,10,.6);
  kill(a,b,{s:"boom",y:fx_(b).y+1});unkeep(cl);await launch(b,bx+b.side*.8,0,.7,1.5)};

/* Auftritt: graue Rauchwolke, Mimi sitzt weinend darin, wischt die Tränen weg und steht auf */
WALK.mimi=async(f,o)=>{camMid(o,5);camSnap();const cl=new THREE.Group();for(let i=0;i<14;i++)M(gS(rnd(.45,.9),12,8),P([0x5a5a66,0x6a6a76,0x4a4a56]),[rnd(-1.4,1.4),rnd(0,1.8),rnd(-.6,.6)],cl,0);cl.position.set(o.X,0,0);cl.scale.setScalar(.1);keep(cl);
  sfx("whoosh");await A(.45,p=>cl.scale.setScalar(.1+eOut(p)*.9));put(f,o.X);fx_(f).y=-.55;pose(f,"crouch",40);f.piv.rotation.x=.25;camNear(f,o);
  for(let i=0;i<7;i++){tears(f,2);if(i==2)say(f,"*schluchz*","*sob*","#bfe8ff");sfx(i%2?"key":"pick");await A(.17)}
  await A(.5,p=>{cl.scale.setScalar(1+p*.6);cl.children.forEach(m=>{m.material.transparent=true;m.material.opacity=1-p})});
  f.piv.rotation.x=0;fx_(f).y=0;pose(f,"win",20);heartBurst(o.X,3.2,10,undefined,.22,1);say(f,"Schon gut … Liebe tut weh!","I’m fine … love hurts!","#ff9ac8");await finishPose(f,.7)};
