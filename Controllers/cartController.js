const Cart = require('../Models/cart');
const crudController = require('./crudController')

//add to cart
//exports.addCart = crudController.addNew(Cart)
//delete cart
//exports.deleteCart = crudController.delete(Cart)
//get all carts
//exports.getCarts = crudController.getResults(Cart)
//get a singel cart
// 




exports.addItemToCart = (req, res) => {
  console.log("hjhjh");
  const user = req.user
  console.log(user)
  Cart.findOne({ user: req.user })
    .exec((error, cart) => {

      if (error) return res.status(400).json({ error });
      if (cart) {
        //if cart already exists then update cart by quantity

        const product = req.body.cartItems.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = { "user": req.user, "cartItems.product": product };
          update = {
            "$set": {
              "cartItems.$": {
                ...req.body.cartItems,
                quantity: (item.quantity + req.body.cartItems.quantity) - item.quantity
              }
            },
          };
        } else {
          condition = { user: req.user };
          update = {
            "$push": {
              "cartItems": req.body.cartItems
            },
          };
        }

        Cart.findOneAndUpdate(condition, update)
          .exec((error, _cart) => {
            if (error) return res.status(400).json({ error });
            if (_cart) {
              return res.status(201).json({ cart: _cart });
            }
          })
      } else {
        //if cart not exist then create a new cart
        const cart = new Cart({
          user: req.user,
          cartItems: [{
            product: req.body.cartItems.product,
            quantity: req.body.cartItems.quantity
          }],
        });
        console.log(cart)
        cart.save((error, cart) => {
          if (error) return res.status(400).json({ error });
          if (cart) {
            return res.status(201).json({ cart });
          }
        });
      }
    });
};
exports.addItemToCar = (req, res) => {

  //if cart not exist then create a new cart
  const cart = new Cart({
    user: req.user,
    cartItems: req.body.cartItems,
  });
  cart.save((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      return res.status(201).json({ cart });
    }
  });


};


exports.getCartItems = (req, res) => {
  //const { user } = req.body.payload;
  //if(user){
  Cart.findOne({ user: req.user })
    .populate("cartItems.product", "_id title price shipping_amnt images")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        console.log(cart.cartItems)
        let cartItems = {};

        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.title,
            img: item.product.images[0],
            price: item.product.price,
            qty: item.quantity,
            shipping_amnt: item.product.shipping_amnt
          };
        });
        res.status(200).json({ cartItems });
      }
    });
  //}
};

// new update remove cart items
exports.removeCartItems = (req, res) => {
  const { productId } = req.body.payload;
  console.log("rem",)
  if (productId) {
    Cart.update(
      { user: req.user },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};