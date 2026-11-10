// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://caodorogvcpupdajtbbp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YxE6";

const clienteSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ============================================================
// ADMINISTRADOR
// ============================================================

const ADMIN_ID =
    "8850f847-f6c3-4736-a8e4-d80e31dabd19";


// ============================================================
// FOTOGRAFÍAS
// ============================================================

const fotosSeleccionadas = {};


// ============================================================
// ALOJAMIENTO EN EDICIÓN
// ============================================================

let alojamientoEditandoId = null;


// ============================================================
// INICIAR SESIÓN
// ============================================================

async function iniciarSesion() {

    const correo =
        document.getElementById("correo").value.trim();

    const contrasena =
        document.getElementById("contrasena").value;

    const mensaje =
        document.getElementById("mensajeLogin");


    if (!correo || !contrasena) {

        mensaje.textContent =
            "Ingrese su correo y contraseña.";

        return;
    }


    mensaje.textContent =
        "Iniciando sesión...";


    try {

        const resultado =
            await clienteSupabase.auth.signInWithPassword({

                email: correo,
                password: contrasena

            });


        if (resultado.error) {

            console.error(resultado.error);

            mensaje.textContent =
                "Correo o contraseña incorrectos.";

            return;
        }


        const usuario =
            resultado.data.user;


        if (
            !usuario ||
            usuario.id !== ADMIN_ID
        ) {

            await clienteSupabase.auth.signOut();

            mensaje.textContent =
                "Este usuario no tiene permiso para acceder al panel.";

            return;
        }


        mensaje.textContent = "";

        mostrarPanel();


    } catch (error) {

        console.error(
            "Error al iniciar sesión:",
            error
        );

        mensaje.textContent =
            "Ocurrió un error al iniciar sesión.";

    }

}


// ============================================================
// COMPROBAR SESIÓN
// ============================================================

async function comprobarSesion() {

    try {

        const resultado =
            await clienteSupabase.auth.getUser();


        if (
            resultado.error ||
            !resultado.data.user
        ) {

            return;
        }


        const usuario =
            resultado.data.user;


        if (
            usuario.id !== ADMIN_ID
        ) {

            await clienteSupabase.auth.signOut();

            return;
        }


        mostrarPanel();


    } catch (error) {

        console.error(
            "Error comprobando sesión:",
            error
        );

    }

}


// ============================================================
// MOSTRAR PANEL
// ============================================================

function mostrarPanel() {

    const login =
        document.getElementById("login");

    const panel =
        document.getElementById("panel");


    if (login) {

        login.style.display = "none";

    }


    if (panel) {

        panel.style.display = "block";

    }


    cargarAlojamientosAdmin();

}


// ============================================================
// MOSTRAR FORMULARIO NUEVO
// ============================================================

function mostrarFormulario() {

    renderizarCaracteristicasPrincipales(
    "caracteristicasPrincipalesNueva",
    "caracteristica-principal-nueva"
);

    cancelarEdicion();


    const formulario =
        document.getElementById(
            "formularioAlojamiento"
        );


    if (!formulario) {

        console.error(
            "No existe #formularioAlojamiento"
        );

        return;
    }


    formulario.style.display = "block";

    iniciarPasosAdmin(formulario);

    limpiarFormulario();

    iniciarPasosAdmin(formulario);

    formulario.scrollIntoView({

        behavior: "smooth",
        block: "start"

    });

}


// ============================================================
// CANCELAR FORMULARIO NUEVO
// ============================================================

function cancelarFormulario() {

    const formulario =
        document.getElementById(
            "formularioAlojamiento"
        );


    if (formulario) {

        formulario.style.display = "none";

    }


    const mensaje =
        document.getElementById(
            "mensajeFormulario"
        );


    if (mensaje) {

        mensaje.textContent = "";

    }

}


// ============================================================
// CARGAR ALOJAMIENTOS
// ============================================================

function mostrarOrdenCatalogo(alojamientos, contenedor) {
    document.getElementById("ordenCatalogo")?.remove();

    if (alojamientos.length < 2) return;

    const panel = document.createElement("details");
    panel.id = "ordenCatalogo";
    panel.style.marginBottom = "16px";

    panel.innerHTML = `
        <summary style="cursor: pointer; font-weight: 600;">
            Ordenar anuncios
        </summary>
        <p>Arrastra desde ⠿ o usa las flechas para mover un anuncio.</p>
        <ol style="list-style: none; padding: 0;"></ol>
        <button type="button" class="boton boton-principal" disabled>
            Guardar orden
        </button>
        <p role="status"></p>
    `;

    const lista = panel.querySelector("ol");
    const guardar = panel.querySelector("button");
    const mensaje = panel.querySelector('[role="status"]');

    const obtenerIds = () =>
        Array.from(lista.children, fila => fila.dataset.id);

    let ordenGuardado = alojamientos.map(alojamiento => String(alojamiento.id));
    let filaArrastrada = null;

    function actualizarControles() {
        const filas = Array.from(lista.children);

        filas.forEach((fila, indice) => {
            fila.querySelector("[data-subir]").disabled = indice === 0;
            fila.querySelector("[data-bajar]").disabled = indice === filas.length - 1;
        });

        const hayCambios = obtenerIds().some(
            (id, indice) => id !== ordenGuardado[indice]
        );

        guardar.disabled = !hayCambios;
        mensaje.textContent = hayCambios ? "Hay cambios sin guardar." : "";
    }

    for (const alojamiento of alojamientos) {
        const fila = document.createElement("li");
        fila.dataset.id = String(alojamiento.id);

        fila.style.cssText = `
            display: flex; align-items: center; gap: 10px;
            padding: 8px; border-bottom: 1px solid #dce8e6;
        `;

        fila.innerHTML = `
            <span draggable="true" title="Arrastrar" aria-hidden="true"
                  style="cursor: grab; font-size: 22px;">⠿</span>
            <span data-nombre style="flex: 1;"></span>
            <button type="button" data-subir>↑</button>
            <button type="button" data-bajar>↓</button>
        `;

        fila.querySelector("[data-nombre]").textContent = alojamiento.nombre;

        const agarrador = fila.querySelector("[draggable]");
        const subir = fila.querySelector("[data-subir]");
        const bajar = fila.querySelector("[data-bajar]");

        subir.setAttribute("aria-label", "Subir " + alojamiento.nombre);
        bajar.setAttribute("aria-label", "Bajar " + alojamiento.nombre);

        agarrador.ondragstart = evento => {
            filaArrastrada = fila;
            evento.dataTransfer.effectAllowed = "move";
            evento.dataTransfer.setData("text/plain", fila.dataset.id);
        };

        agarrador.ondragend = () => {
            filaArrastrada = null;
        };

        fila.ondragover = evento => {
            if (filaArrastrada) evento.preventDefault();
        };

        fila.ondrop = evento => {
            if (!filaArrastrada) return;
            evento.preventDefault();

            if (filaArrastrada === fila) return;

            const limite = fila.getBoundingClientRect();

            if (evento.clientY < limite.top + limite.height / 2) {
                fila.before(filaArrastrada);
            } else {
                fila.after(filaArrastrada);
            }

            filaArrastrada = null;
            actualizarControles();
        };

        subir.onclick = () => {
            fila.previousElementSibling?.before(fila);
            actualizarControles();
            (subir.disabled ? bajar : subir).focus();
        };

        bajar.onclick = () => {
            fila.nextElementSibling?.after(fila);
            actualizarControles();
            (bajar.disabled ? subir : bajar).focus();
        };

        lista.appendChild(fila);
    }

    guardar.onclick = async () => {
        const ids = obtenerIds();
        guardar.disabled = true;
        lista.inert = true;
        mensaje.textContent = "Guardando orden…";

        try {
            const { error } = await clienteSupabase.rpc(
                "guardar_orden_catalogo",
                { ids }
            );

            if (error) throw error;

            ordenGuardado = ids;

            const tarjetasPorId = new Map(
                Array.from(contenedor.children, tarjeta => [
                    tarjeta.dataset.ordenId,
                    tarjeta
                ])
            );

            for (const id of ids) {
                const tarjeta = tarjetasPorId.get(id);
                if (tarjeta) contenedor.appendChild(tarjeta);
            }

            actualizarControles();
            mensaje.textContent = "Orden guardado. Recarga la página pública para verlo.";
        } catch (error) {
            actualizarControles();
            mensaje.textContent = "No se pudo guardar el orden. " + error.message;
        } finally {
            lista.inert = false;
        }
    };

    actualizarControles();
    contenedor.before(panel);
}

