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
// PRESENTACIÓN DE LA PORTADA
// ==========================================

let fotosPortada = [];
let indicePortada = 0;
let intervaloPortada = null;
let fondoPortadaA = null;
let fondoPortadaB = null;
let fondoActivo = "A";
let indicadoresPortada = null;


// ==========================================
// OBTENER FOTOS DE LA PORTADA
// ==========================================

async function obtenerFotosPortada() {

    try {

        const resultado =
            await clienteSupabase
                .storage
                .from("fotos-alojamientos")
                .list(
                    "portada",
                    {
                        limit: 100,
                        sortBy: {
                            column: "name",
                            order: "asc"
                        }
                    }
                );

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

            console.log(
                "No se encontraron fotografías en portada."
            );

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
                function(archivo) {

                    if (
                        !archivo ||
                        !archivo.name
                    ) {
                        return false;
                    }

                    const nombre =
                        archivo.name.toLowerCase();

                    return extensionesImagen.some(
                        function(extension) {
                            return nombre.endsWith(extension);
                        }
                    );
                }
            );

        return archivosImagen
            .map(
                function(archivo) {

                    const ruta =
                        "portada/" +
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

                    return resultadoUrl
                        .data
                        .publicUrl;
                }
            )
            .filter(
                function(url) {
                    return url !== null;
                }
            );

    } catch (error) {

        console.error(
            "Error inesperado al obtener fotos de portada:",
            error
        );

        return [];
    }
}


// ==========================================
// PREPARAR PORTADA
// ==========================================

async function cargarPortada() {

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            cargarPortada,
            {
                once: true
            }
        );

        return;
    }

    fondoPortadaA =
        document.querySelector(
            ".portada-fondo-a"
        );

    fondoPortadaB =
        document.querySelector(
            ".portada-fondo-b"
        );

    indicadoresPortada =
        document.getElementById(
            "indicadoresPortada"
        );

    if (
        !fondoPortadaA ||
        !fondoPortadaB
    ) {

        console.error(
            "No se encontraron los elementos de la portada."
        );

        return;
    }

    fotosPortada =
        await obtenerFotosPortada();

    if (
        fotosPortada.length === 0
    ) {

        fondoPortadaA.style.backgroundImage =
            "linear-gradient(#555, #222)";

        fondoPortadaB.style.backgroundImage =
            "none";

        return;
    }

    crearIndicadoresPortada();

    fondoPortadaA.style.backgroundImage =
        `url("${fotosPortada[0]}")`;

    fondoPortadaA.style.opacity =
        "1";

    fondoPortadaB.style.opacity =
        "0";

    indicePortada = 0;
    fondoActivo = "A";

    fotosPortada.forEach(
        function(url) {

            const imagen =
                new Image();

            imagen.src =
                url;
        }
    );

    if (
        fotosPortada.length > 1
    ) {

        if (
            intervaloPortada
        ) {

            clearInterval(
                intervaloPortada
            );
        }

        intervaloPortada =
            setInterval(
                cambiarFotoPortada,
                5000
            );
    }
}


// ==========================================
// CREAR PUNTOS DE LA PORTADA
// MÁXIMO 3
// ==========================================

function crearIndicadoresPortada() {

    if (
        !indicadoresPortada
    ) {
        return;
    }

    indicadoresPortada.innerHTML =
        "";

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
            document.createElement(
                "span"
            );

        punto.className =
            "punto-portada";

        if (
            i === 0
        ) {

            punto.classList.add(
                "activo"
            );
        }

        indicadoresPortada.appendChild(
            punto
        );
    }
}


// ==========================================
// CAMBIAR FOTO DE PORTADA
// ==========================================

