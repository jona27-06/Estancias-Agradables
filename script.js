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
// ESTILOS ADICIONALES DEL VISOR
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
            background: rgba(0,0,0,0.94);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease,
                        visibility 0.25s ease;
            touch-action: pan-y;
        }

        #visorFotos.visor-visible {
            opacity: 1;
            visibility: visible;
        }

        .visor-contenido {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px;
        }

        .visor-imagen {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            user-select: none;
            -webkit-user-select: none;
            -webkit-user-drag: none;
        }

        .visor-cerrar {
            position: absolute;
            top: 18px;
            right: 20px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            color: white;
            font-size: 30px;
            cursor: pointer;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .visor-cerrar:hover {
            background: rgba(255,255,255,0.25);
        }

        .visor-flecha {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            color: white;
            font-size: 28px;
            cursor: pointer;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .visor-flecha:hover {
            background: rgba(255,255,255,0.25);
        }

        .visor-anterior {
            left: 20px;
        }

        .visor-siguiente {
            right: 20px;
        }

        .visor-contador {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 7px 13px;
            border-radius: 20px;
            background: rgba(0,0,0,0.55);
            color: white;
            font-size: 14px;
            z-index: 20;
        }

        .indicadores-fotos {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 5;
        }

        .punto-foto {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: white;
            opacity: 0.45;
            transition: opacity 0.2s ease,
                        transform 0.2s ease;
        }

        .punto-foto.activo {
            opacity: 1;
            transform: scale(1.25);
        }

        .flecha-foto {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,0.50);
            color: white;
            font-size: 23px;
            cursor: pointer;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .flecha-foto:hover {
            background: rgba(0,0,0,0.70);
        }

        .flecha-anterior {
            left: 12px;
        }

        .flecha-siguiente {
            right: 12px;
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

    document.body.classList.remove(
        "sin-scroll"
    );
}


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

        nuevoIndice =
            0;
    }

    indiceVisor =
        nuevoIndice;

    actualizarVisor();
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
// MODAL DETALLE DEL ALOJAMIENTO
// ==========================================================
// ==========================================================
// MODAL DETALLE DEL ALOJAMIENTO
// ==========================================================


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

    document.body.classList.remove(
        "sin-scroll"
    );
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

            <button
                type="button"
                class="modal-alojamiento-cerrar"
                id="cerrarModalAlojamiento"
                aria-label="Cerrar"
            >
                ×
            </button>

            <div class="modal-alojamiento-galeria">

                <img
                    id="modalAlojamientoFoto"
                    class="modal-alojamiento-foto"
                    alt=""
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

                <div
                    class="modal-alojamiento-contador"
                    id="modalAlojamientoContador"
                ></div>

                <div
                    class="modal-alojamiento-indicadores"
                    id="modalAlojamientoIndicadores"
                ></div>

            </div>


            <div class="modal-alojamiento-informacion">

                <h2
                    id="modalAlojamientoNombre"
                ></h2>

                <div
                    id="modalAlojamientoDescripcion"
                    class="modal-descripcion"
                ></div>

                <div
                    id="modalAlojamientoDatos"
                    class="modal-datos"
                ></div>

                <p
                    id="modalAlojamientoUbicacion"
                    class="modal-ubicacion"
                ></p>

                <div class="modal-precio">

                    <strong
                        id="modalAlojamientoPrecio"
                    ></strong>

                    <span>
                        / noche
                    </span>

                </div>

                <button
                    type="button"
                    class="modal-boton-reserva"
                    id="modalAlojamientoReservar"
                >
                    Solicitar reserva
                </button>

            </div>

        </div>

    `;


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

                abrirReserva(
                    alojamientoParaReserva
                );
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
    // DESLIZAR FOTOS EN CELULAR
    // ======================================================

    const galeria =
        modalAlojamiento.querySelector(
            ".modal-alojamiento-galeria"
        );

    if (galeria) {

        galeria.addEventListener(
            "touchstart",
            function(evento) {

                if (
                    !evento.touches ||
                    !evento.touches[0]
                ) {
                    return;
                }

                modalTouchInicio =
                    evento.touches[0].clientX;
            },
            {
                passive: true
            }
        );


        galeria.addEventListener(
            "touchend",
            function(evento) {

                if (
                    !evento.changedTouches ||
                    !evento.changedTouches[0]
                ) {
                    return;
                }

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

                if (
                    diferencia > 50
                ) {

                    cambiarFotoModalAlojamiento(
                        modalAlojamientoIndice + 1
                    );

                } else {

                    cambiarFotoModalAlojamiento(
                        modalAlojamientoIndice - 1
                    );
                }
            },
            {
                passive: true
            }
        );
    }
}

// ==========================================================
// MOSTRAR AMENIDADES DEL ALOJAMIENTO
// ==========================================================

function mostrarAmenidadesAlojamiento(alojamiento) {

    const descripcion =
        document.getElementById(
            "modalAlojamientoDescripcion"
        );

    if (!descripcion) {
        return;
    }

    // Eliminar una sección anterior si existiera
    const anterior =
        descripcion.querySelector(
            ".modal-amenidades"
        );

    if (anterior) {
        anterior.remove();
    }


    let amenidades =
        alojamiento.amenidades;

    // Si por alguna razón llega como texto,
    // intentamos convertirlo a JSON.
    if (typeof amenidades === "string") {

        try {

            amenidades =
                JSON.parse(amenidades);

        } catch (error) {

            console.warn(
                "No se pudieron interpretar las amenidades:",
                error
            );

            return;
        }
    }


    // Si es NULL o está vacío, no mostramos nada.
    if (
        !amenidades ||
        typeof amenidades !== "object" ||
        Array.isArray(amenidades) ||
        Object.keys(amenidades).length === 0
    ) {
        return;
    }


    const configuracion = {

        bano: {
            icono: "🚿",
            titulo: "Baño"
        },

        cocina: {
            icono: "🍳",
            titulo: "Cocina"
        },

        internet: {
            icono: "📶",
            titulo: "Internet"
        },

        seguridad: {
            icono: "🔐",
            titulo: "Seguridad"
        },

        habitacion: {
            icono: "🛏️",
            titulo: "Habitación"
        },

        climatizacion: {
            icono: "❄️",
            titulo: "Climatización"
        },

        entretenimiento: {
            icono: "📺",
            titulo: "Entretenimiento"
        },

        estacionamiento: {
            icono: "🚗",
            titulo: "Estacionamiento"
        },

        piscina: {
            icono: "🏊",
            titulo: "Piscina"
        },

        exterior: {
            icono: "🌿",
            titulo: "Exterior"
        },

        mascotas: {
            icono: "🐾",
            titulo: "Mascotas"
        },

        trabajo: {
            icono: "💻",
            titulo: "Área de trabajo"
        }

    };


    const contenedor =
        document.createElement(
            "div"
        );

    contenedor.className =
        "modal-amenidades";


    const encabezado =
        document.createElement(
            "div"
        );

    encabezado.className =
        "modal-amenidades-encabezado";

    encabezado.innerHTML = `
        <h3>✨ Lo que ofrece este alojamiento</h3>
    `;

    contenedor.appendChild(
        encabezado
    );


    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "modal-amenidades-grid";


    let cantidadAmenidades = 0;


    Object.entries(amenidades).forEach(
        function([categoria, elementos]) {

            if (
                !Array.isArray(elementos) ||
                elementos.length === 0
            ) {
                return;
            }


            const info =
                configuracion[categoria] || {
                    icono: "✓",
                    titulo: categoria
                        .replace(/_/g, " ")
                        .replace(
                            /\b\w/g,
                            function(letra) {
                                return letra.toUpperCase();
                            }
                        )
                };


            const tarjeta =
                document.createElement(
                    "div"
                );

            tarjeta.className =
                "modal-amenidad-categoria";


            const titulo =
                document.createElement(
                    "div"
                );

            titulo.className =
                "modal-amenidad-titulo";

            titulo.innerHTML = `
                <span class="modal-amenidad-icono">
                    ${info.icono}
                </span>

                <span>
                    ${info.titulo}
                </span>
            `;


            const lista =
                document.createElement(
                    "div"
                );

            lista.className =
                "modal-amenidad-lista";


            elementos.forEach(
                function(elemento) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "modal-amenidad-item";

                    item.textContent =
                        elemento;

                    lista.appendChild(
                        item
                    );

                    cantidadAmenidades++;
                }
            );


            tarjeta.appendChild(
                titulo
            );

            tarjeta.appendChild(
                lista
            );

            grid.appendChild(
                tarjeta
            );
        }
    );


    if (cantidadAmenidades === 0) {
        return;
    }


    contenedor.appendChild(
        grid
    );


    // Si hay muchas amenidades, inicialmente
    // mostramos la sección de forma resumida.
    if (cantidadAmenidades > 6) {

        contenedor.classList.add(
            "modal-amenidades-contraidas"
        );


        const boton =
            document.createElement(
                "button"
            );

        boton.type =
            "button";

        boton.className =
            "modal-amenidades-ver-mas";

        boton.textContent =
            "Mostrar todas las amenidades";


        boton.addEventListener(
            "click",
            function(evento) {

                evento.preventDefault();
                evento.stopPropagation();

                const contraido =
                    contenedor.classList.toggle(
                        "modal-amenidades-contraidas"
                    );

                boton.textContent =
                    contraido
                        ? "Mostrar todas las amenidades"
                        : "Mostrar menos";
            }
        );


        contenedor.appendChild(
            boton
        );
    }


    descripcion.appendChild(
        contenedor
    );
}

// ==========================================================
// ABRIR MODAL DEL ALOJAMIENTO
// ==========================================================

function abrirModalAlojamiento(
    alojamiento,
    fotos
) {

    crearModalAlojamiento();

    alojamientoActual =
        alojamiento;

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

    // ==================================================
    // AMENIDADES
    // ==================================================

    mostrarAmenidadesAlojamiento(
        alojamiento
    );
    
    // ======================================================
    // DATOS DEL ALOJAMIENTO
    // ======================================================

    if (datos) {

        datos.innerHTML = `

            <span>
                🛏️
                ${alojamiento.habitaciones || 0}
                habitación(es)
            </span>

            <span>
                🚿
                ${alojamiento.banos || 0}
                baño(s)
            </span>

            <span>
                👥
                Hasta
                ${alojamiento.max_huespedes || 0}
                personas
            </span>

        `;
    }


    // ======================================================
    // UBICACIÓN
    // ======================================================

    if (ubicacion) {

        if (
            alojamiento.ubicacion
        ) {

            ubicacion.textContent =
                "📍 " +
                alojamiento.ubicacion;

            ubicacion.style.display =
                "block";

        } else {

            ubicacion.textContent =
                "";

            ubicacion.style.display =
                "none";
        }
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
    // CONTADOR
    // ======================================================

    if (
        modalAlojamientoContador
    ) {

        modalAlojamientoContador.textContent =
            (
                modalAlojamientoIndice + 1
            ) +
            " / " +
            modalAlojamientoFotos.length;
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


    // ======================================================
    // INDICADORES
    // ======================================================

    if (indicadores) {

        indicadores.innerHTML =
            "";

        const cantidad =
            Math.min(
                modalAlojamientoFotos.length,
                5
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
                "modal-alojamiento-punto";

            const posicion =
                Math.floor(
                    (
                        modalAlojamientoIndice /
                        modalAlojamientoFotos.length
                    ) *
                    cantidad
                );

            if (
                i === posicion
            ) {

                punto.classList.add(
                    "activo"
                );
            }

            indicadores.appendChild(
                punto
            );
        }
    }
}


// ==========================================================
// CARGAR ALOJAMIENTOS
// ==========================================================

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
                    banos,
                    ubicacion,
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

        // ======================================================
        // RECORRER ALOJAMIENTOS
        // ======================================================

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
                        evento.key ===
                        "Enter" ||
                        evento.key ===
                        " "
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

        // La capacidad publicada NO bloquea
        // cantidades superiores.
        //
        // Si el huésped supera esta cantidad,
        // mostraremos posteriormente el aviso
        // de confirmación correspondiente.

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

    document.body.classList.remove(
        "sin-scroll"
    );

    if (
        calendarioReserva
    ) {

        calendarioReserva.classList.remove(
            "visible"
        );
    }
}


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


    // ======================================================
    // PERMITIR CAMBIAR FECHA DE INGRESO
    // ======================================================

    fechaIngreso.onclick =
        function() {

            modoCalendario =
                "ingreso";

            mostrarCalendario();
        };


    // ======================================================
    // PERMITIR CAMBIAR FECHA DE SALIDA
    // ======================================================

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

    calendarioReserva.innerHTML = `

        <div class="calendario-cabecera">

            <button
                type="button"
                class="calendario-nav"
                id="calendarioMesAnterior"
            >
                ‹
            </button>

            <div
                class="calendario-mes"
                id="calendarioNombreMes"
            >
            </div>

            <button
                type="button"
                class="calendario-nav"
                id="calendarioMesSiguiente"
            >
                ›
            </button>

        </div>

        <div class="calendario-semana">

            <div class="calendario-dia-semana">L</div>
            <div class="calendario-dia-semana">M</div>
            <div class="calendario-dia-semana">M</div>
            <div class="calendario-dia-semana">J</div>
            <div class="calendario-dia-semana">V</div>
            <div class="calendario-dia-semana">S</div>
            <div class="calendario-dia-semana">D</div>

        </div>

        <div
            id="calendarioDias"
            class="calendario-dias"
        >
        </div>

        <div
            id="calendarioMensaje"
            class="calendario-mensaje"
        >
            Seleccione su fecha de ingreso.
        </div>

        <div class="calendario-leyenda">

            <div class="calendario-leyenda-item">

                <span
                    class="calendario-leyenda-color calendario-leyenda-disponible"
                ></span>

                Disponible

            </div>

            <div class="calendario-leyenda-item">

                <span
                    class="calendario-leyenda-color calendario-leyenda-bloqueado"
                ></span>

                No disponible

            </div>

            <div class="calendario-leyenda-item">

                <span
                    class="calendario-leyenda-color calendario-leyenda-seleccionado"
                ></span>

                Seleccionado

            </div>

        </div>

    `;

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

    if (
        !calendarioReserva
    ) {
        return;
    }

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

    if (
        !nombreMes ||
        !contenedorDias
    ) {

        return;
    }

    const año =
        mesCalendarioActual.getFullYear();

    const mes =
        mesCalendarioActual.getMonth();

    const nombresMeses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    nombreMes.textContent =
        nombresMeses[mes] +
        " " +
        año;

    contenedorDias.innerHTML =
        "";

    const primerDia =
        new Date(
            año,
            mes,
            1
        );

    let diaSemana =
        primerDia.getDay();

    diaSemana =
        diaSemana === 0
            ? 6
            : diaSemana - 1;

    const diasDelMes =
        new Date(
            año,
            mes + 1,
            0
        ).getDate();

    for (
        let i = 0;
        i < diaSemana;
        i++
    ) {

        const vacio =
            document.createElement(
                "div"
            );

        vacio.className =
            "calendario-dia vacio";

        contenedorDias.appendChild(
            vacio
        );
    }

    const hoyISO =
        convertirFechaISO(
            new Date()
        );

    for (
        let dia = 1;
        dia <= diasDelMes;
        dia++
    ) {

        const fecha =
            new Date(
                año,
                mes,
                dia
            );

        const fechaISO =
            convertirFechaISO(
                fecha
            );

        const boton =
            document.createElement(
                "button"
            );

        boton.type =
            "button";

        boton.className =
            "calendario-dia";

        boton.textContent =
            dia;

        if (
            fechaISO ===
            hoyISO
        ) {

            boton.classList.add(
                "hoy"
            );
        }

        const pasada =
            esFechaPasada(
                fechaISO
            );

        const bloqueada =
            fechasBloqueadas.has(
                fechaISO
            );

        if (
            pasada
        ) {

            boton.classList.add(
                "pasado"
            );

            boton.classList.add(
                "no-seleccionable"
            );
        }

        if (
            bloqueada
        ) {

            boton.classList.add(
                "bloqueado"
            );

            boton.classList.add(
                "no-seleccionable"
            );
        }

        if (
            fechaIngresoSeleccionada ===
            fechaISO
        ) {

            boton.classList.add(
                "ingreso"
            );
        }

        if (
            fechaSalidaSeleccionada ===
            fechaISO
        ) {

            boton.classList.add(
                "salida"
            );
        }

        if (
            fechaIngresoSeleccionada &&
            fechaSalidaSeleccionada
        ) {

            if (
                fechaISO >
                fechaIngresoSeleccionada &&
                fechaISO <
                fechaSalidaSeleccionada
            ) {

                boton.classList.add(
                    "en-rango"
                );
            }
        }

        if (
            !pasada &&
            !bloqueada
        ) {

            boton.addEventListener(
                "click",
                function() {

                    seleccionarFechaCalendario(
                        fechaISO
                    );

                }
            );
        }

        contenedorDias.appendChild(
            boton
        );
    }

    if (
        mensaje
    ) {

        if (
            modoCalendario ===
            "ingreso"
        ) {

            mensaje.textContent =
                "Seleccione su fecha de ingreso.";

        } else {

            if (
                fechaIngresoSeleccionada
            ) {

                mensaje.textContent =
                    "Ahora seleccione la fecha de salida.";

            } else {

                mensaje.textContent =
                    "Primero seleccione la fecha de ingreso.";
            }
        }
    }
}

function seleccionarFechaCalendario(fechaISO) {

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );


    // ======================================================
    // SI YA HAY INGRESO Y SALIDA
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
        modoCalendario ===
        "ingreso"
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


        // Al cambiar el ingreso,
        // ahora debemos pedir una nueva salida

        modoCalendario =
            "salida";


        disponibilidadVerificada =
            false;


        // El precio anterior deja de ser válido
        calcularPrecio();


        renderizarCalendario();

        return;
    }


    // ======================================================
    // SELECCIONAR FECHA DE SALIDA
    // ======================================================

    if (
        modoCalendario ===
        "salida"
    ) {

        if (
            !fechaIngresoSeleccionada
        ) {

            modoCalendario =
                "ingreso";

            renderizarCalendario();

            return;
        }


        // La salida siempre debe ser posterior al ingreso

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


        disponibilidadVerificada =
            false;


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
    // Superar la capacidad publicada SÍ está permitido.

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
        document.getElementById("personas");

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


    aviso.innerHTML = `

        <div class="aviso-capacidad-cabecera">

            <span class="aviso-capacidad-icono">
                !
            </span>

            <div>

                <strong>
                    La cantidad de huéspedes supera
                    la capacidad indicada
                </strong>

                <p>
                    Este alojamiento está publicado
                    para una capacidad de
                    <b>${capacidad} personas</b>
                    y estás solicitando alojamiento
                    para
                    <b>${cantidad} personas</b>.
                </p>

            </div>

        </div>

        <p class="aviso-capacidad-texto">

            Puedes continuar con la solicitud.
            Sin embargo, antes de hacerlo confirma
            que has revisado la descripción del
            alojamiento, la distribución de sus
            espacios, camas y amenidades, y que
            comprendes que la propiedad está
            equipada y distribuida tomando como
            referencia la capacidad indicada.

        </p>

        <label class="aceptacion-capacidad">

            <input
                type="checkbox"
                id="aceptaCapacidadExcedida"
            >

            <span>
                He revisado la información del
                alojamiento y comprendo que mi
                solicitud supera la capacidad
                indicada.
            </span>

        </label>
    `;
}

// ==========================================================
// VALIDACIÓN DE PERSONAS
// ==========================================================

function procesarCantidadPersonas() {

    if (!alojamientoActual) {
        return;
    }

    const campoPersonas =
        document.getElementById("personas");

    if (!campoPersonas) {
        return;
    }

    let cantidad =
        parseInt(campoPersonas.value, 10);

    if (
        !Number.isFinite(cantidad) ||
        cantidad < 1
    ) {
        cantidad = 1;
        campoPersonas.value = 1;
    }

    const capacidad =
        Number(alojamientoActual.maxHuespedes) || 1;

    // IMPORTANTE:
    // NO modificar el número escrito por el huésped.
    // 7 continúa siendo 7 aunque la capacidad publicada sea 5.

    actualizarAvisoCapacidad(
        cantidad > capacidad
    );

    calcularPrecio();
}


// Funciona mientras escribe
document.addEventListener(
    "input",
    function(evento) {

        if (evento.target.id === "personas") {
            procesarCantidadPersonas();
        }
    }
);


// Refuerzo para navegadores móviles
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
        parseInt(
            campoPersonas.value,
            10
        );

    if (
        !Number.isFinite(cantidad)
    ) {
        cantidad = 1;
    }

    cantidad =
        cantidad + cambio;

    // Nunca bajar de 1
    if (
        cantidad < 1
    ) {
        cantidad = 1;
    }

    // Máximo técnico
    if (
        cantidad > 50
    ) {
        cantidad = 50;
    }

    campoPersonas.value =
        cantidad;

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

    estilos.textContent = `

        #ventanaReserva {
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.65);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        #ventanaReserva.reserva-visible {
            display: flex !important;
        }

        #ventanaReserva .modal-contenido {
            position: relative;
            width: 100%;
            max-width: 520px;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 28px;
            box-sizing: border-box;
            box-shadow:
                0 20px 60px
                rgba(0, 0, 0, 0.25);
            -webkit-overflow-scrolling: touch;
        }

        #ventanaReserva .cerrar {
            position: absolute;
            top: 12px;
            right: 14px;
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: #f2f2f2;
            color: #333333;
            font-size: 25px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #ventanaReserva .cerrar:hover {
            background: #e6e6e6;
        }

        #ventanaReserva h2 {
            margin-top: 0;
            margin-bottom: 8px;
            padding-right: 45px;
        }

        #ventanaReserva .nombre-reserva {
            margin-top: 0;
            margin-bottom: 20px;
            color: #666666;
            font-weight: 600;
        }

        #ventanaReserva label {
            display: block;
            margin-top: 14px;
            margin-bottom: 6px;
            font-weight: 600;
        }

        #ventanaReserva input {
            width: 100%;
            box-sizing: border-box;
            padding: 12px 13px;
            border: 1px solid #d6d6d6;
            border-radius: 9px;
            background: #ffffff;
            font-size: 15px;
            outline: none;
        }

        #ventanaReserva input:focus {
            border-color: #f28c28;
            box-shadow:
                0 0 0 3px
                rgba(242, 140, 40, 0.12);
        }

        #ventanaReserva input[readonly] {
            cursor: pointer;
            background: #fafafa;
        }

        #contenedorCalendario {
            width: 100%;
        }

        #ventanaReserva .resumen {
            margin-top: 20px;
            padding: 14px 16px;
            background: #f7f7f7;
            border-radius: 10px;
        }

        #ventanaReserva .resumen p {
            margin: 5px 0;
        }

        #ventanaReserva .aviso-reserva {
            margin-top: 16px;
            padding: 13px 15px;
            border-radius: 10px;
            background: #fff7ed;
            border: 1px solid #fed7aa;
            color: #7c2d12;
            font-size: 13px;
            line-height: 1.5;
        }

        #ventanaReserva .aviso-reserva p {
            margin:
                5px 0 0 0;
        }

        #ventanaReserva .boton-whatsapp {
            width: 100%;
            margin-top: 18px;
            padding: 14px 16px;
            border: none;
            border-radius: 10px;
            background: #25d366;
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
        }

        #ventanaReserva .boton-whatsapp:hover {
            filter: brightness(0.95);
        }

        #avisoCapacidad {
            margin:
                6px 0 0 0;
            font-size: 13px;
            color: #666666;
        }

        #avisoCapacidad.aviso-capacidad-error {
            color: #b42318;
            font-weight: 600;
        }

        body.sin-scroll {
            overflow: hidden;
        }

        @media (max-width: 600px) {

            #ventanaReserva {
                align-items: flex-start;
                padding: 10px;
            }

            #ventanaReserva .modal-contenido {
                max-height:
                    calc(100vh - 20px);
                padding:
                    22px 16px 28px;
                border-radius: 13px;
            }

            #ventanaReserva h2 {
                font-size: 21px;
            }

        }

    `;

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
        parseInt(
            personas.value,
            10
        );

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
        !Number.isFinite(
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
        IMPORTANTE:

        Este cálculo NO utiliza maxHuespedes.

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

    try {

        insertarEstilosVisor();

        insertarEstilosModalAlojamiento();

        insertarEstilosCalendario();

        insertarEstilosReserva();

        crearVisorFotos();

        crearModalAlojamiento();

        configurarEventosGenerales();

        await cargarPortada();

        await cargarAlojamientos();

        console.log(
            "Estancias Agradables iniciado correctamente."
        );

    } catch (error) {

        console.error(
            "Error al iniciar el sitio:",
            error
        );
    }
}


// ==========================================================
// INICIAR CUANDO EL DOM ESTÉ DISPONIBLE
// ==========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarSitio
    );

} else {

    iniciarSitio();
}


// ==========================================================
// FUNCIONES GLOBALES PARA BOTONES DEL HTML
// ==========================================================

window.cerrarReserva =
    cerrarReserva;

window.enviarWhatsApp =
    enviarWhatsApp;

window.abrirReserva =
    abrirReserva;