async function cargarAlojamientosAdmin() {

    const contenedor =
        document.getElementById(
            "listaAdmin"
        );


    if (!contenedor) {

        return;
    }


    contenedor.innerHTML = `
        <div class="cargando">
            Cargando alojamientos...
        </div>
    `;


    try {

        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (resultado.error) {

            console.error(
                resultado.error
            );


            contenedor.innerHTML = `
                <div class="cargando">
                    No se pudieron cargar los alojamientos.
                </div>
            `;

            return;
        }


        const alojamientos =
            resultado.data;


        if (
            !alojamientos ||
            alojamientos.length === 0
        ) {

            contenedor.innerHTML = `
                <div class="cargando">
                    Aún no hay alojamientos registrados.
                </div>
            `;

            return;
        }


        contenedor.innerHTML = "";


        alojamientos.forEach(
            function(alojamiento) {

                const tarjeta =
                    document.createElement("article");


                tarjeta.className =
                    "alojamiento-admin";


                const estadoClase =
                    alojamiento.publicado
                        ? "estado-publicado"
                        : "estado-oculto";


                const estadoTexto =
                    alojamiento.publicado
                        ? "Publicado"
                        : "Oculto";


                tarjeta.innerHTML = `

                    <div class="alojamiento-cabecera">

                        <div class="alojamiento-titulo">

                            <h3>
                                ${escaparHTML(
                                    alojamiento.nombre
                                )}
                            </h3>

                            <p>
                                ${escaparHTML(
                                    alojamiento.ubicacion ||
                                    "Ubicación no especificada"
                                )}
                            </p>

                        </div>

                        <span class="estado ${estadoClase}">
                            ${estadoTexto}
                        </span>

                    </div>


                    <div class="alojamiento-datos">

                        <span class="dato precio-admin">

                            Q${Number(
                                alojamiento.precio_base || 0
                            ).toFixed(2)}

                            <small>
                                / noche
                            </small>

                        </span>


                        <span class="dato">

                            👥

                            <strong>
                                ${alojamiento.max_huespedes || 0}
                            </strong>

                            huéspedes

                        </span>


                        <span class="dato">

                            🛏

                            <strong>
                                ${alojamiento.habitaciones || 0}
                            </strong>

                            habitación(es)

                        </span>


                        <span class="dato">

                            🚿

                            <strong>
                                ${alojamiento.banos || 0}
                            </strong>

                            baño(s)

                        </span>

                    </div>


                    <div class="acciones-alojamiento">

                        <button
                            type="button"
                            class="boton boton-editar"
                            data-id="${alojamiento.id}"
                        >
                            ✏️ Editar
                        </button>


                        <button
                            type="button"
                            class="boton boton-publicar"
                            data-id="${alojamiento.id}"
                        >
                            ${alojamiento.publicado
                                ? "👁️ Ocultar"
                                : "👁️ Publicar"}
                        </button>

                    </div>


                    <div class="fotos-seccion">

                        <h4>
                            Fotografías
                        </h4>


                        <div
                            id="galeriaAdmin-${alojamiento.id}"
                            class="galeria-admin"
                        >
                            Cargando fotos...
                        </div>


                        <div class="subir-fotos">

                            <div class="selector-fotos">

                                <label
                                    class="boton-seleccionar"
                                    for="fotos-${alojamiento.id}"
                                >
                                    📷 Seleccionar fotografías
                                </label>


                                <input
                                    class="input-fotos"
                                    type="file"
                                    id="fotos-${alojamiento.id}"
                                    accept="image/*"
                                    multiple
                                >


                                <span
                                    id="contadorFotos-${alojamiento.id}"
                                    class="contador-seleccion"
                                >
                                    Ninguna fotografía seleccionada
                                </span>

                            </div>


                            <div
                                id="previsualizacion-${alojamiento.id}"
                                class="previsualizacion-fotos"
                            ></div>


                            <button
                                id="botonSubir-${alojamiento.id}"
                                class="boton boton-principal boton-subir-fotos"
                                style="display: none;"
                                type="button"
                            >
                                Subir fotografías
                            </button>


                            <p
                                id="mensajeFotos-${alojamiento.id}"
                                class="mensaje"
                            ></p>

                        </div>

                    </div>

                `;


                const galeria = tarjeta.querySelector(".fotos-seccion");
const listaFotos = tarjeta.querySelector(".galeria-admin");

const portada = document.createElement("div");
portada.className = "ea-portada";
portada.textContent = "Sin fotografía";
tarjeta.prepend(portada);

const desplegableFotos = document.createElement("details");
desplegableFotos.className = "ea-fotos";

const tituloFotos = document.createElement("summary");
tituloFotos.textContent = "Fotografías";

galeria.before(desplegableFotos);
desplegableFotos.append(tituloFotos, galeria);

function actualizarPortadaAdmin() {
    const primeraFoto = listaFotos.querySelector("img");

    if (!primeraFoto) {
        portada.textContent = "Sin fotografía";
        return;
    }

    const url = primeraFoto.getAttribute("src");
    if (portada.querySelector("img")?.getAttribute("src") === url) return;

    const imagen = document.createElement("img");
    imagen.src = url;
    imagen.alt = "";
    imagen.loading = "lazy";
    portada.replaceChildren(imagen);
}

new MutationObserver(actualizarPortadaAdmin).observe(listaFotos, {
    childList: true,
    subtree: true
});

actualizarPortadaAdmin();

                contenedor.appendChild(tarjeta);


                const botonEditar =
                    tarjeta.querySelector(
                        ".boton-editar"
                    );


                botonEditar.addEventListener(
                    "click",
                    function() {

                        editarAlojamiento(
                            alojamiento.id
                        );

                    }
                );


                const botonPublicar =
                    tarjeta.querySelector(
                        ".boton-publicar"
                    );


                botonPublicar.addEventListener(
                    "click",
                    function() {

                        cambiarEstadoAlojamiento(
                            alojamiento.id,
                            !alojamiento.publicado
                        );

                    }
                );


                const inputFotos =
                    document.getElementById(
                        "fotos-" +
                        alojamiento.id
                    );


                if (inputFotos) {

                    inputFotos.addEventListener(
                        "change",
                        function() {

                            seleccionarFotos(
                                alojamiento.id
                            );

                        }
                    );

                }


                const botonSubir =
                    document.getElementById(
                        "botonSubir-" +
                        alojamiento.id
                    );


                if (botonSubir) {

                    botonSubir.addEventListener(
                        "click",
                        function() {

                            subirFotos(
                                alojamiento.id
                            );

                        }
                    );

                }


                fotosSeleccionadas[
                    alojamiento.id
                ] = [];


                cargarFotosAdmin(
                    alojamiento.id
                );

            }
        );


    } catch (error) {

        console.error(
            "Error cargando alojamientos:",
            error
        );


        contenedor.innerHTML = `
            <div class="cargando">
                Ocurrió un error al cargar los alojamientos.
            </div>
        `;

    }

}


// ============================================================
// PUBLICAR / OCULTAR
// ============================================================

