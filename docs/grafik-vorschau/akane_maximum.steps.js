await p.setViewportSize({width:1600,height:900});
await p.evaluate(()=>{SAVE.q=2;setQuality(2);paused=true;window._draw=draw;window.draw=()=>{};const st=document.createElement("style");st.textContent="body>*:not(#c){display:none!important}";document.head.appendChild(st);window._err=[];addEventListener("error",e=>_err.push(e.message))});
await p.evaluate(()=>{
const ch=CH.find(c=>c.id=="akane"),S=new THREE.Scene();
S.background=new THREE.Color(0x2a2240);S.fog=new THREE.Fog(0x2a2240,18,40);
S.add(new THREE.HemisphereLight(0xfff4ee,0x4a3a6a,.62));
const su=new THREE.DirectionalLight(0xffffff,.8);su.position.set(5,12,9);su.castShadow=true;su.shadow.mapSize.set(2048,2048);su.shadow.bias=-.0012;su.shadow.radius=3;
Object.assign(su.shadow.camera,{left:-6,right:6,top:6,bottom:-3,near:1,far:40});su.shadow.camera.updateProjectionMatrix();S.add(su);
const rl=new THREE.DirectionalLight(0xffa070,.75);rl.position.set(-2,6,-8);S.add(rl);
const fl=new THREE.Mesh(new THREE.CircleGeometry(9,64),mat(0x2e2744));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;S.add(fl);
for(let i=0;i<40;i++){const m=new THREE.Mesh(gS(.04),bmat(P([0xffc21a,0xff5a1a,0xffffff])));m.position.set(rnd(-8,8),rnd(1,7),rnd(-8,-3));S.add(m)}
/* ---- normale Akane ---- */
const a=buildFighter(ch);a.root.position.set(-1.55,0,0);a.turn.rotation.y=.35;a.tp=STP.akane;snapPose(a);animFighter(a,1,0);S.add(a.root);
/* ---- Deluxe-Akane ---- */
SEGM=2.6;const b=buildFighter_(ch);SEGM=1;b.root.position.set(1.55,0,0);b.turn.rotation.y=-.35;b.tp=STP.akane;snapPose(b);
const J=b.J,W=.9,hy=.3,sk=ch.skin,HC=0xd6222c,mH=(c,k)=>mat(c,0,k);
const add=(g,c,pos,par,o=1,k="cloth",rot,scl)=>{const m=M(g,typeof c=="number"?mat(c,0,k):c,pos,par,o);if(rot)m.rotation.set(...rot);if(scl)m.scale.set(...scl);return m};
SEGM=2.6;
/* Arme und Beine neu geformt: Schulter, Bizeps, schmales Handgelenk, Wade, Knie */
const hideLathe=g=>g.children.forEach(m=>{if(m.isMesh&&m.geometry.type=="LatheGeometry")m.visible=false});
const UA=[[0,-.62],[.07,-.6],[.092,-.56],[.098,-.48],[.114,-.36],[.118,-.24],[.128,-.1],[.133,.01],[.11,.1],[0,.14]],
 FA=[[0,-.56],[.058,-.54],[.072,-.5],[.078,-.4],[.096,-.26],[.106,-.12],[.098,-.01],[.084,.05],[0,.09]],
 TH=[[0,-.8],[.085,-.78],[.112,-.72],[.124,-.62],[.148,-.42],[.163,-.22],[.168,-.06],[.158,.04],[0,.1]],
 SH=[[0,-.7],[.058,-.69],[.074,-.62],[.08,-.52],[.104,-.34],[.118,-.2],[.11,-.05],[.096,.04],[0,.08]];
for(const n of["L","R"]){const s=n=="L"?-1:1;
  for(const k of["a","e","l","k"])hideLathe(J[k+n]);
  add(gL(UA,22,W),sk,[0,0,0],J["a"+n],1,"skin");add(gL(FA,22,W),sk,[0,0,0],J["e"+n],1,"skin");
  add(gL(TH,22,W),ch.pants,[0,0,0],J["l"+n],1);add(gL(SH,22,W),ch.pants,[0,0,0],J["k"+n],1);
  for(let i=0;i<4;i++)add(gS(.032),sk,[(-.045+i*.03)*s,-.07,.075],J["h"+n],0,"skin");
  add(gC(.026,.02,.1),sk,[.06*s,-.02,.06],J["h"+n],0,"skin",[0,0,s*.9]);
  for(let i=0;i<3;i++)add(gT(.088,.017,8,20),0xf4f0e6,[0,-.46-i*.032,0],J["e"+n],0,"cloth",[Math.PI/2,0,.08*(i-1)]);
  for(let i=0;i<3;i++)add(gT(.086,.017,8,20),0xf4f0e6,[0,-.56-i*.032,0],J["k"+n],0,"cloth",[Math.PI/2,0,.1*(i-1)]);
}
hideLathe(J.ch);J.ch.children.forEach(m=>{if(m.isMesh&&m.geometry.type=="CylinderGeometry")m.visible=false});
{const m=add(gL([[0,-.03],[.23,0],[.31,.16],[.345,.3],[.335,.44],[.27,.52],[.17,.565],[.09,.57],[0,.57]],26,W),ch.top,[0,0,0],J.ch,1);m.scale.z=.6}
add(gC(.082*W,.095*W,.26,20),sk,[0,.66,0],J.ch,0,"skin");add(gT(.1*W,.022,8,24),0x8a1420,[0,.555,0],J.ch,0,"cloth",[Math.PI/2,0,0],[1,.62,1]);
/* Gürtel-Enden, die herabhängen */
for(const s of[-1,1]){const t=add(gB(.07,.32,.025),0x1c1822,[s*.06,-.06,.235],J.hp,1,"cloth",[.15,0,s*.18]);flap(t,.12,3)}
function flap(m,amp,sp){b.flaps.push({m,b:m.rotation.x,amp,sp,ph:rnd(6)})}
/* Haare: Strähnen statt einer Form */
J.hd.children.forEach(m=>{if(m.isMesh&&(m.geometry.type=="ConeGeometry"||(m.geometry.type=="LatheGeometry"&&m.position.z<-.3)||(m.geometry.type=="SphereGeometry"&&m.position.z<-.25&&m.position.y>.5)))m.visible=false});
const STR=[[0,-.3],[.025,-.24],[.05,-.12],[.055,-.02],[.04,.03],[0,.05]];for(let i=-4;i<=4;i++){const a=i*.19;const m=add(gL(STR,12),HC,[Math.sin(a)*.33,hy+.31-Math.abs(i)*.02,Math.cos(a)*.31],J.hd,1,"hair",[.35,a,-i*.1]);m.scale.set(1.1,.85,.4)}
for(const s of[-1,1]){{const m=add(gL([[0,-.55],[.03,-.45],[.06,-.2],[.065,0],[.04,.06],[0,.08]],12),HC,[s*.3,hy+.1,-.03],J.hd,1,"hair",[.05,0,s*.1]);m.scale.z=.5}{const m=add(gL(STR,12),HC,[s*.31,hy+.24,-.04],J.hd,1,"hair",[0,0,s*.5]);m.scale.set(1.3,1.3,.5)}}
add(new THREE.SphereGeometry(.322,40,24,Math.PI*1.02,Math.PI*.96,.15,1.95),HC,[0,hy,0],J.hd,1,"hair");
const tail=new THREE.Group();tail.position.set(0,hy+.33,-.36);J.hd.add(tail);
const crv=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(0,-.06,-.16),new THREE.Vector3(.02,-.3,-.3),new THREE.Vector3(.05,-.62,-.34),new THREE.Vector3(.03,-.92,-.28),new THREE.Vector3(-.02,-1.12,-.2)]);
{const N=60,R=16,g=new THREE.TubeGeometry(crv,N,1,R,false),P_=g.attributes.position;for(let i=0;i<=N;i++){const t=i/N,c=crv.getPointAt(t),r=(.13*Math.sin(Math.min(1,t*4+.35)*1.5708)*(1-Math.pow(t,1.6)*.92))+.004;
  for(let j=0;j<=R;j++){const k=i*(R+1)+j,v=new THREE.Vector3(P_.getX(k),P_.getY(k),P_.getZ(k)).sub(c).multiplyScalar(r);P_.setXYZ(k,c.x+v.x,c.y+v.y,c.z+v.z)}}
 g.computeVertexNormals();const m=new THREE.Mesh(g,mat(HC,0,"hair"));m.castShadow=true;m.add(new THREE.Mesh(g,OL));tail.add(m);
}
add(gS(.135,20,14),HC,[0,0,-.02],tail,1,"hair",null,[1,1,1.1]);
/* Haarschleife */
add(gT(.1,.032,8,20),0xffffff,[0,.02,-.2],tail,0,"cloth",[.4,0,0],[1,.75,1]);

