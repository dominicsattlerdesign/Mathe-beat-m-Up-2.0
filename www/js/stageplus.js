/* ---------- Arenen-Plus: mehr Tiefe und Details für alle Arenen ----------
   Wiederverwendbare Bausteine (Bäume, Laternen, Wimpel, Lichterketten, Lichtstrahlen, Nebel, Bodenstreu, Banner, Dachtraufen ...)
   und pro Arena eine Liste, was dazukommt. Wird nach STG[i].build() aufgerufen.
   Viele kleine Teile (Blüten, Blätter, Streu) werden pro Farbe zu einem einzigen Mesh zusammengefasst, damit Tablets flüssig bleiben.
   Qualität „Niedrig“: keine Lichtstrahlen, weniger Streu und Blüten. */
const XP={a:new THREE.Vector3(),b:new THREE.Vector3(),m:new THREE.Matrix4(),q:new THREE.Quaternion(),e:new THREE.Euler(),s:new THREE.Vector3(),p:new THREE.Vector3()};
const PLUS=[];/* Dinge, die sich bewegen (Laternen schwingen, Lichtstrahlen atmen) */
/* viele Geometrien gleicher Farbe zu einer zusammenfassen */
function mergeG(parts){const P=[],N=[],U=[];for(const{g,m}of parts){const ng=g.index?g.toNonIndexed():g,p=ng.attributes.position,no=ng.attributes.normal,uv=ng.attributes.uv,nm=new THREE.Matrix3().getNormalMatrix(m);
  for(let i=0;i<p.count;i++){XP.a.fromBufferAttribute(p,i).applyMatrix4(m);P.push(XP.a.x,XP.a.y,XP.a.z);XP.b.fromBufferAttribute(no,i).applyMatrix3(nm).normalize();N.push(XP.b.x,XP.b.y,XP.b.z);U.push(uv?uv.getX(i):0,uv?uv.getY(i):0)}}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(P,3));g.setAttribute("normal",new THREE.Float32BufferAttribute(N,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(U,2));return g}
class Batch{constructor(){this.c={}}
  add(g,col,pos,scl,rot,o={}){const k=col+"|"+(o.kind||"")+"|"+(o.e||0)+"|"+(o.ol===0?0:1)+"|"+(o.basic?1:0);(this.c[k]=this.c[k]||{col,o,parts:[]}).parts.push({g,m:new THREE.Matrix4().compose(XP.p.set(...pos),XP.q.setFromEuler(XP.e.set(...(rot||[0,0,0]))),XP.s.set(...(typeof scl=="number"?[scl,scl,scl]:scl||[1,1,1])))})}
  flush(par=stage){for(const k in this.c){const{col,o,parts}=this.c[k],g=mergeG(parts);const m=new THREE.Mesh(g,o.basic?bmat(col):mat(col,o.e||0,o.kind));m.castShadow=!o.basic&&!o.noshadow;m.receiveShadow=!o.basic;if(o.ol!==0&&!o.basic)m.add(new THREE.Mesh(g,OL));par.add(m)}this.c={}}}
/* Kugelwolken: auf „Hoch“ rund, sonst gröber (weniger Dreiecke für Handys) */
const ICO=r=>{const d=QL>1?1:0;return geo("ico"+r+"_"+d,()=>new THREE.IcosahedronGeometry(r,d))};
/* flaches Herz (wenige Dreiecke) für Streu und Wimpel */
const HEART2=()=>geo("heart2",()=>{const h=new THREE.Shape();h.moveTo(0,-.5);h.bezierCurveTo(-.2,-.3,-.55,-.1,-.5,.18);h.bezierCurveTo(-.45,.45,-.1,.5,0,.25);h.bezierCurveTo(.1,.5,.45,.45,.5,.18);h.bezierCurveTo(.55,-.1,.2,-.3,0,-.5);return new THREE.ShapeGeometry(h,6)});
const nQ=n=>Math.max(1,Math.round(n*(QL==0?.45:QL==1?.75:1)));
/* gebogene, sich verjüngende Röhre (Stamm, Ast, Seil, Kabel) */
function xTube(pts,r0,r1,c,o={}){const crv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)));const N=o.n||24,R=o.r||8,g=new THREE.TubeGeometry(crv,N,1,R,false),P=g.attributes.position;
  for(let i=0;i<=N;i++){const t=i/N,c0=crv.getPointAt(t),r=lerp(r0,r1,t);for(let j=0;j<=R;j++){const k=i*(R+1)+j;XP.a.set(P.getX(k),P.getY(k),P.getZ(k)).sub(c0).multiplyScalar(r);P.setXYZ(k,c0.x+XP.a.x,c0.y+XP.a.y,c0.z+XP.a.z)}}
  g.computeVertexNormals();const m=new THREE.Mesh(g,o.e?mat(c,o.e,o.kind):mat(c,0,o.kind||"wood"));m.castShadow=o.shadow!==0;m.receiveShadow=true;if(o.ol!==0)m.add(new THREE.Mesh(g,OL));(o.par||stage).add(m);return crv}