async function cambiarEstadoAlojamiento(
    alojamientoId,
    nuevoEstado
) {

    const confirmar =
        confirm(
            nuevoEstado
                ? "¿Desea publicar este alojamiento?"
                : "¿Desea ocultar este alojamiento?"
        );


    if (!confirmar) {

        return;
    }


    try {

        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .update({
                    publicado: nuevoEstado
                })
                .eq(
                    "id",
                    alojamientoId
                );


        if (resultado.error) {

            console.error(
                resultado.error
            );


            alert(
                "No se pudo cambiar el estado del alojamiento."
            );

            return;
        }


        await cargarAlojamientosAdmin();


    } catch (error) {

        console.error(error);

        alert(
            "Ocurrió un error."
        );

    }

}


// ============================================================
// OBTENER AMENIDADES
// ============================================================

// ============================================================
// CATÁLOGO Y SELECCIÓN DE AMENIDADES
// ============================================================

const CATALOGO_AMENIDADES_EA = [
    ["WiFi", "internet"],
    ["Smart TV", "entretenimiento"],
    ["Televisión por cable", "entretenimiento"],
    ["Área de trabajo", "trabajo"],
    ["Juegos de mesa", "entretenimiento"],
    ["Aire acondicionado", "climatizacion"],
    ["Ventilador de techo", "climatizacion"],
    ["Ventilador portátil", "climatizacion"],
    ["Área de estar", "exterior"],
    ["Sofá cama", "habitacion"],
    ["Cortinas opacas", "habitacion"],
    ["Ropa de cama", "habitacion"],
    ["Espacio para guardar ropa", "habitacion"],
    ["Almohadas adicionales", "habitacion"],
    ["Cocina equipada", "cocina"],
    ["Refrigeradora", "cocina"],
    ["Estufa", "cocina"],
    ["Horno", "cocina"],
    ["Microondas", "cocina"],
    ["Cafetera", "cocina"],
    ["Licuadora", "cocina"],
    ["Vajilla y cubiertos", "cocina"],
    ["Ollas y sartenes", "cocina"],
    ["Mesa de comedor", "cocina"],
    ["Dispensador de agua potable", "cocina"],
    ["Agua caliente", "bano"],
    ["Baño privado", "bano"],
    ["Toallas de baño", "bano"],
    ["Artículos de aseo", "bano"],
    ["Secadora de cabello", "bano"],
    ["Lavadora", "habitacion"],
    ["Secadora de ropa", "habitacion"],
    ["Plancha para ropa", "habitacion"],
    ["Piscina privada", "piscina"],
    ["Piscina compartida", "piscina"],
    ["Patio o terraza", "exterior"],
    ["Balcón", "exterior"],
    ["Jardín", "exterior"],
    ["Parrilla", "exterior"],
    ["Comedor al aire libre", "exterior"],
    ["Vista al mar", "exterior"],
    ["Estacionamiento en la propiedad", "estacionamiento"],
    ["Estacionamiento techado", "estacionamiento"],
    ["Entrada privada", "seguridad"],
    ["Llegada autónoma", "seguridad"],
    ["Acceso sin gradas", "servicios"],
    ["Ascensor", "servicios"],
    ["Cámaras de seguridad exteriores", "seguridad"],
    ["Botiquín de primeros auxilios", "seguridad"],
    ["Se admiten mascotas", "mascotas"]
];

const AMENIDADES_DESTACADAS_EA = "_destacadas";
const editoresAmenidadesEA = new Map();

function claveAmenidadEA(nombre) {
    return nombre.trim().toLowerCase().normalize("NFC");
}

function leerAmenidadesEA(datos) {
    if (typeof datos === "string") {
        try {
            datos = JSON.parse(datos);
        } catch {
            datos = null;
        }
    }

    const grupos = Array.isArray(datos) ? { servicios: datos } : datos;
    const servicios = new Map();

    for (const [grupo, valores] of Object.entries(grupos || {})) {
        if (grupo === AMENIDADES_DESTACADAS_EA || !Array.isArray(valores)) {
            continue;
        }

        for (const valor of valores) {
            if (typeof valor !== "string" || !valor.trim()) continue;

            const nombre = valor.trim();
            const clave = claveAmenidadEA(nombre);
            const existente = servicios.get(clave);

            if (existente) {
                existente.grupos.add(grupo);
            } else {
                servicios.set(clave, { nombre, grupos: new Set([grupo]) });
            }
        }
    }

    const guardadas = grupos?.[AMENIDADES_DESTACADAS_EA];
    const destacadas = Array.isArray(guardadas)
        ? [...new Set(guardadas
            .filter(nombre => typeof nombre === "string")
            .map(claveAmenidadEA))]
            .filter(clave => servicios.has(clave))
            .slice(0, 10)
        : [];

    return { servicios, destacadas };
}

function colocarAmenidades(datos, selector) {
    const clase = selector.slice(1);
    const editor = document.querySelector(
        `[data-amenidades-editor="${clase}"]`
    );

    if (!editor) return;

    const { servicios, destacadas } = leerAmenidadesEA(datos);
    const opciones = new Map(CATALOGO_AMENIDADES_EA.map(([nombre, grupo]) => [
        claveAmenidadEA(nombre),
        { nombre, grupos: new Set([grupo]) }
    ]));

    for (const [clave, servicio] of servicios) {
        opciones.set(clave, servicio);
    }

    const activas = new Set(servicios.keys());
    const elegidas = new Set(destacadas);
    const filas = new Map();

    const contador = document.createElement("p");
    contador.setAttribute("aria-live", "polite");

    const lista = document.createElement("div");
    lista.className = "ea-editor-amenidades";

    function sincronizar() {
        contador.textContent = `${elegidas.size} de 10 destacadas`;

        for (const [clave, { incluir, destacar }] of filas) {
            incluir.checked = activas.has(clave);
            destacar.checked = elegidas.has(clave);
            destacar.disabled = !activas.has(clave) ||
                (elegidas.size >= 10 && !elegidas.has(clave));
        }
    }

    for (const [clave, servicio] of opciones) {
        const fila = document.createElement("div");
        fila.className = "ea-editor-amenidades-fila";

        const etiqueta = document.createElement("label");
        const incluir = document.createElement("input");
        incluir.type = "checkbox";
        incluir.className = clase;
        etiqueta.append(incluir, servicio.nombre);

        const etiquetaDestacada = document.createElement("label");
        const destacar = document.createElement("input");
        destacar.type = "checkbox";
        destacar.setAttribute("aria-label", "Destacar " + servicio.nombre);
        etiquetaDestacada.append(destacar, "Destacar");

        incluir.addEventListener("change", function() {
            if (incluir.checked) {
                activas.add(clave);
            } else {
                activas.delete(clave);
                elegidas.delete(clave);
            }

            sincronizar();
        });

        destacar.addEventListener("change", function() {
            if (destacar.checked && activas.has(clave) && elegidas.size < 10) {
                elegidas.add(clave);
            } else if (!destacar.checked) {
                elegidas.delete(clave);
            }

            sincronizar();
        });

        fila.append(etiqueta, etiquetaDestacada);
        lista.appendChild(fila);
        filas.set(clave, { incluir, destacar });
    }

    editor.replaceChildren(contador, lista);
    editoresAmenidadesEA.set(selector, { opciones, activas, elegidas });
    sincronizar();
}

function obtenerAmenidades(selector) {
    const editor = editoresAmenidadesEA.get(selector);

    if (!editor) {
        throw new Error("No se encontró el selector de amenidades.");
    }

    const amenidades = Object.create(null);

    for (const clave of editor.activas) {
        const servicio = editor.opciones.get(clave);

        for (const grupo of servicio.grupos) {
            (amenidades[grupo] ??= []).push(servicio.nombre);
        }
    }

    amenidades[AMENIDADES_DESTACADAS_EA] = [...editor.elegidas]
        .filter(clave => editor.activas.has(clave))
        .slice(0, 10)
        .map(clave => editor.opciones.get(clave).nombre);

    return amenidades;
}


