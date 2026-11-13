/* ---------- Auftritte vor dem Kampf (Walk-ins) ----------
   30 Auftritte: je einer pro Figur (WALK.id) und pro zweitem Outfit (WALK.id2).
   Ablauf: Band mit Porträt und Name, dann die Szene der Figur, dann eine Pose.
   Tippen überspringt alles. Jede Szene bekommt f (Kämpfer) und o = {s, d, X, c}:
   s = Seite der Figur (-1 links, +1 rechts), d = Richtung zur Mitte, X = Startplatz, c = Farbe. */
const WI={id:0,active:false,CANCEL:{cancel:1},wait:new Set()};
/* A: zeitgesteuerter Schritt in Echtzeit, bricht ab, wenn übersprungen wurde */
function A(d,fn){const id=WI.id;return new Promise((res,rej)=>{const stop=()=>rej(WI.CANCEL);WI.wait.add(stop);
  rt(d,p=>{if(id===WI.id&&fn)fn(p)}).then(()=>{WI.wait.delete(stop);id===WI.id?res():rej(WI.CANCEL)})})}
/* Kamera: Abstand wird bei schmalen Bildschirmen etwas vergrössert, damit alles ins Bild passt */
function camAt(px,py,pz,lx,ly,k=4){const af=clamp(1.75/cam.aspect,1,1.6);CAM.tp.set(px,py,pz*af);CAM.tl.set(lx,ly,0);CAM.k=k}
const camSnap=()=>{CAM.p.copy(CAM.tp);CAM.l.copy(CAM.tl)};
const camNear=(f,o,k=3.5)=>camAt(o.X+o.d*1.9,2.4*f.sc,5.6,o.X+o.d*.2,2.25*f.sc,k);
const camMid=(o,k=4)=>camAt(o.X+o.d*1.2,2.7,8.6,o.X,2.1,k);
const camWide=(o,k=3)=>camAt(o.X+o.s*2.2,3.4,11.5,o.X+o.s*1.8,2,k);
function put(f,x,y=0,z=0){f.root.position.set(x,y,z);f.root.visible=true}
/* Figur an ihren Startplatz zurück, alle Verformungen aufheben */
function settle(f){put(f,f.hx,0,0);f.piv.rotation.set(0,0,0);f.turn.rotation.y=FACE;f.grounded=true;f.run=false;if(f.ms)f.model.scale.setScalar(f.ms);
  f.root.scale.set(Math.sign(f.root.scale.x)*(f.rs||1),f.rs||1,f.rs||1);untint(f)}
/* Sprung im Bogen, optional mit Salto */
async function arc(f,x0,y0,z0,x1,y1,z1,h,dur,flips=0,ps="kickCh"){f.grounded=false;pose(f,ps,25);
  await A(dur,p=>{f.root.position.set(lerp(x0,x1,p),lerp(y0,y1,p)+Math.sin(p*Math.PI)*h,lerp(z0,z1,p));f.piv.rotation.x=-Math.PI*2*flips*eOut(p)});
  f.piv.rotation.x=0;f.root.position.set(x1,y1,z1);f.grounded=y1<=.01}
function landFx(f,c,big){const x=f.root.position.x;sfx(big?"slam":"land");dust(x,0,big?14:8);ring(x,.06,0,c,big?5:3,.5);CAM.shake=Math.max(CAM.shake,big?.5:.25);if(big)crack(x,1.6,1)}
async function strut(f,x0,x1,dur){f.root.visible=true;f.root.position.x=x0;f.run=true;pose(f,"run",30);await A(dur,p=>{f.root.position.x=lerp(x0,x1,p)});f.run=false;f.root.position.x=x1}
async function finishPose(f,t=.75){pose(f,"win",12);f.turn.rotation.y=FACE;await A(t)}
function say(f,de,en,col){pop(L(de,en),col||"#fff",f.root.position.x,4.3*f.sc,"mv")}
/* Requisiten: Gruppe bauen, in die Szene setzen und beim Aufräumen wieder entfernen */
function prop(type,x,z=0,s=1,ry=0,arg){const g=new THREE.Group();PROP[type](g,arg);g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=ry;return keep(g)}
function fling(m,v,l=1.8){sc.add(m);debris.push({m,v,s:new THREE.Vector3(rnd(-6,6),rnd(-6,6),rnd(-6,6)),l,fx:1})}
/* langsam treibende Flocken: Schnee, Federn, Glitzer, Blütenblätter */
function drift(x,y,z,c,n,sx=3,life=2,vy=-1.2,sz=1){n=Math.ceil(n*QF);for(let i=0;i<n;i++){const m=new THREE.Mesh(gB(.13*sz,.05*sz,.2*sz),bmat(Array.isArray(c)?P(c):c)),ph=rnd(6);
  m.position.set(x+rnd(-sx,sx),y+rnd(0,3),z+rnd(-1,1.6));fxAdd(m,life*rnd(.7,1.2),(m,p,dt)=>{m.position.y+=vy*dt;m.position.x+=Math.sin(p*8+ph)*dt*.9;m.rotation.x+=dt*3;m.rotation.z+=dt*2},1)}}
