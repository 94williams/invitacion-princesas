"use strict";
const CONFIG = window.INVITATION;
const $ = id => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const eventDate = new Date(CONFIG.fechaEvento);
let countdownTimer;

function invitationValues(config) {
  const age = Number(config.edad);
  const words = ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve","veinte"];
  const ageWord = words[age] || String(age);
  const zone = config.zonaHoraria || "America/Mexico_City";
  const date = new Date(config.fechaEvento);
  const parts = new Intl.DateTimeFormat("es-MX",{timeZone:zone,day:"numeric",month:"long",year:"numeric",weekday:"long",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(date);
  const p = Object.fromEntries(parts.filter(part=>part.type!=="literal").map(part=>[part.type,part.value]));
  const capitalize = value => value.charAt(0).toUpperCase()+value.slice(1);
  const hour = Number(p.hour), time = String(hour%12||12).padStart(2,"0")+":"+p.minute, meridiem = hour<12?"a. m.":"p. m.";
  let n = Math.max(0,Math.min(100,Math.floor(age))), roman="";
  for(const [value,mark] of [[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]])while(n>=value){roman+=mark;n-=value;}
  const values = {
    nombre:config.nombre,edad:String(age),edadPalabra:ageWord,edadCorta:String(age).padStart(2,"0"),
    unidadEdad:age===1?"año":"años",edadConUnidad:age+" "+(age===1?"año":"años"),
    misionCorta:"M"+String(age).padStart(2,"0"),misionEtiqueta:"MISIÓN "+String(age).padStart(2,"0")+" / CELEBRAR",
    edicion:"EDICIÓN "+String(age).padStart(2,"0"),capitulo:"Capítulo "+(roman||age)+" · "+p.year,
    fechaPortada:p.day+" de "+p.month+" · "+p.year,diaHora:capitalize(p.weekday)+" · "+time+" "+meridiem,
    dia:p.day,mes:capitalize(p.month),diaAnio:capitalize(p.weekday)+" · "+p.year,
    hora:time,meridiemZona:meridiem+" · "+(config.zonaEtiqueta||zone),
    fechaPie:p.day.padStart(2,"0")+" · "+p.month.toUpperCase()+" · "+p.year,
    lugarNombre:config.lugar.nombre,direccion:config.lugar.direccion,diaCoordenada:"X:"+p.day,
    edadAventuras:capitalize(ageWord)+" "+(age===1?"año":"años")+" de aventuras",
    horaCompleta:time+" "+meridiem
  };
  const interpolate = text => String(text).replace(/\{([a-zA-Z]+)\}/g,(match,key)=>values[key]??match);
  for(const [key,value] of Object.entries(config.textos||{}))values[key]=interpolate(value);
  (config.fotos||[]).forEach((foto,index)=>{values["fotoTitulo"+index]=foto.titulo;});
  return values;
}

function applyInvitationData() {
  const values=invitationValues(CONFIG);
  document.querySelectorAll("[data-bind]").forEach(element=>{
    const value=values[element.dataset.bind];if(value!==undefined)element.textContent=value;
  });
  document.querySelectorAll("[data-brand]").forEach(brand=>{
    const first=CONFIG.nombre.trim().split(/\s+/)[0]+" ";
    if(brand.firstChild?.nodeType===3)brand.firstChild.nodeValue=first;
    else brand.prepend(document.createTextNode(first));
  });
  document.querySelectorAll("[data-event-date]").forEach(element=>element.setAttribute("datetime",CONFIG.fechaEvento));
  document.querySelectorAll("[data-arrival]").forEach(element=>{element.textContent="Nos vemos a las "+values.horaCompleta+" para empezar a celebrar.";});
  document.querySelectorAll("[data-template-notice]").forEach(element=>{element.hidden=!CONFIG.modoDemo;});
  document.querySelectorAll("[data-photo-index]").forEach(img=>{
    const foto=CONFIG.fotos?.[Number(img.dataset.photoIndex)];if(!foto)return;
    img.src=foto.src;img.alt=foto.alt||foto.titulo;img.style.objectPosition=foto.posicion||"50% 50%";
  });
  document.querySelectorAll("[data-hero-index]").forEach(img=>{
    const image=CONFIG.portada?.imagenes?.[Number(img.dataset.heroIndex)];if(!image)return;
    img.src=image.src;img.alt=image.alt||CONFIG.temaNombre;
  });
  document.querySelectorAll("[data-hero-caption]").forEach(caption=>{if(CONFIG.portada?.pie)caption.textContent=CONFIG.portada.pie;});
  document.querySelectorAll("[data-memory-index]").forEach(button=>{
    const foto=CONFIG.fotos?.[Number(button.dataset.memoryIndex)];if(!foto)return;
    button.dataset.caption=foto.titulo;button.dataset.story=foto.historia||"";
  });
  document.querySelectorAll("[data-contact-slot]").forEach(button=>{
    const contact=CONFIG.whatsappContacts?.[Number(button.dataset.contactSlot)];
    if(!contact){button.hidden=true;return;}
    button.hidden=false;button.dataset.contact=contact.id;
    const text="Confirmar con "+contact.name+" ";
    if(button.firstChild?.nodeType===3)button.firstChild.nodeValue=text;
    else button.prepend(document.createTextNode(text));
  });
  document.title=CONFIG.nombre+" · Mis "+values.edadConUnidad+" · "+CONFIG.temaNombre+(CONFIG.modoDemo?" · Ejemplo":"");
  const description=CONFIG.modoDemo?"Plantilla de "+CONFIG.temaNombre+" con datos ficticios editables.":values.subtitulo;
  for(const [selector,value] of [
    ['meta[name="description"]',description],['meta[property="og:description"]',description],
    ['meta[property="og:title"]',CONFIG.nombre+" · Mis "+values.edadConUnidad+" · "+CONFIG.temaNombre]
  ]){const meta=document.querySelector(selector);if(meta)meta.setAttribute("content",value);}
  $("rsvpStatus").textContent=CONFIG.modoDemo?"Vista de ejemplo: puedes previsualizar tu confirmación sin enviar mensajes.":"Se abrirá WhatsApp con tu mensaje. Envíalo para completar la confirmación.";
  const mapUrl=String(CONFIG.lugar.maps||"").trim();
  $("mapsBtn").href=mapUrl||"#lugar";
  if(mapUrl){$("mapsBtn").target="_blank";$("mapsBtn").rel="noopener noreferrer";}
  document.querySelectorAll("[data-map-note]").forEach(note=>{
    note.textContent=mapUrl?"Se abre la ubicación en Google Maps.":"Ubicación de ejemplo. El mapa estará disponible al personalizar.";
  });
}
applyInvitationData();

function showToast(message) {
  $("toast").textContent=message;$("toast").classList.add("show");clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>$("toast").classList.remove("show"),5000);
}
function updateCountdown() {
  const remaining=eventDate.getTime()-Date.now(),diff=Math.max(0,remaining);
  const units=[Math.floor(diff/86400000),Math.floor(diff%86400000/3600000),Math.floor(diff%3600000/60000),Math.floor(diff%60000/1000)];
  ["days","hours","minutes","seconds"].forEach((id,i)=>{$(id).textContent=String(units[i]).padStart(2,"0");});
  $("countdown").hidden=remaining<=0;$("countdownStatus").hidden=remaining>0;
  if(remaining<=0&&countdownTimer)clearInterval(countdownTimer);
}
function downloadICS() {
  const end=new Date(eventDate.getTime()+(Number(CONFIG.duracionHoras)||4)*3600000);
  const format=date=>date.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const escape=value=>String(value).replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
  const unit=Number(CONFIG.edad)===1?"año":"años";
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Invitaciones Tematicas//ES//","CALSCALE:GREGORIAN","BEGIN:VEVENT",
    `UID:${eventDate.getTime()}-${CONFIG.theme}@invitaciones-tematicas`,
    `DTSTAMP:${format(new Date())}`,`DTSTART:${format(eventDate)}`,`DTEND:${format(end)}`,
    `SUMMARY:${escape(CONFIG.edad+" "+unit+" de "+CONFIG.nombre+(CONFIG.modoDemo?" (Ejemplo)":""))}`,
    `DESCRIPTION:${escape(CONFIG.modoDemo?"Evento ficticio de demostración.":"La celebración de "+CONFIG.nombre+". ¡Te esperamos!")}`,
    `LOCATION:${escape(CONFIG.lugar.nombre+" - "+CONFIG.lugar.direccion)}`,"END:VEVENT","END:VCALENDAR"];
  const fold=line=>{
    const encoder=new TextEncoder();let output="",length=0;
    for(const char of line){const size=encoder.encode(char).length;if(length+size>75){output+="\r\n ";length=1;}output+=char;length+=size;}return output;
  };
  const url=URL.createObjectURL(new Blob([lines.map(fold).join("\r\n")+"\r\n"],{type:"text/calendar;charset=utf-8"}));
  const link=document.createElement("a"),slug=CONFIG.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]+/g,"-");
  link.href=url;link.download="Invitacion-"+CONFIG.theme+"-"+slug+".ics";document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);showToast("Fecha descargada. Abre el archivo con tu calendario.");
}
function createWhatsAppUrl(phone,message) {
  let digits=String(phone||"").replace(/\D/g,"");if(digits.length===10)digits="52"+digits;
  if(!/^52\d{10}$/.test(digits))return "";
  return "https://api.whatsapp.com/send?phone="+digits+"&text="+encodeURIComponent(message);
}
function rsvpSubmit(event) {
  event.preventDefault();
  const name=$("guestName").value.trim(),count=Number($("guestCount").value),website=$("guestWebsite").value.trim();
  if(website)return;
  if(!name||name.length>80){$("guestName").focus();showToast("Escribe tu nombre para confirmar.");return;}
  if(!Number.isInteger(count)||count<1||count>6){showToast("Elige entre 1 y 6 personas.");return;}
  const contact=CONFIG.whatsappContacts.find(item=>item.id===event.submitter?.dataset.contact);
  if(!contact){showToast("Elige con quién deseas confirmar.");return;}
  const unit=Number(CONFIG.edad)===1?"año":"años";
  const message=`¡Hola! Soy ${name}. Confirmo nuestra asistencia a la celebración de ${CONFIG.nombre} por sus ${CONFIG.edad} ${unit}. Asistiremos ${count} ${count===1?"persona":"personas"}. ¡Nos vemos en la fiesta!`;
  if(CONFIG.modoDemo){
    $("demoMessage").value=message;$("demoContact").textContent=contact.name;
    $("demoRsvpDialog").showModal();document.body.classList.add("modal-open");
    $("rsvpStatus").textContent="Vista de ejemplo abierta. No se envió ningún mensaje.";return;
  }
  const url=createWhatsAppUrl(contact.phone,message);
  if(!url){showToast("El contacto de confirmación aún no está disponible.");return;}
  const whatsappWindow=window.open(url,"_blank");
  if(!whatsappWindow){showToast("Permite abrir WhatsApp y vuelve a intentarlo.");return;}
  whatsappWindow.opener=null;$("rsvpStatus").textContent="WhatsApp abierto. Envía tu mensaje a "+contact.name+" para completar la confirmación.";
}
async function shareInvitation() {
  const data={title:"La celebración de "+CONFIG.nombre,text:"¡Acompáñame a celebrar mi cumpleaños!",url:window.location.href};
  try{
    if(navigator.share)await navigator.share(data);
    else if(navigator.clipboard){await navigator.clipboard.writeText(data.url);showToast("Enlace copiado. ¡Comparte la celebración!");}
    else showToast("Copia el enlace del navegador para compartir esta invitación.");
  }catch(error){if(error.name!=="AbortError")showToast("Copia el enlace del navegador para compartir la invitación.");}
}
function observeReveal() {
  if(reduceMotion||!("IntersectionObserver" in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("entered");observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:"0px 0px -24px 0px"});
  document.querySelectorAll("[data-enter]").forEach(element=>observer.observe(element));
  document.body.classList.add("js-motion");
  document.addEventListener("focusin",event=>{
    const element=event.target.closest("[data-enter]");if(element){element.classList.add("entered");observer.unobserve(element);}
  });
}
function updateScroll() {
  const total=document.documentElement.scrollHeight-window.innerHeight;
  $("progressBar").style.width=(total>0?window.scrollY/total*100:0)+"%";
  const pastCover=document.querySelector(".cover").getBoundingClientRect().bottom<80;
  const nearRsvp=$("rsvp").getBoundingClientRect().top<window.innerHeight*.95;
  $("stickyRsvp").hidden=!pastCover||nearRsvp;
}
let scrollPending=false;
window.addEventListener("scroll",()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{updateScroll();scrollPending=false;});},{passive:true});
window.addEventListener("resize",updateScroll);
const dialog=$("photoDialog");
document.querySelectorAll(".memory").forEach(button=>button.addEventListener("click",()=>{
  const photo=button.querySelector("img");$("photoLarge").src=photo.src;$("photoLarge").alt=photo.alt;
  $("photoCaption").textContent=button.dataset.caption;$("photoStory").textContent=button.dataset.story||"";
  dialog.showModal();document.body.classList.add("modal-open");
}));
document.querySelector("#photoDialog .dialog-close").addEventListener("click",()=>dialog.close());
$("demoClose").addEventListener("click",()=>$("demoRsvpDialog").close());
[dialog,$("demoRsvpDialog")].forEach(modal=>{
  modal.addEventListener("click",event=>{
    const rect=modal.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)modal.close();
  });
  modal.addEventListener("close",()=>{if(!document.querySelector("dialog[open]"))document.body.classList.remove("modal-open");});
});
$("mapsBtn").addEventListener("click",event=>{
  if(!String(CONFIG.lugar.maps||"").trim()){event.preventDefault();showToast("El mapa se añadirá al personalizar la invitación.");}
});
$("openBtn").addEventListener("click",()=>$("mainContent").focus({preventScroll:true}));
$("calendarBtn").addEventListener("click",downloadICS);
$("rsvpForm").addEventListener("submit",rsvpSubmit);
$("shareBtn").addEventListener("click",shareInvitation);
updateCountdown();if(eventDate.getTime()>Date.now())countdownTimer=setInterval(updateCountdown,1000);
observeReveal();updateScroll();

