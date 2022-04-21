<template>
  <div class="header">
    <div class="column" style="align-items: start; width: 70%">
      <p>Activity Name</p>
      <h5 style="margin: 0; line-height: 0">
        {{ $store.state.activityName }}
      </h5>
    </div>
    <div class="column progress" v-if="recordStatus === 'started'">
      <div style="text-align: left; width: 100%">
        <p>Recording your Activity</p>
        <ul style="margin-bottom: 40px; font-size: 20px; font-weight: 600">
          <li>Stand-by your position</li>
          <li>Start your activity after the countdown</li>
        </ul>
      </div>
      <q-knob
        :max="10"
        v-model="progress"
        show-value
        size="100px"
        :thickness="0.25"
        readonly
      >
      </q-knob>
    </div>
    <div
      class="column progress"
      v-else-if="recordStatus === 'activity-started'"
    >
      <div style="text-align: left; width: 100%">
        <p>Recording your Activity</p>
        <div style="margin-bottom: 40px; font-size: 20px; font-weight: 600">
          Do your activity now!
        </div>
      </div>
      <q-knob
        :max="10"
        v-model="activityProgress"
        show-value
        size="100px"
        :thickness="0.25"
        readonly
      >
      </q-knob>
    </div>
    <div class="column" v-else-if="recordStatus === 'completed'">
      <h4>Your Activity has been recorded!</h4>
    </div>
    <div class="column" style="width: 70%; align-items: start" v-else>
      <p>We will record your Activity</p>
      <div style="text-align: left; width: 100%">
        <div style="margin-bottom: 40px; font-size: 20px; font-weight: 600">
          <div>1. Put the device on</div>
          <div>2. Prepare your position for your activity</div>
          <div>3. Click Start</div>
        </div>
        <div style="width: 100%; display: flex; justify-content: center">
          <q-btn
            no-caps
            push
            color="primary"
            style="padding: 10px 100px"
            label="Start"
            @click="startCountdownTimer"
          />
        </div>
      </div>
    </div>

    <q-btn @click="$router.push('/input-data')" color="primary" label="Back" />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    progress: null,
    activityProgress: null,
    // start: false,
    // completed: false,
    //recordStatus: "",
    interval: null,
  }),
  computed: {
    recordStatus() {
      if (this.progress <= 10 && this.progress >= 0 && this.progress !== null) {
        ipcRenderer.invoke("start-record-idle", this.$store.state.activityName);
        return "started";
      }
      if (
        this.activityProgress <= 10 &&
        this.activityProgress >= 0 &&
        this.activityProgress !== null
      ) {
        return "activity-started";
      }

      if (this.progress === 9) {
        ipcRenderer.invoke("stop-record-idle", this.$store.state.activityName);
      }

      if (this.progress < 0) {
        clearInterval(this.interval);
        this.progress = null;
        this.activityProgress = 10;
        this.interval = setInterval(() => {
          this.activityProgress -= 1;
        }, 1000);
        ipcRenderer.invoke(
          "start-record-activity",
          this.$store.state.activityName
        );
        return "activity-started";
      }

      if (this.activityProgress < 0) {
        clearInterval(this.interval);
        this.$store.commit("pushActivity", this.$store.state.activityName);
        localStorage.setItem(
          "activities",
          JSON.stringify(this.$store.state.activities)
        );
        ipcRenderer.invoke(
          "stop-record-activity",
          this.$store.state.activityName
        );
        return "completed";
      }

      return "";
    },
  },
  methods: {
    startCountdownTimer() {
      this.progress = 10;
      //this.recordStatus = "started";
      this.interval = setInterval(() => {
        this.progress -= 1;
      }, 1000);
    },
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