const CATALOGO_CARACTERISTICAS_PRINCIPALES = [

    // CAPACIDAD Y DISTRIBUCIÓN
    { id: "huespedes", nombre: "Capacidad de huéspedes", icono: "👥" },
    { id: "habitaciones", nombre: "Habitaciones", icono: "🛏️" },
    { id: "camas", nombre: "Camas", icono: "🛌" },
    { id: "banos", nombre: "Baños", icono: "🚿" },
    { id: "alojamiento_entero", nombre: "Alojamiento entero", icono: "🏠" },
    { id: "habitacion_privada", nombre: "Habitación privada", icono: "🚪" },

    // COMODIDADES
    { id: "aire_acondicionado", nombre: "Aire acondicionado", icono: "❄️" },
    { id: "wifi", nombre: "Wi-Fi", icono: "📶" },
    { id: "cocina_equipada", nombre: "Cocina equipada", icono: "🍳" },
    { id: "television", nombre: "Televisión", icono: "📺" },
    { id: "lavadora", nombre: "Lavadora", icono: "🧺" },
    { id: "espacio_trabajo", nombre: "Espacio para trabajar", icono: "💻" },

    // INSTALACIONES Y EXTERIORES
    { id: "piscina_privada", nombre: "Piscina privada", icono: "🏊" },
    { id: "piscina_compartida", nombre: "Piscina compartida", icono: "🏊" },
    { id: "estacionamiento", nombre: "Estacionamiento gratuito", icono: "🚗" },
    { id: "jardin", nombre: "Jardín", icono: "🌳" },
    { id: "terraza", nombre: "Terraza", icono: "☀️" },
    { id: "vista_mar", nombre: "Vista al mar", icono: "🌊" },

    // ACCESO Y CONDICIONES
    { id: "mascotas", nombre: "Mascotas permitidas", icono: "🐾" },
    { id: "entrada_autonoma", nombre: "Entrada autónoma", icono: "🔑" },
    { id: "seguridad", nombre: "Seguridad", icono: "🛡️" },
    { id: "acceso_sin_gradas", nombre: "Acceso sin gradas", icono: "♿" },
    { id: "familias", nombre: "Ideal para familias", icono: "👨‍👩‍👧‍👦" },
    { id: "estancias_largas", nombre: "Estancias largas", icono: "📅" }

];


    function obtenerCaracteristicasPrincipales(selector) {
        return Array.from(
            document.querySelectorAll(selector + ":checked")
        ).map(function(elemento) {
            return elemento.value;
        });
    }


function colocarCaracteristicasPrincipales(
    valores,
    selector
) {

    const seleccionadas =
        Array.isArray(valores) ? valores : [];

    const casillas =
        document.querySelectorAll(selector);

    casillas.forEach(function(elemento) {
        elemento.checked =
            seleccionadas.includes(elemento.value);
    });

    if (casillas.length > 0) {

        const contenedor =
            casillas[0].closest(
                ".grid-caracteristicas-principales"
            );

        const contador =
            contenedor?.querySelector(
                ".contador-caracteristicas"
            );

        if (contador) {

            contador.textContent =
                `${seleccionadas.length} de 6 seleccionadas`;
        }
    }
}



function renderizarCaracteristicasPrincipales(
    contenedorId,
    claseCheckbox
) {

    const contenedor =
        document.getElementById(contenedorId);

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const categorias = [
        {
            nombre: "Capacidad y distribución",
            ids: [
                "huespedes",
                "habitaciones",
                "camas",
                "banos",
                "alojamiento_entero",
                "habitacion_privada"
            ]
        },
        {
            nombre: "Comodidades",
            ids: [
                "aire_acondicionado",
                "wifi",
                "cocina_equipada",
                "television",
                "lavadora",
                "espacio_trabajo"
            ]
        },
        {
            nombre: "Instalaciones y exteriores",
            ids: [
                "piscina_privada",
                "piscina_compartida",
                "estacionamiento",
                "jardin",
                "terraza",
                "vista_mar"
            ]
        },
        {
            nombre: "Acceso y condiciones",
            ids: [
                "mascotas",
                "entrada_autonoma",
                "seguridad",
                "acceso_sin_gradas",
                "familias",
                "estancias_largas"
            ]
        }
    ];

    const contador =
        document.createElement("div");

    contador.className =
        "contador-caracteristicas";

    contenedor.appendChild(contador);

    function actualizarContador() {

        const cantidad =
            contenedor.querySelectorAll(
                "." + claseCheckbox + ":checked"
            ).length;

        contador.textContent =
            `${cantidad} de 6 seleccionadas`;
    }

    categorias.forEach(function(categoria) {

        const grupo =
            document.createElement("div");

        grupo.className =
            "grupo-caracteristicas";

        const titulo =
            document.createElement("h4");

        titulo.className =
            "titulo-grupo-caracteristicas";

        titulo.textContent =
            categoria.nombre;

        grupo.appendChild(titulo);

        const cuadricula =
            document.createElement("div");

        cuadricula.className =
            "cuadricula-caracteristicas";

        categoria.ids.forEach(function(id) {

            const caracteristica =
                CATALOGO_CARACTERISTICAS_PRINCIPALES.find(
                    item => item.id === id
                );

            if (!caracteristica) return;

            const etiqueta =
                document.createElement("label");

            etiqueta.className =
                "opcion-caracteristica-principal";

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = claseCheckbox;
            checkbox.value = caracteristica.id;

            const icono =
                document.createElement("span");

            icono.className =
                "icono-caracteristica";

            icono.textContent =
                caracteristica.icono;

            const texto =
                document.createElement("span");

            texto.className =
                "texto-caracteristica";

            texto.textContent =
                caracteristica.nombre;

            checkbox.addEventListener(
                "change",
                function() {

                    const cantidad =
                        contenedor.querySelectorAll(
                            "." + claseCheckbox + ":checked"
                        ).length;

                    if (cantidad > 6) {

                        checkbox.checked = false;

                        alert(
                            "Puedes seleccionar un máximo de 6 características principales."
                        );
                    }

                    actualizarContador();
                }
            );

            etiqueta.append(
                checkbox,
                icono,
                texto
            );

            cuadricula.appendChild(etiqueta);
        });

        grupo.appendChild(cuadricula);
        contenedor.appendChild(grupo);
    });

    actualizarContador();
}



 // ============================================================
 // EDITAR ALOJAMIENTO
 // ============================================================

