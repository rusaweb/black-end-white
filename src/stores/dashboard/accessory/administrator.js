import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useAccessoryAdministratorStore = defineStore('accessory-administrator', () => {
    const loading = ref(false)
    const accessory = ref(null)
    const accessories = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/accessory/administrator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-create-accessory
    // Administrator Create Accessory

    const createAccessory = async (data, images) => {
        try {
            const {id} = (await axios.post(url, data)).data
            images.map(async image => {
                await uploadImageAccessory(id, image.file)
            })
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-update-accessory
    // Administrator Update Accessory

    const updateAccessory = async (data) => {
        try {
            await axios.put(url + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-stop-selling-accessory
    // Administrator Stop Selling Accessory

    const deleteAccessory = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id + '/selling')
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-start-selling-accessory
    // Administrator Start Selling Accessory

    const startAccessory = async (id) => {
        try {
            await axios.post(url + id + '/selling')
            await store.openToast('success')
        } catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-upload-accessory-image
    // Administrator Upload Accessory Image

    const uploadImageAccessory = async (id, file, callback) => {
        try {
            const formData = new FormData()
            formData.append('image', file)
            await axios.post(url + id + "/image", formData)
            callback()
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-delete-accessory-image
    // Administrator Delete Accessory Image

    const deleteImageAccessory = async (id, image_id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id + '/image/' + image_id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-get-accessory-by-id
    // Administrator Get Accessory by ID

    const getAccessory = async (id) => {
        loading.value = true
        try {
            accessory.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#administrator-get-accessories-page
    // Administrator Get Accessories Page

    const getAccessories = async (args) => {
        loading.value = true
        try {
            accessories.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        createAccessory,
        updateAccessory,
        deleteAccessory,
        startAccessory,
        uploadImageAccessory,
        deleteImageAccessory,
        getAccessories,
        getAccessory,
        accessories,
        accessory,
        loading,
    }
})
