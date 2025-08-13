CREATE DATABASE ExpertSoft;
use ExpertSoft;

-- Crear tabla Clientes 
CREATE TABLE Clients (
	customer_id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
	mail VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    adress VARCHAR(225)
);

--  tabla Plataformas 
CREATE TABLE Platforms (
	platform_id INT PRIMARY KEY AUTO_INCREMENT,
	platform_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create table Invoices
CREATE TABLE Invoices (
	invoice_id INT PRIMARY KEY AUTO_INCREMENT,
	customer_id INT NOT NULL,
	issue_date DATE NOT NULL,
	due_date DATE,
	total_amount DECIMAL(12,2) NOT NULL,
	status ENUM('pending', 'paid', 'partial') DEFAULT 'pending',
CONSTRAINT fk_customer_invoices FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);


    -- Crear tabla Transacciones 
CREATE TABLE Transactions (
		transaction_id INT PRIMARY KEY AUTO_INCREMENT,
		invoice_id INT NOT NULL,
		platform_id INT NOT NULL,
		transaction_date DATETIME NOT NULL,
		amount DECIMAL(12,2) NOT NULL,
        CONSTRAINT fk_invoice_transactions FOREIGN KEY (invoice_id)
        REFERENCES Invoices(invoice_id),
        CONSTRAINT fk_transactions_platforms FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id),
        CONSTRAINT fk_transactions_paymentmethods FOREIGN KEY (payment_method_id) REFERENCES payment_method_id(payment_method_id)
	);
	