const { test, expect } = require('./fixtures/evinced');

const user = {
  name: 'Test User',
  email: 'test.user@example.com',
  phone: '0501234567',
};

test('consultation booking flow validates, fills and confirms', async ({ page }) => {
  await page.goto('/');
  await page.locator('#open-modal').click();

  const modal = page.locator('#consultation-modal');
  await expect(modal).toBeVisible();

  // Next carries aria-disabled="true" permanently yet is fully operable (an a11y defect).
  // Playwright honours aria-disabled, so the click must be forced.
  const nextToStep2 = modal.locator('#next-to-step-2');
  await expect(nextToStep2).toHaveAttribute('aria-disabled', 'true');

  // Step 1: submit empty, expect validation errors on all three fields.
  await nextToStep2.click({ force: true });
  await expect(modal.locator('#name-error')).toBeVisible();
  await expect(modal.locator('#name-error')).toHaveText('Full Name is required.');
  await expect(modal.locator('#email-error')).toHaveText('Please enter a valid email address.');
  await expect(modal.locator('#phone-error')).toHaveText('Please enter a valid phone number.');
  await expect(modal.locator('#full_name')).toHaveClass(/\berror\b/);

  // Step 1: fill valid data and advance.
  await modal.locator('#full_name').fill(user.name);
  await modal.locator('#email').fill(user.email);
  await modal.locator('#phone').fill(user.phone);
  await expect(nextToStep2).toHaveAttribute('aria-disabled', 'true');
  await nextToStep2.click({ force: true });
  await expect(modal.locator('#step-2')).toBeVisible();

  // Step 2: Next is disabled until a date and a time are chosen. Time slots are randomised
  // every time the step opens, so the chosen value is read back instead of hardcoded.
  const nextToReview = modal.locator('#next-to-step-3');
  await expect(nextToReview).toBeDisabled();
  await modal.locator('label[for="date-label-0"]').click();
  await modal.locator('label[for="time-label-0"]').click();
  await expect(modal.locator('#date-label-0')).toBeChecked();
  await expect(modal.locator('#time-label-0')).toBeChecked();
  const chosenTime = await modal.locator('#time-label-0').inputValue();
  await expect(nextToReview).toBeEnabled();
  await nextToReview.click();

  // Step 3: review shows what was entered.
  await expect(modal.locator('#step-3')).toBeVisible();
  await expect(modal.locator('#review-name')).toHaveText(user.name);
  await expect(modal.locator('#review-email')).toHaveText(user.email);
  await expect(modal.locator('#review-phone')).toHaveText(user.phone);
  await expect(modal.locator('#review-datetime')).toContainText(chosenTime);
  await modal.locator('#confirm-step').click();

  // Step 4: confirmation.
  await expect(modal.locator('#step-4')).toBeVisible();
  await expect(modal.locator('#step-4')).toContainText('Thank you for booking!');
});
