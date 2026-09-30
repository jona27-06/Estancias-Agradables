// ==========================================================
// ESTANCIAS AGRADABLES
// SCRIPT.JS COMPLETO
// ==========================================================


// ==========================================================
// SUPABASE
// ==========================================================

const SUPABASE_URL =
    "https://caodorogvcpupdajtbbp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YWZ-E6";

const clienteSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================================
// VARIABLES GLOBALES
// ==========================================================

let alojamientoActual = null;

let indiceFotoActual = 0;

let fotosAlojamientoActual = [];

let intervaloPortada = null;

let fotosPortada = [];

let indicePortada = 0;

let fechaEntradaSeleccionada = null;

let fechaSalidaSeleccionada = null;

let calendarioMes = new Date();

let fechaCalendarioActiva = null;

let fotosTarjetas = {};


// ==========================================================
// EXTENSIONES DE IMAGEN
// ==========================================================

const extensionesImagen = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif"
];


// ==========================================================
// INSERTAR ESTILOS ADICIONALES
// ==========================================================

function insertarEstilosJavascript() {

    if (document.getElementById("estilosJavascript")) {
        return;
    }

    const estilos =
        document.createElement("style");

    estilos.id =
        "estilosJavascript";

    estilos.textContent = `

        /* ==================================================
           TARJETAS
           ================================================== */

        .alojamiento {
            position: relative;
            overflow: hidden;
        }

        .galeria-alojamiento {
            position: relative;
            width: 100%;
            height: 240px;
            overflow: hidden;
            background: #f3f3f3;
            cursor: pointer;
        }

        .galeria-alojamiento .foto-principal {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            background: #f3f3f3;
        }

        .nombre-alojamiento {
            cursor: pointer;
        }

        .info-tarjeta-alojamiento {
            cursor: pointer;
        }

        .ubicacion-tarjeta {
            color: #666;
            font-size: 14px;
            margin: 6px 0;
        }

        .descripcion-tarjeta {
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }

        .datos-rapidos-tarjeta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 12px 0;
        }

        .dato-rapido-tarjeta {
            font-size: 13px;
            color: #555;
        }

        .pie-tarjeta-alojamiento {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .precio-tarjeta-alojamiento {
            font-size: 18px;
            font-weight: bold;
            color: #f57c00;
        }

        .btn-ver-alojamiento {
            cursor: pointer;
        }

        .sin-foto-tarjeta {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            background: #f1f1f1;
        }

        .flecha-foto-tarjeta {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,.45);
            color: white;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 5;
            transition: .2s;
        }

        .flecha-foto-tarjeta:hover {
            background: rgba(0,0,0,.7);
        }

        .flecha-foto-tarjeta.izquierda {
            left: 10px;
        }

        .flecha-foto-tarjeta.derecha {
            right: 10px;
        }

        .puntos-fotos-tarjeta {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 5px;
            z-index: 5;
        }

        .punto-foto-tarjeta {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(255,255,255,.65);
            box-shadow: 0 1px 3px rgba(0,0,0,.4);
        }

        .punto-foto-tarjeta.activo {
            background: #f57c00;
        }

        .contador-fotos {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 5;
            background: rgba(0,0,0,.55);
            color: white;
            padding: 5px 9px;
            border-radius: 15px;
            font-size: 12px;
        }


        /* ==================================================
           MODAL ALOJAMIENTO
           ================================================== */

        .modal-alojamiento-contenido {
            width: min(1000px, 94vw);
            max-height: 94vh;
            overflow-y: auto;
            background: white;
            border-radius: 14px;
            position: relative;
            margin: 3vh auto;
        }

        .modal-alojamiento-cerrar {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,.65);
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 20;
        }

        .modal-alojamiento-galeria {
            position: relative;
            width: 100%;
            height: 500px;
            background: #111;
            overflow: hidden;
        }

        .modal-alojamiento-fotos {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-alojamiento-fotos img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            cursor: zoom-in;
        }

        .modal-alojamiento-flecha {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 42px;
            height: 42px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,.55);
            color: white;
            font-size: 25px;
            cursor: pointer;
            z-index: 10;
        }

        .modal-alojamiento-flecha.izquierda {
            left: 15px;
        }

        .modal-alojamiento-flecha.derecha {
            right: 15px;
        }

        .modal-alojamiento-contador {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,.6);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            z-index: 10;
        }

        .modal-alojamiento-informacion {
            padding: 25px;
        }

        .modal-datos {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 10px;
            margin: 18px 0;
        }

        .modal-ubicacion {
            color: #666;
            margin: 7px 0 15px;
        }

        .modal-precio {
            font-size: 22px;
            color: #f57c00;
            font-weight: bold;
            margin: 20px 0;
        }

        .modal-boton-reserva {
            width: 100%;
            padding: 13px 20px;
            border: none;
            border-radius: 8px;
            background: #f57c00;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }

        .modal-boton-reserva:hover {
            background: #e66f00;
        }

        .amenidades-modal {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
        }

        .amenidad-modal {
            padding: 7px 10px;
            background: #f5f5f5;
            border-radius: 6px;
            font-size: 13px;
        }


        /* ==================================================
           VISOR DE FOTOS
           ================================================== */

        #visorFotos {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.96);
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
        }

        #visorFotos.visible {
            display: flex;
        }

        #imagenVisorFotos {
            max-width: 92vw;
            max-height: 88vh;
            object-fit: contain;
        }

        .visor-fotos-cerrar {
            position: absolute;
            top: 15px;
            right: 20px;
            width: 42px;
            height: 42px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.15);
            color: white;
            font-size: 27px;
            cursor: pointer;
        }

        .visor-fotos-flecha {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.15);
            color: white;
            font-size: 30px;
            cursor: pointer;
        }

        .visor-fotos-flecha.izquierda {
            left: 20px;
        }

        .visor-fotos-flecha.derecha {
            right: 20px;
        }

        #visorContadorFotos {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0,0,0,.5);
            padding: 7px 13px;
            border-radius: 20px;
        }


        /* ==================================================
           NO SCROLL
           ================================================== */

        body.sin-scroll {
            overflow: hidden;
        }


        /* ==================================================
           ADVERTENCIA DE HUÉSPEDES
           ================================================== */

        .advertencia-huespedes {
            margin-top: 10px;
            padding: 12px;
            border-radius: 8px;
            background: #fff3cd;
            border: 1px solid #ffe08a;
            color: #856404;
            font-size: 14px;
        }

        .advertencia-huespedes label {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            cursor: pointer;
        }


        /* ==================================================
           PORTADA
           ================================================== */

        .portada-fondo-a,
        .portada-fondo-b {
            transition: opacity 1s ease;
        }


        /* ==================================================
           MÓVIL
           ================================================== */

        @media (max-width: 700px) {

            .galeria-alojamiento {
                height: 220px;
            }

            .modal-alojamiento-galeria {
                height: 320px;
            }

            .modal-alojamiento-informacion {
                padding: 18px;
            }

            .visor-fotos-flecha {
                width: 40px;
                height: 40px;
                font-size: 24px;
            }

            .visor-fotos-flecha.izquierda {
                left: 8px;
            }

            .visor-fotos-flecha.derecha {
                right: 8px;
            }

        }

    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// NORMALIZAR AMENIDADES
// ==========================================================

function normalizarAmenidades(amenidades) {

    if (!amenidades) {
        return [];
    }

    if (Array.isArray(amenidades)) {
        return amenidades;
    }

    if (typeof amenidades === "string") {

        try {

            const resultado =
                JSON.parse(amenidades);

            if (Array.isArray(resultado)) {
                return resultado;
            }

        } catch (error) {
            // No es JSON
        }

        return amenidades
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
}


// ==========================================================
// CONSTRUIR AMENIDADES
// ==========================================================

function construirAmenidadesHTML(amenidades) {

    const lista =
        normalizarAmenidades(
            amenidades
        );

    if (!lista.length) {
        return "";
    }

    return `
        <div class="amenidades-modal">
            ${lista.map(amenidad => `
                <span class="amenidad-modal">
                    ${escapeHTML(amenidad)}
                </span>
            `).join("")}
        </div>
    `;
}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escapeHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
        return;
    }

    const modal =
        document.createElement("div");

    modal.id =
        "modalAlojamiento";

    modal.className =
        "modal";

    modal.innerHTML = `

        <div class="modal-alojamiento-contenido">

            <button
                type="button"
                class="modal-alojamiento-cerrar"
                aria-label="Cerrar"
            >
                ×
            </button>

            <div class="modal-alojamiento-galeria">

                <div class="modal-alojamiento-fotos">
                </div>

                <button
                    type="button"
                    class="modal-alojamiento-flecha izquierda"
                    aria-label="Fotografía anterior"
                >
                    ‹
                </button>

                <button
                    type="button"
                    class="modal-alojamiento-flecha derecha"
                    aria-label="Fotografía siguiente"
                >
                    ›
                </button>

                <div
                    class="modal-alojamiento-contador"
                >
                    0 / 0
                </div>

            </div>

            <div class="modal-alojamiento-informacion">

                <h2
                    id="modalAlojamientoNombre"
                ></h2>

                <div
                    id="modalAlojamientoUbicacion"
                    class="modal-ubicacion"
                ></div>

                <p
                    id="modalAlojamientoDescripcion"
                ></p>

                <div
                    id="modalAlojamientoDatos"
                    class="modal-datos"
                ></div>

                <div
                    id="modalAlojamientoAmenidades"
                ></div>

                <div
                    id="modalAlojamientoPrecio"
                    class="modal-precio"
                ></div>

                <button
                    type="button"
                    id="btnSolicitarReserva"
                    class="modal-boton-reserva"
                >
                    Solicitar reserva
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    // CERRAR

    modal
        .querySelector(
            ".modal-alojamiento-cerrar"
        )
        .addEventListener(
            "click",
            cerrarModalAlojamiento
        );


    // CERRAR AL HACER CLICK FUERA

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                cerrarModalAlojamiento();
            }

        }
    );


    // FLECHA IZQUIERDA

    modal
        .querySelector(
            ".modal-alojamiento-flecha.izquierda"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                cambiarFotoModal(-1);

            }
        );


    // FLECHA DERECHA

    modal
        .querySelector(
            ".modal-alojamiento-flecha.derecha"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                cambiarFotoModal(1);

            }
        );


    // RESERVA

    document
        .getElementById(
            "btnSolicitarReserva"
        )
        .addEventListener(
            "click",
            function() {

                const alojamiento =
                    alojamientoActual;

                cerrarModalAlojamiento();

                setTimeout(
                    function() {

                        if (
                            typeof abrirReserva ===
                            "function"
                        ) {
                            abrirReserva(
                                alojamiento
                            );
                        }

                    },
                    200
                );

            }
        );
}


