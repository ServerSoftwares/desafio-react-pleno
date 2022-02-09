CREATE TABLE IF NOT EXISTS categories(
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_category(
    id_product INTEGER REFERENCES products(id) NOT NULL,
    id_category INTEGER REFERENCES categories(id) NOT NULL,
    PRIMARY KEY(id_product, id_category)
);

CREATE TABLE IF NOT EXISTS sales(
    id SERIAL PRIMARY KEY,
    clientName TEXT,
    totalAmount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_product(
    id_sale INTEGER REFERENCES sales(id) NOT NULL,
    id_product INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL
);