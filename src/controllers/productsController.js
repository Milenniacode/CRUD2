const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = (products) => { //en este caso products es un argumento
	fs.writeFileSync(productsFilePath, JSON.stringify(products), { encoding: 'utf-8' })
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Mostrar todos los productos del Json
	index: (req, res) => {
		res.render("products", { products, toThousand })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		/* Necesitamos enviar el detalle de un producto */

		let productId = req.params.id; //guardamos en una variable el id que viene por parametro

		/* A la constante products (linea 5) le aplicamos el metodo find para obtener:
	   el id del producto que coincide con el id por parametro */

		let product = products.find(product => product.id == productId);

		/* Atravez del metodo render enviamos entre comillas la vista "details" y product que es la variable
		que contiene el resultado del metodo find */
		res.render("detail", {
			product,
			toThousand,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},

	// Create -  Method to store
	store: (req, res) => {

		/* Formula para crear un id unico en los productos */

		let lastId = products[products.length - 1].id;

		/* Creamos una variable asignandole las propiedades que va a tener
		el nuevo producto que agregemos, las propiedades son las que tenemos en el JSON */

		let newProduct = {
			id: lastId + 1, // <--- Aca: aclaramos que la id q le vamos a dar al producto va a ser el valor del ultimo id + 1
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.file ? req.file.filename : null,
		}

		products.push(newProduct); /* aplicamos el metodo push para agregar el nuevo producto al final del array */

		/* LLamos a la funcion que se va a encargar de escribir el Json con el nuevo producto */
		writeJson(products);

		res.redirect("/products/");

	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = Number(req.params.id);

		let productToEdit = products.find(product => product.id === productId);

		res.render("product-edit-form", {
			productToEdit,

		})
	},
	// Update - Method to update
	update: (req, res) => {
		let productId = Number(req.params.id);

		/* Aplicamos foreach para editar una propiedad de un producto */
		products.forEach(product => {
			if (product.id === productId) {
				/* Reasignamos valores/valores */
				product.name = req.body.name;
				product.price = req.body.price;
				product.discount = req.body.discount;
				product.category = req.body.category;
				product.description = req.body.description;
				if (req.file) {
					product.image = req.file.filename;
				}
			}

		});
		
		writeJson(products);

		res.send("producto editado correctamente");

	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {

		let productId = Number(req.params.id);

		let newArrayProducts = products.filter(product => product.id !== productId);

		writeJson(newArrayProducts);

		res.send("Producto eliminado Correctamente")
	}
};

module.exports = controller;