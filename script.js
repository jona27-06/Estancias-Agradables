const SUPABASE_URL = "https://caodorogvcpupdajtbbp.supabase.co";
const SUPABASE_KEY = "sb_publishable_oQdoFY-J8JciNIbxmaRi8Q_oWZ-YxE6";

const clienteSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let alojamientoActual = null;

async function obtenerFotos(alojamientoId) {
    const resultado = await clienteSupabase
        .storage
        .from("fotos-alojamientos")
        .list(alojamientoId, {
            limit: 100,
            sortBy: {
                column: "name",
                order: "asc"
            }
        });

    if (resultado.error) {
        console.error("Error al cargar fotos:", resultado.error);
        return [];
    }

    if (!resultado.data || resultado.data.length === 0) {
        return [];
    }

    return resultado.data.map(function(archivo) {
        const ruta =
            alojamientoId +
            "/" +
            archivo.name;

        const resultadoUrl = clienteSupabase
            .storage
            .from("fotos-alojamientos")
            .getPublicUrl(ruta);

        return resultadoUrl.data.publicUrl;
    });
}

async function cargarAlojamientos() {
    const contenedor = document.querySelector(".alojamientos");

    if (!contenedor) {
        console.error(
            "No se encontró la sección de alojamientos."
        );
        return;
    }

    const resultado = await clienteSupabase
        .from("alojamientos")
        .select("*")
        .eq("publicado", true)
        .order("created_at", {
            ascending: false
        });

    if (resultado.error) {
        console.error(
            "Error de Supabase:",
            resultado.error
        );

        contenedor.innerHTML =
            "<p>No se pudieron cargar los alojamientos.</p>";

        return;
    }

    const alojamientos = resultado.data;

    if (!alojamientos || alojamientos.length === 0) {
        contenedor.innerHTML =
            "<p>No hay alojamientos disponibles.</p>";

        return;
    }

    contenedor.innerHTML = "";

    for (const alojamiento of alojamientos) {

        const fotos = await obtenerFotos(
            alojamiento.id
        );

        let galeriaHTML = "";

        if (fotos.length > 0) {

            galeriaHTML = `
                <div class="galeria-alojamiento">

                    <img
                        src="${fotos[0]}"
                        alt="${alojamiento.nombre}"
                        class="foto-principal"
                    >

                    ${
                        fotos.length > 1
                            ? `
                                <div class="miniaturas">
                                    ${fotos
                                        .slice(1)
                                        .map(function(foto) {
                                            return `
                                                <img
                                                    src="${foto}"
                                                    alt="${alojamiento.nombre}"
                                                >
                                            `;
                                        })
                                        .join("")}
                                </div>
                            `
                            : ""
                    }

                </div>
            `;

        } else {

            galeriaHTML = `
                <div class="sin-fotos">
                    <p>Sin fotografías disponibles</p>
                </div>
            `;
        }

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "alojamiento";

        tarjeta.innerHTML = `

            ${galeriaHTML}

            <div class="alojamiento-info">

                <h3>
                    ${alojamiento.nombre}
                </h3>

                <p>
                    ${alojamiento.descripcion}
                </p>

                <div class="datos">

                    <span>
                        ${alojamiento.habitaciones}
                        habitación(es)
                    </span>

                    <span>
                        ${alojamiento.banos}
                        baño(s)
                    </span>

                    <span>
                        Hasta
                        ${alojamiento.max_huespedes}
                        personas
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
                        Q${Number(
                            alojamiento.precio_base
                        ).toFixed(2)}
                    </strong>

                    <span>
                        / noche
                    </span>

                </div>

                <button
                    class="boton-reservar"
                    onclick="abrirReserva(
                        '${alojamiento.nombre.replace(
                            /'/g,
                            "\\'"
                        )}',
                        ${alojamiento.precio_base},
                        ${alojamiento.precio_persona},
                        ${alojamiento.personas_incluidas},
                        ${alojamiento.max_huespedes}
                    )"
                >
                    Solicitar reserva
                </button>

            </div>
        `;

        contenedor.appendChild(tarjeta);
    }

    console.log(
        "Alojamientos cargados:",
        alojamientos
    );
}

function abrirReserva(
    nombre,
    precioBase,
    precioPersona,
    personasIncluidas,
    maxHuespedes
) {
    alojamientoActual = {
        nombre: nombre,
        precioBase: Number(precioBase),
        precioPersona: Number(precioPersona),
        personasIncluidas:
            Number(personasIncluidas),
        maxHuespedes:
            Number(maxHuespedes)
    };

    document.getElementById(
        "nombreAlojamiento"
    ).textContent = nombre;

    document.getElementById(
        "ventanaReserva"
    ).style.display = "block";

    document.getElementById(
        "fechaIngreso"
    ).value = "";

    document.getElementById(
        "fechaSalida"
    ).value = "";

    document.getElementById(
        "personas"
    ).value = 1;

    document.getElementById(
        "personas"
    ).min = 1;

    document.getElementById(
        "personas"
    ).max = maxHuespedes;

    document.getElementById(
        "cantidadNoches"
    ).textContent = "0";

    document.getElementById(
        "precioTotal"
    ).textContent = "Q0";
}

function cerrarReserva() {
    document.getElementById(
        "ventanaReserva"
    ).style.display = "none";
}

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

    const personas =
        Number(
            document.getElementById(
                "personas"
            ).value
        );

    if (!ingreso || !salida) {
        return;
    }

    if (
        personas < 1 ||
        personas >
            alojamientoActual.maxHuespedes
    ) {
        document.getElementById(
            "cantidadNoches"
        ).textContent = "0";

        document.getElementById(
            "precioTotal"
        ).textContent = "Q0";

        return;
    }

    const fechaIngreso =
        new Date(
            ingreso + "T00:00:00"
        );

    const fechaSalida =
        new Date(
            salida + "T00:00:00"
        );

    const diferencia =
        fechaSalida - fechaIngreso;

    const noches =
        diferencia /
        (1000 * 60 * 60 * 24);

    if (noches <= 0) {

        document.getElementById(
            "cantidadNoches"
        ).textContent = "0";

        document.getElementById(
            "precioTotal"
        ).textContent = "Q0";

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
        precioPorNoche * noches;

    document.getElementById(
        "cantidadNoches"
    ).textContent = noches;

    document.getElementById(
        "precioTotal"
    ).textContent =
        "Q" + total.toFixed(2);
}

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

    if (Number(noches) <= 0) {

        alert(
            "La fecha de salida debe ser posterior a la fecha de ingreso."
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
            " personas."
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

cargarAlojamientos();