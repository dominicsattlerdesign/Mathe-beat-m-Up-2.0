/* ---------- 3D-Grundlagen: Renderer, Cel-Shading, Kamera, Zeitlupe, Effekte ---------- */
const $=s=>document.querySelector(s),R=rI,P=rP;
const rnd=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,eOut=p=>1-(1-p)*(1-p),eIn=p=>p*p;
const hex=c=>"#"+c.toString(16).padStart(6,"0");
const cv=$("#c"),ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:"high-performance"});
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,300);
const hemi=new THREE.HemisphereLight(0xffffff,0x555577,.62);sc.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,.75);sun.position.set(6,13,9);sc.add(sun);
/* Echte Schatten: die Sonne wirft sie von Figuren und Objekten auf Boden und Kulissen */
ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0012;sun.shadow.radius=3;
{const c=sun.shadow.camera;c.left=-13;c.right=13;c.top=13;c.bottom=-7;c.near=1;c.far=46;c.updateProjectionMatrix()}
/* Zwei farbige Kampflichter, die bei Treffern aufblitzen */
const colA=new THREE.PointLight(0xff5a1a,0,22),colB=new THREE.PointLight(0x25d4ff,0,22);colA.position.set(-6,5,5);colB.position.set(6,5,5);sc.add(colA,colB);
const rim=new THREE.PointLight(0xffffff,.7,34);rim.position.set(0,5,-5);sc.add(rim);
const fxLight=new THREE.PointLight(0xffffff,0,16);fxLight.position.set(0,2,2);sc.add(fxLight);

