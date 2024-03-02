import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

let users = [
]

let posts = [
]


function UserService() {
  function logIn(email, pass) {
    try {
      if (!email, !pass) throw new Error('error')

      // let logeduser

      // #metod 1
      // for (let i = 0; i < users.length; i++) {
      // if (users[i].email === email) user = users[i]
      // }

      // #metod 2
      // for (let user of users) {
      //   if (user.email === email) logeduser = user
      // }

      // #metod 3
      // const index = users.findIndex(user => user.email === email)
      // if (index === -1) throw new Error("No such user found")
      // logeduser = users[index]

      const user = users.find(user => user.email === email)
      if (!user) throw new Error("No such user found")

      const isPasswordValid = bcrypt.compare(pass, user.pass)
      if (!isPasswordValid) throw new Error("Unauthorized!")

      return user
    } catch (error) {
      console.log("Problem With login!");
    }

  }

  function signUp(name, email, pass) {
    try {
      if (!name, !email, !pass) throw new Error("Check the input fields")

      const newUser = { id: nanoid(), name, email, pass: bcrypt.hashSync(pass) }
      users = [...users, newUser]
      const { pass: _, ...userWithoutPass } = newUser
      return userWithoutPass
    } catch (error) {
      console.log(error)
    }
  }

  return { logIn, signUp };
}

function PostService(params) {
  const author = params.id


  const feed = () => posts.filter(({ isPublished }) => isPublished)
  // const feed = () => posts.filter(({ isPublished }) => isPublished).map(post => ({ ...post, author: users.find(user => user.id === post.author) }))

  const create = (params) => {
    const newPost = {
      id: nanoid(),
      title: params.title,
      content: params.content,
      isPublished: false,
      author
    }

    posts = [...posts, newPost];

    return newPost
  }

  const postById = (id) => posts.find(({ id: postId }) => postId === id)

  const update = (id, params) => {
    posts = posts.map((post) => {
      if (id !== post.id) return post
      // console.log("before filter", params)
      const { id: _id, author, ...updateParams } = params
      // console.log("after filter", UpdatedValue)
      return { ...post, ...updateParams }
    })

    return posts
  }

  const togglePublish = (id) => update(id, { isPublished: !postById(id).isPublished })

  return { feed, create, update, publish: togglePublish };
}


function main() {
  const user = UserService().signUp('someone', 'someone@email.com', "123456")
  const logedUser = UserService().logIn(user.email, "123456")


  const postService = PostService(logedUser)
  const newPost = postService.create({
    title: 'new Post',
    content: 'loerm'
  })

  postService.create({
    title: 'new Post 2 ',
    content: 'loerm epsom'
  })

  postService.update(newPost.id, {
    title: "I'm the first Post"
  })

  postService.publish(newPost.id)

  console.log("feed==>\n", postService.feed())
}


main()