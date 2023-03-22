import { defineStore } from "pinia";

export const useMapStore = defineStore({
    id: "map",
    state: () => ({
        map: null,
    }),
    actions: {
        setMap(payload) {
            this.map = payload
        },
    },
});
