<template>
  <div>
    <div class="header">
      <h3>Input Data</h3>
      <div class="row form-control">
        <q-input
          label="Activity Name"
          dark
          outlined
          color="white"
          label-color="white"
          v-model="activityName"
        >
        </q-input>
        <q-btn icon="fas fa-arrow-right" @click="next" />
      </div>
      <!-- <q-input
        color="white"
        label-color="white"
        type="text"
        name=""
        outlined
        placeholder="Gesture Name "
      /> -->
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
  }),
  methods: {
    next() {
      this.$store.commit("setActivityName", this.activityName);
      ipcRenderer.invoke("record-activity", this.activityName);
      this.$router.push("/add-activity");
    },
  },
};
</script>

<style lang="scss">
.input {
  color: white;
}
.form-control {
  gap: 10px;
}
</style>
