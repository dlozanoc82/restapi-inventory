import { successAnswer, errorAnswer } from "../../helpers/answersApi.js";
import Cliente from "./ClientsModel.js";
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import path from 'path'
import { formatearFecha } from "../../helpers/managmentDates.js";


// Obtener todos los clientes
const getClients = async (req, res, next) => {
    try {
        const clients = await Cliente.findAll(); // Obtiene todos los registros de la tabla
        successAnswer(req, res, clients, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener un cliente por ID
const getClientById = async (req, res, next) => {
    try {
        const client = await Cliente.findByPk(req.params.id); // Busca por clave primaria
        if (!client) {
            return errorAnswer(req, res, "Cliente no encontrado", 404);
        }
        successAnswer(req, res, client, 200);
    } catch (error) {
        next(error);
    }
};

// Eliminar un cliente por ID
const deleteClientById = async (req, res, next) => {
    try {
        const clientId = req.params.id;
        const result = await Cliente.destroy({ where: { id_cliente: clientId } }); // Elimina por condición
        if (result === 0) {
            return errorAnswer(req, res, "Cliente no encontrado", 404);
        }
        successAnswer(req, res, "Cliente eliminado correctamente", 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar un cliente
const createOrUpdateClient = async (req, res, next) => {
    try {
        const { id_cliente, ...clientData } = req.body;

        let message;
        if (!id_cliente) {
            // Crear nuevo cliente si no hay ID
            await Cliente.create(clientData);
            message = "Cliente creado con éxito";
        } else {
            // Actualizar cliente si hay un ID
            const [updatedRows] = await Cliente.update(clientData, {
                where: { id_cliente },
            });
            if (updatedRows === 0) {
                return errorAnswer(req, res, "Cliente no encontrado", 404);
            }
            message = "Cliente actualizado con éxito";
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

// Reporte Excel
const exportClientsToExcel = async (req, res, next) => {
    try {
        const clients = await Cliente.findAll();

        if (!clients || clients.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay clientes registrados"
            });
        }

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Clientes');

        // Fusionar la primera fila para el título (A1 - I1)
        worksheet.mergeCells('A1:I1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = "LISTADO DE CLIENTES";

        // Aplicar estilos al título
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 20, color: { argb: 'FFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0b5394' } };
        titleCell.border = { 
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        };
        worksheet.getRow(1).height = 60;

        // Agregar el logo en la celda A1
        const logoImage = workbook.addImage({
            filename: 'public/img/logo-excel.png',
            extension: 'png'
        });

        worksheet.addImage(logoImage, {
            tl: { col: 0.2, row: 0.2 }, // Posición en la celda A1
            ext: { width: 60, height: 60 } // Tamaño del logo
        });

        // Insertar explícitamente los encabezados en la fila 2 (A2 - I2)
        worksheet.getRow(2).values = [
            'ID', 'Nombre', 'Apellido', 'Documento', 'Correo', 
            'Celular', 'Dirección', 'Fecha Registro', 'Estado'
        ];

        worksheet.getRow(2).height = 20;

        // Aplicar estilos a los encabezados en A2 - I2
        const headerRow = worksheet.getRow(2);
        headerRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6aa84f' } };
            cell.border = { 
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
        });

        // Definir anchos de columnas manualmente (A2 - I2)
        const columnWidths = [10, 30, 30, 15, 40, 20, 50, 20, 10];
        columnWidths.forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        // Agregar los datos desde la fila 3
        clients.forEach((client, index) => {
            const row = worksheet.addRow([
                index + 1,
                client.nombre_cliente,
                client.apellido_cliente,
                client.documento_cliente,
                client.correo_cliente,
                client.celular_cliente,
                client.direccion_cliente,
                client.fecha_registro,
                client.estado === 1 ? 'ACTIVO' : 'INACTIVO'
            ]);

            row.height = 20;

            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                cell.border = { 
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            });
        });

        // Configurar la respuesta HTTP
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=clientes.xlsx');

        console.log(`Exportando ${clients.length} clientes`);
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error en exportación:', error);
        next(error);
    }
};

// Reporte PDF
const exportClientsToPDF = async (req, res, next) => {
    try {
        const clients = await Cliente.findAll();

        if (!clients || clients.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay clientes registrados"
            });
        }

        // Crear un nuevo documento PDF en formato horizontal con márgenes simétricos
        const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
        
        // Configurar cabeceras de la respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=clientes.pdf');
        
        doc.pipe(res);
        
        // Agregar logo en la parte superior izquierda
        const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');
        doc.image(logoPath, 50, 30, { width: 80 });
        
        // Título del documento
        doc.fontSize(20).text('LISTADO DE CLIENTES', 0, 40, { align: 'center' });
        
        // Fecha de generación del reporte
        const currentDate = new Date();
        doc.fontSize(12).text(`Fecha de generación: ${formatearFecha(currentDate)}`, 0, 70, { align: 'center' });
        doc.moveDown();
        
        // Definir columnas de la tabla
        const tableHeaders = [
            'ID', 'Nombre', 'Apellido', 'Documento', 'Correo', 'Celular', 'Dirección', 'Fecha Registro', 'Estado'
        ];
        
        const columnWidths = [40, 80, 80, 70, 140, 70, 120, 90, 50];
        
        // Dibujar encabezados de la tabla con fondo de color
        let y = doc.y + 40;
        doc.fillColor('#0055A4').rect(50, y, 750, 30).fill(); // Fondo azul oscuro para los encabezados
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
        tableHeaders.forEach((header, i) => {
            doc.text(header, 55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 9, {
                width: columnWidths[i], align: 'left'
            });
        });
        
        y += 30;
        doc.moveTo(50, y).lineTo(800, y).stroke('black'); // Línea resaltada
        
        // Dibujar los datos de la tabla con colores alternos en las filas y líneas horizontales destacadas
        doc.font('Helvetica').fontSize(9);
        clients.forEach((client, index) => {
            doc.fillColor(index % 2 === 0 ? '#D0E4F2' : 'white').rect(50, y, 750, 25).fill();
            
            doc.fillColor('black');
            const row = [
                index + 1,
                client.nombre_cliente,
                client.apellido_cliente,
                client.documento_cliente,
                client.correo_cliente,
                client.celular_cliente,
                client.direccion_cliente,
                formatearFecha(client.fecha_registro),
                client.estado === 1 ? 'ACTIVO' : 'INACTIVO'
            ];
            
            row.forEach((text, i) => {
                // if (i === 8) { // Columna de Estado
                //     doc.fillColor(text === 'ACTIVO' ? 'green' : 'red');
                // } else {
                //     doc.fillColor('black');
                // }
                doc.text(text.toString(), 55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 7, {
                    width: columnWidths[i], align: 'left'
                });
            });
            
            // doc.moveTo(50, y + 25).lineTo(800, y + 25).stroke('black'); // Línea resaltada
            y += 25;
        });
        
        // Finalizar el PDF
        doc.end();
    } catch (error) {
        console.error('Error en exportación:', error);
        next(error);
    }
};


export {
    getClients,
    getClientById,
    deleteClientById,
    createOrUpdateClient,
    exportClientsToExcel,
    exportClientsToPDF
};
