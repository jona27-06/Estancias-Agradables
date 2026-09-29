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

let excesoHuespedesAceptado = false;

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

        @media (max-width: 600px) {

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
            position: relative;
            min-height: 36px;
            border: none;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            font-size: 13px;
            transition: 0.15s ease;
        }

        .calendario-dia:hover:not(.deshabilitado):not(.bloqueado) {
            background: #fff0df;
        }

        .calendario-dia.vacio {
            cursor: default;
        }

        .calendario-dia.pasado {
            color: #c8c8c8;
            cursor: not-allowed;
        }

        .calendario-dia.bloqueado {
            background: #e0e0e0;
            color: #999;
            text-decoration: line-through;
            cursor: not-allowed;
        }

        .calendario-dia.deshabilitado {
            color: #c8c8c8;
            cursor: not-allowed;
        }

        .calendario-dia.ingreso-seleccionado,
        .calendario-dia.salida-seleccionada {
            background: #f28c28;
            color: white;
            font-weight: 700;
        }

        .calendario-dia.en-rango {
            background: #ffe4c4;
            color: #5c3a1d;
            border-radius: 0;
        }

        .calendario-dia.en-rango:hover {
            background: #ffd9ad;
        }

        .calendario-dia.ingreso-seleccionado {
            border-radius: 8px 0 0 8px;
        }

        .calendario-dia.salida-seleccionada {
            border-radius: 0 8px 8px 0;
        }

        .calendario-leyenda {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 12px;
            font-size: 11px;
            color: #666;
        }

        .leyenda-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .leyenda-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            display: inline-block;
        }

        .leyenda-disponible {
            background: white;
            border: 1px solid #ddd;
        }

        .leyenda-bloqueado {
            background: #e0e0e0;
        }

        .leyenda-ingreso {
            background: #f28c28;
        }

        .leyenda-rango {
            background: #ffe4c4;
        }

        .calendario-instruccion {
            margin: 0 0 10px 0;
            font-size: 13px;
            color: #555;
        }

        .mensaje-disponibilidad {
            margin-top: 8px;
            padding: 9px 11px;
            border-radius: 8px;
            background: #fff7ed;
            color: #7a4b16;
            font-size: 12px;
            line-height: 1.4;
        }

        @media (max-width: 600px) {

            #calendarioReserva {
                padding: 10px;
            }

            .calendario-dia {
                min-height: 34px;
                font-size: 12px;
            }

            .calendario-leyenda {
                gap: 8px;
            }

        }

    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// CREAR VISOR DE FOTOS
// ==========================================================

function crearVisorFotos() {

    if (
        document.getElementById(
            "visorFotos"
        )
    ) {

        visorFotos =
            document.getElementById(
                "visorFotos"
            );

        imagenVisor =
            document.getElementById(
                "imagenVisor"
            );

        contadorVisor =
            document.getElementById(
                "contadorVisor"
            );

        return;
    }

    visorFotos =
        document.createElement("div");

    visorFotos.id =
        "visorFotos";

    visorFotos.innerHTML = `

        <button
            class="visor-cerrar"
            onclick="cerrarVisorFotos()"
        >
            ×
        </button>

        <button
            class="visor-flecha visor-anterior"
            onclick="fotoAnteriorVisor()"
        >
            ‹
        </button>

        <div
            class="visor-contenido"
            id="visorContenido"
        >
            <img
                class="visor-imagen"
                id="imagenVisor"
                alt="Fotografía del alojamiento"
            >
        </div>

        <button
            class="visor-flecha visor-siguiente"
            onclick="fotoSiguienteVisor()"
        >
            ›
        </button>

        <div
            class="visor-contador"
            id="contadorVisor"
        >
            0 / 0
        </div>

    `;

    document.body.appendChild(
        visorFotos
    );

    imagenVisor =
        document.getElementById(
            "imagenVisor"
        );

    contadorVisor =
        document.getElementById(
            "contadorVisor"
        );

    const visorContenido =
        document.getElementById(
            "visorContenido"
        );

    if (
        visorContenido
    ) {

        visorContenido.addEventListener(
            "touchstart",
            function(evento) {

                visorTouchInicio =
                    evento.changedTouches[0].screenX;

            },
            {
                passive: true
            }
        );

        visorContenido.addEventListener(
            "touchend",
            function(evento) {

                visorTouchFin =
                    evento.changedTouches[0].screenX;

                const diferencia =
                    visorTouchFin -
                    visorTouchInicio;

                if (
                    Math.abs(diferencia) < 50
                ) {

                    return;
                }

                if (
                    diferencia < 0
                ) {

                    fotoSiguienteVisor();

                } else {

                    fotoAnteriorVisor();

                }

            },
            {
                passive: true
            }
        );

    }

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
}


// ==========================================================
// ABRIR VISOR
// ==========================================================

function abrirVisorFotos(
    fotos,
    indice = 0
) {

    crearVisorFotos();

    fotosVisor =
        Array.isArray(fotos)
            ? fotos
            : [];

    if (
        fotosVisor.length === 0
    ) {

        return;
    }

    indiceVisor =
        Math.max(
            0,
            Math.min(
                indice,
                fotosVisor.length - 1
            )
        );

    actualizarVisorFotos();

    visorFotos.classList.add(
        "visor-visible"
    );

    document.body.style.overflow =
        "hidden";
}


// ==========================================================
// CERRAR VISOR
// ==========================================================

function cerrarVisorFotos() {

    if (
        visorFotos
    ) {

        visorFotos.classList.remove(
            "visor-visible"
        );

    }

    document.body.style.overflow =
        "";

}


// ==========================================================
// ACTUALIZAR VISOR
// ==========================================================

function actualizarVisorFotos() {

    if (
        !imagenVisor ||
        !contadorVisor ||
        !fotosVisor.length
    ) {

        return;
    }

    imagenVisor.src =
        fotosVisor[indiceVisor];

    contadorVisor.textContent =
        (indiceVisor + 1) +
        " / " +
        fotosVisor.length;

}


