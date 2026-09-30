// ==========================================================
// ESTANCIAS AGRADABLES - SCRIPT COMPLETO
// Adaptado al estilos.css actual
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


// ==========================================================
// ESTILOS ADICIONALES
// ==========================================================

function insertarEstilosJavascript() {

    if (document.getElementById("estilos-js-estancias")) {
        return;
    }

    const estilos = document.createElement("style");

    estilos.id = "estilos-js-estancias";

    estilos.textContent = `

        /* ==================================================
           TARJETAS DE ALOJAMIENTOS
           ================================================== */

        .alojamiento {
            position: relative;
            overflow: hidden;
        }

        .alojamiento .galeria-alojamiento {
            position: relative;
        }

        .alojamiento .foto-principal {
            cursor: pointer;
            transition: transform 0.35s ease;
        }

        .alojamiento:hover .foto-principal {
            transform: scale(1.025);
        }

        .alojamiento .nombre-alojamiento {
            border-bottom: 1px solid #eeeeee;
        }

        .info-tarjeta-alojamiento {
            padding: 0 20px 20px 20px;
            background: white;
        }

        .ubicacion-tarjeta {
            margin: 0 0 12px 0;
            color: #666;
            font-size: 14px;
            line-height: 1.4;
        }

        .descripcion-tarjeta {
            margin: 0 0 15px 0;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .datos-rapidos-tarjeta {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-bottom: 18px;
        }

        .dato-rapido-tarjeta {
            padding: 7px 9px;
            border-radius: 8px;
            background: #f5f5f5;
            color: #555;
            font-size: 12px;
            line-height: 1.2;
        }

        .pie-tarjeta-alojamiento {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 10px;
            margin-top: 5px;
        }

        .precio-tarjeta-alojamiento {
            display: flex;
            align-items: baseline;
            gap: 5px;
        }

        .precio-tarjeta-alojamiento strong {
            color: #222;
            font-size: 21px;
        }

        .precio-tarjeta-alojamiento span {
            color: #777;
            font-size: 13px;
        }

        .btn-ver-alojamiento {
            border: none;
            border-radius: 8px;
            padding: 10px 14px;
            background: #f28c28;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition:
                background 0.2s ease,
                transform 0.2s ease;
        }

        .btn-ver-alojamiento:hover {
            background: #d97616;
            transform: translateY(-1px);
        }

        .btn-ver-alojamiento:active {
            transform: scale(0.97);
        }

        .sin-foto-tarjeta {
            width: 100%;
            height: 100%;
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eeeeee;
            color: #777;
            font-size: 14px;
        }

        /* ==================================================
           CONTROLES DE FOTOS DE LA TARJETA
           ================================================== */

        .flecha-foto-tarjeta {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            padding: 0;
            border: none;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.45);
            color: white;
            font-size: 22px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 5;
            opacity: 0;
            transition:
                opacity 0.2s ease,
                background 0.2s ease;
        }

        .galeria-alojamiento:hover .flecha-foto-tarjeta {
            opacity: 1;
        }

        .flecha-foto-tarjeta:hover {
            background: rgba(0, 0, 0, 0.7);
        }

        .flecha-foto-tarjeta.anterior {
            left: 12px;
        }

        .flecha-foto-tarjeta.siguiente {
            right: 12px;
        }

        .puntos-fotos-tarjeta {
            position: absolute;
            left: 50%;
            bottom: 12px;
            transform: translateX(-50%);
            display: flex;
            gap: 5px;
            z-index: 5;
            pointer-events: none;
        }

        .punto-foto-tarjeta {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
            opacity: 0.55;
            box-shadow: 0 1px 3px rgba(0,0,0,0.35);
        }

        .punto-foto-tarjeta.activo {
            opacity: 1;
            transform: scale(1.25);
        }

        /* ==================================================
           MODAL
           ================================================== */

        .modal-alojamiento-fotos {
            width: 100%;
            height: 100%;
        }

        .modal-alojamiento-info {
            min-width: 0;
        }

        .modal-caracteristicas {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .modal-caracteristicas span {
            padding: 11px 13px;
            border-radius: 9px;
            background: #f3f3f3;
            color: #444;
            font-size: 15px;
        }

        .modal-alojamiento-precio {
            margin-top: auto;
            padding-top: 25px;
            padding-bottom: 20px;
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .modal-alojamiento-precio strong {
            font-size: 29px;
            color: #222;
        }

        .modal-alojamiento-precio span {
            color: #777;
            font-size: 14px;
        }

        .btn-solicitar-reserva {
            width: 100%;
            padding: 14px 18px;
            border: none;
            border-radius: 9px;
            background: #222;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition:
                background 0.2s ease,
                transform 0.1s ease;
        }

        .btn-solicitar-reserva:hover {
            background: #444;
        }

        .btn-solicitar-reserva:active {
            transform: scale(0.98);
        }

        /* ==================================================
           ADAPTACIÓN MÓVIL
           ================================================== */

        @media (max-width: 600px) {

            .info-tarjeta-alojamiento {
                padding: 0 17px 17px 17px;
            }

            .pie-tarjeta-alojamiento {
                align-items: center;
            }

            .precio-tarjeta-alojamiento strong {
                font-size: 19px;
            }

            .btn-ver-alojamiento {
                padding: 9px 12px;
                font-size: 13px;
            }

            .flecha-foto-tarjeta {
                opacity: 1;
                width: 34px;
                height: 34px;
            }

            .puntos-fotos-tarjeta {
                bottom: 10px;
            }
        }

    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// AMENIDADES
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

            const resultado = JSON.parse(amenidades);

            if (Array.isArray(resultado)) {
                return resultado;
            }

        } catch (error) {

            return amenidades
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

        }

    }

    return [];
}


function construirAmenidadesHTML(amenidades) {

    const lista = normalizarAmenidades(amenidades);

    if (!lista.length) {
        return "";
    }

    const categorias = {

        "Baño": [
            "bidé"
        ],

        "Habitación y lavandería": [
            "plancha",
            "espacio para guardar ropa"
        ],

        "Entretenimiento": [
            "tv"
        ],

        "Calefacción/refrigeración": [
            "aire acondicionado"
        ],

        "Privacidad/seguridad": [
            "cerradura habitación"
        ],

        "Internet/oficina": [
            "wifi",
            "área para trabajar"
        ],

        "Cocina/comedor": [
            "cocina",
            "cafetera",
            "café"
        ],

        "Estacionamiento/instalaciones": [
            "estacionamiento gratuito"
        ]

    };

    const encontrados = {};

    lista.forEach(item => {

        const nombre = String(item)
            .trim()
            .toLowerCase();

        for (const categoria in categorias) {

            if (
                categorias[categoria]
                    .some(valor => valor === nombre)
            ) {

                if (!encontrados[categoria]) {
                    encontrados[categoria] = [];
                }

                encontrados[categoria].push(item);

            }

        }

    });

    let html = "";

    Object.keys(encontrados).forEach(categoria => {

        html += `
            <div class="grupo-amenidades">
                <strong>${categoria}</strong>
                <div class="lista-amenidades">
                    ${encontrados[categoria]
                        .map(item => `
                            <span>${item}</span>
                        `)
                        .join("")}
                </div>
            </div>
        `;

    });

    return html;
}


// ==========================================================
// CREAR MODAL DEL ALOJAMIENTO
// ==========================================================

function crearModalAlojamiento() {

    if (document.getElementById("modalAlojamiento")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "modalAlojamiento";

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

                <div class="modal-alojamiento-fotos"></div>

                <button
                    type="button"
                    class="modal-alojamiento-flecha modal-alojamiento-anterior"
                    aria-label="Fotografía anterior"
                >
                    ‹
                </button>

                <button
                    type="button"
                    class="modal-alojamiento-flecha modal-alojamiento-siguiente"
                    aria-label="Fotografía siguiente"
                >
                    ›
                </button>

                <div class="modal-alojamiento-contador">
                    1 / 1
                </div>

            </div>

            <div class="modal-alojamiento-informacion modal-alojamiento-info">

                <h2 class="modal-alojamiento-nombre"></h2>

                <p class="modal-ubicacion"></p>

                <p class="modal-descripcion"></p>

                <div class="modal-datos"></div>

                <div class="modal-amenidades"></div>

                <div class="modal-alojamiento-precio">
                    <strong>Q0.00</strong>
                    <span>/ noche</span>
                </div>

                <button
                    type="button"
                    class="btn-solicitar-reserva modal-boton-reserva"
                >
                    Solicitar reserva
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    const botonCerrar =
        modal.querySelector(".modal-alojamiento-cerrar");

    botonCerrar.addEventListener(
        "click",
        cerrarModalAlojamiento
    );


    modal.addEventListener("click", function(event) {

        if (event.target === modal) {
            cerrarModalAlojamiento();
        }

    });


    modal.querySelector(
        ".modal-alojamiento-anterior"
    ).addEventListener(
        "click",
        () => cambiarFotoVisor(-1)
    );


    modal.querySelector(
        ".modal-alojamiento-siguiente"
    ).addEventListener(
        "click",
        () => cambiarFotoVisor(1)
    );


    modal.querySelector(
        ".btn-solicitar-reserva"
    ).addEventListener(
        "click",
        () => {

            cerrarModalAlojamiento();

            setTimeout(() => {
                abrirReserva(alojamientoActual);
            }, 200);

        }
    );

}


function cerrarModalAlojamiento() {

    const modal =
        document.getElementById("modalAlojamiento");

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "modal-alojamiento-visible"
    );

    document.body.classList.remove("sin-scroll");

}


// ==========================================================
// ABRIR MODAL
// ==========================================================

function abrirModalAlojamiento(
    alojamiento,
    fotos
) {

    alojamientoActual = alojamiento;

    fotosAlojamientoActual = fotos || [];

    indiceFotoActual = 0;

    const modal =
        document.getElementById("modalAlojamiento");

    if (!modal) {
        return;
    }

    const nombre =
        modal.querySelector(
            ".modal-alojamiento-nombre"
        );

    const ubicacion =
        modal.querySelector(
            ".modal-ubicacion"
        );

    const descripcion =
        modal.querySelector(
            ".modal-descripcion"
        );

    const datos =
        modal.querySelector(
            ".modal-datos"
        );

    const amenidades =
        modal.querySelector(
            ".modal-amenidades"
        );

    const precio =
        modal.querySelector(
            ".modal-alojamiento-precio strong"
        );


    nombre.textContent =
        alojamiento.nombre || "Alojamiento";


    ubicacion.textContent =
        alojamiento.ubicacion
            ? `📍 ${alojamiento.ubicacion}`
            : "";


    descripcion.textContent =
        alojamiento.descripcion ||
        "Alojamiento cómodo para disfrutar de una estancia agradable.";


    const maxHuespedes =
        Number(alojamiento.max_huespedes || 0);

    const habitaciones =
        Number(alojamiento.habitaciones || 0);

    const camas =
        Number(alojamiento.camas || 0);

    const sofas =
        Number(alojamiento.sofas_cama || 0);

    const banos =
        Number(alojamiento.banos || 0);


    let datosHTML = "";

    if (maxHuespedes) {

        datosHTML += `
            <span>
                👥 Hasta ${maxHuespedes} personas
            </span>
        `;

    }

    if (habitaciones) {

        datosHTML += `
            <span>
                🛏 ${habitaciones}
                ${habitaciones === 1
                    ? "habitación"
                    : "habitaciones"}
            </span>
        `;

    }

    if (camas) {

        datosHTML += `
            <span>
                🛏 ${camas}
                ${camas === 1
                    ? "cama"
                    : "camas"}
            </span>
        `;

    }

    if (sofas) {

        datosHTML += `
            <span>
                🛋 ${sofas}
                ${sofas === 1
                    ? "sofá cama"
                    : "sofás cama"}
            </span>
        `;

    }

    if (banos) {

        datosHTML += `
            <span>
                🚿 ${banos}
                ${banos === 1
                    ? "baño"
                    : "baños"}
            </span>
        `;

    }


    datos.innerHTML = datosHTML;


    const amenidadesHTML =
        construirAmenidadesHTML(
            alojamiento.amenidades
        );


    amenidades.innerHTML =
        amenidadesHTML;


    const precioBase =
        Number(
            alojamiento.precio_base || 0
        );


    precio.textContent =
        `Q${precioBase.toFixed(2)}`;


    mostrarFotosModal();


    modal.classList.add(
        "modal-alojamiento-visible"
    );

    document.body.classList.add("sin-scroll");

}


// ==========================================================
// FOTOS DEL MODAL
// ==========================================================

function mostrarFotosModal() {

    const modal =
        document.getElementById("modalAlojamiento");

    if (!modal) {
        return;
    }

    const contenedor =
        modal.querySelector(
            ".modal-alojamiento-fotos"
        );

    const contador =
        modal.querySelector(
            ".modal-alojamiento-contador"
        );

    if (!fotosAlojamientoActual.length) {

        contenedor.innerHTML = `
            <div
                class="modal-alojamiento-foto"
                style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:#777;
                "
            >
                Sin fotografías disponibles
            </div>
        `;

        contador.textContent = "0 / 0";

        return;
    }


    const foto =
        fotosAlojamientoActual[
            indiceFotoActual
        ];


    contenedor.innerHTML = `
        <img
            src="${foto}"
            class="modal-alojamiento-foto"
            alt="${
                alojamientoActual?.nombre ||
                "Alojamiento"
            }"
        >
    `;


    contador.textContent =
        `${indiceFotoActual + 1} / ${fotosAlojamientoActual.length}`;

}


// ==========================================================
// VISOR DE FOTOS
// ==========================================================

function crearVisorFotos() {

    if (document.getElementById("visorFotos")) {
        return;
    }

    const visor =
        document.createElement("div");

    visor.id = "visorFotos";

    visor.style.cssText = `
        position:fixed;
        inset:0;
        z-index:6000;
        display:none;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.94);
        padding:20px;
    `;

    visor.innerHTML = `

        <button
            type="button"
            id="cerrarVisorFotos"
            style="
                position:absolute;
                top:18px;
                right:20px;
                width:44px;
                height:44px;
                border:none;
                border-radius:50%;
                background:rgba(255,255,255,.15);
                color:white;
                font-size:30px;
                cursor:pointer;
                z-index:10;
            "
        >
            ×
        </button>

        <button
            type="button"
            id="visorFotoAnterior"
            style="
                position:absolute;
                left:18px;
                top:50%;
                transform:translateY(-50%);
                width:45px;
                height:45px;
                border:none;
                border-radius:50%;
                background:rgba(255,255,255,.15);
                color:white;
                font-size:28px;
                cursor:pointer;
            "
        >
            ‹
        </button>

        <img
            id="imagenVisorFotos"
            src=""
            alt="Fotografía"
            style="
                max-width:100%;
                max-height:90vh;
                object-fit:contain;
            "
        >

        <button
            type="button"
            id="visorFotoSiguiente"
            style="
                position:absolute;
                right:18px;
                top:50%;
                transform:translateY(-50%);
                width:45px;
                height:45px;
                border:none;
                border-radius:50%;
                background:rgba(255,255,255,.15);
                color:white;
                font-size:28px;
                cursor:pointer;
            "
        >
            ›
        </button>

        <div
            id="visorContadorFotos"
            style="
                position:absolute;
                bottom:20px;
                left:50%;
                transform:translateX(-50%);
                padding:7px 13px;
                border-radius:20px;
                background:rgba(0,0,0,.55);
                color:white;
                font-size:14px;
            "
        >
        </div>

    `;

    document.body.appendChild(visor);


    document
        .getElementById("cerrarVisorFotos")
        .addEventListener(
            "click",
            cerrarVisorFotos
        );


    document
        .getElementById("visorFotoAnterior")
        .addEventListener(
            "click",
            () => cambiarFotoVisor(-1)
        );


    document
        .getElementById("visorFotoSiguiente")
        .addEventListener(
            "click",
            () => cambiarFotoVisor(1)
        );


    visor.addEventListener(
        "click",
        function(event) {

            if (event.target === visor) {
                cerrarVisorFotos();
            }

        }
    );

}


function abrirVisorFotos() {

    if (!fotosAlojamientoActual.length) {
        return;
    }

    const visor =
        document.getElementById("visorFotos");

    visor.style.display = "flex";

    actualizarVisorFoto();

}


function actualizarVisorFoto() {

    const imagen =
        document.getElementById(
            "imagenVisorFotos"
        );

    const contador =
        document.getElementById(
            "visorContadorFotos"
        );

    if (!imagen || !contador) {
        return;
    }

    imagen.src =
        fotosAlojamientoActual[
            indiceFotoActual
        ];

    contador.textContent =
        `${indiceFotoActual + 1} / ${fotosAlojamientoActual.length}`;

}


function cambiarFotoVisor(direccion) {

    if (!fotosAlojamientoActual.length) {
        return;
    }

    indiceFotoActual += direccion;


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

}


function cerrarVisorFotos() {

    const visor =
        document.getElementById("visorFotos");

    if (visor) {
        visor.style.display = "none";
    }

}


// ==========================================================
// OBTENER FOTOS DEL ALOJAMIENTO
// ==========================================================

async function obtenerFotosAlojamiento(id) {

    try {

        const {
            data,
            error
        } =
            await clienteSupabase
                .storage
                .from("fotos-alojamientos")
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


        if (error) {

            console.error(
                "Error obteniendo fotos:",
                error
            );

            return [];

        }


        if (!data || !data.length) {
            return [];
        }


        const extensiones = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".avif"
        ];


        const archivos =
            data.filter(archivo => {

                const nombre =
                    archivo.name.toLowerCase();

                return extensiones.some(
                    extension =>
                        nombre.endsWith(extension)
                );

            });


        return archivos.map(archivo => {

            const ruta =
                `${id}/${archivo.name}`;

            const {
                data: publicData
            } =
                clienteSupabase
                    .storage
                    .from("fotos-alojamientos")
                    .getPublicUrl(ruta);

            return publicData.publicUrl;

        });

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

    const article =
        document.createElement("article");

    article.className = "alojamiento";

    article.tabIndex = 0;


    const primeraFoto =
        fotos.length
            ? fotos[0]
            : null;


    const nombre =
        alojamiento.nombre ||
        "Alojamiento";


    const ubicacion =
        alojamiento.ubicacion ||
        "";


    const descripcion =
        alojamiento.descripcion ||
        "Alojamiento cómodo para disfrutar de una estancia agradable.";


    const precioBase =
        Number(
            alojamiento.precio_base || 0
        );


    const maxHuespedes =
        Number(
            alojamiento.max_huespedes || 0
        );


    const habitaciones =
        Number(
            alojamiento.habitaciones || 0
        );


    const camas =
        Number(
            alojamiento.camas || 0
        );


    const banos =
        Number(
            alojamiento.banos || 0
        );


    // ======================================================
    // GALERÍA
    // ======================================================

    const galeria =
        document.createElement("div");

    galeria.className =
        "galeria-alojamiento";


    if (!primeraFoto) {

        galeria.classList.add(
            "sin-fotos"
        );

        galeria.innerHTML = `
            <div class="sin-foto-tarjeta">
                Sin fotografía
            </div>
        `;

    } else {

        const imagen =
            document.createElement("img");

        imagen.className =
            "foto-principal";

        imagen.src =
            primeraFoto;

        imagen.alt =
            nombre;

        imagen.loading =
            "lazy";

        imagen.draggable =
            false;


        galeria.appendChild(imagen);


        // ================================================
        // CONTADOR
        // ================================================

        if (fotos.length > 1) {

            const contador =
                document.createElement("div");

            contador.className =
                "contador-fotos";

            contador.textContent =
                `1 / ${fotos.length}`;

            galeria.appendChild(contador);

        }


        // ================================================
        // FLECHAS
        // ================================================

        if (fotos.length > 1) {

            const anterior =
                document.createElement("button");

            anterior.type =
                "button";

            anterior.className =
                "flecha-foto-tarjeta anterior";

            anterior.innerHTML =
                "‹";

            anterior.setAttribute(
                "aria-label",
                "Fotografía anterior"
            );


            const siguiente =
                document.createElement("button");

            siguiente.type =
                "button";

            siguiente.className =
                "flecha-foto-tarjeta siguiente";

            siguiente.innerHTML =
                "›";

            siguiente.setAttribute(
                "aria-label",
                "Fotografía siguiente"
            );


            galeria.appendChild(anterior);
            galeria.appendChild(siguiente);


            // ============================================
            // PUNTOS
            // ============================================

            const puntos =
                document.createElement("div");

            puntos.className =
                "puntos-fotos-tarjeta";


            fotos.forEach(
                (foto, indice) => {

                    const punto =
                        document.createElement("span");

                    punto.className =
                        "punto-foto-tarjeta";

                    if (indice === 0) {
                        punto.classList.add(
                            "activo"
                        );
                    }

                    puntos.appendChild(
                        punto
                    );

                }
            );


            galeria.appendChild(puntos);


            let indiceTarjeta =
                0;


            function cambiarFotoTarjeta(
                direccion
            ) {

                indiceTarjeta +=
                    direccion;


                if (
                    indiceTarjeta < 0
                ) {

                    indiceTarjeta =
                        fotos.length - 1;

                }


                if (
                    indiceTarjeta >=
                    fotos.length
                ) {

                    indiceTarjeta = 0;

                }


                imagen.src =
                    fotos[indiceTarjeta];


                contador.textContent =
                    `${indiceTarjeta + 1} / ${fotos.length}`;


                const puntosActuales =
                    puntos.querySelectorAll(
                        ".punto-foto-tarjeta"
                    );


                puntosActuales.forEach(
                    (punto, indice) => {

                        punto.classList.toggle(
                            "activo",
                            indice ===
                            indiceTarjeta
                        );

                    }
                );

            }


            anterior.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    cambiarFotoTarjeta(-1);

                }
            );


            siguiente.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    cambiarFotoTarjeta(1);

                }
            );

        }

    }


    // ======================================================
    // NOMBRE
    // ======================================================

    const titulo =
        document.createElement("div");

    titulo.className =
        "nombre-alojamiento";

    titulo.textContent =
        nombre;


    // ======================================================
    // INFORMACIÓN
    // ======================================================

    const contenido =
        document.createElement("div");

    contenido.className =
        "info-tarjeta-alojamiento";


    // Ubicación

    if (ubicacion) {

        const ubicacionElemento =
            document.createElement("p");

        ubicacionElemento.className =
            "ubicacion-tarjeta";

        ubicacionElemento.textContent =
            `📍 ${ubicacion}`;

        contenido.appendChild(
            ubicacionElemento
        );

    }


    // Descripción

    const descripcionElemento =
        document.createElement("p");

    descripcionElemento.className =
        "descripcion-tarjeta";

    descripcionElemento.textContent =
        descripcion;

    contenido.appendChild(
        descripcionElemento
    );


    // ======================================================
    // DATOS RÁPIDOS
    // ======================================================

    const datos =
        document.createElement("div");

    datos.className =
        "datos-rapidos-tarjeta";


    if (maxHuespedes) {

        const dato =
            document.createElement("span");

        dato.className =
            "dato-rapido-tarjeta";

        dato.textContent =
            `👥 ${maxHuespedes} ${
                maxHuespedes === 1
                    ? "persona"
                    : "personas"
            }`;

        datos.appendChild(dato);

    }


    if (habitaciones) {

        const dato =
            document.createElement("span");

        dato.className =
            "dato-rapido-tarjeta";

        dato.textContent =
            `🛏 ${habitaciones} ${
                habitaciones === 1
                    ? "habitación"
                    : "habitaciones"
            }`;

        datos.appendChild(dato);

    }


    if (camas) {

        const dato =
            document.createElement("span");

        dato.className =
            "dato-rapido-tarjeta";

        dato.textContent =
            `🛏 ${camas} ${
                camas === 1
                    ? "cama"
                    : "camas"
            }`;

        datos.appendChild(dato);

    }


    if (banos) {

        const dato =
            document.createElement("span");

        dato.className =
            "dato-rapido-tarjeta";

        dato.textContent =
            `🚿 ${banos} ${
                banos === 1
                    ? "baño"
                    : "baños"
            }`;

        datos.appendChild(dato);

    }


    if (datos.children.length) {

        contenido.appendChild(datos);

    }


    // ======================================================
    // PIE
    // ======================================================

    const pie =
        document.createElement("div");

    pie.className =
        "pie-tarjeta-alojamiento";


    const precio =
        document.createElement("div");

    precio.className =
        "precio-tarjeta-alojamiento";

    precio.innerHTML = `
        <strong>
            Q${precioBase.toFixed(2)}
        </strong>

        <span>
            / noche
        </span>
    `;


    const boton =
        document.createElement("button");

    boton.type =
        "button";

    boton.className =
        "btn-ver-alojamiento";

    boton.textContent =
        "Ver alojamiento";


    pie.appendChild(precio);
    pie.appendChild(boton);

    contenido.appendChild(pie);


    // ======================================================
    // ENSAMBLAR
    // ======================================================

    article.appendChild(galeria);
    article.appendChild(titulo);
    article.appendChild(contenido);


    // ======================================================
    // ABRIR MODAL
    // ======================================================

    function abrirDetalle() {

        abrirModalAlojamiento(
            alojamiento,
            fotos
        );

    }


    boton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            abrirDetalle();

        }
    );


    galeria.addEventListener(
        "click",
        function(event) {

            if (
                event.target.closest(
                    ".flecha-foto-tarjeta"
                )
            ) {
                return;
            }

            abrirDetalle();

        }
    );


    titulo.addEventListener(
        "click",
        abrirDetalle
    );


    contenido.addEventListener(
        "click",
        function(event) {

            if (
                event.target.closest(
                    ".btn-ver-alojamiento"
                )
            ) {
                return;
            }

            abrirDetalle();

        }
    );


    article.addEventListener(
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


    return article;

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

        const {
            data,
            error
        } =
            await clienteSupabase
                .from("alojamientos")
                .select("*")
                .eq("publicado", true)
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Error cargando alojamientos:",
                error
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


        if (!data || !data.length) {

            contenedor.innerHTML = `
                <p style="
                    grid-column:1/-1;
                    text-align:center;
                    color:#777;
                ">
                    Actualmente no hay alojamientos publicados.
                </p>
            `;

            return;

        }


        for (const alojamiento of data) {

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

        }


    } catch (error) {

        console.error(
            "Error inesperado:",
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
// RESERVA
// ==========================================================

function abrirReserva(alojamiento) {

    alojamientoActual =
        alojamiento;


    const modal =
        document.getElementById(
            "modalReserva"
        );


    if (!modal) {
        return;
    }


    const nombre =
        modal.querySelector(
            ".nombre-reserva"
        );


    if (nombre) {

        nombre.textContent =
            alojamiento.nombre ||
            "Alojamiento";

    }


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
            alojamiento.max_huespedes || 0
        );


    modal.dataset.precioBase =
        precioBase;

    modal.dataset.precioPersona =
        precioPersona;

    modal.dataset.personasIncluidas =
        personasIncluidas;

    modal.dataset.maxHuespedes =
        maxHuespedes;


    fechaEntradaSeleccionada =
        null;

    fechaSalidaSeleccionada =
        null;


    const entrada =
        document.getElementById(
            "fechaEntrada"
        );

    const salida =
        document.getElementById(
            "fechaSalida"
        );


    if (entrada) {
        entrada.value = "";
    }


    if (salida) {
        salida.value = "";
    }


    const personas =
        document.getElementById(
            "personas"
        );


    if (personas) {

        personas.value = 1;

        personas.min = 1;

        personas.max = 50;

    }


    const advertencia =
        document.getElementById(
            "advertenciaHuespedes"
        );


    if (advertencia) {
        advertencia.innerHTML = "";
    }


    calendarioMes =
        new Date();

    calendarioMes.setDate(1);


    fechaCalendarioActiva =
        null;


    const modalAlojamiento =
        document.getElementById(
            "modalAlojamiento"
        );


    if (modalAlojamiento) {

        modalAlojamiento.classList.remove(
            "modal-alojamiento-visible"
        );

    }


    modal.style.display =
        "block";


    document.body.classList.add(
        "sin-scroll"
    );


    renderizarCalendario();

    actualizarPrecioReserva();

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
        modal.style.display = "none";
    }


    document.body.classList.remove(
        "sin-scroll"
    );

}


function cerrarModalReserva() {

    cerrarReserva();

}


// ==========================================================
// FECHAS
// ==========================================================

function obtenerFechasReserva() {

    const entrada =
        document.getElementById(
            "fechaEntrada"
        );

    const salida =
        document.getElementById(
            "fechaSalida"
        );


    return {

        entrada:
            entrada
                ? entrada.value
                : "",

        salida:
            salida
                ? salida.value
                : ""

    };

}


// ==========================================================
// FORMATEAR FECHA
// ==========================================================

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "";
    }


    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================================
// FECHA LOCAL ISO
// ==========================================================

function fechaLocalISO(
    fecha
) {

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


    return `${año}-${mes}-${dia}`;

}


// ==========================================================
// CALCULAR NOCHES
// ==========================================================

function calcularNoches(
    entrada,
    salida
) {

    if (!entrada || !salida) {
        return 0;
    }


    const fechaEntrada =
        new Date(
            `${entrada}T00:00:00`
        );


    const fechaSalida =
        new Date(
            `${salida}T00:00:00`
        );


    const diferencia =
        fechaSalida.getTime() -
        fechaEntrada.getTime();


    const noches =
        Math.ceil(
            diferencia /
            (1000 * 60 * 60 * 24)
        );


    return noches > 0
        ? noches
        : 0;

}


// ==========================================================
// OBTENER CANTIDAD DE HUÉSPEDES
// ==========================================================

function obtenerCantidadHuespedes() {

    const personas =
        document.getElementById(
            "personas"
        );


    if (!personas) {
        return 1;
    }


    const cantidad =
        parseInt(
            personas.value,
            10
        );


    if (
        Number.isNaN(cantidad) ||
        cantidad < 1
    ) {

        return 1;

    }


    return cantidad;

}


// ==========================================================
// ZONA ADVERTENCIA HUÉSPEDES
// ==========================================================

function crearZonaAdvertenciaHuespedes() {

    const personas =
        document.getElementById(
            "personas"
        );


    if (!personas) {
        return;
    }


    if (
        document.getElementById(
            "advertenciaHuespedes"
        )
    ) {
        return;
    }


    const zona =
        document.createElement("div");

    zona.id =
        "advertenciaHuespedes";

    zona.style.cssText = `
        margin-top:-5px;
        margin-bottom:15px;
    `;


    personas.parentNode.insertBefore(
        zona,
        personas.nextSibling
    );

}


// ==========================================================
// ACTUALIZAR ADVERTENCIA
// ==========================================================

function actualizarAdvertenciaHuespedes() {

    const zona =
        document.getElementById(
            "advertenciaHuespedes"
        );


    if (!zona) {
        return;
    }


    const cantidad =
        obtenerCantidadHuespedes();


    const maximo =
        Number(
            alojamientoActual?.max_huespedes || 0
        );


    if (
        !maximo ||
        cantidad <= maximo
    ) {

        zona.innerHTML = "";

        return;

    }


    zona.innerHTML = `

        <div style="
            padding:12px 14px;
            border-left:4px solid #f28c28;
            border-radius:8px;
            background:#fff7ef;
            color:#555;
            font-size:13px;
            line-height:1.5;
        ">

            <label style="
                display:flex;
                align-items:flex-start;
                gap:9px;
                cursor:pointer;
                margin:0;
            ">

                <input
                    type="checkbox"
                    id="aceptarExcesoHuespedes"
                    style="
                        width:auto;
                        margin:3px 0 0 0;
                        cursor:pointer;
                    "
                >

                <span>
                    Este alojamiento permite hasta
                    <strong>${maximo} ${
                        maximo === 1
                            ? "persona"
                            : "personas"
                    }</strong>.
                    Soy consciente de que estoy
                    solicitando una cantidad de
                    huéspedes superior a la permitida.
                </span>

            </label>

        </div>

    `;

}


// ==========================================================
// VALIDAR HUÉSPEDES
// ==========================================================

function validarHuespedes() {

    const cantidad =
        obtenerCantidadHuespedes();


    const maximo =
        Number(
            alojamientoActual?.max_huespedes || 0
        );


    if (
        !maximo ||
        cantidad <= maximo
    ) {

        return true;

    }


    const checkbox =
        document.getElementById(
            "aceptarExcesoHuespedes"
        );


    if (
        !checkbox ||
        !checkbox.checked
    ) {

        alert(
            "Debes confirmar que eres consciente de que estás solicitando más huéspedes de los permitidos."
        );

        return false;

    }


    return true;

}


// ==========================================================
// CALCULAR PRECIO
// ==========================================================

function calcularPrecioReserva() {

    const alojamiento =
        alojamientoActual;


    if (!alojamiento) {
        return 0;
    }


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


    const personas =
        obtenerCantidadHuespedes();


    const {
        entrada,
        salida
    } =
        obtenerFechasReserva();


    const noches =
        calcularNoches(
            entrada,
            salida
        );


    if (!noches) {
        return 0;
    }


    const personasExtra =
        Math.max(
            personas -
            personasIncluidas,
            0
        );


    return (
        precioBase +
        (
            personasExtra *
            precioPersona
        )
    ) * noches;

}


// ==========================================================
// ACTUALIZAR PRECIO
// ==========================================================

function actualizarPrecioReserva() {

    const total =
        calcularPrecioReserva();


    const elemento =
        document.getElementById(
            "precioTotal"
        );


    if (elemento) {

        elemento.textContent =
            `Q${total.toFixed(2)}`;

    }


    const nochesElemento =
        document.getElementById(
            "cantidadNoches"
        );


    const {
        entrada,
        salida
    } =
        obtenerFechasReserva();


    const noches =
        calcularNoches(
            entrada,
            salida
        );


    if (nochesElemento) {

        nochesElemento.textContent =
            noches;

    }


    actualizarAdvertenciaHuespedes();

}


// ==========================================================
// VERIFICAR DISPONIBILIDAD
// ==========================================================

async function verificarDisponibilidad(
    alojamientoId,
    fechaEntrada,
    fechaSalida
) {

    try {

        const {
            data,
            error
        } =
            await clienteSupabase
                .functions
                .invoke(
                    "obtener-disponibilidad",
                    {
                        body: {
                            alojamiento_id:
                                alojamientoId,

                            fecha_entrada:
                                fechaEntrada,

                            fecha_salida:
                                fechaSalida
                        }
                    }
                );


        if (error) {

            console.error(
                "Error verificando disponibilidad:",
                error
            );

            return false;

        }


        if (!data) {
            return false;
        }


        if (
            typeof data.disponible ===
            "boolean"
        ) {

            return data.disponible;

        }


        if (
            typeof data ===
            "boolean"
        ) {

            return data;

        }


        return false;

    } catch (error) {

        console.error(
            "Error inesperado verificando disponibilidad:",
            error
        );

        return false;

    }

}


// ==========================================================
// ENVIAR WHATSAPP
// ==========================================================

async function enviarWhatsApp() {

    if (!alojamientoActual) {
        return;
    }


    const nombre =
        document.getElementById(
            "nombre"
        )?.value.trim();


    const telefono =
        document.getElementById(
            "telefono"
        )?.value.trim();


    const {
        entrada,
        salida
    } =
        obtenerFechasReserva();


    const personas =
        obtenerCantidadHuespedes();


    if (!nombre) {

        alert(
            "Ingresa tu nombre."
        );

        return;

    }


    if (!telefono) {

        alert(
            "Ingresa tu número de teléfono."
        );

        return;

    }


    if (!entrada || !salida) {

        alert(
            "Selecciona las fechas de entrada y salida."
        );

        return;

    }


    const noches =
        calcularNoches(
            entrada,
            salida
        );


    if (!noches) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de entrada."
        );

        return;

    }


    if (!validarHuespedes()) {
        return;
    }


    const disponible =
        await verificarDisponibilidad(
            alojamientoActual.id,
            entrada,
            salida
        );


    if (!disponible) {

        alert(
            "Las fechas seleccionadas no están disponibles. Por favor selecciona otras fechas."
        );

        return;

    }


    const total =
        calcularPrecioReserva();


    const precioBase =
        Number(
            alojamientoActual.precio_base || 0
        );


    const precioPersona =
        Number(
            alojamientoActual.precio_persona || 0
        );


    const personasIncluidas =
        Number(
            alojamientoActual.personas_incluidas || 0
        );


    const personasExtra =
        Math.max(
            personas -
            personasIncluidas,
            0
        );


    const mensaje =

        `Hola, quiero solicitar una reserva en Estancias Agradables.%0A%0A` +

        `🏠 Alojamiento: ${alojamientoActual.nombre || ""}%0A` +

        `📍 Ubicación: ${alojamientoActual.ubicacion || ""}%0A%0A` +

        `👤 Nombre: ${nombre}%0A` +

        `📞 Teléfono: ${telefono}%0A` +

        `📅 Entrada: ${formatearFecha(entrada)}%0A` +

        `📅 Salida: ${formatearFecha(salida)}%0A` +

        `🌙 Noches: ${noches}%0A` +

        `👥 Huéspedes: ${personas}%0A%0A` +

        `💰 Precio base: Q${precioBase.toFixed(2)} por noche%0A` +

        `➕ Personas adicionales: ${personasExtra}%0A` +

        `💵 Precio por persona adicional: Q${precioPersona.toFixed(2)}%0A%0A` +

        `💳 Total estimado: Q${total.toFixed(2)}%0A%0A` +

        `Quedo pendiente de la confirmación de la reserva.`;


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
// CALENDARIO
// ==========================================================

async function renderizarCalendario() {

    const contenedor =
        document.getElementById(
            "calendarioContenedor"
        );


    if (!contenedor) {
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


    let primerDiaSemana =
        primerDia.getDay();


    primerDiaSemana =
        primerDiaSemana === 0
            ? 6
            : primerDiaSemana - 1;


    const diasMes =
        ultimoDia.getDate();


    const nombreMes =
        calendarioMes.toLocaleDateString(
            "es-GT",
            {
                month: "long",
                year: "numeric"
            }
        );


    let html = `

        <div class="calendario">

            <div class="calendario-encabezado">

                <h3 class="calendario-titulo">
                    ${nombreMes}
                </h3>

                <div class="calendario-navegacion">

                    <button
                        type="button"
                        id="mesAnterior"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        id="mesSiguiente"
                    >
                        ›
                    </button>

                </div>

            </div>

            <div class="calendario-dias-semana">

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


        const iso =
            fechaLocalISO(fecha);


        const esPasado =
            fecha < hoy;


        const esHoy =
            fecha.getTime() ===
            hoy.getTime();


        let clases =
            "calendario-dia";


        if (esPasado) {
            clases += " pasado";
        }


        if (esHoy) {
            clases += " hoy";
        }


        if (
            fechaEntradaSeleccionada === iso
        ) {

            clases += " ingreso";

        }


        if (
            fechaSalidaSeleccionada === iso
        ) {

            clases += " salida";

        }


        if (
            fechaEntradaSeleccionada &&
            fechaSalidaSeleccionada &&
            iso > fechaEntradaSeleccionada &&
            iso < fechaSalidaSeleccionada
        ) {

            clases += " en-rango";

        }


        html += `

            <button
                type="button"
                class="${clases}"
                data-fecha="${iso}"
                ${esPasado ? "disabled" : ""}
            >
                ${dia}
            </button>

        `;

    }


    html += `

            </div>

            <div class="calendario-ayuda">
                Selecciona primero la fecha de entrada
                y luego la fecha de salida.
            </div>

            <div class="calendario-leyenda">

                <div class="leyenda-item">
                    <span class="leyenda-circulo leyenda-disponible"></span>
                    Disponible
                </div>

                <div class="leyenda-item">
                    <span class="leyenda-circulo leyenda-seleccionado"></span>
                    Seleccionado
                </div>

                <div class="leyenda-item">
                    <span class="leyenda-circulo leyenda-bloqueado"></span>
                    No disponible
                </div>

            </div>

        </div>

    `;


    contenedor.innerHTML =
        html;


    document
        .getElementById("mesAnterior")
        ?.addEventListener(
            "click",
            function() {

                calendarioMes.setMonth(
                    calendarioMes.getMonth() - 1
                );

                renderizarCalendario();

            }
        );


    document
        .getElementById("mesSiguiente")
        ?.addEventListener(
            "click",
            function() {

                calendarioMes.setMonth(
                    calendarioMes.getMonth() + 1
                );

                renderizarCalendario();

            }
        );


    contenedor
        .querySelectorAll(
            ".calendario-dia[data-fecha]"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    function() {

                        seleccionarFechaCalendario(
                            this.dataset.fecha
                        );

                    }
                );

            }
        );

}


