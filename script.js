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
// VARIABLES GENERALES
// ==========================================================

let alojamientoActual = null;

let fotosAlojamiento = [];
let indiceFotoAlojamiento = 0;

let fotosPortada = [];
let indicePortada = 0;
let intervaloPortada = null;

let solicitudPersonasExtra = null;


// ==========================================================
// VARIABLES DEL CALENDARIO
// ==========================================================

let fechasBloqueadas = new Set();

let fechaIngresoSeleccionada = null;
let fechaSalidaSeleccionada = null;

let mesCalendarioActual = new Date();

let modoCalendario = "ingreso";

let disponibilidadVerificada = false;
let cargandoDisponibilidad = false;

let calendarioReserva = null;
let calendarioInicializado = false;


// ==========================================================
// ESTILOS DEL CALENDARIO
// ==========================================================

function insertarEstilosCalendario() {

    if (
        document.getElementById(
            "estancias-calendario-estilos"
        )
    ) {
        return;
    }

    const estilos =
        document.createElement("style");

    estilos.id =
        "estancias-calendario-estilos";

    estilos.textContent = `

        #calendarioReserva {
            width: 100%;
            margin-top: 15px;
            padding: 16px;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 14px;
            box-sizing: border-box;
            box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        .calendario-cabecera {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 15px;
        }

        .calendario-mes {
            flex: 1;
            text-align: center;
            font-size: 17px;
            font-weight: 700;
            text-transform: capitalize;
        }

        .calendario-nav {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            background: #f5f5f5;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .calendario-nav:hover:not(:disabled) {
            background: #eeeeee;
        }

        .calendario-nav:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        .calendario-semana {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 3px;
            margin-bottom: 5px;
        }

        .calendario-dia-semana {
            text-align: center;
            font-size: 12px;
            font-weight: 700;
            color: #777;
            padding: 5px 0;
        }

        .calendario-dias {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 3px;
        }

        .calendario-dia {
            position: relative;
            min-height: 40px;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        .calendario-dia:hover:not(:disabled) {
            background: #fff1e3;
        }

        .calendario-dia.vacio {
            cursor: default;
        }

        .calendario-dia.pasado {
            color: #c7c7c7;
            cursor: not-allowed;
        }

        .calendario-dia.bloqueado {
            background: #e1e1e1;
            color: #999;
            cursor: not-allowed;
            text-decoration: line-through;
        }

        .calendario-dia.bloqueado:hover {
            background: #e1e1e1;
        }

        .calendario-dia.hoy {
            font-weight: 700;
            box-shadow: inset 0 0 0 1.5px #f28c28;
        }

        .calendario-dia.en-rango {
            background: #ffe4ca;
            border-radius: 0;
        }

        .calendario-dia.ingreso,
        .calendario-dia.salida {
            background: #f28c28;
            color: #ffffff;
            font-weight: 700;
            border-radius: 50%;
            z-index: 2;
        }

        .calendario-dia.ingreso.en-rango,
        .calendario-dia.salida.en-rango {
            background: #f28c28;
            border-radius: 50%;
        }

        .calendario-mensaje {
            margin-top: 13px;
            padding: 9px 10px;
            border-radius: 8px;
            background: #f7f7f7;
            color: #666;
            font-size: 12px;
            text-align: center;
        }

        .calendario-mensaje.error {
            background: #fff0f0;
            color: #b42318;
        }

        .calendario-mensaje.ok {
            background: #fff4e8;
            color: #b65f0b;
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

        .leyenda-cuadro {
            width: 13px;
            height: 13px;
            border-radius: 4px;
            display: inline-block;
        }

        .leyenda-disponible {
            background: #ffffff;
            border: 1px solid #ddd;
        }

        .leyenda-bloqueado {
            background: #e1e1e1;
        }

        .leyenda-seleccionado {
            background: #f28c28;
            border-radius: 50%;
        }

        .leyenda-rango {
            background: #ffe4ca;
        }

        @media (max-width: 480px) {

            #calendarioReserva {
                padding: 12px;
            }

            .calendario-dia {
                min-height: 37px;
                font-size: 13px;
            }

            .calendario-mes {
                font-size: 16px;
            }

        }
    `;

    document.head.appendChild(estilos);
}


// ==========================================================
// FUNCIONES DE FECHAS
// ==========================================================

function obtenerHoyISO() {

    const hoy = new Date();

    return `${hoy.getFullYear()}-${String(
        hoy.getMonth() + 1
    ).padStart(2, "0")}-${String(
        hoy.getDate()
    ).padStart(2, "0")}`;
}


function fechaISO(fecha) {

    return `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(
        fecha.getDate()
    ).padStart(2, "0")}`;
}


function crearFechaLocal(iso) {

    if (
        !iso ||
        !/^\d{4}-\d{2}-\d{2}$/.test(iso)
    ) {
        return null;
    }

    const partes = iso.split("-");

    return new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );
}


