function models_controller(app, db) {
  app.get('/models', (req, res) => {
    var query_str = 'SELECT * FROM Models'
    var query = db.query(query_str, (error, results, fields) => {
      if (error) {
        res.send(error)
      } else {
    	res.render('models/index', {model_records: results})
      }
    })
  })

  app.post('/models', (req, res) => {
    res.send('submission')
  })

  app.get('/models/new', async (req, res) => {
    var select_models = 'SELECT * FROM Models'
    
    //var select_next_plane_id = 'SELECT MAX(plane_id) FROM Planes'
    //let models = await db.awaitQuery(select_models)
    //let next_plane_id = await db.awaitQuery(select_next_plane_id)
    //next_plane_id = next_plane_id[0]["MAX(plane_id)"]
    let template_vars = {model_name, capacity}
    res.render('models/new', template_vars)
  })
}

export default models_controller