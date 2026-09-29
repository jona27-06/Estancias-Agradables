// ==========================================================
// ESTANCIAS AGRADABLES - SCRIPT COMPLETO
// ==========================================================


// ==========================================================
// SUPABASE
// ==========================================================

const SUPABASE_URL =
    "https://caodorogvcpupdajtbbp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YxWZ-YxE6".replace(
        "oWZ-YxWZ-YxE6",
        "oWZ-YxE6"
    );

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

let calendarioActual = null;

let calendarioMes = new Date();


// ==========================================================
// ESTILOS DEL MODAL
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

    estilos.innerHTML = `

        .modal-caracteristicas {
            margin-top: 24px;
        }

        .modal-caracteristicas h3,
        .modal-amenidades h3 {
            margin-bottom: 15px;
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
            padding: 10px 12px;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
            background: #fff;
            font-size: 14px;
            color: #333;
        }

        .modal-caracteristica-icono {
            font-size: 19px;
            min-width: 24px;
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

        @media (max-width: 600px) {

            .modal-caracteristicas-lista {
                grid-template-columns: 1fr;
            }

            .amenidades-lista {
                grid-template-columns: 1fr;
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
// SELECTOR DE HUÉSPEDES
// ==========================================================

function crearSelectorHuespedes() {

    const contenedor =
        document.getElementById(
            "selectorHuespedes"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = `

        <div class="selector-huespedes">

            <button
                type="button"
                class="btn-huesped-menos"
                id="btnHuespedMenos"
            >
                −
            </button>

            <span id="cantidadHuespedes">
                1
            </span>

            <button
                type="button"
                class="btn-huesped-mas"
                id="btnHuespedMas"
            >
                +
            </button>

        </div>

        <div
            id="mensajeHuespedes"
            class="mensaje-huespedes"
        ></div>

    `;


    let cantidad = 1;


    const elementoCantidad =
        document.getElementById(
            "cantidadHuespedes"
        );


    const btnMenos =
        document.getElementById(
            "btnHuespedMenos"
        );


    const btnMas =
        document.getElementById(
            "btnHuespedMas"
        );


    const mensaje =
        document.getElementById(
            "mensajeHuespedes"
        );


    function actualizar() {

        elementoCantidad.textContent =
            cantidad;


        btnMenos.disabled =
            cantidad <= 1;


        const maximo =
            alojamientoActual &&
            alojamientoActual.max_huespedes
                ? Number(
                    alojamientoActual.max_huespedes
                )
                : 0;


        if (
            maximo > 0 &&
            cantidad > maximo
        ) {

            mensaje.innerHTML = `

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

                        Soy consciente de que estoy
                        solicitando una cantidad de
                        huéspedes superior a la permitida.

                    </label>

                </div>

            `;

        } else {

            mensaje.innerHTML = "";

        }


        actualizarPrecioReserva();

    }


    btnMenos.addEventListener(
        "click",
        function () {

            if (
                cantidad > 1
            ) {

                cantidad--;

                actualizar();

            }

        }
    );


    btnMas.addEventListener(
        "click",
        function () {

            if (
                cantidad < 50
            ) {

                cantidad++;

                actualizar();

            }

        }
    );


    actualizar();

}


// ==========================================================
// OBTENER CANTIDAD DE HUÉSPEDES
// ==========================================================

function obtenerCantidadHuespedes() {

    const elemento =
        document.getElementById(
            "cantidadHuespedes"
        );


    if (!elemento) {
        return 1;
    }


    return Number(
        elemento.textContent
    ) || 1;

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


    const cerrar =
        document.getElementById(
            "cerrarModalAlojamiento"
        );


    cerrar.addEventListener(
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


    const btnReserva =
        document.getElementById(
            "btnSolicitarReserva"
        );


    btnReserva.addEventListener(
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


    insertarEstilosModalAlojamiento();

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

        ubicacion.innerHTML = `

            📍 ${alojamiento.ubicacion}

        `;

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
// CERRAR MODAL
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


    const visor =
        document.getElementById(
            "visorFotos"
        );


    if (visor) {

        visor.style.display =
            "none";

    }

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

    }


    if (
        fotos.length > 1
    ) {

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
// VISOR DE FOTOS
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


    document.getElementById(
        "cerrarVisorFotos"
    ).addEventListener(
        "click",
        cerrarVisorFotos
    );


    document.getElementById(
        "visorAnterior"
    ).addEventListener(
        "click",
        function () {

            cambiarFotoVisor(-1);

        }
    );


    document.getElementById(
        "visorSiguiente"
    ).addEventListener(
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
// CAMBIAR FOTO DEL VISOR
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


    document.body.style.overflow =
        "";

}


// ==========================================================
// OBTENER FOTOS DE UN ALOJAMIENTO
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

    const contenedor =
        document.getElementById(
            "contenedorAlojamientos"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = `

        <p class="cargando-alojamientos">
            Cargando alojamientos...
        </p>

    `;


    // ======================================================
    // CONSULTA
    // Se utiliza "*" para evitar problemas del schema cache
    // con las columnas nuevas.
    // ======================================================

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
                        alojamiento.descripcion
                            ?
                        alojamiento.descripcion
                            :
                        ""
                    }

                </p>


                <div class="tarjeta-pie">

                    <strong>

                        Q${
                            Number(
                                alojamiento.precio_base ||
                                0
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


    const modalReserva =
        document.getElementById(
            "modalReserva"
        );


    if (!modalReserva) {

        console.error(
            "No se encontró el modal de reserva."
        );

        return;

    }


    modalReserva.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";


    const nombre =
        document.getElementById(
            "nombreAlojamientoReserva"
        );


    if (nombre) {

        nombre.textContent =
            alojamiento.nombre || "";

    }


    const selector =
        document.getElementById(
            "selectorHuespedes"
        );


    if (selector) {

        crearSelectorHuespedes();

    }


    actualizarPrecioReserva();

}


// ==========================================================
// CERRAR MODAL RESERVA
// ==========================================================

function cerrarModalReserva() {

    const modal =
        document.getElementById(
            "modalReserva"
        );


    if (!modal) {
        return;
    }


    modal.style.display =
        "none";


    document.body.style.overflow =
        "";

}


// ==========================================================
// OBTENER FECHAS
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
// ACTUALIZAR PRECIO DE RESERVA
// ==========================================================

function actualizarPrecioReserva() {

    const elemento =
        document.getElementById(
            "precioTotalReserva"
        );


    if (!elemento) {
        return;
    }


    const precio =
        calcularPrecioReserva();


    elemento.textContent =
        `Q${precio.toFixed(2)}`;

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
// ENVIAR RESERVA POR WHATSAPP
// ==========================================================

function enviarReservaWhatsApp() {

    if (!alojamientoActual) {
        return;
    }


    if (
        !validarHuespedes()
    ) {

        return;

    }


    const nombre =
        document.getElementById(
            "nombreReserva"
        )?.value.trim() || "";


    const telefono =
        document.getElementById(
            "telefonoReserva"
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
            fechas.entrada
        }%0A` +

        `📅 Salida: ${
            fechas.salida
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

}


// ==========================================================
// CARGAR PORTADA
// ==========================================================

async function cargarPortada() {

    const capa1 =
        document.getElementById(
            "portadaFondo1"
        );


    const capa2 =
        document.getElementById(
            "portadaFondo2"
        );


    if (
        !capa1 ||
        !capa2
    ) {

        console.warn(
            "No se encontraron los elementos de la portada."
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
                        limit: 100
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

            return;

        }


        indicePortada = 0;


        capa1.style.backgroundImage =
            `url("${fotosPortada[0]}")`;


        capa1.classList.add(
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
        document.getElementById(
            "portadaFondo1"
        );


    const capa2 =
        document.getElementById(
            "portadaFondo2"
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
// INICIALIZACIÓN
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        crearModalAlojamiento();

        crearVisorFotos();

        cargarPortada();

        cargarAlojamientos();


        const cerrarReserva =
            document.getElementById(
                "cerrarModalReserva"
            );


        if (
            cerrarReserva
        ) {

            cerrarReserva.addEventListener(
                "click",
                cerrarModalReserva
            );

        }


        const btnEnviar =
            document.getElementById(
                "btnEnviarReserva"
            );


        if (
            btnEnviar
        ) {

            btnEnviar.addEventListener(
                "click",
                async function () {

                    if (
                        !validarHuespedes()
                    ) {

                        return;

                    }


                    if (
                        !alojamientoActual
                    ) {

                        alert(
                            "No se ha seleccionado ningún alojamiento."
                        );

                        return;

                    }


                    const fechas =
                        obtenerFechasReserva();


                    if (
                        !fechas.entrada ||
                        !fechas.salida
                    ) {

                        alert(
                            "Por favor, seleccione las fechas."
                        );

                        return;

                    }


                    const disponible =
                        await verificarDisponibilidad(
                            alojamientoActual.id,
                            fechas.entrada,
                            fechas.salida
                        );


                    if (
                        !disponible
                    ) {

                        alert(
                            "Lo sentimos, el alojamiento no está disponible para las fechas seleccionadas."
                        );

                        return;

                    }


                    enviarReservaWhatsApp();

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


        if (
            fechaEntrada
        ) {

            fechaEntrada.addEventListener(
                "change",
                actualizarPrecioReserva
            );

        }


        if (
            fechaSalida
        ) {

            fechaSalida.addEventListener(
                "change",
                actualizarPrecioReserva
            );

        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    cerrarModalAlojamiento();

                    cerrarModalReserva();

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
);
