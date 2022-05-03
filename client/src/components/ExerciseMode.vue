<template>
  <div>
    <div class="header">
      <h3>Exercise Mode</h3>
      <div
        v-if="exerciseStatus === 'started'"
        class="column"
        style="align-items: center"
      >
        <p>Activity Name</p>
        <h5 style="margin: 0">
          {{ activityName }}
        </h5>
        <div style="margin-bottom: 40px; font-size: 20px; font-weight: 600">
          We will count how many cycles you perform
        </div>
        <q-knob
          :max="timer * 60"
          v-model="totalTime"
          show-value
          size="100px"
          :thickness="0.25"
        >
        </q-knob>
      </div>
      <div
        v-else-if="exerciseStatus === 'loading'"
        class="column"
        style="align-items: center"
      >
        <p>Activity Name</p>
        <h5 style="margin: 0">
          {{ activityName }}
        </h5>
        <div style="margin-bottom: 40px; font-size: 20px; font-weight: 600">
          Training your data, please wait
        </div>
        <q-spinner size="3em" />
      </div>
      <div v-else-if="exerciseStatus === 'completed'" class="column">
        <p>Activity Name</p>
        <h5>
          {{ activityName }}
        </h5>
        <div style="font-size: 20px; font-weight: 600">Exercise completed</div>
        <div style="margin-bottom: 40px; font-size: 20px; font-weight: 600">
          {{ totalCycles }}
        </div>
        <q-btn
          @click="$router.push('/')"
          color="primary"
          label="Back To Main Menu"
        />
      </div>
      <div
        v-else
        class="column"
        style="display: flex; flex-direction: column; gap: 20px"
      >
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
          <q-btn label="Start" @click="startPredict" />
        </div>

        <q-btn
          @click="$router.push('/')"
          color="primary"
          label="Back To Main Menu"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import axios from "axios";

const baseURL = "http://localhost:8080";

export default {
  data: () => ({
    activityName: "",
    activities: [],
    timers: [2, 4, 6, 8, 10],
    timer: 2,
    interval: null,
    totalTime: null,
    totalCycles: null,
    loading: false,
  }),
  computed: {
    exerciseStatus() {
      if (
        this.totalTime !== null &&
        this.totalTime <= this.timer * 60 &&
        this.totalTime >= 0
      ) {
        if (this.totalTime === this.timer * 60)
          ipcRenderer.invoke("predict-start", this.activityName);
        return "started";
      }

      if (this.totalTime < 0) {
        clearInterval(this.interval);
        ipcRenderer.invoke("count-cycles", this.activityName).then((data) => {
          console.log(data);
          this.totalCycles = data;
          this.saveData();
        });
        return "completed";
      }

      if (this.loading) {
        return "loading";
      }

      return "";
    },
  },
  methods: {
    startPrototype() {
      ipcRenderer.invoke("train", JSON.stringify(this.$store.state.activities));
      // ipcRenderer
      //   .invoke("prototype", JSON.stringify(this.$store.state.activities))
      //   .then(() => {
      //     console.log("start");
      //   });
    },
    async saveData() {
      await axios.post(`${baseURL}/exercise`, {
        exercise: this.activityName,
        counter: this.totalCycles,
      });
    },
    async startPredict() {
      this.loading = true;
      const loaded = await ipcRenderer.invoke("load-data", this.activityName);
      if (loaded) {
        this.loading = false;
        this.totalTime = this.timer * 60;

        this.interval = setInterval(() => {
          this.totalTime -= 1;
        }, 1000);
      }
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
