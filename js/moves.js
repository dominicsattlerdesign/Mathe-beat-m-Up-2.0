/* ---------- Spezial-Attacken und Finisher: jede Figur hat ihre eigenen ----------
   SIG[id](a,b,dm,d,c): a greift b an, dm = Schaden gesamt, d = Richtung von a zu b, c = Farbe der Figur.
   FIN[id](a,b,d,c): Finisher, endet immer mit dem K.O. Darf albern sein. */
const TEMP=[];
function clearTemp(){for(const m of TEMP)sc.remove(m);TEMP.length=0}
const keep=m=>{sc.add(m);TEMP.push(m);return m};
const PIL=()=>geo("pil",()=>new THREE.CylinderGeometry(1,1,1,18,1,true)),RING=()=>geo("ring",()=>new THREE.RingGeometry(.78,1,36));
const kill=(a,b,o={})=>impact(a,b,b.hp+1,Object.assign({big:1,lv:2,noReact:1,nomt:1,r:4,max:12,stop:.16},o));
/* Figur einfärben (verkohlt, Blitz-Negativ) und wieder zurück */
function tint(f,c){const m=mat(c);f.model.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial){if(!o.userData.om)o.userData.om=o.material;o.material=m}})}
function untint(f){f.model.traverse(o=>{if(o.userData.om){o.material=o.userData.om;o.userData.om=null}})}
function squash(f,sx,sy){const s=f.rs||1;f.root.scale.set(Math.sign(f.root.scale.x)*s*sx,s*sy,s*sx)}
function txt(t,c="#fff",h=1){const tex=ctex(512,256,g=>{let px=190;g.font=`900 ${px}px Bangers,Impact,"Arial Black",sans-serif`;while(g.measureText(t).width>470&&px>40){px-=10;g.font=`900 ${px}px Bangers,Impact,"Arial Black",sans-serif`}
  g.textAlign="center";g.textBaseline="middle";g.lineJoin="round";g.lineWidth=px*.14;g.strokeStyle="#0b0912";g.strokeText(t,256,136);g.fillStyle=c;g.fillText(t,256,136)});
  return new THREE.Mesh(new THREE.PlaneGeometry(h*2,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,fog:false}))}
/* Sternchen, die um den Kopf kreisen, solange f.dizzy gesetzt ist */
function dizzyStars(f){const g=new THREE.Group();for(let i=0;i<4;i++){const m=new THREE.Mesh(STAR,bmat(i%2?0xffe14d:0xffffff));m.scale.setScalar(.16);m.position.set(Math.cos(i*1.57)*.55,0,Math.sin(i*1.57)*.55);g.add(m)}
  fxAdd(g,99,(g,p,dt)=>{g.position.set(fx_(f).x,fx_(f).y+3.75*f.sc,0);g.rotation.y+=dt*5;g.children.forEach(m=>m.rotation.y=-g.rotation.y);g.visible=f.root.visible;if(!f.dizzy){const e=fxs.find(e=>e.m===g);if(e)e.t=e.l}},1);return g}
async function flyOff(b,d){b.grounded=false;b.downed=true;pose(b,"air",30);const x0=fx_(b).x,y0=fx_(b).y;sfx("whoosh");
  await tw(.45,p=>{fx_(b).x=x0+d*p*15;fx_(b).y=y0+p*13;b.piv.rotation.x-=.5;squash(b,1-p*.8,1-p*.8)});b.root.visible=false;
  const tx=clamp(x0+d*5,-6,6);await rt(.35);star(tx,8,0xffffff,1.6);glow(tx,8,0xffffff,5,.5);tone({f:2400,f2:3800,d:.35,v:.12,w:"sine"})}
async function fallBack(b,x){squash(b,1,1);b.root.visible=true;fx_(b).x=x;fx_(b).y=15;b.piv.rotation.x=0;sfx("whoosh");await launch(b,x,0,.5,1.5)}
const fireball=(x0,y0,x1,y1,c,l=.3,r=.3)=>{const m=new THREE.Mesh(gS(r,10,8),addMat(c,.9));fxAdd(m,l,(m,p)=>{m.position.set(lerp(x0,x1,p),lerp(y0,y1,p),rnd(-.1,.1));m.scale.setScalar(1+p);m.material.opacity=.9*(1-p*p)})};

