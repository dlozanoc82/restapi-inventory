
import Categoria from "../src/categorias/CategoriaModel.js";
import Producto from "../src/productos/ProductModel.js";
import Subcategoria from "../src/subcategorias/SubCategoriesModel.js";

process.stdin.setEncoding('utf-8');

console.log('Escanea la tarjeta RFID:');

process.stdin.on('data', (data) => {
    const codigo = data.trim();
    console.log(`Código RFID: ${codigo}`);
    getProductByRFID(codigo);
});


const getProductByRFID = async (codigo) => {
    try {
        const product = await Producto.findOne({
            where: { codigo_rfid: codigo }, // Buscar por el código RFID
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
            console.log("Producto no encontrado");
            return; // Evita usar `res` aquí si no estás en una ruta de Express
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

        console.log('Desde RFID', { formattedProduct });
    } catch (error) {
        console.error("Error al buscar producto por RFID:", error);
    }
};
