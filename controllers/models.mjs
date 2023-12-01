const select_models = `SELECT * FROM Models`
const select_model_with_id = `SELECT * FROM Models WHERE model_id = ? `
const delete_model = `DELETE FROM Models WHERE model_id = ?`
const update_model = `UPDATE Models SET model_name = ?, capacity = ? WHERE model_id = ?`
const insert_model_query = `INSERT INTO Models (model_name, capacity) VALUES (?, ?)`


function models_controller(app, db) {

  // ---------
  // index
  // ---------

  app.get('/models', async (req, res) => {
    try {
      const models = await db.awaitQuery(select_models)
      res.render('models/index', {models})
    } catch (error) {
      res.send(error)
    }
  })

  // ---------
  // new / create
  // ---------

  app.post('/models', async (req, res) => {
    const {model_name, capacity} = req.body
    const result = await db.awaitQuery(insert_model_query, [model_name, capacity])
    res.status(201).redirect(301, '/models')
  })

  app.get('/models/new', async (req, res) => {
    //const models = await db.awaitQuery(select_models)
    res.render('models/new')
  })

  // ---------
  // edit / update
  // ---------

  app.get('/models/:model_id/edit', async (req, res) => {
    const model_id = req.params.model_id
    const results = await db.awaitQuery(select_model_with_id, model_id)
    const models = await db.awaitQuery(select_models)
    const model = results[0]
    res.render('models/edit', {model})
  })

  app.post('/models/:model_id/update', async (req, res) => {
    const {model_id} = req.params
    const {model_name, capacity} = req.body
    await db.awaitQuery(update_model, [model_name, capacity, model_id])
    res.status(204).redirect(301, '/models')
  })

  // ---------
  // delete / confirm delete
  // ---------
  app.get('/models/:model_id/confirm_delete', async (req, res) => {
    const {model_id} = req.params
    const results = await db.awaitQuery(select_model_with_id, model_id)
    const model = results[0]

    res.render('models/confirm_delete', {model})
  })

  app.post('/models/:model_id/delete', async (req, res) => {
    const {model_id} = req.params

    try {
      const result = await db.awaitQuery(delete_model, model_id)
      res.status(204).redirect(301, '/models')
    } catch (error) {
      res.send(error)
    }
  })
}

export default models_controller