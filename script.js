const SUPABASE_URL =
    "https://caodorogvcpupdajtbbp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YxE6";

const clienteSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

let alojamientoActual = null;

// ==========================================
// PORTADA
// ==========================================

let fotosPortada = [];
let indicePortada = 0;
let intervaloPortada = null;
let fondoPortadaA = null;
let fondoPortadaB = null;
let fondoActivo = "A";
let indicadoresPortada = null;

// ==========================================
// OBTENER FOTOS DE PORTADA
// ==========================================

async function obtenerFotosPortada() {

    try {

        const resultado =
            await clienteSupabase
                .storage
                .from("fotos-alojamientos")
                .list("portada", {
                    limit: 100,
                    sortBy: {
                        column: "name",
                        order: "asc"
                    }
                });

        if (resultado.error) {

            console.error(
                "Error al cargar fotografías de portada:",
                resultado.error
            );

            return [];
        }

        if (
            !resultado.data ||
            resultado.data.length === 0
        ) {

            return [];
        }

        const extensionesImagen = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".avif"
        ];

        return resultado.data
            .filter(function (archivo) {

                if (!archivo || !archivo.name) {
                    return false;
                }

                const nombre =
                    archivo.name.toLowerCase();

                return extensionesImagen.some(
                    function (extension) {
                        return nombre.endsWith(extension);
                    }
                );

            })
            .map(function (archivo) {

                const ruta =
                    "portada/" + archivo.name;

                const resultadoUrl =
                    clienteSupabase
                        .storage
                        .from("fotos-alojamientos")
                        .getPublicUrl(ruta);

                return resultadoUrl.data
                    ? resultadoUrl.data.publicUrl
                    : null;

            })
            .filter(Boolean);

    } catch (error) {

        console.error(
            "Error inesperado al obtener fotos de portada:",
            error
        );

        return [];
    }
}

// ==========================================
// CARGAR PORTADA
// ==========================================

async function cargarPortada() {

    fondoPortadaA =
        document.querySelector(".portada-fondo-a");

    fondoPortadaB =
        document.querySelector(".portada-fondo-b");

    indicadoresPortada =
        document.getElementById(
            "indicadoresPortada"
        );

    if (!fondoPortadaA || !fondoPortadaB) {

        console.error(
            "No se encontraron los elementos de la portada."
        );

        return;
    }

    fotosPortada =
        await obtenerFotosPortada();

    if (fotosPortada.length === 0) {

        fondoPortadaA.style.backgroundImage =
            "linear-gradient(#555, #222)";

        fondoPortadaB.style.backgroundImage =
            "none";

        return;
    }

    crearIndicadoresPortada();

    fondoPortadaA.style.backgroundImage =
        `url("${fotosPortada[0]}")`;

    fondoPortadaA.style.opacity = "1";
    fondoPortadaB.style.opacity = "0";

    indicePortada = 0;
    fondoActivo = "A";

    fotosPortada.forEach(function (url) {

        const imagen =
            new Image();

        imagen.src = url;
    });

    if (fotosPortada.length > 1) {

        if (intervaloPortada) {
            clearInterval(intervaloPortada);
        }

        intervaloPortada =
            setInterval(
                cambiarFotoPortada,
                5000
            );
    }
}

// ==========================================
// INDICADORES PORTADA
// ==========================================

function crearIndicadoresPortada() {

    if (!indicadoresPortada) {
        return;
    }

    indicadoresPortada.innerHTML = "";

    const cantidadPuntos =
        Math.min(
            fotosPortada.length,
            3
        );

    for (
        let i = 0;
        i < cantidadPuntos;
        i++
    ) {

        const punto =
            document.createElement("span");

        punto.className =
            "punto-portada";

        if (i === 0) {
            punto.classList.add("activo");
        }

        indicadoresPortada.appendChild(
            punto
        );
    }
}

// ==========================================
// CAMBIAR FOTO PORTADA
// ==========================================

function cambiarFotoPortada() {

    if (fotosPortada.length <= 1) {
        return;
    }

    indicePortada++;

    if (
        indicePortada >=
        fotosPortada.length
    ) {

        indicePortada = 0;
    }

    const siguienteFoto =
        fotosPortada[indicePortada];

    if (fondoActivo === "A") {

        fondoPortadaB.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoPortadaB.style.opacity = "1";
        fondoPortadaA.style.opacity = "0";

        fondoActivo = "B";

    } else {

        fondoPortadaA.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoPortadaA.style.opacity = "1";
        fondoPortadaB.style.opacity = "0";

        fondoActivo = "A";
    }

    actualizarIndicadoresPortada();
}

