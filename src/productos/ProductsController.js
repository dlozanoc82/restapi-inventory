// ProductController.js
import { successAnswer } from "../../helpers/answersApi.js";
import Producto from "./ProductModel.js";
import Subcategoria from "../subcategorias/SubCategoriesModel.js";
import Categoria from "../categorias/CategoriaModel.js";
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import path from 'path'
import { formatearFecha } from "../../helpers/managmentDates.js";

// Obtener todos los productos con sus categorías y subcategorías
const getProducts = async (req, res, next) => {
    try {
        const products = await Producto.findAll({
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria', // IMPORTANTE: Usa el alias definido en el modelo
                    attributes: ['id_subcategoria','nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria', // IMPORTANTE: Usa el alias definido en el modelo
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ],
            order: [['id_producto', 'DESC']],
        });

        // Convertir instancias a JSON para poder acceder a los datos correctamente
        const formattedProducts = products.map(product => {
            const productJSON = product.toJSON(); // 💡 Convierte la instancia en un objeto JSON

            return {
                id_producto: productJSON.id_producto,
                nombre_producto: productJSON.nombre_producto,
                descripcion_producto: productJSON.descripcion_producto,
                imagen_producto: productJSON.imagen_producto,
                precio_producto: productJSON.precio_producto,
                stock: productJSON.stock,
                garantia: productJSON.garantia,
                duracion_garantia: productJSON.duracion_garantia,
                fecha_creacion: productJSON.fecha_creacion,
                estado: productJSON.estado,
                id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
                id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
                categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
                subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
            };
        });

        successAnswer(req, res, formattedProducts, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener producto por ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Producto.findByPk(req.params.id, {
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria', // Usa el alias correcto
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria', // Usa el alias correcto
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productJSON = product.toJSON(); // 💡 Convierte la instancia en un objeto JSON para evitar problemas

        const formattedProduct = {
            id_producto: productJSON.id_producto,
            nombre_producto: productJSON.nombre_producto,
            descripcion_producto: productJSON.descripcion_producto,
            imagen_producto: productJSON.imagen_producto,
            precio_producto: productJSON.precio_producto,
            stock: productJSON.stock,
            garantia: productJSON.garantia,
            duracion_garantia: productJSON.duracion_garantia,
            fecha_creacion: productJSON.fecha_creacion,
            estado: productJSON.estado,
            id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
            id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
            categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
            subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
        };

        successAnswer(req, res, formattedProduct, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener producto por código RFID
export const getProductByRFID = async (req, res, next) => {
    try {
        const { codigo_rfid } = req.params; // Capturar el código desde los parámetros de la URL

        const product = await Producto.findOne({
            where: { codigo_rfid },
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria',
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productJSON = product.toJSON();

        const formattedProduct = {
            id_producto: productJSON.id_producto,
            nombre_producto: productJSON.nombre_producto,
            descripcion_producto: productJSON.descripcion_producto,
            imagen_producto: productJSON.imagen_producto,
            precio_producto: productJSON.precio_producto,
            stock: productJSON.stock,
            garantia: productJSON.garantia,
            duracion_garantia: productJSON.duracion_garantia,
            fecha_creacion: productJSON.fecha_creacion,
            estado: productJSON.estado,
            id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
            id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
            categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
            subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
        };

        successAnswer(req, res, formattedProduct, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener producto por ID Subcategoria
const getProductsBySubcategoryId = async (req, res, next) => {
    try {
        const idSubcategoria = req.params.id;

        const products = await Producto.findAll({
            where: { id_subcategoria: idSubcategoria }, // Filtrar por subcategoría
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria',
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ],
            order: [['id_producto', 'DESC']],
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No hay productos en esta subcategoría" });
        }

        // Formatear los datos antes de enviarlos
        const formattedProducts = products.map(product => {
            const productJSON = product.toJSON();
            return {
                id_producto: productJSON.id_producto,
                nombre_producto: productJSON.nombre_producto,
                descripcion_producto: productJSON.descripcion_producto,
                imagen_producto: productJSON.imagen_producto,
                precio_producto: productJSON.precio_producto,
                stock: productJSON.stock,
                garantia: productJSON.garantia,
                duracion_garantia: productJSON.duracion_garantia,
                fecha_creacion: productJSON.fecha_creacion,
                estado: productJSON.estado,
                id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
                id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
                categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
                subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
            };
        });

        successAnswer(req, res, formattedProducts, 200);
    } catch (error) {
        next(error);
    }
};

// Eliminar producto por ID
const deleteProductById = async (req, res, next) => {
    try {
        const rowsDeleted = await Producto.destroy({ where: { id_producto: req.params.id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        successAnswer(req, res, "Producto eliminado correctamente", 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar producto
const createOrUpdateProduct = async (req, res, next) => {
    try {
        const { id_producto, ...productData } = req.body;

        if (req.file) {
            productData.imagen_producto = req.file.filename;
        }

        let message;
        if (!id_producto) {
            await Producto.create(productData);
            message = "Producto creado con éxito";
        } else {
            const existingProduct = await Producto.findByPk(id_producto);
            if (!existingProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            if (!req.file) {
                productData.imagen_producto = existingProduct.imagen_producto;
            }

            await Producto.update(productData, { where: { id_producto } });
            message = "Producto actualizado con éxito";
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

// Reporte en EXCEL
const exportProductsToExcel = async (req, res, next) => {
    try {
        const products = await Producto.findAll({
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria',
                    include: [{
                        model: Categoria,
                        as: 'categoria'
                    }]
                }
            ],
            order: [['id_producto', 'DESC']]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay productos registrados"
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Productos');

        // Título
        worksheet.mergeCells('A1:K1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = "LISTADO DE PRODUCTOS";
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
        worksheet.addImage(logoImage, {
            tl: { col: 0.2, row: 0.2 },
            ext: { width: 60, height: 60 }
        });

        // Encabezados
        worksheet.getRow(2).values = [
            'ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Garantía',
            'Duración Garantía', 'Fecha Creación', 'Estado', 'Categoría', 'Subcategoría'
        ];
        worksheet.getRow(2).height = 20;

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
        const columnWidths = [8, 30, 50, 15, 10, 15, 20, 20, 15, 20, 20];
        columnWidths.forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        // Datos
        products.forEach((product, index) => {
            const garantiaText = product.garantia === 1 ? 'SI' : 'NO';
            const duracionGarantia = product.garantia === 1 ? formatearFecha(product.duracion_garantia) : 'NO APLICA';
            const estadoText = product.estado === 1 ? 'ACTIVO' : 'INACTIVO';
            const categoria = product.subcategoria?.categoria?.nombre_categoria || "Sin categoría";
            const subcategoria = product.subcategoria?.nombre_subcategoria || "Sin subcategoría";

            const row = worksheet.addRow([
                index + 1,
                product.nombre_producto,
                product.descripcion_producto,
                product.precio_producto,
                product.stock,
                garantiaText,
                duracionGarantia,
                product.fecha_creacion,
                estadoText,
                categoria,
                subcategoria
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
        res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error en exportación de productos:', error);
        next(error);
    }
};

// Reporte en PDF
const exportProductsToPDF = async (req, res, next) => {
    try {
        const products = await Producto.findAll({
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria',
                    include: [{
                        model: Categoria,
                        as: 'categoria'
                    }]
                }
            ],
            order: [['id_producto', 'DESC']]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No hay productos registrados"
            });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');
        doc.pipe(res);

        // Logo y título solo en primera página
        const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');
        doc.image(logoPath, 50, 30, { width: 80 });
        doc.fontSize(20).text('LISTADO DE PRODUCTOS', 0, 40, { align: 'center' });
        doc.fontSize(12).text(`Fecha de generación: ${formatearFecha(new Date())}`, 0, 70, { align: 'center' });
        doc.moveDown();

        // Configuración de columnas
        const tableHeaders = [
            'ID', 
            'Categoría', 
            'Subcategoría', 
            'Producto', 
            'Descripción', 
            'Precio', 
            'Stock', 
            ['Duración', 'Garantía'],
            'Estado'
        ];
        
        const columnWidths = [20, 70, 90, 100, 200, 80, 40, 80, 60];
        let y = doc.y + 40;

        // Función para dibujar encabezados
        const drawHeaders = () => {
            doc.fillColor('#0055A4').rect(50, y, 750, 40).fill();
            doc.fillColor('#ffffff').font('Helvetica-Bold');
            
            tableHeaders.forEach((header, i) => {
                const xPosition = 55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
                
                if (Array.isArray(header)) {
                    doc.fontSize(9)
                       .text(header[0], xPosition, y + 10, { width: columnWidths[i], align: 'left' })
                       .text(header[1], xPosition, y + 22, { width: columnWidths[i], align: 'left' });
                } else {
                    doc.fontSize(10)
                       .text(header, xPosition, y + 15, { 
                           width: columnWidths[i], 
                           align: 'left'
                       });
                }
            });
            y += 40;
            doc.moveTo(50, y).lineTo(800, y).stroke('black');
        };

        // Encabezados iniciales
        drawHeaders();

        // Altura máxima por página (A4 landscape: 595.28pt)
        const maxPageHeight = 595.28 - 50; // Margen inferior

        // Generar filas con paginación
        products.forEach((product, index) => {
            // Verificar espacio para nueva fila
            if (y + 25 > maxPageHeight) {
                doc.addPage();
                y = 50; // Resetear posición Y
                drawHeaders(); // Encabezados en nueva página
                doc.font('Helvetica').fontSize(9); // Restaurar fuente normal
            }

            // Procesar datos
            const duracionGarantia = product.garantia === 1 
                ? formatearFecha(product.duracion_garantia) 
                : 'NO APLICA';
                
            const estadoText = product.estado === 1 ? 'ACTIVO' : 'INACTIVO';
            const categoria = product.subcategoria?.categoria?.nombre_categoria || "Sin categoría";
            const subcategoria = product.subcategoria?.nombre_subcategoria || "Sin subcategoría";

            // Fondo alternado
            doc.fillColor(index % 2 === 0 ? '#D0E4F2' : 'white').rect(50, y, 750, 25).fill();
            doc.fillColor('black').font('Helvetica').fontSize(9);

            // Datos
            const row = [
                (index + 1).toString(),
                categoria,
                subcategoria,
                product.nombre_producto,
                product.descripcion_producto,
                `$${parseFloat(product.precio_producto).toFixed(2)}`,
                product.stock.toString(),
                duracionGarantia,
                estadoText
            ];

            // Dibujar celdas
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
        console.error('Error en exportación de productos:', error);
        next(error);
    }
};
export {
    deleteProductById,
    createOrUpdateProduct,
    getProductById,
    getProducts,
    getProductsBySubcategoryId,
    exportProductsToExcel,
    exportProductsToPDF
};
