function models_controller(app, db) {
  app.get('/models', (req, res) => {
    res.render('models/index')
  })
}

export default models_controller