/* Cel-Shading: Stufenverlauf + Tuschekontur (Rückseiten entlang der Normalen aufgeblasen) */
/* weicher Anime-Verlauf: Schattenton, Mittelton, Licht mit sanften Übergängen */
const GRAD=(()=>{const v=[70,84,112,156,192,214,228,236],d=new Uint8Array(v.length*4);v.forEach((x,i)=>d.set([x,x,x,255],i*4));const t=new THREE.DataTexture(d,v.length,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.LinearFilter;t.needsUpdate=true;return t})();
/* Oberflächen-Texturen (Stoff, Haut, Haar, Holz, Stein, Metall), einmal gemalt und über die Farbe getönt */
const PT={};
function ptex(kind){if(PT[kind])return PT[kind];const t=ctex(256,256,(g,w,h)=>{
  const lin=(c0,c1,hor)=>{const gr=hor?g.createLinearGradient(0,0,w,0):g.createLinearGradient(0,0,0,h);gr.addColorStop(0,c0);gr.addColorStop(1,c1);g.fillStyle=gr;g.fillRect(0,0,w,h)};
  if(kind=="cloth"){lin("#ffffff","#c4c2d0");g.strokeStyle="rgba(0,0,20,.07)";g.lineWidth=1;for(let i=0;i<w;i+=4){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.moveTo(0,i);g.lineTo(w,i);g.stroke()}
    g.strokeStyle="rgba(0,0,30,.13)";g.lineWidth=3;for(let i=0;i<7;i++){const x=rnd(w),y=rnd(h);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+rnd(-30,30),y+40,x+rnd(-14,14),y+rnd(60,110));g.stroke()}}
  else if(kind=="skin"){lin("#ffffff","#e2c9c6")}
  else if(kind=="hair"){lin("#b9b9c4","#8f8fa0");g.strokeStyle="rgba(0,0,20,.16)";g.lineWidth=2;for(let i=0;i<70;i++){const x=rnd(w);g.beginPath();g.moveTo(x,0);g.lineTo(x+rnd(-8,8),h);g.stroke()}
    const gr=g.createLinearGradient(0,h*.25,0,h*.55);gr.addColorStop(0,"rgba(255,255,255,0)");gr.addColorStop(.5,"rgba(255,255,255,.95)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,w,h)}
  else if(kind=="wood"){lin("#ffffff","#d9cfc4");g.lineWidth=1.5;for(let i=0;i<46;i++){g.strokeStyle=`rgba(40,20,0,${rnd(.08,.24)})`;const x=rnd(w);g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+rnd(-9,9),h*.3,x+rnd(-9,9),h*.7,x+rnd(-5,5),h);g.stroke()}
    for(let i=0;i<3;i++){g.strokeStyle="rgba(40,20,0,.3)";g.beginPath();g.ellipse(rnd(w),rnd(h),5,11,0,0,7);g.stroke()}}
  else if(kind=="stone"){lin("#ffffff","#cfcfd6");for(let i=0;i<900;i++){g.fillStyle=Math.random()<.5?`rgba(0,0,0,${rnd(.04,.16)})`:`rgba(255,255,255,${rnd(.1,.3)})`;const r=rnd(1,3.4);g.fillRect(rnd(w),rnd(h),r,r)}
    g.strokeStyle="rgba(0,0,0,.28)";g.lineWidth=1.6;for(let i=0;i<5;i++){let x=rnd(w),y=rnd(h);g.beginPath();g.moveTo(x,y);for(let j=0;j<4;j++){x+=rnd(-26,26);y+=rnd(8,30);g.lineTo(x,y)}g.stroke()}}
  else{const gr=g.createLinearGradient(0,0,w,0);[[0,"#8d8d9a"],[.2,"#ffffff"],[.42,"#9a9aa8"],[.6,"#f2f2f6"],[.82,"#7d7d8c"],[1,"#c9c9d2"]].forEach(a=>gr.addColorStop(a[0],a[1]));g.fillStyle=gr;g.fillRect(0,0,w,h);
    g.strokeStyle="rgba(0,0,0,.07)";for(let i=0;i<h;i+=3){g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke()}}
});t.wrapS=t.wrapT=THREE.RepeatWrapping;return PT[kind]=t}
/* Randlicht: Kanten leuchten in der Eigenfarbe auf, wie im Anime */
const rimShader=s=>{s.fragmentShader=s.fragmentShader.replace("#include <tonemapping_fragment>","gl_FragColor.rgb+=pow(1.0-clamp(dot(normalize(vViewPosition),normal),0.0,1.0),3.0)*(diffuseColor.rgb*0.34+0.05);\n#include <tonemapping_fragment>")};
const MATS={},BM={};
function mat(c,e,kind){const k=c+"_"+(e||0)+(kind||"");if(MATS[k])return MATS[k];const m=new THREE.MeshToonMaterial({color:c,gradientMap:GRAD,emissive:e||0,map:kind?ptex(kind):null});if(kind&&kind!="wood"&&kind!="stone")m.onBeforeCompile=rimShader;return MATS[k]=m}
function bmat(c){return BM[c]||(BM[c]=new THREE.MeshBasicMaterial({color:c}))}
const OL=new THREE.MeshBasicMaterial({color:0x0b0912,side:THREE.BackSide});
OL.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <begin_vertex>","vec3 transformed=position+normalize(normal)*0.022;")};
const GC={},geo=(k,f)=>GC[k]||(GC[k]=f());
const gS=(r,w=20,h=14)=>geo(`s${r},${w},${h}`,()=>new THREE.SphereGeometry(r,w,h));
const gB=(x,y,z)=>geo(`b${x},${y},${z}`,()=>new THREE.BoxGeometry(x,y,z));
const gC=(rt,rb,h,n=14)=>geo(`c${rt},${rb},${h},${n}`,()=>new THREE.CylinderGeometry(rt,rb,h,n));
const gK=(r,h,n=10)=>geo(`k${r},${h},${n}`,()=>new THREE.ConeGeometry(r,h,n));
const gT=(r,t,a=8,b=18,arc=6.2832)=>geo(`t${r},${t},${a},${b},${arc}`,()=>new THREE.TorusGeometry(r,t,a,b,arc));
const gO=r=>geo("o"+r,()=>new THREE.OctahedronGeometry(r));
const gD=r=>geo("d"+r,()=>new THREE.DodecahedronGeometry(r));
/* Drehkörper aus einem Profil [[Radius,Höhe],…]: für Arme, Beine, Rumpf, Kopf */
const gL=(pts,seg=18,w=1)=>geo("l"+w+JSON.stringify(pts)+seg,()=>new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(Math.max(.0005,p[0]*w),p[1])),seg));
/* M: Mesh anlegen. c = Farbe oder Material, o = Kontur ja/nein, e = Leuchtfarbe, kind = Oberfläche */
function M(g,c,p,par,o=1,e,kind){const m=new THREE.Mesh(g,typeof c=="number"?mat(c,e,kind):c);if(p)m.position.set(p[0],p[1],p[2]);m.castShadow=true;if(o)m.add(new THREE.Mesh(g,OL));if(par)par.add(m);return m}
function ctex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);return t}

