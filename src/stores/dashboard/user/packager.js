import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";

export const useUserPackagerStore = defineStore('user-packager', () => {
    const loading = ref(false)
    const user = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#packager-get-user-by-order-id
    // Packager Get User by Order ID

    const getUser = async (id) => {
        loading.value = true
        try {
            user.value = (await axios.get('/api/v1/user/packager/by-order/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getUser,
        user,
        loading
    }
});
