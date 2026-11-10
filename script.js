// ==========================================================
// ESTANCIAS AGRADABLES - SCRIPT COMPLETO
// ==========================================================


// ==========================================================
// SUPABASE
// ==========================================================

const SUPABASE_URL =
    "https://caodorogvcpupdajtbbp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YxE6";

const clienteSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================================
// VARIABLES GENERALES
// ==========================================================

let alojamientoActual = null;

let fotosPortada = [];
let indicePortada = 0;
let intervaloPortada = null;

let fondoPortadaA = null;
let fondoPortadaB = null;
let fondoActivo = "A";
let indicadoresPortada = null;


// ==========================================================
// VARIABLES DEL VISOR DE FOTOS
// ==========================================================

let visorFotos = null;
let imagenVisor = null;
let contadorVisor = null;
let botonVisorAnterior = null;
let botonVisorSiguiente = null;

let fotosVisor = [];
let indiceVisor = 0;

let visorTouchInicio = 0;
let visorTouchFin = 0;


// ==========================================================
// VARIABLES DEL MODAL DE ALOJAMIENTO
// ==========================================================

let modalAlojamiento = null;
let modalAlojamientoFoto = null;
let modalAlojamientoContador = null;
let modalAlojamientoFotos = [];
let modalAlojamientoIndice = 0;

let modalTouchInicio = 0;
let modalTouchFin = 0;


// ==========================================================
// VARIABLES DEL CALENDARIO
// ==========================================================

let fechasBloqueadas = new Set();

let fechaIngresoSeleccionada = null;
let fechaSalidaSeleccionada = null;

let mesCalendarioActual = new Date();

let modoCalendario = "ingreso";

let disponibilidadVerificada = false;

let calendarioReserva = null;


// ==========================================================
// ESTILOS DEL MODAL DE ALOJAMIENTO
// ==========================================================

function insertarEstilosModalAlojamiento() {

    if (
        document.getElementById(
            "estilosModalAlojamiento"
        )
    ) {
        return;
    }

    const estilos =
        document.createElement("style");

    estilos.id =
        "estilosModalAlojamiento";

    estilos.textContent = `

        /* ==================================================
           INDICADORES DE FOTOS
           ================================================== */

        .modal-alojamiento-indicadores {
            position: absolute;
            bottom: 18px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 7px;
            z-index: 10;
        }

        .modal-alojamiento-punto {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: white;
            opacity: 0.45;
        }

        .modal-alojamiento-punto.activo {
            opacity: 1;
            transform: scale(1.25);
        }


        /* ==================================================
           DESPLAZAMIENTO DE LA FICHA
           ================================================== */

        .modal-alojamiento {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch;
            max-height: 100vh;
        }

        .modal-alojamiento-contenido {
            max-height: calc(100vh - 30px);
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch;
            box-sizing: border-box;
        }


        /* ==================================================
           ASEGURAR QUE EL FINAL DE LA FICHA SEA VISIBLE
           ================================================== */

        .modal-alojamiento-contenido::after {
            content: "";
            display: block;
            height: 40px;
            width: 100%;
        }


        /* ==================================================
           CELULAR
           ================================================== */

        @media (max-width: 600px) {

            .modal-alojamiento {
                align-items: flex-start !important;
                padding: 10px !important;
                overflow-y: auto !important;
            }

            .modal-alojamiento-contenido {
                width: 100%;
                max-height: calc(100vh - 20px);
                overflow-y: auto !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 30px;
            }

            .modal-alojamiento-indicadores {
                bottom: 12px;
            }

        }

    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// ESTILOS DEL CALENDARIO
// ==========================================================

function insertarEstilosCalendario() {

    if (
        document.getElementById(
            "estilosCalendarioReserva"
        )
    ) {
        return;
    }

    const estilos =
        document.createElement("style");

    estilos.id =
        "estilosCalendarioReserva";

    estilos.textContent = `

        #calendarioReserva {
            width: 100%;
            margin-top: 15px;
            margin-bottom: 15px;
            padding: 15px;
            box-sizing: border-box;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            background: #ffffff;
            display: none;
        }

        #calendarioReserva.visible {
            display: block;
        }

        .calendario-cabecera {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 12px;
        }

        .calendario-mes {
            font-size: 17px;
            font-weight: 700;
            text-align: center;
            flex: 1;
        }

        .calendario-nav {
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 50%;
            background: #f2f2f2;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .calendario-nav:hover {
            background: #e7e7e7;
        }

        .calendario-semana {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 3px;
            margin-bottom: 4px;
        }

        .calendario-dia-semana {
            text-align: center;
            font-size: 11px;
            font-weight: 700;
            color: #777;
            padding: 5px 0;
        }

        .calendario-dias {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
        }

        #calendarioDias.calendario-dos-meses {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .calendario-dias-mes {
            display: grid;
            grid-template-columns: repeat(7, minmax(0, 1fr));
            gap: 3px;
        }

        #calendarioReserva > .calendario-semana {
            display: none;
        }

        .calendario-titulo-mes {
            text-align: center;
            font-weight: 700;
            margin-bottom: 10px;
        }

        @media (max-width: 600px) {
            #calendarioDias.calendario-dos-meses {
                grid-template-columns: 1fr;
            }
        }

        .calendario-dia {
            width: 100%;
            aspect-ratio: 1 / 1;
            min-height: 36px;
            border: none;
            border-radius: 50%;
            background: transparent;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            transition: 0.15s;
        }

        .calendario-dia:hover:not(.bloqueado):not(.pasado) {
            background: #fce2c4;
        }

        .calendario-dia.vacio {
            cursor: default;
        }

        .calendario-dia.pasado {
            color: #c7c7c7;
            cursor: not-allowed;
        }

        .calendario-dia.bloqueado {
            background: #e2e2e2;
            color: #999;
            cursor: not-allowed;
            text-decoration: line-through;
        }

        .calendario-dia.hoy {
            border: 2px solid #f28c28;
        }

        .calendario-dia.en-rango {
            background: #fce8d5;
            border-radius: 0;
        }

        .calendario-dia.ingreso,
        .calendario-dia.salida {
            background: #f28c28;
            color: white;
            font-weight: 700;
            border-radius: 50%;
        }

        .calendario-dia.no-seleccionable {
            cursor: not-allowed;
        }

        .calendario-mensaje {
            margin-top: 12px;
            padding: 9px 10px;
            border-radius: 8px;
            background: #f7f7f7;
            color: #555;
            font-size: 13px;
            text-align: center;
        }

        .calendario-cargando {
            color: #777;
        }

        .calendario-leyenda {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 12px;
            font-size: 11px;
            color: #666;
        }

        .calendario-leyenda-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .calendario-leyenda-color {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            display: inline-block;
        }

        .calendario-leyenda-disponible {
            background: #fff;
            border: 1px solid #ccc;
        }

        .calendario-leyenda-bloqueado {
            background: #e2e2e2;
        }

        .calendario-leyenda-seleccionado {
            background: #f28c28;
        }

        .aviso-capacidad-reserva {
            margin-top: 7px;
            margin-bottom: 10px;
            font-size: 13px;
            color: #666;
        }

        .aviso-capacidad-reserva.advertencia {
            color: #b42318;
            font-weight: 600;
        }

        @media (max-width: 600px) {

            #calendarioReserva {
                padding: 10px;
            }

            .calendario-dia {
                min-height: 32px;
                font-size: 12px;
            }

            .calendario-dia-semana {
                font-size: 10px;
            }

            .calendario-mes {
                font-size: 15px;
            }

        }

    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// FUNCIONES DE FECHA
// ==========================================================

function convertirFechaISO(fecha) {

    const año =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    return (
        año +
        "-" +
        mes +
        "-" +
        dia
    );
}


function fechaDesdeISO(texto) {

    if (!texto) {
        return null;
    }

    return new Date(
        texto + "T00:00:00"
    );
}


function esFechaPasada(texto) {

    const hoy =
        new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );

    const fecha =
        fechaDesdeISO(texto);

    return fecha < hoy;
}


function sumarDias(
    fecha,
    cantidad
) {

    const nuevaFecha =
        new Date(fecha);

    nuevaFecha.setDate(
        nuevaFecha.getDate() +
        cantidad
    );

    return nuevaFecha;
}


function diferenciaDias(
    fechaInicial,
    fechaFinal
) {

    const inicio =
        fechaDesdeISO(
            fechaInicial
        );

    const final =
        fechaDesdeISO(
            fechaFinal
        );

    return Math.round(
        (
            final -
            inicio
        ) /
        (
            1000 *
            60 *
            60 *
            24
        )
    );
}


// ==========================================================
// PORTADA
// ==========================================================

async function obtenerFotosPortada() {

    const resultado =
        await clienteSupabase
            .storage
            .from(
                "fotos-alojamientos"
            )
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

    if (
        resultado.error
    ) {

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

    const archivosImagen =
        resultado.data.filter(
            function(archivo) {

                if (
                    !archivo.name
                ) {
                    return false;
                }

                const nombre =
                    archivo.name.toLowerCase();

                return extensionesImagen.some(
                    function(extension) {

                        return nombre.endsWith(
                            extension
                        );

                    }
                );

            }
        );

    return archivosImagen.map(
        function(archivo) {

            const ruta =
                "portada/" +
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
    ).filter(
        function(url) {

            return url !== null;

        }
    );
}


async function cargarPortada() {

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

    indicePortada =
        0;

    fondoActivo =
        "A";

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


function crearIndicadoresPortada() {

    if (
        !indicadoresPortada
    ) {
        return;
    }

    indicadoresPortada.innerHTML =
        "";

    const cantidad =
        Math.min(
            fotosPortada.length,
            3
        );

    for (
        let i = 0;
        i < cantidad;
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

        indicePortada =
            0;
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

        fondoActivo =
            "B";

    } else {

        fondoPortadaA.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoPortadaA.style.opacity =
            "1";

        fondoPortadaB.style.opacity =
            "0";

        fondoActivo =
            "A";
    }

    actualizarIndicadoresPortada();
}


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

    const cantidad =
        puntos.length;

    if (
        cantidad === 0
    ) {
        return;
    }

    puntos.forEach(
        function(punto, indice) {

            const posicion =
                Math.floor(
                    (
                        indicePortada /
                        fotosPortada.length
                    ) *
                    cantidad
                );

            punto.classList.toggle(
                "activo",
                indice === posicion
            );

        }
    );
}


// ==========================================================
// OBTENER FOTOS DE ALOJAMIENTO
// ==========================================================

async function obtenerFotos(
    alojamientoId
) {

    const resultado =
        await clienteSupabase
            .storage
            .from(
                "fotos-alojamientos"
            )
            .list(
                alojamientoId,
                {
                    limit: 100,

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

        return [];
    }

    const archivosImagen =
        resultado.data.filter(
            function(archivo) {

                if (
                    !archivo.id
                ) {
                    return false;
                }

                if (
                    archivo.metadata &&
                    archivo.metadata.mimetype
                ) {

                    return archivo.metadata
                        .mimetype
                        .startsWith(
                            "image/"
                        );
                }

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

    return archivosImagen.map(
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
    ).filter(
        function(url) {

            return url !== null;

        }
    );
}


// ==========================================================
// VISOR DE FOTOGRAFÍAS
// ==========================================================

function crearVisorFotos() {

    insertarEstilosVisor();

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


    // ======================================================
    // DESLIZAMIENTO CON DEDO Y MOUSE
    // ======================================================

    let inicioXVisor = 0;
    let inicioYVisor = 0;
    let desplazamientoVisor = 0;
    let arrastrandoVisor = false;
    let direccionVisor = 0;
    let imagenVecinaVisor = null;
    let punteroVisor = null;
    let animandoVisor = false;

    imagenVisor.draggable = false;

    function eliminarVecinaVisor() {
        if (imagenVecinaVisor) {
            imagenVecinaVisor.remove();
            imagenVecinaVisor = null;
        }
    }

    function crearVecinaVisor(sentido) {
        eliminarVecinaVisor();

        const total = fotosVisor.length;
        if (total < 2) return;

        const indice = (
            indiceVisor + sentido + total
        ) % total;

        imagenVecinaVisor = imagenVisor.cloneNode(false);
        imagenVecinaVisor.src = fotosVisor[indice];
        imagenVecinaVisor.style.transition = "none";

        contenido.appendChild(imagenVecinaVisor);
    }

    contenido.addEventListener("pointerdown", function(evento) {
        if (
            animandoVisor ||
            fotosVisor.length < 2 ||
            (evento.pointerType === "mouse" && evento.button !== 0)
        ) return;

        punteroVisor = evento.pointerId;
        inicioXVisor = evento.clientX;
        inicioYVisor = evento.clientY;
        desplazamientoVisor = 0;
        direccionVisor = 0;
        arrastrandoVisor = true;

        imagenVisor.style.transition = "none";
    });

    contenido.addEventListener("pointermove", function(evento) {
        if (
            !arrastrandoVisor ||
            evento.pointerId !== punteroVisor
        ) return;

        const deltaX = evento.clientX - inicioXVisor;
        const deltaY = evento.clientY - inicioYVisor;

        if (
            Math.abs(deltaY) > Math.abs(deltaX) &&
            Math.abs(deltaX) < 10
        ) return;

        desplazamientoVisor = deltaX;

        if (Math.abs(deltaX) < 5) return;

        const sentido = deltaX < 0 ? 1 : -1;

        if (direccionVisor !== sentido) {
            direccionVisor = sentido;
            crearVecinaVisor(sentido);
        }

        const ancho = contenido.clientWidth;

        imagenVisor.style.transform =
            `translateX(${deltaX}px)`;

        if (imagenVecinaVisor) {
            imagenVecinaVisor.style.transform =
                `translateX(${deltaX + sentido * ancho}px)`;
        }
    });

    function terminarArrastreVisor(evento) {
        if (
            !arrastrandoVisor ||
            evento.pointerId !== punteroVisor
        ) return;

        arrastrandoVisor = false;
        punteroVisor = null;

        const ancho = contenido.clientWidth;

        const cambiar =
            Math.abs(desplazamientoVisor) > ancho * 0.15 &&
            direccionVisor !== 0;

        const duracion = 280;
        const transicion =
            `transform ${duracion}ms ease-out`;

        imagenVisor.style.transition = transicion;

        if (imagenVecinaVisor) {
            imagenVecinaVisor.style.transition = transicion;
        }

        animandoVisor = true;

        if (cambiar) {
            const sentido = direccionVisor;

            imagenVisor.style.transform =
                `translateX(${-sentido * ancho}px)`;

            if (imagenVecinaVisor) {
                imagenVecinaVisor.style.transform =
                    "translateX(0px)";
            }

            setTimeout(function() {
                const total = fotosVisor.length;

                indiceVisor = (
                    indiceVisor + sentido + total
                ) % total;

                imagenVisor.style.transition = "none";
                imagenVisor.src = fotosVisor[indiceVisor];
                imagenVisor.style.transform = "translateX(0px)";

                contadorVisor.textContent =
                    `${indiceVisor + 1} / ${total}`;

                eliminarVecinaVisor();
                animandoVisor = false;
            }, duracion);

        } else {
            imagenVisor.style.transform = "translateX(0px)";

            if (imagenVecinaVisor) {
                imagenVecinaVisor.style.transform =
                    `translateX(${direccionVisor * ancho}px)`;
            }

            setTimeout(function() {
                imagenVisor.style.transition = "none";
                imagenVisor.style.transform = "translateX(0px)";
                eliminarVecinaVisor();
                animandoVisor = false;
            }, duracion);
        }
    }

    contenido.addEventListener("pointerup", terminarArrastreVisor);
    contenido.addEventListener("pointercancel", terminarArrastreVisor);

    contenido.addEventListener("dragstart", function(evento) {
        evento.preventDefault();
    });

    document.body.appendChild(
        visorFotos
    );
}

// FIN DE LA PARTE 1 DE 5

function abrirVisorFotos(
    fotos,
    indice
) {

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


function cerrarVisorFotos() {

    if (
        !visorFotos
    ) {
        return;
    }

    visorFotos.classList.remove(
        "visor-visible"
    );

    sincronizarScroll();
}


function cambiarFotoVisor(nuevoIndice) {

    if (
        !fotosVisor ||
        fotosVisor.length < 2 ||
        !imagenVisor ||
        !contadorVisor
    ) {
        return;
    }

    const total = fotosVisor.length;

    nuevoIndice = (
        (nuevoIndice % total) + total
    ) % total;

    if (nuevoIndice === indiceVisor) {
        return;
    }

    const contenido = imagenVisor.parentElement;

    // Evitar animaciones simultáneas.
    if (contenido.dataset.animando === "true") {
        return;
    }

    // No iniciar una animación mientras se arrastra.
    if (
        imagenVisor.style.transform &&
        imagenVisor.style.transform !== "translateX(0px)"
    ) {
        return;
    }

    const direccion =
        nuevoIndice === (indiceVisor + 1) % total
            ? 1
            : -1;

    const ancho = contenido.clientWidth;

    const imagenSiguiente = imagenVisor.cloneNode(false);

    imagenSiguiente.src = fotosVisor[nuevoIndice];
    imagenSiguiente.style.transition = "none";
    imagenSiguiente.style.transform =
        `translateX(${direccion * ancho}px)`;

    contenido.dataset.animando = "true";

    const precarga = new Image();

    let iniciada = false;

    function iniciarAnimacion() {
        if (iniciada) return;
        iniciada = true;

        contenido.appendChild(imagenSiguiente);

        // Establecer la posición inicial antes de animar.
        imagenSiguiente.getBoundingClientRect();

        const transicion =
            "transform 280ms cubic-bezier(.22,1,.36,1)";

        imagenVisor.style.transition = transicion;
        imagenSiguiente.style.transition = transicion;

        imagenVisor.style.transform =
            `translateX(${-direccion * ancho}px)`;

        imagenSiguiente.style.transform = "translateX(0px)";

        imagenSiguiente.addEventListener(
            "transitionend",
            function finalizar(evento) {

                if (evento.propertyName !== "transform") {
                    return;
                }

                indiceVisor = nuevoIndice;

                imagenVisor.style.transition = "none";
                imagenVisor.src = fotosVisor[indiceVisor];
                imagenVisor.style.transform = "translateX(0px)";

                contadorVisor.textContent =
                    `${indiceVisor + 1} / ${total}`;

                imagenSiguiente.remove();

                contenido.dataset.animando = "false";
            },
            { once: true }
        );
    }

    precarga.onload = iniciarAnimacion;

    precarga.onerror = function() {
        contenido.dataset.animando = "false";
    };

    precarga.src = fotosVisor[nuevoIndice];

    if (precarga.complete && precarga.naturalWidth > 0) {
        iniciarAnimacion();
        precarga.onload = null;
    }
}


function actualizarVisor() {

    if (
        !imagenVisor ||
        !contadorVisor ||
        !fotosVisor.length
    ) {
        return;
    }

    imagenVisor.src =
        fotosVisor[
            indiceVisor
        ];

    contadorVisor.textContent =
        (
            indiceVisor + 1
        ) +
        " / " +
        fotosVisor.length;
}


// ==========================================================
// CERRAR MODAL DEL ALOJAMIENTO
// ==========================================================

function cerrarModalAlojamiento() {

    const modal =
        document.getElementById(
            "modalAlojamiento"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "modal-alojamiento-visible"
    );

    sincronizarScroll();
}


// ==========================================================
// CREAR MODAL DEL ALOJAMIENTO
// ==========================================================

function crearModalAlojamiento() {

    insertarEstilosModalAlojamiento();

    // Si ya existe, solamente recuperamos
    // las referencias y no lo creamos otra vez.
    const modalExistente =
        document.getElementById(
            "modalAlojamiento"
        );

    if (modalExistente) {

        modalAlojamiento =
            modalExistente;

        modalAlojamientoFoto =
            document.getElementById(
                "modalAlojamientoFoto"
            );

        modalAlojamientoContador =
            document.getElementById(
                "modalAlojamientoContador"
            );

        return;
    }


    // ======================================================
    // CREAR ESTRUCTURA
    // ======================================================

    modalAlojamiento =
        document.createElement(
            "div"
        );

    modalAlojamiento.id =
        "modalAlojamiento";

    modalAlojamiento.innerHTML = `

        <div class="modal-alojamiento-contenido">

            <!-- CERRAR VENTANA -->
            <button
                type="button"
                class="modal-alojamiento-cerrar"
                id="cerrarModalAlojamiento"
                aria-label="Cerrar"
            >
                ×
            </button>

            <!-- ENCABEZADO -->
            <div class="modal-ficha-encabezado">

                <h2 id="modalAlojamientoNombre"></h2>

                <p
                    id="modalAlojamientoUbicacion"
                    class="modal-ubicacion"
                ></p>

            </div>

            <!-- GALERÍA DE FOTOGRAFÍAS -->
            <div class="modal-galeria-grid">

                <!-- FOTOGRAFÍA PRINCIPAL -->
                <div class="modal-alojamiento-galeria">

                    <img
                        id="modalAlojamientoFoto"
                        class="modal-alojamiento-foto"
                        alt="Fotografía del alojamiento"
                    >

                    <button
                        type="button"
                        class="modal-alojamiento-flecha modal-alojamiento-anterior"
                        id="modalAlojamientoAnterior"
                        aria-label="Fotografía anterior"
                    >
                        &#10094;
                    </button>

                    <button
                        type="button"
                        class="modal-alojamiento-flecha modal-alojamiento-siguiente"
                        id="modalAlojamientoSiguiente"
                        aria-label="Fotografía siguiente"
                    >
                        &#10095;
                    </button>

                    <button
                        type="button"
                        class="modal-ver-todas-fotos"
                        id="modalVerTodasFotos"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                            ></rect>
                            <circle
                                cx="8.5"
                                cy="8.5"
                                r="1.5"
                            ></circle>
                            <path d="m21 15-5-5L5 21"></path>
                        </svg>

                        <span>Ver todas las fotos</span>
                    </button>

                </div>

                <!-- FOTOGRAFÍAS SECUNDARIAS -->
                <div class="modal-galeria-secundarias">

                    <img
                        id="modalFotoSecundaria1"
                        class="modal-foto-secundaria"
                        alt="Fotografía adicional del alojamiento"
                    >

                    <img
                        id="modalFotoSecundaria2"
                        class="modal-foto-secundaria"
                        alt="Otra fotografía del alojamiento"
                    >

                </div>

            </div>

            <!-- CARACTERÍSTICAS -->
            <div
                id="modalAlojamientoDatos"
                class="modal-datos"
            ></div>

            <!-- INFORMACIÓN Y RESERVACIÓN -->
            <div class="modal-ficha-columnas">

                <div class="modal-alojamiento-informacion">

                    <h3>Descripción</h3>

                    <div
                        id="modalAlojamientoDescripcion"
                        class="modal-descripcion"
                    ></div>

                </div>

                <!-- PANEL DE RESERVACIÓN -->
                <aside class="modal-ficha-reserva">

                    <!-- PRECIO POR NOCHE -->
                    <div class="modal-precio">
                        <strong id="modalAlojamientoPrecio"></strong>
                        <span>/ noche</span>
                    </div>

                    <!-- FECHAS DE ENTRADA Y SALIDA -->
                    <div class="reserva-fechas">

                        <button
                            type="button"
                            class="reserva-campo-fecha"
                            id="reservaEntradaTarjeta"
                        >
                            <span class="reserva-etiqueta">
                                ENTRADA
                            </span>

                            <span
                                class="reserva-valor"
                                id="reservaEntradaTexto"
                            >
                                Seleccionar fecha
                            </span>
                        </button>

                        <button
                            type="button"
                            class="reserva-campo-fecha"
                            id="reservaSalidaTarjeta"
                        >
                            <span class="reserva-etiqueta">
                                SALIDA
                            </span>

                            <span
                                class="reserva-valor"
                                id="reservaSalidaTexto"
                            >
                                Seleccionar fecha
                            </span>
                        </button>

                    </div>

                    <!-- SELECTOR DE HUÉSPEDES -->
                    <div class="reserva-huespedes-contenedor">

                        <button
                            type="button"
                            class="reserva-huespedes-boton"
                            id="reservaHuespedesTarjeta"
                            aria-expanded="false"
                        >
                            <span>
                                <span class="reserva-etiqueta">
                                    HUÉSPEDES
                                </span>

                                <span
                                    class="reserva-valor"
                                    id="reservaHuespedesTexto"
                                >
                                    2 personas
                                </span>
                            </span>

                            <i data-lucide="chevron-down"></i>
                        </button>

                        <div
                            class="reserva-huespedes-menu"
                            id="reservaHuespedesMenu"
                            hidden
                        ></div>

                    </div>

                    <!-- BOTÓN DE DISPONIBILIDAD -->
                    <button
                        type="button"
                        class="modal-boton-reserva"
                        id="modalAlojamientoReservar"
                    >
                        Ver disponibilidad
                    </button>

                    <!-- NOTA DE CONFIRMACIÓN -->
                    <p class="modal-reserva-nota">
                        La reservación se confirma
                        con el 50% del total.
                    </p>

                </aside>

            </div>

        </div>
    `;

    modalAlojamiento.className =
        "modal-alojamiento";

    document.body.appendChild(
        modalAlojamiento
    );


    // ======================================================
    // REFERENCIAS
    // ======================================================

    modalAlojamientoFoto =
        document.getElementById(
            "modalAlojamientoFoto"
        );

    modalAlojamientoContador =
        document.getElementById(
            "modalAlojamientoContador"
        );

    const botonCerrar =
        document.getElementById(
            "cerrarModalAlojamiento"
        );

    const botonAnterior =
        document.getElementById(
            "modalAlojamientoAnterior"
        );

    const botonSiguiente =
        document.getElementById(
            "modalAlojamientoSiguiente"
        );

    const botonReservar =
        document.getElementById(
            "modalAlojamientoReservar"
        );


    // ======================================================
    // CAMPOS DE FECHAS EN LA TARJETA
    // ======================================================

    const botonEntradaTarjeta =
        document.getElementById(
            "reservaEntradaTarjeta"
        );

    const botonSalidaTarjeta =
        document.getElementById(
            "reservaSalidaTarjeta"
        );


    async function abrirCalendarioDesdeTarjeta(tipo) {

        if (!alojamientoActual) {
            return;
        }

        const panel = document.getElementById(
            "calendarioFlotanteTarjeta"
        );

        const contenido = document.getElementById(
            "calendarioTarjetaContenido"
        );

        if (!panel || !contenido) {
            console.error(
                "No se encontró el calendario flotante."
            );
            return;
        }

        // Ubicar el calendario entre Huéspedes y Ver disponibilidad.
        const botonDisponibilidad = document.getElementById(
            "modalAlojamientoReservar"
        );

        if (botonDisponibilidad) {
            botonDisponibilidad.before(panel);
        }

        // Recuperar el calendario existente.
        configurarCalendarioReserva();

        if (!calendarioReserva) {
            return;
        }

        // Colocar el calendario dentro de la ficha.
        contenido.appendChild(calendarioReserva);

        // Establecer el tipo de fecha.
        modoCalendario =
            tipo === "salida" && fechaIngresoSeleccionada
                ? "salida"
                : "ingreso";

        // Mostrar el calendario.
        panel.hidden = false;
        panel.style.removeProperty("display");

        console.log("Calendario abierto:", {
            existe: !!panel,
            oculto: panel.hidden,
            display: getComputedStyle(panel).display
        });

        mostrarCalendario();
        await cargarDisponibilidad();

        // Actualizar las fechas visibles.
        actualizarFechasTarjeta();
    }


    if (botonEntradaTarjeta) {

        botonEntradaTarjeta.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                abrirCalendarioDesdeTarjeta(
                    "ingreso"
                );
            }
        );
    }

    if (botonSalidaTarjeta) {

        botonSalidaTarjeta.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                abrirCalendarioDesdeTarjeta(
                    "salida"
                );
            }
        );
    }


    // ======================================================
    // BOTÓN CERRAR
    // ======================================================

    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                cerrarModalAlojamiento();
            }
        );
    }


    // ======================================================
    // FOTOGRAFÍA ANTERIOR
    // ======================================================

    if (botonAnterior) {

        botonAnterior.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                cambiarFotoModalAlojamiento(
                    modalAlojamientoIndice - 1
                );
            }
        );
    }


    // ======================================================
    // FOTOGRAFÍA SIGUIENTE
    // ======================================================

    if (botonSiguiente) {

        botonSiguiente.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                cambiarFotoModalAlojamiento(
                    modalAlojamientoIndice + 1
                );
            }
        );
    }


    // ======================================================
    // BOTÓN SOLICITAR RESERVA
    // ======================================================

    if (botonReservar) {

        botonReservar.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                if (!alojamientoActual) {
                    return;
                }

                const alojamientoParaReserva =
                    alojamientoActual;

                cerrarModalAlojamiento();

                const ingreso =
                    fechaIngresoSeleccionada;

                const salida =
                    fechaSalidaSeleccionada;

                const cantidad =
                    document.getElementById("personas")?.value || "2";

                abrirReserva(alojamientoParaReserva).then(function() {

                    fechaIngresoSeleccionada = ingreso;
                    fechaSalidaSeleccionada = salida;

                    document.getElementById("fechaIngreso").value =
                        ingreso || "";

                    document.getElementById("fechaSalida").value =
                        salida || "";

                    document.getElementById("personas").value =
                        cantidad;

                    procesarCantidadPersonas();
                    renderizarCalendario();
                });
            }
        );
    }


    // ======================================================
    // CERRAR HACIENDO CLICK EN EL FONDO
    // ======================================================

    modalAlojamiento.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target ===
                modalAlojamiento
            ) {

                cerrarModalAlojamiento();
            }
        }
    );


    // ======================================================
    // BOTÓN VER TODAS LAS FOTOS
    // ======================================================

    const botonVerTodasFotos =
        document.getElementById("modalVerTodasFotos");

    if (botonVerTodasFotos) {

        botonVerTodasFotos.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                if (!modalAlojamientoFotos.length) return;

                abrirVisorFotos(
                    modalAlojamientoFotos,
                    modalAlojamientoIndice
                );
            }
        );
    }


    // ======================================================
    // GALERÍA PRINCIPAL: ARRASTRE CON MOUSE Y DEDO
    // ======================================================

    const galeria = modalAlojamiento.querySelector(
        ".modal-alojamiento-galeria"
    );

    if (galeria) {

        const fotoPrincipal = document.getElementById(
            "modalAlojamientoFoto"
        );

        let inicioX = 0;
        let inicioY = 0;
        let desplazamientoX = 0;
        let arrastrando = false;
        let direccion = 0;
        let imagenVecina = null;
        let animando = false;
        let pointerActivo = null;

        // Evita que el navegador arrastre la imagen.
        fotoPrincipal.draggable = false;
        fotoPrincipal.style.userSelect = "none";
        fotoPrincipal.style.touchAction = "pan-y";
        galeria.style.touchAction = "pan-y";

        function eliminarImagenVecina() {
            if (imagenVecina) {
                imagenVecina.remove();
                imagenVecina = null;
            }
        }

        function crearImagenVecina(sentido) {

            eliminarImagenVecina();

            const total = modalAlojamientoFotos.length;

            if (total < 2) return;

            const indice = (
                modalAlojamientoIndice + sentido + total
            ) % total;

            imagenVecina = document.createElement("img");
            imagenVecina.src = modalAlojamientoFotos[indice];
            imagenVecina.alt = "Fotografía del alojamiento";
            imagenVecina.draggable = false;

            Object.assign(imagenVecina.style, {
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
                userSelect: "none",
                transition: "none",
                transform: "translateX(" + (sentido * 100) + "%)"
            });

            // Se coloca en el mismo contenedor que la foto principal.
            fotoPrincipal.parentElement.appendChild(imagenVecina);
        }

        function iniciarArrastre(evento) {

            if (
                animando ||
                modalAlojamientoFotos.length < 2 ||
                evento.target.closest("button")
            ) {
                return;
            }

            if (
                evento.pointerType === "mouse" &&
                evento.button !== 0
            ) {
                return;
            }

            pointerActivo = evento.pointerId;
            inicioX = evento.clientX;
            inicioY = evento.clientY;
            desplazamientoX = 0;
            direccion = 0;
            arrastrando = true;

            fotoPrincipal.style.transition = "none";
        }

        function moverArrastre(evento) {

            if (
                !arrastrando ||
                evento.pointerId !== pointerActivo
            ) {
                return;
            }

            const deltaX = evento.clientX - inicioX;
            const deltaY = evento.clientY - inicioY;

            // Permite desplazarse verticalmente por la página.
            if (
                Math.abs(deltaY) > Math.abs(deltaX) &&
                Math.abs(deltaX) < 10
            ) {
                return;
            }

            desplazamientoX = deltaX;

            if (Math.abs(desplazamientoX) < 5) return;

            const nuevoSentido =
                desplazamientoX < 0 ? 1 : -1;

            if (direccion !== nuevoSentido) {
                direccion = nuevoSentido;
                crearImagenVecina(direccion);
            }

            const ancho =
                fotoPrincipal.parentElement.clientWidth;

            fotoPrincipal.style.transform =
                "translateX(" + desplazamientoX + "px)";

            if (imagenVecina) {
                imagenVecina.style.transform =
                    "translateX(" +
                    (desplazamientoX + direccion * ancho) +
                    "px)";
            }
        }

        function terminarArrastre(evento) {

            if (
                !arrastrando ||
                evento.pointerId !== pointerActivo
            ) {
                return;
            }

            arrastrando = false;
            pointerActivo = null;

            const ancho =
                fotoPrincipal.parentElement.clientWidth;

            const cambiar =
                Math.abs(desplazamientoX) > ancho * 0.2 &&
                direccion !== 0;

            const duracion = 280;

            const transicion =
                "transform " +
                duracion +
                "ms cubic-bezier(.22,1,.36,1)";

            fotoPrincipal.style.transition =
                transicion;

            if (imagenVecina) {
                imagenVecina.style.transition =
                    transicion;
            }

            animando = true;

            if (cambiar) {

                const sentidoFinal = direccion;

                fotoPrincipal.style.transform =
                    "translateX(" +
                    (-sentidoFinal * ancho) +
                    "px)";

                if (imagenVecina) {
                    imagenVecina.style.transform =
                        "translateX(0px)";
                }

                setTimeout(function() {

                    cambiarFotoModalAlojamiento(
                        modalAlojamientoIndice + sentidoFinal
                    );

                    fotoPrincipal.style.transition = "none";
                    fotoPrincipal.style.transform = "";

                    eliminarImagenVecina();
                    animando = false;

                }, duracion);

            } else {

                fotoPrincipal.style.transform =
                    "translateX(0px)";

                if (imagenVecina) {
                    imagenVecina.style.transform =
                        "translateX(" +
                        (direccion * ancho) +
                        "px)";
                }

                setTimeout(function() {

                    fotoPrincipal.style.transition = "";
                    fotoPrincipal.style.transform = "";

                    eliminarImagenVecina();
                    animando = false;

                }, duracion);
            }
        }

        galeria.addEventListener(
            "pointerdown",
            iniciarArrastre
        );

        galeria.addEventListener(
            "pointermove",
            moverArrastre
        );

        galeria.addEventListener(
            "pointerup",
            terminarArrastre
        );

        galeria.addEventListener(
            "pointercancel",
            terminarArrastre
        );

        galeria.addEventListener(
            "dragstart",
            function(evento) {
                evento.preventDefault();
            }
        );
    }
}


