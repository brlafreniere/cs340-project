const select_plane_with_model = `SELECT * FROM Planes JOIN Models ON Planes.model_id = Models.model_id WHERE plane_id = ? `
const delete_plane = `DELETE FROM Planes WHERE plane_id = ?`

function planes_controller(app, db) {
  app.get('/planes', async (req, res) => {
    const select_planes = 'SELECT * FROM Planes JOIN Models ON Planes.model_id = Models.model_id'
    try {
      const planes = await db.awaitQuery(select_planes)
      res.render('planes/index', {planes})
    } catch (error) {
      res.send(error)
    }
  })

  app.post('/planes', async (req, res) => {
    const insert_plane_query = `INSERT INTO Planes (model_id, mileage) VALUES (?, ?)`
    const model_id = req.body.model_id
    const mileage = req.body.mileage
    const result = await db.awaitQuery(insert_plane_query, [model_id, mileage])
    res.status(201).redirect(301, '/planes')
  })

  app.get('/planes/new', async (req, res) => {
    const select_models = `SELECT * FROM Models`
    const models = await db.awaitQuery(select_models)
    res.render('planes/new', {models})
  })

  app.get('/planes/:plane_id/confirm_delete', async (req, res) => {
    const plane_id = req.params.plane_id
    const results = await db.awaitQuery(select_plane_with_model, plane_id)
    const plane = results[0]

    res.render('planes/confirm_delete', {plane})
  })

  app.post('/planes/:plane_id/delete', async (req, res) => {
    const plane_id = req.params.plane_id

    try {
      const result = await db.awaitQuery(delete_plane, plane_id)
      res.status(204).redirect(301, '/planes')
    } catch (error) {
      res.send(error)
    }
  })
}

export default planes_controller