// ==========================================================
// FOTO ANTERIOR VISOR
// ==========================================================

function fotoAnteriorVisor() {

    if (
        !fotosVisor.length
    ) {

        return;
    }

    indiceVisor--;

    if (
        indiceVisor < 0
    ) {

        indiceVisor =
            fotosVisor.length - 1;

    }

    actualizarVisorFotos();

}


// ==========================================================
// FOTO SIGUIENTE VISOR
// ==========================================================

function fotoSiguienteVisor() {

    if (
        !fotosVisor.length
    ) {

        return;
    }

    indiceVisor++;

    if (
        indiceVisor >=
        fotosVisor.length
    ) {

        indiceVisor = 0;

    }

    actualizarVisorFotos();

}


// ==========================================================
// OBTENER FOTOS DE UN ALOJAMIENTO
// ==========================================================

async function obtenerFotosAlojamiento(
    alojamientoId
) {

    const {
        data,
        error
    } =
        await clienteSupabase
            .storage
            .from("fotos-alojamientos")
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
        error
    ) {

        console.error(
            "Error obteniendo fotos:",
            error
        );

        return [];

    }

    if (
        !data
    ) {

        return [];

    }

    const archivos =
        data.filter(
            function(archivo) {

                const nombre =
                    archivo.name
                        .toLowerCase();

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

    return archivos.map(
        function(archivo) {

            return clienteSupabase
                .storage
                .from("fotos-alojamientos")
                .getPublicUrl(
                    alojamientoId +
                    "/" +
                    archivo.name
                )
                .data
                .publicUrl;

        }
    );

}


// ==========================================================
// OBTENER FOTOS DE PORTADA
// ==========================================================

async function obtenerFotosPortada() {

    const {
        data,
        error
    } =
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

    if (
        error
    ) {

        console.error(
            "Error obteniendo fotos de portada:",
            error
        );

        return [];

    }

    if (
        !data
    ) {

        return [];

    }

    const archivos =
        data.filter(
            function(archivo) {

                const nombre =
                    archivo.name
                        .toLowerCase();

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

    return archivos.map(
        function(archivo) {

            return clienteSupabase
                .storage
                .from("fotos-alojamientos")
                .getPublicUrl(
                    "portada/" +
                    archivo.name
                )
                .data
                .publicUrl;

        }
    );

}


// ==========================================================
// CREAR INDICADORES DE PORTADA
// ==========================================================

function crearIndicadoresPortada() {

    if (
        !indicadoresPortada
    ) {

        return;
    }

    indicadoresPortada.innerHTML =
        "";

    fotosPortada.forEach(
        function(_, indice) {

            const punto =
                document.createElement(
                    "span"
                );

            punto.className =
                "punto-portada";

            if (
                indice ===
                indicePortada
            ) {

                punto.classList.add(
                    "activo"
                );

            }

            indicadoresPortada.appendChild(
                punto
            );

        }
    );

}


// ==========================================================
// ACTUALIZAR INDICADORES DE PORTADA
// ==========================================================

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

    puntos.forEach(
        function(punto, indice) {

            punto.classList.toggle(
                "activo",
                indice ===
                indicePortada
            );

        }
    );

}


// ==========================================================
// CAMBIAR FOTO DE PORTADA
// ==========================================================

function cambiarFotoPortada(
    nuevaFoto
) {

    if (
        !fotosPortada.length
    ) {

        return;
    }

    if (
        !fondoPortadaA ||
        !fondoPortadaB
    ) {

        return;
    }

    const fondoNuevo =
        fondoActivo === "A"
            ? fondoPortadaB
            : fondoPortadaA;

    const fondoAnterior =
        fondoActivo === "A"
            ? fondoPortadaA
            : fondoPortadaB;

    fondoNuevo.style.backgroundImage =
        "url('" +
        nuevaFoto +
        "')";

    fondoNuevo.classList.add(
        "activo"
    );

    fondoAnterior.classList.remove(
        "activo"
    );

    fondoActivo =
        fondoActivo === "A"
            ? "B"
            : "A";

    actualizarIndicadoresPortada();

}


// ==========================================================
// CARGAR PORTADA
// ==========================================================

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
        !fotosPortada.length
    ) {

        console.warn(
            "No se encontraron fotografías en la carpeta portada."
        );

        return;

    }

    indicePortada = 0;
    fondoActivo = "A";

    fondoPortadaA.style.backgroundImage =
        "url('" +
        fotosPortada[0] +
        "')";

    fondoPortadaA.classList.add(
        "activo"
    );

    fondoPortadaB.classList.remove(
        "activo"
    );

    crearIndicadoresPortada();

    if (
        intervaloPortada
    ) {

        clearInterval(
            intervaloPortada
        );

    }

    if (
        fotosPortada.length > 1
    ) {

        intervaloPortada =
            setInterval(
                function() {

                    indicePortada++;

                    if (
                        indicePortada >=
                        fotosPortada.length
                    ) {

                        indicePortada = 0;

                    }

                    cambiarFotoPortada(
                        fotosPortada[
                            indicePortada
                        ]
                    );

                },
                5000
            );

    }

}


// ==========================================================
// CARGAR ALOJAMIENTOS
// ==========================================================