// ==========================================
// ACTUALIZAR INDICADORES PORTADA
// ==========================================

function actualizarIndicadoresPortada() {

    if (!indicadoresPortada) {
        return;
    }

    const puntos =
        indicadoresPortada.querySelectorAll(
            ".punto-portada"
        );

    if (puntos.length === 0) {
        return;
    }

    let puntoActivo;

    if (fotosPortada.length <= 3) {

        puntoActivo =
            indicePortada;

    } else {

        puntoActivo =
            Math.floor(
                (
                    indicePortada /
                    fotosPortada.length
                ) *
                puntos.length
            );

        if (
            puntoActivo >=
            puntos.length
        ) {

            puntoActivo =
                puntos.length - 1;
        }
    }

    puntos.forEach(
        function (punto, indice) {

            punto.classList.toggle(
                "activo",
                indice === puntoActivo
            );

        }
    );
}

// ==========================================
// OBTENER FOTOS DEL ALOJAMIENTO
// ==========================================

async function obtenerFotos(
    alojamientoId
) {

    if (!alojamientoId) {
        return [];
    }

    try {

        const resultado =
            await clienteSupabase
                .storage
                .from("fotos-alojamientos")
                .list(
                    String(alojamientoId),
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
                "Error al cargar fotos:",
                resultado.error
            );

            return [];
        }

        if (
            !resultado.data ||
            resultado.data.length === 0
        ) {

            return [];
        }

        const extensionesImagen = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".avif"
        ];

        const archivosImagen =
            resultado.data.filter(
                function (archivo) {

                    if (
                        !archivo ||
                        !archivo.name
                    ) {
                        return false;
                    }

                    if (
                        archivo.id === null ||
                        archivo.id === undefined
                    ) {
                        return false;
                    }

                    if (
                        archivo.metadata &&
                        archivo.metadata.mimetype
                    ) {

                        return archivo.metadata
                            .mimetype
                            .toLowerCase()
                            .startsWith(
                                "image/"
                            );
                    }

                    const nombre =
                        archivo.name.toLowerCase();

                    return extensionesImagen.some(
                        function (extension) {

                            return nombre.endsWith(
                                extension
                            );
                        }
                    );
                }
            );

        return archivosImagen
            .map(function (archivo) {

                const ruta =
                    String(alojamientoId) +
                    "/" +
                    archivo.name;

                const resultadoUrl =
                    clienteSupabase
                        .storage
                        .from("fotos-alojamientos")
                        .getPublicUrl(ruta);

                if (
                    !resultadoUrl.data ||
                    !resultadoUrl.data.publicUrl
                ) {
                    return null;
                }

                return resultadoUrl.data.publicUrl;

            })
            .filter(Boolean);

    } catch (error) {

        console.error(
            "Error inesperado al obtener fotos:",
            error
        );

        return [];
    }
}

// ==========================================
// MODAL DETALLE DEL ALOJAMIENTO
// ==========================================

let modalAlojamiento = null;
let modalFoto = null;
let modalContador = null;
let modalAnterior = null;
let modalSiguiente = null;

let fotosModal = [];
let indiceModal = 0;

let modalTouchInicio = 0;
let modalTouchFin = 0;

// ==========================================
// CREAR MODAL
// ==========================================