/* Zeit: Weltzeit (läuft in Zeitlupe langsamer) und Echtzeit */
let TS=1;const tws=[],rtw=[];
const tw=(d,f)=>new Promise(r=>tws.push({d,t:0,f:f||(()=>{}),r}));
const rt=(d,f)=>new Promise(r=>rtw.push({d,t:0,f:f||(()=>{}),r}));
const wait=d=>tw(d);
function stepTw(list,dt){for(let i=list.length-1;i>=0;i--){const w=list[i];w.t+=dt;const p=Math.min(1,w.t/w.d);w.f(p);if(p>=1){const k=list.indexOf(w);if(k>=0)list.splice(k,1);w.r()}}}

/* Kamera */
const CAM={p:new THREE.Vector3(0,3.4,16),l:new THREE.Vector3(0,1.8,0),tp:new THREE.Vector3(0,3.4,16),tl:new THREE.Vector3(0,1.8,0),k:5,shake:0,mode:"menu"};
const VO={x:0,y:0,fw:1,fh:1};
/* Spielfeldgröße GW×GH ist immer quer; im Hochformat wird die ganze Seite gedreht */
let GW=innerWidth,GH=innerHeight;
function applyOff(){const w=GW,h=GH;if(VO.x||VO.y)cam.setViewOffset(w,h,Math.round(VO.x),Math.round(VO.y),w,h);else cam.clearViewOffset();cam.updateProjectionMatrix()}
let UIS=1;
function rs(){const iw=innerWidth,ih=innerHeight,rot=ih>iw,b=document.body.style,r=document.documentElement.style;GW=rot?ih:iw;GH=rot?iw:ih;
  /* Oberfläche ist für ca. 640 px Höhe und 1000 px Breite gebaut; darunter wird sie verkleinert */
  UIS=clamp(Math.min(GH/640,GW/1000),.45,1);r.setProperty("--uis",UIS);
  b.width=rot?GW+"px":"";b.height=rot?GH+"px":"";b.transform=rot?`translateX(${iw}px) rotate(90deg)`:"";r.setProperty("--vw",GW/100+"px");r.setProperty("--vh",GH/100+"px");
  const w=GW,h=GH;ren.setPixelRatio(Math.min(2,devicePixelRatio||1));ren.setSize(w,h,false);cam.aspect=w/h;applyOff()}
addEventListener("resize",()=>{rs();if(typeof layout=="function")layout()});
function camStep(dt){const k=1-Math.exp(-CAM.k*dt);CAM.p.lerp(CAM.tp,k);CAM.l.lerp(CAM.tl,k);CAM.shake*=Math.pow(.015,dt);
  cam.position.set(CAM.p.x+rnd(-1,1)*CAM.shake,CAM.p.y+rnd(-1,1)*CAM.shake,CAM.p.z);cam.lookAt(CAM.l)}
function scr(x,y,z=0){const v=new THREE.Vector3(x,y,z).project(cam);return[(v.x*.5+.5)*GW,(-v.y*.5+.5)*GH]}

/* ---------- Effekte ---------- */
const fxs=[],debris=[];
const addMat=(c,o=1)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false});
function fxAdd(m,l,u,real){sc.add(m);fxs.push({m,l,t:0,u,real});return m}
function fxClear(){for(const f of fxs)sc.remove(f.m);fxs.length=0;for(const d of debris)sc.remove(d.m);debris.length=0}
function sparks(x,y,z,n,cols,sp=7){for(let i=0;i<n;i++){const m=new THREE.Mesh(gO(.12),bmat(P(cols)));m.position.set(x,y,z);m.scale.setScalar(rnd(.5,1.5));sc.add(m);
  debris.push({m,v:new THREE.Vector3(rnd(-sp,sp),rnd(-1,sp),rnd(-sp*.4,sp*.6)),s:new THREE.Vector3(rnd(9),rnd(9),rnd(9)),l:rnd(.4,.9),fx:1})}}