/* Schwarm kleiner Teile, der um einen Punkt kreist (Blüten, Federn) */
function swarm(X,cols,n,geo2){const g=new THREE.Group();n=Math.ceil(n*Math.max(.5,QF));for(let i=0;i<n;i++){const m=new THREE.Mesh(geo2||gO(.1),bmat(P(cols)));m.userData={a:rnd(6.28),r:rnd(1,2.6),y:rnd(0,4),v:rnd(2,4)};g.add(m)}g.position.x=X;return keep(g)}
function stepSwarm(g,p,dt,shrink=1){for(const m of g.children){const u=m.userData;u.a+=u.v*dt*3;const r=u.r*(1-p*shrink*.85);m.position.set(Math.cos(u.a)*r,u.y+Math.sin(u.a*2)*.3,Math.sin(u.a)*r);m.rotation.x+=dt*5;m.rotation.y+=dt*4}}
let _wl=performance.now();const dtw=()=>{const n=performance.now(),d=Math.min(.05,(n-_wl)/1000);_wl=n;return d};
function pirateShip(){const g=new THREE.Group(),W=0x6a3a1e,D=0x4a2a14;
  M(gB(5.6,1.1,1.8),W,[0,.55,0],g,1,0,"wood");M(gB(5.8,.18,1.9),D,[0,1.12,0],g,1,0,"wood");
  const bow=M(gK(.95,1.6,4),W,[3.4,.6,0],g,1,0,"wood");bow.rotation.z=-Math.PI/2;bow.rotation.x=Math.PI/4;bow.scale.set(1,1,.62);
  M(gB(1.6,.9,1.8),W,[-2.4,1.5,0],g,1,0,"wood");M(gB(1.7,.14,1.9),D,[-2.4,1.98,0],g,1,0,"wood");
  for(let i=0;i<4;i++){const c=M(gC(.14,.17,.5,10),0x23262f,[-1.2+i*1.1,.7,.92],g,1,0,"metal");c.rotation.x=Math.PI/2}
  for(let i=-5;i<=5;i++)M(gC(.05,.05,.5,6),D,[i*.5,1.42,.86],g,0,0,"wood");M(gB(5.6,.08,.08),D,[0,1.68,.86],g,0,0,"wood");
  M(gC(.13,.16,6.4,10),D,[.3,4.3,0],g,1,0,"wood");M(gC(.1,.12,4.4,10),D,[-2.1,3.9,0],g,1,0,"wood");
  const sm=new THREE.MeshToonMaterial({gradientMap:GRAD,side:THREE.DoubleSide,map:ctex(256,220,c=>{c.fillStyle="#f1e7d0";c.fillRect(0,0,256,220);
    c.fillStyle="#1a1418";c.beginPath();c.arc(128,96,40,0,7);c.fill();c.fillStyle="#f1e7d0";for(const x of[112,144]){c.beginPath();c.arc(x,92,10,0,7);c.fill()}c.fillRect(110,118,36,10);
    c.strokeStyle="#1a1418";c.lineWidth=12;c.beginPath();c.moveTo(78,150);c.lineTo(178,196);c.moveTo(178,150);c.lineTo(78,196);c.stroke()})});
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.7),sm);sail.rotation.y=.25;sail.position.set(.3,4.8,.12);g.add(sail);
  const s2=sail.clone();s2.scale.setScalar(.6);s2.position.set(-2.1,4.1,.1);g.add(s2);M(gB(.04,.5,.9),0x15131a,[.3,7.7,-.45],g,0);return g}
function waveBlock(){const g=new THREE.Group(),w=new THREE.Mesh(gB(8,.9,2.6),new THREE.MeshToonMaterial({gradientMap:GRAD,color:0x1a8ac8,transparent:true,opacity:.92}));w.position.y=.25;g.add(w);
  for(let i=0;i<9;i++){const f=M(gS(.38,10,8),0xffffff,[-3.6+i*.9,.72+rnd(.15),rnd(-1.1,1.1)],g,0);f.scale.y=.55}return g}
const cardMat=()=>new THREE.MeshToonMaterial({gradientMap:GRAD,map:ctex(128,180,g=>{g.fillStyle="#f8f4ea";g.fillRect(0,0,128,180);g.fillStyle="#5a2ea6";g.fillRect(10,10,108,160);
  g.strokeStyle="#ffc21a";g.lineWidth=6;g.strokeRect(16,16,96,148);g.fillStyle="#ffc21a";g.font="900 90px serif";g.textAlign="center";g.textBaseline="middle";g.fillText("?",64,92)})});

