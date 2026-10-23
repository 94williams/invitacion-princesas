"use strict";
(() => {
 const q=(s)=>document.querySelector(s), all=(s)=>[...document.querySelectorAll(s)];
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const run=(el,name)=>{
   if(!el||reduced)return;
   el.classList.remove(name);void el.offsetWidth;el.classList.add(name);
   const end=()=>{el.classList.remove(name);el.removeEventListener("animationend",end);};
   el.addEventListener("animationend",end);
 };
 const particles=(container,type,count)=>{
   if(reduced||!container)return;
   const old=container.querySelectorAll(".fx-particle");
   old.forEach(p=>p.remove());
   for(let i=0;i<count;i++){
    const p=document.createElement("i");p.setAttribute("aria-hidden","true");
    p.className="fx-particle fx-"+type;p.style.left=(8+Math.random()*84)+"%";p.style.top=(10+Math.random()*50)+"%";
    p.style.setProperty("--drift",(-70+Math.random()*140)+"px");p.style.animation="celebration-particle "+(1.2+Math.random())+"s ease-out forwards";
    p.style.animationDelay=(Math.random()*.35)+"s";container.append(p);setTimeout(()=>p.remove(),3000);
   }
 };
 if(q("[data-fashion]"))q("[data-fashion]").addEventListener("click",()=>{
   q("#fashionStatus").textContent="Edición especial: tú también eres parte de esta historia.";
   run(q(".fashion-spread"),"camera-flash");particles(q(".fashion-spread"),"star",14);
 });
 let touches=0;
 if(q("[data-balloon]"))q("[data-balloon]").addEventListener("click",()=>{
   touches++;q("#balloonStatus").textContent=touches===1?"¡Un toque! La diversión sigue en el aire.":touches+" toques. ¡Qué gran equipo!";
   run(q("[data-balloon]"),"balloon-bop");
 });
 let roseLit=false;
 if(q("[data-rose]"))q("[data-rose]").addEventListener("click",()=>{
   roseLit=!roseLit;q(".rose-display").classList.toggle("rose-lit",roseLit);
   q("[data-rose]").setAttribute("aria-pressed",String(roseLit));
   q("#roseStatus").textContent=roseLit?"La rosa brilla. Que este nuevo año esté lleno de cariño.":"Un pequeño gesto puede encender toda la magia.";
   if(roseLit)particles(q(".special-section"),"petal",8);
 });
 if(q("[data-snow]"))q("[data-snow]").addEventListener("click",()=>{
   q("#snowStatus").textContent="Deseo enviado: que sigamos compartiendo momentos mágicos.";
   run(q(".crystal"),"crystal-awake");particles(q(".snow-wish"),"snow",22);
 });
 all("[data-bubble]").forEach(b=>b.addEventListener("click",()=>{
   if(b.getAttribute("aria-pressed")==="true")return;
   b.setAttribute("aria-pressed","true");b.querySelector(".bubble-closed").hidden=true;b.querySelector(".bubble-message").hidden=false;
   run(b,"bubble-pop");const n=all('[data-bubble][aria-pressed="true"]').length;
   q("#bubbleStatus").textContent=n===3?"¡Un mar de risas contigo! Ese es nuestro plan.":n+" de 3 sorpresas descubiertas.";
 }));
 all("[data-window]").forEach(b=>b.addEventListener("click",()=>{
   const opened=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!opened));
   b.querySelector(".window-answer").hidden=opened;
   b.querySelector(".sr-only").textContent=(opened?"Abrir":"Cerrar")+" ventana "+b.querySelector(".window-shutter").textContent;
   q("#windowStatus").textContent=opened?"Hay más sorpresas esperando.":b.querySelector(".window-answer").textContent+". ¡Te esperamos!";
 }));
 if(q("[data-lucky]"))q("[data-lucky]").addEventListener("click",()=>{
   q("#luckyStatus").textContent="Poder desbloqueado: hacer extraordinarios los momentos juntos.";
   q(".lucky-token").classList.add("lucky-found");q("[data-lucky]").textContent="¡Misión aceptada!";
   run(q(".lucky-token"),"lucky-spin");
 });
 all("[data-craft]").forEach(b=>b.addEventListener("click",()=>{
   const active=b.getAttribute("aria-pressed")==="true";b.setAttribute("aria-pressed",String(!active));
   const n=all('[data-craft][aria-pressed="true"]').length;
   q("#craftStatus").textContent=n===3?"¡Logro desbloqueado! El ingrediente más importante eres tú.":"Ingredientes: "+n+" de 3.";
   q("#craftResult").textContent=n===3?"¡Fiesta fabricada!":"Fiesta por fabricar";
   q(".craft-result").classList.toggle("crafted",n===3);if(n===3)run(q(".craft-result"),"achievement");
 }));
})();