/* durchhängende Linie zwischen zwei Punkten */
const sagPts=(x0,x1,y,z,sag,n=16)=>[...Array(n+1)].map((_,i)=>{const t=i/n;return[lerp(x0,x1,t),y-sag*Math.sin(t*Math.PI),z]});
/* Baum: Stamm mit Ästen und Blätter-/Blütenwolken. kind: "blossom" | "round" | "pine" */
function xTree(x,z,s,o={}){const T=o.trunk||0x4a2c22,L=o.leaves||[0xff9cc4,0xff86b6,0xffb0cf,0xf472a6],D=o.dark||0xc4467e,B=new Batch(),lean=o.lean||0;
  if(o.kind=="pine"){xTube([[x,0,z],[x,3.4*s,z]],.26*s,.12*s,T);for(let i=0;i<5;i++){const y=1.4*s+i*.95*s,r=(2.1-i*.36)*s;B.add(gK(1,1,9),P(L),[x,y+.5*s,z],[r,1.5*s,r],[0,rnd(6),0]);if(o.snow)B.add(gK(1,1,9),0xf4f8ff,[x,y+.78*s,z],[r*.72,.8*s,r*.72])}B.flush();return}
  xTube([[x,0,z],[x+lean*.3*s,1.4*s,z],[x+lean*.2*s,2.6*s,z+.1],[x+lean*.5*s,3.4*s,z]],.42*s,.2*s,T);
  const ends=[];for(const[dx,dy,dz]of[[-2.3,1.4,.4],[2.2,1.7,-.3],[-1,2.3,-.6],[1.1,2.1,.7],[0,2.7,0],[-2.7,.6,-.2],[2.8,.8,.2]]){
    const a=[x+lean*.4*s,2.6*s+Math.abs(dx)*.12*s,z],e=[x+lean*.5*s+dx*s,3.2*s+dy*s,z+dz*s];xTube([a,[lerp(a[0],e[0],.5),lerp(a[1],e[1],.4)+.2*s,lerp(a[2],e[2],.5)],e],.15*s,.05*s,T,{n:10,r:6});ends.push(e)}
  const k=nQ(o.kind=="round"?7:9);
  for(const e of ends){for(let i=0;i<k;i++)B.add(ICO(.5),P(L),[e[0]+rnd(-1,1)*s,e[1]+rnd(-.5,.7)*s,e[2]+rnd(-.7,.7)*s],rnd(.9,1.7)*s*(o.kind=="round"?1.25:1),[rnd(6),rnd(6),0]);
    for(let i=0;i<2;i++)B.add(ICO(.5),D,[e[0]+rnd(-.8,.8)*s,e[1]-.55*s,e[2]+rnd(-.5,.5)*s],rnd(1,1.5)*s)}
  B.flush()}
/* Papierlaterne an einer Schnur, leuchtet und schwingt leicht */
function xLantern(x,y,z,c=0xe8401e,glow=0x7a1606,s=1){const g=new THREE.Group();g.position.set(x,y,z);stage.add(g);const K=0x17141c;
  M(gC(.012,.012,.4,4),K,[0,-.2,0],g,0);M(gC(.17*s,.17*s,.06,14),K,[0,-.42,0],g,0);const l=M(gS(.24*s,18,14),c,[0,-.42-.26*s,0],g,1,glow);l.scale.y=1.25;M(gC(.17*s,.17*s,.06,14),K,[0,-.42-.53*s,0],g,0);M(gC(.015,.015,.25,4),0xffc21a,[0,-.42-.7*s,0],g,0);
  PLUS.push((dt,T)=>{g.rotation.z=Math.sin(T*1.3+x)*.05});return g}
/* Wimpelkette: Seil mit dreieckigen (oder Herz-) Fähnchen */
function xBunting(x0,x1,y,z,sag,cols,shape="tri"){const pts=sagPts(x0,x1,y,z,sag,24);xTube(pts,.022,.022,0x2a2028,{ol:0,n:40,r:5,kind:"cloth"});const B=new Batch(),n=Math.round(Math.abs(x1-x0)/.7);
  const tri=geo("tri",()=>{const s=new THREE.Shape();s.moveTo(-.22,0);s.lineTo(.22,0);s.lineTo(0,-.42);s.lineTo(-.22,0);return new THREE.ShapeGeometry(s)});
  for(let i=1;i<n;i++){const t=i/n,px=lerp(x0,x1,t),py=y-sag*Math.sin(t*Math.PI);const c=cols[i%cols.length];
    if(shape=="heart")B.add(HEART2(),c,[px,py-.24,z],.5,[0,0,Math.PI],{ol:0,kind:"cloth"});else if(shape=="card")B.add(gB(.34,.48,.01),c,[px,py-.26,z],1,[0,0,rnd(-.15,.15)],{ol:0});else B.add(tri,c,[px,py,z],1,[0,0,0],{ol:0,kind:"cloth"})}
  B.flush()}