async function cargarAlojamientos() {

    const contenedor =
        document.getElementById(
            "listaAlojamientos"
        );

    if (
        !contenedor
    ) {

        return;
    }

    contenedor.innerHTML =
        "<p>Cargando alojamientos...</p>";

    const {
        data,
        error
    } =
        await clienteSupabase
            .from("alojamientos")
            .select(`
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
                publicado
            `)
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
        error
    ) {

        console.error(
            "Error cargando alojamientos:",
            error
        );

        contenedor.innerHTML =
            "<p>No se pudieron cargar los alojamientos.</p>";

        return;

    }

    if (
        !data ||
        !data.length
    ) {

        contenedor.innerHTML =
            "<p>No hay alojamientos publicados por el momento.</p>";

        return;

    }

    contenedor.innerHTML =
        "";

    for (
        const alojamiento of data
    ) {

        const fotos =
            await obtenerFotosAlojamiento(
                alojamiento.id
            );

        const tarjeta =
            document.createElement(
                "article"
            );

        tarjeta.className =
            "alojamiento";

        const fotoPrincipal =
            fotos.length
                ? fotos[0]
                : "";

        const precioBase =
            Number(
                alojamiento.precio_base
            ) || 0;

        const precioPersona =
            Number(
                alojamiento.precio_persona
            ) || 0;

        const personasIncluidas =
            Number(
                alojamiento.personas_incluidas
            ) || 0;

        const maxHuespedes =
            Number(
                alojamiento.max_huespedes
            ) || personasIncluidas || 1;

        const habitaciones =
            Number(
                alojamiento.habitaciones
            ) || 0;

        const banos =
            Number(
                alojamiento.banos
            ) || 0;

        tarjeta.innerHTML = `

            <div
                class="alojamiento-imagen-contenedor"
                onclick="abrirModalAlojamiento('${alojamiento.id}')"
            >

                ${
                    fotoPrincipal
                        ? `
                            <img
                                class="alojamiento-imagen"
                                src="${fotoPrincipal}"
                                alt="${escapeHTML(alojamiento.nombre || "Alojamiento")}"
                            >
                        `
                        : `
                            <div class="sin-foto">
                                Sin fotografía
                            </div>
                        `
                }

                ${
                    fotos.length
                        ? `
                            <span class="contador-fotos">
                                📷 ${fotos.length} fotos
                            </span>
                        `
                        : ""
                }

            </div>

            <div class="alojamiento-info">

                <h3>
                    ${escapeHTML(
                        alojamiento.nombre ||
                        "Alojamiento"
                    )}
                </h3>

                ${
                    alojamiento.ubicacion
                        ? `
                            <p class="alojamiento-ubicacion">
                                📍 ${escapeHTML(
                                    alojamiento.ubicacion
                                )}
                            </p>
                        `
                        : ""
                }

                <p class="alojamiento-descripcion">
                    ${escapeHTML(
                        alojamiento.descripcion ||
                        "Alojamiento disponible."
                    )}
                </p>

                <div class="alojamiento-datos">

                    ${
                        habitaciones
                            ? `
                                <span>
                                    🛏️ ${habitaciones}
                                    ${
                                        habitaciones === 1
                                            ? " habitación"
                                            : " habitaciones"
                                    }
                                </span>
                            `
                            : ""
                    }

                    ${
                        banos
                            ? `
                                <span>
                                    🚿 ${banos}
                                    ${
                                        banos === 1
                                            ? " baño"
                                            : " baños"
                                    }
                                </span>
                            `
                            : ""
                    }

                    <span>
                        👥 Máx. ${maxHuespedes}
                    </span>

                </div>

                <div class="alojamiento-precio">

                    <strong>
                        Q${precioBase.toFixed(2)}
                    </strong>

                    <span>
                        por noche
                    </span>

                    ${
                        precioPersona > 0
                            ? `
                                <small>
                                    ${personasIncluidas}
                                    ${
                                        personasIncluidas === 1
                                            ? " persona incluida"
                                            : " personas incluidas"
                                    }
                                    · Q${precioPersona.toFixed(2)}
                                    por persona adicional
                                </small>
                            `
                            : ""
                    }

                </div>

                <button
                    class="boton-principal"
                    onclick="abrirModalAlojamiento('${alojamiento.id}')"
                >
                    Ver alojamiento
                </button>

            </div>

        `;

        contenedor.appendChild(
            tarjeta
        );

    }

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escapeHTML(
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


// ==========================================================
// CREAR MODAL DE ALOJAMIENTO
// ==========================================================

function crearModalAlojamiento() {

    if (
        document.getElementById(
            "modalAlojamiento"
        )
    ) {

        modalAlojamiento =
            document.getElementById(
                "modalAlojamiento"
            );

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

    modalAlojamiento =
        document.createElement(
            "div"
        );

    modalAlojamiento.id =
        "modalAlojamiento";

    modalAlojamiento.className =
        "modal-alojamiento";

    modalAlojamiento.innerHTML = `

        <div
            class="modal-alojamiento-contenido"
        >

            <button
                class="cerrar-modal-alojamiento"
                onclick="cerrarModalAlojamiento()"
            >
                ×
            </button>

            <div
                class="modal-alojamiento-galeria"
            >

                <img
                    id="modalAlojamientoFoto"
                    class="modal-alojamiento-foto"
                    alt="Fotografía del alojamiento"
                >

                <button
                    class="flecha-foto flecha-anterior"
                    onclick="fotoAnteriorModalAlojamiento()"
                >
                    ‹
                </button>

                <button
                    class="flecha-foto flecha-siguiente"
                    onclick="fotoSiguienteModalAlojamiento()"
                >
                    ›
                </button>

                <div
                    id="modalAlojamientoContador"
                    class="contador-fotos-modal"
                >
                    0 / 0
                </div>

                <div
                    id="modalAlojamientoIndicadores"
                    class="modal-alojamiento-indicadores"
                >
                </div>

            </div>

            <div
                id="modalAlojamientoInformacion"
                class="modal-alojamiento-informacion"
            >
            </div>

        </div>

    `;

    document.body.appendChild(
        modalAlojamiento
    );

    modalAlojamientoFoto =
        document.getElementById(
            "modalAlojamientoFoto"
        );

    modalAlojamientoContador =
        document.getElementById(
            "modalAlojamientoContador"
        );

    const galeria =
        modalAlojamiento.querySelector(
            ".modal-alojamiento-galeria"
        );

    if (
        galeria
    ) {

        galeria.addEventListener(
            "touchstart",
            function(evento) {

                modalTouchInicio =
                    evento.changedTouches[0].screenX;

            },
            {
                passive: true
            }
        );

        galeria.addEventListener(
            "touchend",
            function(evento) {

                modalTouchFin =
                    evento.changedTouches[0].screenX;

                const diferencia =
                    modalTouchFin -
                    modalTouchInicio;

                if (
                    Math.abs(diferencia) < 50
                ) {

                    return;
                }

                if (
                    diferencia < 0
                ) {

                    fotoSiguienteModalAlojamiento();

                } else {

                    fotoAnteriorModalAlojamiento();

                }

            },
            {
                passive: true
            }
        );

    }

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

}


// ==========================================================
// ABRIR MODAL DE ALOJAMIENTO
// ==========================================================

async function abrirModalAlojamiento(
    alojamientoId
) {

    crearModalAlojamiento();

    const {
        data,
        error
    } =
        await clienteSupabase
            .from("alojamientos")
            .select(`
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
                publicado
            `)
            .eq(
                "id",
                alojamientoId
            )
            .eq(
                "publicado",
                true
            )
            .single();

    if (
        error ||
        !data
    ) {

        console.error(
            "Error cargando alojamiento:",
            error
        );

        alert(
            "No se pudo cargar la información del alojamiento."
        );

        return;

    }

    const fotos =
        await obtenerFotosAlojamiento(
            alojamientoId
        );

    modalAlojamientoFotos =
        fotos;

    modalAlojamientoIndice =
        0;

    actualizarFotoModalAlojamiento();

    const informacion =
        document.getElementById(
            "modalAlojamientoInformacion"
        );

    const precioBase =
        Number(
            data.precio_base
        ) || 0;

    const precioPersona =
        Number(
            data.precio_persona
        ) || 0;

    const personasIncluidas =
        Number(
            data.personas_incluidas
        ) || 0;

    const maxHuespedes =
        Number(
            data.max_huespedes
        ) || personasIncluidas || 1;

    const habitaciones =
        Number(
            data.habitaciones
        ) || 0;

    const banos =
        Number(
            data.banos
        ) || 0;

    informacion.innerHTML = `

        <h2>
            ${escapeHTML(
                data.nombre ||
                "Alojamiento"
            )}
        </h2>

        ${
            data.ubicacion
                ? `
                    <p class="modal-ubicacion">
                        📍 ${escapeHTML(
                            data.ubicacion
                        )}
                    </p>
                `
                : ""
        }

        <div class="modal-datos">

            ${
                habitaciones
                    ? `
                        <span>
                            🛏️ ${habitaciones}
                            ${
                                habitaciones === 1
                                    ? " habitación"
                                    : " habitaciones"
                            }
                        </span>
                    `
                    : ""
            }

            ${
                banos
                    ? `
                        <span>
                            🚿 ${banos}
                            ${
                                banos === 1
                                    ? " baño"
                                    : " baños"
                            }
                        </span>
                    `
                    : ""
            }

            <span>
                👥 Máximo ${maxHuespedes}
            </span>

        </div>

        <div class="modal-descripcion">

            <h3>Descripción</h3>

            <p>
                ${escapeHTML(
                    data.descripcion ||
                    "Alojamiento disponible para disfrutar de una estancia agradable."
                )}
            </p>

        </div>

        <div class="modal-precio">

            <strong>
                Q${precioBase.toFixed(2)}
            </strong>

            <span>
                por noche
            </span>

            ${
                precioPersona > 0
                    ? `
                        <small>
                            Incluye ${personasIncluidas}
                            ${
                                personasIncluidas === 1
                                    ? " persona"
                                    : " personas"
                            }.
                            Persona adicional:
                            Q${precioPersona.toFixed(2)}
                        </small>
                    `
                    : ""
            }

        </div>

        <button
            class="boton-principal"
            onclick="abrirReservaDesdeAlojamiento('${data.id}')"
        >
            Solicitar reserva
        </button>

    `;

    modalAlojamiento.classList.add(
        "modal-alojamiento-visible"
    );

    document.body.style.overflow =
        "hidden";

}


// ==========================================================
// ABRIR RESERVA DESDE MODAL
// ==========================================================

async function abrirReservaDesdeAlojamiento(
    alojamientoId
) {

    cerrarModalAlojamiento();

    await abrirReserva(
        alojamientoId
    );

}


// ==========================================================
// CERRAR MODAL DE ALOJAMIENTO
// ==========================================================

function cerrarModalAlojamiento() {

    if (
        modalAlojamiento
    ) {

        modalAlojamiento.classList.remove(
            "modal-alojamiento-visible"
        );

    }

    document.body.style.overflow =
        "";

}


// ==========================================================
// ACTUALIZAR FOTO DEL MODAL
// ==========================================================

function actualizarFotoModalAlojamiento() {

    if (
        !modalAlojamientoFoto
    ) {

        return;
    }

    if (
        !modalAlojamientoFotos.length
    ) {

        modalAlojamientoFoto.style.display =
            "none";

        if (
            modalAlojamientoContador
        ) {

            modalAlojamientoContador.textContent =
                "";

        }

        return;

    }

    modalAlojamientoFoto.style.display =
        "block";

    modalAlojamientoFoto.src =
        modalAlojamientoFotos[
            modalAlojamientoIndice
        ];

    if (
        modalAlojamientoContador
    ) {

        modalAlojamientoContador.textContent =
            (
                modalAlojamientoIndice +
                1
            ) +
            " / " +
            modalAlojamientoFotos.length;

    }

    const indicadores =
        document.getElementById(
            "modalAlojamientoIndicadores"
        );

    if (
        indicadores
    ) {

        indicadores.innerHTML =
            "";

        modalAlojamientoFotos.forEach(
            function(_, indice) {

                const punto =
                    document.createElement(
                        "span"
                    );

                punto.className =
                    "modal-alojamiento-punto";

                if (
                    indice ===
                    modalAlojamientoIndice
                ) {

                    punto.classList.add(
                        "activo"
                    );

                }

                indicadores.appendChild(
                    punto
                );

            }
        );

    }

}


// ==========================================================
// FOTO ANTERIOR MODAL ALOJAMIENTO
// ==========================================================

function fotoAnteriorModalAlojamiento() {

    if (
        !modalAlojamientoFotos.length
    ) {

        return;
    }

    modalAlojamientoIndice--;

    if (
        modalAlojamientoIndice < 0
    ) {

        modalAlojamientoIndice =
            modalAlojamientoFotos.length -
            1;

    }

    actualizarFotoModalAlojamiento();

}


// ==========================================================
// FOTO SIGUIENTE MODAL ALOJAMIENTO
// ==========================================================

function fotoSiguienteModalAlojamiento() {

    if (
        !modalAlojamientoFotos.length
    ) {

        return;
    }

    modalAlojamientoIndice++;

    if (
        modalAlojamientoIndice >=
        modalAlojamientoFotos.length
    ) {

        modalAlojamientoIndice = 0;

    }

    actualizarFotoModalAlojamiento();

}


// ==========================================================
// ABRIR RESERVA
// ==========================================================

async function abrirReserva(
    alojamientoId
) {

    const {
        data,
        error
    } =
        await clienteSupabase
            .from("alojamientos")
            .select(`
                id,
                nombre,
                precio_base,
                precio_persona,
                personas_incluidas,
                max_huespedes,
                publicado
            `)
            .eq(
                "id",
                alojamientoId
            )
            .eq(
                "publicado",
                true
            )
            .single();

    if (
        error ||
        !data
    ) {

        console.error(
            "Error cargando alojamiento para reserva:",
            error
        );

        alert(
            "No se pudo cargar la información del alojamiento."
        );

        return;

    }

    alojamientoActual =
        data;

    excesoHuespedesAceptado =
        false;

    const ventana =
        document.getElementById(
            "ventanaReserva"
        );

    const nombreAlojamiento =
        document.getElementById(
            "nombreAlojamiento"
        );

    const personas =
        document.getElementById(
            "personas"
        );

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );

    if (
        nombreAlojamiento
    ) {

        nombreAlojamiento.textContent =
            alojamientoActual.nombre;

    }

    if (
        personas
    ) {

        personas.value =
            1;

        /*
         * IMPORTANTE:
         * El campo NO se limita al máximo del alojamiento.
         * Se permite introducir una cantidad superior para
         * mostrar la confirmación de exceso de huéspedes.
         */
        personas.max =
            50;

    }

    if (
        fechaIngreso
    ) {

        fechaIngreso.value =
            "";

        fechaIngreso.min =
            obtenerFechaHoy();

    }

    if (
        fechaSalida
    ) {

        fechaSalida.value =
            "";

        fechaSalida.min =
            obtenerFechaHoy();

    }

    fechaIngresoSeleccionada =
        null;

    fechaSalidaSeleccionada =
        null;

    disponibilidadVerificada =
        false;

    fechasBloqueadas =
        new Set();

    modoCalendario =
        "ingreso";

    mesCalendarioActual =
        new Date();

    const calendario =
        document.getElementById(
            "calendarioReserva"
        );

    if (
        calendario
    ) {

        calendario.classList.add(
            "visible"
        );

    }

    const mensajeCalendario =
        document.getElementById(
            "mensajeDisponibilidad"
        );

    if (
        mensajeCalendario
    ) {

        mensajeCalendario.textContent =
            "Cargando disponibilidad...";

    }

    if (
        ventana
    ) {

        ventana.style.display =
            "block";

    }

    document.body.style.overflow =
        "hidden";

    limpiarResumenReserva();

    await cargarDisponibilidad();

}


// ==========================================================
// OBTENER FECHA DE HOY
// ==========================================================

function obtenerFechaHoy() {

    const hoy =
        new Date();

    const año =
        hoy.getFullYear();

    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            hoy.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        año +
        "-" +
        mes +
        "-" +
        dia
    );

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

        ventana.style.display =
            "none";

    }

    document.body.style.overflow =
        "";

    alojamientoActual =
        null;

    excesoHuespedesAceptado =
        false;

}


