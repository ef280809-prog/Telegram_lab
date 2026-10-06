const form=document.getElementById("telegramForm");
const chatId=document.getElementById("chatId");
const message=document.getElementById("message");
const permission=document.getElementById("permission");
const result=document.getElementById("result");
document.getElementById("year").textContent=new Date().getFullYear();
message.addEventListener("input",()=>{
 document.getElementById("count").textContent=`${message.value.length} / 4000 caracteres`;
 document.getElementById("messageError").textContent="";result.textContent="";
});
chatId.addEventListener("input",()=>{
 chatId.value=chatId.value.trim().replace(/[^\d-]/g,"").slice(0,30);
 document.getElementById("chatError").textContent="";result.textContent="";
});
permission.addEventListener("change",()=>document.getElementById("permissionError").textContent="");
form.addEventListener("submit",async event=>{
 event.preventDefault();
 const chat=chatId.value.trim(),text=message.value.trim();
 const chatError=document.getElementById("chatError"),messageError=document.getElementById("messageError"),permissionError=document.getElementById("permissionError");
 chatError.textContent=messageError.textContent=permissionError.textContent=result.textContent="";
 result.style.color="#12885d";let valid=true;
 if(!/^-?\d{1,20}$/.test(chat)){chatError.textContent="Escribe un Chat ID numérico válido. Los grupos pueden tener un ID negativo.";valid=false;}
 if(!text){messageError.textContent="Escribe el mensaje que deseas enviar.";valid=false;}
 if(!permission.checked){permissionError.textContent="Confirma que tienes autorización para contactar este chat.";valid=false;}
 if(!valid)return;
 const button=form.querySelector("button[type=submit]");button.disabled=true;button.innerHTML="Enviando…";
 try{
  const response=await fetch("/api/send-message",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:chat,message:text})});
  const data=await response.json();
  if(!response.ok||!data.ok)throw new Error(data.error||"No se pudo enviar el mensaje.");
  result.textContent="¡Mensaje enviado correctamente por Telegram!";form.reset();document.getElementById("count").textContent="0 / 4000 caracteres";
 }catch(error){result.style.color="#c43d53";result.textContent=`No se pudo enviar: ${error.message}. Comprueba que el backend esté activo y configurado.`;}
 finally{button.disabled=false;button.innerHTML='Enviar por Telegram <span>↗</span>';}
});
const navToggle=document.getElementById("navToggle"),nav=document.getElementById("mainNav");
navToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");navToggle.setAttribute("aria-expanded","false");}));
