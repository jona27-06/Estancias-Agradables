// ==========================================================
// ESTANCIAS AGRADABLES - SCRIPT COMPLETO CORREGIDO
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
// ESTILOS GENERALES CREADOS POR JAVASCRIPT
// ==========================================================

function insertarEstilosJavascript() {

    if (
        document.getElementById(
            "estilosJavascript"
        )
    ) {
        return;
    }

    const estilos =
        document.createElement("style");

    estilos.id =
        "estilosJavascript";

    estilos.innerHTML = `

        /* ==================================================
           MODAL DEL ALOJAMIENTO
           ================================================== */

        .modal-alojamiento {
            position: fixed;
            inset: 0;
            z-index: 9998;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0,0,0,.72);
        }

        .modal-alojamiento-contenido {
            position: relative;
            width: min(950px, 100%);
            max-height: 92vh;
            overflow-y: auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0,0,0,.25);
        }

        .cerrar-modal-alojamiento {
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 20;
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,.65);
            color: #fff;
            font-size: 27px;
            line-height: 1;
            cursor: pointer;
        }

        .modal-alojamiento-fotos {
            position: relative;
            width: 100%;
            height: 430px;
            overflow: hidden;
            background: #eee;
        }

        .modal-alojamiento-fotos img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #eee;
            cursor: pointer;
        }

        .sin-fotos,
        .sin-foto-tarjeta {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: #777;
            background: #f1f1f1;
        }

        .contador-fotos-modal {
            position: absolute;
            right: 15px;
            bottom: 15px;
            padding: 6px 10px;
            border-radius: 8px;
            background: rgba(0,0,0,.65);
            color: white;
            font-size: 13px;
        }

        .flecha-foto-modal {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 5;
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,.55);
            color: white;
            font-size: 30px;
            line-height: 30px;
            cursor: pointer;
        }

        .flecha-foto-anterior {
            left: 12px;
        }

        .flecha-foto-siguiente {
            right: 12px;
        }

        .modal-alojamiento-info {
            padding: 25px;
        }

        .modal-alojamiento-info h2 {
            margin: 0 0 8px;
            font-size: 28px;
        }

        .modal-alojamiento-ubicacion {
            margin-bottom: 18px;
            color: #666;
        }

        .modal-alojamiento-descripcion {
            margin-bottom: 22px;
            line-height: 1.6;
            white-space: pre-line;
        }

        .modal-caracteristicas {
            margin-top: 24px;
        }

        .modal-caracteristicas h3,
        .modal-amenidades h3 {
            margin: 0 0 15px;
            font-size: 20px;
            color: #222;
        }

        .modal-caracteristicas-lista {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
        }

        .modal-caracteristica {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 12px;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
            background: #fff;
            font-size: 14px;
            color: #333;
        }

        .modal-caracteristica-icono {
            min-width: 24px;
            font-size: 19px;
            text-align: center;
        }

        .modal-tamano-camas {
            margin-top: 12px;
            padding: 11px 13px;
            border-radius: 10px;
            background: #f8f8f8;
            color: #444;
            font-size: 14px;
        }

        .modal-amenidades {
            margin-top: 28px;
        }

        .amenidades-categoria {
            margin-bottom: 22px;
        }

        .amenidades-categoria h4 {
            margin: 0 0 10px;
            font-size: 16px;
            color: #333;
        }

        .amenidades-lista {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 9px;
        }

        .amenidad-item {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 8px 0;
            font-size: 14px;
            color: #444;
        }

        .amenidad-icono {
            width: 23px;
            text-align: center;
            font-size: 17px;
        }

        .modal-alojamiento-precio {
            display: flex;
            align-items: baseline;
            gap: 5px;
            margin-top: 25px;
            font-size: 15px;
        }

        .modal-alojamiento-precio strong {
            font-size: 24px;
        }

        .btn-solicitar-reserva {
            width: 100%;
            margin-top: 20px;
            padding: 13px 18px;
            border: none;
            border-radius: 10px;
            background: #f28c28;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }

        .btn-solicitar-reserva:hover {
            opacity: .92;
        }


        /* ==================================================
           VISOR DE FOTOS
           ================================================== */

        .visor-fotos {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,.94);
        }

        .visor-fotos img {
            max-width: 90vw;
            max-height: 88vh;
            object-fit: contain;
        }

        .cerrar-visor-fotos {
            position: absolute;
            top: 18px;
            right: 22px;
            z-index: 5;
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
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.15);
            color: white;
            font-size: 35px;
            cursor: pointer;
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
            padding: 6px 12px;
            border-radius: 8px;
            background: rgba(0,0,0,.6);
            color: white;
        }


        /* ==================================================
           TARJETAS
           ================================================== */

        .tarjeta-alojamiento {
            overflow: hidden;
        }

        .tarjeta-foto {
            position: relative;
            overflow: hidden;
        }

        .tarjeta-foto img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .tarjeta-contenido {
            position: relative;
        }

        .btn-ver-alojamiento {
            cursor: pointer;
        }


        /* ==================================================
           ADVERTENCIA DE HUÉSPEDES
           ================================================== */

        .advertencia-huespedes {
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #e2b93b;
            border-radius: 8px;
            background: #fff8d8;
            color: #5f4d00;
            font-size: 14px;
        }

        .advertencia-huespedes p {
            margin: 0 0 8px;
        }

        .advertencia-huespedes label {
            display: flex;
            align-items: flex-start;
            gap: 7px;
            cursor: pointer;
        }

        .advertencia-huespedes input {
            margin-top: 3px;
        }


        /* ==================================================
           CALENDARIO
           ================================================== */

        .calendario-contenedor {
            margin: 12px 0 18px;
        }

        .calendario {
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
        }

        .calendario-cabecera {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            background: #fafafa;
            border-bottom: 1px solid #eee;
        }

        .calendario-cabecera button {
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 50%;
            background: #f1f1f1;
            cursor: pointer;
            font-size: 20px;
        }

        .calendario-titulo {
            font-weight: bold;
            text-transform: capitalize;
        }

        .calendario-semana,
        .calendario-dias {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .calendario-semana span {
            padding: 8px 2px;
            text-align: center;
            font-size: 12px;
            color: #777;
            font-weight: bold;
        }

        .dia-calendario {
            min-height: 42px;
            border: none;
            background: white;
            cursor: pointer;
            font-size: 14px;
        }

        .dia-calendario:hover {
            background: #fff1e3;
        }

        .dia-calendario.vacio {
            cursor: default;
        }

        .dia-calendario.pasado {
            color: #bbb;
            cursor: not-allowed;
            background: #fafafa;
        }

        .dia-calendario.entrada,
        .dia-calendario.salida {
            background: #f28c28;
            color: white;
            font-weight: bold;
        }

        .dia-calendario.rango {
            background: #ffe2c5;
        }

        .texto-calendario {
            margin-top: 8px;
            color: #777;
            font-size: 13px;
            text-align: center;
        }


        /* ==================================================
           RESPONSIVE
           ================================================== */

        @media (max-width: 600px) {

            .modal-alojamiento {
                padding: 0;
            }

            .modal-alojamiento-contenido {
                width: 100%;
                max-height: 100vh;
                border-radius: 0;
            }

            .modal-alojamiento-fotos {
                height: 300px;
            }

            .modal-alojamiento-info {
                padding: 20px;
            }

            .modal-caracteristicas-lista {
                grid-template-columns: 1fr;
            }

            .amenidades-lista {
                grid-template-columns: 1fr;
            }

            .visor-flecha {
                width: 38px;
                height: 38px;
                font-size: 29px;
            }

            .visor-anterior {
                left: 8px;
            }

            .visor-siguiente {
                right: 8px;
            }

        }

    `;

    document.head.appendChild(
        estilos
    );

}