/* Lichterkette mit kleinen leuchtenden Kugeln */
function xFairy(x0,x1,y,z,sag,cols){xTube(sagPts(x0,x1,y,z,sag,24),.015,.015,0x1a1820,{ol:0,n:40,r:4});const B=new Batch(),n=Math.round(Math.abs(x1-x0)/.55);
  for(let i=1;i<n;i++){const t=i/n;B.add(gS(.07,10,8),cols[i%cols.length],[lerp(x0,x1,t),y-sag*Math.sin(t*Math.PI)-.09,z],1,null,{basic:1})}B.flush()}
/* Lichtstrahlen (schräg, additiv, atmen leicht) */
let _shTex=null;const shaftTex=()=>_shTex||(_shTex=ctex(64,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"rgba(255,255,255,0)");gr.addColorStop(.3,"rgba(255,255,255,1)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,w,h);
  const gx=g.createLinearGradient(0,0,w,0);gx.addColorStop(0,"rgba(0,0,0,1)");gx.addColorStop(.5,"rgba(0,0,0,0)");gx.addColorStop(1,"rgba(0,0,0,1)");g.globalCompositeOperation="destination-out";g.fillStyle=gx;g.fillRect(0,0,w,h)}));
function xShafts(list,col=0xffe6c0,rot=-.38){if(QL==0)return;for(const[x,z,w,o]of list){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,18),new THREE.MeshBasicMaterial({map:shaftTex(),transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,color:col}));
  m.userData.keep=1;m.position.set(x,6,z);m.rotation.z=rot;m.renderOrder=3;stage.add(m);const ph=rnd(6);PLUS.push((dt,T)=>{m.material.opacity=o*(.75+.25*Math.sin(T*.6+ph))})}}
/* Nebelschichten zwischen Hintergrund-Ebenen */
function xMist(list,rgb="255,225,220"){const tx=ctex(16,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,`rgba(${rgb},0)`);gr.addColorStop(.6,`rgba(${rgb},.85)`);gr.addColorStop(1,`rgba(${rgb},.95)`);g.fillStyle=gr;g.fillRect(0,0,w,h)});
  for(const[z,y,o,h]of list){const m=new THREE.Mesh(new THREE.PlaneGeometry(140,h||6),new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:o,depthWrite:false,fog:false}));m.position.set(0,y,z);stage.add(m)}}
/* Streu auf dem Boden (Blüten, Blätter, Steinchen, Glut, Konfetti, Herzen, Schnee ...) */
function xScatter(n,cols,shape="petal",o={}){const B=new Batch(),x0=o.x0!=null?o.x0:-8.3,x1=o.x1!=null?o.x1:8.3,z0=o.z0!=null?o.z0:-2.9,z1=o.z1!=null?o.z1:2.9;n=nQ(n);
  const pet=geo("petal",()=>new THREE.CircleGeometry(.07,5));
  for(let i=0;i<n;i++){const c=P(cols),x=rnd(x0,x1),z=rnd(z0,z1),y=o.y!=null?o.y:.012,r=rnd(6);
    if(shape=="petal")B.add(pet,c,[x,y+rnd(.003),z],[1,1.5,1],[-Math.PI/2,0,r],{ol:0,noshadow:1});
    else if(shape=="leaf")B.add(pet,c,[x,y+rnd(.003),z],[1.4,2.4,1],[-Math.PI/2,0,r],{ol:0,noshadow:1});
    else if(shape=="pebble")B.add(ICO(.5),c,[x,y,z],[rnd(.08,.16),rnd(.04,.08),rnd(.08,.16)],[0,r,0],{ol:0,kind:"stone"});
    else if(shape=="ember")B.add(ICO(.5),c,[x,y+.02,z],rnd(.05,.1),[r,r,0],{basic:1});
    else if(shape=="confetti")B.add(gB(.09,.004,.05),c,[x,y,z],1,[0,r,0],{ol:0,noshadow:1});
    else if(shape=="heart")B.add(HEART2(),c,[x,y,z],rnd(.18,.26),[-Math.PI/2,0,r],{ol:0,noshadow:1});
    else if(shape=="snow")B.add(ICO(.5),c,[x,y,z],[rnd(.12,.3),rnd(.03,.06),rnd(.12,.3)],[0,r,0],{ol:0,noshadow:1});
    else if(shape=="paper")B.add(gB(.2,.004,.26),c,[x,y,z],1,[0,r,0],{ol:0,noshadow:1});
    else if(shape=="coin")B.add(gC(.07,.07,.02,12),c,[x,y,z],1,[rnd(-.2,.2),r,0],{ol:0,kind:"metal"});
    else if(shape=="feather")B.add(pet,c,[x,y+rnd(.003),z],[.9,3,1],[-Math.PI/2,0,r],{ol:0,noshadow:1});
    else if(shape=="shard")B.add(gO(.5),c,[x,y+.04,z],[rnd(.06,.12),rnd(.1,.2),rnd(.06,.12)],[rnd(.6),r,rnd(.6)],{e:c,ol:0})}
  B.flush()}
