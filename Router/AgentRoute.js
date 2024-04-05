const express = require('express')
const router = express.Router()
const { authorizationAdmin, authorization ,authorizationRPA , authorizationAllRoles} = require("../Service/AuthService")
const { createAgent, getAllAgent, updateAgent, deleteAgent, getUserDetails } = require('../Controller/AgentController')


router.route('/Agent').post(authorizationAdmin,createAgent)
router.route('/Agents').get( authorizationAdmin,authorizationAdmin, getAllAgent)
router.route('/agent/:id').put(authorizationAdmin, updateAgent).delete(authorizationAdmin,deleteAgent)
router.route('/userDetails').get(authorizationAllRoles,getUserDetails)


module.exports = router 