// ==========================================================
// LIMPIAR RESUMEN
// ==========================================================

function limpiarResumenReserva() {

    const cantidadNoches =
        document.getElementById(
            "cantidadNoches"
        );

    const precioTotal =
        document.getElementById(
            "precioTotal"
        );

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

}


// ==========================================================
// CARGAR DISPONIBILIDAD
// ==========================================================

async function cargarDisponibilidad() {

    if (
        !alojamientoActual
    ) {

        return;
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
                "Error cargando disponibilidad:",
                resultado.error
            );

            disponibilidadVerificada =
                false;

            const mensaje =
                document.getElementById(
                    "mensajeDisponibilidad"
                );

            if (
                mensaje
            ) {

                mensaje.textContent =
                    "No fue posible consultar la disponibilidad en este momento.";

            }

            renderizarCalendario();

            return;

        }

        fechasBloqueadas =
            new Set();

        if (
            resultado.data &&
            Array.isArray(
                resultado.data.blocked
            )
        ) {

            resultado.data.blocked.forEach(
                function(fecha) {

                    fechasBloqueadas.add(
                        fecha
                    );

                }
            );

        }

        disponibilidadVerificada =
            true;

        const mensaje =
            document.getElementById(
                "mensajeDisponibilidad"
            );

        if (
            mensaje
        ) {

            mensaje.textContent =
                "Las fechas en gris no están disponibles.";

        }

        renderizarCalendario();

    } catch (error) {

        console.error(
            "Error consultando disponibilidad:",
            error
        );

        disponibilidadVerificada =
            false;

        renderizarCalendario();

    }

}


