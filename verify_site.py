import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Open the file
        file_path = "file://" + os.path.abspath("index.html")
        await page.goto(file_path)

        # Check title
        title = await page.title()
        print(f"Title: {title}")

        # Verify articles are rendered
        cards = await page.query_selector_all(".card")
        print(f"Number of articles: {len(cards)}")

        # Test Filter: IA
        await page.click("button.filter-btn:has-text('IA')")
        await asyncio.sleep(0.5)
        cards = await page.query_selector_all(".card")
        print(f"Articles after IA filter: {len(cards)}")

        # Test Search
        await page.fill("#search-input", "ChatGPT")
        await asyncio.sleep(0.5)
        cards = await page.query_selector_all(".card")
        print(f"Articles after search 'ChatGPT': {len(cards)}")

        # Test Article Detail
        await page.click(".card:has-text('ChatGPT')")
        await asyncio.sleep(0.5)
        is_visible = await page.is_visible("#detail-page")
        print(f"Detail page visible: {is_visible}")

        # Test Back button
        await page.click(".back-link")
        await asyncio.sleep(0.5)
        is_visible = await page.is_visible("#home-page")
        print(f"Home page visible after back: {is_visible}")

        # Test Mobile Menu
        await page.set_viewport_size({'width': 375, 'height': 667})
        await page.click("#burger-btn")
        await asyncio.sleep(0.5)
        # Check if mobile-nav has class open or is visible
        is_open = await page.eval_on_selector("#mobile-nav", "el => el.classList.contains('open')")
        print(f"Mobile menu open: {is_open}")

        # Take a screenshot
        await page.screenshot(path="verification_desktop.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
