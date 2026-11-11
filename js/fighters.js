/* ---------- Kämpfer: Gelenk-Skelett, Anime-Gesichter, Ausrüstung, Posen ---------- */
const FACE=Math.PI/2-.5,Z3=[0,0,0];
const JN=["hp","sp","ch","hd","aL","eL","aR","eR","lL","kL","lR","kR"];
/* Posen für einen nach rechts blickenden Kämpfer. L = Arm/Bein zur Kamera, R = hinten. [rx,ry,rz] */
const POSE={
  idle:{sp:[.12,0,0],ch:[.04,-.3,0],hd:[-.06,.3,0],aL:[-1,0,-.2],eL:[-1.5,0,0],aR:[-.55,0,.35],eR:[-1.9,0,0],lL:[-.5,0,-.1],kL:[.65,0,0],lR:[.35,0,.2],kR:[.3,0,0]},
  run:{sp:[.6,0,0],hd:[-.45,0,0],aL:[1.1,0,-.35],eL:[-.25,0,0],aR:[1.1,0,.35],eR:[-.25,0,0]},
  windup:{sp:[.1,0,0],ch:[0,-.7,0],hd:[0,.5,0],aL:[.5,0,-.4],eL:[-2,0,0],aR:[-.7,0,.3],eR:[-1.8,0,0],lL:[-.45,0,-.1],kL:[.7,0,0],lR:[.4,0,.2],kR:[.35,0,0]},
  jab:{sp:[.22,0,0],ch:[.05,.55,0],hd:[-.1,-.3,0],aL:[-1.5,0,.12],eL:[0,0,0],aR:[.2,0,.35],eR:[-2.1,0,0],lL:[-.8,0,-.1],kL:[.95,0,0],lR:[.55,0,.15],kR:[.15,0,0]},
  cross:{sp:[.3,0,0],ch:[.05,-.85,0],hd:[-.1,.7,0],aR:[-1.55,0,-.3],eR:[0,0,0],aL:[.1,0,-.4],eL:[-2.1,0,0],lL:[-.85,0,-.1],kL:[1,0,0],lR:[.6,0,.15],kR:[.1,0,0]},
  upper:{sp:[-.22,0,0],ch:[-.1,.5,0],hd:[-.35,-.2,0],aL:[-2.75,0,.05],eL:[-.5,0,0],aR:[.5,0,.4],eR:[-1.4,0,0],lL:[-.15,0,-.1],kL:[.1,0,0],lR:[.25,0,.15],kR:[.5,0,0]},
  crouch:{sp:[.5,0,0],hd:[-.3,0,0],aL:[.5,0,-.4],eL:[-1.2,0,0],aR:[.5,0,.4],eR:[-1.2,0,0],lL:[-1.1,0,-.15],kL:[1.7,0,0],lR:[-.5,0,.2],kR:[1.5,0,0]},
  kickCh:{sp:[.1,0,0],aL:[.4,0,-.9],eL:[-.6,0,0],aR:[-.5,0,.9],eR:[-.8,0,0],lL:[-1.9,0,0],kL:[2.1,0,0],lR:[.3,0,.1],kR:[1.1,0,0]},
  kick:{sp:[-.5,0,0],ch:[0,.3,0],hd:[.4,0,0],aL:[.7,0,-1],eL:[-.4,0,0],aR:[-.9,0,.9],eR:[-.6,0,0],lL:[-1.45,0,0],kL:[0,0,0],lR:[.55,0,.1],kR:[1.3,0,0]},
  grab:{sp:[.4,0,0],hd:[-.3,0,0],aL:[-1.4,0,.25],eL:[-.35,0,0],aR:[-1.4,0,-.25],eR:[-.35,0,0],lL:[-.8,0,-.1],kL:[.9,0,0],lR:[.5,0,.15],kR:[.2,0,0]},
  lift:{sp:[-.12,0,0],hd:[-.3,0,0],aL:[-3,0,-.18],eL:[0,0,0],aR:[-3,0,.18],eR:[0,0,0],lL:[-.25,0,-.3],kL:[.4,0,0],lR:[.05,0,.3],kR:[.3,0,0]},
  hurl:{sp:[.7,0,0],hd:[-.5,0,0],aL:[-1.2,0,.1],eL:[0,0,0],aR:[-1,0,-.1],eR:[0,0,0],lL:[-.9,0,-.1],kL:[1,0,0],lR:[.6,0,.15],kR:[.1,0,0]},
  hurt:{sp:[-.4,0,0],ch:[0,-.3,0],hd:[-.5,0,.2],aL:[.4,0,-.7],eL:[-.7,0,0],aR:[.5,0,.7],eR:[-.6,0,0],lL:[-.25,0,-.1],kL:[.55,0,0],lR:[.3,0,.15],kR:[.45,0,0]},
  air:{sp:[.5,0,0],hd:[.4,0,0],aL:[-1.2,0,-.9],eL:[-.5,0,0],aR:[-.9,0,.9],eR:[-.5,0,0],lL:[-1,0,-.2],kL:[1.1,0,0],lR:[-.5,0,.2],kR:[.9,0,0]},
  held:{sp:[-.3,0,0],hd:[-.4,0,0],aL:[.5,0,-1.1],eL:[-.4,0,0],aR:[.5,0,1.1],eR:[-.4,0,0],lL:[-.3,0,-.3],kL:[.7,0,0],lR:[.2,0,.3],kR:[.9,0,0]},
  down:{sp:[-.08,0,0],hd:[-.2,0,.3],aL:[-.2,0,-1.2],eL:[-.5,0,0],aR:[-.1,0,1.3],eR:[-.3,0,0],lL:[-.2,0,-.25],kL:[.5,0,0],lR:[0,0,.3],kR:[.1,0,0]},
  charge:{sp:[.28,0,0],hd:[.2,.2,0],aL:[.15,0,-.75],eL:[-1.5,0,0],aR:[.15,0,.75],eR:[-1.5,0,0],lL:[-.6,0,-.4],kL:[.9,0,0],lR:[-.1,0,.4],kR:[.7,0,0]},
  strike:{sp:[.35,0,0],ch:[0,.2,0],hd:[-.3,0,0],aL:[-1.55,0,.2],eL:[0,0,0],aR:[-1.5,0,-.2],eR:[0,0,0],lL:[-.9,0,-.1],kL:[1,0,0],lR:[.65,0,.15],kR:[.05,0,0]},
  skyfall:{sp:[.5,0,0],hd:[-.3,0,0],aL:[-2.6,0,.1],eL:[-.9,0,0],aR:[-2.6,0,-.1],eR:[-.9,0,0],lL:[-1.1,0,0],kL:[1.8,0,0],lR:[-.4,0,0],kR:[1.6,0,0]},
  slide:{sp:[-.75,0,0],hd:[.5,0,0],aL:[.9,0,-.5],eL:[-.3,0,0],aR:[.7,0,.6],eR:[-.3,0,0],lL:[-.85,0,0],kL:[.05,0,0],lR:[-.9,0,.25],kR:[2.1,0,0]},
  dizzy:{sp:[.15,0,0],hd:[.3,0,.2],aL:[-.3,0,-.5],eL:[-.4,0,0],aR:[-.2,0,.6],eR:[-.5,0,0],lL:[-.35,0,-.15],kL:[.6,0,0],lR:[.2,0,.2],kR:[.4,0,0]},
  bat:{sp:[.1,0,0],ch:[0,-.9,0],hd:[0,.8,0],aL:[-1.3,0,.9],eL:[-1.2,0,0],aR:[-1.4,0,.2],eR:[-1.4,0,0],lL:[-.5,0,-.2],kL:[.6,0,0],lR:[.3,0,.3],kR:[.4,0,0]},
  stumble:{sp:[.5,0,0],ch:[0,.4,0],hd:[.5,0,-.2],aL:[-.4,0,-1.2],eL:[-.6,0,0],aR:[.7,0,1],eR:[-.9,0,0],lL:[-.6,0,-.2],kL:[.9,0,0],lR:[.5,0,.1],kR:[.6,0,0]},
  win:{sp:[-.1,0,0],ch:[0,-.2,0],hd:[-.2,.4,0],aL:[-3,0,-.25],eL:[-.2,0,0],aR:[0,0,.55],eR:[-1.5,0,0],lL:[-.1,0,-.15],kL:[.1,0,0],lR:[.1,0,.2],kR:[.1,0,0]},
};
/* Anime-Gesicht als Textur: grosse Augen mit Verlauf und Glanzlichtern, Brauen, Mund, Narben, Masken */
function faceTex(ch){const o=ch.face||{};return ctex(1024,512,g=>{g.scale(2,2);
  g.fillStyle=hex(ch.skin);g.fillRect(0,0,512,256);const cx=128,ey=124;
  let sh=g.createLinearGradient(0,40,0,96);sh.addColorStop(0,"rgba(40,10,30,.3)");sh.addColorStop(1,"rgba(40,10,30,0)");g.fillStyle=sh;g.fillRect(0,0,512,96);
  sh=g.createLinearGradient(0,170,0,256);sh.addColorStop(0,"rgba(60,20,30,0)");sh.addColorStop(1,"rgba(60,20,30,.28)");g.fillStyle=sh;g.fillRect(0,170,512,86);
  if(o.lash||o.blush){g.fillStyle="rgba(255,90,110,.22)";for(const s of[-1,1]){g.beginPath();g.ellipse(cx+s*44,ey+24,13,7,0,0,7);g.fill()}}
  if(o.beard!=null){g.fillStyle=hex(o.beard);g.beginPath();g.moveTo(cx-66,138);g.quadraticCurveTo(cx,160,cx+66,138);g.lineTo(cx+58,256);g.lineTo(cx-58,256);g.fill();
    g.strokeStyle="rgba(0,0,0,.25)";g.lineWidth=1.5;for(let i=-5;i<=5;i++){g.beginPath();g.moveTo(cx+i*10,160);g.lineTo(cx+i*9,250);g.stroke()}}
  if(o.mask!=null){g.fillStyle=hex(o.mask);g.fillRect(0,144,512,112);g.strokeStyle="rgba(255,255,255,.12)";g.lineWidth=2;g.beginPath();g.moveTo(cx-70,146);g.quadraticCurveTo(cx,138,cx+70,146);g.stroke()}
  if(o.visor!=null){g.fillStyle="#0c0f18";g.fillRect(cx-78,ey-22,156,40);const v=g.createLinearGradient(0,ey-13,0,ey+7);v.addColorStop(0,"#fff");v.addColorStop(.35,hex(o.visor));v.addColorStop(1,"#0a3a55");g.fillStyle=v;g.fillRect(cx-70,ey-13,140,20);
    g.fillStyle="rgba(255,255,255,.8)";g.fillRect(cx-64,ey-10,34,3);g.fillStyle="#0c0f18";for(let i=-3;i<=3;i++)g.fillRect(cx+i*20-1,ey-13,2,20)}
  else for(const s of[-1,1]){const ex=cx+s*29,ix=ex-s*17,ox=ex+s*18;
    if(o.glow!=null){g.fillStyle="#0a0810";g.beginPath();g.ellipse(ex,ey-1,23,16,0,0,7);g.fill();g.shadowColor=hex(o.glow);g.shadowBlur=10;g.fillStyle=hex(o.glow);g.beginPath();g.moveTo(ix,ey+3);g.lineTo(ox,ey-11);g.lineTo(ox-s*2,ey+5);g.lineTo(ix+s*5,ey+9);g.fill();g.shadowBlur=0;
      g.fillStyle="#fff";g.beginPath();g.ellipse(ex+s*4,ey-2,5,2.5,-s*.4,0,7);g.fill()}
    else{g.fillStyle="#fff";g.beginPath();g.moveTo(ix,ey-2);g.quadraticCurveTo(ex,ey-19,ox,ey-9);g.quadraticCurveTo(ox+s,ey+10,ex,ey+13);g.quadraticCurveTo(ix+s*2,ey+10,ix,ey-2);g.fill();
      g.save();g.clip();const ir=g.createLinearGradient(0,ey-14,0,ey+13);ir.addColorStop(0,"#16101e");ir.addColorStop(.35,hex(ch.eye));ir.addColorStop(1,"#ffffff");
      g.fillStyle=ir;g.beginPath();g.ellipse(ex,ey-1,10,14,0,0,7);g.fill();g.strokeStyle="#16101e";g.lineWidth=1.6;g.stroke();
      g.fillStyle="#0c0812";g.beginPath();g.ellipse(ex,ey-2,4.2,7,0,0,7);g.fill();
      g.fillStyle="rgba(0,0,0,.28)";g.fillRect(ex-20,ey-20,40,11);
      g.fillStyle="#fff";g.beginPath();g.arc(ex-4,ey-7,3.6,0,7);g.fill();g.beginPath();g.arc(ex+4,ey+6,1.8,0,7);g.fill();g.restore();
      g.strokeStyle="#15101c";g.lineWidth=5.5;g.lineCap="round";g.beginPath();g.moveTo(ix,ey-2);g.quadraticCurveTo(ex,ey-19,ox,ey-9);g.stroke();
      g.lineWidth=3;g.beginPath();g.moveTo(ox,ey-9);g.lineTo(ox+s*(o.lash?9:5),ey-(o.lash?17:13));g.stroke();
      if(o.lash){g.lineWidth=2;g.beginPath();g.moveTo(ox-s*3,ey-12);g.lineTo(ox+s*5,ey-21);g.stroke()}
      g.lineWidth=2;g.beginPath();g.moveTo(ex-s*8,ey+13);g.lineTo(ox-s*3,ey+9);g.stroke();
      g.strokeStyle="rgba(120,60,60,.4)";g.lineWidth=1.5;g.beginPath();g.moveTo(ix+s*3,ey-17);g.quadraticCurveTo(ex,ey-25,ox-s*2,ey-17);g.stroke()}
    g.fillStyle=hex(o.brow!=null?o.brow:ch.hair[1]);g.beginPath();const by=ey-(o.lash?23:15);g.moveTo(ix-s*3,by);g.lineTo(ox+s*3,ey-30);g.lineTo(ox+s*2,ey-26);g.lineTo(ix-s*2,by+(o.lash?4:7));g.fill()}
  if(o.mask==null){g.strokeStyle="rgba(90,40,40,.45)";g.lineWidth=2;g.beginPath();g.moveTo(cx+2,ey+18);g.lineTo(cx+5,ey+27);g.lineTo(cx,ey+28);g.stroke();
    g.strokeStyle="#3a1a1a";g.lineWidth=3;g.lineCap="round";g.beginPath();g.moveTo(cx-11,ey+45);g.quadraticCurveTo(cx+2,ey+(o.grin?55:43),cx+14,ey+41);g.stroke();
    if(o.grin){g.fillStyle="#fff";g.beginPath();g.moveTo(cx-8,ey+46);g.quadraticCurveTo(cx+2,ey+53,cx+11,ey+44);g.quadraticCurveTo(cx+2,ey+47,cx-8,ey+46);g.fill()}
    if(o.fang){g.fillStyle="#fff";for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*9-3,ey+44);g.lineTo(cx+s*9+3,ey+44);g.lineTo(cx+s*9,ey+55);g.fill()}}}
  if(o.scar){g.strokeStyle="#a83a3a";g.lineWidth=3;g.beginPath();g.moveTo(cx+21,ey-36);g.lineTo(cx+37,ey+28);g.stroke();g.lineWidth=1.5;for(let i=0;i<4;i++){g.beginPath();g.moveTo(cx+19+i*4,ey-22+i*15);g.lineTo(cx+29+i*4,ey-25+i*15);g.stroke()}}
  if(o.marks!=null){g.fillStyle=hex(o.marks);for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*48,ey+16);g.lineTo(cx+s*30,ey+30);g.lineTo(cx+s*50,ey+34);g.fill()}}
  if(o.gem!=null){g.fillStyle=hex(o.gem);g.beginPath();g.moveTo(cx,ey-52);g.lineTo(cx+7,ey-42);g.lineTo(cx,ey-32);g.lineTo(cx-7,ey-42);g.fill();g.fillStyle="#fff";g.fillRect(cx-2,ey-47,2,4)}
})}
const HEADG=(()=>{const n=24,pts=[];for(let i=0;i<=n;i++){const th=i/n*Math.PI,t=Math.max(0,(Math.PI/2-th)/(Math.PI/2));pts.push(new THREE.Vector2(Math.max(.0005,.3*Math.sin(th)*(1-.3*Math.pow(t,1.4))),-.3*Math.cos(th)*(1.12+.16*t)))}
  const g=new THREE.LatheGeometry(pts,28);g.rotateY(-Math.PI/2);return g})();
