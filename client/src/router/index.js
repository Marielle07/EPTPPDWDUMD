import { createRouter, createWebHistory } from "vue-router";
import Home from "/src/components/Home.vue";
import InputData from "/src/components/InputData.vue";
import AddActivity from "/src/components/AddActivity.vue";
import PostureMode from "/src/components/PostureMode.vue";
import ExerciseMode from "/src/components/ExerciseMode.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/input-data",
    name: "Input Data",
    component: InputData,
  },
  {
    path: "/add-activity",
    name: "Add Activity",
    component: AddActivity,
  },
  {
    path: "/posture-mode",
    name: "Posture Mode",
    component: PostureMode,
  },
  {
    path: "/exercise-mode",
    name: "Exercise Mode",
    component: ExerciseMode,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
