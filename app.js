const screens=[...document.querySelectorAll('.screen')];
const areas=['Abdomen','Waist','Back','Arms','Glutes','Thighs','Legs'];
const services=['Body Sculpting','Fat Reduction','Post Op','Cellulite Treatment','Lymphatic Drainage','Maderoterapia'];
const questions=['Do you exercise?','Are you under a doctor’s care?','Are you pregnant?','Surgery in the past 3 months?','Any serious disease or disability?','Any serious back problems?','Any kind of heart problem?','High blood pressure?','Liver problems?','Kidney condition?','Diabetes?','Constipation?','Allergies?','Varicose veins?','Arthritis?','Are you overweight?'];
const questionsEs=['¿Haces ejercicio?','¿Estás bajo cuidado médico?','¿Estás embarazada?','¿Cirugía en los últimos 3 meses?','¿Alguna enfermedad grave o discapacidad?','¿Problemas graves de espalda?','¿Algún problema del corazón?','¿Presión arterial alta?','¿Problemas del hígado?','¿Condición de los riñones?','¿Diabetes?','¿Estreñimiento?','¿Alergias?','¿Venas varicosas?','¿Artritis?','¿Tienes sobrepeso?'];

const translations={es:{
  marthaView:'Vista de Martha',checkin:'Bienvenida a tu registro',welcomeTitle:'Qué lindo verte.',
  welcomeLead:'Elige una opción. Martha está cerca si necesitas ayuda.',newClient:'Soy cliente nueva',
  newHelp:'Completa tus datos y consentimiento',returning:'Ya soy cliente',
  returningHelp:'Regístrate con tu número celular',privacy:'Tu información se mantiene privada y segura.',
  back:'Atrás',about:'Sobre ti',wellness:'Bienestar',consent:'Consentimiento',
  help:'¿Tienes alguna pregunta? Martha está aquí para ayudarte.',newIntake:'Registro de cliente nueva',
  tellUs:'Cuéntanos un poco sobre ti',threeMinutes:'Normalmente toma unos 3 minutos.',
  contact:'Información de contacto',fullName:'Nombre completo',mobile:'Teléfono celular',
  dob:'Fecha de nacimiento',address:'Dirección',city:'Ciudad',state:'Estado',zip:'Código postal',
  referred:'Referida por',healthTitle:'Bienestar e historial de salud',
  healthNote:'Selecciona una respuesta para cada pregunta.',goals:'Tus objetivos',
  desired:'Peso deseado (opcional)',comments:'¿Algo más que quieras contarle a Martha?',
  areas:'Áreas que te interesan',save:'Guardar para después',review:'Revisar consentimiento',
  askBefore:'Pregúntale a Martha cualquier duda antes de firmar.',finalStep:'Último paso',
  consentSignature:'Consentimiento y firma',reviewCarefully:'Revisa cuidadosamente la información.',
  general:'Consentimiento general',cellulite:'Tratamiento de celulitis',
  acknowledge:'He leído y entiendo el consentimiento anterior.',signature:'Firma de la cliente',
  signHelp:'Firma con tu dedo o lápiz',clear:'Borrar',date:'Fecha',
  submit:'Enviar y devolver la tableta a Martha',allSet:'Todo listo',thanks:'Gracias, Sofia.',
  handBack:'Devuelve la tableta a Martha. Ella se encargará de todo desde aquí.',
  continue:'Continuar a la vista de Martha'
}};

function go(id){
  screens.forEach(screen=>screen.classList.toggle('active',screen.id===id));
  window.scrollTo(0,0);
  document.querySelectorAll('.form-content,.staff-content').forEach(el=>el.scrollTo(0,0));
}
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-go]');
  if(trigger) go(trigger.dataset.go);
});

function makeChip(label,selected=false){
  const button=document.createElement('button');
  button.type='button';
  button.className='chip'+(selected?' selected':'');
  button.textContent=label;
  button.setAttribute('aria-pressed',selected);
  button.addEventListener('click',()=>{
    button.classList.toggle('selected');
    button.setAttribute('aria-pressed',button.classList.contains('selected'));
  });
  return button;
}
document.querySelectorAll('[data-area-group]').forEach(group=>{
  areas.forEach(area=>group.append(makeChip(area,group.dataset.areaGroup==='treatment'&&['Abdomen','Waist'].includes(area))));
});
services.forEach((service,index)=>document.querySelector('#service-chips').append(makeChip(service,index===0)));

const questionGrid=document.querySelector('#question-grid');
function renderQuestions(labels=questions,lang='en'){
  questionGrid.innerHTML='';
  labels.forEach((question,index)=>{
    const item=document.createElement('div');
    item.className='question';
    const yes=lang==='es'?'Sí':'Yes';
    item.innerHTML='<p>'+question+'</p><div class="segmented" role="group" aria-label="'+question+'"><button type="button" class="'+(index===0?'selected':'')+'">'+yes+'</button><button type="button" class="'+(index===0?'':'selected')+'">No</button></div>';
    item.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
      item.querySelectorAll('button').forEach(other=>other.classList.toggle('selected',other===button));
    }));
    questionGrid.append(item);
  });
}
renderQuestions();

document.querySelectorAll('.consent-tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.consent-tab').forEach(item=>item.classList.toggle('active',item===tab));
  document.querySelectorAll('.consent-copy').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===tab.dataset.consent));
}));

const canvas=document.querySelector('#signature-pad');
const ctx=canvas.getContext('2d');
let drawing=false;
let signed=false;
function point(event){
  const rect=canvas.getBoundingClientRect();
  const source=event.touches?.[0]||event;
  return {x:(source.clientX-rect.left)*(canvas.width/rect.width),y:(source.clientY-rect.top)*(canvas.height/rect.height)};
}
function start(event){
  drawing=true;signed=true;
  const p=point(event);
  ctx.beginPath();ctx.moveTo(p.x,p.y);
  event.preventDefault();
}
function draw(event){
  if(!drawing)return;
  const p=point(event);
  ctx.lineWidth=4;ctx.lineCap='round';ctx.strokeStyle='#075d5b';ctx.lineTo(p.x,p.y);ctx.stroke();
  event.preventDefault();
}
function stop(){drawing=false}
['mousedown','touchstart'].forEach(type=>canvas.addEventListener(type,start,{passive:false}));
['mousemove','touchmove'].forEach(type=>canvas.addEventListener(type,draw,{passive:false}));
['mouseup','mouseleave','touchend'].forEach(type=>canvas.addEventListener(type,stop));
document.querySelector('#clear-signature').addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);signed=false});
document.querySelector('#consent-date').value=new Date().toISOString().slice(0,10);
document.querySelector('#submit-intake').addEventListener('click',()=>{
  if(!document.querySelector('#ack').checked){alert('Please confirm that you have read the consent.');return}
  if(!signed){alert('Please add your signature before submitting.');return}
  go('submitted');
});

document.querySelectorAll('.quick-notes button').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();button.classList.toggle('selected');
}));
document.querySelector('#complete-treatment').addEventListener('click',()=>{
  const toast=document.querySelector('#toast');
  toast.classList.add('show');
  setTimeout(()=>{toast.classList.remove('show');go('profile')},1400);
});

document.querySelectorAll('.lang').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.lang').forEach(item=>item.classList.toggle('active',item===button));
  const lang=button.dataset.lang;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(element=>{
    const value=translations[lang]?.[element.dataset.i18n];
    if(value) element.textContent=value;
  });
  renderQuestions(lang==='es'?questionsEs:questions,lang);
}));