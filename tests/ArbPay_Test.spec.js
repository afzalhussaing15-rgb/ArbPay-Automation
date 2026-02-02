import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath:
      "C:\\Users\\afzal\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  });
  const page = await browser.newPage();

  // --- Human-like login flow: navigates to login, types credentials, verifies /#/home ---
  function rnd(min = 30, max = 120) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function humanType(page, locator, text) {
    await locator.click({ timeout: 2000 });
    await locator.focus();
    for (const ch of text) {
      await page.keyboard.type(ch);
      await page.waitForTimeout(rnd(40, 140));
    }
    await page.waitForTimeout(rnd(120, 350));
  }

  async function humanClick(page, locator) {
    const box = await locator.boundingBox();
    if (box) {
      const x = box.x + Math.random() * box.width;
      const y = box.y + Math.random() * box.height;
      await page.mouse.move(x, y, { steps: 6 });
    } else {
      await locator.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(rnd(80, 250));
    await locator.click();
    await page.waitForTimeout(rnd(300, 700));
  }

  // Navigate to login page and perform human-like login
  await page.goto("https://arbpay.me/#/login", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector('h2.sub:has-text("Account Login")', {
    timeout: 8000,
  });

  const phoneInput = page.locator(
    'input[placeholder="Please enter your phone number."]',
  );
  const passInput = page.locator(
    'input[placeholder="Please enter your login password."]',
  );
  const loginBtn = page.getByRole("button", { name: "Log In" });

  // Prefer environment variables for credentials
  const PHONE = process.env.PHONE || "9911105153";
  const PASSWORD = process.env.PASSWORD || "Afzal123";

  await humanType(page, phoneInput, PHONE);
  await page.waitForTimeout(rnd(200, 600));
  await humanType(page, passInput, PASSWORD);
  await page.waitForTimeout(rnd(400, 900));
  await humanClick(page, loginBtn);

  // Verify successful login by checking /#/home and post-login UI elements
  try {
    await page.waitForURL("**/#/home", { timeout: 10000 });
    await page.waitForSelector(
      'div.promptHeader:has-text("Special USDT Rate"), h5.title:has-text("Buy ARB")',
      { timeout: 10000 },
    );
    console.log("✅ Logged in: /#/home loaded and post-login element found");
  } catch (err) {
    console.error("❌ Login verification failed. Current URL:", page.url());
    // continue anyway to preserve original flow
  }

  // Close all visible prompts by clicking the close div
  console.log("Closing post-login prompts...");
  let closeCount = 0;
  while (closeCount < 5) {
    // Use CSS selector: div with both classes van-haptics-feedback AND close
    const closeBtn = page.locator("div.van-haptics-feedback.close").first();
    const count = await closeBtn.count().catch(() => 0);

    if (count === 0) {
      console.log(`No more close buttons found after ${closeCount} closes`);
      break;
    }

    try {
      console.log(`Clicking close button ${closeCount + 1}...`);
      await closeBtn.click();
      closeCount++;
      await page.waitForTimeout(rnd(500, 1000));
      console.log(`✓ Closed prompt ${closeCount}`);
    } catch (e) {
      console.log(`✗ Failed to close:`, e.message);
      break;
    }
  }
  console.log(`Closed ${closeCount} prompt(s) total`);

  // After login verification, wait a short, human-like pause and
  // click the in-page "Buy ARB" header if present. Fall back to direct navigation.
  await page.waitForTimeout(rnd(500, 1500));

  const buyH5 = page.locator('h5.title:has-text("Buy ARB")');
  if ((await buyH5.count()) > 0) {
    console.log('Clicking in-page "Buy ARB" element to reach buy page...');
    await humanClick(page, buyH5.first());
    await page.waitForTimeout(rnd(500, 1200));
  } else {
    console.log(
      'In-page "Buy ARB" not found — navigating to /#/buy/arb as fallback',
    );
    await page.goto("https://arbpay.me/#/buy/arb", {
      waitUntil: "domcontentloaded",
    });
  }

  // Set the target price range
  const MIN_PRICE = 700;
  const MAX_PRICE = 1000;

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

      // Buy if price is within the range
      if (priceNumber >= MIN_PRICE && priceNumber <= MAX_PRICE) {
        console.log(
          `₹${priceNumber} found in range — clicking Buy immediately...`,
        );

        // Click the buy button and verify it was clicked
        const clickResult = await row
          .evaluate((el) => {
            const buyButton = el.querySelector("button.van-button--primary");
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
            "❌ Payment page not found. Continuing to scan more listings...",
          );
          // Don't go back; continue to next item in the loop
          continue;
        }
      }
    }

    console.log(
      `No listings found in range ₹${MIN_PRICE}-₹${MAX_PRICE}, retrying...`,
    );
    await page.waitForTimeout(300);
  }
})();

//This is a branch test
