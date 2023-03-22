import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {confirm} from '@/utils/confirm' ;
export const useDepartmentStore = defineStore('user-department', () => {
    const loading = ref(false)
    const department = ref(null)
    const departments = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_department_api.md#administrator-create-user-department
    // Administrator Create User Department

    const createDepartment = async (data) => {
        try {
            await axios.post('/api/v1/user-department/administrator', data)
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_department_api.md#administrator-get-user-department
    // Administrator Get User Department

    const getDepartmentById = async (id) => {
        try {
            department.value = (await axios.get('/api/v1/user-department/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_department_api.md#administrator-get-user-departments-list
    // Administrator Get User Departments List

    const getDepartments = async (args) => {
        loading.value = true
        try {
            departments.value = (await axios.get('/api/v1/user-department/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally{
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_department_api.md#administrator-update-user-department
    // Administrator Update User Department

    const updateDepartment = async (data) => {
        try {
            await axios.put('/api/v1/user-department/administrator/' + data.id, data)
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_department_api.md#administrator-delete-user-department
    // Administrator Delete User Department



    const deleteDepartment = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/user-department/administrator/' + id)
                await callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    return {
        createDepartment,
        getDepartmentById,
        getDepartments,
        updateDepartment,
        deleteDepartment,
        department,
        departments,
        loading
    }
});