function crearModalAlojamiento() {

    if (
        document.getElementById(
            "modalAlojamiento"
        )
    ) {

        return;
    }

    modalAlojamiento =
        document.createElement("div");

    modalAlojamiento.id =
        "modalAlojamiento";

    // ======================================
    // BOTÓN CERRAR
    // ======================================

    const cerrar =
        document.createElement("button");

    cerrar.className =
        "modal-alojamiento-cerrar";

    cerrar.type =
        "button";

    cerrar.innerHTML =
        "&times;";

    cerrar.addEventListener(
        "click",
        cerrarModalAlojamiento
    );

    modalAlojamiento.appendChild(
        cerrar
    );

    // ======================================
    // CONTENIDO
    // ======================================

    const contenido =
        document.createElement("div");

    contenido.className =
        "modal-alojamiento-contenido";

    // ======================================
    // GALERÍA
    // ======================================

    const galeria =
        document.createElement("div");

    galeria.className =
        "modal-alojamiento-galeria";

    modalFoto =
        document.createElement("img");

    modalFoto.className =
        "modal-alojamiento-foto";

    modalFoto.alt =
        "Fotografía del alojamiento";

    galeria.appendChild(
        modalFoto
    );

    // FLECHA ANTERIOR

    modalAnterior =
        document.createElement("button");

    modalAnterior.className =
        "modal-alojamiento-flecha modal-alojamiento-anterior";

    modalAnterior.type =
        "button";

    modalAnterior.innerHTML =
        "&#10094;";

    modalAnterior.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

            cambiarFotoModal(
                indiceModal - 1
            );
        }
    );

    galeria.appendChild(
        modalAnterior
    );

    // FLECHA SIGUIENTE

    modalSiguiente =
        document.createElement("button");

    modalSiguiente.className =
        "modal-alojamiento-flecha modal-alojamiento-siguiente";

    modalSiguiente.type =
        "button";

    modalSiguiente.innerHTML =
        "&#10095;";

    modalSiguiente.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

            cambiarFotoModal(
                indiceModal + 1
            );
        }
    );

    galeria.appendChild(
        modalSiguiente
    );

    // CONTADOR

    modalContador =
        document.createElement("div");

    modalContador.className =
        "modal-alojamiento-contador";

    galeria.appendChild(
        modalContador
    );

    // SWIPE

    galeria.addEventListener(
        "touchstart",
        function (evento) {

            modalTouchInicio =
                evento.touches[0].clientX;

        },
        {
            passive: true
        }
    );

    galeria.addEventListener(
        "touchend",
        function (evento) {

            modalTouchFin =
                evento.changedTouches[0].clientX;

            const diferencia =
                modalTouchInicio -
                modalTouchFin;

            if (
                Math.abs(diferencia) < 50
            ) {
                return;
            }

            if (diferencia > 50) {

                cambiarFotoModal(
                    indiceModal + 1
                );

            } else {

                cambiarFotoModal(
                    indiceModal - 1
                );
            }

        },
        {
            passive: true
        }
    );

    contenido.appendChild(
        galeria
    );

    // ======================================
    // INFORMACIÓN
    // ======================================

    const informacion =
        document.createElement("div");

    informacion.className =
        "modal-alojamiento-informacion";

    const nombre =
        document.createElement("h2");

    nombre.id =
        "modalNombre";

    informacion.appendChild(
        nombre
    );

    const descripcion =
        document.createElement("p");

    descripcion.id =
        "modalDescripcion";

    descripcion.className =
        "modal-descripcion";

    informacion.appendChild(
        descripcion
    );

    const datos =
        document.createElement("div");

    datos.id =
        "modalDatos";

    datos.className =
        "modal-datos";

    informacion.appendChild(
        datos
    );

    const ubicacion =
        document.createElement("p");

    ubicacion.id =
        "modalUbicacion";

    ubicacion.className =
        "modal-ubicacion";

    informacion.appendChild(
        ubicacion
    );

    const precio =
        document.createElement("div");

    precio.id =
        "modalPrecio";

    precio.className =
        "modal-precio";

    informacion.appendChild(
        precio
    );

    const boton =
        document.createElement("button");

    boton.id =
        "modalBotonReserva";

    boton.className =
        "modal-boton-reserva";

    boton.type =
        "button";

    boton.textContent =
        "Solicitar reserva";

    boton.addEventListener(
        "click",
        function () {

            cerrarModalAlojamiento();

            if (!alojamientoActual) {
                return;
            }

            abrirReserva(
                alojamientoActual.nombre,
                alojamientoActual.precioBase,
                alojamientoActual.precioPersona,
                alojamientoActual.personasIncluidas,
                alojamientoActual.maxHuespedes
            );
        }
    );

    informacion.appendChild(
        boton
    );

    contenido.appendChild(
        informacion
    );

    modalAlojamiento.appendChild(
        contenido
    );

    // ======================================
    // CERRAR AL TOCAR FONDO
    // ======================================

    modalAlojamiento.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                modalAlojamiento
            ) {

                cerrarModalAlojamiento();
            }
        }
    );

    document.body.appendChild(
        modalAlojamiento
    );
}

// ==========================================
// ABRIR MODAL
// ==========================================

