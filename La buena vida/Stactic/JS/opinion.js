const URL = "http://127.0.0.1:5000/comentarios"

document.getElementById("opinion").addEventListener("submit", function(event){
    event.preventDefault()

    const formData = new FormData(document.getElementById("opinion"));


fetch(URL, {
    method: "POST",
    body: formData,
    headers: {
        'Accept': 'application/json'
    }
}) 
.then(function(response){
    if(response.ok){
        return response.json
    }else{
        throw new Error ("Ocurrió un error al crear el comentario" + console.error(Error));
    }
})
.then(function(data){
    alert("Comentario creado con éxito")
})
.catch(function(error) {
    alert("Ocurrió un error al crear el comentario: " + error.message)
})
.finally(function(){
    document.getElementById('nombre').value = ""
    document.getElementById('apellido').value = ""
    document.getElementById('telefono').value = ""
    document.getElementById('mail').value = ""
    document.getElementById('comentario').value = ""
})
})