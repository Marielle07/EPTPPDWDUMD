<template>
  <div class="header">
    <h3>
      {{ $store.state.activityName }}
    </h3>
    <div class="column progress" v-if="recordStatus === 'started'">
      <p>Recording your Activity</p>
      <q-knob
        :max="20"
        v-model="progress"
        show-value
        size="100px"
        :thickness="0.25"
        readonly
      >
      </q-knob>
    </div>
    <div class="column" v-else-if="recordStatus === 'completed'">
      <h4>Your Activity has been recorded.</h4>
    </div>
    <div class="column" v-else>
      <p>Record your Activity</p>
      <q-btn no-caps push color="primary" label="Start" @click="startTimer" />
    </div>

    <q-btn @click="$router.push('/input-data')" color="primary" label="Back" />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    progress: null,
    // start: false,
    // completed: false,
    //recordStatus: "",
    interval: null,
  }),
  computed: {
    recordStatus() {
      if (this.progress >= 0 && this.progress <= 5 && this.progress !== null) {
        return "started";
      }
      if (this.progress > 5) {
        clearInterval(this.interval);
        this.$store.commit("pushActivity", this.$store.state.activityName);
        localStorage.setItem(
          "activities",
          JSON.stringify(this.$store.state.activities)
        );

        return "completed";
      }

      return "";
    },
  },
  methods: {
    startTimer() {
      this.progress = 0;
      //this.recordStatus = "started";
      this.interval = setInterval(() => {
        this.progress += 1;
      }, 1000);

      ipcRenderer.invoke("record-activity-start");
      setTimeout(() => {
        ipcRenderer.invoke("record-activity-stop");
      }, 5000);

      // ipcRenderer.invoke("start", this.$store.state.activityName).then(() => {
      //   ipcRenderer.invoke("train");
      // });

      // if (this.progress > 20) {
      //   clearInterval(this.interval);
      //   this.recordStatus = "completed";
      // }
    },
  },
};
</script>

<style>
.progress {
  align-items: center;
}
</style>
