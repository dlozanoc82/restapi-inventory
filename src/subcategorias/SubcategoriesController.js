import { successAnswer } from "../../helpers/answersApi.js";
import Categoria from "../categorias/CategoriaModel.js";
import Subcategoria from "./SubCategoriesModel.js";
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import path from 'path'
import { formatearFecha } from "../../helpers/managmentDates.js";

// Controlador para Subcategorías
const getSubcategories = async (req, res, next) => {
    try {
        const subcategories = await Subcategoria.findAll({
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nombre_categoria'], 
                },
            ]
        });

        // Transformar la respuesta para extraer nombre_categoria
        const formattedSubcategories = subcategories.map(subcat => {
            const { categoria, ...subcatData } = subcat.get({ plain: true });  
            return { 
                ...subcatData, 
                nombre_categoria: categoria ? categoria.nombre_categoria : null 
            };
        });

        successAnswer(req, res, formattedSubcategories, 200);
    } catch (error) {
        next(error);
    }
};


const getSubcategoryById = async (req, res, next) => {
    try {
        const subcategory = await Subcategoria.findByPk(req.params.id);
        successAnswer(req, res, subcategory, 200);
    } catch (error) {
        next(error);
    }
}

const getSubcategoriesByCategoryId = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const subcategories = await Subcategoria.findAll({ where: { id_categoria: categoryId } });

        successAnswer(req, res, subcategories, 200);
    } catch (error) {
        next(error);
    }
}


const deleteSubcategoryById = async (req, res, next) => {
    try {
        const subcategoryId = req.params.id;
        await Subcategoria.destroy({ where: { id_subcategoria: subcategoryId } });
        successAnswer(req, res, 'Subcategoría eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

const createOrUpdateSubcategory = async (req, res, next) => {
    try {
        let message = '';
        const { id_subcategoria, ...subcategoryData } = req.body;

        if (!id_subcategoria || id_subcategoria === 0) {
            await Subcategoria.create(subcategoryData);
            message = 'Subcategoría creada con éxito';
        } else {
            await Subcategoria.update(subcategoryData, { where: { id_subcategoria } });
            message = 'Subcategoría actualizada con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
}

// Reporte Excel para Subcategorías (Ordenado por Categoría)
const exportSubcategoriesToExcel = async (req, res, next) => {
    try {
        const subcategories = await Subcategoria.findAll({
            include: [{ 
                model: Categoria, 
                as: 'categoria', 
                attributes: ['nombre_categoria'] 
            }],
            order: [
                [{ model: Categoria, as: 'categoria' }, 'nombre_categoria', 'ASC'], // Orden principal
                ['nombre_subcategoria', 'ASC'] // Orden secundario
            ]
        });

        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay subcategorías registradas"
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Subcategorías');

        // Configuración del título
        worksheet.mergeCells('A1:F1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = "LISTADO DE SUBCATEGORÍAS";
        
        // Estilos título
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

        // Logo 
        const logoImage = workbook.addImage({
            filename: 'public/img/logo-excel.png',
            extension: 'png'
        });
        worksheet.addImage(logoImage, { tl: { col: 0.2, row: 0.2 }, ext: { width: 60, height: 60 } });

        // Encabezados
        worksheet.getRow(2).values = ['ID', 'Categoría', 'Subcategoría', 'Descripción', 'Fecha Creación', 'Estado'];
        worksheet.getRow(2).height = 20;

        // Estilos encabezados
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

        // Anchuras de columnas
        const columnWidths = [10, 30, 30, 60, 20, 10];
        columnWidths.forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        // Datos
        subcategories.forEach((subcat, index) => {
            const row = worksheet.addRow([
                index + 1,
                subcat.categoria?.nombre_categoria || 'Sin categoría',
                subcat.nombre_subcategoria,
                subcat.descripcion_subcategoria,
                subcat.fecha_creacion,
                subcat.estado === 1 ? 'ACTIVO' : 'INACTIVO'
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

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=subcategorias.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error en exportación:', error);
        next(error);
    }
};

// Reporte PDF para Subcategorías (Ordenado por Categoría)
const exportSubcategoriesToPDF = async (req, res, next) => {
    try {
        const subcategories = await Subcategoria.findAll({
            include: [{ 
                model: Categoria, 
                as: 'categoria', 
                attributes: ['nombre_categoria'] 
            }],
            order: [
                [{ model: Categoria, as: 'categoria' }, 'nombre_categoria', 'ASC'], // Orden principal
                ['nombre_subcategoria', 'ASC'] // Orden secundario
            ]
        });

        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay subcategorías registradas"
            });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=subcategorias.pdf');
        doc.pipe(res);

        // Logo y título
        const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');
        doc.image(logoPath, 50, 30, { width: 80 });
        doc.fontSize(20).text('LISTADO DE SUBCATEGORÍAS', 0, 40, { align: 'center' });
        doc.fontSize(12).text(`Fecha de generación: ${formatearFecha(new Date())}`, 0, 70, { align: 'center' });
        doc.moveDown();

        // Configuración de tabla
        const tableHeaders = ['ID', 'Categoría', 'Subcategoría', 'Descripción', 'Fecha Creación', 'Estado'];
        const columnWidths = [40, 100, 140, 250, 120, 60]; 
        let y = doc.y + 40;

        const drawHeaders = () => {
            doc.fillColor('#0055A4').rect(50, y, 750, 30).fill();
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12);
            
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

        const maxPageHeight = 595.28 - 50;

        subcategories.forEach((subcat, index) => {
            if (y + 25 > maxPageHeight) {
                doc.addPage();
                y = 50;
                drawHeaders();
                doc.font('Helvetica').fontSize(11);
            }

            doc.fillColor(index % 2 === 0 ? '#D0E4F2' : 'white').rect(50, y, 750, 25).fill();
            
            const rowData = [
                (index + 1).toString(),
                subcat.categoria?.nombre_categoria || 'Sin categoría',
                subcat.nombre_subcategoria,
                subcat.descripcion_subcategoria,
                formatearFecha(subcat.fecha_creacion),
                subcat.estado === 1 ? 'ACTIVO' : 'INACTIVO'
            ];

            doc.fillColor('black').font('Helvetica').fontSize(11);
            
            rowData.forEach((text, i) => {
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
    getSubcategories,
    getSubcategoryById,
    getSubcategoriesByCategoryId,
    deleteSubcategoryById,
    createOrUpdateSubcategory,
    exportSubcategoriesToExcel,
    exportSubcategoriesToPDF
}