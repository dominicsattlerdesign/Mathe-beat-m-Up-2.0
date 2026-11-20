(()=>{
const S=stage,V=new THREE.Vector3();
/* alte Bäume und altes Torii ausblenden */
S.children.forEach(m=>{if(!m.isMesh||!m.material||!m.material.color)return;const c=m.material.color.getHex();
  if((c==0x3a241c&&m.position.z<-5.5)||c==0xffb7d0||c==0xff8fb5||((c==0xc81e2e||c==0x15131a)&&m.position.z<-7))m.visible=false});
const add=(g,c,p,par=S,o=1,e,kind)=>{const m=M(g,typeof c=="number"?mat(c,e||0,kind):c,p,par,o,e);m.receiveShadow=true;return m};
SEGM=2;
/* gebogene, sich verjüngende Röhre (Stamm, Äste) */
function tube(pts,r0,r1,c,par=S){const crv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)));const N=28,R=12,g=new THREE.TubeGeometry(crv,N,1,R,false),P=g.attributes.position;
  for(let i=0;i<=N;i++){const t=i/N,c0=crv.getPointAt(t),r=lerp(r0,r1,t);for(let j=0;j<=R;j++){const k=i*(R+1)+j;V.set(P.getX(k),P.getY(k),P.getZ(k)).sub(c0).multiplyScalar(r);P.setXYZ(k,c0.x+V.x,c0.y+V.y,c0.z+V.z)}}
  g.computeVertexNormals();const m=new THREE.Mesh(g,mat(c,0,"wood"));m.castShadow=true;m.receiveShadow=true;m.add(new THREE.Mesh(g,OL));par.add(m);return crv}
const ICO=r=>geo("ico"+r,()=>new THREE.IcosahedronGeometry(r,1));
const PINK=[0xff9cc4,0xff86b6,0xffb0cf,0xf472a6];
/* Kirschbaum mit Ästen und Blütenwolken */
function tree(x,z,s,lean){const T=0x4a2c22;
  tube([[x,0,z],[x+lean*.3*s,1.4*s,z],[x+lean*.2*s,2.6*s,z+.1],[x+lean*.5*s,3.4*s,z]],.45*s,.22*s,T);
  const ends=[];for(const[dx,dy,dz]of[[-2.4,1.5,.4],[2.2,1.8,-.3],[-1,2.4,-.6],[1.1,2.2,.7],[0,2.8,0],[-2.8,.6,-.2],[2.9,.8,.2]]){
    const a=[x+lean*.4*s,2.6*s+Math.abs(dx)*.12*s,z],e=[x+lean*.5*s+dx*s,3.2*s+dy*s,z+dz*s];tube([a,[lerp(a[0],e[0],.5),lerp(a[1],e[1],.4)+.2*s,lerp(a[2],e[2],.5)],e],.16*s,.05*s,T);ends.push(e)}
  for(const e of ends)for(let i=0;i<9;i++){const r=rnd(.45,.85)*s,m=add(ICO(.5),P(PINK),[e[0]+rnd(-1,1)*s,e[1]+rnd(-.5,.7)*s,e[2]+rnd(-.7,.7)*s]);m.scale.setScalar(r*2);m.rotation.set(rnd(6),rnd(6),0)}
  for(const e of ends)for(let i=0;i<3;i++){const m=add(ICO(.5),0xc4467e,[e[0]+rnd(-.8,.8)*s,e[1]-.55*s,e[2]+rnd(-.5,.5)*s]);m.scale.setScalar(rnd(.5,.8)*s*2)}}
tree(-11.5,-7.5,1.05,-1);tree(11.8,-6.8,1,1);tree(-17,-12,1.35,1);tree(17.5,-13,1.4,-1);
/* Torii mit geschwungenem Dach, Sockeln und Namenstafel */
const R_=0xd42a2a,K_=0x17141c;
for(const s of[-1,1]){add(gC(.34,.42,7.2,24),R_,[s*4.2,3.6,-8]);add(gC(.5,.52,.8,24),K_,[s*4.2,.4,-8]);add(gB(1.3,.24,1.3),0x8d8a98,[s*4.2,.12,-8],S,1,0,"stone")}
add(gB(10.8,.42,.5),R_,[0,5.9,-8]);
const curved=(w,h,d,lift,c,y,z)=>{const g=new THREE.BoxGeometry(w,h,d,48,1,1),P=g.attributes.position;for(let i=0;i<P.count;i++){const t=P.getX(i)/(w/2);P.setY(i,P.getY(i)+lift*Math.pow(Math.abs(t),3.2))}g.computeVertexNormals();return add(g,c,[0,y,z])};
curved(12.2,.42,.9,.45,R_,7.2,-8);curved(13.6,.55,1.15,.75,K_,7.75,-8);
add(gB(.5,1.3,.45),R_,[0,6.55,-8]);add(gB(1.25,1.55,.14),0xffc21a,[0,6.6,-7.66]);add(gB(1.05,1.35,.16),K_,[0,6.6,-7.62]);
/* Dojo-Dach mit Ziegelreihen und Laternen an der Traufe */
{const roof=new THREE.Group();roof.position.set(0,3.62,-4.75);roof.rotation.x=.42;S.add(roof);
 add(gB(30.6,.14,1.7),0x2e3452,[0,0,0],roof);for(let i=-50;i<=50;i++)add(gC(.11,.11,1.7,10),0x4a5378,[i*.3,.1,0],roof,0).rotation.x=Math.PI/2;
 add(gB(30.8,.22,.22),0x2a1a14,[0,.05,.87],roof);add(gB(30.6,.28,.32),0x1e2238,[0,.2,-.85],roof)}
