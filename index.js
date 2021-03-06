import express from 'express';
import mongoose from 'mongoose';
import Cards from './dbCards.js';
import Users from './dbUsers.js';
import Products from './dbProducts.js';
import Order from './dbOrders.js';
import Cart from './dbCarts.js';
import Queries from './dbQuery.js';
import Comments from './dbComments.js';
import CORS from 'cors';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import details from './routes/dialogflow.js';
import Wishlist from './dbWishlist.js';
const stripe = new Stripe(
	'sk_test_51IRvCrFB1lDZnUf7B47wyM5MKgZXSNuWouDhlTioqn64E604mkxQxbdjgZpL2vFXtXatXlkyn09dlwmqRPHBuj7L000aDw37cS'
);

// import { cloudinary } from './cloudinary';
//app config

const app = express();
const port = process.env.PORT || 8000;
const connection_url = `mongodb+srv://som1234:som1234@cluster0.pm46v.mongodb.net/flubuyDB?retryWrites=true&w=majority`;
//middlewares
// app.use(express.json());
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(CORS());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/dialogflow', details);

import cloudinary from 'cloudinary';
cloudinary.config({
	cloud_name: 'dxixjouyh',
	api_key: 694117747184348,
	api_secret: '-xl0SzkBwHpOlSC-pubWob2WxJA',
});

global.currentUser = {};

//DB config
mongoose.connect(connection_url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'souravsingh10386@gmail.com',
		pass: 'Sourav@123',
	},
});

var mailOptions = {
	from: 'souravsingh10386@gmail.com',
	to: 'ns1324y@gmail.com',
	subject: 'Payment for FlyBuy',
	html: '<h1>Welcome</h1><p>Thank you for placing your order, your payment has been successfully completed</p>',
};

//api Endpoints
app.get('/', (req, res) => {
	res.status(200).send('Welcome to FlyBuy');
});

app.post('/tinder/card', (req, res) => {
	const dbcard = req.body;

	Cards.create(dbcard, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			console.log(data);
			res.status(201).send(data);
		}
	});
});