const limb=(r0,r1,r2,L)=>[[0,-L-r2*.55],[r2*.75,-L-r2*.3],[r2,-L],[lerp(r2,r1,.6),-L*.72],[r1,-L*.4],[lerp(r1,r0,.7),-L*.15],[r0,0],[r0*.8,r0*.45],[0,r0*.7]].map(p=>[+p[0].toFixed(4),+p[1].toFixed(4)]);
function buildFighter(ch,o){if(o)ch=outfit(ch,1);
  const b=ch.b||{},W=b.w||1,S=b.h||1,CL="cloth",SK="skin",ME="metal",HA="hair";
  const root=new THREE.Group(),turn=new THREE.Group(),piv=new THREE.Group(),model=new THREE.Group();
  root.add(turn);turn.add(piv);piv.add(model);piv.position.y=1.6*S;model.position.y=-1.6*S;model.scale.setScalar(S);turn.rotation.y=FACE;
  const J={},flaps=[],grp=(par,x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);par.add(g);return g};
  const sk=ch.skin,top=ch.top,pa=ch.pants,bo=ch.boots!=null?ch.boots:0x1c1a24,gl=ch.glove!=null?ch.glove:sk,wd=ch.wide?1.5:1,kOf=c=>c===sk?SK:CL;
  const X=(g,c,p,par,o=1,e,k)=>M(g,c,p,par,o,e,k||kOf(c));
  J.hp=grp(model,0,1.58,0);X(gL([[0,-.2],[.17,-.17],[.27,-.04],[.275,.06],[.25,.15],[0,.17]],18,W),pa,[0,0,0],J.hp).scale.z=.68;
  J.sp=grp(J.hp,0,.1,0);X(gL([[0,-.03],[.25,0],[ch.fem?.21:.235,.2],[.26,.42],[0,.45]],18,W),ch.belly!=null?ch.belly:top,[0,0,0],J.sp).scale.z=.7;
  J.ch=grp(J.sp,0,.4,0);X(gL(ch.fem?[[0,-.03],[.23,0],[.31,.16],[.345,.3],[.33,.45],[.2,.56],[.1,.63],[0,.64]]:[[0,-.03],[.26,0],[.33,.16],[.385,.34],[.37,.46],[.22,.57],[.11,.63],[0,.64]],20,W),top,[0,0,0],J.ch).scale.z=.6;
  X(gC(.085*W,.1*W,.24,12),sk,[0,.68,0],J.ch,0);
  J.hd=grp(J.ch,0,.71,0);
  const hm=new THREE.MeshToonMaterial({map:faceTex(ch),gradientMap:GRAD});hm.onBeforeCompile=rimShader;M(HEADG,hm,[0,.3,0],J.hd);
  if(!ch.noEars)for(const s of[-1,1])X(gS(.07,10,8),sk,[s*.285,.28,-.01],J.hd).scale.set(.45,1,.75);
  for(const[s,n]of[[-1,"L"],[1,"R"]]){
    const a=J["a"+n]=grp(J.ch,s*.44*W,.47,0),lg=ch.sleeve=="long";
    X(gL(limb(.125,.12,.095,.56),14,W),lg?top:sk,[0,0,0],a);
    if(ch.sleeve=="short")X(gL([[0,-.27],[.142,-.25],[.148,0],[.11,.09],[0,.1]],14,W),top,[0,0,0],a);
    const e=J["e"+n]=grp(a,0,-.56,0);X(gL(limb(.1,.105,.075,.5),14,W),gl,[0,0,0],e);
    const fc=ch.fist!=null?ch.fist:gl;X(gS(.105*W,14,10),fc,[0,-.58,0],e).scale.set(.9,1.15,.78);X(gS(.045*W,8,6),fc,[0,-.56,.08*W],e,0);J["h"+n]=grp(e,0,-.58,0);
    const l=J["l"+n]=grp(J.hp,s*.17*W,-.08,0);X(gL(limb(.17*wd,.165*wd,.12*wd,.72),14,W),pa,[0,0,0],l);
    const k=J["k"+n]=grp(l,0,-.72,0);X(gL(limb(.125*wd,.13*wd,ch.wide?.2:.085,.62),14,W),ch.shin!=null?ch.shin:pa,[0,0,0],k);
    J["f"+n]=X(gS(.14,14,10),bo,[0,-.7,.1],k);J["f"+n].scale.set(.82*W,.58,1.7);if(bo!==sk)M(gB(.2*W,.045,.44),0x15131a,[0,-.765,.1],k,0);
  }
  const hy=.3,flap=(m,amp=.12,sp=3)=>{flaps.push({m,b:m.rotation.x,amp,sp,ph:rnd(6)});return m};
  /* Griff + Parierstange als Grundlage für Klingenwaffen */
  const hilt=(n,gc,len=.4,rx=2.1)=>{const g=grp(J["h"+n],0,0,0);g.rotation.x=rx;M(gC(.034,.038,len,10),0x1c1822,[0,0,0],g,0);for(let i=0;i<3;i++)M(gC(.04,.04,.03,10),gc,[0,-len*.3+i*len*.3,0],g,0);return g};
  const H={J,W,
    cap(c,o={}){const m=M(geo("cap",()=>new THREE.SphereGeometry(.325,24,14,0,6.2832,0,1.5)),c,[0,hy+.02,-.015],J.hd,1,0,HA);m.rotation.x=o.tilt!=null?o.tilt:-.5;m.scale.set(1.03,1.15,1.06);return m},
    spike(c,x,y,z,rx,rz,l=.42,r=.13){const m=M(gK(r,l,8),c,[x,hy+y,z],J.hd,1,0,HA);m.rotation.set(rx,0,rz);return m},
    bangs(c,n=3){for(let i=0;i<n;i++){const x=(i-(n-1)/2)*.15;H.spike(c,x,.2-Math.abs(x)*.25,.26,Math.PI-.3,-x*1.6,.26,.08)}for(const s of[-1,1])H.spike(c,s*.27,.12,.12,Math.PI-.1,-s*.25,.34,.07)},
    hair(st,c){
      if(st=="bald")return;H.cap(c);
      if(st=="spiky"){H.bangs(c);[[0,.42,.02,.1,0],[-.2,.36,.02,0,.65],[.2,.36,.02,0,-.65],[0,.36,-.2,-.75,0],[-.2,.3,-.2,-.6,.6],[.2,.3,-.2,-.6,-.6],[0,.14,-.34,-1.5,0],[-.3,.14,-.14,-.5,1.3],[.3,.14,-.14,-.5,-1.3],[-.12,.4,.14,.5,.3],[.12,.4,.14,.5,-.3],[-.1,.3,-.3,-1.1,.3],[.1,.3,-.3,-1.1,-.3],[-.26,.26,-.02,-.2,1],[.26,.26,-.02,-.2,-1]].forEach(a=>H.spike(c,...a))}
      if(st=="swept"){H.bangs(c,2);for(let i=-2;i<=2;i++)for(let j=0;j<3;j++)H.spike(c,i*.11,.36-j*.12-Math.abs(i)*.03,-.12-j*.1,-1.1-j*.2,-i*.2,.62,.115)}
      if(st=="long"){H.bangs(c);const m=M(gL([[0,-1.1],[.2,-1.05],[.24,-.5],[.31,0],[.2,.12],[0,.14]],16),c,[0,hy+.02,-.19],J.hd,1,0,HA);m.scale.z=.5;m.rotation.x=.12;flap(m,.06,2);for(const s of[-1,1])M(gL([[0,-.66],[.035,-.62],[.07,-.2],[.06,0],[0,.03]],8),c,[s*.29,hy+.1,.08],J.hd,1,0,HA)}
      if(st=="wild"){H.bangs(c);for(let i=-2;i<=2;i++){H.spike(c,i*.14,.32-Math.abs(i)*.06,-.12,-.9,-i*.45,.6,.14);H.spike(c,i*.15,-.05,-.28,-2.3,-i*.3,.8,.15);H.spike(c,i*.13,.14,-.26,-1.6,-i*.4,.6,.13)}}
      if(st=="pony"){H.bangs(c);M(gS(.14),c,[0,hy+.3,-.3],J.hd,1,0,HA);const t=M(gL([[0,-1],[.06,-.9],[.15,-.4],[.12,0],[0,.06]],12),c,[0,hy+.3,-.4],J.hd,1,0,HA);t.rotation.x=-.5;flap(t,.25,4)}
      if(st=="topknot"){H.bangs(c,2);M(gC(.06,.06,.16,8),c,[0,hy+.42,-.1],J.hd,1,0,HA);M(gS(.11),c,[0,hy+.54,-.12],J.hd,1,0,HA);const t=M(gK(.06,.3,6),c,[0,hy+.5,-.28],J.hd,1,0,HA);t.rotation.x=-2}
      if(st=="buns"){H.bangs(c);for(const s of[-1,1]){M(gS(.15),c,[s*.25,hy+.32,-.05],J.hd,1,0,HA);M(gT(.1,.025,6,12),0xffc21a,[s*.23,hy+.24,-.04],J.hd,0).rotation.set(1.2,0,s*.6);const r=M(gB(.07,.3,.03),0xff3b5c,[s*.31,hy+.1,-.12],J.hd,0);flap(r,.2,4)}}
      if(st=="mohawk"){for(let i=0;i<6;i++)H.spike(c,0,.43-i*.025-(i>2?(i-2)*.09:0),.18-i*.11,.5-i*.36,0,.52,.12)}
      if(st=="short")H.bangs(c);
    },
    hood(c){const m=M(geo("hood",()=>new THREE.SphereGeometry(.36,22,14,0,6.2832,0,1.85)),c,[0,hy+.04,-.04],J.hd,1,0,CL);m.scale.set(1.02,1.12,1);m.rotation.x=-.5;const t=M(gK(.16,.34,10),c,[0,hy+.34,-.3],J.hd,1,0,CL);t.rotation.x=-1.9;return m},
    band(c,tails=1){const m=M(gT(.305,.045,8,24),c,[0,hy+.12,0],J.hd,0,0,CL);m.rotation.x=Math.PI/2;M(gB(.16,.07,.02),0xcfd8e8,[0,hy+.13,.33],J.hd,0,0,ME);
      if(tails)for(const s of[-1,1]){const t=M(gB(.07,.02,.5),c,[s*.06,hy+.1,-.52],J.hd,0,0,CL);t.rotation.set(.3+s*.15,0,0);flap(t,.3,5)}},
    scarf(c,len=.9){const m=M(gT(.2,.1,8,18),c,[0,.63,0],J.ch,1,0,CL);m.rotation.x=Math.PI/2;for(const s of[0,1]){const t=M(gB(.2,.06,len*(1-s*.25)),c,[.08+s*.1,.56-s*.05,-.2-len/2],J.ch,1,0,CL);t.rotation.x=.25+s*.15;flap(t,.25,4.5+s)}},
    cape(c,len=1.5,w=.95,inner){const g=grp(J.ch,0,.55,-.24);M(gB(w,len,.05),c,[0,-len/2,0],g,1,0,CL);if(inner!=null)M(gB(w*.92,len*.96,.02),inner,[0,-len/2,.04],g,0,0,CL);for(let i=0;i<4;i++)M(gK(w/8,.22,4),c,[-w*.375+i*w/4,-len-.08,0],g,0,0,CL).rotation.x=Math.PI;g.rotation.x=.22;flap(g,.14,2.6);return g},
    pads(c,r=.2,spk,k){for(const s of[-1,1]){const m=M(gS(r,14,10),c,[s*.47*W,.52,0],J.ch,1,0,k||ME);m.scale.y=.75;M(gT(r*.92,.025,6,16),0xffc21a,[s*.47*W,.5,0],J.ch,0).rotation.x=Math.PI/2;if(spk!=null){const q=M(gK(.07,.26,8),spk,[s*(.47*W+.1),.68,0],J.ch);q.rotation.z=-s*.5}}},
    belt(c,bk=0xffc21a){M(gC(.285*W,.285*W,.1,18),c,[0,.13,0],J.hp,1,0,CL).scale.z=.72;M(gB(.14,.11,.05),bk,[0,.13,.21*W],J.hp,0,0,ME);for(const s of[-1,1])M(gB(.1,.14,.08),c,[s*.2*W,.06,.15*W],J.hp,0,0,CL)},
    tails(c,len=.9){for(const[x,rz]of[[-.2,.1],[.2,-.1],[-.3,.22],[.3,-.22]]){const g=grp(J.hp,x*W,.05,x*x<.05?-.17:-.02);M(gB(x*x<.05?.3:.1,len,.05),c,[0,-len/2,0],g,1,0,CL);g.rotation.set(.12,0,rz);flap(g,.14,3.4)}},
    skirt(c,len=.5){const m=M(gL([[.5,-len],[.42,-len*.5],[.29,0],[.27,.04]],18,W),c,[0,.02,0],J.hp,1,0,CL);m.scale.z=.8;m.material.side=THREE.DoubleSide},
    plate(c,e){M(gL([[0,-.02],[.3,0],[.36,.2],[.34,.34],[0,.36]],14,W),c,[0,.12,.06],J.ch,1,e,ME).scale.z=.5;M(gB(.42*W,.2,.08),c,[0,.04,.2],J.ch,1,e,ME)},
    emblem(c,y=.34){const m=M(gC(.1,.1,.03,14),c,[0,y,.255],J.ch,0,c);m.rotation.x=Math.PI/2},
    sash(c){const m=M(gB(.12,.86*W,.05),c,[0,.26,.25],J.ch,0,0,CL);m.rotation.z=.75;const n=M(gB(.12,.86*W,.05),c,[0,.26,-.25],J.ch,0,0,CL);n.rotation.z=-.75},
    collar(c){for(const s of[-1,1]){const m=M(gB(.07,.3,.26),c,[s*.19,.68,-.02],J.ch,1,0,CL);m.rotation.z=-s*.25}},
    gaunt(c,r=.19,k){for(const n of["L","R"]){M(gC(.14*W,.12*W,.36,12),c,[0,-.32,0],J["e"+n],1,0,k||ME);M(gS(r*W,14,10),c,[0,-.58,0],J["e"+n],1,0,k||ME)}},
    wraps(c){for(const n of["L","R"])for(let i=0;i<4;i++)M(gC(.1*W,.092*W,.06,12),c,[0,-.12-i*.11,0],J["e"+n],0,0,CL)},
    /* --- Waffen: jede Figur hat ihr eigenes Stück --- */
    katana(n){const g=hilt(n,0xffc21a,.46);M(gC(.1,.1,.025,14),0x2a2030,[0,.25,0],g,1,0,ME);let y=.27;for(let i=0;i<4;i++){const m=M(gB(.02,.4,.07-i*.006),0xeef4ff,[0,y+.2,-i*i*.012],g,1,0,ME);m.rotation.x=-i*.045;y+=.39}const t=M(gK(.035,.16,4),0xeef4ff,[0,y+.06,-.19],g,0,0,ME);t.scale.x=.3;t.rotation.x=-.2},
    cutlass(n){const g=hilt(n,0x8a1a22,.34);const b=M(gT(.12,.022,6,14,3.4),0xffc21a,[0,.08,.1],g,0,0,ME);b.rotation.y=Math.PI/2;b.rotation.z=-1.7;M(gB(.2,.04,.08),0xffc21a,[0,.19,0],g,0,0,ME);
      let y=.2;for(let i=0;i<4;i++){const m=M(gB(.025,.34,.12+i*.018),0xdfe7f2,[0,y+.17,-i*i*.022],g,1,0,ME);m.rotation.x=-i*.09;y+=.32}const t=M(gK(.09,.26,4),0xdfe7f2,[0,y+.08,-.36],g,0,0,ME);t.scale.x=.2;t.rotation.x=-.5},
    kunai(n,c=0xffd83a){const g=hilt(n,c,.24);M(gT(.055,.016,6,12),0x8a94a8,[0,-.19,0],g,0,0,ME);const b=M(gK(.085,.44,4),0xcfd8e8,[0,.36,0],g,1,0,ME);b.scale.z=.3;const e=M(gK(.03,.4,4),c,[0,.34,0],g,0,c);e.scale.z=.5},
    tanto(len,c){const g=grp(J.ch,0,.3,-.3);g.rotation.z=.7;M(gB(.09,len,.05),c,[0,0,0],g,1,0,CL);M(gC(.03,.03,.3,8),0xffc928,[0,len/2+.15,0],g,0);M(gB(.14,.03,.07),0xcfd8e8,[0,len/2,0],g,0,0,ME)},
    flameFists(){for(const n of["L","R"]){const e=J["e"+n];M(gC(.125*W,.11*W,.3,12),0x8a1420,[0,-.3,0],e,1,0,ME);for(const y of[-.17,-.43])M(gC(.13*W,.13*W,.035,12),0xffc21a,[0,y,0],e,0,0,ME);
      for(let i=0;i<3;i++){const f=M(gK(.055,.24-i*.03,6),i?0xff7a1a:0xffe14d,[(i-1)*.06,-.74,0],e,0,i?0xff5a00:0xffc21a);f.rotation.x=Math.PI;flaps.push({m:f,pulse:1,ph:i*2})}}},
    cards(n){const g=grp(J["h"+n],0,-.02,.06);for(let i=-2;i<=2;i++){const m=M(gB(.17,.25,.012),i%2?0x5a2ea6:0xf4f0ff,[i*.085,.13-Math.abs(i)*.012,i*.008],g);m.rotation.z=-i*.3;if(!(i%2))M(gO(.035),0xffc21a,[i*.085,.13,.01],g,0,0xffc21a)}M(gB(.2,.28,.12),0x5a2ea6,[.3*W,.08,.12],J.hp,1,0,CL)},
    armCannon(c){const e=J.eR;M(gC(.17*W,.14*W,.44,14),0x55657f,[0,-.36,0],e,1,0,ME);M(gC(.19*W,.19*W,.06,14),0x1b212e,[0,-.6,0],e,0,0,ME);M(gT(.12,.03,6,14),c,[0,-.63,0],e,0,c).rotation.x=Math.PI/2;M(gC(.1,.1,.02,12),c,[0,-.64,0],e,0,c);
      const l=J.eL;M(gC(.12*W,.11*W,.2,12),0x55657f,[0,-.4,0],l,1,0,ME);M(gB(.02,.95,.12),0xbff4ff,[0,-1.12,0],l,0,c);const h=new THREE.Mesh(gB(.05,1,.2),addMat(c,.35));h.position.set(0,-1.12,0);l.add(h)},
    moonStaff(n){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.3;M(gC(.032,.036,2.3,10),0xcfd8e8,[0,.5,0],g,1,0,ME);const m=M(gT(.26,.05,8,20,4.3),0xffe98a,[0,1.9,0],g,1,0x8a6a10);m.rotation.z=1;M(gO(.1),0xc9b8ff,[0,1.9,0],g,0,0x9a6bff);for(let i=0;i<2;i++){const r=M(gB(.05,.5,.015),0x8a6bff,[.05,1.4-i*.1,0],g,0,0,CL);r.rotation.z=.3+i*.4;flap(r,.3,4)}},
    stoneFists(){for(const n of["L","R"]){const e=J["e"+n];M(gC(.15*W,.13*W,.34,10),0x6a6f7c,[0,-.3,0],e,1,0,"stone");M(gD(.2*W),0x7d8290,[0,-.6,0],e,1,0,"stone");for(let i=0;i<3;i++)M(gK(.045,.14,6),0xd8d8e0,[(i-1)*.1*W,-.78,.04],e,0,0,ME).rotation.x=Math.PI}},
    sai(n,c){const g=hilt(n,c,.26);M(gK(.03,.62,8),0xcfd8e8,[0,.44,0],g,1,0,ME);for(const s of[-1,1]){const m=M(gT(.075,.016,6,10,2.2),0xcfd8e8,[s*.075,.17,0],g,0,0,ME);m.rotation.z=s>0?.45:2.7-.45-.0;M(gK(.018,.16,6),0xcfd8e8,[s*.13,.3,0],g,0,0,ME)}M(gO(.035),c,[0,.76,0],g,0,c)},
    shuriken(c){const g=grp(J.ch,0,.28,-.27);for(let i=0;i<4;i++){const m=M(gK(.06,.3,4),0xcfd8e8,[Math.cos(i*1.57)*.14,Math.sin(i*1.57)*.14,0],g,0,0,ME);m.rotation.z=i*1.57-1.57;m.scale.z=.25}M(gC(.05,.05,.03,10),c,[0,0,0],g,0,c).rotation.x=1.57},
    fans(c){for(const n of["L","R"]){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.1;const m=M(geo("fan",()=>new THREE.CylinderGeometry(.46,.46,.014,18,1,false,-1.1,2.2)),c,[0,.02,0],g,1,0,CL);m.rotation.z=Math.PI/2;m.rotation.y=Math.PI/2;
      for(let i=-2;i<=2;i++){const r=M(gB(.012,.46,.02),0xffc21a,[0,.02+Math.cos(i*.5)*.23,Math.sin(i*.5)*.23],g,0,0,ME);r.rotation.x=i*.5}M(gS(.035,8,6),0xffc21a,[0,.02,0],g,0)}},
    greatsword(n){const g=hilt(n,0xffc21a,.5);M(gB(.34,.06,.1),0x2a1c22,[0,.27,0],g,1,0,ME);for(const s of[-1,1])M(gK(.045,.2,6),0xe8dcc0,[s*.2,.34,0],g,0).rotation.z=-s*.6;
      M(gB(.035,1.5,.26),0x5a1218,[0,1.06,0],g,1,0,ME);M(gB(.045,1.4,.09),0xff7a1a,[0,1.04,0],g,0,0xff5a00);const t=M(gK(.13,.3,4),0x5a1218,[0,1.95,0],g,1,0,ME);t.scale.x=.3;t.rotation.y=.785;
      for(let i=0;i<4;i++)for(const s of[-1,1]){const k=M(gK(.04,.14,4),0x5a1218,[0,.55+i*.34,s*.15],g,0,0,ME);k.rotation.x=s*1.2}},
    kanabo(n){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.1;M(gC(.2,.07,1.6,10),0x3a2c28,[0,.7,0],g,1,0,"wood");for(const y of[.25,.75,1.3])M(gC(.2*(y+.3)/1.5+.03,.2*(y+.3)/1.5+.03,.06,10),0x6a6f7c,[0,y,0],g,0,0,ME);
      for(let i=0;i<10;i++){const a=i*2.1,y=.55+i*.09,r=.07+.13*(y+.1)/1.5;const k=M(gK(.045,.13,6),0xd8d8e0,[Math.cos(a)*r,y,Math.sin(a)*r],g,0,0,ME);k.rotation.z=-Math.cos(a)*1.5;k.rotation.x=Math.sin(a)*1.5}M(gT(.07,.02,6,10),0xc8382e,[0,-.22,0],g,0)},
    lightSword(n){const g=hilt(n,0xffc21a,.4);for(const s of[-1,1]){const w=M(gS(.14,10,8),0xffffff,[0,.26,s*.13],g,1);w.scale.set(.25,.5,1);w.rotation.x=-s*.5}M(gO(.05),0x25d4ff,[0,.22,0],g,0,0x25d4ff);
      M(gB(.03,1.5,.1),0xfffbe0,[0,1.02,0],g,0,0xffe070);const t=M(gK(.05,.2,4),0xfffbe0,[0,1.86,0],g,0,0xffe070);t.scale.x=.4;const h=new THREE.Mesh(gB(.1,1.7,.26),addMat(0xffd040,.3));h.position.y=1.05;g.add(h)},
    scythe(n){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.3;M(gC(.032,.04,2.5,10),0x1c1822,[0,.45,0],g,1,0,ME);for(const y of[-.5,.3,1.2])M(gC(.045,.045,.05,10),0xffc21a,[0,y,0],g,0,0,ME);
      const q=grp(g,0,1.7,0);q.rotation.y=Math.PI/2;const m=M(gT(.7,.05,4,20,1.7),0xcdb8ff,[-.7,0,0],q,1,0x5a2ea6);m.scale.z=.35;M(gO(.09),0xff2a4a,[0,0,0],q,0,0xff2a4a)},
    formulaStaff(n,c){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.3;M(gC(.034,.038,2.3,10),0xffc21a,[0,.5,0],g,1,0,ME);const q=grp(g,0,1.86,0);for(const s of[-1,1])M(gT(.15,.04,8,18),c,[s*.15,0,0],q,1,c);M(gO(.06),0xffffff,[0,0,0],q,0,0xffffff);flaps.push({m:q,spin:2.4})},
    backBlade(len,c){H.tanto(len,c)},
    horns(c,l=.34,out=.5){for(const s of[-1,1]){const m=M(gK(.075,l,10),c,[s*.19,hy+.36,.06],J.hd);m.rotation.z=-s*out;m.rotation.x=.15;M(gT(.06,.018,6,10),0x15131a,[s*(.19+Math.sin(out)*l*.05),hy+.3,.06],J.hd,0).rotation.set(1.57,0,-s*out)}},
    wings(c,sharp){for(const s of[-1,1]){const g=grp(J.ch,s*.16,.42,-.26);g.rotation.set(0,-s*.5,s*.25);
      for(let i=0;i<5;i++){const m=sharp?M(gK(.13,1.2-i*.15,4),c,[s*(.42+i*.06),.4-i*.27,0],g,1,0,CL):M(gS(.3,10,8),c,[s*(.4+i*.05),.42-i*.24,0],g);
        m.rotation.z=-s*(1.1+i*.26);if(sharp)m.scale.z=.3;else m.scale.set(.42,1.6-i*.2,.2)}flaps.push({m:g,b:g.rotation.y,amp:.18*s,sp:3,ph:0,ax:"y"})}},
    tail(c){let p=grp(J.hp,0,-.02,-.16);p.rotation.x=-2;const r=p;for(let i=0;i<5;i++){M(gC(.1-i*.016,.08-i*.016,.3,10),c,[0,.15,0],p,1,0,CL);p=grp(p,0,.3,0);p.rotation.x=.3}const t=M(gK(.1,.26,4),c,[0,.1,0],p);t.scale.z=.4;flap(r,.2,3)},
    tricorn(c,t){const g=grp(J.hd,0,hy+.3,0);const m=M(gC(.5,.46,.06,3),c,[0,0,0],g,1,0,CL);m.rotation.y=Math.PI;M(gC(.22,.27,.22,14),c,[0,.12,0],g,1,0,CL);M(gC(.275,.275,.05,14),t,[0,.04,0],g,0,0,ME);M(gO(.05),t,[0,.12,.26],g,0,0,ME)},
    tophat(c,b){const g=grp(J.hd,0,hy+.27,0);g.rotation.z=-.12;M(gC(.37,.37,.035,20),c,[0,0,0],g,1,0,CL);M(gC(.21,.23,.46,20),c,[0,.24,0],g,1,0,CL);M(gC(.235,.235,.08,20),b,[0,.06,0],g,0,0,CL)},
    halo(c){const m=M(gT(.2,.03,8,24),c,[0,hy+.58,0],J.hd,0,c);m.rotation.x=Math.PI/2-.2;const h=new THREE.Mesh(gT(.2,.07,8,24),addMat(c,.35));h.position.copy(m.position);h.rotation.copy(m.rotation);J.hd.add(h)},
    crown(c){M(gC(.24,.22,.1,14),c,[0,hy+.3,0],J.hd,1,0x553300,ME);for(let i=0;i<5;i++){const a=i/5*6.28;M(gK(.05,.2,4),c,[Math.sin(a)*.22,hy+.44,Math.cos(a)*.22],J.hd,0,0x553300,ME)}M(gO(.05),0xff2a4a,[0,hy+.31,.24],J.hd,0,0xff2a4a)},
    bandana(c){const m=H.cap(c,{tilt:-.3});m.scale.set(1.06,1.17,1.09);M(gS(.07),c,[.2,hy+.1,-.3],J.hd);for(const s of[0,1]){const t=M(gB(.07,.02,.34),c,[.2,hy+.06-s*.06,-.48],J.hd,0);t.rotation.x=.5+s*.3;flap(t,.3,5)}M(gT(.07,.018,6,12),0xffc21a,[-.3,hy-.02,0],J.hd,0,0,ME).rotation.y=1.57},
    antenna(c){M(gC(.015,.015,.4,6),0x8a94a8,[.2,hy+.42,-.05],J.hd,0);M(gS(.05,8,6),c,[.2,hy+.64,-.05],J.hd,0,c)},
    ears(c){for(const s of[-1,1])M(gC(.1,.1,.08,12),c,[s*.3,hy,0],J.hd,1,0,ME).rotation.z=Math.PI/2},
    orbit(c){const g=grp(J.ch,0,.5,0);for(let i=0;i<4;i++){const a=i*1.57;M(gO(.09),c,[Math.cos(a)*.95,Math.sin(i)*.2,Math.sin(a)*.95],g,0,c)}flaps.push({m:g,spin:1.6})},
  };
  H.hair(ch.hair[0],ch.hair[1]);ch.acc&&ch.acc(H);J.hd.scale.setScalar(.9);
  const sh=new THREE.Mesh(gC(1,1,.02,18),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.22,depthWrite:false}));sh.position.y=.03;sh.scale.set(.85*W,1,.55);root.add(sh);
  const cur={};for(const j of JN)cur[j]=[0,0,0];
  return{ch,root,turn,piv,model,J,flaps,cur,tp:POSE.idle,ps:14,sc:S,grounded:true,run:false,sh,ph:rnd(6),bs:2.4+rnd(1.2)};
}
const _v1=new THREE.Vector3(),_v2=new THREE.Vector3();
function animFighter(f,dt,T){
  const k=1-Math.exp(-f.ps*dt),J=f.J,tp=f.tp;
  for(const j of JN){const t=tp[j]||Z3,c=f.cur[j];c[0]+=(t[0]-c[0])*k;c[1]+=(t[1]-c[1])*k;c[2]+=(t[2]-c[2])*k;J[j].rotation.set(c[0],c[1],c[2])}
  if(f.run){const s=Math.sin(T*24+f.ph),c=Math.cos(T*24+f.ph);J.lL.rotation.x=-.5+s*1;J.kL.rotation.x=1-c*.7;J.lR.rotation.x=-.5-s*1;J.kR.rotation.x=1+c*.7}
  else if(tp===POSE.idle){const s=Math.sin(T*f.bs+f.ph);J.sp.rotation.x+=s*.035;J.kL.rotation.x+=s*.07;J.kR.rotation.x+=s*.06;J.lL.rotation.x-=s*.035;J.aL.rotation.x+=s*.07;J.aR.rotation.x-=s*.05;J.hd.rotation.x-=s*.02}
  else if(tp===POSE.dizzy){const s=Math.sin(T*4+f.ph),c=Math.cos(T*4+f.ph);J.sp.rotation.z+=s*.22;J.sp.rotation.x+=c*.16;J.hd.rotation.z-=s*.3;J.aL.rotation.x+=c*.3;J.aR.rotation.x-=c*.3;J.kL.rotation.x+=s*.12}
  for(const fl of f.flaps){if(fl.spin){fl.m.rotation.y+=fl.spin*dt;continue}if(fl.pulse){const q=1+Math.sin(T*14+fl.ph)*.22;fl.m.scale.set(q,1.1+Math.sin(T*19+fl.ph)*.3,q);continue}fl.m.rotation[fl.ax||"x"]=fl.b+Math.sin(T*fl.sp+fl.ph)*fl.amp+(f.run&&!fl.ax?.5:0)}
  J.hp.position.y=1.58;
  if(f.grounded){f.root.updateMatrixWorld(true);const a=_v1.setFromMatrixPosition(J.fL.matrixWorld).y,b=_v2.setFromMatrixPosition(J.fR.matrixWorld).y;J.hp.position.y-=(Math.min(a,b)-f.root.position.y-.082*f.sc)/f.sc}
  f.sh.position.y=.03-f.root.position.y;const q=clamp(1-f.root.position.y*.12,.3,1);f.sh.scale.set(.85*q,1,.55*q);
}
function pose(f,n,sp){f.tp=POSE[n];if(sp)f.ps=sp}
function snapPose(f){for(const j of JN){const t=f.tp[j]||Z3;f.cur[j]=[t[0],t[1],t[2]]}}

