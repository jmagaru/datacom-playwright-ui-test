// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.demo.bnz.co.nz/client/');
});


test.describe('BNZ Demo UI Test', () => {
  test('Verify you can navigate to Payees page using the navigation menu', async ({ page }) => {
    await page.locator('button[class="Button Button--transparent js-main-menu-btn MenuButton"]').click();
    await page.locator('a[href="/client/payees"]').click();
    await expect(await page.url()).toContain('/client/payees');
    await expect(await page.locator('#YouMoney > div > div > div.Payees.js-payees > section > header > h1 > span').textContent()).toEqual("Payees");
  });

  test('Verify you can add new payee in the Payees page', async ({ page }) => {
    const testPayeeName = "TestPayee "+generateRandomCharacter(10);
    const accountNumber = "0100010000001001"
    await page.locator('button[class="Button Button--transparent js-main-menu-btn MenuButton"]').click();
    await page.locator('a[href="/client/payees"]').click();
    await page.locator('button[class="Button Button--sub Button--translucid js-add-payee"]').click();
    await page.focus('input[id="ComboboxInput-apm-name"]');
    await page.keyboard.type(testPayeeName);
    await page.keyboard.press('Enter');
    await page.focus('input[id="apm-bank"]');
    await page.keyboard.type(accountNumber);
    await page.keyboard.press('Enter');
    await page.locator('button[class="js-submit Button Button--primary"]').click();
    await expect(page.getByRole('paragraph').filter({ hasText: testPayeeName })).toHaveCount(1);
    await expect(page.locator('span.message:text("Payee added")')).toHaveCount(1);
  });

  test('Verify payee name is a required field', async ({ page }) => {
    const testPayeeName = "TestPayee "+generateRandomCharacter(10);
    const accountNumber = "0100010000001001"
    await page.locator('button[class="Button Button--transparent js-main-menu-btn MenuButton"]').click();
    await page.locator('a[href="/client/payees"]').click();
    await page.locator('button[class="Button Button--sub Button--translucid js-add-payee"]').click();
    await page.locator('button[class="js-submit Button Button--primary Button--disabled"]').click();
    await expect(page.locator('div[class="tooltip-panel general-tooltip js-tooltip-view"] > p:text("Payee Name is a required field. Please complete to continue.")')).toHaveCount(1);
    await page.focus('input[id="ComboboxInput-apm-name"]');
    await page.keyboard.type(testPayeeName);
    await page.keyboard.press('Enter');
    await page.focus('input[id="apm-bank"]');
    await page.keyboard.type(accountNumber);
    await page.keyboard.press('Enter');
    await expect(page.locator('div[class="tooltip-panel general-tooltip js-tooltip-view"] > p:text("Payee Name is a required field. Please complete to continue.")')).toHaveCount(0);
  });

  test('Verify that payees can be sorted by name', async ({ page }) => {
    await page.locator('button[class="Button Button--transparent js-main-menu-btn MenuButton"]').click();
    await page.locator('a[href="/client/payees"]').click();
    const accountsCount = await page.locator('span[class="js-payee-name"]').count();
    const accountNameList = []
    for (let i = 0; i < accountsCount; i++) {
      let accounts = await page.locator('span[class="js-payee-name"]').nth(i).textContent();
      accountNameList.push(accounts)
    }
    const accountSortedAscending = accountNameList.sort();
    for(let x in accountNameList){
        expect(accountNameList[x]).toEqual(accountSortedAscending[x]);
    }
    await page.getByRole('button', { name: 'Sort by payee name A to Z selected. Select again to reverse order.' }).click();
    const accountNameListDesc = []
    for (let i = 0; i < accountsCount; i++) {
      let accounts = await page.locator('span[class="js-payee-name"]').nth(i).textContent();
      accountNameListDesc.push(accounts)
    }
    const accountSortedDescending = accountNameList.reverse();
    for(let x in accountNameListDesc){
        expect(accountNameListDesc[x]).toEqual(accountSortedDescending[x]);
    }
  });

  test('Navigate to Payments page', async ({ page }) => {
    const everydayBalance = await page.locator('div[id="account-ACC-1"] > div[class="account-info"] > span[class="account-balance"]').textContent();
    const billsBalance = await page.locator('div[id="account-ACC-5"] > div[class="account-info"] > span[class="account-balance"]').textContent();
    
    console.log(everydayBalance);
    console.log(billsBalance);
    
    await page.locator('button[class="Button Button--transparent js-main-menu-btn MenuButton"]').click();
    await page.getByRole('button', { name: 'Pay or transfer' }).click();
    await page.getByTestId('from-account-chooser').click();
    await page.locator('//p[text()="Everyday"]').click();
    await page.getByTestId('to-account-chooser').click();
    await page.getByTestId('to-account-accounts-tab').click();
    await page.locator('//p[text()="Bills "]').click();
    await page.getByPlaceholder('0.00').focus();
    await page.keyboard.type('500.00');
    const everyDayNewBalance = everydayBalance==null?0:parseFloat(everydayBalance.replace(/,/g, ''))-500;
    const billsNewBalance = billsBalance==null?0:parseFloat(billsBalance.replace(/,/g, ''))+500;

    console.log(everyDayNewBalance)
    console.log(billsNewBalance)

    await page.getByRole('button', { name: 'Transfer' }).first().click();

    //const everdayBalancePosted = 
    //const everydayBalance = await page.locator('div[id="account-ACC-1"] > div[class="account-info"] > span[class="account-balance"]').textContent();
    //const billsBalance = await page.locator('div[id="account-ACC-5"] > div[class="account-info"] > span[class="account-balance"]').textContent();
    //await expect(await page.locator('div[id="account-ACC-1"] > div[class="account-info"] > span[class="account-balance"]').textContent()).toEqual()

  });

});



// Navigate to Payments page
const generateRandomCharacter = (length=8)=>{
    return Math.random().toString(16).substr(2, length);
}


