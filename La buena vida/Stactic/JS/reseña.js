const URL = "http://127.0.0.1:5000/comentarios";

async function fetchComentarios() {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Error al cargar reseñas");
    }
    const data = await response.json();
    mostrarComentarios(data);
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

function mostrarComentarios(data) {
  const reseñasContainer = document.getElementById("reseñas");
  reseñasContainer.innerHTML = "";
  data.forEach(comentario => {
    const reseñaDiv = document.createElement("div");
    reseñaDiv.classList.add("formulariocontacto");

    const nombre = document.createElement("h3");
    nombre.textContent = `${comentario.nombre} ${comentario.apellido}`;
    reseñaDiv.appendChild(nombre);

    const opinion = document.createElement("p");
    opinion.textContent = comentario.comentario;
    reseñaDiv.appendChild(opinion);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => {
      eliminarComentario(comentario.codigo);
    });
    reseñaDiv.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Modificar";
    editButton.addEventListener("click", () => {
      window.location.href = `Modificar.html?id=${comentario.codigo}`;
    });
    reseñaDiv.appendChild(editButton);

    reseñasContainer.appendChild(reseñaDiv);
  });
}

async function eliminarComentario(codigo) {
  try {
    const response = await fetch(`${URL}/${codigo}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Error al eliminar comentario");
    }
    alert("Comentario eliminado con éxito");
    fetchComentarios();
  } catch (error) {
    console.error("Ocurrió un error al eliminar el comentario:", error);
    alert("Ocurrió un error al eliminar el comentario");
  }
}

fetchComentarios();