function sumarDiasISO(iso, cantidad) {

    const fecha = crearFechaLocal(iso);

    if (!fecha) {
        return null;
    }

    fecha.setDate(
        fecha.getDate() + cantidad
    );

    return fechaISO(fecha);
}


function formatearFechaVisible(iso) {

    const fecha = crearFechaLocal(iso);

    if (!fecha) {
        return "";
    }

    return fecha.toLocaleDateString(
        "es-GT",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


function esFechaPasada(iso) {

    return iso < obtenerHoyISO();
}


function rangoTieneBloqueo(
    inicio,
    salida
) {

    if (!inicio || !salida) {
        return false;
    }

    let fecha = inicio;

    while (fecha < salida) {

        if (
            fechasBloqueadas.has(fecha)
        ) {
            return true;
        }

        fecha =
            sumarDiasISO(
                fecha,
                1
            );
    }

    return false;
}


// ==========================================================
// PORTADA
// ==========================================================

async function obtenerFotosPortada() {

    try {

        const { data, error } =
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
                "Error obteniendo fotos de portada:",
                error
            );

            return [];
        }

        if (!data) {
            return [];
        }

        const extensionesPermitidas = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".avif"
        ];

        const archivos =
            data.filter(
                archivo => {

                    if (
                        !archivo ||
                        !archivo.name
                    ) {
                        return false;
                    }

                    const nombre =
                        archivo.name.toLowerCase();

                    return extensionesPermitidas.some(
                        extension =>
                            nombre.endsWith(
                                extension
                            )
                    );
                }
            );

        return archivos.map(
            archivo => {

                const { data: urlData } =
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

    } catch (error) {

        console.error(
            "Error cargando portada:",
            error
        );

        return [];
    }
}


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

        console.error(
            "No se encontraron los elementos de la portada."
        );

        return;
    }

    fotosPortada =
        await obtenerFotosPortada();

    if (!fotosPortada.length) {

        fondoA.style.backgroundImage =
            "none";

        fondoB.style.backgroundImage =
            "none";

        return;
    }

    indicePortada = 0;

    fondoA.style.backgroundImage =
        `url("${fotosPortada[0]}")`;

    fondoA.style.opacity = "1";

    fondoB.style.opacity = "0";

    crearIndicadoresPortada();

    if (
        fotosPortada.length > 1
    ) {

        if (intervaloPortada) {
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

    const contenedor =
        document.getElementById(
            "indicadoresPortada"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    const cantidadVisible =
        Math.min(
            fotosPortada.length,
            3
        );

    for (
        let i = 0;
        i < cantidadVisible;
        i++
    ) {

        const indicador =
            document.createElement(
                "span"
            );

        indicador.className =
            "indicador-portada";

        if (i === 0) {
            indicador.classList.add(
                "activo"
            );
        }

        contenedor.appendChild(
            indicador
        );
    }
}


function actualizarIndicadoresPortada() {

    const indicadores =
        document.querySelectorAll(
            ".indicador-portada"
        );

    indicadores.forEach(
        (indicador, index) => {

            indicador.classList.toggle(
                "activo",
                index ===
                    Math.min(
                        indicePortada,
                        2
                    )
            );
        }
    );
}


function cambiarFotoPortada() {

    if (
        fotosPortada.length < 2
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

    const siguiente =
        (
            indicePortada + 1
        ) %
        fotosPortada.length;

    const mostrandoA =
        fondoA.style.opacity !== "0";

    const fondoEntrante =
        mostrandoA
            ? fondoB
            : fondoA;

    const fondoSaliente =
        mostrandoA
            ? fondoA
            : fondoB;

    fondoEntrante.style.backgroundImage =
        `url("${fotosPortada[siguiente]}")`;

    fondoEntrante.style.opacity =
        "1";

    fondoSaliente.style.opacity =
        "0";

    indicePortada =
        siguiente;

    actualizarIndicadoresPortada();
}


// ==========================================================
// FOTOS DE ALOJAMIENTO
// ==========================================================

async function obtenerFotos(
    idAlojamiento
) {

    try {

        const { data, error } =
            await clienteSupabase
                .storage
                .from(
                    "fotos-alojamientos"
                )
                .list(
                    String(idAlojamiento),
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

        if (!data) {
            return [];
        }

        const extensionesPermitidas = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".avif"
        ];

        return data
            .filter(
                archivo => {

                    const nombre =
                        archivo.name.toLowerCase();

                    return extensionesPermitidas.some(
                        extension =>
                            nombre.endsWith(
                                extension
                            )
                    );
                }
            )
            .map(
                archivo => {

                    const { data: urlData } =
                        clienteSupabase
                            .storage
                            .from(
                                "fotos-alojamientos"
                            )
                            .getPublicUrl(
                                `${idAlojamiento}/${archivo.name}`
                            );

                    return urlData.publicUrl;
                }
            );

    } catch (error) {

        console.error(
            "Error obteniendo fotografías:",
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
            "listaAlojamientos"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        "<p>Cargando alojamientos...</p>";

    try {

        const { data, error } =
            await clienteSupabase
                .from(
                    "alojamientos"
                )
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
                    publicado,
                    created_at
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

        if (error) {

            console.error(error);

            contenedor.innerHTML =
                "<p>No se pudieron cargar los alojamientos.</p>";

            return;
        }

        if (
            !data ||
            data.length === 0
        ) {

            contenedor.innerHTML =
                "<p>No hay alojamientos publicados actualmente.</p>";

            return;
        }

        contenedor.innerHTML = "";

        for (
            const alojamiento of data
        ) {

            const fotos =
                await obtenerFotos(
                    alojamiento.id
                );

            /*
             * ==================================================
             * IMPORTANTE:
             * ESTA ES LA PARTE QUE ESTABA ROMPIENDO LOS ANUNCIOS.
             *
             * Ahora utilizamos "alojamiento" como clase principal
             * para que vuelva a utilizar el diseño original.
             * ==================================================
             */

            const tarjeta =
                document.createElement(
                    "article"
                );

            tarjeta.className =
                "alojamiento tarjeta-alojamiento";

            const imagenPrincipal =
                fotos.length
                    ? fotos[0]
                    : "";

            tarjeta.innerHTML = `

                <div class="imagen-alojamiento">

                    ${
                        imagenPrincipal
                            ? `
                                <img
                                    src="${imagenPrincipal}"
                                    alt="${escapeHTML(
                                        alojamiento.nombre || ""
                                    )}"
                                >
                            `
                            : `
                                <div class="sin-imagen">
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

                <div class="alojamiento-info contenido-tarjeta">

                    <h3>
                        ${escapeHTML(
                            alojamiento.nombre || ""
                        )}
                    </h3>

                    ${
                        alojamiento.ubicacion
                            ? `
                                <p class="ubicacion">
                                    📍 ${escapeHTML(
                                        alojamiento.ubicacion
                                    )}
                                </p>
                            `
                            : ""
                    }

                    <p>
                        ${escapeHTML(
                            alojamiento.descripcion || ""
                        )}
                    </p>

                    <button
                        class="boton-principal"
                        type="button"
                    >
                        Ver alojamiento
                    </button>

                </div>
            `;

            const boton =
                tarjeta.querySelector(
                    ".boton-principal"
                );

            if (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        abrirModalAlojamiento(
                            alojamiento,
                            fotos
                        );
                    }
                );
            }

            /*
             * Evita que una clase agregada por el
             * calendario o por otro elemento cambie
             * la distribución de las tarjetas.
             */

            contenedor.appendChild(
                tarjeta
            );
        }

    } catch (error) {

        console.error(
            "Error cargando alojamientos:",
            error
        );

        contenedor.innerHTML =
            "<p>Ocurrió un error al cargar los alojamientos.</p>";
    }
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
// MODAL DEL ALOJAMIENTO
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
        document.createElement(
            "div"
        );

    modal.id =
        "modalAlojamiento";

    modal.className =
        "modal modal-alojamiento";

    modal.innerHTML = `

        <div class="modal-contenido modal-detalle">

            <button
                class="cerrar"
                type="button"
                aria-label="Cerrar"
            >
                ×
            </button>

            <div class="galeria-alojamiento">

                <button
                    class="galeria-flecha galeria-anterior"
                    type="button"
                >
                    ‹
                </button>

                <img
                    id="imagenGaleriaAlojamiento"
                    src=""
                    alt=""
                >

                <button
                    class="galeria-flecha galeria-siguiente"
                    type="button"
                >
                    ›
                </button>

                <div
                    id="contadorGaleriaAlojamiento"
                    class="contador-galeria"
                ></div>

            </div>

            <div class="detalle-info">

                <h2 id="detalleNombre"></h2>

                <p
                    id="detalleUbicacion"
                    class="detalle-ubicacion"
                ></p>

                <p
                    id="detalleDescripcion"
                    class="detalle-descripcion"
                ></p>

                <div
                    id="detalleCaracteristicas"
                    class="detalle-caracteristicas"
                ></div>

                <button
                    id="botonAbrirReserva"
                    class="boton-principal"
                    type="button"
                >
                    Solicitar reserva
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    modal
        .querySelector(".cerrar")
        .addEventListener(
            "click",
            cerrarModalAlojamiento
        );

    modal
        .querySelector(".galeria-anterior")
        .addEventListener(
            "click",
            fotoAnterior
        );

    modal
        .querySelector(".galeria-siguiente")
        .addEventListener(
            "click",
            fotoSiguiente
        );

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                cerrarModalAlojamiento();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            const modalActual =
                document.getElementById(
                    "modalAlojamiento"
                );

            if (
                !modalActual ||
                !modalActual.classList.contains(
                    "activo"
                )
            ) {
                return;
            }

            if (
                event.key === "Escape"
            ) {
                cerrarModalAlojamiento();
            }

            if (
                event.key === "ArrowLeft"
            ) {
                fotoAnterior();
            }

            if (
                event.key === "ArrowRight"
            ) {
                fotoSiguiente();
            }
        }
    );
}


function abrirModalAlojamiento(
    alojamiento,
    fotos
) {

    crearModalAlojamiento();

    alojamientoActual = {
        ...alojamiento
    };

    fotosAlojamiento =
        fotos || [];

    indiceFotoAlojamiento =
        0;

    const modal =
        document.getElementById(
            "modalAlojamiento"
        );

    document.getElementById(
        "detalleNombre"
    ).textContent =
        alojamiento.nombre || "";

    document.getElementById(
        "detalleUbicacion"
    ).textContent =
        alojamiento.ubicacion
            ? `📍 ${alojamiento.ubicacion}`
            : "";

    document.getElementById(
        "detalleDescripcion"
    ).textContent =
        alojamiento.descripcion || "";

    document.getElementById(
        "detalleCaracteristicas"
    ).innerHTML = `

        <div>
            🛏️
            <strong>
                ${alojamiento.habitaciones ?? 0}
            </strong>
            habitaciones
        </div>

        <div>
            🚿
            <strong>
                ${alojamiento.banos ?? 0}
            </strong>
            baños
        </div>

        <div>
            👥
            Hasta
            <strong>
                ${alojamiento.max_huespedes ?? 0}
            </strong>
            huéspedes
        </div>
    `;

    actualizarGaleria();

    document.getElementById(
        "botonAbrirReserva"
    ).onclick =
        abrirReserva;

    modal.classList.add(
        "activo"
    );

    document.body.classList.add(
        "sin-scroll"
    );
}


function cerrarModalAlojamiento() {

    const modal =
        document.getElementById(
            "modalAlojamiento"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "activo"
    );

    document.body.classList.remove(
        "sin-scroll"
    );
}


function actualizarGaleria() {

    const imagen =
        document.getElementById(
            "imagenGaleriaAlojamiento"
        );

    const contador =
        document.getElementById(
            "contadorGaleriaAlojamiento"
        );

    const anterior =
        document.querySelector(
            ".galeria-anterior"
        );

    const siguiente =
        document.querySelector(
            ".galeria-siguiente"
        );

    if (!imagen) {
        return;
    }

    if (
        !fotosAlojamiento.length
    ) {

        imagen.style.display =
            "none";

        contador.textContent =
            "Sin fotografías";

        anterior.style.display =
            "none";

        siguiente.style.display =
            "none";

        return;
    }

    imagen.style.display =
        "block";

    imagen.src =
        fotosAlojamiento[
            indiceFotoAlojamiento
        ];

    imagen.alt =
        alojamientoActual?.nombre ||
        "";

    contador.textContent =
        `${indiceFotoAlojamiento + 1} / ${fotosAlojamiento.length}`;

    anterior.style.display =
        fotosAlojamiento.length > 1
            ? "flex"
            : "none";

    siguiente.style.display =
        fotosAlojamiento.length > 1
            ? "flex"
            : "none";
}


function fotoAnterior() {

    if (
        !fotosAlojamiento.length
    ) {
        return;
    }

    indiceFotoAlojamiento--;

    if (
        indiceFotoAlojamiento < 0
    ) {

        indiceFotoAlojamiento =
            fotosAlojamiento.length - 1;
    }

    actualizarGaleria();
}


function fotoSiguiente() {

    if (
        !fotosAlojamiento.length
    ) {
        return;
    }

    indiceFotoAlojamiento++;

    if (
        indiceFotoAlojamiento >=
        fotosAlojamiento.length
    ) {

        indiceFotoAlojamiento =
            0;
    }

    actualizarGaleria();
}


// ==========================================================
// CALENDARIO
// ==========================================================

function configurarCalendarioReserva() {

    if (
        calendarioInicializado
    ) {
        return;
    }

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

        console.error(
            "No se encontraron los campos de fechas."
        );

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
        "Seleccione la fecha";

    fechaSalida.placeholder =
        "Seleccione la fecha";

    fechaIngreso.style.cursor =
        "pointer";

    fechaSalida.style.cursor =
        "pointer";

    calendarioReserva =
        document.createElement(
            "div"
        );

    calendarioReserva.id =
        "calendarioReserva";

    calendarioReserva.style.display =
        "none";

    calendarioReserva.innerHTML = `

        <div class="calendario-cabecera">

            <button
                id="calendarioMesAnterior"
                class="calendario-nav"
                type="button"
            >
                ‹
            </button>

            <div
                id="calendarioMes"
                class="calendario-mes"
            ></div>

            <button
                id="calendarioMesSiguiente"
                class="calendario-nav"
                type="button"
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
        ></div>

        <div
            id="calendarioMensaje"
            class="calendario-mensaje"
        >
            Seleccione una fecha de ingreso.
        </div>

        <div class="calendario-leyenda">

            <div class="calendario-leyenda-item">
                <span class="leyenda-cuadro leyenda-disponible"></span>
                Disponible
            </div>

            <div class="calendario-leyenda-item">
                <span class="leyenda-cuadro leyenda-bloqueado"></span>
                No disponible
            </div>

            <div class="calendario-leyenda-item">
                <span class="leyenda-cuadro leyenda-seleccionado"></span>
                Seleccionado
            </div>

            <div class="calendario-leyenda-item">
                <span class="leyenda-cuadro leyenda-rango"></span>
                Estadía
            </div>

        </div>
    `;

    fechaSalida.insertAdjacentElement(
        "afterend",
        calendarioReserva
    );

    fechaIngreso.onclick =
        function () {

            modoCalendario =
                "ingreso";

            mostrarCalendario();

            renderizarCalendario();
        };

    fechaSalida.onclick =
        function () {

            modoCalendario =
                "salida";

            mostrarCalendario();

            renderizarCalendario();
        };

    document.getElementById(
        "calendarioMesAnterior"
    ).onclick =
        function () {

            cambiarMesCalendario(
                -1
            );
        };

    document.getElementById(
        "calendarioMesSiguiente"
    ).onclick =
        function () {

            cambiarMesCalendario(
                1
            );
        };

    calendarioInicializado =
        true;
}


function mostrarCalendario() {

    if (!calendarioReserva) {
        return;
    }

    calendarioReserva.style.display =
        "block";
}


function ocultarCalendario() {

    if (!calendarioReserva) {
        return;
    }

    calendarioReserva.style.display =
        "none";
}


function cambiarMesCalendario(
    cantidad
) {

    const nuevoMes =
        new Date(
            mesCalendarioActual.getFullYear(),
            mesCalendarioActual.getMonth() +
                cantidad,
            1
        );

    const mesActual =
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

    if (
        nuevoMes < mesActual
    ) {
        return;
    }

    mesCalendarioActual =
        nuevoMes;

    renderizarCalendario();
}


function renderizarCalendario() {

    if (!calendarioReserva) {
        return;
    }

    const titulo =
        document.getElementById(
            "calendarioMes"
        );

    const contenedor =
        document.getElementById(
            "calendarioDias"
        );

    const mensaje =
        document.getElementById(
            "calendarioMensaje"
        );

    const botonAnterior =
        document.getElementById(
            "calendarioMesAnterior"
        );

    if (
        !titulo ||
        !contenedor ||
        !mensaje
    ) {
        return;
    }

    const año =
        mesCalendarioActual.getFullYear();

    const mes =
        mesCalendarioActual.getMonth();

    titulo.textContent =
        mesCalendarioActual.toLocaleDateString(
            "es-GT",
            {
                month: "long",
                year: "numeric"
            }
        );

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

    let posicionPrimerDia =
        primerDia.getDay();

    posicionPrimerDia =
        posicionPrimerDia === 0
            ? 6
            : posicionPrimerDia - 1;

    const cantidadDias =
        ultimoDia.getDate();

    contenedor.innerHTML =
        "";

    for (
        let i = 0;
        i < posicionPrimerDia;
        i++
    ) {

        const vacio =
            document.createElement(
                "div"
            );

        vacio.className =
            "calendario-dia vacio";

        contenedor.appendChild(
            vacio
        );
    }

    for (
        let dia = 1;
        dia <= cantidadDias;
        dia++
    ) {

        const fecha =
            new Date(
                año,
                mes,
                dia
            );

        const iso =
            fechaISO(fecha);

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
            iso ===
            obtenerHoyISO()
        ) {

            boton.classList.add(
                "hoy"
            );
        }

        const pasado =
            esFechaPasada(iso);

        const bloqueado =
            fechasBloqueadas.has(
                iso
            );

        if (pasado) {

            boton.classList.add(
                "pasado"
            );

            boton.disabled =
                true;
        }

        if (bloqueado) {

            boton.classList.add(
                "bloqueado"
            );

            boton.disabled =
                true;
        }

        if (
            fechaIngresoSeleccionada &&
            fechaSalidaSeleccionada &&
            iso >
                fechaIngresoSeleccionada &&
            iso <
                fechaSalidaSeleccionada
        ) {

            boton.classList.add(
                "en-rango"
            );
        }

        if (
            iso ===
            fechaIngresoSeleccionada
        ) {

            boton.classList.add(
                "ingreso"
            );
        }

        if (
            iso ===
            fechaSalidaSeleccionada
        ) {

            boton.classList.add(
                "salida"
            );
        }

        if (
            !pasado &&
            !bloqueado &&
            disponibilidadVerificada
        ) {

            boton.addEventListener(
                "click",
                function () {

                    seleccionarFechaCalendario(
                        iso
                    );
                }
            );
        }

        contenedor.appendChild(
            boton
        );
    }

    const mesActual =
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

    botonAnterior.disabled =
        mesCalendarioActual <=
        mesActual;

    if (
        cargandoDisponibilidad
    ) {

        mensaje.textContent =
            "Consultando disponibilidad...";

        mensaje.className =
            "calendario-mensaje";

    } else if (
        !disponibilidadVerificada
    ) {

        mensaje.textContent =
            "No se pudo consultar la disponibilidad.";

        mensaje.className =
            "calendario-mensaje error";

    } else if (
        fechaIngresoSeleccionada &&
        fechaSalidaSeleccionada
    ) {

        mensaje.textContent =
            `Ingreso: ${formatearFechaVisible(
                fechaIngresoSeleccionada
            )} · Salida: ${formatearFechaVisible(
                fechaSalidaSeleccionada
            )}`;

        mensaje.className =
            "calendario-mensaje ok";

    } else if (
        fechaIngresoSeleccionada
    ) {

        mensaje.textContent =
            "Ahora seleccione la fecha de salida.";

        mensaje.className =
            "calendario-mensaje ok";

    } else {

        mensaje.textContent =
            "Seleccione una fecha de ingreso.";

        mensaje.className =
            "calendario-mensaje";
    }
}


// ==========================================================
// SELECCIONAR FECHA
// ==========================================================

function seleccionarFechaCalendario(
    iso
) {

    if (
        !disponibilidadVerificada ||
        esFechaPasada(iso) ||
        fechasBloqueadas.has(iso)
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

    if (
        modoCalendario ===
        "ingreso"
    ) {

        fechaIngresoSeleccionada =
            iso;

        fechaSalidaSeleccionada =
            null;

        fechaIngreso.value =
            iso;

        fechaSalida.value =
            "";

        modoCalendario =
            "salida";

        const fecha =
            crearFechaLocal(iso);

        mesCalendarioActual =
            new Date(
                fecha.getFullYear(),
                fecha.getMonth(),
                1
            );

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

            seleccionarFechaCalendario(
                iso
            );

            return;
        }

        if (
            iso <=
            fechaIngresoSeleccionada
        ) {

            fechaIngresoSeleccionada =
                iso;

            fechaSalidaSeleccionada =
                null;

            fechaIngreso.value =
                iso;

            fechaSalida.value =
                "";

            renderizarCalendario();

            calcularPrecio();

            return;
        }

        if (
            rangoTieneBloqueo(
                fechaIngresoSeleccionada,
                iso
            )
        ) {

            const mensaje =
                document.getElementById(
                    "calendarioMensaje"
                );

            if (mensaje) {

                mensaje.textContent =
                    "La estadía atraviesa una fecha no disponible. Seleccione otra fecha de salida.";

                mensaje.className =
                    "calendario-mensaje error";
            }

            fechaSalidaSeleccionada =
                null;

            fechaSalida.value =
                "";

            renderizarCalendario();

            calcularPrecio();

            return;
        }

        fechaSalidaSeleccionada =
            iso;

        fechaSalida.value =
            iso;

        calcularPrecio();

        renderizarCalendario();
    }
}


// ==========================================================
// DISPONIBILIDAD
// ==========================================================

async function cargarDisponibilidad(
    mostrarCalendarioDespues = true
) {

    if (
        !alojamientoActual ||
        !alojamientoActual.id
    ) {

        disponibilidadVerificada =
            false;

        return false;
    }

    cargandoDisponibilidad =
        true;

    disponibilidadVerificada =
        false;

    fechasBloqueadas =
        new Set();

    if (
        mostrarCalendarioDespues
    ) {

        mostrarCalendario();

        renderizarCalendario();
    }

    try {

        const { data, error } =
            await clienteSupabase.functions.invoke(
                "obtener-disponibilidad",
                {
                    body: {
                        alojamiento_id:
                            alojamientoActual.id
                    }
                }
            );

        if (error) {

            console.error(
                "Error consultando disponibilidad:",
                error
            );

            throw error;
        }

        const bloqueadas =
            Array.isArray(
                data?.blocked
            )
                ? data.blocked
                : [];

        fechasBloqueadas =
            new Set(
                bloqueadas.filter(
                    fecha =>
                        /^\d{4}-\d{2}-\d{2}$/.test(
                            fecha
                        )
                )
            );

        disponibilidadVerificada =
            true;

        return true;

    } catch (error) {

        console.error(
            "No se pudo consultar disponibilidad:",
            error
        );

        disponibilidadVerificada =
            false;

        fechasBloqueadas =
            new Set();

        return false;

    } finally {

        cargandoDisponibilidad =
            false;

        renderizarCalendario();
    }
}


// ==========================================================
// PERSONAS
// ==========================================================

function crearSolicitudPersonasExtra() {

    if (
        !alojamientoActual
    ) {
        return;
    }

    const personas =
        Number(
            document.getElementById(
                "personas"
            )?.value || 1
        );

    const incluidas =
        Number(
            alojamientoActual
                .personas_incluidas || 0
        );

    const max =
        Number(
            alojamientoActual
                .max_huespedes || 0
        );

    solicitudPersonasExtra =
        personas > incluidas &&
        personas <= max;
}


function actualizarSolicitudPersonasExtra() {

    crearSolicitudPersonasExtra();
}


function configurarCampoPersonas() {

    const campo =
        document.getElementById(
            "personas"
        );

    if (!campo) {
        return;
    }

    campo.oninput =
        function () {

            if (
                alojamientoActual &&
                alojamientoActual.max_huespedes
            ) {

                const max =
                    Number(
                        alojamientoActual
                            .max_huespedes
                    );

                if (
                    Number(campo.value) >
                    max
                ) {

                    campo.value =
                        max;
                }
            }

            calcularPrecio();
        };

    campo.onchange =
        function () {

            calcularPrecio();
        };
}


// ==========================================================
// ABRIR RESERVA
// ==========================================================

async function abrirReserva() {

    if (
        !alojamientoActual
    ) {
        return;
    }

    const modal =
        document.getElementById(
            "ventanaReserva"
        );

    if (!modal) {
        return;
    }

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

    const nombreCliente =
        document.getElementById(
            "nombre"
        );

    const telefono =
        document.getElementById(
            "telefono"
        );

    if (nombre) {
        nombre.textContent =
            alojamientoActual.nombre || "";
    }

    if (fechaIngreso) {
        fechaIngreso.value =
            "";
    }

    if (fechaSalida) {
        fechaSalida.value =
            "";
    }

    if (personas) {

        personas.value =
            1;

        if (
            alojamientoActual.max_huespedes
        ) {

            personas.max =
                alojamientoActual.max_huespedes;
        }
    }

    if (nombreCliente) {
        nombreCliente.value =
            "";
    }

    if (telefono) {
        telefono.value =
            "";
    }

    const cantidadNoches =
        document.getElementById(
            "cantidadNoches"
        );

    const precioTotal =
        document.getElementById(
            "precioTotal"
        );

    if (cantidadNoches) {
        cantidadNoches.textContent =
            "0";
    }

    if (precioTotal) {
        precioTotal.textContent =
            "Q0";
    }

    fechaIngresoSeleccionada =
        null;

    fechaSalidaSeleccionada =
        null;

    solicitudPersonasExtra =
        null;

    disponibilidadVerificada =
        false;

    fechasBloqueadas =
        new Set();

    mesCalendarioActual =
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

    modoCalendario =
        "ingreso";

    configurarCalendarioReserva();

    modal.style.display =
        "flex";

    modal.classList.add(
        "activo"
    );

    document.body.classList.add(
        "sin-scroll"
    );

    configurarCampoPersonas();

    renderizarCalendario();

    mostrarCalendario();

    await cargarDisponibilidad(
        true
    );
}


// ==========================================================
// CERRAR RESERVA
// ==========================================================

function cerrarReserva() {

    const modal =
        document.getElementById(
            "ventanaReserva"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "activo"
    );

    modal.style.display =
        "none";

    document.body.classList.remove(
        "sin-scroll"
    );

    ocultarCalendario();
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

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        )?.value;

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        )?.value;

    const personas =
        Number(
            document.getElementById(
                "personas"
            )?.value || 1
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
        !fechaIngreso ||
        !fechaSalida
    ) {

        if (elementoNoches) {
            elementoNoches.textContent =
                "0";
        }

        if (elementoTotal) {
            elementoTotal.textContent =
                "Q0";
        }

        return;
    }

    const inicio =
        crearFechaLocal(
            fechaIngreso
        );

    const salida =
        crearFechaLocal(
            fechaSalida
        );

    if (
        !inicio ||
        !salida ||
        salida <= inicio
    ) {

        if (elementoNoches) {
            elementoNoches.textContent =
                "0";
        }

        if (elementoTotal) {
            elementoTotal.textContent =
                "Q0";
        }

        return;
    }

    const noches =
        Math.round(
            (
                salida.getTime() -
                inicio.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    const precioBase =
        Number(
            alojamientoActual
                .precio_base || 0
        );

    const precioPersona =
        Number(
            alojamientoActual
                .precio_persona || 0
        );

    const personasIncluidas =
        Number(
            alojamientoActual
                .personas_incluidas || 0
        );

    const personasExtra =
        Math.max(
            personas -
            personasIncluidas,
            0
        );

    const total =
        (
            precioBase +
            (
                personasExtra *
                precioPersona
            )
        ) *
        noches;

    if (elementoNoches) {
        elementoNoches.textContent =
            noches;
    }

    if (elementoTotal) {

        elementoTotal.textContent =
            `Q${total.toLocaleString(
                "es-GT",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }
            )}`;
    }

    actualizarSolicitudPersonasExtra();
}


// ==========================================================
// VERIFICACIÓN FINAL
// ==========================================================

async function verificarDisponibilidadAntesDeEnviar() {

    const correcto =
        await cargarDisponibilidad(
            false
        );

    if (!correcto) {
        return false;
    }

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        )?.value;

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        )?.value;

    if (
        !fechaIngreso ||
        !fechaSalida
    ) {
        return false;
    }

    if (
        fechasBloqueadas.has(
            fechaIngreso
        )
    ) {
        return false;
    }

    if (
        fechasBloqueadas.has(
            fechaSalida
        )
    ) {
        return false;
    }

    if (
        rangoTieneBloqueo(
            fechaIngreso,
            fechaSalida
        )
    ) {
        return false;
    }

    return true;
}