// ==========================================================
// ABRIR MODAL ALOJAMIENTO
// ==========================================================

function abrirModalAlojamiento(
    alojamiento,
    fotos
) {

    alojamientoActual =
        alojamiento;

    fotosAlojamientoActual =
        Array.isArray(fotos)
            ? fotos
            : [];

    indiceFotoActual = 0;


    const nombre =
        document.getElementById(
            "modalAlojamientoNombre"
        );

    const ubicacion =
        document.getElementById(
            "modalAlojamientoUbicacion"
        );

    const descripcion =
        document.getElementById(
            "modalAlojamientoDescripcion"
        );

    const datos =
        document.getElementById(
            "modalAlojamientoDatos"
        );

    const amenidades =
        document.getElementById(
            "modalAlojamientoAmenidades"
        );

    const precio =
        document.getElementById(
            "modalAlojamientoPrecio"
        );


    if (nombre) {

        nombre.textContent =
            alojamiento.nombre ||
            "Alojamiento";

    }


    if (ubicacion) {

        if (alojamiento.ubicacion) {

            ubicacion.innerHTML =
                `📍 ${escapeHTML(
                    alojamiento.ubicacion
                )}`;

        } else {

            ubicacion.innerHTML =
                "";

        }

    }


    if (descripcion) {

        descripcion.textContent =
            alojamiento.descripcion ||
            "Sin descripción disponible.";

    }


    if (datos) {

        datos.innerHTML = `

            <div>
                👥
                Hasta
                ${alojamiento.max_huespedes || 0}
                personas
            </div>

            <div>
                🛏️
                ${alojamiento.habitaciones || 0}
                habitaciones
            </div>

            <div>
                🛌
                ${alojamiento.camas || 0}
                camas
            </div>

            <div>
                🛋️
                ${alojamiento.sofa_camas || 0}
                sofá cama
            </div>

            <div>
                🚿
                ${alojamiento.banos || 0}
                baños
            </div>

        `;

    }


    if (amenidades) {

        amenidades.innerHTML =
            construirAmenidadesHTML(
                alojamiento.amenidades
            );

    }


    if (precio) {

        const precioBase =
            Number(
                alojamiento.precio_base
            ) || 0;

        precio.innerHTML =
            `Q${precioBase.toFixed(2)} por noche`;

    }


    mostrarFotosModal();


    const modal =
        document.getElementById(
            "modalAlojamiento"
        );

    if (modal) {

        modal.classList.add(
            "visible"
        );

        modal.style.display =
            "flex";

    }


    document.body.classList.add(
        "sin-scroll"
    );
}


// ==========================================================
// CERRAR MODAL ALOJAMIENTO
// ==========================================================

function cerrarModalAlojamiento() {

    const modal =
        document.getElementById(
            "modalAlojamiento"
        );

    if (modal) {

        modal.classList.remove(
            "visible"
        );

        modal.style.display =
            "none";

    }

    document.body.classList.remove(
        "sin-scroll"
    );
}


