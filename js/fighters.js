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
  stumble:{sp:[.5,0,0],ch:[0,.4,0],hd:[.5,0,-.2],aL:[-.4,0,-1.2],eL:[-.6,0,0],aR:[.7,0,1],eR:[-.9,0,0],lL:[-.6,0,-.2],kL:[.9,0,0],lR:[.5,0,.1],kR:[.6,0,0]},
  win:{sp:[-.1,0,0],ch:[0,-.2,0],hd:[-.2,.4,0],aL:[-3,0,-.25],eL:[-.2,0,0],aR:[0,0,.55],eR:[-1.5,0,0],lL:[-.1,0,-.15],kL:[.1,0,0],lR:[.1,0,.2],kR:[.1,0,0]},
};
function faceTex(ch){const o=ch.face||{};return ctex(512,256,g=>{
  g.fillStyle=hex(ch.skin);g.fillRect(0,0,512,256);const cx=128,ey=124;
  g.fillStyle="rgba(0,0,0,.14)";g.fillRect(0,0,512,74);
  if(o.beard!=null){g.fillStyle=hex(o.beard);g.beginPath();g.moveTo(cx-66,138);g.quadraticCurveTo(cx,160,cx+66,138);g.lineTo(cx+58,256);g.lineTo(cx-58,256);g.fill()}
  if(o.mask!=null){g.fillStyle=hex(o.mask);g.fillRect(0,144,512,112)}
  if(o.visor!=null){g.fillStyle="#0c0f18";g.fillRect(cx-78,ey-22,156,40);g.fillStyle=hex(o.visor);g.fillRect(cx-70,ey-13,140,20);g.fillStyle="#fff";g.fillRect(cx-70,ey-6,140,4)}
  else for(const s of[-1,1]){const ex=cx+s*29,ix=ex-s*17,ox=ex+s*18;
    if(o.glow!=null){g.fillStyle="#0a0810";g.beginPath();g.ellipse(ex,ey-1,22,15,0,0,7);g.fill();g.fillStyle=hex(o.glow);g.beginPath();g.moveTo(ix,ey+3);g.lineTo(ox,ey-11);g.lineTo(ox-s*2,ey+5);g.lineTo(ix+s*5,ey+9);g.fill()}
    else{g.fillStyle="#fff";g.beginPath();g.moveTo(ix,ey-2);g.quadraticCurveTo(ex,ey-18,ox,ey-9);g.quadraticCurveTo(ox,ey+10,ex,ey+12);g.quadraticCurveTo(ix+s*2,ey+10,ix,ey-2);g.fill();
      g.save();g.clip();g.fillStyle=hex(ch.eye);g.beginPath();g.ellipse(ex,ey-1,9,13,0,0,7);g.fill();g.fillStyle="#111";g.beginPath();g.ellipse(ex,ey-1,4,7,0,0,7);g.fill();
      g.fillStyle="#fff";g.beginPath();g.arc(ex-4,ey-6,3.2,0,7);g.fill();g.restore();
      g.strokeStyle="#15101c";g.lineWidth=5;g.lineCap="round";g.beginPath();g.moveTo(ix,ey-2);g.quadraticCurveTo(ex,ey-18,ox,ey-9);g.stroke();
      if(o.lash){g.lineWidth=3;g.beginPath();g.moveTo(ox,ey-9);g.lineTo(ox+s*8,ey-16);g.stroke()}
      g.lineWidth=2;g.beginPath();g.moveTo(ex-s*8,ey+12);g.lineTo(ox-s*3,ey+8);g.stroke()}
    g.strokeStyle=hex(o.brow!=null?o.brow:ch.hair[1]);g.lineWidth=o.lash?4:7;g.lineCap="round";g.beginPath();g.moveTo(ix-s*2,ey-(o.lash?23:14));g.lineTo(ox+s*2,ey-27);g.stroke()}
  if(o.mask==null){g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=2;g.beginPath();g.moveTo(cx+2,ey+18);g.lineTo(cx+5,ey+27);g.lineTo(cx,ey+28);g.stroke();
    g.strokeStyle="#3a1a1a";g.lineWidth=3;g.beginPath();g.moveTo(cx-11,ey+45);g.quadraticCurveTo(cx+2,ey+(o.grin?54:43),cx+14,ey+41);g.stroke();
    if(o.fang){g.fillStyle="#fff";for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*9-3,ey+44);g.lineTo(cx+s*9+3,ey+44);g.lineTo(cx+s*9,ey+54);g.fill()}}}
  if(o.scar){g.strokeStyle="#a83a3a";g.lineWidth=3;g.beginPath();g.moveTo(cx+21,ey-36);g.lineTo(cx+37,ey+28);g.stroke()}
  if(o.marks!=null){g.fillStyle=hex(o.marks);for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*48,ey+16);g.lineTo(cx+s*30,ey+30);g.lineTo(cx+s*50,ey+34);g.fill()}}
  if(o.gem!=null){g.fillStyle=hex(o.gem);g.beginPath();g.moveTo(cx,ey-50);g.lineTo(cx+7,ey-40);g.lineTo(cx,ey-30);g.lineTo(cx-7,ey-40);g.fill()}
})}
function buildFighter(ch){
  const b=ch.b||{},W=b.w||1,S=b.h||1;
  const root=new THREE.Group(),turn=new THREE.Group(),piv=new THREE.Group(),model=new THREE.Group();
  root.add(turn);turn.add(piv);piv.add(model);piv.position.y=1.6*S;model.position.y=-1.6*S;model.scale.setScalar(S);turn.rotation.y=FACE;
  const J={},flaps=[],grp=(par,x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);par.add(g);return g};
  const sk=ch.skin,top=ch.top,pa=ch.pants,bo=ch.boots!=null?ch.boots:0x1c1a24,gl=ch.glove!=null?ch.glove:sk,wd=ch.wide?1.5:1;
  J.hp=grp(model,0,1.58,0);M(gB(.54*W,.28,.34*W),pa,[0,0,0],J.hp);
  J.sp=grp(J.hp,0,.1,0);M(gC(.25*W,.26*W,.44),ch.belly!=null?ch.belly:top,[0,.2,0],J.sp).scale.z=.74;
  J.ch=grp(J.sp,0,.4,0);M(gC(.41*W,.27*W,.56),top,[0,.27,0],J.ch).scale.z=.6;
  M(gC(.09*W,.1*W,.2,8),sk,[0,.62,0],J.ch,0);
  J.hd=grp(J.ch,0,.68,0);
  const hm=new THREE.MeshToonMaterial({map:faceTex(ch),gradientMap:GRAD}),head=M(gS(.3,20,14),hm,[0,.3,0],J.hd);head.scale.set(1,1.12,1);
  for(const[s,n]of[[-1,"L"],[1,"R"]]){
    const a=J["a"+n]=grp(J.ch,s*.47*W,.44,0),lg=ch.sleeve=="long";
    M(gS(.15*W,10,8),ch.sleeve=="none"?sk:top,[0,0,0],a);M(gC(.12*W,.1*W,.56,8),lg?top:sk,[0,-.28,0],a);
    const e=J["e"+n]=grp(a,0,-.58,0);M(gS(.105*W,8,6),lg?top:sk,[0,0,0],e,0);
    M(gC(.1*W,.085*W,.5,8),gl,[0,-.26,0],e);M(gS(.125*W,10,8),ch.fist!=null?ch.fist:gl,[0,-.56,0],e);J["h"+n]=grp(e,0,-.56,0);
    const l=J["l"+n]=grp(J.hp,s*.17*W,-.08,0);M(gC(.17*W*wd,.135*W*wd,.74,8),pa,[0,-.37,0],l);
    const k=J["k"+n]=grp(l,0,-.74,0);M(gS(.135*W*wd,8,6),pa,[0,0,0],k,0);
    M(gC(.13*W*wd,(ch.wide?.2:.1)*W,.64,8),ch.shin!=null?ch.shin:pa,[0,-.32,0],k);J["f"+n]=M(gB(.2*W,.14,.44),bo,[0,-.7,.1],k);
  }
  const hy=.3,flap=(m,amp=.12,sp=3)=>{flaps.push({m,b:m.rotation.x,amp,sp,ph:rnd(6)});return m};
  const H={J,W,
    cap(c,o={}){const m=M(geo("cap",()=>new THREE.SphereGeometry(.325,16,10,0,6.2832,0,1.5)),c,[0,hy+.02,-.015],J.hd);m.rotation.x=o.tilt!=null?o.tilt:-.5;m.scale.set(1.03,1.15,1.06);return m},
    spike(c,x,y,z,rx,rz,l=.42,r=.13){const m=M(gK(r,l,6),c,[x,hy+y,z],J.hd);m.rotation.set(rx,0,rz);return m},
    bangs(c,n=3){for(let i=0;i<n;i++){const x=(i-(n-1)/2)*.15;H.spike(c,x,.2-Math.abs(x)*.25,.26,Math.PI-.3,-x*1.6,.24,.075)}},
    hair(st,c){
      if(st=="bald")return;H.cap(c);
      if(st=="spiky"){H.bangs(c);[[0,.42,.02,.1,0],[-.2,.36,.02,0,.65],[.2,.36,.02,0,-.65],[0,.36,-.2,-.75,0],[-.2,.3,-.2,-.6,.6],[.2,.3,-.2,-.6,-.6],[0,.14,-.34,-1.5,0],[-.3,.14,-.14,-.5,1.3],[.3,.14,-.14,-.5,-1.3],[-.12,.4,.14,.5,.3],[.12,.4,.14,.5,-.3]].forEach(a=>H.spike(c,...a))}
      if(st=="swept"){H.bangs(c,2);for(let i=-2;i<=2;i++)for(let j=0;j<2;j++)H.spike(c,i*.11,.34-j*.14-Math.abs(i)*.03,-.16-j*.12,-1.15-j*.2,-i*.2,.6,.12)}
      if(st=="long"){H.bangs(c);const m=M(gC(.3,.2,1.1,8),c,[0,hy-.5,-.2],J.hd);m.scale.z=.45;m.rotation.x=.12;flap(m,.06,2);for(const s of[-1,1])M(gC(.07,.04,.6,6),c,[s*.29,hy-.2,.08],J.hd)}
      if(st=="wild"){H.bangs(c);for(let i=-2;i<=2;i++){H.spike(c,i*.14,.32-Math.abs(i)*.06,-.12,-.9,-i*.45,.6,.14);H.spike(c,i*.15,-.05,-.28,-2.3,-i*.3,.8,.15)}}
      if(st=="pony"){H.bangs(c);M(gS(.14),c,[0,hy+.3,-.3],J.hd);const t=M(gK(.15,1,7),c,[0,hy-.12,-.52],J.hd);t.rotation.x=Math.PI+.35;flap(t,.25,4)}
      if(st=="topknot"){H.bangs(c,2);M(gC(.06,.06,.16,6),c,[0,hy+.42,-.1],J.hd);M(gS(.11),c,[0,hy+.54,-.12],J.hd)}
      if(st=="buns"){H.bangs(c);for(const s of[-1,1]){M(gS(.15),c,[s*.25,hy+.32,-.05],J.hd);M(gB(.07,.2,.04),0xff3b5c,[s*.3,hy+.14,-.12],J.hd,0)}}
      if(st=="mohawk"){for(let i=0;i<5;i++)H.spike(c,0,.42-i*.03-(i>2?(i-2)*.1:0),.16-i*.12,.5-i*.4,0,.5,.12)}
      if(st=="short")H.bangs(c);
    },
    hood(c){const m=M(geo("hood",()=>new THREE.SphereGeometry(.36,16,12,0,6.2832,0,1.85)),c,[0,hy+.04,-.04],J.hd);m.scale.set(1.02,1.12,1);m.rotation.x=-.5;return m},
    band(c,tails=1){const m=M(gT(.305,.045,6,20),c,[0,hy+.12,0],J.hd,0);m.rotation.x=Math.PI/2;
      if(tails)for(const s of[-1,1]){const t=M(gB(.07,.02,.5),c,[s*.06,hy+.1,-.52],J.hd,0);t.rotation.set(.3+s*.15,0,0);flap(t,.3,5)}},
    scarf(c,len=.9){const m=M(gT(.2,.1,6,14),c,[0,.6,0],J.ch);m.rotation.x=Math.PI/2;const t=M(gB(.22,.07,len),c,[.1,.52,-.2-len/2],J.ch);t.rotation.x=.25;flap(t,.25,4.5)},
    cape(c,len=1.5,w=.95,inner){const g=grp(J.ch,0,.52,-.24);M(gB(w,len,.05),c,[0,-len/2,0],g);if(inner!=null)M(gB(w*.92,len*.96,.02),inner,[0,-len/2,.04],g,0);g.rotation.x=.22;flap(g,.14,2.6);return g},
    pads(c,r=.2,spk){for(const s of[-1,1]){const m=M(gS(r,10,8),c,[s*.5*W,.5,0],J.ch);m.scale.y=.75;if(spk!=null){const k=M(gK(.07,.26,6),spk,[s*(.5*W+.1),.66,0],J.ch);k.rotation.z=-s*.5}}},
    belt(c,bk=0xffc21a){M(gC(.285*W,.285*W,.1),c,[0,.13,0],J.hp).scale.z=.72;M(gB(.14,.11,.05),bk,[0,.13,.21*W],J.hp,0)},
    tails(c,len=.9){for(const[x,rz]of[[-.2,.1],[.2,-.1],[-.3,.22],[.3,-.22]]){const g=grp(J.hp,x*W,.05,x*x<.05?-.17:-.02);M(gB(x*x<.05?.3:.1,len,.05),c,[0,-len/2,0],g);g.rotation.set(.12,0,rz);flap(g,.14,3.4)}},
    skirt(c,len=.5){const m=M(gC(.3*W,.5*W,len,10),c,[0,-len/2+.02,0],J.hp);m.scale.z=.8},
    plate(c,e){M(gB(.56*W,.34,.1),c,[0,.34,.22],J.ch,1,e);M(gB(.42*W,.2,.08),c,[0,.08,.2],J.ch,1,e)},
    emblem(c,y=.34){const m=M(gC(.1,.1,.03,10),c,[0,y,.265],J.ch,0,c);m.rotation.x=Math.PI/2},
    sash(c){const m=M(gB(.12,.86*W,.05),c,[0,.26,.25],J.ch,0);m.rotation.z=.75;const n=M(gB(.12,.86*W,.05),c,[0,.26,-.25],J.ch,0);n.rotation.z=-.75},
    collar(c){for(const s of[-1,1]){const m=M(gB(.07,.3,.26),c,[s*.19,.66,-.02],J.ch);m.rotation.z=-s*.25}},
    gaunt(c,r=.19){for(const n of["L","R"]){M(gC(.14*W,.12*W,.36,8),c,[0,-.32,0],J["e"+n]);M(gS(r*W,10,8),c,[0,-.58,0],J["e"+n])}},
    wraps(c){for(const n of["L","R"])for(let i=0;i<3;i++)M(gC(.1*W,.095*W,.07,8),c,[0,-.14-i*.13,0],J["e"+n],0)},
    blade(n,len,c,gc=0xffc21a,w=.1,e){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.1;M(gC(.035,.035,.34,6),0x2a2030,[0,0,0],g,0);M(gB(.2,.04,.07),gc,[0,.17,0],g,0);M(gB(.03,len,w),c,[0,.2+len/2,0],g,1,e);return g},
    backBlade(len,c){const g=grp(J.ch,0,.3,-.3);g.rotation.z=.7;M(gB(.09,len,.05),c,[0,0,0],g);M(gC(.03,.03,.3,6),0xcc2233,[0,len/2+.15,0],g,0)},
    staff(n,c,orb){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.3;M(gC(.035,.035,2.2,6),c,[0,.5,0],g);M(gT(.16,.03,6,14),0xffc21a,[0,1.7,0],g,0);M(gS(.13),orb,[0,1.7,0],g,0,orb)},
    club(n,c){const g=grp(J["h"+n],0,0,0);g.rotation.x=2.1;M(gC(.19,.07,1.5,8),c,[0,.65,0],g);for(let i=0;i<6;i++){const k=M(gK(.05,.14,5),0xd8d8e0,[Math.cos(i*2.1)*.17,.75+i*.11,Math.sin(i*2.1)*.17],g,0);k.rotation.z=-Math.cos(i*2.1)*1.5;k.rotation.x=Math.sin(i*2.1)*1.5}},
    cards(n){const g=grp(J["h"+n],0,-.02,.06);for(let i=-1;i<=1;i++){const m=M(gB(.17,.25,.012),i?0xf4f0ff:0xffc21a,[i*.1,.12,i*.01],g);m.rotation.z=-i*.4}},
    horns(c,l=.34,out=.5){for(const s of[-1,1]){const m=M(gK(.075,l,6),c,[s*.19,hy+.36,.06],J.hd);m.rotation.z=-s*out;m.rotation.x=.15}},
    wings(c,sharp){for(const s of[-1,1]){const g=grp(J.ch,s*.16,.42,-.26);g.rotation.set(0,-s*.5,s*.25);
      for(let i=0;i<4;i++){const m=sharp?M(gK(.13,1.15-i*.16,4),c,[s*(.42+i*.06),.34-i*.3,0],g):M(gS(.3,8,6),c,[s*(.4+i*.05),.36-i*.27,0],g);
        m.rotation.z=-s*(1.15+i*.28);if(sharp)m.scale.z=.3;else m.scale.set(.42,1.5-i*.2,.2)}flaps.push({m:g,b:g.rotation.y,amp:.18*s,sp:3,ph:0,ax:"y"})}},
    tail(c){let p=grp(J.hp,0,-.02,-.16);p.rotation.x=-2;for(let i=0;i<5;i++){M(gC(.1-i*.016,.08-i*.016,.3,6),c,[0,.15,0],p);p=grp(p,0,.3,0);p.rotation.x=.3}M(gK(.07,.2,4),c,[0,.08,0],p);flap(J.hp.children[J.hp.children.length-1],.2,3)},
    halo(c){const m=M(gT(.2,.03,6,18),c,[0,hy+.56,0],J.hd,0,c);m.rotation.x=Math.PI/2-.2},
    crown(c){M(gC(.24,.22,.1,10),c,[0,hy+.3,0],J.hd,1,0x553300);for(let i=0;i<5;i++){const a=i/5*6.28;M(gK(.05,.2,4),c,[Math.sin(a)*.22,hy+.44,Math.cos(a)*.22],J.hd,0,0x553300)}},
    tricorn(c,t){const m=M(gC(.5,.46,.05,3),c,[0,hy+.3,0],J.hd);m.rotation.y=Math.PI;M(gC(.22,.27,.2,8),c,[0,hy+.4,0],J.hd);M(gC(.275,.275,.05,8),t,[0,hy+.33,0],J.hd,0)},
    bandana(c){const m=H.cap(c,{tilt:-.3});m.scale.set(1.06,1.17,1.09);const k=M(gS(.07),c,[.2,hy+.1,-.3],J.hd);for(const s of[0,1]){const t=M(gB(.07,.02,.34),c,[.2,hy+.06-s*.06,-.48],J.hd,0);t.rotation.x=.5+s*.3;flap(t,.3,5)}},
    antenna(c){M(gC(.015,.015,.4,4),0x8a94a8,[.2,hy+.42,-.05],J.hd,0);M(gS(.05,6,6),c,[.2,hy+.64,-.05],J.hd,0,c)},
    ears(c){for(const s of[-1,1])M(gC(.1,.1,.08,8),c,[s*.3,hy,0],J.hd).rotation.z=Math.PI/2},
    orbit(c){const g=grp(J.ch,0,.5,0);for(let i=0;i<3;i++){const a=i*2.09;M(gO(.09),c,[Math.cos(a)*.95,Math.sin(i)*.2,Math.sin(a)*.95],g,0,c)}flaps.push({m:g,spin:1.6})},
  };
  H.hair(ch.hair[0],ch.hair[1]);ch.acc&&ch.acc(H);J.hd.scale.setScalar(.9);
  const sh=new THREE.Mesh(gC(1,1,.02,16),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.38,depthWrite:false}));sh.position.y=.03;sh.scale.set(.85*W,1,.55);root.add(sh);
  const cur={};for(const j of JN)cur[j]=[0,0,0];
  return{ch,root,turn,piv,model,J,flaps,cur,tp:POSE.idle,ps:14,sc:S,grounded:true,run:false,sh,ph:rnd(6),bs:2.4+rnd(1.2)};
}
const _v1=new THREE.Vector3(),_v2=new THREE.Vector3();
function animFighter(f,dt,T){
  const k=1-Math.exp(-f.ps*dt),J=f.J,tp=f.tp;
  for(const j of JN){const t=tp[j]||Z3,c=f.cur[j];c[0]+=(t[0]-c[0])*k;c[1]+=(t[1]-c[1])*k;c[2]+=(t[2]-c[2])*k;J[j].rotation.set(c[0],c[1],c[2])}
  if(f.run){const s=Math.sin(T*24+f.ph),c=Math.cos(T*24+f.ph);J.lL.rotation.x=-.5+s*1;J.kL.rotation.x=1-c*.7;J.lR.rotation.x=-.5-s*1;J.kR.rotation.x=1+c*.7}
  else if(tp===POSE.idle){const s=Math.sin(T*f.bs+f.ph);J.sp.rotation.x+=s*.035;J.kL.rotation.x+=s*.07;J.kR.rotation.x+=s*.06;J.lL.rotation.x-=s*.035;J.aL.rotation.x+=s*.07;J.aR.rotation.x-=s*.05;J.hd.rotation.x-=s*.02}
  for(const fl of f.flaps){if(fl.spin){fl.m.rotation.y+=fl.spin*dt;continue}fl.m.rotation[fl.ax||"x"]=fl.b+Math.sin(T*fl.sp+fl.ph)*fl.amp+(f.run&&!fl.ax?.5:0)}
  J.hp.position.y=1.58;
  if(f.grounded){f.root.updateMatrixWorld(true);const a=_v1.setFromMatrixPosition(J.fL.matrixWorld).y,b=_v2.setFromMatrixPosition(J.fR.matrixWorld).y;J.hp.position.y-=(Math.min(a,b)-f.root.position.y-.075*f.sc)/f.sc}
  f.sh.position.y=.03-f.root.position.y;const q=clamp(1-f.root.position.y*.12,.3,1);f.sh.scale.set(.85*q,1,.55*q);
}
function pose(f,n,sp){f.tp=POSE[n];if(sp)f.ps=sp}
function snapPose(f){for(const j of JN){const t=f.tp[j]||Z3;f.cur[j]=[t[0],t[1],t[2]]}}