// ==========================================================
// ENVIAR WHATSAPP
// ==========================================================

async function enviarWhatsApp() {

    if (
        !alojamientoActual
    ) {

        alert(
            "No se encontró el alojamiento."
        );

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

    const fechaIngreso =
        document.getElementById(
            "fechaIngreso"
        )?.value;

    const fechaSalida =
        document.getElementById(
            "fechaSalida"
        )?.value;

    const personas =
        Number(
            document.getElementById(
                "personas"
            )?.value || 0
        );

    if (!fechaIngreso) {

        alert(
            "Seleccione la fecha de ingreso."
        );

        return;
    }

    if (!fechaSalida) {

        alert(
            "Seleccione la fecha de salida."
        );

        return;
    }

    if (
        fechaSalida <=
        fechaIngreso
    ) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de ingreso."
        );

        return;
    }

    const maxHuespedes =
        Number(
            alojamientoActual
                .max_huespedes || 0
        );

    if (
        maxHuespedes > 0 &&
        personas > maxHuespedes
    ) {

        alert(
            `Este alojamiento permite un máximo de ${maxHuespedes} huéspedes.`
        );

        return;
    }

    if (!nombre) {

        alert(
            "Ingrese su nombre completo."
        );

        return;
    }

    if (!telefono) {

        alert(
            "Ingrese su número de teléfono."
        );

        return;
    }

    const boton =
        document.querySelector(
            ".boton-whatsapp"
        );

    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "Verificando disponibilidad...";
    }

    const disponible =
        await verificarDisponibilidadAntesDeEnviar();

    if (!disponible) {

        if (boton) {

            boton.disabled =
                false;

            boton.textContent =
                "📱 Solicitar por WhatsApp";
        }

        renderizarCalendario();

        alert(
            "Las fechas seleccionadas ya no están disponibles. Seleccione otras fechas."
        );

        return;
    }

    const inicio =
        crearFechaLocal(
            fechaIngreso
        );

    const salida =
        crearFechaLocal(
            fechaSalida
        );

    const noches =
        Math.round(
            (
                salida.getTime() -
                inicio.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    const precioBase =
        Number(
            alojamientoActual
                .precio_base || 0
        );

    const precioPersona =
        Number(
            alojamientoActual
                .precio_persona || 0
        );

    const personasIncluidas =
        Number(
            alojamientoActual
                .personas_incluidas || 0
        );

    const personasExtra =
        Math.max(
            personas -
            personasIncluidas,
            0
        );

    const total =
        (
            precioBase +
            (
                personasExtra *
                precioPersona
            )
        ) *
        noches;

    const numeroWhatsApp =
        "50254134493";

    let mensaje =
        `Hola, quiero solicitar una reserva.%0A%0A` +

        `🏠 Alojamiento: ${encodeURIComponent(
            alojamientoActual.nombre || ""
        )}%0A` +

        `👤 Nombre: ${encodeURIComponent(
            nombre
        )}%0A` +

        `📞 Teléfono: ${encodeURIComponent(
            telefono
        )}%0A` +

        `📅 Ingreso: ${encodeURIComponent(
            formatearFechaVisible(
                fechaIngreso
            )
        )}%0A` +

        `📅 Salida: ${encodeURIComponent(
            formatearFechaVisible(
                fechaSalida
            )
        )}%0A` +

        `🌙 Noches: ${noches}%0A` +

        `👥 Huéspedes: ${personas}%0A` +

        `💰 Total estimado: Q${total.toLocaleString(
            "es-GT",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}%0A%0A`;

    if (
        personasExtra > 0
    ) {

        mensaje +=
            `ℹ️ La solicitud incluye ${personasExtra} persona(s) adicional(es) sobre las personas incluidas en la tarifa.%0A%0A`;
    }

    mensaje +=
        `La selección de estas fechas no confirma la reserva. La solicitud queda sujeta a confirmación de disponibilidad por parte del anfitrión.`;

    if (boton) {

        boton.disabled =
            false;

        boton.textContent =
            "📱 Solicitar por WhatsApp";
    }

    const url =
        `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    window.open(
        url,
        "_blank"
    );
}


// ==========================================================
// CERRAR RESERVA AL HACER CLICK AFUERA
// ==========================================================

document.addEventListener(
    "click",
    function (event) {

        const ventanaReserva =
            document.getElementById(
                "ventanaReserva"
            );

        if (
            ventanaReserva &&
            event.target ===
                ventanaReserva
        ) {

            cerrarReserva();
        }
    }
);


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        insertarEstilosCalendario();

        crearModalAlojamiento();

        cargarPortada();

        cargarAlojamientos();

        configurarCalendarioReserva();

        console.log(
            "Estancias Agradables iniciado correctamente."
        );
    }
);
