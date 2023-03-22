import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useHangerCategoryStore = defineStore('order-hanger-category-administrator', () => {
    const loading = ref(false)
    const hanger_category = ref(null)
    const hanger_categories = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/hanger-category/administrator/'
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-create-hanger-category
    // Administrator Create Hanger Category

    const createHangerCategory = async (data) => {
        try {
            await axios.post(url, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-update-hanger-category
    // Administrator Update Hanger Category

    const updateHangerCategory = async (data) => {
        try {
            await axios.put(url + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-get-hanger-category
    // Administrator Get Hanger Category

    const getHangerCategory = async (id) => {
        try {
            hanger_category.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-get-hanger-categories-page
    // Administrator Get Hanger Categories Page

    const getHangerCategories = async (args) => {
        loading.value = true
        try {
            hanger_categories.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-delete-hanger-category
    // Administrator Delete Hanger Category

    const deleteHangerCategories = async (id, callback) => {
        loading.value = true
        try {
            confirm(async () => {
                await axios.delete(url + id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        createHangerCategory,
        updateHangerCategory,
        getHangerCategory,
        getHangerCategories,
        deleteHangerCategories,
        hanger_category,
        hanger_categories,
        loading,
    }
})