function cambiarFotoPortada() {

    if (
        fotosPortada.length <= 1
    ) {
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
        fotosPortada[
            indicePortada
        ];

    if (
        fondoActivo === "A"
    ) {

        fondoPortadaB.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoPortadaB.style.opacity =
            "1";

        fondoPortadaA.style.opacity =
            "0";

        fondoActivo = "B";

    } else {

        fondoPortadaA.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoPortadaA.style.opacity =
            "1";

        fondoPortadaB.style.opacity =
            "0";

        fondoActivo = "A";
    }

    actualizarIndicadoresPortada();
}


// ==========================================
// ACTUALIZAR INDICADORES PORTADA
// ==========================================

function actualizarIndicadoresPortada() {

    if (
        !indicadoresPortada
    ) {
        return;
    }

    const puntos =
        indicadoresPortada.querySelectorAll(
            ".punto-portada"
        );

    if (
        puntos.length === 0
    ) {
        return;
    }

    /*
     * Los puntos representan grupos de fotografías.
     * Siempre habrá máximo 3.
     */

    let puntoActivo;

    if (
        fotosPortada.length <= 3
    ) {

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
        function(punto, indice) {

            punto.classList.toggle(
                "activo",
                indice === puntoActivo
            );
        }
    );
}


// ==========================================
// OBTENER FOTOS DE ALOJAMIENTO
// ==========================================

async function obtenerFotos(
    alojamientoId
) {

    if (
        !alojamientoId
    ) {

        console.error(
            "El alojamiento no tiene ID."
        );

        return [];
    }

    try {

        console.log(
            "Buscando fotografías para alojamiento:",
            alojamientoId
        );

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

        if (
            resultado.error
        ) {

            console.error(
                "Error al cargar fotos del alojamiento:",
                alojamientoId,
                resultado.error
            );

            return [];
        }

        if (
            !resultado.data ||
            resultado.data.length === 0
        ) {

            console.warn(
                "No hay archivos en la carpeta:",
                alojamientoId
            );

            return [];
        }

        console.log(
            "Archivos encontrados:",
            resultado.data
        );

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
                function(archivo) {

                    if (
                        !archivo ||
                        !archivo.name
                    ) {

                        return false;
                    }

                    /*
                     * Supabase puede devolver carpetas
                     * además de archivos.
                     */

                    if (
                        archivo.id === null ||
                        archivo.id === undefined
                    ) {

                        return false;
                    }

                    /*
                     * Si existe MIME, utilizarlo.
                     */

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

                    /*
                     * Si no existe MIME,
                     * comprobar extensión.
                     */

                    const nombre =
                        archivo.name
                            .toLowerCase();

                    return extensionesImagen.some(
                        function(extension) {

                            return nombre.endsWith(
                                extension
                            );
                        }
                    );
                }
            );

        console.log(
            "Imágenes encontradas:",
            archivosImagen
        );

        const fotos =
            archivosImagen
                .map(
                    function(archivo) {

                        const ruta =
                            String(alojamientoId) +
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

                        if (
                            !resultadoUrl.data ||
                            !resultadoUrl.data.publicUrl
                        ) {

                            return null;
                        }

                        return resultadoUrl
                            .data
                            .publicUrl;
                    }
                )
                .filter(
                    function(url) {

                        return (
                            url &&
                            url.trim() !== ""
                        );
                    }
                );

        console.log(
            "URLs finales de fotografías:",
            fotos
        );

        return fotos;

    } catch (error) {

        console.error(
            "Error inesperado al obtener fotos:",
            error
        );

        return [];
    }
}


// ==========================================
// VISOR DE FOTOGRAFÍAS
// ==========================================

let visorFotos = null;
let imagenVisor = null;
let contadorVisor = null;
let botonVisorAnterior = null;
let botonVisorSiguiente = null;
let fotosVisor = [];
let indiceVisor = 0;
let visorTouchInicio = 0;
let visorTouchFin = 0;


// ==========================================
// CREAR VISOR
// ==========================================

