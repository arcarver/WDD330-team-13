import { loadHeaderFooter } from './utils.mjs';
import Alert from './Alert.js';

loadHeaderFooter();

// Create and display alerts
const alert = new Alert();
alert.displayAlerts();
