const request = require('supertest')
const app = require('../server/app.js')
const fs = require('fs');
const express = require('express')
const router = express.Router()
const mysql = require("mysql2/promise")

const dotenv = require('dotenv')
dotenv.config()

const client = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: "medchain",
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

// On netoie la bases de donnée
let sqlreset = fs.readFileSync('../sql/Default values.sql').toString();
client.query(sqlreset)


// npm test pour lancer les test unitaire.
// on cree un agent qui restera connecter entre les tests
let agent = request.agent(app);

// on mock mailgun pour ne pas envoyer des mails a chaque fois
jest.mock('mailgun-js', () => {
    const mMailgun = {
        messages: jest.fn().mockReturnThis(),
        send: jest.fn(),
        Attachment: jest.fn(),
    };
    return jest.fn(() => mMailgun);
});


// l'ensemble des tests
describe('test des tests',  () => {
    it('just a test', async () => {
        const res = await request(app)
            .post('/api/test')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
    })
})

describe('recuperation ordonance patient',  () => {
    it('recupere info ordonance reussite  ', async () => {
        const res = await request(app)
            .post('/api/token_state')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('Date_prescription','max_date','uses_left')
    })
    it('recupere info ordonance echec pas d ordonnance existante ', async () => {
        const res = await request(app)
            .post('/api/token_state')
            .send({
                token: '12358',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it('recupere info ordonance echec mauvais mot de passe  ', async () => {
        const res = await request(app)
            .post('/api/token_state')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: 'joliefleur',
                secu: '000000000000000',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it('recupere info ordonance  echec manque information ', async () => {
        const res = await request(app)
            .post('/api/token_state')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it('recupere info ordonance reussite odonnance neuve ', async () => {
        const res = await request(app)
            .post('/api/token_state')
            .send({
                token: '75f3e768-5853-446f-b739-d37f31dea755',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('Date_prescription','max_date','uses_left')
    })
})

describe('Post Endpoints',  () => {
    it(' deconnexion ', async () => {
        const res = await request(app)
            .post('/api/disconnect')
        expect(res.statusCode).toEqual(200)
    })
})
describe('Get Endpoints', () => {
    it(' recupere information utilisateur medecin ', async () => {
        const res = await request(app)
            .get('/api/me')

        expect(res.statusCode).toEqual(401)
    })
})

describe('test conexion',  () => {
    it(' connexion  echec', async () => {
        const res = await request(app)
            .post('/api/login')
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')

    })

    it(' connexion echec manque information ', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: '00000000001',
                password: 'azerty',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')

    })

    it(' connexion echec mauvaise information ', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: '00000000001',
                password: 'azerty',
                user_type: '2'

            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' connexion echec mauvais mdp ', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: '00000000001',
                password: '111',
                user_type: '1'

            })
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it(' connexion echec plus de droit de connexion', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: '12345678911',
                password: 'azerty',
                user_type: '1'

            })
        expect(res.statusCode).toEqual(403)
        expect(res.body).toHaveProperty('message')
    })
    it(' connexion n existe pas dans la db', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: '1234567911',
                password: 'azerty',
                user_type: '1'

            })
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
})


describe('test medecin',  () => {

    it(' connexion medecin ', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: '00000000001',
                password: 'azerty',
                user_type: '1'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('id')


    })


    it(' recupere information utilisateur medecin ', async () => {
         const res = await agent
            .get('/api/me')

        expect(res.statusCode).toEqual(200)
    })
    it(' ajout ordonance medecin reussite ', async () => {
        const res = await agent
            .post('/api/add_prescription')
            .send({
                secu: '000000000000000',
                max_date: '2021-06-16T16:53:47.270Z',
                renewals: '1',
                patient_email: 'adriengirard@yahoo.fr',
                prescription: [{"drug_name": "Paracétamol","dose": "1000mg","duration": 5,"takes_per_day": 2},{"drug_name": "Imodium","dose": "2mg","duration": 4,"takes_per_day": 3}],
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')


    })
    it(' ajout ordonance medecin erreur num secu ', async () => {
        const res = await agent
            .post('/api/add_prescription')
            .send({
                secu: '0000000000000000000000000',
                max_date: '2021-06-16T16:53:47.270Z',
                renewals: '1',
                patient_email: 'adriengirard@yahoo.fr',
                prescription: [{"drug_name": "Paracétamol","dose": "1000mg","duration": 5,"takes_per_day": 2},{"drug_name": "Imodium","dose": "2mg","duration": 4,"takes_per_day": 3}],
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')


    })
    it(' ajout ordonance medecin echec manque d information', async () => {
        const res = await agent
            .post('/api/add_prescription')
            .send({
                secu: '000000000000000',
                renewals: '1',
                patient_email: 'adriengirard@yahoo.fr',
                prescription: [{"drug_name": "Paracétamol","dose": "1000mg","duration": 5,"takes_per_day": 2},{"drug_name": "Imodium","dose": "2mg","duration": 4,"takes_per_day": 3}],
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')


    })
    it(' ajout ordonance medecin echec manque d information prescription', async () => {
        const res = await agent
            .post('/api/add_prescription')
            .send({
                secu: '000000000000000',
                renewals: '1',
                max_date: '2021-06-16T16:53:47.270Z',
                patient_email: 'adriengirard@yahoo.fr',
                prescription: [{"drug_name": "Paracétamol","dose": "1000mg","duration": 5,"takes_per_day": 2},{"dose": "2mg","duration": 4,"takes_per_day": 3}],
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')

    })
    it(' ajout ordonance medecin echec probleme prescription', async () => {
        const res = await agent
            .post('/api/add_prescription')
            .send({
                secu: '000000000000000',
                renewals: '1',
                max_date: '2021-06-16T16:53:47.270Z',
                patient_email: 'adriengirard@yahoo.fr',
                prescription: ">WQSDqsd",
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')

    })
    it(' recuperation ordonance medecin echec', async () => {
        const res = await agent
            .post('/api/get_prescription')

        expect(res.statusCode).toEqual(401)

    })
    it(' connexion pharmacien echec deja connecter medecin', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: 'enzo.filangi',
                password: 'azerty',
                user_type: '0'
            })
        expect(res.statusCode).toEqual(403)
    })
    it(' deconexion ', async () => {
        const res = await agent
            .post('/api/disconnect')
        expect(res.statusCode).toEqual(200)
    })
})


describe('test pharmacien',  () => {

    it(' connexion pharmacien ', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: 'jonathan.witt',
                password: '1234',
                user_type: '0'
            })
        expect(res.statusCode).toEqual(200)
    })
    it(' recupere information utilisateur pharmacien ', async () => {
        const res = await agent
            .get('/api/me')

        expect(res.statusCode).toEqual(200)
    })

    it(' insertion ordonance pharmacien echec', async () => {
        const res = await agent
            .post('/api/add_prescription')
        expect(res.statusCode).toEqual(401)

    })
    it(' recuperation ordonnance reussite pharmacien ', async () => {
        const res = await agent
            .post('/api/get_prescription')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('info_ordonnance','prescription','notes')
    })
    it(' recuperation ordonnance echec pharmacien mauvaise info ', async () => {
        const res = await agent
            .post('/api/get_prescription')
            .send({
                token: '47753d54-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000'
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' recuperation ordonnance echec pharmacien mauvais mdp', async () => {
        const res = await agent
            .post('/api/get_prescription')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: 'cestmonchien',
                secu: '000000000000000'
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' recuperation ordonnance echec pharmacien manque d information ', async () => {
        const res = await agent
            .post('/api/get_prescription')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')

    })
    it(' modification note echec pharmacien aucune note existe', async () => {
        const res = await agent
            .patch('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(403)
        expect(res.body).toHaveProperty('message')


    })
    it(' creation note reussite pharmacien ', async () => {
        const res = await agent
            .post('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(200)

    })

    it(' creation note echec pharmacien mauvais mdp', async () => {
        const res = await agent
            .post('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' creation note echec pharmacien mauvais token', async () => {
        const res = await agent
            .post('/api/note')
            .send({
                token: 'cestmoi',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' creation note echec pharmacien manque d information', async () => {
        const res = await agent
            .post('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')


    })
    it(' creation note echec pharmacien une note existe deja ', async () => {
        const res = await agent
            .post('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(403)
        expect(res.body).toHaveProperty('message')

    })
    it(' modification note reussite pharmacien ', async () => {
        const res = await agent
            .patch('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(200)
    })
    it(' modification note echec pharmacien mauvais mdp', async () => {
        const res = await agent
            .patch('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' modification note echec pharmacien mauvais token', async () => {
        const res = await agent
            .patch('/api/note')
            .send({
                token: 'cestmoi',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' modification note echec pharmacien manque d information', async () => {
        const res = await agent
            .patch('/api/note')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                content: "aaaaaaaaaaaa"
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')


    })
    it(' utilisation ordonnance reussite pharmacien ', async () => {
        const res = await agent
            .post('/api/use_prescription')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                fully_used:true
            })
        expect(res.statusCode).toEqual(200)
    })
    it(' utilisation ordonnance echec pharmacien mauvais mdp ', async () => {
        const res = await agent
            .post('/api/use_prescription')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: 'oskour',
                secu: '000000000000000',
                fully_used:true
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' utilisation ordonnance echec pharmacien mauvais identifiant ', async () => {
        const res = await agent
            .post('/api/use_prescription')
            .send({
                token: 'michel.montana',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                fully_used:true
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    it(' utilisation ordonnance echec pharmacien trop de fois utilisé ', async () => {
        const res = await agent
            .post('/api/use_prescription')
            .send({
                token: 'ce8aeb44-460d-4da0-81c2-4e3d01a981d5',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
                fully_used:true
            })
        expect(res.statusCode).toEqual(403)
        expect(res.body).toHaveProperty('message')
    })
    it(' utilisation ordonnance echec pharmacien manque d information ', async () => {
        const res = await agent
            .post('/api/use_prescription')
            .send({
                token: '47753d54-c9d0-4f9c-bd73-973d9f359422',
                password: '8d87cb1c-4806-401e-82cf-c3956135cf2d',
                secu: '000000000000000',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')

    })

})

