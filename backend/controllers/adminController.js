import importModels from '../models/index.js';

const dbPromise = importModels();

// Mengambil data semua product
const getAllProducts = async (req, res, next) => {
	try {
		const db = await dbPromise;
		const Product = db.Product;
		const Category = db.Category;

		const products = await Product.findAll({
			include: [
				{
					model: Category,
				},
			],
		});
		res.json(products);
	} catch (error) {
		next(error);
	}
};

//Menambahkan product baru
const addProduct = async (req, res, next) => {
	try {
		const db = await dbPromise;
		const Product = db.Product;
		const {
			product_name,
			product_description,
			price,
			qty_stock,
			category_id,
			qty_sold,
			image_path,
		} = req.body;

		const addProducts = await Product.create({
			product_name,
			product_description,
			price,
			qty_stock,
			category_id,
			qty_sold,
			image_path,
		});
		res.status(201).json({
			message: 'Product added successfully',
			addProducts,
		});
	} catch (error) {
		next(error);
	}
};

//Menambahkan category baru
const addCategory = async (req, res, next) => {
	try {
		const db = await dbPromise;
		const Category = db.Category;
		const { category_name, description } = req.body;

		const addCategories = await Category.create({
			category_name,
			description,
		});
		res.status(201).json({
			message: 'Category added succesfully',
			addCategories,
		});
	} catch (error) {
		next(error);
	}
};

//Menghapus product atau membuat statusnya menjadi inactive
const deleteProduct = async (req, res, next) => {
	try {
		const db = await dbPromise;
		const Product = db.Product;
		const { productId } = req.params;

		const product = await Product.findByPk(productId);
		if (!product) {
			return res.status(404).json({
				message: 'Product not found',
			});
		}

		await Product.destroy({
			where: {
				product_id: productId,
			},
		});

		res.status(200).json({
			message: 'Product deleted successfully',
		});
	} catch (error) {
		next(error);
	}
};
////////////////////
const updateProduct = async (req, res, next) => {
	try {
		const db = await dbPromise;
		const Product = db.Product;
		const { productId } = req.params;
		const {
			product_name,
			product_description,
			price,
			qty_stock,
			category_id,
			qty_sold,
			image_path,
		} = req.body;

		// Memperbarui produk
		const [updated] = await Product.update({
			product_name,
			product_description,
			price,
			qty_stock,
			category_id,
			qty_sold,
			image_path,
		}, {
			where: {product_id: productId },
		});

		// Memeriksa apakah ada baris yang diperbarui
		if (updated) {
			const updatedProduct = await Product.findByPk(productId);
			res.status(200).json({
				message: 'Product updated successfully',
				product: updatedProduct,
			});
		} else {
			res.status(404).json({
				message: 'Product not found',
			});
		}
	} catch (error) {
		next(error);
	}
};
	  // Mencari produk berdasarkan nama produk (product_name)
	const getProductsByName = async (req, res, next) => {
		try {
		const db = await dbPromise;
		const Product = db.Product;
		const Category = db.Category;
		const ProductReview = db.ProductReview;
		const { productName } = req.params;
	
	
		const products = await Product.findAll({
			where: {
			product_name: productName,
			},
			include: [
			{
				model: Category,
			},
			{
				model: ProductReview,
			},
			],
		});
	
		  // Jika produk tidak ditemukan, kirimkan respons 404
		if (products.length === 0) {
			return res.status(404).json({
			message: 'Product not found',
			});
		}
	
		  // Mengirimkan respons dengan produk yang ditemukan
		res.json(products);
		} catch (error) {
		next(error);
		}
	};
	
/////////////////////////
const getProductsByCategoryName = async (req, res, next) => {
	try {
		const db = await dbPromise;
		const Category = db.Category;
		const Product = db.Product;
		const { category_name } = req.params;

	
		const categories = await Category.findAll({
			where: {
				category_name: category_name,
			},
			include: [
				{
					model: Category,
				},
				{
					model: Product,
				},
				],
		});

	
		if (categories.length === 0) {
			return res.status(404).json({
				message: 'Category not found',
			});
		}

		
		res.json(categories);
	} catch (error) {
		next(error);
	}
};
////////////////////
const getProductsByMinPrice = async (req, res, next) => {
    try {
        const db = await dbPromise;
        const Product = db.Product;
        const { minPrice } = req.params;

        const products = await Product.findAll({
            where: {
                price: {
                    [db.Sequelize.Op.gte]: minPrice,
                },
            },
            include: [
                {
                    model: Product,
                },

            ],
        });

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found above the specified price',
            });
        }

        res.json(products);
    } catch (error) {
        next(error);
    }
};
////////////////////
const getProductsByMaxPrice = async (req, res, next) => {
    try {
        const db = await dbPromise;
        const Product = db.Product;
        const { maxPrice } = req.params;

        const products = await Product.findAll({
            where: {
                price: {
                    [db.Sequelize.Op.lte]: maxPrice,
                },
            },
            include: [
                {
                    model: Product,
                },

            ],
        });

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found above the specified price',
            });
        }

        res.json(products);
    } catch (error) {
        next(error);
    }
};
//Menghapus product atau membuat statusnya menjadi inactive

//Menghapus user atau membuat statusnya menjadi inactive

export { getAllProducts, addProduct, addCategory, deleteProduct, updateProduct, getProductsByName,getProductsByCategoryName, getProductsByMinPrice, getProductsByMaxPrice};
