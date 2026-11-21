await p.setViewportSize({width:1280,height:720});
await p.evaluate(()=>{LANG=SAVE.lang="de";applyLang();SAVE.unl=CH.map(c=>c.id);SAVE.ars=CH.map(c=>c.id);SAVE.q=2;setQuality(2);window._err=[];addEventListener("error",e=>_err.push(e.message))});
await p.evaluate(()=>{paused=false;over=true;mode="a";pickC=CH.findIndex(x=>x.id=="akane");SAVE.opp="goro";SAVE.arena=0;SAVE.diff=2;startFight()});
await p.waitForFunction(()=>pl&&$("#menu").hidden,null,{timeout:500000});await p.evaluate(()=>skipIntro());await p.waitForFunction(()=>!over,null,{timeout:500000});
await p.evaluate(()=>{en.iv=1e9;en.timer=1e9});await p.waitForTimeout(1500);
await p.evaluate(()=>{paused=true;const st=document.createElement("style");st.textContent="body>*:not(#c){display:none!important}";document.head.appendChild(st);window._c={p:cam.position.clone(),q:cam.quaternion.clone()};
  window._comp0=POST.comp.fragmentShader;window._grad0=GRAD.image.data.slice()});
const shots=async tag=>{for(const[n,close]of[["w",0],["c",1]]){await p.evaluate(close=>{cam.position.copy(_c.p);cam.quaternion.copy(_c.q);if(close){cam.position.set(fx_(pl).x*.5+fx_(en).x*.5,2.9,6.6);cam.lookAt(fx_(pl).x*.5+fx_(en).x*.5,2.6,0)}},close);await p.waitForTimeout(400);await p.screenshot({path:__dirname+`/cm_${tag}_${n}.png`})}};
await shots('0');
/* Comic leicht: dicke Konturen, harte 3-Ton-Schattierung, kräftigere Farben */
const setStyle=(lvl)=>p.evaluate(lvl=>{
  OLW.value=lvl==1?.0031:.004;
  const d=GRAD.image.data,n=d.length/4;for(let i=0;i<n;i++){const x=i/(n-1);const v=lvl==1?(x<.36?96:x<.62?172:238):(x<.45?104:236);d.set([v,v,v,255],i*4)}GRAD.minFilter=GRAD.magFilter=THREE.NearestFilter;GRAD.needsUpdate=true;
  const halftone=lvl==2;
  POST.comp.fragmentShader="uniform sampler2D t;uniform sampler2D b;uniform float k;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);vec3 g=texture2D(b,vUv).rgb*k;vec3 col=c.rgb+g;float l=dot(col,vec3(.299,.587,.114));"+
   "col=mix(vec3(l),col,"+(lvl==1?"1.25":"1.4")+");col=(col-.5)*"+(lvl==1?"1.08":"1.14")+"+.5;"+
   (halftone?"vec2 q=mat2(.7071,-.7071,.7071,.7071)*gl_FragCoord.xy/7.0;vec2 f=fract(q)-.5;float r=clamp((.62-l)*.95,0.0,.48);float dm=1.0-smoothstep(r-.06,r+.06,length(f));col*=mix(1.0,.5,dm*step(.02,r));col=floor(col*7.0+.5)/7.0;":"")+
   "col*=mix(1.0,.88,smoothstep(.4,.9,length((vUv-.5)*vec2(1.25,1.0))));float a=clamp(max(c.a,max(g.r,max(g.g,g.b))),0.0,1.0);gl_FragColor=vec4(clamp(col,0.0,a),a);}";
  POST.comp.needsUpdate=true;for(const k in MATS)MATS[k].needsUpdate=true;sc.traverse(o=>{if(o.material&&o.material.isMeshToonMaterial)o.material.needsUpdate=true})},lvl);
await setStyle(1);await shots('1');
await setStyle(2);await shots('2');
console.log('Fehler',await p.evaluate(()=>_err),await p.evaluate(()=>[pl.ch.id,en.ch.id]));