/* Stoffbanner mit Wappen */
function xBanners(xs,y,z,bg="#f6efe0",fg="#c81e2e",emb="circle",h=1.9,w=.95){const tx=ctex(128,256,(g,W,H)=>{g.fillStyle=bg;g.fillRect(0,0,W,H);g.fillStyle=fg;
    if(emb=="circle"){g.beginPath();g.arc(W/2,H*.36,38,0,7);g.fill();g.fillStyle=bg;g.beginPath();g.arc(W/2+10,H*.36-6,20,0,7);g.fill()}
    else if(emb=="flame"){g.beginPath();g.moveTo(W/2,H*.12);g.quadraticCurveTo(W*.85,H*.36,W/2,H*.58);g.quadraticCurveTo(W*.15,H*.36,W/2,H*.12);g.fill()}
    else if(emb=="star"){g.beginPath();for(let i=0;i<10;i++){const a=i/10*Math.PI*2-Math.PI/2,r=i%2?18:42;g.lineTo(W/2+Math.cos(a)*r,H*.36+Math.sin(a)*r)}g.fill()}
    else if(emb=="laurel"){g.lineWidth=8;g.strokeStyle=fg;g.beginPath();g.arc(W/2,H*.36,34,.6,Math.PI-.6,true);g.stroke();g.beginPath();g.arc(W/2,H*.36,10,0,7);g.fill()}
    g.fillRect(W/2-16,H*.66,32,8);g.fillRect(W/2-16,H*.72,32,8);g.fillRect(0,H-14,W,14);g.beginPath();g.moveTo(0,H);g.lineTo(W/2,H-24);g.lineTo(W,H);g.fill()});
  for(const x of xs){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h,1,6),new THREE.MeshToonMaterial({map:tx,gradientMap:GRAD,side:THREE.DoubleSide}));m.position.set(x,y,z);m.castShadow=true;stage.add(m);
    M(gC(.03,.03,w*1.25,6),0x2a1a14,[x,y+h/2+.04,z+.02],stage,0).rotation.z=Math.PI/2;const ph=rnd(6);PLUS.push((dt,T)=>{m.rotation.x=Math.sin(T*1.1+ph)*.04})}}
/* geschwungener Balken (Torii-Dach, Pagodenkante) */
function xBeam(w,h,d,lift,c,x,y,z){const g=new THREE.BoxGeometry(w,h,d,48,1,1),P=g.attributes.position;for(let i=0;i<P.count;i++){const t=P.getX(i)/(w/2);P.setY(i,P.getY(i)+lift*Math.pow(Math.abs(t),3.2))}g.computeVertexNormals();const m=M(g,c,[x,y,z],stage);m.receiveShadow=true;return m}
/* Dachtraufe mit Ziegelreihen */
function xRoof(y,z,len,depth,tile=0x4a5378,base=0x2e3452,edge=0x2a1a14,tilt=.42){const r=new THREE.Group();r.position.set(0,y,z);r.rotation.x=tilt;stage.add(r);
  M(gB(len,.14,depth),base,[0,0,0],r).receiveShadow=true;const B=new Batch();for(let i=-Math.floor(len/.6);i<=Math.floor(len/.6);i++)B.add(gC(.11,.11,depth,10),tile,[i*.3,.1,0],1,[Math.PI/2,0,0],{ol:0,kind:"stone"});B.flush(r);
  M(gB(len+.2,.22,.22),edge,[0,.05,depth/2+.02],r);M(gB(len,.28,.32),base,[0,.2,-depth/2],r);return r}
