const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const path = require('path');

(async function example() {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    try {
        // Navigate to your application
        await driver.get('http://localhost:3000');
        let title = await driver.getTitle();
        console.log(title);
        await driver.wait(until.titleIs('Cake Shop'), 20000); // Increase timeout

        console.log("Navigating to login page...");
        await driver.get('http://localhost:3000/login');

        console.log("Waiting for login form...");
        await driver.wait(until.elementLocated(By.id('loginForm')), 20000); // Increase timeout

        // Login
        console.log("Entering login credentials...");
        await driver.findElement(By.name('username')).sendKeys('izzy');
        await driver.findElement(By.name('password')).sendKeys('hahahaha');
        console.log("Clicking login button...");
        await driver.findElement(By.css('button[type="submit"]')).click();

     
        console.log("Waiting for logout button...");
        await driver.wait(until.elementLocated(By.linkText('Log Out')), 20000); // Increase timeout

       // đợi toast mất rồi mới log out
        console.log("Waiting for toast notification to disappear...");
        await driver.sleep(3000); // Adjust the sleep duration as needed

        // Logout
        console.log("Clicking logout button...");
        await driver.findElement(By.linkText('Log Out')).click();

        
        console.log("Waiting for login button...");
        await driver.wait(until.elementLocated(By.linkText('Login')), 20000); // Increase timeout

        console.log("Test successful: Login and Logout functionality works correctly.");

        // vào trang đăng ký
        console.log("Navigating to registration page...");
        await driver.get('http://localhost:3000/UserAccountPage');

        console.log("Waiting for registration form...");
        await driver.wait(until.elementLocated(By.css('form')), 20000);

        // đợi phản hồi từ form 
        console.log("Waiting for registration form fields to be interactable...");
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('name'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('username'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('email'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('phone'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('city'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('district'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('ward'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('address'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('password'))), 20000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('confirmPassword'))), 20000);

        // fill cái form đăng ký
        console.log("Entering registration details...");
        await driver.findElement(By.name('name')).sendKeys('Test User');
        await driver.findElement(By.name('username')).sendKeys('testuser');
        await driver.findElement(By.name('email')).sendKeys('testuser@example.com');
        await driver.findElement(By.name('phone')).sendKeys('1234567890');

        // đợi cho thành phố được chọn
        console.log("Selecting city...");
        await driver.findElement(By.name('city')).click();
        await driver.wait(until.elementLocated(By.css('option[value="Thành phố Hà Nội"]')), 20000);
        await driver.executeScript("arguments[0].scrollIntoView();", driver.findElement(By.css('option[value="Thành phố Hà Nội"]')));
        await driver.findElement(By.css('option[value="Thành phố Hà Nội"]')).click();

        // đợi cho quận được chọn
        console.log("Selecting district...");
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('district'))), 20000);
        await driver.findElement(By.name('district')).click();
        await driver.wait(until.elementLocated(By.css('option[value="Quận Hoàn Kiếm"]')), 20000);
        await driver.executeScript("arguments[0].scrollIntoView();", driver.findElement(By.css('option[value="Hoàn Kiếm"]')));
        await driver.findElement(By.css('option[value="Quận Hoàn Kiếm"]')).click();

        // đợi ward
        console.log("Selecting ward...");
        await driver.wait(until.elementIsVisible(driver.findElement(By.name('ward'))), 20000);
        await driver.findElement(By.name('ward')).click();
        await driver.wait(until.elementLocated(By.css('option[value="Lý Thái Tổ"]')), 20000);
        await driver.executeScript("arguments[0].scrollIntoView();", driver.findElement(By.css('option[value="Lý Thái Tổ"]')));
        await driver.findElement(By.css('option[value="Lý Thái Tổ"]')).click();

        await driver.findElement(By.name('address')).sendKeys('123 Test Street');
        await driver.findElement(By.name('password')).sendKeys('password123');
        await driver.findElement(By.name('confirmPassword')).sendKeys('password123');

        // Submit the registration form
        console.log("Submitting registration form...");
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for the success toast notification
        console.log("Waiting for success toast notification...");
        await driver.wait(until.elementLocated(By.css('.Toastify__toast--success')), 20000);

        console.log("Test successful: Registration functionality works correctly.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await driver.quit();
    }
})();