        const botonCerrar =
            document.getElementById(
                "cerrarModalAlojamiento"
            );

        if (botonCerrar) {

            botonCerrar.onclick =
                function(evento) {

                    evento.preventDefault();
                    evento.stopPropagation();

                    cerrarModalAlojamiento();
                };
        }


        const botonReservar =
            document.getElementById(
                "modalAlojamientoReservar"
            );

        if (botonReservar) {

            botonReservar.onclick =
                function(evento) {

                    evento.preventDefault();
                    evento.stopPropagation();

                    if (alojamientoActual) {

                        const alojamientoParaReserva =
                            alojamientoActual;

                        cerrarModalAlojamiento();

                        abrirReserva(
                            alojamientoParaReserva
                        );
                    }
                };
        }

        return;
