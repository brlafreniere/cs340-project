function planes_controller(app, db) {
  app.get('/planes', (req, res) => {
    var query_str = 'SELECT * FROM Planes JOIN Models ON Planes.model_id = Models.model_id'
    var query = db.query(query_str, (error, results, fields) => {
      if (error) {
        res.send(error)
      } else {
      res.render('planes/index', {records: results})
      }
    })
  })

  app.post('/planes', (req, res) => {
    res.send('submission')
  })

  app.get('/planes/new', async (req, res) => {
    var select_models = 'SELECT * FROM Models'
    var select_next_plane_id = 'SELECT MAX(plane_id) FROM Planes'
    let models = await db.awaitQuery(select_models)
    let next_plane_id = await db.awaitQuery(select_next_plane_id)
    next_plane_id = next_plane_id[0]["MAX(plane_id)"]
    let template_vars = {models, next_plane_id}
    res.render('planes/new', template_vars)
  })
}

export default planes_controller