function crearVisorFotos() {

    if (
        document.getElementById(
            "visorFotos"
        )
    ) {

        return;
    }

    visorFotos =
        document.createElement(
            "div"
        );

    visorFotos.id =
        "visorFotos";

    const botonCerrar =
        document.createElement(
            "button"
        );

    botonCerrar.className =
        "visor-cerrar";

    botonCerrar.type =
        "button";

    botonCerrar.innerHTML =
        "&times;";

    botonCerrar.setAttribute(
        "aria-label",
        "Cerrar fotografías"
    );

    botonCerrar.addEventListener(
        "click",
        cerrarVisorFotos
    );

    visorFotos.appendChild(
        botonCerrar
    );

    const contenido =
        document.createElement(
            "div"
        );

    contenido.className =
        "visor-contenido";

    imagenVisor =
        document.createElement(
            "img"
        );

    imagenVisor.className =
        "visor-imagen";

    imagenVisor.alt =
        "Fotografía del alojamiento";

    contenido.appendChild(
        imagenVisor
    );

    visorFotos.appendChild(
        contenido
    );

    contadorVisor =
        document.createElement(
            "div"
        );

    contadorVisor.className =
        "visor-contador";

    visorFotos.appendChild(
        contadorVisor
    );

    botonVisorAnterior =
        document.createElement(
            "button"
        );

    botonVisorAnterior.className =
        "visor-flecha visor-anterior";

    botonVisorAnterior.type =
        "button";

    botonVisorAnterior.innerHTML =
        "&#10094;";

    botonVisorAnterior.addEventListener(
        "click",
        function(evento) {

            evento.stopPropagation();

            cambiarFotoVisor(
                indiceVisor - 1
            );
        }
    );

    visorFotos.appendChild(
        botonVisorAnterior
    );

    botonVisorSiguiente =
        document.createElement(
            "button"
        );

    botonVisorSiguiente.className =
        "visor-flecha visor-siguiente";

    botonVisorSiguiente.type =
        "button";

    botonVisorSiguiente.innerHTML =
        "&#10095;";

    botonVisorSiguiente.addEventListener(
        "click",
        function(evento) {

            evento.stopPropagation();

            cambiarFotoVisor(
                indiceVisor + 1
            );
        }
    );

    visorFotos.appendChild(
        botonVisorSiguiente
    );

    visorFotos.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target ===
                visorFotos
            ) {

                cerrarVisorFotos();
            }
        }
    );

    visorFotos.addEventListener(
        "touchstart",
        function(evento) {

            visorTouchInicio =
                evento.touches[0]
                    .clientX;
        },
        {
            passive: true
        }
    );

    visorFotos.addEventListener(
        "touchend",
        function(evento) {

            visorTouchFin =
                evento.changedTouches[0]
                    .clientX;

            const diferencia =
                visorTouchInicio -
                visorTouchFin;

            if (
                Math.abs(diferencia) < 50
            ) {

                return;
            }

            if (
                diferencia > 50
            ) {

                cambiarFotoVisor(
                    indiceVisor + 1
                );

            } else {

                cambiarFotoVisor(
                    indiceVisor - 1
                );
            }
        },
        {
            passive: true
        }
    );

    document.body.appendChild(
        visorFotos
    );
}


// ==========================================
// ABRIR VISOR
// ==========================================

function abrirVisorFotos(
    fotos,
    indice
) {

    if (
        !fotos ||
        fotos.length === 0
    ) {

        return;
    }

    crearVisorFotos();

    fotosVisor =
        fotos;

    indiceVisor =
        indice;

    actualizarVisor();

    visorFotos.classList.add(
        "visor-visible"
    );

    document.body.classList.add(
        "sin-scroll"
    );
}


// ==========================================
// CERRAR VISOR
// ==========================================

function cerrarVisorFotos() {

    if (
        !visorFotos
    ) {

        return;
    }

    visorFotos.classList.remove(
        "visor-visible"
    );

    document.body.classList.remove(
        "sin-scroll"
    );
}


// ==========================================
// CAMBIAR FOTO VISOR
// ==========================================

function cambiarFotoVisor(
    nuevoIndice
) {

    if (
        !fotosVisor ||
        fotosVisor.length === 0
    ) {

        return;
    }

    if (
        nuevoIndice < 0
    ) {

        nuevoIndice =
            fotosVisor.length - 1;
    }

    if (
        nuevoIndice >=
        fotosVisor.length
    ) {

        nuevoIndice = 0;
    }

    indiceVisor =
        nuevoIndice;

    actualizarVisor();
}


// ==========================================
// ACTUALIZAR VISOR
// ==========================================

function actualizarVisor() {

    if (
        !imagenVisor ||
        !contadorVisor ||
        !fotosVisor ||
        !fotosVisor.length
    ) {

        return;
    }

    imagenVisor.src =
        fotosVisor[
            indiceVisor
        ];

    contadorVisor.textContent =
        (indiceVisor + 1) +
        " / " +
        fotosVisor.length;

    if (
        fotosVisor.length <= 1
    ) {

        botonVisorAnterior.style.display =
            "none";

        botonVisorSiguiente.style.display =
            "none";

    } else {

        botonVisorAnterior.style.display =
            "";

        botonVisorSiguiente.style.display =
            "";
    }
}


// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
    "keydown",
    function(evento) {

        if (
            !visorFotos ||
            !visorFotos.classList.contains(
                "visor-visible"
            )
        ) {

            return;
        }

        if (
            evento.key === "Escape"
        ) {

            cerrarVisorFotos();

        } else if (
            evento.key === "ArrowLeft"
        ) {

            cambiarFotoVisor(
                indiceVisor - 1
            );

        } else if (
            evento.key === "ArrowRight"
        ) {

            cambiarFotoVisor(
                indiceVisor + 1
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

    if (
        !contenedor
    ) {

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

    if (
        resultado.error
    ) {

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

    contenedor.innerHTML =
        "";

    for (
        const alojamiento of alojamientos
    ) {

        const fotos =
            await obtenerFotos(
                alojamiento.id
            );

        const tarjeta =
            document.createElement(
                "article"
            );

        tarjeta.className =
            "alojamiento";


        // ======================================
        // GALERÍA
        // ======================================

        let galeria;

        if (
            fotos.length > 0
        ) {

            galeria =
                document.createElement(
                    "div"
                );

            galeria.className =
                "galeria-alojamiento";

            const imagen =
                document.createElement(
                    "img"
                );

            imagen.src =
                fotos[0];

            imagen.alt =
                alojamiento.nombre ||
                "Fotografía del alojamiento";

            imagen.className =
                "foto-principal";

            imagen.loading =
                "lazy";

            imagen.onerror =
                function() {

                    console.error(
                        "No se pudo cargar la imagen:",
                        imagen.src
                    );

                    imagen.style.display =
                        "none";

                    galeria.classList.add(
                        "error-foto"
                    );
                };

            let indiceFoto = 0;

            imagen.addEventListener(
                "click",
                function() {

                    abrirVisorFotos(
                        fotos,
                        indiceFoto
                    );
                }
            );

            galeria.appendChild(
                imagen
            );


            // ==================================
            // CONTADOR DE FOTOS
            // ==================================

            const contadorFotos =
                document.createElement(
                    "div"
                );

            contadorFotos.className =
                "contador-fotos";

            contadorFotos.textContent =
                "📷 " +
                fotos.length +
                " fotos";

            galeria.appendChild(
                contadorFotos
            );


            // ==================================
            // INDICADORES
            // MÁXIMO 3
            // ==================================

            let indicadores = null;

            if (
                fotos.length > 1
            ) {

                indicadores =
                    document.createElement(
                        "div"
                    );

                indicadores.className =
                    "indicadores-fotos";

                const cantidadPuntos =
                    Math.min(
                        fotos.length,
                        3
                    );

                for (
                    let i = 0;
                    i < cantidadPuntos;
                    i++
                ) {

                    const punto =
                        document.createElement(
                            "span"
                        );

                    punto.className =
                        "punto-foto";

                    if (
                        i === 0
                    ) {

                        punto.classList.add(
                            "activo"
                        );
                    }

                    indicadores.appendChild(
                        punto
                    );
                }

                galeria.appendChild(
                    indicadores
                );
            }


            // ==================================
            // CAMBIAR FOTO
            // ==================================

            function cambiarFoto(
                nuevoIndice
            ) {

                if (
                    nuevoIndice < 0
                ) {

                    nuevoIndice =
                        fotos.length - 1;
                }

                if (
                    nuevoIndice >=
                    fotos.length
                ) {

                    nuevoIndice = 0;
                }

                indiceFoto =
                    nuevoIndice;

                imagen.src =
                    fotos[indiceFoto];

                if (
                    indicadores
                ) {

                    const puntos =
                        indicadores.querySelectorAll(
                            ".punto-foto"
                        );

                    let puntoActivo;

                    if (
                        fotos.length <= 3
                    ) {

                        puntoActivo =
                            indiceFoto;

                    } else {

                        puntoActivo =
                            Math.floor(
                                (
                                    indiceFoto /
                                    fotos.length
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
                        function(punto, indice) {

                            punto.classList.toggle(
                                "activo",
                                indice ===
                                puntoActivo
                            );
                        }
                    );
                }
            }


            // ==================================
            // FLECHAS COMPUTADORA
            // ==================================

            const esTelefono =
                window.matchMedia(
                    "(max-width: 600px)"
                ).matches;

            if (
                fotos.length > 1 &&
                !esTelefono
            ) {

                const botonAnterior =
                    document.createElement(
                        "button"
                    );

                botonAnterior.className =
                    "flecha-foto flecha-anterior";

                botonAnterior.type =
                    "button";

                botonAnterior.innerHTML =
                    "&#10094;";

                botonAnterior.setAttribute(
                    "aria-label",
                    "Foto anterior"
                );

                botonAnterior.addEventListener(
                    "click",
                    function(evento) {

                        evento.stopPropagation();

                        cambiarFoto(
                            indiceFoto - 1
                        );
                    }
                );

                galeria.appendChild(
                    botonAnterior
                );


                const botonSiguiente =
                    document.createElement(
                        "button"
                    );

                botonSiguiente.className =
                    "flecha-foto flecha-siguiente";

                botonSiguiente.type =
                    "button";

                botonSiguiente.innerHTML =
                    "&#10095;";

                botonSiguiente.setAttribute(
                    "aria-label",
                    "Foto siguiente"
                );

                botonSiguiente.addEventListener(
                    "click",
                    function(evento) {

                        evento.stopPropagation();

                        cambiarFoto(
                            indiceFoto + 1
                        );
                    }
                );

                galeria.appendChild(
                    botonSiguiente
                );
            }


            // ==================================
            // DESLIZAR EN CELULAR
            // ==================================

            let posicionInicialX = 0;
            let posicionFinalX = 0;

            galeria.addEventListener(
                "touchstart",
                function(evento) {

                    posicionInicialX =
                        evento.touches[0]
                            .clientX;
                },
                {
                    passive: true
                }
            );

            galeria.addEventListener(
                "touchend",
                function(evento) {

                    posicionFinalX =
                        evento.changedTouches[0]
                            .clientX;

                    const diferencia =
                        posicionInicialX -
                        posicionFinalX;

                    if (
                        diferencia > 50 &&
                        fotos.length > 1
                    ) {

                        cambiarFoto(
                            indiceFoto + 1
                        );

                    } else if (
                        diferencia < -50 &&
                        fotos.length > 1
                    ) {

                        cambiarFoto(
                            indiceFoto - 1
                        );
                    }
                },
                {
                    passive: true
                }
            );

        } else {

            // ==================================
            // SIN FOTOS
            // ==================================

            galeria =
                document.createElement(
                    "div"
                );

            galeria.className =
                "sin-fotos";

            galeria.innerHTML =
                "<p>Sin fotografías disponibles</p>";
        }

        tarjeta.appendChild(
            galeria
        );


        // ======================================
        // INFORMACIÓN DEL ALOJAMIENTO
        // ======================================

        const informacion =
            document.createElement(
                "div"
            );

        informacion.className =
            "alojamiento-info";

        const nombreSeguro =
            String(
                alojamiento.nombre || ""
            )
                .replace(
                    /\\/g,
                    "\\\\"
                )
                .replace(
                    /'/g,
                    "\\'"
                );

        const precioBase =
            Number(
                alojamiento.precio_base || 0
            );

        const precioPersona =
            Number(
                alojamiento.precio_persona || 0
            );

        const personasIncluidas =
            Number(
                alojamiento.personas_incluidas || 0
            );

        const maxHuespedes =
            Number(
                alojamiento.max_huespedes || 1
            );

        informacion.innerHTML = `

            <h3>
                ${alojamiento.nombre || ""}
            </h3>

            <p>
                ${alojamiento.descripcion || ""}
            </p>

            <div class="datos">

                <span>
                    ${alojamiento.habitaciones || 0}
                    habitación(es)
                </span>

                <span>
                    ${alojamiento.banos || 0}
                    baño(s)
                </span>

                <span>
                    Hasta
                    ${maxHuespedes}
                    persona(s)
                </span>

            </div>

            ${
                alojamiento.ubicacion
                    ? `
                        <p>
                            📍 ${alojamiento.ubicacion}
                        </p>
                    `
                    : ""
            }

            <div class="precio">

                <strong>
                    Q${precioBase.toFixed(2)}
                </strong>

                <span>
                    / noche
                </span>

            </div>

            <button
                class="boton-reservar"
                onclick="abrirReserva(
                    '${nombreSeguro}',
                    ${precioBase},
                    ${precioPersona},
                    ${personasIncluidas},
                    ${maxHuespedes}
                )"
            >
                Solicitar reserva
            </button>
        `;

        tarjeta.appendChild(
            informacion
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

    document.getElementById(
        "nombreAlojamiento"
    ).textContent =
        nombre;

    document.getElementById(
        "ventanaReserva"
    ).style.display =
        "block";

    document.getElementById(
        "fechaIngreso"
    ).value =
        "";

    document.getElementById(
        "fechaSalida"
    ).value =
        "";

    const campoPersonas =
        document.getElementById(
            "personas"
        );

    campoPersonas.value =
        1;

    campoPersonas.min =
        1;

    campoPersonas.max =
        maximo;

    /*
     * Si el campo es un input type="number",
     * el navegador respetará estos límites.
     */

    campoPersonas.setAttribute(
        "min",
        "1"
    );

    campoPersonas.setAttribute(
        "max",
        String(maximo)
    );


    // ======================================
    // EVITAR QUE ESCRIBAN MÁS DEL MÁXIMO
    // ======================================

    campoPersonas.oninput =
        function() {

            let cantidad =
                Number(
                    this.value
                );

            if (
                !Number.isFinite(cantidad) ||
                cantidad < 1
            ) {

                cantidad = 1;
            }

            if (
                cantidad > maximo
            ) {

                cantidad = maximo;

                alert(
                    "Este alojamiento permite un máximo de " +
                    maximo +
                    " persona" +
                    (maximo === 1 ? "" : "s") +
                    "."
                );
            }

            this.value =
                cantidad;

            calcularPrecio();
        };


    document.getElementById(
        "cantidadNoches"
    ).textContent =
        "0";

    document.getElementById(
        "precioTotal"
    ).textContent =
        "Q0";
}


// ==========================================
// CERRAR RESERVA
// ==========================================

function cerrarReserva() {

    const ventana =
        document.getElementById(
            "ventanaReserva"
        );

    if (
        ventana
    ) {

        ventana.style.display =
            "none";
    }
}


// ==========================================
// CALCULAR PRECIO
// ==========================================

function calcularPrecio() {

    if (
        !alojamientoActual
    ) {

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

    let personas =
        Number(
            campoPersonas.value
        );

    if (
        !Number.isFinite(personas) ||
        personas < 1
    ) {

        personas = 1;
        campoPersonas.value = 1;
    }

    if (
        personas >
        alojamientoActual.maxHuespedes
    ) {

        personas =
            alojamientoActual.maxHuespedes;

        campoPersonas.value =
            personas;
    }

    if (
        !ingreso ||
        !salida
    ) {

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
        diferencia /
        (
            1000 *
            60 *
            60 *
            24
        );

    if (
        noches <= 0
    ) {

        document.getElementById(
            "cantidadNoches"
        ).textContent =
            "0";

        document.getElementById(
            "precioTotal"
        ).textContent =
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

    document.getElementById(
        "cantidadNoches"
    ).textContent =
        noches;

    document.getElementById(
        "precioTotal"
    ).textContent =
        "Q" +
        total.toFixed(2);
}


// ==========================================
// ENVIAR WHATSAPP
// ==========================================

function enviarWhatsApp() {

    if (
        !alojamientoActual
    ) {

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


    // ======================================
    // VALIDAR DATOS
    // ======================================

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


    // ======================================
    // VALIDAR PERSONAS
    // ======================================

    if (
        !Number.isInteger(personas) ||
        personas < 1
    ) {

        alert(
            "La cantidad de huéspedes debe ser válida."
        );

        return;
    }

    if (
        personas >
        alojamientoActual.maxHuespedes
    ) {

        alert(
            "Este alojamiento permite un máximo de " +
            alojamientoActual.maxHuespedes +
            " persona" +
            (
                alojamientoActual.maxHuespedes === 1
                    ? ""
                    : "s"
            ) +
            "."
        );

        document.getElementById(
            "personas"
        ).value =
            alojamientoActual.maxHuespedes;

        calcularPrecio();

        return;
    }


    // ======================================
    // VALIDAR FECHAS
    // ======================================

    if (
        Number(noches) <= 0
    ) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de ingreso."
        );

        return;
    }


    // ======================================
    // WHATSAPP
    // ======================================

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
// INICIAR PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        cargarPortada();

        cargarAlojamientos();
    }
);