async function editarAlojamiento(
    alojamientoId
) {

    const formulario =
        document.getElementById(
            "formularioEdicion"
        );

    const mensaje =
        document.getElementById(
            "mensajeEdicion"
        );

    if (!formulario) {

        alert(
            "No se encontró el formulario de edición."
        );

        return;
    }

    if (mensaje) {
        mensaje.textContent =
            "Cargando información...";
    }

    formulario.style.display =
        "block";

    try {

        // ====================================================
        // OBTENER INFORMACIÓN DESDE SUPABASE
        // ====================================================

        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .select("*")
                .eq(
                    "id",
                    alojamientoId
                )
                .single();

        if (resultado.error) {

            console.error(
                "Error obteniendo alojamiento:",
                resultado.error
            );

            formulario.style.display =
                "none";

            if (mensaje) {
                mensaje.textContent = "";
            }

            alert(
                "No se pudo cargar la información del alojamiento."
            );

            return;
        }

        const alojamiento =
            resultado.data;

        if (!alojamiento) {

            formulario.style.display =
                "none";

            if (mensaje) {
                mensaje.textContent = "";
            }

            alert(
                "No se encontró el alojamiento."
            );

            return;
        }

        alojamientoEditandoId =
            alojamiento.id;

        // ====================================================
        // INFORMACIÓN BÁSICA
        // ====================================================

        document.getElementById(
            "editarNombre"
        ).value =
            alojamiento.nombre || "";

        document.getElementById(
            "editarDescripcion"
        ).value =
            alojamiento.descripcion || "";

        document.getElementById(
            "editarUbicacion"
        ).value =
            alojamiento.ubicacion || "";

        mostrarEditorHabitacionesEA(alojamiento.ficha_habitaciones);

        document.getElementById("editarGoogleMapsUrl").value =
    alojamiento.google_maps_url || "";    

        document.getElementById(
            "editarAirbnbCalendarUrl"
        ).value =
            alojamiento.airbnb_calendar_url || "";

        // ====================================================
        // PRECIOS
        // ====================================================

        document.getElementById(
            "editarPrecioBase"
        ).value =
            alojamiento.precio_base ?? "";

        document.getElementById(
            "editarPrecioPersona"
        ).value =
            alojamiento.precio_persona ?? "";

        document.getElementById(
            "editarPersonasIncluidas"
        ).value =
            alojamiento.personas_incluidas ?? 1;

        // ====================================================
        // CAPACIDAD Y DISTRIBUCIÓN
        // ====================================================

        document.getElementById(
            "editarMaxHuespedes"
        ).value =
            alojamiento.max_huespedes ?? 1;

        document.getElementById(
            "editarHabitaciones"
        ).value =
            alojamiento.habitaciones ?? 1;

        document.getElementById(
            "editarBanos"
        ).value =
            alojamiento.banos ?? 1;

        document.getElementById(
            "editarCamas"
        ).value =
            alojamiento.camas ?? 0;

        document.getElementById(
            "editarSofasCama"
        ).value =
            alojamiento.sofas_cama ?? 0;

        document.getElementById(
            "editarTamanoCamas"
        ).value =
            alojamiento.tamano_camas || "";

        // ====================================================
        // CARACTERÍSTICAS PRINCIPALES
        // ====================================================

        renderizarCaracteristicasPrincipales(
            "caracteristicasPrincipalesEdicion",
            "caracteristica-principal-edicion"
        );

        colocarCaracteristicasPrincipales(
            alojamiento.caracteristicas_principales || [],
            ".caracteristica-principal-edicion"
        );

        // ====================================================
        // AMENIDADES
        // ====================================================

        colocarAmenidades(
            alojamiento.amenidades,
            ".amenidad-edicion"
        );

        // ====================================================
        // PUBLICACIÓN
        // ====================================================

        document.getElementById(
            "editarPublicado"
        ).checked =
            alojamiento.publicado === true;

        // ====================================================
        // MOSTRAR FORMULARIO DE EDICIÓN
        // ====================================================

        if (mensaje) {
            mensaje.textContent = "";
        }

        const formularioNuevo =
            document.getElementById(
                "formularioAlojamiento"
            );

        if (formularioNuevo) {

            formularioNuevo.style.display =
                "none";
        }

        formulario.style.display =
            "block";

        formulario.style.display = "block";
iniciarPasosAdmin(formulario);

        setTimeout(
            function() {

                formulario.scrollIntoView({

                    behavior: "smooth",
                    block: "start"

                });

            },
            100
        );

    } catch (error) {

        console.error(
            "Error en editarAlojamiento:",
            error
        );

        formulario.style.display =
            "none";

        if (mensaje) {
            mensaje.textContent = "";
        }

        alert(
            "Ocurrió un error al abrir el formulario de edición."
        );
    }
}



// ============================================================
// GUARDAR CAMBIOS
// ============================================================

async function guardarEdicion() {

    if (!alojamientoEditandoId) {

        alert(
            "No hay ningún alojamiento seleccionado."
        );

        return;
    }


    const mensaje =
        document.getElementById(
            "mensajeEdicion"
        );


    const nombre =
        document.getElementById(
            "editarNombre"
        ).value.trim();


    const descripcion =
        document.getElementById(
            "editarDescripcion"
        ).value.trim();


    const ubicacion =
        document.getElementById(
            "editarUbicacion"
        ).value.trim();


    const airbnbCalendarUrl =
        document.getElementById(
            "editarAirbnbCalendarUrl"
        ).value.trim();


    const precioBase =
        Number(
            document.getElementById(
                "editarPrecioBase"
            ).value
        );


    const precioPersona =
        Number(
            document.getElementById(
                "editarPrecioPersona"
            ).value
        );


    const personasIncluidas =
        Number(
            document.getElementById(
                "editarPersonasIncluidas"
            ).value
        );


    const maxHuespedes =
        Number(
            document.getElementById(
                "editarMaxHuespedes"
            ).value
        );


    const habitaciones =
        Number(
            document.getElementById(
                "editarHabitaciones"
            ).value
        );


    const banos =
        Number(
            document.getElementById(
                "editarBanos"
            ).value
        );


    const camas =
        Number(
            document.getElementById(
                "editarCamas"
            ).value
        );


    const sofasCama =
        Number(
            document.getElementById(
                "editarSofasCama"
            ).value
        );


    const tamanoCamas =
        document.getElementById(
            "editarTamanoCamas"
        ).value.trim();


    const publicado =
        document.getElementById(
            "editarPublicado"
        ).checked;


    const amenidades =
        obtenerAmenidades(
            ".amenidad-edicion"
        );


    // ========================================================
    // VALIDACIONES
    // ========================================================

    if (!nombre) {

        mensaje.textContent =
            "Ingrese el nombre del alojamiento.";

        return;
    }


    if (!descripcion) {

        mensaje.textContent =
            "Ingrese una descripción.";

        return;
    }


    if (
        !Number.isFinite(precioBase) ||
        precioBase <= 0
    ) {

        mensaje.textContent =
            "Ingrese un precio por noche válido.";

        return;
    }


    if (
        !Number.isFinite(precioPersona) ||
        precioPersona < 0
    ) {

        mensaje.textContent =
            "Ingrese un precio válido para persona adicional.";

        return;
    }


    if (
        !Number.isInteger(personasIncluidas) ||
        personasIncluidas <= 0
    ) {

        mensaje.textContent =
            "Ingrese una cantidad válida de personas incluidas.";

        return;
    }


    if (
        !Number.isInteger(maxHuespedes) ||
        maxHuespedes <= 0
    ) {

        mensaje.textContent =
            "Ingrese una capacidad máxima válida.";

        return;
    }


    if (
        personasIncluidas >
        maxHuespedes
    ) {

        mensaje.textContent =
            "Las personas incluidas no pueden superar la capacidad máxima.";

        return;
    }


    if (
        !Number.isInteger(habitaciones) ||
        habitaciones <= 0
    ) {

        mensaje.textContent =
            "Ingrese una cantidad válida de habitaciones.";

        return;
    }


    if (
        !Number.isInteger(banos) ||
        banos <= 0
    ) {

        mensaje.textContent =
            "Ingrese una cantidad válida de baños.";

        return;
    }


    if (
        !Number.isInteger(camas) ||
        camas < 0
    ) {

        mensaje.textContent =
            "Ingrese una cantidad válida de camas.";

        return;
    }


    if (
        !Number.isInteger(sofasCama) ||
        sofasCama < 0
    ) {

        mensaje.textContent =
            "Ingrese una cantidad válida de sofás cama.";

        return;
    }


    if (airbnbCalendarUrl) {

        try {

            new URL(
                airbnbCalendarUrl
            );

        } catch (error) {

            mensaje.textContent =
                "El enlace del calendario de Airbnb no tiene un formato válido.";

            return;
        }

    }


    mensaje.textContent =
        "Guardando cambios...";


    try {

        const datosActualizacion = {

            nombre:
                nombre,

            descripcion:
                descripcion,

            precio_base:
                precioBase,

            precio_persona:
                precioPersona,

            personas_incluidas:
                personasIncluidas,

            max_huespedes:
                maxHuespedes,

            habitaciones:
                habitaciones,

            banos:
                banos,

            camas:
                camas,

            sofas_cama:
                sofasCama,

            tamano_camas:
                tamanoCamas || null,

            amenidades:
                amenidades,

            ubicacion:
                ubicacion,

            google_maps_url:
                document.getElementById("editarGoogleMapsUrl").value.trim() || null,

            airbnb_calendar_url:
                airbnbCalendarUrl || null,

            publicado:
                publicado

        };


        console.log(
            "Datos que se enviarán a Supabase:",
            datosActualizacion
        );

        // ======================================================
// GUARDAR CARACTERÍSTICAS PRINCIPALES
// ======================================================

const caracteristicasSeleccionadas =
    obtenerCaracteristicasPrincipales(
        ".caracteristica-principal-edicion"
    );

if (caracteristicasSeleccionadas.length > 6) {
    alert("Solo puedes seleccionar un máximo de 6 características.");
    return;
}

        datosActualizacion.caracteristicas_principales =
            caracteristicasSeleccionadas;

        datosActualizacion.ficha_habitaciones =
            await obtenerHabitacionesEA(alojamientoEditandoId);

        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .update(datosActualizacion)
                .eq("id", alojamientoEditandoId);

        if (resultado.error) {

            console.error(
                "ERROR SUPABASE:",
                resultado.error
            );


            mensaje.textContent =
                "No se pudieron guardar los cambios: " +
                resultado.error.message;

            return;
        }


        mensaje.textContent =
            "Cambios guardados correctamente.";


        await cargarAlojamientosAdmin();


        setTimeout(
            function() {

                cancelarEdicion();

            },
            1000
        );


    } catch (error) {

        console.error(
            "Error guardando edición:",
            error
        );


        mensaje.textContent =
            "Ocurrió un error al guardar los cambios.";

    }

}