const SIG={
  /* Raiko: springt im Zickzack durch den Gegner, jeder Sprung ein Blitz */
  async raiko(a,b,dm,d,c){const bx=fx_(b).x;a.grounded=false;
    for(let i=0;i<4;i++){const s=i%2?-1:1;fx_(a).x=clamp(bx+s*d*1.8,-7,7);fx_(a).y=i<3?rnd(.2,1.6):0;streak(fx_(a).x,2,s*d,c,5);pose(a,i%2?"cross":"jab",60);bolt(bx,i%2?0xffffff:c,9,1);glow(bx,2,c,4);sfx("zap");impact(a,b,dm*.15,{arc:1,nomt:1,quiet:i%2,stop:.04,push:0});await wait(.14)}
    fx_(a).y=0;a.grounded=true;pose(a,"win",30);shaft(bx,c,.5,2);for(let i=0;i<3;i++)bolt(bx+rnd(-.4,.4),i?c:0xffffff,16,0);sfx("boom");impact(a,b,dm*.4,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6,1.6,.6,1)},
  /* Akane: rollt als brennendes Rad durch den Gegner */
  async akane(a,b,dm,d,c){const x0=fx_(a).x,bx=fx_(b).x,tx=clamp(bx+d*1.6,-6.8,6.8);a.grounded=false;pose(a,"crouch",30);let h=0;sfx("whoosh");
    await tw(.6,p=>{fx_(a).x=lerp(x0,tx,p);fx_(a).y=.5+Math.sin(p*Math.PI)*.5;a.piv.rotation.x=p*Math.PI*8;sparks(fx_(a).x,1.4,0,2,[c,0xffe14d],4);if(Math.random()<.5)glow(fx_(a).x,1.5,c,2.6,.25);
      const n=p>.75?3:p>.55?2:p>.35?1:0;if(n>h){h=n;impact(a,b,dm*(h==3?.5:.25),{s:"kick",arc:1,nomt:1,lv:h==3?1:0,quiet:h==2,noReact:h==3,stop:.04})}});
    a.piv.rotation.x=0;pillar(bx,c,1,8,.5);await Promise.all([launch(b,b.side*6.2,2,.6,1),landA(a)])},
  /* Rokka: drei Kanonenkugeln von einem Schiff, das niemand sieht */
  async rokka(a,b,dm,d,c){pose(a,"win",20);pop(L("Feuer frei!","Fire!"),"#fff",fx_(a).x,4.6,"mv");const bx=fx_(b).x;
    for(let i=0;i<3;i++){const m=M(gS(.38),0x23262f,null,null,1,0,"metal"),sx=-d*13,sy=6+i*1.5;sfx("boom");colorBurst(0xff8a00,c,1.6);
      fxAdd(m,.4,(m,p)=>{m.position.set(lerp(sx,bx,p),lerp(sy,2,p)+Math.sin(p*Math.PI)*2.2,0);m.rotation.x+=.3;if(Math.random()<.5)sparks(m.position.x,m.position.y,0,1,[0xff8a00,0x555555],2)});
      await wait(.4);dust(bx,0,6,0x555560);glow(bx,2,0xff8a00,5);impact(a,b,dm*(i==2?.4:.3),{lv:i==2?2:1,s:"heavy",nomt:1,noReact:i==2,quiet:i==1,push:.3})}
    await launch(b,b.side*6.2,1.5,.6,1)},
  /* Zeno: wirft einen Fächer rasiermesserscharfer Riesenkarten */
  async zeno(a,b,dm,d,c){const ax=fx_(a).x+d*.8,bx=fx_(b).x;
    for(let i=0;i<6;i++){pose(a,i%2?"cross":"jab",50);sfx("swoosh");const m=new THREE.Group();M(gB(.5,.72,.03),i%2?0x5a2ea6:0xf4f0ff,[0,0,0],m);const y0=2.2+rnd(-.5,.6);
      fxAdd(m,.22,(m,p)=>{m.position.set(lerp(ax,bx,p),y0+Math.sin(p*Math.PI)*.4,rnd(-.05,.05));m.rotation.z+=.9;m.rotation.y+=.4});await wait(.11);if(i)impact(a,b,dm*.1,{arc:1,nomt:1,quiet:i%2,stop:.02,push:.08,y:y0})}
    await wait(.2);pose(a,"win",30);glow(bx,2,c,7,.5);for(let i=0;i<10;i++)slashArc(bx,2+rnd(-1,1),i%2?c:0xffc21a,rnd(6.3),1.6);impact(a,b,dm*.5,{lv:2,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.2,1.6,.6,1)},
  /* Tetsu: eine Mondsichel aus Schnittenergie fegt über den Boden */
  async tetsu(a,b,dm,d,c){const ax=fx_(a).x,bx=fx_(b).x;pose(a,"windup",20);glow(ax,2.4,c,3,.4);await wait(.3);pose(a,"cross",60);sfx("whoosh");
    for(const[cc,s]of[[c,2.1],[0xffffff,1.7]]){const m=new THREE.Mesh(geo("cres",()=>new THREE.RingGeometry(1.1,1.5,28,1,-1.1,2.2)),addMat(cc,.95));m.rotation.z=d>0?0:Math.PI;fxAdd(m,.26,(m,p)=>{m.position.set(lerp(ax,bx+d*1.5,p),1.9,.4);m.scale.set(s*(1+p*.4),s*(1+p),1);m.material.opacity=.95*(1-p*p*.6)})}
    await wait(.2);for(let i=0;i<4;i++)slashArc(bx,rnd(1.2,3),i%2?c:0xffffff,rnd(6.3),2.2);impact(a,b,dm,{lv:2,nomt:1,s:"heavy",noReact:1,stop:.14});crack(bx,2.4,1);await launch(b,b.side*6.3,1.2,.55,1)},
  /* Volt-7: schiesst die eigene Faust als Rakete ab */
  async volt(a,b,dm,d,c){const ax=fx_(a).x+d*1,bx=fx_(b).x;pose(a,"cross",50);sfx("whoosh");const g=new THREE.Group();M(gC(.2,.16,.6,12),0x55657f,[0,0,0],g,1,0,"metal").rotation.z=Math.PI/2;M(gS(.24),0x55657f,[d*.4,0,0],g,1,0,"metal");
    fxAdd(g,.32,(m,p)=>{m.position.set(lerp(ax,bx-d*.5,p*p),2.1+Math.sin(p*9)*.12,0);sparks(m.position.x-d*.5,2.1,0,2,[0xff8a00,0xffe14d,c],3);glow(m.position.x-d*.6,2.1,0xff8a00,1.6,.15)});
    await wait(.32);sfx("boom");glow(bx,2.1,c,9,.5);ring(bx,2.1,0,c,5,.5);sparks(bx,2.1,0,26,[c,0xffffff,0xff8a00],11);impact(a,b,dm,{lv:2,nomt:1,s:"heavy",noReact:1,stop:.14});await launch(b,b.side*6.3,1.8,.6,1.5)},
  /* Luna: lässt Sternschnuppen regnen */
  async luna(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x;shaft(bx,c,1.4,2.4);
    for(let i=0;i<7;i++){const x0=bx+rnd(-4,4),x1=bx+rnd(-.5,.5),y1=rnd(1.4,2.8),m=new THREE.Mesh(gO(.26),bmat(i%2?0xffe98a:0xffffff));
      fxAdd(m,.26,(m,p)=>{m.position.set(lerp(x0,x1,p),lerp(13,y1,p),0);m.rotation.z+=.5;if(Math.random()<.7)glow(m.position.x,m.position.y,c,1.2,.2)});sfx("zap");await wait(.13);
      if(i>1)impact(a,b,dm*(i==6?.4:.12),{nomt:1,quiet:i%2,lv:i==6?2:0,stop:.03,push:.04,noReact:i==6,s:i==6?"heavy":"punch"})}
    await launch(b,b.side*6,1.6,.6,1)},
  /* Goro: reisst einen Felsbrocken aus dem Boden und wirft ihn */
  async goro(a,b,dm,d,c){const ax=fx_(a).x,bx=fx_(b).x,rx=ax+d*1.3,r=M(gD(.95),0x6a6570,[rx,-1.2,0],sc,1,0,"stone");TEMP.push(r);pose(a,"crouch",25);sfx("stone");crack(rx,1.3,1);dust(rx,0,6);
    await tw(.3,p=>{r.position.y=-1.2+eOut(p)*2});pose(a,"lift",20);await tw(.25,p=>{r.position.set(lerp(rx,ax,p),.8+p*3.9*a.sc,0)});await wait(.12);pose(a,"hurl",45);sfx("whoosh");const y0=r.position.y;
    await tw(.34,p=>{r.position.set(lerp(ax,bx,p),lerp(y0,1.9,p)+Math.sin(p*Math.PI)*1.2,0);r.rotation.z-=.25});
    sc.remove(r);sparks(bx,2,0,22,[0x8d8a98,0x6a6776,c],9);for(let i=0;i<6;i++){const m=M(gD(rnd(.2,.4)),0x6a6570,[bx,2,0],sc,1,0,"stone");debris.push({m,v:new THREE.Vector3(rnd(-5,5),rnd(2,8),rnd(-2,3)),s:new THREE.Vector3(rnd(8),rnd(8),rnd(8)),l:2,r:.25})}
    impact(a,b,dm,{lv:2,nomt:1,s:"slam",noReact:1,stop:.14});sfx("stone");await launch(b,b.side*6.4,1.4,.6,1)},
  /* Shade: Schattenstacheln schiessen unter dem Gegner aus dem Boden */
  async shade(a,b,dm,d,c){const ax=fx_(a).x,bx=fx_(b).x;pose(a,"crouch",25);glow(ax+d*.6,.3,c,3,.5);
    for(let i=0;i<5;i++){const x=lerp(ax+d*1.2,bx,i/4),m=M(gK(.34,2.6,6),0x1c1a2a,[x,-1.4,rnd(-.3,.3)],sc,1,0x2a1050);const h=1+i*.25;fxAdd(m,.75,(m,p)=>{m.position.y=-1.5+Math.sin(Math.min(1,p*2.2)*Math.PI/2)*h*(p>.7?1-(p-.7)/.3:1)});glow(x,.5,c,2.5,.3);sfx("zap");crack(x,.7,0);await wait(.085)}
    impact(a,b,dm,{lv:2,nomt:1,s:"heavy",noReact:1,y:1.2});await launch(b,b.side*5.5,3,.75,1.5)},
  /* Mika: hundert Tritte, sie zählt selbst mit */
  async mika(a,b,dm,d,c){await dash(a,fx_(b).x-d*1.35,.16);
    for(let i=0;i<10;i++){pose(a,i%2?"kickCh":"kick",70);if(i%2==0)sfx("swoosh");await wait(.05);impact(a,b,dm*.06,{s:"kick",arc:i%3==0,nomt:1,quiet:1,stop:.012,push:.03,y:(1.6+(i%3)*.5)*b.sc});if(i%2)pop((i+1)*10+(i==9?"!":""),hex(c),fx_(a).x,4.2+i*.05,"dm")}
    pose(a,"kickCh",40);await wait(.12);pose(a,"kick",60);sfx("whoosh");await wait(.05);impact(a,b,dm*.4,{lv:2,nomt:1,s:"kick",arc:1,noReact:1,stop:.12});await launch(b,b.side*6.3,1.3,.55,1)},
  /* Drako: Drachenatem */
  async drako(a,b,dm,d,c){const ax=fx_(a).x+d*.7,bx=fx_(b).x,ay=3.05*a.sc;pose(a,"windup",20);await wait(.25);pose(a,"grab",40);sfx("whoosh");let h=0;
    await tw(.95,p=>{for(let i=0;i<3;i++)fireball(ax,ay,bx+rnd(-.4,.6),rnd(1,3.2),i?c:0xffe14d,.3,rnd(.2,.4));flashLight(c,4,bx,2);const n=Math.floor(p*4.2);if(n>h&&h<4){h=n;impact(a,b,dm*.18,{nomt:1,quiet:h%2,stop:.02,push:.25,s:"punch"})}});
    pillar(fx_(b).x,c,1.2,7,.5);impact(a,b,dm*.28,{lv:1,nomt:1,s:"heavy",noReact:1});await launch(b,b.side*6.2,1.2,.55,1)},
  /* Oni-Maru: trommelt mit der Keule auf den Boden, bis der Himmel antwortet */
  async oni(a,b,dm,d,c){const ax=fx_(a).x;
    for(let i=0;i<3;i++){pose(a,"lift",25);await wait(.17);pose(a,"hurl",50);await wait(.07);const bx=fx_(b).x;sfx("slam");CAM.shake=.45;ring(ax+d*1.2,.06,0,c,5+i*2,.5);dust(ax+d*1.2,0,5);crack(ax+d*1.2,1.2,0);bolt(bx,i%2?0xffffff:c,14,0);glow(bx,2,c,5);
      impact(a,b,dm*(i==2?.4:.3),{lv:i==2?2:1,nomt:1,s:"zap",quiet:i==1,noReact:i==2,push:.2});if(i<2&&b.hp>0){b.grounded=false;await tw(.2,p=>{fx_(b).y=Math.sin(p*Math.PI)*.8});b.grounded=true}}
    await launch(b,b.side*6.2,2,.6,1)},
  /* Seraph: Lanzen aus Licht nageln den Gegner fest */
  async seraph(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,off=[-1.3,1.3,-.65,.65,0];shaft(bx,c,1.2,2.6);
    for(let i=0;i<5;i++){const x=bx+off[i],m=new THREE.Mesh(gK(.14,3.4,6),addMat(i==4?0xffffff:c,.95));m.rotation.z=Math.PI;fxAdd(m,.7,(m,p)=>{const q=Math.min(1,p*4.5);m.position.set(x,lerp(13,1.7,q*q),0);m.material.opacity=p>.6?.95*(1-(p-.6)/.4):.95});
      await wait(.15);sfx("zap");ring(x,.06,0,c,1.6,.3);glow(x,.4,c,2.4,.3);impact(a,b,dm*(i==4?.5:.125),{nomt:1,quiet:i%2==1,lv:i==4?2:0,stop:.03,push:0,noReact:i==4,s:i==4?"heavy":"punch"})}
    await launch(b,b.side*6,1.6,.6,1)},
  /* Kaiser Null: ein kleines schwarzes Loch zieht den Gegner an und platzt */
  async kaiser(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,ox=bx-d*1.2,oy=3.4,o=new THREE.Group();o.add(new THREE.Mesh(gS(.5,16,12),bmat(0x05040a)));const r=new THREE.Mesh(gT(.8,.06,8,30),addMat(c,.9));r.rotation.x=1.2;o.add(r);o.position.set(ox,oy,0);keep(o);sfx("charge");
    b.grounded=false;b.downed=true;pose(b,"air",20);await tw(.7,p=>{r.rotation.z+=.3;o.scale.setScalar(.4+p);const e=p*p;fx_(b).x=lerp(bx,ox,e)+Math.cos(p*12)*(1-e)*.8;fx_(b).y=lerp(0,oy-1.6*b.sc,e);b.piv.rotation.x-=.3;if(Math.random()<.5)sparks(ox+rnd(-2,2),oy+rnd(-2,2),0,1,[c,0xff2a4a],2)});
    sc.remove(o);sfx("boom");glow(ox,oy,c,9,.5);ring(ox,oy,0,c,5,.5);impact(a,b,dm,{lv:2,nomt:1,s:"heavy",noReact:1,y:oy,stop:.14});await launch(b,b.side*6.2,1,.55,1.5)},
  /* Mathemagus: lässt eine ganze Rechnung auf den Gegner fallen */
  async magus(a,b,dm,d,c){pose(a,"win",20);const bx=fx_(b).x,t=["7","×","8","=","56"];
    for(let i=0;i<5;i++){const m=txt(t[i],i==4?"#ffc21a":"#3dffd0",i==4?2.2:1.5),x1=bx+rnd(-.4,.4);fxAdd(m,.5,(m,p)=>{const q=Math.min(1,p*2);m.position.set(x1,lerp(13,2.6,q*q)+(p>.5?Math.sin((p-.5)*6.28)*.5:0),.5);m.rotation.z=Math.sin(p*9)*.2;m.material.opacity=p>.8?1-(p-.8)/.2:1});
      await wait(i==4?.34:.2);sfx(i==4?"boom":"punch");glow(bx,3,c,i==4?7:3,.3);impact(a,b,dm*(i==4?.4:.15),{nomt:1,quiet:1,lv:i==4?2:0,stop:.03,push:0,noReact:i==4,y:3*b.sc,s:"punch"})}
    pop(L("Stimmt sogar!","And it’s right!"),hex(c),fx_(a).x,4.9,"mv");await launch(b,b.side*6,1.6,.6,1)},
};

const FIN={
  /* Raiko: eine sehr persönliche Gewitterwolke */
  async raiko(a,b,d,c){const bx=fx_(b).x,cl=new THREE.Group();for(let i=0;i<7;i++)M(gS(rnd(.6,.95),12,8),0x3a3a4c,[rnd(-1.3,1.3),rnd(-.2,.3),rnd(-.4,.4)],cl,0);cl.position.set(bx,10,0);keep(cl);pose(a,"win",20);
    await rt(.55,p=>{cl.position.y=10-eOut(p)*4.2});pop(L("Oh-oh.","Uh-oh."),"#fff",bx,4.7,"mv");await rt(.6);
    for(let i=0;i<6;i++){bolt(bx,i%2?0xffffff:c,5.4,1.5);sfx("zap");flashLight(c,6,bx,3);tint(b,i%2?0x111118:0xffffff);impactFrame(50);b.grounded=false;fx_(b).y=.4;pose(b,i%2?"air":"hurt",60);CAM.shake=.25;await rt(.15);fx_(b).y=0}
    tint(b,0x15131a);b.grounded=true;pose(b,"hurt",8);dust(bx,0,8,0x333340);pop(L("BRUTZEL!","SIZZLE!"),hex(c),bx,4.7);kill(a,b,{s:"boom"});await rt(.6,p=>{cl.position.y+=.2;if(Math.random()<.2)dust(bx,0,1,0x333340)});await launch(b,bx+b.side*.8,.3,.6,0)},
  /* Akane: Feuertornado mit Schleudergang */
  async akane(a,b,d,c){const bx=fx_(b).x;pose(a,"upper",30);const g=new THREE.Group();for(let i=0;i<8;i++){const m=new THREE.Mesh(PIL(),addMat(i%2?c:0xffe14d,.5));m.scale.set(.5+i*.3,1.05,.5+i*.3);m.position.y=.5+i;g.add(m)}g.position.x=bx;keep(g);
    b.grounded=false;b.downed=true;pose(b,"air",20);sfx("whoosh");setTimeout(()=>sfx("whoosh"),500);
    await rt(1.6,p=>{g.rotation.y+=.5;g.children.forEach((m,i)=>m.position.x=Math.sin(p*22+i)*.3);fx_(b).y=eOut(p)*5.5;b.turn.rotation.y=FACE+p*Math.PI*12;fx_(b).x=bx+Math.sin(p*18)*.6;if(Math.random()<.6)sparks(bx+rnd(-1.5,1.5),rnd(0,6),0,2,[c,0xffe14d],5);flashLight(c,3,bx,3)});
    sc.remove(g);b.turn.rotation.y=FACE;fx_(b).x=bx;b.dizzy=true;dizzyStars(b);pose(b,"dizzy",20);pop(L("Mir ist schwindelig …","I’m so dizzy …"),"#fff",bx,9.6,"mv");await rt(.8);b.dizzy=false;
    await launch(b,bx,0,.4,.5,{land(){kill(a,b,{s:"slam"});pillar(bx,c,1.6,12,.7)}})},
  /* Rokka: stopft den Gegner in eine Kanone */
  async rokka(a,b,d,c){const ax=fx_(a).x,bx=fx_(b).x,cx=clamp(ax+d*1.4,-5,5),g=new THREE.Group();M(gC(.75,.9,2.8,18),0x2a2c36,[0,1.2,0],g,1,0,"metal");M(gT(.78,.1,8,20),0x8a94a8,[0,2.55,0],g,0,0,"metal").rotation.x=1.57;for(const s of[-1,1])M(gC(.7,.7,.2,16),0x8a5a30,[0,0,s*.8],g,1,0,"wood").rotation.x=1.57;
    g.rotation.z=-d*.75;g.position.set(cx,.7,0);g.scale.setScalar(.01);keep(g);sfx("metal");await rt(.3,p=>g.scale.setScalar(eOut(p)));
    const mx=cx+d*1.75,my=2.55;pose(a,"grab",30);b.grounded=false;b.downed=true;pose(b,"held",30);sfx("grab");
    await rt(.5,p=>{const e=ease(p);fx_(b).x=lerp(bx,mx,e);fx_(b).y=lerp(0,my-1.2,e)+Math.sin(p*Math.PI);b.piv.rotation.x=-e*2.3;squash(b,1-e*.5,1-e*.4)});b.root.visible=false;pop(L("Stopf!","Stuff!"),"#fff",mx,4.6,"mv");sfx("punch");
    fx_(a).x=cx-d*1.3;pose(a,"win",20);await rt(.8,p=>{sparks(cx-d*.6,1,0,1,[0xffe14d,0xff8a00],2);if(p>.3&&p<.34)sfx("warn")});
    sfx("boom");flash(0xffffff);CAM.shake=1;glow(mx,my,0xff8a00,9,.5);dust(mx,my-1,12,0x555560);impactFrame(90);pop("WUMMS!",hex(c),mx,5.4);g.position.x-=d*.5;
    b.root.visible=true;fx_(b).x=mx;fx_(b).y=my;kill(a,b,{s:"boom",y:my+1});await flyOff(b,d);await rt(.7);await rt(.25,p=>g.scale.setScalar(1-p));await fallBack(b,b.side*5)},
  /* Zeno: verwandelt den Gegner in eine Spielkarte */
  async zeno(a,b,d,c){const ax=fx_(a).x,bx=fx_(b).x;pose(a,"win",20);const card=new THREE.Group();M(gB(2.7,4.2,.08),0xf4f0ff,[0,0,0],card);M(gB(2.4,3.9,.04),0x5a2ea6,[0,0,.035],card,0);const q=txt("?","#ffc21a",2.6);q.position.z=.06;card.add(q);card.position.set(bx,-3,-.5);keep(card);sfx("pick");
    await rt(.4,p=>{card.position.y=-3+eOut(p)*5});pop(L("Ab ins Deck!","Into the deck!"),hex(c),bx,5.2,"mv");b.grounded=false;b.downed=true;pose(b,"hurt",30);sfx("paper");
    await rt(.25,p=>{b.root.scale.z=(b.rs||1)*(1-p*.94);b.root.position.z=-.4*p});
    pose(a,"jab",30);await rt(.8,p=>{const e=ease(p),s=1-e*.85;card.rotation.y=p*Math.PI*6;b.turn.rotation.y=FACE+p*Math.PI*6;card.scale.setScalar(s);squash(b,s,s);b.root.scale.z*=.06;card.position.set(lerp(bx,ax+d*.7,e),lerp(2,2.5,e),0);fx_(b).x=card.position.x;fx_(b).y=card.position.y-1.6*s*b.sc});
    b.root.visible=false;pop(L("Und jetzt …","And now …"),"#fff",ax,4.8,"mv");await rt(.7);pose(a,"cross",50);sfx("paper");sfx("heavy");sc.remove(card);sparks(ax+d*.7,2.5,0,34,[0xffffff,0xffc21a,c],9);glow(ax+d*.7,2.5,c,7,.4);pop(L("… weg!","… gone!"),hex(c),ax,4.8,"mv");
    b.turn.rotation.y=FACE;b.root.position.z=0;squash(b,1,1);b.root.visible=true;fx_(b).x=bx;fx_(b).y=9;b.piv.rotation.x=0;await launch(b,bx,0,.5,1.5,{land(){kill(a,b,{s:"slam"})}})},
  /* Tetsu: ein Schnitt. Dann lange nichts. Dann alles auf einmal. */
  async tetsu(a,b,d,c){const x0=fx_(a).x,bx=fx_(b).x,tx=clamp(bx+d*2.2,-6.8,6.8);pose(a,"windup",20);await rt(.5);sfx("whoosh");streak(tx,1.8,d,0xffffff,7);pose(a,"cross",60);await tw(.07,p=>{fx_(a).x=lerp(x0,tx,p)});slashArc(bx,2.1,0xffffff,.3,3);
    pose(a,"hurl",10);pop("…",null,bx,4.7,"mv");await rt(1.3);pop(L("Klick.","Click."),"#fff",tx,4.4,"mv");sfx("key");pose(a,"idle",20);await rt(.35);
    for(let i=0;i<16;i++){slashArc(bx+rnd(-.5,.5),rnd(1,3.2),i%3?c:0xffffff,rnd(6.3),rnd(1.6,3));if(i%2)sfx("swoosh");glow(bx,2,c,3,.2);await rt(.04)}
    breakNear(bx,7,d,1.2,40);kill(a,b,{s:"heavy"})},
  /* Volt-7: ruft einen Satelliten zu Hilfe */
  async volt(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);const r=new THREE.Group();r.add(new THREE.Mesh(RING(),addMat(0xff2a2a,.9)));for(let i=0;i<4;i++){const l=new THREE.Mesh(gB(.9,.08,.02),addMat(0xff2a2a,.9));l.position.set(Math.cos(i*1.57)*1.3,Math.sin(i*1.57)*1.3,0);l.rotation.z=i*1.57;r.add(l)}r.position.set(bx,2,.9);keep(r);
    for(let i=0;i<3;i++){sfx("warn");await rt(.34,p=>{r.scale.setScalar(3.2-(i+p)*.8);r.rotation.z+=.05})}pop(L("Ziel erfasst. Piep.","Target locked. Beep."),"#fff",bx,4.9,"mv");await rt(.5);sc.remove(r);
    sfx("boom");sfx("zap");impactFrame(100);pillar(bx,c,2.2,24,1);pillar(bx,0xffffff,1.2,24,1);shaft(bx,c,1,4);
    await rt(.75,p=>{CAM.shake=.4;flashLight(c,7,bx,3);if(Math.random()<.5)sparks(bx+rnd(-1,1),.3,0,3,[c,0xffffff],8)});
    tint(b,0x15131a);dust(bx,0,10,0x333340);kill(a,b,{s:"boom"});crack(bx,3,2);pop(L("Akku leer.","Battery empty."),"#fff",fx_(a).x,4.6,"mv");pose(a,"stumble",8)},
  /* Luna: holt den Mond herunter. Den ganzen. */
  async luna(a,b,d,c){const bx=fx_(b).x;pose(a,"win",20);const m=M(gS(2.3,28,20),0xe8e4d0,[bx,18,0],sc,1,0x55523c,"stone");TEMP.push(m);for(let i=0;i<7;i++){const k=M(gS(rnd(.3,.6),10,8),0xb8b4a0,null,m,0),an=rnd(6.3),el=rnd(-1,1);k.position.set(Math.cos(an)*Math.cos(el)*2.12,Math.sin(el)*2.12,Math.sin(an)*Math.cos(el)*2.12)}
    await rt(1.5,p=>{m.position.y=lerp(18,3.4*b.sc+2.5,p);m.rotation.z+=.01;if(p>.5&&p<.53)pop(L("Nanu?","Huh?"),"#fff",bx,4.6,"mv")});await rt(.35);
    await rt(.1,p=>{m.position.y=lerp(3.4*b.sc+2.5,2.55,p);squash(b,1+p*.6,1-p*.9)});b.grounded=false;b.downed=true;sfx("slam");CAM.shake=.9;impactFrame(90);ring(bx,.06,0,c,8,.7);dust(bx,0,12);crack(bx,3.5,2);kill(a,b,{s:"boom",y:1});pop(L("PLATT!","FLAT!"),hex(c),bx,6);
    await rt(1.1,p=>{m.position.x=bx+d*p*p*14;m.position.y=2.55+Math.abs(Math.sin(p*7))*1.6*(1-p);m.rotation.z-=d*.12});sc.remove(m);b.dizzy=true;dizzyStars(b)},
  /* Goro: Bowling. Der Gegner ist die Kugel. */
  async goro(a,b,d,c){const pins=[],px=b.side*5.4;for(let i=0;i<6;i++){const g=new THREE.Group();M(gL([[0,0],[.2,.02],[.24,.5],[.12,.95],[.16,1.2],[.1,1.42],[0,1.46]],14),0xf4f0e6,[0,0,0],g);M(gC(.135,.135,.09,14),0xc81e2e,[0,.98,0],g,0);g.position.set(px+b.side*(i>2?.9:i>0?.45:0),-2,[0,-.4,.4,-.8,0,.8][i]);keep(g);pins.push(g)}
    sfx("wood");await rt(.35,p=>pins.forEach(g=>g.position.y=-2+eOut(p)*2));
    await dash(a,fx_(b).x-d*.95,.2);pose(a,"grab",35);sfx("grab");b.grounded=false;b.downed=true;pose(b,"crouch",30);pop(L("Schön rund machen!","Nice and round!"),"#fff",fx_(a).x,5,"mv");
    pose(a,"windup",12);await rt(.6,p=>{fx_(b).y=-.5*p;b.piv.rotation.x=-p*9;fx_(b).x-=d*.012});pose(a,"hurl",40);sfx("whoosh");const x0=fx_(b).x;
    await tw(.6,p=>{fx_(b).x=lerp(x0,px,p);b.piv.rotation.x-=.7;if(Math.random()<.4)dust(fx_(b).x,0,1)});
    sfx("wood");sfx("slam");pins.forEach(g=>{TEMP.splice(TEMP.indexOf(g),1);debris.push({m:g,v:new THREE.Vector3(b.side*rnd(2,8),rnd(5,11),rnd(-4,4)),s:new THREE.Vector3(rnd(-9,9),rnd(-9,9),rnd(-9,9)),l:2.4,r:.5})});
    pop("STRIKE!",hex(c),px,5);kill(a,b,{s:"slam"});pose(a,"win",12);await launch(b,b.side*6.9,1.5,.5,1)},
  /* Shade: ruft seine Klone, es gibt eine Comic-Staubwolke */
  async shade(a,b,d,c){const bx=fx_(b).x,cl=[];for(let i=0;i<4;i++){const f=buildFighter(a.ch),s=i%2?1:-1;f.root.position.set(bx+s*(1.5+i*.3),8,i<2?-.6:.6);if(s>0)f.root.scale.x=-1;f.grounded=false;f.tp=POSE.skyfall;snapPose(f);sc.add(f.root);fighters.push(f);cl.push(f)}
    sfx("whoosh");pop(L("Alle zusammen!","All together now!"),"#fff",bx,5.2,"mv");await rt(.3,p=>cl.forEach(f=>f.root.position.y=8*(1-p*p)));cl.forEach(f=>{f.root.position.y=0;f.grounded=true});pose(a,"win",12);
    const cloud=new THREE.Group();for(let i=0;i<9;i++){const m=new THREE.Mesh(gS(1,12,10),new THREE.MeshBasicMaterial({color:0xd8d2c4}));m.position.set(rnd(-1.5,1.5),rnd(.6,3),rnd(.2,1.2));m.userData.b=rnd(.7,1.2);cloud.add(m)}cloud.position.x=bx;keep(cloud);
    const words=L(["PENG!","AUA!","ZACK!","BOING!","UFF!","KLONG!"],["BANG!","OUCH!","WHAP!","BOING!","OOF!","KLONG!"]);
    for(let i=0;i<12;i++){cloud.children.forEach(m=>m.scale.setScalar(m.userData.b*rnd(.8,1.25)));star(bx+rnd(-1.8,1.8),rnd(.8,3.6),i%2?c:0xffe14d,1.3);if(i%2)pop(words[i>>1],i%4==1?"#fff":hex(c),bx+rnd(-1.5,1.5),rnd(3.6,5),"dm");sfx(i%2?"punch":"kick");CAM.shake=.2;
      cl.forEach((f,j)=>{f.tp=POSE[["jab","cross","kick","upper"][(i+j)%4]];f.root.position.x=bx+rnd(-1.4,1.4)});if(i%3==0)sparks(bx,2,1,4,[0xffffff,c],9);await rt(.14)}
    sc.remove(cloud);cl.forEach(f=>{dust(f.root.position.x,0,5,0x7a3cff);sc.remove(f.root);fighters.splice(fighters.indexOf(f),1);const h=f.J.hd.children[0].material;h.map.dispose();h.dispose()});
    b.dizzy=true;dizzyStars(b);pose(b,"dizzy",20);kill(a,b,{s:"heavy"});await rt(.5);b.dizzy=false},
  /* Mika: Pingpong, der Gegner ist der Ball */
  async mika(a,b,d,c){await dash(a,0,.2);b.grounded=false;b.downed=true;pose(b,"air",30);const walls=[d*6.9,-d*6.9];let x=fx_(b).x;fx_(b).y=.2;pose(a,"kick",50);sfx("kick");star(x,2,c,1.4);
    for(let i=0;i<7;i++){const tx=walls[i%2],x0=x,dur=.3-i*.03;let hit=false;await tw(dur,p=>{fx_(b).x=lerp(x0,tx,p);fx_(b).y=.9+Math.sin(p*Math.PI)*.5;b.piv.rotation.x-=.5;
        if(!hit&&Math.sign(fx_(b).x)!=Math.sign(x0)&&i>0){hit=true;pose(a,i%2?"cross":"kick",70);sfx("kick");star(0,2.2,c,1.3);glow(0,2.2,c,3,.2)}});
      x=tx;star(tx,2,0xffffff,1.6);glow(tx,2,c,4,.3);sfx("wood");CAM.shake=.25;pop(i%2?"PONG!":"PING!",i%2?"#fff":hex(c),tx*.8,4.6,"dm")}
    const x0=x;await tw(.14,p=>{fx_(b).x=lerp(x0,d*1.2,p)});pose(a,"upper",60);impactFrame(90);sfx("heavy");star(d*1.2,2.4,c,2.4);pop(L("Satzball!","Set point!"),hex(c),0,5.4,"mv");
    await tw(.4,p=>{fx_(b).y=.9+eOut(p)*6;b.piv.rotation.x-=.4});await launch(b,d*1.2,0,.4,1,{land(){kill(a,b,{s:"slam"})}})},
  /* Drako: Flug nach ganz oben, Rückflug ohne Bremse */
  async drako(a,b,d,c){await dash(a,fx_(b).x-d*.95,.18);pose(a,"lift",30);sfx("grab");a.grounded=false;b.grounded=false;b.downed=true;pose(b,"held",30);const x0=fx_(a).x;pop(L("Bitte anschnallen!","Fasten your seatbelt!"),"#fff",x0,4.9,"mv");await rt(.4);sfx("whoosh");
    await rt(.7,p=>{const e=p*p;fx_(a).y=e*17;fx_(b).y=e*17+2.2;fx_(b).x=x0;b.piv.rotation.x=-Math.min(1,p*3)*1.57;sparks(x0,fx_(a).y,0,1,[c,0xffe14d],3)});
    await rt(.7);pop(L("… da kommt was.","… something’s coming."),"#fff",0,4.6,"mv");await rt(.6);sfx("slowmo");pose(a,"skyfall",40);
    await rt(.3,p=>{const y=17*(1-p*p);fx_(a).y=y+1;fx_(b).y=y-.3;fx_(a).x=fx_(b).x=lerp(x0,0,p);glow(fx_(a).x,y+1,c,5,.2);sparks(fx_(a).x,y+2,0,3,[c,0xffe14d,0xffffff],6)});
    fx_(a).y=0;fx_(a).x=-d*1.7;a.grounded=true;pose(a,"win",20);b.piv.rotation.x=-1.57;fx_(b).y=-1.32*b.sc;pose(b,"down",30);impactFrame(100);pillar(0,c,2.4,16,1);pillar(0,0xffe14d,1.2,16,.8);ring(0,.06,0,c,10,.8);tint(b,0x15131a);kill(a,b,{s:"boom",y:1});crack(0,5,2)},
  /* Oni-Maru: Baseball mit der Stachelkeule */
  async oni(a,b,d,c){await dash(a,fx_(b).x-d*1.7,.2);pose(a,"bat",14);pop(L("Schön stillhalten …","Hold still …"),"#fff",fx_(a).x,5.2,"mv");await rt(1,p=>{a.turn.rotation.y=FACE-Math.sin(p*9)*.14});
    sfx("whoosh");await tw(.12,p=>{a.turn.rotation.y=FACE+p*Math.PI*2});a.turn.rotation.y=FACE;pose(a,"cross",50);impactFrame(110);sfx("wood");pop("KLONK!",hex(c),fx_(b).x,4.8);kill(a,b,{s:"heavy",stop:.22});
    await flyOff(b,d);pop("HOME RUN!",hex(c),0,5.2);pose(a,"win",12);await rt(1);await fallBack(b,b.side*5)},
  /* Seraph: ein Aufzug in den Himmel, bis die Sicherung fliegt */
  async seraph(a,b,d,c){const bx=fx_(b).x;pose(a,"win",12);const bm=new THREE.Mesh(PIL(),addMat(c,.35));bm.scale.set(1.5,26,1.5);bm.position.set(bx,13,0);keep(bm);sfx("ok");shaft(bx,0xffffff,1.2,2);
    b.grounded=false;b.downed=true;pose(b,"held",6);const halo=M(gT(.3,.04,8,20),0xffe14d,null,sc,0,0xffe14d);halo.rotation.x=1.57;TEMP.push(halo);
    await rt(1.8,p=>{fx_(b).y=p*6;halo.position.set(bx,fx_(b).y+3.9*b.sc,0);b.turn.rotation.y=FACE+p*2;if(Math.random()<.3)sparks(bx+rnd(-.7,.7),fx_(b).y+rnd(0,3),0,1,[0xffffff,c],2);if(p>.4&&p<.43)sfx("ok")});
    pop(L("Halleluja!","Hallelujah!"),hex(c),bx,10,"mv");await rt(.7);sc.remove(bm);sc.remove(halo);sfx("key");pop(L("Ups. Sicherung raus.","Oops. Fuse blew."),"#fff",fx_(a).x,4.8,"mv");pose(b,"air",30);pose(a,"stumble",10);await rt(.6);
    b.turn.rotation.y=FACE;await launch(b,bx,0,.42,.5,{land(){kill(a,b,{s:"slam"})}});pose(a,"win",10)},
  /* Kaiser Null: die schwarze Sonne verschluckt den Gegner und verträgt ihn nicht */
  async kaiser(a,b,d,c){const bx=fx_(b).x,ox=(fx_(a).x+bx)/2,oy=5.6;pose(a,"win",12);const o=new THREE.Group();o.add(new THREE.Mesh(gS(1,28,18),bmat(0x05040a)));const r1=new THREE.Mesh(gT(1.5,.08,8,44),addMat(c,.9)),r2=new THREE.Mesh(gT(1.9,.04,8,44),addMat(0xff2a4a,.8));r1.rotation.x=1.2;r2.rotation.x=1.9;o.add(r1,r2);o.position.set(ox,oy,-.5);o.scale.setScalar(.01);keep(o);sfx("charge");
    await rt(.8,p=>{o.scale.setScalar(eOut(p)*1.5);r1.rotation.z+=.2;r2.rotation.z-=.15});b.grounded=false;b.downed=true;pose(b,"air",20);pop(L("Hilfeee!","Heeelp!"),"#fff",bx,4.9,"mv");
    await rt(1.2,p=>{const e=p*p,an=p*14,rr=(1-e)*2.2;fx_(b).x=lerp(bx,ox,e)+Math.cos(an)*rr*.6;fx_(b).y=lerp(0,oy-1.6*b.sc*(1-e*.85),e)+Math.sin(an)*rr*.5;b.piv.rotation.x-=.4;squash(b,1-e*.85,1-e*.85);r1.rotation.z+=.3;r2.rotation.z-=.25;if(Math.random()<.5)sparks(ox+rnd(-3,3),oy+rnd(-3,3),0,1,[c,0xff2a4a],2)});
    b.root.visible=false;sfx("slowmo");pop(L("Mampf.","Munch."),"#fff",ox,oy+2.8,"mv");await rt(.9,p=>{o.scale.setScalar(1.5+Math.sin(p*20)*.12)});pop(L("… Bauchweh.","… tummy ache."),"#fff",ox,oy+2.8,"mv");await rt(.7,p=>{o.scale.setScalar(1.5+Math.sin(p*40)*.25);o.position.x=ox+Math.sin(p*50)*.15});
    sfx("boom");impactFrame(100);flash(c);sc.remove(o);ring(ox,oy,0,c,9,.6);glow(ox,oy,c,13,.6);sparks(ox,oy,0,40,[c,0xff2a4a,0xffffff],12);
    b.root.visible=true;squash(b,1,1);fx_(b).x=ox;fx_(b).y=oy-1.6;kill(a,b,{s:"boom",y:oy});await launch(b,b.side*5.5,1,.5,2)},
  /* Mathemagus: teilt durch null. Das geht nicht gut aus. */
  async magus(a,b,d,c){const bx=fx_(b).x;pose(a,"win",12);const g=new THREE.Group();M(gB(3.2,2.7,2.2),0x4a4f60,[0,0,0],g,1,0,"stone");const t=txt("÷ 0","#3dffd0",2.4);t.position.set(0,.25,1.12);g.add(t);const t2=txt("1000 kg","#ffffff",.8);t2.position.set(0,-.95,1.12);g.add(t2);g.position.set(bx,20,0);keep(g);
    pop(L("Ich teile durch … NULL!","I divide by … ZERO!"),hex(c),fx_(a).x,5.2,"mv");await rt(1.1);pop(L("Das darf man doch gar ni—","You’re not even allowed to—"),"#fff",bx,4.9,"mv");await rt(.8);sfx("whoosh");
    await rt(.16,p=>{g.position.y=lerp(20,1.35,p*p)});squash(b,1.5,.1);b.grounded=false;b.downed=true;sfx("slam");sfx("stone");CAM.shake=1;impactFrame(100);ring(bx,.06,0,c,8,.7);dust(bx,0,14);crack(bx,4,2);kill(a,b,{s:"boom",y:1});
    pop("ERROR!","#ff3b2f",bx,5.6);await rt(1.3);sc.remove(g);sfx("stone");for(let i=0;i<10;i++){const m=M(gD(rnd(.3,.6)),0x4a4f60,[bx+rnd(-1.2,1.2),rnd(.5,2.5),rnd(-.8,.8)],sc,1,0,"stone");debris.push({m,v:new THREE.Vector3(rnd(-4,4),rnd(2,7),rnd(-2,2)),s:new THREE.Vector3(rnd(6),rnd(6),rnd(6)),l:2,r:.3})}
    b.dizzy=true;dizzyStars(b)},
};
/* Rahmen um die Spezial-Attacke: wie beim Finisher mit Kino-Balken, Nahaufnahme und Lichtshow,
   der Angriff selbst läuft dann in Zeitlupe ab */
