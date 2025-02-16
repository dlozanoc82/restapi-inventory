import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const generateHeader = (doc) => {
    const logoPath = path.join(__dirname, '../public/img/logo.png');
    
    doc
        .image(logoPath, 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('Mi Empresa S.A.', 110, 57)
        .fontSize(10)
        .text('Calle Principal 123', 200, 65, { align: 'right' })
        .text('Ciudad, País, 00000', 200, 80, { align: 'right' })
        .moveDown();
};

export const generateCustomerInformation = (doc, sale) => {
    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Factura', 50, 160)
        .fontSize(10)
        .text(`Número: ${sale.id_venta}`, 50, 200)
        .text(`Fecha: ${new Date(sale.fecha_venta).toLocaleDateString()}`, 50, 215)
        .text(`Cliente: ${sale.cliente}`, 50, 230)
        .text(`Vendedor: ${sale.vendedor}`, 50, 245)
        .text(`Método de Pago: ${sale.medio_pago}`, 50, 260)
        .moveDown();
};

export const generateInvoiceTable = (doc, sale) => {
    const invoiceTableTop = 330;
    const columnWidths = {
        producto: 200, // Ancho para el nombre del producto
        cantidad: 80,
        precioUnitario: 100,
        subtotal: 100
    };

    // Encabezados de la tabla
    doc.font('Helvetica-Bold')
        .fontSize(10)
        .text('Producto', 50, invoiceTableTop, { width: columnWidths.producto })
        .text('Cantidad', 260, invoiceTableTop, { width: columnWidths.cantidad, align: 'right' })
        .text('P. Unitario', 340, invoiceTableTop, { width: columnWidths.precioUnitario, align: 'right' })
        .text('Subtotal', 440, invoiceTableTop, { width: columnWidths.subtotal, align: 'right' });

    let yPosition = invoiceTableTop + 20;

    sale.sale_details.forEach(detail => {
        doc.font('Helvetica')
            .fontSize(10)
            .text(detail.nombre_producto, 50, yPosition, { width: columnWidths.producto })
            .text(detail.cantidad, 260, yPosition, { width: columnWidths.cantidad, align: 'right' })
            .text(`$${detail.precio_unitario}`, 340, yPosition, { width: columnWidths.precioUnitario, align: 'right' })
            .text(`$${detail.subtotal}`, 440, yPosition, { width: columnWidths.subtotal, align: 'right' });

        yPosition += 20;
    });

    // Total
    doc.font('Helvetica-Bold')
        .text(`Total: $${sale.total}`, 440, yPosition + 10, { width: columnWidths.subtotal, align: 'right' });
};


export const generateFooter = (doc) => {
    // Obtener la altura total de la página
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 250; // Ajusta el margen inferior

    doc
        .fontSize(10)
        .text(
            'Gracias por su compra. Para consultas: soporte@empresa.com',
            50,
            footerY,
            { align: 'center', width: 500 }
        );
};