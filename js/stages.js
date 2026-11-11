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
  else{g.strokeRect(3,3,250,250);g.strokeStyle="#ff5a1a";g.lineWidth=6;g.shadowColor="#ff3d00";g.shadowBlur=18;for(let k=0;k<2;k++){g.beginPath();g.moveTo(rnd(256),0);g.lineTo(rnd(60,180),rnd(80,160));g.lineTo(rnd(256),256);g.stroke()}g.shadowBlur=0}});
const dmgTex=(base)=>ctex(256,256,g=>{g.fillStyle=base;g.fillRect(0,0,256,256);for(let i=0;i<500;i++){g.fillStyle=`rgba(0,0,0,${rnd(.05,.2)})`;const r=rnd(1,5);g.fillRect(rnd(256),rnd(256),r,r)}g.strokeStyle="#07060a";g.lineWidth=6;for(let i=0;i<6;i++){g.beginPath();let x=128,y=128;g.moveTo(x,y);for(let j=0;j<5;j++){x+=rnd(-60,60);y+=rnd(-60,60);g.lineTo(x,y)}g.stroke()}});
let BGK="wood";const BG=(g,c,x,y,z,e)=>{const m=M(g,c,[x,y,z],stage,1,e,e?undefined:BGK);m.receiveShadow=true;return m};
/* ----- Die fünf Stages ----- */
const STG=[
 {n:"Kirschblüten-Dojo",en:"Cherry Blossom Dojo",cols:[0xff7ab0,0xffc21a],fog:0xf2b9a0,fn:26,ff:95,hemi:[0xfff0e0,0x8a6a70,.64],sun:[0xffe2c0,.7],rim:0xff9ab0,floor:["#a8743e","#5c3a1e","plank"],base:0x5c3a1e,trim:0x8a1a22,amb:[0xffb7d0,70,"fall"],
  build(){layer(sky([[0,"#3b6fc4"],[.45,"#f7a36c"],[.75,"#ffd9a0"],[1,"#ffe9c8"]],(g,w,h)=>{disc(g,w*.68,h*.52,46,"#fff3d0","rgba(255,220,150,.6)");clouds(g,w,h,"rgba(255,235,220,.75)")}),260,120,0,34,-90,{opaque:1});
   layer(hills("#7a6aa0",.75,26,(g,w,h,p)=>{g.fillStyle="#fff";for(let i=10;i<p.length;i+=17){g.beginPath();g.moveTo(p[i][0]-30,p[i][1]+26);g.lineTo(p[i][0],p[i][1]-2);g.lineTo(p[i][0]+30,p[i][1]+26);g.fill()}}),230,50,0,14,-70);
   layer(hills("#3f3558",.5,14,(g,w,h)=>{g.fillStyle="#3f3558";for(const x of[240,760]){for(let i=0;i<4;i++){g.fillRect(x-22+i*4,h*.5-i*30-40,44-i*8,26);g.beginPath();g.moveTo(x-46+i*6,h*.5-i*30-14);g.lineTo(x+46-i*6,h*.5-i*30-14);g.lineTo(x+26-i*4,h*.5-i*30-26);g.lineTo(x-26+i*4,h*.5-i*30-26);g.fill()}}}),190,36,0,7,-48);
   /* Torii */for(const s of[-1,1])BG(gC(.34,.4,7.4,10),0xc81e2e,s*4.2,3.7,-8);BG(gB(11.4,.55,.8),0xc81e2e,0,7.3,-8);BG(gB(12.6,.4,1),0x15131a,0,7.8,-8);BG(gB(9.4,.4,.6),0xc81e2e,0,6,-8);
   /* Kirschbäume */for(const[x,z,s]of[[-11,-7,1.2],[11.5,-6,1.1],[-17,-12,1.5],[17,-13,1.6]]){BG(gC(.3*s,.5*s,4*s,7),0x3a241c,x,2*s,z).rotation.z=x>0?.12:-.12;for(let i=0;i<7;i++)BG(gS(1.5*s,8,6),i%2?0xffb7d0:0xff8fb5,x+rnd(-2,2)*s,4.4*s+rnd(-.6,1.6)*s,z+rnd(-1,1))}
   /* Dojo-Wand */BG(gB(30,.3,.3),0x3a241c,0,3.1,-4.6);for(let i=-6;i<=6;i++)BG(gB(.24,3.2,.24),0x3a241c,i*2.4,1.5,-4.6);const w=M(gB(30,2.6,.08),0xd8cdb0,[0,1.6,-4.7],stage,0);
   [["dummy",-5.8,-1.9],["dummy",5.4,-2.1],["lantern",-3.4,-2.4],["lantern",3.6,-2.4,1,3.14],["vase",-1.5,-2.5],["vase",1.6,-2.5,.9],["shoji",0,-2.7],["taiko",-7.4,-.6,1,.5],["bamboo",7.3,-1.2,1,-.4],["shoji",-4.4,-2.75],["shoji",4.5,-2.75],["crate",6.6,.6,.9],["vase",-6.5,.7,1.1],["lantern",7.9,-2.3],["bamboo",-7.6,-2.3],["vase",2.6,2.4,.7],["crate",-2.9,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Piratenbucht",en:"Pirate Cove",cols:[0x25d4ff,0xffe14d],fog:0x7fc6e8,fn:30,ff:110,hemi:[0xe8f6ff,0x3a5a70,.78],sun:[0xfff0d0,.85],rim:0x7fe0ff,floor:["#9a6a3a","#4a2e18","plank"],base:0x4a2e18,trim:0x2a1a10,amb:[0xffffff,40,"rise"],
  build(){layer(sky([[0,"#1f6fd0"],[.5,"#6fc0f0"],[.62,"#bfe8ff"],[.63,"#1a6a9a"],[1,"#0e3a5a"]],(g,w,h)=>{disc(g,w*.25,h*.2,34,"#fffbe0","rgba(255,250,200,.5)");clouds(g,w,h,"rgba(255,255,255,.9)",10,.1,.5);g.strokeStyle="rgba(255,255,255,.35)";g.lineWidth=2;for(let i=0;i<60;i++){const x=rnd(w),y=h*rnd(.65,1);g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(20,60),y);g.stroke()}}),260,120,0,30,-90,{opaque:1});
   layer(hills("#2a6a5a",.55,22,(g,w,h,p)=>{g.fillStyle="#1f5246";for(let i=4;i<p.length;i+=6){g.fillRect(p[i][0],p[i][1]-26,4,30);g.beginPath();g.ellipse(p[i][0]+2,p[i][1]-28,18,7,.3,0,7);g.fill();g.beginPath();g.ellipse(p[i][0]+2,p[i][1]-28,18,7,-.5,0,7);g.fill()}}),200,34,-40,9,-60);
   layer(ctex(512,512,(g,w,h)=>{g.fillStyle="#1a1418";g.beginPath();g.moveTo(120,h);g.lineTo(90,h-70);g.lineTo(420,h-70);g.lineTo(390,h);g.fill();g.fillRect(250,60,8,h-130);g.fillStyle="#e8dcc0";g.fillRect(170,90,170,110);g.fillRect(190,220,130,90);g.fillStyle="#1a1418";g.beginPath();g.arc(255,145,22,0,7);g.fill();g.fillRect(258,50,40,22)}),30,30,34,11,-40);
   /* Mast, Segel, Reling */BG(gC(.4,.5,22,10),0x5c3a1e,0,10,-6.5);BG(gB(15,.4,.4),0x5c3a1e,0,13.5,-6.5);const s=M(gB(13.5,7,.12),0xf1e7d0,[0,9.6,-6.3],stage,1);s.rotation.x=.06;M(gC(1.4,1.4,.14,16),0x15131a,[0,9.8,-6.2],stage,0).rotation.x=Math.PI/2;BG(gC(1.2,1.4,1,10),0x5c3a1e,0,17.5,-6.5);
   BG(gB(24,.3,.3),0x5c3a1e,0,1.9,-4.2);for(let i=-7;i<=7;i++)BG(gC(.12,.16,1.9,6),0x8a5a30,i*1.6,.95,-4.2);for(const sgn of[-1,1]){const r=BG(gC(.05,.05,20,4),0xc9a26a,sgn*5.4,8,-5.4);r.rotation.z=sgn*.5}
   [["barrel",-5.5,-1.8],["barrel",-6.3,-1.5,.9],["crates",5.6,-2.1],["cannon",-7.6,-.3,1,1.57],["cannon",7.7,-.2,1,-1.57],["wheel",0,-2.8,1.2],["balls",-3.2,-2.5],["balls",6.9,.9,.9],["bottles",2.6,-2.5],["anchor",-1.8,-2.8,1.1],["barrel",3.9,-2.3],["lantern",-4,-2.7],["lantern",4.9,-2.7,1,3.14],["crate",-6.8,.9,.8],["barrel",7.3,-1.9],["bottles",-2.3,2.5,.7],["crate",2.9,2.5,.6],["barrel",-8,-2.2]].forEach(a=>addProp(...a))}},
 {n:"Schattendorf",en:"Shadow Village",cols:[0x7a8cff,0xd8ff8a],fog:0x1a2250,fn:24,ff:90,hemi:[0x9ab0ff,0x1a1a3a,.6],sun:[0xbfd0ff,.6],rim:0x7a8cff,floor:["#33406e","#161c36","roof"],base:0x161c36,trim:0x8a1a22,amb:[0xd8ff8a,36,"float"],
  build(){layer(sky([[0,"#070a20"],[.6,"#1a2a66"],[1,"#3a3a7a"]],(g,w,h)=>{stars(g,w,h);disc(g,w*.5,h*.34,74,"#f4f2dc","rgba(200,210,255,.45)");g.fillStyle="rgba(180,180,210,.5)";for(const[x,y,r]of[[490,150,14],[530,190,9],[505,205,6]]){g.beginPath();g.arc(x,y,r,0,7);g.fill()}clouds(g,w,h,"rgba(40,50,110,.8)",6,.3,.6)}),260,120,0,34,-90,{opaque:1});
   layer(hills("#10163a",.6,18),220,44,0,10,-66);
   layer(ctex(1024,256,(g,w,h)=>{for(let x=0;x<w;x+=rnd(60,110)){const hh=rnd(70,150),ww=rnd(50,90);g.fillStyle="#0b0f26";g.fillRect(x,h-hh,ww,hh);g.beginPath();g.moveTo(x-16,h-hh);g.lineTo(x+ww/2,h-hh-34);g.lineTo(x+ww+16,h-hh);g.fill();g.fillStyle="#ffc85a";for(let i=0;i<3;i++)if(Math.random()<.6)g.fillRect(x+8+i*22,h-hh+rnd(14,50),10,14)}}),170,40,0,8,-40);
   /* Pagode + Dächer */for(let i=0;i<4;i++){BG(gB(7-i*1.2,2,4),0x1c2248,-12,1+i*2.9,-11);const r=BG(gK(5.6-i*.9,1.2,4),0x8a1a22,-12,2.6+i*2.9,-11);r.rotation.y=.785;r.scale.z=.7;M(gB(.6,.9,.1),0xffc85a,[-12,1.1+i*2.9,-8.9],stage,0,0xffa030)}
   for(const[x,z,w]of[[9,-9,9],[17,-12,8],[-22,-14,9]]){BG(gB(w,4,4),0x1c2248,x,2,z);const r=BG(gC(.2,3.4,2.4,4),0x2c3566,x,5,z);r.rotation.y=.785;r.scale.set(w/5,1,.9);M(gB(.7,1,.1),0xffc85a,[x-1.4,2.2,z+2.05],stage,0,0xffa030);M(gB(.7,1,.1),0xffc85a,[x+1.4,2.2,z+2.05],stage,0,0xffa030)}
   BG(gB(26,.5,.5),0x161c36,0,-.1,-3.6);
   [["slantern",-5.6,-1.9],["slantern",5.5,-1.9],["barrel",-3.6,-2.5],["bamboo",0,-2.8,1.2],["umbrella",2.9,-2.5],["target",-1.7,-2.7],["bell",7.5,-.8,1,-.5],["crates",-7.5,-.5],["umbrella",-6.9,-2.5,.9],["target",4.2,-2.8],["lantern",-2.7,-2.9],["lantern",6.7,-2.8,1,3.14],["barrel",7.3,1,.8],["slantern",-6.8,1,.8],["bamboo",-4.6,-2.9],["vase",1.4,-2.5,.8],["crate",-2.6,2.5,.6],["vase",2.8,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Kolosseum der Champions",en:"Colosseum of Champions",cols:[0xff5a1a,0xffc21a],fog:0xe0b070,fn:28,ff:100,hemi:[0xfff0d0,0x6a4a30,.58],sun:[0xffd9a0,.62],rim:0xffa040,floor:["#b09870","#6a5a40","slab"],base:0x8a7650,trim:0x8a1a22,amb:[0xffe6b0,50,"float"],
  build(){layer(sky([[0,"#2a5ab8"],[.5,"#f2a860"],[.8,"#ffd890"],[1,"#fff0c0"]],(g,w,h)=>{disc(g,w*.5,h*.62,60,"#fff6d8","rgba(255,200,120,.6)");clouds(g,w,h,"rgba(255,225,190,.7)",7)}),260,120,0,34,-90,{opaque:1});
   layer(ctex(1024,512,(g,w,h)=>{g.fillStyle="#7a5a40";g.fillRect(0,h*.3,w,h);for(let r=0;r<3;r++)for(let x=10;x<w;x+=64){g.fillStyle="#3a281c";g.beginPath();g.moveTo(x,h*.36+r*110+90);g.lineTo(x,h*.36+r*110+34);g.arc(x+22,h*.36+r*110+34,22,3.14,0);g.lineTo(x+44,h*.36+r*110+90);g.fill()}
     g.fillStyle="#5a4230";g.fillRect(0,h*.3,w,14);for(let i=0;i<400;i++){g.fillStyle=P(["#c81e2e","#ffc21a","#f4f0e6","#25a0d4","#3a281c"]);g.fillRect(rnd(w),h*.3-rnd(2,26),5,7)}}),200,62,0,22,-55);
   for(const x of[-13,-6.5,6.5,13]){for(let i=0;i<6;i++)BG(gC(.75,.8,1.6,12),0xdedae6,x,.8+i*1.6,-8);BG(gB(2.4,.5,2.4),0xcfcad8,x,9.9,-8);const b=M(gB(1.5,5,.08),x*x>100?0x1f4fa8:0xc81e2e,[x,6,-7.1],stage,1);M(gC(.4,.4,.1,10),GOLD,[x,6.6,-7.04],stage,0).rotation.x=Math.PI/2}
   BG(gB(31,1,2.6),0xcfcad8,0,10.6,-8);BG(gB(30,2.4,.6),0xb09a70,0,1.2,-4.4);for(let i=-5;i<=5;i++)M(gB(.9,1.2,.1),0x8a7650,[i*2.7,1.3,-4.06],stage,0);
   [["pillar",-5.7,-2],["pillar",5.8,-2],["statue",-3.2,-2.6],["statue",3.3,-2.6,1,3.14],["urn",-1.4,-2.6],["urn",1.5,-2.6],["rack",0,-2.9],["brazier",-7.7,-.7],["brazier",7.7,-.7],["shield",-4.5,-2.8],["shield",4.6,-2.8],["pillar",-8,-2.5,.9],["pillar",8,-2.5,.9],["urn",6.8,.9,.9],["urn",-6.8,.9,.9],["shield",2.6,2.5,.7],["urn",-2.7,2.5,.6]].forEach(a=>addProp(...a))}},
 {n:"Drachenvulkan",en:"Dragon Volcano",cols:[0xff3b2f,0xff8a00],fog:0x3a0c08,fn:22,ff:85,hemi:[0xffb080,0x2a0a08,.62],sun:[0xff9a60,.7],rim:0xff4a1a,floor:["#2c2428","#120c10","lava"],base:0x1a0e10,trim:0xff5a1a,te:0x551500,amb:[0xff8a2a,90,"rise"],
  build(){layer(sky([[0,"#0c0406"],[.5,"#4a0e0a"],[.8,"#c8380e"],[1,"#ffb040"]],(g,w,h)=>{stars(g,w,h,50);clouds(g,w,h,"rgba(30,10,14,.85)",9,.05,.5);clouds(g,w,h,"rgba(255,90,20,.25)",5,.3,.6)}),260,120,0,34,-90,{opaque:1});
   layer(ctex(1024,512,(g,w,h)=>{for(const[x,ww,hh]of[[220,330,330],[640,420,420],[930,260,250]]){g.fillStyle="#1c0c0e";g.beginPath();g.moveTo(x-ww/2,h);g.lineTo(x-34,h-hh);g.lineTo(x+34,h-hh);g.lineTo(x+ww/2,h);g.fill();
     const gr=g.createRadialGradient(x,h-hh,4,x,h-hh,90);gr.addColorStop(0,"rgba(255,220,120,1)");gr.addColorStop(.3,"rgba(255,90,20,.8)");gr.addColorStop(1,"rgba(255,60,0,0)");g.fillStyle=gr;g.fillRect(x-100,h-hh-100,200,200);
     g.strokeStyle="#ff6a1a";g.lineWidth=6;g.shadowColor="#ff3d00";g.shadowBlur=16;g.beginPath();g.moveTo(x-10,h-hh+4);g.quadraticCurveTo(x-50,h-hh*.5,x-30,h);g.moveTo(x+14,h-hh+4);g.quadraticCurveTo(x+60,h-hh*.6,x+90,h);g.stroke();g.shadowBlur=0}}),210,80,0,24,-62);
   layer(hills("#140809",.5,30),190,30,0,5,-36);
   for(const[x,z,s]of[[-12,-8,2.4],[12.5,-9,2.8],[-19,-13,3.4],[19,-12,3],[0,-12,2]]){const r=BG(gK(1.6*s,3.6*s,6),0x24181c,x,1.8*s,z);r.rotation.y=x;BG(gD(.9*s),0x2c1e22,x+s,.5*s,z+1)}
   /* Lavasee */const lv=M(gB(120,.2,40),0xff5a1a,[0,-2.4,-16],stage,0,0xff3d00);
   for(const x of[-9.5,9.5]){BG(gC(.5,.7,9,6),0x24181c,x,4.5,-5.5);M(gB(.3,7,.3),0xff5a1a,[x,4.5,-5.05],stage,0,0xff3d00)}
   [["crystal",-5.6,-2],["crystal",5.7,-2,1.1],["rock",-3.3,-2.6],["rock",3.4,-2.6,1.1],["skull",0,-2.7,1.3],["rune",-1.9,-2.8],["rune",2,-2.8],["chainpost",-7.7,-.6],["chainpost",7.7,-.6,1,3.14],["ribs",-6.6,-2.6,1,.3],["ribs",6.6,-2.6,1,-.3],["crystal",7.2,.9,.8],["rock",-7,.9,.8],["crystal",-4.4,-2.9,.9],["rock",4.6,-2.9,.8],["crystal",-2.6,2.5,.55],["rock",2.8,2.5,.5],["skull",-8.2,-2.4,.8,.6]].forEach(a=>addProp(...a))}},
];
STG.forEach(s=>bi(s,"n",s.n,s.en));
function buildStage(si){
  for(let i=stage.children.length-1;i>=0;i--){const c=stage.children[i];stage.remove(c);c.traverse&&c.traverse(o=>{if(o.material&&o.material.map&&!o.userData.keep){o.material.map.dispose();o.material.dispose()}})}
  for(const t of tiles)sc.remove(t);tiles.length=0;props.length=0;fxClear();
  const s=STG[si];BGK=si>2?"stone":"wood";sc.background=null;sc.fog=new THREE.Fog(s.fog,s.fn,s.ff);
  const[l1,l2]=s.cols||[0xff5a1a,0x25d4ff];colA.color.setHex(l1);colB.color.setHex(l2);STL.c=[l1,l2];
  hemi.color.setHex(s.hemi[0]);hemi.groundColor.setHex(s.hemi[1]);hemi.intensity=s.hemi[2]*.86;sun.color.setHex(s.sun[0]);sun.intensity=s.sun[1]*.95;rim.color.setHex(s.rim);
  const ft=floorTex(...s.floor);STc={a:new THREE.MeshToonMaterial({map:ft,gradientMap:GRAD,emissive:s.te||0}),b:new THREE.MeshToonMaterial({map:ft,gradientMap:GRAD,color:0xd8d8d8,emissive:s.te||0}),dmg:new THREE.MeshToonMaterial({map:dmgTex(s.floor[0]),gradientMap:GRAD,color:0xb0b0b0})};
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const t=new THREE.Mesh(gB(TW,.3,TW),(i+j)%2?STc.a:STc.b);t.receiveShadow=true;t.hx=(i-(NX-1)/2)*TW;t.hz=(j-(NZ-1)/2)*TW;t.position.set(t.hx,-.15,t.hz);stage.add(t);tiles.push(t)}
  /* Plattform-Unterbau */
  M(gB(NX*TW+.5,.5,NZ*TW+.5),s.trim,[0,-.52,0],stage);M(gB(NX*TW,1.6,NZ*TW),s.base,[0,-1.5,0],stage);M(gB(NX*TW-2,2,NZ*TW-1),s.base,[0,-3.2,0],stage);
  M(gB(NX*TW-.2,.06,NZ*TW-.2),bmat(s.te?0xff5a1a:0x07060a),[0,-.31,0],stage,0);
  for(let i=-3;i<=3;i++)M(gB(.5,.9,.1),s.trim,[i*2.4,-1.3,NZ*TW/2+.04],stage,0);
  s.build();
  /* Stimmungs-Partikel: Blütenblätter, Gischt, Glühwürmchen, Funken */
  const[c,n,mode]=s.amb,pos=new Float32Array(n*3);for(let i=0;i<n*3;i+=3){pos[i]=rnd(-14,14);pos[i+1]=rnd(0,11);pos[i+2]=rnd(-7,3)}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:c,size:mode=="fall"?.2:.14,transparent:true,opacity:.9,fog:false,depthWrite:false}));stage.add(pts);ambient={pts,mode,n};
}
function stepStage(dt,T){
  if(!ambient)return;const a=ambient.pts.geometry.attributes.position,p=a.array,m=ambient.mode;
  for(let i=0;i<ambient.n;i++){const k=i*3;
    if(m=="fall"){p[k]+=(.8+Math.sin(T+i)*.6)*dt;p[k+1]-=(.7+(i%5)*.12)*dt;if(p[k+1]<-.5){p[k+1]=11;p[k]=rnd(-15,13)}}
    else if(m=="rise"){p[k]+=Math.sin(T*2+i)*.5*dt;p[k+1]+=(1+(i%7)*.25)*dt;if(p[k+1]>11){p[k+1]=-1;p[k]=rnd(-14,14)}}
    else{p[k]+=Math.sin(T*.7+i*1.3)*.35*dt;p[k+1]+=Math.cos(T*.9+i)*.3*dt}}
  a.needsUpdate=true;rim.intensity=.7+Math.sin(T*7)*.08;
}
