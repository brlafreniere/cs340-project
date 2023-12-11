import moment from "moment"

// index page
const select_flights = `
SELECT * FROM Flights
LEFT JOIN Planes ON Flights.plane_id = Planes.plane_id
LEFT JOIN Models ON Planes.model_id = Models.model_id
`

// specific flight
const select_flight = `
SELECT * FROM Flights
LEFT JOIN Planes ON Flights.plane_id = Planes.plane_id
LEFT JOIN Models ON Planes.model_id = Models.model_id
WHERE flight_id = ?
`

// for planes drop-down
const select_planes = `
SELECT * FROM Planes
JOIN Models ON Planes.model_id = Models.model_id
`

// for pilot drop-downs
const select_pilots = `
SELECT * FROM Pilots
`

// to display assigned pilots for a specific flight (for edit/dropdown functionality)
const select_flight_pilots = `
SELECT * FROM Flights_Pilots
JOIN Pilots ON Pilots.pilot_id = Flights_Pilots.pilot_id
WHERE Flights_Pilots.flight_id = ?
`

const delete_flight_pilots = `
DELETE FROM Flights_Pilots
WHERE flight_id = ?
`

const insert_flight_query = `
INSERT INTO Flights (plane_id, departure_time, arrival_time, depart_code, arrive_code)
VALUES (?, ?, ?, ?, ?)
`

const insert_flights_pilots_query = `
INSERT INTO Flights_Pilots (flight_id, pilot_id)
VALUES (?, ?)
`

const delete_flight = `
DELETE FROM Flights
WHERE flight_id = ?
`

const update_flight = `
UPDATE Flights
SET plane_id = ?, departure_time = ?, arrival_time = ?, depart_code = ?, arrive_code = ?
WHERE flight_id = ?
`

function flights_controller(app, db) {

  // ---------
  // index
  // ---------

  app.get('/flights', async (req, res) => {
    try {
      const flights = await db.awaitQuery(select_flights)
      res.render('flights/index', {flights})
    } catch (error) {
      res.send(error)
    }
  })

  // ---------
  // new / create
  // ---------

  app.post('/flights', async (req, res) => {
    let {plane_id, departure_time, arrival_time, pilot_ids, depart_code, arrive_code} = req.body

    plane_id = plane_id || null

    departure_time = new Date(departure_time) //.toISOString().slice(0, 19).replace('T', ' ')
    arrival_time = new Date(arrival_time) //.toISOString().slice(0, 19).replace('T', ' ')

    // need to know the ID of the flight before we can assign pilots
    const flight_result = await db.awaitQuery(insert_flight_query, [plane_id, departure_time, arrival_time, depart_code, arrive_code])
    const flight_id = flight_result['insertId']

    for (const pilot_id of pilot_ids) {
      let flight_pilot_result = await db.awaitQuery(insert_flights_pilots_query, [flight_id, pilot_id])
    }

    res.status(201).redirect(301, '/flights')
  })

  app.get('/flights/new', async (req, res) => {
    const planes = await db.awaitQuery(select_planes)
    const pilots = await db.awaitQuery(select_pilots)
    res.render('flights/new', {planes, pilots})
  })

  // ---------
  // edit / update
  // ---------

  app.get('/flights/:flight_id/edit', async (req, res) => {
    const {flight_id} = req.params

    const flight_results = await db.awaitQuery(select_flight, flight_id)
    const flight = flight_results[0]

    flight.departure_time = moment(flight.departure_time).format("YYYY-MM-DD HH:mm")
    flight.arrival_time = moment(flight.arrival_time).format("YYYY-MM-DD HH:mm")

    const planes = await db.awaitQuery(select_planes)
    const pilots = await db.awaitQuery(select_pilots)

    const assigned_pilots = await db.awaitQuery(select_flight_pilots, flight_id)
    const assigned_pilot_ids = assigned_pilots.map(pilot => pilot.pilot_id)

    res.render('flights/edit', {flight, pilots, planes, assigned_pilot_ids})
  })

  app.post('/flights/:flight_id/update', async (req, res) => {
    const {flight_id} = req.params
    let {plane_id, departure_time, arrival_time, pilot_ids, depart_code, arrive_code} = req.body
    plane_id = plane_id || null

    await db.awaitQuery(update_flight, [plane_id, departure_time, arrival_time, depart_code, arrive_code, flight_id])

    // update the assigned pilots
    // it's easier to just delete all assigned pilots, and re-create these records
    await db.awaitQuery(delete_flight_pilots, [flight_id])

    for (const pilot_id of pilot_ids) {
      let flight_pilot_result = await db.awaitQuery(insert_flights_pilots_query, [flight_id, pilot_id])
    }

    res.status(204).redirect(301, '/flights')
  })

  // ---------
  // delete / confirm delete
  // ---------
  app.get('/flights/:flight_id/confirm_delete', async (req, res) => {
    const {flight_id} = req.params

    // flight
    const flight_results = await db.awaitQuery(select_flight, flight_id)
    const flight = flight_results[0]

    flight.departure_time = moment(flight.departure_time).format("YYYY-MM-DD HH:mm")
    flight.arrival_time = moment(flight.arrival_time).format("YYYY-MM-DD HH:mm")

    // pilots
    const pilots_results = await db.awaitQuery(select_flight_pilots, flight_id)
    const pilots = pilots_results

    res.render('flights/confirm_delete', {flight, pilots})
  })

  app.post('/flights/:flight_id/delete', async (req, res) => {
    const {flight_id} = req.params

    try {
      const flight_result = await db.awaitQuery(delete_flight, flight_id)
      res.status(204).redirect(301, '/flights')
    } catch (error) {
      res.send(error)
    }
  })
}

export default flights_controller