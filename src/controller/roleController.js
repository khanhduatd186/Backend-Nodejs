import userApiService from '../service/userApiService'
import roleApiService from '../service/roleApiService'
const readFunc = async (req, res) => {
    try {
        let data = await roleApiService.getAllRole();
        console.log(data)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error',
            EC: '-1',
            DT: '',
        });

    }
}
const createFunc = async (req, res) => {
    try {
        let data = await roleApiService.createNewRoles(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error',
            EC: '-1',
            DT: '',
        });

    }

}
const updateFunc = async (req, res) => {
    try {
        console.log("check req: ", req.body);
        let data = await userApiService.updateUser(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error',
            EC: '-1',
            DT: '',
        });

    }

}
const deleteFunc = async (req, res) => {
    try {
        console.log("check data delete:", req.body);
        let data = await userApiService.deleteUser(req.body.id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error',
            EC: '-1',
            DT: '',
        });

    }


}
const getRoleByGroup = async (req, res) => {
    try {
        let id = req.params.groupId;

        let data = await roleApiService.getRoleByGroup(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error',
            EC: '-1',
            DT: '',
        });

    }


}
const getUserAccount = async (req, res) => {
    return await res.status(200).json({
        EM: 'oke',
        EC: 0,
        DT: req.user,
    });
}
const assignRoleToGroup = async (req, res) => {
    try {
        let data = await roleApiService.assignRoleToGroup(req.body.data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error',
            EC: '-1',
            DT: '',
        });

    }
}
module.exports = {
    readFunc, createFunc, updateFunc, deleteFunc, getUserAccount, getRoleByGroup, assignRoleToGroup
};