function abrirModalAlojamiento(
    alojamiento,
    fotos
) {

    crearModalAlojamiento();

    alojamientoActual = {
        nombre:
            alojamiento.nombre || "",

        descripcion:
            alojamiento.descripcion || "",

        habitaciones:
            Number(
                alojamiento.habitaciones || 0
            ),

        banos:
            Number(
                alojamiento.banos || 0
            ),

        ubicacion:
            alojamiento.ubicacion || "",

        precioBase:
            Number(
                alojamiento.precio_base || 0
            ),

        precioPersona:
            Number(
                alojamiento.precio_persona || 0
            ),

        personasIncluidas:
            Number(
                alojamiento.personas_incluidas || 0
            ),

        maxHuespedes:
            Math.max(
                1,
                Number(
                    alojamiento.max_huespedes || 1
                )
            )
    };

    fotosModal =
        fotos || [];

    indiceModal = 0;

    const nombre =
        document.getElementById(
            "modalNombre"
        );

    const descripcion =
        document.getElementById(
            "modalDescripcion"
        );

    const datos =
        document.getElementById(
            "modalDatos"
        );

    const ubicacion =
        document.getElementById(
            "modalUbicacion"
        );

    const precio =
        document.getElementById(
            "modalPrecio"
        );

    if (nombre) {

        nombre.textContent =
            alojamientoActual.nombre;
    }

    if (descripcion) {

        descripcion.textContent =
            alojamientoActual.descripcion;
    }

    if (datos) {

        datos.innerHTML = `
            <span>
                🛏️ ${alojamientoActual.habitaciones}
                habitación${alojamientoActual.habitaciones === 1 ? "" : "es"}
            </span>

            <span>
                🚿 ${alojamientoActual.banos}
                baño${alojamientoActual.banos === 1 ? "" : "s"}
            </span>

            <span>
                👥 Hasta ${alojamientoActual.maxHuespedes}
                persona${alojamientoActual.maxHuespedes === 1 ? "" : "s"}
            </span>
        `;
    }

    if (ubicacion) {

        if (alojamientoActual.ubicacion) {

            ubicacion.textContent =
                "📍 " +
                alojamientoActual.ubicacion;

            ubicacion.style.display =
                "block";

        } else {

            ubicacion.style.display =
                "none";
        }
    }

    if (precio) {

        precio.innerHTML = `
            <strong>
                Q${alojamientoActual.precioBase.toFixed(2)}
            </strong>

            <span>
                por noche
            </span>
        `;
    }

    actualizarFotoModal();

    modalAlojamiento.classList.add(
        "modal-alojamiento-visible"
    );

    document.body.classList.add(
        "sin-scroll"
    );
}

// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModalAlojamiento() {

    if (!modalAlojamiento) {
        return;
    }

    modalAlojamiento.classList.remove(
        "modal-alojamiento-visible"
    );

    document.body.classList.remove(
        "sin-scroll"
    );
}

// ==========================================
// CAMBIAR FOTO MODAL
// ==========================================

function cambiarFotoModal(
    nuevoIndice
) {

    if (
        !fotosModal ||
        fotosModal.length === 0
    ) {
        return;
    }

    if (nuevoIndice < 0) {

        nuevoIndice =
            fotosModal.length - 1;
    }

    if (
        nuevoIndice >=
        fotosModal.length
    ) {

        nuevoIndice = 0;
    }

    indiceModal =
        nuevoIndice;

    actualizarFotoModal();
}

// ==========================================
// ACTUALIZAR FOTO MODAL
// ==========================================

function actualizarFotoModal() {

    if (
        !modalFoto ||
        !modalContador
    ) {
        return;
    }

    if (
        !fotosModal ||
        fotosModal.length === 0
    ) {

        modalFoto.style.display =
            "none";

        modalContador.style.display =
            "none";

        modalAnterior.style.display =
            "none";

        modalSiguiente.style.display =
            "none";

        return;
    }

    modalFoto.style.display =
        "block";

    modalFoto.src =
        fotosModal[indiceModal];

    modalContador.style.display =
        "block";

    modalContador.textContent =
        (indiceModal + 1) +
        " / " +
        fotosModal.length;

    if (fotosModal.length <= 1) {

        modalAnterior.style.display =
            "none";

        modalSiguiente.style.display =
            "none";

    } else {

        modalAnterior.style.display =
            "";

        modalSiguiente.style.display =
            "";
    }
}

// ==========================================
// TECLADO MODAL
// ==========================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !modalAlojamiento ||
            !modalAlojamiento.classList.contains(
                "modal-alojamiento-visible"
            )
        ) {
            return;
        }

        if (
            evento.key === "Escape"
        ) {

            cerrarModalAlojamiento();

        } else if (
            evento.key === "ArrowLeft"
        ) {

            cambiarFotoModal(
                indiceModal - 1
            );

        } else if (
            evento.key === "ArrowRight"
        ) {

            cambiarFotoModal(
                indiceModal + 1
            );
        }
    }
);

