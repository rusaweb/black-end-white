import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";
import router from "@/router";

export const useCategoryStore = defineStore('order-category-administrator', () => {
    const loading = ref(false)
    const category = ref(null)
    const categories = ref(null)
    const category_parent = ref(null)
    const category_child = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/order-item-category/administrator/'
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-create-order-item-category
    // Administrator Create Order Item Category

    const createCategory = async (data) => {
        try {
            category.value = (await axios.post(url, data)).data
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-update-order-item-category
    // Administrator Update Order Item Category

    const updateCategory = async (data) => {
        try {
            await axios.put(url + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-update-order-item-category-icon
    // Administrator Update Order Item Category Icon

    const uploadIcon = async (data, callback) => {
        try {
            await axios.put(url + data.get('id') + '/icon', data)
            await store.openToast('success')
            callback()
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-delete-order-item-category-icon
    // Administrator Delete Order Item Category Icon

    const deleteIcon = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id + '/icon')
                await store.openToast('success')
                callback()
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-category-by-id
    // Administrator Get Order Item Category by ID

    const getCategory = async (id) => {
        try {
            category.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-category-by-id
    // Administrator Get Order Item Category by ID

    const getCategoryParent = async (args) => {
        try {
            category_parent.value = (await axios.get(url + '?parentCategoryId=null&'  + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-category-by-id
    // Administrator Get Order Item Category by ID

    const getCategoryChild = async ({id, args}) => {
        try {
            category_child.value = (await axios.get(url + '?parentCategoryId=' + id + '&' +  new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-categories-page
    // Administrator Get Order Item Categories Page

    const getCategories = async (args) => {
        try {
            categories.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-delete-order-item-category
    // Administrator Delete Order Item Category

    const deleteCategory = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id)
                await callback()
            })

        } catch (err) {
            throw new Error(err)
        }
    }


    return {
        createCategory,
        updateCategory,
        uploadIcon,
        getCategory,
        getCategoryChild,
        getCategoryParent,
        getCategories,
        deleteIcon,
        deleteCategory,
        category,
        category_child,
        category_parent,
        categories,
        loading,
    }
})