// ==========================================================
// NORMALIZAR AMENIDADES
// ==========================================================

function normalizarAmenidades(
    valor
) {

    if (!valor) {
        return {};
    }

    if (
        typeof valor === "object" &&
        !Array.isArray(valor)
    ) {
        return valor;
    }

    if (
        typeof valor === "string"
    ) {

        try {

            const parsed =
                JSON.parse(valor);

            if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
            ) {
                return parsed;
            }

        } catch (error) {

            console.warn(
                "No se pudieron interpretar las amenidades:",
                error
            );

        }

    }

    return {};

}


// ==========================================================
// CONSTRUIR AMENIDADES
// ==========================================================

function construirAmenidadesHTML(
    amenidades
) {

    const datos =
        normalizarAmenidades(
            amenidades
        );

    const categorias = [

        {
            nombre: "Baño",

            items: [

                {
                    clave: "bide",
                    nombre: "Bidé",
                    icono: "🚿"
                }

            ]

        },

        {
            nombre:
                "Habitación y lavandería",

            items: [

                {
                    clave: "plancha",
                    nombre: "Plancha",
                    icono: "👕"
                },

                {
                    clave: "guardarropa",
                    nombre:
                        "Espacio para guardar ropa",
                    icono: "👔"
                }

            ]

        },

        {
            nombre: "Entretenimiento",

            items: [

                {
                    clave: "television",
                    nombre: "Televisión",
                    icono: "📺"
                }

            ]

        },

        {
            nombre:
                "Calefacción y refrigeración",

            items: [

                {
                    clave:
                        "aire_acondicionado",
                    nombre:
                        "Aire acondicionado",
                    icono: "❄️"
                }

            ]

        },

        {
            nombre:
                "Privacidad y seguridad",

            items: [

                {
                    clave:
                        "cerradura_habitacion",
                    nombre:
                        "Cerradura en la puerta de la habitación",
                    icono: "🔒"
                }

            ]

        },

        {
            nombre:
                "Internet y oficina",

            items: [

                {
                    clave: "wifi",
                    nombre: "Wifi",
                    icono: "📶"
                },

                {
                    clave: "area_trabajar",
                    nombre:
                        "Área para trabajar",
                    icono: "💻"
                }

            ]

        },

        {
            nombre:
                "Cocina y comedor",

            items: [

                {
                    clave: "cocina",
                    nombre: "Cocina",
                    icono: "🍳"
                },

                {
                    clave: "cafetera",
                    nombre: "Cafetera",
                    icono: "☕"
                },

                {
                    clave: "cafe",
                    nombre: "Café",
                    icono: "☕"
                }

            ]

        },

        {
            nombre:
                "Estacionamiento e instalaciones",

            items: [

                {
                    clave:
                        "estacionamiento",
                    nombre:
                        "Estacionamiento gratuito en las instalaciones",
                    icono: "🚗"
                }

            ]

        }

    ];


    let html = "";


    categorias.forEach(
        categoria => {

            const seleccionadas =
                categoria.items.filter(
                    item =>
                        datos[item.clave] === true
                );


            if (
                seleccionadas.length === 0
            ) {
                return;
            }


            html += `

                <div class="amenidades-categoria">

                    <h4>
                        ${categoria.nombre}
                    </h4>

                    <div class="amenidades-lista">

            `;


            seleccionadas.forEach(
                item => {

                    html += `

                        <div class="amenidad-item">

                            <span
                                class="amenidad-icono"
                            >
                                ${item.icono}
                            </span>

                            <span>
                                ${item.nombre}
                            </span>

                        </div>

                    `;

                }
            );


            html += `

                    </div>

                </div>

            `;

        }
    );


    if (!html) {
        return "";
    }


    return `

        <div class="modal-amenidades">

            <h3>
                Lo que ofrece este lugar
            </h3>

            ${html}

        </div>

    `;

}


