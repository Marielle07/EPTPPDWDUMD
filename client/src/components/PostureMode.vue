<template>
  <div>
    <div class="header">
      <h3>Posture Mode</h3>
      <div>
        Turning on posture mode will notify you when your posture is bad in more
        than a minute.
      </div>
      <div>
        <q-toggle
          size="xl"
          v-model="isEnabled"
          val="xl"
          :label="'Posture Mode is ' + (isEnabled ? 'ON' : 'OFF')"
          @click="togglePostureMode()"
        />
      </div>
      <!-- <div class="form-control row style">
        Set Timer
        <q-input
          dense
          dark
          outlined
          color="white"
          label-color="white"
        ></q-input>
        <q-btn label="Start" />
      </div> -->
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
    isEnabled: false,
  }),
  methods: {
    togglePostureMode() {
      console.log("wow");
      ipcRenderer.invoke("posture-mode", this.isEnabled);
    },
  },
};
</script>

<style></style>
