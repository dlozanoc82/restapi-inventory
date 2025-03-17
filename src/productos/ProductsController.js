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
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ]
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

        worksheet.mergeCells('A1:H1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = "LISTADO DE PRODUCTOS";
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 20, color: { argb: 'FFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0b5394' } };
        worksheet.getRow(1).height = 40;

        worksheet.getRow(2).values = [
            'ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Subcategoría', 'Estado'
        ];
        worksheet.getRow(2).height = 20;
        worksheet.getRow(2).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };

        const columnWidths = [10, 30, 40, 15, 10, 20, 20, 10];
        columnWidths.forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        products.forEach((product, index) => {
            worksheet.addRow([
                index + 1,
                product.nombre_producto,
                product.descripcion_producto,
                product.precio_producto,
                product.stock,
                product.subcategoria?.categoria?.nombre_categoria || '',
                product.subcategoria?.nombre_subcategoria || '',
                product.estado === 1 ? 'ACTIVO' : 'INACTIVO'
            ]);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error en exportación:', error);
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
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ]
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

        // Agregar logo en la parte superior izquierda
        const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');
        doc.image(logoPath, 50, 30, { width: 80 });
        
        // Título del documento
        doc.fontSize(20).text('LISTADO DE PRODUCTOS', 0, 40, { align: 'center' });
        
        // Fecha de generación del reporte
        const currentDate = new Date();
        doc.fontSize(12).text(`Fecha de generación: ${formatearFecha(currentDate)}`, 0, 70, { align: 'center' });
        doc.moveDown();
                

        const tableHeaders = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Subcategoría', 'Estado'];
        const columnWidths = [40, 100, 210, 80, 50, 80, 100, 60];

        let y = doc.y + 20;
        doc.fillColor('#0055A4').rect(50, y, 750, 30).fill();
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
        tableHeaders.forEach((header, i) => {
            doc.text(header, 55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 9, {
                width: columnWidths[i], align: 'left'
            });
        });
        y += 30;
        doc.moveTo(50, y).lineTo(800, y).stroke('black');

        doc.font('Helvetica').fontSize(9);
        products.forEach((product, index) => {
            doc.fillColor(index % 2 === 0 ? '#D0E4F2' : 'white').rect(50, y, 750, 25).fill();
            doc.fillColor('black');
            const row = [
                index + 1,
                product.nombre_producto,
                product.descripcion_producto,
                product.precio_producto,
                product.stock,
                product.subcategoria?.categoria?.nombre_categoria || '',
                product.subcategoria?.nombre_subcategoria || '',
                product.estado === 1 ? 'ACTIVO' : 'INACTIVO'
            ];
            row.forEach((text, i) => {
                doc.text(text, 55 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 7, {
                    width: columnWidths[i], align: 'left'
                });
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
    deleteProductById,
    createOrUpdateProduct,
    getProductById,
    getProducts,
    getProductsBySubcategoryId,
    exportProductsToExcel,
    exportProductsToPDF
};
