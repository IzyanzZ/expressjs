const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = require('./package.json').port;
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

let posts = [
    {
        title: "Judul Post Pertama",
        author: "Akhi",
        slug: "judul-post-pertama",
        body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur autem dolores hic, blanditiis nulla deleniti delectus corrupti rem a, doloribus ea velit alias illum magni odio recusandae eligendi. Similique officia, atque consequatur libero reiciendis suscipit praesentium corporis eveniet corrupti provident dolorem iure quia laudantium velit, labore adipisci, accusamus qui fugit ab! Ea, magnam expedita, sint quibusdam harum quas labore praesentium atque ratione possimus nostrum autem similique vel rerum nam ipsum omnis unde iusto? Nulla rerum, libero est commodi vero inventore odio tempore, incidunt iusto mollitia ut necessitatibus itaque molestias dolores laboriosam ratione quibusdam ex vel voluptatibus perspiciatis officiis expedita maiores. Corporis id perferendis voluptatum consequuntur omnis qui optio quia obcaecati dolorum, nihil molestias pariatur necessitatibus fugiat beatae iure nisi eum?"
    },
    {
        title: "Judul Post Kedua",
        author: "Ahua",
        slug: "judul-post-kedua",
        body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur autem dolores hic, blanditiis nulla deleniti delectus corrupti rem a, doloribus ea velit alias illum magni odio recusandae eligendi. Similique officia, atque consequatur libero reiciendis suscipit praesentium corporis eveniet corrupti provident dolorem iure quia laudantium velit, labore adipisci, accusamus qui fugit ab! Ea, magnam expedita, sint quibusdam harum quas labore praesentium atque ratione possimus nostrum autem similique vel rerum nam ipsum omnis unde iusto? Nulla rerum, libero est commodi vero inventore odio tempore, incidunt iusto mollitia ut necessitatibus itaque molestias dolores laboriosam ratione quibusdam ex vel voluptatibus perspiciatis officiis expedita maiores. Corporis id perferendis voluptatum consequuntur omnis qui optio quia obcaecati dolorum, nihil molestias pariatur necessitatibus fugiat beatae iure nisi eum?"
    }
];

let users = [
    {
        name: "John",
        pass: "321"
    },
    {
        name: "Sandhia Galih",
        pass: "321"
    }
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'hansen', resave: true, saveUninitialized: true, }));

app.get("/", function (req, res) {
    res.render("index", {
        layout: "layout/main.ejs",
        title: "Home",
        user: req.session.user
    });
});

app.get("/about", function (req, res) {
    res.render("about", {
        layout: "layout/main.ejs",
        title: "About",
        user: req.session.user
    });
});

app.get("/dashboard", function (req, res) {
    res.send("Dashboard");
});

app.get("/register", function (req, res) {
    if (req.session.user === "") {
        res.render("register", {
            layout: "layout/main.ejs",
            title: "Register",
            user: req.session.user
        });
    } else {
        res.redirect("/");
    }
});

app.post("/register", function (req, res) {

    let { username, confirm_password, password } = req.body;

    let newAcc = {
        name: username,
        pass: password,
    }

    if (password === confirm_password) {
        users.push(newAcc)
        res.redirect("/login");
    } else {
        res.send("Password Dont Match")
    }
});

app.get("/posts", function (req, res) {

    res.render("posts", {
        layout: "layout/main.ejs",
        title: "Posts",
        posts: posts,
        user: req.session.user
    });
});

app.get("/posts/:slug", function (req, res) {

    let newPosts;
    let slug;

    posts.forEach(post => {
        if (post.slug === req.params.slug) {
            newPosts = post
            slug = post.slug;
        }
    });

    if (Number(req.params.slug)) {
        res.send("Cant use id");
    } else if (slug === req.params.slug) {
        res.render('post', {
            layout: "layout/main.ejs",
            title: "Single Posts",
            posts: newPosts,
            user: req.session.user
        });
    } else {
        res.redirect("/")
    }
});

app.get("/login", function (req, res) {
    if (req.session.user === "") {
        res.render("login", {
            layout: "layout/main.ejs",
            title: "Login",
            user: req.session.user
        })
    } else {
        res.redirect("/");
    }
});

app.post("/logout", function (req, res) {
    req.session.user = "";
    res.redirect("/login");
})

app.post("/login", function (req, res) {
    let { username, password } = req.body;

    users.filter(user => {
        if (username === user.name) {
            if (password === user.pass) {
                req.session.user = username
                res.redirect('/');
            }
        }
    });

    // if (username === users.name) {
    //     if (password === users.pass) {

    //         req.session.user = username;
    //         res.redirect("/");

    //     } else {
    //         return res.redirect("/login");
    //     }
    // } else {
    //     return res.redirect("/login");
    // }

});

app.use("/", (req, res) => {
    res.status(403);

    res.render("error", {
        layout: "layout/main.ejs",
        title: "404 Forbidden",
        user: req.session.user
    });
});

app.listen(port, function () {
    console.log("Listening On " + port);
});