// ==========================================================
// SELECCIONAR FECHA
// ==========================================================

function seleccionarFechaCalendario(
    fecha
) {

    if (!fechaEntradaSeleccionada) {

        fechaEntradaSeleccionada =
            fecha;

        fechaSalidaSeleccionada =
            null;

    } else if (
        !fechaSalidaSeleccionada
    ) {

        if (
            fecha <=
            fechaEntradaSeleccionada
        ) {

            fechaEntradaSeleccionada =
                fecha;

        } else {

            fechaSalidaSeleccionada =
                fecha;

        }

    } else {

        fechaEntradaSeleccionada =
            fecha;

        fechaSalidaSeleccionada =
            null;

    }


    const entrada =
        document.getElementById(
            "fechaEntrada"
        );


    const salida =
        document.getElementById(
            "fechaSalida"
        );


    if (entrada) {

        entrada.value =
            fechaEntradaSeleccionada || "";

    }


    if (salida) {

        salida.value =
            fechaSalidaSeleccionada || "";

    }


    renderizarCalendario();

    actualizarPrecioReserva();

}


// ==========================================================
// CONFIGURAR RESERVA
// ==========================================================

function configurarReserva() {

    crearZonaAdvertenciaHuespedes();


    const botonCerrar =
        document.getElementById(
            "cerrarModalReserva"
        );


    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrarReserva
        );

    }


    const botonWhatsApp =
        document.getElementById(
            "botonWhatsApp"
        );


    if (botonWhatsApp) {

        botonWhatsApp.addEventListener(
            "click",
            enviarWhatsApp
        );

    }


    const personas =
        document.getElementById(
            "personas"
        );


    if (personas) {

        personas.addEventListener(
            "input",
            function() {

                let valor =
                    parseInt(
                        this.value,
                        10
                    );


                if (
                    Number.isNaN(valor)
                ) {

                    valor = 1;

                }


                if (valor < 1) {
                    valor = 1;
                }


                if (valor > 50) {
                    valor = 50;
                }


                this.value =
                    valor;


                actualizarAdvertenciaHuespedes();

                actualizarPrecioReserva();

            }
        );

    }


    const fechaEntrada =
        document.getElementById(
            "fechaEntrada"
        );


    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );


    if (fechaEntrada) {

        fechaEntrada.addEventListener(
            "change",
            function() {

                fechaEntradaSeleccionada =
                    this.value || null;

                renderizarCalendario();

                actualizarPrecioReserva();

            }
        );

    }


    if (fechaSalida) {

        fechaSalida.addEventListener(
            "change",
            function() {

                fechaSalidaSeleccionada =
                    this.value || null;

                renderizarCalendario();

                actualizarPrecioReserva();

            }
        );

    }


    const modalReserva =
        document.getElementById(
            "modalReserva"
        );


    if (modalReserva) {

        modalReserva.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    modalReserva
                ) {

                    cerrarReserva();

                }

            }
        );

    }

}


