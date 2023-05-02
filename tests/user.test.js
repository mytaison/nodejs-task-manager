const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const {userOneId, userOne, setupDatabase} = require("./fixtures/db")

beforeEach(setupDatabase)

afterEach(() => {
    // no need to anything
})

test("Should signup a new user", async() => {
    const response = await request(app).post('/users').send({
        name: "Mehedi",
        email: "mytaison@aol.com",
        password: "Passwd#321"
    }).expect(201)
    // Assert that database has been modified perfectly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about the response
    expect(response.body.user.name).toBe("Mehedi")
    // console.log("User Data::",user)
    expect(response.body).toMatchObject({
        user: {
            name: "Mehedi",
            email: "mytaison@aol.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Passwd#321')
})

test("Should login existing user", async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    // Validate new token is saved
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login nonexistent user", async() => {
    const nonExistanceUser = {
        email: "mr420@gmail.com",
        password: "Iam#mr420"
    }
    await request(app).post("/users/login").send({
        email: nonExistanceUser.email,
        password: nonExistanceUser.password
    }).expect(400)
})

test("Should get profile for user", async() => {
    await request.agent(app)
        // .auth(userOne.tokens[0].token, {type: 'bearer'})
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(({headers}) => {
            console.log(headers)
        })
        .expect(200)
})

test("Should delete account for user", async() => {
    await request.agent(app)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .delete("/users/me")
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test("Should not delete account for unauthenticated user", async() => {
    await request(app)
        // .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .delete("/users/me")
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar","tests/fixtures/propic.jpg")
        .expect(200)
    const user = await User.findById(userOneId)
    // toBe doesn't work here as it compare two different objects, on the other hand toEqual compares properties instead
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async() => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Raymond Reddington'
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Raymond Reddington')
})

test("Should update valid user fields", async() => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})