// ==========================================================
// FECHA A TEXTO
// ==========================================================

function fechaAString(
    fecha
) {

    const año =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        año +
        "-" +
        mes +
        "-" +
        dia
    );

}


// ==========================================================
// CREAR FECHA LOCAL
// ==========================================================

function crearFechaLocal(
    año,
    mes,
    dia
) {

    return new Date(
        año,
        mes,
        dia
    );

}


// ==========================================================
// COMPARAR FECHAS
// ==========================================================

function fechaSinHora(
    fecha
) {

    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );

}


// ==========================================================
// FECHA BLOQUEADA
// ==========================================================

function estaBloqueada(
    fechaString
) {

    return fechasBloqueadas.has(
        fechaString
    );

}


// ==========================================================
// FECHA PASADA
// ==========================================================

function fechaEsPasada(
    fecha
) {

    const hoy =
        new Date();

    const fechaComparada =
        fechaSinHora(
            fecha
        );

    const hoySinHora =
        fechaSinHora(
            hoy
        );

    return (
        fechaComparada <
        hoySinHora
    );

}


// ==========================================================
// RANGO DISPONIBLE
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

    const fechaInicio =
        new Date(
            ingreso +
            "T00:00:00"
        );

    const fechaFin =
        new Date(
            salida +
            "T00:00:00"
        );

    if (
        fechaFin <=
        fechaInicio
    ) {

        return false;

    }

    const fechaActual =
        new Date(
            fechaInicio
        );

    while (
        fechaActual <
        fechaFin
    ) {

        const fechaTexto =
            fechaAString(
                fechaActual
            );

        if (
            estaBloqueada(
                fechaTexto
            )
        ) {

            return false;

        }

        fechaActual.setDate(
            fechaActual.getDate() + 1
        );

    }

    return true;

}