const STAR=(()=>{const s=new THREE.Shape();for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=i%2?.3:(i%4?0.75:1.15);i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}return new THREE.ShapeGeometry(s)})();
function star(x,y,c,s=1){const m=new THREE.Mesh(STAR,addMat(0xffffff));m.position.set(x,y,.9);m.rotation.z=rnd(6);fxAdd(m,.14,(m,p)=>{m.scale.setScalar(s*(.5+p*1.3));m.material.opacity=1-p*p},1);
  const n=new THREE.Mesh(STAR,addMat(c,.8));n.position.set(x,y,.85);n.rotation.z=rnd(6);fxAdd(n,.22,(m,p)=>{m.scale.setScalar(s*(.9+p*1.6));m.material.opacity=.8*(1-p)},1)}
function slashArc(x,y,c,rot,s=1.5){const m=new THREE.Mesh(geo("arc",()=>new THREE.RingGeometry(.86,1.12,24,1,0,2.5)),addMat(c));m.position.set(x,y,.8);m.rotation.z=rot;
  fxAdd(m,.2,(m,p)=>{m.scale.setScalar(s*(.7+p*.7));m.rotation.z=rot+p*1.4;m.material.opacity=1-p},1)}
function ring(x,y,z,c,r=5,l=.5){const m=new THREE.Mesh(geo("ring",()=>new THREE.RingGeometry(.78,1,36)),addMat(c));m.position.set(x,y,z);m.rotation.x=-Math.PI/2;
  fxAdd(m,l,(m,p)=>{m.scale.setScalar(.3+eOut(p)*r);m.material.opacity=1-p})}
function dust(x,z=0,n=7,c=0xcfc6b4){for(let i=0;i<n;i++){const m=new THREE.Mesh(gS(.22,8,6),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.7,depthWrite:false}));
  const vx=rnd(-2.6,2.6),vy=rnd(.4,1.6),vz=rnd(-1,1.4);m.position.set(x,.15,z);fxAdd(m,rnd(.4,.7),(m,p,dt)=>{m.position.x+=vx*dt;m.position.y+=vy*dt;m.position.z+=vz*dt;m.scale.setScalar(1+p*2.4);m.material.opacity=.7*(1-p)})}}
function bolt(x,c,top=15,y0=0){const g=new THREE.Group();let px=x+rnd(-2,2),py=top;const mt=addMat(c),mw=addMat(0xffffff);
  while(py>y0){const ny=Math.max(y0,py-rnd(1,2.2)),nx=ny<=y0?x:x+rnd(-.9,.9),dx=nx-px,dy=ny-py,len=Math.hypot(dx,dy);
    for(const[w,mm]of[[.34,mt],[.11,mw]]){const s=new THREE.Mesh(gB(1,1,1),mm);s.scale.set(w,len,w*.4);s.position.set((px+nx)/2,(py+ny)/2,.3);s.rotation.z=Math.atan2(dy,dx)-Math.PI/2;g.add(s)}px=nx;py=ny}
  fxAdd(g,.28,(m,p)=>{mt.opacity=p<.7?(Math.random()<.75?1:.2):1-p;mw.opacity=mt.opacity})}
function pillar(x,c,r=1.3,h=14,l=.7){const m=new THREE.Mesh(geo("pil",()=>new THREE.CylinderGeometry(1,1,1,18,1,true)),addMat(c,.85));m.position.set(x,h/2,0);
  fxAdd(m,l,(m,p)=>{const w=r*(.25+eOut(Math.min(1,p*3))*.9)*(1-p*.5);m.scale.set(w,h,w);m.material.opacity=.85*(1-p*p);m.rotation.y+=.3});
  const n=new THREE.Mesh(GC.pil,addMat(0xffffff,.9));n.position.copy(m.position);fxAdd(n,l*.7,(m,p)=>{const w=r*.45*(1-p);m.scale.set(w,h,w);m.material.opacity=.9*(1-p)})}