/* Seil mit Papierstreifen (Shimenawa) */
function xShimenawa(x0,x1,y,z,sag=.18,n=6){xTube(sagPts(x0,x1,y,z,sag,30),.07,.07,0xd8c48a,{n:40,r:8,kind:"cloth"});for(let i=0;i<n;i++){const t=(i+.5)/n,x=lerp(x0,x1,t);const p=M(gB(.14,.44,.02),0xffffff,[x,y-sag*Math.sin(t*Math.PI)-.3,z+.03],stage,0);p.rotation.z=.08}}
/* Wolkenbausch (für Himmel und Wolkenarena) */
function xCloud(x,y,z,s,col=0xffffff,dark=0xdfe6f6){const B=new Batch();for(let i=0;i<nQ(9);i++)B.add(ICO(.5),i<6?col:dark,[x+rnd(-1.6,1.6)*s,y+rnd(-.3,.5)*s-(i<6?0:.35*s),z+rnd(-.6,.6)*s],rnd(1.1,1.9)*s,[rnd(6),rnd(6),0]);B.flush()}
/* Pfütze, spiegelt etwas Licht */
function xPuddle(x,z,w,d,col=0x2a3a6a,glow=0x101a3a){const m=new THREE.Mesh(geo("pud",()=>new THREE.CircleGeometry(.5,24)),new THREE.MeshToonMaterial({color:col,gradientMap:GRAD,emissive:glow,transparent:true,opacity:.75}));m.rotation.x=-Math.PI/2;m.scale.set(w,d,1);m.position.set(x,.016,z);m.receiveShadow=true;stage.add(m)}
/* Dampf/Rauch: halbdurchsichtige Bällchen, die langsam aufsteigen */
function xSmoke(x,y,z,col=0x9aa0b0,n=6,s=1,op=.2){if(QL==0)n=3;for(let i=0;i<n;i++){const m=new THREE.Mesh(ICO(.5),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false,fog:false}));m.position.set(x,y,z);stage.add(m);const o=i/n,sp=rnd(.25,.4);
  PLUS.push((dt,T)=>{const p=(T*sp+o)%1;m.position.set(x+Math.sin(T+i)*.3*s,y+p*4*s,z);m.scale.setScalar((.6+p*1.6)*s);m.material.opacity=op*Math.sin(p*Math.PI)})}}
/* schwebende Kristalle */
function xFloatCrystal(x,y,z,c,s=1){const m=M(gO(.5),c,[x,y,z],stage,1,c);m.scale.set(.5*s,1*s,.5*s);const ph=rnd(6);PLUS.push((dt,T)=>{m.position.y=y+Math.sin(T*.9+ph)*.25;m.rotation.y+=dt*.5})}
/* hängende Kette */
function xChain(x,y0,y1,z,c=0x3a3e4c){const n=Math.round((y0-y1)/.16);const B=new Batch();for(let i=0;i<n;i++)B.add(gT(.07,.022,6,10),c,[x,y0-i*.16,z],1,[0,i%2?Math.PI/2:0,0],{ol:0,kind:"metal"});B.flush()}
/* Warnstreifen (Fabrik) */
function xStripes(x0,x1,z,w=.3){const n=Math.round((x1-x0)/.5);for(let i=0;i<n;i++){const m=M(gB(.25,.01,w),i%2?0x15131a:0xffc21a,[x0+i*.5+.25,.012,z],stage,0);m.rotation.y=.5;m.receiveShadow=true}}