// ==========================================================
// RENDERIZAR CALENDARIO
// ==========================================================

function renderizarCalendario() {

    const calendario =
        document.getElementById(
            "calendarioReserva"
        );

    if (
        !calendario
    ) {

        return;

    }

    const año =
        mesCalendarioActual.getFullYear();

    const mes =
        mesCalendarioActual.getMonth();

    const primerDia =
        crearFechaLocal(
            año,
            mes,
            1
        );

    const ultimoDia =
        crearFechaLocal(
            año,
            mes + 1,
            0
        );

    const nombreMes =
        mesCalendarioActual.toLocaleDateString(
            "es-GT",
            {
                month: "long",
                year: "numeric"
            }
        );

    let primerDiaSemana =
        primerDia.getDay();

    /*
     * Convertimos domingo = 0 a lunes = 0
     */
    primerDiaSemana =
        primerDiaSemana === 0
            ? 6
            : primerDiaSemana - 1;

    let html = `

        <div class="calendario-cabecera">

            <button
                type="button"
                class="calendario-nav"
                onclick="cambiarMesCalendario(-1)"
            >
                ‹
            </button>

            <div class="calendario-mes">
                ${nombreMes}
            </div>

            <button
                type="button"
                class="calendario-nav"
                onclick="cambiarMesCalendario(1)"
            >
                ›
            </button>

        </div>

        <p
            class="calendario-instruccion"
        >
            ${
                modoCalendario === "ingreso"
                    ? "Seleccione la fecha de ingreso."
                    : "Seleccione la fecha de salida."
            }
        </p>

        <div class="calendario-semana">

            <div class="calendario-dia-semana">L</div>
            <div class="calendario-dia-semana">M</div>
            <div class="calendario-dia-semana">X</div>
            <div class="calendario-dia-semana">J</div>
            <div class="calendario-dia-semana">V</div>
            <div class="calendario-dia-semana">S</div>
            <div class="calendario-dia-semana">D</div>

        </div>

        <div class="calendario-dias">
    `;

    for (
        let i = 0;
        i < primerDiaSemana;
        i++
    ) {

        html += `
            <button
                type="button"
                class="calendario-dia vacio"
                disabled
            ></button>
        `;

    }

    for (
        let dia = 1;
        dia <= ultimoDia.getDate();
        dia++
    ) {

        const fecha =
            crearFechaLocal(
                año,
                mes,
                dia
            );

        const fechaString =
            fechaAString(
                fecha
            );

        const bloqueada =
            estaBloqueada(
                fechaString
            );

        const pasada =
            fechaEsPasada(
                fecha
            );

        const esIngreso =
            fechaIngresoSeleccionada ===
            fechaString;

        const esSalida =
            fechaSalidaSeleccionada ===
            fechaString;

        let enRango = false;

        if (
            fechaIngresoSeleccionada &&
            fechaSalidaSeleccionada
        ) {

            enRango =
                fechaString >
                fechaIngresoSeleccionada &&
                fechaString <
                fechaSalidaSeleccionada;

        }

        let clases =
            "calendario-dia";

        if (
            bloqueada
        ) {

            clases +=
                " bloqueado";

        }

        if (
            pasada
        ) {

            clases +=
                " pasado";

        }

        if (
            esIngreso
        ) {

            clases +=
                " ingreso-seleccionado";

        }

        if (
            esSalida
        ) {

            clases +=
                " salida-seleccionada";

        }

        if (
            enRango
        ) {

            clases +=
                " en-rango";

        }

        const deshabilitado =
            bloqueada ||
            pasada;

        html += `

            <button
                type="button"
                class="${clases}"
                ${
                    deshabilitado
                        ? "disabled"
                        : ""
                }
                onclick="seleccionarFechaCalendario('${fechaString}')"
            >
                ${dia}
            </button>

        `;

    }

    html += `
        </div>

        <div class="calendario-leyenda">

            <span class="leyenda-item">
                <span class="leyenda-color leyenda-disponible"></span>
                Disponible
            </span>

            <span class="leyenda-item">
                <span class="leyenda-color leyenda-bloqueado"></span>
                No disponible
            </span>

            <span class="leyenda-item">
                <span class="leyenda-color leyenda-ingreso"></span>
                Seleccionado
            </span>

            <span class="leyenda-item">
                <span class="leyenda-color leyenda-rango"></span>
                Rango
            </span>

        </div>

    `;

    calendario.innerHTML =
        html;

}


// ==========================================================
// CAMBIAR MES
// ==========================================================

function cambiarMesCalendario(
    cantidad
) {

    const nuevoMes =
        new Date(
            mesCalendarioActual
        );

    nuevoMes.setMonth(
        nuevoMes.getMonth() +
        cantidad
    );

    const hoy =
        new Date();

    const mesActual =
        new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            1
        );

    const mesNuevo =
        new Date(
            nuevoMes.getFullYear(),
            nuevoMes.getMonth(),
            1
        );

    if (
        mesNuevo <
        mesActual
    ) {

        return;

    }

    mesCalendarioActual =
        nuevoMes;

    renderizarCalendario();

}