// ==========================================================
// MOSTRAR AMENIDADES DEL ALOJAMIENTO
// ==========================================================

function mostrarAmenidadesAlojamiento(alojamiento) {
    if (typeof mostrarDistribucionHabitacionesEA === "function") {
        mostrarDistribucionHabitacionesEA(alojamiento);
    }
    mostrarDistribucionHabitacionesEA(alojamiento);
    const descripcion = document.getElementById(
        "modalAlojamientoDescripcion"
    );

    if (!descripcion) return;

    descripcion.querySelector(".ea-amenidades")?.remove();
    descripcion.querySelector(".modal-amenidades")?.remove();

    let datos = alojamiento.amenidades;

    if (typeof datos === "string") {
        try {
            datos = JSON.parse(datos);
        } catch {
            return;
        }
    }

    if (!datos || typeof datos !== "object") return;

    const clave = nombre => nombre.trim().toLowerCase().normalize("NFC");
    const grupos = Array.isArray(datos) ? { servicios: datos } : datos;
    const amenidades = new Map();

    const iconosPorGrupo = {
        bano: "shower-head",
        habitacion: "bed",
        entretenimiento: "tv",
        climatizacion: "snowflake",
        seguridad: "shield-check",
        internet: "wifi",
        cocina: "utensils",
        estacionamiento: "car-front",
        piscina: "waves",
        exterior: "umbrella",
        trabajo: "laptop",
        mascotas: "paw-print"
    };

    const iconosPorNombre = {
        "wifi": "wifi",
        "aire acondicionado": "snowflake",
        "piscina privada": "waves",
        "piscina compartida": "waves",
        "smart tv": "tv",
        "agua caliente": "shower-head",
        "patio o terraza": "umbrella",
        "área de estar": "armchair",
        "área de trabajo": "laptop",
        "se admiten mascotas": "paw-print",
        "cámaras de seguridad exteriores": "camera",
        "lavadora": "washing-machine",
        "cafetera": "coffee",
        "refrigeradora": "refrigerator",
        "microondas": "microwave",
        "llegada autónoma": "key-round",
        "jardín": "trees"
    };

    for (const [grupo, valores] of Object.entries(grupos)) {
        if (grupo === "_destacadas" || !Array.isArray(valores)) continue;

        for (const valor of valores) {
            if (typeof valor !== "string" || !valor.trim()) continue;

            const nombre = valor.trim();
            const id = clave(nombre);

            if (amenidades.has(id)) continue;

            amenidades.set(id, {
                nombre,
                icono: iconosPorNombre[id] ||
                    iconosPorGrupo[grupo] ||
                    "circle-check"
            });
        }
    }

    if (!amenidades.size) return;

    // Los anuncios antiguos muestran hasta 10 amenidades
    // mientras aún no tengan una selección guardada.
    const elegidas = Array.isArray(grupos._destacadas)
        ? [...new Set(grupos._destacadas
            .filter(nombre => typeof nombre === "string")
            .map(clave))]
            .filter(id => amenidades.has(id))
            .slice(0, 10)
        : [...amenidades.keys()].slice(0, 10);

    const destacadas = new Set(elegidas);
    const restantes = [...amenidades.keys()].filter(
        id => !destacadas.has(id)
    );

    const seccion = document.createElement("section");
    seccion.className = "ea-amenidades";

    const titulo = document.createElement("h3");
    titulo.textContent = "Amenidades";

    const cuadricula = document.createElement("div");
    cuadricula.id = "eaAmenidadesCuadricula";
    cuadricula.className = "ea-amenidades-cuadricula";

    const tarjetasOcultas = [];

    for (const id of [...elegidas, ...restantes]) {
        const { nombre, icono } = amenidades.get(id);
        const tarjeta = document.createElement("div");
        tarjeta.className = "ea-amenidad-ficha";
        tarjeta.hidden = !destacadas.has(id);

        const dibujo = document.createElement("i");
        dibujo.setAttribute("data-lucide", icono);
        dibujo.setAttribute("aria-hidden", "true");

        const etiqueta = document.createElement("span");
        etiqueta.textContent = nombre;

        tarjeta.append(dibujo, etiqueta);
        cuadricula.appendChild(tarjeta);

        if (tarjeta.hidden) tarjetasOcultas.push(tarjeta);
    }

    seccion.append(titulo, cuadricula);

    if (tarjetasOcultas.length) {
        const boton = document.createElement("button");
        const textoVerTodas = `Ver todas las amenidades (${amenidades.size})`;

        boton.type = "button";
        boton.className = "ea-amenidades-toggle";
        boton.textContent = textoVerTodas;
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-controls", cuadricula.id);

        boton.addEventListener("click", function() {
            const abrir = boton.getAttribute("aria-expanded") === "false";

            tarjetasOcultas.forEach(function(tarjeta) {
                tarjeta.hidden = !abrir;
            });

            boton.setAttribute("aria-expanded", String(abrir));
            boton.textContent = abrir ? "Ver menos amenidades" : textoVerTodas;
        });

        seccion.appendChild(boton);
    }

    if (!document.getElementById("estilosAmenidadesEA")) {
        const estilos = document.createElement("style");
        estilos.id = "estilosAmenidadesEA";

        estilos.textContent = `
            #modalAlojamiento .ea-amenidades {
                margin-top: 24px;
            }

            #modalAlojamiento .ea-amenidades > h3 {
                margin: 0 0 12px;
                color: #103e42;
            }

            #modalAlojamiento .ea-amenidades-cuadricula {
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 10px;
            }

            #modalAlojamiento .ea-amenidad-ficha {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 94px;
                padding: 10px 5px;
                box-sizing: border-box;
                border: 1px solid #e3eceb;
                border-radius: 12px;
                background: #fff;
                box-shadow: 0 2px 6px rgba(16, 62, 66, .06);
                color: #103e42;
                text-align: center;
                font-size: 12px;
                line-height: 1.3;
                overflow-wrap: anywhere;
            }

            #modalAlojamiento .ea-amenidad-ficha svg {
                width: 27px;
                height: 27px;
                flex-shrink: 0;
                color: #17626a;
                stroke-width: 1.8;
            }

            #modalAlojamiento .ea-amenidad-ficha[hidden] {
                display: none !important;
            }

            #modalAlojamiento .ea-amenidades-toggle {
                margin-top: 14px;
                padding: 9px 14px;
                border: 1px solid #c8dfdd;
                border-radius: 9px;
                background: #fff;
                color: #103e42;
                font: inherit;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
            }

            @media (max-width: 850px) {
                #modalAlojamiento .ea-amenidades-cuadricula {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                }
            }

            @media (max-width: 360px) {
                #modalAlojamiento .ea-amenidades-cuadricula {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }
        `;

        document.head.appendChild(estilos);
    }

    descripcion.appendChild(seccion);
    window.lucide?.createIcons?.();
}

// ==========================================================
// CARACTERÍSTICAS PRINCIPALES DEL ALOJAMIENTO
// ==========================================================

const CARACTERISTICAS_PUBLICAS = {
    huespedes: [
        "users-round",
        "Huéspedes",
        "max_huespedes"
    ],

    habitaciones: [
        "bed-double",
        "Habitaciones",
        "habitaciones"
    ],

    camas: [
        "bed",
        "Camas",
        "camas"
    ],

    banos: [
        "shower-head",
        "Baños",
        "banos"
    ],

    alojamiento_entero: [
        "house",
        "Alojamiento entero"
    ],

    habitacion_privada: [
        "door-closed",
        "Habitación privada"
    ],

    aire_acondicionado: [
        "snowflake",
        "Aire acondicionado"
    ],

    wifi: [
        "wifi",
        "Wifi"
    ],

    cocina_equipada: [
        "cooking-pot",
        "Cocina equipada"
    ],

    television: [
        "tv",
        "Televisión"
    ],

    lavadora: [
        "washing-machine",
        "Lavadora"
    ],

    espacio_trabajo: [
        "laptop",
        "Espacio de trabajo"
    ],

    piscina_privada: [
        "waves",
        "Piscina privada"
    ],

    piscina_compartida: [
        "waves",
        "Piscina compartida"
    ],

    estacionamiento: [
        "car-front",
        "Estacionamiento"
    ],

    jardin: [
        "trees",
        "Jardín"
    ],

    terraza: [
        "sun",
        "Terraza"
    ],

    vista_mar: [
        "sailboat",
        "Vista al mar"
    ],

    mascotas: [
        "paw-print",
        "Mascotas permitidas"
    ],

    entrada_autonoma: [
        "key-round",
        "Entrada autónoma"
    ],

    seguridad: [
        "shield-check",
        "Seguridad"
    ],

    acceso_sin_gradas: [
        "accessibility",
        "Acceso sin gradas"
    ],

    familias: [
        "users",
        "Ideal para familias"
    ],

    estancias_largas: [
        "calendar-days",
        "Estancias largas"
    ]
};