/* ---------- Die 15 Kämpfer ---------- */
const CH=[
 {id:"raiko",n:"Raiko",ti:"Blitz-Ninja",d:"Schneller als der Donner. Trainiert, seit er laufen kann.",skin:0xf2c9a0,hair:["spiky",0xcfeaff],eye:0x1e9bff,top:0x1c2b63,pants:0x23263a,glove:0x11131f,shin:0x11131f,sleeve:"short",
  c:0xffd83a,fx:"bolt",fin:"Donnerdrachen-Faust",st:[3,3,3],acc(H){H.band(0xffc928);H.scarf(0xffc928,1);H.belt(0x11131f);H.emblem(0xffd83a);H.backBlade(.9,0x2a2f45)}},
 {id:"akane",n:"Akane",ti:"Flammenfaust",d:"Ihre Tritte brennen heißer als jedes Dojo-Feuer.",skin:0xf6cfae,hair:["pony",0xd6222c],eye:0xff7a1a,face:{lash:1},top:0xc41f2c,pants:0x1c1822,boots:0xf6cfae,glove:0xf6cfae,sleeve:"none",b:{w:.9,h:.97},
  c:0xff5a1a,fx:"fire",fin:"Phönix-Wirbel",st:[4,2,3],acc(H){H.band(0xffffff);H.sash(0x1c1822);H.belt(0x1c1822,0xffffff);H.wraps(0xf4f0ff);H.skirt(0xc41f2c,.34)}},
 {id:"rokka",n:"Käpt’n Rokka",ti:"Sturm der sieben Meere",d:"Pirat ohne Schiff, aber mit dem schärfsten Säbel der Bucht.",skin:0xd9a577,hair:["short",0x1a1418],eye:0x2ec4b6,face:{scar:1,grin:1},top:0x18335c,belly:0xf1e7d0,pants:0x2a2230,boots:0x3a2416,shin:0x3a2416,glove:0xd9a577,sleeve:"long",b:{w:1.08},
  c:0x25d4ff,fx:"wave",fin:"Sturmflut-Säbel",st:[3,4,2],acc(H){H.bandana(0xc81e2e);H.tails(0x18335c,1);H.belt(0x8a1a22);H.pads(0xffc21a,.15);H.blade("L",1.15,0xdfe7f2,0xffc21a,.13);H.sash(0x8a1a22)}},
 {id:"zeno",n:"Zeno",ti:"Meister der Karten",d:"Zieht immer die richtige Karte. Niemand weiß, wie.",skin:0xf0d2b8,hair:["swept",0x5a2ea6],eye:0xff3dcb,top:0x17151f,belly:0x6a2ea6,pants:0x17151f,glove:0x17151f,sleeve:"long",b:{w:.94,h:1.03},
  c:0xff3dcb,fx:"beam",fin:"Schicksalskarte: Chaosdrache",st:[2,3,4],acc(H){H.collar(0x17151f);H.tails(0x17151f,1.1);H.belt(0xffc21a);H.cards("L");H.emblem(0xffc21a,.4);H.gaunt(0x6a2ea6,.13)}},
 {id:"tetsu",n:"Tetsu",ti:"Herrenloser Samurai",d:"Ein Schnitt, ein Sieg. Spricht wenig, trifft immer.",skin:0xe6bd94,hair:["topknot",0x15131a],eye:0x8a5a2a,face:{scar:1},top:0xd9d5cc,pants:0x232a55,boots:0xe6bd94,sleeve:"long",wide:1,
  c:0xdfe7ff,fx:"slash",fin:"Tausend-Klingen-Schnitt",st:[4,3,2],acc(H){H.belt(0x15131a,0x8a1a22);H.blade("L",1.4,0xeef4ff,0x15131a,.07);H.pads(0x8a1a22,.19);H.sash(0x232a55)}},
 {id:"volt",n:"Volt-7",ti:"Kampf-Cyborg",d:"Gebaut für den Sieg. Rechnet schneller als sein Schatten.",skin:0xb6c2d2,hair:["bald",0],eye:0x25d4ff,face:{visor:0x25d4ff},top:0x39465e,belly:0x1b212e,pants:0x1b212e,glove:0x39465e,shin:0x39465e,boots:0x25d4ff,sleeve:"long",b:{w:1.1,h:1.02},
  c:0x25d4ff,fx:"beam",fin:"Plasma-Kanone",st:[3,4,2],acc(H){H.plate(0x55657f);H.emblem(0x25d4ff);H.pads(0x55657f,.22);H.gaunt(0x55657f,.17);H.antenna(0xff3b2f);H.ears(0x55657f);H.belt(0x55657f,0x25d4ff)}},
 {id:"luna",n:"Luna",ti:"Mondpriesterin",d:"Ruft die Kraft des Vollmonds. Der Himmel hört auf sie.",skin:0xf4dccb,hair:["long",0xd8ccff],eye:0x9a6bff,face:{lash:1,gem:0xffe98a},top:0x3a2a7a,pants:0x241a4e,sleeve:"long",wide:1,b:{w:.88,h:.98},
  c:0xc9b8ff,fx:"meteor",fin:"Mondfall",st:[2,2,5],acc(H){H.staff("L",0x8a94a8,0xffe98a);H.cape(0x241a4e,1.3,.8,0x8a6bff);H.belt(0xffe98a);H.skirt(0x3a2a7a,.7);H.emblem(0xffe98a)}},
 {id:"goro",n:"Goro",ti:"Der Berg",d:"Hat einmal einen Felsen umarmt. Der Felsen hat verloren.",skin:0xc98d5e,hair:["mohawk",0xff7a1a],eye:0x3a2a1a,face:{beard:0x7a3c12,brow:0x7a3c12},top:0xc98d5e,pants:0x3d4a2a,boots:0x2a2018,sleeve:"none",b:{w:1.38,h:1.1},
  c:0xff8a00,fx:"quake",fin:"Erdbeben-Hammer",st:[5,4,1],acc(H){H.sash(0x5a3a1a);H.belt(0x5a3a1a,0xd8d8e0);H.gaunt(0x6a6f7c,.165);H.pads(0x6a6f7c,.2,0xd8d8e0)}},
 {id:"shade",n:"Shade",ti:"Schatten ohne Namen",d:"Wenn du ihn siehst, ist der Kampf schon vorbei.",skin:0x2a2636,hair:["bald",0],eye:0xb48aff,face:{glow:0xc8a2ff,mask:0x14121c},top:0x1c1a2a,pants:0x14121c,glove:0x14121c,sleeve:"long",b:{w:.95},
  c:0x9a6bff,fx:"shadow",fin:"Schattenklon-Sturm",st:[3,2,4],acc(H){H.hood(0x1c1a2a);H.scarf(0x7a3cff,1.3);H.blade("L",.6,0xcfd8e8,0x7a3cff,.08);H.blade("R",.6,0xcfd8e8,0x7a3cff,.08);H.belt(0x7a3cff,0xcfd8e8);H.wraps(0x3a3550)}},
 {id:"mika",n:"Mika",ti:"Jadedrache",d:"Klein, flink und mit einem Tritt wie ein Wirbelsturm.",skin:0xf3cfa6,hair:["buns",0x2a1a14],eye:0x1fa37a,face:{lash:1,grin:1},top:0x1fa37a,pants:0xf4f0e6,boots:0x15131a,sleeve:"short",b:{w:.86,h:.9},
  c:0x3fe06b,fx:"wind",fin:"Jadedrachen-Tritt",st:[3,2,4],acc(H){H.collar(0xffc21a);H.sash(0xffc21a);H.belt(0xffc21a,0x1fa37a);H.wraps(0xffc21a);H.skirt(0x1fa37a,.36)}},
 /* ---- Geheime Kämpfer ---- */
 {id:"drako",n:"Drako",ti:"Drachenritter",d:"Halb Mensch, halb Drache. Sein Atem schmilzt Stahl.",lock:1,skin:0xe0a880,hair:["spiky",0x8a1420],eye:0xffc21a,face:{marks:0x8a1420,fang:1},top:0x2a1c22,pants:0x1c1418,glove:0x8a1420,shin:0x8a1420,sleeve:"short",b:{w:1.1,h:1.05},
  c:0xff3b2f,fx:"fire",fin:"Inferno-Sturzflug",st:[4,4,3],acc(H){H.horns(0xe8dcc0,.36,.35);H.wings(0x8a1420,1);H.tail(0x8a1420);H.plate(0x8a1420);H.pads(0x8a1420,.2,0xe8dcc0);H.belt(0xffc21a)}},
 {id:"oni",n:"Oni-Maru",ti:"Roter Dämon",d:"Aus den Bergen herabgestiegen. Lacht bei jedem Treffer.",lock:2,skin:0xc8382e,hair:["wild",0xf0ece2],eye:0xffe14d,face:{fang:1,grin:1,brow:0x15131a},top:0xc8382e,pants:0xd9a21a,boots:0xc8382e,sleeve:"none",b:{w:1.3,h:1.12},
  c:0xffc21a,fx:"quake",fin:"Donnerkeule",st:[5,4,2],acc(H){H.horns(0xf0ece2,.4,.3);H.club("L",0x3a2c28);H.belt(0x15131a,0xf0ece2);H.sash(0x15131a);H.skirt(0xd9a21a,.4);H.wraps(0x15131a)}},
 {id:"seraph",n:"Seraph",ti:"Klinge des Himmels",d:"Wacht über die Arena der Wolken. Sein Schwert ist reines Licht.",lock:3,skin:0xf8e2cc,hair:["long",0xffe9a0],eye:0x25d4ff,top:0xf4f0e6,belly:0xffc21a,pants:0xf4f0e6,glove:0xffc21a,shin:0xffc21a,boots:0xffc21a,sleeve:"long",
  c:0xffe98a,fx:"light",fin:"Himmelsgericht",st:[3,3,5],acc(H){H.wings(0xffffff,0);H.halo(0xffe14d);H.plate(0xffc21a);H.pads(0xffc21a,.19);H.blade("L",1.5,0xfff6c0,0xffc21a,.12,0xffd040);H.belt(0xffc21a,0x25d4ff)}},
 {id:"kaiser",n:"Kaiser Null",ti:"Herrscher der Leere",d:"Hat ein ganzes Reich verschluckt. Jetzt will er die Arena.",lock:4,skin:0xcdc6dc,hair:["swept",0x15131a],eye:0xff2a4a,face:{marks:0x5a2ea6},top:0x2a1c4e,belly:0x15131a,pants:0x15131a,glove:0x5a2ea6,shin:0x5a2ea6,sleeve:"long",b:{w:1.12,h:1.1},
  c:0x9a3cff,fx:"meteor",fin:"Schwarze Sonne",st:[5,3,3],acc(H){H.crown(0xffc21a);H.cape(0x15131a,1.7,1.1,0x8a1a3a);H.pads(0x5a2ea6,.24,0xffc21a);H.plate(0x5a2ea6);H.collar(0x15131a);H.belt(0xffc21a,0xff2a4a)}},
 {id:"magus",n:"Mathemagus",ti:"Herr der Zahlen",d:"Der Endgegner. Er kennt jede Formel und fürchtet nur eines: die richtige Antwort.",lock:5,skin:0x1a1626,hair:["bald",0],eye:0x3dffd0,face:{glow:0x3dffd0,mask:0x1a1626},top:0x2a5f96,belly:0x163450,pants:0x163450,glove:0x163450,sleeve:"long",wide:1,b:{w:1.05,h:1.14},
  c:0x3dffd0,fx:"bolt",fin:"Unendlichkeits-Formel",st:[4,4,4],acc(H){H.hood(0x2a5f96);H.horns(0xffc21a,.5,.75);H.staff("L",0xffc21a,0x3dffd0);H.cape(0x163450,1.7,1.05,0x0f8f7a);H.pads(0xffc21a,.2);H.belt(0xffc21a,0x3dffd0);H.skirt(0x2a5f96,.8);H.orbit(0x3dffd0)}},
];
/* Porträts (Brustbild + Ganzkörper) direkt aus den 3D-Modellen fotografieren */
function makePortraits(){
  const ps=new THREE.Scene(),pc=new THREE.PerspectiveCamera(30,1,.1,50);
  ps.add(new THREE.HemisphereLight(0xffffff,0x444466,.7));const d=new THREE.DirectionalLight(0xffffff,.8);d.position.set(3,6,8);ps.add(d);
  ren.setPixelRatio(1);ren.setClearColor(0,0);
  for(const ch of CH){const f=buildFighter(ch);f.turn.rotation.y=.45;snapPose(f);animFighter(f,1,0);ps.add(f.root);f.sh.visible=false;
    const top=3.35*f.sc;
    ren.setSize(240,300,false);pc.aspect=.8;pc.fov=26;pc.updateProjectionMatrix();pc.position.set(.5,top-.5,3.6);pc.lookAt(.02,top-.52,0);
    ps.background=new THREE.Color(ch.c).multiplyScalar(.38);ren.render(ps,pc);ch.bust=cv.toDataURL("image/jpeg",.85);
    ren.setSize(360,480,false);pc.aspect=.75;pc.fov=30;pc.updateProjectionMatrix();pc.position.set(1.2,2.3,7.6);pc.lookAt(0,1.8*f.sc,0);
    ps.background=null;ren.render(ps,pc);ch.full=cv.toDataURL("image/png");
    ps.remove(f.root);f.J.hd.children[0].material.map.dispose();f.J.hd.children[0].material.dispose()}
  rs();
}
