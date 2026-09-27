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
// FOTOGRAFÍAS SELECCIONADAS
// ============================================================

const fotosSeleccionadas = {};


// ============================================================
// ALOJAMIENTO QUE SE ESTÁ EDITANDO
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

            console.error(
                resultado.error
            );

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

        login.style.display =
            "none";

    }


    if (panel) {

        panel.style.display =
            "block";

    }


    cargarAlojamientosAdmin();

}


// ============================================================
// MOSTRAR FORMULARIO NUEVO
// ============================================================

function mostrarFormulario() {

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


    formulario.style.display =
        "block";


    limpiarFormulario();


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

        formulario.style.display =
            "none";

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
                    document.createElement(
                        "article"
                    );


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
                            data-publicado="${alojamiento.publicado}"
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


                contenedor.appendChild(
                    tarjeta
                );


                // --------------------------------------------
                // BOTÓN EDITAR
                // --------------------------------------------

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


                // --------------------------------------------
                // BOTÓN PUBLICAR / OCULTAR
                // --------------------------------------------

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


                // --------------------------------------------
                // INPUT DE FOTOS
                // --------------------------------------------

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


                // --------------------------------------------
                // BOTÓN SUBIR FOTOS
                // --------------------------------------------

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

                    publicado:
                        nuevoEstado

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

        console.error(
            error
        );


        alert(
            "Ocurrió un error."
        );

    }

}


// ============================================================
// EDITAR ALOJAMIENTO
// ============================================================

async function editarAlojamiento(
    alojamientoId
) {

    console.log(
        "Botón Editar presionado:",
        alojamientoId
    );


    const formulario =
        document.getElementById(
            "formularioEdicion"
        );


    const mensaje =
        document.getElementById(
            "mensajeEdicion"
        );


    // Comprobación importante

    if (!formulario) {

        alert(
            "No se encontró el formulario de edición. Verifica que admin.html tenga el formularioEdicion."
        );

        console.error(
            "Falta el elemento #formularioEdicion"
        );

        return;
    }


    mensaje.textContent =
        "Cargando información...";


    formulario.style.display =
        "block";


    try {

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


            mensaje.textContent = "";


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


            alert(
                "No se encontró el alojamiento."
            );

            return;
        }


        // Guardar ID actual

        alojamientoEditandoId =
            alojamiento.id;


        // ================================================
        // CARGAR DATOS
        // ================================================

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
            "editarPublicado"
        ).checked =
            alojamiento.publicado === true;


        mensaje.textContent = "";


        // Ocultar nuevo alojamiento

        const formularioNuevo =
            document.getElementById(
                "formularioAlojamiento"
            );


        if (formularioNuevo) {

            formularioNuevo.style.display =
                "none";

        }


        // Mostrar edición

        formulario.style.display =
            "block";


        // Llevar al formulario

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


        mensaje.textContent = "";


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


    const publicado =
        document.getElementById(
            "editarPublicado"
        ).checked;


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


    mensaje.textContent =
        "Guardando cambios...";


    try {

        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .update({

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

                    ubicacion:
                        ubicacion,

                    publicado:
                        publicado

                })
                .eq(
                    "id",
                    alojamientoEditandoId
                );


        if (resultado.error) {

            console.error(
                "Error actualizando:",
                resultado.error
            );


            mensaje.textContent =
                "No se pudieron guardar los cambios.";

            return;
        }


        mensaje.textContent =
            "Cambios guardados correctamente.";


        await cargarAlojamientosAdmin();


        setTimeout(
            function() {

                cancelarEdicion();

            },
            800
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


    const ubicacion =
        document.getElementById(
            "ubicacion"
        ).value.trim();


    const publicado =
        document.getElementById(
            "publicado"
        ).checked;


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
        banos <= 0
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


    mensaje.textContent =
        "Guardando alojamiento...";


    try {

        const resultado =
            await clienteSupabase
                .from("alojamientos")
                .insert({

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

                    ubicacion:
                        ubicacion,

                    publicado:
                        publicado

                });


        if (resultado.error) {

            console.error(
                resultado.error
            );


            mensaje.textContent =
                "No se pudo guardar el alojamiento.";

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
            700
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

    const nombre =
        document.getElementById(
            "nombreAlojamiento"
        );


    const descripcion =
        document.getElementById(
            "descripcionAlojamiento"
        );


    const precioBase =
        document.getElementById(
            "precioBase"
        );


    const personasIncluidas =
        document.getElementById(
            "personasIncluidas"
        );


    const precioPersona =
        document.getElementById(
            "precioPersona"
        );


    const maxHuespedes =
        document.getElementById(
            "maxHuespedes"
        );


    const habitaciones =
        document.getElementById(
            "habitaciones"
        );


    const banos =
        document.getElementById(
            "banos"
        );


    const ubicacion =
        document.getElementById(
            "ubicacion"
        );


    const publicado =
        document.getElementById(
            "publicado"
        );


    if (nombre)
        nombre.value = "";


    if (descripcion)
        descripcion.value = "";


    if (precioBase)
        precioBase.value = "";


    if (personasIncluidas)
        personasIncluidas.value = "2";


    if (precioPersona)
        precioPersona.value = "";


    if (maxHuespedes)
        maxHuespedes.value = "";


    if (habitaciones)
        habitaciones.value = "1";


    if (banos)
        banos.value = "1";


    if (ubicacion)
        ubicacion.value = "";


    if (publicado)
        publicado.checked = false;

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

        comprobarSesion();

    }
);
