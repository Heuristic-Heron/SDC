DROP DATABASE IF EXISTS PRODUCTS;

CREATE DATABASE PRODUCTS;

\c products;

CREATE TABLE products (
  id int GENERATED BY DEFAULT AS IDENTITY  PRIMARY KEY,
  name VARCHAR ( 50 ) NOT NULL,
  slogan VARCHAR ( 250 ) NOT NULL,
  description VARCHAR ( 1000 ) NOT NULL,
  category VARCHAR ( 25 ) NOT NULL,
  default_price NUMERIC(10,2) NOT NULL CHECK(default_price >= 0)
);

CREATE TABLE relatedProducts (
  id int GENERATED BY DEFAULT AS IDENTITY  PRIMARY KEY,
  current_product_id INT NOT NULL,
  related_product_id INT NOT NULL,
  FOREIGN KEY (current_product_id)
  REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE features (
  id int GENERATED BY DEFAULT AS IDENTITY  PRIMARY KEY,
  product_id INT NOT NULL,
  feature VARCHAR ( 100 ) NOT NULL,
  value VARCHAR ( 100 ) NOT NULL,
  FOREIGN KEY (product_id)
  REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE styles (
  id int GENERATED BY DEFAULT AS IDENTITY  PRIMARY KEY,
  productId INT NOT NULL,
  name VARCHAR ( 100 ) NOT NULL,
  sale_price VARCHAR ( 100 ) NOT NULL,
  original_price VARCHAR ( 100 ) NOT NULL,
  default_style BOOLEAN NOT NULL,
  FOREIGN KEY (productId)
  REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE photos (
  id int GENERATED BY DEFAULT AS IDENTITY  PRIMARY KEY,
  styleId INT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  FOREIGN KEY (styleId)
  REFERENCES styles (id) ON DELETE CASCADE
);

CREATE TABLE skus (
  id int GENERATED BY DEFAULT AS IDENTITY  PRIMARY KEY,
  styleId INT NOT NULL,
  size VARCHAR ( 20 ) NOT NULL,
  quantity INT CHECK(quantity >= 0),
  FOREIGN KEY (styleId)
  REFERENCES styles (id) ON DELETE CASCADE
);

COPY products (id, name, slogan, description, category, default_price)
FROM '/Users/jaylee/SDC/product_csv/product.csv'
DELIMITER ','
CSV HEADER;

COPY relatedProducts (id, current_product_id, related_product_id)
FROM '/Users/jaylee/SDC/product_csv/related.csv'
DELIMITER ','
CSV HEADER;

COPY features (id, product_id, feature, value )
FROM '/Users/jaylee/SDC/product_csv/features.csv'
DELIMITER ','
CSV HEADER;

COPY styles (id, productId, name, sale_price, original_price, default_style)
FROM '/Users/jaylee/SDC/product_csv/styles.csv'
DELIMITER ','
CSV HEADER;

COPY photos (id, styleId, url, thumbnail_url)
FROM '/Users/jaylee/SDC/product_csv/photos.csv'
DELIMITER ','
CSV HEADER;

COPY skus (id, styleId, size, quantity )
FROM '/Users/jaylee/SDC/product_csv/skus.csv'
DELIMITER ','
CSV HEADER;

--Feature Index
create index feature_product_id
on features(product_id);

--Sku Index
create index skus_style_id
on skus(styleid);

--Photo Index
create index photos_style_id
on photos(styleid);

--Style ID Index
create index styles_product_id
on styles(productid);

--Related Products Index
create index related_product_id
on relatedproducts(current_product_id);