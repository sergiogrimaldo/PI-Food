const router = require('express').Router();
const Sequelize = require('sequelize');
const { Recipe, Diet } = require('../../db');
// const {FoCDietP} = require('../controllers/dietFoC');
const Op = Sequelize.Op;



router.post('/', async (req,res) => {
    try {
    let {name, summary, score, healthScore, steps, diets} =req.body;
    if(!name || !summary) return res.status(422).json({message: 'name and summary required'});
    if(score < 0 || score > 100) return res.status(422).send({message: 'score must be between 0 -100'})
    if(healthScore < 0 || healthScore > 100) return res.status(422).json({message:'healtScore must be between 0 -100'})
    score = score ? score : 0
    healthScore = healthScore ? healthScore : 0



    let newRecipe = await Recipe.create({
        name,
        summary, 
        score:score, 
        healthScore:healthScore,
        steps,
        image: 'https://images.unsplash.com/photo-1635586466497-6bc7369127e0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80',
    })
    
let formated= Array.isArray(diets) ? diets: [diets]

    const matchingDiets = await Diet.findAll({
        where: {
            name: {
                [Op.in] : formated
            }
        }
    }) 

 await newRecipe.setDiets(matchingDiets)

    res.status(201).json(newRecipe)
    } catch (error) {
        console.log('ERROR MAKING POST REQUEST', error)
    }
    
})



module.exports = router