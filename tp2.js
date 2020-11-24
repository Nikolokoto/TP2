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

const verificarComponente = (nombreComponente) => {
    if (typeof nombreComponente !== "string") throw new Error("Esto no es un dato válido");
    let foundComponente = local.precios.some(dataComponente => dataComponente.componente === nombreComponente)
    if (foundComponente === false) throw new Error(`"${nombreComponente}" no existe. Verificar si hay errores de tipeo ;)`)
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
    return componentes.reduce((acumulador, componente) => acumulador += buscarPrecioPorComponente(componente), 0);
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
            let foundPerMonth = local.ventas.some(venta => venta.fecha.getMonth() === mes - 1);
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
    for (let vendedora of local.vendedoras) {
        let importeVendedora = 0;
        for (let venta of local.ventas) {
            if (venta.fecha.getFullYear() === anio && venta.fecha.getMonth() === mes - 1 && venta.nombreVendedora === vendedora) {
                importeVendedora += precioMaquina(venta.componentes)
            }
        }
        let ventasPorVendedora = [vendedora, importeVendedora]
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

const ventasVendedora1 = (nombre) => {
    verificarVendedora(nombre);
    let ventasTotal = 0;
    for (let venta of local.ventas) {
        if (venta.nombreVendedora === nombre) ventasTotal += precioMaquina(venta.componentes)
    }
    return ventasTotal
}

// console.log(ventasVendedora("Grace")); // 900

/*5. componenteMasVendido(): Devuelve el nombre del componente que más ventas tuvo historicamente. El dato de la cantidad de ventas es el que indica la función cantidadVentasComponente */

const componenteMasVendido = () => {
    ventasPorComp = []
    let mayorVenta = 0;
    for (let venta of local.ventas) {
        for (let componenteVendido of venta.componentes) {
            let perComp = { componente: componenteVendido, totalVendido: cantidadVentasComponente(componenteVendido) };
            if (!ventasPorComp.find(venta => venta.componente === perComp.componente)) ventasPorComp.push(perComp)
        }
    }
    for (let ventaPorComp of ventasPorComp) {
        if (ventaPorComp.totalVendido > mayorVenta) mayorVenta = ventaPorComp.totalVendido
        const { componente, totalVendido } = ventasPorComp;
        if (ventasPorComp.find(ventaPorComp => ventaPorComp[totalVendido] === mayorVenta))
            return componente
    }
}

console.log(componenteMasVendido()); // Monitor GPRS 3000

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

/**2. Agregar al objeto principal la propiedad sucursales: ['Centro', 'Caballito']*/

local.sucursales = ['Centro', 'Caballito'];

/**3. Cargar la siguiente información en el array ventas, creando sus respectivos objetos siguiendo el patrón: fecha, nombreVendedora, componentes, sucursal.*/

// Qué feio hacer este pedazo a mano :(

local.ventas.push({ fecha: new Date(2019, 1, 12), nombreVendedora: "Hedy", componentes: ["Monitor GPRS 3000", "HDD Toyiva"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 24), nombreVendedora: "Sheryl", componentes: ["Motherboard ASUS 1500", "HDD Wezter Dishital"], sucursal: "Caballito" });
local.ventas.push({ fecha: new Date(2019, 1, 1), nombreVendedora: "Ada", componentes: ["Motherboard MZI", "RAM Quinston Fury"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 11), nombreVendedora: "Grace", componentes: ["Monitor ASC 543", "RAM Quinston"], sucursal: "Caballito" });
local.ventas.push({ fecha: new Date(2019, 1, 15), nombreVendedora: "Ada", componentes: ["Motherboard ASUS 1200", "RAM Quinston Fury"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 12), nombreVendedora: "Hedy", componentes: ["Motherboard ASUS 1500", "HDD Toyiva"], sucursal: "Caballito" });
local.ventas.push({ fecha: new Date(2019, 1, 21), nombreVendedora: "Grace", componentes: ["Motherboard MZI", "RAM Quinston"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 8), nombreVendedora: "Sheryl", componentes: ["Monitor ASC 543", "HDD Wezter Dishital"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 16), nombreVendedora: "Sheryl", componentes: ["Monitor GPRS 3000", "RAM Quinston Fury"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 27), nombreVendedora: "Hedy", componentes: ["Motherboard ASUS 1200", "HDD Toyiva"], sucursal: "Caballito" });
local.ventas.push({ fecha: new Date(2019, 1, 22), nombreVendedora: "Grace", componentes: ["Monitor ASC 543", "HDD Wezter Dishital"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 5), nombreVendedora: "Ada", componentes: ["Motherboard ASUS 1500", "RAM Quinston"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 1), nombreVendedora: "Grace", componentes: ["Motherboard MZI", "HDD Wezter Dishital"], sucursal: "Centro" });
local.ventas.push({ fecha: new Date(2019, 1, 7), nombreVendedora: "Sheryl", componentes: ["Monitor GPRS 3000", "RAM Quinston"], sucursal: "Caballito" });
local.ventas.push({ fecha: new Date(2019, 1, 14), nombreVendedora: "Ada", componentes: ["Motherboard ASUS 1200", "HDD Toyiva"], sucursal: "Centro" });
// console.log(local.ventas);

/** 4. Crear la función ventasSucursal(sucursal), que obtiene las ventas totales realizadas por una sucursal sin límite de fecha.*/

verificarSucursal = (sucursal) => {
    if (typeof sucursal !== "string") throw new Error('El dato ingresado no parece un nombre, menos para una sucursal')
    const { sucursales } = local;
    if (!sucursales.includes(sucursal)) throw new Error(`Quizá '${sucursal}' exista, pero no como una de nuestras sucursales`)
}

const ventasSucursal1 = (sucursal) => {
    verificarSucursal(sucursal);
    let ventasTotal = 0;
    for (let venta of local.ventas) {
        if (venta.sucursal === sucursal) ventasTotal += precioMaquina(venta.componentes)
    }
    return ventasTotal
}

// console.log(ventasSucursal("Centro")); // 4195

/** 5. Las funciones ventasSucursal y ventasVendedora tienen mucho código en común, ya que es la misma funcionalidad pero trabajando con una propiedad distinta. Entonces, ¿cómo harías para que ambas funciones reutilicen código y evitemos repetir?*/

verificarInput = (key, value) => {
    if (typeof value !== "string") throw new Error('El dato ingresado no parece ser un nombre')
    let search = local.ventas.some(venta => venta[key] === value)
    if (search === false) throw new Error(`El nombre ingresado '${value}' no se encuentra en nuestros registros`)
}

const calcularVentas = (key, value) => {
    let ventasTotal = 0;
    for (let venta of local.ventas) {
        if (venta[key] === value) ventasTotal += precioMaquina(venta.componentes)
    }
    return ventasTotal
}

const ventasSucursal = (nombreSucursal) => {
    verificarInput('sucursal', nombreSucursal);
    return calcularVentas('sucursal', nombreSucursal);
}

const ventasVendedora = (vendedoraName) => {
    verificarInput('nombreVendedora', vendedoraName);
    return calcularVentas('nombreVendedora', vendedoraName);
}

// console.log(ventasVendedora("Grace")); // 1830
// console.log(ventasSucursal("Centro")); // 4195

/**6. Crear la función sucursalDelMes(mes, anio), que se le pasa dos parámetros numéricos, (mes, anio) y devuelve el nombre de la sucursal que más vendió en plata en el mes. No cantidad de ventas, sino importe total de las ventas. El importe de una venta es el que indica la función precioMaquina. El mes es un número entero que va desde el 1 (enero) hasta el 12 (diciembre).*/

const sucursalDelMes = (mes, anio) => {
    verificarFecha(mes, anio);
    let sucursalMayorVentas;
    let mayorImporte = 0;
    for (let Sucursal of local.sucursales) {
        let importeSucursal = 0;
        for (let venta of local.ventas) {
            const { fecha, sucursal } = venta
            if (fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && sucursal === Sucursal) importeSucursal += precioMaquina(venta.componentes)
        }
        let ventasPorSucursal = { sucursal: Sucursal, totalVendido: importeSucursal };
        if (ventasPorSucursal.totalVendido > mayorImporte) mayorImporte = ventasPorSucursal.totalVendido
        if (ventasPorSucursal.totalVendido === mayorImporte) sucursalMayorVentas = ventasPorSucursal.Sucursal
    }
    return sucursalMayorVentas
}

console.log(sucursalDelMes(2, 2019)); // "Centro"

/******************************************************************************************
 * * * PARTE 3
******************************************************************************************/

/**Para tener una mejor muestra de como está resultando el local, queremos desarrollar un reporte que nos muestre las ventas por sucursal y por mes. Para esto, necesitamos crear las siguientes funciones:
 *
 * 1. renderPorMes(): Muestra una lista ordenada del importe total vendido por cada mes/año*/

const obtenerAñosOrdenados = () => {
    let añosRegistrados = [];
    for (let venta of local.ventas) {
        const { fecha } = venta;
        if (!añosRegistrados.includes(año => año === fecha.getFullYear)) añosRegistrados.push(fecha.getFullYear());
    }
    return añosRegistrados.sort();
}

console.log(obtenerAñosOrdenados());

const renderPorAño = () => {
    const añosOrdenados = obtenerAñosOrdenados();
    for (let year of añosOrdenados) {
        let ventasPerYear = { año: year, totalPerYear };
        for (let venta of local.ventas) {
            if (venta.fecha[getFullYear() === year]) ventasPerYear.push(venta)
            totalPerYear = ventasPerYear.reduce((acumulador, venta) => {
                acumulador += precioMaquina(venta.componentes)
            }, 0)
        }

    }

    const renderPorMes = () => {
        let ventasPerMoth = [];
        for (let i = 0; i < 12; i++) {
            let ventaPerMonth = ventasPerYear.filter(venta => venta.fecha.getMonth === i);
            let totalVentasPorMes = ventaPerMonth.reduce((acumulador, venta) => {
                acumulador += precioMaquina(venta.componentes)
            }, 0)
            render = `Año: ${year}. Total de ${fecha.getMonth()}: ${totalVentasPorMes}`
            print.push(render)
        }
        i++
    }
    return print
}

// console.log(renderPorMes());