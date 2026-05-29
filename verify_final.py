import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        file_path = "file://" + os.path.abspath("index.html")
        await page.goto(file_path)

        # Verify Services items
        await page.click("button.filter-btn:has-text('Services')")
        await asyncio.sleep(0.5)
        cards = await page.query_selector_all(".card")
        print(f"Number of Service articles: {len(cards)}")
        assert len(cards) == 4

        # Check for TikTok item and "COMMANDER" button
        tiktok_card = await page.query_selector(".card:has-text('TikTok')")
        assert tiktok_card is not None
        await tiktok_card.click()
        await asyncio.sleep(0.5)

        commander_btn = await page.query_selector("a.cta-button:has-text('COMMANDER')")
        print(f"Commander button found: {commander_btn is not None}")
        assert commander_btn is not None

        href = await commander_btn.get_attribute("href")
        print(f"Commander href: {href}")
        assert "wa.me/2290198905311" in href

        # Check price
        price = await page.text_content(".price-tag")
        print(f"Price: {price}")
        assert "3500 FCFA" in price

        await page.screenshot(path="final_article_detail.png")

        # Verify IA is empty
        await page.click(".back-btn")
        await page.click("button.filter-btn:has-text('IA')")
        await asyncio.sleep(0.5)
        empty_msg = await page.text_content("#article-grid")
        print(f"IA content: {empty_msg.strip()}")
        assert "AUCUN CONTENU DISPONIBLE" in empty_msg

        await page.screenshot(path="final_desktop_ia.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
