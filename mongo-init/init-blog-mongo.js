db = db.getSiblingDB('blog');
db.posts.insertOne({
  title: "Premier post",
  content: "Ceci est un post créé automatiquement",
  author: "Andreas Castello",
  createdAt: new Date()
}); 