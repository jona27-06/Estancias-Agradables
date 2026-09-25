const SUPABASE_URL = "https://caodorogvcpupdajtbbp.supabase.co";
const SUPABASE_KEY = "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YxE6";

const clienteSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const ADMIN_ID = "8850f847-f6c3-4736-a8e4-d80e31dabd19";

async function iniciarSesion() {
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("mensajeLogin");

    if (!correo || !contrasena) {
        mensaje.textContent = "Ingrese su correo y contraseña.";
        return;
    }

    mensaje.textContent = "Iniciando sesión...";

    const resultado = await clienteSupabase.auth.signInWithPassword({
        email: correo,
        password: contrasena
    });

    if (resultado.error) {
        console.error(resultado.error);
        mensaje.textContent = "Correo o contraseña incorrectos.";
        return;
    }

    const usuario = resultado.data.user;

    if (usuario.id !== ADMIN_ID) {
        await clienteSupabase.auth.signOut();
        mensaje.textContent =
            "Este usuario no tiene permiso para acceder al panel.";
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";

    cargarAlojamientosAdmin();
}

async function comprobarSesion() {
    const resultado = await clienteSupabase.auth.getUser();

    if (resultado.error || !resultado.data.user) {
        return;
    }

    const usuario = resultado.data.user;

    if (usuario.id !== ADMIN_ID) {
        await clienteSupabase.auth.signOut();
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";

    cargarAlojamientosAdmin();
}

function mostrarFormulario() {
    document.getElementById("formularioAlojamiento").style.display =
        "block";

    document.getElementById("mensajeFormulario").textContent = "";
}

function cancelarFormulario() {
    document.getElementById("formularioAlojamiento").style.display =
        "none";
}

async function cargarAlojamientosAdmin() {
    const contenedor = document.getElementById("listaAdmin");

    contenedor.innerHTML = "<p>Cargando alojamientos...</p>";

    const resultado = await clienteSupabase
        .from("alojamientos")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (resultado.error) {
        console.error(resultado.error);
        contenedor.innerHTML =
            "<p>No se pudieron cargar los alojamientos.</p>";
        return;
    }

    const alojamientos = resultado.data;

    if (!alojamientos || alojamientos.length === 0) {
        contenedor.innerHTML =
            "<p>Aún no hay alojamientos registrados.</p>";
        return;
    }

    contenedor.innerHTML = "";

    alojamientos.forEach(function(alojamiento) {
        const tarjeta = document.createElement("div");

        tarjeta.className = "alojamiento";

        tarjeta.innerHTML = `
            <div class="alojamiento-info">

                <h3>${alojamiento.nombre}</h3>

                <p>${alojamiento.descripcion}</p>

                <p>
                    <strong>
                        Q${Number(alojamiento.precio_base).toFixed(2)}
                    </strong>
                    por noche
                </p>

                <p>
                    Hasta ${alojamiento.max_huespedes} huéspedes
                </p>

                <p>
                    ${alojamiento.habitaciones} habitación(es)
                    ·
                    ${alojamiento.banos} baño(s)
                </p>

                <p>
                    Estado:
                    <strong>
                        ${
                            alojamiento.publicado
                                ? "Publicado"
                                : "Oculto"
                        }
                    </strong>
                </p>

                <hr>

                <h4>Fotos del alojamiento</h4>

                <input
                    type="file"
                    id="fotos-${alojamiento.id}"
                    accept="image/*"
                    multiple
                >

                <br><br>

                <button
                    class="boton-principal"
                    onclick="subirFotos('${alojamiento.id}')"
                >
                    Subir fotos
                </button>

                <p id="mensajeFotos-${alojamiento.id}"></p>

                <div
                    id="galeriaAdmin-${alojamiento.id}"
                    class="galeria-admin"
                >
                    Cargando fotos...
                </div>

            </div>
        `;

        contenedor.appendChild(tarjeta);

        cargarFotosAdmin(alojamiento.id);
    });
}

async function subirFotos(alojamientoId) {
    const input = document.getElementById(
        "fotos-" + alojamientoId
    );

    const mensaje = document.getElementById(
        "mensajeFotos-" + alojamientoId
    );

    if (!input.files || input.files.length === 0) {
        mensaje.textContent = "Seleccione al menos una foto.";
        return;
    }

    mensaje.textContent = "Subiendo fotos...";

    for (const archivo of input.files) {
        const nombreArchivo =
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2, 8) +
            "-" +
            archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_");

        const ruta =
            alojamientoId +
            "/" +
            nombreArchivo;

        const resultado = await clienteSupabase
            .storage
            .from("fotos-alojamientos")
            .upload(ruta, archivo);

        if (resultado.error) {
            console.error(resultado.error);

            mensaje.textContent =
                "Ocurrió un error al subir una de las fotos.";

            return;
        }
    }

    mensaje.textContent =
        "Fotos subidas correctamente.";

    input.value = "";

    cargarFotosAdmin(alojamientoId);
}

async function cargarFotosAdmin(alojamientoId) {
    const contenedor = document.getElementById(
        "galeriaAdmin-" + alojamientoId
    );

    if (!contenedor) {
        return;
    }

    const resultado = await clienteSupabase
        .storage
        .from("fotos-alojamientos")
        .list(alojamientoId, {
            limit: 100,
            sortBy: {
                column: "name",
                order: "asc"
            }
        });

    if (resultado.error) {
        console.error(resultado.error);
        contenedor.innerHTML =
            "<p>No se pudieron cargar las fotos.</p>";
        return;
    }

    const archivos = resultado.data;

    if (!archivos || archivos.length === 0) {
        contenedor.innerHTML =
            "<p>Este alojamiento todavía no tiene fotos.</p>";
        return;
    }

    contenedor.innerHTML = "";

    archivos.forEach(function(archivo) {
        const ruta =
            alojamientoId +
            "/" +
            archivo.name;

        const resultadoUrl = clienteSupabase
            .storage
            .from("fotos-alojamientos")
            .getPublicUrl(ruta);

        const url = resultadoUrl.data.publicUrl;

        const elemento = document.createElement("div");

        elemento.className = "foto-admin";

        elemento.innerHTML = `
            <img
                src="${url}"
                alt="Foto del alojamiento"
            >

            <button
                onclick="eliminarFoto('${alojamientoId}', '${archivo.name.replace(/'/g, "\\'")}')"
            >
                Eliminar
            </button>
        `;

        contenedor.appendChild(elemento);
    });
}

async function eliminarFoto(alojamientoId, nombreArchivo) {
    const confirmar = confirm(
        "¿Está seguro de que desea eliminar esta foto?"
    );

    if (!confirmar) {
        return;
    }

    const ruta =
        alojamientoId +
        "/" +
        nombreArchivo;

    const resultado = await clienteSupabase
        .storage
        .from("fotos-alojamientos")
        .remove([ruta]);

    if (resultado.error) {
        console.error(resultado.error);
        alert("No se pudo eliminar la foto.");
        return;
    }

    cargarFotosAdmin(alojamientoId);
}

async function guardarAlojamiento() {
    const mensaje =
        document.getElementById("mensajeFormulario");

    const nombre =
        document.getElementById("nombreAlojamiento").value.trim();

    const descripcion =
        document.getElementById("descripcionAlojamiento").value.trim();

    const precioBase =
        Number(document.getElementById("precioBase").value);

    const personasIncluidas =
        Number(document.getElementById("personasIncluidas").value);

    const precioPersona =
        Number(document.getElementById("precioPersona").value);

    const maxHuespedes =
        Number(document.getElementById("maxHuespedes").value);

    const habitaciones =
        Number(document.getElementById("habitaciones").value);

    const banos =
        Number(document.getElementById("banos").value);

    const ubicacion =
        document.getElementById("ubicacion").value.trim();

    const publicado =
        document.getElementById("publicado").checked;

    if (
        !nombre ||
        !descripcion ||
        precioBase <= 0 ||
        personasIncluidas <= 0 ||
        maxHuespedes <= 0 ||
        habitaciones <= 0 ||
        banos <= 0
    ) {
        mensaje.textContent =
            "Complete correctamente todos los campos obligatorios.";
        return;
    }

    if (personasIncluidas > maxHuespedes) {
        mensaje.textContent =
            "Las personas incluidas no pueden superar el máximo de huéspedes.";
        return;
    }

    mensaje.textContent = "Guardando alojamiento...";

    const resultado = await clienteSupabase
        .from("alojamientos")
        .insert({
            nombre: nombre,
            descripcion: descripcion,
            precio_base: precioBase,
            precio_persona: precioPersona,
            personas_incluidas: personasIncluidas,
            max_huespedes: maxHuespedes,
            habitaciones: habitaciones,
            banos: banos,
            ubicacion: ubicacion,
            publicado: publicado
        });

    if (resultado.error) {
        console.error(resultado.error);
        mensaje.textContent =
            "No se pudo guardar el alojamiento.";
        return;
    }

    mensaje.textContent =
        "Alojamiento guardado correctamente.";

    document.getElementById("nombreAlojamiento").value = "";
    document.getElementById("descripcionAlojamiento").value = "";
    document.getElementById("precioBase").value = "";
    document.getElementById("personasIncluidas").value = "2";
    document.getElementById("precioPersona").value = "";
    document.getElementById("maxHuespedes").value = "";
    document.getElementById("habitaciones").value = "1";
    document.getElementById("banos").value = "1";
    document.getElementById("ubicacion").value = "";
    document.getElementById("publicado").checked = false;

    cargarAlojamientosAdmin();
}

comprobarSesion();