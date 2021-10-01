const path = require("path")
const express = require("express");
const compression = require('compression')
const app = express();
const port = 3000;
const config = require('./server/config.js');
const { products, productInfo, productStyles, relatedProduct } = require('./productController.js');
const axios = require('axios');

app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(express.json());
app.use(compression());

//Axios Requests, format right side URL within client-side request as req.url
const axiosConfig = {
  headers: {
    'content-type': 'application/json',
    'authorization': config.API_KEY
  }
};

// app.get('/*', test);
app.get('/*', (req, res) => {
	const { url } = req
	let splitURL = url.split('/')
	.filter(char => char !== '');
	const firstRoute = splitURL[0];
	switch (firstRoute) {
		case 'products':
			if (splitURL.length === 1) {
				products((err, data) => {
					if (err) {
						res.status(404).send(err);
					} else {
						res.status(200).send(data);
					}
				})
			}
			const id = splitURL[1]
			if (splitURL[2] === 'styles') {
				productStyles(id, (err, data) => {
					if (err) {
						res.status(404).send(err);
					} else {
						res.status(200).send(data);
					}
				})
			} else if (splitURL[2] === 'related') {
				relatedProduct(id, (err, data) => {
					if (err) {
						res.status(404).send(err);
					} else {
						res.status(200).send(data);
					}
				})
			} else {
				productInfo(id, (err, data) => {
					if (err) {
						res.status(404).send(err);
					} else {
						res.status(200).send(data);
					}
				})
			}
			break;
		default:
			res.status(404).send('Error');
	}

//  axios.get(`${API_URL}${req.url}`, axiosConfig)
//   .then((response) => {
//     res.send(response.data);
//   })
//   .catch((error) => {
//     res.sendFile(__dirname + '/client/dist/404page.html');
//   })
});

app.post('/*', (req, res) => {
  axios.post(`${API_URL}${req.url}`, req.body, axiosConfig)
  .then((response) => {
    res.send(response.status);
  })
  .catch((error) => {
    res.send(`Error making POST request: ${error}`);
  });
});

app.put('/*', (req, res) => {
  axios.put(`${API_URL}${req.url}`, {}, axiosConfig)
  .then((response) => {
    res.send(response.status);
  })
  .catch((error) => {
    res.send(`Error making PUT request: ${error}`);
  });
});

//Start Listen
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});


