import moment from "moment"

const select_tickets = 'SELECT * FROM Tickets JOIN Passengers ON Tickets.passenger_id = Passengers.passenger_id JOIN Flights on Tickets.flight_id = Flights.flight_id'
const select_ticket_with_id = 'SELECT * FROM Tickets JOIN Passengers ON Tickets.passenger_id = Passengers.passenger_id JOIN Flights on Tickets.flight_id = Flights.flight_id WHERE ticket_id = ?'
const delete_ticket = 'DELETE FROM Tickets WHERE ticket_id = ?'
const update_ticket = 'UPDATE Tickets SET flight_id = ?, passenger_id = ? WHERE ticket_id = ?'
const insert_ticket_query = 'INSERT INTO Tickets (flight_id, passenger_id) VALUES (?, ?)'

//For Dropdowns 
const select_flights = 'SELECT * FROM Flights'
const select_passengers = 'SELECT * FROM Passengers'


function tickets_controller(app, db) {

  // ---------
  // index
  // ---------

  app.get('/tickets', async (req, res) => {
    try {
      const tickets = await db.awaitQuery(select_tickets)
      res.render('tickets/index', {tickets})
    } catch (error) {
      res.send(error)
    }
  })

  // ---------
  // new / create
  // ---------

  app.post('/tickets', async (req, res) => {
    const {flight_id, passenger_id} = req.body
    const result = await db.awaitQuery(insert_ticket_query, [flight_id, passenger_id])
    res.status(201).redirect(301, '/tickets')
  })

  app.get('/tickets/new', async (req, res) => {
    const flights = await db.awaitQuery(select_flights)
    const passengers = await db.awaitQuery(select_passengers)
    res.render('tickets/new', {flights, passengers})
  })

  // ---------
  // edit / update
  // ---------

  app.get('/tickets/:ticket_id/edit', async (req, res) => {
    const ticket_id = req.params.ticket_id
    const results = await db.awaitQuery(select_ticket_with_id, ticket_id)
    const passengers = await db.awaitQuery(select_passengers)
    const flights = await db.awaitQuery(select_flights)
    const ticket = results[0]
    res.render('tickets/edit', {ticket, flights, passengers})
  })

  app.post('/tickets/:ticket_id/update', async (req, res) => {
    const {ticket_id} = req.params
    const {flight_id, passenger_id} = req.body
    await db.awaitQuery(update_ticket, [flight_id, passenger_id, ticket_id])
    res.status(204).redirect(301, '/tickets')
  })

  // ---------
  // delete / confirm delete
  // ---------
  app.get('/tickets/:ticket_id/confirm_delete', async (req, res) => {
    const {ticket_id} = req.params
    const results = await db.awaitQuery(select_ticket_with_id, ticket_id)
    const ticket = results[0]

    res.render('tickets/confirm_delete', {ticket})
  })

  app.post('/tickets/:ticket_id/delete', async (req, res) => {
    const {ticket_id} = req.params

    try {
      const result = await db.awaitQuery(delete_ticket, ticket_id)
      res.status(204).redirect(301, '/tickets')
    } catch (error) {
      res.send(error)
    }
  })
}

export default tickets_controller