// ==========================================================
// MOSTRAR FOTOS DEL MODAL
// ==========================================================

function mostrarFotosModal() {

    const contenedor =
        document.querySelector(
            ".modal-alojamiento-fotos"
        );

    const contador =
        document.querySelector(
            ".modal-alojamiento-contador"
        );

    if (!contenedor) {
        return;
    }


    if (
        !fotosAlojamientoActual.length
    ) {

        contenedor.innerHTML = `
            <div
                style="
                    color:white;
                    text-align:center;
                "
            >
                Sin fotografías disponibles
            </div>
        `;

        if (contador) {
            contador.textContent =
                "0 / 0";
        }

        return;
    }


    const url =
        fotosAlojamientoActual[
            indiceFotoActual
        ];


    contenedor.innerHTML = `
        <img
            src="${url}"
            alt="Fotografía del alojamiento"
        >
    `;


    if (contador) {

        contador.textContent =
            `${indiceFotoActual + 1} / ${fotosAlojamientoActual.length}`;

    }


    const imagen =
        contenedor.querySelector(
            "img"
        );

    if (imagen) {

        imagen.addEventListener(
            "click",
            function() {

                abrirVisorFotos();

            }
        );

    }
}


// ==========================================================
// CAMBIAR FOTO DEL MODAL
// ==========================================================

function cambiarFotoModal(
    direccion
) {

    if (
        !fotosAlojamientoActual.length
    ) {
        return;
    }

    indiceFotoActual +=
        direccion;


    if (
        indiceFotoActual < 0
    ) {

        indiceFotoActual =
            fotosAlojamientoActual.length - 1;

    }


    if (
        indiceFotoActual >=
        fotosAlojamientoActual.length
    ) {

        indiceFotoActual = 0;

    }


    mostrarFotosModal();


    if (
        document
            .getElementById(
                "visorFotos"
            )
            ?.classList.contains(
                "visible"
            )
    ) {

        actualizarVisorFoto();

    }
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
        return;
    }


    const visor =
        document.createElement("div");

    visor.id =
        "visorFotos";


    visor.innerHTML = `

        <button
            type="button"
            class="visor-fotos-cerrar"
            aria-label="Cerrar"
        >
            ×
        </button>

        <button
            type="button"
            class="visor-fotos-flecha izquierda"
            aria-label="Fotografía anterior"
        >
            ‹
        </button>

        <img
            id="imagenVisorFotos"
            src=""
            alt="Fotografía del alojamiento"
        >

        <button
            type="button"
            class="visor-fotos-flecha derecha"
            aria-label="Fotografía siguiente"
        >
            ›
        </button>

        <div id="visorContadorFotos">
            0 / 0
        </div>

    `;


    document.body.appendChild(
        visor
    );


    visor
        .querySelector(
            ".visor-fotos-cerrar"
        )
        .addEventListener(
            "click",
            cerrarVisorFotos
        );


    visor
        .querySelector(
            ".visor-fotos-flecha.izquierda"
        )
        .addEventListener(
            "click",
            function() {

                cambiarFotoVisor(-1);

            }
        );


    visor
        .querySelector(
            ".visor-fotos-flecha.derecha"
        )
        .addEventListener(
            "click",
            function() {

                cambiarFotoVisor(1);

            }
        );


    visor.addEventListener(
        "click",
        function(event) {

            if (
                event.target === visor
            ) {

                cerrarVisorFotos();

            }

        }
    );


    // SWIPE DEL VISOR

    let inicioX = 0;

    let finX = 0;


    visor.addEventListener(
        "touchstart",
        function(event) {

            if (
                event.touches.length
            ) {

                inicioX =
                    event.touches[0].clientX;

            }

        },
        {
            passive: true
        }
    );


    visor.addEventListener(
        "touchend",
        function(event) {

            if (
                event.changedTouches.length
            ) {

                finX =
                    event.changedTouches[0].clientX;

                const diferencia =
                    finX - inicioX;


                if (
                    Math.abs(diferencia) > 50
                ) {

                    if (
                        diferencia < 0
                    ) {

                        cambiarFotoVisor(1);

                    } else {

                        cambiarFotoVisor(-1);

                    }

                }

            }

        },
        {
            passive: true
        }
    );
}


// ==========================================================
// ABRIR VISOR
// ==========================================================

function abrirVisorFotos() {

    if (
        !fotosAlojamientoActual.length
    ) {
        return;
    }


    const visor =
        document.getElementById(
            "visorFotos"
        );

    if (!visor) {
        return;
    }


    visor.classList.add(
        "visible"
    );


    actualizarVisorFoto();

}


// ==========================================================
// ACTUALIZAR VISOR
// ==========================================================

function actualizarVisorFoto() {

    const imagen =
        document.getElementById(
            "imagenVisorFotos"
        );

    const contador =
        document.getElementById(
            "visorContadorFotos"
        );


    if (
        !imagen ||
        !fotosAlojamientoActual.length
    ) {
        return;
    }


    imagen.src =
        fotosAlojamientoActual[
            indiceFotoActual
        ];


    if (contador) {

        contador.textContent =
            `${indiceFotoActual + 1} / ${fotosAlojamientoActual.length}`;

    }
}


// ==========================================================
// CAMBIAR FOTO DEL VISOR
// ==========================================================

function cambiarFotoVisor(
    direccion
) {

    if (
        !fotosAlojamientoActual.length
    ) {
        return;
    }


    indiceFotoActual +=
        direccion;


    if (
        indiceFotoActual < 0
    ) {

        indiceFotoActual =
            fotosAlojamientoActual.length - 1;

    }


    if (
        indiceFotoActual >=
        fotosAlojamientoActual.length
    ) {

        indiceFotoActual = 0;

    }


    mostrarFotosModal();

    actualizarVisorFoto();
}


// ==========================================================
// CERRAR VISOR
// ==========================================================

function cerrarVisorFotos() {

    const visor =
        document.getElementById(
            "visorFotos"
        );

    if (visor) {

        visor.classList.remove(
            "visible"
        );

    }
}


// ==========================================================
// OBTENER FOTOS DE UN ALOJAMIENTO
// ==========================================================

async function obtenerFotosAlojamiento(
    id
) {

    try {

        const respuesta =
            await clienteSupabase
                .storage
                .from(
                    "fotos-alojamientos"
                )
                .list(
                    String(id),
                    {
                        limit: 100,
                        sortBy: {
                            column: "name",
                            order: "asc"
                        }
                    }
                );


        const archivos =
            respuesta.data;

        const error =
            respuesta.error;


        if (error) {

            console.error(
                "Error obteniendo fotografías:",
                error
            );

            return [];

        }


        if (
            !archivos ||
            !archivos.length
        ) {

            return [];

        }


        const imagenes =
            archivos.filter(
                archivo => {

                    const nombre =
                        archivo.name
                            .toLowerCase();

                    return extensionesImagen.some(
                        extension =>
                            nombre.endsWith(
                                extension
                            )
                    );

                }
            );


        return imagenes.map(
            archivo => {

                const resultado =
                    clienteSupabase
                        .storage
                        .from(
                            "fotos-alojamientos"
                        )
                        .getPublicUrl(
                            `${id}/${archivo.name}`
                        );


                return resultado
                    .data
                    .publicUrl;

            }
        );

    } catch (error) {

        console.error(
            "Error inesperado obteniendo fotos:",
            error
        );

        return [];

    }
}


