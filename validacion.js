function validarEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

function validacion() {
  let error = document.getElementById("error");
  let email = document.formulario.email.value;
  let nombre = document.formulario.name.value;
  let apellido = document.formulario.apellido.value;
  let telefono = document.formulario.telefono.value;
  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  let pasajeros = document.getElementById("Pasajeros").value;
  let fechaInicio = document.getElementById("Comienzo").value;
  let fechaFinalizacion = document.getElementById("finalizacion").value;
  let comentarios = document.getElementById("Comentarios adicionales").value;

  if (nombre.trim() === "" || apellido.trim() === "" || telefono.trim() === "" || email.trim() === "" || pasajeros === "0" || fechaInicio === "" || fechaFinalizacion === "" || comentarios.trim() === "" || checkboxes.length === 0) {
    error.innerHTML = "Por favor completa todos los campos del formulario";
    return;
  }

  if (nombre.length > 20) {
    document.formulario.name.focus();
    error.innerHTML = "Máximo 20 caracteres para el nombre";
    return;
  }
  if (apellido.length > 15) {
    document.formulario.apellido.focus();
    error.innerHTML = "Máximo 15 caracteres para el apellido";
    return;
  }
  if (telefono.length > 10) {
    document.formulario.telefono.focus();
    error.innerHTML = "Máximo 10 números para el teléfono";
    return;
  }
  if (!validarEmail(email)) {
    error.innerHTML = "Por favor, introduce un correo electrónico válido";
    return;
  }

  error.innerHTML = "Gracias por completar el formulario";
  document.formulario.submit();
}
