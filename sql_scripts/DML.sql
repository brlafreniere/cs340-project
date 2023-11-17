-- Group 84
-- Authors: Andrew Ketola, Blaine Lafreniere

-- tables: Models, Planes, Flights, Flights_Pilots, Pilots, Tickets, Passengers
-- 7 tables total

----------------------------------------------------------
----------------------------------------------------------

-- Displays for all tables

-- 6 select statements pulling from 7 tables.

--Models Page
SELECT model_id, model_name, capacity FROM Models

--Planes Page
SELECT plane_id, mileage, Models.model_id, Models.model_name FROM Planes
INNER JOIN Models ON Models.model_id = Planes.model_id

--Flights Page
SELECT flight_id, Planes.plane_id, departure_time, arrival_time FROM Flights
INNER JOIN Planes ON Planes.plane_id = Flights.plane_id
INNER JOIN Flights_Pilots ON Flights_Pilots.flight_id = Flight.flight_id
INNER JOIN Pilots ON Flights_Pilots.pilot_id = Pilots.pilot_id

--Pilots Page (Also displays flight ID of the pilot's assigned flight)
SELECT Pilots.pilot_id, first_name, last_name, flight_hours, Flights_Pilots.flight_id FROM Pilots
INNER JOIN Flights_Pilots ON Flights_Pilots.pilot_id = Pilots.pilot_id
INNER JOIN Flights ON Flights.flight_id = Flights_Pilots.pilot_id

--Passengers Page
SELECT passenger_id, first_name, last_name, Tickets.ticket_id FROM Passengers
INNER JOIN Tickets ON Tickets.ticket_id = Passengers.ticket_id

--Tickets Page
SELECT ticket_id, flight_id, Passengers.passenger_id, CONCAT(Passengers.first_name, " ", Passengers.last_name) AS "Passenger Name" FROM Tickets
INNER JOIN Passengers ON Passengers.passenger_id = Tickets.passenger_id

----------------------------------------------------------
----------------------------------------------------------

--Displays for Update Forms (display specific data points)

-- 5 select statements pulling from 7 tables.

--Models
SELECT model_id, model_name, capacity FROM Models WHERE model_id = :model_id_clicked

--Planes update (Planes, Models)
SELECT plane_id, mileage, Models.model_id, Models.model_name FROM Planes
INNER JOIN Models ON Models.model_id = Planes.model_id
WHERE plane_id = :plane_id_clicked

-- Flights update (Flights, Planes, Flights_Pilots, Pilots)
SELECT
  flight_id, departure_time, arrival_time,
  Pilots.first_name, Pilots.last_name,
  Planes.plane_id, Planes.model_name
FROM Flights
INNER JOIN Planes ON Planes.plane_id = Flights.plane_id
INNER JOIN Flights_Pilots ON Flights_Pilots.flight_id = Flights.flight_id
INNER JOIN Pilots ON Pilots.pilot_id = Flights_Pilots.pilot_id
WHERE Flights.flight_id = :flight_id_selected

--Passenger Update (Passenger)
SELECT passenger_id, first_name, last_name, ticket_id FROM Passengers
WHERE passenger_id = :passenger_id_clicked

--Ticket Update (Tickets, Passengers)
SELECT ticket_id, flight_id, Passengers.passenger_id, (Passengers.first_name, " ", Passengers.last_name) AS "Passenger Name" FROM Tickets
INNER JOIN Passengers ON Passengers.passenger_id = Tickets.passenger_id
WHERE ticket_id = :ticket_id_clicked

----------------------------------------------------------
----------------------------------------------------------

-- Insertions

-- 1 Insertion statement per table, 7 statements total

--Models
INSERT INTO Models (model_name, capacity)
VALUES (:modelnamein, :capacityin)

--Planes
INSERT INTO Planes (model_id, mileage)
VALUES (:model_id_from_name_dropdown, :mileage_input)

--Flights
INSERT INTO Flights (plane_id, departure_time, arrival_time)
VALUES (:plane_id_in, :departuretimein, :arrivaltimein)

--Pilots
INSERT INTO Pilots (first_name, last_name, flight_hours)
VALUES (:fnamein, :lnamein, :flighthoursin)

--Passengers
INSERT INTO Passengers (first_name, last_name)
VALUES (:fnamein, :lnamein)

--Tickets
INSERT INTO Tickets (flight_id, passenger_id)
VALUES (:flight_id, :passenger_id_selected)

--Flights_Pilots
INSERT INTO Flights_Pilots (flight_id, pilot_id)
VALUES (:flight_id, :pilot_id_selected)

----------------------------------------------------------
----------------------------------------------------------

-- Updates for all tables

-- 1 per table, 7 update statements total

UPDATE Models SET model_name = :modelnamein, capacity = :capacityin WHERE model_id= :model_id_clicked

UPDATE Planes SET model_id = :model_id_from_name_dropdown, mileage = :mileage_input WHERE plane_id = :plane_id_clicked

UPDATE Flights SET plane_id = :plane_id_in, departure_time = :dtimein, arrival_time = :arrivaltimein WHERE flight_id = :flight_id_clicked

UPDATE Pilots SET first_name = :pilot_fnamein, last_name = :pilot_lastnamein, flight_hours = :flighthoursin WHERE pilot_id = :pilot_id_clicked

UPDATE Passengers SET first_name = :passenger_fnamein, last_name = :passenger_lnamein, ticket_id = :ticket_id_from_id_dropdown WHERE passenger_id = :passenger_id_clicked

UPDATE Tickets SET flight_id = :flight_id_from_dropdown, passenger_id = :passenger_id_from_dropdown WHERE ticket_id = :ticket_id_clicked

-- change the pilot for a given flight
UPDATE Flights_Pilots SET flight_id = :new_flight_id, pilot_id = :new_pilot_id

----------------------------------------------------------
----------------------------------------------------------

-- Deletions for all tables

-- 1 per table, 7 total

DELETE FROM Models WHERE model_id = :model_id_clicked

DELETE FROM Planes WHERE plane_id = :plane_id_clicked

DELETE FROM Flights WHERE flight_id = :flight_id_clicked

DELETE FROM Pilots WHERE pilot_id = :pilot_id_clicked

DELETE FROM Passengers WHERE passenger_id = :passenger_id_clicked

DELETE FROM Tickets WHERE ticket_id = :ticket_id_clicked

-- This will be used when updating a flight and changing the pilots.
-- To change the pilots on a flight: first delete any pilots associated with the flight,
-- and then re-insert new records for the new pilots.
DELETE FROM Flights_Pilots WHERE flight_id = :flight_id_selected AND pilot_id = :pilot_id_selected