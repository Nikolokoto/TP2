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


/******************************************************************************************
 * * * PARTE 1
******************************************************************************************/

/*1. precioMaquina(componentes): recibe un array de componentes y devuelve el
precio de la máquina que se puede armar con esos componentes, que es la suma
de los precios de cada componente incluido.*/

const verificarComponente = (componente) => {
    if (typeof componente !== "string") throw new Error("Esto no es un dato válido");
    let foundComponente = local.precios.some(dataComponente => dataComponente.componente === componente)
    if (foundComponente === false) throw new Error(`"${componente}" no existe. Verificar si hay errores de tipeo ;)`)
}

const buscarPrecioPorComponente = (componente) => {
    verificarComponente(componente);
    for (let dataComponente of local.precios) {
        const { componente: nombreComp, precio } = dataComponente;
        if (nombreComp === componente) {
            return precio;
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
    let vecesVendido = 0;
    for (let venta of local.ventas) {
        for (let componenteVendido of venta.componentes) {
            if (componenteVendido === componente) {
                vecesVendido++
            }
        }
    }
    return vecesVendido
}
// console.log(cantidadVentasComponente("Monitor ASC 543")); // 2

/*3. vendedoraDelMes(mes, anio), se le pasa dos parámetros numéricos, (mes, anio) y devuelve el nombre de la vendedora que más vendió en plata en el mes. O sea no cantidad de ventas, sino importe total de las ventas. El importe de una venta es el que indica la función precioMaquina. El mes es un número entero que va desde el 1 (enero) hasta el 12 (diciembre).*/

const verificarFecha = (mes, anio) => {
    if (typeof mes != "number" || typeof anio != "number") throw new Error('El tipo de dato no es válido. Ingrese números');
    if (mes < 0 || mes > 12) throw new Error('El dato ingresado por mes no parece un mes')
    if (anio.toString().length < 4 || anio.toString().length > 4) throw new Error('El dato ingresado por año no parece un año');
    let today = new Date();
    if (mes > today.getMonth() || anio > today.getFullYear()) throw new Error('Este programa no puede leer el futuro')
    for (let i = 0; i < local.ventas.length; i++) {
        let foundPerYear = local.ventas.some(venta => venta.fecha.getFullYear() === anio)
        if (foundPerYear === true) {
            let foundPerMonth = local.ventas.some(venta => venta.fecha.getMonth() === mes);
            if (foundPerMonth === true) {
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
        let importeVendedora = 0;
        for (let venta of local.ventas) {
            if (venta.fecha.getFullYear() === anio && venta.fecha.getMonth() === mes - 1 && venta.nombreVendedora === local.vendedoras[i]) {
                importeVendedora += precioMaquina(venta.componentes)
            }
        }
        let ventasPorVendedora = [local.vendedoras[i], importeVendedora];
        if (ventasPorVendedora[1] > mayorImporte) mayorImporte = ventasPorVendedora[1]
        if (ventasPorVendedora[1] === mayorImporte) vendedoraMayorVentas = ventasPorVendedora[0]
    }
    return vendedoraMayorVentas
}

// console.log(vendedoraDelMes(1, 2019)); // "Ada" (vendio por $670, una máquina de $320 y otra de $350)

/*4. ventasVendedora(nombre): Obtener las ventas totales realizadas por una vendedora sin límite de fecha.*/

const verificarVendedora = (nombre) => {
    if (typeof nombre !== "string") throw new Error('El dato ingresado no parece ser un nombre :/')
    if (!local.vendedoras.some(vendedora => vendedora === nombre)) throw new Error('Al parecer el nombre ingresado no es de ninguna de las vendedoras')
}

const ventasVendedora = (nombre) => {
    verificarVendedora(nombre);
    let ventasTotal = 0;
    for (i = 0; i < local.vendedoras.length; i++) {
        for (let venta of local.ventas) {
            if (venta.nombreVendedora === nombre) ventasTotal += precioMaquina(venta.componentes)
        }
        return ventasTotal
    }
}

// console.log(ventasVendedora("Grace")); // 900

/*5. componenteMasVendido(): Devuelve el nombre del componente que más ventas tuvo historicamente. El dato de la cantidad de ventas es el que indica la función cantidadVentasComponente */

const componenteMasVendido = () => {
    ventasPorComp = []
    let mayorVenta = 0;
    for (let venta of local.ventas) {
        for (let componenteVendido of venta.componentes) {
            let perComp = { componente: componenteVendido, totalVendido: cantidadVentasComponente(componenteVendido) };
            if (!ventasPorComp.includes(venta => venta === perComp)) ventasPorComp.push(perComp) //No sé por qué me pushea todo, a pesar de la condición que puse para que no pusheara repeticiones o_o
        }
    }
    // console.log(ventasPorComp);//Array con todas las apariciones de los componentes en array ventas u_u
    for (let ventaPorComp of ventasPorComp) {
        if (ventaPorComp.totalVendido > mayorVenta) {
            mayorVenta = ventaPorComp.totalVendido;
        }
    }
    const { componente } = ventasPorComp.find(ventaPorComp => ventaPorComp.totalVendido === mayorVenta)
    return componente
}
// console.log(componenteMasVendido()); // Monitor GPRS 3000

/*6. huboVentas(mes, anio): que indica si hubo ventas en un mes determinado. El mes es un número entero que va desde el 1 (enero) hasta el 12 (diciembre).
 */

const huboVentas = (mes, anio) => {
    verificarFecha(mes, anio);
}

// console.log(huboVentas(3, 2019)); // false

/******************************************************************************************
 * * * PARTE 2
******************************************************************************************/

/**
 * Como se abrió una nueva sucursal en Caballito, ahora los datos de las ventas también tienen el nombre de la sucursal en la cual se realizó. Por ejemplo: { fecha: new Date(2019, 1, 1), nombreVendedora: "Ada", componentes: ["Monitor GPRS 3000", "Motherboard ASUS 1500"], sucursal: 'Centro' }. Por este cambio, se pide:
 * 
 *1. En las ventas ya existentes, tenemos que agregar la propiedad sucursal con el valor Centro (ya que es la sucursal original).
 */

for (let venta of local.ventas) {
    venta.sucursal = 'Centro'
}

/**
 *2. Agregar al objeto principal la propiedad sucursales: ['Centro', 'Caballito']
 */

local.sucursales = ['Centro', 'Caballito'];

/**
 *3. Cargar la siguiente información en el array ventas, creando sus respectivos objetos siguiendo el patrón: fecha, nombreVendedora, componentes, sucursal
 */

const modificarDatos = (fecha, nombre, componentes, sucursal) => {
    fecha = new Date(fecha);
    nombreVendedora = nombre.toString();
    componentes = componentes.split(',');
    sucursal = sucursal.toString
    return { fecha, nombreVendedora, componentes, sucursal }
}

const agregarVenta = (fecha, nombre, componentes, sucursal) => {
    modificarDatos(fecha, nombre, componentes, sucursal);
    return local.ventas.push(nuevaVenta)
}

venta(12 / 02 / 2019, Hedy, [Monitor GPRS 3000, HDD Toyiva], Centro);
console.log(local.ventas);