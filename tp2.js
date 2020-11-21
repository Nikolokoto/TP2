var local = {
    vendedoras: ["Ada", "Grace", "Hedy", "Sheryl"],

    ventas: [
        // tener en cuenta que Date guarda los meses del 0 (enero) al 11 (diciembre)
        { fecha: new Date(2019, 1, 4), nombreVendedora: "Grace", componentes: ["Monitor GPRS 3000", "Motherboard ASUS 1500"] },
        { fecha: new Date(2019, 0, 1), nombreVendedora: "Ada", componentes: ["Monitor GPRS 3000", "Motherboard ASUS 1500"] },
        { fecha: new Date(2019, 0, 2), nombreVendedora: "Grace", componentes: ["Monitor ASC 543", "Motherboard MZI"] },
        { fecha: new Date(2019, 0, 10), nombreVendedora: "Ada", componentes: ["Monitor ASC 543", "Motherboard ASUS 1200"] },
        { fecha: new Date(2019, 0, 12), nombreVendedora: "Grace", componentes: ["Monitor GPRS 3000", "Motherboard ASUS 1200"] }
    ],

    precios: [
        { componente: "Monitor GPRS 3000", precio: 200 },
        { componente: "Motherboard ASUS 1500", precio: 120 },
        { componente: "Monitor ASC 543", precio: 250 },
        { componente: "Motherboard ASUS 1200", precio: 100 },
        { componente: "Motherboard MZI", precio: 30 },
        { componente: "HDD Toyiva", precio: 90 },
        { componente: "HDD Wezter Dishital", precio: 75 },
        { componente: "RAM Quinston", precio: 110 },
        { componente: "RAM Quinston Fury", precio: 230 }
    ]
};


/**
 * PARTE 1
** /

/*1. precioMaquina(componentes): recibe un array de componentes y devuelve el
precio de la máquina que se puede armar con esos componentes, que es la suma
de los precios de cada componente incluido.*/


let listaDatosComponentes = local.precios;
const verificarComponente = (componente) => {
    if (typeof componente !== "string") throw new Error("Esto no es un dato válido");

    let foundComp = [];
    listaDatosComponentes.map(componenteData => {
        if (componenteData.componente === componente) foundComp.push(componenteData.componente);
    });
    if (foundComp.length === 0) throw new Error(`"${componente}" no existe. Verificar si hay errores de tipeo ;)`)
}

const buscarPrecioPorComponente = (componente) => {
    verificarComponente(componente);
    for (componenteData of listaDatosComponentes) {
        if (componenteData.componente === componente) {
            return componenteData.precio;
        }
    }
}

const precioMaquina = (componentes) => {
    if (Array.isArray(componentes) !== true) throw new Error("El tipo de dato ingresado no es válido. Debe tener formato de array.");
    return componentes.reduce((acumulador, componente) => acumulador + buscarPrecioPorComponente(componente), 0);
};

// console.log(precioMaquina(["Monitor GPRS 3000", "Motherboard ASUS 1500"])); // 320 ($200 del monitor + $120 del motherboard)


/*2. cantidadVentasComponente(componente): recibe un componente y devuelve la cantidad de veces que fue vendido, o sea que formó parte de una máquina que se vendió. La lista de ventas no se pasa por parámetro, se asume que está identificada por la variable ventas..*/

const cantidadVentasComponente = (componente) => {
    verificarComponente(componente);
    let listaVentas = local.ventas
    let vecesVendido = 0;
    for (venta of listaVentas) {
        venta.componentes.reduce((acumulador, componenteVendido) => {
            if (componenteVendido === componente) {
                acumulador++
                vecesVendido += acumulador
            }
        }, 0)
    }
    return vecesVendido
}
// console.log(cantidadVentasComponente("Monitor ASC 543")); // 2

/*3. vendedoraDelMes(mes, anio), se le pasa dos parámetros numéricos, (mes, anio) y devuelve el nombre de la vendedora que más vendió en plata en el mes. O sea no cantidad de ventas, sino importe total de las ventas. El importe de una venta es el que indica la función precioMaquina. El mes es un número entero que va desde el 1 (enero) hasta el 12 (diciembre).*/

const verificarFecha = (mes, anio) => {
    if (typeof mes != "number" || typeof anio != "number") throw new Error('el tipo de dato no es válido. Ingrese números');
    if (mes < 0 || mes > 12) throw new Error('El dato ingresado por mes no parece un mes')
    if (anio.toString().length < 4 || anio.toString().length > 4) throw new Error('El dato ingresado por año no parece un año');
    let today = new Date();
    if (mes > today.getMonth() || anio > today.getFullYear()) throw new Error('Este programa no puede leer el futuro')

    for (ventas in local) {
        let searchYear = ventas.includes(venta => venta.fecha.getFullYear() === anio)
        console.log(searchYear);

        if (searchYear === true) {
            let searchMonth = ventas.includes(venta => venta.fecha.getMonth() === mes);
            if (searchMonth === true) {
                continue

            } else {
                throw new Error('Lo sentimos, pero este mes no está registrado en nuestro libro de ventas')
            }
        } else {
            throw new Error('Lo sentimos, pero este año no está registrado en nuestro libro de ventas')
        }
    }
}

const vendedoraDelMes = (mes, anio) => {
    verificarFecha(mes, anio);
    let mayorImporte = 0;
    let vendedoraMayorVentas;
    for (i = 0; i < local.vendedoras.length; i++) {
        let importeVentaVendedora = 0;
        for (venta of local.ventas) {
            if (venta.fecha.getFullYear() === anio && venta.fecha.getMonth() === mes - 1 && venta.nombreVendedora === local.vendedoras[i]) {
                importeVentaVendedora += precioMaquina(venta.componentes)
            }
        }
        let importePorVendedora = [local.vendedoras[i], importeVentaVendedora]
        if (importePorVendedora[1] > mayorImporte) mayorImporte = importePorVendedora[1]
        if (importePorVendedora[1] === mayorImporte) vendedoraMayorVentas = importePorVendedora[0]
    }
    return vendedoraMayorVentas
}

console.log(vendedoraDelMes(1, 2019)); // "Ada" (vendio por $670, una máquina de $320 y otra de $350)

/*4. ventasVendedora(nombre): Obtener las ventas totales realizadas por una vendedora sin límite de fecha.*/

const ventasVendedora = (nombre) => {
    let ventasTotal = 0;
    for (i = 0; i < local.vendedoras.length; i++) {
        for (venta of local.ventas) {
            if (venta.nombreVendedora === nombre) ventasTotal += precioMaquina(venta.componentes)
        }
        return ventasTotal
    }
}

console.log(ventasVendedora("Grace")); // 900