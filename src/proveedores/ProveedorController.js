import { successAnswer } from "../../helpers/answersApi.js";
import Proveedor from "./ProveedorModel.js";
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import path from 'path'
import { formatearFecha } from "../../helpers/managmentDates.js";


// Obtener todos los proveedores
const getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Proveedor.findAll();
        successAnswer(req, res, suppliers, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener un proveedor por ID
const getSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supplier = await Proveedor.findByPk(id);

        if (!supplier) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        }

        successAnswer(req, res, supplier, 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar un proveedor
const createOrUpdateSupplier = async (req, res, next) => {
    try {
        const { id_proveedor, ...supplierData } = req.body;

        if (!id_proveedor) {
            // Crear un nuevo proveedor
            const newSupplier = await Proveedor.create(supplierData);
            return successAnswer(req, res, "Proveedor creado con éxito" , 201);
        } else {
            // Actualizar un proveedor existente
            const [updatedRows] = await Proveedor.update(supplierData, {
                where: { id_proveedor },
            });

            if (updatedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado para actualizar" });
            }

            successAnswer(req, res, { message: "Proveedor actualizado con éxito" }, 200);
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un proveedor por ID
const deleteSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRows = await Proveedor.destroy({
            where: { id_proveedor: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: "Proveedor no encontrado para eliminar" });
        }

        successAnswer(req, res, { message: "Proveedor eliminado correctamente" }, 200);
    } catch (error) {
        next(error);
    }
};

// Reporte Excel
const exportSuppliersToExcel = async (req, res, next) => {
    try {
        const suppliers = await Proveedor.findAll();

        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay proveedores registrados"
            });
        }

        // Crear libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Proveedores');

        // Configuración del título (A1-F1)
        worksheet.mergeCells('A1:F1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = "LISTADO DE PROVEEDORES";

        // Estilos del título
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

        // Logo (ajustar ruta según necesidad)
        const logoImage = workbook.addImage({
            filename: 'public/img/logo-excel.png',
            extension: 'png'
        });
        worksheet.addImage(logoImage, { tl: { col: 0.2, row: 0.2 }, ext: { width: 60, height: 60 } });

        // Encabezados (A2-F2)
        worksheet.getRow(2).values = ['ID', 'Nombre', 'Celular', 'Correo', 'Fecha Creación', 'Estado'];
        worksheet.getRow(2).height = 20;

        // Estilos de encabezados
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

        // Anchura de columnas
        const columnWidths = [10, 30, 20, 40, 20, 10];
        columnWidths.forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        // Datos de proveedores
        suppliers.forEach((supplier, index) => {
            const row = worksheet.addRow([
                index + 1,
                supplier.nombre_proveedor,
                supplier.celular_proveedor,
                supplier.correo_proveedor,
                supplier.fecha_creacion,
                supplier.estado === 1 ? 'ACTIVO' : 'INACTIVO'
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

        // Enviar archivo
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=proveedores.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error en exportación:', error);
        next(error);
    }
};

// Reporte PDF
const exportSuppliersToPDF = async (req, res, next) => {
    try {
        const suppliers = await Proveedor.findAll();

        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay proveedores registrados"
            });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=proveedores.pdf');
        doc.pipe(res);

        // Logo y título
        const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');
        doc.image(logoPath, 50, 30, { width: 80 });
        doc.fontSize(20).text('LISTADO DE PROVEEDORES', 0, 40, { align: 'center' });
        doc.fontSize(12).text(`Fecha de generación: ${formatearFecha(new Date())}`, 0, 70, { align: 'center' });
        doc.moveDown();

        // Configuración de tabla optimizada (suma total: 750)
        const tableHeaders = ['ID', 'Nombre', 'Celular', 'Correo', 'Fecha Creación', 'Estado'];
        const columnWidths = [50, 160, 100, 220, 130, 70]; // <- Nuevos anchos
        let y = doc.y + 40;

        // Función para encabezados
        const drawHeaders = () => {
            doc.fillColor('#0055A4').rect(50, y, 750, 30).fill();
            doc.fillColor('#ffffff')
               .font('Helvetica-Bold')
               .fontSize(12);
            
            tableHeaders.forEach((header, i) => {
                doc.text(header, 
                    55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), 
                    y + 9, 
                    { width: columnWidths[i], align: 'left' }
                );
            });
            y += 30;
            doc.moveTo(50, y).lineTo(800, y).stroke('black');
        };

        drawHeaders();

        // Altura máxima por página
        const maxPageHeight = 595.28 - 50; // A4 landscape height - margen inferior

        // Generar filas
        suppliers.forEach((supplier, index) => {
            if (y + 25 > maxPageHeight) {
                doc.addPage();
                y = 50;
                drawHeaders();
                doc.font('Helvetica').fontSize(11);
            }

            // Fondo alternado
            doc.fillColor(index % 2 === 0 ? '#D0E4F2' : 'white').rect(50, y, 750, 25).fill();
            
            // Datos
            const row = [
                (index + 1).toString(),
                supplier.nombre_proveedor,
                supplier.celular_proveedor,
                supplier.correo_proveedor,
                formatearFecha(supplier.fecha_creacion),
                supplier.estado === 1 ? 'ACTIVO' : 'INACTIVO'
            ];

            doc.fillColor('black').font('Helvetica').fontSize(11);
            
            row.forEach((text, i) => {
                doc.text(text, 
                    55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), 
                    y + 7, 
                    { width: columnWidths[i], align: 'left' }
                );
            });

            y += 25;
        });

        doc.end();
    } catch (error) {
        console.error('Error en exportación:', error);
        next(error);
    }
};


export {
    getSuppliers,
    getSupplierById,
    createOrUpdateSupplier,
    deleteSupplierById,
    exportSuppliersToExcel,
    exportSuppliersToPDF
};