function mostrarCaracteristicasPrincipales(alojamiento) {

    const contenedor =
        document.getElementById("modalAlojamientoDatos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const seleccionadas =
        alojamiento.caracteristicas_principales;

    if (!Array.isArray(seleccionadas)) {
        contenedor.style.display = "none";
        return;
    }

    const caracteristicas = seleccionadas
        .filter(id => CARACTERISTICAS_PUBLICAS[id])
        .slice(0, 6);

    if (caracteristicas.length === 0) {
        contenedor.style.display = "none";
        return;
    }

    contenedor.style.display = "grid";

    caracteristicas.forEach(id => {

        const informacion =
            CARACTERISTICAS_PUBLICAS[id];

        const icono =
            informacion[0];

        let texto =
            informacion[1];

        if (informacion[2]) {

            const cantidad =
                Number(alojamiento[informacion[2]]) || 0;

            texto =
                cantidad + " " + texto.toLowerCase();
        }

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "modal-caracteristica-tarjeta";

        // ÍCONO VECTORIAL LUCIDE.
        const elementoIcono =
            document.createElement("span");

        elementoIcono.className =
            "modal-caracteristica-icono";

        const iconoVectorial =
            document.createElement("i");

        iconoVectorial.setAttribute(
            "data-lucide",
            icono
        );

        elementoIcono.appendChild(
            iconoVectorial
        );

        // TEXTO DE LA CARACTERÍSTICA.
        const elementoTexto =
            document.createElement("span");

        elementoTexto.className =
            "modal-caracteristica-texto";

        elementoTexto.textContent =
            texto;

        tarjeta.append(
            elementoIcono,
            elementoTexto
        );

        contenedor.appendChild(
            tarjeta
        );
    });

    // Convertir los íconos en SVG después de crear las tarjetas.
    if (window.lucide) {
        window.lucide.createIcons({
            attrs: {
                "stroke-width": 2.2
            }
        });
    }
}

// FIN DE LA PARTE 2 DE 5

// ==========================================================
// ABRIR MODAL DEL ALOJAMIENTO
// ==========================================================

function abrirModalAlojamiento(
    alojamiento,
    fotos
) {

    crearModalAlojamiento();

    alojamientoActual = normalizarAlojamiento(alojamiento);
    prepararFechasFicha();

    modalAlojamientoFotos =
        fotos || [];

    modalAlojamientoIndice =
        0;

    const nombre =
        document.getElementById(
            "modalAlojamientoNombre"
        );

    const descripcion =
        document.getElementById(
            "modalAlojamientoDescripcion"
        );

    const datos =
        document.getElementById(
            "modalAlojamientoDatos"
        );

    const ubicacion =
        document.getElementById(
            "modalAlojamientoUbicacion"
        );

    const precio =
        document.getElementById(
            "modalAlojamientoPrecio"
        );


    // ======================================================
    // NOMBRE
    // ======================================================

    if (nombre) {

        nombre.textContent =
            alojamiento.nombre ||
            "Alojamiento";
    }


    // ======================================================
    // DESCRIPCIÓN
    // ======================================================

    if (descripcion) {

        const textoDescripcion =
            alojamiento.descripcion ||
            "Disfrute de una estancia agradable.";

        const partesDescripcion =
            textoDescripcion
                .split("*")
                .map(
                    function(parte) {

                        return parte.trim();
                    }
                )
                .filter(
                    function(parte) {

                        return parte !== "";
                    }
                );

        descripcion.innerHTML =
            "";

        partesDescripcion.forEach(
            function(parte, indice) {

                const linea =
                    document.createElement(
                        "div"
                    );

                linea.className =
                    indice === 0
                        ? "modal-descripcion-principal"
                        : "modal-descripcion-item";

                linea.textContent =
                    parte;

                descripcion.appendChild(
                    linea
                );
            }
        );
    }


    // ======================================================
    // AMENIDADES
    // ======================================================

    mostrarAmenidadesAlojamiento(
        alojamiento
    );

if (typeof mostrarMapaUbicacionEA === "function") {
    mostrarMapaUbicacionEA(alojamiento);
}

    // ======================================================
    // MOSTRAR LAS 6 CARACTERÍSTICAS SELECCIONADAS
    // ======================================================

    mostrarCaracteristicasPrincipales(alojamiento);


    // ======================================================
    // UBICACIÓN
    // ======================================================

    if (ubicacion) {
        const direccion = obtenerDireccionEscritaEA(alojamiento);

        ubicacion.textContent = direccion;
        ubicacion.style.display = direccion ? "block" : "none";
    }

    // ======================================================
    // PRECIO
    // ======================================================

    if (precio) {

        precio.textContent =
            "Q" +
            Number(
                alojamiento.precio_base || 0
            ).toFixed(2);
    }


    // ======================================================
    // MOSTRAR MODAL
    // ======================================================

    actualizarFotoModalAlojamiento();

    if (modalAlojamiento) {

        modalAlojamiento.classList.add(
            "modal-alojamiento-visible"
        );
    }

    document.body.classList.add(
        "sin-scroll"
    );
}


// ==========================================================
// CAMBIAR FOTOGRAFÍA DEL MODAL
// ==========================================================

function cambiarFotoModalAlojamiento(
    nuevoIndice
) {

    if (
        !modalAlojamientoFotos ||
        modalAlojamientoFotos.length === 0
    ) {
        return;
    }

    if (
        nuevoIndice < 0
    ) {

        nuevoIndice =
            modalAlojamientoFotos.length - 1;
    }

    if (
        nuevoIndice >=
        modalAlojamientoFotos.length
    ) {

        nuevoIndice =
            0;
    }

    modalAlojamientoIndice =
        nuevoIndice;

    actualizarFotoModalAlojamiento();
}


// ==========================================================
// ACTUALIZAR FOTOGRAFÍA DEL MODAL
// ==========================================================

function actualizarFotoModalAlojamiento() {

    if (
        !modalAlojamientoFoto
    ) {
        return;
    }

    const flechaAnterior =
        document.getElementById(
            "modalAlojamientoAnterior"
        );

    const flechaSiguiente =
        document.getElementById(
            "modalAlojamientoSiguiente"
        );

    const indicadores =
        document.getElementById(
            "modalAlojamientoIndicadores"
        );


    // ======================================================
    // SIN FOTOGRAFÍAS
    // ======================================================

    if (
        !modalAlojamientoFotos ||
        modalAlojamientoFotos.length === 0
    ) {

        modalAlojamientoFoto.style.display =
            "none";

        if (
            modalAlojamientoContador
        ) {

            modalAlojamientoContador.textContent =
                "Sin fotografías";
        }

        if (flechaAnterior) {

            flechaAnterior.style.display =
                "none";
        }

        if (flechaSiguiente) {

            flechaSiguiente.style.display =
                "none";
        }

        if (indicadores) {

            indicadores.innerHTML =
                "";
        }

        return;
    }


    // ======================================================
    // MOSTRAR FOTOGRAFÍA
    // ======================================================

    modalAlojamientoFoto.style.display =
        "block";

    modalAlojamientoFoto.src =
        modalAlojamientoFotos[
            modalAlojamientoIndice
        ];

    modalAlojamientoFoto.alt =
        alojamientoActual &&
        alojamientoActual.nombre
            ? alojamientoActual.nombre
            : "Alojamiento";


    // ======================================================
    // FOTOGRAFÍAS SECUNDARIAS
    // ======================================================

    const fotoSecundaria1 =
        document.getElementById(
            "modalFotoSecundaria1"
        );

    const fotoSecundaria2 =
        document.getElementById(
            "modalFotoSecundaria2"
        );

    const totalFotos =
        modalAlojamientoFotos.length;

    if (fotoSecundaria1) {

        if (totalFotos > 1) {

            fotoSecundaria1.src =
                modalAlojamientoFotos[
                    (modalAlojamientoIndice + 1) % totalFotos
                ];

            fotoSecundaria1.style.display = "block";

        } else {

            fotoSecundaria1.style.display = "none";
        }
    }

    if (fotoSecundaria2) {

        if (totalFotos > 2) {

            fotoSecundaria2.src =
                modalAlojamientoFotos[
                    (modalAlojamientoIndice + 2) % totalFotos
                ];

            fotoSecundaria2.style.display = "block";

        } else {

            fotoSecundaria2.style.display = "none";
        }
    }


    // ======================================================
    // ACTUALIZAR BOTÓN VER TODAS LAS FOTOS
    // ======================================================

    const botonTodasFotos =
        document.getElementById("modalVerTodasFotos");

    if (botonTodasFotos) {

        botonTodasFotos.style.display = "flex";

        const textoBoton =
            botonTodasFotos.querySelector("span");

        if (textoBoton) {

            textoBoton.textContent =
                "Ver todas las fotos (" +
                modalAlojamientoFotos.length +
                ")";
        }
    }


    // ======================================================
    // FLECHAS
    // ======================================================

    if (flechaAnterior) {

        flechaAnterior.style.display =
            modalAlojamientoFotos.length > 1
                ? "flex"
                : "none";
    }

    if (flechaSiguiente) {

        flechaSiguiente.style.display =
            modalAlojamientoFotos.length > 1
                ? "flex"
                : "none";
    }
}


// ==========================================================
// DISEÑO DE TARJETAS V2 - SOLO PRESENTACIÓN
// ==========================================================

function iconoTarjetaV2(tipo) {

    const rutas = {
        personas: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><circle cx="18" cy="9" r="2"/><path d="M17 15a5 5 0 0 1 4 5"/>',
        cama: '<path d="M3 18V7m18 11V7M3 13h18v5H3zM5 13V9h14v4"/>',
        bano: '<path d="M3 13h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2zM7 13V6a3 3 0 0 1 6 0"/>',
        wifi: '<path d="M2 9a16 16 0 0 1 20 0M5 13a11 11 0 0 1 14 0M9 17a5 5 0 0 1 6 0"/><circle cx="12" cy="21" r="1"/>',
        nieve: '<path d="M12 2v20M4 7l16 10M20 7L4 17M9 5l3 3 3-3M9 19l3-3 3 3"/>',
        piscina: '<path d="M2 18q3-3 6 0t6 0t6 0M2 22q3-3 6 0t6 0t6 0M8 16V6a3 3 0 0 1 6 0M8 10h8v6"/>',
        auto: '<path d="M5 16H3v-5l2-5h14l2 5v5h-2M5 16h14M5 16v3m14-3v3M3 11h18"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/>',
        mascota: '<circle cx="5" cy="8" r="1"/><circle cx="10" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="20" cy="8" r="1"/><path d="M7 18c0-4 3-7 5-7s5 3 5 7c0 3-3 3-5 2-2 1-5 1-5-2z"/>',
        cocina: '<path d="M5 3v8m3-8v8M2 3v5a5 5 0 0 0 9 0V3M6.5 11v10M18 3c-5 3-5 9 0 11v7"/>',
        tv: '<rect x="2" y="4" width="20" height="15" rx="2"/><path d="M8 22h8m-4-3v3"/>',
        escudo: '<path d="M12 2 4 5v7c0 5 4 8 8 10 4-2 8-5 8-10V5z"/>',
        palmera: '<path d="M12 22 14 9M14 9Q6 2 2 9M14 9Q15 1 21 5M14 9Q22 7 22 14M14 9Q8 7 7 14"/>',
        trabajo: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4"/>'
    };

    return (
        '<svg viewBox="0 0 24 24" width="21" height="21" ' +
        'fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true">' +
        (rutas[tipo] || rutas.escudo) +
        '</svg>'
    );
}


function insertarEstilosTarjetasV2() {

    if (document.getElementById("ea-estilos-tarjetas-v2")) {
        return;
    }

    const estilo = document.createElement("style");

    estilo.id = "ea-estilos-tarjetas-v2";

    estilo.textContent = [
        ".alojamientos .alojamiento {display:flex;flex-direction:column;background:#fff;border:1px solid #e5eeec;border-radius:18px;overflow:hidden;box-shadow:0 5px 18px rgba(9,60,66,.08);min-width:0;}",
        ".alojamientos .alojamiento .nombre-alojamiento {font-family:Georgia,serif;color:#103e42;font-size:22px;font-weight:700;padding:14px 16px 4px;margin:0;}",
        ".alojamientos .ea-tarjeta-resumen {display:flex;flex-direction:column;flex:1;padding:0 16px 15px;gap:13px;}",
        ".alojamientos .ea-caracteristicas {display:flex;align-items:center;flex-wrap:wrap;gap:8px 15px;color:#234c56;font-size:12px;font-weight:600;}",
        ".alojamientos .ea-caracteristica {display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}",
        ".alojamientos .ea-caracteristica svg {flex-shrink:0;width:19px;height:19px;}",
        ".alojamientos .ea-amenidades-tarjeta {display:flex;flex-wrap:wrap;gap:9px;}",
        ".alojamientos .ea-amenidad-icono {display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:11px;background:#f0f5f4;color:#087a81;}",
        ".alojamientos .ea-amenidad-icono svg {width:22px;height:22px;}",
        ".alojamientos .ea-acciones-tarjeta {display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto;}",
        ".alojamientos .ea-acciones-tarjeta button {cursor:pointer;font:inherit;}",
        ".alojamientos .ea-ver-detalles {background:transparent;border:0;color:#087b80;font-size:13px!important;font-weight:700!important;text-align:left;padding:9px 0;}",
        ".alojamientos .ea-reservar {background:#075b62;color:#fff;border:0;border-radius:14px;padding:13px 18px;font-size:14px!important;font-weight:700!important;min-width:105px;}",
        ".alojamientos .ea-reservar:hover {background:#06474d;}",
        ".alojamientos .ea-acciones-tarjeta button:focus-visible {outline:3px solid #edb94c;outline-offset:2px;}",
        "@media(max-width:750px) {",
        "    .alojamientos .ea-caracteristicas {gap:10px 16px;font-size:13px;}",
        "    .alojamientos .ea-reservar {min-width:135px;}",
        "}"
    ].join("\n");

    document.head.appendChild(estilo);
}


// ==========================================================
// CARGAR ALOJAMIENTOS
// ==========================================================

async function cargarAlojamientos() {

    insertarEstilosTarjetasV2();

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

    try {

        console.log(
            "Iniciando carga de alojamientos..."
        );

        const resultado =
            await clienteSupabase
                .from(
                    "alojamientos"
                )
                .select(
                    `
                    id,
                    nombre,
                    descripcion,
                    precio_base,
                    precio_persona,
                    personas_incluidas,
                    max_huespedes,
                    habitaciones,
                    camas,
                    banos,
                    ubicacion,
                    google_maps_url,
                    ficha_habitaciones,
                    amenidades,
                    caracteristicas_principales,
                    publicado,
                    created_at
                    `
                )
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

        console.log(
            "Respuesta de Supabase:",
            resultado
        );

        if (
            resultado.error
        ) {

            console.error(
                "Error de Supabase al cargar alojamientos:",
                resultado.error
            );

            contenedor.innerHTML =
                "<p>No se pudieron cargar los alojamientos.</p>";

            return;
        }

        const alojamientos =
            resultado.data;

        console.log(
            "Alojamientos encontrados:",
            alojamientos
        );

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


        // ==================================================
        // RECORRER ALOJAMIENTOS
        // ==================================================

        for (
            const alojamiento of alojamientos
        ) {

            let fotos = [];

            try {

                fotos =
                    await obtenerFotos(
                        alojamiento.id
                    );

            } catch (errorFotos) {

                console.error(
                    "Error al cargar fotografías del alojamiento:",
                    alojamiento.id,
                    errorFotos
                );

                fotos = [];
            }

            const tarjeta =
                document.createElement(
                    "article"
                );

            tarjeta.className =
                "alojamiento";

            tarjeta.tabIndex =
                0;


            // ==================================================
            // GALERÍA
            // ==================================================

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
                    "Alojamiento";

                imagen.className =
                    "foto-principal";

                imagen.loading =
                    "lazy";

                let indiceFoto =
                    0;

                imagen.addEventListener(
                    "click",
                    function(evento) {

                        evento.stopPropagation();

                        abrirVisorFotos(
                            fotos,
                            indiceFoto
                        );
                    }
                );

                galeria.appendChild(
                    imagen
                );


                // ==================================================
                // CONTADOR
                // ==================================================

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


                // ==================================================
                // INDICADORES
                // ==================================================

                let indicadores =
                    null;

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


                // ==================================================
                // CAMBIAR FOTO
                // ==================================================

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

                        nuevoIndice =
                            0;
                    }

                    indiceFoto =
                        nuevoIndice;

                    imagen.src =
                        fotos[
                            indiceFoto
                        ];

                    if (
                        indicadores
                    ) {

                        const puntos =
                            indicadores.querySelectorAll(
                                ".punto-foto"
                            );

                        puntos.forEach(
                            function(punto) {

                                punto.classList.remove(
                                    "activo"
                                );
                            }
                        );

                        let puntoActivo =
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

                        if (
                            puntos[puntoActivo]
                        ) {

                            puntos[puntoActivo]
                                .classList.add(
                                    "activo"
                                );
                        }
                    }
                }


                // ==================================================
                // DESLIZAR EN CELULAR
                // ==================================================

                let posicionInicialX =
                    0;

                let posicionFinalX =
                    0;

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

                galeria =
                    document.createElement(
                        "div"
                    );

                galeria.className =
                    "galeria-alojamiento sin-fotos";

                galeria.innerHTML =
                    "<p>Sin fotografías disponibles</p>";
            }

            tarjeta.appendChild(
                galeria
            );


            // ==================================================
            // NOMBRE
            // ==================================================

            const nombreAlojamiento =
                document.createElement(
                    "div"
                );

            nombreAlojamiento.className =
                "nombre-alojamiento";

            nombreAlojamiento.textContent =
                alojamiento.nombre ||
                "Alojamiento";

            tarjeta.appendChild(
                nombreAlojamiento
            );


            // ==================================================
            // CARACTERÍSTICAS Y ACCIONES DE LA TARJETA
            // ==================================================

            const resumen =
                document.createElement("div");

            resumen.className =
                "ea-tarjeta-resumen";

            const caracteristicas =
                document.createElement("div");

            caracteristicas.className =
                "ea-caracteristicas";

            const datosResumen = [
                [
                    "personas",
                    alojamiento.max_huespedes,
                    "huésped",
                    "huéspedes"
                ],
                [
                    "cama",
                    alojamiento.habitaciones,
                    "habitación",
                    "habitaciones"
                ],
                [
                    "bano",
                    alojamiento.banos,
                    "baño",
                    "baños"
                ]
            ];

            datosResumen.forEach(function(dato) {

                if (
                    dato[1] === null ||
                    dato[1] === undefined ||
                    dato[1] === ""
                ) {
                    return;
                }

                const cantidad =
                    Number(dato[1]);

                if (!Number.isFinite(cantidad)) return;

                const elemento =
                    document.createElement("span");

                elemento.className =
                    "ea-caracteristica";

                elemento.innerHTML =
                    iconoTarjetaV2(dato[0]);

                const texto =
                    document.createElement("span");

                texto.textContent =
                    cantidad +
                    " " +
                    (cantidad === 1 ? dato[2] : dato[3]);

                elemento.appendChild(texto);
                caracteristicas.appendChild(elemento);
            });

            resumen.appendChild(caracteristicas);

            let amenidades =
                alojamiento.amenidades;

            if (typeof amenidades === "string") {

                try {

                    amenidades =
                        JSON.parse(amenidades);

                } catch (error) {

                    amenidades =
                        null;
                }
            }

            if (
                amenidades &&
                typeof amenidades === "object" &&
                !Array.isArray(amenidades)
            ) {

                const iconosAmenidades = {
                    internet: ["wifi", "Internet"],
                    climatizacion: ["nieve", "Climatización"],
                    piscina: ["piscina", "Piscina"],
                    estacionamiento: ["auto", "Estacionamiento"],
                    mascotas: ["mascota", "Mascotas"],
                    cocina: ["cocina", "Cocina"],
                    entretenimiento: ["tv", "Entretenimiento"],
                    seguridad: ["escudo", "Seguridad"],
                    exterior: ["palmera", "Exterior"],
                    trabajo: ["trabajo", "Área de trabajo"],
                    bano: ["bano", "Baño"],
                    habitacion: ["cama", "Habitación"]
                };

                const listaIconos =
                    document.createElement("div");

                listaIconos.className =
                    "ea-amenidades-tarjeta";

                Object.entries(iconosAmenidades).forEach(
                    function([clave, configuracion]) {

                        const valores =
                            amenidades[clave];

                        if (
                            !Array.isArray(valores) ||
                            valores.length === 0
                        ) {
                            return;
                        }

                        const icono =
                            document.createElement("span");

                        icono.className =
                            "ea-amenidad-icono";

                        icono.title =
                            configuracion[1];

                        icono.setAttribute(
                            "aria-label",
                            configuracion[1]
                        );

                        icono.innerHTML =
                            iconoTarjetaV2(configuracion[0]);

                        listaIconos.appendChild(icono);
                    }
                );

                if (listaIconos.childElementCount) {
                    resumen.appendChild(listaIconos);
                }
            }

            const acciones =
                document.createElement("div");

            acciones.className =
                "ea-acciones-tarjeta";

            const detalles =
                document.createElement("button");

            detalles.type =
                "button";

            detalles.className =
                "ea-ver-detalles";

            detalles.textContent =
                "Ver más detalles →";

            detalles.addEventListener("click", function(evento) {

                evento.stopPropagation();

                abrirModalAlojamiento(
                    alojamiento,
                    fotos
                );
            });

            const reservar =
                document.createElement("button");

            reservar.type =
                "button";

            reservar.className =
                "ea-reservar";

            reservar.textContent =
                "Reservar";

            reservar.addEventListener("click", function(evento) {

                evento.stopPropagation();

                abrirReserva(alojamiento);
            });

            acciones.appendChild(detalles);
            acciones.appendChild(reservar);

            resumen.appendChild(acciones);
            tarjeta.appendChild(resumen);


            // ==================================================
            // ABRIR MODAL
            // ==================================================

            tarjeta.addEventListener(
                "click",
                function() {

                    abrirModalAlojamiento(
                        alojamiento,
                        fotos
                    );
                }
            );

            tarjeta.addEventListener(
                "keydown",
                function(evento) {

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
            "Alojamientos cargados correctamente:",
            alojamientos
        );

    } catch (error) {

        console.error(
            "ERROR COMPLETO AL CARGAR ALOJAMIENTOS:",
            error
        );

        contenedor.innerHTML =
            "<p>No se pudieron cargar los alojamientos.</p>";
    }
}


// ==========================================================
// ABRIR RESERVA
// ==========================================================

async function abrirReserva(
    alojamiento
) {

    alojamientoActual = {

        id:
            alojamiento.id,

        nombre:
            alojamiento.nombre,

        descripcion:
            alojamiento.descripcion,

        precio_base:
            alojamiento.precio_base,

        precio_persona:
            alojamiento.precio_persona,

        personas_incluidas:
            alojamiento.personas_incluidas,

        max_huespedes:
            alojamiento.max_huespedes,

        habitaciones:
            alojamiento.habitaciones,

        banos:
            alojamiento.banos,

        ubicacion:
            alojamiento.ubicacion,

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
            Number(
                alojamiento.max_huespedes || 1
            )
    };

    const ventana =
        document.getElementById(
            "ventanaReserva"
        );

    const nombre =
        document.getElementById(
            "nombreAlojamiento"
        );

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );

    const personas =
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

    if (
        nombre
    ) {

        nombre.textContent =
            alojamiento.nombre;
    }

    if (
        fechaIngreso
    ) {

        fechaIngreso.value =
            "";
    }

    if (
        fechaSalida
    ) {

        fechaSalida.value =
            "";
    }


    // ======================================================
    // CANTIDAD DE PERSONAS
    // ======================================================

    if (
        personas
    ) {

        personas.value =
            1;

        personas.min =
            1;

        // La capacidad publicada no bloquea cantidades superiores.
        // Si el huésped supera esta cantidad, se muestra
        // el aviso de confirmación correspondiente.

        personas.removeAttribute(
            "max"
        );
    }

    if (
        cantidadNoches
    ) {

        cantidadNoches.textContent =
            "0";
    }

    if (
        precioTotal
    ) {

        precioTotal.textContent =
            "Q0";
    }

    const nombreCliente =
        document.getElementById(
            "nombre"
        );

    const telefono =
        document.getElementById(
            "telefono"
        );

    if (
        nombreCliente
    ) {

        nombreCliente.value =
            "";
    }

    if (
        telefono
    ) {

        telefono.value =
            "";
    }


    // ======================================================
    // REINICIAR DISPONIBILIDAD Y FECHAS
    // ======================================================

    fechasBloqueadas =
        new Set();

    fechaIngresoSeleccionada =
        null;

    fechaSalidaSeleccionada =
        null;

    disponibilidadVerificada =
        false;

    mesCalendarioActual =
        new Date();

    mesCalendarioActual.setDate(
        1
    );

    modoCalendario =
        "ingreso";


    // ======================================================
    // PREPARAR RESERVA
    // ======================================================

    insertarEstilosReserva();

    configurarCalendarioReserva();

    const destinoCalendario =
        document.getElementById("contenedorCalendario") ||
        document.getElementById("fechaSalida")?.parentElement;

    if (destinoCalendario && calendarioReserva) {
        destinoCalendario.appendChild(calendarioReserva);
    }

    actualizarAvisoCapacidad(
        false
    );


    // ======================================================
    // MOSTRAR VENTANA
    // ======================================================

    if (
        ventana
    ) {

        ventana.classList.add(
            "reserva-visible"
        );

        ventana.style.display =
            "";

        document.body.classList.add(
            "sin-scroll"
        );
    }

    mostrarCalendario();


    // ======================================================
    // CONSULTAR FECHAS DISPONIBLES
    // ======================================================

    await cargarDisponibilidad();
}


// ==========================================================
// CERRAR RESERVA
// ==========================================================

function cerrarReserva() {

    const ventana =
        document.getElementById(
            "ventanaReserva"
        );

    if (
        ventana
    ) {

        ventana.classList.remove(
            "reserva-visible"
        );

        ventana.style.display =
            "";
    }

    sincronizarScroll();

    if (
        calendarioReserva
    ) {

        calendarioReserva.classList.remove(
            "visible"
        );
    }
}