function beam(x1,x2,y,c,r=.55,l=.6){const len=Math.abs(x2-x1);for(const[w,cc]of[[1,c],[.45,0xffffff]]){const m=new THREE.Mesh(gC(1,1,1,14),addMat(cc,.9));m.rotation.z=Math.PI/2;m.position.set((x1+x2)/2,y,0);
  fxAdd(m,l,(m,p)=>{const s=r*w*(p<.15?p/.15:1-(p-.15)/.85)*(1+Math.sin(p*60)*.12);m.scale.set(s,len,s)})}}
function streak(x,y,dir,c,len=3){for(let i=0;i<7;i++){const l=len*rnd(.5,1.2),m=new THREE.Mesh(gB(1,1,1),addMat(i%3?c:0xffffff,.8));m.scale.set(l,rnd(.03,.09),.03);m.position.set(x-dir*(l/2+rnd(.8)),y+rnd(-1.1,1.1),rnd(-.4,.6));fxAdd(m,rnd(.16,.3),(m,p)=>{m.material.opacity=.8*(1-p);m.scale.x=l*(1-p*.5);m.position.x-=dir*.04})}}
function aura(f,c,l){const t0={n:0};const g=new THREE.Group();fxAdd(g,l,(m,p,dt)=>{t0.n+=dt*40;while(t0.n>1){t0.n--;const s=new THREE.Mesh(gB(.07,.7,.07),addMat(Math.random()<.3?0xffffff:c,.9));
  const a=rnd(6.28),r=rnd(.5,1.3),x=f.root.position.x+Math.cos(a)*r,z=Math.sin(a)*r;s.position.set(x,rnd(0,.6),z);const v=rnd(5,10);fxAdd(s,.45,(m,p,dt)=>{m.position.y+=v*dt;m.material.opacity=.9*(1-p)})}})}
const GLOW=ctex(128,128,(g)=>{const gr=g.createRadialGradient(64,64,2,64,64,64);gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(.25,"rgba(255,255,255,.55)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,128,128)});
/* glow: weicher Lichtfleck in Farbe c, der aufblüht und verblasst */
function glow(x,y,c,size=3,life=.35,z=.6){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));m.position.set(x,y,z);
  fxAdd(m,life,(m,p)=>{m.scale.setScalar(size*(.5+eOut(p)*.8));m.material.opacity=1-p*p},1);return m}
/* Lichtkegel von oben, z. B. für Spezial-Attacken */
function shaft(x,c,l=.8,w=1.4){const m=new THREE.Mesh(geo("shaft",()=>new THREE.CylinderGeometry(.35,1,1,16,1,true)),addMat(c,.4));m.position.set(x,8,0);fxAdd(m,l,(m,p)=>{m.scale.set(w,16,w);m.material.opacity=.4*Math.sin(p*Math.PI)},1)}
function colorBurst(c1,c2,i=2.2){colA.color.setHex(c1);colB.color.setHex(c2);colA.intensity=colB.intensity=i}
function flashLight(c,i=3,x=0,y=2){fxLight.color.setHex(c);fxLight.intensity=Math.min(1.3,i*.26);fxLight.position.set(x,y,2.5)}
function stepFx(dt,rdt){
  for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.t+=f.real?rdt:dt;const p=Math.min(1,f.t/f.l);f.u&&f.u(f.m,p,dt);if(p>=1){sc.remove(f.m);const k=fxs.indexOf(f);if(k>=0)fxs.splice(k,1)}}
  for(let i=debris.length-1;i>=0;i--){const d=debris[i],m=d.m;d.v.y-=20*dt;m.position.addScaledVector(d.v,dt);m.rotation.x+=d.s.x*dt;m.rotation.y+=d.s.y*dt;m.rotation.z+=d.s.z*dt;
    if(!d.fx&&m.position.y<(d.r||.15)&&d.v.y<0&&Math.abs(m.position.x)<8.6&&Math.abs(m.position.z)<3.3){m.position.y=d.r||.15;d.v.y*=-.38;d.v.x*=.6;d.v.z*=.6;d.s.multiplyScalar(.55)}
    d.l-=dt;if(d.l<.35)m.scale.multiplyScalar(Math.max(0,1-dt*5));if(d.l<=0||m.position.y<-14){sc.remove(m);debris.splice(i,1)}}
  fxLight.intensity*=Math.pow(.002,dt);colA.intensity*=Math.pow(.02,rdt||dt);colB.intensity*=Math.pow(.02,rdt||dt);
}
