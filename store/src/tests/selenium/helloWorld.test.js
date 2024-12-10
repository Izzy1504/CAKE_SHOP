const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const path = require('path');

(async function example() {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    try {
        // Navigate to your application
        await driver.get('http://localhost:3000');

        // Log the title to check what it is
        let title = await driver.getTitle();
        console.log(title);

        // Wait until the title is displayed
        await driver.wait(until.titleIs('Cake Shop'), 20000); // Increase timeout

        // Navigate to the login page
        console.log("Navigating to login page...");
        await driver.get('http://localhost:3000/login');

        // Wait for the login form to be present
        console.log("Waiting for login form...");
        await driver.wait(until.elementLocated(By.id('loginForm')), 20000); // Increase timeout

        // Login
        console.log("Entering login credentials...");
        await driver.findElement(By.name('username')).sendKeys('izzy');
        await driver.findElement(By.name('password')).sendKeys('hahahaha');
        console.log("Clicking login button...");
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for the logout button to be present
        console.log("Waiting for logout button...");
        await driver.wait(until.elementLocated(By.linkText('Log Out')), 20000); // Increase timeout

        // Wait for the toast notification to disappear
        console.log("Waiting for toast notification to disappear...");
        await driver.sleep(3000); // Adjust the sleep duration as needed

        // Logout
        console.log("Clicking logout button...");
        await driver.findElement(By.linkText('Log Out')).click();

        // Confirm logout by checking the presence of the login button
        console.log("Waiting for login button...");
        await driver.wait(until.elementLocated(By.id('loginButton')), 20000); // Increase timeout

        console.log("Test successful: Login and Logout functionality works correctly.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await driver.quit();
    }
})();