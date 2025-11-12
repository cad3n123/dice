import { createApp } from 'vue';
import App from './App.vue';
import { scoringRules } from './scoringRules';

const app = createApp(App);

app.provide('scoringRules', scoringRules);

app.mount('#app');