// ==========================================
// CARGAR ALOJAMIENTOS
// ==========================================

async function cargarAlojamientos() {

    const contenedor =
        document.querySelector(
            ".alojamientos"
        );

    if (!contenedor) {

        console.error(
            "No se encontró la sección de alojamientos."
        );

        return;
    }

    const resultado =
        await clienteSupabase
            .from("alojamientos")
            .select("*")
            .eq(
                "publicado",
                true
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (resultado.error) {

        console.error(
            "Error de Supabase:",
            resultado.error
        );

        contenedor.innerHTML =
            "<p>No se pudieron cargar los alojamientos.</p>";

        return;
    }

    const alojamientos =
        resultado.data;

    if (
        !alojamientos ||
        alojamientos.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No hay alojamientos disponibles.</p>";

        return;
    }

    contenedor.innerHTML = "";

    for (
        const alojamiento of alojamientos
    ) {

        const fotos =
            await obtenerFotos(
                alojamiento.id
            );

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "alojamiento";

        tarjeta.tabIndex = 0;

        // ======================================
        // GALERÍA PRINCIPAL
        // ======================================

        const galeria =
            document.createElement("div");

        galeria.className =
            "galeria-alojamiento";

        if (fotos.length > 0) {

            const imagen =
                document.createElement("img");

            imagen.src =
                fotos[0];

            imagen.alt =
                alojamiento.nombre ||
                "Fotografía del alojamiento";

            imagen.className =
                "foto-principal";

            imagen.loading =
                "lazy";

            galeria.appendChild(
                imagen
            );

            // CONTADOR

            const contador =
                document.createElement("div");

            contador.className =
                "contador-fotos";

            contador.textContent =
                "📷 " +
                fotos.length +
                " fotos";

            galeria.appendChild(
                contador
            );

        } else {

            galeria.classList.add(
                "sin-fotos"
            );

            galeria.innerHTML =
                "<p>Sin fotografías disponibles</p>";
        }

        tarjeta.appendChild(
            galeria
        );

        // ======================================
        // NOMBRE
        // ======================================

        const nombre =
            document.createElement("div");

        nombre.className =
            "nombre-alojamiento";

        nombre.textContent =
            alojamiento.nombre ||
            "Alojamiento";

        tarjeta.appendChild(
            nombre
        );

        // ======================================
        // CLICK EN TODO EL ANUNCIO
        // ======================================

        tarjeta.addEventListener(
            "click",
            function () {

                abrirModalAlojamiento(
                    alojamiento,
                    fotos
                );
            }
        );

        tarjeta.addEventListener(
            "keydown",
            function (evento) {

                if (
                    evento.key === "Enter" ||
                    evento.key === " "
                ) {

                    evento.preventDefault();

                    abrirModalAlojamiento(
                        alojamiento,
                        fotos
                    );
                }
            }
        );

        contenedor.appendChild(
            tarjeta
        );
    }

    console.log(
        "Alojamientos cargados:",
        alojamientos
    );
}

// ==========================================
// CREAR SOLICITUD PERSONAS EXTRA
// ==========================================

function crearSolicitudPersonasExtra() {

    const campoPersonas =
        document.getElementById(
            "personas"
        );

    if (!campoPersonas) {
        return null;
    }

    let contenedor =
        document.getElementById(
            "solicitudPersonasExtra"
        );

    if (contenedor) {
        return contenedor;
    }

    contenedor =
        document.createElement("div");

    contenedor.id =
        "solicitudPersonasExtra";

    contenedor.style.display =
        "none";

    contenedor.style.marginTop =
        "12px";

    contenedor.style.padding =
        "12px";

    contenedor.style.border =
        "1px solid #ddd";

    contenedor.style.borderRadius =
        "8px";

    contenedor.style.backgroundColor =
        "#f8f8f8";

    const titulo =
        document.createElement("div");

    titulo.id =
        "tituloSolicitudExtra";

    titulo.style.fontWeight =
        "600";

    titulo.style.marginBottom =
        "8px";

    contenedor.appendChild(
        titulo
    );

    const label =
        document.createElement("label");

    label.style.display =
        "flex";

    label.style.alignItems =
        "flex-start";

    label.style.gap =
        "8px";

    label.style.cursor =
        "pointer";

    const checkbox =
        document.createElement("input");

    checkbox.type =
        "checkbox";

    checkbox.id =
        "aceptarPersonasExtra";

    checkbox.style.marginTop =
        "3px";

    const texto =
        document.createElement("span");

    texto.id =
        "textoSolicitudExtra";

    label.appendChild(
        checkbox
    );

    label.appendChild(
        texto
    );

    contenedor.appendChild(
        label
    );

    const aviso =
        document.createElement("p");

    aviso.id =
        "avisoSolicitudExtra";

    aviso.style.margin =
        "8px 0 0 0";

    aviso.style.fontSize =
        "13px";

    aviso.style.opacity =
        "0.75";

    aviso.textContent =
        "La solicitud de personas adicionales queda sujeta a confirmación por parte del alojamiento.";

    contenedor.appendChild(
        aviso
    );

    campoPersonas.insertAdjacentElement(
        "afterend",
        contenedor
    );

    checkbox.addEventListener(
        "change",
        function () {

            calcularPrecio();
        }
    );

    return contenedor;
}

// ==========================================
// ACTUALIZAR PERSONAS EXTRA
// ==========================================

function actualizarSolicitudPersonasExtra() {

    if (!alojamientoActual) {
        return;
    }

    const campoPersonas =
        document.getElementById(
            "personas"
        );

    if (!campoPersonas) {
        return;
    }

    const contenedor =
        crearSolicitudPersonasExtra();

    if (!contenedor) {
        return;
    }

    const checkbox =
        document.getElementById(
            "aceptarPersonasExtra"
        );

    const titulo =
        document.getElementById(
            "tituloSolicitudExtra"
        );

    const texto =
        document.getElementById(
            "textoSolicitudExtra"
        );

    let personas =
        Number(
            campoPersonas.value
        );

    if (
        !Number.isFinite(personas)
    ) {

        personas = 1;
    }

    personas =
        Math.floor(personas);

    if (personas < 1) {
        personas = 1;
    }

    if (personas > 50) {
        personas = 50;
    }

    campoPersonas.value =
        personas;

    const maximo =
        alojamientoActual.maxHuespedes;

    const personasExtra =
        Math.max(
            personas - maximo,
            0
        );

    if (personasExtra > 0) {

        contenedor.style.display =
            "block";

        titulo.textContent =
            "Solicitud especial de personas adicionales";

        texto.textContent =
            "Sé que la capacidad máxima de este alojamiento es de " +
            maximo +
            " persona" +
            (maximo === 1 ? "" : "s") +
            ", pero deseo ingresar con " +
            personas +
            " personas, es decir, " +
            personasExtra +
            " persona" +
            (personasExtra === 1 ? "" : "s") +
            " adicional" +
            (personasExtra === 1 ? "" : "es") +
            ", y estoy dispuesto(a) a acomodarme en el alojamiento.";

    } else {

        contenedor.style.display =
            "none";

        if (checkbox) {

            checkbox.checked =
                false;
        }
    }
}

// ==========================================
// CONFIGURAR CAMPO DE PERSONAS
// ==========================================

function configurarCampoPersonas(
    campoPersonas
) {

    campoPersonas.min =
        "1";

    campoPersonas.max =
        "50";

    campoPersonas.step =
        "1";

    campoPersonas.value =
        "1";

    campoPersonas.dataset.valorInicial =
        "1";

    campoPersonas.addEventListener(
        "beforeinput",
        function (evento) {

            if (
                this.value === "1" &&
                this.dataset.valorInicial === "1" &&
                evento.inputType === "insertText" &&
                /^\d$/.test(
                    evento.data || ""
                )
            ) {

                this.value = "";
            }
        }
    );

    campoPersonas.addEventListener(
        "keydown",
        function (evento) {

            if (
                this.value === "1" &&
                this.dataset.valorInicial === "1" &&
                /^[0-9]$/.test(
                    evento.key
                )
            ) {

                this.value = "";
            }
        }
    );

    campoPersonas.addEventListener(
        "input",
        function () {

            if (this.value === "") {

                this.dataset.valorInicial =
                    "";

                return;
            }

            let cantidad =
                Number(
                    this.value
                );

            if (
                !Number.isFinite(
                    cantidad
                )
            ) {
                return;
            }

            cantidad =
                Math.floor(cantidad);

            if (cantidad < 1) {
                cantidad = 1;
            }

            if (cantidad > 50) {
                cantidad = 50;
            }

            this.value =
                cantidad;

            this.dataset.valorInicial =
                "";

            actualizarSolicitudPersonasExtra();

            calcularPrecio();
        }
    );

    campoPersonas.addEventListener(
        "change",
        function () {

            let cantidad =
                Number(
                    this.value
                );

            if (
                !Number.isFinite(
                    cantidad
                )
            ) {

                cantidad = 1;
            }

            cantidad =
                Math.floor(cantidad);

            if (cantidad < 1) {
                cantidad = 1;
            }

            if (cantidad > 50) {
                cantidad = 50;
            }

            this.value =
                cantidad;

            this.dataset.valorInicial =
                "";

            actualizarSolicitudPersonasExtra();

            calcularPrecio();
        }
    );
}

// ==========================================
// ABRIR RESERVA
// ==========================================

function abrirReserva(
    nombre,
    precioBase,
    precioPersona,
    personasIncluidas,
    maxHuespedes
) {

    const maximo =
        Math.max(
            1,
            Number(maxHuespedes) || 1
        );

    alojamientoActual = {

        nombre: nombre,

        precioBase:
            Number(precioBase) || 0,

        precioPersona:
            Number(precioPersona) || 0,

        personasIncluidas:
            Number(personasIncluidas) || 0,

        maxHuespedes:
            maximo
    };

    const nombreAlojamiento =
        document.getElementById(
            "nombreAlojamiento"
        );

    const ventana =
        document.getElementById(
            "ventanaReserva"
        );

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );

    const campoPersonas =
        document.getElementById(
            "personas"
        );

    const nombreCampo =
        document.getElementById(
            "nombre"
        );

    const telefonoCampo =
        document.getElementById(
            "telefono"
        );

    const cantidadNoches =
        document.getElementById(
            "cantidadNoches"
        );

    const precioTotal =
        document.getElementById(
            "precioTotal"
        );

    if (nombreAlojamiento) {

        nombreAlojamiento.textContent =
            nombre;
    }

    if (ventana) {

        ventana.style.display =
            "block";
    }

    if (fechaIngreso) {

        fechaIngreso.value =
            "";

        fechaIngreso.onchange =
            calcularPrecio;
    }

    if (fechaSalida) {

        fechaSalida.value =
            "";

        fechaSalida.onchange =
            calcularPrecio;
    }

    if (campoPersonas) {

        campoPersonas.oninput = null;
        campoPersonas.onchange = null;

        configurarCampoPersonas(
            campoPersonas
        );
    }

    if (nombreCampo) {

        nombreCampo.value =
            "";
    }

    if (telefonoCampo) {

        telefonoCampo.value =
            "";
    }

    if (cantidadNoches) {

        cantidadNoches.textContent =
            "0";
    }

    if (precioTotal) {

        precioTotal.textContent =
            "Q0";
    }

    crearSolicitudPersonasExtra();

    const checkbox =
        document.getElementById(
            "aceptarPersonasExtra"
        );

    if (checkbox) {

        checkbox.checked =
            false;
    }

    actualizarSolicitudPersonasExtra();
}