// FIN DE LA PARTE 3 DE 5

// ==========================================================
// CREAR CALENDARIO
// ==========================================================

function configurarCalendarioReserva() {

    insertarEstilosCalendario();

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );

    if (
        !fechaIngreso ||
        !fechaSalida
    ) {
        return;
    }

    if (
        document.getElementById(
            "calendarioReserva"
        )
    ) {

        calendarioReserva =
            document.getElementById(
                "calendarioReserva"
            );


        // ==================================================
        // PERMITIR CAMBIAR FECHA DE INGRESO
        // ==================================================

        fechaIngreso.onclick =
            function() {

                modoCalendario =
                    "ingreso";

                mostrarCalendario();
            };


        // ==================================================
        // PERMITIR CAMBIAR FECHA DE SALIDA
        // ==================================================

        fechaSalida.onclick =
            function() {

                if (
                    fechaIngresoSeleccionada
                ) {

                    modoCalendario =
                        "salida";

                } else {

                    modoCalendario =
                        "ingreso";
                }

                mostrarCalendario();
            };

        return;
    }

    fechaIngreso.type =
        "text";

    fechaSalida.type =
        "text";

    fechaIngreso.readOnly =
        true;

    fechaSalida.readOnly =
        true;

    fechaIngreso.placeholder =
        "Seleccione la fecha de ingreso";

    fechaSalida.placeholder =
        "Seleccione la fecha de salida";

    calendarioReserva =
        document.createElement(
            "div"
        );

    calendarioReserva.id =
        "calendarioReserva";

    calendarioReserva.innerHTML = [
        '<div class="calendario-cabecera">',

        '    <button',
        '        type="button"',
        '        class="calendario-nav"',
        '        id="calendarioMesAnterior"',
        '    >',
        '        ‹',
        '    </button>',

        '    <div',
        '        class="calendario-mes"',
        '        id="calendarioNombreMes"',
        '    ></div>',

        '    <button',
        '        type="button"',
        '        class="calendario-nav"',
        '        id="calendarioMesSiguiente"',
        '    >',
        '        ›',
        '    </button>',

        '</div>',

        '<div class="calendario-semana">',
        '    <div class="calendario-dia-semana">L</div>',
        '    <div class="calendario-dia-semana">M</div>',
        '    <div class="calendario-dia-semana">M</div>',
        '    <div class="calendario-dia-semana">J</div>',
        '    <div class="calendario-dia-semana">V</div>',
        '    <div class="calendario-dia-semana">S</div>',
        '    <div class="calendario-dia-semana">D</div>',
        '</div>',

        '<div',
        '    id="calendarioDias"',
        '    class="calendario-dias"',
        '></div>',

        '<div',
        '    id="calendarioMensaje"',
        '    class="calendario-mensaje"',
        '>',
        '    Seleccione su fecha de ingreso.',
        '</div>',

        '<div class="calendario-leyenda">',

        '    <div class="calendario-leyenda-item">',
        '        <span class="calendario-leyenda-color calendario-leyenda-disponible"></span>',
        '        Disponible',
        '    </div>',

        '    <div class="calendario-leyenda-item">',
        '        <span class="calendario-leyenda-color calendario-leyenda-bloqueado"></span>',
        '        No disponible',
        '    </div>',

        '    <div class="calendario-leyenda-item">',
        '        <span class="calendario-leyenda-color calendario-leyenda-seleccionado"></span>',
        '        Seleccionado',
        '    </div>',

        '</div>'
    ].join("\n");

    const contenedorCalendario =
        document.getElementById(
            "contenedorCalendario"
        );

    if (
        contenedorCalendario
    ) {

        contenedorCalendario.innerHTML =
            "";

        contenedorCalendario.appendChild(
            calendarioReserva
        );

    } else {

        fechaSalida.insertAdjacentElement(
            "afterend",
            calendarioReserva
        );
    }

    document.getElementById(
        "calendarioMesAnterior"
    ).addEventListener(
        "click",
        function() {

            mesCalendarioActual.setMonth(
                mesCalendarioActual.getMonth() - 1
            );

            renderizarCalendario();
        }
    );

    document.getElementById(
        "calendarioMesSiguiente"
    ).addEventListener(
        "click",
        function() {

            mesCalendarioActual.setMonth(
                mesCalendarioActual.getMonth() + 1
            );

            renderizarCalendario();
        }
    );

    fechaIngreso.addEventListener(
        "click",
        function() {

            modoCalendario =
                "ingreso";

            mostrarCalendario();
        }
    );

    fechaSalida.addEventListener(
        "click",
        function() {

            modoCalendario =
                "salida";

            mostrarCalendario();
        }
    );

    renderizarCalendario();
}


// ==========================================================
// MOSTRAR CALENDARIO
// ==========================================================

function mostrarCalendario() {

    if (
        !calendarioReserva
    ) {
        return;
    }

    calendarioReserva.classList.add(
        "visible"
    );

    renderizarCalendario();
}


// ==========================================================
// RENDERIZAR CALENDARIO
// ==========================================================

function renderizarCalendario() {

    if (!calendarioReserva) return;

    const nombreMes =
        document.getElementById(
            "calendarioNombreMes"
        );

    const contenedorDias =
        document.getElementById(
            "calendarioDias"
        );

    const mensaje =
        document.getElementById(
            "calendarioMensaje"
        );

    if (!nombreMes || !contenedorDias) return;

    const meses = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre",
        "Octubre", "Noviembre", "Diciembre"
    ];

    const fechaPrimerMes = new Date(
        mesCalendarioActual.getFullYear(),
        mesCalendarioActual.getMonth(),
        1
    );

    const fechaSegundoMes = new Date(
        fechaPrimerMes.getFullYear(),
        fechaPrimerMes.getMonth() + 1,
        1
    );

    nombreMes.textContent =
        meses[fechaPrimerMes.getMonth()] +
        " " +
        fechaPrimerMes.getFullYear();

    contenedorDias.innerHTML =
        "";

    contenedorDias.classList.add(
        "calendario-dos-meses"
    );

    const diasSemana = [
        "L", "M", "M", "J", "V", "S", "D"
    ];

    const hoyISO =
        convertirFechaISO(new Date());


    function crearMes(fechaMes, indice) {

        const anio =
            fechaMes.getFullYear();

        const mes =
            fechaMes.getMonth();

        const panel =
            document.createElement("div");

        panel.className =
            "calendario-panel-mes";

        const titulo =
            document.createElement("div");

        titulo.className =
            "calendario-titulo-mes";

        titulo.textContent =
            meses[mes] + " " + anio;

        panel.appendChild(titulo);

        const semana =
            document.createElement("div");

        semana.className =
            "calendario-semana";

        diasSemana.forEach(function(dia) {

            const elemento =
                document.createElement("div");

            elemento.className =
                "calendario-dia-semana";

            elemento.textContent =
                dia;

            semana.appendChild(elemento);
        });

        panel.appendChild(semana);

        const cuadricula =
            document.createElement("div");

        cuadricula.className =
            "calendario-dias-mes";

        const primerDia =
            new Date(anio, mes, 1);

        const espaciosIniciales =
            (primerDia.getDay() + 6) % 7;

        for (
            let i = 0;
            i < espaciosIniciales;
            i++
        ) {

            const vacio =
                document.createElement("div");

            vacio.className =
                "calendario-dia vacio";

            cuadricula.appendChild(vacio);
        }

        const cantidadDias = new Date(
            anio,
            mes + 1,
            0
        ).getDate();

        for (
            let dia = 1;
            dia <= cantidadDias;
            dia++
        ) {

            const fechaISO =
                convertirFechaISO(
                    new Date(anio, mes, dia)
                );

            const boton =
                document.createElement("button");

            boton.type =
                "button";

            boton.className =
                "calendario-dia";

            boton.textContent =
                dia;

            const pasada =
                esFechaPasada(fechaISO);

            const bloqueada =
                fechasBloqueadas.has(fechaISO);

            if (fechaISO === hoyISO) {
                boton.classList.add("hoy");
            }

            if (pasada) {
                boton.classList.add("pasado");
            }

            if (bloqueada) {
                boton.classList.add("bloqueado");
            }

            if (
                pasada ||
                bloqueada ||
                !disponibilidadVerificada
            ) {

                boton.classList.add(
                    "no-seleccionable"
                );

                boton.disabled =
                    true;
            }

            if (
                fechaIngresoSeleccionada === fechaISO
            ) {
                boton.classList.add("ingreso");
            }

            if (
                fechaSalidaSeleccionada === fechaISO
            ) {
                boton.classList.add("salida");
            }

            if (
                fechaIngresoSeleccionada &&
                fechaSalidaSeleccionada &&
                fechaISO > fechaIngresoSeleccionada &&
                fechaISO < fechaSalidaSeleccionada
            ) {
                boton.classList.add("en-rango");
            }

            if (!pasada && !bloqueada) {

                boton.addEventListener(
                    "click",
                    function() {

                        seleccionarFechaCalendario(
                            fechaISO
                        );

                        if (
                            typeof actualizarFechasTarjeta ===
                            "function"
                        ) {

                            actualizarFechasTarjeta();
                        }
                    }
                );
            }

            cuadricula.appendChild(boton);
        }

        panel.appendChild(cuadricula);

        return panel;
    }


    contenedorDias.appendChild(
        crearMes(fechaPrimerMes, 0)
    );

    contenedorDias.appendChild(
        crearMes(fechaSegundoMes, 1)
    );

    if (mensaje) {

        if (
            fechaIngresoSeleccionada &&
            fechaSalidaSeleccionada
        ) {

            mensaje.textContent =
                "Fechas seleccionadas correctamente.";

        } else if (
            fechaIngresoSeleccionada
        ) {

            mensaje.textContent =
                "Ahora seleccione la fecha de salida.";

        } else {

            mensaje.textContent =
                "Seleccione su fecha de ingreso.";
        }
    }
}


// ==========================================================
// SELECCIONAR FECHAS DEL CALENDARIO
// ==========================================================

function seleccionarFechaCalendario(fechaISO) {

    if (
        esFechaPasada(fechaISO) ||
        fechasBloqueadas.has(fechaISO) ||
        !disponibilidadVerificada
    ) {
        return;
    }

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );


    // ======================================================
    // SI YA HAY INGRESO Y SALIDA,
    // EMPEZAR UNA NUEVA SELECCIÓN
    // ======================================================

    if (
        fechaIngresoSeleccionada &&
        fechaSalidaSeleccionada
    ) {

        modoCalendario =
            "ingreso";
    }


    // ======================================================
    // SELECCIONAR / CAMBIAR FECHA DE INGRESO
    // ======================================================

    if (
        modoCalendario === "ingreso"
    ) {

        fechaIngresoSeleccionada =
            fechaISO;

        fechaSalidaSeleccionada =
            null;

        if (fechaIngreso) {

            fechaIngreso.value =
                fechaISO;
        }

        if (fechaSalida) {

            fechaSalida.value =
                "";
        }

        // Al cambiar el ingreso, se pide una nueva salida.
        modoCalendario =
            "salida";

        // La disponibilidad cargada sigue vigente.
        // El precio anterior deja de ser válido.
        calcularPrecio();

        renderizarCalendario();

        return;
    }


    // ======================================================
    // SELECCIONAR FECHA DE SALIDA
    // ======================================================

    if (
        modoCalendario === "salida"
    ) {

        if (
            !fechaIngresoSeleccionada
        ) {

            modoCalendario =
                "ingreso";

            renderizarCalendario();

            return;
        }

        // La salida siempre debe ser posterior al ingreso.
        if (
            fechaISO <=
            fechaIngresoSeleccionada
        ) {

            alert(
                "La fecha de salida debe ser posterior a la fecha de ingreso."
            );

            return;
        }


        // ==================================================
        // COMPROBAR FECHAS BLOQUEADAS EN EL RANGO
        // ==================================================

        const cantidad =
            diferenciaDias(
                fechaIngresoSeleccionada,
                fechaISO
            );

        let hayBloqueo =
            false;

        for (
            let i = 0;
            i < cantidad;
            i++
        ) {

            const fecha =
                sumarDias(
                    fechaDesdeISO(
                        fechaIngresoSeleccionada
                    ),
                    i
                );

            const fechaIntermedia =
                convertirFechaISO(
                    fecha
                );

            if (
                fechasBloqueadas.has(
                    fechaIntermedia
                )
            ) {

                hayBloqueo =
                    true;

                break;
            }
        }

        if (hayBloqueo) {

            alert(
                "El período seleccionado contiene fechas no disponibles. Seleccione otro rango."
            );

            return;
        }


        // ==================================================
        // GUARDAR SALIDA
        // ==================================================

        fechaSalidaSeleccionada =
            fechaISO;

        if (fechaSalida) {

            fechaSalida.value =
                fechaISO;
        }

        // La disponibilidad cargada sigue vigente.
        calcularPrecio();

        renderizarCalendario();
    }
}


// ==========================================================
// CARGAR DISPONIBILIDAD AIRBNB
// ==========================================================

async function cargarDisponibilidad() {

    if (
        !alojamientoActual ||
        !alojamientoActual.id
    ) {
        return false;
    }

    fechasBloqueadas =
        new Set();

    disponibilidadVerificada =
        false;

    const mensaje =
        document.getElementById(
            "calendarioMensaje"
        );

    if (
        mensaje
    ) {

        mensaje.textContent =
            "Cargando disponibilidad...";
    }

    try {

        const resultado =
            await clienteSupabase
                .functions
                .invoke(
                    "obtener-disponibilidad",
                    {
                        body: {
                            alojamiento_id:
                                alojamientoActual.id
                        }
                    }
                );

        if (
            resultado.error
        ) {

            console.error(
                "Error al consultar disponibilidad:",
                resultado.error
            );

            if (
                mensaje
            ) {

                mensaje.textContent =
                    "No se pudo actualizar la disponibilidad. Intente nuevamente.";
            }

            renderizarCalendario();

            return false;
        }

        const datos =
            resultado.data;

        if (
            datos &&
            Array.isArray(
                datos.blocked
            )
        ) {

            datos.blocked.forEach(
                function(fecha) {

                    fechasBloqueadas.add(
                        fecha
                    );
                }
            );
        }

        disponibilidadVerificada =
            true;

        renderizarCalendario();

        return true;

    } catch (error) {

        console.error(
            "Error inesperado al consultar disponibilidad:",
            error
        );

        if (
            mensaje
        ) {

            mensaje.textContent =
                "No se pudo consultar la disponibilidad.";
        }

        renderizarCalendario();

        return false;
    }
}


// ==========================================================
// COMPROBAR RANGO DISPONIBLE
// ==========================================================

function rangoDisponible(
    ingreso,
    salida
) {

    if (
        !ingreso ||
        !salida
    ) {
        return false;
    }

    const noches =
        diferenciaDias(
            ingreso,
            salida
        );

    if (
        noches <= 0
    ) {
        return false;
    }

    for (
        let i = 0;
        i < noches;
        i++
    ) {

        const fecha =
            sumarDias(
                fechaDesdeISO(
                    ingreso
                ),
                i
            );

        const fechaISO =
            convertirFechaISO(
                fecha
            );

        if (
            fechasBloqueadas.has(
                fechaISO
            )
        ) {
            return false;
        }
    }

    return true;
}


// ==========================================================
// CALCULAR PRECIO
// ==========================================================