// ==========================================================
// CREAR TARJETA DE ALOJAMIENTO
// ==========================================================

function crearTarjetaAlojamiento(
    alojamiento,
    fotos
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "alojamiento";


    const fotosSeguras =
        Array.isArray(fotos)
            ? fotos
            : [];


    const id =
        alojamiento.id;


    fotosTarjetas[id] = 0;


    let indiceFoto = 0;


    tarjeta.innerHTML = `

        <div
            class="galeria-alojamiento"
            tabindex="0"
        >

            ${
                fotosSeguras.length
                ?
                `
                    <img
                        class="foto-principal"
                        src="${fotosSeguras[0]}"
                        alt="${escapeHTML(
                            alojamiento.nombre ||
                            "Alojamiento"
                        )}"
                    >
                `
                :
                `
                    <div class="sin-foto-tarjeta">
                        Sin fotografías
                    </div>
                `
            }

            ${
                fotosSeguras.length > 1
                ?
                `
                    <button
                        type="button"
                        class="flecha-foto-tarjeta izquierda"
                        aria-label="Fotografía anterior"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        class="flecha-foto-tarjeta derecha"
                        aria-label="Fotografía siguiente"
                    >
                        ›
                    </button>

                    <div class="puntos-fotos-tarjeta">

                        ${fotosSeguras.map(
                            (_, indice) => `
                                <span
                                    class="
                                        punto-foto-tarjeta
                                        ${indice === 0 ? "activo" : ""}
                                    "
                                ></span>
                            `
                        ).join("")}

                    </div>
                `
                :
                ""
            }

            ${
                fotosSeguras.length
                ?
                `
                    <div class="contador-fotos">
                        1 / ${fotosSeguras.length}
                    </div>
                `
                :
                ""
            }

        </div>


        <div class="info-tarjeta-alojamiento">

            <h3 class="nombre-alojamiento">
                ${escapeHTML(
                    alojamiento.nombre ||
                    "Alojamiento"
                )}
            </h3>


            ${
                alojamiento.ubicacion
                ?
                `
                    <div class="ubicacion-tarjeta">
                        📍
                        ${escapeHTML(
                            alojamiento.ubicacion
                        )}
                    </div>
                `
                :
                ""
            }


            <p class="descripcion-tarjeta">
                ${escapeHTML(
                    alojamiento.descripcion ||
                    "Sin descripción disponible."
                )}
            </p>


            <div class="datos-rapidos-tarjeta">

                <span class="dato-rapido-tarjeta">
                    👥
                    Hasta
                    ${alojamiento.max_huespedes || 0}
                    personas
                </span>

                <span class="dato-rapido-tarjeta">
                    🛏️
                    ${alojamiento.habitaciones || 0}
                    habitaciones
                </span>

                <span class="dato-rapido-tarjeta">
                    🚿
                    ${alojamiento.banos || 0}
                    baños
                </span>

            </div>


            <div class="pie-tarjeta-alojamiento">

                <div class="precio-tarjeta-alojamiento">

                    Q${(
                        Number(
                            alojamiento.precio_base
                        ) || 0
                    ).toFixed(2)}

                    <small>
                        / noche
                    </small>

                </div>


                <button
                    type="button"
                    class="btn-ver-alojamiento"
                >
                    Ver alojamiento
                </button>

            </div>

        </div>
    `;


    // ======================================================
    // FUNCIÓN PARA ACTUALIZAR FOTO
    // ======================================================

    function actualizarFotoTarjeta() {

        if (
            !fotosSeguras.length
        ) {
            return;
        }


        const imagen =
            tarjeta.querySelector(
                ".foto-principal"
            );


        if (imagen) {

            imagen.src =
                fotosSeguras[
                    indiceFoto
                ];

        }


        const contador =
            tarjeta.querySelector(
                ".contador-fotos"
            );


        if (contador) {

            contador.textContent =
                `${indiceFoto + 1} / ${fotosSeguras.length}`;

        }


        const puntos =
            tarjeta.querySelectorAll(
                ".punto-foto-tarjeta"
            );


        puntos.forEach(
            (punto, indice) => {

                punto.classList.toggle(
                    "activo",
                    indice === indiceFoto
                );

            }
        );

    }


    // ======================================================
    // FLECHAS
    // ======================================================

    const flechaIzquierda =
        tarjeta.querySelector(
            ".flecha-foto-tarjeta.izquierda"
        );


    const flechaDerecha =
        tarjeta.querySelector(
            ".flecha-foto-tarjeta.derecha"
        );


    if (flechaIzquierda) {

        flechaIzquierda.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                indiceFoto--;

                if (
                    indiceFoto < 0
                ) {

                    indiceFoto =
                        fotosSeguras.length - 1;

                }

                actualizarFotoTarjeta();

            }
        );

    }


    if (flechaDerecha) {

        flechaDerecha.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                indiceFoto++;

                if (
                    indiceFoto >=
                    fotosSeguras.length
                ) {

                    indiceFoto = 0;

                }

                actualizarFotoTarjeta();

            }
        );

    }


    // ======================================================
    // CLICK EN TARJETA
    // ======================================================

    function abrirDetalle() {

        abrirModalAlojamiento(
            alojamiento,
            fotosSeguras
        );

    }


    tarjeta
        .querySelector(
            ".galeria-alojamiento"
        )
        .addEventListener(
            "click",
            abrirDetalle
        );


    tarjeta
        .querySelector(
            ".nombre-alojamiento"
        )
        .addEventListener(
            "click",
            abrirDetalle
        );


    tarjeta
        .querySelector(
            ".info-tarjeta-alojamiento"
        )
        .addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(
                        "button"
                    )
                ) {
                    return;
                }

                abrirDetalle();

            }
        );


    tarjeta
        .querySelector(
            ".btn-ver-alojamiento"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                abrirDetalle();

            }
        );


    // ======================================================
    // TECLADO
    // ======================================================

    const galeria =
        tarjeta.querySelector(
            ".galeria-alojamiento"
        );


    if (galeria) {

        galeria.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    abrirDetalle();

                }

            }
        );

    }


    return tarjeta;
}


// ==========================================================
// CARGAR ALOJAMIENTOS
// ==========================================================