async function sigMove(a,b,dm){const c=a.ch.c,d=-a.side,ax=fx_(a).x;cine(true);banner(a.ch.sig+"!",L("Spezial-Attacke","Special attack"));sfx("charge");
  CAM.mode="cine";CAM.k=7;CAM.tp.set(ax+d*2.2,2.3*a.sc,5.4);CAM.tl.set(ax+d*.2,2.2*a.sc,0);
  say(a,"big");pose(a,"charge",12);aura(a,c,.95);ring(ax,.06,0,c,3,.7);glow(ax,.4,c,3,.9,-.6);colorBurst(c,0xffffff,2.4);
  await rt(.95,p=>{flashLight(c,1+p*2,ax,2);CAM.shake=.02+p*.06});
  CAM.mode="fight";CAM.k=4.5;speed(true);impactFrame(70);sfx("slowmo");TSb=.45;rt(.45).then(()=>speed(false));
  await SIG[a.ch.id](a,b,dm,d,c);
  TSb=1;speed(false);cine(false);CAM.k=5;clearTemp();a.piv.rotation.x=0}
/* Rahmen um den Finisher: Kino-Balken, Nahaufnahme, dann die Sequenz. Endet immer mit K.O. */
async function finMove(a,b){const c=a.ch.c,d=-a.side,ax=fx_(a).x;b.dizzy=false;cine(true);banner(a.ch.fin+"!","必殺 · FINISHER");sfx("charge");CAM.mode="cine";CAM.k=6;CAM.tp.set(ax+d*2.4,2.3*a.sc,5.6);CAM.tl.set(ax+d*.2,2.2*a.sc,0);
  say(a,"big");pose(a,"charge",10);pose(b,"dizzy",10);aura(a,c,1.1);ring(ax,.06,0,c,3,.8);await rt(1.15,p=>{flashLight(c,2+p*4,ax,2);CAM.shake=.03+p*.07});
  CAM.mode="fight";CAM.k=4;await FIN[a.ch.id](a,b,d,c);if(b.hp>0)kill(a,b);cine(false);CAM.k=5;a.turn.rotation.y=FACE}
