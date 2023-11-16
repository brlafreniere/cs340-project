function planes_controller(app) {
  app.get('/planes', (req, res) => {
    res.send("hello from planes controller.")
  })
}

export default planes_controller