function calcularPrecio() {

    if (
        !alojamientoActual
    ) {
        return;
    }

    const elementoIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const elementoSalida =
        document.getElementById(
            "fechaSalida"
        );

    const elementoPersonas =
        document.getElementById(
            "personas"
        );

    const elementoNoches =
        document.getElementById(
            "cantidadNoches"
        );

    const elementoTotal =
        document.getElementById(
            "precioTotal"
        );

    if (
        !elementoIngreso ||
        !elementoSalida ||
        !elementoPersonas ||
        !elementoNoches ||
        !elementoTotal
    ) {
        return;
    }

    const ingreso =
        elementoIngreso.value.trim();

    const salida =
        elementoSalida.value.trim();

    let personas =
        parseInt(
            elementoPersonas.value,
            10
        );


    // ======================================================
    // VALIDAR FECHAS
    // ======================================================

    if (
        !ingreso ||
        !salida
    ) {

        elementoNoches.textContent =
            "0";

        elementoTotal.textContent =
            "Q0";

        return;
    }


    // ======================================================
    // VALIDAR PERSONAS
    // ======================================================

    // Solamente impedimos cantidades menores a 1.
    // Superar la capacidad publicada sí está permitido.
    if (
        !Number.isFinite(personas) ||
        personas < 1
    ) {

        elementoNoches.textContent =
            "0";

        elementoTotal.textContent =
            "Q0";

        return;
    }


    // ======================================================
    // CALCULAR NOCHES
    // ======================================================

    const fechaIngreso =
        fechaDesdeISO(
            ingreso
        );

    const fechaSalida =
        fechaDesdeISO(
            salida
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

    if (
        !Number.isFinite(noches) ||
        noches <= 0
    ) {

        elementoNoches.textContent =
            "0";

        elementoTotal.textContent =
            "Q0";

        return;
    }


    // ======================================================
    // CALCULAR PERSONAS ADICIONALES
    // ======================================================

    const personasIncluidas =
        Number(
            alojamientoActual.personasIncluidas
        ) || 0;

    const precioBase =
        Number(
            alojamientoActual.precioBase
        ) || 0;

    const precioPersona =
        Number(
            alojamientoActual.precioPersona
        ) || 0;

    const personasAdicionales =
        Math.max(
            personas -
            personasIncluidas,
            0
        );


    // ======================================================
    // PRECIO POR NOCHE
    // ======================================================

    const precioPorNoche =
        precioBase +
        (
            personasAdicionales *
            precioPersona
        );


    // ======================================================
    // TOTAL
    // ======================================================

    const total =
        precioPorNoche *
        noches;

    elementoNoches.textContent =
        noches;

    elementoTotal.textContent =
        "Q" +
        total.toFixed(2);
}


// ==========================================================
// AVISO DE CAPACIDAD
// ==========================================================

function actualizarAvisoCapacidad(excedida) {

    const personas =
        document.getElementById(
            "personas"
        );

    const selectorPersonas =
        document.querySelector(
            ".selector-personas"
        );

    if (
        !personas ||
        !selectorPersonas ||
        !alojamientoActual
    ) {
        return;
    }

    let aviso =
        document.getElementById(
            "avisoCapacidad"
        );


    // ======================================================
    // CREAR AVISO DEBAJO DEL SELECTOR COMPLETO
    // ======================================================

    if (!aviso) {

        aviso =
            document.createElement("div");

        aviso.id =
            "avisoCapacidad";

        selectorPersonas.insertAdjacentElement(
            "afterend",
            aviso
        );
    }

    const cantidad =
        Number(personas.value) || 1;

    const capacidad =
        Number(
            alojamientoActual.maxHuespedes
        ) || 1;


    // ======================================================
    // NO SUPERA LA CAPACIDAD
    // ======================================================

    if (
        !excedida ||
        cantidad <= capacidad
    ) {

        aviso.className =
            "aviso-capacidad-reserva";

        aviso.innerHTML =
            "Capacidad indicada: " +
            capacidad +
            " personas.";

        return;
    }


    // ======================================================
    // SUPERA LA CAPACIDAD
    // ======================================================

    aviso.className =
        "aviso-capacidad-reserva aviso-capacidad-superada";

    aviso.innerHTML = [
        '<div class="aviso-capacidad-cabecera">',

        '    <span class="aviso-capacidad-icono">!</span>',

        '    <div>',
        '        <strong>',
        '            La cantidad de huéspedes supera la capacidad indicada',
        '        </strong>',

        '        <p>',
        '            Este alojamiento está publicado para una capacidad de',
        '            <b>' + capacidad + ' personas</b>',
        '            y estás solicitando alojamiento para',
        '            <b>' + cantidad + ' personas</b>.',
        '        </p>',
        '    </div>',

        '</div>',

        '<p class="aviso-capacidad-texto">',
        '    Puedes continuar con la solicitud.',
        '    Sin embargo, antes de hacerlo confirma',
        '    que has revisado la descripción del',
        '    alojamiento, la distribución de sus',
        '    espacios, camas y amenidades, y que',
        '    comprendes que la propiedad está',
        '    equipada y distribuida tomando como',
        '    referencia la capacidad indicada.',
        '</p>',

        '<label class="aceptacion-capacidad">',

        '    <input',
        '        type="checkbox"',
        '        id="aceptaCapacidadExcedida"',
        '    >',

        '    <span>',
        '        He revisado la información del',
        '        alojamiento y comprendo que mi',
        '        solicitud supera la capacidad',
        '        indicada.',
        '    </span>',

        '</label>'
    ].join("\n");
}


// ==========================================================
// VALIDACIÓN DE PERSONAS
// ==========================================================

function procesarCantidadPersonas() {

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

    let cantidad =
        Number(campoPersonas.value);

    if (!Number.isInteger(cantidad)) {

        campoPersonas.setCustomValidity(
            "Ingrese una cantidad entera de huéspedes."
        );

        actualizarAvisoCapacidad(false);
        calcularPrecio();

        return;
    }

    campoPersonas.setCustomValidity("");

    if (cantidad < 1) {

        cantidad =
            1;

        campoPersonas.value =
            1;
    }

    const capacidad =
        Number(
            alojamientoActual.maxHuespedes
        ) || 1;

    // No modificar el número escrito por el huésped.
    // 7 continúa siendo 7 aunque la capacidad publicada sea 5.
    actualizarAvisoCapacidad(
        cantidad > capacidad
    );

    calcularPrecio();
}


// Funciona mientras escribe.
document.addEventListener(
    "input",
    function(evento) {

        if (evento.target.id === "personas") {
            procesarCantidadPersonas();
        }
    }
);


// Refuerzo para navegadores móviles.
document.addEventListener(
    "change",
    function(evento) {

        if (evento.target.id === "personas") {
            procesarCantidadPersonas();
        }
    }
);


// ==========================================================
// AUMENTAR / DISMINUIR CANTIDAD DE PERSONAS
// ==========================================================

function cambiarCantidadPersonas(cambio) {

    const campoPersonas =
        document.getElementById(
            "personas"
        );

    if (!campoPersonas) {
        return;
    }

    let cantidad =
        Number(campoPersonas.value);

    // Validar que sea un número entero.
    if (!Number.isInteger(cantidad)) {
        cantidad = 1;
    }

    // Aumentar o disminuir.
    cantidad =
        cantidad + cambio;

    // Nunca bajar de 1.
    if (cantidad < 1) {
        cantidad = 1;
    }

    // Máximo técnico.
    if (cantidad > 50) {
        cantidad = 50;
    }

    campoPersonas.value =
        cantidad;

    // Actualizar precio y aviso de capacidad.
    procesarCantidadPersonas();
}


// ==========================================================
// BOTONES + Y - DE CANTIDAD DE PERSONAS
// ==========================================================

document.addEventListener(
    "click",
    function(evento) {

        const botonMas =
            evento.target.closest(
                "#aumentarPersonas"
            );

        const botonMenos =
            evento.target.closest(
                "#disminuirPersonas"
            );

        if (botonMas) {

            evento.preventDefault();
            evento.stopPropagation();

            cambiarCantidadPersonas(1);

            return;
        }

        if (botonMenos) {

            evento.preventDefault();
            evento.stopPropagation();

            cambiarCantidadPersonas(-1);

            return;
        }
    }
);


// ==========================================================
// VERIFICACIÓN FINAL
// ==========================================================

async function verificarDisponibilidadAntesDeEnviar() {

    if (
        !alojamientoActual
    ) {
        return false;
    }

    const ingreso =
        document.getElementById(
            "fechaIngreso"
        ).value;

    const salida =
        document.getElementById(
            "fechaSalida"
        ).value;

    if (
        !ingreso ||
        !salida
    ) {
        return false;
    }

    try {

        const resultado =
            await clienteSupabase
                .functions
                .invoke(
                    "obtener-disponibilidad",
                    {
                        body: {
                            alojamiento_id:
                                alojamientoActual.id
                        }
                    }
                );

        if (
            resultado.error
        ) {

            console.error(
                "Error al verificar disponibilidad:",
                resultado.error
            );

            return false;
        }

        fechasBloqueadas =
            new Set();

        const datos =
            resultado.data;

        if (
            datos &&
            Array.isArray(
                datos.blocked
            )
        ) {

            datos.blocked.forEach(
                function(fecha) {

                    fechasBloqueadas.add(
                        fecha
                    );
                }
            );
        }

        renderizarCalendario();

        return rangoDisponible(
            ingreso,
            salida
        );

    } catch (error) {

        console.error(
            "Error durante la verificación final:",
            error
        );

        return false;
    }
}

// FIN DE LA PARTE 4 DE 5

// ==========================================================
// ESTILOS DE LA VENTANA DE RESERVA
// ==========================================================

function insertarEstilosReserva() {

    if (
        document.getElementById(
            "estilosReservaCorregida"
        )
    ) {
        return;
    }

    const estilos =
        document.createElement(
            "style"
        );

    estilos.id =
        "estilosReservaCorregida";

    estilos.textContent = [
        "#ventanaReserva {",
        "    position: fixed;",
        "    inset: 0;",
        "    z-index: 10000;",
        "    background: rgba(0, 0, 0, 0.65);",
        "    display: none;",
        "    align-items: center;",
        "    justify-content: center;",
        "    padding: 20px;",
        "    box-sizing: border-box;",
        "    overflow-y: auto;",
        "    -webkit-overflow-scrolling: touch;",
        "}",

        "#ventanaReserva.reserva-visible {",
        "    display: flex !important;",
        "}",

        "#ventanaReserva .modal-contenido {",
        "    position: relative;",
        "    width: 100%;",
        "    max-width: 520px;",
        "    max-height: calc(100vh - 40px);",
        "    overflow-y: auto;",
        "    background: #ffffff;",
        "    border-radius: 16px;",
        "    padding: 28px;",
        "    box-sizing: border-box;",
        "    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);",
        "    -webkit-overflow-scrolling: touch;",
        "}",

        "#ventanaReserva .cerrar {",
        "    position: absolute;",
        "    top: 12px;",
        "    right: 14px;",
        "    width: 38px;",
        "    height: 38px;",
        "    border: none;",
        "    border-radius: 50%;",
        "    background: #f2f2f2;",
        "    color: #333333;",
        "    font-size: 25px;",
        "    line-height: 1;",
        "    cursor: pointer;",
        "    display: flex;",
        "    align-items: center;",
        "    justify-content: center;",
        "}",

        "#ventanaReserva .cerrar:hover {",
        "    background: #e6e6e6;",
        "}",

        "#ventanaReserva h2 {",
        "    margin-top: 0;",
        "    margin-bottom: 8px;",
        "    padding-right: 45px;",
        "}",

        "#ventanaReserva .nombre-reserva {",
        "    margin-top: 0;",
        "    margin-bottom: 20px;",
        "    color: #666666;",
        "    font-weight: 600;",
        "}",

        "#ventanaReserva label {",
        "    display: block;",
        "    margin-top: 14px;",
        "    margin-bottom: 6px;",
        "    font-weight: 600;",
        "}",

        "#ventanaReserva input {",
        "    width: 100%;",
        "    box-sizing: border-box;",
        "    padding: 12px 13px;",
        "    border: 1px solid #d6d6d6;",
        "    border-radius: 9px;",
        "    background: #ffffff;",
        "    font-size: 15px;",
        "    outline: none;",
        "}",

        "#ventanaReserva input:focus {",
        "    border-color: #f28c28;",
        "    box-shadow: 0 0 0 3px rgba(242, 140, 40, 0.12);",
        "}",

        "#ventanaReserva input[readonly] {",
        "    cursor: pointer;",
        "    background: #fafafa;",
        "}",

        "#contenedorCalendario {",
        "    width: 100%;",
        "}",

        "#ventanaReserva .resumen {",
        "    margin-top: 20px;",
        "    padding: 14px 16px;",
        "    background: #f7f7f7;",
        "    border-radius: 10px;",
        "}",

        "#ventanaReserva .resumen p {",
        "    margin: 5px 0;",
        "}",

        "#ventanaReserva .aviso-reserva {",
        "    margin-top: 16px;",
        "    padding: 13px 15px;",
        "    border-radius: 10px;",
        "    background: #fff7ed;",
        "    border: 1px solid #fed7aa;",
        "    color: #7c2d12;",
        "    font-size: 13px;",
        "    line-height: 1.5;",
        "}",

        "#ventanaReserva .aviso-reserva p {",
        "    margin: 5px 0 0 0;",
        "}",

        "#ventanaReserva .boton-whatsapp {",
        "    width: 100%;",
        "    margin-top: 18px;",
        "    padding: 14px 16px;",
        "    border: none;",
        "    border-radius: 10px;",
        "    background: #25d366;",
        "    color: #ffffff;",
        "    font-size: 16px;",
        "    font-weight: 700;",
        "    cursor: pointer;",
        "}",

        "#ventanaReserva .boton-whatsapp:hover {",
        "    filter: brightness(0.95);",
        "}",

        "#avisoCapacidad {",
        "    margin: 6px 0 0 0;",
        "    font-size: 13px;",
        "    color: #666666;",
        "}",

        "#avisoCapacidad.aviso-capacidad-error {",
        "    color: #b42318;",
        "    font-weight: 600;",
        "}",

        "body.sin-scroll {",
        "    overflow: hidden;",
        "}",

        "@media (max-width: 600px) {",
        "    #ventanaReserva {",
        "        align-items: flex-start;",
        "        padding: 10px;",
        "    }",

        "    #ventanaReserva .modal-contenido {",
        "        max-height: calc(100vh - 20px);",
        "        padding: 22px 16px 28px;",
        "        border-radius: 13px;",
        "    }",

        "    #ventanaReserva h2 {",
        "        font-size: 21px;",
        "    }",
        "}"
    ].join("\n");

    document.head.appendChild(
        estilos
    );
}


// ==========================================================
// ENVIAR SOLICITUD POR WHATSAPP
// ==========================================================

async function enviarWhatsApp() {

    // ======================================================
    // COMPROBAR ALOJAMIENTO
    // ======================================================

    if (!alojamientoActual) {

        alert(
            "No se ha seleccionado ningún alojamiento."
        );

        return;
    }


    // ======================================================
    // OBTENER CAMPOS
    // ======================================================

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );

    const personas =
        document.getElementById(
            "personas"
        );

    const nombre =
        document.getElementById(
            "nombre"
        );

    const telefono =
        document.getElementById(
            "telefono"
        );

    if (
        !fechaIngreso ||
        !fechaSalida ||
        !personas ||
        !nombre ||
        !telefono
    ) {

        alert(
            "No se pudo encontrar el formulario de reserva."
        );

        return;
    }


    // ======================================================
    // OBTENER DATOS DEL FORMULARIO
    // ======================================================

    const ingreso =
        fechaIngreso.value.trim();

    const salida =
        fechaSalida.value.trim();

    const cantidadPersonas =
        Number(personas.value);

    const nombreCliente =
        nombre.value.trim();

    const telefonoCliente =
        telefono.value.trim();


    // ======================================================
    // VALIDAR FECHAS
    // ======================================================

    if (!ingreso) {

        alert(
            "Seleccione la fecha de ingreso."
        );

        modoCalendario =
            "ingreso";

        mostrarCalendario();

        return;
    }

    if (!salida) {

        alert(
            "Seleccione la fecha de salida."
        );

        modoCalendario =
            "salida";

        mostrarCalendario();

        return;
    }

    if (
        diferenciaDias(
            ingreso,
            salida
        ) <= 0
    ) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de ingreso."
        );

        return;
    }


    // ======================================================
    // VALIDAR PERSONAS
    // ======================================================

    if (
        !Number.isInteger(
            cantidadPersonas
        ) ||
        cantidadPersonas < 1
    ) {

        alert(
            "Ingrese una cantidad válida de personas."
        );

        personas.focus();

        return;
    }


    // ======================================================
    // CAPACIDAD DEL ALOJAMIENTO
    // ======================================================

    const capacidadIndicada =
        Number(
            alojamientoActual.maxHuespedes
        ) || 1;

    const superaCapacidad =
        cantidadPersonas >
        capacidadIndicada;


    // ======================================================
    // SI SUPERA CAPACIDAD, EXIGIR ACEPTACIÓN
    // ======================================================

    if (superaCapacidad) {

        const aceptacion =
            document.getElementById(
                "aceptaCapacidadExcedida"
            );

        if (
            !aceptacion ||
            !aceptacion.checked
        ) {

            actualizarAvisoCapacidad(
                true
            );

            alert(
                "La cantidad de huéspedes supera la capacidad indicada. Para continuar, debe aceptar la solicitud especial de personas adicionales."
            );

            const aviso =
                document.getElementById(
                    "avisoCapacidad"
                );

            if (aviso) {

                aviso.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            return;
        }
    }


    // ======================================================
    // VALIDAR NOMBRE
    // ======================================================

    if (!nombreCliente) {

        alert(
            "Ingrese su nombre completo."
        );

        nombre.focus();

        return;
    }


    // ======================================================
    // VALIDAR TELÉFONO
    // ======================================================

    if (!telefonoCliente) {

        alert(
            "Ingrese su número de teléfono."
        );

        telefono.focus();

        return;
    }


    // ======================================================
    // BOTÓN DE WHATSAPP
    // ======================================================

    const boton =
        document.querySelector(
            "#ventanaReserva .boton-whatsapp"
        );

    const textoOriginal =
        boton
            ? boton.textContent
            : "";

    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "Verificando disponibilidad...";
    }


    // ======================================================
    // VERIFICAR DISPONIBILIDAD
    // ======================================================

    const disponible =
        await verificarDisponibilidadAntesDeEnviar();

    if (!disponible) {

        if (boton) {

            boton.disabled =
                false;

            boton.textContent =
                textoOriginal;
        }

        alert(
            "Lo sentimos, las fechas seleccionadas ya no están disponibles. Por favor seleccione otras fechas."
        );

        fechaSalidaSeleccionada =
            null;

        fechaSalida.value =
            "";

        modoCalendario =
            "salida";

        calcularPrecio();

        mostrarCalendario();

        return;
    }


    // ======================================================
    // CALCULAR NOCHES
    // ======================================================

    const noches =
        diferenciaDias(
            ingreso,
            salida
        );


    // ======================================================
    // DATOS DE PRECIOS
    // ======================================================

    const personasIncluidas =
        Number(
            alojamientoActual.personasIncluidas
        ) || 0;

    const precioBase =
        Number(
            alojamientoActual.precioBase
        ) || 0;

    const precioPersona =
        Number(
            alojamientoActual.precioPersona
        ) || 0;


    // ======================================================
    // CALCULAR TODAS LAS PERSONAS ADICIONALES
    // ======================================================

    /*
        Este cálculo no utiliza maxHuespedes.

        Ejemplo:
        Personas incluidas: 2
        Capacidad indicada: 5
        Personas solicitadas: 7

        Personas cobradas como adicionales:
        7 - 2 = 5

        Aunque la capacidad indicada sea 5,
        el precio se calcula para las 7 personas.
    */

    const personasAdicionalesPrecio =
        Math.max(
            cantidadPersonas -
            personasIncluidas,
            0
        );

    const precioPorNoche =
        precioBase +
        (
            personasAdicionalesPrecio *
            precioPersona
        );

    const total =
        precioPorNoche *
        noches;


    // ======================================================
    // PERSONAS SOBRE LA CAPACIDAD INDICADA
    // ======================================================

    const personasSobreCapacidad =
        Math.max(
            cantidadPersonas -
            capacidadIndicada,
            0
        );


    // ======================================================
    // MENSAJE ESPECIAL
    // ======================================================

    let mensajeCapacidad =
        "";

    if (superaCapacidad) {

        mensajeCapacidad =

            "\n\n" +

            "SOLICITUD ESPECIAL DE PERSONAS ADICIONALES" +
            "\n\n" +

            "Capacidad máxima: " +
            capacidadIndicada +
            " personas" +
            "\n" +

            "Personas solicitadas: " +
            cantidadPersonas +
            "\n" +

            "Personas adicionales: " +
            personasSobreCapacidad +
            "\n\n" +

            "El huésped declara conocer la capacidad máxima del alojamiento y manifiesta estar dispuesto(a) a acomodarse en el alojamiento." +
            "\n\n" +

            "Esta solicitud especial queda sujeta a confirmación.";
    }


    // ======================================================
    // CONSTRUIR MENSAJE
    // ======================================================

    const mensaje =

        "SOLICITUD DE RESERVA" +
        "\n\n" +

        "Estancias Agradables" +
        "\n\n" +

        "Alojamiento: " +
        alojamientoActual.nombre +
        "\n\n" +

        "Nombre: " +
        nombreCliente +
        "\n" +

        "Teléfono: " +
        telefonoCliente +
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
        cantidadPersonas +
        "\n" +

        "Total estimado: Q" +
        total.toFixed(2) +

        mensajeCapacidad +

        "\n\n" +

        "Esta es una solicitud de reserva. La reserva queda sujeta a confirmación de disponibilidad.";


    // ======================================================
    // WHATSAPP
    // ======================================================

    const numeroWhatsApp =
        "50254134493";

    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(
            mensaje
        );


    // ======================================================
    // RESTAURAR BOTÓN
    // ======================================================

    if (boton) {

        boton.disabled =
            false;

        boton.textContent =
            textoOriginal;
    }


    // ======================================================
    // ABRIR WHATSAPP
    // ======================================================

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


// ==========================================================
// EVENTOS GENERALES
// ==========================================================

function configurarEventosGenerales() {

    const ventanaReserva =
        document.getElementById(
            "ventanaReserva"
        );

    if (
        ventanaReserva &&
        !ventanaReserva.dataset.eventosConfigurados
    ) {

        ventanaReserva.dataset.eventosConfigurados =
            "true";

        ventanaReserva.addEventListener(
            "click",
            function(evento) {

                if (
                    evento.target ===
                    ventanaReserva
                ) {

                    cerrarReserva();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        function(evento) {

            if (
                evento.key !==
                "Escape"
            ) {
                return;
            }

            if (
                visorFotos &&
                visorFotos.classList.contains(
                    "visor-visible"
                )
            ) {

                cerrarVisorFotos();

                return;
            }

            if (
                modalAlojamiento &&
                modalAlojamiento.classList.contains(
                    "modal-alojamiento-visible"
                )
            ) {

                cerrarModalAlojamiento();

                return;
            }

            const reserva =
                document.getElementById(
                    "ventanaReserva"
                );

            if (
                reserva &&
                reserva.classList.contains(
                    "reserva-visible"
                )
            ) {

                cerrarReserva();
            }
        }
    );
}


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

async function iniciarSitio() {

    const preparaciones = [
        [
            "insertarEstilosVisor",
            function() {
                insertarEstilosVisor();
            }
        ],
        [
            "insertarEstilosModalAlojamiento",
            function() {
                insertarEstilosModalAlojamiento();
            }
        ],
        [
            "insertarEstilosCalendario",
            function() {
                insertarEstilosCalendario();
            }
        ],
        [
            "insertarEstilosReserva",
            function() {
                insertarEstilosReserva();
            }
        ],
        [
            "crearVisorFotos",
            function() {
                crearVisorFotos();
            }
        ],
        [
            "crearModalAlojamiento",
            function() {
                crearModalAlojamiento();
            }
        ],
        [
            "configurarEventosGenerales",
            function() {
                configurarEventosGenerales();
            }
        ]
    ];

    for (
        const [nombre, ejecutar] of preparaciones
    ) {

        try {

            ejecutar();

        } catch (error) {

            console.error(
                "Error en " + nombre + ":",
                error
            );
        }
    }

    try {

        await cargarAlojamientos();

    } catch (error) {

        console.error(
            "Error al cargar los alojamientos:",
            error
        );
    }

    try {

        await cargarPortada();

    } catch (error) {

        console.error(
            "Error al cargar la portada:",
            error
        );
    }
}


// ==========================================================
// FUNCIONES GLOBALES PARA BOTONES DEL HTML
// ==========================================================

if (
    typeof cerrarReserva === "function"
) {
    window.cerrarReserva = cerrarReserva;
}

if (
    typeof enviarWhatsApp === "function"
) {
    window.enviarWhatsApp = enviarWhatsApp;
}

if (
    typeof abrirReserva === "function"
) {
    window.abrirReserva = abrirReserva;
}


// ==========================================================
// INICIAR CUANDO EL DOM ESTÉ DISPONIBLE
// ==========================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarSitio
    );

} else {

    iniciarSitio();
}


// ==========================================================
// MEJORAS DEL RESUMEN DE COTIZACIÓN
// ==========================================================

function actualizarDesgloseReserva() {

    const resumen =
        document.querySelector(
            "#ventanaReserva .resumen"
        );

    if (
        !resumen ||
        !alojamientoActual
    ) {
        return;
    }

    let desglose =
        document.getElementById(
            "desgloseReserva"
        );

    if (!desglose) {

        desglose =
            document.createElement("div");

        desglose.id =
            "desgloseReserva";

        resumen.insertBefore(
            desglose,
            resumen.firstChild
        );
    }

    const ingreso =
        document.getElementById(
            "fechaIngreso"
        )?.value.trim();

    const salida =
        document.getElementById(
            "fechaSalida"
        )?.value.trim();

    const valorPersonas =
        Number(
            document.getElementById("personas")?.value
        );

    if (
        !ingreso ||
        !salida ||
        !Number.isInteger(valorPersonas) ||
        valorPersonas < 1 ||
        valorPersonas > 50
    ) {

        desglose.innerHTML =
            "";

        return;
    }

    const noches =
        diferenciaDias(
            ingreso,
            salida
        );

    if (
        !Number.isFinite(noches) ||
        noches <= 0
    ) {

        desglose.innerHTML =
            "";

        return;
    }

    const incluidas =
        Number(
            alojamientoActual.personasIncluidas
        ) || 0;

    const precioBase =
        Number(
            alojamientoActual.precioBase
        ) || 0;

    const precioAdicional =
        Number(
            alojamientoActual.precioPersona
        ) || 0;

    const adicionales =
        Math.max(
            valorPersonas - incluidas,
            0
        );

    const costoAdicional =
        adicionales * precioAdicional;

    const precioPorNoche =
        precioBase + costoAdicional;

    const formato = valor =>
        "Q" + valor.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    desglose.innerHTML = `
        <div class="desglose-fila">
            <span>Tarifa base (incluye ${incluidas} personas)</span>
            <strong>${formato(precioBase)}</strong>
        </div>

        <div class="desglose-fila">
            <span>
                Adicionales (${adicionales} ×
                ${formato(precioAdicional)})
            </span>
            <strong>${formato(costoAdicional)}</strong>
        </div>

        <div class="desglose-fila">
            <span>Precio por noche</span>
            <strong>${formato(precioPorNoche)}</strong>
        </div>

        <div class="desglose-fila">
            <span>Noches seleccionadas en calendario</span>
            <strong>${noches}</strong>
        </div>
    `;
}


// Complementa el cálculo existente.
const calcularPrecioOriginal =
    calcularPrecio;

calcularPrecio = function() {

    calcularPrecioOriginal();
    actualizarDesgloseReserva();
    actualizarFechasTarjeta();
};


// ==========================================================
// ESTILOS DEL VISOR DE PANTALLA COMPLETA
// ==========================================================

function insertarEstilosVisor() {

    if (
        document.getElementById(
            "estilosVisorFotos"
        )
    ) {
        return;
    }

    const estilos =
        document.createElement("style");

    estilos.id =
        "estilosVisorFotos";

    estilos.textContent = `
        #visorFotos {
            position: fixed;
            inset: 0;
            z-index: 9000;
            background: rgba(0, 0, 0, 0.94);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease,
                        visibility 0.25s ease;
        }

        #visorFotos.visor-visible {
            opacity: 1;
            visibility: visible;
        }

        .visor-contenido {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            box-sizing: border-box;
            padding: 0;
            touch-action: pan-y;
            cursor: grab;
        }

        .visor-contenido:active {
            cursor: grabbing;
        }

        .visor-imagen {
            position: absolute;
            top: 60px;
            left: 60px;
            width: calc(100% - 120px);
            height: calc(100% - 120px);
            max-width: none;
            max-height: none;
            object-fit: contain;
            user-select: none;
            -webkit-user-select: none;
            -webkit-user-drag: none;
            pointer-events: none;
            transform: translateX(0);
            transition: none;
        }

        @media (max-width: 600px) {
            .visor-imagen {
                top: 45px;
                left: 10px;
                width: calc(100% - 20px);
                height: calc(100% - 90px);
            }
        }

        .visor-cerrar {
            position: absolute;
            top: 20px;
            right: 25px;
            z-index: 10;
            border: none;
            background: transparent;
            color: white;
            font-size: 38px;
            cursor: pointer;
        }

        .visor-flecha {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            border: none;
            background: rgba(0, 0, 0, 0.35);
            color: white;
            font-size: 30px;
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
        }

        .visor-anterior {
            left: 15px;
        }

        .visor-siguiente {
            right: 15px;
        }

        .visor-contador {
            position: absolute;
            bottom: 22px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            color: white;
            font-size: 14px;
        }

        #modalAlojamientoFoto,
        #modalFotoSecundaria1,
        #modalFotoSecundaria2 {
            cursor: zoom-in;
        }

        @media (max-width: 600px) {
            .visor-contenido {
                padding: 45px 10px;
            }

            .visor-flecha {
                display: none;
            }

            .visor-cerrar {
                top: 12px;
                right: 12px;
            }
        }
    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// ABRIR LAS TRES FOTOGRAFÍAS DE LA FICHA
// ==========================================================

document.addEventListener(
    "click",
    function(evento) {

        const foto =
            evento.target.closest(
                "#modalAlojamientoFoto, " +
                "#modalFotoSecundaria1, " +
                "#modalFotoSecundaria2"
            );

        if (
            !foto ||
            !modalAlojamientoFotos.length
        ) {
            return;
        }

        evento.preventDefault();
        evento.stopPropagation();

        const total =
            modalAlojamientoFotos.length;

        let indice =
            modalAlojamientoIndice;

        if (
            foto.id === "modalFotoSecundaria1"
        ) {
            indice = (indice + 1) % total;
        }

        if (
            foto.id === "modalFotoSecundaria2"
        ) {
            indice = (indice + 2) % total;
        }

        abrirVisorFotos(
            modalAlojamientoFotos,
            indice
        );
    }
);


// ==========================================================
// NAVEGACIÓN CON TECLADO EN EL VISOR
// ==========================================================

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
            evento.key === "ArrowRight"
        ) {

            evento.preventDefault();

            cambiarFotoVisor(
                indiceVisor + 1
            );
        }

        if (
            evento.key === "ArrowLeft"
        ) {

            evento.preventDefault();

            cambiarFotoVisor(
                indiceVisor - 1
            );
        }
    }
);


// ==========================================================
// CONEXIONES DE LA FICHA Y ESTADO COMPARTIDO DE RESERVA
// ==========================================================

function normalizarAlojamiento(a) {

    return {
        ...a,

        precioBase:
            Number(
                a.precio_base ??
                a.precioBase ??
                0
            ),

        precioPersona:
            Number(
                a.precio_persona ??
                a.precioPersona ??
                0
            ),

        personasIncluidas:
            Number(
                a.personas_incluidas ??
                a.personasIncluidas ??
                0
            ),

        maxHuespedes:
            Number(
                a.max_huespedes ??
                a.maxHuespedes ??
                1
            )
    };
}


function sincronizarScroll() {

    document.body.classList.toggle(
        "sin-scroll",
        Boolean(
            document.querySelector(
                ".modal-alojamiento-visible, " +
                ".reserva-visible, " +
                ".visor-visible"
            )
        )
    );
}


function actualizarFechasTarjeta() {

    const entrada =
        document.getElementById(
            "reservaEntradaTexto"
        );

    const salida =
        document.getElementById(
            "reservaSalidaTexto"
        );

    const huespedes =
        document.getElementById(
            "reservaHuespedesTexto"
        );

    if (entrada) {

        entrada.textContent =
            fechaIngresoSeleccionada ||
            "Seleccionar fecha";
    }

    if (salida) {

        salida.textContent =
            fechaSalidaSeleccionada ||
            "Seleccionar fecha";
    }

    const cantidad =
        Number(
            document.getElementById("personas")?.value
        ) || 2;

    if (huespedes) {

        huespedes.textContent =
            cantidad +
            (
                cantidad === 1
                    ? " persona"
                    : " personas"
            );
    }

    const contador =
        document.getElementById(
            "cantidadFicha"
        );

    if (contador) {
        contador.textContent = cantidad;
    }
}


function prepararFechasFicha() {

    fechaIngresoSeleccionada =
        null;

    fechaSalidaSeleccionada =
        null;

    fechasBloqueadas =
        new Set();

    disponibilidadVerificada =
        false;

    modoCalendario =
        "ingreso";

    mesCalendarioActual =
        new Date();

    mesCalendarioActual.setDate(1);

    for (
        const id of [
            "fechaIngreso",
            "fechaSalida"
        ]
    ) {

        const campo =
            document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    }

    const personas =
        document.getElementById(
            "personas"
        );

    if (personas) {
        personas.value = 2;
    }

    let panel =
        document.getElementById(
            "calendarioFlotanteTarjeta"
        );

    if (!panel) {

        panel =
            document.createElement("div");

        panel.id =
            "calendarioFlotanteTarjeta";

        const contenido =
            document.createElement("div");

        contenido.id =
            "calendarioTarjetaContenido";

        panel.appendChild(contenido);

        document.getElementById(
            "modalAlojamientoReservar"
        )?.before(panel);
    }

    panel.hidden =
        true;

    const menu =
        document.getElementById(
            "reservaHuespedesMenu"
        );

    const boton =
        document.getElementById(
            "reservaHuespedesTarjeta"
        );

    if (
        menu &&
        boton &&
        !boton.dataset.conectado
    ) {

        boton.dataset.conectado =
            "true";

        menu.innerHTML =
            '<button type="button" id="fichaMenos" ' +
            'aria-label="Disminuir huéspedes">−</button> ' +
            '<span id="cantidadFicha">2</span> ' +
            '<button type="button" id="fichaMas" ' +
            'aria-label="Aumentar huéspedes">+</button>' +
            '<p>Las solicitudes que superen la capacidad indicada ' +
            'requieren aceptación en el formulario.</p>';

        boton.addEventListener(
            "click",
            function() {

                menu.hidden =
                    !menu.hidden;

                boton.setAttribute(
                    "aria-expanded",
                    String(!menu.hidden)
                );
            }
        );

        document.getElementById(
            "fichaMenos"
        ).onclick = function() {

            cambiarCantidadPersonas(-1);
        };

        document.getElementById(
            "fichaMas"
        ).onclick = function() {

            cambiarCantidadPersonas(1);
        };
    }

    if (menu) {
        menu.hidden = true;
    }

    if (boton) {

        boton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    actualizarFechasTarjeta();

    if (
        !document.getElementById(
            "ea-conexiones-estilos"
        )
    ) {

        const estilo =
            document.createElement("style");

        estilo.id =
            "ea-conexiones-estilos";

        estilo.textContent = `
            #calendarioFlotanteTarjeta[hidden],
            #reservaHuespedesMenu[hidden] {
                display: none !important;
            }

            #calendarioDias.calendario-dos-meses {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
            }

            .calendario-dias-mes {
                display: grid;
                grid-template-columns: repeat(7, minmax(0, 1fr));
                gap: 3px;
            }

            #calendarioReserva > .calendario-semana {
                display: none;
            }

            .calendario-titulo-mes {
                text-align: center;
                font-weight: 700;
                margin-bottom: 10px;
            }

            #reservaHuespedesMenu {
                padding: 12px;
            }

            #reservaHuespedesMenu button {
                padding: 8px 14px;
                cursor: pointer;
            }

            .desglose-fila {
                display: flex;
                justify-content: space-between;
                gap: 12px;
                margin: 8px 0;
            }

            .modal-alojamiento-galeria {
                position: relative;
                overflow: hidden;
            }

            #visorFotos {
                z-index: 11000;
            }

            @media (max-width: 600px) {
                #calendarioDias.calendario-dos-meses {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(estilo);
    }
}