/* ---------- Die 15 Kämpfer ----------
   sig = Spezial-Attacke, fin = Finisher, q = Kampfspruch. Die ersten fünf sind von Anfang an spielbar. */
const CH=[
 {id:"raiko",n:"Raiko",ti:"Blitz-Ninja",d:"Schneller als der Donner. Verschläft trotzdem jeden Montag.",q:"Blinzel nicht, sonst verpasst du mich!",skin:0xf2c9a0,hair:["spiky",0xcfeaff],eye:0x1e9bff,top:0x1c2b63,pants:0x23263a,glove:0x11131f,shin:0x11131f,sleeve:"short",
  c:0xffd83a,sig:"Blitzkette",fin:"Gewitter-Grill",st:[3,3,3],acc(H){H.band(0xffc928);H.scarf(0xffc928,1);H.belt(0x11131f);H.emblem(0xffd83a);H.tanto(.9,0x2a2f45);H.kunai("L",0xffd83a)}},
 {id:"akane",n:"Akane",ti:"Flammenfaust",d:"Ihre Fäuste brennen. Ihr Toast leider auch.",q:"Ich hoffe, du magst es heiss!",fem:1,skin:0xf6cfae,hair:["pony",0xd6222c],eye:0xff7a1a,face:{lash:1},top:0xc41f2c,pants:0x1c1822,boots:0xf6cfae,glove:0xf6cfae,sleeve:"none",b:{w:.9,h:.97},
  c:0xff5a1a,sig:"Feuerrad",fin:"Feuertornado",st:[4,2,3],acc(H){H.band(0xffffff);H.sash(0x1c1822);H.belt(0x1c1822,0xffffff);H.flameFists();H.skirt(0xc41f2c,.34)}},
 {id:"rokka",n:"Käpt’n Rokka",ti:"Schrecken der Badewanne",d:"Pirat ohne Schiff. Wird schon in der Pfütze seekrank.",q:"Arrr! Rechnen ist auch nur Schatzsuche.",skin:0xd9a577,hair:["short",0x1a1418],eye:0x2ec4b6,face:{scar:1,grin:1},top:0x18335c,belly:0xf1e7d0,pants:0x2a2230,boots:0x3a2416,shin:0x3a2416,glove:0xd9a577,sleeve:"long",b:{w:1.08},
  c:0x25d4ff,sig:"Breitseite",fin:"Menschliche Kanonenkugel",st:[3,4,2],acc(H){H.bandana(0xc81e2e);H.tails(0x18335c,1);H.belt(0x8a1a22);H.pads(0xffc21a,.15);H.cutlass("L");H.sash(0x8a1a22)}},
 {id:"zeno",n:"Zeno",ti:"Meister der Karten",d:"Zieht immer die richtige Karte. Hat 37 im Ärmel.",q:"Ich spiele … den Sieg aus!",skin:0xf0d2b8,hair:["swept",0x5a2ea6],eye:0xff3dcb,top:0x17151f,belly:0x6a2ea6,pants:0x17151f,glove:0x17151f,sleeve:"long",b:{w:.94,h:1.03},
  c:0xff3dcb,sig:"Kartensturm",fin:"Der grosse Kartentrick",st:[2,3,4],acc(H){H.collar(0x17151f);H.tails(0x17151f,1.1);H.belt(0xffc21a);H.cards("L");H.emblem(0xffc21a,.4);H.gaunt(0x6a2ea6,.12,"cloth")}},
 {id:"tetsu",n:"Tetsu",ti:"Herrenloser Samurai",d:"Ein Schnitt, ein Sieg. Schneidet auch sehr ordentlich Sushi.",q:"…",skin:0xe6bd94,hair:["topknot",0x15131a],eye:0x8a5a2a,face:{scar:1},top:0xd9d5cc,pants:0x232a55,boots:0xe6bd94,sleeve:"long",wide:1,
  c:0xdfe7ff,sig:"Mondsichel",fin:"Tausend Schnitte später",st:[4,3,2],acc(H){H.belt(0x15131a,0x8a1a22);H.katana("L");H.pads(0x8a1a22,.19);H.sash(0x232a55)}},
 {id:"volt",n:"Volt-7",ti:"Kampf-Cyborg",d:"Rechnet schneller als sein Schatten. Akku: meistens 3 %.",q:"Piep. Sieg wird berechnet. Piep.",noEars:1,skin:0xb6c2d2,hair:["bald",0],eye:0x25d4ff,face:{visor:0x25d4ff},top:0x39465e,belly:0x1b212e,pants:0x1b212e,glove:0x39465e,shin:0x39465e,boots:0x25d4ff,sleeve:"long",b:{w:1.1,h:1.02},
  c:0x25d4ff,sig:"Raketenfaust",fin:"Orbital-Laser",st:[3,4,2],acc(H){H.plate(0x55657f);H.emblem(0x25d4ff);H.pads(0x55657f,.22);H.armCannon(0x25d4ff);H.antenna(0xff3b2f);H.ears(0x55657f);H.belt(0x55657f,0x25d4ff)}},
 {id:"luna",n:"Luna",ti:"Mondpriesterin",d:"Der Himmel hört auf sie. Ihr Wecker nicht.",q:"Der Mond ist heute auf meiner Seite.",fem:1,skin:0xf4dccb,hair:["long",0xd8ccff],eye:0x9a6bff,face:{lash:1,gem:0xffe98a},top:0x3a2a7a,pants:0x241a4e,sleeve:"long",wide:1,b:{w:.88,h:.98},
  c:0xc9b8ff,sig:"Sternenregen",fin:"Mondlandung",st:[2,2,5],acc(H){H.moonStaff("L");H.cape(0x241a4e,1.3,.8,0x8a6bff);H.belt(0xffe98a);H.skirt(0x3a2a7a,.7);H.emblem(0xffe98a)}},
 {id:"goro",n:"Goro",ti:"Der Berg",d:"Hat einmal einen Felsen umarmt. Der Felsen hat sich entschuldigt.",q:"Goro zählt bis drei. Meistens.",skin:0xc98d5e,hair:["mohawk",0xff7a1a],eye:0x3a2a1a,face:{beard:0x7a3c12,brow:0x7a3c12},top:0xc98d5e,pants:0x3d4a2a,boots:0x2a2018,sleeve:"none",b:{w:1.38,h:1.1},
  c:0xff8a00,sig:"Felswurf",fin:"Alle Neune",st:[5,4,1],acc(H){H.sash(0x5a3a1a);H.belt(0x5a3a1a,0xd8d8e0);H.stoneFists();H.pads(0x6a6f7c,.2,0xd8d8e0,"stone")}},
 {id:"shade",n:"Shade",ti:"Schatten ohne Namen",d:"Wenn du ihn siehst, ist es zu spät. Er findet aber nie seine Schlüssel.",q:"…war da gerade jemand?",noEars:1,skin:0x2a2636,hair:["bald",0],eye:0xb48aff,face:{glow:0xc8a2ff,mask:0x14121c},top:0x1c1a2a,pants:0x14121c,glove:0x14121c,sleeve:"long",b:{w:.95},
  c:0x9a6bff,sig:"Schattenstacheln",fin:"Klon-Keilerei",st:[3,2,4],acc(H){H.hood(0x1c1a2a);H.scarf(0x7a3cff,1.3);H.sai("L",0x9a6bff);H.sai("R",0x9a6bff);H.shuriken(0x9a6bff);H.belt(0x7a3cff,0xcfd8e8);H.wraps(0x3a3550)}},
 {id:"mika",n:"Mika",ti:"Jadedrache",d:"Klein, flink und mit einem Tritt wie ein Wirbelsturm im Wasserglas.",q:"Zähl ruhig mit, es wird schnell!",fem:1,skin:0xf3cfa6,hair:["buns",0x2a1a14],eye:0x1fa37a,face:{lash:1,grin:1},top:0x1fa37a,pants:0xf4f0e6,boots:0x15131a,sleeve:"short",b:{w:.86,h:.9},
  c:0x3fe06b,sig:"Hundert Tritte",fin:"Jade-Pingpong",st:[3,2,4],acc(H){H.collar(0xffc21a);H.sash(0xffc21a);H.belt(0xffc21a,0x1fa37a);H.wraps(0xffc21a);H.skirt(0x1fa37a,.36);H.fans(0x1fa37a)}},
 {id:"drako",n:"Drako",ti:"Drachenritter",d:"Halb Mensch, halb Drache. Niest besser nicht in der Bibliothek.",q:"Wer hat hier Feuer bestellt?",skin:0xe0a880,hair:["spiky",0x8a1420],eye:0xffc21a,face:{marks:0x8a1420,fang:1},top:0x2a1c22,pants:0x1c1418,glove:0x8a1420,shin:0x8a1420,sleeve:"short",b:{w:1.1,h:1.05},
  c:0xff3b2f,sig:"Drachenatem",fin:"Drachen-Express",st:[4,4,3],acc(H){H.horns(0xe8dcc0,.36,.35);H.wings(0x8a1420,1);H.tail(0x8a1420);H.plate(0x8a1420);H.pads(0x8a1420,.2,0xe8dcc0);H.belt(0xffc21a);H.greatsword("L")}},
 {id:"oni",n:"Oni-Maru",ti:"Roter Dämon",d:"Lacht bei jedem Treffer. Auch bei seinen eigenen blauen Flecken.",q:"HA! HA! HA! … Worum ging es?",skin:0xc8382e,hair:["wild",0xf0ece2],eye:0xffe14d,face:{fang:1,grin:1,brow:0x15131a},top:0xc8382e,pants:0xd9a21a,boots:0xc8382e,sleeve:"none",b:{w:1.3,h:1.12},
  c:0xffc21a,sig:"Donnertrommel",fin:"Home Run",st:[5,4,2],acc(H){H.horns(0xf0ece2,.4,.3);H.kanabo("L");H.belt(0x15131a,0xf0ece2);H.sash(0x15131a);H.skirt(0xd9a21a,.4);H.wraps(0x15131a)}},
 {id:"seraph",n:"Seraph",ti:"Klinge des Himmels",d:"Sein Schwert ist reines Licht. Die Stromrechnung auch.",q:"Fürchte dich nicht. Na gut, ein bisschen.",skin:0xf8e2cc,hair:["long",0xffe9a0],eye:0x25d4ff,top:0xf4f0e6,belly:0xffc21a,pants:0xf4f0e6,glove:0xffc21a,shin:0xffc21a,boots:0xffc21a,sleeve:"long",
  c:0xffe98a,sig:"Lichtlanzen",fin:"Himmelsaufzug",st:[3,3,5],acc(H){H.wings(0xffffff,0);H.halo(0xffe14d);H.plate(0xffc21a);H.pads(0xffc21a,.19);H.lightSword("L");H.belt(0xffc21a,0x25d4ff)}},
 {id:"kaiser",n:"Kaiser Null",ti:"Herrscher der Leere",d:"Hat ein ganzes Reich verschluckt. Hatte danach Bauchweh.",q:"Verbeuge dich. Oder fall einfach um.",skin:0xcdc6dc,hair:["swept",0x15131a],eye:0xff2a4a,face:{marks:0x5a2ea6},top:0x2a1c4e,belly:0x15131a,pants:0x15131a,glove:0x5a2ea6,shin:0x5a2ea6,sleeve:"long",b:{w:1.12,h:1.1},
  c:0x9a3cff,sig:"Schwarzes Loch",fin:"Schwarze Sonne",st:[5,3,3],acc(H){H.crown(0xffc21a);H.cape(0x15131a,1.7,1.1,0x8a1a3a);H.pads(0x5a2ea6,.24,0xffc21a);H.plate(0x5a2ea6);H.collar(0x15131a);H.belt(0xffc21a,0xff2a4a);H.scythe("L")}},
 {id:"magus",n:"Mathemagus",ti:"Herr der Zahlen",d:"Der Endgegner. Kennt jede Formel und fürchtet nur eines: die richtige Antwort.",q:"Zeig mir dein Ergebnis … wenn du dich traust!",noEars:1,skin:0x1a1626,hair:["bald",0],eye:0x3dffd0,face:{glow:0x3dffd0,mask:0x1a1626},top:0x2a5f96,belly:0x163450,pants:0x163450,glove:0x163450,sleeve:"long",wide:1,b:{w:1.05,h:1.14},
  c:0x3dffd0,sig:"Zahlenhagel",fin:"Division durch Null",st:[4,4,4],acc(H){H.hood(0x2a5f96);H.horns(0xffc21a,.5,.75);H.formulaStaff("L",0x3dffd0);H.cape(0x163450,1.7,1.05,0x0f8f7a);H.pads(0xffc21a,.2);H.belt(0xffc21a,0x3dffd0);H.skirt(0x2a5f96,.8);H.orbit(0x3dffd0)}},
];
/* Englische Texte je Figur. Die Felder schalten mit der Sprache um. */
const CH_EN={
 raiko:{ti:"Lightning Ninja",d:"Faster than thunder. Still oversleeps every Monday.",q:"Don’t blink, or you’ll miss me!",sig:"Lightning Chain",fin:"Thunder Grill"},
 akane:{ti:"Flame Fist",d:"Her fists are on fire. So is her toast, sadly.",q:"Hope you like it hot!",sig:"Fire Wheel",fin:"Fire Tornado"},
 rokka:{n:"Captain Rokka",ti:"Terror of the Bathtub",d:"A pirate without a ship. Gets seasick in puddles.",q:"Arrr! Maths is just a treasure hunt.",sig:"Broadside",fin:"Human Cannonball"},
 zeno:{ti:"Card Master",d:"Always draws the right card. Keeps 37 up his sleeve.",q:"I play … the winning card!",sig:"Card Storm",fin:"The Great Card Trick"},
 tetsu:{ti:"Masterless Samurai",d:"One cut, one win. Also slices sushi very neatly.",q:"…",sig:"Crescent Moon",fin:"A Thousand Cuts Later"},
 volt:{ti:"Battle Cyborg",d:"Computes faster than his shadow. Battery: usually 3 %.",q:"Beep. Calculating victory. Beep.",sig:"Rocket Punch",fin:"Orbital Laser"},
 luna:{ti:"Moon Priestess",d:"The sky listens to her. Her alarm clock doesn’t.",q:"The moon is on my side tonight.",sig:"Star Rain",fin:"Moon Landing"},
 goro:{ti:"The Mountain",d:"Once hugged a boulder. The boulder apologised.",q:"Goro count to three. Mostly.",sig:"Rock Toss",fin:"Ten-Pin Takedown"},
 shade:{ti:"Shadow Without a Name",d:"When you see him, it’s too late. He still can’t find his keys.",q:"…was someone just here?",sig:"Shadow Spikes",fin:"Clone Brawl"},
 mika:{ti:"Jade Dragon",d:"Small, quick, and a kick like a hurricane in a teacup.",q:"Count along, this will be fast!",sig:"Hundred Kicks",fin:"Jade Ping-Pong"},
 drako:{ti:"Dragon Knight",d:"Half human, half dragon. Best not sneeze in the library.",q:"Who ordered fire?",sig:"Dragon Breath",fin:"Dragon Express"},
 oni:{ti:"Red Demon",d:"Laughs at every hit. Even at his own bruises.",q:"HA! HA! HA! … What were we doing?",sig:"Thunder Drum",fin:"Home Run"},
 seraph:{ti:"Blade of Heaven",d:"His sword is pure light. So is his electricity bill.",q:"Fear not. Okay, maybe a little.",sig:"Light Lances",fin:"Heaven Elevator"},
 kaiser:{ti:"Lord of the Void",d:"Swallowed a whole empire. Had a tummy ache afterwards.",q:"Bow down. Or just fall over.",sig:"Black Hole",fin:"Black Sun"},
 magus:{ti:"Lord of Numbers",d:"The final boss. Knows every formula and fears only one thing: the right answer.",q:"Show me your answer … if you dare!",sig:"Number Hail",fin:"Division by Zero"},
};
CH.forEach(c=>{const e=CH_EN[c.id];for(const k in e)bi(c,k,c[k],e[k])});
/* Zweites Outfit je Figur. Wird frei, wenn man die Story mit dieser Figur schafft.
   Überschreibt Aussehen und Ausrüstung, Namen und Attacken bleiben. on = Name des Outfits [de, en]. */
