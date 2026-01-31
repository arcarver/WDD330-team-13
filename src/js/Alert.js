export default class Alert {
  constructor() {
    this.alertsUrl = '/json/alerts.json';
  }

  async loadAlerts() {
    try {
      const response = await fetch(this.alertsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const alerts = await response.json();
      return alerts;
    } catch (error) {
      // No alerts found or error loading alerts
      return [];
    }
  }

  createAlertElement(alert) {
    const alertElement = document.createElement('p');
    alertElement.textContent = alert.message;
    alertElement.style.backgroundColor = alert.background;
    alertElement.style.color = alert.color;
    alertElement.style.padding = '10px';
    alertElement.style.margin = '5px 0';
    alertElement.style.borderRadius = '4px';
    alertElement.style.textAlign = 'center';
    alertElement.style.fontWeight = 'bold';
    alertElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    alertElement.setAttribute('role', 'alert');
    alertElement.setAttribute('aria-live', 'polite');
    return alertElement;
  }

  async displayAlerts() {
    const alerts = await this.loadAlerts();

    if (alerts.length > 0) {
      const alertSection = document.createElement('section');
      alertSection.className = 'alert-list';

      alerts.forEach((alert) => {
        const alertElement = this.createAlertElement(alert);
        alertSection.appendChild(alertElement);
      });

      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.insertBefore(alertSection, mainElement.firstChild);
      }
    }
  }
}
