const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {
    validarCampos, validarJWT, esAdminRole, tieneRole
} = require('../middlewares')

const { esRoleValido, esEmailValido, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, usuariosPut, usuarioPost, usuarioDelete, usuarioPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut );

router.post('/', [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( esEmailValido ),
    // check('rol', 'No es un rol permitido').isIn( ['ADMIN_ROLE','USER_ROLE'] ),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usuarioPost );

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuarioDelete );

router.patch('/', usuarioPatch );

module.exports = router;