// ============================================================
// CANCELAR EDICIÓN
// ============================================================

function cancelarEdicion() {

    const formulario =
        document.getElementById(
            "formularioEdicion"
        );


    if (formulario) {

        formulario.style.display =
            "none";

    }


    alojamientoEditandoId =
        null;


    const mensaje =
        document.getElementById(
            "mensajeEdicion"
        );


    if (mensaje) {

        mensaje.textContent = "";

    }

}


// ============================================================
// GUARDAR NUEVO ALOJAMIENTO
// ============================================================

async function guardarAlojamiento() {

    const mensaje =
        document.getElementById(
            "mensajeFormulario"
        );


    const nombre =
        document.getElementById(
            "nombreAlojamiento"
        ).value.trim();


    const descripcion =
        document.getElementById(
            "descripcionAlojamiento"
        ).value.trim();


    const precioBase =
        Number(
            document.getElementById(
                "precioBase"
            ).value
        );


    const personasIncluidas =
        Number(
            document.getElementById(
                "personasIncluidas"
            ).value
        );


    const precioPersona =
        Number(
            document.getElementById(
                "precioPersona"
            ).value
        );


    const maxHuespedes =
        Number(
            document.getElementById(
                "maxHuespedes"
            ).value
        );


    const habitaciones =
        Number(
            document.getElementById(
                "habitaciones"
            ).value
        );


    const banos =
        Number(
            document.getElementById(
                "banos"
            ).value
        );


    const camas =
        Number(
            document.getElementById(
                "camas"
            ).value
        );


    const sofasCama =
        Number(
            document.getElementById(
                "sofasCama"
            ).value
        );


    const tamanoCamas =
        document.getElementById(
            "tamanoCamas"
        ).value.trim();


    const ubicacion =
        document.getElementById(
            "ubicacion"
        ).value.trim();


    const airbnbCalendarUrl =
        document.getElementById(
            "airbnbCalendarUrl"
        ).value.trim();


    const publicado =
        document.getElementById(
            "publicado"
        ).checked;


    const amenidades =
        obtenerAmenidades(
            ".amenidad-nueva"
        );


    // ========================================================
    // VALIDACIONES
    // ========================================================

    if (
        !nombre ||
        !descripcion ||
        !Number.isFinite(precioBase) ||
        precioBase <= 0 ||
        !Number.isFinite(precioPersona) ||
        precioPersona < 0 ||
        !Number.isInteger(personasIncluidas) ||
        personasIncluidas <= 0 ||
        !Number.isInteger(maxHuespedes) ||
        maxHuespedes <= 0 ||
        !Number.isInteger(habitaciones) ||
        habitaciones <= 0 ||
        !Number.isInteger(banos) ||
        banos <= 0 ||
        !Number.isInteger(camas) ||
        camas < 0 ||
        !Number.isInteger(sofasCama) ||
        sofasCama < 0
    ) {

        mensaje.textContent =
            "Complete correctamente todos los campos obligatorios.";

        return;
    }


    if (
        personasIncluidas >
        maxHuespedes
    ) {

        mensaje.textContent =
            "Las personas incluidas no pueden superar el máximo de huéspedes.";

        return;
    }


    if (airbnbCalendarUrl) {

        try {

            new URL(
                airbnbCalendarUrl
            );

        } catch (error) {

            mensaje.textContent =
                "El enlace del calendario de Airbnb no tiene un formato válido.";

            return;
        }

    }


    mensaje.textContent =
        "Guardando alojamiento...";


    try {

        const datosNuevoAlojamiento = {

            nombre:
                nombre,

            descripcion:
                descripcion,

            precio_base:
                precioBase,

            precio_persona:
                precioPersona,

            personas_incluidas:
                personasIncluidas,

            max_huespedes:
                maxHuespedes,

            habitaciones:
                habitaciones,

            banos:
                banos,

            camas:
                camas,

            sofas_cama:
                sofasCama,

            tamano_camas:
                tamanoCamas || null,

            amenidades:
                amenidades,

            ubicacion:
                ubicacion,

            google_maps_url:
                document.getElementById("googleMapsUrl").value.trim() || null,

            airbnb_calendar_url:
                airbnbCalendarUrl || null,

            publicado:
                publicado

        };


        console.log(
            "Datos que se enviarán:",
            datosNuevoAlojamiento
        );


        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .insert(
                    datosNuevoAlojamiento
                );


        if (resultado.error) {

            console.error(
                "ERROR SUPABASE:",
                resultado.error
            );


            mensaje.textContent =
                "No se pudo guardar el alojamiento: " +
                resultado.error.message;

            return;
        }


        mensaje.textContent =
            "Alojamiento guardado correctamente.";


        limpiarFormulario();


        await cargarAlojamientosAdmin();


        setTimeout(
            function() {

                cancelarFormulario();

            },
            1000
        );


    } catch (error) {

        console.error(
            "Error guardando alojamiento:",
            error
        );


        mensaje.textContent =
            "Ocurrió un error al guardar el alojamiento.";

    }

}


// ============================================================
// LIMPIAR FORMULARIO
// ============================================================

function limpiarFormulario() {

    const ids = [

        "nombreAlojamiento",
        "descripcionAlojamiento",
        "precioBase",
        "precioPersona",
        "maxHuespedes",
        "tamanoCamas",
        "ubicacion",
        "airbnbCalendarUrl"

    ];


    ids.forEach(
        function(id) {

            const elemento =
                document.getElementById(id);


            if (elemento) {

                elemento.value = "";

            }

        }
    );


    const personasIncluidas =
        document.getElementById(
            "personasIncluidas"
        );


    if (personasIncluidas) {

        personasIncluidas.value =
            "2";

    }


    const habitaciones =
        document.getElementById(
            "habitaciones"
        );


    if (habitaciones) {

        habitaciones.value =
            "1";

    }


    const banos =
        document.getElementById(
            "banos"
        );


    if (banos) {

        banos.value =
            "1";

    }


    const camas =
        document.getElementById(
            "camas"
        );


    if (camas) {

        camas.value =
            "1";

    }


    const sofasCama =
        document.getElementById(
            "sofasCama"
        );


    if (sofasCama) {

        sofasCama.value =
            "0";

    }


    const publicado =
        document.getElementById(
            "publicado"
        );


    if (publicado) {

        publicado.checked =
            false;

    }


    const amenidades =
        document.querySelectorAll(
            ".amenidad-nueva"
        );


        colocarAmenidades(null, ".amenidad-nueva");
   
        const mensaje =
        document.getElementById(
            "mensajeFormulario"
        );


    if (mensaje) {

        mensaje.textContent =
            "";

    }

}


