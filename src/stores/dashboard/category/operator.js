import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useCategoryStore = defineStore('order-category-operator', () => {
    const loading = ref(false)
    const category = ref(null)
    const categories = ref(null)
    const category_parent = ref(null)
    const category_child = ref(null)
    const url = '/api/v1/order-item-category/operator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-category-by-id
    // Administrator Get Order Item Category by ID

    const getCategory = async (id) => {
        try {
            category.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-categories-page
    // Administrator Get Order Item Categories Page

    const getCategoryParent = async (args) => {
        try {
            category_parent.value = (await axios.get(url + '?parentCategoryId=null&'  + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_category_api.md#administrator-get-order-item-categories-page
    // Administrator Get Order Item Categories Page

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
        loading.value = true
        try {
            categories.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }


    return {
        getCategory,
        getCategories,
        getCategoryParent,
        getCategoryChild,
        category,
        category_parent,
        category_child,
        categories,
        loading,
    }
})
