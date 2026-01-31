import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath:
      "C:\\Users\\afzal\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  });
  const page = await browser.newPage();

  await page.goto("https://arbpay.me/#/buy/arb", {
    waitUntil: "domcontentloaded",
  });

  const TARGET_PRICE = 1000;

  while (true) {
    console.log("Clicking Default...");

    // 1. Click "Default" with retry logic
    try {
      await page.getByText("Default", { exact: true }).click({ timeout: 1000 });
    } catch (err) {
      console.log("⚠️ Could not find Default button, waiting and retrying...");
      await page.waitForTimeout(500);
      continue;
    }

    // 2. Wait for listings to load
    await page.waitForSelector(".item", { timeout: 2000 });

    console.log("Scanning all listings (visible and hidden)...");

    const rows = await page.$$(".item");

    for (const row of rows) {
      // Extract price text from .amount div
      const priceText = await row
        .evaluate((el) => {
          const amountDiv = el.querySelector(".amount");
          return amountDiv ? amountDiv.innerText : null;
        })
        .catch(() => null);

      if (!priceText) continue;

      const priceNumber = Number(
        priceText.replace("₹", "").replace(/,/g, "").trim(),
      );

      // Match only ₹1000
      if (priceNumber === TARGET_PRICE) {
        console.log("₹1000 found — clicking Buy immediately...");

        // Click the buy button and verify it was clicked
        const clickResult = await row
          .evaluate((el) => {
            const buyButton = el.querySelector("button.van-button--primary");
            console.log("Button found:", !!buyButton);
            if (buyButton) {
              buyButton.click();
              return true;
            }
            return false;
          })
          .catch((err) => {
            console.log("Error clicking button:", err);
            return false;
          });

        console.log("Click result:", clickResult);

        // Wait longer for page to navigate
        await page.waitForTimeout(1500);

        // Check for payment account page
        const paymentAccountText = await page
          .evaluate(() => {
            const divs = document.querySelectorAll("div");
            for (const div of divs) {
              if (div.innerText.includes("Please select payment account")) {
                return true;
              }
            }
            return false;
          })
          .catch(() => false);

        if (paymentAccountText) {
          console.log(
            "✅ Payment account selection page found! Script stopping.",
          );
          return;
        } else {
          console.log(
            "❌ Payment page not found. Going back to search for more ₹1000 items...",
          );
          await page.goBack();
          await page.waitForTimeout(500);
          break; // Break inner loop, continue outer loop
        }
      }
    }

    console.log("₹1000 not found, retrying...");
    await page.waitForTimeout(300);
  }
})();

//This is a branch test
