/* ---------- 3D-Grundlagen: Renderer, Cel-Shading, Kamera, Zeitlupe, Effekte ---------- */
const $=s=>document.querySelector(s),R=rI,P=rP;
const rnd=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,eOut=p=>1-(1-p)*(1-p),eIn=p=>p*p;
const hex=c=>"#"+c.toString(16).padStart(6,"0");
const cv=$("#c"),ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:"high-performance"});
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,300);
const hemi=new THREE.HemisphereLight(0xffffff,0x555577,.62);sc.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,.75);sun.position.set(5,10,9);sc.add(sun);
const rim=new THREE.PointLight(0xffffff,.7,34);rim.position.set(0,5,-5);sc.add(rim);
const fxLight=new THREE.PointLight(0xffffff,0,16);fxLight.position.set(0,2,2);sc.add(fxLight);

/* Cel-Shading: Stufenverlauf + Tuschekontur (Rückseiten entlang der Normalen aufgeblasen) */
const GRAD=(()=>{const t=new THREE.DataTexture(new Uint8Array([95,95,95,255,165,165,165,255,225,225,225,255,255,255,255,255]),4,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.needsUpdate=true;return t})();
const MATS={},BM={};
function mat(c,e){const k=c+"_"+(e||0);return MATS[k]||(MATS[k]=new THREE.MeshToonMaterial({color:c,gradientMap:GRAD,emissive:e||0}))}
function bmat(c){return BM[c]||(BM[c]=new THREE.MeshBasicMaterial({color:c}))}
const OL=new THREE.MeshBasicMaterial({color:0x0b0912,side:THREE.BackSide});
OL.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <begin_vertex>","vec3 transformed=position+normalize(normal)*0.03;")};
const GC={},geo=(k,f)=>GC[k]||(GC[k]=f());
const gS=(r,w=14,h=10)=>geo(`s${r},${w},${h}`,()=>new THREE.SphereGeometry(r,w,h));
const gB=(x,y,z)=>geo(`b${x},${y},${z}`,()=>new THREE.BoxGeometry(x,y,z));
const gC=(rt,rb,h,n=10)=>geo(`c${rt},${rb},${h},${n}`,()=>new THREE.CylinderGeometry(rt,rb,h,n));
const gK=(r,h,n=8)=>geo(`k${r},${h},${n}`,()=>new THREE.ConeGeometry(r,h,n));
const gT=(r,t,a=8,b=18,arc=6.2832)=>geo(`t${r},${t},${a},${b},${arc}`,()=>new THREE.TorusGeometry(r,t,a,b,arc));
const gO=r=>geo("o"+r,()=>new THREE.OctahedronGeometry(r));
const gD=r=>geo("d"+r,()=>new THREE.DodecahedronGeometry(r));
/* M: Mesh anlegen. c = Farbe oder Material, o = Kontur ja/nein, e = Leuchtfarbe */
function M(g,c,p,par,o=1,e){const m=new THREE.Mesh(g,typeof c=="number"?mat(c,e):c);if(p)m.position.set(p[0],p[1],p[2]);if(o)m.add(new THREE.Mesh(g,OL));if(par)par.add(m);return m}
function ctex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);return t}

/* Zeit: Weltzeit (läuft in Zeitlupe langsamer) und Echtzeit */
let TS=1;const tws=[],rtw=[];
const tw=(d,f)=>new Promise(r=>tws.push({d,t:0,f:f||(()=>{}),r}));
const rt=(d,f)=>new Promise(r=>rtw.push({d,t:0,f:f||(()=>{}),r}));
const wait=d=>tw(d);
function stepTw(list,dt){for(let i=list.length-1;i>=0;i--){const w=list[i];w.t+=dt;const p=Math.min(1,w.t/w.d);w.f(p);if(p>=1){const k=list.indexOf(w);if(k>=0)list.splice(k,1);w.r()}}}

/* Kamera */
const CAM={p:new THREE.Vector3(0,3.4,16),l:new THREE.Vector3(0,1.8,0),tp:new THREE.Vector3(0,3.4,16),tl:new THREE.Vector3(0,1.8,0),k:5,shake:0,mode:"menu"};
let VOFF=0;
function applyOff(){const w=innerWidth,h=innerHeight;if(VOFF)cam.setViewOffset(w,h,0,Math.round(VOFF/2),w,h);else cam.clearViewOffset();cam.updateProjectionMatrix()}
function rs(){const w=innerWidth,h=innerHeight;ren.setPixelRatio(Math.min(2,devicePixelRatio||1));ren.setSize(w,h,false);cam.aspect=w/h;applyOff()}
addEventListener("resize",()=>{rs();if(typeof layout=="function")layout()});
function camStep(dt){const k=1-Math.exp(-CAM.k*dt);CAM.p.lerp(CAM.tp,k);CAM.l.lerp(CAM.tl,k);CAM.shake*=Math.pow(.015,dt);
  cam.position.set(CAM.p.x+rnd(-1,1)*CAM.shake,CAM.p.y+rnd(-1,1)*CAM.shake,CAM.p.z);cam.lookAt(CAM.l)}
function scr(x,y,z=0){const v=new THREE.Vector3(x,y,z).project(cam);return[(v.x*.5+.5)*innerWidth,(-v.y*.5+.5)*innerHeight]}

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
function flashLight(c,i=3,x=0,y=2){fxLight.color.setHex(c);fxLight.intensity=Math.min(1.6,i*.3);fxLight.position.set(x,y,2.5)}
function stepFx(dt,rdt){
  for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.t+=f.real?rdt:dt;const p=Math.min(1,f.t/f.l);f.u&&f.u(f.m,p,dt);if(p>=1){sc.remove(f.m);const k=fxs.indexOf(f);if(k>=0)fxs.splice(k,1)}}
  for(let i=debris.length-1;i>=0;i--){const d=debris[i],m=d.m;d.v.y-=20*dt;m.position.addScaledVector(d.v,dt);m.rotation.x+=d.s.x*dt;m.rotation.y+=d.s.y*dt;m.rotation.z+=d.s.z*dt;
    if(!d.fx&&m.position.y<(d.r||.15)&&d.v.y<0&&Math.abs(m.position.x)<8.6&&Math.abs(m.position.z)<3.3){m.position.y=d.r||.15;d.v.y*=-.38;d.v.x*=.6;d.v.z*=.6;d.s.multiplyScalar(.55)}
    d.l-=dt;if(d.l<.35)m.scale.multiplyScalar(Math.max(0,1-dt*5));if(d.l<=0||m.position.y<-14){sc.remove(m);debris.splice(i,1)}}
  fxLight.intensity*=Math.pow(.002,dt);
}
