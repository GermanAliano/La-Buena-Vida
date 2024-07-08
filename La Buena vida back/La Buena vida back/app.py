from flask import Flask, request, jsonify, render_template
from flask import request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Esto habilitará CORS para todas las rutas

class Comentarios:
        def __init__(self, host, user, password, port):
                self.conn = mysql.connector.connect(
                        host=host,
                        port=port,
                        user=user,
                        password=password,
                )
                print(self.conn)

                self.cursor=self.conn.cursor()
                try:
                        self.cursor.execute (f"USE registro")
                except mysql.connector.Error as err:
                        if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                                self.cursor.execute(f"CREATE DATABASE registro")
                                self.conn.database = "registro"
                        else:
                                raise err                


                self.cursor.execute('''CREATE TABLE IF NOT EXISTS comentario (
                        codigo INT AUTO_INCREMENT PRIMARY KEY,
                        nombre VARCHAR(50) NOT NULL,
                        apellido VARCHAR(25) NOT NULL,
                        mail VARCHAR(50) NOT NULL,
                        telefono INT(10),
                        comentario VARCHAR(300))''')
                self.conn.commit()
                
# Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True #
                self.cursor.close()
                self.cursor = self.conn.cursor(dictionary=True)

# Agregar un comentario #
        def agregar_comentario(self, nombre, apellido, mail, telefono, comentario):
                
                sql = "INSERT INTO comentario (nombre, apellido, mail, telefono, comentario) VALUES (%s, %s, %s, %s, %s)"
                valores = (nombre, apellido, mail, telefono, comentario)

                self.cursor.execute(sql, valores)        
                self.conn.commit()
                return self.cursor.lastrowid

# Listar comentarios #
        def listar_comentarios(self):
                self.cursor.execute("SELECT * FROM comentario")
                return self.cursor.fetchall()

# Consultar comentario #
        def consultar_comentario(self, codigo):
                self.cursor.execute(f"SELECT * FROM comentario WHERE codigo={codigo}")
                return self.cursor.fetchone()

# Modificar comentario #
        def modificar_comentario(self, codigo, nuevo_nombre, nuevo_apellido, nuevo_mail, nuevo_telefono, nuevo_comentario):      
                sql = "UPDATE comentario SET nombre= %s, apellido= %s, mail= %s, telefono= %s, comentario= %s WHERE codigo= %s"
                valores = (nuevo_nombre, nuevo_apellido, nuevo_mail, nuevo_telefono, nuevo_comentario, codigo)
                self.cursor.execute(sql, valores)
                self.conn.commit()
                return self.cursor.rowcount > 0

# Eliminar comentario #
        def eliminar_comentario(self, codigo):
                self.cursor.execute(f"DELETE FROM comentario WHERE codigo = {codigo}")
                self.conn.commit()
                return self.cursor.rowcount > 0
        # FALTARIA UN MENSAJE QUE EL COMENTARIO FUE ELIMINADO CON EXITO

#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------

# Crear una instancia de la clase Comentarios
comentar=Comentarios(host='', port='', user='', password='')

@app.route('/')
def home():
    return 'Bienvenido a la API de Comentarios'

#--------------------------------------------------------------------
# Listar comentarios - INICIO
#--------------------------------------------------------------------
@app.route("/comentarios", methods=["GET"])
def listar_comentarios():
    comentarios = comentar.listar_comentarios()
    return jsonify(comentarios)

#--------------------------------------------------------------------
# Agregar comentario - INICIO
#--------------------------------------------------------------------
@app.route("/comentarios", methods=["POST", "OPTIONS"])
def agregar_comentario():
    if request.method == "OPTIONS":
        return 'preflight ok', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    try:
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        mail = request.form['mail']
        telefono = request.form['telefono']
        comentario = request.form['comentario']
        agrega_comentario = comentar.agregar_comentario(nombre, apellido, mail, telefono, comentario)
        if agrega_comentario:
            return jsonify({"mensaje": "Comentario agregado correctamente.", "codigo": agrega_comentario}), 201, {
                'Access-Control-Allow-Origin': '*'
            }
        else:
            return jsonify({"mensaje": "Error al agregar comentario."}), 500, {
                'Access-Control-Allow-Origin': '*'
            }
    except Exception as e:
        print(e)
        return jsonify({"mensaje": "Error interno del servidor."}), 500, {
            'Access-Control-Allow-Origin': '*'
        }

#--------------------------------------------------------------------
# Modificar comentario - INICIO
#--------------------------------------------------------------------

@app.route("/comentarios/<int:codigo>", methods=["GET", "PUT"])
def modificar_o_obtener_comentario(codigo):
    if request.method == "GET":
        comentario = comentar.consultar_comentario(codigo)
        if comentario:
            return jsonify(comentario), 200
        else:
            return jsonify({"mensaje": "Comentario no encontrado"}), 404

    elif request.method == "PUT":
        try:
            nuevo_nombre = request.form.get("nombre")
            nuevo_apellido = request.form.get("apellido")
            nuevo_mail = request.form.get("mail")
            nuevo_telefono = request.form.get("telefono")
            nuevo_comentario = request.form.get("comentario")

            modifica_comentario = comentar.modificar_comentario(codigo, nuevo_nombre, nuevo_apellido, nuevo_mail, nuevo_telefono, nuevo_comentario)
            if modifica_comentario:
                return jsonify({"mensaje": "Comentario modificado"}), 200
            else:
                return jsonify({"mensaje": "Comentario no encontrado"}), 404

        except Exception as e:
            print(e)
            return jsonify({"mensaje": "Error interno del servidor."}), 500


#--------------------------------------------------------------------
# Eliminar comentario - INICIO
#--------------------------------------------------------------------

@app.route("/comentarios/<int:codigo>", methods=["DELETE"])
def eliminar_comentario(codigo):
       comentario = comentar.consultar_comentario(codigo)
       if comentario:
                if comentar.eliminar_comentario(codigo):
                     return jsonify({"mensaje": "Comentario eliminado"}), 200
                else:
                     return jsonify({"mensaje": "Error al eliminar el comentario"}), 500
       else:
              return jsonify({"mensaje": "Comentario no encontrado"}), 404
       
#--------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
    