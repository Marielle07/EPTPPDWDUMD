<template>
  <div>
    <!-- <img src="../logo1.png" style="margin: 25px; opacity: 100%" /> -->
    <div class="header">
      <h4>Main Menu</h4>
      <div class="buttons">
        <q-btn
          @click="$router.push('/input-data')"
          no-caps
          push
          color="primary"
          label="Create New Exercise"
        />
        <!-- <q-btn no-caps push color="primary" label="Train Model" /> -->
        <q-btn
          @click="$router.push('/posture-mode')"
          no-caps
          push
          color="primary"
          label="Posture Mode"
        />
        <q-btn
          @click="$router.push('/exercise-mode')"
          no-caps
          push
          color="primary"
          label="Exercise Mode"
        />
        <!-- <q-btn
          @click="togglePort"
          no-caps
          push
          color="primary"
          label="Toggle Port"
        />
        <q-btn
          @click="loadData"
          no-caps
          push
          color="primary"
          label="Train Posture Data"
        /> -->
        <q-btn
          @click="openChart"
          no-caps
          push
          color="primary"
          label="View Exercise Progress"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  methods: {
    togglePort() {
      ipcRenderer.invoke("toggle-port");
    },
    loadData() {
      ipcRenderer.invoke("train-posture");
    },
    createModel() {
      ipcRenderer.invoke("create-model");
    },
    openChart() {
      ipcRenderer.invoke("open-chart");
    },
  },
  created() {
    this.$store.commit(
      "setActivities",
      JSON.parse(localStorage.getItem("activities")) || []
    );
    //console.log(localStorage.getItem("activities"));
  },
};
</script>

<style lang="scss">
.header {
  height: 100vh;
  width: 100vw;
  padding: 10px;
  // background: linear-gradient(to right, rgb(117, 170, 248), rgb(71, 142, 248));
  color: white;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 200px;
}
</style>