// ==========================================
// CERRAR RESERVA
// ==========================================

function cerrarReserva() {

    const ventana =
        document.getElementById(
            "ventanaReserva"
        );

    if (ventana) {

        ventana.style.display =
            "none";
    }
}

// ==========================================
// CALCULAR PRECIO
// ==========================================

function calcularPrecio() {

    if (!alojamientoActual) {
        return;
    }

    const ingreso =
        document.getElementById(
            "fechaIngreso"
        ).value;

    const salida =
        document.getElementById(
            "fechaSalida"
        ).value;

    const campoPersonas =
        document.getElementById(
            "personas"
        );

    const cantidadNoches =
        document.getElementById(
            "cantidadNoches"
        );

    const precioTotal =
        document.getElementById(
            "precioTotal"
        );

    let personas =
        Number(
            campoPersonas.value
        );

    if (
        !Number.isFinite(
            personas
        )
    ) {

        personas = 1;
    }

    personas =
        Math.floor(personas);

    if (personas < 1) {
        personas = 1;
    }

    if (personas > 50) {
        personas = 50;
    }

    campoPersonas.value =
        personas;

    actualizarSolicitudPersonasExtra();

    if (!ingreso || !salida) {

        cantidadNoches.textContent =
            "0";

        precioTotal.textContent =
            "Q0";

        return;
    }

    const fechaIngreso =
        new Date(
            ingreso +
            "T00:00:00"
        );

    const fechaSalida =
        new Date(
            salida +
            "T00:00:00"
        );

    const diferencia =
        fechaSalida -
        fechaIngreso;

    const noches =
        Math.round(
            diferencia /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    if (noches <= 0) {

        cantidadNoches.textContent =
            "0";

        precioTotal.textContent =
            "Q0";

        return;
    }

    const personasAdicionales =
        Math.max(
            personas -
            alojamientoActual.personasIncluidas,
            0
        );

    const precioPorNoche =
        alojamientoActual.precioBase +
        (
            personasAdicionales *
            alojamientoActual.precioPersona
        );

    const total =
        precioPorNoche *
        noches;

    cantidadNoches.textContent =
        noches;

    precioTotal.textContent =
        "Q" +
        total.toFixed(2);
}

// ==========================================
// ENVIAR WHATSAPP
// ==========================================

function enviarWhatsApp() {

    if (!alojamientoActual) {
        return;
    }

    const ingreso =
        document.getElementById(
            "fechaIngreso"
        ).value;

    const salida =
        document.getElementById(
            "fechaSalida"
        ).value;

    const personas =
        Number(
            document.getElementById(
                "personas"
            ).value
        );

    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();

    const telefono =
        document.getElementById(
            "telefono"
        ).value.trim();

    const noches =
        document.getElementById(
            "cantidadNoches"
        ).textContent;

    const total =
        document.getElementById(
            "precioTotal"
        ).textContent;

    const checkbox =
        document.getElementById(
            "aceptarPersonasExtra"
        );

    const solicitaPersonasExtra =
        personas >
        alojamientoActual.maxHuespedes;

    if (
        !ingreso ||
        !salida ||
        !nombre ||
        !telefono
    ) {

        alert(
            "Por favor complete todos los datos."
        );

        return;
    }

    if (
        !Number.isInteger(personas) ||
        personas < 1 ||
        personas > 50
    ) {

        alert(
            "La cantidad de huéspedes debe ser válida."
        );

        return;
    }

    if (solicitaPersonasExtra) {

        if (
            !checkbox ||
            !checkbox.checked
        ) {

            alert(
                "La cantidad indicada supera la capacidad máxima de " +
                alojamientoActual.maxHuespedes +
                " personas. Si desea solicitar ingresar con personas adicionales, marque la opción de solicitud especial."
            );

            return;
        }
    }

    if (Number(noches) <= 0) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de ingreso."
        );

        return;
    }

    let informacionExtra = "";

    if (solicitaPersonasExtra) {

        const cantidadExtra =
            personas -
            alojamientoActual.maxHuespedes;

        informacionExtra =
            "\n\n" +
            "SOLICITUD ESPECIAL DE PERSONAS ADICIONALES\n" +
            "Capacidad máxima: " +
            alojamientoActual.maxHuespedes +
            " personas\n" +
            "Personas solicitadas: " +
            personas +
            "\n" +
            "Personas adicionales: " +
            cantidadExtra +
            "\n" +
            "El huésped declara conocer la capacidad máxima del alojamiento y manifiesta estar dispuesto(a) a acomodarse en el alojamiento.\n" +
            "Esta solicitud especial queda sujeta a confirmación.";
    }

    const numeroWhatsApp =
        "50254134493";

    const mensaje =
        "SOLICITUD DE RESERVA\n\n" +

        "Estancias Agradables\n\n" +

        "Alojamiento: " +
        alojamientoActual.nombre +

        "\n\n" +

        "Nombre: " +
        nombre +

        "\n" +

        "Telefono: " +
        telefono +

        "\n" +

        "Ingreso: " +
        ingreso +

        "\n" +

        "Salida: " +
        salida +

        "\n" +

        "Noches: " +
        noches +

        "\n" +

        "Personas: " +
        personas +

        "\n" +

        "Total estimado: " +
        total +

        informacionExtra +

        "\n\n" +

        "Esta es una solicitud de reserva. " +
        "La reserva queda sujeta a confirmacion de disponibilidad.";

    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(
            mensaje
        );

    window.open(
        url,
        "_blank"
    );
}

// ==========================================
// CERRAR MODALES CON ESCAPE
// ==========================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key !== "Escape"
        ) {
            return;
        }

        cerrarReserva();

        cerrarModalAlojamiento();
    }
);

// ==========================================
// INICIAR PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarPortada();

        cargarAlojamientos();
    }
);