// ============================================================
// SELECCIONAR FOTOS
// ============================================================

function seleccionarFotos(
    alojamientoId
) {

    const input =
        document.getElementById(
            "fotos-" +
            alojamientoId
        );


    if (
        !input ||
        !input.files ||
        input.files.length === 0
    ) {

        return;
    }


    const nuevasFotos =
        Array.from(
            input.files
        );


    if (
        !fotosSeleccionadas[
            alojamientoId
        ]
    ) {

        fotosSeleccionadas[
            alojamientoId
        ] = [];

    }


    nuevasFotos.forEach(
        function(archivo) {

            const existe =
                fotosSeleccionadas[
                    alojamientoId
                ].some(
                    function(foto) {

                        return (

                            foto.name ===
                            archivo.name &&

                            foto.size ===
                            archivo.size &&

                            foto.lastModified ===
                            archivo.lastModified

                        );

                    }
                );


            if (!existe) {

                fotosSeleccionadas[
                    alojamientoId
                ].push(
                    archivo
                );

            }

        }
    );


    input.value = "";


    mostrarPrevisualizacion(
        alojamientoId
    );

}


// ============================================================
// PREVISUALIZACIÓN
// ============================================================

function mostrarPrevisualizacion(
    alojamientoId
) {

    const contenedor =
        document.getElementById(
            "previsualizacion-" +
            alojamientoId
        );


    const contador =
        document.getElementById(
            "contadorFotos-" +
            alojamientoId
        );


    const boton =
        document.getElementById(
            "botonSubir-" +
            alojamientoId
        );


    if (
        !contenedor ||
        !contador ||
        !boton
    ) {

        return;
    }


    const fotos =
        fotosSeleccionadas[
            alojamientoId
        ] || [];


    contenedor.innerHTML =
        "";


    if (
        fotos.length === 0
    ) {

        contador.textContent =
            "Ninguna fotografía seleccionada";


        boton.style.display =
            "none";


        return;
    }


    contador.textContent =
        fotos.length === 1
            ? "1 fotografía seleccionada"
            : fotos.length +
              " fotografías seleccionadas";


    boton.style.display =
        "inline-block";


    fotos.forEach(
        function(
            archivo,
            indice
        ) {

            const url =
                URL.createObjectURL(
                    archivo
                );


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "preview-foto";


            elemento.innerHTML = `

                <img
                    src="${url}"
                    alt="Vista previa"
                >

                <button
                    type="button"
                    onclick="quitarFotoSeleccionada(
                        '${alojamientoId}',
                        ${indice}
                    )"
                    title="Quitar fotografía"
                >
                    ×
                </button>

            `;


            contenedor.appendChild(
                elemento
            );

        }
    );

}


// ============================================================
// QUITAR FOTO SELECCIONADA
// ============================================================

function quitarFotoSeleccionada(
    alojamientoId,
    indice
) {

    if (
        !fotosSeleccionadas[
            alojamientoId
        ]
    ) {

        return;
    }


    fotosSeleccionadas[
        alojamientoId
    ].splice(
        indice,
        1
    );


    mostrarPrevisualizacion(
        alojamientoId
    );

}


// ============================================================
// SUBIR FOTOS
// ============================================================

async function subirFotos(
    alojamientoId
) {

    const mensaje =
        document.getElementById(
            "mensajeFotos-" +
            alojamientoId
        );


    const boton =
        document.getElementById(
            "botonSubir-" +
            alojamientoId
        );


    const fotos =
        fotosSeleccionadas[
            alojamientoId
        ] || [];


    if (
        !mensaje ||
        !boton
    ) {

        return;
    }


    if (
        fotos.length === 0
    ) {

        mensaje.textContent =
            "Seleccione al menos una fotografía.";

        return;
    }


    boton.disabled =
        true;


    boton.textContent =
        "Subiendo fotografías...";


    mensaje.textContent =
        "";


    let cantidadSubida =
        0;


    try {

        for (
            const archivo of fotos
        ) {

            const nombreArchivo =
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8) +
                "-" +
                archivo.name.replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );


            const ruta =
                alojamientoId +
                "/" +
                nombreArchivo;


            const resultado =
                await clienteSupabase
                    .storage
                    .from(
                        "fotos-alojamientos"
                    )
                    .upload(
                        ruta,
                        archivo
                    );


            if (resultado.error) {

                console.error(
                    resultado.error
                );


                mensaje.textContent =
                    "Ocurrió un error al subir una de las fotografías.";


                boton.disabled =
                    false;


                boton.textContent =
                    "Subir fotografías";


                return;
            }


            cantidadSubida++;

        }


        fotosSeleccionadas[
            alojamientoId
        ] = [];


        mostrarPrevisualizacion(
            alojamientoId
        );


        boton.disabled =
            false;


        boton.textContent =
            "Subir fotografías";


        mensaje.textContent =
            cantidadSubida === 1
                ? "Fotografía subida correctamente."
                : cantidadSubida +
                  " fotografías subidas correctamente.";


        await cargarFotosAdmin(
            alojamientoId
        );


    } catch (error) {

        console.error(
            "Error subiendo fotografías:",
            error
        );


        boton.disabled =
            false;


        boton.textContent =
            "Subir fotografías";


        mensaje.textContent =
            "Ocurrió un error al subir las fotografías.";

    }

}


// ============================================================
// CARGAR FOTOS EXISTENTES
// ============================================================

async function cargarFotosAdmin(
    alojamientoId
) {

    const contenedor =
        document.getElementById(
            "galeriaAdmin-" +
            alojamientoId
        );


    if (!contenedor) {

        return;
    }


    try {

        const resultado =
            await clienteSupabase
                .storage
                .from(
                    "fotos-alojamientos"
                )
                .list(
                    alojamientoId,
                    {

                        limit: 1000,

                        sortBy: {

                            column: "name",

                            order: "asc"

                        }

                    }
                );


        if (resultado.error) {

            console.error(
                resultado.error
            );


            contenedor.innerHTML =
                "<p>No se pudieron cargar las fotos.</p>";

            return;
        }


        const archivos =
            resultado.data || [];


        const archivosImagenes =
            archivos.filter(
                function(archivo) {

                    const nombre =
                        archivo.name.toLowerCase();


                    return (

                        nombre.endsWith(".jpg") ||
                        nombre.endsWith(".jpeg") ||
                        nombre.endsWith(".png") ||
                        nombre.endsWith(".webp") ||
                        nombre.endsWith(".gif") ||
                        nombre.endsWith(".avif")

                    );

                }
            );


        if (
            archivosImagenes.length === 0
        ) {

            contenedor.innerHTML =
                "<p>Este alojamiento todavía no tiene fotografías.</p>";

            return;
        }


        contenedor.innerHTML =
            "";


        archivosImagenes.forEach(
            function(archivo) {

                const ruta =
                    alojamientoId +
                    "/" +
                    archivo.name;


                const resultadoUrl =
                    clienteSupabase
                        .storage
                        .from(
                            "fotos-alojamientos"
                        )
                        .getPublicUrl(
                            ruta
                        );


                const url =
                    resultadoUrl.data.publicUrl;


                const elemento =
                    document.createElement(
                        "div"
                    );


                elemento.className =
                    "foto-admin";


                elemento.innerHTML = `

                    <img
                        src="${url}"
                        alt="Foto del alojamiento"
                        loading="lazy"
                    >

                    <button
                        type="button"
                    >
                        Eliminar
                    </button>

                `;


                const botonEliminar =
                    elemento.querySelector(
                        "button"
                    );


                botonEliminar.addEventListener(
                    "click",
                    function() {

                        eliminarFoto(
                            alojamientoId,
                            archivo.name
                        );

                    }
                );


                contenedor.appendChild(
                    elemento
                );

            }
        );


    } catch (error) {

        console.error(
            "Error cargando fotos:",
            error
        );


        contenedor.innerHTML =
            "<p>Error al cargar fotografías.</p>";

    }

}