/* ---------- was jede Arena dazubekommt ---------- */
const hideOld=(test)=>stage.children.forEach(m=>{if(m.isMesh&&m.material&&m.material.color&&test(m.material.color.getHex(),m))m.visible=false});
const ARPLUS={
  "Cherry Blossom Dojo"(){
    hideOld((c,m)=>(c==0x3a241c&&m.position.z<-5.5)||c==0xffb7d0||c==0xff8fb5||((c==0xc81e2e||c==0x15131a)&&m.position.z<-7));
    xTree(-11.5,-7.5,1.05,{lean:-1});xTree(11.8,-6.8,1,{lean:1});xTree(-17,-12,1.35,{lean:1});xTree(17.5,-13,1.4,{lean:-1});
    const R=0xd42a2a,K=0x17141c;for(const s of[-1,1]){M(gC(.34,.42,7.2,24),R,[s*4.2,3.6,-8],stage);M(gC(.5,.52,.8,24),K,[s*4.2,.4,-8],stage);M(gB(1.3,.24,1.3),0x8d8a98,[s*4.2,.12,-8],stage,1,0,"stone")}
    M(gB(10.8,.42,.5),R,[0,5.9,-8],stage);xBeam(12.2,.42,.9,.45,R,0,7.2,-8);xBeam(13.6,.55,1.15,.75,K,0,7.75,-8);M(gB(.5,1.3,.45),R,[0,6.55,-8],stage);M(gB(1.25,1.55,.14),0xffc21a,[0,6.6,-7.66],stage);M(gB(1.05,1.35,.16),K,[0,6.6,-7.62],stage);
    xRoof(3.62,-4.75,30.6,1.7);for(let i=-4;i<=3;i++)xLantern(i*3.2+1.6,3.1,-3.55);xBanners([-9.6,-4.8,4.8,9.6],1.85,-4.52);xShimenawa(-14,14,2.95,-4.42,.18,6);
    xShafts([[-6,-5.5,2.4,.16],[-2,-6.5,1.6,.12],[3.5,-5.8,2.8,.14],[8,-6.2,1.8,.12]]);xMist([[-14,1.6,.55],[-22,3,.5],[-34,5,.45]]);xScatter(200,[0xff9cc4,0xff86b6,0xffb0cf,0xf472a6]);sun.color.setHex(0xffd8b0)},
  "Pirate Cove"(){
    xBunting(-12,12,7.4,-3.6,1.1,[0xd6222c,0xffc21a,0x25a0ff,0xffffff,0x2a2028]);xBunting(-12,12,9.2,-5.5,1.3,[0xffc21a,0xd6222c,0xffffff]);
    for(const x of[-7.5,-2.5,2.5,7.5])xLantern(x,3.4,-3.7,0xffb84a,0x8a5a10,.9);
    xShafts([[-5,-6,2.6,.12],[2,-7,2,.1],[7,-6.5,2.4,.12]],0xfff2d0);xMist([[-16,.8,.5,4],[-30,2,.4,6]],"230,245,255");
    xScatter(26,[0xffc21a,0xffd84a],"coin");xScatter(40,[0x8a6a3a,0x6a4a2a],"pebble")},
  "Shadow Village"(){
    for(let i=-4;i<=4;i++)xLantern(i*2.6,4.4,-3.7,0xf4f0e6,0x5a6aa0,.9);xFairy(-12,12,5.6,-5.2,.9,[0xbfd0ff,0xd8ff8a,0xffffff]);
    xTree(-15,-8,1.2,{kind:"pine",leaves:[0x1c2a48,0x223258,0x18223e],trunk:0x1a1420});xTree(15.5,-8.5,1.3,{kind:"pine",leaves:[0x1c2a48,0x223258,0x18223e],trunk:0x1a1420});
    xShafts([[-4,-6,2.2,.1],[5,-6.5,2.6,.1]],0x9ab0ff,.3);xMist([[-12,1,.45],[-20,2.4,.4],[-32,4,.35]],"110,130,200");xScatter(90,[0x2a3458,0x3a4a7a,0x1c2240],"leaf")},
  "Colosseum of Champions"(){
    xBunting(-13,13,8.4,-3.8,1.4,[0xd6222c,0xffc21a]);xBunting(-13,13,10.2,-6,1.2,[0xffc21a,0x2a5fa8,0xd6222c]);
    xShafts([[-7,-6,3,.16],[-1,-7,2.2,.12],[5,-6.5,3.2,.16]],0xffe0a8);xMist([[-14,1.2,.4],[-26,3,.35]],"240,210,160");
    xScatter(120,[0xd8b880,0xc8a070,0xb89060],"pebble");xScatter(40,[0xd6222c,0xff5a3a],"petal")},
  "Dragon Volcano"(){
    xScatter(90,[0xff7a1a,0xffc21a,0xff3b2f],"ember");xScatter(60,[0x2c2428,0x3a3036],"pebble");
    for(const[x,z]of[[-12,-14],[10,-16],[0,-22]])xSmoke(x,4,z,0x3a2a2a,7,2.2,.45);xMist([[-12,.6,.45,3],[-22,2,.4]],"255,90,30");
    xShafts([[-6,-6,2.4,.12],[4,-6.5,2.8,.12]],0xff7a3a,.25);for(const[x,y,z]of[[-9,4.5,-6],[8.5,5,-6.5]])xFloatCrystal(x,y,z,0xff5a1a,1.2)},
  "Playroom"(){
    xBunting(-11,11,7.6,-4.2,1,[0xff5ab0,0xffc21a,0x2fa8ff,0x3fe06b,0xc9b8ff]);xFairy(-11,11,6.4,-4.6,.6,[0xffe14d,0xff8ac8,0x8ae0ff,0xb0ff9a]);
    xShafts([[-5,-5.5,2.6,.14],[1,-6,2,.1]],0xfff6d8,-.5);xScatter(110,[0xff5ab0,0xffc21a,0x2fa8ff,0x3fe06b,0xffffff],"confetti")},
  "Arcade Hall"(){
    xFairy(-12,12,7.2,-3.8,.8,[0xff3bd4,0x25d4ff,0xffe14d,0x3fe06b]);xFairy(-12,12,8.6,-5.4,.6,[0x25d4ff,0xff3bd4]);
    xShafts([[-6,-5,2,.14],[0,-5.5,1.6,.12],[6,-5,2,.14]],0xff3bd4,0);xShafts([[-3,-5.2,1.6,.12],[3,-5.2,1.6,.12]],0x25d4ff,0);
    xMist([[-6,.4,.35,2.4]],"120,40,180");xScatter(70,[0xff3bd4,0x25d4ff,0xffe14d],"confetti");xScatter(20,[0xffc21a],"coin")},
  "Neon Alley"(){
    for(const[y,z,s]of[[6.4,-3.8,.7],[7.6,-5.6,.9],[8.8,-7.5,.6]])xTube(sagPts(-13,13,y,z,s,24),.02,.02,0x0a0a12,{ol:0,n:40,r:4});
    for(const x of[-6,0,6])xLantern(x,6.0,-3.8,0xffe0a0,0xa07020,.7);
    for(const[x,z,w,d]of[[-5,1.2,2.4,1],[3.5,-1.6,1.8,.8],[6.8,1.8,1.4,.7],[-1,2.2,1.2,.5]])xPuddle(x,z,w,d,0x1a2a5a,0x2a1050);
    xSmoke(-9,0,-3.2,0x8a90a8,6,1,.18);xSmoke(8.5,0,-3.4,0x8a90a8,6,1,.18);xFairy(-12,12,7,-4.4,.8,[0xff3bd4,0x25d4ff,0xffe14d]);xMist([[-8,.5,.35,2.5]],"80,90,160");xScatter(30,[0xe8e4d8,0xc8c4b8],"paper")},
  "Storm Rooftops"(){
    for(const[y,z,s]of[[6.2,-4,.8],[7.4,-6,.7]])xTube(sagPts(-14,14,y,z,s,24),.02,.02,0x0a0a12,{ol:0,n:40,r:4});
    for(const[x,z,w,d]of[[-4,1,2.6,1.1],[4,-1.4,2,.9],[7,2,1.4,.6],[-7.2,-1.8,1.6,.7]])xPuddle(x,z,w,d,0x2a3450,0x0a1020);
    xFairy(-12,12,5.4,-3.9,.7,[0xffe0a0,0xffc860]);for(const x of[-8,8])xLantern(x,5,-3.9,0xffd84a,0x8a6a10,.8);
    for(const[x,z]of[[-11,-7],[6,-9],[12,-6.5]])xSmoke(x,4,z,0x8090a8,5,1.3,.2);xShafts([[-3,-6,1.6,.08],[5,-6.5,1.4,.08]],0xcfe4ff,.1);
    xMist([[-10,.8,.4,3],[-20,2.4,.35]],"140,160,200");xScatter(50,[0x3a4a3a,0x5a4a2a],"leaf");xScatter(30,[0xd8d4c8],"paper")},
  "Fire Temple"(){
    for(let i=-4;i<=3;i++)xLantern(i*3+1.5,4.6,-3.6,0xd6222c,0x7a1606);xBanners([-8.2,8.2],2.2,-4.3,"#2a0e0a","#ffc21a","flame",2.4,1);
    xSmoke(-5.5,1.2,-3.4,0xb0a098,5,.6,.18);xSmoke(5.5,1.2,-3.4,0xb0a098,5,.6,.18);
    xShafts([[-5,-6,2.6,.14],[3,-6.5,2.2,.12]],0xffb070);xMist([[-14,1,.4],[-24,2.6,.35]],"255,120,60");xScatter(60,[0xff7a1a,0xffc21a],"ember")},
  "Card Palace"(){
    xBunting(-12,12,7.4,-3.8,1,[0xffffff,0xfff2f6],"card");xBunting(-12,12,9,-5.6,1.2,[0xffffff],"card");
    xShafts([[-4,-5,2.4,.14],[4,-5,2.4,.14]],0xff8ae0,0);xMist([[-8,.4,.3,2.4]],"200,60,180");
    xScatter(70,[0xff3dcb,0xffc21a,0xffffff],"confetti");xScatter(16,[0xffffff,0xfff4f0],"paper")},
  "Robot Factory"(){
    for(const[y,z,s]of[[7.2,-4,.9],[8.4,-6,.7]])xTube(sagPts(-14,14,y,z,s,24),.04,.04,0x15131a,{ol:0,n:40,r:6});
    xChain(-9,9,4,-4.2);xChain(9.5,9,4.6,-4.2);xStripes(-8.4,8.4,3.15,.3);xStripes(-8.4,8.4,-3.15,.3);
    xSmoke(-10,.5,-3.6,0xa0a8b8,6,1,.18);xSmoke(10,.5,-3.6,0xa0a8b8,6,1,.18);
    xShafts([[-6,-5.5,2.4,.12],[2,-6,2,.1],[7,-5.5,2.4,.12]],0xc0e0ff,-.2);xScatter(40,[0x8a94a8,0x5a6070,0xffc21a],"pebble")},
  "Moon Temple"(){
    xTree(-11.5,-6.5,1,{lean:-1,leaves:[0xf4f0ff,0xe0d8ff,0xc9b8ff,0xffffff],dark:0x8a7ac0,trunk:0x3a3450});xTree(11.5,-6.5,1,{lean:1,leaves:[0xf4f0ff,0xe0d8ff,0xc9b8ff,0xffffff],dark:0x8a7ac0,trunk:0x3a3450});
    for(const x of[-6,-2,2,6]){xChain(x,8,6.2,-4,0xc9b8ff);xFloatCrystal(x,5.8,-4,0xc9b8ff,.7)}
    xShafts([[-3,-6,3,.16],[3,-6,3,.16],[0,-7,2,.12]],0xd8d8ff,0);xMist([[-10,.6,.45,3],[-20,2,.4]],"170,170,240");xScatter(110,[0xffffff,0xe0d8ff,0xc9b8ff])},
  "Jade Garden"(){
    xTree(-12.5,-6.8,1.05,{kind:"round",lean:-1,leaves:[0x3fbf5b,0x2fa04a,0x5ad070,0x48b860],dark:0x1f7a3a,trunk:0x5c3a1e});xTree(13,-7.2,1.1,{kind:"round",lean:1,leaves:[0x3fbf5b,0x2fa04a,0x5ad070],dark:0x1f7a3a,trunk:0x5c3a1e});
    xTree(-18,-12,1.3,{lean:1});for(const x of[-6.5,-2.2,2.2,6.5])xLantern(x,5.2,-3.9,0xffc21a,0x8a5a10,.9);
    xShafts([[-6,-6,2.6,.14],[2,-6.5,2.2,.12],[7,-6,2.6,.12]],0xfff6d0);xMist([[-14,1.2,.45],[-24,2.6,.4]],"200,240,210");
    xScatter(80,[0x3fbf5b,0x5ad070,0x2fa04a],"leaf");xScatter(50,[0xff9cc4,0xffffff])},
  "Oni Mountain Shrine"(){
    xTree(-12,-6.5,1.1,{kind:"pine",snow:1,leaves:[0x2a5a3a,0x234a30,0x2f6a44],trunk:0x3a2418});xTree(12.5,-7,1.2,{kind:"pine",snow:1,leaves:[0x2a5a3a,0x234a30],trunk:0x3a2418});
    xTree(-17,-11,1.4,{kind:"pine",snow:1,leaves:[0x2a5a3a,0x234a30],trunk:0x3a2418});xShimenawa(-3.6,3.6,6.1,-5.2,.35,5);
    for(const x of[-7,7])xLantern(x,4.4,-3.8,0xd6222c,0x7a1606);xMist([[-10,.6,.5,3],[-18,2,.5],[-30,4,.45]],"230,236,248");xScatter(140,[0xffffff,0xf0f4ff],"snow")},
  "Cloud Arena"(){
    for(const[x,y,z,s]of[[-10,-.6,-2,1.3],[10,-.8,-1.5,1.4],[-6,-1.5,3.6,1.1],[6,-1.6,3.8,1.2],[0,-1.8,4.6,1.2],[-14,1,-6,1.6],[14,1.5,-7,1.7]])xCloud(x,y,z,s);
    xShafts([[-6,-5,3,.2],[0,-6,2.4,.16],[6,-5,3,.2]],0xfff2c0,-.15);xScatter(50,[0xffffff,0xfff8e8],"feather");xScatter(30,[0xffe98a],"ember")},
  "Throne of the Void"(){
    for(const[x,y,z,c]of[[-9,4,-5,0x9a3cff],[-6,6.5,-7,0xff2a4a],[7,5,-5.5,0x9a3cff],[10,7,-8,0xff2a4a],[0,8.4,-9,0x9a3cff]])xFloatCrystal(x,y,z,c,1);
    xChain(-4.5,10,5,-4.6,0x2a2236);xChain(4.5,10,5.6,-4.6,0x2a2236);xShafts([[-4,-6,2.4,.14],[4,-6,2.4,.14]],0x9a3cff,0);
    xMist([[-8,.4,.45,2.6],[-18,1.6,.4]],"110,40,180");xScatter(50,[0x9a3cff,0xff2a4a],"shard")},
  "Formula Library"(){
    for(const x of[-6,-2,2,6]){xChain(x,9,6.2,-3.9,0x8a6a3a);const g=new THREE.Group();g.position.set(x,6.1,-3.9);stage.add(g);M(gK(.45,.4,14),0x2a5a4a,[0,0,0],g,1);M(gS(.16,12,10),0xffe6a0,[0,-.22,0],g,0,0xffc060)}
    xShafts([[-5,-5.5,2.4,.16],[1,-6,2,.12],[6,-5.5,2.4,.14]],0xfff0c0,-.25);xMist([[-6,.4,.35,2.4]],"60,140,120");
    xScatter(40,[0xf4ead0,0xe8dcc0,0xffffff],"paper");xScatter(30,[0x3dffd0,0xffc21a],"ember")},
  "Love Palace"(){
    xBunting(-12,12,7.8,-3.9,1.1,[0xff5ca8,0xff3b5c,0xffc21a,0xff8ac8],"heart");xFairy(-12,12,6.6,-4.4,.7,[0xffe14d,0xff8ac8,0xffffff]);
    xTree(-12,-6.5,1,{lean:-1});xTree(12.5,-6.8,1,{lean:1});
    xShafts([[-5,-6,2.6,.14],[4,-6,2.6,.14]],0xffd0e8);xMist([[-14,1,.45],[-24,2.4,.4]],"255,210,230");xScatter(90,[0xff5ca8,0xff8ac8,0xff3b5c],"heart");xScatter(60,[0xffb0cf,0xffffff])},
};
function arenaPlus(si){PLUS.length=0;const f=ARPLUS[STG[si].en];if(!f)return;const s0=SEGM;SEGM=1;try{f()}catch(e){console.warn("arenaPlus",e)}finally{SEGM=s0}}
function plusStep(dt,T){for(const f of PLUS)f(dt,T)}
