const Success = (res, data) => {
    // console.log(data)
    res.status(200).send(data)
}

const Created = (res, data) => {
    // console.log(data)
    res.status(201).send(data)
}

const BadRequest = (res, err) => {
    // console.error(err)
    res.status(400).send({error: err.message})
}

const Unauthorized = (res, err) => {
    // console.error(err)
    res.status(401).send({error: "Please authenticate"})
}

const NotFound = (res, err) => {
    // console.error(err)
    res.status(404).send({error: err.message})
}

const Error = (res, err) => {
    // console.error(err)
    res.status(500).send({error: err.message})
}

module.exports = {Success, Created, BadRequest, Unauthorized, NotFound, Error}