// ==========================================================
// SELECCIONAR FECHA
// ==========================================================

function seleccionarFechaCalendario(
    fecha
) {

    if (
        estaBloqueada(
            fecha
        )
    ) {

        return;

    }

    const fechaSeleccionada =
        new Date(
            fecha +
            "T00:00:00"
        );

    if (
        fechaEsPasada(
            fechaSeleccionada
        )
    ) {

        return;

    }

    if (
        modoCalendario ===
        "ingreso"
    ) {

        fechaIngresoSeleccionada =
            fecha;

        fechaSalidaSeleccionada =
            null;

        const fechaIngreso =
            document.getElementById(
                "fechaIngreso"
            );

        const fechaSalida =
            document.getElementById(
                "fechaSalida"
            );

        if (
            fechaIngreso
        ) {

            fechaIngreso.value =
                fecha;

        }

        if (
            fechaSalida
        ) {

            fechaSalida.value =
                "";

        }

        modoCalendario =
            "salida";

        disponibilidadVerificada =
            false;

        renderizarCalendario();

        calcularPrecio();

        return;

    }

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

        if (
            fecha <=
            fechaIngresoSeleccionada
        ) {

            alert(
                "La fecha de salida debe ser posterior a la fecha de ingreso."
            );

            return;

        }

        if (
            !rangoDisponible(
                fechaIngresoSeleccionada,
                fecha
            )
        ) {

            alert(
                "El rango seleccionado contiene una fecha no disponible. Seleccione otras fechas."
            );

            return;

        }

        fechaSalidaSeleccionada =
            fecha;

        const fechaSalida =
            document.getElementById(
                "fechaSalida"
            );

        if (
            fechaSalida
        ) {

            fechaSalida.value =
                fecha;

        }

        modoCalendario =
            "ingreso";

        disponibilidadVerificada =
            false;

        renderizarCalendario();

        calcularPrecio();

    }

}


// ==========================================================
// EVENTOS DE FECHAS
// ==========================================================

document.addEventListener(
    "change",
    function(evento) {

        if (
            evento.target.id ===
            "fechaIngreso"
        ) {

            const valor =
                evento.target.value;

            if (
                !valor
            ) {

                fechaIngresoSeleccionada =
                    null;

                fechaSalidaSeleccionada =
                    null;

                modoCalendario =
                    "ingreso";

                renderizarCalendario();

                calcularPrecio();

                return;

            }

            if (
                estaBloqueada(
                    valor
                )
            ) {

                alert(
                    "Esa fecha no está disponible."
                );

                evento.target.value =
                    "";

                fechaIngresoSeleccionada =
                    null;

                fechaSalidaSeleccionada =
                    null;

                modoCalendario =
                    "ingreso";

                renderizarCalendario();

                calcularPrecio();

                return;

            }

            fechaIngresoSeleccionada =
                valor;

            fechaSalidaSeleccionada =
                null;

            const fechaSalida =
                document.getElementById(
                    "fechaSalida"
                );

            if (
                fechaSalida
            ) {

                fechaSalida.value =
                    "";

            }

            modoCalendario =
                "salida";

            renderizarCalendario();

            calcularPrecio();

        }

        if (
            evento.target.id ===
            "fechaSalida"
        ) {

            const valor =
                evento.target.value;

            if (
                !valor
            ) {

                fechaSalidaSeleccionada =
                    null;

                modoCalendario =
                    "salida";

                renderizarCalendario();

                calcularPrecio();

                return;

            }

            if (
                !fechaIngresoSeleccionada
            ) {

                alert(
                    "Primero seleccione la fecha de ingreso."
                );

                evento.target.value =
                    "";

                return;

            }

            if (
                valor <=
                fechaIngresoSeleccionada
            ) {

                alert(
                    "La fecha de salida debe ser posterior a la fecha de ingreso."
                );

                evento.target.value =
                    "";

                fechaSalidaSeleccionada =
                    null;

                modoCalendario =
                    "salida";

                renderizarCalendario();

                calcularPrecio();

                return;

            }

            if (
                !rangoDisponible(
                    fechaIngresoSeleccionada,
                    valor
                )
            ) {

                alert(
                    "El rango seleccionado contiene una fecha no disponible."
                );

                evento.target.value =
                    "";

                fechaSalidaSeleccionada =
                    null;

                modoCalendario =
                    "salida";

                renderizarCalendario();

                calcularPrecio();

                return;

            }

            fechaSalidaSeleccionada =
                valor;

            modoCalendario =
                "ingreso";

            renderizarCalendario();

            calcularPrecio();

        }

    }
);


// ==========================================================
// CALCULAR PRECIO
// ==========================================================

function calcularPrecio() {

    if (
        !alojamientoActual
    ) {

        return;

    }

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        ).value;

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        ).value;

    const personas =
        Number(
            document.getElementById(
                "personas"
            ).value
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
        personas < 1
    ) {

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

        return;

    }

    if (
        !fechaIngreso ||
        !fechaSalida
    ) {

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

        return;

    }

    const fechaInicio =
        new Date(
            fechaIngreso +
            "T00:00:00"
        );

    const fechaFin =
        new Date(
            fechaSalida +
            "T00:00:00"
        );

    const diferencia =
        fechaFin.getTime() -
        fechaInicio.getTime();

    const noches =
        Math.ceil(
            diferencia /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    if (
        noches <= 0
    ) {

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

        return;

    }

    const precioBase =
        Number(
            alojamientoActual.precio_base
        ) || 0;

    const precioPersona =
        Number(
            alojamientoActual.precio_persona
        ) || 0;

    const personasIncluidas =
        Number(
            alojamientoActual.personas_incluidas
        ) || 0;

    /*
     * Aquí se permite calcular incluso cuando
     * la cantidad de personas supera la capacidad máxima.
     * El exceso se confirma mediante el mensaje correspondiente.
     */
    const personasAdicionales =
        Math.max(
            personas -
            personasIncluidas,
            0
        );

    const totalPorNoche =
        precioBase +
        (
            personasAdicionales *
            precioPersona
        );

    const total =
        totalPorNoche *
        noches;

    if (
        cantidadNoches
    ) {

        cantidadNoches.textContent =
            noches;

    }

    if (
        precioTotal
    ) {

        precioTotal.textContent =
            "Q" +
            total.toFixed(2);

    }

}


