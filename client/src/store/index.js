import { createStore } from "vuex";

const store = createStore({
  state: {
    activityName: "",
    activities: [],
  },
  mutations: {
    setActivityName: (state, payload) => {
      state.activityName = payload;
    },
    pushActivity: (state, payload) => {
      state.activities.push(payload);
    },
    setActivities: (state, payload) => (state.activities = payload),
  },
});

export default store;