async function cargarAlojamientos() {

    const contenedor =
        document.getElementById(
            "listaAlojamientos"
        );


    if (!contenedor) {

        console.error(
            "No se encontró #listaAlojamientos"
        );

        return;

    }


    contenedor.innerHTML = `
        <p style="
            grid-column:1/-1;
            text-align:center;
            color:#777;
        ">
            Cargando alojamientos...
        </p>
    `;


    try {

        const respuesta =
            await clienteSupabase
                .from("alojamientos")
                .select("*")
                .eq(
                    "publicado",
                    true
                );


        const data =
            respuesta.data;


        const error =
            respuesta.error;


        if (error) {

            console.error(
                "=========================================="
            );

            console.error(
                "ERROR DE SUPABASE AL CARGAR ALOJAMIENTOS"
            );

            console.error(
                "Mensaje:",
                error.message
            );

            console.error(
                "Detalles:",
                error.details
            );

            console.error(
                "Código:",
                error.code
            );

            console.error(
                "=========================================="
            );


            contenedor.innerHTML = `
                <p style="
                    grid-column:1/-1;
                    text-align:center;
                    color:#777;
                ">
                    No fue posible cargar los alojamientos.
                </p>
            `;

            return;

        }


        contenedor.innerHTML = "";


        if (
            !data ||
            !data.length
        ) {

            contenedor.innerHTML = `
                <p style="
                    grid-column:1/-1;
                    text-align:center;
                    color:#777;
                ">
                    Actualmente no hay alojamientos publicados.
                </p>
            `;

            console.log(
                "No hay alojamientos publicados."
            );

            return;

        }


        console.log(
            "Alojamientos encontrados:",
            data.length
        );


        for (
            const alojamiento of data
        ) {

            try {

                const fotos =
                    await obtenerFotosAlojamiento(
                        alojamiento.id
                    );


                const tarjeta =
                    crearTarjetaAlojamiento(
                        alojamiento,
                        fotos
                    );


                contenedor.appendChild(
                    tarjeta
                );

            } catch (errorTarjeta) {

                console.error(
                    "Error creando tarjeta:",
                    alojamiento,
                    errorTarjeta
                );

            }

        }

    } catch (error) {

        console.error(
            "ERROR INESPERADO EN cargarAlojamientos:",
            error
        );


        contenedor.innerHTML = `
            <p style="
                grid-column:1/-1;
                text-align:center;
                color:#777;
            ">
                Ocurrió un error al cargar los alojamientos.
            </p>
        `;

    }
}


// ==========================================================
// PORTADA
// ==========================================================

async function cargarPortada() {

    try {

        const respuesta =
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


        const archivos =
            respuesta.data;


        const error =
            respuesta.error;


        if (error) {

            console.error(
                "Error cargando portada:",
                error
            );

            return;

        }


        if (
            !archivos ||
            !archivos.length
        ) {

            console.log(
                "No hay fotografías en portada."
            );

            return;

        }


        fotosPortada =
            archivos
                .filter(
                    archivo => {

                        const nombre =
                            archivo.name
                                .toLowerCase();

                        return extensionesImagen.some(
                            extension =>
                                nombre.endsWith(
                                    extension
                                )
                        );

                    }
                )
                .map(
                    archivo => {

                        return clienteSupabase
                            .storage
                            .from(
                                "fotos-alojamientos"
                            )
                            .getPublicUrl(
                                `portada/${archivo.name}`
                            )
                            .data
                            .publicUrl;

                    }
                );


        if (
            !fotosPortada.length
        ) {

            return;

        }


        indicePortada = 0;


        const fondoA =
            document.querySelector(
                ".portada-fondo-a"
            );


        const fondoB =
            document.querySelector(
                ".portada-fondo-b"
            );


        if (!fondoA) {

            console.warn(
                "No se encontró .portada-fondo-a"
            );

            return;

        }


        fondoA.style.backgroundImage =
            `url("${fotosPortada[0]}")`;


        fondoA.style.opacity =
            "1";


        if (fondoB) {

            fondoB.style.backgroundImage =
                `url("${fotosPortada[0]}")`;

            fondoB.style.opacity =
                "0";

        }


        if (
            fotosPortada.length > 1
        ) {

            intervaloPortada =
                setInterval(
                    cambiarFotoPortada,
                    5000
                );

        }

    } catch (error) {

        console.error(
            "Error inesperado cargando portada:",
            error
        );

    }
}


// ==========================================================
// CAMBIAR FOTO PORTADA
// ==========================================================

function cambiarFotoPortada() {

    if (
        fotosPortada.length <= 1
    ) {
        return;
    }


    const fondoA =
        document.querySelector(
            ".portada-fondo-a"
        );


    const fondoB =
        document.querySelector(
            ".portada-fondo-b"
        );


    if (
        !fondoA ||
        !fondoB
    ) {
        return;
    }


    indicePortada =
        (indicePortada + 1) %
        fotosPortada.length;


    const siguiente =
        fotosPortada[
            indicePortada
        ];


    const opacidadA =
        parseFloat(
            getComputedStyle(
                fondoA
            ).opacity
        );


    if (
        opacidadA > 0.5
    ) {

        fondoB.style.backgroundImage =
            `url("${siguiente}")`;

        fondoB.style.opacity =
            "1";

        fondoA.style.opacity =
            "0";

    } else {

        fondoA.style.backgroundImage =
            `url("${siguiente}")`;

        fondoA.style.opacity =
            "1";

        fondoB.style.opacity =
            "0";

    }
}


// ==========================================================
// CONFIGURAR SWIPE DE FOTOS DEL MODAL
// ==========================================================

function configurarSwipeFotos() {

    const galeria =
        document.querySelector(
            ".modal-alojamiento-galeria"
        );


    if (!galeria) {
        return;
    }


    let inicioX = 0;

    let finX = 0;


    galeria.addEventListener(
        "touchstart",
        function(event) {

            if (
                event.touches.length
            ) {

                inicioX =
                    event.touches[0].clientX;

            }

        },
        {
            passive: true
        }
    );


    galeria.addEventListener(
        "touchend",
        function(event) {

            if (
                event.changedTouches.length
            ) {

                finX =
                    event.changedTouches[0].clientX;


                const diferencia =
                    finX - inicioX;


                if (
                    Math.abs(diferencia) > 50
                ) {

                    if (
                        diferencia < 0
                    ) {

                        cambiarFotoModal(1);

                    } else {

                        cambiarFotoModal(-1);

                    }

                }

            }

        },
        {
            passive: true
        }
    );
}


// ==========================================================
// ABRIR RESERVA
// ==========================================================