// ============================================================
// ELIMINAR FOTO
// ============================================================

async function eliminarFoto(
    alojamientoId,
    nombreArchivo
) {

    const confirmar =
        confirm(
            "¿Está seguro de que desea eliminar esta fotografía?"
        );


    if (!confirmar) {

        return;
    }


    try {

        const ruta =
            alojamientoId +
            "/" +
            nombreArchivo;


        const resultado =
            await clienteSupabase
                .storage
                .from(
                    "fotos-alojamientos"
                )
                .remove([
                    ruta
                ]);


        if (resultado.error) {

            console.error(
                resultado.error
            );


            alert(
                "No se pudo eliminar la fotografía."
            );

            return;
        }


        await cargarFotosAdmin(
            alojamientoId
        );


    } catch (error) {

        console.error(
            "Error eliminando foto:",
            error
        );


        alert(
            "Ocurrió un error al eliminar la fotografía."
        );

    }

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(
    texto
) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        colocarAmenidades(null, ".amenidad-nueva");
        comprobarSesion();

    }
);

function mostrarEditorHabitacionesEA(habitaciones) {
    document.getElementById("eaEditorHabitaciones")?.remove();

    const ubicacion = document.getElementById("editarUbicacion");
    const campo = ubicacion?.closest(".campo");
    if (!campo) return;

    const editor = document.createElement("section");
    editor.id = "eaEditorHabitaciones";
    editor.className = "formulario-seccion";
    editor.innerHTML = `
        <h3>Distribución de habitaciones</h3>
        <p>Agrega el nombre, los detalles y una foto de cada habitación.</p>
        <div class="ea-lista-habitaciones"></div>
        <button type="button" class="ea-agregar-habitacion">
            + Agregar habitación
        </button>
    `;

    const lista = editor.querySelector(".ea-lista-habitaciones");

    function agregarHabitacion(datos = {}) {
        const fila = document.createElement("fieldset");
        fila.className = "ea-habitacion-edicion";
        fila.dataset.fotoRuta = datos.fotoRuta || "";
        fila.style.cssText =
            "margin:0 0 12px;padding:12px;border:1px solid #dce7e5;border-radius:10px";

        fila.innerHTML = `
            <legend>Habitación</legend>
            <label>
                Nombre
                <input type="text" class="ea-habitacion-nombre"
                       maxlength="80" placeholder="Ej. Habitación principal">
            </label>
            <label>
                Detalles, uno por línea
                <textarea class="ea-habitacion-detalles" rows="3"
                          placeholder="1 cama King&#10;Baño privado&#10;Aire acondicionado"></textarea>
            </label>
            <label>
                Foto de la habitación
                <input type="file" class="ea-habitacion-foto" accept="image/*">
            </label>
            <p class="ea-habitacion-estado"></p>
            <button type="button" class="ea-quitar-habitacion">
                Quitar habitación
            </button>
        `;

        fila.querySelector(".ea-habitacion-nombre").value = datos.nombre || "";
        fila.querySelector(".ea-habitacion-detalles").value =
            Array.isArray(datos.detalles) ? datos.detalles.join("\n") : "";

        if (fila.dataset.fotoRuta) {
            fila.querySelector(".ea-habitacion-estado").textContent =
                "Foto guardada. Puedes adjuntar otra para reemplazarla.";
        }

        fila.querySelector(".ea-quitar-habitacion")
            .addEventListener("click", () => fila.remove());

        lista.appendChild(fila);
    }

    if (Array.isArray(habitaciones)) {
        habitaciones.forEach(datos => agregarHabitacion(datos));
    }

    editor.querySelector(".ea-agregar-habitacion")
        .addEventListener("click", () => agregarHabitacion());

    const seccionInformacion = campo.closest(".formulario-seccion");
if (seccionInformacion) {
    seccionInformacion.after(editor);
}
}

async function obtenerHabitacionesEA(alojamientoId) {
    const editor = document.getElementById("eaEditorHabitaciones");

    if (!editor) {
        throw new Error("No se encontró el editor de habitaciones. Vuelve a abrir el alojamiento.");
    }

    const habitaciones = Array.from(
        editor.querySelectorAll(".ea-habitacion-edicion"),
        fila => ({
            fila,
            nombre: fila.querySelector(".ea-habitacion-nombre").value.trim(),
            detalles: fila.querySelector(".ea-habitacion-detalles").value
                .split(/\r?\n/)
                .map(linea => linea.trim())
                .filter(Boolean),
            archivo: fila.querySelector(".ea-habitacion-foto").files[0]
        })
    );

    if (habitaciones.some(habitacion => !habitacion.nombre)) {
        throw new Error("Escribe el nombre de cada habitación o quita la tarjeta vacía.");
    }

    const distribucion = [];

    for (const habitacion of habitaciones) {
        const { fila, nombre, detalles, archivo } = habitacion;
        let fotoRuta = fila.dataset.fotoRuta || "";

        if (archivo) {
            const nombreSeguro = archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_");

            fotoRuta =
                alojamientoId + "/habitaciones/" +
                crypto.randomUUID() + "-" + nombreSeguro;

            const { error } = await clienteSupabase.storage
                .from("fotos-alojamientos")
                .upload(fotoRuta, archivo);

            if (error) {
                throw new Error("No se pudo subir la foto de " + nombre + ": " + error.message);
            }

            fila.dataset.fotoRuta = fotoRuta;
            fila.querySelector(".ea-habitacion-foto").value = "";
            fila.querySelector(".ea-habitacion-estado").textContent = "Foto subida.";
        }

        distribucion.push({ nombre, detalles, fotoRuta });
    }

    return distribucion;
}

function iniciarPasosAdmin(formulario) {
    formulario.querySelector(".ea-indice-pasos")?.remove();
    formulario.querySelector(".ea-navegacion")?.remove();

    const secciones = Array.from(
        formulario.querySelectorAll(":scope > .formulario-seccion")
    );
    const acciones = formulario.querySelector(".formulario-botones");

    if (secciones.length === 0 || !acciones) return;

    formulario.classList.add("ea-editor-pasos");

    const indice = document.createElement("nav");
    indice.className = "ea-indice-pasos";
    indice.setAttribute("aria-label", "Pasos del alojamiento");

    const navegacion = document.createElement("div");
    navegacion.className = "ea-navegacion";

    function crearBoton(texto) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        return boton;
    }

    const anterior = crearBoton("← Anterior");
    const siguiente = crearBoton("Siguiente →");
    let pasoActual = 0;

    const botones = secciones.map((seccion, posicion) => {
        const titulo = seccion.querySelector("h3")?.textContent.trim();
        const boton = crearBoton(
            titulo ? (posicion + 1) + ". " + titulo : "Paso " + (posicion + 1)
        );
        boton.addEventListener("click", () => mostrarPaso(posicion, true));
        indice.append(boton);
        return boton;
    });

    function mostrarPaso(posicion, enfocar = false) {
        pasoActual = posicion;

        secciones.forEach((seccion, numero) => {
            const activo = numero === pasoActual;
            seccion.hidden = !activo;

            if (activo) {
                botones[numero].setAttribute("aria-current", "step");
            } else {
                botones[numero].removeAttribute("aria-current");
            }
        });

        anterior.disabled = pasoActual === 0;
        siguiente.hidden = pasoActual === secciones.length - 1;

        if (enfocar) {
            botones[pasoActual].focus({ preventScroll: true });
            indice.scrollIntoView({ block: "nearest" });
        }
    }

    anterior.addEventListener("click", () => mostrarPaso(pasoActual - 1, true));
    siguiente.addEventListener("click", () => mostrarPaso(pasoActual + 1, true));

    navegacion.append(anterior, siguiente);
    secciones[0].before(indice);
    acciones.before(navegacion);
    mostrarPaso(0);
}
