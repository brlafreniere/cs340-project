const select_passengers = `SELECT * FROM Passengers`
const select_passenger_with_id = `SELECT * FROM Passengers WHERE passenger_id = ? `
const delete_passenger = `DELETE FROM Passengers WHERE passenger_id = ?`
const update_passenger = `UPDATE Passengers SET first_name = ?, last_name = ? WHERE passenger_id = ?`
const insert_passenger_query = `INSERT INTO Passengers (first_name, last_name) VALUES (?, ?)`


function passengers_controller(app, db) {

  // ---------
  // index
  // ---------

  app.get('/passengers', async (req, res) => {
    try {
      const passengers = await db.awaitQuery(select_passengers)
      res.render('passengers/index', {passengers})
    } catch (error) {
      res.send(error)
    }
  })

  // ---------
  // new / create
  // ---------

  app.post('/passengers', async (req, res) => {
    const {first_name, last_name} = req.body
    const result = await db.awaitQuery(insert_passenger_query, [first_name, last_name])
    res.status(201).redirect(301, '/passengers')
  })

  app.get('/passengers/new', async (req, res) => {
    //const passengers = await db.awaitQuery(select_passengers)
    res.render('passengers/new')
  })

  // ---------
  // edit / update
  // ---------

  app.get('/passengers/:passenger_id/edit', async (req, res) => {
    const passenger_id = req.params.passenger_id
    const results = await db.awaitQuery(select_passenger_with_id, passenger_id)
    const passengers = await db.awaitQuery(select_passengers)
    const passenger = results[0]
    res.render('passengers/edit', {passenger})
  })

  app.post('/passengers/:passenger_id/update', async (req, res) => {
    const {passenger_id} = req.params
    const {first_name, last_name} = req.body
    await db.awaitQuery(update_passenger, [first_name, last_name, passenger_id])
    res.status(204).redirect(301, '/passengers')
  })

  // ---------
  // delete / confirm delete
  // ---------
  app.get('/passengers/:passenger_id/confirm_delete', async (req, res) => {
    const {passenger_id} = req.params
    const results = await db.awaitQuery(select_passenger_with_id, passenger_id)
    const passenger = results[0]

    res.render('passengers/confirm_delete', {passenger})
  })

  app.post('/passengers/:passenger_id/delete', async (req, res) => {
    const {passenger_id} = req.params

    try {
      const result = await db.awaitQuery(delete_passenger, passenger_id)
      res.status(204).redirect(301, '/passengers')
    } catch (error) {
      res.send(error)
    }
  })
}

export default passengers_controller