function abrirReserva(
    alojamiento
) {

    if (!alojamiento) {
        return;
    }


    alojamientoActual =
        alojamiento;


    const modal =
        document.getElementById(
            "modalReserva"
        );


    if (!modal) {

        console.error(
            "No se encontró #modalReserva"
        );

        return;

    }


    // ======================================================
    // NOMBRE
    // ======================================================

    const nombre =
        document.getElementById(
            "nombreAlojamientoReserva"
        );


    if (nombre) {

        nombre.textContent =
            alojamiento.nombre ||
            "Alojamiento";

    }


    // ======================================================
    // PRECIO
    // ======================================================

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
        ) || 1;


    const maxHuespedes =
        Number(
            alojamiento.max_huespedes
        ) || 1;


    const precioInput =
        document.getElementById(
            "precioBaseReserva"
        );


    if (precioInput) {

        precioInput.value =
            precioBase;

    }


    const precioPersonaInput =
        document.getElementById(
            "precioPersonaReserva"
        );


    if (precioPersonaInput) {

        precioPersonaInput.value =
            precioPersona;

    }


    // ======================================================
    // HUÉSPEDES
    // ======================================================

    const personas =
        document.getElementById(
            "personasReserva"
        );


    if (personas) {

        personas.value = "1";

        personas.min = "1";

        personas.max = "50";

    }


    crearZonaAdvertenciaHuespedes();


    actualizarAdvertenciaHuespedes();


    // ======================================================
    // FECHAS
    // ======================================================

    fechaEntradaSeleccionada =
        null;

    fechaSalidaSeleccionada =
        null;

    fechaCalendarioActiva =
        null;


    calendarioMes =
        new Date();


    calendarioMes.setDate(1);


    // ======================================================
    // CAMPOS
    // ======================================================

    const nombreCliente =
        document.getElementById(
            "nombreCliente"
        );


    if (nombreCliente) {
        nombreCliente.value = "";
    }


    const telefonoCliente =
        document.getElementById(
            "telefonoCliente"
        );


    if (telefonoCliente) {
        telefonoCliente.value = "";
    }


    const resumen =
        document.getElementById(
            "resumenReserva"
        );


    if (resumen) {
        resumen.innerHTML = "";
    }


    // ======================================================
    // CALENDARIO
    // ======================================================

    renderizarCalendario();


    // ======================================================
    // MODAL
    // ======================================================

    modal.classList.add(
        "visible"
    );

    modal.style.display =
        "flex";


    document.body.classList.add(
        "sin-scroll"
    );


    // ======================================================
    // RECALCULAR
    // ======================================================

    calcularPrecioReserva();

}


// ==========================================================
// CONFIGURAR RESERVA
// ==========================================================

function configurarReserva() {

    const modal =
        document.getElementById(
            "modalReserva"
        );


    if (!modal) {
        return;
    }


    const cerrar =
        modal.querySelector(
            ".cerrar-modal"
        );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarReserva
        );

    }


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                cerrarReserva();

            }

        }
    );


    const personas =
        document.getElementById(
            "personasReserva"
        );


    if (personas) {

        personas.addEventListener(
            "input",
            function() {

                actualizarAdvertenciaHuespedes();

                calcularPrecioReserva();

            }
        );

        personas.addEventListener(
            "change",
            function() {

                actualizarAdvertenciaHuespedes();

                calcularPrecioReserva();

            }
        );

    }


    const btnWhatsApp =
        document.getElementById(
            "btnEnviarWhatsApp"
        );


    if (btnWhatsApp) {

        btnWhatsApp.addEventListener(
            "click",
            enviarWhatsApp
        );

    }


    const mesAnterior =
        document.getElementById(
            "mesAnterior"
        );


    const mesSiguiente =
        document.getElementById(
            "mesSiguiente"
        );


    if (mesAnterior) {

        mesAnterior.addEventListener(
            "click",
            function() {

                calendarioMes.setMonth(
                    calendarioMes.getMonth() - 1
                );

                renderizarCalendario();

            }
        );

    }


    if (mesSiguiente) {

        mesSiguiente.addEventListener(
            "click",
            function() {

                calendarioMes.setMonth(
                    calendarioMes.getMonth() + 1
                );

                renderizarCalendario();

            }
        );

    }

}


// ==========================================================
// CERRAR RESERVA
// ==========================================================

function cerrarReserva() {

    const modal =
        document.getElementById(
            "modalReserva"
        );


    if (modal) {

        modal.classList.remove(
            "visible"
        );

        modal.style.display =
            "none";

    }


    document.body.classList.remove(
        "sin-scroll"
    );

}


// ==========================================================
// CREAR ZONA ADVERTENCIA HUÉSPEDES
// ==========================================================

function crearZonaAdvertenciaHuespedes() {

    const personas =
        document.getElementById(
            "personasReserva"
        );


    if (!personas) {
        return;
    }


    let zona =
        document.getElementById(
            "advertenciaHuespedes"
        );


    if (zona) {
        return;
    }


    zona =
        document.createElement(
            "div"
        );


    zona.id =
        "advertenciaHuespedes";


    zona.className =
        "advertencia-huespedes";


    zona.style.display =
        "none";


    zona.innerHTML = `

        <label>

            <input
                type="checkbox"
                id="aceptoExcesoHuespedes"
            >

            <span>
                Soy consciente de que la cantidad de
                huéspedes supera la capacidad máxima
                indicada para este alojamiento y deseo
                enviar la solicitud de todas formas.
            </span>

        </label>

    `;


    personas.parentElement.appendChild(
        zona
    );


    const checkbox =
        document.getElementById(
            "aceptoExcesoHuespedes"
        );


    if (checkbox) {

        checkbox.addEventListener(
            "change",
            calcularPrecioReserva
        );

    }
}


// ==========================================================
// ACTUALIZAR ADVERTENCIA HUÉSPEDES
// ==========================================================

function actualizarAdvertenciaHuespedes() {

    const zona =
        document.getElementById(
            "advertenciaHuespedes"
        );


    const checkbox =
        document.getElementById(
            "aceptoExcesoHuespedes"
        );


    const personas =
        document.getElementById(
            "personasReserva"
        );


    if (
        !zona ||
        !personas ||
        !alojamientoActual
    ) {
        return;
    }


    const cantidad =
        Number(
            personas.value
        ) || 0;


    const maximo =
        Number(
            alojamientoActual.max_huespedes
        ) || 0;


    if (
        cantidad > maximo &&
        maximo > 0
    ) {

        zona.style.display =
            "block";

    } else {

        zona.style.display =
            "none";

        if (checkbox) {
            checkbox.checked =
                false;
        }

    }

}


// ==========================================================
// VALIDAR HUÉSPEDES
// ==========================================================

function validarHuespedes() {

    if (!alojamientoActual) {
        return true;
    }


    const personas =
        document.getElementById(
            "personasReserva"
        );


    if (!personas) {
        return true;
    }


    const cantidad =
        Number(
            personas.value
        ) || 0;


    const maximo =
        Number(
            alojamientoActual.max_huespedes
        ) || 0;


    if (
        maximo <= 0
    ) {
        return true;
    }


    if (
        cantidad <= maximo
    ) {
        return true;
    }


    const checkbox =
        document.getElementById(
            "aceptoExcesoHuespedes"
        );


    if (
        !checkbox ||
        !checkbox.checked
    ) {

        alert(
            "La cantidad de huéspedes supera el máximo permitido. Debes aceptar la condición indicada para continuar."
        );

        return false;

    }


    return true;
}


