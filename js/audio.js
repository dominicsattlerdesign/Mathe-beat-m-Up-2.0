/* ---------- Ton: alle Effekte und die Menümusik werden live per WebAudio erzeugt ---------- */
const AU={ctx:null,muted:false,timer:null,step:0,next:0,vol:{m:.8,s:.9}};
function auInit(){
  if(AU.ctx){if(AU.ctx.state=="suspended")AU.ctx.resume();return}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const c=AU.ctx=new C();
  AU.master=c.createGain();AU.master.gain.value=AU.muted?0:1;
  const comp=c.createDynamicsCompressor();AU.master.connect(comp);comp.connect(c.destination);
  AU.sfx=c.createGain();AU.sfx.gain.value=AU.vol.s;AU.sfx.connect(AU.master);
  AU.mus=c.createGain();AU.mus.gain.value=0;AU.mus.connect(AU.master);
  const b=AU.nb=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
}
/* Lautstärken 0…1 für Musik und Effekte, wirken sofort */
function auVol(m,s){AU.vol={m,s};if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.sfx.gain.setTargetAtTime(s,t,.03);if(AU.timer)AU.mus.gain.setTargetAtTime(.6*m,t,.05)}
function auMute(m){AU.muted=m;if(AU.ctx)AU.master.gain.setTargetAtTime(m?0:1,AU.ctx.currentTime,.03)}
function tone(o){
  const c=AU.ctx;if(!c)return;
  const t=(o.at||c.currentTime)+(o.t||0),os=c.createOscillator(),g=c.createGain(),d=o.d||.1;
  os.type=o.w||"square";os.frequency.setValueAtTime(o.f,t);
  if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(o.v||.2,t+(o.a||.006));g.gain.exponentialRampToValueAtTime(.0001,t+d);
  os.connect(g);g.connect(o.out||AU.sfx);os.start(t);os.stop(t+d+.05);
}
function nz(o){
  const c=AU.ctx;if(!c)return;
  const t=(o.at||c.currentTime)+(o.t||0),s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),d=o.d||.1;
  s.buffer=AU.nb;s.loop=true;f.type=o.ft||"lowpass";f.frequency.setValueAtTime(o.f||1000,t);f.Q.value=o.q||1;
  if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(o.v||.3,t+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f);f.connect(g);g.connect(o.out||AU.sfx);s.start(t,Math.random()*.5);s.stop(t+d+.05);
}
const SFX={
  click(){tone({f:660,f2:990,d:.07,v:.14})},
  pick(){tone({f:520,d:.05,v:.14});tone({f:780,d:.08,v:.14,t:.05})},
  key(){tone({f:420,d:.04,v:.1,w:"triangle"})},
  ok(){[523,659,784,1047].forEach((f,i)=>tone({f,d:.1,v:.14,t:i*.045}))},
  wrong(){tone({f:170,f2:80,d:.4,v:.22,w:"sawtooth"});tone({f:120,f2:60,d:.4,v:.16,w:"square",t:.04})},
  swoosh(){nz({ft:"bandpass",f:500,f2:3200,q:2,d:.16,v:.28})},
  whoosh(){nz({ft:"bandpass",f:300,f2:1800,q:1.5,d:.32,v:.34})},
  jump(){tone({f:220,f2:620,d:.14,v:.1,w:"triangle"});nz({ft:"highpass",f:1500,d:.1,v:.1})},
  punch(){nz({f:1900,f2:300,d:.09,v:.6});tone({f:190,f2:60,d:.11,v:.5,w:"sine"})},
  heavy(){nz({f:1400,f2:160,d:.2,v:.75});tone({f:140,f2:38,d:.24,v:.7,w:"sine"});tone({f:900,f2:200,d:.05,v:.16})},
  kick(){nz({ft:"bandpass",f:900,f2:200,q:.8,d:.16,v:.7});tone({f:120,f2:42,d:.2,v:.7,w:"sine"});tone({f:1300,f2:300,d:.04,v:.18,w:"triangle"})},
  grab(){tone({f:150,f2:260,d:.08,v:.25,w:"triangle"});nz({f:700,d:.06,v:.25})},
  slam(){nz({f:900,f2:70,d:.5,v:.9});tone({f:95,f2:28,d:.55,v:.9,w:"sine"});nz({ft:"highpass",f:2500,d:.12,v:.2,t:.02})},
  land(){nz({f:500,f2:90,d:.16,v:.4});tone({f:90,f2:45,d:.14,v:.35,w:"sine"})},
  wood(){for(let i=0;i<4;i++)nz({ft:"bandpass",f:600+Math.random()*900,q:3,d:.07,v:.4,t:i*.035});tone({f:210,f2:90,d:.12,v:.25,w:"triangle"})},
  stone(){nz({f:700,f2:100,d:.4,v:.6});for(let i=0;i<3;i++)nz({ft:"bandpass",f:300+Math.random()*300,q:2,d:.1,v:.3,t:.06+i*.07})},
  glass(){nz({ft:"highpass",f:3500,d:.3,v:.35});[2400,3100,3900,5200].forEach((f,i)=>tone({f:f+Math.random()*300,d:.2,v:.06,w:"sine",t:i*.025}))},
  metal(){[420,633,951,1380].forEach(f=>tone({f,d:.5,v:.09,w:"triangle"}));nz({ft:"bandpass",f:2600,q:4,d:.1,v:.3})},
  paper(){nz({ft:"highpass",f:1800,f2:5000,d:.16,v:.3});nz({ft:"bandpass",f:900,q:1,d:.08,v:.2,t:.03})},
  warn(){tone({f:880,d:.08,v:.14});tone({f:880,d:.08,v:.14,t:.13})},
  charge(){tone({f:70,f2:700,d:1.25,v:.22,w:"sawtooth",a:.5});tone({f:140,f2:1400,d:1.25,v:.1,w:"square",a:.6});nz({ft:"bandpass",f:300,f2:5000,q:3,d:1.25,v:.22,a:.8})},
  slowmo(){tone({f:320,f2:26,d:1.5,v:.55,w:"sine"});nz({f:2500,f2:60,d:1.3,v:.3})},
  boom(){nz({f:2200,f2:40,d:1.3,v:1});tone({f:75,f2:22,d:1.3,v:.9,w:"sine"});tone({f:420,f2:50,d:.4,v:.3,w:"sawtooth"})},
  zap(){tone({f:1900,f2:120,d:.16,v:.2,w:"sawtooth"});nz({ft:"highpass",f:3000,d:.12,v:.25})},
  ko(){tone({f:520,f2:55,d:1.1,v:.3,w:"sawtooth"});nz({f:1500,f2:60,d:.9,v:.5});tone({f:55,f2:30,d:1.2,v:.6,w:"sine"})},
  gong(){[98,147,196,311].forEach(f=>tone({f,d:1.6,v:.14,w:"triangle"}));nz({ft:"bandpass",f:400,q:3,d:.4,v:.25})},
  vs(){tone({f:70,f2:420,d:.3,v:.25,w:"sawtooth"});nz({f:500,f2:4000,ft:"bandpass",d:.3,v:.3});SFX.heavy()},
  win(){[523,523,523,659,784,659,784,1047].forEach((f,i)=>{tone({f,d:i==7?.7:.13,v:.16,t:i*.13});tone({f:f/2,d:i==7?.7:.13,v:.1,w:"triangle",t:i*.13})})},
  lose(){[392,370,330,262,196].forEach((f,i)=>tone({f,d:.34,v:.15,w:"triangle",t:i*.24}))},
  unlock(){[392,523,659,784,1047,1319,1568].forEach((f,i)=>tone({f,d:.3,v:.13,t:i*.08}));nz({ft:"highpass",f:5000,d:.9,v:.1,t:.5})},
};
function sfx(n){if(!AU.ctx||AU.muted)return;try{SFX[n]&&SFX[n]()}catch(e){}}

