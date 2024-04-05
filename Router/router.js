const express = require('express')
const router = express.Router()
const {authorizationAdminOrRTA, authorizationRTA,
    } = require("../Service/AuthService")
const { createProject, getAllProject, updateProject, deleteProject,  projectExists } = require('../Controller/ProjectController')
const { createRelease, getAllReleases, updateRelease, deleteRelease, releaseExists } = require('../Controller/ReleaseController')
const { createDemand, getAllDemand, updateDemand, deleteDemand, assignToRelease } = require('../Controller/DemandController')

//Project Crud 
router.route('/project').post(authorizationAdminOrRTA,createProject)
router.route('/projects').get(authorizationAdminOrRTA,getAllProject)
router.route('/project/:id').put(authorizationAdminOrRTA,updateProject)
    .delete(authorizationAdminOrRTA,deleteProject)
    
router.route('/projectExists/:label').get(projectExists)

//Release Crud 
router.route('/release').post(authorizationRTA,createRelease)
router.route('/releases').get(authorizationRTA,getAllReleases)
router.route('/release/:id').put(authorizationRTA,updateRelease)
    .delete(authorizationRTA,deleteRelease)
    router.route('/releaseExists/:name').get(authorizationRTA,releaseExists)

//demand crud 
router.route('/demand').post(authorizationRTA,createDemand)
router.route('/demands').get(authorizationRTA,getAllDemand)
router.route('/demand/:id').put(authorizationRTA,updateDemand).delete(authorizationRTA,updateDemand)


module.exports = router 