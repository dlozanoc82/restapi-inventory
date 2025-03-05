// comprasController.js
import { successAnswer } from "../../helpers/answersApi.js";
import Adquisicion from "./ComprasModel.js";
import Producto from "../productos/ProductModel.js";
import Proveedor from "../proveedores/ProveedorModel.js";
import Subcategoria from "../subcategorias/SubCategoriesModel.js";
import Categoria from "../categorias/CategoriaModel.js";

// Obtener todas las adquisiciones con sus productos y proveedores
const getAdquisiciones = async (req, res, next) => {
    try {
        const adquisiciones = await Adquisicion.findAll({
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id_producto', 'nombre_producto', 'precio_producto'],
                    include: {
                        model: Subcategoria,
                        as: 'subcategoria',
                        attributes: ['id_subcategoria', 'nombre_subcategoria'],
                        include: {
                            model: Categoria,
                            as: 'categoria',
                            attributes: ['id_categoria', 'nombre_categoria']
                        }
                    }
                },
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre_proveedor']
                }
            ],
            order: [['id_adquisicion', 'DESC']]
        });

        const formattedAdquisiciones = adquisiciones.map(adq => {
            const adqJSON = adq.toJSON();
            return {
                id_adquisicion: adqJSON.id_adquisicion,
                fecha_adquisicion: adqJSON.fecha_adquisicion,
                cantidad: adqJSON.cantidad,
                precio_unitario: adqJSON.precio_unitario,
                total: adqJSON.total,
                precio_venta: adqJSON.precio_venta,
                id_producto: adqJSON.producto?.id_producto || null,
                id_proveedor: adqJSON.proveedor?.id_proveedor || null,
                producto: {
                    id_producto: adqJSON.producto?.id_producto || null,
                    nombre_producto: adqJSON.producto?.nombre_producto || "Sin producto",
                    precio_producto: adqJSON.producto?.precio_producto || null,
                    id_subcategoria: adqJSON.producto?.subcategoria?.id_subcategoria || null,
                    subcategoria: adqJSON.producto?.subcategoria?.nombre_subcategoria || "Sin subcategoría",
                    id_categoria: adqJSON.producto?.subcategoria?.categoria?.id_categoria || null,
                    categoria: adqJSON.producto?.subcategoria?.categoria?.nombre_categoria || "Sin categoría"
                },
                proveedor: {
                    id_proveedor: adqJSON.proveedor?.id_proveedor || null,
                    nombre_proveedor: adqJSON.proveedor?.nombre_proveedor || "Sin proveedor"
                }
            };
        });

        successAnswer(req, res, formattedAdquisiciones, 200);
    } catch (error) {
        next(error);
    }
};

const getAdquisicionById = async (req, res, next) => {
    try {
        const adquisicion = await Adquisicion.findByPk(req.params.id, {
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id_producto', 'nombre_producto', 'precio_producto'],
                    include: {
                        model: Subcategoria,
                        as: 'subcategoria',
                        attributes: ['id_subcategoria', 'nombre_subcategoria'],
                        include: {
                            model: Categoria,
                            as: 'categoria',
                            attributes: ['id_categoria', 'nombre_categoria']
                        }
                    }
                },
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre_proveedor']
                }
            ]
        });

        if (!adquisicion) {
            return res.status(404).json({ message: "Adquisición no encontrada" });
        }

        const adqJSON = adquisicion.toJSON();
        const formattedAdquisicion = {
            id_adquisicion: adqJSON.id_adquisicion,
            fecha_adquisicion: adqJSON.fecha_adquisicion,
            cantidad: adqJSON.cantidad,
            precio_unitario: adqJSON.precio_unitario,
            total: adqJSON.total,
            precio_venta: adqJSON.precio_venta,
            id_producto: adqJSON.producto?.id_producto || null,
            id_proveedor: adqJSON.proveedor?.id_proveedor || null,
            producto: {
                id_producto: adqJSON.producto?.id_producto || null,
                nombre_producto: adqJSON.producto?.nombre_producto || "Sin producto",
                precio_producto: adqJSON.producto?.precio_producto || null,
                id_subcategoria: adqJSON.producto?.subcategoria?.id_subcategoria || null,
                subcategoria: adqJSON.producto?.subcategoria?.nombre_subcategoria || "Sin subcategoría",
                id_categoria: adqJSON.producto?.subcategoria?.categoria?.id_categoria || null,
                categoria: adqJSON.producto?.subcategoria?.categoria?.nombre_categoria || "Sin categoría"
            },
            proveedor: {
                id_proveedor: adqJSON.proveedor?.id_proveedor || null,
                nombre_proveedor: adqJSON.proveedor?.nombre_proveedor || "Sin proveedor"
            }
        };

        successAnswer(req, res, formattedAdquisicion, 200);
    } catch (error) {
        next(error);
    }
};


// Eliminar una adquisición por ID
const deleteAdquisicionById = async (req, res, next) => {
    try {
        const rowsDeleted = await Adquisicion.destroy({ where: { id_adquisicion: req.params.id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: "Adquisición no encontrada" });
        }

        successAnswer(req, res, "Adquisición eliminada correctamente", 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar una adquisición
const createOrUpdateAdquisicion = async (req, res, next) => {
    try {
        const { id_adquisicion, ...adquisicionData } = req.body;

        let message;
        if (!id_adquisicion) {
            await Adquisicion.create(adquisicionData);
            message = "Adquisición creada con éxito";
        } else {
            const existingAdquisicion = await Adquisicion.findByPk(id_adquisicion);
            if (!existingAdquisicion) {
                return res.status(404).json({ message: "Adquisición no encontrada" });
            }

            await Adquisicion.update(adquisicionData, { where: { id_adquisicion } });
            message = "Adquisición actualizada con éxito";
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

export {
    deleteAdquisicionById,
    createOrUpdateAdquisicion,
    getAdquisicionById,
    getAdquisiciones,
};
