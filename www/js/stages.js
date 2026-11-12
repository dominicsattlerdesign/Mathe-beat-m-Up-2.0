/* ---------- Stages: gemalte Hintergründe, 3D-Kulissen, zerstörbare Objekte ---------- */
const stage=new THREE.Group();sc.add(stage);
const tiles=[],props=[],STL={c:[0xff5a1a,0x25d4ff]};let ambient=null,STc=null;
const TW=1.2,NX=14,NZ=5;
const WOOD=0x8a5a30,WOODD=0x5c3a1e,STONE=0x8d8a98,IRON=0x3a3e4c,GOLD=0xffc21a,PAPER=0xf4ead0;
const SHARD={wood:[0x8a5a30,0x5c3a1e,0xb07a44],stone:[0x8d8a98,0x6a6776,0xb0aebc],glass:[0xbfe8ff,0xffffff,0x7fd0ff],metal:[0x3a3e4c,0x8a94a8,0xffc21a],paper:[0xf4ead0,0xffffff,0xff8a5a],bone:[0xe8dcc0,0xc8bc9c],crystal:[0xff5a1a,0xffc21a,0xffffff]};
/* Jedes Objekt: Gruppe aus Einzelteilen, die beim Zerbrechen auseinanderfliegen */
const PROP={
  barrel(g){M(gC(.42,.36,.9,10),WOOD,[0,.45,0],g);M(gC(.44,.44,.07,10),IRON,[0,.72,0],g,0);M(gC(.41,.41,.07,10),IRON,[0,.2,0],g,0);M(gC(.36,.36,.04,10),WOODD,[0,.91,0],g,0);return"wood"},
  crate(g){M(gB(.85,.85,.85),WOOD,[0,.43,0],g);for(const s of[-1,1]){M(gB(.9,.1,.9),WOODD,[0,.43+s*.38,0],g,0);M(gB(.1,.9,.1),WOODD,[s*.4,.43,.4],g,0)}const d=M(gB(.1,1.05,.03),WOODD,[0,.43,.44],g,0);d.rotation.z=.78;return"wood"},
  crates(g){PROP.crate(g);const t=new THREE.Group();PROP.crate(t);t.scale.setScalar(.7);t.position.set(.08,.85,0);t.rotation.y=.4;while(t.children.length){const c=t.children[0];c.position.multiplyScalar(.7).add(t.position);c.scale.multiplyScalar(.7);g.add(c)}return"wood"},
  dummy(g){M(gC(.3,.36,.12,8),WOODD,[0,.06,0],g);M(gC(.1,.1,1.5,8),WOOD,[0,.85,0],g);M(gC(.2,.22,.7,8),0xc9a26a,[0,1.3,0],g);M(gS(.2),0xc9a26a,[0,1.9,0],g);M(gC(.05,.05,1.1,6),WOOD,[0,1.45,0],g).rotation.z=Math.PI/2;M(gB(.3,.08,.02),0xc81e2e,[0,1.3,.22],g,0);return"wood"},
  lantern(g){M(gC(.05,.07,2,6),WOODD,[0,1,0],g);M(gB(.6,.06,.06),WOODD,[.25,1.95,0],g,0);M(gC(.2,.2,.08,8),0x15131a,[.5,1.82,0],g,0);M(gS(.26,10,8),0xff7a3a,[.5,1.55,0],g,1,0xff5a1a).scale.y=1.25;M(gC(.2,.2,.08,8),0x15131a,[.5,1.25,0],g,0);return"paper"},
  shoji(g){for(const s of[-1,1])M(gB(.08,2,.08),WOODD,[s*.75,1,0],g);M(gB(1.6,.08,.08),WOODD,[0,2,0],g);M(gB(1.6,.08,.08),WOODD,[0,.1,0],g);for(let i=0;i<2;i++)for(let j=0;j<3;j++)M(gB(.7,.58,.02),PAPER,[-.36+i*.72,.42+j*.62,0],g,0,0x4a4030);return"paper"},
  vase(g){M(gC(.2,.14,.2,10),0x2a5fa8,[0,.1,0],g);M(gS(.32,10,8),0xeaf2ff,[0,.5,0],g).scale.y=1.15;M(gC(.12,.2,.25,10),0x2a5fa8,[0,.9,0],g);M(gC(.17,.12,.06,10),0xeaf2ff,[0,1.05,0],g,0);return"glass"},
  taiko(g){for(const s of[-1,1]){M(gB(.08,1,.08),WOODD,[s*.5,.5,.3],g).rotation.z=s*.2;M(gB(.08,1,.08),WOODD,[s*.5,.5,-.3],g).rotation.z=s*.2}const d=M(gC(.6,.6,.7,12),0x8a1a22,[0,1.2,0],g);d.rotation.x=Math.PI/2;const f=M(gC(.56,.56,.72,12),PAPER,[0,1.2,0],g,0);f.rotation.x=Math.PI/2;return"wood"},
  bamboo(g){for(let i=0;i<5;i++)M(gC(.07,.07,1.3+((i*7)%3)*.2,6),0x6a9a3a,[-.6+i*.3,.7,0],g);for(const y of[.4,1])M(gB(1.5,.07,.05),WOODD,[0,y,.07],g,0);return"wood"},
  wheel(g){M(gC(.09,.12,1.1,6),WOODD,[0,.55,0],g);M(gT(.5,.06,6,16),WOOD,[0,1.4,.1],g);for(let i=0;i<4;i++){const s=M(gB(1.3,.06,.06),WOODD,[0,1.4,.1],g,0);s.rotation.z=i*.785}M(gS(.1),GOLD,[0,1.4,.16],g,0);return"wood"},
  cannon(g){M(gB(.7,.3,1.1),WOODD,[0,.3,0],g);for(const s of[-1,1]){const w=M(gC(.3,.3,.1,10),WOOD,[s*.42,.3,.2],g);w.rotation.z=Math.PI/2}const b=M(gC(.2,.26,1.5,10),IRON,[0,.62,.25],g);b.rotation.x=Math.PI/2-.15;M(gT(.22,.05,6,10),0x8a94a8,[0,.72,.95],g,0);return"metal"},
  balls(g){for(const p of[[-.2,.18,-.12],[.2,.18,-.12],[0,.18,.2],[0,.5,0]])M(gS(.2,10,8),0x23262f,p,g);return"metal"},
  bottles(g){M(gB(.9,.08,.4),WOOD,[0,.6,0],g);for(const s of[-1,1])M(gB(.08,.6,.4),WOODD,[s*.4,.3,0],g,0);for(let i=0;i<3;i++){M(gC(.09,.09,.3,8),[0x2a8a4a,0x8a4a1a,0x2a5fa8][i],[-.28+i*.28,.8,0],g);M(gC(.035,.05,.16,6),[0x2a8a4a,0x8a4a1a,0x2a5fa8][i],[-.28+i*.28,1.02,0],g,0)}return"glass"},
  anchor(g){M(gC(.06,.06,1.5,6),IRON,[0,.85,0],g);M(gT(.16,.04,6,10),IRON,[0,1.7,0],g,0);M(gB(.7,.08,.08),IRON,[0,1.35,0],g);M(gT(.5,.07,6,12,3.14),IRON,[0,.55,0],g).rotation.z=Math.PI;return"metal"},
  slantern(g){M(gB(.6,.16,.6),STONE,[0,.08,0],g);M(gC(.13,.16,.8,6),STONE,[0,.55,0],g);M(gB(.5,.1,.5),STONE,[0,1,0],g);M(gB(.36,.34,.36),0xffe08a,[0,1.22,0],g,1,0xffa030);M(gK(.46,.3,4),0x6a6776,[0,1.54,0],g).rotation.y=.785;M(gS(.08),STONE,[0,1.72,0],g,0);return"stone"},
  umbrella(g){M(gC(.03,.03,1.9,6),WOODD,[0,.95,0],g);M(gK(.85,.32,12),0xc81e2e,[0,1.95,0],g);M(gC(.87,.87,.03,12),0xf4ead0,[0,1.8,0],g,0);return"paper"},
  target(g){for(const s of[-1,1])M(gB(.07,1.6,.07),WOODD,[s*.3,.8,-.1],g).rotation.x=-.2;const t=M(gC(.5,.5,.08,14),PAPER,[0,1.4,.05],g);t.rotation.x=Math.PI/2;const r=M(gC(.32,.32,.09,14),0xc81e2e,[0,1.4,.06],g,0);r.rotation.x=Math.PI/2;const c=M(gC(.12,.12,.1,10),PAPER,[0,1.4,.07],g,0);c.rotation.x=Math.PI/2;return"wood"},
  bell(g){for(const s of[-1,1])M(gB(.1,1.9,.1),0x8a1a22,[s*.6,.95,0],g);M(gB(1.5,.12,.14),0x8a1a22,[0,1.92,0],g);M(gC(.2,.36,.6,10),0xb08a2a,[0,1.4,0],g);M(gS(.09),0xb08a2a,[0,1.06,0],g,0);return"metal"},
  pillar(g){M(gB(.8,.2,.8),0xcfcad8,[0,.1,0],g);for(let i=0;i<4;i++)M(gC(.28,.3,.62,10),0xdedae6,[0,.5+i*.62,0],g);M(gB(.8,.18,.8),0xcfcad8,[0,2.78,0],g);return"stone"},
  statue(g){M(gB(.8,.6,.8),0x8d8a98,[0,.3,0],g);M(gC(.2,.26,.8,8),0xb0aebc,[0,1,0],g);M(gS(.19),0xb0aebc,[0,1.6,0],g);const a=M(gC(.07,.07,.7,6),0xb0aebc,[.3,1.5,0],g);a.rotation.z=-.9;M(gB(.05,.9,.1),0xdfe7f2,[.62,2,0],g);return"stone"},
  urn(g){M(gC(.18,.24,.14,10),0x8a4a2a,[0,.07,0],g);M(gS(.36,10,8),0xb86a3a,[0,.52,0],g).scale.y=1.2;M(gC(.2,.16,.2,10),0x8a4a2a,[0,1,0],g);for(const s of[-1,1])M(gT(.12,.03,5,8,3.14),0x8a4a2a,[s*.3,.8,0],g,0).rotation.z=-s*Math.PI/2;return"glass"},
  rack(g){for(const s of[-1,1])M(gB(.08,1.5,.4),WOODD,[s*.7,.75,0],g);M(gB(1.5,.08,.08),WOODD,[0,1.3,0],g);M(gB(1.5,.08,.08),WOODD,[0,.5,0],g);for(let i=0;i<3;i++){M(gC(.03,.03,2.2,5),WOOD,[-.4+i*.4,1.2,.12],g).rotation.x=-.12;M(gK(.07,.3,4),0xdfe7f2,[-.4+i*.4,2.4,-.02],g,0)}return"wood"},
  brazier(g){for(let i=0;i<3;i++){const l=M(gC(.04,.04,1,5),IRON,[Math.cos(i*2.09)*.25,.5,Math.sin(i*2.09)*.25],g);l.rotation.set(Math.sin(i*2.09)*.25,0,-Math.cos(i*2.09)*.25)}M(gC(.45,.2,.3,10),IRON,[0,1.1,0],g);M(gK(.3,.7,6),0xff7a1a,[0,1.6,0],g,0,0xff5a00);M(gK(.17,.5,6),0xffe14d,[0,1.5,0],g,0,0xffc21a);return"metal"},
  shield(g){M(gB(.07,1.3,.07),WOODD,[0,.65,-.2],g).rotation.x=-.3;const s=M(gC(.55,.55,.08,14),0x8a1a22,[0,.8,0],g);s.rotation.x=Math.PI/2-.3;const b=M(gS(.16),GOLD,[0,.82,.08],g,0);b.scale.z=.5;return"metal"},
  crystal(g,c=0xff5a1a){M(gD(.4),0x2a2028,[0,.2,0],g);for(const[x,z,h,r]of[[0,0,1.5,.3],[.3,.1,.9,.2],[-.28,-.05,1.1,.22],[.05,.3,.6,.16]]){const m=M(gK(r,h,5),c,[x,h/2+.1,z],g,1,c);m.rotation.z=-x*.9;m.rotation.x=z*.9}return"crystal"},
  rock(g){M(gD(.6),0x4a3f44,[0,.45,0],g).rotation.set(.4,.3,0);M(gD(.36),0x5a4d52,[.55,.26,.2],g);M(gD(.28),0x3a3136,[-.5,.2,-.1],g);M(gD(.22),0x5a4d52,[-.1,.95,0],g);return"stone"},
  skull(g){const s=M(gS(.42,10,8),0xd8ccae,[0,.5,-.1],g);s.scale.set(1,.8,1.2);const j=M(gB(.4,.26,.9),0xc8bc9c,[0,.36,.62],g);j.rotation.x=.12;M(gB(.34,.1,.8),0xb0a484,[0,.1,.55],g);for(const s of[-1,1]){const h=M(gK(.1,.9,6),0xe8dcc0,[s*.4,.95,-.5],g);h.rotation.set(-.9,0,-s*.35);const e=M(gB(.16,.07,.04),0x15131a,[s*.17,.6,.33],g,0,0xff3d00);e.rotation.z=s*.5}for(let i=0;i<6;i++)M(gK(.04,.16,4),0xffffff,[(i%2?1:-1)*.17,.19,.35+(i>>1)*.26],g,0).rotation.x=Math.PI;return"bone"},
  ribs(g){M(gC(.08,.08,2,6),0xe8dcc0,[0,.2,0],g).rotation.z=Math.PI/2;for(let i=0;i<4;i++){const r=M(gT(.6,.06,5,10,3.14),0xe8dcc0,[-.75+i*.5,.2,0],g);r.rotation.y=Math.PI/2}return"bone"},
  rune(g,c=0xff5a1a){M(gB(.9,.2,.5),0x3a3136,[0,.1,0],g);const s=M(gB(.7,1.7,.26),0x4a3f44,[0,1.05,0],g);s.rotation.z=.06;M(gB(.08,.9,.3),c,[0,1.1,0],g,0,c);M(gB(.4,.08,.3),c,[0,1.3,0],g,0,c);M(gB(.3,.08,.3),c,[.05,.85,0],g,0,c);return"stone"},
  chainpost(g){M(gC(.14,.18,1.6,6),IRON,[0,.8,0],g);M(gK(.2,.4,6),IRON,[0,1.8,0],g);for(let i=0;i<4;i++)M(gT(.09,.03,5,8),0x8a94a8,[.2+i*.16,1.3-i*.2,0],g,0).rotation.y=i%2*1.57;return"metal"},
};
/* Bonus-Stages: Objekte für Kinderzimmer, Spielhalle und Neon-Gasse */
const NBM={};function numMat(n,c){const k=n+"_"+c;return NBM[k]||(NBM[k]=new THREE.MeshToonMaterial({gradientMap:GRAD,map:ctex(128,128,g=>{g.fillStyle=hex(c);g.fillRect(0,0,128,128);g.strokeStyle="rgba(255,255,255,.55)";g.lineWidth=10;g.strokeRect(8,8,112,112);
  g.font='900 88px Bangers,"Bangers Local",Impact,"Arial Black",sans-serif';g.textAlign="center";g.textBaseline="middle";g.lineWidth=8;g.strokeStyle="#15131a";g.strokeText(n,64,70);g.fillStyle="#fff";g.fillText(n,64,70)})}))}
