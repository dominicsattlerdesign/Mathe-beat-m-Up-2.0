await p.setViewportSize({width:1800,height:560});
await p.evaluate(()=>{SAVE.q=2;setQuality(2);paused=true;window._draw=draw;window.draw=()=>{};const st=document.createElement("style");st.textContent="body>*:not(#c){display:none!important}";document.head.appendChild(st);window._err=[];addEventListener("error",e=>_err.push(e.message))});
await p.evaluate(()=>{
/* Vorschlag: h Grösse, w Breite (wie heute), sh Schultern, bel Bauch, arm Armdicke, leg Beinlänge, hd Kopf */
window.BODY={raiko:{h:1,leg:1.08,sh:.94},akane:{h:.94,leg:1.05,sh:.94},rokka:{h:.86,w:1.18,bel:1.5,leg:.82,hd:1.06},zeno:{h:1.12,w:.88,leg:1.12,sh:.9},
 tetsu:{h:1.03,sh:1.16,arm:1.12},volt:{h:1.04,sh:1.3,arm:1.2},luna:{h:1.03,w:.84,leg:1.06},goro:{h:1.16,w:1.32,sh:1.35,bel:1.3,arm:1.38,hd:.88},
 shade:{h:1.05,w:.86,leg:1.14,arm:.86},mika:{h:.84,leg:.92,hd:1.1},drako:{h:1.07,sh:1.2,arm:1.14},oni:{h:1.15,w:1.28,sh:1.25,bel:1.3,arm:1.3,hd:.92},
 seraph:{h:1.12,leg:1.1,sh:1.02},kaiser:{h:1.18,sh:1.22},magus:{h:1.04,bel:1.25,sh:.88,hd:1.04},mimi:{h:.86,w:1.06,bel:1.2,hd:1.1}};
const S=new THREE.Scene();S.background=new THREE.Color(0x2a2240);
S.add(new THREE.HemisphereLight(0xfff4ee,0x4a3a6a,.62));const su=new THREE.DirectionalLight(0xffffff,.8);su.position.set(5,12,9);S.add(su);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(60,10),mat(0x3a3254));fl.rotation.x=-Math.PI/2;S.add(fl);
const lat=g=>g.children.filter(m=>m.isMesh&&m.geometry.type=="LatheGeometry");
function shape(f,B){const J=f.J;
  if(B.hd)J.hd.scale.multiplyScalar(B.hd);
  if(B.sh){lat(J.ch).forEach(m=>m.scale.x*=B.sh);for(const n of["L","R"])J["a"+n].position.x*=B.sh}
  if(B.bel){lat(J.sp).forEach(m=>{m.scale.x*=B.bel;m.scale.z*=B.bel});lat(J.hp).forEach(m=>{m.scale.x*=1+(B.bel-1)*.5;m.scale.z*=1+(B.bel-1)*.6})}
  if(B.arm)for(const n of["L","R"])for(const g of[J["a"+n],J["e"+n]])lat(g).forEach(m=>{m.scale.x*=B.arm;m.scale.z*=B.arm});
  if(B.leg)for(const n of["L","R"])J["l"+n].scale.y=B.leg}
const ids=CH.map(c=>c.id);window._grp={};
for(const v of["heute","neu"])for(let half=0;half<2;half++){const G=new THREE.Group();G.visible=false;S.add(G);_grp[v+half]=G;
  ids.slice(half*8,half*8+8).forEach((id,i)=>{let ch=CH.find(c=>c.id==id);const B=BODY[id]||{};
    if(v=="neu")ch=Object.assign({},ch,{b:Object.assign({},ch.b||{},B.w?{w:B.w}:{},B.h?{h:B.h}:{})});
    const f=buildFighter(ch);if(v=="neu")shape(f,B);f.root.position.set((i-3.5)*2.15,0,0);f.turn.rotation.y=.25;f.tp=STP[id]||POSE.idle;snapPose(f);animFighter(f,1,0);G.add(f.root)})}
window._S=S;});
for(const k of["heute0","neu0","heute1","neu1"]){await p.evaluate(k=>{for(const g in _grp)_grp[g].visible=g==k;const c=new THREE.PerspectiveCamera(20,GW/GH,.1,200);c.position.set(0,2.6,24.5);c.lookAt(0,2.25,0);ren.setClearColor(0,1);_draw(_S,c)},k);await p.waitForTimeout(300);await p.screenshot({path:__dirname+'/body_'+k+'.png'})}
console.log('Fehler',await p.evaluate(()=>_err));