// ==========================================================
// TECLADO
// ==========================================================

function configurarTeclado() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                const visor =
                    document.getElementById(
                        "visorFotos"
                    );


                if (
                    visor &&
                    visor.style.display ===
                    "flex"
                ) {

                    cerrarVisorFotos();

                    return;

                }


                const modal =
                    document.getElementById(
                        "modalAlojamiento"
                    );


                if (
                    modal &&
                    modal.classList.contains(
                        "modal-alojamiento-visible"
                    )
                ) {

                    cerrarModalAlojamiento();

                    return;

                }


                const reserva =
                    document.getElementById(
                        "modalReserva"
                    );


                if (
                    reserva &&
                    reserva.style.display ===
                    "block"
                ) {

                    cerrarReserva();

                }

            }


            if (
                event.key === "ArrowLeft"
            ) {

                const modal =
                    document.getElementById(
                        "modalAlojamiento"
                    );


                if (
                    modal &&
                    modal.classList.contains(
                        "modal-alojamiento-visible"
                    )
                ) {

                    cambiarFotoVisor(-1);

                }

            }


            if (
                event.key === "ArrowRight"
            ) {

                const modal =
                    document.getElementById(
                        "modalAlojamiento"
                    );


                if (
                    modal &&
                    modal.classList.contains(
                        "modal-alojamiento-visible"
                    )
                ) {

                    cambiarFotoVisor(1);

                }

            }

        }
    );

}