// ==========================================================
// CREAR MODAL DEL ALOJAMIENTO
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
        "modal-alojamiento";


    modal.innerHTML = `

        <div class="modal-alojamiento-contenido">

            <button
                type="button"
                class="cerrar-modal-alojamiento"
                id="cerrarModalAlojamiento"
            >
                ×
            </button>

            <div
                id="modalAlojamientoFotos"
                class="modal-alojamiento-fotos"
            ></div>

            <div class="modal-alojamiento-info">

                <h2
                    id="modalAlojamientoNombre"
                ></h2>

                <div
                    id="modalAlojamientoUbicacion"
                    class="modal-alojamiento-ubicacion"
                ></div>

                <div
                    id="modalAlojamientoDescripcion"
                    class="modal-alojamiento-descripcion"
                ></div>

                <div
                    id="modalAlojamientoDatos"
                ></div>

                <div
                    id="modalAlojamientoPrecio"
                    class="modal-alojamiento-precio"
                ></div>

                <button
                    type="button"
                    id="btnSolicitarReserva"
                    class="btn-solicitar-reserva"
                >
                    Solicitar reserva
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            "cerrarModalAlojamiento"
        )
        .addEventListener(
            "click",
            cerrarModalAlojamiento
        );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                cerrarModalAlojamiento();

            }

        }
    );


    document
        .getElementById(
            "btnSolicitarReserva"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    alojamientoActual
                ) {

                    abrirReserva(
                        alojamientoActual
                    );

                }

            }
        );

}


// ==========================================================
// ABRIR MODAL DEL ALOJAMIENTO
// ==========================================================

function abrirModalAlojamiento(
    alojamiento,
    fotos = []
) {

    crearModalAlojamiento();


    alojamientoActual =
        alojamiento;


    fotosAlojamientoActual =
        fotos || [];


    indiceFotoActual = 0;


    const modal =
        document.getElementById(
            "modalAlojamiento"
        );

    const nombre =
        document.getElementById(
            "modalAlojamientoNombre"
        );

    const descripcion =
        document.getElementById(
            "modalAlojamientoDescripcion"
        );

    const ubicacion =
        document.getElementById(
            "modalAlojamientoUbicacion"
        );

    const datos =
        document.getElementById(
            "modalAlojamientoDatos"
        );

    const precio =
        document.getElementById(
            "modalAlojamientoPrecio"
        );


    nombre.textContent =
        alojamiento.nombre || "";


    descripcion.textContent =
        alojamiento.descripcion || "";


    if (
        alojamiento.ubicacion
    ) {

        ubicacion.innerHTML =
            `📍 ${alojamiento.ubicacion}`;

    } else {

        ubicacion.innerHTML = "";

    }


    const habitaciones =
        Number(
            alojamiento.habitaciones
        ) || 0;

    const camas =
        Number(
            alojamiento.camas
        ) || 0;

    const sofasCama =
        Number(
            alojamiento.sofas_cama
        ) || 0;

    const banos =
        Number(
            alojamiento.banos
        ) || 0;

    const maxHuespedes =
        Number(
            alojamiento.max_huespedes
        ) || 0;


    let caracteristicasHTML = `

        <div class="modal-caracteristicas">

            <h3>
                Características principales
            </h3>

            <div
                class="modal-caracteristicas-lista"
            >

    `;


    if (
        maxHuespedes > 0
    ) {

        caracteristicasHTML += `

            <div class="modal-caracteristica">

                <span
                    class="modal-caracteristica-icono"
                >
                    👥
                </span>

                <span>
                    Hasta
                    ${maxHuespedes}
                    personas
                </span>

            </div>

        `;

    }


    if (
        habitaciones > 0
    ) {

        caracteristicasHTML += `

            <div class="modal-caracteristica">

                <span
                    class="modal-caracteristica-icono"
                >
                    🛏️
                </span>

                <span>
                    ${habitaciones}
                    ${
                        habitaciones === 1
                            ? "habitación"
                            : "habitaciones"
                    }
                </span>

            </div>

        `;

    }


    if (
        camas > 0
    ) {

        caracteristicasHTML += `

            <div class="modal-caracteristica">

                <span
                    class="modal-caracteristica-icono"
                >
                    🛏️
                </span>

                <span>
                    ${camas}
                    ${
                        camas === 1
                            ? "cama"
                            : "camas"
                    }
                </span>

            </div>

        `;

    }


    if (
        sofasCama > 0
    ) {

        caracteristicasHTML += `

            <div class="modal-caracteristica">

                <span
                    class="modal-caracteristica-icono"
                >
                    🛋️
                </span>

                <span>
                    ${sofasCama}
                    ${
                        sofasCama === 1
                            ? "sofá cama"
                            : "sofás cama"
                    }
                </span>

            </div>

        `;

    }


    if (
        banos > 0
    ) {

        caracteristicasHTML += `

            <div class="modal-caracteristica">

                <span
                    class="modal-caracteristica-icono"
                >
                    🚿
                </span>

                <span>
                    ${banos}
                    ${
                        banos === 1
                            ? "baño"
                            : "baños"
                    }
                </span>

            </div>

        `;

    }


    caracteristicasHTML += `

            </div>

    `;


    if (
        alojamiento.tamano_camas &&
        String(
            alojamiento.tamano_camas
        ).trim() !== ""
    ) {

        caracteristicasHTML += `

            <div
                class="modal-tamano-camas"
            >

                🛏️

                <strong>
                    Tamaño de las camas:
                </strong>

                ${alojamiento.tamano_camas}

            </div>

        `;

    }


    caracteristicasHTML += `

        </div>

    `;


    const amenidadesHTML =
        construirAmenidadesHTML(
            alojamiento.amenidades
        );


    datos.innerHTML =
        caracteristicasHTML +
        amenidadesHTML;


    if (
        alojamiento.precio_base !== null &&
        alojamiento.precio_base !== undefined
    ) {

        precio.innerHTML = `

            <strong>
                Q${Number(
                    alojamiento.precio_base
                ).toFixed(2)}
            </strong>

            <span>
                por noche
            </span>

        `;

    } else {

        precio.innerHTML = "";

    }


    mostrarFotosModal(
        fotosAlojamientoActual
    );


    modal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

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


    modal.style.display =
        "none";


    document.body.style.overflow =
        "";


    cerrarVisorFotos();

}


// ==========================================================
// MOSTRAR FOTOS DEL MODAL
// ==========================================================

function mostrarFotosModal(
    fotos
) {

    const contenedor =
        document.getElementById(
            "modalAlojamientoFotos"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    if (
        !fotos ||
        fotos.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="sin-fotos">
                Sin fotografías disponibles
            </div>

        `;

        return;

    }


    const fotoPrincipal =
        fotos[0];


    const img =
        document.createElement("img");


    img.src =
        fotoPrincipal;


    img.alt =
        alojamientoActual &&
        alojamientoActual.nombre
            ? alojamientoActual.nombre
            : "Alojamiento";


    img.addEventListener(
        "click",
        function () {

            abrirVisorFotos(0);

        }
    );


    contenedor.appendChild(
        img
    );


    if (
        fotos.length > 1
    ) {

        const contador =
            document.createElement(
                "div"
            );

        contador.className =
            "contador-fotos-modal";

        contador.textContent =
            `1 / ${fotos.length}`;

        contenedor.appendChild(
            contador
        );


        const flechaAnterior =
            document.createElement(
                "button"
            );

        flechaAnterior.type =
            "button";

        flechaAnterior.className =
            "flecha-foto-modal flecha-foto-anterior";

        flechaAnterior.innerHTML =
            "‹";


        flechaAnterior.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                abrirVisorFotos(
                    fotos.length - 1
                );

            }
        );


        contenedor.appendChild(
            flechaAnterior
        );


        const flechaSiguiente =
            document.createElement(
                "button"
            );

        flechaSiguiente.type =
            "button";

        flechaSiguiente.className =
            "flecha-foto-modal flecha-foto-siguiente";

        flechaSiguiente.innerHTML =
            "›";


        flechaSiguiente.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                abrirVisorFotos(1);

            }
        );


        contenedor.appendChild(
            flechaSiguiente
        );

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


    visor.className =
        "visor-fotos";


    visor.innerHTML = `

        <button
            type="button"
            class="cerrar-visor-fotos"
            id="cerrarVisorFotos"
        >
            ×
        </button>

        <button
            type="button"
            class="visor-flecha visor-anterior"
            id="visorAnterior"
        >
            ‹
        </button>

        <img
            id="visorFotoPrincipal"
            src=""
            alt="Fotografía"
        >

        <button
            type="button"
            class="visor-flecha visor-siguiente"
            id="visorSiguiente"
        >
            ›
        </button>

        <div
            id="visorContador"
            class="visor-contador"
        ></div>

    `;


    document.body.appendChild(
        visor
    );


    document
        .getElementById(
            "cerrarVisorFotos"
        )
        .addEventListener(
            "click",
            cerrarVisorFotos
        );


    document
        .getElementById(
            "visorAnterior"
        )
        .addEventListener(
            "click",
            function () {

                cambiarFotoVisor(-1);

            }
        );


    document
        .getElementById(
            "visorSiguiente"
        )
        .addEventListener(
            "click",
            function () {

                cambiarFotoVisor(1);

            }
        );


    visor.addEventListener(
        "click",
        function (event) {

            if (
                event.target === visor
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
    indice
) {

    crearVisorFotos();


    if (
        !fotosAlojamientoActual ||
        fotosAlojamientoActual.length === 0
    ) {
        return;
    }


    indiceFotoActual =
        indice;


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


    actualizarVisorFoto();


    document.getElementById(
        "visorFotos"
    ).style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


// ==========================================================
// ACTUALIZAR VISOR
// ==========================================================

function actualizarVisorFoto() {

    const imagen =
        document.getElementById(
            "visorFotoPrincipal"
        );

    const contador =
        document.getElementById(
            "visorContador"
        );


    if (!imagen) {
        return;
    }


    imagen.src =
        fotosAlojamientoActual[
            indiceFotoActual
        ];


    imagen.alt =
        alojamientoActual &&
        alojamientoActual.nombre
            ? alojamientoActual.nombre
            : "Fotografía";


    if (contador) {

        contador.textContent =
            `${
                indiceFotoActual + 1
            } / ${
                fotosAlojamientoActual.length
            }`;

    }

}


// ==========================================================
// CAMBIAR FOTO
// ==========================================================

function cambiarFotoVisor(
    direccion
) {

    if (
        !fotosAlojamientoActual ||
        fotosAlojamientoActual.length === 0
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


    if (!visor) {
        return;
    }


    visor.style.display =
        "none";

}


// ==========================================================
// OBTENER FOTOS DEL ALOJAMIENTO
// ==========================================================

async function obtenerFotosAlojamiento(
    alojamientoId
) {

    try {

        const {
            data,
            error
        } =
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


        if (error) {

            console.error(
                "Error obteniendo fotografías:",
                error
            );

            return [];

        }


        if (!data) {
            return [];
        }


        const archivos =
            data.filter(
                archivo => {

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


        return archivos.map(
            archivo => {

                const {
                    data: urlData
                } =
                    clienteSupabase
                        .storage
                        .from(
                            "fotos-alojamientos"
                        )
                        .getPublicUrl(
                            `${alojamientoId}/${archivo.name}`
                        );


                return urlData.publicUrl;

            }
        );

    } catch (error) {

        console.error(
            "Error obteniendo fotos:",
            error
        );

        return [];

    }

}


// ==========================================================
// CARGAR ALOJAMIENTOS
// ==========================================================

async function cargarAlojamientos() {

    // IMPORTANTE:
    // El HTML actual utiliza listaAlojamientos.
    // El script anterior buscaba contenedorAlojamientos.

    const contenedor =
        document.getElementById(
            "listaAlojamientos"
        );


    if (!contenedor) {

        console.error(
            "No se encontró #listaAlojamientos."
        );

        return;

    }


    contenedor.innerHTML = `

        <p class="cargando-alojamientos">
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


        if (error) {

            console.error(
                "Error cargando alojamientos:",
                error
            );


            contenedor.innerHTML = `

                <p>
                    No se pudieron cargar los alojamientos.
                </p>

            `;

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            contenedor.innerHTML = `

                <p>
                    No hay alojamientos publicados actualmente.
                </p>

            `;

            return;

        }


        contenedor.innerHTML = "";


        for (
            const alojamiento
            of data
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
                "tarjeta-alojamiento";


            const fotoPrincipal =
                fotos.length > 0
                    ? fotos[0]
                    : "";


            tarjeta.innerHTML = `

                <div class="tarjeta-foto">

                    ${
                        fotoPrincipal
                            ?

                        `

                            <img
                                src="${fotoPrincipal}"
                                alt="${
                                    alojamiento.nombre ||
                                    "Alojamiento"
                                }"
                            >

                        `

                            :

                        `

                            <div class="sin-foto-tarjeta">
                                Sin fotografía
                            </div>

                        `
                    }

                </div>


                <div class="tarjeta-contenido">

                    <h3>
                        ${
                            alojamiento.nombre || ""
                        }
                    </h3>


                    ${
                        alojamiento.ubicacion

                            ?

                        `

                            <p class="tarjeta-ubicacion">

                                📍
                                ${
                                    alojamiento.ubicacion
                                }

                            </p>

                        `

                            :

                        ""
                    }


                    <p class="tarjeta-descripcion">

                        ${
                            alojamiento.descripcion ||
                            ""
                        }

                    </p>


                    <div class="tarjeta-pie">

                        <strong>
                            Q${
                                Number(
                                    alojamiento.precio_base || 0
                                ).toFixed(2)
                            }
                        </strong>

                        <span>
                            / noche
                        </span>

                    </div>


                    <button
                        type="button"
                        class="btn-ver-alojamiento"
                    >
                        Ver alojamiento
                    </button>

                </div>

            `;


            const boton =
                tarjeta.querySelector(
                    ".btn-ver-alojamiento"
                );


            boton.addEventListener(
                "click",
                function () {

                    abrirModalAlojamiento(
                        alojamiento,
                        fotos
                    );

                }
            );


            contenedor.appendChild(
                tarjeta
            );

        }

    } catch (error) {

        console.error(
            "Error inesperado cargando alojamientos:",
            error
        );


        contenedor.innerHTML = `

            <p>
                Ocurrió un error al cargar los alojamientos.
            </p>

        `;

    }

}


// ==========================================================
// ABRIR RESERVA
// ==========================================================

function abrirReserva(
    alojamiento
) {

    alojamientoActual = {

        ...alojamiento,

        precio_base:
            Number(
                alojamiento.precio_base
            ) || 0,

        precio_persona:
            Number(
                alojamiento.precio_persona
            ) || 0,

        personas_incluidas:
            Number(
                alojamiento.personas_incluidas
            ) || 0,

        max_huespedes:
            Number(
                alojamiento.max_huespedes
            ) || 0

    };


    const modal =
        document.getElementById(
            "ventanaReserva"
        );


    if (!modal) {

        console.error(
            "No se encontró #ventanaReserva."
        );

        return;

    }


    const nombre =
        document.getElementById(
            "nombreAlojamiento"
        );


    if (nombre) {

        nombre.textContent =
            alojamiento.nombre || "";

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


    const nombreCliente =
        document.getElementById(
            "nombre"
        );

    const telefono =
        document.getElementById(
            "telefono"
        );


    if (nombreCliente) {
        nombreCliente.value = "";
    }

    if (telefono) {
        telefono.value = "";
    }


    fechaEntradaSeleccionada =
        null;

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


    if (fechaIngreso) {
        fechaIngreso.value = "";
    }

    if (fechaSalida) {
        fechaSalida.value = "";
    }


    modal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";


    calendarioMes =
        new Date();


    renderizarCalendario();


    actualizarAdvertenciaHuespedes();

    actualizarPrecioReserva();

}


// ==========================================================
// CERRAR RESERVA
// ==========================================================

// Esta función se mantiene con este nombre
// porque el HTML actual usa:
// onclick="cerrarReserva()"

function cerrarReserva() {

    const modal =
        document.getElementById(
            "ventanaReserva"
        );


    if (!modal) {
        return;
    }


    modal.style.display =
        "none";


    document.body.style.overflow =
        "";

}


// Alias para compatibilidad
function cerrarModalReserva() {

    cerrarReserva();

}


// ==========================================================
// OBTENER FECHAS
// ==========================================================

function obtenerFechasReserva() {

    const entrada =
        document.getElementById(
            "fechaIngreso"
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
// FORMATO FECHA
// ==========================================================

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "";
    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 3
    ) {
        return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================================
// FECHA LOCAL EN FORMATO YYYY-MM-DD
// ==========================================================

function fechaLocalISO(
    fecha
) {

    const ano =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}


// ==========================================================
// CALCULAR NOCHES
// ==========================================================

function calcularNoches(
    fechaEntrada,
    fechaSalida
) {

    if (
        !fechaEntrada ||
        !fechaSalida
    ) {

        return 0;

    }


    const entrada =
        new Date(
            fechaEntrada +
            "T00:00:00"
        );

    const salida =
        new Date(
            fechaSalida +
            "T00:00:00"
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


    return noches > 0
        ? noches
        : 0;

}


// ==========================================================
// OBTENER CANTIDAD DE HUÉSPEDES
// ==========================================================

function obtenerCantidadHuespedes() {

    const elemento =
        document.getElementById(
            "personas"
        );


    if (!elemento) {
        return 1;
    }


    const cantidad =
        Number(
            elemento.value
        );


    if (
        !Number.isFinite(cantidad) ||
        cantidad < 1
    ) {

        return 1;

    }


    return Math.floor(
        cantidad
    );

}


// ==========================================================
// ADVERTENCIA DE HUÉSPEDES
// ==========================================================

function crearZonaAdvertenciaHuespedes() {

    const input =
        document.getElementById(
            "personas"
        );


    if (!input) {
        return null;
    }


    let zona =
        document.getElementById(
            "mensajeHuespedes"
        );


    if (zona) {
        return zona;
    }


    zona =
        document.createElement("div");


    zona.id =
        "mensajeHuespedes";


    input.parentNode.insertBefore(
        zona,
        input.nextSibling
    );


    return zona;

}


// ==========================================================
// ACTUALIZAR ADVERTENCIA
// ==========================================================

function actualizarAdvertenciaHuespedes() {

    const zona =
        crearZonaAdvertenciaHuespedes();


    if (!zona) {
        return;
    }


    const maximo =
        Number(
            alojamientoActual &&
            alojamientoActual.max_huespedes
        ) || 0;


    const cantidad =
        obtenerCantidadHuespedes();


    if (
        maximo > 0 &&
        cantidad > maximo
    ) {

        zona.innerHTML = `

            <div class="advertencia-huespedes">

                <p>

                    Este alojamiento permite
                    hasta
                    <strong>
                        ${maximo}
                    </strong>
                    personas.

                </p>

                <label>

                    <input
                        type="checkbox"
                        id="aceptarExcesoHuespedes"
                    >

                    <span>
                        Soy consciente de que estoy
                        solicitando una cantidad de
                        huéspedes superior a la permitida.
                    </span>

                </label>

            </div>

        `;

    } else {

        zona.innerHTML = "";

    }

}


// ==========================================================
// VALIDAR EXCESO DE HUÉSPEDES
// ==========================================================

function validarHuespedes() {

    if (!alojamientoActual) {
        return true;
    }


    const maximo =
        Number(
            alojamientoActual.max_huespedes
        ) || 0;


    const cantidad =
        obtenerCantidadHuespedes();


    if (
        maximo <= 0 ||
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
            "La cantidad de huéspedes supera el límite indicado para este alojamiento. Debe confirmar que es consciente de ello antes de continuar."
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
        return 0;
    }


    const fechas =
        obtenerFechasReserva();


    const noches =
        calcularNoches(
            fechas.entrada,
            fechas.salida
        );


    const personas =
        obtenerCantidadHuespedes();


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


    const personasExtra =
        Math.max(
            personas -
            personasIncluidas,
            0
        );


    const precioPorNoche =
        precioBase +
        (
            personasExtra *
            precioPersona
        );


    return (
        precioPorNoche *
        noches
    );

}


// ==========================================================
// ACTUALIZAR PRECIO
// ==========================================================

function actualizarPrecioReserva() {

    const elemento =
        document.getElementById(
            "precioTotal"
        );


    const nochesElemento =
        document.getElementById(
            "cantidadNoches"
        );


    if (!elemento) {
        return;
    }


    const fechas =
        obtenerFechasReserva();


    const noches =
        calcularNoches(
            fechas.entrada,
            fechas.salida
        );


    const precio =
        calcularPrecioReserva();


    if (nochesElemento) {

        nochesElemento.textContent =
            noches;

    }


    elemento.textContent =
        `Q${precio.toFixed(2)}`;

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


        if (
            data &&
            data.disponible === true
        ) {

            return true;

        }


        return false;

    } catch (error) {

        console.error(
            "Error verificando disponibilidad:",
            error
        );

        return false;

    }

}


// ==========================================================
// ENVIAR WHATSAPP
// ==========================================================

// Esta función se mantiene exactamente con este nombre
// porque el HTML actual utiliza:
// onclick="enviarWhatsApp()"

async function enviarWhatsApp() {

    if (!alojamientoActual) {

        alert(
            "No se ha seleccionado ningún alojamiento."
        );

        return;

    }


    if (
        !validarHuespedes()
    ) {

        return;

    }


    const nombre =
        document.getElementById(
            "nombre"
        )?.value.trim() || "";


    const telefono =
        document.getElementById(
            "telefono"
        )?.value.trim() || "";


    const fechas =
        obtenerFechasReserva();


    const personas =
        obtenerCantidadHuespedes();


    if (!nombre) {

        alert(
            "Por favor, ingrese su nombre."
        );

        return;

    }


    if (!telefono) {

        alert(
            "Por favor, ingrese su número de teléfono."
        );

        return;

    }


    if (
        !fechas.entrada ||
        !fechas.salida
    ) {

        alert(
            "Por favor, seleccione las fechas de entrada y salida."
        );

        return;

    }


    const noches =
        calcularNoches(
            fechas.entrada,
            fechas.salida
        );


    if (
        noches <= 0
    ) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de entrada."
        );

        return;

    }


    const boton =
        document.querySelector(
            ".boton-whatsapp"
        );


    if (boton) {

        boton.disabled = true;

        boton.dataset.textoOriginal =
            boton.textContent;

        boton.textContent =
            "Verificando disponibilidad...";

    }


    try {

        const disponible =
            await verificarDisponibilidad(
                alojamientoActual.id,
                fechas.entrada,
                fechas.salida
            );


        if (!disponible) {

            alert(
                "Lo sentimos, el alojamiento no está disponible para las fechas seleccionadas."
            );

            return;

        }


        const precioTotal =
            calcularPrecioReserva();


        const mensaje =

            `Hola, quiero solicitar una reserva.%0A%0A` +

            `🏠 Alojamiento: ${
                alojamientoActual.nombre
            }%0A` +

            `📍 Ubicación: ${
                alojamientoActual.ubicacion ||
                "No indicada"
            }%0A` +

            `👤 Nombre: ${
                nombre
            }%0A` +

            `📞 Teléfono: ${
                telefono
            }%0A` +

            `📅 Entrada: ${
                formatearFecha(
                    fechas.entrada
                )
            }%0A` +

            `📅 Salida: ${
                formatearFecha(
                    fechas.salida
                )
            }%0A` +

            `🌙 Noches: ${
                noches
            }%0A` +

            `👥 Huéspedes: ${
                personas
            }%0A` +

            `💰 Total estimado: Q${
                precioTotal.toFixed(2)
            }%0A%0A` +

            `Quedo pendiente de confirmación.`;


        const url =
            `https://wa.me/50254134493?text=${mensaje}`;


        window.open(
            url,
            "_blank"
        );


    } finally {

        if (boton) {

            boton.disabled = false;

            boton.textContent =
                boton.dataset.textoOriginal ||
                "📱 Solicitar por WhatsApp";

        }

    }

}


// ==========================================================
// CALENDARIO
// ==========================================================

function renderizarCalendario() {

    const contenedor =
        document.getElementById(
            "contenedorCalendario"
        );


    if (!contenedor) {
        return;
    }


    const ano =
        calendarioMes.getFullYear();

    const mes =
        calendarioMes.getMonth();


    const primerDia =
        new Date(
            ano,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        );


    const diasMes =
        ultimoDia.getDate();


    let inicioSemana =
        primerDia.getDay();


    // Convertir domingo = 0
    // a lunes = 0
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


    let html = `

        <div class="calendario">

            <div class="calendario-cabecera">

                <button
                    type="button"
                    id="mesAnterior"
                >
                    ‹
                </button>

                <span class="calendario-titulo">
                    ${nombreMes}
                </span>

                <button
                    type="button"
                    id="mesSiguiente"
                >
                    ›
                </button>

            </div>

            <div class="calendario-semana">

                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>

            </div>

            <div class="calendario-dias">
    `;


    for (
        let i = 0;
        i < inicioSemana;
        i++
    ) {

        html += `

            <button
                type="button"
                class="dia-calendario vacio"
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
                ano,
                mes,
                dia
            );


        fecha.setHours(
            0,
            0,
            0,
            0
        );


        const fechaISO =
            fechaLocalISO(
                fecha
            );


        const esPasado =
            fecha < hoy;


        let clases =
            "dia-calendario";


        if (esPasado) {
            clases += " pasado";
        }


        if (
            fechaEntradaSeleccionada ===
            fechaISO
        ) {

            clases += " entrada";

        }


        if (
            fechaSalidaSeleccionada ===
            fechaISO
        ) {

            clases += " salida";

        }


        if (
            fechaEntradaSeleccionada &&
            fechaSalidaSeleccionada &&
            fechaISO >
                fechaEntradaSeleccionada &&
            fechaISO <
                fechaSalidaSeleccionada
        ) {

            clases += " rango";

        }


        html += `

            <button
                type="button"
                class="${clases}"
                data-fecha="${fechaISO}"
                ${
                    esPasado
                        ? "disabled"
                        : ""
                }
            >
                ${dia}
            </button>

        `;

    }


    html += `

            </div>

        </div>

        <div class="texto-calendario">

            ${
                fechaEntradaSeleccionada
                    ?

                fechaSalidaSeleccionada
                    ?

                `Entrada: ${
                    formatearFecha(
                        fechaEntradaSeleccionada
                    )
                } · Salida: ${
                    formatearFecha(
                        fechaSalidaSeleccionada
                    )
                }`

                    :

                `Seleccione la fecha de salida`

                    :

                `Seleccione la fecha de entrada`
            }

        </div>

    `;


    contenedor.innerHTML =
        html;


    const anterior =
        document.getElementById(
            "mesAnterior"
        );


    const siguiente =
        document.getElementById(
            "mesSiguiente"
        );


    if (anterior) {

        anterior.addEventListener(
            "click",
            function () {

                calendarioMes =
                    new Date(
                        ano,
                        mes - 1,
                        1
                    );

                renderizarCalendario();

            }
        );

    }


    if (siguiente) {

        siguiente.addEventListener(
            "click",
            function () {

                calendarioMes =
                    new Date(
                        ano,
                        mes + 1,
                        1
                    );

                renderizarCalendario();

            }
        );

    }


    const botones =
        contenedor.querySelectorAll(
            ".dia-calendario[data-fecha]"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                function () {

                    seleccionarFechaCalendario(
                        boton.dataset.fecha
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


    const entrada =
        document.getElementById(
            "fechaIngreso"
        );

    const salida =
        document.getElementById(
            "fechaSalida"
        );


    if (entrada) {

        entrada.value =
            fechaEntradaSeleccionada
                ? formatearFecha(
                    fechaEntradaSeleccionada
                )
                : "";

    }


    if (salida) {

        salida.value =
            fechaSalidaSeleccionada
                ? formatearFecha(
                    fechaSalidaSeleccionada
                )
                : "";

    }


    actualizarPrecioReserva();

    renderizarCalendario();

}


// ==========================================================
// CARGAR PORTADA
// ==========================================================

async function cargarPortada() {

    // El HTML actual utiliza clases:
    // .portada-fondo-a
    // .portada-fondo-b
    //
    // El script anterior buscaba IDs que no existen.

    const capa1 =
        document.querySelector(
            ".portada-fondo-a"
        );

    const capa2 =
        document.querySelector(
            ".portada-fondo-b"
        );


    if (
        !capa1 ||
        !capa2
    ) {

        console.warn(
            "No se encontraron las capas de la portada."
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
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


        if (error) {

            console.error(
                "Error cargando portada:",
                error
            );

            return;

        }


        if (!data) {
            return;
        }


        fotosPortada =
            data
                .filter(
                    archivo => {

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
                )
                .map(
                    archivo => {

                        const {
                            data: urlData
                        } =
                            clienteSupabase
                                .storage
                                .from(
                                    "fotos-alojamientos"
                                )
                                .getPublicUrl(
                                    `portada/${archivo.name}`
                                );


                        return urlData.publicUrl;

                    }
                );


        if (
            fotosPortada.length === 0
        ) {

            console.warn(
                "No hay fotografías en la carpeta portada."
            );

            return;

        }


        indicePortada = 0;


        capa1.style.backgroundImage =
            `url("${fotosPortada[0]}")`;


        capa2.style.backgroundImage =
            "";


        capa1.classList.add(
            "activa"
        );


        capa2.classList.remove(
            "activa"
        );


        if (
            fotosPortada.length === 1
        ) {

            return;

        }


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


    } catch (error) {

        console.error(
            "Error cargando portada:",
            error
        );

    }

}


// ==========================================================
// CAMBIAR FOTO PORTADA
// ==========================================================

function cambiarFotoPortada() {

    const capa1 =
        document.querySelector(
            ".portada-fondo-a"
        );

    const capa2 =
        document.querySelector(
            ".portada-fondo-b"
        );


    if (
        !capa1 ||
        !capa2 ||
        fotosPortada.length <= 1
    ) {

        return;

    }


    indicePortada =
        (
            indicePortada +
            1
        ) %
        fotosPortada.length;


    const siguiente =
        fotosPortada[
            indicePortada
        ];


    const capaActiva =
        capa1.classList.contains(
            "activa"
        )
            ? capa1
            : capa2;


    const capaSiguiente =
        capaActiva === capa1
            ? capa2
            : capa1;


    capaSiguiente.style.backgroundImage =
        `url("${siguiente}")`;


    capaSiguiente.classList.add(
        "activa"
    );


    capaActiva.classList.remove(
        "activa"
    );

}


// ==========================================================
// EVENTOS DEL FORMULARIO DE RESERVA
// ==========================================================

function configurarReserva() {

    const personas =
        document.getElementById(
            "personas"
        );


    if (personas) {

        personas.addEventListener(
            "input",
            function () {

                let valor =
                    Number(
                        personas.value
                    );


                if (
                    !Number.isFinite(valor) ||
                    valor < 1
                ) {

                    valor = 1;

                }


                if (valor > 50) {

                    valor = 50;

                }


                personas.value =
                    Math.floor(valor);


                actualizarAdvertenciaHuespedes();

                actualizarPrecioReserva();

            }
        );

    }


    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        );


    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        );


    if (fechaIngreso) {

        fechaIngreso.addEventListener(
            "click",
            function () {

                renderizarCalendario();

            }
        );

    }


    if (fechaSalida) {

        fechaSalida.addEventListener(
            "click",
            function () {

                renderizarCalendario();

            }
        );

    }


    const ventana =
        document.getElementById(
            "ventanaReserva"
        );


    if (ventana) {

        ventana.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === ventana
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
        function (event) {

            if (
                event.key === "Escape"
            ) {

                cerrarModalAlojamiento();

                cerrarReserva();

                cerrarVisorFotos();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                const visor =
                    document.getElementById(
                        "visorFotos"
                    );


                if (
                    visor &&
                    visor.style.display === "flex"
                ) {

                    cambiarFotoVisor(
                        -1
                    );

                }

            }


            if (
                event.key === "ArrowRight"
            ) {

                const visor =
                    document.getElementById(
                        "visorFotos"
                    );


                if (
                    visor &&
                    visor.style.display === "flex"
                ) {

                    cambiarFotoVisor(
                        1
                    );

                }

            }

        }
    );

}


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        insertarEstilosJavascript();

        crearModalAlojamiento();

        crearVisorFotos();

        configurarReserva();

        configurarTeclado();

        await cargarPortada();

        await cargarAlojamientos();

    }
);