/* ===== Maximum: Stoff, der am Körper anliegt ===== */
/* alte flache Schärpe weg */
J.ch.children.forEach(m=>{if(m.isMesh&&m.geometry.type=="BoxGeometry"&&m.geometry.parameters.height>.7)m.visible=false});
/* Oberkörper-Oberfläche (Brustprofil, Tiefe .6) */
const CP=[[.23,0],[.31,.16],[.345,.3],[.335,.44],[.27,.52],[.17,.565]];
const rAt=y=>{y=clamp(y,0,.565);for(let i=1;i<CP.length;i++)if(y<=CP[i][1]){const t=(y-CP[i-1][1])/(CP[i][1]-CP[i-1][1]);return lerp(CP[i-1][0],CP[i][0],t)*W}return CP[CP.length-1][0]*W};
const surf=(th,y,off)=>{const r=rAt(y)+off;return new THREE.Vector3(r*Math.sin(th),y,r*Math.cos(th)*.6+off*.4)};
/* Band aus zwei Randlinien bauen */
function band2(A,B,c,par,kind="cloth"){const n=A.length,pos=[],uv=[],idx=[];for(let i=0;i<n;i++){pos.push(A[i].x,A[i].y,A[i].z,B[i].x,B[i].y,B[i].z);uv.push(i/(n-1)*4,0,i/(n-1)*4,1);if(i<n-1){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const m=mat(c,0,kind).clone();m.side=THREE.DoubleSide;const me=new THREE.Mesh(g,m);me.castShadow=true;par.add(me);return me}
const edged=(fA,fB,c,par,n,ofs=.012)=>{const A=[],B=[],A2=[],B2=[];for(let i=0;i<=n;i++){const t=i/n;A.push(fA(t,ofs+.006));B.push(fB(t,ofs+.006));A2.push(fA(t,ofs,1));B2.push(fB(t,ofs,1))}band2(A2,B2,0x0b0912,par);band2(A,B,c,par)};
/* Schärpe: schräger Ring um den Oberkörper, liegt überall an */
{const yc=t=>.3-.24*Math.sin(t*6.2832),N=96;
 edged((t,o,e)=>surf(t*6.2832,yc(t)+(e?.078:.07),o),(t,o,e)=>surf(t*6.2832,yc(t)-(e?.078:.07),o),0x1c1822,J.ch,N,.02);}
/* Kimono-Kragen: zwei Revers, links über rechts, bis zur Taille */
for(const s of[1,-1]){const o=s>0?.016:.026,th0=s*.62,th1=-s*.1,y0=.555,y1=.1,wd=.085;
  edged((t,of,e)=>surf(lerp(th0,th1,t)-s*(e?wd*.55+.012:wd*.5),lerp(y0,y1,t),of),(t,of,e)=>surf(lerp(th0,th1,t)+s*(e?wd*.55+.012:wd*.5),lerp(y0,y1,t),of),0x8a1420,J.ch,24,o)}
/* Armausschnitte mit Saum */

/* Faltenrock statt glatter Glocke */
J.hp.children.forEach(m=>{if(m.isMesh&&m.material&&m.material.side==THREE.DoubleSide)m.visible=false});
{const len=.38,g=new THREE.LatheGeometry([[.27,.04],[.29,0],[.4,-len*.5],[.5,-len],[.49,-len-.02]].map(p=>new THREE.Vector2(p[0]*W,p[1])),72);const P_=g.attributes.position;
 for(let i=0;i<P_.count;i++){const x=P_.getX(i),y=P_.getY(i),z=P_.getZ(i),a=Math.atan2(x,z),t=clamp(-y/len,0,1),f=1+.1*t*Math.sin(a*14);P_.setX(i,x*f);P_.setZ(i,z*f)}
 g.computeVertexNormals();const m=new THREE.Mesh(g,mat(0xc41f2c,0,"cloth").clone());m.material.side=THREE.DoubleSide;m.castShadow=true;m.scale.z=.8;m.position.y=.02;J.hp.add(m);
 m.add(Object.assign(new THREE.Mesh(g,OL)));
 add(gT(.49*W,.018,8,72),0x8a1420,[0,.02-len-.01,0],J.hp,0,"cloth",[Math.PI/2,0,0],[1,.8,1])}
/* Gürtelknoten */
add(gS(.06,16,12),0x1c1822,[0,.13,.235],J.hp,1,"cloth",null,[1.3,.9,.7]);
/* Füsse mit Zehen statt Klötzen */
for(const n of["L","R"]){const s=n=="L"?-1:1,f=J["f"+n];f.visible=false;
  const g=new THREE.Group();g.position.set(0,-.7,.1);J["k"+n].add(g);
  add(gS(.13,24,16),sk,[0,-.005,0],g,1,"skin",null,[.62,.46,1.45]);add(gS(.07,16,12),sk,[0,.02,-.12],g,1,"skin",null,[1,1,1]);
  for(let i=0;i<5;i++)add(gS(.026-(i?Math.abs(i-0)*.002:0),12,10),sk,[(-.045+i*.022)*(-s)*-1,-.025,.175-Math.abs(i-1)*.012],g,1,"skin")}
/* Stirnband: Knoten und lange flatternde Bänder */
J.hd.children.forEach(m=>{if(m.isMesh&&m.geometry.type=="BoxGeometry"&&m.geometry.parameters.depth>=.5)m.visible=false});
add(gS(.06,14,10),0xffffff,[0,hy+.12,-.33],J.hd,1,"cloth",null,[1.2,.9,.7]);
for(const s of[-1,1]){const t=add(gB(.075,.012,.62),0xffffff,[s*.08,hy+.12-.75*.3,-.33-.66*.3],J.hd,1,"cloth",[2.29+s*.12,s*.2,0]);flap(t,.12,5)}
/* neues Gesicht: grössere Augen mit mehreren Glanzpunkten, feine Brauen, Nasenschatten, entschlossener Mund */
{const hm=J.hd.children.find(m=>m.isMesh&&m.geometry===HEADG);const tex=ctex(1024,512,g=>{g.scale(2,2);
  g.fillStyle=hex(ch.skin);g.fillRect(0,0,512,256);const cx=128,ey=128;
  let gr=g.createLinearGradient(0,40,0,100);gr.addColorStop(0,"rgba(120,30,30,.28)");gr.addColorStop(1,"rgba(120,30,30,0)");g.fillStyle=gr;g.fillRect(0,0,512,100);
  gr=g.createLinearGradient(0,175,0,256);gr.addColorStop(0,"rgba(150,50,50,0)");gr.addColorStop(1,"rgba(150,50,50,.25)");g.fillStyle=gr;g.fillRect(0,175,512,81);
  for(const s of[-1,1]){const bx=cx+s*44,by=ey+28;const r=g.createRadialGradient(bx,by,0,bx,by,16);r.addColorStop(0,"rgba(255,90,100,.38)");r.addColorStop(1,"rgba(255,90,100,0)");g.fillStyle=r;g.fillRect(bx-18,by-12,36,24);
    g.strokeStyle="rgba(230,70,80,.45)";g.lineWidth=1.3;for(let k=0;k<3;k++){g.beginPath();g.moveTo(bx-6+k*5,by-3);g.lineTo(bx-9+k*5,by+3);g.stroke()}}
  for(const s of[-1,1]){const ex=cx+s*31,ix=ex-s*20,ox=ex+s*21;
    g.fillStyle="#fffaf6";g.beginPath();g.moveTo(ix,ey-1);g.quadraticCurveTo(ex-s*2,ey-24,ox,ey-12);g.quadraticCurveTo(ox+s*2,ey+12,ex,ey+15);g.quadraticCurveTo(ix+s*2,ey+12,ix,ey-1);g.fill();
    g.save();g.clip();const ir=g.createLinearGradient(0,ey-18,0,ey+16);ir.addColorStop(0,"#2a0c04");ir.addColorStop(.3,"#a8320a");ir.addColorStop(.62,hex(ch.eye));ir.addColorStop(1,"#ffe6a8");
    g.fillStyle=ir;g.beginPath();g.ellipse(ex+s,ey-1,12.5,17,0,0,7);g.fill();g.strokeStyle="#2a0c04";g.lineWidth=1.8;g.stroke();
    g.strokeStyle="rgba(255,220,140,.6)";g.lineWidth=1;g.beginPath();g.ellipse(ex+s,ey+1,8,11,0,.3,2.8);g.stroke();
    g.fillStyle="#140604";g.beginPath();g.ellipse(ex+s,ey-2,4.6,7.5,0,0,7);g.fill();
    g.fillStyle="rgba(40,10,30,.35)";g.fillRect(ex-24,ey-26,48,13);
    g.fillStyle="#fff";g.beginPath();g.ellipse(ex-4,ey-8,4.8,4,-.4,0,7);g.fill();g.beginPath();g.arc(ex+6,ey+7,2.3,0,7);g.fill();g.globalAlpha=.8;g.beginPath();g.arc(ex+2,ey-11,1.3,0,7);g.fill();g.globalAlpha=1;g.restore();
    g.strokeStyle="#160a10";g.lineCap="round";g.lineWidth=6.5;g.beginPath();g.moveTo(ix,ey-1);g.quadraticCurveTo(ex-s*2,ey-24,ox,ey-12);g.stroke();
    g.lineWidth=4;g.beginPath();g.moveTo(ox,ey-12);g.quadraticCurveTo(ox+s*7,ey-15,ox+s*12,ey-22);g.stroke();
    g.lineWidth=2.4;g.beginPath();g.moveTo(ox-s*4,ey-16);g.lineTo(ox+s*6,ey-26);g.stroke();g.beginPath();g.moveTo(ex+s*6,ey-20);g.lineTo(ex+s*11,ey-28);g.stroke();
    g.lineWidth=2;g.beginPath();g.moveTo(ex-s*4,ey+15);g.quadraticCurveTo(ex+s*12,ey+13,ox-s*1,ey+6);g.stroke();
    g.fillStyle=hex(ch.hair[1]);g.beginPath();g.moveTo(ix+s*2,ey-27);g.quadraticCurveTo(ex,ey-33,ox+s*5,ey-38);g.lineTo(ox+s*4,ey-34);g.quadraticCurveTo(ex,ey-28,ix+s*3,ey-23);g.fill();g.strokeStyle="#4a0a10";g.lineWidth=1;g.stroke()}
  g.strokeStyle="rgba(160,70,60,.55)";g.lineWidth=2;g.lineCap="round";g.beginPath();g.moveTo(cx+3,ey+20);g.lineTo(cx+6,ey+28);g.lineTo(cx+1,ey+30);g.stroke();
  g.strokeStyle="#4a1a1a";g.lineWidth=3;g.beginPath();g.moveTo(cx-12,ey+46);g.quadraticCurveTo(cx,ey+49,cx+11,ey+43);g.lineTo(cx+14,ey+40);g.stroke();
  g.strokeStyle="rgba(150,60,60,.4)";g.lineWidth=2;g.beginPath();g.moveTo(cx-5,ey+53);g.lineTo(cx+5,ey+53);g.stroke()});
 hm.material=hm.material.clone();hm.material.map=tex}
SEGM=1;
/* Anime-Shading: farbige Schatten + kleines Glanzlicht */
const sunV={value:new THREE.Vector3()};
b.root.traverse(o=>{if(!o.isMesh||!o.material||!o.material.isMeshToonMaterial)return;const m=o.material.clone();const old=o.material.onBeforeCompile;const isSkin=m.map===PT.skin||(o.geometry===HEADG),isGloss=m.map===PT.hair||m.map===PT.metal;
  const tint=isSkin?"vec3(1.0,.74,.74)":"vec3(.86,.8,1.04)",gl=isGloss?".22":".0";
  m.onBeforeCompile=sh=>{if(old&&old!==THREE.Material.prototype.onBeforeCompile)old(sh);sh.uniforms.sunV=sunV;sh.fragmentShader="uniform vec3 sunV;\n"+sh.fragmentShader.replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;",
   "vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;float lamt=dot(reflectedLight.directDiffuse,vec3(.333))/max(dot(diffuseColor.rgb,vec3(.333)),.001);float shd=1.0-smoothstep(.25,.55,lamt);outgoingLight*=mix(vec3(1.0),"+tint+",shd);vec3 hv=normalize(sunV+normalize(vViewPosition));outgoingLight+=smoothstep(.955,.975,dot(normal,hv))*"+gl+"*(1.0-shd);")};
  m.customProgramCacheKey=()=>"deluxe"+tint+gl;o.material=m});
window._sunV=sunV;window._S=S;window._b=b;window._a=a;
animFighter(b,1,0);S.add(b.root);
});
const shotScene=async(name,cx,cy,cz,lx,ly,hide)=>{await p.evaluate(([cx,cy,cz,lx,ly,hide])=>{_a.root.visible=hide!='a';_b.root.visible=hide!='b';const c=new THREE.PerspectiveCamera(30,GW/GH,.1,100);c.position.set(cx,cy,cz);c.lookAt(lx,ly,0);c.updateMatrixWorld();
  const sv=new THREE.Vector3(5,12,9).normalize().transformDirection(c.matrixWorldInverse);_sunV.value.copy(sv);
  ren.setClearColor(0,1);for(let i=0;i<3;i++)_draw(_S,c)},[cx,cy,cz,lx,ly,hide]);await p.waitForTimeout(300);await p.screenshot({path:__dirname+'/max_'+name+'.png'})};
await shotScene('full',0,2.3,9.5,0,1.65);
await shotScene('cl',-1.25,2.75,4.4,-1.45,2.45,'b');
await shotScene('cr',1.25,2.75,4.4,1.45,2.45,'a');
await shotScene('bl',-5.0,3,-3.0,-1.45,2.0,'b');
await shotScene('br',5.0,3,-3.0,1.45,2.0,'a');
console.log('Fehler',await p.evaluate(()=>_err));