const ALT={
 raiko:{on:["Eis-Ninja","Ice Ninja"],hair:["spiky",0x1a2a4a],top:0xeef4ff,belly:0xbfe8ff,pants:0x2a3a6a,glove:0xeef4ff,shin:0x2a3a6a,boots:0x15131a,sleeve:"long",
  acc(H){H.band(0xd6222c);H.scarf(0xd6222c,1.2);H.belt(0xd6222c,0xcfd8e8);H.pads(0xcfd8e8,.17);H.tanto(.9,0xd6222c);H.kunai("L",0x25d4ff)}},
 akane:{on:["Schwarzer Lotus","Black Lotus"],hair:["long",0x8a1420],top:0x15131a,pants:0x15131a,boots:0x15131a,glove:0xffc21a,sleeve:"long",
  acc(H){H.band(0xffc21a);H.sash(0xffc21a);H.belt(0xffc21a,0x15131a);H.flameFists();H.collar(0x15131a)}},
 rokka:{on:["Admiral","Admiral"],top:0xf4f0e6,belly:0x18335c,pants:0x18335c,boots:0x15131a,shin:0x15131a,glove:0xf4f0e6,
  acc(H){H.tricorn(0x15131a,0xffc21a);H.tails(0xf4f0e6,1.1);H.belt(0x15131a,0xffc21a);H.pads(0xffc21a,.17,0xffc21a);H.cutlass("L");H.sash(0xffc21a);H.emblem(0xffc21a)}},
 zeno:{on:["Bühnenmagier","Stage Magician"],hair:["short",0x15131a],top:0x15131a,belly:0xf4f0e6,pants:0x15131a,glove:0xf4f0e6,
  acc(H){H.tophat(0x15131a,0xcc2233);H.cape(0xcc2233,1.4,.9,0x15131a);H.tails(0x15131a,1.1);H.cards("L");H.emblem(0xcc2233,.42);H.collar(0xf4f0e6)}},
 tetsu:{on:["Rote Rüstung","Red Armour"],top:0x8a1a22,belly:0x2a1c22,pants:0x15131a,boots:0x15131a,glove:0x2a1c22,
  acc(H){H.horns(0xffc21a,.3,.9);H.plate(0x8a1a22);H.pads(0x2a1c22,.24,0xffc21a);H.belt(0xffc21a,0x8a1a22);H.katana("L");H.skirt(0x8a1a22,.42)}},
 volt:{on:["Gold-Prototyp","Gold Prototype"],eye:0xff3b2f,face:{visor:0xff3b2f},top:0xd9a21a,belly:0x2a1c22,pants:0x2a1c22,glove:0xd9a21a,shin:0xd9a21a,boots:0xff3b2f,
  acc(H){H.plate(0xb8860b);H.emblem(0xff3b2f);H.pads(0xd9a21a,.24,0xff3b2f);H.armCannon(0xff3b2f);H.antenna(0x25d4ff);H.ears(0xd9a21a);H.belt(0xd9a21a,0xff3b2f)}},
 luna:{on:["Sonnenpriesterin","Sun Priestess"],hair:["buns",0xffd27a],face:{lash:1,gem:0xff7a1a},top:0xf4f0e6,pants:0xffc21a,
  acc(H){H.moonStaff("L");H.cape(0xff7a1a,1.3,.8,0xffc21a);H.belt(0xff7a1a);H.skirt(0xf4f0e6,.7);H.emblem(0xff7a1a);H.halo(0xffc21a)}},
 goro:{on:["Sumo-Champion","Sumo Champion"],hair:["topknot",0x15131a],face:{brow:0x15131a},pants:0xf4f0e6,boots:0xc98d5e,shin:0xc98d5e,
  acc(H){H.belt(0xf4f0e6,0xf4f0e6);H.tails(0xf4f0e6,.6);H.stoneFists()}},
 shade:{on:["Roter Schatten","Crimson Shadow"],face:{glow:0xffe14d,mask:0x2a0a10},top:0x5a0a14,pants:0x2a0a10,glove:0x2a0a10,
  acc(H){H.hood(0x5a0a14);H.scarf(0x15131a,1.5);H.sai("L",0xffe14d);H.sai("R",0xffe14d);H.shuriken(0xffe14d);H.belt(0x15131a,0xffe14d);H.wraps(0x15131a)}},
 mika:{on:["Drachentänzerin","Dragon Dancer"],top:0xd6222c,pants:0xd6222c,boots:0xffc21a,
  acc(H){H.collar(0xffc21a);H.sash(0xffc21a);H.belt(0xffc21a,0xd6222c);H.skirt(0xffc21a,.4);H.fans(0xd6222c);H.scarf(0xffc21a,1)}},
 drako:{on:["Eisdrache","Ice Dragon"],hair:["spiky",0xbfe8ff],eye:0x25d4ff,face:{marks:0x25d4ff,fang:1},top:0x1c2a44,pants:0x15202f,glove:0x2a6aa8,shin:0x2a6aa8,
  acc(H){H.horns(0xffffff,.36,.35);H.wings(0x2a6aa8,1);H.tail(0x2a6aa8);H.plate(0x2a6aa8);H.pads(0x2a6aa8,.2,0xffffff);H.belt(0xbfe8ff);H.greatsword("L")}},
 oni:{on:["Blauer Oni","Blue Oni"],skin:0x2a5fa8,hair:["wild",0x15131a],face:{fang:1,grin:1,brow:0xf0ece2},top:0x2a5fa8,boots:0x2a5fa8,pants:0x15131a,
  acc(H){H.horns(0xffc21a,.46,.25);H.kanabo("L");H.belt(0xd9a21a,0x15131a);H.sash(0xd9a21a);H.skirt(0x15131a,.4);H.wraps(0xd9a21a)}},
 seraph:{on:["Gefallener Engel","Fallen Angel"],hair:["long",0xcfd8e8],eye:0xff2a4a,top:0x15131a,belly:0x5a2ea6,pants:0x15131a,glove:0xcfd8e8,shin:0xcfd8e8,boots:0x15131a,
  acc(H){H.wings(0x15131a,1);H.halo(0xff2a4a);H.plate(0xcfd8e8);H.pads(0xcfd8e8,.19,0xff2a4a);H.lightSword("L");H.belt(0xcfd8e8,0xff2a4a)}},
 kaiser:{on:["Weisser Kaiser","White Emperor"],hair:["swept",0xf4f0e6],top:0xf4f0e6,belly:0xcfd8e8,pants:0xf4f0e6,glove:0xffc21a,shin:0xffc21a,
  acc(H){H.crown(0xcfd8e8);H.cape(0xf4f0e6,1.7,1.1,0xffc21a);H.pads(0xffc21a,.24,0xf4f0e6);H.plate(0xffc21a);H.collar(0xf4f0e6);H.belt(0xffc21a,0x25d4ff);H.scythe("L")}},
 magus:{on:["Professor Kreide","Professor Chalk"],face:{glow:0xf4f0e6,mask:0x1a1626},top:0x1f4a2a,belly:0x163420,pants:0x163420,glove:0x163420,
  acc(H){H.hood(0x1f4a2a);H.horns(0xf4f0e6,.5,.75);H.formulaStaff("L",0xf4f0e6);H.cape(0x163420,1.7,1.05,0x6a4a2a);H.pads(0x6a4a2a,.2);H.belt(0x6a4a2a,0xf4f0e6);H.skirt(0x1f4a2a,.8);H.orbit(0xf4f0e6)}},
};
CH.forEach(c=>c.alt=ALT[c.id]);
/* Figur im gewählten Outfit: erbt alles von der Figur und überschreibt nur das Aussehen */
const outfit=(ch,o)=>o&&ch.alt?Object.assign(Object.create(ch),ch.alt,{o:1}):ch;
/* 5 Kämpfer am Start, 10 zum Freispielen: je Story-Durchgang einer */
/* lock: 0 = von Anfang an spielbar, 1 = wird über die Story frei. Die beiden Bosse nur über die Story in der Stufe "Mittel". */
CH.forEach((c,i)=>{c.lock=i<5?0:1;c.boss=c.id=="kaiser"||c.id=="magus"});
/* Porträts (Brustbild + Ganzkörper) direkt aus den 3D-Modellen fotografieren. Zweites Outfit erst bei Bedarf. */
let PS=null;
function shoot(ch,o){
  if(!PS){const ps=new THREE.Scene(),pc=new THREE.PerspectiveCamera(30,1,.1,50);ps.add(new THREE.HemisphereLight(0xffffff,0x444466,.7));const d=new THREE.DirectionalLight(0xffffff,.8);d.position.set(3,6,8);ps.add(d);PS={ps,pc}}
  const{ps,pc}=PS,f=buildFighter(ch,o),k=o?"2":"";ren.setPixelRatio(1);ren.setClearColor(0,0);
  f.turn.rotation.y=.45;snapPose(f);animFighter(f,1,0);ps.add(f.root);f.sh.visible=false;const top=3.35*f.sc;
  ren.setSize(300,375,false);pc.aspect=.8;pc.fov=26;pc.updateProjectionMatrix();pc.position.set(.5,top-.5,3.6);pc.lookAt(.02,top-.52,0);
  ps.background=new THREE.Color(ch.c).multiplyScalar(.38);ren.render(ps,pc);ch["bust"+k]=cv.toDataURL("image/jpeg",.88);
  ren.setSize(420,560,false);pc.aspect=.75;pc.fov=30;pc.updateProjectionMatrix();pc.position.set(1.2,2.3,7.6);pc.lookAt(0,1.8*f.sc,0);
  ps.background=null;ren.render(ps,pc);ch["full"+k]=cv.toDataURL("image/png");
  ps.remove(f.root);const hm=f.J.hd.children[0].material;hm.map.dispose();hm.dispose()}
function makePortraits(){for(const ch of CH)shoot(ch,0);rs()}
function altPics(ch){if(!ch.full2){shoot(ch,1);rs();if(typeof layout=="function")layout()}}