// FIN DE LA PARTE 5 DE 5
// FIN DEL SCRIPT COMPLETO

// ==========================================================
// CALENDARIO AMPLIO Y DISPONIBILIDAD DENTRO DEL ANUNCIO
// ==========================================================

(function mejorarCalendarioYDisponibilidad() {

    if (window.eaCalendarioAmplioInstalado) return;
    window.eaCalendarioAmplioInstalado = true;

    const estilos = document.createElement("style");
    estilos.id = "ea-calendario-amplio";

    estilos.textContent = `
        #modalAlojamiento #calendarioFlotanteTarjeta {
            position: fixed !important;
            float: none !important;
            clear: none !important;
            margin: 0 !important;
            padding: 0 !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
            box-sizing: border-box !important;
            z-index: 12000 !important;
            width: min(720px, calc(100vw - 40px)) !important;
            max-width: none !important;
            overflow-y: auto !important;
            background: #ffffff;
            border: 1px solid #dce7e5;
            border-radius: 18px;
            box-shadow: 0 16px 55px rgba(0, 0, 0, 0.25);
            overscroll-behavior: contain;
        }

        #modalAlojamiento #calendarioFlotanteTarjeta[hidden] {
            display: none !important;
        }

        #modalAlojamiento #calendarioFlotanteTarjeta:not([hidden]) {
            display: block !important;
        }

        .ea-calendario-barra {
            position: sticky;
            top: 0;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 14px 18px;
            background: #ffffff;
            border-bottom: 1px solid #e5eeec;
        }

        .ea-calendario-barra strong {
            font-size: 17px;
            color: #103e42;
        }

        .ea-calendario-cerrar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            border: 0;
            border-radius: 50%;
            background: #edf4f3;
            color: #103e42;
            font-size: 28px;
            cursor: pointer;
        }

        #modalAlojamiento #calendarioReserva {
            width: 100% !important;
            margin: 0 !important;
            padding: 18px !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
        }

        #modalAlojamiento #calendarioDias.calendario-dos-meses {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 24px !important;
        }

        #modalAlojamiento .calendario-panel-mes {
            min-width: 0;
        }

        #modalAlojamiento .calendario-titulo-mes {
            margin: 10px 0 16px !important;
            font-size: 19px !important;
            font-weight: 700;
            color: #103e42;
        }

        #modalAlojamiento .calendario-dias-mes {
            display: grid !important;
            grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
            gap: 4px !important;
        }

        #modalAlojamiento .calendario-semana {
            display: grid;
            grid-template-columns: repeat(7, minmax(0, 1fr));
        }

        #modalAlojamiento #calendarioReserva > .calendario-semana {
            display: none !important;
        }

        #modalAlojamiento .calendario-dia-semana {
            font-size: 13px !important;
            padding: 8px 0 !important;
            color: #647574;
        }

        #modalAlojamiento .calendario-dia {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 40px !important;
            aspect-ratio: 1 !important;
            padding: 0 !important;
            font-size: 16px !important;
            font-weight: 600;
        }

        #modalAlojamiento .calendario-nav {
            width: 44px !important;
            height: 44px !important;
            font-size: 26px !important;
        }

        #modalAlojamiento .calendario-dia.ingreso,
        #modalAlojamiento .calendario-dia.salida {
            background: #087b80 !important;
            color: #ffffff !important;
        }

        #modalAlojamiento .calendario-dia.en-rango {
            background: #dff1ef !important;
            color: #103e42;
        }

        #modalAlojamiento .calendario-dia.hoy {
            border-color: #087b80 !important;
        }

        #modalAlojamiento .calendario-mensaje {
            font-size: 14px !important;
            padding: 12px !important;
        }

        #modalAlojamiento .calendario-leyenda {
            font-size: 12px !important;
            gap: 12px !important;
        }

        #eaResultadoDisponibilidad {
            margin: 16px 0;
            padding: 16px;
            border: 1px solid #c9e2de;
            border-radius: 12px;
            background: #eef8f5;
            color: #103e42;
            font-size: 15px;
            line-height: 1.6;
            overflow-wrap: anywhere;
        }

        #eaResultadoDisponibilidad[hidden] {
            display: none !important;
        }

        #eaResultadoDisponibilidad p {
            margin: 6px 0;
        }

        #eaResultadoDisponibilidad .ea-total {
            margin-top: 12px;
            font-size: 22px;
            font-weight: 700;
        }

        #eaResultadoDisponibilidad.ea-resultado-error {
            background: #fff5ef;
            border-color: #edcbb9;
            color: #843f20;
        }

        @media (max-width: 700px) {

            #modalAlojamiento #calendarioFlotanteTarjeta {
                inset: 12px !important;
                width: auto !important;
                height: auto !important;
                max-height: none !important;
                border-radius: 16px;
            }

            #modalAlojamiento #calendarioDias.calendario-dos-meses {
                grid-template-columns: minmax(0, 1fr) !important;
                gap: 28px !important;
            }

            #modalAlojamiento #calendarioReserva {
                padding: 12px !important;
            }

            #modalAlojamiento .calendario-dia {
                min-height: 38px !important;
                font-size: 20px !important;
            }

            #modalAlojamiento .calendario-titulo-mes {
                font-size: 22px !important;
            }

            #modalAlojamiento .calendario-dia-semana {
                font-size: 14px !important;
            }
        }
    `;

    document.head.appendChild(estilos);


    // ======================================================
    // POSICIÓN DEL CALENDARIO
    // ======================================================

    function colocarCalendario() {

        const panel = document.getElementById(
            "calendarioFlotanteTarjeta"
        );

        if (!panel || panel.hidden) return;

        if (!panel.querySelector(".ea-calendario-barra")) {

            const barra = document.createElement("div");
            barra.className = "ea-calendario-barra";

            const titulo = document.createElement("strong");
            titulo.textContent = "Selecciona tus fechas";

            const cerrar = document.createElement("button");
            cerrar.type = "button";
            cerrar.className = "ea-calendario-cerrar";
            cerrar.textContent = "×";
            cerrar.setAttribute("aria-label", "Cerrar calendario");

            cerrar.addEventListener("click", function(evento) {
                evento.preventDefault();
                evento.stopPropagation();
                panel.hidden = true;
            });

            barra.append(titulo, cerrar);
            panel.prepend(barra);
        }

        if (window.innerWidth <= 700) return;

        const referencia = document.getElementById(
            "reservaEntradaTarjeta"
        );

        if (!referencia) return;

        const rectangulo = referencia.getBoundingClientRect();
        const ancho = Math.min(720, window.innerWidth - 40);

        const izquierda = Math.max(
            20,
            Math.min(
                rectangulo.right - ancho,
                window.innerWidth - ancho - 20
            )
        );

        const altoDisponible = window.innerHeight - 40;
        const altoDeseado = Math.min(560, altoDisponible);

        const arriba = Math.max(
            20,
            Math.min(
                rectangulo.bottom + 10,
                window.innerHeight - altoDeseado - 20
            )
        );

        panel.style.setProperty(
            "left",
            izquierda + "px",
            "important"
        );

        panel.style.setProperty(
            "top",
            arriba + "px",
            "important"
        );

        panel.style.setProperty(
            "max-height",
            (window.innerHeight - arriba - 20) + "px",
            "important"
        );
    }


    // Se ejecuta después del evento que abre el calendario.
    document.addEventListener("click", function(evento) {

        if (
            evento.target.closest(
                "#reservaEntradaTarjeta, #reservaSalidaTarjeta"
            )
        ) {
            requestAnimationFrame(colocarCalendario);
        }
    }, true);

    window.addEventListener("resize", colocarCalendario);


    // ======================================================
    // RESULTADO DE DISPONIBILIDAD EN LA MISMA FICHA
    // ======================================================

    function mostrarResultado(texto, esError) {

        const boton = document.getElementById(
            "modalAlojamientoReservar"
        );

        if (!boton) return;

        let resultado = document.getElementById(
            "eaResultadoDisponibilidad"
        );

        if (!resultado) {

            resultado = document.createElement("div");
            resultado.id = "eaResultadoDisponibilidad";
            resultado.setAttribute("role", "status");
            resultado.setAttribute("aria-live", "polite");

            boton.after(resultado);
        }

        resultado.hidden = false;
        resultado.classList.toggle(
            "ea-resultado-error",
            Boolean(esError)
        );

        resultado.textContent = texto;

        return resultado;
    }


    // Capturar el botón antes del evento anterior.
    // Así no cierra el anuncio ni abre el formulario.
    document.addEventListener("click", async function(evento) {

        const boton = evento.target.closest(
            "#modalAlojamientoReservar"
        );

        if (!boton) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();

        if (boton.disabled || !alojamientoActual) return;

        const ingreso = fechaIngresoSeleccionada;
        const salida = fechaSalidaSeleccionada;

        const personas = Number(
            document.getElementById("personas")?.value
        );

        if (
            !ingreso ||
            !salida ||
            diferenciaDias(ingreso, salida) <= 0
        ) {

            mostrarResultado(
                "Selecciona las fechas de entrada y salida.",
                true
            );

            document.getElementById(
                !ingreso
                    ? "reservaEntradaTarjeta"
                    : "reservaSalidaTarjeta"
            )?.click();

            return;
        }

        if (
            !Number.isInteger(personas) ||
            personas < 1
        ) {

            mostrarResultado(
                "Selecciona una cantidad válida de huéspedes.",
                true
            );

            return;
        }

        const alojamientoConsultado = alojamientoActual;
        const textoOriginal = boton.textContent;

        boton.disabled = true;
        boton.textContent = "Consultando disponibilidad...";

        const panel = document.getElementById(
            "calendarioFlotanteTarjeta"
        );

        if (panel) panel.hidden = true;

        mostrarResultado(
            "Estamos comprobando tus fechas.",
            false
        );

        try {

            const respuesta = await clienteSupabase.functions.invoke(
                "obtener-disponibilidad",
                {
                    body: {
                        alojamiento_id: alojamientoConsultado.id
                    }
                }
            );

            // Ignorar una respuesta si se cambió de alojamiento.
            if (alojamientoActual !== alojamientoConsultado) return;

            if (
                respuesta.error ||
                !Array.isArray(respuesta.data?.blocked)
            ) {
                throw new Error(
                    "No se pudo comprobar la disponibilidad."
                );
            }

            fechasBloqueadas = new Set(
                respuesta.data.blocked
            );

            disponibilidadVerificada = true;
            renderizarCalendario();

            // Si se modificó la selección durante la consulta,
            // pedir una nueva comprobación.
            if (
                ingreso !== fechaIngresoSeleccionada ||
                salida !== fechaSalidaSeleccionada ||
                personas !== Number(
                    document.getElementById("personas")?.value
                )
            ) {

                mostrarResultado(
                    "Cambiaste los datos. Presiona Ver disponibilidad nuevamente.",
                    true
                );

                return;
            }

            if (!rangoDisponible(ingreso, salida)) {

                mostrarResultado(
                    "Estas fechas no están disponibles. Selecciona otro período.",
                    true
                );

                return;
            }

            const noches = diferenciaDias(ingreso, salida);
            const datos = normalizarAlojamiento(
                alojamientoConsultado
            );

            const adicionales = Math.max(
                personas - datos.personasIncluidas,
                0
            );

            const precioNoche =
                datos.precioBase +
                adicionales * datos.precioPersona;

            const total = precioNoche * noches;

            const moneda = valor =>
                "Q" + valor.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

            const resultado = mostrarResultado("", false);

            if (!resultado) return;

            const titulo = document.createElement("strong");
            titulo.textContent = "✓ Fechas disponibles";

            resultado.appendChild(titulo);

            const lineas = [
                "Entrada: " + ingreso,
                "Salida: " + salida,
                "Huéspedes: " + personas,
                "Noches: " + noches,
                "Precio por noche: " + moneda(precioNoche)
            ];

            lineas.forEach(function(texto) {

                const linea = document.createElement("p");
                linea.textContent = texto;

                resultado.appendChild(linea);
            });

            const totalElemento = document.createElement("p");
            totalElemento.className = "ea-total";
            totalElemento.textContent =
                "Total estimado: " + moneda(total);

            resultado.appendChild(totalElemento);

            if (personas > datos.maxHuespedes) {

                const aviso = document.createElement("p");

                aviso.textContent =
                    "La cantidad de huéspedes supera la capacidad indicada de " +
                    datos.maxHuespedes +
                    " personas. La solicitud requiere aceptación del alojamiento.";

                resultado.appendChild(aviso);
            }

            const nota = document.createElement("p");

            nota.textContent =
                "La consulta no bloquea las fechas. La reservación se confirma con el 50% del total.";

            resultado.appendChild(nota);

        } catch (error) {

            if (alojamientoActual === alojamientoConsultado) {

                mostrarResultado(
                    "No pudimos comprobar la disponibilidad. Intenta nuevamente.",
                    true
                );
            }

            console.error(
                "Error al consultar disponibilidad en la ficha:",
                error
            );

        } finally {

            boton.disabled = false;
            boton.textContent = textoOriginal;
        }

    }, true);


    // ======================================================
    // OCULTAR RESULTADOS SI CAMBIAN LOS DATOS
    // ======================================================

    function ocultarResultado() {

        const resultado = document.getElementById(
            "eaResultadoDisponibilidad"
        );

        if (resultado) resultado.hidden = true;
    }

    document.addEventListener("click", function(evento) {

        if (
            evento.target.closest(
                "#reservaEntradaTarjeta, " +
                "#reservaSalidaTarjeta, " +
                "#fichaMenos, #fichaMas, " +
                ".calendario-dia, " +
                ".ea-ver-detalles, " +
                "#cerrarModalAlojamiento"
            )
        ) {
            ocultarResultado();
        }
    }, true);

    document.addEventListener("input", function(evento) {

        if (evento.target.id === "personas") {
            ocultarResultado();
        }
    });

})();

// ==========================================================
// CALENDARIO INTEGRADO DENTRO DE LA FICHA
// ==========================================================

(function integrarCalendarioEnFicha() {

    function ajustarCalendarioIntegrado() {

        const modal = document.getElementById(
            "modalAlojamiento"
        );

        const panel = document.getElementById(
            "calendarioFlotanteTarjeta"
        );

        const boton = document.getElementById(
            "modalAlojamientoReservar"
        );

        if (!modal || !panel || !boton) return;

        // Mantenerlo entre Huéspedes y Ver disponibilidad.
        if (
            panel.parentElement !== boton.parentElement ||
            panel.nextElementSibling !== boton
        ) {
            boton.before(panel);
        }

        if (panel.hidden) return;

        const ficha = modal.querySelector(
            ".modal-alojamiento-contenido"
        );

        const reserva = boton.parentElement;

        if (!ficha || !reserva) return;

        const bordeFicha = ficha.getBoundingClientRect();
        const bordeReserva = reserva.getBoundingClientRect();

        const estiloReserva = getComputedStyle(reserva);

        const paddingIzquierdo =
            parseFloat(estiloReserva.paddingLeft) || 0;

        const paddingDerecho =
            parseFloat(estiloReserva.paddingRight) || 0;

        const anchoColumna =
            reserva.clientWidth -
            paddingIzquierdo -
            paddingDerecho;

        const limiteDerecho =
            bordeReserva.right -
            paddingDerecho;

        // El calendario nunca sobrepasa el borde de la ficha.
        const espacioInterior =
            limiteDerecho -
            bordeFicha.left -
            18;

        const esCelular =
            window.innerWidth <= 700;

        const anchoCalendario = esCelular
            ? anchoColumna
            : Math.min(
                720,
                Math.max(anchoColumna, espacioInterior)
            );

        const desplazamiento =
            Math.min(
                0,
                anchoColumna - anchoCalendario
            );

        const reglas = {
            position: "relative",
            inset: "auto",
            top: "auto",
            right: "auto",
            bottom: "auto",
            left: "auto",
            float: "none",
            clear: "both",
            transform: "none",
            width: anchoCalendario + "px",
            "min-width": "0",
            "max-width": "none",
            height: "auto",
            "max-height": "none",
            margin: "16px 0",
            "margin-left": desplazamiento + "px",
            padding: "0",
            overflow: "hidden",
            "box-sizing": "border-box",
            "z-index": "30",
            background: "#ffffff",
            border: "1px solid #dce7e5",
            "border-radius": "16px",
            "box-shadow": "0 10px 30px rgba(16, 62, 66, 0.16)"
        };

        Object.entries(reglas).forEach(
            function([propiedad, valor]) {

                panel.style.setProperty(
                    propiedad,
                    valor,
                    "important"
                );
            }
        );

        const dias = document.getElementById(
            "calendarioDias"
        );

        if (dias) {

            dias.style.setProperty(
                "grid-template-columns",
                esCelular
                    ? "minmax(0, 1fr)"
                    : "repeat(2, minmax(0, 1fr))",
                "important"
            );

            dias.style.setProperty(
                "gap",
                esCelular ? "24px" : "22px",
                "important"
            );
        }

        const barra = panel.querySelector(
            ".ea-calendario-barra"
        );

        if (barra) {

            barra.style.position = "relative";

            const titulo = barra.querySelector("strong");

            if (titulo) {
                titulo.textContent = "Selecciona tu estancia";
            }
        }
    }


    // Aplicar después del posicionamiento del bloque anterior.
    function programarAjuste() {

        requestAnimationFrame(
            ajustarCalendarioIntegrado
        );
    }

    document.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target.closest(
                    "#reservaEntradaTarjeta, " +
                    "#reservaSalidaTarjeta, " +
                    "#calendarioMesAnterior, " +
                    "#calendarioMesSiguiente"
                )
            ) {
                programarAjuste();
            }
        },
        true
    );

    window.addEventListener(
        "resize",
        programarAjuste
    );

    programarAjuste();

})();

// ==========================================================
// COLORES DEL LOGOTIPO, CÍRCULOS Y SALIDA EN DÍA BLOQUEADO
// ==========================================================