// ==========================================================
// CALCULAR PRECIO
// ==========================================================

function calcularPrecioReserva() {

    if (!alojamientoActual) {
        return;
    }


    const personas =
        Number(
            document.getElementById(
                "personasReserva"
            )?.value
        ) || 1;


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
        ) || 1;


    const noches =
        calcularNoches();


    const personasAdicionales =
        Math.max(
            personas -
            personasIncluidas,
            0
        );


    const precioPorNoche =
        precioBase +
        (
            personasAdicionales *
            precioPersona
        );


    const total =
        precioPorNoche *
        noches;


    const resumen =
        document.getElementById(
            "resumenReserva"
        );


    if (!resumen) {
        return;
    }


    resumen.innerHTML = `

        <div>
            <strong>
                Alojamiento:
            </strong>
            ${escapeHTML(
                alojamientoActual.nombre ||
                ""
            )}
        </div>

        <div>
            <strong>
                Huéspedes:
            </strong>
            ${personas}
        </div>

        <div>
            <strong>
                Noches:
            </strong>
            ${noches}
        </div>

        <div>
            <strong>
                Precio base:
            </strong>
            Q${precioBase.toFixed(2)}
        </div>

        ${
            personasAdicionales > 0
            ?
            `
                <div>
                    <strong>
                        Personas adicionales:
                    </strong>
                    ${personasAdicionales}
                </div>

                <div>
                    <strong>
                        Cargo adicional:
                    </strong>
                    Q${(
                        personasAdicionales *
                        precioPersona
                    ).toFixed(2)}
                </div>
            `
            :
            ""
        }

        <div>
            <strong>
                Total:
            </strong>
            Q${total.toFixed(2)}
        </div>

    `;

}


// ==========================================================
// CALCULAR NOCHES
// ==========================================================

function calcularNoches() {

    if (
        !fechaEntradaSeleccionada ||
        !fechaSalidaSeleccionada
    ) {

        return 0;

    }


    const entrada =
        new Date(
            fechaEntradaSeleccionada
        );


    const salida =
        new Date(
            fechaSalidaSeleccionada
        );


    const diferencia =
        salida.getTime() -
        entrada.getTime();


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


    return Math.max(
        noches,
        0
    );
}


// ==========================================================
// RENDERIZAR CALENDARIO
// ==========================================================

function renderizarCalendario() {

    const calendario =
        document.getElementById(
            "calendario"
        );


    if (!calendario) {
        return;
    }


    const año =
        calendarioMes.getFullYear();


    const mes =
        calendarioMes.getMonth();


    const primerDia =
        new Date(
            año,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            año,
            mes + 1,
            0
        );


    const diasMes =
        ultimoDia.getDate();


    let inicioSemana =
        primerDia.getDay();


    // Lunes = 0

    inicioSemana =
        inicioSemana === 0
            ? 6
            : inicioSemana - 1;


    const nombreMes =
        calendarioMes.toLocaleDateString(
            "es-GT",
            {
                month: "long",
                year: "numeric"
            }
        );


    const tituloMes =
        document.getElementById(
            "mesCalendario"
        );


    if (tituloMes) {

        tituloMes.textContent =
            nombreMes
                .charAt(0)
                .toUpperCase() +
            nombreMes.slice(1);

    }


    let html = `

        <div class="dias-semana">

            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
            <div>Dom</div>

        </div>

        <div class="dias-calendario">

    `;


    for (
        let i = 0;
        i < inicioSemana;
        i++
    ) {

        html += `
            <div class="dia-calendario vacio"></div>
        `;

    }


    const hoy =
        new Date();


    hoy.setHours(
        0,
        0,
        0,
        0
    );


    for (
        let dia = 1;
        dia <= diasMes;
        dia++
    ) {

        const fecha =
            new Date(
                año,
                mes,
                dia
            );


        fecha.setHours(
            0,
            0,
            0,
            0
        );


        const fechaString =
            formatearFecha(
                fecha
            );


        const esPasada =
            fecha < hoy;


        let clases =
            "dia-calendario";


        if (esPasada) {

            clases +=
                " pasado";

        }


        if (
            fechaEntradaSeleccionada ===
            fechaString
        ) {

            clases +=
                " fecha-entrada";

        }


        if (
            fechaSalidaSeleccionada ===
            fechaString
        ) {

            clases +=
                " fecha-salida";

        }


        if (
            fechaEntradaSeleccionada &&
            fechaSalidaSeleccionada &&
            fechaString >
            fechaEntradaSeleccionada &&
            fechaString <
            fechaSalidaSeleccionada
        ) {

            clases +=
                " rango";

        }


        html += `

            <button
                type="button"
                class="${clases}"
                data-fecha="${fechaString}"
                ${esPasada ? "disabled" : ""}
            >
                ${dia}
            </button>

        `;

    }


    html += `
        </div>
    `;


    calendario.innerHTML =
        html;


    const botones =
        calendario.querySelectorAll(
            ".dia-calendario[data-fecha]"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                function() {

                    seleccionarFecha(
                        boton.dataset.fecha
                    );

                }
            );

        }
    );


    cargarDisponibilidad();

}


// ==========================================================
// SELECCIONAR FECHA
// ==========================================================

function seleccionarFecha(
    fecha
) {

    if (
        !fechaEntradaSeleccionada ||
        (
            fechaEntradaSeleccionada &&
            fechaSalidaSeleccionada
        )
    ) {

        fechaEntradaSeleccionada =
            fecha;

        fechaSalidaSeleccionada =
            null;

    } else {

        if (
            fecha <=
            fechaEntradaSeleccionada
        ) {

            fechaEntradaSeleccionada =
                fecha;

            fechaSalidaSeleccionada =
                null;

        } else {

            fechaSalidaSeleccionada =
                fecha;

        }

    }


    calcularPrecioReserva();

    renderizarCalendario();

}


// ==========================================================
// FORMATEAR FECHA
// ==========================================================

function formatearFecha(
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


    return `${año}-${mes}-${dia}`;
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

        const respuesta =
            await clienteSupabase.functions.invoke(
                "obtener-disponibilidad",
                {
                    body: {
                        alojamiento_id:
                            alojamientoActual.id
                    }
                }
            );


        if (
            respuesta.error
        ) {

            console.error(
                "Error obteniendo disponibilidad:",
                respuesta.error
            );

            return;

        }


        const bloqueadas =
            respuesta.data?.blocked ||
            [];


        const botones =
            document.querySelectorAll(
                ".dia-calendario[data-fecha]"
            );


        botones.forEach(
            boton => {

                const fecha =
                    boton.dataset.fecha;


                if (
                    bloqueadas.includes(
                        fecha
                    )
                ) {

                    boton.disabled =
                        true;

                    boton.classList.add(
                        "bloqueado"
                    );

                    boton.title =
                        "Fecha no disponible";

                }

            }
        );


    } catch (error) {

        console.error(
            "Error inesperado cargando disponibilidad:",
            error
        );

    }
}


