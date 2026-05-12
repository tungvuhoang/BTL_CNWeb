const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('public/mock-data/quizzes.json');
const middlewares = jsonServer.defaults();

// Route rewrite
server.use(jsonServer.rewriter({
  '/api/quizzes/my': '/quizzes',
  '/api/quizzes/:id': '/quizzes/:id',
  '/api/quizzes': '/quizzes'
}));

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom POST: tự tạo quizId và bọc data
server.post('/quizzes', (req, res, next) => {
  req.body.quizId = Date.now().toString();
  req.body.createdAt = new Date().toISOString();
  req.body.updatedAt = new Date().toISOString();
  next();
});

// Middleware bọc trả về vào thuộc tính "data" để khớp với code Frontend
router.render = (req, res) => {
  res.jsonp({
    data: res.locals.data
  });
};

server.use(router);

server.listen(8080, () => {
  console.log('JSON Server đã khởi động tại cổng 8080 giả lập Backend!');
});