(function ajustarFechasYColores() {

    const estilo = document.createElement("style");

    estilo.textContent = `
        #calendarioReserva .calendario-dias-mes {
            gap: 4px !important;
        }

        #calendarioReserva .calendario-dias-mes > .calendario-dia {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            justify-self: center !important;
            align-self: center !important;

            width: min(100%, 44px) !important;
            height: auto !important;
            min-width: 0 !important;
            min-height: 0 !important;
            max-width: 44px !important;
            max-height: none !important;

            aspect-ratio: 1 / 1 !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
            border: 2px solid transparent !important;
            border-radius: 50% !important;

            background: transparent !important;
            color: #103e42 !important;
            font-weight: 600;
            line-height: 1 !important;
        }

        #calendarioReserva .calendario-dia.hoy {
            border-color: #c4a15b !important;
        }

        #calendarioReserva .calendario-dia.en-rango {
            background: #dff1ef !important;
            color: #103e42 !important;
        }

        #calendarioReserva .calendario-dia.ingreso,
        #calendarioReserva .calendario-dia.salida {
            background: #087b80 !important;
            border-color: #087b80 !important;
            color: #ffffff !important;
            text-decoration: none !important;
            opacity: 1 !important;
        }

        #calendarioReserva .calendario-dia:disabled {
            cursor: not-allowed !important;
            color: #a9b3b3 !important;
        }

        #calendarioReserva .calendario-dia.bloqueado:disabled {
            background: #e8ecec !important;
            text-decoration: line-through;
        }

        #calendarioReserva .calendario-dia.solo-salida {
            background: #ffffff !important;
            border-color: #087b80 !important;
            color: #087b80 !important;
            text-decoration: none !important;
            cursor: pointer !important;
        }

        #calendarioReserva .calendario-dia:not(:disabled):hover {
            background: #dff1ef !important;
            border-color: #087b80 !important;
            color: #103e42 !important;
        }

        #calendarioReserva .calendario-dia:focus-visible {
            outline: 3px solid #c4a15b;
            outline-offset: 2px;
        }

        #calendarioReserva .calendario-leyenda-seleccionado {
            background: #087b80 !important;
        }

        #calendarioReserva .calendario-leyenda-bloqueado {
            background: #e8ecec !important;
        }

        @media (max-width: 700px) {
            #calendarioReserva .calendario-dias-mes > .calendario-dia {
                font-size: 19px !important;
            }
        }
    `;

    document.head.appendChild(estilo);


    // ======================================================
    // PERMITIR SALIDA SIN OCUPAR UNA NOCHE BLOQUEADA
    // ======================================================

    function salidaPermitida(fechaISO) {

        return Boolean(
            disponibilidadVerificada &&
            fechaIngresoSeleccionada &&
            fechaISO > fechaIngresoSeleccionada &&
            !esFechaPasada(fechaISO) &&
            rangoDisponible(
                fechaIngresoSeleccionada,
                fechaISO
            )
        );
    }


    // ======================================================
    // ACTUALIZAR CALENDARIO
    // ======================================================

    renderizarCalendario = function() {

        if (!calendarioReserva) return;

        const nombreMes = document.getElementById(
            "calendarioNombreMes"
        );

        const contenedor = document.getElementById(
            "calendarioDias"
        );

        const mensaje = document.getElementById(
            "calendarioMensaje"
        );

        if (!contenedor) return;

        const meses = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre",
            "Octubre", "Noviembre", "Diciembre"
        ];

        const diasSemana = [
            "L", "M", "M", "J", "V", "S", "D"
        ];

        const hoy = convertirFechaISO(new Date());

        const seleccionandoSalida = Boolean(
            modoCalendario === "salida" &&
            fechaIngresoSeleccionada &&
            !fechaSalidaSeleccionada
        );

        contenedor.innerHTML = "";

        contenedor.classList.add(
            "calendario-dos-meses"
        );

        if (nombreMes) {
            nombreMes.textContent = "Selecciona tus fechas";
        }

        for (let numeroMes = 0; numeroMes < 2; numeroMes++) {

            const fechaMes = new Date(
                mesCalendarioActual.getFullYear(),
                mesCalendarioActual.getMonth() + numeroMes,
                1
            );

            const anio = fechaMes.getFullYear();
            const mes = fechaMes.getMonth();

            const panel = document.createElement("div");
            panel.className = "calendario-panel-mes";

            const titulo = document.createElement("div");
            titulo.className = "calendario-titulo-mes";
            titulo.textContent = meses[mes] + " " + anio;

            panel.appendChild(titulo);

            const semana = document.createElement("div");
            semana.className = "calendario-semana";

            diasSemana.forEach(function(dia) {

                const etiqueta = document.createElement("div");
                etiqueta.className = "calendario-dia-semana";
                etiqueta.textContent = dia;

                semana.appendChild(etiqueta);
            });

            panel.appendChild(semana);

            const cuadricula = document.createElement("div");
            cuadricula.className = "calendario-dias-mes";

            const espacios = (fechaMes.getDay() + 6) % 7;

            for (let i = 0; i < espacios; i++) {

                const vacio = document.createElement("div");
                vacio.className = "calendario-dia vacio";

                cuadricula.appendChild(vacio);
            }

            const cantidadDias = new Date(
                anio,
                mes + 1,
                0
            ).getDate();

            for (let dia = 1; dia <= cantidadDias; dia++) {

                const fechaISO = convertirFechaISO(
                    new Date(anio, mes, dia)
                );

                const pasada = esFechaPasada(fechaISO);
                const bloqueada = fechasBloqueadas.has(fechaISO);

                const permiteSalida =
                    seleccionandoSalida &&
                    salidaPermitida(fechaISO);

                const habilitada =
                    disponibilidadVerificada &&
                    !pasada &&
                    (
                        seleccionandoSalida
                            ? permiteSalida
                            : !bloqueada
                    );

                const boton = document.createElement("button");

                boton.type = "button";
                boton.className = "calendario-dia";
                boton.textContent = dia;
                boton.disabled = !habilitada;

                boton.setAttribute(
                    "aria-label",
                    dia + " de " + meses[mes] + " de " + anio +
                    (
                        bloqueada && permiteSalida
                            ? ". Disponible únicamente para salida"
                            : bloqueada
                                ? ". No disponible para hospedarse"
                                : ""
                    )
                );

                if (fechaISO === hoy) {
                    boton.classList.add("hoy");
                }

                if (pasada) {
                    boton.classList.add("pasado");
                }

                if (bloqueada) {
                    boton.classList.add("bloqueado");
                }

                if (bloqueada && permiteSalida) {

                    boton.classList.add("solo-salida");

                    boton.title =
                        "Puedes salir este día, pero no hospedarte esta noche.";
                }

                if (fechaISO === fechaIngresoSeleccionada) {
                    boton.classList.add("ingreso");
                }

                if (fechaISO === fechaSalidaSeleccionada) {
                    boton.classList.add("salida");
                }

                if (
                    fechaIngresoSeleccionada &&
                    fechaSalidaSeleccionada &&
                    fechaISO > fechaIngresoSeleccionada &&
                    fechaISO < fechaSalidaSeleccionada
                ) {
                    boton.classList.add("en-rango");
                }

                if (habilitada) {

                    boton.addEventListener("click", function() {
                        seleccionarFechaCalendario(fechaISO);
                    });
                }

                cuadricula.appendChild(boton);
            }

            panel.appendChild(cuadricula);
            contenedor.appendChild(panel);
        }

        if (mensaje) {

            if (!disponibilidadVerificada) {

                mensaje.textContent =
                    "Consulta la disponibilidad para seleccionar tus fechas.";

            } else if (
                fechaIngresoSeleccionada &&
                fechaSalidaSeleccionada
            ) {

                mensaje.textContent =
                    "Fechas seleccionadas correctamente.";

            } else if (seleccionandoSalida) {

                mensaje.textContent =
                    "Selecciona tu salida. Un día bloqueado con borde turquesa permite salir ese día.";

            } else {

                mensaje.textContent =
                    "Selecciona tu fecha de ingreso.";
            }
        }
    };


    // ======================================================
    // SELECCIÓN DE ENTRADA Y SALIDA
    // ======================================================

    seleccionarFechaCalendario = function(fechaISO) {

        if (
            !disponibilidadVerificada ||
            esFechaPasada(fechaISO)
        ) {
            return;
        }

        const campoIngreso = document.getElementById(
            "fechaIngreso"
        );

        const campoSalida = document.getElementById(
            "fechaSalida"
        );

        const seleccionandoSalida = Boolean(
            modoCalendario === "salida" &&
            fechaIngresoSeleccionada &&
            !fechaSalidaSeleccionada
        );

        if (seleccionandoSalida) {

            // Revisa las noches desde el ingreso hasta el día
            // anterior a la salida. La salida no ocupa una noche.
            if (!salidaPermitida(fechaISO)) {

                alert(
                    "No puedes atravesar una noche bloqueada. Puedes salir el primer día bloqueado, pero no después."
                );

                return;
            }

            fechaSalidaSeleccionada = fechaISO;

            if (campoSalida) {
                campoSalida.value = fechaISO;
            }

        } else {

            // Un día bloqueado nunca permite un nuevo ingreso.
            if (fechasBloqueadas.has(fechaISO)) return;

            fechaIngresoSeleccionada = fechaISO;
            fechaSalidaSeleccionada = null;

            modoCalendario = "salida";

            if (campoIngreso) {
                campoIngreso.value = fechaISO;
            }

            if (campoSalida) {
                campoSalida.value = "";
            }
        }

        const resultado = document.getElementById(
            "eaResultadoDisponibilidad"
        );

        if (resultado) {
            resultado.hidden = true;
        }

        calcularPrecio();
        actualizarFechasTarjeta();
        renderizarCalendario();
    };

    if (calendarioReserva) {
        renderizarCalendario();
    }

})();

// QUITAR DEFINITIVAMENTE EL NARANJA DEL CALENDARIO
(function corregirColoresCalendario() {

    function aplicarColores() {

        document.querySelectorAll(
            "#calendarioReserva .calendario-dia"
        ).forEach(function(dia) {

            const seleccionado =
                dia.classList.contains("ingreso") ||
                dia.classList.contains("salida");

            const enRango =
                dia.classList.contains("en-rango");

            const bloqueado =
                dia.classList.contains("bloqueado");

            const soloSalida =
                dia.classList.contains("solo-salida");

            let fondo = "transparent";
            let texto = "#103e42";
            let borde = "transparent";

            if (bloqueado) {
                fondo = "#e8ecec";
                texto = "#a9b3b3";
            }

            if (enRango) {
                fondo = "#dff1ef";
            }

            if (soloSalida) {
                fondo = "#ffffff";
                texto = "#087b80";
                borde = "#087b80";
            }

            if (dia.classList.contains("hoy")) {
                borde = "#087b80";
            }

            if (seleccionado) {
                fondo = "#087b80";
                texto = "#ffffff";
                borde = "#087b80";
            }

            dia.style.setProperty(
                "background", fondo, "important"
            );

            dia.style.setProperty(
                "color", texto, "important"
            );

            dia.style.setProperty(
                "border-color", borde, "important"
            );

            dia.style.setProperty(
                "box-shadow", "none", "important"
            );

            dia.style.setProperty(
                "background-image", "none", "important"
            );
        });
    }

    const renderizarAnterior = renderizarCalendario;

    renderizarCalendario = function() {
        const resultado = renderizarAnterior.apply(this, arguments);
        aplicarColores();
        return resultado;
    };

    aplicarColores();

})();

// ==========================================================
// ORDENAR AUTOMÁTICAMENTE LAS DOS FECHAS SELECCIONADAS
// ==========================================================

(function permitirSeleccionInvertida() {

    function puedeSerEntradaAnterior(fechaISO) {

        return Boolean(
            disponibilidadVerificada &&
            modoCalendario === "salida" &&
            fechaIngresoSeleccionada &&
            !fechaSalidaSeleccionada &&
            fechaISO < fechaIngresoSeleccionada &&
            !esFechaPasada(fechaISO) &&
            !fechasBloqueadas.has(fechaISO) &&
            rangoDisponible(
                fechaISO,
                fechaIngresoSeleccionada
            )
        );
    }


    const seleccionarAnterior =
        seleccionarFechaCalendario;

    seleccionarFechaCalendario = function(fechaISO) {

        if (puedeSerEntradaAnterior(fechaISO)) {

            // La primera fecha pasa a ser la salida.
            const salida = fechaIngresoSeleccionada;

            fechaIngresoSeleccionada = fechaISO;
            fechaSalidaSeleccionada = salida;

            const campoIngreso =
                document.getElementById("fechaIngreso");

            const campoSalida =
                document.getElementById("fechaSalida");

            if (campoIngreso) {
                campoIngreso.value = fechaISO;
            }

            if (campoSalida) {
                campoSalida.value = salida;
            }

            const resultado =
                document.getElementById(
                    "eaResultadoDisponibilidad"
                );

            if (resultado) {
                resultado.hidden = true;
            }

            calcularPrecio();
            actualizarFechasTarjeta();
            renderizarCalendario();

            return;
        }

        return seleccionarAnterior.apply(this, arguments);
    };


    const renderizarAnterior =
        renderizarCalendario;

    renderizarCalendario = function() {

        const resultado =
            renderizarAnterior.apply(this, arguments);

        // Habilitar las fechas anteriores válidas mientras
        // se está seleccionando la segunda fecha.
        document.querySelectorAll(
            "#calendarioDias .calendario-panel-mes"
        ).forEach(function(panel, indiceMes) {

            const mes = new Date(
                mesCalendarioActual.getFullYear(),
                mesCalendarioActual.getMonth() + indiceMes,
                1
            );

            panel.querySelectorAll(
                "button.calendario-dia"
            ).forEach(function(boton) {

                const dia = Number(boton.textContent.trim());

                if (!Number.isInteger(dia) || dia < 1) return;

                const fechaISO = convertirFechaISO(
                    new Date(
                        mes.getFullYear(),
                        mes.getMonth(),
                        dia
                    )
                );

                if (
                    !boton.disabled ||
                    !puedeSerEntradaAnterior(fechaISO)
                ) {
                    return;
                }

                boton.disabled = false;

                boton.classList.remove(
                    "no-seleccionable"
                );

                boton.title =
                    "Seleccionar como entrada y usar la primera fecha como salida";

                boton.addEventListener("click", function() {
                    seleccionarFechaCalendario(fechaISO);
                });
            });
        });

        return resultado;
    };

    if (calendarioReserva) {
        renderizarCalendario();
    }

})();

// ==========================================================
// SELECTOR DE HUÉSPEDES Y ACEPTACIÓN DE CAPACIDAD
// ==========================================================

