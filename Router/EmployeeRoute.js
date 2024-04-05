const express = require('express')
const router = express.Router()
const { createEmployee, deleteEmployee, getAllEmployee, updateEmpolyee } = require('../Controller/EmployeeController')
const { authorizationAdmin,authorizationAdminOrRPA,authorizationAllRoles } = require("../Service/AuthService")

router.route('/employee').post(authorizationAdminOrRPA,createEmployee)
router.route('/employees').get(authorizationAllRoles,getAllEmployee)
router.route('/employee/:id').put(authorizationAdminOrRPA,updateEmpolyee)
    .delete(authorizationAdminOrRPA,deleteEmployee)

    module.exports = router 