// ==========================================================
// PORTADA
// ==========================================================

async function cargarPortada() {

    const fondoA =
        document.querySelector(
            ".portada-fondo-a"
        );

    const fondoB =
        document.querySelector(
            ".portada-fondo-b"
        );


    if (!fondoA || !fondoB) {
        return;
    }


    try {

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


        if (error) {

            console.error(
                "Error cargando portada:",
                error
            );

            return;

        }


        if (!data || !data.length) {
            return;
        }


        const extensiones = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".avif"
        ];


        const archivos =
            data.filter(archivo => {

                const nombre =
                    archivo.name.toLowerCase();

                return extensiones.some(
                    extension =>
                        nombre.endsWith(extension)
                );

            });


        fotosPortada =
            archivos.map(
                archivo => {

                    const {
                        data: publicData
                    } =
                        clienteSupabase
                            .storage
                            .from("fotos-alojamientos")
                            .getPublicUrl(
                                `portada/${archivo.name}`
                            );

                    return publicData.publicUrl;

                }
            );


        if (!fotosPortada.length) {
            return;
        }


        indicePortada = 0;


        fondoA.style.backgroundImage =
            `url("${fotosPortada[0]}")`;

        fondoA.style.opacity = "1";

        fondoB.style.opacity = "0";


        const indicadores =
            document.querySelector(
                ".indicadores-portada"
            );


        if (indicadores) {

            indicadores.innerHTML = "";

            fotosPortada.forEach(
                (foto, indice) => {

                    const punto =
                        document.createElement(
                            "span"
                        );

                    punto.className =
                        "punto-portada";


                    if (indice === 0) {

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


    if (!fondoA || !fondoB) {
        return;
    }


    const fondoAActivo =
        parseFloat(
            getComputedStyle(
                fondoA
            ).opacity
        ) > 0.5;


    const siguienteIndice =
        (
            indicePortada + 1
        ) %
        fotosPortada.length;


    const siguienteFoto =
        fotosPortada[
            siguienteIndice
        ];


    if (fondoAActivo) {

        fondoB.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoB.style.opacity =
            "1";

        fondoA.style.opacity =
            "0";

    } else {

        fondoA.style.backgroundImage =
            `url("${siguienteFoto}")`;

        fondoA.style.opacity =
            "1";

        fondoB.style.opacity =
            "0";

    }


    indicePortada =
        siguienteIndice;


    const puntos =
        document.querySelectorAll(
            ".punto-portada"
        );


    puntos.forEach(
        (punto, indice) => {

            punto.classList.toggle(
                "activo",
                indice ===
                indicePortada
            );

        }
    );

}


// ==========================================================
// SWIPE PARA FOTOS DEL MODAL
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
    let inicioY = 0;


    galeria.addEventListener(
        "touchstart",
        function(event) {

            if (
                !event.touches ||
                !event.touches.length
            ) {
                return;
            }


            inicioX =
                event.touches[0].clientX;

            inicioY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    galeria.addEventListener(
        "touchend",
        function(event) {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {
                return;
            }


            const finalX =
                event.changedTouches[0].clientX;

            const finalY =
                event.changedTouches[0].clientY;


            const diferenciaX =
                finalX - inicioX;

            const diferenciaY =
                finalY - inicioY;


            if (
                Math.abs(diferenciaX) <
                50
            ) {
                return;
            }


            if (
                Math.abs(diferenciaX) <=
                Math.abs(diferenciaY)
            ) {
                return;
            }


            if (
                diferenciaX < 0
            ) {

                cambiarFotoVisor(1);

            } else {

                cambiarFotoVisor(-1);

            }

        },
        {
            passive: true
        }
    );

}


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        insertarEstilosJavascript();

        crearModalAlojamiento();

        crearVisorFotos();

        configurarReserva();

        configurarTeclado();

        configurarSwipeFotos();

        await cargarPortada();

        await cargarAlojamientos();

    }
);