// ==========================================================
// VERIFICAR DISPONIBILIDAD
// ==========================================================

async function verificarDisponibilidad() {

    if (
        !alojamientoActual ||
        !fechaEntradaSeleccionada ||
        !fechaSalidaSeleccionada
    ) {

        return true;

    }


    try {

        const respuesta =
            await clienteSupabase.functions.invoke(
                "obtener-disponibilidad",
                {
                    body: {
                        alojamiento_id:
                            alojamientoActual.id
                    }
                }
            );


        if (
            respuesta.error
        ) {

            console.error(
                "Error verificando disponibilidad:",
                respuesta.error
            );

            return true;

        }


        const bloqueadas =
            respuesta.data?.blocked ||
            [];


        const inicio =
            new Date(
                fechaEntradaSeleccionada
            );


        const fin =
            new Date(
                fechaSalidaSeleccionada
            );


        let fechaActual =
            new Date(inicio);


        while (
            fechaActual < fin
        ) {

            const fecha =
                formatearFecha(
                    fechaActual
                );


            if (
                bloqueadas.includes(
                    fecha
                )
            ) {

                return false;

            }


            fechaActual.setDate(
                fechaActual.getDate() + 1
            );

        }


        return true;

    } catch (error) {

        console.error(
            "Error verificando disponibilidad:",
            error
        );

        return true;

    }
}


// ==========================================================
// ENVIAR WHATSAPP
// ==========================================================

async function enviarWhatsApp() {

    if (!alojamientoActual) {

        alert(
            "No se encontró el alojamiento."
        );

        return;

    }


    // ======================================================
    // HUÉSPEDES
    // ======================================================

    if (
        !validarHuespedes()
    ) {
        return;
    }


    // ======================================================
    // NOMBRE
    // ======================================================

    const nombre =
        document.getElementById(
            "nombreCliente"
        )?.value.trim();


    if (!nombre) {

        alert(
            "Por favor, ingresa tu nombre."
        );

        return;

    }


    // ======================================================
    // TELÉFONO
    // ======================================================

    const telefono =
        document.getElementById(
            "telefonoCliente"
        )?.value.trim();


    if (!telefono) {

        alert(
            "Por favor, ingresa tu número de teléfono."
        );

        return;

    }


    // ======================================================
    // FECHAS
    // ======================================================

    if (
        !fechaEntradaSeleccionada ||
        !fechaSalidaSeleccionada
    ) {

        alert(
            "Selecciona la fecha de entrada y salida."
        );

        return;

    }


    const noches =
        calcularNoches();


    if (
        noches <= 0
    ) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de entrada."
        );

        return;

    }


    // ======================================================
    // DISPONIBILIDAD
    // ======================================================

    const disponible =
        await verificarDisponibilidad();


    if (!disponible) {

        alert(
            "Lo sentimos, una o más de las fechas seleccionadas ya no están disponibles."
        );

        renderizarCalendario();

        return;

    }


    // ======================================================
    // HUÉSPEDES
    // ======================================================

    const personas =
        Number(
            document.getElementById(
                "personasReserva"
            )?.value
        ) || 1;


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
        ) || 1;


    const personasAdicionales =
        Math.max(
            personas -
            personasIncluidas,
            0
        );


    const cargoAdicional =
        personasAdicionales *
        precioPersona;


    const precioPorNoche =
        precioBase +
        cargoAdicional;


    const total =
        precioPorNoche *
        noches;


    // ======================================================
    // MENSAJE
    // ======================================================

    let mensaje =
        "Hola, quiero solicitar una reserva.%0A%0A";


    mensaje +=
        `🏠 Alojamiento: ${encodeURIComponent(
            alojamientoActual.nombre || ""
        )}%0A`;


    if (
        alojamientoActual.ubicacion
    ) {

        mensaje +=
            `📍 Ubicación: ${encodeURIComponent(
                alojamientoActual.ubicacion
            )}%0A`;

    }


    mensaje +=
        `👤 Nombre: ${encodeURIComponent(
            nombre
        )}%0A`;


    mensaje +=
        `📱 Teléfono: ${encodeURIComponent(
            telefono
        )}%0A`;


    mensaje +=
        `📅 Entrada: ${encodeURIComponent(
            fechaEntradaSeleccionada
        )}%0A`;


    mensaje +=
        `📅 Salida: ${encodeURIComponent(
            fechaSalidaSeleccionada
        )}%0A`;


    mensaje +=
        `🌙 Noches: ${noches}%0A`;


    mensaje +=
        `👥 Huéspedes: ${personas}%0A`;


    mensaje +=
        `💰 Precio base por noche: Q${precioBase.toFixed(2)}%0A`;


    if (
        personasAdicionales > 0
    ) {

        mensaje +=
            `➕ Personas adicionales: ${personasAdicionales}%0A`;

        mensaje +=
            `➕ Cargo adicional por noche: Q${cargoAdicional.toFixed(2)}%0A`;

    }


    mensaje +=
        `💵 Total estimado: Q${total.toFixed(2)}%0A%0A`;


    mensaje +=
        "Quedo pendiente de la confirmación de disponibilidad.";


    const numeroWhatsApp =
        "50254134493";


    const url =
        `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;


    window.open(
        url,
        "_blank"
    );

}


// ==========================================================
// CONFIGURAR TECLADO
// ==========================================================

function configurarTeclado() {

    document.addEventListener(
        "keydown",
        function(event) {

            const visor =
                document.getElementById(
                    "visorFotos"
                );


            if (
                visor &&
                visor.classList.contains(
                    "visible"
                )
            ) {

                if (
                    event.key === "Escape"
                ) {

                    cerrarVisorFotos();

                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    cambiarFotoVisor(-1);

                }


                if (
                    event.key === "ArrowRight"
                ) {

                    cambiarFotoVisor(1);

                }


                return;

            }


            const modal =
                document.getElementById(
                    "modalAlojamiento"
                );


            if (
                modal &&
                modal.classList.contains(
                    "visible"
                )
            ) {

                if (
                    event.key === "Escape"
                ) {

                    cerrarModalAlojamiento();

                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    cambiarFotoModal(-1);

                }


                if (
                    event.key === "ArrowRight"
                ) {

                    cambiarFotoModal(1);

                }

            }

        }
    );

}


// ==========================================================
// INICIAR
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Estancias Agradables iniciando..."
        );


        // ESTILOS

        insertarEstilosJavascript();


        // MODALES

        crearModalAlojamiento();

        crearVisorFotos();


        // RESERVA

        configurarReserva();


        // TECLADO

        configurarTeclado();


        // SWIPE

        configurarSwipeFotos();


        // PORTADA

        await cargarPortada();


        // ALOJAMIENTOS

        await cargarAlojamientos();


        console.log(
            "Estancias Agradables cargado correctamente."
        );

    }
);
