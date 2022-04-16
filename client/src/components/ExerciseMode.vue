<template>
  <div>
    <div class="header">
      <h3>Exercise Mode</h3>
      <div class="form-control column style form">
        <!-- Choose Exercise -->
        <q-select
          label="Activity Name"
          dark
          outlined
          color="white"
          label-color="white"
          v-model="activityName"
          :options="activities"
        >
        </q-select>
        <!-- <q-btn-dropdown color="primary" label="" /> -->
      </div>
      <div class="form-control row style form timer">
        <!-- Set Timer -->
        <q-select
          label=""
          dark
          outlined
          color="white"
          label-color="white"
          v-model="timer"
          :options="timers"
          dense
        >
        </q-select>
        minutes
        <!-- <q-input
          dense
          dark
          outlined
          color="white"
          label-color="white"
        ></q-input> -->
        <q-btn label="Start" @click="startPrototype" />
      </div>

      <q-btn
        @click="$router.push('/')"
        color="primary"
        label="Back To Main Menu"
      />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    activityName: "",
    activities: [],
    timers: [2, 4, 6, 8, 10],
    timer: 2,
  }),
  methods: {
    startPrototype() {
      ipcRenderer
        .invoke("prototype", JSON.stringify(this.$store.state.activities))
        .then(() => {
          console.log("start");
        });
    },
  },
  created() {
    // this.activites = JSON.parse(localStorage.getItem("activities"));
    this.activities = this.$store.state.activities;
  },
};
</script>

<style>
.style {
  font-size: 15px;
}
.form {
  width: 250px;
}
.timer {
  align-items: center;
  justify-items: center;
}
/* .q-field__control {
  height: 32px !important;
  min-height: 32px !important;
  width: 70px;
} */
</style>