/* Menümusik: drei Arcade-Titel, je 8 Takte à 16 Schritte als Schleife.
   lead = Melodie (MIDI-Noten, 0 = Pause), bass = Grundton je Takt, arp = Akkord je Takt,
   bs = Bass-Muster, dr = Schlagzeug-Muster, lw = Klang der Melodie, h = zweite Stimme im zweiten Durchgang (Halbtöne). */
const TRK=[
 {n:["Neon-Faust","Neon Fist"],bpm:150,lw:"square",h:7,bs:"oct",dr:"std",
  lead:[[81,0,0,76,0,0,72,0,76,0,81,0,79,0,76,0],[77,0,0,72,0,0,69,0,72,0,77,0,76,0,72,0],[76,0,0,72,0,0,67,0,72,0,76,0,79,0,76,0],[74,0,0,71,0,0,67,0,71,0,74,0,79,0,83,0],
        [81,0,81,0,84,0,81,0,79,0,76,0,79,0,81,0],[77,0,77,0,81,0,77,0,76,0,72,0,76,0,77,0],[79,0,79,0,83,0,79,0,77,0,74,0,77,0,79,0],[80,0,0,76,0,0,83,0,80,0,76,0,80,83,86,88]],
  bass:[45,41,48,43,45,41,43,40],
  arp:[[57,60,64],[53,57,60],[55,60,64],[55,59,62],[57,60,64],[53,57,60],[55,59,62],[56,59,64]]},
 /* Drachenpfad: fernöstlich, a-Moll-Pentatonik, ruhiger Groove mit Taiko-Trommeln */
 {n:["Drachenpfad","Dragon Path"],bpm:132,lw:"triangle",h:-12,bs:"half",dr:"taiko",
  lead:[[81,0,0,79,0,76,0,0,74,0,76,0,79,0,0,0],[81,0,84,0,81,0,79,0,76,0,0,0,74,0,72,0],[74,0,0,76,0,74,0,72,0,69,0,0,72,0,74,0],[76,0,0,0,0,0,79,0,76,0,74,0,72,0,0,0],
        [69,0,72,0,74,0,76,0,79,0,0,76,0,79,81,0],[84,0,0,81,0,79,0,81,0,0,79,0,76,0,74,0],[76,0,0,74,0,72,0,74,0,0,72,0,69,0,72,0],[69,0,0,0,0,0,0,0,76,0,74,0,72,0,74,76]],
  bass:[45,41,43,40,45,41,43,45],
  arp:[[57,60,64],[53,57,60],[55,59,62],[52,55,59],[57,60,64],[53,57,60],[55,59,62],[57,60,64]]},
 /* Turbo-Arena: e-Moll, schnell, durchgehende Bassdrum und treibender Bass */
 {n:["Turbo-Arena","Turbo Arena"],bpm:168,lw:"square",h:-5,bs:"drive",dr:"four",
  lead:[[88,0,86,0,83,0,79,0,83,0,86,0,88,0,0,0],[84,0,83,0,79,0,76,0,79,0,83,0,84,0,0,0],[86,0,83,0,78,0,74,0,78,0,83,0,86,0,88,0],[87,0,0,0,83,0,0,0,78,0,0,0,75,0,78,0],
        [76,76,0,79,0,76,0,83,0,81,0,79,0,76,0,0],[76,76,0,79,0,76,0,84,0,83,0,79,0,76,0,0],[74,74,0,78,0,74,0,81,0,79,0,78,0,74,0,0],[75,0,78,0,83,0,87,0,90,0,87,0,83,0,78,0]],
  bass:[40,36,38,35,40,36,38,35],
  arp:[[52,55,59],[48,52,55],[50,54,57],[47,51,54],[52,55,59],[48,52,55],[50,54,57],[47,51,54]]}];