const KIDC=[0xff4f6d,0x2fa8ff,0xffc21a,0x3fd07a,0xa66bff,0xff8a2a];
function signTex(t,c,font=80){return ctex(512,160,g=>{g.font=`900 ${font}px Bangers,"Bangers Local",Impact,"Arial Black",sans-serif`;g.textAlign="center";g.textBaseline="middle";g.shadowColor=c;g.shadowBlur=24;g.lineWidth=6;g.strokeStyle=c;g.strokeText(t,256,84);g.shadowBlur=10;g.fillStyle="#ffffff";g.fillText(t,256,84)})}
/* Neon-Schild: leuchtende Schrift mit Halo, bleibt dauerhaft stehen */
function neon(t,c,x,y,z,w=4,ry=0,font){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.3125),new THREE.MeshBasicMaterial({map:signTex(t,hex(c),font),transparent:true,depthWrite:false,fog:false}));m.position.set(x,y,z);m.rotation.y=ry;stage.add(m);
  const h=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:c,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));h.scale.set(w*1.5,w*.8,1);h.position.set(x,y,z-.05);stage.add(h);NEONS.push({m,h,ph:rnd(6)});return m}
const NEONS=[];
Object.assign(PROP,{
  nblock(g,n){const v=n!=null?n:R(0,9),m=new THREE.Mesh(gB(.72,.72,.72),numMat(v,P(KIDC)));m.position.y=.36;m.rotation.y=rnd(-.4,.4);m.add(new THREE.Mesh(gB(.72,.72,.72),OL));m.castShadow=true;g.add(m);return"wood"},
  tower(g){for(let i=0;i<3;i++){const m=new THREE.Mesh(gB(.62,.62,.62),numMat(["1","+","2","=","3"][R(0,4)],KIDC[(i*2+R(0,1))%6]));m.position.set(rnd(-.06,.06),.31+i*.62,0);m.rotation.y=rnd(-.5,.5);m.add(new THREE.Mesh(gB(.62,.62,.62),OL));m.castShadow=true;g.add(m)}return"wood"},
  teddy(g){const B=0xa8743e;M(gS(.42),B,[0,.45,0],g).scale.set(1,1.1,.9);M(gS(.3),B,[0,1.05,0],g);for(const s of[-1,1]){M(gS(.12),B,[s*.22,1.3,0],g);M(gS(.14),B,[s*.36,.55,.12],g);M(gS(.16),B,[s*.2,.12,.18],g);M(gS(.04,8,6),0x15131a,[s*.1,1.1,.27],g,0)}M(gS(.11),0xe8c89a,[0,1,.24],g);M(gS(.045,8,6),0x15131a,[0,1.03,.33],g,0);M(gT(.12,.04,6,12),0xff4f6d,[0,.82,.12],g,0).rotation.x=1.2;return"paper"},
  toyball(g){const m=new THREE.Mesh(gS(.45,20,14),new THREE.MeshToonMaterial({gradientMap:GRAD,map:ctex(128,64,(c,w,h)=>{["#ff4f6d","#ffffff","#2fa8ff","#ffc21a"].forEach((col,i)=>{c.fillStyle=col;c.fillRect(i*w/4,0,w/4,h)})})}));m.position.y=.45;m.rotation.z=.4;m.add(new THREE.Mesh(gS(.45,20,14),OL));m.castShadow=true;g.add(m);return"paper"},
  toycar(g){const c=P(KIDC);M(gB(1.1,.32,.6),c,[0,.32,0],g);M(gB(.6,.28,.52),c,[-.08,.6,0],g);M(gB(.5,.22,.54),0xbfe8ff,[-.08,.6,0],g,0);for(const x of[-.35,.35])for(const z of[-.3,.3])M(gC(.16,.16,.1,14),0x15131a,[x,.16,z],g).rotation.x=Math.PI/2;return"metal"},
  crayons(g){for(let i=0;i<5;i++){const c=KIDC[i],m=M(gC(.09,.09,1,10),c,[-.36+i*.18,.5,0],g);M(gK(.09,.22,10),c,[-.36+i*.18,1.1,0],g);m.rotation.z=(i-2)*.05}M(gB(1.05,.5,.3),0xffc21a,[0,.25,.08],g);return"wood"},
  rocket(g){M(gC(.22,.26,1.1,14),0xf4f0e6,[0,.85,0],g);M(gK(.22,.45,14),0xff4f6d,[0,1.62,0],g);M(gC(.1,.1,.05,12),0x2fa8ff,[0,1,.22],g,0).rotation.x=Math.PI/2;for(let i=0;i<3;i++){const f=M(gB(.04,.4,.3),0xff4f6d,[Math.cos(i*2.09)*.25,.42,Math.sin(i*2.09)*.25],g);f.rotation.y=-i*2.09}return"metal"},
  books(g){for(let i=0;i<4;i++){const m=M(gB(.9-i*.06,.16,.62),KIDC[(i+2)%6],[rnd(-.05,.05),.08+i*.16,0],g);m.rotation.y=rnd(-.3,.3)}return"paper"},
  cabinet(g,c=0x2fa8ff){const B=0x1c1830;M(gB(1.2,2.4,1),B,[0,1.2,0],g,1,0,"metal");M(gB(1.1,.95,.1),0x05040a,[0,1.65,.45],g,0);M(gB(.95,.8,.05),c,[0,1.65,.5],g,0,c);M(gB(1.22,.42,1.04),c,[0,2.45,0],g,1,c);M(gB(1.2,.25,.55),B,[0,1.05,.6],g);
    M(gC(.03,.03,.22,8),0xcfd8e8,[-.25,1.28,.65],g,0);M(gS(.07,10,8),0xff3b2f,[-.25,1.4,.65],g,0);for(let i=0;i<3;i++)M(gC(.05,.05,.04,10),KIDC[i],[.05+i*.14,1.19,.68],g,0);return"glass"},
  claw(g){M(gB(1.3,.9,1.1),0xff4f6d,[0,.45,0],g,1,0,"metal");const gl=new THREE.Mesh(gB(1.2,1.3,1),new THREE.MeshToonMaterial({color:0xbfe8ff,transparent:true,opacity:.35,gradientMap:GRAD}));gl.position.y=1.55;g.add(gl);
    for(let i=0;i<6;i++)M(gS(.16,10,8),KIDC[i],[rnd(-.4,.4),1.05,rnd(-.3,.3)],g);M(gB(1.3,.25,1.1),0xffc21a,[0,2.3,0],g,1,0xaa7700);M(gC(.02,.02,.5,6),0xcfd8e8,[0,1.95,0],g,0);M(gS(.08,8,6),0xcfd8e8,[0,1.68,0],g,0);return"glass"},
  stool(g){M(gC(.3,.3,.12,16),0xff3b2f,[0,.92,0],g);M(gC(.05,.05,.85,8),0xcfd8e8,[0,.45,0],g,1,0,"metal");M(gC(.28,.32,.05,16),0x3a3e4c,[0,.03,0],g,1,0,"metal");return"metal"},
  soda(g){M(gB(1.1,2.2,.8),0xd6222c,[0,1.1,0],g,1,0,"metal");M(gB(.55,1.3,.05),0x15131a,[-.18,1.3,.41],g,0);for(let i=0;i<3;i++)for(let j=0;j<2;j++)M(gC(.06,.06,.18,8),KIDC[(i+j*3)%6],[-.32+j*.24,.9+i*.36,.42],g,0);M(gB(.3,.5,.05),0xf4f0e6,[.35,1.6,.41],g,0,0x888888);return"metal"},
  bin(g){M(gC(.34,.3,.9,14),0x3a4a3a,[0,.45,0],g,1,0,"metal");M(gC(.37,.37,.08,14),0x2a3a2a,[0,.92,0],g,1,0,"metal");M(gB(.2,.2,.05),0xf4f0e6,[.15,1,.1],g,0).rotation.set(.3,.4,.2);return"metal"},
  dumpster(g){M(gB(1.9,1.1,1),0x2f6a3a,[0,.6,0],g,1,0,"metal");M(gB(2,.12,1.1),0x245230,[0,1.2,-.05],g,1,0,"metal").rotation.x=-.2;for(const x of[-.75,.75])M(gC(.1,.1,.08,10),0x15131a,[x,.06,.4],g).rotation.x=Math.PI/2;M(gB(.5,.3,.02),0xffc21a,[0,.75,.51],g,0);return"metal"},
  cone(g){M(gB(.6,.06,.6),0xff6a1a,[0,.03,0],g);M(gK(.24,.8,12),0xff6a1a,[0,.45,0],g);M(gC(.15,.18,.12,12),0xf4f0e6,[0,.5,0],g,0);return"paper"},
  vend(g){M(gB(1.1,2.2,.8),0x2a4a8a,[0,1.1,0],g,1,0,"metal");M(gB(.8,1.2,.05),0xbfe8ff,[-.08,1.35,.41],g,0,0x3a6aaa);for(let i=0;i<3;i++)for(let j=0;j<3;j++)M(gB(.16,.22,.04),KIDC[(i*3+j)%6],[-.32+j*.24,.95+i*.38,.44],g,0);return"glass"},
  lamp(g){M(gC(.08,.12,3.6,10),0x2a2e3a,[0,1.8,0],g,1,0,"metal");M(gB(.9,.06,.06),0x2a2e3a,[.4,3.55,0],g,0);M(gC(.2,.3,.18,12),0x2a2e3a,[.82,3.45,0],g,0);M(gS(.14,10,8),0xffe9a0,[.82,3.34,0],g,0,0xffc040);return"glass"},
  cardstack(g){for(let i=0;i<3;i++){const m=M(gB(.7,1,.03),i%2?0x5a2ea6:0xf4f0e6,[(i-1)*.18,.5,-i*.05],g);m.rotation.set(-.08,0,(i-1)*.18)}M(gB(.5,.6,.05),0xcc2233,[0,.5,.04],g,0);return"paper"},
  dice(g){const m=M(gB(.6,.6,.6),0xf4f0e6,[0,.3,0],g);m.rotation.y=.5;for(const[x,y]of[[-.15,.15],[.15,-.15],[0,0]])M(gS(.06,8,6),0xcc2233,[x*Math.cos(.5)+.31*Math.sin(.5),.3+y,.31*Math.cos(.5)-x*Math.sin(.5)],g,0);return"wood"},
  chips(g){for(let k=0;k<3;k++)for(let i=0;i<4+k;i++)M(gC(.2,.2,.07,16),[0xcc2233,0x1c1a24,0x25a0d4][k],[-.45+k*.45,.04+i*.075,0],g,0);return"metal"},
  gear(g){const m=new THREE.Group();M(gC(.6,.6,.2,16),0x8a94a8,[0,0,0],m,1,0,"metal");for(let i=0;i<10;i++){const t=M(gB(.2,.25,.2),0x8a94a8,[Math.cos(i*.628)*.7,0,Math.sin(i*.628)*.7],m,1,0,"metal");t.rotation.y=-i*.628}M(gC(.18,.18,.24,12),0xffc21a,[0,0,0],m,0);m.rotation.x=Math.PI/2;m.position.y=.85;g.add(m);M(gB(.4,.12,.4),0x3a3e4c,[0,.06,0],g);return"metal"},
  robotarm(g){M(gC(.4,.5,.3,14),0xffc21a,[0,.15,0],g,1,0,"metal");const a=M(gB(.25,1.4,.25),0xffc21a,[.2,.95,0],g,1,0,"metal");a.rotation.z=-.3;const b=M(gB(.2,1,.2),0xffc21a,[.75,1.75,0],g,1,0,"metal");b.rotation.z=-1.2;M(gS(.16),0x3a3e4c,[.4,1.55,0],g);M(gB(.3,.2,.12),0x3a3e4c,[1.2,1.95,0],g);return"metal"},
  terminal(g){M(gB(.9,1.1,.6),0x3a4458,[0,.55,0],g,1,0,"metal");const sc_=M(gB(.7,.5,.05),0x25d4ff,[0,.85,.31],g,0,0x1a8ab0);sc_.rotation.x=-.25;for(let i=0;i<4;i++)M(gB(.1,.06,.05),KIDC[i],[-.24+i*.16,.4,.31],g,0);return"glass"},
  teatable(g){M(gB(1.2,.08,.8),0x6a3a1e,[0,.45,0],g,1,0,"wood");for(const x of[-.5,.5])for(const z of[-.3,.3])M(gB(.08,.42,.08),0x4a2a14,[x,.21,z],g,0,0,"wood");M(gS(.16,12,8),0x3fae7a,[-.2,.62,0],g).scale.y=.8;M(gC(.07,.06,.1,10),0xf4f0e6,[.15,.54,.1],g);M(gC(.07,.06,.1,10),0xf4f0e6,[.35,.54,-.1],g);return"wood"},
  board(g){for(const s of[-1,1]){const l=M(gB(.07,1.9,.07),0x6a4a2a,[s*.55,.9,0],g,1,0,"wood");l.rotation.z=s*.12}M(gB(1.4,1,.06),0x1f4a2a,[0,1.25,.05],g,1,0,"wood");
    const t=new THREE.Mesh(new THREE.PlaneGeometry(1.25,.85),new THREE.MeshBasicMaterial({map:ctex(256,170,c=>{c.fillStyle="#1f4a2a";c.fillRect(0,0,256,170);c.fillStyle="#f4f0e6";c.font="34px Chakra Petch,monospace";c.fillText(P(["7×8=56","a²+b²","(3+4)×2","π≈3,14","12÷3=4"]),18,60);c.fillText(P(["x=42","1+1=2","9×9=81","100−1"]),40,125)}),transparent:true}));t.position.set(0,1.25,.09);g.add(t);return"wood"},
  globe(g){M(gC(.25,.3,.08,14),0x6a4a2a,[0,.04,0],g,1,0,"wood");M(gC(.03,.03,.5,8),0xffc21a,[0,.3,0],g,0);M(gS(.36,18,12),0x2a7ab0,[0,.85,0],g);M(gT(.42,.03,6,20,3.4),0xffc21a,[0,.85,0],g,0).rotation.z=.4;return"glass"},
  pipes(g){for(let i=0;i<2;i++){M(gC(.12,.12,2.4,12),0x6a6f7c,[-.2+i*.35,1.2,0],g,1,0,"metal");M(gT(.18,.12,8,12,1.57),0x6a6f7c,[-.02+i*.35,2.4,0],g,0,0,"metal").rotation.z=Math.PI/2}M(gC(.16,.16,.1,10),0xffc21a,[-.2,1.4,0],g,0);return"metal"},
});
const PKIND={wood:"wood",stone:"stone",metal:"metal",bone:"stone",paper:"cloth"};
function addProp(type,x,z,s=1,ry=0,arg){const g=new THREE.Group();const m=PROP[type](g,arg),kd=PKIND[m];
  if(kd)for(const c of g.children){const mt=c.material;if(mt&&mt.isMeshToonMaterial&&!mt.map&&mt.emissive.getHex()==0)c.material=mat(mt.color.getHex(),0,kd)}g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=ry;stage.add(g);props.push({g,x,z,m,alive:true});return g}