for(let i=-4;i<=4;i++){const x=i*3.2+1.6;if(Math.abs(x)>13)continue;const g=new THREE.Group();g.position.set(x,3.1,-3.55);S.add(g);
  add(gC(.012,.012,.4,4),K_,[0,-.2,0],g,0);add(gC(.17,.17,.06,14),K_,[0,-.42,0],g,0);const l=add(gS(.24,18,14),0xe8401e,[0,-.68,0],g,1,0x7a1606);l.scale.y=1.25;add(gC(.17,.17,.06,14),K_,[0,-.95,0],g,0);add(gC(.015,.015,.25,4),0xffc21a,[0,-1.1,0],g,0)}
/* Stoffbanner mit Wappen an der Wand */
{const tx=ctex(128,256,(g,w,h)=>{g.fillStyle="#f6efe0";g.fillRect(0,0,w,h);g.fillStyle="#c81e2e";g.beginPath();g.arc(w/2,h*.36,38,0,7);g.fill();g.fillStyle="#f6efe0";g.beginPath();g.arc(w/2+10,h*.36-6,20,0,7);g.fill();
   g.fillStyle="#2a1a14";for(let i=0;i<3;i++)g.fillRect(w/2-16,h*.62+i*22,32,8);g.fillStyle="#c81e2e";g.fillRect(0,h-14,w,14)});
 for(const x of[-9.6,-4.8,4.8,9.6]){const m=new THREE.Mesh(new THREE.PlaneGeometry(.95,1.9,1,6),new THREE.MeshToonMaterial({map:tx,gradientMap:GRAD,side:THREE.DoubleSide}));m.position.set(x,1.85,-4.52);m.castShadow=true;S.add(m);add(gC(.03,.03,1.2,6),0x2a1a14,[x,2.82,-4.5]).rotation.z=Math.PI/2}}
/* Lichtstrahlen durch die Bäume */
{const tx=ctex(64,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"rgba(255,240,210,0)");gr.addColorStop(.3,"rgba(255,240,210,1)");gr.addColorStop(1,"rgba(255,240,210,0)");g.fillStyle=gr;g.fillRect(0,0,w,h);
   const gx=g.createLinearGradient(0,0,w,0);gx.addColorStop(0,"rgba(0,0,0,1)");gx.addColorStop(.5,"rgba(0,0,0,0)");gx.addColorStop(1,"rgba(0,0,0,1)");g.globalCompositeOperation="destination-out";g.fillStyle=gx;g.fillRect(0,0,w,h)});
 for(const[x,z,w,o]of[[-6,-5.5,2.4,.16],[-2,-6.5,1.6,.12],[3.5,-5.8,2.8,.14],[8,-6.2,1.8,.12],[-9,-3.6,1.4,.1]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,18),new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,color:0xffe6c0}));m.position.set(x,6,z);m.rotation.z=-.38;m.renderOrder=3;S.add(m)}}
/* Nebelschichten zwischen den Bergen */
{const tx=ctex(16,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"rgba(255,225,220,0)");gr.addColorStop(.6,"rgba(255,225,220,.85)");gr.addColorStop(1,"rgba(255,225,220,.95)");g.fillStyle=gr;g.fillRect(0,0,w,h)});
 for(const[z,y,o]of[[-14,1.6,.55],[-22,3,.5],[-34,5,.45]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(120,6),new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:o,depthWrite:false,fog:false}));m.position.set(0,y,z);S.add(m)}}
/* Blütenblätter auf dem Boden und in der Luft */
{const pg=new THREE.CircleGeometry(.07,5);for(let i=0;i<260;i++){const m=new THREE.Mesh(pg,mat(P(PINK)));m.scale.set(1,1.5,1);const air=i>200;
   m.position.set(rnd(-8.5,8.5),air?rnd(1,7):.012+rnd(.002),air?rnd(-4,2.5):rnd(-3,3));m.rotation.set(air?rnd(6):-Math.PI/2,air?rnd(6):0,rnd(6));S.add(m)}}
/* Seil mit Papierstreifen (Shimenawa) an der Wand */
{const crv=[];for(let i=0;i<=40;i++){const x=-14+i*.7;crv.push([x,2.95-.18*Math.pow(Math.sin(((x+14)/4.8)*Math.PI),2),-4.42])}
 tube(crv,.06,.06,0xd8c48a);for(let i=0;i<6;i++){const x=-12+i*4.8+2.4;const z=add(gB(.14,.42,.02),0xffffff,[x,2.55,-4.4],S,0);z.rotation.z=.1}}
SEGM=1;
/* Farbe der Sonne etwas wärmer */
sun.color.setHex(0xffd8b0);
})()