// ==========================================================
// VALIDACIÓN DE PERSONAS
// ==========================================================

function confirmarExcesoHuespedes(
    personas
) {

    if (
        !alojamientoActual ||
        personas <= alojamientoActual.maxHuespedes
    ) {

        excesoHuespedesAceptado =
            false;

        return true;

    }

    if (
        excesoHuespedesAceptado
    ) {

        return true;

    }

    const personasAdicionales =
        personas -
        alojamientoActual.maxHuespedes;

    const acepta =
        window.confirm(
            "Este alojamiento tiene una capacidad máxima de " +
            alojamientoActual.maxHuespedes +
            " personas.\n\n" +
            "Usted ha indicado " +
            personas +
            " personas, es decir, " +
            personasAdicionales +
            " persona" +
            (
                personasAdicionales === 1
                    ? " adicional"
                    : "s adicionales"
            ) +
            " a la capacidad permitida.\n\n" +
            "¿Es consciente de esta situación y desea continuar con la solicitud de reserva?"
        );

    if (
        acepta
    ) {

        excesoHuespedesAceptado =
            true;

        return true;

    }

    excesoHuespedesAceptado =
        false;

    return false;

}


// ==========================================================
// EVENTO DE CANTIDAD DE PERSONAS
// ==========================================================

document.addEventListener(
    "input",
    function(evento) {

        if (
            evento.target.id !==
            "personas"
        ) {

            return;

        }

        if (
            !alojamientoActual
        ) {

            return;

        }

        let personas =
            Number(
                evento.target.value
            );

        if (
            personas < 1
        ) {

            personas =
                1;

            evento.target.value =
                1;

            excesoHuespedesAceptado =
                false;

        }

        if (
            personas <=
            alojamientoActual.maxHuespedes
        ) {

            excesoHuespedesAceptado =
                false;

        } else {

            const aceptado =
                confirmarExcesoHuespedes(
                    personas
                );

            if (
                !aceptado
            ) {

                evento.target.value =
                    alojamientoActual.maxHuespedes;

                personas =
                    alojamientoActual.maxHuespedes;

            }

        }

        calcularPrecio();

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
                "Error en verificación final:",
                resultado.error
            );

            return false;

        }

        const bloqueadasActualizadas =
            new Set();

        if (
            resultado.data &&
            Array.isArray(
                resultado.data.blocked
            )
        ) {

            resultado.data.blocked.forEach(
                function(fecha) {

                    bloqueadasActualizadas.add(
                        fecha
                    );

                }
            );

        }

        fechasBloqueadas =
            bloqueadasActualizadas;

        const disponible =
            rangoDisponible(
                ingreso,
                salida
            );

        renderizarCalendario();

        return disponible;

    } catch (error) {

        console.error(
            "Error durante la verificación final:",
            error
        );

        return false;

    }

}


// ==========================================================
// ENVIAR WHATSAPP
// ==========================================================

async function enviarWhatsApp() {

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
        Number(
            document.getElementById(
                "cantidadNoches"
            ).textContent
        );

    const total =
        document.getElementById(
            "precioTotal"
        ).textContent;

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
        noches <= 0
    ) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de ingreso."
        );

        return;

    }

    if (
        personas < 1
    ) {

        alert(
            "La cantidad de personas debe ser de al menos 1."
        );

        return;

    }

    /*
     * Si supera la capacidad máxima,
     * debe haber aceptado expresamente el aviso.
     */
    if (
        personas >
        alojamientoActual.maxHuespedes
    ) {

        const aceptaExceso =
            confirmarExcesoHuespedes(
                personas
            );

        if (
            !aceptaExceso
        ) {

            alert(
                "No se puede continuar con una cantidad de huéspedes superior a la capacidad permitida sin aceptar esta condición."
            );

            return;

        }

    }

    if (
        !rangoDisponible(
            ingreso,
            salida
        )
    ) {

        alert(
            "Las fechas seleccionadas ya no están disponibles. Seleccione otras fechas."
        );

        await cargarDisponibilidad();

        return;

    }

    const disponibilidadFinal =
        await verificarDisponibilidadAntesDeEnviar();

    if (
        !disponibilidadFinal
    ) {

        alert(
            "Las fechas seleccionadas ya no están disponibles. Por favor seleccione otras fechas."
        );

        return;

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

        "\n\n" +

        "La selección de estas fechas no confirma la reserva. " +
        "La solicitud queda sujeta a confirmación de disponibilidad por parte del anfitrión.";

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


// ==========================================================
// CERRAR MODALES CON ESCAPE
// ==========================================================

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

        const ventana =
            document.getElementById(
                "ventanaReserva"
            );

        if (
            ventana &&
            ventana.style.display ===
            "block"
        ) {

            cerrarReserva();

        }

    }
);


// ==========================================================
// CERRAR MODAL DE RESERVA AL HACER CLICK FUERA
// ==========================================================

document.addEventListener(
    "click",
    function(evento) {

        const ventana =
            document.getElementById(
                "ventanaReserva"
            );

        if (
            !ventana
        ) {

            return;

        }

        if (
            evento.target ===
            ventana
        ) {

            cerrarReserva();

        }

    }
);


// ==========================================================
// INICIAR PÁGINA
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        insertarEstilosCalendario();

        insertarEstilosVisor();

        insertarEstilosModalAlojamiento();

        crearVisorFotos();

        crearModalAlojamiento();

        cargarPortada();

        cargarAlojamientos();

    }
);