function breakProp(p,dir=0,pw=1){
  if(!p.alive)return;p.alive=false;sfx(p.m=="crystal"?"glass":p.m=="bone"?"wood":p.m);
  p.g.updateMatrixWorld(true);const ch=p.g.children.slice();
  for(const c of ch){const wp=new THREE.Vector3(),wq=new THREE.Quaternion(),ws=new THREE.Vector3();c.matrixWorld.decompose(wp,wq,ws);p.g.remove(c);c.position.copy(wp);c.quaternion.copy(wq);c.scale.copy(ws);sc.add(c);
    debris.push({m:c,v:new THREE.Vector3(dir*rnd(2,6)*pw+rnd(-2,2),rnd(3,8)*pw,rnd(-2.5,1.5)),s:new THREE.Vector3(rnd(-7,7),rnd(-7,7),rnd(-7,7)),l:rnd(1.8,2.8),r:.18})}
  stage.remove(p.g);sparks(p.x,1,p.z,10,SHARD[p.m],5);dust(p.x,p.z,4);
}
function breakNear(x,r,dir=0,pw=1,max=9){let n=0;for(const p of props)if(p.alive&&Math.abs(p.x-x)<r&&n<max){breakProp(p,dir||Math.sign(p.x-x)||1,pw);n++}return n}
/* Bodenplatten: bekommen Risse, kippen und fliegen bei schweren Treffern heraus */
function crack(x,r,pw=0){for(const t of tiles){if(t.gone)continue;const dx=t.hx-x,d=Math.hypot(dx,t.hz*.6);if(d>r*(.6+Math.random()*.6))continue;
  if(pw>1&&d<r*.75&&Math.abs(t.hz)>.9&&Math.random()<.75){t.gone=true;stage.remove(t);sc.add(t);debris.push({m:t,v:new THREE.Vector3(dx*.8+rnd(-2,2),rnd(5,10),rnd(-3,2)),s:new THREE.Vector3(rnd(6),rnd(6),rnd(6)),l:2.6,fx:1})}
  else{t.material=STc.dmg;t.position.y=-.15-rnd(.02,.1)*(1+pw);t.rotation.set(rnd(-.09,.09)*(1+pw),0,rnd(-.09,.09)*(1+pw))}}}