app.get('/tinder/card', (req, res) => {
	Cards.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/user/login', (req, res) => {
	console.log('get');
	Users.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.post('/user/login', (req, res) => {
	const userCred = req.body;
	console.log('userCred', userCred);
	Users.create(userCred, (err, data) => {
		if (err) {
			console.log(`11`, 11);
			res.status(500).send(err);
		} else {
			console.log(`22`, 22);
			res.status(201).send(data);
		}
	});
});

app.post('/user/find', (req, res) => {
	const userFind = req.body;
	console.log('userFind.username', userFind.username);
	Users.find(
		{
			$and: [{ username: userFind.username }, { password: userFind.password }],
		},
		(err, data) => {
			if (err) {
				console.log(1);
				res.status(500).send(err);
			} else {
				console.log(2);
				currentUser = data || null;
				res.status(201).send(data);
			}
		}
	);
});

app.get('/user/current', (req, res) => {
	res.status(200).send(currentUser);
});

app.post('/user/logout', (req, res) => {
	console.log('currentUser', currentUser);

	res.status(200).send('Done');
});

app.post('/product/create', (req, res) => {
	const prodCreate = req.body;
	console.log('prodCreate', prodCreate);
	Products.create(prodCreate, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get(`/user/current/:userId`, (req, res) => {
	const { userId } = req.params;
	Users.find({ _id: userId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get(`/retailers/all`, (req, res) => {
	Users.find({ role: 'retailer' }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get(`/retailer/:retailerId`, (req, res) => {
	const { retailerId } = req.params;
	Users.find({ _id: retailerId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/product/all', (req, res) => {
	Products.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/product/all/customer', (req, res) => {
	const { keyword, userCategory } = req.query;
	if (!userCategory) {
		Products.find(
			{
				$and: [{ product_name: { $regex: keyword } }, { status: 'Approved' }],
			},
			(err, data) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(201).send(data);
				}
			}
		);
	} else {
		console.log(userCategory);
		Products.find(
			{
				$and: [
					{ product_name: { $regex: keyword } },
					{ product_category: { $in: [userCategory] } },
					{ status: 'Approved' },
				],
			},
			(err, data) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(201).send(data);
				}
			}
		);
	}
});

app.get('/product/all/retailer/:retailerId', (req, res) => {
	const { retailerId } = req.params;
	Products.find({ retailerId: retailerId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.put('/product/:productId/approve', (req, res) => {
	const { productId } = req.params;
	Products.updateOne(
		{ _id: productId },
		{
			$set: {
				status: 'Approved',
			},
		},
		(err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).send(data);
			}
		}
	);
});

app.get('/product/:productId', (req, res) => {
	const { productId } = req.params;
	console.log('productId', productId);
	Products.find({ _id: productId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.delete('/product/:prodId/user/:userId/remove/cart', (req, res) => {
	const { prodId, userId } = req.params;
	console.log('userId', userId, 'prodId', prodId);
	Cart.remove({ $and: [{ productId: prodId }, { user: userId }] }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.post('/product/:productId/add/cart', (req, res) => {
	const { productId } = req.params;
	const user = req.body;
	console.log(user);
	console.log(`productId`, productId);
	currentUser = user || null;
	Cart.find({ $and: [{ productId: productId }, { user: user._id }] }, (err, data) => {
		if (err) {
			console.log(`1`);
			res.status(500).send(err);
		} else {
			if (data.length > 0) {
				console.log(`2`);
				console.log(`data`, data);
				return res.status(200).json({ err: 'cart already has a product with same details' });
			} else {
				console.log(`data fffffffff`, data);
				console.log(`3`);
				Products.find({ _id: productId }, (err, data) => {
					if (err) {
						console.log(`4`);
						res.status(500).send(err);
					} else {
						console.log(`5`);
						console.log(`data`);
						const values = {
							productId: data[0]._id,
							quantity: 1,
							product: data[0],
							user,
						};
						Cart.create(values, (err, data) => {
							if (err) {
								res.status(500).send(err);
							} else {
								res.status(201).send(data);
							}
						});
					}
				});
			}
		}
	});
});

app.post('/product/:productId/add/wishlist', (req, res) => {
	const { productId } = req.params;
	const user = req.body;
	console.log(user);
	console.log(`productId`, productId);
	currentUser = user || null;
	Wishlist.find({ $and: [{ productId: productId }, { user: user._id }] }, (err, data) => {
		if (err) {
			console.log(`1`);
			res.status(500).send(err);
		} else {
			if (data.length > 0) {
				console.log(`2`);
				console.log(`data`, data);
				return res.status(200).json({ err: 'wishlist already has a product with same details' });
			} else {
				console.log(`data fffffffff`, data);
				console.log(`3`);
				Products.find({ _id: productId }, (err, data) => {
					if (err) {
						console.log(`4`);
						res.status(500).send(err);
					} else {
						console.log(`5`);
						console.log(`data`);
						const values = {
							productId: data[0]._id,
							product: data[0],
							user,
						};
						Wishlist.create(values, (err, data) => {
							if (err) {
								res.status(500).send(err);
							} else {
								res.status(201).send(data);
							}
						});
					}
				});
			}
		}
	});
});
app.delete('/product/:prodId/remove/:userId/wishlist', (req, res) => {
	const { prodId, userId } = req.params;
	console.log('userId', userId, 'prodId', prodId);
	Wishlist.remove({ $and: [{ productId: prodId }, { user: userId }] }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/user/:userId/wishlist', (req, res) => {
	const { userId } = req.params;
	console.log('userId', userId);
	Wishlist.find({ user: userId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/user/:userId/cart', (req, res) => {
	const { userId } = req.params;
	console.log('userId', userId);
	Cart.find({ user: userId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.post('/api/upload', async (req, res) => {
	try {
		const fileStr = req.body.base64EncodedImage;
		const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
			upload_preset: 'ml_default',
		});
		console.log(uploadResponse);
		res.send(uploadResponse);
	} catch (err) {
		console.error('dhjwj', err);
		res.status(500).json({ err: 'Something went wrong' });
	}
});

app.post('/payment/create', async (req, res) => {
	try {
		const total = req.query.total;
		console.log(`total`, total);
		if (total) {
			const payIntent = await stripe.paymentIntents.create({
				amount: total,
				currency: 'inr',
			});

			res.status(201).send({
				clientSecret: payIntent.client_secret,
			});
		}
	} catch (err) {
		console.error('dhjwj', err);
		res.status(500).json({ err: 'Something went wrong' });
	}
});

app.get('/mail/send', async (req, res) => {
	console.log(`object`);
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
	res.status(201).send({
		text: 'Mail sent successfuly',
	});
});

app.post('/order/create', async (req, res) => {
	try {
		const data = req.body;
		console.log(data);
		Order.create(data, (err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).json({ message: 'Order added successfully' });
			}
		});
	} catch (err) {
		console.error('error in creating order', err);
		res.status(500).json({ err: 'Something went wrong' });
	}
});

app.get('/cart/:userId/empty', (req, res) => {
	const { userId } = req.params;
	console.log('userId to empty cart', userId);
	Cart.deleteMany({ user: userId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).json({ err: 'cart emptied' });
		}
	});
});

app.get('/orders/all', (req, res) => {
	const { user } = req.query;
	if (user) {
		console.log('user to view orders', user);
		Order.find({ userId: user }, (err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).send(data);
			}
		});
	} else {
		Order.find((err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).send(data);
			}
		});
	}
});

app.get('/order/:orderId', (req, res) => {
	const { orderId } = req.params;
	if (orderId) {
		console.log('order id to view orders', orderId);
		Order.find({ _id: orderId }, (err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).send(data);
			}
		});
	} else {
		res.status(404).json({ message: 'no order id provided' });
	}
});

app.put('/order/:orderId/verify', (req, res) => {
	const { orderId } = req.params;
	console.log('gggggggggggg', req.body);
	if (orderId) {
		console.log('order id to verify orders', orderId);

		Order.updateOne(
			{ _id: orderId },
			{
				$set: {
					status: req.body.status,
					admin_status_comment: req.body.admin_status_comment,
					signature: req.body.signature,
				},
			},
			(err, data) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(201).send(data);
				}
			}
		);
	} else {
		res.status(404).json({ message: 'no order id provided' });
	}
});
app.put('/product/:id/user/:userId/quantity/cart', (req, res) => {
	const { id, userId } = req.params;
	const { action } = req.query;
	Cart.find({ $and: [{ productId: id }, { user: userId }] }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			if (data[0].quantity) {
				Cart.updateOne(
					{ $and: [{ productId: id }, { user: userId }] },
					{
						$set: {
							quantity: action === 'inc' ? data[0].quantity + 1 : data[0].quantity - 1,
						},
					},
					(err, data) => {
						if (err) {
							res.status(500).send(err);
						} else {
							console.log(data);
							res.status(201).send(data);
						}
					}
				);
			}
		}
	});
});
app.put('/order/:orderId/update', (req, res) => {
	const { orderId } = req.params;
	console.log('hhhhhhhhhhhh', req.body);
	if (orderId) {
		console.log('order id to update orders', orderId);

		Order.updateOne(
			{ _id: orderId },
			{
				$set: {
					category: req.body.category,
					category_comment: req.body.category_comment,
					category_success_rate: req.body.category_success_rate,
					location: req.body.location,
					latitude: req.body.latitude,
					longitude: req.body.longitude,
				},
			},
			(err, data) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(201).send(data);
				}
			}
		);
	} else {
		res.status(404).json({ message: 'no order id provided' });
	}
});

app.put('/order/:orderId/user/comment', (req, res) => {
	const { orderId } = req.params;
	console.log('hhhhhhhhhhhh', req.body);
	if (orderId) {
		console.log('order id to update orders', orderId);

		Order.updateOne(
			{ _id: orderId },
			{
				$set: {
					user_comment: req.body.userComment,
				},
			},
			(err, data) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(201).send(data);
				}
			}
		);
	} else {
		res.status(404).json({ message: 'no order id provided' });
	}
});

app.get('/users/all', (req, res) => {
	Users.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.post('/comment/add', (req, res) => {
	const commentCreate = req.body;
	console.log('commentCreate', commentCreate);
	Comments.create(commentCreate, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/comments/all/product/:productId', (req, res) => {
	const { productId } = req.params;
	Comments.find({ prodId: productId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.get('/query/all', (req, res) => {
	Queries.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.get('/user/:userId/query', (req, res) => {
	const { userId } = req.params;
	Queries.find({ userId: userId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.get('/query/:queryId', (req, res) => {
	const { queryId } = req.params;
	Queries.find({ _id: queryId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});
app.put('/query/:queryId/close', (req, res) => {
	const { queryId } = req.params;
	const { comment } = req.body;
	Queries.updateOne(
		{ _id: queryId },
		{
			$set: {
				status: 'Closed',
				admin_comment: comment,
			},
		},
		(err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).send(data);
			}
		}
	);
});
//listener
app.listen(port, () => {
	console.log('listing to port', port);
});