(function mejorarSelectorHuespedes() {

    const estilo = document.createElement("style");

    estilo.textContent = `
        #modalAlojamiento #reservaHuespedesMenu {
            margin-top: 10px;
            padding: 16px !important;
            background: #ffffff;
            border: 1px solid #dce7e5;
            border-radius: 14px;
            box-shadow: 0 6px 18px rgba(16, 62, 66, 0.07);
        }

        #modalAlojamiento #reservaHuespedesMenu[hidden],
        #modalAlojamiento #eaAceptacionFicha[hidden] {
            display: none !important;
        }

        #modalAlojamiento .ea-huespedes-fila {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        #modalAlojamiento .ea-huespedes-titulo {
            display: block;
            color: #103e42;
            font-size: 15px;
            font-weight: 700;
        }

        #modalAlojamiento .ea-huespedes-capacidad {
            display: block;
            margin-top: 4px;
            color: #718282;
            font-size: 12px;
        }

        #modalAlojamiento .ea-huespedes-controles {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }

        #modalAlojamiento #reservaHuespedesMenu .ea-huespedes-control {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            padding: 0 !important;
            border: 1.5px solid #087b80;
            border-radius: 50%;
            background: #ffffff;
            color: #087b80;
            cursor: pointer;
            transition: background 0.15s ease;
        }

        #modalAlojamiento .ea-huespedes-control svg {
            width: 16px;
            height: 16px;
            pointer-events: none;
        }

        #modalAlojamiento #reservaHuespedesMenu .ea-huespedes-control:hover {
            background: #e7f4f2;
        }

        #modalAlojamiento #reservaHuespedesMenu .ea-huespedes-control:disabled {
            opacity: 0.35;
            cursor: default;
        }

        #modalAlojamiento .ea-huespedes-control:focus-visible {
            outline: 3px solid #c4a15b;
            outline-offset: 3px;
        }

        #modalAlojamiento #cantidadFicha {
            min-width: 24px;
            text-align: center;
            color: #103e42;
            font-size: 19px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
        }

        #modalAlojamiento #eaAceptacionFicha {
            margin-top: 12px;
            padding: 14px;
            background: #f4f8f7;
            border: 1px solid #cddfdc;
            border-left: 3px solid #c4a15b;
            border-radius: 12px;
            color: #284e50;
        }

        #modalAlojamiento #eaAceptacionFicha strong {
            display: block;
            margin-bottom: 7px;
            color: #103e42;
            font-size: 13px;
        }

        #modalAlojamiento .ea-aceptacion-etiqueta {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin: 0;
            font-size: 13px;
            line-height: 1.55;
            cursor: pointer;
        }

        #modalAlojamiento #eaAceptaCapacidad {
            appearance: auto;
            -webkit-appearance: auto;
            width: 18px;
            height: 18px;
            min-width: 18px;
            margin: 2px 0 0;
            padding: 0;
            accent-color: #087b80;
            cursor: pointer;
        }

        #modalAlojamiento .ea-aceptacion-nota {
            margin: 9px 0 0;
            font-size: 12px;
            line-height: 1.5;
            color: #718282;
        }

        @media (max-width: 360px) {
            #modalAlojamiento .ea-huespedes-fila {
                flex-wrap: wrap;
            }
        }
    `;

    document.head.appendChild(estilo);


    function datosActuales() {

        return {
            cantidad: Number(
                document.getElementById("personas")?.value
            ) || 1,

            capacidad: Number(
                alojamientoActual?.maxHuespedes ??
                alojamientoActual?.max_huespedes
            ) || 1
        };
    }


    function actualizarSelector() {

        const menu = document.getElementById(
            "reservaHuespedesMenu"
        );

        const boton = document.getElementById(
            "reservaHuespedesTarjeta"
        );

        if (!menu || !boton || !alojamientoActual) return;

        if (!menu.querySelector(".ea-huespedes-fila")) {

            menu.innerHTML = `
                <div class="ea-huespedes-fila">

                    <div>
                        <span class="ea-huespedes-titulo">
                            Huéspedes
                        </span>

                        <span
                            class="ea-huespedes-capacidad"
                            id="eaCapacidadFicha"
                        ></span>
                    </div>

                    <div class="ea-huespedes-controles">

                        <button
                            type="button"
                            class="ea-huespedes-control"
                            id="fichaMenos"
                            aria-label="Disminuir huéspedes"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14"></path>
                            </svg>
                        </button>

                        <span
                            id="cantidadFicha"
                            aria-live="polite"
                        ></span>

                        <button
                            type="button"
                            class="ea-huespedes-control"
                            id="fichaMas"
                            aria-label="Aumentar huéspedes"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14M12 5v14"></path>
                            </svg>
                        </button>

                    </div>
                </div>
            `;

            document.getElementById(
                "fichaMenos"
            ).onclick = function() {

                cambiarCantidadPersonas(-1);
                actualizarSelector();
            };

            document.getElementById(
                "fichaMas"
            ).onclick = function() {

                cambiarCantidadPersonas(1);
                actualizarSelector();
            };
        }

        let aceptacion = document.getElementById(
            "eaAceptacionFicha"
        );

        if (!aceptacion) {

            aceptacion = document.createElement("div");
            aceptacion.id = "eaAceptacionFicha";
            aceptacion.hidden = true;

            aceptacion.innerHTML = `
                <strong>Solicitud sobre la capacidad indicada</strong>

                <label class="ea-aceptacion-etiqueta">
                    <input
                        type="checkbox"
                        id="eaAceptaCapacidad"
                    >

                    <span id="eaTextoAceptacion"></span>
                </label>

                <p class="ea-aceptacion-nota">
                    Esta solicitud queda sujeta a aceptación
                    del alojamiento.
                </p>
            `;

            // Queda debajo del selector, incluso al cerrarlo.
            menu.after(aceptacion);
        }

        const datos = datosActuales();

        const clave =
            alojamientoActual.id + ":" + datos.cantidad;

        const casilla = document.getElementById(
            "eaAceptaCapacidad"
        );

        // Una nueva cantidad requiere una nueva aceptación.
        if (aceptacion.dataset.seleccion !== clave) {

            casilla.checked = false;
            aceptacion.dataset.seleccion = clave;
        }

        aceptacion.hidden =
            datos.cantidad <= datos.capacidad;

        document.getElementById(
            "eaCapacidadFicha"
        ).textContent =
            "Capacidad indicada: " +
            datos.capacidad +
            (datos.capacidad === 1 ? " persona" : " personas");

        document.getElementById(
            "eaTextoAceptacion"
        ).textContent =
            "Comprendo que este alojamiento tiene una capacidad indicada de " +
            datos.capacidad +
            " personas y estoy solicitando hospedaje para " +
            datos.cantidad +
            ". He revisado la distribución de camas y espacios y acepto acomodarme en esas condiciones.";

        document.getElementById(
            "cantidadFicha"
        ).textContent = datos.cantidad;

        document.getElementById(
            "fichaMenos"
        ).disabled = datos.cantidad <= 1;

        document.getElementById(
            "fichaMas"
        ).disabled = datos.cantidad >= 50;
    }


    // Actualizar al abrir un anuncio.
    const prepararAnterior = prepararFechasFicha;

    prepararFechasFicha = function() {

        const resultado =
            prepararAnterior.apply(this, arguments);

        actualizarSelector();

        // Reiniciar siempre la aceptación al abrir una ficha.
        const casilla = document.getElementById(
            "eaAceptaCapacidad"
        );

        if (casilla) casilla.checked = false;

        return resultado;
    };


    // Mantener sincronizado el contador.
    const actualizarAnterior = actualizarFechasTarjeta;

    actualizarFechasTarjeta = function() {

        const resultado =
            actualizarAnterior.apply(this, arguments);

        actualizarSelector();

        return resultado;
    };


    // Exigir aceptación antes de consultar cuando se excede.
    // Se usa window para comprobarlo antes de los eventos
    // de disponibilidad registrados en document.
    window.addEventListener("click", function(evento) {

        if (
            !evento.target.closest(
                "#modalAlojamientoReservar"
            )
        ) {
            return;
        }

        if (!alojamientoActual) return;

        actualizarSelector();

        const datos = datosActuales();

        if (datos.cantidad <= datos.capacidad) return;

        const casilla = document.getElementById(
            "eaAceptaCapacidad"
        );

        if (casilla?.checked) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();

        const aviso = document.getElementById(
            "eaAceptacionFicha"
        );

        if (aviso) {

            aviso.hidden = false;

            aviso.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        casilla?.focus({ preventScroll: true });

        alert(
            "Para continuar, marca la casilla que indica que conoces la capacidad del alojamiento y aceptas acomodarte en esas condiciones."
        );

    }, true);


    actualizarSelector();

})();

// ==========================================================
// DESGLOSE EN LA FICHA Y SOLICITUD POR WHATSAPP
// ==========================================================

(function agregarCotizacionYWhatsApp() {

    let consultaActual = 0;

    function reiniciarCotizacionFicha() {
    consultaActual++;

    document.getElementById("eaResultadoDisponibilidad")?.remove();

    const boton = document.getElementById("modalAlojamientoReservar");

    if (boton) {
        boton.disabled = false;
        boton.textContent = "Ver disponibilidad";
    }
}

const prepararFichaAnterior = prepararFechasFicha;

prepararFechasFicha = function() {
    reiniciarCotizacionFicha();
    return prepararFichaAnterior.apply(this, arguments);
};

const cerrarFichaAnterior = cerrarModalAlojamiento;

cerrarModalAlojamiento = function() {
    reiniciarCotizacionFicha();
    return cerrarFichaAnterior.apply(this, arguments);
};

    const estilo = document.createElement("style");

    estilo.textContent = `
        #modalAlojamiento #eaResultadoDisponibilidad {
            background: #f7faf9;
            border: 1px solid #dce7e5;
            border-radius: 14px;
            padding: 18px;
        }

        #modalAlojamiento .ea-cotizacion-titulo {
            display: block;
            margin-bottom: 14px;
            color: #087b80;
            font-size: 15px;
        }

        #modalAlojamiento .ea-cotizacion-fila {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 16px;
            margin: 11px 0;
            font-size: 13px;
            line-height: 1.5;
            color: #617574;
        }

        #modalAlojamiento .ea-cotizacion-fila strong {
            color: #103e42;
            text-align: right;
            flex-shrink: 0;
            font-variant-numeric: tabular-nums;
        }

        #modalAlojamiento .ea-cotizacion-separador {
            border: 0;
            border-top: 1px solid #dce7e5;
            margin: 16px 0;
        }

        #modalAlojamiento .ea-cotizacion-total {
            font-size: 16px;
            font-weight: 700;
            color: #103e42;
        }

        #modalAlojamiento .ea-cotizacion-total strong {
            font-size: 23px;
        }

        #modalAlojamiento #eaEnviarSolicitudWhatsApp {
            display: block;
            width: 100%;
            margin-top: 18px;
            padding: 14px 12px;
            border: 0;
            border-radius: 12px;
            background: #087b80;
            color: #ffffff;
            font: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
        }

        #modalAlojamiento #eaEnviarSolicitudWhatsApp:hover {
            background: #075e63;
        }

        #modalAlojamiento #eaEnviarSolicitudWhatsApp:disabled {
            opacity: 0.65;
            cursor: wait;
        }

        #modalAlojamiento .ea-cotizacion-nota {
            margin: 12px 0 0;
            color: #718282;
            font-size: 12px;
            line-height: 1.6;
        }
    `;

    document.head.appendChild(estilo);


    function moneda(valor) {

        return "Q" + valor.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    function obtenerCotizacion() {

        if (!alojamientoActual) {
            throw new Error("Selecciona un alojamiento.");
        }

        const datos = normalizarAlojamiento(
            alojamientoActual
        );

        const ingreso = fechaIngresoSeleccionada;
        const salida = fechaSalidaSeleccionada;

        const personas = Number(
            document.getElementById("personas")?.value
        );

        const noches = diferenciaDias(
            ingreso,
            salida
        );

        if (
            !ingreso ||
            !salida ||
            esFechaPasada(ingreso) ||
            !Number.isFinite(noches) ||
            noches <= 0
        ) {
            throw new Error(
                "Selecciona fechas válidas de entrada y salida."
            );
        }

        if (
            !Number.isInteger(personas) ||
            personas < 1 ||
            personas > 50
        ) {
            throw new Error(
                "Selecciona una cantidad válida de huéspedes."
            );
        }

        if (
            !Number.isFinite(datos.precioBase) ||
            !Number.isFinite(datos.precioPersona) ||
            !Number.isFinite(datos.personasIncluidas) ||
            !Number.isFinite(datos.maxHuespedes) ||
            datos.precioBase < 0 ||
            datos.precioPersona < 0
        ) {
            throw new Error(
                "No se pudo obtener la tarifa del alojamiento."
            );
        }

        const adicionales = Math.max(
            personas - datos.personasIncluidas,
            0
        );

        const costoAdicional =
            adicionales * datos.precioPersona;

        const precioNoche =
            datos.precioBase + costoAdicional;

        return {
            id: datos.id,
            nombre: datos.nombre,
            ingreso,
            salida,
            personas,
            noches,
            incluidas: datos.personasIncluidas,
            capacidad: datos.maxHuespedes,
            precioBase: datos.precioBase,
            precioPersona: datos.precioPersona,
            adicionales,
            costoAdicional,
            precioNoche,
            total: precioNoche * noches
        };
    }


    function mismaCotizacion(cotizacion) {

        try {

            return JSON.stringify(obtenerCotizacion()) ===
                JSON.stringify(cotizacion);

        } catch (error) {

            return false;
        }
    }


    function comprobarAceptacion(cotizacion) {

        if (
            cotizacion.personas <= cotizacion.capacidad
        ) {
            return;
        }

        const casilla = document.getElementById(
            "eaAceptaCapacidad"
        );

        if (!casilla?.checked) {

            casilla?.focus();

            throw new Error(
                "Marca la casilla de aceptación de la capacidad del alojamiento para continuar."
            );
        }
    }


    async function comprobarFechas(cotizacion) {

        const respuesta =
            await clienteSupabase.functions.invoke(
                "obtener-disponibilidad",
                {
                    body: {
                        alojamiento_id: cotizacion.id
                    }
                }
            );

        if (
            respuesta.error ||
            !Array.isArray(respuesta.data?.blocked)
        ) {
            throw new Error(
                "No pudimos verificar la disponibilidad. Intenta nuevamente."
            );
        }

        const bloqueadas = new Set(
            respuesta.data.blocked
        );

        // Solo se revisan las noches ocupadas.
        // La fecha de salida puede estar bloqueada.
        for (
            let i = 0;
            i < cotizacion.noches;
            i++
        ) {

            const fecha = convertirFechaISO(
                sumarDias(
                    fechaDesdeISO(cotizacion.ingreso),
                    i
                )
            );

            if (bloqueadas.has(fecha)) {

                throw new Error(
                    "Las fechas seleccionadas ya no están disponibles. Selecciona otro período."
                );
            }
        }
    }


    function obtenerResultado() {

        let resultado = document.getElementById(
            "eaResultadoDisponibilidad"
        );

        if (!resultado) {

            resultado = document.createElement("div");
            resultado.id = "eaResultadoDisponibilidad";
            resultado.setAttribute("aria-live", "polite");

            document.getElementById(
                "modalAlojamientoReservar"
            )?.after(resultado);
        }

        resultado.hidden = false;
        resultado.classList.remove("ea-resultado-error");
        resultado.replaceChildren();

        return resultado;
    }


    function mostrarDesglose(cotizacion) {

        const resultado = obtenerResultado();

        const titulo = document.createElement("strong");
        titulo.className = "ea-cotizacion-titulo";
        titulo.textContent = "✓ Fechas disponibles";

        resultado.appendChild(titulo);

        function fila(etiqueta, valor, esTotal) {

            const elemento = document.createElement("div");

            elemento.className =
                "ea-cotizacion-fila" +
                (esTotal ? " ea-cotizacion-total" : "");

            const texto = document.createElement("span");
            texto.textContent = etiqueta;

            const importe = document.createElement("strong");
            importe.textContent = valor;

            elemento.append(texto, importe);
            resultado.appendChild(elemento);
        }

        function separador() {
            const linea = document.createElement("hr");
            linea.className = "ea-cotizacion-separador";
            resultado.appendChild(linea);
        }

        fila("Entrada", cotizacion.ingreso);
        fila("Salida", cotizacion.salida);
        fila("Huéspedes", String(cotizacion.personas));

        separador();

        fila(
            "Tarifa base (incluye " +
            cotizacion.incluidas +
            " personas)",
            moneda(cotizacion.precioBase)
        );

        fila(
            "Adicionales (" +
            cotizacion.adicionales +
            " × " +
            moneda(cotizacion.precioPersona) +
            ") por noche",
            moneda(cotizacion.costoAdicional)
        );

        fila(
            "Precio por noche",
            moneda(cotizacion.precioNoche)
        );

        fila(
            "Noches seleccionadas",
            String(cotizacion.noches)
        );

        separador();

        fila(
            "Total estimado",
            moneda(cotizacion.total),
            true
        );

        if (
            cotizacion.personas > cotizacion.capacidad
        ) {

            const aviso = document.createElement("p");
            aviso.className = "ea-cotizacion-nota";

            aviso.textContent =
                "La solicitud supera la capacidad indicada de " +
                cotizacion.capacidad +
                " personas y requiere aceptación del alojamiento.";

            resultado.appendChild(aviso);
        }

        const enviar = document.createElement("button");

        enviar.type = "button";
        enviar.id = "eaEnviarSolicitudWhatsApp";
        enviar.textContent = "Enviar solicitud por WhatsApp";

        enviar.addEventListener("click", async function() {

            if (enviar.disabled) return;

            if (!mismaCotizacion(cotizacion)) {

                resultado.hidden = true;

                alert(
                    "Cambiaste los datos. Presiona Ver disponibilidad para actualizar el desglose."
                );

                return;
            }

            try {

                comprobarAceptacion(cotizacion);

                enviar.disabled = true;
                enviar.textContent = "Verificando fechas...";

                await comprobarFechas(cotizacion);

                // No enviar datos anteriores si se modificaron
                // durante la comprobación.
                if (
                    !mismaCotizacion(cotizacion) ||
                    !resultado.isConnected ||
                    resultado.hidden ||
                    !document.getElementById(
                        "modalAlojamiento"
                    )?.classList.contains(
                        "modal-alojamiento-visible"
                    )
                ) {

                    throw new Error(
                        "La selección cambió. Consulta nuevamente la disponibilidad."
                    );
                }

                comprobarAceptacion(cotizacion);

                                const nombreSolicitante =
                    document.getElementById(
                        "eaNombreSolicitante"
                    )?.value.trim();

                if (!nombreSolicitante) {

                    throw new Error(
                        "Escribe el nombre de quien realiza la reservación."
                    );
                }

                const lineas = [
                    "SOLICITUD DE RESERVA",
                    "Estancias Agradables",
                    "",
                    "Alojamiento: " + cotizacion.nombre,
                    "Reservación a nombre de: " +
                        nombreSolicitante,
                    "",
                    "Entrada: " + cotizacion.ingreso,
                    "Salida: " + cotizacion.salida,
                    "Huéspedes: " + cotizacion.personas,
                    "Noches: " + cotizacion.noches,
                    "",
                    "Precio por noche: " +
                        moneda(cotizacion.precioNoche),
                    "Total estimado: " +
                        moneda(cotizacion.total)
                ];

                if (
                    cotizacion.personas >
                    cotizacion.capacidad
                ) {

                    lineas.push(
                        "",
                        "SOLICITUD ESPECIAL POR CAPACIDAD",
                        "",
                        "Personas que desean ingresar: " +
                            cotizacion.personas,
                        "",
                        "Acepto hospedarme con las " +
                            cotizacion.personas +
                            " personas solicitadas, siendo consciente de que la capacidad indicada del alojamiento es de " +
                            cotizacion.capacidad +
                            " personas. He revisado las condiciones descritas y la distribución de camas y espacios, y acepto acomodarme en esas condiciones.",
                        "",
                        "Esta solicitud especial queda sujeta a aceptación del alojamiento."
                    );
                }

                lineas.push(
                    "",
                    "La reservación se confirma con el 50% del total."
                );

                const url =
                    "https://wa.me/50254134493?text=" +
                    encodeURIComponent(
                        lineas.join("\n")
                    );

                // Abrir WhatsApp con el mensaje preparado.
                window.location.assign(url);

            } catch (error) {

                alert(error.message);

            } finally {

                enviar.disabled = false;
                enviar.textContent =
                    "Enviar solicitud por WhatsApp";
            }
        });

        resultado.appendChild(enviar);

        const nota = document.createElement("p");
        nota.className = "ea-cotizacion-nota";

        nota.textContent =
            "La consulta no bloquea las fechas. La reservación se confirma con el 50% del total.";

        resultado.appendChild(nota);
    }

    // ======================================================
    // REEMPLAZAR LA ACCIÓN ANTERIOR DE DISPONIBILIDAD
    // ======================================================

    window.addEventListener("click", async function(evento) {

        const boton = evento.target.closest(
            "#modalAlojamientoReservar"
        );

        if (!boton) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();

        if (boton.disabled) return;

        const numeroConsulta = ++consultaActual;
        const textoOriginal = boton.textContent;

        let cotizacion = null;

        try {

            cotizacion = obtenerCotizacion();
            comprobarAceptacion(cotizacion);

            boton.disabled = true;
            boton.textContent = "Consultando disponibilidad...";

            const resultado = obtenerResultado();
            resultado.textContent = "Comprobando tus fechas...";

            await comprobarFechas(cotizacion);

            if (numeroConsulta !== consultaActual) return;

            if (!mismaCotizacion(cotizacion)) {

                throw new Error(
                    "Cambiaste los datos. Presiona Ver disponibilidad nuevamente."
                );
            }

            comprobarAceptacion(cotizacion);

            const panel = document.getElementById(
                "calendarioFlotanteTarjeta"
            );

            if (panel) panel.hidden = true;

            mostrarDesglose(cotizacion);

        } catch (error) {

            if (numeroConsulta !== consultaActual) return;

            // No mostrar una respuesta de otro alojamiento.
            if (
                cotizacion &&
                alojamientoActual?.id !== cotizacion.id
            ) {
                return;
            }

            const resultado = obtenerResultado();

            resultado.classList.add(
                "ea-resultado-error"
            );

            resultado.textContent = error.message;

        } finally {

            boton.disabled = false;
            boton.textContent = textoOriginal;
        }

    }, true);

})();

// ==========================================================
// NOMBRE DE QUIEN REALIZA LA RESERVACIÓN
// ==========================================================

(function agregarNombreReservacion() {

    const estilo = document.createElement("style");

    estilo.textContent = `
        #eaNombreReservacionContenedor {
            margin: 14px 0 18px;
            max-width: 440px;
        }

        #eaNombreReservacionContenedor label {
            display: block;
            margin-bottom: 7px;
            color: #103e42;
            font-size: 14px;
            font-weight: 600;
        }

        #eaNombreSolicitante {
            width: 100%;
            box-sizing: border-box;
            padding: 12px 14px;
            border: 1px solid #dce7e5;
            border-radius: 10px;
            background: #ffffff;
            color: #103e42;
            font: inherit;
            font-size: 16px;
        }

        #eaNombreSolicitante:focus {
            outline: 2px solid #087b80;
            outline-offset: 2px;
        }
    `;

    document.head.appendChild(estilo);

    function prepararNombre(reiniciar) {

        const titulo = document.getElementById(
            "modalAlojamientoNombre"
        );

        if (!titulo) return;

        let contenedor = document.getElementById(
            "eaNombreReservacionContenedor"
        );

        if (!contenedor) {

            contenedor = document.createElement("div");
            contenedor.id = "eaNombreReservacionContenedor";

            const etiqueta = document.createElement("label");

            etiqueta.htmlFor = "eaNombreSolicitante";
            etiqueta.textContent = "Reservación a nombre de:";

            const campo = document.createElement("input");

            campo.type = "text";
            campo.id = "eaNombreSolicitante";
            campo.name = "nombreSolicitante";
            campo.autocomplete = "name";
            campo.placeholder = "Escribe tu nombre completo";
            campo.maxLength = 120;
            campo.required = true;

            campo.addEventListener("input", function() {
                campo.setCustomValidity("");
            });

            contenedor.append(etiqueta, campo);
            const fechas = document
    .getElementById("reservaEntradaTarjeta")
    ?.closest(".reserva-fechas");

if (fechas) {
    fechas.before(contenedor);
} else {
    titulo.after(contenedor);
}
        }

        if (reiniciar) {

            const campo = document.getElementById(
                "eaNombreSolicitante"
            );

            campo.value = "";
            campo.setCustomValidity("");
        }
    }

    const prepararAnterior = prepararFechasFicha;

    prepararFechasFicha = function() {

        const resultado =
            prepararAnterior.apply(this, arguments);

        prepararNombre(true);

        return resultado;
    };

    // Validar el nombre antes de preparar WhatsApp.
    window.addEventListener("click", function(evento) {

        if (
            !evento.target.closest(
                "#eaEnviarSolicitudWhatsApp"
            )
        ) {
            return;
        }

        prepararNombre(false);

        const campo = document.getElementById(
            "eaNombreSolicitante"
        );

        if (campo && campo.value.trim()) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();

        if (campo) {

            campo.setCustomValidity(
                "Escribe el nombre de quien realiza la reservación."
            );

            campo.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            campo.focus({ preventScroll: true });
            campo.reportValidity();
        }

    }, true);

    prepararNombre(false);

})();

function obtenerDireccionEscritaEA(alojamiento) {
    const texto = typeof alojamiento.ubicacion === "string"
        ? alojamiento.ubicacion.trim()
        : "";

    return /^(https?:\/\/|www\.|maps\.app\.goo\.gl\/)/i.test(texto)
        ? ""
        : texto;
}

function mostrarMapaUbicacionEA(alojamiento) {
    document.getElementById("eaMapaAlojamiento")?.remove();

    const reserva = document.querySelector(
        "#modalAlojamiento .modal-ficha-reserva"
    );

    if (!reserva) return;

    const texto = String(alojamiento.ubicacion ?? "").trim();
    const direccion = /^(https?:\/\/|www\.)/i.test(texto) ? "" : texto;

    let enlaceGuardado = null;

    try {
        const url = new URL(alojamiento.google_maps_url || "");

        const esGoogleMaps =
            url.hostname === "maps.app.goo.gl" ||
            (
                ["www.google.com", "google.com", "maps.google.com"]
                    .includes(url.hostname) &&
                /^\/maps(?:\/|$)/.test(url.pathname)
            );

        if (url.protocol === "https:" && esGoogleMaps) {
            enlaceGuardado = url;
        }
    } catch {
        // Si no hay enlace válido, se usa la dirección escrita.
    }

    if (!direccion && !enlaceGuardado) return;

    const consulta = encodeURIComponent(direccion);
    const esMapaInsertado =
        enlaceGuardado?.pathname === "/maps/embed" &&
        enlaceGuardado.searchParams.has("pb");

    const vistaPrevia = esMapaInsertado
        ? enlaceGuardado.href
        : direccion
            ? "https://maps.google.com/maps?q=" + consulta + "&output=embed"
            : "";

    let columna = reserva.closest(".ea-columna-reserva");

    if (!columna) {
        columna = document.createElement("div");
        columna.className = "ea-columna-reserva";
        columna.style.cssText = "min-width:0;align-self:start";
        reserva.before(columna);
        columna.appendChild(reserva);
    }

    const tarjeta = document.createElement("section");
    tarjeta.id = "eaMapaAlojamiento";
    tarjeta.style.cssText =
        "margin-top:14px;padding:15px;background:#fff;" +
        "border:1px solid #e3eceb;border-radius:14px";

    const titulo = document.createElement("h3");
    titulo.textContent = "Ubicación";
    titulo.style.cssText = "margin:0 0 8px;color:#103e42;font-size:16px";
    tarjeta.appendChild(titulo);

    if (direccion) {
        const parrafo = document.createElement("p");
        parrafo.textContent = direccion;
        parrafo.style.cssText = "margin:0 0 10px;color:#566c70;font-size:13px";
        tarjeta.appendChild(parrafo);
    }

    if (vistaPrevia) {
        const mapa = document.createElement("iframe");
        mapa.title = "Ubicación de " + alojamiento.nombre;
        mapa.src = vistaPrevia;
        mapa.loading = "lazy";
        mapa.style.cssText =
            "display:block;width:100%;height:200px;border:0;border-radius:10px";
        tarjeta.appendChild(mapa);
    }

    const enlace = document.createElement("a");
    enlace.href = enlaceGuardado?.href ||
        "https://www.google.com/maps/search/?api=1&query=" + consulta;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Abrir en Google Maps";
    enlace.style.cssText =
        "display:inline-block;margin-top:10px;color:#087b80;font-size:13px;font-weight:600";

    tarjeta.appendChild(enlace);
    columna.appendChild(tarjeta);
}

function mostrarDistribucionHabitacionesEA(alojamiento) {
    const descripcion = document.getElementById("modalAlojamientoDescripcion");
    if (!descripcion) return;

    descripcion.querySelector(".ea-distribucion-habitaciones")?.remove();

    const habitaciones = alojamiento.ficha_habitaciones;
    if (!Array.isArray(habitaciones) || !habitaciones.length) return;

    if (!document.getElementById("eaEstilosHabitaciones")) {
        const estilos = document.createElement("style");
        estilos.id = "eaEstilosHabitaciones";
        estilos.textContent = `
            .ea-distribucion-habitaciones { margin-top: 26px; }
            .ea-distribucion-habitaciones h3 { color: #103e42; margin: 0 0 12px; }
            .ea-habitaciones-cuadricula {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
                gap: 12px;
            }
            .ea-habitacion-tarjeta {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 10px;
                border: 1px solid #e3eceb;
                border-radius: 12px;
                background: #fff;
                box-shadow: 0 2px 6px rgba(16, 62, 66, .06);
                color: #103e42;
            }
            .ea-habitaciones-cuadricula > .ea-habitacion-tarjeta:only-child {
            box-sizing: border-box;
            width: 100%;
            max-width: 360px;
            justify-self: start;
            }    
            .ea-habitacion-tarjeta img {
                width: 42%;
                height: 105px;
                flex-shrink: 0;
                object-fit: cover;
                border-radius: 8px;
            }
            .ea-habitacion-tarjeta div { min-width: 0; overflow-wrap: anywhere; }
            .ea-habitacion-tarjeta ul { margin: 6px 0 0; padding-left: 16px; }
            @media (max-width: 600px) {
                .ea-habitaciones-cuadricula { grid-template-columns: 1fr; }
            }
        `;
        document.head.appendChild(estilos);
    }

    const seccion = document.createElement("section");
    seccion.className = "ea-distribucion-habitaciones";

    const titulo = document.createElement("h3");
    titulo.textContent = "Distribución de habitaciones";

    const cuadricula = document.createElement("div");
    cuadricula.className = "ea-habitaciones-cuadricula";

    for (const habitacion of habitaciones) {
        if (!habitacion?.nombre) continue;

        const tarjeta = document.createElement("article");
        tarjeta.className = "ea-habitacion-tarjeta";

        if (habitacion.fotoRuta) {
            const { data } = clienteSupabase.storage
                .from("fotos-alojamientos")
                .getPublicUrl(habitacion.fotoRuta);

            const foto = document.createElement("img");
            foto.src = data.publicUrl;
            foto.alt = habitacion.nombre;
            foto.loading = "lazy";
            foto.addEventListener("error", () => foto.remove());
            tarjeta.appendChild(foto);
        }

        const contenido = document.createElement("div");
        const nombre = document.createElement("strong");
        nombre.textContent = habitacion.nombre;
        contenido.appendChild(nombre);

        if (Array.isArray(habitacion.detalles) && habitacion.detalles.length) {
            const lista = document.createElement("ul");

            for (const detalle of habitacion.detalles) {
                const linea = document.createElement("li");
                linea.textContent = detalle;
                lista.appendChild(linea);
            }

            contenido.appendChild(lista);
        }

        tarjeta.appendChild(contenido);
        cuadricula.appendChild(tarjeta);
    }

    if (cuadricula.childElementCount) {
        seccion.append(titulo, cuadricula);
        descripcion.appendChild(seccion);
    }
}