/* ----- gemalte Ebenen ----- */
function layer(tex,w,h,x,y,z,o={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:!o.opaque,fog:!!o.fog,depthWrite:!!o.opaque}));m.position.set(x,y,z);m.renderOrder=o.ro||0;stage.add(m);return m}
function sky(stops,extra){return ctex(1024,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);stops.forEach(([p,c])=>gr.addColorStop(p,c));g.fillStyle=gr;g.fillRect(0,0,w,h);extra&&extra(g,w,h)})}
const stars=(g,w,h,n=160)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(255,255,255,${rnd(.3,1)})`;const s=rnd(.6,2.2);g.fillRect(rnd(w),rnd(h*.75),s,s)}};
const disc=(g,x,y,r,c,glow)=>{const gr=g.createRadialGradient(x,y,r*.2,x,y,r*3);gr.addColorStop(0,glow);gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(x-r*3,y-r*3,r*6,r*6);g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill()};
const clouds=(g,w,h,c,n=9,y0=.2,y1=.6)=>{g.fillStyle=c;for(let i=0;i<n;i++){const x=rnd(w),y=h*rnd(y0,y1),s=rnd(30,80);for(let j=0;j<5;j++){g.beginPath();g.ellipse(x+j*s*.5,y+Math.sin(j*2)*s*.12,s*.6,s*.22,0,0,7);g.fill()}}};
function hills(c,amp,rough,deco){return ctex(1024,256,(g,w,h)=>{g.fillStyle=c;g.beginPath();g.moveTo(0,h);let y=h*.5;const pts=[];for(let x=0;x<=w;x+=16){y+=rnd(-rough,rough);y=clamp(y,h*(1-amp),h*.82);pts.push([x,y]);g.lineTo(x,y)}g.lineTo(w,h);g.fill();deco&&deco(g,w,h,pts)})}
const floorTex=(base,line,kind)=>ctex(256,256,(g)=>{g.fillStyle=base;g.fillRect(0,0,256,256);
  for(let i=0;i<700;i++){g.fillStyle=Math.random()<.5?`rgba(0,0,0,${rnd(.03,.1)})`:`rgba(255,255,255,${rnd(.03,.1)})`;const r=rnd(1,4);g.fillRect(rnd(256),rnd(256),r,r)}
  g.strokeStyle=line;g.lineWidth=4;
  if(kind=="plank"){for(let i=0;i<4;i++){g.strokeRect(-4,i*64,264,64);g.lineWidth=1.5;g.globalAlpha=.3;for(let j=0;j<9;j++){const y=i*64+rnd(6,58),x=rnd(256);g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+40,y+rnd(-5,5),x+80,y+rnd(-5,5),x+rnd(100,160),y);g.stroke()}
      g.globalAlpha=.6;g.fillStyle=line;for(const x of[12,244]){g.beginPath();g.arc(x,i*64+32,3,0,7);g.fill()}g.globalAlpha=1;g.lineWidth=4}}
  else if(kind=="roof"){for(let i=0;i<5;i++)for(let j=0;j<5;j++){const x=j*64+32+(i%2)*32,y=i*64;g.beginPath();g.arc(x,y,33,0,3.14);g.stroke();g.globalAlpha=.18;g.fillStyle="#fff";g.beginPath();g.arc(x,y+4,22,.4,2.7);g.fill();g.globalAlpha=1}}
  else if(kind=="slab"){g.strokeRect(3,3,250,250);g.globalAlpha=.35;g.lineWidth=2;for(let i=0;i<4;i++){let x=rnd(256),y=rnd(256);g.beginPath();g.moveTo(x,y);for(let j=0;j<4;j++){x+=rnd(-40,40);y+=rnd(-40,40);g.lineTo(x,y)}g.stroke()}g.globalAlpha=.15;g.fillStyle="#fff";g.fillRect(8,8,240,5);g.globalAlpha=1}
  else if(kind=="puzzle"){const cs=["#ff6f8a","#55b8ff","#ffd447","#5fd690"];for(let i=0;i<2;i++)for(let j=0;j<2;j++){g.fillStyle=cs[(i*2+j+(rnd()<.5?1:0))%4];g.fillRect(i*128,j*128,128,128)}
    g.strokeStyle="rgba(0,0,0,.25)";g.lineWidth=4;for(let k=0;k<2;k++){g.beginPath();g.moveTo(0,128);for(let x=0;x<=256;x+=32)g.lineTo(x,128+((x/32)%2?10:-10));g.stroke();g.beginPath();g.moveTo(128,0);for(let y=0;y<=256;y+=32)g.lineTo(128+((y/32)%2?10:-10),y);g.stroke()}
    for(let i=0;i<300;i++){g.fillStyle="rgba(255,255,255,.08)";g.fillRect(rnd(256),rnd(256),2,2)}}
  else if(kind=="arcade"){g.fillStyle="#1a0f2e";g.fillRect(0,0,256,256);const cs=["#ff3bd4","#25d4ff","#ffe14d","#3fe06b"];g.lineWidth=5;for(let i=0;i<22;i++){g.strokeStyle=cs[i%4];const x=rnd(256),y=rnd(256),t=R(0,2);g.beginPath();
      if(t==0){g.moveTo(x,y);g.lineTo(x+18,y+30);g.lineTo(x-18,y+30);g.closePath()}else if(t==1){g.arc(x,y,10,0,7)}else{g.moveTo(x-20,y);for(let k=0;k<4;k++)g.lineTo(x-20+k*13+6,y+(k%2?-10:10))}g.stroke()}}
  else if(kind=="card"){g.fillStyle=base;g.fillRect(0,0,256,256);g.font="64px serif";g.textAlign="center";g.textBaseline="middle";["♠","♥","♦","♣"].forEach((t,i)=>{g.fillStyle=i%3?"rgba(255,80,110,.35)":"rgba(255,225,77,.3)";g.fillText(t,64+(i%2)*128,64+(i>>1)*128)});g.strokeStyle=line;g.lineWidth=6;g.strokeRect(3,3,250,250)}
  else if(kind=="plate"){g.fillStyle=base;g.fillRect(0,0,256,256);for(let y=0;y<256;y+=32)for(let x=(y/32%2)*16;x<256;x+=32){g.fillStyle="rgba(255,255,255,.18)";g.save();g.translate(x,y);g.rotate(.7);g.fillRect(-9,-2.5,18,5);g.restore()}
    g.fillStyle="#ffc21a";for(let x=-256;x<256;x+=36){g.beginPath();g.moveTo(x,0);g.lineTo(x+18,0);g.lineTo(x+18+20,20);g.lineTo(x+20,20);g.fill()}g.strokeStyle=line;g.lineWidth=4;g.strokeRect(2,2,252,252)}
  else if(kind=="void"){g.fillStyle=base;g.fillRect(0,0,256,256);g.strokeStyle=line;g.lineWidth=4;g.strokeRect(3,3,250,250);g.strokeStyle="#c46bff";g.lineWidth=5;g.shadowColor="#9a3cff";g.shadowBlur=16;for(let k=0;k<2;k++){g.beginPath();g.moveTo(rnd(256),0);g.lineTo(rnd(60,190),rnd(80,170));g.lineTo(rnd(256),256);g.stroke()}g.shadowBlur=0;for(let i=0;i<40;i++){g.fillStyle="rgba(255,255,255,.4)";g.fillRect(rnd(256),rnd(256),1.5,1.5)}}
  else if(kind=="asphalt"){g.fillStyle="#26262e";g.fillRect(0,0,256,256);for(let i=0;i<1600;i++){g.fillStyle=Math.random()<.5?`rgba(0,0,0,${rnd(.1,.3)})`:`rgba(255,255,255,${rnd(.03,.09)})`;g.fillRect(rnd(256),rnd(256),2,2)}
    for(let i=0;i<2;i++){const x=rnd(40,216),y=rnd(40,216),gr=g.createRadialGradient(x,y,4,x,y,52);gr.addColorStop(0,P(["rgba(255,59,212,.55)","rgba(37,212,255,.55)"]));gr.addColorStop(.6,"rgba(20,24,40,.6)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.beginPath();g.ellipse(x,y,56,30,rnd(3),0,7);g.fill()}
    g.strokeStyle="rgba(255,225,77,.55)";g.lineWidth=7;g.setLineDash([30,22]);g.beginPath();g.moveTo(0,250);g.lineTo(256,250);g.stroke();g.setLineDash([])}
  else{g.strokeRect(3,3,250,250);g.strokeStyle="#ff5a1a";g.lineWidth=6;g.shadowColor="#ff3d00";g.shadowBlur=18;for(let k=0;k<2;k++){g.beginPath();g.moveTo(rnd(256),0);g.lineTo(rnd(60,180),rnd(80,160));g.lineTo(rnd(256),256);g.stroke()}g.shadowBlur=0}});
const dmgTex=(base)=>ctex(256,256,g=>{g.fillStyle=base;g.fillRect(0,0,256,256);for(let i=0;i<500;i++){g.fillStyle=`rgba(0,0,0,${rnd(.05,.2)})`;const r=rnd(1,5);g.fillRect(rnd(256),rnd(256),r,r)}g.strokeStyle="#07060a";g.lineWidth=6;for(let i=0;i<6;i++){g.beginPath();let x=128,y=128;g.moveTo(x,y);for(let j=0;j<5;j++){x+=rnd(-60,60);y+=rnd(-60,60);g.lineTo(x,y)}g.stroke()}});
let BGK="wood";const BG=(g,c,x,y,z,e)=>{const m=M(g,c,[x,y,z],stage,1,e,e?undefined:BGK);m.receiveShadow=true;return m};
/* ----- Die fünf Stages ----- */
const STG=[
 {n:"Kirschblüten-Dojo",own:"tetsu",en:"Cherry Blossom Dojo",cols:[0xff7ab0,0xffc21a],fog:0xf2b9a0,fn:26,ff:95,hemi:[0xfff0e0,0x8a6a70,.64],sun:[0xffe2c0,.7],rim:0xff9ab0,floor:["#a8743e","#5c3a1e","plank"],base:0x5c3a1e,trim:0x8a1a22,amb:[0xffb7d0,70,"fall"],
  build(){layer(sky([[0,"#3b6fc4"],[.45,"#f7a36c"],[.75,"#ffd9a0"],[1,"#ffe9c8"]],(g,w,h)=>{disc(g,w*.68,h*.52,46,"#fff3d0","rgba(255,220,150,.6)");clouds(g,w,h,"rgba(255,235,220,.75)")}),260,120,0,34,-90,{opaque:1});
   layer(hills("#7a6aa0",.75,26,(g,w,h,p)=>{g.fillStyle="#fff";for(let i=10;i<p.length;i+=17){g.beginPath();g.moveTo(p[i][0]-30,p[i][1]+26);g.lineTo(p[i][0],p[i][1]-2);g.lineTo(p[i][0]+30,p[i][1]+26);g.fill()}}),230,50,0,14,-70);
   layer(hills("#3f3558",.5,14,(g,w,h)=>{g.fillStyle="#3f3558";for(const x of[240,760]){for(let i=0;i<4;i++){g.fillRect(x-22+i*4,h*.5-i*30-40,44-i*8,26);g.beginPath();g.moveTo(x-46+i*6,h*.5-i*30-14);g.lineTo(x+46-i*6,h*.5-i*30-14);g.lineTo(x+26-i*4,h*.5-i*30-26);g.lineTo(x-26+i*4,h*.5-i*30-26);g.fill()}}}),190,36,0,7,-48);
   /* Torii */for(const s of[-1,1])BG(gC(.34,.4,7.4,10),0xc81e2e,s*4.2,3.7,-8);BG(gB(11.4,.55,.8),0xc81e2e,0,7.3,-8);BG(gB(12.6,.4,1),0x15131a,0,7.8,-8);BG(gB(9.4,.4,.6),0xc81e2e,0,6,-8);
   /* Kirschbäume */for(const[x,z,s]of[[-11,-7,1.2],[11.5,-6,1.1],[-17,-12,1.5],[17,-13,1.6]]){BG(gC(.3*s,.5*s,4*s,7),0x3a241c,x,2*s,z).rotation.z=x>0?.12:-.12;for(let i=0;i<7;i++)BG(gS(1.5*s,8,6),i%2?0xffb7d0:0xff8fb5,x+rnd(-2,2)*s,4.4*s+rnd(-.6,1.6)*s,z+rnd(-1,1))}
   /* Dojo-Wand */BG(gB(30,.3,.3),0x3a241c,0,3.1,-4.6);for(let i=-6;i<=6;i++)BG(gB(.24,3.2,.24),0x3a241c,i*2.4,1.5,-4.6);const w=M(gB(30,2.6,.08),0xd8cdb0,[0,1.6,-4.7],stage,0);
   [["dummy",-5.8,-1.9],["dummy",5.4,-2.1],["lantern",-3.4,-2.4],["lantern",3.6,-2.4,1,3.14],["vase",-1.5,-2.5],["vase",1.6,-2.5,.9],["shoji",0,-2.7],["taiko",-7.4,-.6,1,.5],["bamboo",7.3,-1.2,1,-.4],["shoji",-4.4,-2.75],["shoji",4.5,-2.75],["crate",6.6,.6,.9],["vase",-6.5,.7,1.1],["lantern",7.9,-2.3],["bamboo",-7.6,-2.3],["vase",2.6,2.4,.7],["crate",-2.9,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Piratenbucht",own:"rokka",en:"Pirate Cove",cols:[0x25d4ff,0xffe14d],fog:0x7fc6e8,fn:30,ff:110,hemi:[0xe8f6ff,0x3a5a70,.78],sun:[0xfff0d0,.85],rim:0x7fe0ff,floor:["#9a6a3a","#4a2e18","plank"],base:0x4a2e18,trim:0x2a1a10,amb:[0xffffff,40,"rise"],
  build(){layer(sky([[0,"#1f6fd0"],[.5,"#6fc0f0"],[.62,"#bfe8ff"],[.63,"#1a6a9a"],[1,"#0e3a5a"]],(g,w,h)=>{disc(g,w*.25,h*.2,34,"#fffbe0","rgba(255,250,200,.5)");clouds(g,w,h,"rgba(255,255,255,.9)",10,.1,.5);g.strokeStyle="rgba(255,255,255,.35)";g.lineWidth=2;for(let i=0;i<60;i++){const x=rnd(w),y=h*rnd(.65,1);g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(20,60),y);g.stroke()}}),260,120,0,30,-90,{opaque:1});
   layer(hills("#2a6a5a",.55,22,(g,w,h,p)=>{g.fillStyle="#1f5246";for(let i=4;i<p.length;i+=6){g.fillRect(p[i][0],p[i][1]-26,4,30);g.beginPath();g.ellipse(p[i][0]+2,p[i][1]-28,18,7,.3,0,7);g.fill();g.beginPath();g.ellipse(p[i][0]+2,p[i][1]-28,18,7,-.5,0,7);g.fill()}}),200,34,-40,9,-60);
   layer(ctex(512,512,(g,w,h)=>{g.fillStyle="#1a1418";g.beginPath();g.moveTo(120,h);g.lineTo(90,h-70);g.lineTo(420,h-70);g.lineTo(390,h);g.fill();g.fillRect(250,60,8,h-130);g.fillStyle="#e8dcc0";g.fillRect(170,90,170,110);g.fillRect(190,220,130,90);g.fillStyle="#1a1418";g.beginPath();g.arc(255,145,22,0,7);g.fill();g.fillRect(258,50,40,22)}),30,30,34,11,-40);
   /* Mast, Segel, Reling */BG(gC(.4,.5,22,10),0x5c3a1e,0,10,-6.5);BG(gB(15,.4,.4),0x5c3a1e,0,13.5,-6.5);const s=M(gB(13.5,7,.12),0xf1e7d0,[0,9.6,-6.3],stage,1);s.rotation.x=.06;M(gC(1.4,1.4,.14,16),0x15131a,[0,9.8,-6.2],stage,0).rotation.x=Math.PI/2;BG(gC(1.2,1.4,1,10),0x5c3a1e,0,17.5,-6.5);
   BG(gB(24,.3,.3),0x5c3a1e,0,1.9,-4.2);for(let i=-7;i<=7;i++)BG(gC(.12,.16,1.9,6),0x8a5a30,i*1.6,.95,-4.2);for(const sgn of[-1,1]){const r=BG(gC(.05,.05,20,4),0xc9a26a,sgn*5.4,8,-5.4);r.rotation.z=sgn*.5}
   [["barrel",-5.5,-1.8],["barrel",-6.3,-1.5,.9],["crates",5.6,-2.1],["cannon",-7.6,-.3,1,1.57],["cannon",7.7,-.2,1,-1.57],["wheel",0,-2.8,1.2],["balls",-3.2,-2.5],["balls",6.9,.9,.9],["bottles",2.6,-2.5],["anchor",-1.8,-2.8,1.1],["barrel",3.9,-2.3],["lantern",-4,-2.7],["lantern",4.9,-2.7,1,3.14],["crate",-6.8,.9,.8],["barrel",7.3,-1.9],["bottles",-2.3,2.5,.7],["crate",2.9,2.5,.6],["barrel",-8,-2.2]].forEach(a=>addProp(...a))}},
 {n:"Schattendorf",own:"shade",en:"Shadow Village",cols:[0x7a8cff,0xd8ff8a],fog:0x1a2250,fn:24,ff:90,hemi:[0x9ab0ff,0x1a1a3a,.6],sun:[0xbfd0ff,.6],rim:0x7a8cff,floor:["#33406e","#161c36","roof"],base:0x161c36,trim:0x8a1a22,amb:[0xd8ff8a,36,"float"],
  build(){layer(sky([[0,"#070a20"],[.6,"#1a2a66"],[1,"#3a3a7a"]],(g,w,h)=>{stars(g,w,h);disc(g,w*.5,h*.34,74,"#f4f2dc","rgba(200,210,255,.45)");g.fillStyle="rgba(180,180,210,.5)";for(const[x,y,r]of[[490,150,14],[530,190,9],[505,205,6]]){g.beginPath();g.arc(x,y,r,0,7);g.fill()}clouds(g,w,h,"rgba(40,50,110,.8)",6,.3,.6)}),260,120,0,34,-90,{opaque:1});
   layer(hills("#10163a",.6,18),220,44,0,10,-66);
   layer(ctex(1024,256,(g,w,h)=>{for(let x=0;x<w;x+=rnd(60,110)){const hh=rnd(70,150),ww=rnd(50,90);g.fillStyle="#0b0f26";g.fillRect(x,h-hh,ww,hh);g.beginPath();g.moveTo(x-16,h-hh);g.lineTo(x+ww/2,h-hh-34);g.lineTo(x+ww+16,h-hh);g.fill();g.fillStyle="#ffc85a";for(let i=0;i<3;i++)if(Math.random()<.6)g.fillRect(x+8+i*22,h-hh+rnd(14,50),10,14)}}),170,40,0,8,-40);
   /* Pagode + Dächer */for(let i=0;i<4;i++){BG(gB(7-i*1.2,2,4),0x1c2248,-12,1+i*2.9,-11);const r=BG(gK(5.6-i*.9,1.2,4),0x8a1a22,-12,2.6+i*2.9,-11);r.rotation.y=.785;r.scale.z=.7;M(gB(.6,.9,.1),0xffc85a,[-12,1.1+i*2.9,-8.9],stage,0,0xffa030)}
   for(const[x,z,w]of[[9,-9,9],[17,-12,8],[-22,-14,9]]){BG(gB(w,4,4),0x1c2248,x,2,z);const r=BG(gC(.2,3.4,2.4,4),0x2c3566,x,5,z);r.rotation.y=.785;r.scale.set(w/5,1,.9);M(gB(.7,1,.1),0xffc85a,[x-1.4,2.2,z+2.05],stage,0,0xffa030);M(gB(.7,1,.1),0xffc85a,[x+1.4,2.2,z+2.05],stage,0,0xffa030)}
   BG(gB(26,.5,.5),0x161c36,0,-.1,-3.6);
   [["slantern",-5.6,-1.9],["slantern",5.5,-1.9],["barrel",-3.6,-2.5],["bamboo",0,-2.8,1.2],["umbrella",2.9,-2.5],["target",-1.7,-2.7],["bell",7.5,-.8,1,-.5],["crates",-7.5,-.5],["umbrella",-6.9,-2.5,.9],["target",4.2,-2.8],["lantern",-2.7,-2.9],["lantern",6.7,-2.8,1,3.14],["barrel",7.3,1,.8],["slantern",-6.8,1,.8],["bamboo",-4.6,-2.9],["vase",1.4,-2.5,.8],["crate",-2.6,2.5,.6],["vase",2.8,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Kolosseum der Champions",own:"goro",en:"Colosseum of Champions",cols:[0xff5a1a,0xffc21a],fog:0xe0b070,fn:28,ff:100,hemi:[0xfff0d0,0x6a4a30,.58],sun:[0xffd9a0,.62],rim:0xffa040,floor:["#b09870","#6a5a40","slab"],base:0x8a7650,trim:0x8a1a22,amb:[0xffe6b0,50,"float"],
  build(){layer(sky([[0,"#2a5ab8"],[.5,"#f2a860"],[.8,"#ffd890"],[1,"#fff0c0"]],(g,w,h)=>{disc(g,w*.5,h*.62,60,"#fff6d8","rgba(255,200,120,.6)");clouds(g,w,h,"rgba(255,225,190,.7)",7)}),260,120,0,34,-90,{opaque:1});
   layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#7a5a40";g.fillRect(0,h*.3,w,h);for(let r=0;r<3;r++)for(let x=10;x<w;x+=64){g.fillStyle="#3a281c";g.beginPath();g.moveTo(x,h*.36+r*110+90);g.lineTo(x,h*.36+r*110+34);g.arc(x+22,h*.36+r*110+34,22,3.14,0);g.lineTo(x+44,h*.36+r*110+90);g.fill()}
     g.fillStyle="#5a4230";g.fillRect(0,h*.3,w,14);for(let i=0;i<400;i++){g.fillStyle=P(["#c81e2e","#ffc21a","#f4f0e6","#25a0d4","#3a281c"]);g.fillRect(rnd(w),h*.3-rnd(2,26),5,7)}}),200,62,0,22,-55);
   for(const x of[-13,-6.5,6.5,13]){for(let i=0;i<6;i++)BG(gC(.75,.8,1.6,12),0xdedae6,x,.8+i*1.6,-8);BG(gB(2.4,.5,2.4),0xcfcad8,x,9.9,-8);const b=M(gB(1.5,5,.08),x*x>100?0x1f4fa8:0xc81e2e,[x,6,-7.1],stage,1);M(gC(.4,.4,.1,10),GOLD,[x,6.6,-7.04],stage,0).rotation.x=Math.PI/2}
   BG(gB(31,1,2.6),0xcfcad8,0,10.6,-8);BG(gB(30,2.4,.6),0xb09a70,0,1.2,-4.4);for(let i=-5;i<=5;i++)M(gB(.9,1.2,.1),0x8a7650,[i*2.7,1.3,-4.06],stage,0);
   [["pillar",-5.7,-2],["pillar",5.8,-2],["statue",-3.2,-2.6],["statue",3.3,-2.6,1,3.14],["urn",-1.4,-2.6],["urn",1.5,-2.6],["rack",0,-2.9],["brazier",-7.7,-.7],["brazier",7.7,-.7],["shield",-4.5,-2.8],["shield",4.6,-2.8],["pillar",-8,-2.5,.9],["pillar",8,-2.5,.9],["urn",6.8,.9,.9],["urn",-6.8,.9,.9],["shield",2.6,2.5,.7],["urn",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Drachenvulkan",own:"drako",en:"Dragon Volcano",cols:[0xff3b2f,0xff8a00],fog:0x3a0c08,fn:22,ff:85,hemi:[0xffb080,0x2a0a08,.62],sun:[0xff9a60,.7],rim:0xff4a1a,floor:["#2c2428","#120c10","lava"],base:0x1a0e10,trim:0xff5a1a,te:0x551500,amb:[0xff8a2a,90,"rise"],
  build(){layer(sky([[0,"#0c0406"],[.5,"#4a0e0a"],[.8,"#c8380e"],[1,"#ffb040"]],(g,w,h)=>{stars(g,w,h,50);clouds(g,w,h,"rgba(30,10,14,.85)",9,.05,.5);clouds(g,w,h,"rgba(255,90,20,.25)",5,.3,.6)}),260,120,0,34,-90,{opaque:1});
   layer(ctex(1024,512,(g,w,h)=>{for(const[x,ww,hh]of[[220,330,330],[640,420,420],[930,260,250]]){g.fillStyle="#1c0c0e";g.beginPath();g.moveTo(x-ww/2,h);g.lineTo(x-34,h-hh);g.lineTo(x+34,h-hh);g.lineTo(x+ww/2,h);g.fill();
     const gr=g.createRadialGradient(x,h-hh,4,x,h-hh,90);gr.addColorStop(0,"rgba(255,220,120,1)");gr.addColorStop(.3,"rgba(255,90,20,.8)");gr.addColorStop(1,"rgba(255,60,0,0)");g.fillStyle=gr;g.fillRect(x-100,h-hh-100,200,200);
     g.strokeStyle="#ff6a1a";g.lineWidth=6;g.shadowColor="#ff3d00";g.shadowBlur=16;g.beginPath();g.moveTo(x-10,h-hh+4);g.quadraticCurveTo(x-50,h-hh*.5,x-30,h);g.moveTo(x+14,h-hh+4);g.quadraticCurveTo(x+60,h-hh*.6,x+90,h);g.stroke();g.shadowBlur=0}}),210,80,0,24,-62);
   layer(hills("#140809",.5,30),190,30,0,5,-36);
   for(const[x,z,s]of[[-12,-8,2.4],[12.5,-9,2.8],[-19,-13,3.4],[19,-12,3],[0,-12,2]]){const r=BG(gK(1.6*s,3.6*s,6),0x24181c,x,1.8*s,z);r.rotation.y=x;BG(gD(.9*s),0x2c1e22,x+s,.5*s,z+1)}
   /* Lavasee */const lv=M(gB(120,.2,40),0xff5a1a,[0,-2.4,-16],stage,0,0xff3d00);
   for(const x of[-9.5,9.5]){BG(gC(.5,.7,9,6),0x24181c,x,4.5,-5.5);M(gB(.3,7,.3),0xff5a1a,[x,4.5,-5.05],stage,0,0xff3d00)}
   [["crystal",-5.6,-2],["crystal",5.7,-2,1.1],["rock",-3.3,-2.6],["rock",3.4,-2.6,1.1],["skull",0,-2.7,1.3],["rune",-1.9,-2.8],["rune",2,-2.8],["chainpost",-7.7,-.6],["chainpost",7.7,-.6,1,3.14],["ribs",-6.6,-2.6,1,.3],["ribs",6.6,-2.6,1,-.3],["crystal",7.2,.9,.8],["rock",-7,.9,.8],["crystal",-4.4,-2.9,.9],["rock",4.6,-2.9,.8],["crystal",-2.6,2.5,.55],["rock",2.8,2.5,.5],["skull",-8.2,-2.4,.8,.6]].forEach(a=>addProp(...a))}},
 /* ---------- Bonus-Stages (Story auf "Schwer") ---------- */
 {n:"Kinderzimmer",en:"Playroom",bonus:1,bgk:"wood",cols:[0xff5ab0,0x2fa8ff],fog:0xcfe4ff,fn:30,ff:95,hemi:[0xffffff,0x8a7aa0,.74],sun:[0xfff2d8,.85],rim:0xffd0f0,floor:["#55b8ff","#2a6aa8","puzzle"],base:0xe8d8b8,trim:0xff6f8a,amb:[0xfff2b0,60,"float"],
  build(){const star5=(g,x,y,r)=>{g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,q=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.fill()};
   const poster=(g,x,y,w,h,c,t)=>{g.fillStyle="#fff";g.fillRect(x-6,y-6,w+12,h+12);g.fillStyle=c;g.fillRect(x,y,w,h);g.font='900 46px Bangers,"Bangers Local",Impact,sans-serif';g.textAlign="center";g.textBaseline="middle";g.lineWidth=6;g.strokeStyle="#15131a";g.strokeText(t,x+w/2,y+h/2);g.fillStyle="#fff";g.fillText(t,x+w/2,y+h/2)};
   layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#bfe0ff";g.fillRect(0,0,w,h);for(let y=24;y<h-40;y+=64)for(let x=(y/64%2)*32+16;x<w;x+=64){g.fillStyle=(x+y)%128?"rgba(255,255,255,.6)":"rgba(255,212,71,.7)";star5(g,x,y,9)}
     const wx=372,wy=70;g.fillStyle="#f4f0e6";g.fillRect(wx-12,wy-12,304,214);const sk=g.createLinearGradient(0,wy,0,wy+190);sk.addColorStop(0,"#4aa6ff");sk.addColorStop(1,"#c8ecff");g.fillStyle=sk;g.fillRect(wx,wy,280,190);
     g.fillStyle="#fff";for(const[cx,cy]of[[440,120],[560,170]])for(let k=0;k<4;k++){g.beginPath();g.ellipse(cx+k*20,cy+Math.sin(k*2)*6,28,14,0,0,7);g.fill()}g.fillStyle="#ffe14d";g.beginPath();g.arc(600,105,22,0,7);g.fill();
     g.fillStyle="#f4f0e6";g.fillRect(wx+136,wy,8,190);g.fillRect(wx,wy+91,280,8);g.fillStyle="#ff6f8a";for(const x of[wx-46,wx+276]){g.fillRect(x,wy-24,52,250);g.fillStyle="rgba(0,0,0,.12)";for(let i=0;i<4;i++)g.fillRect(x+6+i*12,wy-24,3,250);g.fillStyle="#ff6f8a"}
     poster(g,90,100,180,124,"#ffd447","1+1=2");poster(g,770,120,160,112,"#5fd690","5×5");poster(g,820,300,110,80,"#a66bff","GO!");
     g.fillStyle="#f4f0e6";g.fillRect(0,h-46,w,46);g.fillStyle="rgba(0,0,0,.12)";g.fillRect(0,h-46,w,5)}),84,42,0,13,-12,{opaque:1});
   BG(gB(70,.2,30),0xc8a070,0,-.62,-7);
   /* Bett links, Regal rechts */
   BG(gB(5,1,2.6),0xffc21a,-10.5,.1,-7.6);BG(gB(4.8,.5,2.4),0xf4f0e6,-10.5,.85,-7.6);BG(gB(3.4,.32,2.5),0x2fa8ff,-9.8,1.15,-7.55);BG(gB(1.2,.4,1.6),0xffffff,-12.2,1.25,-7.6);BG(gB(.3,2.4,2.6),0xffc21a,-13,.9,-7.6);
   for(let i=0;i<3;i++){BG(gB(3.6,.12,1),0xf4f0e6,10.5,.6+i*1.3,-7.6);for(let j=0;j<6;j++)BG(gB(.22,.9-((i+j)%3)*.12,.7),KIDC[(i+j)%6],9.1+j*.42,1.12+i*1.3-((i+j)%3)*.06,-7.5)}BG(gB(.12,4,1),0xf4f0e6,8.7,1.5,-7.6);BG(gB(.12,4,1),0xf4f0e6,12.3,1.5,-7.6);
   const mob=new THREE.Group();mob.position.set(0,9,-4);for(let i=0;i<5;i++){const a=i*1.256;M(gC(.01,.01,1.2,4),0xffffff,[Math.cos(a)*1.4,-.6,Math.sin(a)*1.4],mob,0);const st=M(gO(.32),KIDC[i],[Math.cos(a)*1.4,-1.3,Math.sin(a)*1.4],mob)}M(gT(1.4,.05,6,24),0xf4f0e6,[0,0,0],mob,0).rotation.x=Math.PI/2;stage.add(mob);NEONS.push({m:{material:{}},h:{material:{}},ph:0,spin:mob});
   [["nblock",-5.6,-2],["tower",5.5,-2.2],["teddy",-3.4,-2.6],["toyball",3.6,-2.5],["toycar",-1.6,-2.6,1,.3],["crayons",1.6,-2.7],["rocket",-7.4,-.6],["books",7.5,-.6],["nblock",6.8,.9,.9],["nblock",-6.8,.9,.9],
    ["teddy",7.8,-2.4,.9,-.5],["tower",-7.8,-2.3,.9],["toyball",-4.6,-2.9,.7],["nblock",4.6,-2.9,.8],["toycar",2.8,2.5,.6,-.4],["nblock",-2.7,2.5,.6],["crayons",-.2,-2.9,.8]].forEach(a=>addProp(...a))}},
 {n:"Spielhalle",en:"Arcade Hall",bonus:1,bgk:"metal",cols:[0xff3bd4,0x25d4ff],fog:0x140a24,fn:24,ff:80,hemi:[0xb090ff,0x1a0a30,.6],sun:[0xd0b0ff,.55],rim:0xff3bd4,floor:["#1a0f2e","#000000","arcade"],base:0x140a24,trim:0x25d4ff,amb:[0xff9ae8,50,"float"],
  build(){layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#120a22";g.fillRect(0,0,w,h);for(let x=0;x<w;x+=32){g.fillStyle="rgba(255,255,255,.025)";g.fillRect(x,0,14,h)}
     for(const[c,y]of[["#ff3bd4",110],["#25d4ff",130]]){g.shadowColor=c;g.shadowBlur=22;g.fillStyle=c;g.fillRect(0,y,w,6)}g.shadowBlur=0;
     for(let i=0;i<6;i++){const x=60+i*165,c=["#ffe14d","#25d4ff","#ff3bd4"][i%3];g.fillStyle=["#2a1a4a","#3a0a2a"][i%2];g.fillRect(x,190,110,150);g.strokeStyle=c;g.lineWidth=4;g.strokeRect(x,190,110,150);
       g.fillStyle=c;g.font='900 28px Bangers,"Bangers Local",Impact,sans-serif';g.textAlign="center";g.fillText(["HI-SCORE","1UP","K.O.!","MATH","BRAWL","GO!"][i],x+55,275)}}),84,42,0,13,-14,{opaque:1});
   BG(gB(70,.2,30),0x1a0f2e,0,-.62,-8);
   for(let i=-6;i<=6;i++){const x=i*2.3,c=KIDC[(i+12)%6];BG(gB(1.7,3.2,1.2),0x1c1830,x,1,-6.6);M(gB(1.3,.95,.05),c,[x,1.85,-5.98],stage,0,c);M(gB(1.72,.45,1.22),c,[x,2.82,-6.6],stage,1,c);M(gB(1.5,.2,.5),0x2a2440,[x,1.05,-5.85],stage,0)}
   neon("ARCADE",0xff3bd4,0,4.5,-5.6,5.2);neon("HIGHSCORE",0x25d4ff,-6.6,4.3,-5.8,3.8);neon("1UP",0xffe14d,6.6,4.4,-5.8,2.6);
   [["cabinet",-5.7,-2,1,0,0xff3bd4],["cabinet",5.7,-2,1,0,0x25d4ff],["claw",-3.3,-2.5],["soda",3.4,-2.6],["stool",-1.6,-2.4],["stool",1.6,-2.4],["bin",-7.6,-.6],["claw",7.6,-.8,.9,-.4],["stool",6.8,.9,.9],["stool",-6.8,.9,.9],
    ["cabinet",-7.9,-2.5,.9,.3,0xffe14d],["soda",7.9,-2.4,.85,-.3],["bin",4.6,-2.9,.8],["crates",-4.6,-2.9,.7],["stool",2.8,2.5,.7],["bin",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Neon-Gasse",en:"Neon Alley",bonus:1,bgk:"stone",cols:[0xff3bd4,0x25d4ff],fog:0x0a0c1a,fn:22,ff:80,hemi:[0x8090c0,0x0a0a18,.56],sun:[0xa0b0ff,.45],rim:0x25d4ff,floor:["#26262e","#111116","asphalt"],base:0x15151c,trim:0x2a2a34,amb:[0x9ab8ff,260,"rain"],
  build(){layer(sky([[0,"#05060f"],[.6,"#141a3a"],[1,"#3a1a4a"]],(g,w,h)=>{stars(g,w,h,40);for(let x=0;x<w;x+=rnd(40,90)){const hh=rnd(160,380),ww=rnd(40,80);g.fillStyle="#0a0b16";g.fillRect(x,h-hh,ww,hh);
     for(let y=h-hh+10;y<h;y+=18)for(let xx=x+6;xx<x+ww-8;xx+=14)if(Math.random()<.35){g.fillStyle=P(["#ffe9a0","#7fd0ff","#ff9ae8"]);g.fillRect(xx,y,6,9)}}}),260,120,0,30,-90,{opaque:1});
   const bt=ctex(256,256,g=>{g.fillStyle="#3a2226";g.fillRect(0,0,256,256);for(let r=0;r<16;r++)for(let c=0;c<5;c++){g.fillStyle=`rgb(${R(90,130)},${R(40,60)},${R(40,55)})`;g.fillRect(c*56+(r%2)*28-28+2,r*16+2,52,12)}
     for(let i=0;i<500;i++){g.fillStyle=`rgba(0,0,0,${rnd(.1,.3)})`;g.fillRect(rnd(256),rnd(256),2,2)}});bt.wrapS=bt.wrapT=THREE.RepeatWrapping;bt.repeat.set(3,3);
   const brick=new THREE.MeshToonMaterial({map:bt,gradientMap:GRAD});
   for(const sx of[-1,1]){const w=M(gB(10,11,2),brick,[sx*11.2,4.8,-6.6],stage);w.receiveShadow=true;M(gB(10.2,.3,2.1),0x1c1c24,[sx*11.2,10.4,-6.6],stage)}
   BG(gB(70,.2,30),0x1c1c24,0,-.62,-9);
   /* Feuerleiter links */
   for(let i=0;i<3;i++){BG(gB(3.4,.1,1.2),0x2a2e3a,-7.3,2.8+i*2.6,-5.2);for(let j=0;j<8;j++)BG(gB(.05,.9,.05),0x2a2e3a,-8.9+j*.45,3.25+i*2.6,-4.6)}for(let i=0;i<10;i++)BG(gB(.8,.05,.05),0x2a2e3a,-6.2,2.8+i*.55,-4.7);
   neon("RAMEN",0xff3bd4,-6.9,4.6,-5.5,3.4);neon("24/7",0x25d4ff,7,5,-5.5,2.2);neon("PIZZA",0xffe14d,7,3.7,-5.5,3);
   [["dumpster",-5.6,-2.2],["vend",5.7,-2.3],["bin",-3.4,-2.6],["crates",3.5,-2.5],["cone",-1.6,-2.5],["cone",1.7,-2.6],["lamp",-7.6,-.8],["pipes",7.6,-2.8],["barrel",6.8,.9,.9],["bin",-6.8,.9,.9],
    ["crate",7.8,-.8,.9],["dumpster",-8,-2.6,.8,.3],["cone",4.6,-2.9,.8],["crate",-4.6,-2.9,.7],["cone",2.8,2.5,.6],["bin",-2.7,2.5,.6]].forEach(a=>addProp(...a))}}
,
 /* ---------- Arenen der Figuren ---------- */
 {n:"Gewitterdächer",en:"Storm Rooftops",own:"raiko",storm:1,bgk:"stone",cols:[0xffd83a,0x25d4ff],fog:0x1a2030,fn:22,ff:85,hemi:[0x9ab0d0,0x1a1a2a,.62],sun:[0xbfd0ff,.55],rim:0xffd83a,floor:["#4a4e5a","#2a2c36","slab"],base:0x2a2c36,trim:0x5a5e6a,amb:[0x9ab8ff,220,"rain"],
  build(){STL.sky=layer(sky([[0,"#0a0e1c"],[.55,"#22304a"],[1,"#4a5a7a"]],(g,w,h)=>{clouds(g,w,h,"rgba(20,26,44,.9)",12,.05,.45);for(let x=0;x<w;x+=rnd(36,80)){const hh=rnd(120,300),ww=rnd(40,80);g.fillStyle="#0c1020";g.fillRect(x,h-hh,ww,hh);
     for(let y=h-hh+10;y<h;y+=18)for(let xx=x+6;xx<x+ww-8;xx+=14)if(Math.random()<.3){g.fillStyle=P(["#ffe9a0","#bfe0ff"]);g.fillRect(xx,y,6,9)}}}),260,120,0,30,-90,{opaque:1});
   BG(gB(70,.2,30),0x2a2c36,0,-.62,-8);for(const[x,w,h]of[[-12,6,3],[-4,5,1.6],[5,7,2.4],[13,6,3.6]]){BG(gB(w,h,4),0x343846,x,h/2-1.5,-10);for(let i=0;i<4;i++)M(gB(.5,.6,.05),0xffe9a0,[x-w/2+.8+i*(w-1.2)/3,h-2.2,-7.97],stage,0,0xffc040)}
   BG(gC(1.4,1.4,2.4,16),0x6a4a30,9.5,3.6,-6.5);BG(gK(1.6,.8,16),0x4a3420,9.5,5.2,-6.5);for(const x of[8.6,10.4])BG(gC(.08,.08,2.6,8),0x3a3e4c,x,1.2,-6.5);
   for(const x of[-9,-6.5]){BG(gC(.06,.06,7,6),0x3a3e4c,x,3,-6.8);BG(gB(1.2,.05,.05),0x3a3e4c,x,5.6,-6.8);M(gS(.1),0xff2a2a,[x,6.55,-6.8],stage,0,0xff0000)}
   [["pipes",-5.6,-2.2],["barrel",5.6,-2.2],["crates",-3.4,-2.6],["bin",3.4,-2.6],["crate",-1.6,-2.8,.8],["barrel",1.6,-2.8,.8],["pipes",7.6,-.8,1,1.57],["crates",-7.6,-.6],["bin",6.8,.9,.9],["crate",-6.8,.9,.9],
    ["barrel",-7.9,-2.5,.9],["crate",7.9,-2.5,.9],["bin",4.6,-2.9,.8],["cone",-4.6,-2.9,.7],["cone",2.8,2.5,.6],["crate",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Feuertempel",en:"Fire Temple",own:"akane",bgk:"stone",cols:[0xff5a1a,0xffc21a],fog:0x3a1008,fn:24,ff:85,hemi:[0xffc0a0,0x3a0a08,.6],sun:[0xffb070,.7],rim:0xff7a1a,floor:["#7a2a1e","#3a0e0a","slab"],base:0x3a0e0a,trim:0xffc21a,amb:[0xff8a2a,80,"rise"],
  build(){layer(sky([[0,"#1a0604"],[.5,"#6a1a0a"],[.85,"#e0501a"],[1,"#ffb040"]],(g,w,h)=>{clouds(g,w,h,"rgba(40,10,8,.8)",10,.05,.5);disc(g,w*.5,h*.72,50,"#ffd27a","rgba(255,120,30,.6)")}),260,120,0,30,-90,{opaque:1});
   layer(hills("#2a0a08",.5,20),200,36,0,8,-60);BG(gB(70,.2,30),0x3a0e0a,0,-.62,-8);
   BG(gB(16,.5,4),0x2a1210,0,-.4,-9);for(let i=-3;i<=3;i++)BG(gC(.35,.4,6,12),0xc81e2e,i*2.4,2.6,-8.5);BG(gB(19,1.2,4.6),0x1c0a08,0,6.1,-9);const r=BG(gK(10.5,3,4),0x2a1210,0,8.1,-9);r.rotation.y=.785;r.scale.z=.45;
   M(gC(1,1,.2,24),0xffc21a,[0,6.1,-6.6],stage,0,0xaa5500).rotation.x=Math.PI/2;
   for(const x of[-10,10]){BG(gC(.9,.6,1.2,14),0x3a3e4c,x,.6,-6);M(gK(.9,2.4,10),0xff7a1a,[x,2.4,-6],stage,0,0xff5a00);M(gK(.5,1.6,8),0xffe14d,[x,2.1,-6],stage,0,0xffc21a)}
   [["brazier",-5.6,-2],["brazier",5.7,-2],["vase",-3.4,-2.6],["urn",3.4,-2.6],["taiko",-1.6,-2.8,.8],["lantern",1.8,-2.6],["slantern",-7.6,-.6],["slantern",7.6,-.6],["urn",6.8,.9,.9],["vase",-6.8,.9,.9],
    ["lantern",-7.9,-2.5,1,3.14],["taiko",7.9,-2.4,.8,-.4],["vase",4.6,-2.9,.8],["urn",-4.6,-2.9,.7],["vase",2.8,2.5,.6],["urn",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Kartenpalast",en:"Card Palace",own:"zeno",bgk:"wood",cols:[0xff3dcb,0xffc21a],fog:0x1a0a24,fn:24,ff:85,hemi:[0xe0c0ff,0x2a0a30,.62],sun:[0xffe0b0,.6],rim:0xff3dcb,floor:["#4a1a3a","#ffc21a","card"],base:0x2a0a24,trim:0xffc21a,amb:[0xffe14d,60,"fall"],
  build(){layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#1c0a24";g.fillRect(0,0,w,h);for(let i=0;i<7;i++){const x=40+i*145;g.strokeStyle="#ffc21a";g.lineWidth=5;g.beginPath();g.moveTo(x,h);g.lineTo(x,160);g.arc(x+55,160,55,Math.PI,0);g.lineTo(x+110,h);g.stroke();
     g.fillStyle="rgba(154,60,255,.25)";g.fill()}g.fillStyle="#ffc21a";g.fillRect(0,h-50,w,6)}),84,42,0,13,-14,{opaque:1});BG(gB(70,.2,30),0x2a0a24,0,-.62,-8);
   const ct=(r,su,red)=>new THREE.MeshToonMaterial({gradientMap:GRAD,map:ctex(128,180,g=>{g.fillStyle="#f8f4ea";g.fillRect(0,0,128,180);g.strokeStyle="#ffc21a";g.lineWidth=6;g.strokeRect(6,6,116,168);g.fillStyle=red?"#cc2233":"#1c1a24";g.font="900 40px serif";g.fillText(r,16,48);g.font="96px serif";g.textAlign="center";g.fillText(su,64,128)})});
   [["A","♠",0],["K","♥",1],["Q","♦",1],["J","♣",0]].forEach(([r,su,red],i)=>{const x=[-10.5,-7.4,7.4,10.5][i],c=M(gB(2.4,3.4,.12),ct(r,su,red),[x,1.4,-6.2],stage,1);c.rotation.set(0,(x<0?1:-1)*.25,(x<0?1:-1)*.06)});
   for(const x of[-4,4]){const ch=new THREE.Group();ch.position.set(x,8,-4);M(gT(.9,.07,8,24),0xffc21a,[0,0,0],ch,0).rotation.x=Math.PI/2;for(let i=0;i<6;i++)M(gS(.16,10,8),0xfff3c0,[Math.cos(i*1.05)*.9,-.15,Math.sin(i*1.05)*.9],ch,0,0xffd060);M(gC(.02,.02,2,6),0xffc21a,[0,1,0],ch,0);stage.add(ch)}
   [["cardstack",-5.6,-2],["dice",5.6,-2.2],["chips",-3.4,-2.6],["cardstack",3.4,-2.6,.9,.3],["dice",-1.6,-2.8,.8],["chips",1.6,-2.8,.8],["vase",-7.6,-.6],["statue",7.6,-1,1,-1.57],["dice",6.8,.9,.9],["cardstack",-6.8,.9,.9],
    ["chips",-7.9,-2.5,.9],["vase",7.9,-2.5,.9],["cardstack",4.6,-2.9,.8],["dice",-4.6,-2.9,.7],["chips",2.8,2.5,.6],["dice",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Roboterfabrik",en:"Robot Factory",own:"volt",bgk:"metal",cols:[0x25d4ff,0xffc21a],fog:0x1a2028,fn:24,ff:85,hemi:[0xc0d8ff,0x2a2a30,.62],sun:[0xe0f0ff,.65],rim:0x25d4ff,floor:["#4a5260","#2a2e36","plate"],base:0x2a2e36,trim:0xffc21a,amb:[0xffc040,60,"rise"],
  build(){layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#232a34";g.fillRect(0,0,w,h);for(let i=0;i<5;i++){const x=60+i*200;g.fillStyle="#3a4a5a";g.fillRect(x,60,150,180);g.fillStyle="#7ab0d0";for(let a=0;a<3;a++)for(let b=0;b<3;b++)g.fillRect(x+8+a*48,68+b*56,42,50)}
     g.fillStyle="#3a3e4c";for(let y of[300,340])g.fillRect(0,y,w,16);g.fillStyle="#ffc21a";for(let x=0;x<w;x+=40){g.beginPath();g.moveTo(x,h-40);g.lineTo(x+20,h-40);g.lineTo(x+40,h);g.lineTo(x+20,h);g.fill()}}),84,42,0,13,-14,{opaque:1});
   BG(gB(70,.2,30),0x2a2e36,0,-.62,-8);BG(gB(22,.6,1.6),0x3a3e4c,0,.4,-6.4);for(let i=-10;i<=10;i+=1.2)M(gC(.18,.18,1.62,10),0x8a94a8,[i,.72,-6.4],stage,0,0,"metal").rotation.x=Math.PI/2;for(let i=-4;i<=4;i++)M(gB(.8,.7,.8),WOOD,[i*2.4+.6,1.1,-6.4],stage,1,0,"wood");
   for(const[x,y,r]of[[-9,5,1.6],[-6.6,6.4,1],[9,5.4,1.8]]){const g2=new THREE.Group();g2.position.set(x,y,-7);M(gC(r,r,.3,18),0x6a6f7c,[0,0,0],g2,1,0,"metal");for(let i=0;i<12;i++){const t=M(gB(.3,.32,.4),0x6a6f7c,[Math.cos(i*.52)*(r+.15),0,Math.sin(i*.52)*(r+.15)],g2,1,0,"metal");t.rotation.y=-i*.52}g2.rotation.x=Math.PI/2;stage.add(g2);NEONS.push({spin:g2})}
   [["gear",-5.6,-2.2],["robotarm",5.6,-2.2],["terminal",-3.4,-2.6],["crates",3.4,-2.6],["cone",-1.6,-2.8],["barrel",1.6,-2.8,.8],["robotarm",-7.6,-.8,1,3.14],["gear",7.6,-.8],["terminal",6.8,.9,.9],["barrel",-6.8,.9,.9],
    ["crates",-7.9,-2.5,.9],["bin",7.9,-2.5,.9],["cone",4.6,-2.9,.8],["crate",-4.6,-2.9,.7],["cone",2.8,2.5,.6],["crate",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Mondtempel",en:"Moon Temple",own:"luna",bgk:"stone",cols:[0xc9b8ff,0x25d4ff],fog:0x1a1a3a,fn:26,ff:95,hemi:[0xc0c8ff,0x1a1a3a,.64],sun:[0xd0d8ff,.6],rim:0xc9b8ff,floor:["#d8d4e8","#8a84a8","slab"],base:0x5a5478,trim:0xc9b8ff,amb:[0xffffff,60,"float"],
  build(){layer(sky([[0,"#05061a"],[.6,"#1a1a4a"],[1,"#3a3a7a"]],(g,w,h)=>{stars(g,w,h,220);disc(g,w*.5,h*.42,120,"#f4f2dc","rgba(200,210,255,.5)");g.fillStyle="rgba(180,180,210,.45)";for(const[x,y,r]of[[470,190,22],[540,240,14],[500,260,9],[560,170,10]]){g.beginPath();g.arc(x,y,r,0,7);g.fill()}}),260,120,0,32,-90,{opaque:1});
   BG(gB(70,.2,30),0x3a3a5a,0,-.62,-8);for(let i=0;i<9;i++){const a=Math.PI*(i/8),x=Math.cos(a)*11,z=-6-Math.sin(a)*4;BG(gC(.5,.55,6,14),0xe8e4f4,x,2.4,z);BG(gB(1.3,.4,1.3),0xd8d4e8,x,5.6,z)}
   const cr=M(gT(2.2,.25,10,40,4.2),0xffe98a,[0,6.5,-9],stage,1,0x8a7a30);cr.rotation.z=1.1;
   [["pillar",-5.7,-2],["pillar",5.8,-2],["crystal",-3.3,-2.6,1,0,0x9ab8ff],["crystal",3.4,-2.6,1.1,0,0xc9b8ff],["urn",-1.5,-2.7],["urn",1.6,-2.7],["statue",-7.7,-.7],["statue",7.7,-.7,1,3.14],["slantern",6.8,.9,.9],["slantern",-6.8,.9,.9],
    ["crystal",-7.9,-2.5,.9,0,0x9ab8ff],["urn",7.9,-2.5,.9],["crystal",4.6,-2.9,.8,0,0xc9b8ff],["urn",-4.6,-2.9,.7],["crystal",2.8,2.5,.6,0,0x9ab8ff],["urn",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Jadegarten",en:"Jade Garden",own:"mika",bgk:"wood",cols:[0x3fe06b,0xffc21a],fog:0xbfe8c8,fn:28,ff:100,hemi:[0xf0fff0,0x4a6a4a,.72],sun:[0xfff6d8,.8],rim:0x9affb0,floor:["#a87a4a","#5c3a1e","plank"],base:0x5c3a1e,trim:0x1fa37a,amb:[0x7fe08a,60,"fall"],
  build(){layer(sky([[0,"#6ac0e8"],[.6,"#c8f0e0"],[1,"#f0fff0"]],(g,w,h)=>{clouds(g,w,h,"rgba(255,255,255,.85)",8,.1,.4)}),260,120,0,30,-90,{opaque:1});
   layer(hills("#5a9a7a",.75,30),230,50,0,14,-70);layer(hills("#2f7a5a",.5,16),190,34,0,7,-46);BG(gB(70,.2,30),0x6a9a5a,0,-.62,-8);
   BG(gB(9,3.2,3),0xf4ead0,-9,1,-8);const tr=BG(gK(7,1.8,4),0x1fa37a,-9,3.4,-8);tr.rotation.y=.785;tr.scale.z=.55;for(let i=0;i<3;i++)M(gB(1.4,1.6,.05),0x6a3a1e,[-11+i*2,.9,-6.47],stage,0);
   const mg=M(gT(2.4,.45,10,32),0xf4ead0,[8,2,-8],stage,1,0,"stone");BG(gB(7,4.6,.8),0xf4ead0,8,1.2,-8.2);const br=M(gT(3,.18,6,24,3.14),0xc81e2e,[0,-.8,-7],stage,1);
   for(const x of[-5,5,13]){BG(gC(.2,.3,3,8),0x5c3a1e,x,1,-9.5);BG(gS(1.4,12,8),0x2f9a5a,x,3,-9.5)}
   [["bamboo",-5.6,-2.2],["slantern",5.6,-2],["teatable",-3.4,-2.6],["vase",3.4,-2.6],["lantern",-1.6,-2.8],["teatable",1.6,-2.8,.8,.4],["umbrella",-7.6,-.8],["bamboo",7.6,-.8],["vase",6.8,.9,.9],["slantern",-6.8,.9,.8],
    ["lantern",-7.9,-2.5,1,3.14],["teatable",7.9,-2.5,.9],["vase",4.6,-2.9,.8],["bamboo",-4.6,-2.9,.7],["vase",2.8,2.5,.6],["teatable",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Oni-Bergschrein",en:"Oni Mountain Shrine",own:"oni",bgk:"stone",cols:[0xffc21a,0xd6222c],fog:0xd8dde8,fn:22,ff:80,hemi:[0xf0f4ff,0x5a5a6a,.66],sun:[0xf0f4ff,.7],rim:0xd6222c,floor:["#7a7a86","#4a4a54","slab"],base:0x3a3a44,trim:0xd6222c,amb:[0xffffff,140,"fall"],
  build(){layer(sky([[0,"#7a8aa8"],[.6,"#c8d4e8"],[1,"#eef2f8"]],(g,w,h)=>{clouds(g,w,h,"rgba(255,255,255,.7)",10,.2,.6)}),260,120,0,30,-90,{opaque:1});
   layer(hills("#e8eef8",.8,40,(g,w,h,p)=>{g.fillStyle="#8a92a8";for(let i=3;i<p.length;i+=7){g.beginPath();g.moveTo(p[i][0]-40,h);g.lineTo(p[i][0],p[i][1]+30);g.lineTo(p[i][0]+40,h);g.fill()}}),230,50,0,14,-70);
   BG(gB(70,.2,30),0xe8eef8,0,-.62,-8);for(const s_ of[-1,1])BG(gC(.4,.45,7,12),0xc81e2e,s_*4.2,3.2,-8);BG(gB(11,.6,.9),0x15131a,0,6.9,-8);BG(gB(10,.4,.6),0xc81e2e,0,5.6,-8);
   const rope=M(gT(4.2,.18,8,24,3.14),0xe8dcc0,[0,5.2,-7.6],stage,1);rope.rotation.z=Math.PI;for(let i=-2;i<=2;i++)M(gB(.3,.7,.05),0xf4f0e6,[i*1.4,4.5+Math.abs(i)*.2,-7.4],stage,0);
   for(let i=0;i<5;i++)BG(gB(7-i*.9,.4,1.2),0x8a8a96,0,-.4+i*.4,-10.5-i*1.2);
   [["bell",-5.6,-2.2],["taiko",5.6,-2],["slantern",-3.4,-2.6],["rock",3.4,-2.6],["rune",-1.6,-2.8,1,0,0xd6222c],["slantern",1.6,-2.8,.9],["rock",-7.6,-.6],["bell",7.6,-.8,.9,-.5],["slantern",6.8,.9,.8],["rock",-6.8,.9,.8],
    ["taiko",-7.9,-2.5,.8,.4],["rune",7.9,-2.5,.9,0,0xd6222c],["rock",4.6,-2.9,.8],["slantern",-4.6,-2.9,.7],["rock",2.8,2.5,.5],["rock",-2.7,2.5,.5]].forEach(a=>addProp(...a))}},
 {n:"Wolkenarena",en:"Cloud Arena",own:"seraph",bgk:"stone",cols:[0xffe98a,0x25d4ff],fog:0xcfe8ff,fn:28,ff:110,hemi:[0xffffff,0x8090b8,.6],sun:[0xfff6d8,.68],rim:0xffe98a,floor:["#f4f0e6","#c9b48a","slab"],base:0xf4f0e6,trim:0xffc21a,amb:[0xffe98a,60,"float"],
  build(){layer(sky([[0,"#2a7ad0"],[.55,"#8ac8ff"],[1,"#e8f6ff"]],(g,w,h)=>{disc(g,w*.7,h*.25,40,"#fffbe0","rgba(255,250,200,.6)");clouds(g,w,h,"rgba(255,255,255,.95)",14,.6,.95)}),260,120,0,30,-90,{opaque:1});
   for(let i=0;i<26;i++){const x=rnd(-16,16),z=rnd(-12,4);const m=M(gS(rnd(1.2,2.6),14,10),0xffffff,[x,rnd(-2.6,-1.4),z],stage,0);m.scale.y=.55}
   for(const x of[-10,-6.5,6.5,10]){BG(gC(.55,.65,7,16),0xf4f0e6,x,2.5,-7);BG(gB(1.6,.4,1.6),0xffc21a,x,6.1,-7)}const gate=M(gT(3.2,.35,10,32,3.14),0xffc21a,[0,3.2,-9],stage,1,0x8a6a10);BG(gC(.4,.4,3.2,12),0xffc21a,-3.2,1.6,-9);BG(gC(.4,.4,3.2,12),0xffc21a,3.2,1.6,-9);
   [["pillar",-5.7,-2],["pillar",5.8,-2],["statue",-3.3,-2.6],["statue",3.3,-2.6,1,3.14],["urn",-1.5,-2.6],["urn",1.6,-2.6],["shield",-7.7,-.8],["crystal",7.7,-.7,1,0,0xffe14d],["urn",6.8,.9,.9],["shield",-6.8,.9,.8],
    ["crystal",-7.9,-2.5,.9,0,0xffe14d],["pillar",8,-2.5,.9],["urn",4.6,-2.9,.8],["crystal",-4.6,-2.9,.7,0,0xffe14d],["urn",2.8,2.5,.6],["shield",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Thron der Leere",en:"Throne of the Void",own:"kaiser",bgk:"stone",cols:[0x9a3cff,0xff2a4a],fog:0x0a0414,fn:22,ff:80,hemi:[0x9a7ac0,0x0a0414,.55],sun:[0xc0a0ff,.5],rim:0x9a3cff,floor:["#1c1428","#0a0612","void"],base:0x0a0612,trim:0x5a2ea6,te:0x10041c,amb:[0xc46bff,80,"rise"],
  build(){layer(sky([[0,"#02010a"],[.5,"#1a0a3a"],[1,"#3a0a4a"]],(g,w,h)=>{stars(g,w,h,240);const gr=g.createRadialGradient(w*.5,h*.38,10,w*.5,h*.38,170);gr.addColorStop(0,"#000");gr.addColorStop(.45,"#000");gr.addColorStop(.5,"#c46bff");gr.addColorStop(.62,"rgba(255,42,74,.5)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,w,h)}),260,120,0,32,-90,{opaque:1});
   for(let i=0;i<10;i++){const x=rnd(-16,16),y=rnd(1,9),z=rnd(-14,-7),r=M(gD(rnd(.6,1.4)),0x2a2034,[x,y,z],stage,1,0,"stone");r.rotation.set(rnd(3),rnd(3),0);M(gK(.25,.9,5),0x9a3cff,[x,y+.9,z],stage,0,0x9a3cff)}
   BG(gB(3.6,7,1),0x15131a,0,2.8,-9);BG(gB(4.6,1,2),0x2a1c4e,0,.2,-8.6);BG(gB(4.6,.5,.5),0xffc21a,0,6.5,-9);for(let i=-2;i<=2;i++)M(gK(.22,1.2,5),0xffc21a,[i*.9,7.3+((i+2)%2)*.3,-9],stage,1,0x553300);M(gO(.4),0xff2a4a,[0,4.8,-8.45],stage,0,0xff2a4a);
   [["crystal",-5.6,-2,1,0,0x9a3cff],["crystal",5.7,-2,1.1,0,0xff2a4a],["rock",-3.3,-2.6],["rock",3.4,-2.6,1.1],["skull",0,-2.9,1.1],["rune",-1.9,-2.8,1,0,0x9a3cff],["rune",2,-2.8,1,0,0x9a3cff],["chainpost",-7.7,-.6],["chainpost",7.7,-.6,1,3.14],["crystal",7.2,.9,.8,0,0x9a3cff],
    ["rock",-7,.9,.8],["crystal",-4.4,-2.9,.9,0,0xff2a4a],["rock",4.6,-2.9,.8],["crystal",-2.6,2.5,.55,0,0x9a3cff],["rock",2.8,2.5,.5]].forEach(a=>addProp(...a))}},
 {n:"Formel-Bibliothek",en:"Formula Library",own:"magus",bgk:"wood",cols:[0x3dffd0,0xffc21a],fog:0x10201c,fn:24,ff:85,hemi:[0xb0e0d0,0x1a1410,.6],sun:[0xe0ffe8,.6],rim:0x3dffd0,floor:["#4a3420","#2a1a10","plank"],base:0x2a1a10,trim:0x3dffd0,amb:[0x3dffd0,70,"float"],
  build(){layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#1a120a";g.fillRect(0,0,w,h);for(let r=0;r<6;r++)for(let x=0;x<w;){const bw=R(10,22),bh=R(46,70);g.fillStyle=P(["#7a2a1e","#2a4a6a","#3a6a3a","#6a5a2a","#4a2a5a","#8a6a3a"]);g.fillRect(x,r*82+80-bh,bw,bh);x+=bw+R(1,3)}
     for(let r=0;r<7;r++){g.fillStyle="#3a2414";g.fillRect(0,r*82+80,w,10)}g.fillStyle="#0e1a18";g.beginPath();g.moveTo(440,h);g.lineTo(440,160);g.arc(512,160,72,Math.PI,0);g.lineTo(584,h);g.fill();
     const gr=g.createRadialGradient(512,200,10,512,200,160);gr.addColorStop(0,"rgba(61,255,208,.5)");gr.addColorStop(1,"rgba(61,255,208,0)");g.fillStyle=gr;g.fillRect(300,40,424,400)}),84,42,0,13,-14,{opaque:1});
   BG(gB(70,.2,30),0x2a1a10,0,-.62,-8);for(const x of[-10.5,10.5]){BG(gB(3.2,8,1.2),0x3a2414,x,3.4,-6.6);for(let r=0;r<5;r++){BG(gB(3,.1,1),0x2a1a0e,x,.2+r*1.6,-6.5);for(let j=0;j<7;j++)BG(gB(.3,1.1-((r+j)%3)*.15,.8),KIDC[(r+j)%6],x-1.2+j*.4,.8+r*1.6,-6.4)}}
   for(const[t,x,y]of[["π",-5,6.2],["∑",5,6.6],["÷",-2,7.4],["√",2.4,7],["∞",0,5.6]])neon(t,0x3dffd0,x,y,-6,1.6,0,120);
   [["books",-5.6,-2.2],["board",5.6,-2.2],["globe",-3.4,-2.6],["crystal",3.4,-2.6,1,0,0x3dffd0],["books",-1.6,-2.8,.8],["lantern",1.6,-2.8],["board",-7.6,-.8,1,1.2],["globe",7.6,-.6],["books",6.8,.9,.9],["urn",-6.8,.9,.9],
    ["crystal",-7.9,-2.5,.9,0,0x3dffd0],["books",7.9,-2.5,.9],["globe",4.6,-2.9,.8],["books",-4.6,-2.9,.7],["crystal",2.8,2.5,.55,0,0x3dffd0],["books",-2.7,2.5,.6]].forEach(a=>addProp(...a))}}
];
STG.forEach(s=>bi(s,"n",s.n,s.en));
function buildStage(si){
  for(let i=stage.children.length-1;i>=0;i--){const c=stage.children[i];stage.remove(c);c.traverse&&c.traverse(o=>{if(o.material&&o.material.map&&!o.userData.keep){o.material.map.dispose();o.material.dispose()}})}
  for(const t of tiles)sc.remove(t);tiles.length=0;props.length=0;NEONS.length=0;fxClear();
  const s=STG[si];BGK=s.bgk||(si>2?"stone":"wood");sc.background=null;sc.fog=new THREE.Fog(s.fog,s.fn,s.ff);
  const[l1,l2]=s.cols||[0xff5a1a,0x25d4ff];colA.color.setHex(l1);colB.color.setHex(l2);STL.c=[l1,l2];STL.storm=!!s.storm;STL.sky=null;
  hemi.color.setHex(s.hemi[0]);hemi.groundColor.setHex(s.hemi[1]);hemi.intensity=s.hemi[2]*.86;sun.color.setHex(s.sun[0]);sun.intensity=s.sun[1]*.95;rim.color.setHex(s.rim);
  const ft=floorTex(...s.floor);STc={a:new THREE.MeshToonMaterial({map:ft,gradientMap:GRAD,emissive:s.te||0}),b:new THREE.MeshToonMaterial({map:ft,gradientMap:GRAD,color:0xd8d8d8,emissive:s.te||0}),dmg:new THREE.MeshToonMaterial({map:dmgTex(s.floor[0]),gradientMap:GRAD,color:0xb0b0b0})};
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const t=new THREE.Mesh(gB(TW,.3,TW),(i+j)%2?STc.a:STc.b);t.receiveShadow=true;t.hx=(i-(NX-1)/2)*TW;t.hz=(j-(NZ-1)/2)*TW;t.position.set(t.hx,-.15,t.hz);stage.add(t);tiles.push(t)}
  /* Plattform-Unterbau */
  M(gB(NX*TW+.5,.5,NZ*TW+.5),s.trim,[0,-.52,0],stage);M(gB(NX*TW,1.6,NZ*TW),s.base,[0,-1.5,0],stage);M(gB(NX*TW-2,2,NZ*TW-1),s.base,[0,-3.2,0],stage);
  M(gB(NX*TW-.2,.06,NZ*TW-.2),bmat(s.te?0xff5a1a:0x07060a),[0,-.31,0],stage,0);
  for(let i=-3;i<=3;i++)M(gB(.5,.9,.1),s.trim,[i*2.4,-1.3,NZ*TW/2+.04],stage,0);
  s.build();
  /* Stimmungs-Partikel: Blütenblätter, Gischt, Glühwürmchen, Funken */
  const[c,n0,mode]=s.amb,n=Math.max(12,Math.round(n0*QF)),pos=new Float32Array(n*3);for(let i=0;i<n*3;i+=3){pos[i]=rnd(-14,14);pos[i+1]=rnd(0,11);pos[i+2]=rnd(-7,3)}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:c,size:mode=="fall"?.2:mode=="rain"?.09:.14,transparent:true,opacity:.9,fog:false,depthWrite:false}));stage.add(pts);ambient={pts,mode,n};
}
function stepStage(dt,T){
  if(!ambient)return;const a=ambient.pts.geometry.attributes.position,p=a.array,m=ambient.mode;
  for(let i=0;i<ambient.n;i++){const k=i*3;
    if(m=="fall"){p[k]+=(.8+Math.sin(T+i)*.6)*dt;p[k+1]-=(.7+(i%5)*.12)*dt;if(p[k+1]<-.5){p[k+1]=11;p[k]=rnd(-15,13)}}
    else if(m=="rain"){p[k]-=.6*dt;p[k+1]-=(13+(i%5))*dt;if(p[k+1]<-.5){p[k+1]=12;p[k]=rnd(-15,15)}}
    else if(m=="rise"){p[k]+=Math.sin(T*2+i)*.5*dt;p[k+1]+=(1+(i%7)*.25)*dt;if(p[k+1]>11){p[k+1]=-1;p[k]=rnd(-14,14)}}
    else{p[k]+=Math.sin(T*.7+i*1.3)*.35*dt;p[k+1]+=Math.cos(T*.9+i)*.3*dt}}
  a.needsUpdate=true;rim.intensity=.7+Math.sin(T*7)*.08;
  if(STL.storm&&Math.random()<dt*.35){flashLight(0xcfe4ff,6,rnd(-8,8),9);STL.sky&&(STL.sky.material.color.setScalar(1.8),setTimeout(()=>STL.sky&&STL.sky.material.color.setScalar(1),90))}
  for(const n of NEONS){if(n.spin){n.spin.rotation.y+=dt*.4;continue}const f=Math.sin(T*3+n.ph)>.97?.35:1;n.m.material.opacity=f;n.h.material.opacity=.5*f}
}
