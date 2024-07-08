const URL = "http://127.0.0.1:5000/comentarios";

// Obtener el ID del comentario de la URL
const urlParams = new URLSearchParams(window.location.search);
const comentarioId = urlParams.get('id');

// Función para cargar los datos del comentario
async function cargarComentarioParaModificar() {
  try {
    const response = await fetch(`${URL}/${comentarioId}`);
    if (!response.ok) {
      throw new Error("Error al cargar el comentario");
    }
    const comentario = await response.json();

    // Llenar el formulario con los datos del comentario
    document.getElementById('modificar-nombre').value = comentario.nombre;
    document.getElementById('modificar-apellido').value = comentario.apellido;
    document.getElementById('modificar-mail').value = comentario.mail;
    document.getElementById('modificar-telefono').value = comentario.telefono;
    document.getElementById('modificar-comentario').value = comentario.comentario;
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al cargar el comentario");
  }
}

// Llamar a la función para cargar el comentario al cargar la página
cargarComentarioParaModificar();

function guardarModificacion() {
  const nombre = document.getElementById('modificar-nombre').value;
  const apellido = document.getElementById('modificar-apellido').value;
  const mail = document.getElementById('modificar-mail').value;
  const telefono = document.getElementById('modificar-telefono').value;
  const comentario = document.getElementById('modificar-comentario').value;

  if (!nombre || !apellido || !mail || !telefono || !comentario) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('apellido', apellido);
  formData.append('mail', mail);
  formData.append('telefono', telefono);
  formData.append('comentario', comentario);

  // Enviar solicitud PUT para guardar las modificaciones
  enviarModificacion(formData);
}

async function enviarModificacion(formData) {
  try {
    const response = await fetch(`${URL}/${comentarioId}`, {
      method: "PUT",
      body: formData
    });
    if (!response.ok) {
      throw new Error("Error al modificar comentario");
    }
    alert("Comentario modificado con éxito");
    // Redirigir a la página de reseñas u otra página deseada
    window.location.href = "Reseñas.html";
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al modificar el comentario");
  }
}

function ocultarFormulario() {
  // Redirigir a la página de reseñas u otra página deseada sin realizar acciones adicionales
  window.location.href = "Reseñas.html";
}
