const select_planes = `SELECT * FROM Planes JOIN Models ON Planes.model_id = Models.model_id`
const select_plane_with_model = `SELECT * FROM Planes JOIN Models ON Planes.model_id = Models.model_id WHERE plane_id = ? `
const delete_plane = `DELETE FROM Planes WHERE plane_id = ?`
const update_plane = `UPDATE Planes SET model_id = ?, mileage = ? WHERE plane_id = ?`
const insert_plane_query = `INSERT INTO Planes (model_id, mileage) VALUES (?, ?)`

// for dropdown
const select_models = `SELECT * FROM Models`

function planes_controller(app, db) {

  // ---------
  // index
  // ---------

  app.get('/planes', async (req, res) => {
    try {
      const planes = await db.awaitQuery(select_planes)
      res.render('planes/index', {planes})
    } catch (error) {
      res.send(error)
    }
  })

  // ---------
  // new / create
  // ---------

  app.post('/planes', async (req, res) => {
    const {model_id, mileage} = req.body
    const result = await db.awaitQuery(insert_plane_query, [model_id, mileage])
    res.status(201).redirect(301, '/planes')
  })

  app.get('/planes/new', async (req, res) => {
    const models = await db.awaitQuery(select_models)
    res.render('planes/new', {models})
  })

  // ---------
  // edit / update
  // ---------

  app.get('/planes/:plane_id/edit', async (req, res) => {
    const plane_id = req.params.plane_id
    const results = await db.awaitQuery(select_plane_with_model, plane_id)
    const models = await db.awaitQuery(select_models)
    const plane = results[0]
    res.render('planes/edit', {plane, models})
  })

  app.post('/planes/:plane_id/update', async (req, res) => {
    const {plane_id} = req.params
    const {model_id, mileage} = req.body
    await db.awaitQuery(update_plane, [model_id, mileage, plane_id])
    res.status(204).redirect(301, '/planes')
  })

  // ---------
  // delete / confirm delete
  // ---------
  app.get('/planes/:plane_id/confirm_delete', async (req, res) => {
    const {plane_id} = req.params
    const results = await db.awaitQuery(select_plane_with_model, plane_id)
    const plane = results[0]

    res.render('planes/confirm_delete', {plane})
  })

  app.post('/planes/:plane_id/delete', async (req, res) => {
    const {plane_id} = req.params

    try {
      const result = await db.awaitQuery(delete_plane, plane_id)
      res.status(204).redirect(301, '/planes')
    } catch (error) {
      res.send(error)
    }
  })
}

export default planes_controller