-- Group 84
-- Authors: Andrew Ketola, Blaine Lafreniere

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Plane models.
CREATE OR REPLACE TABLE Models (
	model_id int AUTO_INCREMENT,
	model_name varchar(50) NOT NULL,
	capacity int NOT NULL,
	PRIMARY KEY (model_id)
);

-- Planes have a plane model.
CREATE OR REPLACE TABLE Planes (
	plane_id int AUTO_INCREMENT,
	model_id int NOT NULL,
  mileage int NOT NULL,
	PRIMARY KEY (plane_id),
	FOREIGN KEY (model_id) REFERENCES Models(model_id) ON DELETE CASCADE
);

-- Flights must have a plane assigned to them. Flights can be assigned to many pilots M:N
CREATE OR REPLACE TABLE Flights (
	flight_id int AUTO_INCREMENT,
	plane_id int,
	departure_time datetime NOT NULL,
	arrival_time datetime NOT NULL,
	depart_code varchar(3) NOT NULL,
	arrive_code varchar(3) NOT NULL,
	PRIMARY KEY (flight_id),
	/*A plane can be have many flights*/
	FOREIGN KEY (plane_id) REFERENCES Planes(plane_id) ON DELETE CASCADE
);

-- Pilots can be assigned to many flights M:N
CREATE OR REPLACE TABLE Pilots (
	pilot_id int AUTO_INCREMENT,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	flight_hours int NOT NULL,
	PRIMARY KEY (pilot_id)
);

-- Passengers must have a ticket.
CREATE OR REPLACE TABLE Passengers (
	passenger_id int AUTO_INCREMENT,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	PRIMARY KEY (passenger_id)
);

-- Tickets must have a flight and a passenger.
-- M:N Between Flights and Passengers
CREATE OR REPLACE TABLE Tickets (
	ticket_id int AUTO_INCREMENT,
	flight_id int NOT NULL,
	passenger_id int NOT NULL,
	PRIMARY KEY (ticket_id),
	/*A flight can have many tickets.*/
	FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
	FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE
);

-- M:N Between Flights and Pilots
CREATE OR REPLACE TABLE Flights_Pilots (
	flight_id int NOT NULL,
	pilot_id int NOT NULL,
	PRIMARY KEY (flight_id, pilot_id),
  FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
  FOREIGN KEY (pilot_id) REFERENCES Pilots(pilot_id) ON DELETE CASCADE
);

/* INSERTIONS BELOW */
INSERT INTO Models(model_name, capacity)
VALUES
(
	"Boeing 767",
	216
),
(
	"Boeing 777",
	353
),
(
	"Airbus A330",
	257
);

INSERT INTO Planes(model_id, mileage)
VALUES
(
	(SELECT model_id FROM Models WHERE model_name="Boeing 767"), 1000
),
(
	(SELECT model_id FROM Models WHERE model_name="Boeing 767"), 50000
),
(
	(SELECT model_id FROM Models WHERE model_name="Airbus A330"), 90000
);

INSERT INTO Flights(plane_id, departure_time, arrival_time, depart_code, arrive_code)
VALUES
(
	(SELECT plane_id FROM Planes WHERE plane_id = 1),
	"2024-01-10 14:00:00",
	"2024-01-10 16:00:00",
	"PHX",
	"LAX"
),
(
	(SELECT plane_id FROM Planes WHERE plane_id = 2),
	"2024-01-11 08:30:00",
	"2024-01-11 13:30:00",
	"JFK",
	"MIA"
),
(
	(SELECT plane_id FROM Planes WHERE plane_id = 3),
	"2024-01-12 15:00:00",
	"2024-01-12 18:30:00",
	"DEN",
	"DFW"
);

INSERT INTO Passengers(first_name, last_name)
VALUES
(
	"Bob",
	"Jones"
),
(
	"Joey",
	"Adams"
),
(
	"Chris",
	"Smith"
);

INSERT INTO Pilots(first_name, last_name, flight_hours)
VALUES
(
	"Joe",
	"Bob",
	100
),
(
	"John",
	"Smith",
	200
),
(
	"Jimmy",
	"John",
	300
);

INSERT INTO Tickets(flight_id, passenger_id)
VALUES
(
	(SELECT flight_id FROM Flights WHERE flight_id = 1),
	(SELECT passenger_id FROM Passengers WHERE passenger_id = 1)
),
(
	(SELECT flight_id FROM Flights WHERE flight_id = 1),
	(SELECT passenger_id FROM Passengers WHERE passenger_id = 2)
),
(
	(SELECT flight_id FROM Flights WHERE flight_id = 1),
	(SELECT passenger_id FROM Passengers WHERE passenger_id = 3)
);

INSERT INTO Flights_Pilots(flight_id, pilot_id)
VALUES
(
  (SELECT flight_id FROM Flights WHERE flight_id = 1),
  (SELECT pilot_id FROM Pilots WHERE pilot_id = 3)
),
(
  (SELECT flight_id FROM Flights WHERE flight_id = 1),
  (SELECT pilot_id FROM Pilots WHERE pilot_id = 2)
),
(
  (SELECT flight_id FROM Flights WHERE flight_id = 2),
  (SELECT pilot_id FROM Pilots WHERE pilot_id = 1)
);


SET FOREIGN_KEY_CHECKS = 1;
COMMIT;