-- Group 84
-- Authors: Andrew Ketola, Blaine Lafreniere

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Plane models.
DROP TABLE IF EXISTS Models CASCADE;
CREATE TABLE Models (
	model_id int AUTO_INCREMENT,
	model_name varchar(50) NOT NULL,
	capacity int NOT NULL,
	PRIMARY KEY (model_id)
);

-- Planes have a plane model.
DROP TABLE IF EXISTS Planes CASCADE;
CREATE TABLE Planes (
	plane_id int AUTO_INCREMENT,
	model_id int NOT NULL,
  mileage int NOT NULL,
	PRIMARY KEY (plane_id),
	FOREIGN KEY (model_id) REFERENCES Models(model_id) ON DELETE CASCADE
);

-- Flights must have a plane assigned to them. Flights can be assigned to many pilots M:N
DROP TABLE IF EXISTS Flights CASCADE;
CREATE TABLE Flights (
	flight_id int AUTO_INCREMENT,
	plane_id int,
	departure_time datetime NOT NULL,
	arrival_time datetime NOT NULL,
	depart_airport_code varchar(3) NOT NULL,
	arrive_airport_code varchar(3) NOT NULL,
	PRIMARY KEY (flight_id),
	/*A plane can be have many flights*/
	FOREIGN KEY (plane_id) REFERENCES Planes(plane_id) ON DELETE CASCADE
);

-- Pilots can be assigned to many flights M:N
DROP TABLE IF EXISTS Pilots CASCADE;
CREATE TABLE Pilots (
	pilot_id int AUTO_INCREMENT,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	flight_hours int NOT NULL,
	PRIMARY KEY (pilot_id)
);

-- Passengers must have a ticket.
DROP TABLE IF EXISTS Passengers CASCADE;
CREATE TABLE Passengers (
	passenger_id int AUTO_INCREMENT,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	PRIMARY KEY (passenger_id)
);

-- Tickets must have a flight and a passenger.
-- M:N Between Flights and Passengers
DROP TABLE IF EXISTS Tickets CASCADE;
CREATE TABLE Tickets (
	ticket_id int AUTO_INCREMENT,
	flight_id int NOT NULL,
	passenger_id int NOT NULL,
	PRIMARY KEY (ticket_id),
	/*A flight can have many tickets.*/
	FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
	FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE
);

-- M:N Between Flights and Pilots
DROP TABLE IF EXISTS Flights_Pilots CASCADE;
CREATE TABLE Flights_Pilots (
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

INSERT INTO Flights(plane_id, departure_time, arrival_time, depart_airport_code, arrive_airport_code)
VALUES
(
	(SELECT plane_id FROM Planes WHERE plane_id = 1),
	"2023-12-01 13:30:00",
	"2023-12-03 13:30:00",
	"PHX", "LAX"
),
(
	(SELECT plane_id FROM Planes WHERE plane_id = 2),
	"2023-12-02 13:30:00",
	"2023-12-04 13:30:00"
	"JFK", "MIA"
),
(
	(SELECT plane_id FROM Planes WHERE plane_id = 3),
	"2023-12-03 13:30:00",
	"2023-12-05 13:30:00"
	"DEN", "DFW"
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