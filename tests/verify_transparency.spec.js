const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('thimbles should become transparent', async ({ page }) => {
    // Load the mockup
    const mockupPath = 'file://' + path.resolve(__dirname, '../mock_game.html');
    await page.goto(mockupPath);

    // Initial opacity should be 1 (default)
    const initialThimbles = page.locator('.thimbles-game__thimble');
    const firstOpacity = await initialThimbles.first().evaluate(el => getComputedStyle(el).opacity);
    expect(firstOpacity).toBe('1');

    // Inject the content script logic
    const contentScript = fs.readFileSync(path.resolve(__dirname, '../thimble_extension/content.js'), 'utf8');
    await page.addInitScript(contentScript);
    await page.evaluate(contentScript);

    // Verify opacity is now 0.5
    const transparentOpacity = await initialThimbles.first().evaluate(el => getComputedStyle(el).opacity);
    expect(transparentOpacity).toBe('0.5');

    // Add a new thimble and verify it also becomes transparent via MutationObserver
    await page.click('#add-thimble');
    const allThimbles = page.locator('.thimbles-game__thimble');
    expect(await allThimbles.count()).toBe(4);

    // Wait for the observer to catch the change
    await page.waitForTimeout(100);

    const lastOpacity = await allThimbles.last().evaluate(el => getComputedStyle(el).opacity);
    expect(lastOpacity).toBe('0.5');

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'thimbles_verification.png' });
});
