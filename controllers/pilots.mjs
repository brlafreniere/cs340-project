// create
const insert_pilot_query = `INSERT INTO Pilots (first_name, last_name) VALUES (?, ?)`

// read
const select_pilots = `SELECT * FROM Pilots`
const select_pilot = `SELECT * FROM Pilots WHERE pilot_id = ?`

// update
const update_pilot = `UPDATE Pilots SET first_name = ?, last_name = ? WHERE pilot_id = ?`

// delete
const delete_pilot = `DELETE FROM Pilots WHERE pilot_id = ?`

function pilots_controller(app, db) {
  // ---------
  // index
  // ---------

  app.get('/pilots', async (req, res) => {
    try {
      const pilots = await db.awaitQuery(select_pilots)
      res.render('pilots/index', {pilots})
    } catch (error) {
      res.send(error)
    }
  })

  // ---------
  // new / create
  // ---------

  app.post('/pilots', async (req, res) => {
    const {first_name, last_name} = req.body
    const result = await db.awaitQuery(insert_pilot_query, [first_name, last_name])
    res.status(201).redirect(301, '/pilots')
  })

  app.get('/pilots/new', async (req, res) => {
    res.render('pilots/new')
  })

  // ---------
  // edit / update
  // ---------

  app.get('/pilots/:pilot_id/edit', async (req, res) => {
    const pilot_id = req.params.pilot_id
    const results = await db.awaitQuery(select_pilot, pilot_id)
    const pilot = results[0]
    res.render('pilots/edit', {pilot})
  })

  app.post('/pilots/:pilot_id/update', async (req, res) => {
    const {pilot_id} = req.params
    const {first_name, last_name} = req.body
    await db.awaitQuery(update_pilot, [first_name, last_name, pilot_id])
    res.status(204).redirect(301, '/pilots')
  })

  // ---------
  // delete / confirm delete
  // ---------

  app.get('/pilots/:pilot_id/confirm_delete', async (req, res) => {
    const {pilot_id} = req.params
    const results = await db.awaitQuery(select_pilot, pilot_id)
    const pilot = results[0]

    res.render('pilots/confirm_delete', {pilot})
  })

  app.post('/pilots/:pilot_id/delete', async (req, res) => {
    const {pilot_id} = req.params

    try {
      const result = await db.awaitQuery(delete_pilot, pilot_id)
      res.status(204).redirect(301, '/pilots')
    } catch (error) {
      res.send(error)
    }
  })
}

export default pilots_controller