(() => {
  const form = document.getElementById('vacunacion-form');
  const statusEl = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');
  document.getElementById('year').textContent = new Date().getFullYear();

  function setError(name, msg){
    const el = document.querySelector(`.error[data-for="${name}"]`);
    if(el) el.textContent = msg || '';
  }

  function clearErrors(){
    ['nombre','telefono','correo','documento'].forEach(k => setError(k, ''));
  }

  function validate(){
    clearErrors();
    let ok = true;
    const nombre = form.nombre.value.trim();
    const tel = form.telefono.value.trim();
    const mail = form.correo.value.trim();
    const file = form.documento.files[0];

    if(!nombre){ setError('nombre','Este campo es obligatorio.'); ok = false; }
    if(!tel){ setError('telefono','Este campo es obligatorio.'); ok = false; }
    if(mail && !/^\S+@\S+\.\S+$/.test(mail)){ setError('correo','Formato de correo inválido.'); ok = false; }
    if(!file){ setError('documento','Adjuntá un archivo.'); ok = false; }
    if(file && file.size > 10 * 1024 * 1024){ setError('documento','El archivo supera 10 MB.'); ok = false; }
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!validate()) return;

    submitBtn.disabled = true;
    statusEl.textContent = 'Enviando…';

    try {
      const data = new FormData(form);
      const res = await fetch('/api/enviar', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if(res.ok){
        statusEl.textContent = '¡Listo! Se envió la documentación.';
        form.reset();
      } else {
        statusEl.textContent = json.message || 'No se pudo enviar. Probá de nuevo.';
      }
    } catch (err){
      statusEl.textContent = 'Error de red. Verificá tu conexión.';
    } finally {
      submitBtn.disabled = false;
    }
  });
})();