const WALK={
 /* ===== Erste Outfits ===== */
 async raiko(f,o){camMid(o,5);camSnap();const cl=new THREE.Group();for(let i=0;i<8;i++)M(gS(rnd(.6,1),12,8),0x3a3a4c,[rnd(-1.6,1.6),rnd(-.2,.3),rnd(-.5,.5)],cl,0);cl.position.set(o.X,12,0);keep(cl);
   await A(.8,p=>cl.position.y=12-eOut(p)*4.8);
   for(let i=0;i<3;i++){bolt(o.X+rnd(-.3,.3),i%2?0xffffff:o.c,7,0);sfx("zap");flashLight(o.c,6,o.X,3);await A(.13)}
   put(f,o.X);pose(f,"win",40);sparks(o.X,1,0,30,[o.c,0xffffff],9);hitRing(o.X,1.6,o.c,2);CAM.shake=.3;camNear(f,o);
   await A(.6,p=>cl.position.y=7.2+p*7);await finishPose(f,.4)},
 async akane(f,o){camMid(o,5);camSnap();ring(o.X,.06,0,o.c,2.5,.9);glow(o.X,.3,o.c,4,.9,0);await A(.6,p=>flashLight(o.c,1+p*3,o.X,.5));
   sfx("whoosh");pillar(o.X,o.c,1.3,10,.9);pillar(o.X,0xffe14d,.7,10,.7);put(f,o.X);pose(f,"crouch",40);
   for(let i=0;i<4;i++){sparks(o.X+rnd(-.6,.6),rnd(0,3),0,8,[o.c,0xffe14d],7);await A(.1)}
   camNear(f,o);pose(f,"strike",30);sfx("heavy");glow(o.X+o.d*.7,2.1,o.c,3,.4);await finishPose(f)},
 async rokka(f,o){const sx=o.s*16,stopX=o.X-o.d*1.1,z=-1.4;const ship=pirateShip(),w=waveBlock(),grp=new THREE.Group();grp.add(w,ship);ship.position.y=.55;grp.scale.x=o.d;grp.position.set(sx,0,z);keep(grp);
   camWide(o);camSnap();put(f,sx,1.76,z);pose(f,"win",20);f.turn.rotation.y=FACE-.4;sfx("whoosh");
   await A(2,p=>{const x=lerp(sx,stopX,eOut(p));grp.position.x=x;ship.position.y=.55+Math.sin(p*14)*.12;ship.rotation.x=Math.sin(p*11)*.04;
     f.root.position.set(x+o.d*2.4,1.76+ship.position.y-.55,z);if(Math.random()<.5*QF)sparks(x+o.d*3.6,.8,z+rnd(-.8,.8),2,[0xffffff,0xbfe8ff],4);CAM.tp.x=x+o.d*1;CAM.tl.x=x+o.d*1.5});
   say(f,"Arrr!","Arrr!");sfx("metal");await A(.5);sfx("jump");camAt(o.X,3.2,9,o.X,2,4);
   await arc(f,f.root.position.x,f.root.position.y,z,o.X,0,0,2.6,.75,1);landFx(f,o.c);camNear(f,o);
   const gx=grp.position.x;await finishPose(f,.2);await A(1.1,p=>{grp.position.x=lerp(gx,-o.s*16,eIn(p));ship.position.y=.55+Math.sin(p*12)*.12})},
 async zeno(f,o){camMid(o,5);camSnap();const card=new THREE.Mesh(gB(2.4,3.6,.08),cardMat());card.position.set(o.X,13,.4);keep(card);sfx("whoosh");
   await A(.9,p=>{card.position.y=lerp(13,1.85,eOut(p));card.rotation.y=p*Math.PI*6});sfx("paper");dust(o.X,0,6,0xf4f0ff);put(f,o.X);pose(f,"win",30);
   await A(.45,p=>{card.rotation.y+=.5;card.scale.setScalar(1-p);card.position.z=.4+p*1.2});card.visible=false;
   for(let i=0;i<12;i++){const m=new THREE.Mesh(gB(.3,.45,.02),bmat(i%2?0x5a2ea6:0xf4f0ff));m.position.set(o.X,2,.6);fling(m,new THREE.Vector3(rnd(-5,5),rnd(4,9),rnd(-2,3)))}
   camNear(f,o);say(f,"Ta-da!","Ta-da!",hex(o.c));await finishPose(f)},
 async tetsu(f,o){camMid(o,4);camSnap();const g=swarm(o.X,[0xffb7d0,0xff8fb5,0xffffff],46);let t=0;
   await A(1.2,p=>{stepSwarm(g,p,dtw(),.6);if(p>.6&&!t){t=1;put(f,o.X);pose(f,"crouch",60);sfx("swoosh")}});dtw();
   await A(.5,p=>{const dt=dtw();for(const m of g.children){m.position.multiplyScalar(1+dt*3);m.position.y+=dt*2}});g.visible=false;
   camNear(f,o,3);pose(f,"idle",6);await A(.4);pose(f,"cross",30);sfx("whoosh");slashArc(o.X+o.d*.8,2.2,0xffffff,.4,1.8);await finishPose(f)},
 async volt(f,o){camMid(o,5);camSnap();const g=new THREE.Group();M(gC(.85,.9,2.6,16),0x8a94a8,[0,1.3,0],g,1,0,"metal");M(gK(.88,1,16),0x8a94a8,[0,3.1,0],g,1,0,"metal");
   for(const y of[.6,2])M(gC(.92,.92,.12,16),0x25d4ff,[0,y,0],g,0,0x1a8ab0);g.position.set(o.X,14,0);keep(g);sfx("whoosh");
   await A(.55,p=>{g.position.y=lerp(14,0,eIn(p));if(Math.random()<.6)sparks(o.X,g.position.y+3.4,0,2,[0xff8a00,0xffe14d],3)});
   landFx(f,o.c,1);glow(o.X,.5,0xff8a00,6,.5);put(f,o.X);pose(f,"crouch",60);await A(.25);sfx("metal");
   await A(.6,p=>{g.position.y=p*7;g.scale.setScalar(1-p*.4);if(Math.random()<.7*QF)dust(o.X+rnd(-1,1),0,1,0xeaf2ff)});g.visible=false;
   camNear(f,o);glow(o.X+o.d*.1,3.05*f.sc,0x25d4ff,1.6,.6);say(f,"Piep. Kampfmodus.","Beep. Battle mode.","#25d4ff");await finishPose(f)},
 async luna(f,o){camAt(o.X+o.d*1.2,3.6,9.5,o.X,3.2,3);camSnap();shaft(o.X,o.c,2.2,2.2);put(f,o.X,6.5);f.grounded=false;pose(f,"win",20);sfx("charge");
   await A(1.7,p=>{f.root.position.y=6.5*(1-eOut(p));if(Math.random()<.5)glow(o.X+rnd(-1.5,1.5),rnd(0,6),0xffe98a,.8,.4);CAM.tl.y=lerp(4.5,2.2,p)});
   f.grounded=true;ring(o.X,.06,0,o.c,3,.6);sfx("ok");drift(o.X,4,0,[0xffe98a,0xffffff],20,2,1.4,-1.6,.8);camNear(f,o);await finishPose(f)},
 async goro(f,o){camWide(o);camSnap();const r=M(gD(1.5),0x6a6570,null,null,1,0,"stone");r.position.set(o.s*12,1.5,0);keep(r);sfx("stone");
   await A(1.2,p=>{const x=lerp(o.s*12,o.X,eOut(p));r.position.x=x;r.rotation.z=-o.d*x*.7;if(Math.random()<.4*QF)dust(x,0,1);CAM.shake=.08});
   sfx("stone");CAM.shake=.3;await A(.3,p=>r.position.x=o.X+Math.sin(p*40)*.06);
   r.visible=false;for(let i=0;i<9;i++){const m=M(gD(rnd(.3,.6)),0x6a6570,null,null,1,0,"stone");m.position.set(o.X+rnd(-.8,.8),rnd(.6,2.4),rnd(-.6,.6));fling(m,new THREE.Vector3(rnd(-6,6),rnd(3,8),rnd(-2,3)),2)}
   put(f,o.X);pose(f,"lift",40);camNear(f,o);await A(.4);pose(f,"crouch",40);landFx(f,o.c,1);await finishPose(f)},
 async shade(f,o){camMid(o,4);camSnap();const disc=new THREE.Mesh(new THREE.CircleGeometry(1,32),new THREE.MeshBasicMaterial({color:0x05040a,transparent:true,opacity:.95}));
   disc.rotation.x=-Math.PI/2;disc.position.set(o.X,.04,0);disc.scale.setScalar(.01);keep(disc);sfx("charge");await A(.5,p=>disc.scale.setScalar(.01+eOut(p)*1.7));
   put(f,o.X,-3.4);f.grounded=false;pose(f,"idle",20);
   await A(1.2,p=>{f.root.position.y=-3.4*(1-eOut(p));if(Math.random()<.6*QF)dust(o.X+rnd(-1.2,1.2),0,1,0x2a1a40)});f.grounded=true;
   camNear(f,o);await A(.4,p=>disc.scale.setScalar(1.7*(1-p)));glow(o.X+o.d*.12,3.05*f.sc,0xc8a2ff,1.2,.6);await finishPose(f)},
 async mika(f,o){camWide(o);camSnap();let x=o.s*9;put(f,x);
   for(let i=0;i<3;i++){const nx=lerp(o.s*9,o.X,(i+1)/3);sfx("jump");f.grounded=false;pose(f,"air",30);
     await A(.42,p=>{f.root.position.x=lerp(x,nx,p);f.root.position.y=Math.sin(p*Math.PI)*1.3;f.piv.rotation.z=-o.d*Math.PI*2*p});f.piv.rotation.z=0;f.root.position.y=0;x=nx;dust(x,0,3)}
   f.grounded=true;landFx(f,o.c);camNear(f,o);sparks(o.X,2,0,16,[o.c,0xffc21a],6);await finishPose(f)},
 async drako(f,o){camAt(o.X+o.d*1.5,4,10,o.X,3.4,3);camSnap();const sx=o.X+o.s*3.5;put(f,sx,10);f.grounded=false;pose(f,"air",20);sfx("whoosh");
   await A(1.1,p=>{f.root.position.set(lerp(sx,o.X,eOut(p)),10*(1-eOut(p)),0);CAM.tl.y=lerp(5,2.2,p)});f.root.position.y=0;f.grounded=true;
   pillar(o.X,0xff5a1a,1.2,7,.6);sparks(o.X,1,0,24,[0xff5a1a,0xffe14d],8);landFx(f,o.c,1);camNear(f,o);pose(f,"lift",30);await A(.3);await finishPose(f)},
 async oni(f,o){camMid(o,4);camSnap();for(let i=0;i<3;i++){sfx("slam");CAM.shake=.3;ring(o.X,.06,-2,o.c,3+i,.4);await A(.32)}
   put(f,o.X+o.s*1,0,-9);sfx("jump");camAt(o.X+o.d*1.5,4,10,o.X,2.5,4);await arc(f,o.X+o.s*1,0,-9,o.X,0,0,6,.9,0,"skyfall");
   landFx(f,o.c,1);sparks(o.X,.5,0,20,[0x8a6a4a,0xffc21a],8);camNear(f,o);say(f,"HA! HA! HA!","HA! HA! HA!",hex(o.c));await finishPose(f)},
 async seraph(f,o){camAt(o.X+o.d*1.2,3.6,9.5,o.X,3.2,3);camSnap();shaft(o.X,0xffffff,1.4,2.2);put(f,o.X,7);f.grounded=false;pose(f,"win",20);sfx("ok");
   drift(o.X,4,0,[0xffe98a,0xffc21a],30,2.2,2,-1.1,1.2);await A(1.6,p=>{f.root.position.y=7*(1-eOut(p));CAM.tl.y=lerp(5,2.3,p)});f.grounded=true;
   ring(o.X,.06,0,o.c,3,.6);camNear(f,o);await finishPose(f)},
 async kaiser(f,o){camMid(o,4);camSnap();const h=new THREE.Group();h.add(new THREE.Mesh(gS(1,24,16),bmat(0x05040a)));const r=new THREE.Mesh(gT(1.45,.07,8,40),addMat(o.c,.9));r.rotation.x=1.2;h.add(r);
   h.position.set(o.X,2.2,-1.8);h.scale.setScalar(.01);keep(h);sfx("charge");await A(.6,p=>{h.scale.setScalar(.01+eOut(p)*1.6);r.rotation.z+=.2});
   put(f,o.X,0,-1.8);f.run=true;pose(f,"run",30);await A(.9,p=>{f.root.position.z=lerp(-1.8,0,p);r.rotation.z+=.2});f.run=false;
   camNear(f,o);await A(.5,p=>{h.scale.setScalar(1.6*(1-p));r.rotation.z+=.3});h.visible=false;sfx("boom");glow(o.X,2.2,o.c,6,.4,-1.8);await finishPose(f)},
 async magus(f,o){camMid(o,4);camSnap();const sy=["7","×","π","÷","∑","√","=","+","∞","%"].map((t,i)=>{const m=txt(t,i%2?"#3dffd0":"#ffc21a",1.2);m.userData={a:i*.63,r:5,y:rnd(.5,4)};return keep(m)});sfx("charge");
   await A(1.3,p=>{for(const m of sy){const u=m.userData;u.a+=.08;const r=u.r*(1-eIn(p));m.position.set(o.X+Math.cos(u.a)*r,lerp(u.y,2,p),Math.sin(u.a)*r*.5)}});
   for(const m of sy)m.visible=false;impactFrame(80);flash(o.c);sfx("zap");put(f,o.X);pose(f,"win",40);burstLines(o.X,2,o.c,14,3);camNear(f,o);await finishPose(f)},

 /* ===== Zweite Outfits ===== */
 async raiko2(f,o){camWide(o);camSnap();const ice=new THREE.Mesh(gB(10,.04,1.6),new THREE.MeshToonMaterial({gradientMap:GRAD,color:0xcfeeff,emissive:0x1a3a4a,transparent:true,opacity:.85}));
   ice.position.set((o.s*10+o.X)/2,.03,0);ice.scale.x=.01;keep(ice);drift(o.X+o.s*3,6,0,0xffffff,50,6,2.6,-1.5,.7);sfx("glass");
   await A(.4,p=>ice.scale.x=eOut(p));put(f,o.s*10);pose(f,"slide",30);sfx("whoosh");
   await A(1,p=>{f.root.position.x=lerp(o.s*10,o.X,eOut(p));if(Math.random()<.6*QF)sparks(f.root.position.x,.3,0,2,[0xffffff,0xbfe8ff],4)});
   camNear(f,o);pose(f,"idle",30);await A(.4,p=>f.turn.rotation.y=FACE+p*Math.PI*2);f.turn.rotation.y=FACE;sparks(o.X,.5,0,16,[0xffffff,0x9fe0ff],6);await finishPose(f)},
 async akane2(f,o){camMid(o,4);camSnap();const g=new THREE.Group();g.position.x=o.X;keep(g);const pv=[];
   for(let i=0;i<8;i++){const a=i/8*6.283,q=new THREE.Group();q.rotation.y=a;const s=new THREE.Group();s.position.z=.35;q.add(s);const m=M(gS(.9,12,8),i%2?0x15131a:0x2a1c22,[0,1.4,.35],s);m.scale.set(.6,1.6,.18);g.add(q);pv.push(s)}
   put(f,o.X);pose(f,"charge",20);g.scale.setScalar(.01);sfx("charge");await A(.6,p=>g.scale.setScalar(.01+eOut(p)));
   sfx("whoosh");await A(.8,p=>{for(const s of pv)s.rotation.x=eOut(p)*1.25;if(Math.random()<.6*QF)sparks(o.X+rnd(-.8,.8),rnd(.5,3),0,2,[0xffc21a,0xffe14d],3)});
   camNear(f,o);glow(o.X,2,0xffc21a,4,.5);await finishPose(f);await A(.3,p=>g.scale.setScalar(1-p))},
 async rokka2(f,o){camWide(o);camSnap();const cx=o.X+o.s*4.2,cn=prop("cannon",o.s*11,0,1.2,o.d*1.57);sfx("wood");
   await A(.6,p=>cn.position.x=lerp(o.s*11,cx,eOut(p)));await A(.25);sfx("boom");impactFrame(60);glow(cx+o.d*1.2,1,0xff8a00,5,.4);dust(cx+o.d*1.2,0,10,0x666670);CAM.shake=.4;
   put(f,cx+o.d*1.1,.9);await arc(f,cx+o.d*1.1,.9,0,o.X,0,0,3.2,.8,1,"air");landFx(f,o.c);camNear(f,o);say(f,"Zu Befehl!","Aye aye!");await finishPose(f)},
 async zeno2(f,o){camAt(o.X+o.d*.6,2.6,7,o.X,2.4,6);camSnap();
   const cm=new THREE.MeshToonMaterial({gradientMap:GRAD,map:ctex(256,256,g=>{g.fillStyle="#a8141e";g.fillRect(0,0,256,256);for(let x=0;x<256;x+=32){const gr=g.createLinearGradient(x,0,x+32,0);gr.addColorStop(0,"rgba(0,0,0,.35)");gr.addColorStop(.5,"rgba(255,255,255,.12)");gr.addColorStop(1,"rgba(0,0,0,.35)");g.fillStyle=gr;g.fillRect(x,0,32,256)}g.fillStyle="#ffc21a";g.fillRect(0,236,256,20)})});
   const cl=[-1,1].map(s=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(4.2,8),cm);m.position.set(o.X+s*2.1,3.6,2.2);return keep(m)});
   put(f,o.X);pose(f,"idle",20);for(let i=0;i<8;i++){sfx("key");await A(.1)}sfx("gong");
   await A(.7,p=>{cl[0].position.x=o.X-2.1-eOut(p)*4.4;cl[1].position.x=o.X+2.1+eOut(p)*4.4});shaft(o.X,0xffffff,1.4,1.6);pose(f,"win",30);
   for(let i=0;i<6;i++){const m=new THREE.Mesh(gB(.3,.12,.2),bmat(0xffffff)),vx=rnd(-2,2);m.position.set(o.X,3.4,.3);fxAdd(m,1.4,(m,p,dt)=>{m.position.x+=vx*dt;m.position.y+=3*dt;m.scale.y=1+Math.sin(p*40)*.6},1)}
   say(f,"Applaus, bitte!","Applause, please!",hex(o.c));camNear(f,o);await finishPose(f)},
 async tetsu2(f,o){camWide(o);camSnap();const bn=[-1,1].map(s=>{const g=new THREE.Group();M(gC(.07,.07,5,8),0x2a1c22,[0,2.5,0],g,1);const fl=M(gB(1,2.8,.05),0x8a1a22,[.55,3.3,0],g,1);M(gC(.25,.25,.06,12),0xffc21a,[.55,3.6,.04],g,0).rotation.x=Math.PI/2;g.position.set(o.X+s*2.8,-6,-1.6);return keep(g)});
   await A(.5,p=>bn.forEach(g=>g.position.y=-6*(1-eOut(p))));put(f,o.s*9);
   for(let i=0;i<4;i++){sfx("slam");CAM.shake=.25;dust(f.root.position.x,0,4);await strut(f,lerp(o.s*9,o.X,i/4),lerp(o.s*9,o.X,(i+1)/4),.42)}
   pose(f,"idle",20);camNear(f,o);await A(.3);pose(f,"cross",30);sfx("whoosh");await finishPose(f)},
 async volt2(f,o){camMid(o,4);camSnap();const arms=[-1,1].map(s=>prop("robotarm",o.X+s*1.7,-.8,1,s>0?Math.PI:0));put(f,o.X);pose(f,"win",60);f.model.scale.set(f.ms,f.ms*.01,f.ms);
   await A(1.4,p=>{f.model.scale.set(f.ms,f.ms*Math.max(.01,p),f.ms);const y=3.4*p*f.sc;if(Math.random()<.8)sparks(o.X+(Math.random()<.5?-.5:.5),y,.3,2,[0xff8a00,0xffffff,0xffe14d],4);if(Math.random()<.15)sfx("metal");arms.forEach((a,i)=>a.rotation.z=Math.sin(p*30+i)*.08)});
   f.model.scale.setScalar(f.ms);impactFrame(60);glow(o.X,2,0xffc21a,6,.5);burstLines(o.X,2,0xffc21a,14,3);sfx("unlock");camNear(f,o);say(f,"Upgrade fertig.","Upgrade complete.","#ffc21a");await finishPose(f)},
 async luna2(f,o){camAt(o.X+o.d*1.2,3.6,9.5,o.X,3.4,3);camSnap();const sun=new THREE.Group();sun.add(M(gS(1.6,24,16),0xffd27a,[0,0,0],null,0,0xffa020));const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xffc040,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.setScalar(9);sun.add(gl);
   sun.position.set(o.X,-3,-6);keep(sun);sfx("charge");await A(.9,p=>sun.position.y=lerp(-3,7,eOut(p)));
   shaft(o.X,0xffc21a,2,2.2);put(f,o.X,6.5);f.grounded=false;pose(f,"win",20);aura(f,0xffc21a,1.6);
   await A(1.4,p=>{f.root.position.y=6.5*(1-eOut(p));CAM.tl.y=lerp(4.6,2.3,p)});f.grounded=true;ring(o.X,.06,0,0xffc21a,3,.6);camNear(f,o);await finishPose(f)},
 async goro2(f,o){camWide(o);camSnap();await strut(f,o.s*9,o.X,1.2);pose(f,"lift",30);sfx("paper");sparks(o.X,3.6,0,26,[0xffffff,0xf4f0e6],7);camNear(f,o);await A(.5);
   for(let i=0;i<2;i++){pose(f,"kickCh",40);await A(.25);pose(f,"crouch",50);landFx(f,o.c,1);const ps=props.filter(q=>q.alive);fxAdd(new THREE.Group(),.45,(m,p)=>{for(const q of ps)q.g.position.y=Math.sin(p*Math.PI)*.5},1);await A(.4)}
   for(const q of props)if(q.alive)q.g.position.y=0;say(f,"Dosukoi!","Dosukoi!",hex(o.c));await finishPose(f)},
 async shade2(f,o){camMid(o,4);camSnap();const gh=[];for(let i=0;i<4;i++){const m=new THREE.Mesh(gS(.5,12,10),addMat(0xd6222c,.7));m.scale.set(.9,3.2,.5);const sx=(i%2?1:-1)*rnd(5,8),sz=rnd(-2,1);m.position.set(o.X+sx,1.6,sz);m.userData={sx,sz};gh.push(keep(m))}
   sfx("whoosh");await A(1,p=>{for(const m of gh){const u=m.userData;m.position.x=o.X+u.sx*(1-eIn(p))+Math.sin(p*12+u.sx)*.6*(1-p);m.position.z=u.sz*(1-p);m.material.opacity=.7*(1-p*.3)}});
   gh.forEach(m=>m.visible=false);impactFrame(70);flash(0xd6222c);put(f,o.X);pose(f,"win",50);camNear(f,o);
   for(const s of[-1,1])glow(o.X+o.d*.1+s*.09,3.05*f.sc,0xffe14d,.9,.8);sfx("zap");await finishPose(f)},
 async mika2(f,o){camWide(o);camSnap();const seg=[],H=new THREE.Group();M(gB(1,.8,.9),0xd6222c,[0,0,0],H,1);for(const s of[-1,1]){M(gK(.1,.5,6),0xffc21a,[s*.25,.6,-.1],H,0);M(gS(.12,8,6),0xffffff,[s*.3,.15,.46],H,0)}
   H.add(M(gB(.9,.25,.5),0xffc21a,[.3,-.35,.2],null,0));keep(H);for(let i=0;i<12;i++)seg.push(keep(M(gS(.42,12,8),i%2?0xffc21a:0xd6222c)));const hist=[];
   sfx("gong");await A(1.8,p=>{const x=lerp(o.s*12,o.X,eOut(p)),y=1.4+Math.sin(p*14)*.6,z=Math.cos(p*9)*.6;H.position.set(x,y,z);H.rotation.y=o.d>0?0:Math.PI;hist.unshift([x,y,z]);
     seg.forEach((m,i)=>{const h=hist[Math.min(hist.length-1,(i+1)*3)];m.position.set(h[0],h[1],h[2])})});
   put(f,o.X,1.4);await arc(f,o.X,1.4,0,o.X,0,0,2.4,.6,1,"air");landFx(f,o.c);
   H.visible=false;seg.forEach(m=>m.visible=false);camNear(f,o);
   for(let i=0;i<4;i++){const x=o.X+rnd(-3,3),y=rnd(4.5,6.5);sparks(x,y,-1,22,[0xff3b5c,0xffc21a,0x3fe06b,0x25d4ff],8);glow(x,y,P([0xffc21a,0xff3b5c,0x25d4ff]),3,.5,-1);sfx("boom");await A(.18)}
   await finishPose(f,.4)},
 async drako2(f,o){camWide(o);camSnap();const blk=new THREE.Mesh(gB(1.9,3.9,1.5),new THREE.MeshToonMaterial({gradientMap:GRAD,color:0x9fdcff,transparent:true,opacity:.6}));keep(blk);put(f,o.s*10);pose(f,"charge",50);sfx("glass");
   await A(1,p=>{const x=lerp(o.s*10,o.X,eOut(p));blk.position.set(x,1.95,0);f.root.position.x=x;if(Math.random()<.4*QF)sparks(x,.2,0,2,[0xffffff,0xbfe8ff],4)});
   camNear(f,o);for(let i=0;i<2;i++){sfx("glass");CAM.shake=.2;await A(.3)}blk.visible=false;
   for(let i=0;i<12;i++){const m=new THREE.Mesh(gB(rnd(.3,.6),rnd(.3,.7),rnd(.2,.5)),new THREE.MeshToonMaterial({gradientMap:GRAD,color:0x9fdcff,transparent:true,opacity:.7}));m.position.set(o.X+rnd(-.8,.8),rnd(.3,3.6),rnd(-.6,.6));fling(m,new THREE.Vector3(rnd(-6,6),rnd(2,8),rnd(-2,4)),1.6)}
   dust(o.X,0,14,0xeaf6ff);pose(f,"win",40);sfx("heavy");await finishPose(f)},
 async oni2(f,o){camMid(o,4);camSnap();const h0=hemi.intensity;hemi.intensity*=.45;
   for(let i=0;i<3;i++){bolt(o.X+rnd(-2,2),0x9fd0ff,12,0);sfx("zap");flashLight(0x9fd0ff,6,o.X,4);await A(.25)}
   bolt(o.X,0xffffff,14,0);bolt(o.X,o.c,14,0);impactFrame(80);put(f,o.X);pose(f,"lift",40);sfx("boom");camNear(f,o);hemi.intensity=h0;await A(.45);
   pose(f,"hurl",50);landFx(f,o.c,1);ring(o.X+o.d*1.2,.06,0,0x9fd0ff,4,.5);await finishPose(f)},
 async seraph2(f,o){camAt(o.X+o.d*1.2,3.8,10,o.X,3.4,3);camSnap();const g=swarm(o.X,[0x15131a,0x2a1c3a,0x0b0912],50,gB(.16,.05,.3));
   put(f,o.X,12);f.grounded=false;pose(f,"skyfall",20);sfx("whoosh");
   await A(.6,p=>{f.root.position.y=lerp(12,1.4,eIn(p));stepSwarm(g,0,dtw())});dtw();pose(f,"air",20);
   await A(.7,p=>{f.root.position.y=1.4*(1-eOut(p));stepSwarm(g,p,dtw())});f.grounded=true;g.visible=false;ring(o.X,.06,0,0xff2a4a,3.5,.6);glow(o.X,2,0xff2a4a,4,.5);
   camNear(f,o);drift(o.X,3.5,0,[0x15131a,0x2a1c3a],18,2,1.6,-1,1.2);await finishPose(f)},
 async kaiser2(f,o){camWide(o);camSnap();const L0=Math.abs(o.s*10-o.X),cp=new THREE.Mesh(gB(1,.03,1.5),new THREE.MeshToonMaterial({gradientMap:GRAD,color:0xf4f0e6}));keep(cp);
   const roll=keep(M(gC(.25,.25,1.5,12),0xf4f0e6));roll.rotation.x=Math.PI/2;sfx("unlock");
   await A(.7,p=>{const len=L0*eOut(p);cp.scale.x=Math.max(.01,len);cp.position.set(o.s*10-o.s*len/2,.03,0);roll.position.set(o.s*10-o.s*len,.25,0);roll.rotation.y+=.3});roll.visible=false;
   drift(o.X,5,0,[0xffc21a,0xffe98a],40,4,2.4,-1.2,.7);await strut(f,o.s*10,o.X,1.4);camNear(f,o);await finishPose(f)},
 async magus2(f,o){camMid(o,4);camSnap();const bd=prop("board",o.s*9,.9,2.3);put(f,o.X);pose(f,"idle",20);
   await A(.6,p=>bd.position.x=lerp(o.s*9,o.X,eOut(p)));for(let i=0;i<4;i++){sfx("paper");dust(o.X+rnd(-1,1),.9,1,0xffffff);await A(.18)}
   await A(.5,p=>{bd.rotation.x=eIn(p)*1.5;bd.position.y=-p*.6});bd.visible=false;sfx("land");dust(o.X,1.2,10,0xffffff);
   camNear(f,o);pose(f,"win",30);dust(o.X+o.d*.8,3.2,6,0xffffff);say(f,"Hmhm. Korrekt.","Hm-hm. Correct.","#f4f0e6");await finishPose(f)},
};
/* ein Auftritt: Band, Szene, Pose. Bei Fehlern oder Überspringen steht die Figur trotzdem sauber an ihrem Platz. */
async function walkIn(f){const key=f.ch.id+(f.ch.o?"2":""),fn=WALK[key]||WALK[f.ch.id];f.ms=f.ms||f.model.scale.x;
  const o={s:f.side,d:-f.side,X:f.hx,c:f.ch.c};
  cutIn(f,f.ch.n,f.ch.o&&f.ch.alt?L(f.ch.alt.on[0],f.ch.alt.on[1]):f.ch.ti);dtw();
  try{await fn(f,o)}catch(e){if(e!==WI.CANCEL)console.error(e)}
  clearTemp();settle(f);pose(f,"idle",12)}
/* beide Auftritte vor dem ersten Kampf. Tippen überspringt. */
async function intro(){const id=++WI.id;WI.active=true;const vo={x:VO.x,y:VO.y,fw:VO.fw,fh:VO.fh};VO.x=VO.y=0;VO.fw=VO.fh=1;applyOff();
  document.body.classList.add("cine","intro");CAM.mode="cine";pl.root.visible=en.root.visible=false;
  for(const f of[pl,en]){if(WI.id!==id)break;await walkIn(f)}
  WI.active=false;$("#cut").className="";clearTemp();for(const f of[pl,en]){settle(f);pose(f,"idle",12)}
  document.body.classList.remove("cine","intro");Object.assign(VO,vo);layout();CAM.mode="fight";CAM.k=4}
function skipIntro(){if(!WI.active)return;WI.id++;for(const stop of WI.wait)stop();WI.wait.clear();$("#cut").className="";sfx("pick")}
document.addEventListener("pointerdown",e=>{if(WI.active&&!e.target.closest("#snd"))skipIntro()},true);
addEventListener("keydown",e=>{if(WI.active&&(e.key==" "||e.key=="Enter"||e.key=="Escape"))skipIntro()});