AU.track=0;
const mf=n=>440*Math.pow(2,(n-69)/12);
function musTick(){
  const c=AU.ctx,M=TRK[AU.track]||TRK[0],sd=60/M.bpm/4;
  while(AU.next<c.currentTime+.18){
    const s=AU.step%128,bar=s>>4,i=s&15,pass=(AU.step>>7)&1,at=AU.next,out=AU.mus,n=M.lead[bar][i],r=M.bass[bar];
    if(n){tone({at,f:mf(n),d:sd*(M.lw=="triangle"?2.6:1.9),v:M.lw=="triangle"?.12:.085,w:M.lw,out});if(pass)tone({at,f:mf(n+(bar==7&&M.h==7?3:M.h)),d:sd*1.6,v:.035,w:"square",out})}
    /* Bass */
    if(M.bs=="oct"){if(i%2==0)tone({at,f:mf(r+((i>>1)%2?12:0)),d:sd*1.7,v:.17,w:"sawtooth",out})}
    else if(M.bs=="half"){if(i==0||i==6||i==8||i==14)tone({at,f:mf(r+(i==14?7:0)),d:sd*(i==0||i==8?3.5:1.6),v:.2,w:"sawtooth",out})}
    else tone({at,f:mf(r+(i%4==2?12:0)),d:sd*.85,v:.15,w:"sawtooth",out});
    /* Begleitung */
    tone({at,f:mf(M.arp[bar][i%3]+12),d:sd*.9,v:M.dr=="taiko"?.028:.035,w:"triangle",out});
    /* Schlagzeug */
    if(M.dr=="std"){if(i%4==0)tone({at,f:150,f2:42,d:.13,v:.45,w:"sine",out});if(i%8==4)nz({at,ft:"bandpass",f:1700,q:.7,d:.12,v:.3,out});
      if(i%2==1||(bar%4==3&&i>11))nz({at,ft:"highpass",f:7000,d:.035,v:.09,out})}
    else if(M.dr=="taiko"){if(i==0||i==10)tone({at,f:120,f2:45,d:.3,v:.55,w:"sine",out});if(i==6||i==14||(bar%2&&i==15))tone({at,f:190,f2:95,d:.18,v:.32,w:"sine",out});
      if(i==8)nz({at,ft:"bandpass",f:900,q:1.2,d:.16,v:.28,out});if(i%2==0)nz({at,ft:"bandpass",f:6000,q:2,d:.05,v:.06,out})}
    else{if(i%4==0)tone({at,f:160,f2:40,d:.14,v:.5,w:"sine",out});if(i==4||i==12)nz({at,ft:"bandpass",f:2000,q:.6,d:.14,v:.34,out});
      if(i%4==2)nz({at,ft:"highpass",f:6000,d:.09,v:.12,out});else nz({at,ft:"highpass",f:8000,d:.025,v:.05,out});
      if(bar==7&&i>11)tone({at,f:mf(r+24+(i-12)*3),d:sd,v:.06,w:"square",out})}
    AU.step++;AU.next+=sd;
  }
}
/* Titel wechseln: läuft gerade Musik, beginnt der neue Titel sofort von vorn */
function musicTrack(i){AU.track=i;if(AU.timer){clearInterval(AU.timer);AU.timer=null;musicOn()}}
function musicOn(){
  if(!AU.ctx||AU.timer)return;
  AU.step=0;AU.next=AU.ctx.currentTime+.08;AU.mus.gain.cancelScheduledValues(AU.ctx.currentTime);AU.mus.gain.setTargetAtTime(.6*AU.vol.m,AU.ctx.currentTime,.05);
  AU.timer=setInterval(musTick,45);musTick();
}
function musicOff(){
  if(!AU.timer)return;clearInterval(AU.timer);AU.timer=null;
  AU.mus.gain.setTargetAtTime(0,AU.ctx.currentTime,.06);
}

